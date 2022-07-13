$(document).ready(function () {
	$(window).click(function (e) {
		if ($('#contextMenu-DU').css('display') === 'block') {
			$('#contextMenu-DU').css('display', 'none');
		}

		if ($('#contextMenu-EPC').css('display') === 'block') {
			$('#contextMenu-EPC').css('display', 'none');
		}
	});
});

var fm = {
	basicInfoAjax: {},
	nodeSlotInfoData: {},
	rightMenu: {
		alarmCode: '',
		systemId: '',
		eventTime : '',
		location: '',
		equipName: '',
		equipType: '',
		page: '',
		alarm: '',
		title: '',
		failureLocation: function (event, obj, page) {
			var
				equipType = fm.setEquipNameToEquipType($(obj).find('td:nth-child(4)').text()),
				$contextMenuDU = $('#contextMenu-DU'),
				$contextMenuEPC = $('#contextMenu-EPC'),
				location = '',
				loc = '',
				pos = '',
				params = {};

			$contextMenuDU.css("display", "none");
			$contextMenuEPC.css("display", "none");

			if(equipType === 2) {
				if(event.button == 2){
					fm.rightMenu.page = page;
					location = $(obj).find('td:nth-child(8)').text(); //발생위치

					var
						systemId = "",
						equipName = $(obj).find('td:nth-child(5)').text(),
						systemIdRegEx = /[\D]+(\d+)/g;

					if(systemIdRegEx.test(equipName)) {
						if(RegExp.$1 === "1") {
							systemId = "101"
						} else if(RegExp.$1 === "2") {
							systemId = "102"
						} else {
							systemId = RegExp.$1;
						}
					}

					params = {"equipType": equipType, "systemId": systemId};

					var
						slotNum = [4, 4, 4, 4],
						slotAlarm = ['normal', 'normal', 'blank', 'blank'];

					//Todo: 발생위치가 없는 경우 우클릭 후 실장도 팝업을 어떻게 할 것인가?
					var
						regEx = /RACK[\w\W]+SLOT\[(\d+)\]/g,
						sn = "";

					if(regEx.test(location)) {
						sn = RegExp.$1;

						fm.setBasicLocation(params);

						Promise.all([fm.basicInfoAjax]).then(function() {
							fm.duFailureLocationSetHtml(fm.nodeSlotInfoData);
							slotAlarm[Number(sn)] = fm.rightMenu.alarmState($(obj).find('input[name="alarmLevel"]').val());
							fm.rightMenu.alarm = slotAlarm;
							fm.rightMenu.location = slotNum;
							pos = fm.rightMenu.abspos(event);
							$contextMenuDU.css('left',(pos.x+10)+'px');
							$contextMenuDU.css('top',(pos.y-45)+'px');
							$contextMenuDU.css('display','block');
						});
					}

					fm.rightMenu.title = $(obj).find('td:nth-child(5)').text(); //장비명
				}
			} else if(equipType === 1 || equipType === 4 || equipType === 7) {
				if(event.button == 2) {
					fm.rightMenu.page = page;
					fm.rightMenu.equipName = equipName;
					fm.rightMenu.equipType = equipType;
					fm.rightMenu.title = $(obj).find('td:nth-child(5)').text(); //장비명
					fm.rightMenu.location = $(obj).find('td:nth-child(8)').text();
					fm.rightMenu.alarm = fm.rightMenu.alarmState($(obj).find('input[name="alarmLevel"]').val());

					params = {"equipType": equipType, "systemId": ""};

					fm.setBasicLocation(params);

					Promise.all([fm.basicInfoAjax]).then(function() {
						fm.setNodeInfoData(fm.nodeSlotInfoData, equipType);
						pos = fm.rightMenu.abspos(event);
						$contextMenuEPC.css('left', (pos.x + 10) + 'px');
						$contextMenuEPC.css('top', (pos.y - 45) + 'px');
						$contextMenuEPC.css('display', 'block');
					});
				}
			}
		},
		abspos: function (e){
			this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
			this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
			return this;
		},
		alarmState: function (level) {
			return {
				1 : "critical",
				2 : "major",
				3 : "minor",
				4 : "normal",
				5 : "normal"
			}[level];
		}
	},

	setEquipNameToEquipType: function (equipName) {
		return {
			"DU": 2,
			"MME": 1,
			"GW": 4,
			"PCRF": 7
		}[equipName]
	},

	levels: function (level) {
		return {
			1: "critical",
			2: "major",
			3: "minor",
			4: "normal",
			5: "blank"
		}[level];
	},

	setBasicLocation: function (params) {
		fm.basicInfoAjax = $.ajax({
			type: 'post',
			url: '/integration/monitor/network/failureLocation',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params),
			success: function (data) {
				fm.nodeSlotInfoData = data;
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	setNodeInfoData: function (data, equipType) {
		var
			nodeType = data.failureLocation[0],
			nodeStateVm0 = data.failureLocation[1],
			nodeStateVm1 = data.failureLocation[2],
			key = [],
			value = [],
			firstClassName = '',
			fullClassName = '';

		if(equipType === 1) {
			firstClassName = '.reba';
		} else if(equipType === 4 || equipType === 5) {
			firstClassName = '.ruba';
		} else if(equipType === 7) {
			firstClassName = '.reba';
		}

		var idx = 0;
		while(idx < 2) {
			nodeType.map(function (v, i) {
				fullClassName = firstClassName + idx + " ." + v;
				key.push(fullClassName);
				value.push(v + " " + fm.levels(idx === 0 ? nodeStateVm0[i] : nodeStateVm1[i]));
			});
			idx += 1;
		}
		fm.epcFailureLocationSetHtml(equipType, key, value);
	},

	duFailureLocationSetHtml: function (data) {
		var
			defaultSlotInfo = data.failureLocation[0],
			slotInfo = '';

		if(data.failureLocation.length > 1) {
			slotInfo = data.failureLocation[1];
		}

		var slot = document.querySelectorAll(".duSwitch > li");
		//4번째 요소는 board. 노말로 초기화
		["blank", "blank", "blank", "normal"].map(function (v, i) {
			slot[i].className = v;
		});

		var elIdx = 0;
		defaultSlotInfo.map(function (v, i) {
			elIdx = 3 - Number(v["SLOT_ID"]);
			//슬롯 1번은 아래에서 두번째, 2번은 아래에서 세번째이다.
			slot[elIdx].className = "normal"
		});

	},

	setDUFailureLocation: function (alarm, page) {
		var slot = document.querySelectorAll('.duSwitch > li');

		alarm.map(function (v, i) {
			slot[3 - Number(i)].className = v;
		});

		fm.popDUFailureLocation(page);
	},

	popDUFailureLocation: function (page) {
		var divDUView = $('#divDUView');
		divDUView.find('.title').text(fm.rightMenu.title);

		if(fm.rightMenu.page === 'failureMain') {
			divDUView.draggable({'handle' : '.dragHandle'});
			var height = (screen.height - divDUView.height()-100)/2;
			var width = (screen.width - divDUView.width())/2;
			$("#divDUBackground").show();
			divDUView.css({'top': height+'px', 'left':width+'px'});
			divDUView.show();

		} else if(fm.rightMenu.page === 'networkTopology' || page === 'networkTopology') {
			nwtDetail.showLayer("divDUView");
		}
	},

	epcFailureLocationSetHtml: function (equipType, key, value) {
		var
			reba = $(".reba"),
			ruba = $(".ruba"),
			mmeHtml = "",
			gwHtml = "",
			pcrfHtml = "",
			mmeSlot = ['VOMA', 'VIPA', 'VECA', 'VIDA'],
			gwSlot = ['VOMA', 'VIPA', 'VIDA', 'VEPA'],
			pcrfSlot = ['VOMA', 'VISA', 'VIDA'];

		reba.empty();
		ruba.empty();

		if(equipType === 1) {
			mmeHtml = '<ul class="reba slot_4">';
			mmeSlot.map(function (v) {
				mmeHtml += '<li class="normal ' + v.toLowerCase() + '"><span>' + v + '</span></li>'
			});
			mmeHtml += '</ul>';

			ruba.append("<span>RUBA</span>");
			reba.append(mmeHtml);

		} else if(equipType === 4 || equipType === 5) {
			gwHtml = '<ul class="ruba slot_4">';
			gwSlot.map(function (v) {
				gwHtml += '<li class="normal ' + v.toLowerCase() + '"><span>' + v + '</span></li>'
			});
			gwHtml += '</ul>';

			reba.append("<span>REBA</span>");
			ruba.append(gwHtml);

		} else if(equipType === 7) {
			pcrfHtml = '<ul class="reba slot_3">';
			pcrfSlot.map(function (v) {
				pcrfHtml += '<li class="normal ' + v.toLowerCase() + '"><span>' + v + '</span></li>'
			});
			pcrfHtml += '</ul>';

			ruba.append("<span>RUBA</span>");
			reba.append(pcrfHtml);
		}
		key.map(function (v, i) {
			document.querySelector(v).className = value[i];
		});
	},

	epcFailureLocation: function () {
		var
			location = fm.rightMenu.location,
			regEx = "",
			fullClsName = "",
			nodeNum = "",
			firstClsName = "",
			equipArr = [],
			slotLocArr = [],
			alarmObj = {},
			vmLoc = "",
			mmeSlot = ['VOMA', 'VIPA', 'VECA', 'VIDA'],
			gwSlot = ['VOMA', 'VIPA', 'VIDA', 'VEPA'],
			pcrfSlot = ['VOMA', 'VISA', 'VIDA'];

		switch(fm.rightMenu.equipType) {
			case 1:
				equipArr = mmeSlot;
				firstClsName = ".reba";
				break;
			case 4:
				equipArr = gwSlot;
				firstClsName = ".ruba";
				break;
			case 7:
				equipArr = pcrfSlot;
				firstClsName = ".reba";
				break;
		}

		equipArr.map(function (v, i) {
			regEx = v + '(\\d*)';
			var idx = 0;
			if(new RegExp(regEx, 'g').test(location)) {
				vmLoc = v.toLowerCase();
				var slotIdx = RegExp.$1;
				if(slotIdx !== "") {
					nodeNum = slotIdx;
					fullClsName = firstClsName + nodeNum + " ." + vmLoc;
					slotLocArr.push(fullClsName);
					alarmObj[fullClsName] = vmLoc + " " + fm.rightMenu.alarm;
				} else {
					while(idx < 2) {
						fullClsName = firstClsName + idx + " ." + vmLoc;
						slotLocArr.push(fullClsName);
						alarmObj[fullClsName] = vmLoc + " " + fm.rightMenu.alarm;
						idx += 1;
					}
				}
			} else if(new RegExp('ALL\\sNODE', 'g').test(location)) {
				while(idx < 2) {
					fullClsName = firstClsName + idx + " ." + v.toLowerCase();
					slotLocArr.push(fullClsName);
					alarmObj[fullClsName] = vmLoc + " " + fm.rightMenu.alarm;
					idx += 1;
				}
			}
		});
		fm.setEPCFailureLocation(slotLocArr, alarmObj);
	},

	setEPCFailureLocation: function (key, alarm, page) {
		key.map(function (v, i) {
			document.querySelector(v).className = alarm[v];
		});

		fm.popEPCFailureLocation(page);
	},

	popEPCFailureLocation: function (page) {
		var divEPCView = $('#divEPCView');
		divEPCView.find('.title').text(fm.rightMenu.title);

		if(fm.rightMenu.page === 'failureMain') {
			divEPCView.draggable({'handle' : '.dragHandle'});
			var height = (screen.height - divEPCView.height()-100)/2;
			var width = (screen.width - divEPCView.width())/2;
			$("#divEPCBackground").show();
			divEPCView.css({'top': height+'px', 'left':width+'px'});
			divEPCView.show();

		} else if(fm.rightMenu.page === 'networkTopology' || page === 'networkTopology') {
			nwtDetail.showLayer("divEPCView");
		}
	}
};