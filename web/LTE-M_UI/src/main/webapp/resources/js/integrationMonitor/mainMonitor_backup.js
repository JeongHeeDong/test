var equipAjax;
var duruAjax;
var equipInfoAjax;
var equipInfo;
var switchAjax;
var _pCriticalCnt = 0;
var _pMajorCnt = 0;
var _pMinorCnt = 0;
var alarmFilter = 0;
var ws;
var remind = '';
var MAINMONITOR = {filterLevel : 3};
var actSbyObj = {};

$(document).ready(function(){
	$(".state").css('cursor','default');
	
	//$(".titleWrap").css('display','none');
	var alarmVolumes = getAlarmVolume();
	//토폴로지 가청 오디오 세팅
	audioFile.criticalaudio.src='/criticalAlarm';
	audioFile.criticalaudio.load();
	audioFile.criticalaudio.volume = alarmVolumes.P_CRITICAL_VOLUME/100;

	audioFile.majoraudio.src='/majorAlarm';
	audioFile.majoraudio.load();
	audioFile.majoraudio.volume = alarmVolumes.P_MAJOR_VOLUME/100;

	audioFile.minoraudio.src='/minorAlarm';
	audioFile.minoraudio.load();
	audioFile.minoraudio.volume = alarmVolumes.P_MINOR_VOLUME/100;

	//고장정보 가청 오디오 세팅
	audioFile.f_criticalaudio.src='/criticalFailureAlarm';
	audioFile.f_criticalaudio.load();
	audioFile.f_criticalaudio.volume = alarmVolumes.F_CRITICAL_VOLUME/100;

	audioFile.f_majoraudio.src='/majorFailureAlarm';
	audioFile.f_majoraudio.load();
	audioFile.f_majoraudio.volume = alarmVolumes.F_MAJOR_VOLUME/100;

	audioFile.f_minoraudio.src='/minorFailureAlarm';
	audioFile.f_minoraudio.load();
	audioFile.f_minoraudio.volume = alarmVolumes.F_MINOR_VOLUME/100;
	
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
		
	}, 60000);
	
});



