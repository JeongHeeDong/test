// web socket 관련 변수
var remind = '';
var ws;
var ws_put;
var lineIdFailureMain;
var lineIdFailureMainBoolean = true;

//역사정보 맵핑 정보
var duStationInfo, switchStationInfo, equipInfo, eqStationInfo, epcStationInfo, jrgStationInfo;
var lineInfoDict = {};

var stationInfo;

//메뉴 ID - 사용자 권한  true, false
var userAuthInfo = {'8010010' : false, '8010020' : false, '8010030' : false };	

//AJAX 관련 변수
var equipAjax;
var duruAjax;
var equipInfoAjax;
var serverStatAjax;
var recoverInfoAjax;

var _pMajorCnt = 0;
var _pMinorCnt = 0;
var MAINMONITOR = {filterLevel : 3};
$(document).ready(function(){
	$(".state").css('cursor','default');
	
	// 오디오 세팅
	
	// 사용자 권한 확인
	getUserAuth();
	intervalSet();
	setInterval(function() {
		var now = new Date();
		var hour = now.getHours();
		var min = now.getMinutes();
		
		if((hour+"").length < 2){
			hour="0"+hour;      
		}
		if((min+"").length < 2){
			min="0"+min;      
		}

		if(hour+":"+min == "00:00") {
			location.reload(true);
		}
		
	}, 1000*30);
//	startAlarmDetect();
	
//	setInterval('getAlarmCurJob()', 1000*5);
	
});

function getStationInfo(){
	stationInfo = $.ajax({
		type : 'post',
		url: '/failure/mapping/getStationInfo',
		dataType: "json",
		success: function (data) {
			duStationInfo = data.getDuStationInfo;
			switchStationInfo = data.getSwitchStationInfo;
			jrgStationInfo = data.getJrgStationInfo;
			ruStationInfo = data.getRuStationInfo;
			eqStationInfo = data.getEquipStationInfo;
			epcStationInfo = data.getEpcStationInfo;
			lineList = data.getLineInfo;
			if(lineList != null && lineList.length > 0){
				//고장감시 셀렉트박스 생성
				lineOptions = [];
				lineOptions.push('<option value="">전체</option>');
				$.each(lineList, function (i,row){
//					if(row.LINE_ID != '0'){
//						lineOptions.push('<option value=' + row['LINE_ID'] + '>' + row['LINE_NAME'] + '</option>');
//					}
					lineOptions.push('<option value=' + row['LINE_ID'] + '>' + row['LINE_NAME'] + '</option>');
				});
				$("#selectedLine").html(lineOptions.join(''));
				// lineInfoDict값입력
				$.each(lineList ,function(idx, lineinfo){
					lineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
					srcIdx = idx
					for(var idx;idx<lineList.length;idx++) {
						if (lineList[idx+1] != undefined){
							var lines = lineList[srcIdx].LINE_ID +','+ lineList[idx+1].LINE_ID
							var lensNm = lineList[srcIdx].LINE_NAME +','+ lineList[idx+1].LINE_NAME
							lineInfoDict[lines] = lensNm;
						}
					}
				})
			}
		},
		error: function () {
			//alert('에러발생');
		}
	});
	
}

function getLineName(value){
	var LINE_NAME =  '';
	if(value != undefined){
		if(value.indexOf(',') >=0 ){
			lineList = value.split(',');
			lineNameList = []
			$.each(lineList, function(i, line) {
				if(line in lineInfoDict){
					lineNameList.push(lineInfoDict[line]);
				}else{
					lineNameList.push(line);
				}
			})
			LINE_NAME = lineNameList.splice(',');
		}else{
			if(value in lineInfoDict){
				LINE_NAME = lineInfoDict[value];
			}else{
				LINE_NAME = value;
			}
		}
	}
	return LINE_NAME;
}

function changeSelectLine(){
	lineIdFailureMain = $('#selectedLine').val();
	gridEmpty();
}

function getStationNmInDuOrRu(systemId, location) {
	var lineName = '';
	var lineId = ''
	for(i in duStationInfo){
		var duInfo = duStationInfo[i];
		if(systemId == duInfo.DU_ID){
			lineName = getLineName(duInfo.LINE_ID);
			lineId = duInfo.LINE_ID;
			break;
		}
	}
	var loc = location.split('/');
	var stationNm = rrh = '';
	var duRegEx2 = /^[ㄱ-ㅎ가-힣]+-\w+-\d+/g;
	//if(loc.length === 3 && (loc[2].startsWith('RRH') || loc[2].startsWith('PSU'))) {
	// loc.length === 3 << 김포 알람 패턴과 달라서 조건 제거 2017-06-27
	if(loc.length > 2 && (loc[2].startsWith('RRH') || loc[2].startsWith('PSU'))) {
		var pattern = /\d+_\d+_\d+/g;
		rrh = loc[2].match(pattern)[0];
		stationNm =getStationNmInDu(systemId) + "(" + (getStationNmInRu(systemId, rrh)) + ")";

// } else if(loc[2].startsWith('RACK')) {
//	} else if(duRegEx2.test(location)) {
// duRegEx2.test(location) << 김포 알람 패턴과 달라서 주석처리 후 else 처리 함. 2017-06-27

	} else if(location.indexOf('LSM') === 0 && location.split('/').length >= 4) {
		// DU - LSM 알람 처리
		stationNm = location.split('/')[2];
	} else {
		stationNm = getStationNmInDu(systemId);
	}
	return [stationNm, lineName, lineId];
}

function getStationIdInDu(stationId){
	var duIdList = [];
	for(i in duStationInfo){
		var duInfo = duStationInfo[i];
		if(stationId == duInfo.STATION_ID){
			duIdList.push(duInfo.DU_ID);
		}
	}
	return duIdList;
}

function getStationNmInDu(systemId){
	var stationNm = '';
	for(i in duStationInfo){
		var duInfo = duStationInfo[i];
		if(systemId == duInfo.DU_ID){
			stationNm = duInfo.STATION_NAME;
			break;
		}
	}
	return stationNm;
}

function getStationIdInRu(systemId, location) {
	var loc = location.split("/");
	var stationId = rrh = "";
	if(loc.length === 3 && loc[2].startsWith("RRH")) {
		var pattern = /\d+_\d+_\d+/g;
		rrh = loc[2].match(pattern)[0];

		for (i in ruStationInfo) {
			var ruInfo = ruStationInfo[i];
			if (systemId == ruInfo.DU_ID && rrh === ruInfo.RRH) {
				stationId = ruInfo.STATION_ID || "";
				break;
			}
		}
	}
	return stationId;
}

// function getStationIdInRu(stationId){
// 	var ruIdList = [];
// 	for(i in ruStationInfo){
// 		var ruInfo = ruStationInfo[i];
// 		if(stationId == ruInfo.STATION_ID){
// 			duIdList.push(duInfo.DU_ID);
// 		}
// 	}
// 	return duIdList;
// }

function getStationNmInRu(systemId, rrh){
	var stationNm = '';
	for(i in ruStationInfo){
		var ruInfo = ruStationInfo[i];
		if(systemId == ruInfo.DU_ID && rrh === ruInfo.RRH){
			stationNm = ruInfo.STATION_NAME || '';
			break;
		}
	}
	return stationNm;
}

function getStationIdInSwitch(stationId){
	var switchIdList = [];
	for(i in switchStationInfo){
		var switchInfo = switchStationInfo[i];
		if(stationId == switchInfo.STATION_ID){
			switchIdList.push(switchInfo.SWITCH_ID);
		}
	}
	return switchIdList;
}

function getStationNmInSwitch(systemId){
	var stationNm = '';
	var lineName = '';
	var lineId = '';
	for(i in switchStationInfo){
		var switchInfo = switchStationInfo[i];
		if(systemId == switchInfo.SWITCH_ID){
			stationNm = switchInfo.STATION_NAME;
			lineName = getLineName(switchInfo.LINE_ID);
			lineId = switchInfo.LINE_ID;
			break;
		}
	}
	return [stationNm, lineName, switchInfo.LINE_ID];
}

function getStationIdInJrg(stationId){
	var jrgIdList = [];
	for(i in jrgStationInfo){
		var jrgInfo = jrgStationInfo[i];
		if(stationId == jrgInfo.STATION_ID){
			switchIdList.push(jrgInfo.JRG_ID);
		}
	}
	return jrgIdList;
}

function getStationNmInJrg(systemId){
	var stationNm = '';
	var lineName = '';
	var lineId = '';
	for(i in jrgStationInfo){
		var jrgInfo = jrgStationInfo[i];
		if(systemId == jrgInfo.JRG_ID){
			stationNm = jrgInfo.STATION_NAME;
			lineName = getLineName(jrgInfo.LINE_ID);
			lineId = jrgInfo.LINE_ID;
			break;
		}
	}
	return [stationNm, lineName, lineId];
}

function getStationIdInEquip(stationId,equip_type){
	var equipIdList = [];
	for(i in eqStationInfo){
		var equipInfo = eqStationInfo[i];
		if(stationId == equipInfo.STATION_ID && equip_type == equipInfo.EQUIP_TYPE){
			equipIdList.push(equipInfo.SWITCH_ID);
		}
	}
	return equipIdList;
}
function getStationIdInEpc(stationId,equip_type){
	var epcIdList = [];
	for(i in epcStationInfo){
		var epcInfo = epcStationInfo[i];
		if(stationId == epcInfo.STATION_ID && equip_type == epcInfo.EQUIP_TYPE){
			epcIdList.push(epcInfo.NE_ID);
		}
	}
	return epcIdList;
}

function getStationNameEpc(ne_id, equip_type){
	var stationNm = '';
	var lineName = '';
	for(i in epcStationInfo){
		var equipInfo = epcStationInfo[i];
		if(ne_id == equipInfo.NE_ID && equip_type == equipInfo.EQUIP_TYPE){
			stationNm = equipInfo.STATION_NAME;
			lineName = getLineName(equipInfo.LINE_ID)
		}
	}
	var lineId = '0';
	if ( typeof(equipInfo) == 'object'){
		if( equipInfo.hasOwnProperty('LINE_ID') ){
			lineId = equipInfo.LINE_ID;
		}
	}
	
	return [stationNm, lineName, lineId];
}

function getStationNmInEquip(systemId,equip_type){
	var stationNm = '';
	var lineName = '';
	for(i in eqStationInfo){
		var equipInfo = eqStationInfo[i];
		if(systemId == equipInfo.SWITCH_ID && equip_type == equipInfo.EQUIP_TYPE){
			stationNm = equipInfo.STATION_NAME;
			lineName = getLineName(equipInfo.LINE_ID)
			break;
		}
	}
	return [stationNm, lineName];
}

var equipData;
var equipInfoAjax;
function getEquipInfo(){
	equipInfoAjax = $.ajax({
		type : 'post',
		url: '/failure/mapping/getEquipInfo',
		dataType: "json",
		success: function (data) {
			equipData = data.getEquipInfo;
			equipInfo = data.getEquipInfo;
		},
		error: function () {
			//alert('에러발생');
		}
	});
}


function getTopologyEquipInfoMain() {
	$('#nowDateTime').text("감시시간 : "+new Date().format("yyyy/MM/dd HH:mm:ss"));
	_pCriticalCnt = 0;
	_pMajorCnt = 0;
	_pMinorCnt = 0;
	var equip_name ='';
	var alarmFilter = MAINMONITOR.filterLevel == '0' ? 3 : MAINMONITOR.filterLevel
			
	var requestData = {
			alarmFilter : alarmFilter
	};
	equipAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/integration/monitor/network/getEquipList',
		dataType : 'json',
		data: requestData,
		success	: function(data) {
//			console.log(data);
		},
		error : function() {
		}
	});
	
//	// switch장비들 server_stat 체크
//	switchAjax = $.ajax({
//		cache : false,
//		type : 'post',
//		url : '/integration/monitor/network/switch/portInformation',
//		contentType: 'application/json',
//		dataType : 'json',
//		data: JSON.stringify(requestData)
//	});
	
	// sioef ip,port 정보
	sioefAjax =	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefPortList',
		   contentType: 'application/json',
		   dataType: "json",
		   data: JSON.stringify(requestData),
	});
	
	serverStatAjax = $.ajax({
		cache : false,
		type : 'post',
		url : '/integration/monitor/network/serverStatData',
		contentType: 'application/json',
		dataType : 'json',
		data: JSON.stringify(requestData)
	});
	
	recoverInfoAjax = $.ajax({
		cache : false,
		type : 'post',
		url : '/integration/monitor/network/getRecoverInfo',
		contentType: 'application/json',
		dataType : 'json',
		data: JSON.stringify(requestData)
	});
}

