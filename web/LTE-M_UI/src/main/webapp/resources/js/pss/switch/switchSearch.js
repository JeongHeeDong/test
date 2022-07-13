$(document).ready(function(){
	swMgmt.getSwitchInfo();
	Promise.all([swMgmt.allInfoAjax]).then(function() {
		swMgmt.getDetail();

		$('select[name="switchCategory"]').change(function() {
			swMgmt.setSelectOption();
		});
	});

	$('#helpSetClose, #helpSetCancle,#helpSetBg').on('click',function(e){
		$('#helpSetBg').fadeOut();
		$('#helpSetUp').fadeOut();
	});
	//helpSet Drag 지정 정의
	var $helpSetUp = $( "#helpSetUp" );
	$helpSetUp.draggable({'handle' : '#helpSetTitleBox'});
	$helpSetUp.resizable({
		animate: true
	});
});

var swMgmt = {
	allInfoAjax: {},
	switchList: {},
	lineList: {},
	info: {},
	lineInfoDict: {},

	setParams: function () {
		swMgmt.getDetail($('select[name="switchCategory"]').val(), $('select[name="switchName"]').val(), $('select[name="lineId"]').val());
	},

	setSelectOption: function () {
		var
			sn = $('select[name="switchName"]'),
			sc = $('select[name="switchCategory"]'),
			scVal = "",
			snOpt = "<option value='ALL'>전체</option>";

		scVal = sc.val();
		swMgmt.switchList.forEach(function (v, i) {
			if(scVal === "ALL") {
				snOpt += "<option value='" + v.SYSTEM_ID + "'>" + v.SYSTEM_NAME + "</option>"
			} else if(scVal === v.CATEGORY) {
				snOpt += "<option value='" + v.SYSTEM_ID + "'>" + v.SYSTEM_NAME + "</option>"
			}
		});
		sn.empty();
		sn.append(snOpt);
	},
	
	setLineSelect: function () {
		var lineSelect = $('select[name="lineId"]');
		var lineSelectOpt = "<option value=''>전체</option>";
		swMgmt.lineList.forEach(function (v, i) {
			lineSelectOpt += "<option value='" + v.LINE_ID + "'>" + v.LINE_NAME + "</option>"
		});
		lineSelect.empty();
		lineSelect.append(lineSelectOpt);
		
		// 노선ID: 노선명
		swMgmt.lineList.forEach(function (lineinfo, idx) {
			swMgmt.lineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
			srcIdx = idx
			for(var idx;idx<swMgmt.lineList.length;idx++) {
				if (swMgmt.lineList[idx+1] != undefined){
					var lines = swMgmt.lineList[srcIdx].LINE_ID +','+ swMgmt.lineList[idx+1].LINE_ID
					var lensNm = swMgmt.lineList[srcIdx].LINE_NAME +','+ swMgmt.lineList[idx+1].LINE_NAME
					swMgmt.lineInfoDict[lines] = lensNm;
				}
			}
		})
	},

	getSwitchInfo: function () {
		swMgmt.allInfoAjax = $.ajax({
			type: 'post',
			url: '/pss/management/switch/getSearchOption',
			contentType: 'application/json',
			dataType: 'json',
			success: function (data) {
				swMgmt.switchList = data.searchOption.SWITCHLIST;
				swMgmt.lineList = data.searchOption.LINELIST;
				swMgmt.setLineSelect();
				swMgmt.setSelectOption();
			},
			error: function () {

			}
		});
	},

	setSwitchName: function (category) {
		$(swMgmt).each(function (i, v) {
			if(v.CATEGORY === category) {
				s.append('<option value="' + v.SYSTEM_ID + '">' + v.SYSTEM_NAME + '</option>');
			}
		});
	},

	getDetail: function (category, name, lineId) {

		var params = {
			'name': '',
			'category': '',
			'lineId': ''
		};

		params.category = category || '';
		params.name = name || '';
		params.lineId = lineId || '';

		$.ajax({
			type : 'post',
			url: '/pss/management/switch/getSwitchDetail',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params),
			success: function (data) {
				swMgmt.info = data.switchData;
				
				var $switches = $('#switchPort');
				$switches.empty();
				
				var tempName = '';
				var styleIdx = 0;
				$.each(swMgmt.info, function(i, o) {
					// 같은 스위치 끼리 배경 색깔 맞춤
					var tdStyle = '';
					if(tempName === '') tempName = o.NAME;
					if(tempName !== o.NAME) {
						styleIdx++;
						tempName = o.NAME
					}
//					if(styleIdx % 2 === 1) {
//						tdStyle = ' style="background-color:#d9d8cd;"';
//					}
					
					var LINE_NAME = '-';
					LINE_NAME = swMgmt.getLineName(o.LINE_ID)
					var $tr = $('<tr />');
					var trHtml = [];
					trHtml.push('<td align="center"' + tdStyle + '>' + LINE_NAME + '</td>');
					trHtml.push('<td align="center"' + tdStyle + '>' + o.CATEGORY + '</td>');
					trHtml.push('<td align="center"' + tdStyle + '>' + o.NAME + '</td>');
					trHtml.push('<td align="center"' + tdStyle + '>' + o.SLOT + '</td>');
					trHtml.push('<td align="center"' + tdStyle + '>' + o.SHELF + '</td>');
					trHtml.push('<td' + tdStyle + '>');
					trHtml.push('	<div class="switchPorts">');
					trHtml.push('		<div class="switchSettingWrap">');
					trHtml.push('			<ul class="switchSetting">');
					// 포트 정렬 (0:virtical, 1:horizon) li css가 기본적으로 지그재그로 되어 있음
					if(o.SORT_FLAG === 0) {
						$.each(o.PORT_LIST, function(switchIdx, v) {
							portValue = swMgmt.getPortValue(v)
							trHtml.push('			<li>');
							trHtml.push('				<dl>');
							trHtml.push('					<dt>' + o.PORT_NAME_LIST[switchIdx] + '</dt>');
							trHtml.push('					<dd><span class="port">' + portValue + '</span></dd></li>');
							trHtml.push('				</dl>');
							trHtml.push('			</li>');
						});
					} else {
						var halfSize = o.SIZE / 2;
						for(var j = 0; j < halfSize; j++) {
							portValue = swMgmt.getPortValue(o.PORT_LIST[j])
							trHtml.push('			<li>');
							trHtml.push('				<dl>');
							trHtml.push('					<dt>' + o.PORT_NAME_LIST[j] + '</dt>');
							trHtml.push('					<dd><span class="port">' + portValue + '</span></dd></li>');
							trHtml.push('				</dl>');
							trHtml.push('			</li>');
							
							portValue = swMgmt.getPortValue(o.PORT_LIST[j + halfSize])
							trHtml.push('			<li>');
							trHtml.push('				<dl>');
							trHtml.push('					<dt>' + o.PORT_NAME_LIST[j + halfSize] + '</dt>');
							trHtml.push('					<dd><span class="port">' + portValue + '</span></dd></li>');
							trHtml.push('				</dl>');
							trHtml.push('			</li>');	
						}
					}
					trHtml.push('			</ul>');
					trHtml.push('		</div>');
					trHtml.push('	</div>');
					trHtml.push('</td>');
					
					$tr.append(trHtml.join(''));
					$switches.append($tr);
				});
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	viewHelp: function () {
		var $helpSetUp = $('#helpSetUp');
		$('#helpSetBg').show().fadeIn('fast');
		$helpSetUp.show().fadeIn('fast');

		var height = ($(window).height() - $helpSetUp.height()-50)/2;
		var width = ($(window).width() - $helpSetUp.width())/2;

		$helpSetUp.css('left',width+'px');
		$helpSetUp.css('top',height+'px');
	},

	switchModify: function () {
		var
			swLen = swMgmt.info.length,
			swPorts = [],
			portArr = [],
			portFlag = true,
			param = [],
			swIdx = 0;
		for(var i = 0; i < swLen; i += 1) {
			swPorts = document.querySelectorAll('#switchPort tr:nth-child(' + (i + 1) +') .port');
			var
				swInfo = swMgmt.info[i][0],
				portInfo = swMgmt.info[i][1];

			portArr = [];
			$(swPorts).each(function (portIdx, portVal) {
				if(portVal.checked) {
					portArr.push('Y');
				} else {
					portArr.push('N');
				}
			});

			for(var idx = 0; idx < swPorts.length; idx += 1) {
				if(portArr[idx] !== portInfo[idx]) {
					param[swIdx] = {'switchId': swInfo.ID, 'portArr': portArr, 'size': swInfo.SIZE, 'slot': swInfo.SLOT};
					swIdx += 1;
					break;
				}
			}
		}

		if(param.length !== 0) {
			$.ajax({
				type: 'post',
				url: '/pss/management/switch/switchModify',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(param),
				success: function (data) {
					if(data.switchModifyResult >= 1) {
						alert('설정이 변경되었습니다.');
						swMgmt.getDetail();
					} else {
						alert('변경이 실패하였습니다.');
					}
				},
				error: function () {
					//alert('에러발생');
				}
			});
		}
	},
	getPortValue: function (value) {
		var rValue = value;
		if(value == '1'){
			rValue = 'up';
		}else if (value == '2'){
			rValue = 'down';
		}else if (value != ''){
			rValue = 'etc('+value+')';
		}else{
			rValue = '-';
		}
		return rValue
	},
	getLineName: function (value){
		var LINE_NAME =  '';
		if(value != undefined){
			if(value.includes(',')){
				lineList = value.split(',');
				lineNameList = []
				$.each(lineList, function(i, line) {
					if(line in swMgmt.lineInfoDict){
						lineNameList.push(swMgmt.lineInfoDict[line]);
					}else{
						lineNameList.push(line);
					}
				})
				LINE_NAME = lineNameList.splice(',');
			}else{
				if(value in swMgmt.lineInfoDict){
					LINE_NAME = swMgmt.lineInfoDict[value];
				}else{
					LINE_NAME = value;
				}
			}
		}
		return LINE_NAME;
	}

	
};