function dataLoad() {

	getTopologyEquipInfo();
	getEquipInfo();
//	var switch_serverStat = 'Y';
	
	$.when(equipAjax, equipInfoAjax, sioefAjax, serverStatAjax).done(function(equipData, equipInfoData, sioefData, serverStatData) {
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
		
		// EMS 데이터 EQUIP_TYPE 14로 변경 (14, 15, 16, 29, 30, 38, 39, 42)
		$.each(equipData[0], function(i, o) {
			if([14, 15, 16, 29, 30, 38, 39, 42].indexOf(o.EQUIP_TYPE) !== -1) {
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
						if(_.includes(actSbyObj[o.EQUIP_TYPE], 'S')) {
							if(o.EQUIP_TYPE == '44'){
								$('#equip_11').find('div.state').addClass('normalgray');
							}else{
								$equip.find('div.state').addClass('normalgray');
							}
						} else {
							if(o.EQUIP_TYPE == '44'){
								$('#equip_11').find('div.state').addClass('normalblue');
							}else{
								$equip.find('div.state').addClass('normalblue');
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
			activeOkCount = serverStatData[0].OK
			activeNokCount = serverStatData[0].NOK
		}
		$("#activeState1").html('<i class="mu-icon alarm normal"></i>' + activeOkCount);
		$("#activeState2").html('<i class="mu-icon alarm critical"></i>' + activeNokCount);
		
		getTopologyDuInfo();

		startAlarmDetect();
		getNodeList(sioefData);
		getStateData();
		getNMSStateData();
		getDataCount("1");		
		getDataCount("2");
	});
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

function getNodeList(sioefData){
	var hostInfo =[];
//	var hostInfo =[
//		'10.240.203.100:30000',
//		'10.240.203.100:30001',
//		'10.240.203.100:30002',
//		'10.240.203.100:30003',
//		'10.240.203.100:30004',
//		'10.240.203.100:30006',
//		'10.240.203.101:30001',
//		'10.240.203.101:30002',
//		'10.240.203.101:30004',
//		'10.240.203.102:30000',
//		'10.240.203.102:30003',
//		'10.240.203.102:30006'
//	];
	
	$(sioefData[0].protList).each(function(i,value){
		hostInfo.push(value.HOST_IP +':'+value.SIOEF_PORT)
	})
	
	var hostString = "";
//	hostString = "\"";
	$(hostInfo).each(function(i,value){
		hostString += "'" + value + "'";
		if (i != hostInfo.length - 1) {
			hostString += ",";
		}
//		console.log(hostString);
	});
//	hostString += "\"";
	
	var optionData  = {
		hostInfo : hostString,
		searchValue : "", 
		searchType : "procName",
		searchStatus : "", 
		searchGroup : ""
	};
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/integration/mainMonitor/getSioefStateData',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {
			   var actCnt = 0;
			   var trmCnt = 0;
			   var nodeList = data.nodeList;
			   
			   $(nodeList).each(function(i,value){
				   if(value['PROCESS_STATUS'].indexOf('ACT') !== -1){
					   actCnt = value['CNT'];
					} else {
						trmCnt = value['CNT'];
					}
			   });
			   
			   $("#nmsProcessCount1").html('<i class="mu-icon alarm normal"></i>' + actCnt);
			   $("#nmsProcessCount2").html('<i class="mu-icon alarm critical"></i>' + trmCnt);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getNMSStateData(){
	
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
			   var maxDate = maxTime.format("yyyy-MM-dd HH:mm:ss");
			   if (flag == "1") {
				   $("#organizationCount1").html('<i class="mu-icon alarm normal"></i>' + ok);
				   $("#organizationCount2").html('<i class="mu-icon alarm critical"></i>' + nok);
				   $("#organizationCountDate").text(maxDate);
			   } else if (flag == "2") {
				   $("#dataPerformanceCount1").html('<i class="mu-icon alarm normal"></i>' + ok);
				   $("#dataPerformanceCount2").html('<i class="mu-icon alarm critical"></i>' + nok);
				   $("#processCountDate").text(maxDate);
			   }
			   

		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getEquipInfo(){
	equipInfoAjax = $.ajax({
		type : 'post',
		url: '/failure/mapping/getEquipInfo',
		dataType: "json",
		success: function (data) {
			equipInfo = data.getEquipInfo;
		},
		error: function () {
			//alert('에러발생');
		}
	});
}

function getTopologyEquipInfo() {
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
			console.log(data);
		},
		error : function() {
		}
	});
	
	// switch장비들 server_stat 체크
	switchAjax = $.ajax({
		cache : false,
		type : 'post',
		url : '/integration/monitor/network/switch/portInformation',
		contentType: 'application/json',
		dataType : 'json',
		data: JSON.stringify(requestData)
	});
	
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
			
			_pCriticalCnt += getData.DU_CRITICAL + getData.RU_CRITICAL;
			_pMajorCnt += getData.DU_MAJOR + getData.RU_MAJOR;
			_pMinorCnt += getData.DU_MINOR + getData.RU_MINOR;
			
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
			setEquipAlarm();
			alarmCount();
			mainAudioFunction(0);
			
		},
		error : function() {
		}
	});
}

function startAlarmDetect(){
	isView = true;
	startWebSocket(function(){
		console.log("START ALARM DETECTION");
	});
}

function startWebSocket(next_fn) {
	if ("WebSocket" in window) {
		if(!ws || !(ws.readyState == 1)){
			ws = new WebSocket("ws://" + $("#localIp").val() + ":" + $("#websocketPort").val() +"/websocket");
			ws.onopen = function() {
				if(next_fn){
					next_fn();
					$("#tb_failure_alarm tbody tr").remove();
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
}

function msgCheck(msg) {
	var message = msg.split("|^|");
	if(message.length < 20) {
		return;
	}
	
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
	}
	if(message[2] == "O" || message[2] == "A"){
		
		var isAlarmView = true;
		var isMajorAlarmView = false;
		
		var equipType = 99;	

		for(var index in equipInfo){
			if(message[14] == equipInfo[index].EQUIP_NAME){
				equipType = equipInfo[index].EQUIP_TYPE
			}
		}
		
		// S 알람 미표시
		if(message[4].indexOf('S') === 0) {
			isAlarmView = false;
		}
		
		if(MAINMONITOR.filterLevel != 0 && MAINMONITOR.filterLevel < alarmLevelCheck(message[6])){
			isAlarmView = false;
		}
		
		if(message[0]=="UPDATE"){
			clearAlarmGrid(msg);
		}
		if(isAlarmView){
			if($('#alarmBtn').hasClass('mu-toggle-on')){
				if( message[2] != "A"){
					var level = alarmLevelCheck(message[6])
					audioFunction.failureAudioOnePlay(level);
				}
			}
			addAlarmGrid(msg);
		}
	}
	
};


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
	
	/* 알람을 '삭제'할때 필요 ->  SYSTEM_ID | ALARM_CODE | ALARM_NAME | GRADE | LOCATION | USER | EVENT_TYPE | SYSTEM_NAME | ALARM_ID | VENDOR_ID | TEAM_ID (서버에서 필요로 하는 정보) */
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
	
	var equipType = 99;
	for(var index in equipInfo){
		equipType = equipInfo[index].EQUIP_TYPE
		if(message[14] == equipInfo[index].EQUIP_NAME  ){
			equipNm = message[14];
			break;
		}else{
			if(message[14] == 'EMS'){
				equipNm = message[14];
				break;
			}else{
				equipNm = '-';
			}
		}
	}

	var messageType = message[2];
	
	/* 실시간으로 알람테이블에 추가 */
	var alarmRow = "";
	alarmRow += "<tr>";
	alarmRow += 	"<td class='stat tc'><i class='mu-icon alram " + alarmGrade.toLowerCase() + "'></i>";
	alarmRow +=			"<input type='hidden' name='alarmId' value='" + alarmId + "' />";
	alarmRow += 		"<input type='hidden' name='alarmLevel' value='" + alarmLevel +"' />";
	alarmRow += 		"<input type='hidden' name='alarmType' value='" + messageType+"_"+alarmLevel +"' />";
	alarmRow += 	"</td>";
	alarmRow += 	"<td class='overTxt' align='center' title='" + message[4] + "'>" + message[4] + "</td>"; //alarmCode
	alarmRow +=		"<td class='overTxt' align='center' title='" + message[5] + "'>" + message[5] + "</td>"; //alarm 설명
	alarmRow += 	"<td class='overTxt' align='center' title='" + message[14] + "'>" + equipNm + "</td>"; //  //HardCoding
	alarmRow += 	"<td class='overTxt' align='center' title='" + message[16] + "'>" + message[16] + "</td>"; //  //HardCoding
	alarmRow += "</tr>";
	
	var $alarmRow = $(alarmRow);
	$alarmRow.data('data', {
		systemId: message[3],
		alarmId: alarmId,
		alarmLevel: alarmLevel,
		equipType: equipType,
		location: message[7],
		equipNm : message[14],
		systemNm : message[16]
	});
	$("#tb_failure_alarm tbody").prepend($alarmRow);
	
	/*상단의 알람 카운트 갱신*/
	
	alarmCount();
	setEquipAlarm();
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
	alarmCount();
	setEquipAlarm();
}

function alarmCount() {
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
	
//	$('#cntLevel1').text(_pCriticalCnt + criticalcnt);
//	$('#cntLevel2').text(_pMajorCnt + majorcnt);
//	$('#cntLevel3').text(_pMinorCnt + minorcnt);
	
	$("#troubleCount1").html('<i class="mu-icon alarm critical"></i>' + criticalcnt);
	$("#troubleCount2").html('<i class="mu-icon alarm major"></i>' + majorcnt);
	$("#troubleCount3").html('<i class="mu-icon alarm minor"></i>' + minorcnt);
	
	$("#performanceCount1").html('<i class="mu-icon alarm critical"></i>' + _pCriticalCnt);
	$("#performanceCount2").html('<i class="mu-icon alarm major"></i>' + _pMajorCnt);
	$("#performanceCount3").html('<i class="mu-icon alarm minor"></i>' + _pMinorCnt);
}

function setEquipAlarm() {
	// 알람 그리드 정보를 기준으로 장비 색깔 표시
	// 고장알람 관련 색깔 제거
	$('div.serverBox > div.state').each(function() {
		var data = $(this).parent().data('data');
		//console.log(data);
		if(data) {
			$(this).removeClass('yellow orange red');
		}
	});
	// 엔지니어 제거
	$('div.serverGroup, div.serverModel').find('div.engineer').remove();
	// 고장 알람 레벨 삭제
	// 1. active 확인
	// 2. standby 확인
	// 3. 단일서버 확인
	$('div.serverBox > div.state').removeClass('yellow orange red');
	$('#tb_failure_alarm tbody tr').each(function(i, e) {
//		
		
		var data = $(e).data('data');
		
//		if(data.equipType == 28) {
//			// EPC-HOST
//			$('.serverGroupStat serverGroupL');
//		}
		var failureAlarmLevel = data.alarmLevel;
		var systemId = getSystemId(data);
		var equipType = data.equipType;
		
		
		if(data.equipType == 14 || data.equipType == 15 || data.equipType == 16
				|| data.equipType == 29 || data.equipType == 30) {
			equipType = 14;
		}
		
		//system id 701, 702는 hss장비 아이디로 각각 901, 902장비 위치에 할당
//		if(systemId === 701) systemId = 901;
//		else if(systemId === 702) systemId = 902;
		// HSS 는 901 아이디로 할당
		if(equipType == 6) systemId = '901';
		
//		var $equip = $('#equip_' + systemId + '_' + equipType + '_A');
		var $equip_A = $('#equip_' + systemId + '_' + equipType + '_A');
		var $equip_S = $('#equip_' + systemId + '_' + equipType + '_S');
		var $equip = $('#equip_' + equipType);

		
		// system id 가 같을 경우 현재 active, standby 체크해서 active 에 알람 표시
		// 이중화 장비 알람색깔 처리 변경(2017-06-28)
		// A A : 둘다 표시
		// S S : 둘다 표시
		// A S : A에 표시
		var type = getDuRuType(data);
		
		if(type == '2' || type == '3'){
//			if (type == 2) $equip = $('#du-2');
//            else if (type == 3) $equip = $('#ru-3');
			if (type == 2) $equip = $('#du');
            else if (type == 3) $equip = $('#ru');
		} else {
			if ($equip_A.length === 1 && $equip_S.length === 1) {
				if(!$equip_A.data('data')) {
					return false;
				}
				if ($equip_A.data('data').CURRENT_ACT_SBY === 'A') {
					$equip = $equip_A;
				} else {
					$equip = $equip_S;
				}
			}
			
			if ($equip.length === 0) {
//				$equip = $('#equip_' + systemId + '_' + equipType + '_S');
				$equip = $('#equip_' + equipType);
			}
//			if ($equip.length === 0) {
//				$equip = $('#equip_' + systemId + '_' + equipType + '_N');
//			}
			if ($equip.length === 0) {
				if(systemId != '1'){
					return;
				}
			}
		}
		
		
		var colorClass = '';
		if(failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		
//		if (equipType == '11'){
//			console.log(data)
//			console.log(colorClass)
//		} 
		
		var equipNm = '';
		if(equipType == 11) {
			equipNm = $equip.data('alias');
		}else {
			equipNm = data.equipNm;
		}
		// 상위 element에 double 클래스가 있는지 확인하여 이중화인지 확인
		if($equip.parent().parent().hasClass('double')) {
			// 이중화 서버
//			var actCount = 0;
//			actCount += $equip.parent().find('> .server01').data('data').CURRENT_ACT_SBY === 'A' ? 1 : 0;
//			actCount += $equip.parent().find('> .server02').data('data').CURRENT_ACT_SBY === 'A' ? 1 : 0;
//			
//			if(colorClass) {
//				if($equip.parent().find('> .server01').data('data').SYSTEM_ID === $equip.parent().find('> .server02').data('data').SYSTEM_ID) {
//					// A A : 둘다 표시
//					// S S : 둘다 표시
//					// A S : A에 표시
//					if(actCount === 1) {
//						if($equip.parent().find('> .server01').data('data').CURRENT_ACT_SBY === 'A') {
//							$equip.parent().find('> .server01').addClass(colorClass);
//						} else {
//							$equip.parent().find('> .server02').addClass(colorClass);
//						}
//						
//					} else {
//						$equip.parent().find('> .server01').addClass(colorClass);
//						$equip.parent().find('> .server02').addClass(colorClass);
//					}
//				} else {
//					$equip.addClass(colorClass);
//				}
//			}
			// 엔지니어 아이콘 추가.
			var $engineer = $equip.parent().find('div.engineer');
			if ($engineer.length == 0) {
				$equip.parent().append('<div class="engineer ' + colorClass + '" onclick="failureOpen(\'' + equipNm + '\', \'' + equipType + '\');"></div>');
			} else {
				$engineer.removeClass('yellow orange red').addClass(colorClass)
			}
		} else {
			// 단일 서버
			
			if(type != 2 && type != 3){
				//$equip.find('div.state').addClass(colorClass);
				// 엔지니어 아이콘 추가.
				var srcColorLevel = 4
				if (equipType == 44){
					$equip = $('#equip_11');
				}
				var $engineer = $equip.find('div.engineer');
				if ($engineer.length == 0) {
					if (equipType == 44){
						$equip.append('<div class="engineer ' + colorClass + '" onclick="failureOpen(\'undefined\', \'11\');"></div>');
					}else{
						$equip.append('<div class="engineer ' + colorClass + '" onclick="failureOpen(\'' + equipNm + '\', \'' + equipType + '\');"></div>');
					}
					
				} else {
//					$engineer.removeClass('yellow orange red').addClass(colorClass)
					if ($equip.find('div.engineer.red').length == 0 && $equip.find('div.engineer.orange').length == 0 && $equip.find('div.engineer.yellow').length == 0){
						$equip.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
					}else {
						
						if ($equip.find('div.engineer.red').length == 1){
							srcColorLevel = 1
						}else if ($equip.find('div.engineer.orange').length == 1){
							srcColorLevel = 2
						}else if ($equip.find('div.engineer.yellow').length == 1){
							srcColorLevel = 3
						}else{
							srcColorLevel = 4
						}
						if(Number(failureAlarmLevel) <= srcColorLevel){
							$equip.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
						}
					} 
				}
				
				if ($equip.find('div.state.red').length == 0 && $equip.find('div.state.orange').length == 0 && $equip.find('div.state.yellow').length == 0){
					$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
				} else  {
					if ($equip.find('div.state.red').length == 1){
						srcColorLevel = 1
					}else if ($equip.find('div.state.orange').length == 1){
						srcColorLevel = 2
					}else if ($equip.find('div.state.yellow').length == 1){
						srcColorLevel = 3
					}else{
						srcColorLevel = 4
					}
					if(Number(failureAlarmLevel) <= srcColorLevel){
						$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
					}
				}
				//console.log('type: ' + type + ', equipColor: ' + equipColor);
//				if (equipType == 44){
//					$('#equip_11').find('div.state').removeClass('yellow orange red').addClass(equipColor);
//				}
				
				
				
			}
		}
		//console.log(type);
		if(type == 2 || type == 3) {
			if (type == 2) {
				$equip = $('#du');
			} else if (type == 3) {
				$equip = $('#ru');
			}
			if($equip.length > 0) {
				//$equip.find('div.state').addClass(colorClass);
//				var serverStat = type == 2 ? $equip.data('data').DU_SERVER_STAT : 'Y';
				
//				if (serverStat == 'N') {
//					equipColor = 'red';
//				} else if (serverStat == 'Y') {
//					if(failureAlarmLevel === '1') {
//						equipColor = 'red';
//					} else if(failureAlarmLevel === '2') {
//						equipColor = 'orange';
//					} else if(failureAlarmLevel === '3') {
//						equipColor = 'yellow';
//					}
//				}
				
//				$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor);
				
				if(failureAlarmLevel === '1') {
					equipColor = 'red';
				} else if(failureAlarmLevel === '2') {
					equipColor = 'orange';
				} else if(failureAlarmLevel === '3') {
					equipColor = 'yellow';
				}
				
				// 엔지니어 추가
				equipNm = type == 2 ? equipNm : 'RU';
				var $engineer = $equip.find('div.engineer');
				if ($engineer.length == 0) {
					$equip.append('<div class="engineer ' + colorClass + '" onclick="failureOpen(\'' + equipNm + '\', \'' + equipType + '\');"></div>')
					$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor);
				} else {
//					$engineer.removeClass('yellow orange red').addClass(colorClass);
					if ($equip.find('div.engineer.red').length == 0 && $equip.find('div.engineer.orange').length == 0 && $equip.find('div.engineer.yellow').length == 0){
						$equip.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
						$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor);
					}else {
						var srcColorLevel = 4
						if ($equip.find('div.engineer.red').length == 1){
							srcColorLevel = 1
						}else if ($equip.find('div.engineer.orange').length == 1){
							srcColorLevel = 2
						}else if ($equip.find('div.engineer.yellow').length == 1){
							srcColorLevel = 3
						}else{
							srcColorLevel = 4
						}
						if(Number(failureAlarmLevel) <= srcColorLevel){
							$equip.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
							$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor);
						}
					} 
				}
				//console.log(equipNm + " " + colorClass)
			}
		} 
//		else {
//			console.log("type : " + type);
//			console.log("id " + $equip.attr("id"));
//			console.log("Data " + $equip.data("data").VIEW_NAME);
//			console.log("Data " + $equip.data("data").EQUIP_TYPE + " " + $equip.data("data").VIEW_NAME);
//			console.log($equip.data("data").SERVER_STAT);
//			var equipColor = '';
//			var serverStat = $equip.data('data').SERVER_STAT;
//			
//			if ($equip.find('div.state').hasClass('red')) {
//				equipColor = 'red';
//			} else if (serverStat == 'Y') {
//				if(failureAlarmLevel === '1') {
//					equipColor = 'red';
//				} else if(failureAlarmLevel === '2') {
//					equipColor = 'orange';
//				} else if(failureAlarmLevel === '3') {
//					equipColor = 'yellow';
//				}
//			}
//			//console.log('type: ' + type + ', equipColor: ' + equipColor);
//			$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor);
//			if (equipType == 44){
//				$('#equip_11').find('div.state').removeClass('yellow orange red').addClass(equipColor);
//			}
//		}
		
	});
}

function alarmSound(){
	
	if($('#alarmBtn').hasClass('mu-toggle-on')){
		$('#alarmBtn').removeClass('mu-toggle-on');
		audioFunction.audioPuse();
		audioFunction.failureAudioPause();
	}else{
		$('#alarmBtn').addClass('mu-toggle-on');
		var maxAlLevel = $('#audioAlarmLevel').val();
		
		audioFunction.audioPuse();
		audioFunction.networkAudioPlay(maxAlLevel,0);
		
		audioFunction.failureAudioPause();
		audioFunction.networkfailureAudioSetInterval();
	}
}

function mainAudioFunction(flag){

	if (flag == 0) {
		var maxAlLevel = $('#audioAlarmLevel').val();
		audioFunction.audioPuse();

		if ($('#alarmBtn').hasClass('mu-toggle-on')) {
			audioFunction.networkAudioPlay(maxAlLevel, 0);
		}
	} else {
		audioFunction.failureAudioPause();

		if ($('#alarmBtn').hasClass('mu-toggle-on')) {
			audioFunction.networkfailureAudioSetInterval();
		}
	}
}

function getDuRuType(data) {
	var ruRegEx = /(RRH|PSU)\[(\d+_\d+_\d+)\]/g;
	var duRegEx = /RACK\[\d+\]/g;
	var duRegEx2 = /^[ㄱ-ㅎ가-힣]+-\w+-\d+/g;
	var equipType = data.equipType;
	
	if (ruRegEx.test(data.location)) {
		equipType = 3;
//	} else if(duRegEx.test(data.location) || duRegEx2.test(data.location)){
//		equipType = 2;
	}
	return equipType;
}

function getSystemId(data) {
	var imRegEx = /IP\/MPLS/;
	var l2RegEx = /L2|L3/;
	var equipType = data.equipType;
	var systemNm = data.systemNm;
	var systemId = '';

	if (equipType == 11) {
		if (imRegEx.test(systemNm)) {
			systemId = '1128';
		} else if(l2RegEx.test(systemNm)) {
			systemId = '1114';
		} else {
			systemId = data.systemId;
		}
	} else if(equipType == 14 || equipType == 15 || equipType == 16
			|| equipType == 29 || equipType == 30) {
		systemId = '0099';
	} else {
		systemId = data.systemId;
	}
	return systemId;
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

//알람필터 확인버튼클릭후 실행절차
function filterSaveSearch(flag, filterLevel) {
	MAINMONITOR.filterLevel = filterLevel;
	
	if(ws){
//		console.log('filter socket close');
		isView = false;
		ws.close();
		setTimeout(function() {startAlarmDetect();},1000);
	}
	dataLoad();
	
}

function intervalSet(){
	var intervalId = setInterval('dataLoad()', 1000*30);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
	if(!$('#repeatBtn').hasClass('mu-toggle-on')){
		$('#repeatBtn').addClass('mu-toggle-on');
	}
	
	dataLoad();
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