function getTopologyDuInfo() {
	
	var requestData = {
		filterLevel : MAINMONITOR.filterLevel
	};
	duruAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/integration/mainMonitor/getPerformData',
		dataTpye:'json',
		data: requestData,
		success	: function(data) {
			// DU active, standby 처리
			$('#du').data('data', data.getPerformData);
			$('#ru').data('data', data.getPerformData);
			
			var $equip = $('#du');
			$equip.find('div.state').removeClass('normalgray normalblue yellow orange red');
			if(data.duActCount > 0) {
				$equip.find('div.state').addClass('normalblue');
			} else {
				$equip.find('div.state').addClass('normalgray');
			}
			
			var performanceAlarmClass = 'yellow';
			var getData = data.getPerformData
			var equip_name = '';
			
			/*_pCriticalCnt += getData.DU_CRITICAL + getData.RU_CRITICAL;
			_pMajorCnt += getData.DU_MAJOR + getData.RU_MAJOR;
			_pMinorCnt += getData.DU_MINOR + getData.RU_MINOR;*/
			
			//LTE-M DU만 사용
			_pCriticalCnt = getData.DU_CRITICAL;
			_pMajorCnt = getData.DU_MAJOR;
			_pMinorCnt = getData.DU_MINOR; 
			
			var performMinLevel = 4;
			
			if(_pCriticalCnt != 0) performMinLevel = 1;
			else if(_pMajorCnt != 0) performMinLevel = 2;
			else if(_pMinorCnt != 0) performMinLevel = 3;
			else performMinLevel = 4;

			if(getData.DU_MAX_ACT_SBY === 'S') {
				performMinLevel = 1;
			}
			
			$('#audioAlarmLevel').val(performMinLevel);
			
			var duMinLevel = 4;
			var ruMinLevel = 4;
			
			if(getData.DU_CRITICAL > 0) duMinLevel = 1;
			else if(getData.DU_MAJOR > 0) duMinLevel = 2;
			else if(getData.DU_MINOR > 0) duMinLevel = 3;
			else duMinLevel = 4;
			
			if(getData.RU_CRITICAL > 0) ruMinLevel = 1;
			else if(getData.RU_MAJOR > 0) ruMinLevel = 2;
			else if(getData.RU_MINOR > 0) ruMinLevel = 3;
			else ruMinLevel = 4;
			
			// ru du 성능알람 초기화
			$('#du').parent().find('span.stage').remove();
			$('#ru').parent().find('span.stage').remove();
			
			if(duMinLevel < 4) {
				if(duMinLevel === 1) {
					performanceAlarmClass = 'red';
				} else if(duMinLevel === 2) {
					performanceAlarmClass = 'orange';
				}
				
				$.each(equipInfo, function(j, val) {
					if(val.EQUIP_TYPE == 2) {
						equip_name = val.EQUIP_NAME;
						return false;
					}
				});
				
//				$('#du-2').prepend('<span class="stage ' + performanceAlarmClass + '"></span>');
//				$('#du-2').find('.stage').attr("onClick","javascript:accessPerformOpen('"+equip_name+"','"+equip_name+"')");
				$('#du').parent().prepend('<span class="stage ' + performanceAlarmClass + '" style="display:block; "></span>');
				$('#du').parent().find('.stage').attr("onClick","javascript:accessPerformOpen('"+equip_name+"','"+equip_name+"')");
			}
			
			if(ruMinLevel < 4) {
				if(ruMinLevel === 1) {
					performanceAlarmClass = 'red';
				} else if(ruMinLevel === 2) {
					performanceAlarmClass = 'orange';
				}
				
				$.each(equipInfo, function(j, val) {
					if(val.EQUIP_TYPE == 3) {
						equip_name = val.EQUIP_NAME;
						return false;
					}
				});
				
				$('#ru').parent().prepend('<span class="stage ' + performanceAlarmClass + '" style="display:block; "></span>');
				$('#ru').parent().find('.stage').attr("onClick","javascript:accessPerformOpen('"+equip_name+"','"+equip_name+"')");
			}

			// 서버 상태에 따라서 서버 색깔 바꿈.
//			if(getData.DU_SERVER_STAT === 'N') {
//				var colorClass = 'red';
//				$('#du').find('div.state').addClass(colorClass);
//			} else {
//				$('#du').find('div.state').removeClass('yellow orange red');
//			}
			
			// 고장 알람 처리
//			setEquipAlarm();
			PerformanceAlarmCount();
//			mainAudioFunction(0);
			var  failureAlarmLv = 4;
			if (failureAlarmData.hasOwnProperty('2')){
				var colorClass = '';
				if(failureAlarmData['2']['CRITICAL'] >= 1 && ( MAINMONITOR.filterLevel >= 1 || MAINMONITOR.filterLevel == 0) ){
					colorClass = 'red';
					//failureAlarmLv = 1;
				} else if(failureAlarmData['2']['MAJOR'] >= 1 && ( MAINMONITOR.filterLevel >= 2 || MAINMONITOR.filterLevel == 0) ){
					colorClass = 'orange';
					if ( failureAlarmLv >= 2){
						//failureAlarmLv = 2;
					}
				} else if(failureAlarmData['2']['MINOR'] >= 1 && ( MAINMONITOR.filterLevel >= 3 || MAINMONITOR.filterLevel == 0) ){
					colorClass = 'yellow';
					if ( failureAlarmLv >= 3){
						//failureAlarmLv = 3;
					}
				} else{
					colorClass = 'normal';
				}
				var equipType = 2;
				var equipNm = 'DU';
				$equip = $('#du');
				if (colorClass != 'normal'){
					var $engineer = $equip.find('div.engineer');
					$equip.append('<div class="engineer ' + colorClass + '" onclick="failureOpen(\'' + equipNm + '\', \'' + equipType + '\');"></div>');
					$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
				}
			}
			if (failureAlarmData.hasOwnProperty('3')){
				var colorClass = '';
				if(failureAlarmData['3']['CRITICAL'] >= 1 && ( MAINMONITOR.filterLevel >= 1 || MAINMONITOR.filterLevel == 0) ){
					colorClass = 'red';
					failureAlarmLv = 1;
				} else if(failureAlarmData['3']['MAJOR'] >= 1 && ( MAINMONITOR.filterLevel >= 2 || MAINMONITOR.filterLevel == 0) ){
					colorClass = 'orange';
					if ( failureAlarmLv >= 2){
						failureAlarmLv = 2;
					} 
				} else if(failureAlarmData['3']['MINOR'] >= 1 && ( MAINMONITOR.filterLevel >= 3 || MAINMONITOR.filterLevel == 0) ){
					colorClass = 'yellow';
					if ( failureAlarmLv >= 3){
						failureAlarmLv = 3;
					}
				} else{
					colorClass = 'normal';
				}
				$equip = $('#ru');
				var equipType = 2;
				var equipNm = 'RU';
				if (colorClass != 'normal'){
					var $engineer = $equip.find('div.engineer');
					$equip.append('<div class="engineer ' + colorClass + '" onclick="failureOpen(\'' + equipNm + '\', \'' + equipType + '\');"></div>');
					$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
				}
			}
		},
		error : function() {
		}
	});
}


function startAlarmDetect(){
	isView = true;
	startWebSocket(function(){
//		console.log('===================================');
//		console.log(duStationInfo);
//		console.log(switchStationInfo);
//		console.log(equipInfo);
//		console.log(eqStationInfo);
//		console.log(epcStationInfo);
//		console.log('===================================');
		console.log("START ALARM DETECTION");
	});
	startPutWebSocket(function(){
		console.log("START PUT SOCKET");
	});
}


function parseData(msg){
	var buffer = remind + msg;
	var arr = buffer.split("\n");

	for(var i=0; i<arr.length; i++){
		var cmd = '';
		var line = arr[i];
		if(i == arr.length-1){
			if(line.length == 0){
				remind = '';
				cmd = line;
			}else{
				remind = line;
			}
		}else{
			cmd = line;
		}
		if(!cmd){
			continue;
		}
		if(cmd == '.\r'){

		}else if(cmd.indexOf("+OK EventThread") == 0){
			var interval = null;
			if(ws.readyState == 1) {
				ws.send("start\n");
			} else {
				interval = setInterval(function() {
					if(ws.readyState == 1) {
						ws.send("start\n");
						clearInterval(interval);
					}
				}, 1000);
			}
		}else if(cmd.indexOf("+OK") == 0){
			 
		}else{
			msgCheck(cmd);
		}
	}
	
	/*상단 기준시간 갱신*/
	var datetime = new Date().today() + " " + new Date().timeNow();
	$("#today_time").html(datetime);
}

function startWebSocket(next_fn) {
	if ("WebSocket" in window) {
		if(!ws || !(ws.readyState == 1)){
			ws = new WebSocket("ws://" + $("#localIp").val() + ":" + $("#websocketPort").val() +"/websocket");
			ws.onopen = function() {
				if(next_fn){
					next_fn();
					$("#tb_failure_alarm tbody tr").remove();
					$("#tb_majorFailure_alarm tbody tr").remove();
					$("#excelTable tbody tr").remove();
					$("#cntLevel1").html(0);
					$("#cntLevel2").html(0);
					$("#cntLevel3").html(0);
					$("#cntLevel4").html(0);
					$("#tnms_cntLevel1").html(0);
					$("#tnms_cntLevel2").html(0);
					$("#tnms_cntLevel3").html(0);
					$("#cntAlarmTot").html(0);
				}
			};
			ws.onmessage = function (evt) {
				if(isView) { 
					parseData(evt.data);
				}
			};
			ws.onclose = function() {
				console.log("ws close");
				if(isView) {
					setTimeout(function(){startWebSocket(next_fn);},1000);
//					startWebSocket(next_fn);
				}
			};
			ws.onerror = function(evt){
				console.log("socket error");
			};
		}
   } else {}
}

function startPutWebSocket(next_fn) {
	if ("WebSocket" in window) {
		if(!ws_put || !(ws_put.readyState == 1)){
			ws_put = new WebSocket("ws://" + $("#localIp").val() + ":" + $("#websocketPort").val() +"/websocket/put");
			ws_put.onopen = function() {
				if(next_fn){
					next_fn();
				}
			};
			ws_put.onmessage = function (evt) {
				//alert(evt.data);
			};
			ws_put.onclose = function() {
				console.log("put ws close");
				if(isView) {
					setTimeout(function(){startPutWebSocket(next_fn);},1000);
//					startPutWebSocket(next_fn);
				}
			};
			ws_put.onerror = function(evt){
				console.log("put socket error");
			};
		}
	} else {}
}

