$(document).ready(function(){
	swMgmt.getSwitchInfo();
	Promise.all([swMgmt.allInfoAjax]).then(function() {
		swMgmt.getDetail();

		$('select[name="switchCategory"]').change(function() {
			swMgmt.setSelectOption();
		});
	});

	
	// 그리드 좌우 스크롤 처리
	$('.gridWrap').eq(1).on('scroll', function(e) {
		$('.gridWrap').eq(0).scrollLeft($(this).scrollLeft());
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
			url: '/pss/management/switch/getSwitchDescDetail',
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
					trHtml.push('		<div class="switchSettingWrap2">');
					trHtml.push('			<ul class="switchSetting2">');
					// 포트 정렬 (0:virtical, 1:horizon) li css가 기본적으로 지그재그로 되어 있음
					if(o.SORT_FLAG === 0) {
						$.each(o.PORT_LIST, function(switchIdx, v) {
							var key = o.CATEGORY + '_' + o.SHELF + '_' + o.SLOT + '_' + o.ID;
							var portIndex = (switchIdx + 1) < 10 ? '0' + (switchIdx + 1) : (switchIdx + 1).toString();
							
							trHtml.push('			<li>');
							trHtml.push('				<dl>');
							trHtml.push('					<dt>' + o.PORT_NAME_LIST[switchIdx] + '</dt>');
							trHtml.push('					<dd>');
							trHtml.push('						<div class="port" style="white-space:normal;" contenteditable="true" data-key="' + key + '_' + portIndex + '">' + v + '</div>');
							trHtml.push('						<div class="hiddenport" data-key="' + key + '_' + portIndex + '" style="display:none;">' + v + '</div>');
							trHtml.push('					</dd>');
							trHtml.push('				</dl>');
							trHtml.push('			</li>');
						});
					} else {
						var halfSize = o.SIZE / 2;
						for(var j = 0; j < halfSize; j++) {
							var key = o.CATEGORY + '_' + o.SHELF + '_' + o.SLOT + '_' + o.ID;
							var portIndex = (j + 1) < 10 ? '0' + (j + 1) : '' + (j + 1);
							trHtml.push('			<li>');
							trHtml.push('				<dl>');
							trHtml.push('					<dt>' + o.PORT_NAME_LIST[j] + '</dt>');
							trHtml.push('					<dd>');
							trHtml.push('						<div class="port" style="white-space:normal;" contenteditable="true" data-key="' + key + '_' + portIndex + '">' + o.PORT_LIST[j] + '</div>');
							trHtml.push('						<div class="hiddenport" data-key="' + key + '_' + portIndex + '" style="display:none;">' + o.PORT_LIST[j] + '</div>');
							trHtml.push('					</dd>');
							trHtml.push('				</dl>');
							trHtml.push('			</li>');
							
							portIndex = (j + halfSize + 1) < 10 ? '0' + (j + halfSize + 1) : '' + (j + halfSize + 1);
							trHtml.push('			<li>');
							trHtml.push('				<dl>');
							trHtml.push('					<dt>' + o.PORT_NAME_LIST[j + halfSize] + '</dt>');
							trHtml.push('					<dd>');
							trHtml.push('						<div class="port" style="white-space:normal;" contenteditable="true" data-key="' + key + '_' + portIndex + '">' + o.PORT_LIST[j + halfSize] + '</div>');
							trHtml.push('						<div class="hiddenport" data-key="' + key + '_' + portIndex + '" style="display:none;">' + o.PORT_LIST[j + halfSize] + '</div>');
							trHtml.push('					</dd>');
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
//	changeItem : function(obj) {
//		if(swMgmt.changeItemKeys.indexOf($(obj).data('key')) == -1) {
//			swMgmt.changeItemKeys.push($(obj).data('key'));
//		}
//	},
//	changeItemKeys : [],
	changeItems : [],
	saveChangePort : function () {
//		var itemKeys = swMgmt.changeItemKeys;
//		swMgmt.changeItemKeys = [];
		swMgmt.changeItems = [];
		var _ports = $('#switchPort div.port');
		var _hiddenPorts = $('#switchPort div.hiddenport');
		
		$(_ports).each(function(idx, val) {
			
			if($(val).text() != $(_hiddenPorts[idx]).text()) {
//				if(swMgmt.changeItemKeys.indexOf($(obj).data('key')) == -1)
//					swMgmt.changeItemKeys.push($(val).data('key'));
				swMgmt.changeItems.push($(val).data('key')+"_"+$(val).text());
			}
		});
		
		if(swMgmt.changeItems.length <= 0) {
			alert("변경된 정보가 없습니다.");
			return false;
		}
		
		$.ajax({
			type : 'post',
			url: '/pss/management/switch/switchDescSave',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(swMgmt.changeItems),
			success: function (data) {
				var result = data.switchDescSaveResult
				if(result == 0) {
					alert("스위치 연결정보 수정 실패");
				}else {
					alert("스위치 연결정보 수정 성공");
					swMgmt.getDetail();
				}
			},
			error : function() {
				
			}
		});
	},
	getReplaceValue: function (value) {
		var rValue = value;
		if(value == '1'){
			rValue = 'up';
		}else if (value == '2'){
			rValue = 'down';
		}else{
			rValue = 'etc('+value+')';
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