function msgCheck(msg) {
	var message = msg.split("|^|");
	if(message.length < 20) {
		return;
	}
	
	var alarmFlag = true;
	
	/*                0     1    2     3            4        5               6      7        8                      9              10 11  12        13               14   15     16        17  18  19   20
	 msg sample : UPDATE|^|3556|^|O|^|V_MME0001|^|S2004|^|HOURLY REPORT |^|NORMAL|^|-|^|2015/12/20-15:53:37|^|2015/12/16-15:53:36|^||^||^|23|^|2015/12/16-15:53:36|^|MME|^|1|^|V_MME0001|^|1|^|1|^|1|^||&|[2015-12-16 15:53:36]|&|...
	 message[0] : 명령어(INSERT,UPDATE)
	 message[1] : 오픈되어있는 ID(SEQNO), ALARM ID
	 message[2] : O:발생,중복발생/ C:복구/ D:삭제/ A:인지
	 message[3] : SYSTEM ID
	 message[4] : 표준 장애코드 
	 message[5] : 표준 장애명, 알람에 대한 간단한 설명
	 message[6] : GRADE ( CRITICAL, MAJOR, MINOR )
	 message[7] : 부품위치
	 message[8] : 이벤트서버에 전달된 시간
	 message[9] : 시간 (STATUS에 따라서 다른 의미를 가짐) STATUS O인경우 발생시간 C: 경우 복구발생시간 D: 삭제 발생시간 형식: YYYY/MM/DD-HH:MM:SS
	 message[10] : 인지 수집시간 형식: YYYY/MM/DD-HH:MM:SS
	 message[11] : 작업자 ID(STATUS에 따라서 다른 의미를 가짐)
	 message[12] : 중복 발생 카운트
	 message[13] : 중복 발생 최종시간
	 message[14] : 이벤트 타입(CORE, LIS, ETC). 장비타입
	 message[15] : 이벤트 중복발생 에러 
	 message[16] : SYSTEM_NAME
	 message[17] : C_UID
	 message[18] : VENDOR_ID
	 message[19] : TEAM_ID -> EQUIP TYPE
	 message[20] : 데이터 정보
	*/
	
	if(message[2] == "C" || message[2]  == "D"){
		clearAlarmGrid(msg);
		clearMajorAlarmGrid(msg);
	}
	if(message[2] == "O" || message[2] == "A"){
		
		var isAlarmView = true;
		var isMajorAlarmView = false;
		
		var equipType = message[19];

//		for(var index in equipInfo){
//			if(message[14] == equipInfo[index].EQUIP_NAME){
//				equipType = equipInfo[index].EQUIP_TYPE
//			}
//		}
		
		// 네트워크 토폴로지 필터 적용
		if(typeof NETWORK_TOPOLOGY !== 'undefined') {
			if ( NETWORK_TOPOLOGY.params.gridAlarmFilter < alarmLevelCheck(message[6])) {
				isAlarmView = false;
			}
		} 


		/* 알람등급 체크 */
		var alarmGradeFilter = '3';	// 기본값 MINOR
		if(typeof alarmGradeFilterMap != 'undefined' && alarmGradeFilterMap != null){
			if ( typeof alarmGradeFilterMap == 'object' &&equipType in alarmGradeFilterMap ) {
				alarmGradeFilter = alarmGradeFilterMap[equipType];
		} 
		}
		if(isAlarmView && !(alarmGradeFilter >= alarmLevelCheck(message[6])) && alarmGradeFilter != 0){
			isAlarmView = false;
		}
		// S 알람 미표시
		if((typeof alarmGradeFilterMap === 'undefined' && message[4].indexOf('S') === 0)
				|| (message[4].indexOf('S') === 0 && alarmGradeFilter != 0)) {
			isAlarmView = false;
		}
		
	
		if(isAlarmView && typeof mainFilter !== 'undefined' && mainFilter != "") {
			if(mainFilter.equipType == 14
					&&(equipType == 14 || equipType == 15 || equipType == 16 || equipType == 29 || equipType == 30 || equipType == 47 || equipType == 48)) {
				isAlarmView = true;
				// EMS 처리
				
			} else if(equipType != mainFilter.equipType) {
				if (equipType == 44 && mainFilter.equipType == 11 ){
					isAlarmView = true;
				}else{
					isAlarmView = false;
				}
			} else {
				if(equipType == 11) {
					// 스위치 처리
//                  // 메인감시에서 클릭시에 고장감시에서 스위치알람 미출력
//					var _equipNm = mainFilter.equipName;
//
//					var imRegEx = /IP\/MPLS/;
//					var l2RegEx = /L2|L3/;
//					if(_equipNm === 'L2/L3'){
//						if(!l2RegEx.test(message[16])){
//							isAlarmView = false;
//						}
//					} else if(_equipNm === 'IP/MPLS') {
//						if(!imRegEx.test(message[16])){
//							isAlarmView = false;
//						}
//					} else {
//						if(!imRegEx.test(message[16]) && !l2RegEx.test(message[16])){
//							isAlarmView = true;
//						}else{
//							isAlarmView = false;
//						}
//					}
				} else if(equipType == 2) {
					// DU / RU 처리
					isAlarmView = false;
					var _equipNm = mainFilter.equipName;
					var reg;
					var lsmCheck = /LSM|lsm/;
					
					if(_equipNm == 'RU'){
						reg = /RRH|PSU/;
						
						if (reg.test(message[7]) && !(lsmCheck.test(message[7]))) {
							isAlarmView = true;
						}
					}else if(_equipNm == 'DU'){
						//reg = /^[ㄱ-ㅎ가-힣]+-\w+-\d+/;
						ruReg = /RRH|PSU/;
//						if (!(ruReg.test(message[7])) && reg.test(message[7]) && !(lsmCheck.test(message[7]))) {
						if (!(ruReg.test(message[7])) && !(lsmCheck.test(message[7]))) {
							isAlarmView = true;
						}
					}
				}
			}
		}
		
		/* 알람코드 체크 */
		if(isAlarmView) {
			if(typeof alarmCodeFilterList !== 'undefined' && alarmCodeFilterList.length > 0) {
				var viewFlag = alarmCodeFilterList[0]['VIEW_FLAG'];
				
				if(viewFlag == ''){
					isAlarmView = true;
				} else {
					for(i in alarmCodeFilterList){
						var codeFilter = alarmCodeFilterList[i];
						
						if(viewFlag == 'N'){
							if(codeFilter['ALARM_CODE'] == message[4] && codeFilter['EQUIP_TYPE'] == equipType){
								isAlarmView = false;
								break;
							} 
						} else if(viewFlag == 'Y'){
							if(codeFilter['ALARM_CODE'] == message[4] && codeFilter['EQUIP_TYPE'] == equipType){
								isAlarmView = true;
								break;
							} else {
								isAlarmView = false;
							}
						}
					}					
				}
			}
		}
		
		/* 장비 체크 */
		if(isAlarmView){
			if(typeof alarmSystemFilterList !== 'undefined' && alarmSystemFilterList.length > 0) {
				for(i in alarmSystemFilterList){
					var systemFilter = alarmSystemFilterList[i];
					
					if(systemFilter['SYSTEM_ID'] == message[3] && systemFilter['EQUIP_TYPE'] == equipType){
						isAlarmView = false;
						break;
					} else {
						isAlarmView = true;
					}
				}
			}
		}
		
		if(isAlarmView){
			if(typeof alarmStationFilterList !== 'undefined' && alarmStationFilterList.length > 0){
				for(i in alarmStationFilterList){
					var stationFilter = alarmStationFilterList[i].STATION_ID;
					var duIdList = getStationIdInDu(stationFilter);
					var swIdList = getStationIdInSwitch(stationFilter);
					var eqIdList = getStationIdInEquip(stationFilter, equipType);
					var epcIdList = getStationIdInEpc(stationFilter, equipType);

					if(equipType == "2") {
						if(getStationIdInRu(message[3], message[7]) !== "") {
							isAlarmView = false;
						}
						
						for(var duIdx in duIdList){
							if(duIdList[duIdx] == message[3]){
								isAlarmView = false;
								break;
							} else {
								isAlarmView = true;
							}
						}

					} else if(equipType == "11") {
						for(var swIdx in swIdList){
							if(swIdList[swIdx] == message[3]) {
								isAlarmView = false;
								break;
							} else {
								isAlarmView = true;
							}
						}
					} else{
						for(var eqIdx in eqIdList){
							if(eqIdList[eqIdx] == message[3]){
								isAlarmView = false;
								break;
							}else{
								isAlarmView = true;
							}
						}
						for(var epcIdx in epcIdList){
							if(epcIdList[epcIdx] == message[3]){
								isAlarmView = false;
								break;
							}else{
								isAlarmView = true;
							}
						}
					}

					if(!isAlarmView){
						break;
					}
					
				}
			}
		}
		
		/* 중요알람 체크 */
//		if(isAlarmView && typeof majorAlarmCodeFilterList !== 'undefined' && majorAlarmCodeFilterList.length > 0) {    // 리스트사용
		if(isAlarmView && typeof majorAlarmCodeFilterDict !== 'undefined' && majorAlarmCodeFilterDict instanceof Object) {
			isMajorAlarmView = true;
			
			if(!_.isEmpty(mainFilter)) {
				if(mainFilter.equipType == 14
						&&(equipType == 14 || equipType == 15 || equipType == 16 || equipType == 29 || equipType == 30 || equipType == 47 || equipType == 48)) {
					// EMS 처리
					
				} else if(equipType != mainFilter.equipType) {
					if (equipType == 44 && mainFilter.equipType ==11 ){
						isAlarmView = true;
					}else{
						isAlarmView = false;
					}
				} else {
					if(equipType == 11) {
						// 스위치 처리
//						// 메인감시에서 클릭시에 고장감시에서 스위치알람 미출력
//						var _equipNm = mainFilter.equipName;
//
//						var imRegEx = /IP\/MPLS/;
//						var l2RegEx = /L2|L3/;
//						if(_equipNm === 'L2/L3'){
//							if(!l2RegEx.test(message[16])){
//								isAlarmView = false;
//							}
//						} else if(_equipNm === 'IP/MPLS') {
//							if(!imRegEx.test(message[16])){
//								isAlarmView = false;
//							}
//						} else {
//							if(!imRegEx.test(message[16]) && !l2RegEx.test(message[16])){
//								isAlarmView = true;
//							}else{
//								isAlarmView = false;
//							}
//						}
					} else if(equipType == 2) {
						// DU / RU 처리
						isMajorAlarmView = false;
						var _equipNm = mainFilter.equipName;
						var reg;
						var lsmCheck = /LSM|lsm/
						
						if(_equipNm == 'RU'){
							reg = /RRH|PSU/;
							
							if (reg.test(message[7]) && !(lsmCheck.test(message[7]))) {
								isMajorAlarmView = true;
							}
						}else if(_equipNm == 'DU'){
							//reg = /^[ㄱ-ㅎ가-힣]+-\w+-\d+/;
							ruReg = /RRH|PSU/;
//							if (!ruReg.test(message[7]) && reg.test(message[7]) && !(lsmCheck.test(message[7]))) {
							if (!ruReg.test(message[7]) && !(lsmCheck.test(message[7]))) {
								isMajorAlarmView = true;
							}
						}
					}
				}
			}
			if(isMajorAlarmView){
				// 고장알람정보 dictionary 사용
				if ( equipType in majorAlarmCodeFilterDict){    
					if (majorAlarmCodeFilterDict[equipType].indexOf(message[4]) >=0  ){
						isMajorAlarmView = true;
					}else{
						isMajorAlarmView = false;
					}
				}else{
					isMajorAlarmView = false;
				}
				
				// 고장알람정보 List 사용
//				for(i in majorAlarmCodeFilterList){    
//					var majorAlarmCodeFilter = majorAlarmCodeFilterList[i];
//					
//					if(majorAlarmCodeFilter['ALARM_CODE'] == message[4] && majorAlarmCodeFilter['EQUIP_TYPE'] == equipType){
//						isMajorAlarmView = true;
//						break;
//					} else {
//						isMajorAlarmView = false;
//					}
//				}
				
			}
		}
		if(message[0]=="UPDATE"){
			clearAlarmGrid(msg);
			clearMajorAlarmGrid(msg);
		}

		if(isAlarmView){
			//DU일때만 고장 표시
			if(message[19]==2){
				addAlarmGrid(msg);
				
				if($('#btn_alarmSound').hasClass('mu-toggle-on')){
					if( message[2] != "A"){
						var level = alarmLevelCheck(message[6])
						audioFunction.failureAudioOnePlay(level);
						alarmFlag = false;
					}
					setAlarmSound();
				}
			}
		}
		if(isMajorAlarmView){
			addMajorAlarmGrid(msg);						
			
			if(alarmFlag){
				if($('#btn_alarmSound').hasClass('mu-toggle-on')){
					if( message[2] != "A"){
						var level = alarmLevelCheck(message[6])
						audioFunction.failureAudioOnePlay(level);
					}
					setAlarmSound();
				}
			}
		}
	}
	
};

/**
 * 장애등급 조회
 */
function getAlarmGrade(grade) {
	if(grade == 1) grade = "CRITICAL";
	else if(grade == 2) grade = "MAJOR";
	else if(grade == 3) grade = "MINOR";
	else if(grade == 4) grade = "NORMAL";
	return grade;
}

function alarmLevelCheck(level) {		
	var alarmLevelObj = {
			'CRITICAL' : '1',
			'MAJOR' : '2',
			'MINOR' : '3',
			'NORMAL' : '4'
	};
	
	if(alarmLevelObj[level.toUpperCase()]) {
		return alarmLevelObj[level.toUpperCase()];
	} else {
		return level.toUpperCase(); 
	}
}

function addAlarmGrid(msg) {
	/*                0     1    2     3            4        5               6      7        8                      9              10 11  12        13               14   15     16        17  18  19   20
	 msg sample : UPDATE|^|3556|^|O|^|V_MME0001|^|S2004|^|HOURLY REPORT |^|NORMAL|^|-|^|2015/12/16-15:53:37|^|2015/12/16-15:53:36|^||^||^|23|^|2015/12/16-15:53:36|^|MME|^|1|^|V_MME0001|^|1|^|1|^|1|^||&|[2015-12-16 15:53:36]|&|...
	 message[0] : 명령어(INSERT,UPDATE)
	 message[1] : 오픈되어있는 ID(SEQNO), ALARM ID
	 message[2] : O:발생,중복발생/ C:복구/ D:삭제/ A:인지
	 message[3] : SYSTEM ID
	 message[4] : 표준 장애코드 
	 message[5] : 표준 장애명, 알람에 대한 간단한 설명
	 message[6] : GRADE ( CRITICAL, MAJOR, MINOR )
	 message[7] : 부품위치
	 message[8] : 이벤트서버에 전달된 시간
	 message[9] : 시간 (STATUS에 따라서 다른 의미를 가짐) STATUS O인경우 발생시간 C: 경우 복구발생시간 D: 삭제 발생시간 형식: YYYY/MM/DD-HH:MM:SS
	 message[10] : 인지 수집시간 형식: YYYY/MM/DD-HH:MM:SS
	 message[11] : 작업자 ID(STATUS에 따라서 다른 의미를 가짐)
	 message[12] : 중복 발생 카운트
	 message[13] : 중복 발생 최종시간
	 message[14] : 이벤트 타입(CORE, LIS, ETC). 장비타입
	 message[15] : 이벤트 중복발생 에러 
	 message[16] : SYSTEM_NAME
	 message[17] : C_UID
	 message[18] : VENDOR_ID
	 message[19] : TEAM_ID -> EQUIP TYPE
	 message[20] : 데이터 정보
	*/
	var message = msg.split("|^|");
	var time = message[9].substring(11,16);
	var date = message[9].split("-")[0].replace(/\//gi,"");
	var alarmCode = message[4] + message[6]; // S1
	var alarmLevel = alarmLevelCheck(message[6]);
	var alarmGrade = getAlarmGrade(alarmLevel); //CRITICAL
	var equipNm = message[14];

	/* 알람을 '삭제'할때 필요 ->  SYSTEM_ID | ALARM_CODE | ALARM_NAME | GRADE | LOCATION | USER | EVENT_TYPE | SYSTEM_NAME | ALARM_ID | VENDOR_ID | TEAM_ID(EQUIP_TYPE) (서버에서 필요로 하는 정보) */
	var key = message[3] + "|^|" + message[4] + "|^|" + message[5] + "|^|" + message[6] + "|^|" + message[7] + "|^|" + $("#userId").val() + "|^|" + message[14] + "|^|" + message[16] + "|^|" + message[1] + "|^|" + message[18] + "|^|" + message[19];
//	var anomaly = alarmGrade + "|" + alarmCode + "|" + message[3] + "|" + date + "|" + time + "|" + message[7]; // 알람등급명 | 알람코드+레벨 | SYSTEM_ID | 날짜 | 시간 | LOCATION
	var anomaly = message[1] + "|" + message[3] + "|" + message[4] + "|" + message[6]; // SEQ ID | SYSTEM_ID | 알람코드 | 알람등급
	var alarmId = message[1]; // 장비타입 | SYSTEM_ID | 알람코드 | 부품위치
	
	var levelClass = 'level4';
	if( alarmGrade == "CRITICAL" ) {
		levelClass = 'level1';
	} else if( alarmGrade == "MAJOR" ) { 
		levelClass = 'level2';
	} else if( alarmGrade == "MINOR" ) { 
		levelClass = 'level3';
	} else if( alarmGrade == "NORMAL" ) {
		levelClass = 'level4';
	}
	
	var equipType = message[19];
//	for(var index in equipInfo){
//		if(message[14] == equipInfo[index].EQUIP_NAME){
//			equipType = equipInfo[index].EQUIP_TYPE
//			equipNm = message[14];
//			break;
//		}else{
//			if(message[14] == 'EMS'){
//				equipNm = message[14];
//				break;
//			}else{
//				equipNm = '-';
//			}
//		}
//	}

	anomaly = anomaly+ "|" +equipType;
	var messageType = message[2];
	// 체크돼어있는 체크박스는 클릭을 못하도록 처리하라고 변경 (2019/07/23 윤정훈S)
	var checked = messageType == 'A'?'checked="checked" onchange="javascript:dontCheckChange(this)" disabled="disabled" ':' onchange="javascript:checkChange(this)" ';
	var checkedTag = ''
	if (messageType == 'A'){
		checkedTag = "<td >" 
						+"<div style='text-align:center' >"
							+"<input type='checkbox' data-key='" + key + "' name='alarmCognition '"+checked+">"
						+"</div>";
					+"</td>";
	}else{
		checkedTag = "<td>" 
						+"<div style='text-align:center' >"
							+"<input type='checkbox' data-key='" + key + "' name='alarmCognition '"+checked+">"
						+"</div>";
					+"</td>";
	}
	
	/* 실시간으로 알람테이블에 추가 */
	var stationInfoL = [];
	var systemStationName = "";
	var lineName = "";
	var lineId = "0";
	if (equipType == 11) {
		stationInfoL  = getStationNmInSwitch(message[3])
	} else if (equipType == 2) {
		stationInfoL = getStationNmInDuOrRu(message[3], message[7]);
	} else if(equipType == 17){
		systemStationName = message[7];
	} else if(equipType == 1 || equipType == 4 || equipType == 7){
		stationInfoL = getStationNameEpc(message[3], equipType);
	} else if(equipType == 36){ // 정류기
		stationInfoL = getStationNmInJrg(message[3]);
	} else{
		stationInfoL = getStationNmInEquip(message[3], equipType);
	}
	
	if (stationInfoL.length > 0){
		systemStationName = stationInfoL[0];
		lineName = stationInfoL[1];
		lineId = stationInfoL[2];
	}
	
	var alarmRow = "";
	//alarmRow += "<tr style='cursor:pointer;' onmousedown='javascript:fm.rightMenu.failureLocation(event, this,\"failureMain\")'>";
	if (lineIdFailureMain != '' && lineIdFailureMain != undefined){
		if (lineId.indexOf(lineIdFailureMain) < 0 ){
			alarmRow +=  "<tr style='display:none'>";
			lineIdFailureMainBoolean = false;
		}else{
			alarmRow +=  "<tr >";
			lineIdFailureMainBoolean = true;
		}
	}else{
		alarmRow += "<tr >";
		lineIdFailureMainBoolean = true;
	}
	alarmRow += 	"<td style='cursor:pointer;' class='stat tc' ><i class='mu-icon alram " + alarmGrade.toLowerCase() + "'></i>";
	alarmRow +=			"<input type='hidden' name='alarmId' value='" + alarmId + "' />";
	if (lineIdFailureMainBoolean){
		alarmRow += 		"<input type='hidden' name='alarmLevel' value='" + alarmLevel +"' />";
	}
	alarmRow += 		"<input type='hidden' name='alarmType' value='" + messageType+"_"+alarmLevel +"' />";
	alarmRow += 	"</td>";
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[4] + "'>" + message[4] + "</td>"; //alarmCode
	alarmRow +=		"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[5] + "'>" + message[5] + "</td>"; //alarm 설명
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[14] + "'>" + equipNm + "</td>"; //  //HardCoding
	// alarmRow += 	"<td class='overTxt' align='center' title='" + message[3] + "'>" + message[3] + "</td>"; //system_id
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[16] + "'>" + message[16] + "</td>"; //  //HardCoding
	
	/*alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + lineName + "'>" + lineName + "</td>"; // 호선명*/
	/*alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + systemStationName + "'>" + systemStationName + "</td>"; //station_name*/
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + setTimeStamp(message[9]) + "'>" + setTimeStamp(message[9]) + "</td>"; //datetime
	alarmRow +=		"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[7] + "'>" + message[7] + "</td>"; //location
	alarmRow += 	checkedTag
	alarmRow +=		"<td class='tc'>";
	alarmRow +=			"<button data-key='" + key + "' type='button' class='mu-btn mu-btn-icon mu-btn-icon-only' onclick='clearBtnClick(this); return false;'><i class='mu-icon trash'></i></button>";
	alarmRow += 	"</td>";
//	var _nowDate = new Date().format("MM월 dd일 HH시 mm분 ss초");
//	alarmRow += 	"<td title='"+_nowDate+"'>"+_nowDate+"</td>";
	alarmRow += "</tr>";
	
	/* 엑셀 Export를 위한 Invisible Table */
	var checkedText = messageType == 'A'?'인지':'';
	
	var excelRow = "";
	excelRow += "<tr style='cursor:pointer;'>";
	excelRow += 	"<td align='center' title='" + alarmGrade + "'>" + alarmGrade;
	excelRow += 		"<input type='hidden' name='alarmId' value='" + alarmId + "' />";
	excelRow += 	"</td>"; //alarmGrade
	excelRow += 	"<td align='center' title='" + message[4] + "'>" + message[4]; //alarmCode 
	excelRow +=		"<td align='center' title='" + message[5] + "'>" + message[5] + "</td>"; //alarm 설명
	excelRow += 	"<td align='center' title='" + message[14] + "'>" + equipNm + "</td>"; //  //HardCoding
	/*excelRow += 	"<td align='center' title='" + message[3] + "'>" + message[3] + "</td>"; //system_id*/
	excelRow += 	"<td align='center' title='" + message[16] + "'>" + message[16] + "</td>"; //  //HardCoding
	/*excelRow += 	"<td align='center' title='" + lineName + "'>" + lineName + "</td>"; //호선명*/ 
	/*excelRow += 	"<td align='center' title='" + systemStationName + "'>" + systemStationName + "</td>"; //station_name*/
	excelRow += 	"<td align='center' title='" + setTimeStamp(message[9]) + "'>" + setTimeStamp(message[9]) + "</td>"; //datetime
	excelRow += 	"<td align='center' title='" + message[7] + "'>" + message[7] + "</td>"; //location
	excelRow += 	"<td align='center' id='checkTxt' title='" + checkedText + "'>" + checkedText + "</td>"; //인지상태
	excelRow += "</tr>";
	
	var $alarmRow = $(alarmRow);
	$alarmRow.data('data', {
		systemId: message[3],
		alarmId: alarmId,
		alarmLevel: alarmLevel,
		equipType: equipType,
		location: message[7],
		systemNm : message[16],
		lineId: lineId
	});
	$("#tb_failure_alarm tbody").prepend($alarmRow);
	$("#excelTable tbody").prepend(excelRow);
	
	/*상단의 알람 카운트 갱신*/
	alarmCount(alarmLevel);
	
	/*알람 로우별로 이벤트 추가(버튼이 없는 컬럼에만 이벤트 추가. '해제'컬럼에는 버튼이벤트만 있어야 하므로)*/
	$("#tb_failure_alarm tbody tr").eq(0).find('td').each(function(){
		if($(this).find('button').length == 0 && $(this).find('div').length == 0){
			$(this).on("click",function(e){
				//failureDetailView($(this).parent().text());
				failureDetailView(anomaly,"main");
			});
		}
	});	
}
function dontCheckChange(obj){
	$(obj).prop('checked',!($(obj).prop('checked')));
	alert('인지 해제는 불가능합니다.');
}
function checkChange(obj){
	
	$(obj).prop('checked',!($(obj).prop('checked')));
	
	var key = $(obj).data('key');
	var values = key.split("|^|");
	var SYSTEM_ID = values[0];
	var ALARM_CODE = values[1];
	var ALARM_NAME = values[2];
	var GRADE = values[3];
	var LOCATION = values[4];
	var USER = values[5];
	var EVENT_TYPE = values[6];
	var SYSTEM_NAME = values[7];
	var VENDOR_ID = values[9];
//	var TEAM_ID = values[10];
	var EQUIP_TYPE = values[10];

	//PUT O|^|SYSTEM_ID|^|LOCATION|^|ALARM_CODE|^|ALARM_NAME|^|GRADE|^|TIME|^           |USER|^|EVENT_TYPE|^|SYSTEM_NAME|^|C_UID|^|VENDOR_ID|^|TEAM_ID|^|ETC
	var putMessage = "PUT A|^|" + SYSTEM_ID + "|^|" + LOCATION + "|^|" + ALARM_CODE + "|^|" + ALARM_NAME + "|^|" + GRADE + "|^|" + getTimeStamp_slash()
		+ "|^|" + USER + "|^|" + EVENT_TYPE + "|^|" + SYSTEM_NAME + "|^|0|^|" + VENDOR_ID + "|^|" + EQUIP_TYPE + "|^|" + "\n";

	ws_put.send(putMessage);
	$(obj).prop('checked',true);
	$(obj).attr('onchange','dontCheckChange(obj)');
//	alert('인지 상태로 변경했습니다.');
	failureInfoClearHistory(SYSTEM_NAME, ALARM_CODE,"A");
}

function clearAlarmGrid(msg){
	var message = msg.split("|^|");
	if(message.length < 20) {
		return;
	}
	var alarmId = message[1];

	var clearTargetLevel = [1,2,3,4];

	/*테이블에서 삭제*/
	$("#tb_failure_alarm tr input[name='alarmId'][value='" + alarmId + "']").parent().parent().remove();
	$("#excelTable tbody tr input[name='alarmId'][value='" + alarmId + "']").parent().parent().remove();
	/*상단의 알람 카운트 갱신*/
	
	for(var level in clearTargetLevel){
		alarmCount(level);
	}
	if($('#btn_alarmSound').hasClass('mu-toggle-on')){
		setAlarmSound();
	}
}

function addMajorAlarmGrid(msg){
	
	var message = msg.split("|^|");
	var time = message[9].substring(11,16);
	var date = message[9].split("-")[0].replace(/\//gi,"");
	var majorAlarmCode = message[4] + message[6]; // S1
	var alarmLevel = alarmLevelCheck(message[6]);
	var alarmGrade = getAlarmGrade(alarmLevel); //CRITICAL
	var equipNm = message[14];
	
	var anomaly = message[1] + "|" + message[3] + "|" + message[4] + "|" + message[6]; // SEQ ID | SYSTEM_ID | 알람코드 | 알람등급
	var majorAlarmId = message[1]; // SYSTEM_ID | LOCATION | 알람코드 | 알람등급 
	
	var equipType = message[19];
//	for(var index in equipInfo){
//		if(message[14] == equipInfo[index].EQUIP_NAME){
//			equipType = equipInfo[index].EQUIP_TYPE
//			equipNm = message[14];
//			break;
//		}else{
//			if(message[14] == 'EMS'){
//				equipNm = message[14];
//				break;
//			}else{
//				equipNm = '-';
//			}
//		}
//	}
	
	anomaly = anomaly+ "|" +equipType;
	
	var key = message[3] + "|^|" + message[4] + "|^|" + message[5] + "|^|" + message[6] + "|^|" + message[7] + "|^|" + $("#userId").val() + "|^|" + message[14] + "|^|" + message[16] + "|^|" + message[1] + "|^|" + message[18] + "|^|" + message[19];

	var messageType = message[2];
	// 체크돼어있는 체크박스는 클릭을 못하도록 처리하라고 변경 (2019/07/23 윤정훈S)
	var checked = messageType == 'A'?'checked="checked" onchange="javascript:dontCheckChange(this)" disabled="disabled"':' onchange="javascript:checkChange(this)" ';
	var checkedTag = ''
	if (messageType == 'A'){
		checkedTag = "<td >" 
						+"<div style='text-align:center' >"
							+"<input type='checkbox' data-key='" + key + "' name='alarmCognition '"+checked+">"
						+"</div>";
					+"</td>";
	}else{
		checkedTag = "<td>" 
						+"<div style='text-align:center' >"
							+"<input type='checkbox' data-key='" + key + "' name='alarmCognition '"+checked+">"
						+"</div>";
					+"</td>";
	}
	
	var alarmRow = "";
	
	var stationInfoL = [];
	var systemStationName = "";
	var lineName = "";
	var lineId = "0";
	if (equipType == 11) {
		stationInfoL  = getStationNmInSwitch(message[3]);
	} else if (equipType == 2) {
		stationInfoL = getStationNmInDuOrRu(message[3], message[7]);
	} else if(equipType == 17){
		systemStationName = message[7];
	} else if(equipType == 1 || equipType == 4 || equipType == 7){
		stationInfoL = getStationNameEpc(message[3], equipType);
	} else if(equipType == 36){ // 정류기
		stationInfoL = getStationNmInJrg(message[3]);
	}else{
		stationInfoL = getStationNmInEquip(message[3], equipType);
	}
	if (stationInfoL.length > 0){
		systemStationName = stationInfoL[0];
		lineName = stationInfoL[1];
		lineId = stationInfoL[2];
	}
	
	var alarmRow = "";
	//alarmRow += "<tr style='cursor:pointer;' onmousedown='javascript:fm.rightMenu.failureLocation(event, this,\"failureMain\")'>";
	if (lineIdFailureMain != '' && lineIdFailureMain != undefined){
		if (lineId.indexOf(lineIdFailureMain) < 0 ){
			alarmRow +=  "<tr style='display:none' onmousedown='javascript:fm.rightMenu.failureLocation(event,this)>";
		}else{
			alarmRow +=  "<tr onmousedown='javascript:fm.rightMenu.failureLocation(event,this)>";
		}
	}else{
		alarmRow += "<tr onmousedown='javascript:fm.rightMenu.failureLocation(event,this)>";
	}
	alarmRow += "<tr  onmousedown='javascript:fm.rightMenu.failureLocation(event,this)'>";
//	alarmRow += 	"<td align='center' title='" + majorAlarmCode + "'>" + majorAlarmCode;
	alarmRow += 	"<td style='cursor:pointer;' class='stat tc'><i class='mu-icon alram " + alarmGrade.toLowerCase() + "'></i>";
	alarmRow +=			"<input type='hidden' name='majorAlarmLevel' value='" + alarmLevel +"' />";
	alarmRow += 		"<input type='hidden' name='alarmType' value='" + messageType+"_"+alarmLevel +"' />";
					"</td>";
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[4] + "'>" + message[4];
	alarmRow +=			"<input type='hidden' name='majorAlarmId' value='" + majorAlarmId + "' />";
	alarmRow +=		"</td>";
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[14] + "'>" + equipNm + "</td>"; 					//equip_type
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + message[16] + "'>" + message[16] + "</td>"; 				//equip_name
	
	/*alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + lineName + "'>" + lineName + "</td>"; 	//호선명*/ 
	/*alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + systemStationName + "'>" + systemStationName + "</td>"; 	//station_name*/
	alarmRow += 	"<td style='cursor:pointer;' class='overTxt' align='center' title='" + setTimeStamp(message[9]) + "'>" + setTimeStamp(message[9]) + "</td>";
	alarmRow +=		checkedTag
	alarmRow += "</tr>";
	
	$("#tb_majorFailure_alarm tbody").prepend(alarmRow);

	//알람 로우별로 이벤트 추가
	$("#tb_majorFailure_alarm tbody tr").eq(0).find('td').each(function(){
		if($(this).find('div').length == 0){
			$(this).on("click",function(e){
				//failureDetailView($(this).parent().text());
				failureDetailView(anomaly,"major");
			});
		}
	});	
}


function clearMajorAlarmGrid(msg){
	var message = msg.split("|^|");
	if(message.length < 20) {
		return;
	}
	
	var majorAlarmId = message[1];
	
	/*테이블에서 삭제*/
	$("#tb_majorFailure_alarm tr input[name='majorAlarmId'][value='" + majorAlarmId + "']").parent().parent().remove();
	/*상단의 알람 카운트 갱신*/
//	alarmCount(alarmLevelCheck(message[6]));
}

function allClearAlarm() {
	if(!confirm('전체해제 하시겠습니까?')) {
		return;
	}
	$('#tb_failure_alarm > tbody > tr > td > button').each(function() {
		$(this).trigger('click');
	});
}

function clearBtnClick(obj){
	/* SYSTEM_ID | ALARM_CODE | ALARM_NAME | GRADE | LOCATION | USER | EVENT_TYPE | SYSTEM_NAME | ALARM_ID | VENDOR_ID | TEAM_ID(EQUIP_TYPE) */
	var key = $(obj).data('key');
	var values = key.split("|^|");
	var SYSTEM_ID = values[0];
	var ALARM_CODE = values[1];
	var ALARM_NAME = values[2];
	var GRADE = values[3];
	var LOCATION = values[4];
	var USER = values[5];
	var EVENT_TYPE = values[6];
	var SYSTEM_NAME = values[7];
	var ALARM_ID = values[8];
	var VENDOR_ID = values[9];
//	var TEAM_ID = values[10];
	var EQUIP_TYPE = values[10];

	var ALARM_TYPE = 4;
	
	var equipType = EQUIP_TYPE;
//	for(var index in equipInfo){
//		if(EVENT_TYPE == equipInfo[index].EQUIP_NAME){
//			equipType = equipInfo[index].EQUIP_TYPE
//			break;
//		}else{
//			equipNm = 99;
//		}
//	}

	//PUT O|^|SYSTEM_ID|^|LOCATION|^|ALARM_CODE|^|ALARM_NAME|^|GRADE|^|TIME|^|USER|^|EVENT_TYPE|^|SYSTEM_NAME|^|C_UID|^|VENDOR_ID|^|TEAM_ID|^|ETC
	var putMessage = "PUT D|^|" + SYSTEM_ID + "|^|" + LOCATION + "|^|" + ALARM_CODE + "|^|" + ALARM_NAME + "|^|" + GRADE + "|^|" + getTimeStamp_slash()
		+ "|^|" + USER + "|^|" + EVENT_TYPE + "|^|" + SYSTEM_NAME + "|^|0|^|" + VENDOR_ID + "|^|" + EQUIP_TYPE + "|^|" + "\n";
	
	/* putMessage : PUT D|^|1138|^|GigabitEthernet7/4|^|BCH08008|^|BUNCH OPEN|^|MAJOR|^|20160802104458|^|admin|^|스위치|^|ToSeong-001|^|0|^|4|^|1|^| */
	var requestData = {
		'ALARM_ID': ALARM_ID,
		'SYSTEM_ID': SYSTEM_ID,
		'ALARM_CODE': ALARM_CODE,
		'ALARM_NAME': ALARM_NAME,
		'GRADE': alarmLevelCheck(GRADE),
		'LOCATION': LOCATION,
		'USER': USER,
		'EVENT_TYPE': equipType,
		'EVENT_TIME': getTimeStamp_slash(),
		'SYSTEM_NAME': SYSTEM_NAME,
		'ALARM_TYPE': ALARM_TYPE,
		'VENDOR_ID': VENDOR_ID,
		'TEAM_ID': EQUIP_TYPE,
		'MESSAGE_TYPE': 3
	};

	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/failure/main/failureMain/insertDelMsg',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			if(data.returnFlag > 0) {
				ws_put.send(putMessage);
				failureInfoClearHistory(SYSTEM_NAME, ALARM_CODE,"D");
//				alert('알람을 해제했습니다.');
			}
		},
		error:function(data){

		}
	});
}

function failureInfoClearHistory(systemName, alarmCode, TYPE) {
	var param 
	if(TYPE == "D"){
		param = {
			'failureDesc': '고장알람해제(' + document.querySelector('.titleWrap > h3').textContent + '): ' + systemName + ': ' + alarmCode
		};
	}else {
		param = {
			'failureDesc': '고장알람인지(' + document.querySelector('.titleWrap > h3').textContent + '): ' + systemName + ': ' + alarmCode
		};
	}
	$.ajax({
		type:'post',
		url:'/failureClear/history/put',
		contentType: 'application/json',
		dataType:'json',
		data: JSON.stringify(param),
		success : function(data) {

		},
		error : function(request, status, err) {

		}
	});
}

function failureDetailView(anomaly,type){
	/*조치사례 및 고장상세 리스트 클릭이벤트*/
	
	/*anomaly = message[1] + "|" + message[3] + "|" + message[4] + "|" + message[6]; // SEQ ID | SYSTEM_ID | 알람코드 | 알람등급*/	
	
	/*고장상세 DB조회*/
	getFailureData(anomaly,type);
	
	/*조치사례 및 조치내용 DB조회*/
	var msg = anomaly.split("|");
	var alarmObj = { 
			ALARM_ID : msg[0],
			SYSTEM_ID : msg[1],
			ALARM_CODE : msg[2],
			EQUIP_TYPE : msg[4]
		};
	getAlarmActionCaseData(alarmObj);
	
	/*ROP메세지 DB조회*/
	getRopMsgData(msg[0]);
}

function alarmSound(){
	
	var alarmLevel = $('#failureAudioAlarmLevel').val();
	
	if($('#btn_alarmSound').hasClass('mu-toggle-on')){
		$('#btn_alarmSound').removeClass('mu-toggle-on');
		
		audioFunction.failureAudioPause();
	}else{
		$('#btn_alarmSound').addClass('mu-toggle-on');
		setAlarmSound();
	}
}

function setTimeStamp(datetime){ /*고장감시 화면에서 보여주는 타임포맷*/
	var result = "";
	result = datetime.substring(0,4) + "/" + datetime.substring(4,6) + "/" + datetime.substring(6,8) + " " 
			+ datetime.substring(8,10) + ":" + datetime.substring(10,12) + ":" + datetime.substring(12,14);
	return result;
}

function getTimeStamp_slash() { /*서버에 보내주는 타임포맷*/
	var d = new Date();
	var s =
		leadingZeros(d.getFullYear(), 4) +
		leadingZeros(d.getMonth() + 1, 2) +
		leadingZeros(d.getDate(), 2) +

		leadingZeros(d.getHours(), 2) +
		leadingZeros(d.getMinutes(), 2) +
		leadingZeros(d.getSeconds(), 2);
	return s;
}

function leadingZeros(n, digits) {
	  var zero = '';
	  n = n.toString();

	  if (n.length < digits) {
		for (var i = 0; i < digits - n.length; i++)
		  zero += '0';
	  }
	  return zero + n;
}

function excelReport() {
	
	var tab_text = 
		"<html>" +
		"<head>" +
		"<meta http-equiv='Content-Type' content='application/vnd.ms-excel;charset=utf-8'/>" +
		"</head>" +
		"<body>";
	
	tab_text+="<table border='2px'><tr>";
	var textRange; var j=0;
	tab = document.getElementById("excelTable"); // id of table
	
	for(j = 0 ; j < tab.rows.length ; j++) {
		
		tab_text = tab_text+tab.rows[j].innerHTML+"</tr>";
		//tab_text=tab_text+"</tr>";
	}

	tab_text=tab_text+"</table>" + "</body></html>";
	tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
	tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

	var table_html = encodeURIComponent(tab_text);
	var data_type = 'data:application/vnd.ms-excel';
   
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	// If Internet Explorer
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		//IE
		txtArea_failureAnalByTime.document.open("txt/html","replace");
		txtArea_failureAnalByTime.document.write(tab_text);
		txtArea_failureAnalByTime.document.close();
		txtArea_failureAnalByTime.focus();
		sa = txtArea_failureAnalByTime.document.execCommand("SaveAs",true,"고장목록.xls");
	} else {
		//CHROME
		var a = document.createElement('a');
		a.href = data_type + ', ' + table_html;
		a.download = '고장목록.xls';	   
		a.click();
	}
}

//기지국 통합 감시 현황 표 데이터

// 서버 상태관리, 서버프로세스관리, 수집관리 메뉴에 대한 사용자 권한 정보 get

function getUserAuth(){
	$.ajax({
		cache : false,
		type : 'get',
		url : '/integration/mainMonitor/getUserMenuAuth',
		dataTpye:'json',
		success	: function(data) {
			if(data.userAuthList != null){
				_.each(data.userAuthList, function(auth){
					userAuthInfo[auth.MENU_ID] = (auth.MENU_AUTH >= userAuth) ? true : false;
				});
			}
			
			// 서버 상태관리 && 서버프로세스 관리
			if(userAuthInfo['8010010'] || userAuthInfo['8010020']){
				$('#nmsSystemState').show();
			}else{
				$('#nmsSystemState').hide();
			}
			
			// 서버프로세스 관리
			if(userAuthInfo['8010020']){
				$('#serverProcessState').show();
			}else{
				$('#serverProcessState').hide();
			}
			
			// 서버 상태관리 ()
			if(userAuthInfo['8010010']){	
				$('#serverCondition').show();
			}else{
				$('#serverCondition').hide();
			}
			
			// 서버 수집관리
			if(userAuthInfo['8010030']){
				$('#dataCollectState').show();
			}else{
				$('#dataCollectState').hide();
			}
		},error: function () { 
			   //alert('에러발생');
		}
	});
}

function dataLoadMain() {

	getTopologyEquipInfoMain();
	getEquipInfo();
//	var switch_serverStat = 'Y';
	
//	var Now = new Date();
//	var NowTime = Now.getFullYear();
//	NowTime += '-' + (Now.getMonth() + 1) ;
//	NowTime += '-' + Now.getDate();
//	NowTime += ' ' + Now.getHours();
//	NowTime += ':' + Now.getMinutes();
//	NowTime += ':' + Now.getSeconds();
//	console.log('---------------- 시간 : '+NowTime+' ----------------')
	
	$.when(equipAjax, equipInfoAjax, serverStatAjax, recoverInfoAjax).done(function(equipData, equipInfoData, serverStatData, recoverData) {
//		startAlarmDetect();
		// 장비타입별로 active 상태가 하나라도 안될 경우 가청알림을 위한 object
		actSbyObj = {};
		
		
		// 전체 색깔 제거(du-2는 제외... du처리 부분에서 색깔 처리 함.)
		$('div.serverBox, div.serverBox > div.state, div.serverBox > div').not($('div.engineer')).not($('#du > div.state')).removeClass('yellow orange red');
//		$('div.serverBox, div.serverBox > div.state, div.serverBox > div').not($('#du-2 > div.state')).removeClass('yellow orange red normalgray normalblue');
		
		var duSwichActCount = 0;
		var newEquipData = [];
//		var tmpAlarmLevelList = [];
		var arrHSSAlarmLevel = [];
		var arrPCRFAlarmLevel = [];
		var arrMMEAlarmLevel = [];
		var arrSGWPGWAlarmLevel = [];
		var activeCount = 0;
		var standbyCount = 0;
		
		// EMS 데이터 EQUIP_TYPE 14로 변경 (14, 15, 16, 29, 30, 38, 39, 42, 49)
		$.each(equipData[0], function(i, o) {
			if([14, 15, 16, 29, 30, 38, 39, 42, 49].indexOf(o.EQUIP_TYPE) !== -1) {
				o.EQUIP_TYPE = 14;
			}
		});
		
//		// 주니퍼스위치중에 하나라도 server_start='N'일경우 장비상태표시  
//		$.each(switchData[0].use, function(i, o) {
//			if(o.SERVER_STAT === 'N') {
//				switch_serverStat = 'N';
//			}
//		})

		$.each(equipData[0], function(i, o) {
			var performanceAlarmLevel = 4;
			var performanceAlarmClass = 'yellow';	// yellow, orange, red
			
			$.each(equipInfo, function(j, val) {
				if(val.EQUIP_TYPE == o.EQUIP_TYPE) {
					equip_name = val.EQUIP_NAME;
					return false;
				}
			});

			// 서버 act sby 상태 표시를 위해 저장
			if(_.isEmpty(actSbyObj[o.EQUIP_TYPE])) {
				actSbyObj[o.EQUIP_TYPE] = [];
			}
			actSbyObj[o.EQUIP_TYPE].push(o.CURRENT_ACT_SBY);
			
			var tmpAlarmLevelList = [];
			var tmpServerStat = 'Y';
			var tmpServerStatArr = [];
			
			$.each(equipData[0], function(j, val) {
				if (o.EQUIP_TYPE == val.EQUIP_TYPE) {
					
//					tmpServerStatArr.push(val.SERVER_STAT);
//					if (val.SERVER_STAT == "N") {
//						tmpServerStat = "N";
//					}
					
					if(val.EQUIP_TYPE === 6) {
						// HSS
						if(val.DATA_DIAMETER_STACK) {
							tmpAlarmLevelList.push(val.DATA_DIAMETER_STACK.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_DIAMETER_STACK.SUCC_RATE_LEVEL);
						}
						if(val.DATA_S6A_INTERFACE) {
							tmpAlarmLevelList.push(val.DATA_S6A_INTERFACE.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_S6A_INTERFACE.SUCC_RATE_LEVEL);
						}
						if(val.DATA_S13_INTERFACE) {
							tmpAlarmLevelList.push(val.DATA_S13_INTERFACE.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_S13_INTERFACE.SUCC_RATE_LEVEL);
						}
						if(val.DATA_SP_INTERFACE) {
							tmpAlarmLevelList.push(val.DATA_SP_INTERFACE.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SP_INTERFACE.SUCC_RATE_LEVEL);
						}
					} else if(val.EQUIP_TYPE === 7) {
						// PCRF
						if(val.DATA_PCEF) {
							tmpAlarmLevelList.push(val.DATA_PCEF.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_PCEF.SUCC_RATE_LEVEL);
						}
						if(val.DATA_SPR) {
							tmpAlarmLevelList.push(val.DATA_SPR.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SPR.SUCC_RATE_LEVEL);
						}
						if(val.DATA_AF) {
							tmpAlarmLevelList.push(val.DATA_AF.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_AF.SUCC_RATE_LEVEL);
						}
					} else if(val.EQUIP_TYPE === 1) {
						// MME
						if(val.DATA_ATTACH) {
							tmpAlarmLevelList.push(val.DATA_ATTACH.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_ATTACH.SUCC_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_ATTACH.ANS_RATE_LEVEL);
						}
						if(val.DATA_SR) {
							tmpAlarmLevelList.push(val.DATA_SR.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SR.SUCC_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SR.ANS_RATE_LEVEL);
						}
					} else if(val.EQUIP_TYPE === 4) {
						// SGW/PGW
						if(val.DATA_PGW_CREATE) {
							tmpAlarmLevelList.push(val.DATA_PGW_CREATE.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_PGW_CREATE.SUCC_RATE_LEVEL);
						}
						if(val.DATA_PGW_DELETE) {
							tmpAlarmLevelList.push(val.DATA_PGW_DELETE.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_PGW_DELETE.SUCC_RATE_LEVEL);
						}
						if(val.DATA_PGW_MODIFY) {
							tmpAlarmLevelList.push(val.DATA_PGW_MODIFY.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_PGW_MODIFY.SUCC_RATE_LEVEL);
						}
						if(val.DATA_SGW_ATTACH) {
							tmpAlarmLevelList.push(val.DATA_SGW_ATTACH.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SGW_ATTACH.SUCC_RATE_LEVEL);
						}
						if(val.DATA_SGW_MODIFY) {
							tmpAlarmLevelList.push(val.DATA_SGW_MODIFY.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SGW_MODIFY.SUCC_RATE_LEVEL);
						}
						if(val.DATA_SGW_DELETE) {
							tmpAlarmLevelList.push(val.DATA_SGW_DELETE.ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(val.DATA_SGW_DELETE.SUCC_RATE_LEVEL);
						}
					} else if(o.EQUIP_TYPE === 10) {
						if(o.DATA_REC) {
							tmpAlarmLevelList.push(o.DATA_REC.CALL_ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(o.DATA_REC.CALL_SUCC_RATE_LEVEL);
							tmpAlarmLevelList.push(o.DATA_REC.PTT_ATT_RATE_LEVEL);
							tmpAlarmLevelList.push(o.DATA_REC.PTT_SUCC_RATE_LEVEL);
						}
					}
				}
			});
			// 성능 알람 처리
			
			/*if(o.EQUIP_TYPE === 6) {
				// HSS
				if(o.DATA_DIAMETER_STACK) {
					tmpAlarmLevelList.push(o.DATA_DIAMETER_STACK.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_DIAMETER_STACK.SUCC_RATE_LEVEL);
				}
				if(o.DATA_S6A_INTERFACE) {
					tmpAlarmLevelList.push(o.DATA_S6A_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_S6A_INTERFACE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_S13_INTERFACE) {
					tmpAlarmLevelList.push(o.DATA_S13_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_S13_INTERFACE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_SP_INTERFACE) {
					tmpAlarmLevelList.push(o.DATA_SP_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SP_INTERFACE.SUCC_RATE_LEVEL);
				}
			} else if(o.EQUIP_TYPE === 7) {
				// PCRF
				if(o.DATA_PCEF) {
					tmpAlarmLevelList.push(o.DATA_PCEF.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_PCEF.SUCC_RATE_LEVEL);
				}
				if(o.DATA_SPR) {
					tmpAlarmLevelList.push(o.DATA_SPR.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SPR.SUCC_RATE_LEVEL);
				}
				if(o.DATA_AF) {
					tmpAlarmLevelList.push(o.DATA_AF.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_AF.SUCC_RATE_LEVEL);
				}
			} else if(o.EQUIP_TYPE === 1) {
				// MME
				if(o.DATA_ATTACH) {
					tmpAlarmLevelList.push(o.DATA_ATTACH.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_ATTACH.SUCC_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_ATTACH.ANS_RATE_LEVEL);
				}
				if(o.DATA_SR) {
					tmpAlarmLevelList.push(o.DATA_SR.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SR.SUCC_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SR.ANS_RATE_LEVEL);
				}
			} else if(o.EQUIP_TYPE === 4) {
				// SGW/PGW
				if(o.DATA_PGW_CREATE) {
					tmpAlarmLevelList.push(o.DATA_PGW_CREATE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_PGW_CREATE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_PGW_DELETE) {
					tmpAlarmLevelList.push(o.DATA_PGW_DELETE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_PGW_DELETE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_PGW_MODIFY) {
					tmpAlarmLevelList.push(o.DATA_PGW_MODIFY.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_PGW_MODIFY.SUCC_RATE_LEVEL);
				}
				if(o.DATA_SGW_ATTACH) {
					tmpAlarmLevelList.push(o.DATA_SGW_ATTACH.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SGW_ATTACH.SUCC_RATE_LEVEL);
				}
				if(o.DATA_SGW_MODIFY) {
					tmpAlarmLevelList.push(o.DATA_SGW_MODIFY.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SGW_MODIFY.SUCC_RATE_LEVEL);
				}
				if(o.DATA_SGW_DELETE) {
					tmpAlarmLevelList.push(o.DATA_SGW_DELETE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SGW_DELETE.SUCC_RATE_LEVEL);
				}
			} else if(o.EQUIP_TYPE === 28) {
				// EPC-HOST
//				if(o.DEFAULT_ACT_SBY === 'A') {
//					$('.serverGroupStat .serverGroupL').removeClass('normal');
//					if(o.CURRENT_ACT_SBY === 'A') {
//						$('.serverGroupStat .serverGroupL').addClass('normal');
//					}
//				} else {
//					$('.serverGroupStat .serverGroupR').removeClass('normal');
//					if(o.CURRENT_ACT_SBY === 'A') {
//						$('.serverGroupStat .serverGroupR').addClass('normal');
//					}
//				}
			}*/
			
//			console.log(o.EQUIP_TYPE + " " + tmpAlarmLevelList);
//			console.log(o.EQUIP_TYPE + " " + tmpServerStatArr + " | " + tmpServerStat);
			if(!_.isEmpty(tmpAlarmLevelList)) {
				performanceAlarmLevel = _.min(tmpAlarmLevelList);
			}

			// 장비명, active, standby 처리
			var systemId = getSystemId({equipType:o.EQUIP_TYPE, systemId:o.SYSTEM_ID, systemNm:o.NODE});
//			var $equip = $('#equip_' + systemId + '_' + o.EQUIP_TYPE + '_' +  o.DEFAULT_ACT_SBY);
			var $equip = $('#equip_' + o.EQUIP_TYPE);
			if ( o.EQUIP_TYPE == 44 ){
				$equip = $('#equip_11');
			}
			
			
			// 알람 클래스 지정
			if(performanceAlarmLevel < 4) {
				if(performanceAlarmLevel === 1) {
					performanceAlarmClass = 'red';
				} else if(performanceAlarmLevel === 2) {
					performanceAlarmClass = 'orange';
				}
			}
//			console.log(o.VIEW_NAME + " #equip_" + systemId + "_" + o.EQUIP_TYPE + "_" +  o.DEFAULT_ACT_SBY + " performanceAlarmClass " + performanceAlarmClass);
//			console.log(o.VIEW_NAME + " #equip_" + o.EQUIP_TYPE + " performanceAlarmClass " + performanceAlarmClass);
			if($equip.length > 0 || o.EQUIP_TYPE == 44 ) {

				$equip.parent().find('span.stage').remove();
				
				if(performanceAlarmLevel < 4) {
					$equip.parent().prepend('<span class="stage ' + performanceAlarmClass + '" style="display:block;"></span>');
				}
				$equip.parent().data('performanceAlarmLevel', performanceAlarmLevel);
				$equip.parent().data('data', o);
				$equip.data('data', o);
				
				if($equip.parent().parent().hasClass('double')) {
					// 기존 색깔  class 다 지움
					/*$equip.removeClass('normalgray normalblue yellow orange red');
					if(o.CURRENT_ACT_SBY === 'A' || o.CURRENT_ACT_SBY === 'N') {
						$equip.addClass('normalblue');
					} else {
						$equip.addClass('normalgray');
					}
					
					// 성능알람 표시
					// 기존 성능알람 제거
					$equip.parent().find('span.stage').remove();
					
					if(performanceAlarmLevel < 4) {
						$equip.parent().prepend('<span class="stage ' + performanceAlarmClass + '"></span>');
					}
					$equip.parent().data('performanceAlarmLevel', performanceAlarmLevel);
					$equip.parent().data('data', o);
					$equip.data('data', o);

					// 서버 상태에 따라서 서버 색깔 바꿈.
					if(o.SERVER_STAT === 'N') {
						var colorClass = 'red';
						$equip.addClass(colorClass);
					}*/
				} else {
					// 성능알람 표시
					
					// 기존 색깔  class 다 지움
					$equip.find('div.state').removeClass('normalgray normalblue yellow orange red');
					
					if(o.EQUIP_TYPE == '11' || o.EQUIP_TYPE == '14' || o.EQUIP_TYPE == '44' ) {
						if(_.includes(actSbyObj[o.EQUIP_TYPE], 'A') || _.includes(actSbyObj[o.EQUIP_TYPE], 'N') ) {
							if(o.EQUIP_TYPE == '44'){
								$('#equip_11').find('div.state').addClass('normalblue');
							}else{
								$equip.find('div.state').addClass('normalblue');
							}
						} else {
							if(o.EQUIP_TYPE == '44'){
								$('#equip_11').find('div.state').addClass('normalgray');
							}else{
								$equip.find('div.state').addClass('normalgray');
							}
						}
					} else {
						if(_.includes(actSbyObj[o.EQUIP_TYPE], 'A') || _.includes(actSbyObj[o.EQUIP_TYPE], 'N')) {
							$equip.find('div.state').addClass('normalblue');
						} else {
							$equip.find('div.state').addClass('normalgray');
						}
					}
//					
//					// 기존 성능알람 제거
//					$equip.find('span.stage').remove();
//					if(performanceAlarmLevel < 4) {
//						$equip.prepend('<span class="stage ' + performanceAlarmClass + '"></span>');
//					}
//					$equip.data('data', o);
//					$equip.data('performanceAlarmLevel', performanceAlarmLevel);
				}
//				$equip.find('.tit').text(o.VIEW_NAME);

				// 서버 상태에 따라서 서버 색깔 바꿈.
//				if(o.SERVER_STAT === 'N') {
//				if (tmpServerStat == "N") {
//					var colorClass = 'red';
//					$equip.find('div.state').addClass(colorClass);
//				}
				
//				// 스위치장비상태 색깔바꿈
//				if (switch_serverStat == "N") {
//					var colorClass = 'red';
//					$('#equip_11').find('div.state').addClass(colorClass);
//				}
				
				if(o.EQUIP_TYPE == '1' || o.EQUIP_TYPE == '4' || o.EQUIP_TYPE == '6' || o.EQUIP_TYPE == '7') {
					$equip.parent().find('span.stage').attr("onClick","javascript:epcPerformOpen('"+equip_name+"','"+o.EQUIP_TYPE+"')");
				} else if(o.EQUIP_TYPE == '10') {
					$equip.parent().find('span.stage').attr("onClick","javascript:recPerformOpen()");
				}
			}
			if(o.DEFAULT_ACT_SBY == 'A' || o.DEFAULT_ACT_SBY == 'N') {
				if(performanceAlarmLevel == 1) _pCriticalCnt++;
				else if(performanceAlarmLevel == 2) _pMajorCnt++;
				else if(performanceAlarmLevel == 3) _pMinorCnt++;
				
			}
			
		});
		var activeOkCount = '0';
		var activeNokCount = '0';
		if (serverStatData[1] === 'success'){
//			activeOkCount = serverStatData[0].OK
//			activeNokCount = serverStatData[0].NOK
			activeOkCount = serverStatData[0].serverStatList[0].CNT;
			activeNokCount = serverStatData[0].serverStatList[1].CNT;
		}
		$("#activeState1").html('<i class="mu-icon alarm normal"></i>' + activeOkCount);
		$("#activeState2").html('<i class="mu-icon alarm gray"></i>' + activeNokCount);
		
		if (Object.keys(failureAlarmData).length > 0){
			for ( var equipType in failureAlarmData){
				var $equip = $('#equip_' + equipType);
				if(failureAlarmData[equipType]['CRITICAL'] >= 1 && ( MAINMONITOR.filterLevel >= 1 || MAINMONITOR.filterLevel == 0) ) {
					colorClass = 'red';
				} else if(failureAlarmData[equipType]['MAJOR'] >= 1 && ( MAINMONITOR.filterLevel >= 2 || MAINMONITOR.filterLevel == 0) ) {
					colorClass = 'orange';
				} else if(failureAlarmData[equipType]['MINOR'] >= 1 && ( MAINMONITOR.filterLevel >= 3 || MAINMONITOR.filterLevel == 0)  ) {
					colorClass = 'yellow';
				} else{
					colorClass = 'normal';
				}
				if (equipType == 2){
					$equip = $('#du');
				}else if (equipType == 3){
					equipType = 2;
					equipNm = 'RU';
					$equip = $('#ru');
				}
				if (colorClass != 'normal'){
					var $engineer = $equip.find('div.engineer');
					$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
				}
			}
		}
		
		
		getTopologyDuInfo();

//		startAlarmDetect();
//		setEquipAlarm();
//		getNodeList(sioefData);
		getStateData();
		getNMSStateData();
		getDataCount("1");		
		getDataCount("2");
		
		setRecoverData(recoverData[0].recoverInfoList);
	});
}

//알람필터 확인버튼클릭후 실행절차
function filterSaveSearch(flag, filterLevel) {
	MAINMONITOR.filterLevel = filterLevel;	
//	if(ws){
////		console.log('filter socket close');
//		isView = false;
//		ws.close();
//		setTimeout(function() {startAlarmDetect();},1000);
//	}
	
//	failureAlarmCount = {'CRITICAL':0, 'MAJOR':0, 'MINOR':0};
	dataLoadMain();
	setEquipAlarm();
	
}

function intervalSet(){
	var intervalId = setInterval('dataLoadMain()', 1000*30);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
	if(!$('#repeatBtn').hasClass('mu-toggle-on')){
		$('#repeatBtn').addClass('mu-toggle-on');
	}
	
	failureAlarmCount = {'CRITICAL':0, 'MAJOR':0, 'MINOR':0};
	failureAlarmData = {};
	dataLoadMain();
	startAlarmDetect();
}

function intervalDelete(){
	clearInterval($('#repeatBtn').val());
	$('#repeatBtn').attr('onclick','javascript:intervalSet()');
	
	if($('#repeatBtn').hasClass('mu-toggle-on')){
		$('#repeatBtn').removeClass('mu-toggle-on');
	}
	
	if(ws){
		isView = false;
		ws.close();
	}
}

function failureOpen(equipName, equipType){
	var win = window.top || window;
	// 스위치, EMS는 equipName 보내지 않음.
	win.name = JSON.stringify({equipName : equipName, equipType : equipType});
	pageMove('/failure/main/failureMain');
}

function accessPerformOpen(equipName, equipType){
	var win = window.top || window;
	win.name = JSON.stringify({equipName : equipName, equipType : equipType});
	pageMove('/pm/pm_monitor/access_monitor');
}

function epcPerformOpen(equipName, equipType){
	var win = window.top || window;
	win.name = JSON.stringify({equipName : equipName, equipType : equipType});
	pageMove('/pm/pm_monitor/epc_monitor');
}

function recPerformOpen(){
	var win = window.top || window;
	pageMove('/pm/pm_monitor/record_monitor');
}

function sysStateManagerGo(){
	pageMove("/system/sysStateManager");
} 

function sioefProcessManageGo(){ 
	pageMove("/system/sioefProcessManage");
} 

function failureMainGo(){
	pageMove("/failure/main/failureMain");
} 

function accessMonitorGo(){
	pageMove("/pm/pm_monitor/access_monitor");
} 

function sysstateGo(){
	pageMove("/integration/monitor/sysstate");
}

function networkGo(){
	pageMove("/integration/monitor/network");
}

function sysColManagerConfigGo(){
	pageMove("/system/sysColManagerConfig");
}

function sysColManagerPerformGo(){
	pageMove("/system/sysColManagerPerform");
}
function pageMove(uri){

	var orgUri = uri;
	if (uri === '/system/sysColManagerConfig' || uri === '/system/sysColManagerPerform'){
		uri = '/system/sysColManager'; 
	}
	var menuId = '';
	var parentId = '';
	var menuName = '';
	var menuPath = '';

	for(var j = 0, menuLength = menuList.length; j < menuLength; j += 1) {
		if(menuList[j].MENU_URI === uri) {
			menuId = menuList[j].MENU_ID;
			menuName = menuList[j].MENU_NAME;
			parentId = menuList[j].PARENT_ID;
			break;
		}
	}

	menuPath = ' | ' + menuName;
	menu.menuRecur(menuPath, parentId);

	document.getElementById('menu-path').value = menu.menuPath;
	document.getElementById('menu-title').value = menuName;
	document.getElementById('page-title').value = 'LTE-M | ' + menu.menuPath;
	document.getElementById('menu-id').value = menuId;

	document.menuForm.target = '';

	document.menuForm.action = orgUri;
	document.menuForm.submit();
}

function getStateData(){
	
	var filterLevel = 4;
	var pageFlag = 1;
	
	$.ajax({
		type : 'post',
		url: '/integration/monitor/sysstate/getStateData',
		dataType: "json",
		data : {
			filterLevel : filterLevel,
			pageFlag : pageFlag
		},
		success: function (data) {
			var stateData = data.getStateData.stateData;
			var vmStateData = data.getVmStateData.vmStateData;
			var criticalCount = 0;
			var majorCount = 0;
			var minorCount = 0;
			
			$(stateData).each(function(i,value){
				var maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				if(value.MAX_LEVEL == 1){
					criticalCount++;
				}else if(value.MAX_LEVEL == 2){
					majorCount++;
				}else if(value.MAX_LEVEL == 3){
					minorCount++;
				}
				
				
			});
			
			$(vmStateData).each(function(i,value){
				
				var maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				if(value.MAX_LEVEL == 1){
					criticalCount++;
				}else if(value.MAX_LEVEL == 2){
					majorCount++;
				}else if(value.MAX_LEVEL == 3){
					minorCount++;
				}
				
				
			});
			$("#serverState1").html('<i class="mu-icon alarm critical"></i>' + criticalCount);
			$("#serverState2").html('<i class="mu-icon alarm major"></i>' + majorCount);
			$("#serverState3").html('<i class="mu-icon alarm minor"></i>' + minorCount);
			
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function getNMSStateData(){
	if(!userAuthInfo['8010010']){	// 권한 없을 경우
		return;
	}
	
	var filterLevel = 4;
	var pageFlag = 2;
	
	$.ajax({
		   type : 'post',
		   url: '/integration/mainMonitor/getStateData',
		   dataType: "json",
		   data : {
			   filterLevel : filterLevel,
			   pageFlag : pageFlag
		   },
		   success: function (data) {
			   var num = 0;
			   var maxDateTime = data.getStateData.maxDateTime;
			   var stateData = data.getStateData.stateData;
			   var maxDiskCnt = data.getStateData.maxDiskCnt;
			   
			   var criticalCount = 0;
			   var majorCount = 0;
			   var minorCount = 0;
			   
			   var nowDateTime = new Date();
			   
			   var fristRowIndex = $('#rowIndex').val();
			   $(stateData).each(function(i,value){
				   var maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				   if(value.MAX_LEVEL == 1){
					   criticalCount++;
				   }else if(value.MAX_LEVEL == 2){
					   majorCount++;
				   }else if(value.MAX_LEVEL == 3){
					   minorCount++;
				   }
				   
				   
			   });
			   
			   $("#nmsServerState1").html('<i class="mu-icon alarm critical"></i>' + criticalCount);
			   $("#nmsServerState2").html('<i class="mu-icon alarm major"></i>' + majorCount);
			   $("#nmsServerState3").html('<i class="mu-icon alarm minor"></i>' + minorCount);
			   
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getDataCount(flag){
//	var radios = $('[name="search_col"]');
//	var flag; //1 : 구성, 2 : 성능, 3 : 고장
//	$.each(radios, function(){
//		if ( $(this).is(':checked') ) {
//			if ( $(this).val() == 'config' ) {
//				flag = "1";
//			}
//			else if ( $(this).val() == 'perform' ) {
//				flag = "2";
//			}
//			return;
//		}
//	});
	
	if(!userAuthInfo['8010030']){	// 권한 없을경우 
		return;
	}
	
	var optionData  = { data : flag };
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		   type : 'post',
		   url: '/integration/mainMonitor/radioSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {
			   
			   
			   var nowTime = new Date();
			   var nowDate = nowTime.format("yyyy-MM-dd HH:mm:ss");
			   var collectData = data.getColData.colData;
			   var ok  = 0;
			   var nok = 0;
				
			   var thdMap = data.getColData.getTHD;
				
				
//			   $('#nowDateTime').html('감시시간 : ' + nowDate);
			   
			   var maxTime;
			   $.each(collectData, function(i, o){
				   var colTime  = new Date(o.COLLECT_DATE); //수집시간
				   var cal_time = ( (nowTime - colTime) / 1000 ) / 60 ;
				   var col_stat;
				   
				   if (i == 0) {
					   maxTime = colTime;
				   }
//				   console.log("colTime " + colTime);
				   $.each(thdMap, function(i, thd){
					   
//					   colthd[i] = thd;
						
					   if ( thd.COLLECT_TYPE == o.COLLECT_TYPE ){
						   
						   if ( cal_time <= thd.COLLECT_THD ) { 
							   //임계치보다 작거나 같은 경우, 완료
							   ok++;
						   } else {
							   //임계치보다 큰 경우, 지연
							   nok++;
						   }
					   }
				   });
				
				   if (colTime >= maxTime) {
					   maxTime = colTime;
				   }
			   });
//			   console.log("maxTime " + maxTime);
			   if (flag == "1") {
				   $("#organizationCount1").html('<i class="mu-icon alarm normal"></i>' + ok);
				   $("#organizationCount2").html('<i class="mu-icon alarm critical"></i>' + nok);
			   } else if (flag == "2") {
				   $("#dataPerformanceCount1").html('<i class="mu-icon alarm normal"></i>' + ok);
				   $("#dataPerformanceCount2").html('<i class="mu-icon alarm critical"></i>' + nok);
			   }
			   

		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setRecoverData(recoverInfoList){
	$('#recoverFailureGrid').empty();
	$('.clearmessage').css('display','block')
	if (recoverInfoList.length > 0 ){
		$('.clearmessage').css('display','none')
		var appendTr = '';
		$(recoverInfoList).each(function(i,value){
			appendTr += "<tr>";
			appendTr += 	"<td class='stat tc' ><i class='mu-icon alram " + recoverInfoList[i].SEVERITY.toLowerCase() + "'></i></td>";
			appendTr += 	"<td title=' 알람코드 : " + recoverInfoList[i].ALARM_CODE + "&#10;알람명    : "+ recoverInfoList[i].PROBABLE_CAUSE+ "&#10;발생위치 : "+ recoverInfoList[i].FDN+"'>" + recoverInfoList[i].ALARM_CODE + "</td>";
			appendTr += 	"<td title=' 장비타입 : " + recoverInfoList[i].EQUIP_NAME + "&#10;장비명    : "+ recoverInfoList[i].SYSTEM_NAME+"'>" + recoverInfoList[i].EQUIP_NAME + "</td>";
			appendTr += 	"<td title='" + recoverInfoList[i].STATION_NAME + "'>" + recoverInfoList[i].STATION_NAME + "</td>";
			appendTr += 	"<td title='" + recoverInfoList[i].EVENT_TIME + "'>" + recoverInfoList[i].EVENT_TIME + "</td>";
			appendTr += 	"<td title='" + recoverInfoList[i].RECOVER_TIME + "'>" + recoverInfoList[i].RECOVER_TIME + "</td>";
			appendTr += "</tr>";
		})
		$('#recoverFailureGrid').append(appendTr);
	}
}

function PerformanceAlarmCount() {
	/* 등급별 알람 개수 갱신 */
	var criticalcnt = 0;
	var majorcnt = 0;
	var minorcnt = 0;
	
	var minCriticalCnt = 0;
	var minMajorcntCnt = 0;
	var minMinorcntCnt = 0;
	
	var failureMinlevel = 4;
	
	if ($("#tb_failure_alarm tr input[name='alarmLevel'][value='1']").length > 0) {
		criticalcnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='1']").length;
		minCriticalCnt = criticalcnt - $("#tb_failure_alarm tr input[name='alarmType'][value='A_1']").length;
	}
	if ($("#tb_failure_alarm tr input[name='alarmLevel'][value='2']").length > 0) {
		majorcnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='2']").length;
		minMajorcntCnt = majorcnt - $("#tb_failure_alarm tr input[name='alarmType'][value='A_2']").length;
	}
	if ($("#tb_failure_alarm tr input[name='alarmLevel'][value='3']").length > 0) {
		minorcnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='3']").length;
		minMinorcntCnt = minorcnt - $("#tb_failure_alarm tr input[name='alarmType'][value='A_3']").length;
	}
	
	if(minCriticalCnt > 0) failureMinlevel = 1;
	else if(minMajorcntCnt > 0) failureMinlevel = 2;
	else if(minMinorcntCnt > 0) failureMinlevel = 3;
	else failureMinlevel = 4;
	
	if($('#failureAudioAlarmLevel').val() != failureMinlevel) {
		$('#failureAudioAlarmLevel').val(failureMinlevel);
		mainAudioFunction(1);
	}
	
	
	$("#performanceCount1").html('<i class="mu-icon alarm critical"></i>' + _pCriticalCnt);
	$("#performanceCount2").html('<i class="mu-icon alarm major"></i>' + _pMajorCnt);
	$("#performanceCount3").html('<i class="mu-icon alarm minor"></i>' + _pMinorCnt);
	
	// 최초에 여러번 호출 되는것을 방지하기 위해 타임아웃 처리
	
	
//	window.clearTimeout(alarmRefreshTimeout);
//	alarmRefreshTimeout = window.setTimeout(function() {
//		setEquipAlarm();
//	}, 300);
}