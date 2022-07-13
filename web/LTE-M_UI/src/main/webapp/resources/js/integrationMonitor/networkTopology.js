var NETWORK_TOPOLOGY = {
	params: {
		alarmFilter: 4,
		gridAlarmFilter: 4,
		eventTime: ''
	},
	//성능 관련 가청, 감시 플래그
	soundFlag: true,
	watchFlag: true,
	performanceAlarmCount: {
		1: 0,
		2: 0,
		3: 0,
		4: 0
	},
	failureAlarmCount: {
		1: 0,
		2: 0,
		3: 0,
		4: 0
	}
};

var duInfoList = [];
// ru에서 알람 발생시 du에 표시해줘야 하므로 ru정보를 변수에 담아둠.
var ruInfoList = [];
var equipAjax;
var duAjax;
var ruAjax;
var switchAjax;
var recoverEquipTypeAjax;

var duSelectedIndex = -1;
var duSelectedLine = 'all';	// 선택된  du 라인 ( 'all': 전체알람, 5 : 5호선, 7 : 7호선 )
var duFailList =  [];		// tb_failure_alarm 에서 장애가 있는 du를 담아놓을 리스트
var duPerformanceLowList = [];	// 성능알람 있는 du 담아놓기

// 고장 관련 가청, 감시 플래그
var watchFlagFailure = true;
var soundFlagFailure = true;
var alarmRefreshTimeout;

var switch11chk = '';				// 스위치 1뎁스 select box 선택 값
var switchLineId = '';   			// 관제/5호선 스위치 클릭했을때 호선아이디값
var recoverEquipTypeList = [];
var switch_line_info = [] ;     	// 관제/5호선 스위치 클릭했을때의 관제/5호선정보

// 스위치 장애 상태 (적/주/노)
var switch0_failureAlarmLevel = '4';
var switch5_failureAlarmLevel = '4';
var switch7_failureAlarmLevel = '4';

// 스위치 상태 (파/회)
var gwanje_switch_currentActSby = [];
var line5_switch_currentActSby = [];
var line7_switch_currentActSby = [];

// 정류기 상태 (파/회)
var jrg_currentActSby = [];

//정류기 1뎁스(관제/5호선/7호선) 상태 (파/회)
var jrg_gwanjge_currentActSby = [];
var jrg_station5_currentActSby = [];
var jrg_station7_currentActSby = [];

//정류기 1뎁스(관제/5호선/7호선) 장애 상태 (적/주/노)
var jrgEquip_station0_failureAlarmLevel = '4';
var jrgEquip_station5_failureAlarmLevel = '4';
var jrgEquip_station7_failureAlarmLevel = '4';

// 정류기 관제, 5호선, 7호선 선택 시 호선아이디값
var jrgLineId ='';

//5,7호선 분리된 장비 상태  
var mdm_currentActSby = []; //MDM 상태(파/회)
var image_currentActSby = []; //영상처리장치 상태(파/회)
var cur_lineEquipType = 0;

$(document).ready(function(){

	//$(".titleWrap").css('display','none');
	var alarmVolumes = getAlarmVolume();
	
	$('#divDialogTrend, #divPerformanceDetail, #divFailureDetail, #divSwitchView, #divSwitchListView, #divEquip36ListView, #divEquip36LineListView, #divRecoverFailureDetail, #divLineEquipVeiw').draggable({handle: '.dragHandle'});
	$('#divDialogTrend, #divPerformanceDetail, #divFailureDetail, #divSwitchView, #divSwitchListView, #divEquip36ListView, #divEquip36LineListView, #divRecoverFailureDetail, #divLineEquipVeiw').resizable();

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

	//고장목록 클릭시 팝업되는 조치사례 및 고장상세정보 엑셀 저장
	excelFailureActionCase();

	getEquipInfo();
	
	datepickerSetting();
	
	// 이벤트 세팅
	setEvent();
	
	//가청, 감시 ON
	$(".top-buttons").addClass("mu-toggle-on");
	
	//가청, 감시 ON
	$("#btn_alarmSound").addClass("mu-toggle-on");
	$("#failureWatchBtn").children().removeClass("play");
	$("#failureWatchBtn").children().addClass("pause");

	dataLoad();
	
	$.when(equipAjax, duAjax, ruAjax).done(function () {
		startAlarmDetect();
	});

	// 30초 마다 정보 불러옴.
	NETWORK_TOPOLOGY.refresh = setInterval(function() {
		if($('.dropdown-menu').css('display') == 'block'){
			$('.dropdown-menu').hide();
		}
		//기지국 통합감시 DU POINT class 초기화
		//setBaseStationDuClass(); 
		
		dataLoad();
		
	}, 30 * 1000);
});

function dataLoad() {
	// du 성능알람 리스트 초기화
	duPerformanceLowList = [];
	
	$("#switchPortSelect").val(switch11chk).prop("selected", true);
	
	// 서비스장비, 주제어장치, 스위치, 응용시스템, DU, RU 정보 조회
	getTopologyEquipInfo();
	
	
	// 서버에 장비 정보 요청
	$.when(equipAjax, duAjax, ruAjax, recoverEquipTypeAjax).done(function(equipData, duData, ruData, recoverEquipTypeData) {
		
		recoverEquipTypeList = recoverEquipTypeData[0];
		// 장비타입별로 active 상태가 하나라도 안될 경우 가청알림을 위한 object
		var actSbyObj = {};
		
		// 전체 색깔 제거
		$('div.serverBox > div.state').removeClass('yellow orange red');
		
        /**
         * 스마트 항공기지 DU length : 8개
         * P168함 : 40여개 분기 처리
         */
        if ('P168' != projectProfile) {
            
            // 스마트 항공기지
            if (duData && duData[0].length >= 8) {
                var cutDuInfoList = [];
                for (var i = 0; i < 8; i++) {
                    cutDuInfoList.push(duData[0][i]);
                }
                duInfoList = cutDuInfoList;
            } else {
                duInfoList = duData[0];
            }
        } else {
            // P168함
            duInfoList = duData[0];            
        }
		ruInfoList = ruData[0];
		// 감시시간 설정
		var serverDate = moment(new Date(equipData[2].getResponseHeader('date'))).format('YYYY/MM/DD HH:mm:ss');
		$('.timeWrap').text('감시시간 : ' + serverDate);
		
		gwanje_switch_currentActSby = [];
		line5_switch_currentActSby = [];
		line7_switch_currentActSby = [];
		
		jrg_currentActSby = [];
		jrg_gwanjge_currentActSby = [];
		jrg_station5_currentActSby = [];
		jrg_station7_currentActSby = [];
		
		mdm_currentActSby = [];
		image_currentActSby = [];
		
		var equip36List = $('#equip36List');
		equip36List.empty();
		
		var lineEquipList = $('#lineEquipList');
		lineEquipList.empty();
		
		var juniperSwitchList = $('#juniperSwitchList');
		juniperSwitchList.empty();
		
		// 스위치 - 관제
		var switchType = {'EQUIP_TYPE':'switch_gwanje', 'LINE_ID' : '0'};
		$('#equip_gwanje_N').data('data', switchType);
		$('#equip_gwanje_N').parent().find('div.clear24_icon').data('data', switchType);
		
		// 스위치 - 5호선 (Aka.하남선)
		switchType = {'EQUIP_TYPE':'switch_station5', 'LINE_ID' : '5'};
		$('#equip_station5_N').data('data', switchType);
		$('#equip_station5_N').parent().find('div.clear24_icon').data('data', switchType);
		
		// 스위치 - 7호선 (Aka.석남선)
		switchType = {'EQUIP_TYPE':'switch_station7', 'LINE_ID' : '7'};
		$('#equip_station7_N').data('data', switchType);
		$('#equip_station7_N').parent().find('div.clear24_icon').data('data', switchType);
		
		// 정류기 
		var equipType = {'EQUIP_TYPE':'jrg36'}
		$('#equip_jrg_36_N').data('data', equipType)
		$('#equip_jrg_36_N').parent().find('div.clear24_icon').data('data', equipType)
		
		// 정류기  - 관제
		equipType = {'EQUIP_TYPE':'jrg36_gwanje'};
		$('#equip_gwanje_36_N').data('data', equipType)
		$('#equip_gwanje_36_N').parent().find('div.clear24_icon').data('data', equipType)
		
		// 정류기 - 5호선
		equipType = {'EQUIP_TYPE':'jrg36_station5'};
		$('#equip_staion5_36_N').data('data', equipType)
		$('#equip_staion5_36_N').parent().find('div.clear24_icon').data('data', equipType)
		
		// 정류기 - 7호선
		equipType = {'EQUIP_TYPE':'jrg36_station7'};
		$('#equip_station7_36_N').data('data', equipType)
		$('#equip_station7_36_N').parent().find('div.clear24_icon').data('data', equipType)
		
		// 장비정보 가져와서 하나씩 설정
		$.each(equipData[0], function(i, o) {
			
			// 스위치 (Aka.주니퍼스위치) 상세팝업 
			/*if (o.EQUIP_TYPE === 11){
				var key = 'equip_' + o.SYSTEM_ID+'_'+o.EQUIP_TYPE+'_'+'N'
				var lineId = o.LINE_ID.replace(/,/gi, '_');
				if($('#'+key).length === 0) {
					var equip11Html = [];
					equip11Html.push('<li class="serverGroup sw-cotrol" style="float:left; " id="'+lineId+'-'+o.EQUIP_TYPE+'-'+o.SYSTEM_ID+'">');
					equip11Html.push('	<span class="stage"></span>');
					equip11Html.push('	<div class="serverBox"  id="'+key+'" >');
					equip11Html.push('		<div class="state normalblue">서버</div>');
					equip11Html.push('			<strong class="tit">' + o.SYSTEM_NAME.replace(/-RU$/, '') + '</strong>');
					equip11Html.push('		</div>');
					equip11Html.push('	<div class="engineer" style="display:none;"></div>');
					equip11Html.push('	<div class="clear24_icon" style="display: none;">!</div>');
					equip11Html.push('</li>');
					
					juniperSwitchList.append(equip11Html.join(''));
					
					var $equip = $('#'+key);
					$equip.parent().data('data', o);
				}
				
				// 현재 선택된 노선에 따라서 보여주고, 안 보여주고
				if ( (o.CATEGORY == switch11chk || switch11chk == '') && ($equip.parent().data('data')['LINE_ID'].indexOf(switchLineId) >=0 )){
					$equip.parent().show();
				}else{
					$equip.parent().hide();
				}
				
				// LINE_ID에 따라 각 스위치(관제, 하남선, 석남선) 현재 상태 넣어주기
				if ( o.LINE_ID.indexOf('5') >=0 ){
					line5_switch_currentActSby.push(o.CURRENT_ACT_SBY);
				}else if(o.LINE_ID.indexOf('7') >=0 ){
					line7_switch_currentActSby.push(o.CURRENT_ACT_SBY);
				}else{
					gwanje_switch_currentActSby.push(o.CURRENT_ACT_SBY);
				}
			}
			*/
			
			// 정류기 상세팝업
			/*if (o.EQUIP_TYPE === 36){
				// 화면에 보이는 정류기 텍스트 DB에서가져온 값으로 설정
				var $jrd = $('#equip_jrg_36_N');
				if($jrd.length && ($jrd.find('.tit').text() == '')){
					$jrd.find('.tit').text(o.EQUIP_NAME);
				}
				
				var key = 'equip_' + o.SYSTEM_ID+'_'+o.EQUIP_TYPE+'_'+'N';
				var lineId = o.LINE_ID.replace(/,/gi, '_');
				if($('#'+key).length === 0) {
					var equip36Html = [];
					equip36Html.push('<li class="serverGroup sw-cotrol" style="float:left" id="'+lineId+'-'+o.EQUIP_TYPE+'-'+o.SYSTEM_ID+'">');
					equip36Html.push('	<span class="stage"></span>');
					equip36Html.push('	<div class="serverBox" id="'+key+'" >');
					equip36Html.push('		<div class="state normalblue">서버</div>');
					equip36Html.push('			<strong class="tit">' + o.SYSTEM_NAME.replace(/-RU$/, '') + '</strong>');
					equip36Html.push('		</div>');
					equip36Html.push('	<div class="engineer" style="display:none;"></div>');
					equip36Html.push('	<div class="clear24_icon" style="display: none;">!</div>');
					equip36Html.push('</li>');
					
					equip36List.append(equip36Html.join(''));
					var $equip = $('#'+key);
					$equip.parent().data('data', o);
				}
				
				// 현재 선택된 노선에 따라서 보여주고, 안 보여주고
				if ($equip.parent().data('data')['LINE_ID'].indexOf(jrgLineId) >=0 ){
					$equip.parent().show();
				}else{
					$equip.parent().hide();
				}
				
				// 정류기 상태 넣어주기
				jrg_currentActSby.push(o.CURRENT_ACT_SBY);
				
				// LINE_ID에 따라 정류기 1뎁스 각 정류기(관제, 하남선, 석남선) 현재 상태 넣어주기
				if ( o.LINE_ID.indexOf('5') >=0 ){
					 jrg_station5_currentActSby.push(o.CURRENT_ACT_SBY);
				}else if(o.LINE_ID.indexOf('7') >=0 ){
					 jrg_station7_currentActSby.push(o.CURRENT_ACT_SBY);
				}else{
					 jrg_gwanjge_currentActSby.push(o.CURRENT_ACT_SBY);
				}
			}
			*/
			// MDM 상세
			/*if (o.EQUIP_TYPE === 18){
				// 화면에 보이는 정류기 텍스트 DB에서가져온 값으로 설정
				var $mdm = $('#equip_18_N');
				if($mdm.length && ($mdm.find('.tit').text() == '')){
					$mdm.find('.tit').text(o.EQUIP_NAME);
				}
				
				var key = 'equip_' + o.SYSTEM_ID+'_'+o.EQUIP_TYPE+'_'+'N';
				var lineId = o.LINE_ID.replace(/,/gi, '_');
				if($('#'+key).length === 0) {
					var lineEquipHtml = [];
					lineEquipHtml.push('<li class="serverGroup sw-cotrol" style="float:left" id="'+lineId+'-'+o.EQUIP_TYPE+'-'+o.SYSTEM_ID+'">');
					lineEquipHtml.push('	<span class="stage"></span>');
					lineEquipHtml.push('	<div class="serverBox" id="'+key+'" >');
					lineEquipHtml.push('		<div class="state normalblue">서버</div>');
					lineEquipHtml.push('			<strong class="tit">' + o.SYSTEM_NAME.replace(/-RU$/, '') + '</strong>');
					lineEquipHtml.push('		</div>');
					lineEquipHtml.push('	<div class="engineer" style="display:none;"></div>');
					lineEquipHtml.push('	<div class="clear24_icon" style="display: none;">!</div>');
					lineEquipHtml.push('</li>');
					
					lineEquipList.append(lineEquipHtml.join(''));
					var $equip = $('#'+key);
					$equip.parent().data('data', o);
				}
				
				// MDM 상태 넣어주기
				mdm_currentActSby.push(o.CURRENT_ACT_SBY);
			}*/
			
			// 영상처리장치 상세
			/*if (o.EQUIP_TYPE === 27){
				// 화면에 보이는 정류기 텍스트 DB에서가져온 값으로 설정
				var $mdm = $('#equip_27_N');
				if($mdm.length && ($mdm.find('.tit').text() == '')){
					$mdm.find('.tit').text(o.EQUIP_NAME);
				}
				
				var key = 'equip_' + o.SYSTEM_ID+'_'+o.EQUIP_TYPE+'_'+'N';
				var lineId = o.LINE_ID.replace(/,/gi, '_');
				if($('#'+key).length === 0) {
					var lineEquipHtml = [];
					lineEquipHtml.push('<li class="serverGroup sw-cotrol" style="float:left" id="'+lineId+'-'+o.EQUIP_TYPE+'-'+o.SYSTEM_ID+'">');
					lineEquipHtml.push('	<span class="stage"></span>');
					lineEquipHtml.push('	<div class="serverBox" id="'+key+'" >');
					lineEquipHtml.push('		<div class="state normalblue">서버</div>');
					lineEquipHtml.push('			<strong class="tit">' + o.SYSTEM_NAME.replace(/-RU$/, '') + '</strong>');
					lineEquipHtml.push('		</div>');
					lineEquipHtml.push('	<div class="engineer" style="display:none;"></div>');
					lineEquipHtml.push('	<div class="clear24_icon" style="display: none;">!</div>');
					lineEquipHtml.push('</li>');
					
					lineEquipList.append(lineEquipHtml.join(''));
					var $equip = $('#'+key);
					$equip.parent().data('data', o);
				}
				
				// 영상처리장치 상태 넣어주기
				image_currentActSby.push(o.CURRENT_ACT_SBY);
			}
*/
			var performanceAlarmLevel = 4;
			var performanceAlarmClass = 'yellow';	// yellow, orange, red
			
			// 성능 알람 처리
			var tmpAlarmLevelList = [];
			if(o.EQUIP_TYPE === 6) {
				// HSS
				//console.log(o)
				if(o.DATA_S6A_INTERFACE) {
					tmpAlarmLevelList.push(o.DATA_S6A_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_S6A_INTERFACE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_CX_INTERFACE) { 
					tmpAlarmLevelList.push(o.DATA_CX_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_CX_INTERFACE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_GX) {
					tmpAlarmLevelList.push(o.DATA_GX.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_GX.SUCC_RATE_LEVEL);
				}
				if(o.DATA_RX) {
					tmpAlarmLevelList.push(o.DATA_RX.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_RX.SUCC_RATE_LEVEL);
				}
				/*if(o.DATA_S13_INTERFACE) {
					tmpAlarmLevelList.push(o.DATA_S13_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_S13_INTERFACE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_SP_INTERFACE) {
					tmpAlarmLevelList.push(o.DATA_SP_INTERFACE.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SP_INTERFACE.SUCC_RATE_LEVEL);
				}
				if(o.DATA_DIAMETER_STACK) {
					tmpAlarmLevelList.push(o.DATA_DIAMETER_STACK.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_DIAMETER_STACK.SUCC_RATE_LEVEL);
				}*/
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
				if(o.DATA_SRMT) {
					tmpAlarmLevelList.push(o.DATA_SRMT.ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SRMT.SUCC_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_SRMT.ANS_RATE_LEVEL);
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
			} else if(o.EQUIP_TYPE === 10) {
				if(o.DATA_REC) {
					tmpAlarmLevelList.push(o.DATA_REC.CALL_ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_REC.CALL_SUCC_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_REC.PTT_ATT_RATE_LEVEL);
					tmpAlarmLevelList.push(o.DATA_REC.PTT_SUCC_RATE_LEVEL);
				}
			}
			else if(o.EQUIP_TYPE === 28) {
				// EPC-HOST
			}
			if(!_.isEmpty(tmpAlarmLevelList)) {
				performanceAlarmLevel = _.min(tmpAlarmLevelList);
			}
			// 장비명, active, standby 처리
			// (2019-04-05) 단일서버가 default_act_sby 컬럼이 'N'값이 아니라도 처리 되도록 요청함
			var systemId = getSystemId({equipType:o.EQUIP_TYPE, systemId:o.SYSTEM_ID, systemNm:o.VIEW_NAME});
			var $equip = $('#equip_' + systemId + '_' +  o.EQUIP_TYPE + '_' +  o.DEFAULT_ACT_SBY);
			if ( $equip.parent().hasClass('double') == false &&  $equip.parent().hasClass('triple') == false && $equip.parent().hasClass('quad') == false ){
				if($('#equip_' + systemId + '_' +  o.EQUIP_TYPE + '_A').length > 0){
					$equip = $('#equip_' + systemId + '_' +  o.EQUIP_TYPE + '_A')
				}else if($('#equip_' + systemId + '_' +  o.EQUIP_TYPE + '_S').length > 0 ){
					$equip = $('#equip_' + systemId + '_' +  o.EQUIP_TYPE + '_S')
				}else {
					$equip = $('#equip_' + systemId + '_' +  o.EQUIP_TYPE + '_N')
				}
			}
			
			// 알람 클래스 지정
			if(performanceAlarmLevel < 4) {
				if(performanceAlarmLevel === 1) {
					performanceAlarmClass = 'red';
				} else if(performanceAlarmLevel === 2) {
					performanceAlarmClass = 'orange';
				}
			}
			if($equip.length > 0) {
				// 상위 element에 double 클래스가 있는지 확인하여 이중화인지 확인
				if($equip.parent().hasClass('double') || $equip.parent().hasClass('triple') || $equip.parent().hasClass('quad') ) {
					if(o.EQUIP_TYPE===6){
					}
					// 기존 색깔  class 다 지움
					var $state = $equip.find('div.state');
					$state.removeClass('normalgray normalblue yellow orange red');

					if(o.CURRENT_ACT_SBY === 'A' || o.CURRENT_ACT_SBY === 'N') {
						$state.addClass('normalblue');
					} else {
						$state.addClass('normalgray');
					}
					
					// 성능알람 표시
					// 기존 성능알람 제거
					$equip.parent().find('span.stage').removeClass('yellow orange red').hide();
					
					if(performanceAlarmLevel < 4 && performanceAlarmLevel != 0) {
						$equip.parent().find('span.stage').addClass(performanceAlarmClass).show();
					}
					$equip.parent().data('performanceAlarmLevel', performanceAlarmLevel);
					$equip.parent().data('data', o);
					$equip.data('data', o);
					$equip.parent().find('div.clear24_icon').data('data',o);
				} else {
					// 기존 색깔  class 다 지움
					$equip.find('div.state').removeClass('normalgray normalblue yellow orange red');
					if(o.CURRENT_ACT_SBY === 'A' || o.CURRENT_ACT_SBY === 'N') {
						$equip.find('div.state').addClass('normalblue');
					} else {
						$equip.find('div.state').addClass('normalgray');
					}
				
					// 기존 성능알람 제거
					$equip.find('span.stage').not('#equip_hanam_11_N').removeClass('yellow orange red').hide();
					if(performanceAlarmLevel < 4) {
						$equip.find('span.stage').addClass(performanceAlarmClass).show();
					}
				
					$equip.data('data', o);
					$equip.data('performanceAlarmLevel', performanceAlarmLevel);
					$equip.parent().find('div.clear24_icon').data('data',o);
				}
				var viewName = o.VIEW_NAME;
				if (o.EQUIP_TYPE != 44){
					$equip.find('.tit').text(viewName);
				}
				
			}
			// 장비타입별 act, sby 체크
			// EMS 는 equipType 14로 변경
			var equipType = o.EQUIP_TYPE;
			if(_.isEmpty(actSbyObj[equipType]) || actSbyObj[equipType] === 'S') {
				actSbyObj[equipType] = o.CURRENT_ACT_SBY;
			}
		});
		
/*		// 7호선 추가 중 레이어 관련
		if($('#divLineEquipVeiw').is(":visible")){
			setLineEquipView();
		}*/
		
		// DU 처리
		var $duList = $('#duList');
		
		//기지국통합감시 DU 처리
		var $baseStationDuList = $('#baseStationDuList');
	
		if($duList.children().length === 0) {
			// 페이지 최초 접근시 du 목록 그림.
			$.each(duInfoList, function(i, o) {
				var duServerId = 'equip_' + o.SYSTEM_ID + '_' +  o.EQUIP_TYPE + '_' +  o.DEFAULT_ACT_SBY;
				var $duServerGroup = $duList.find('#equip_' + o.SYSTEM_ID);
				
				//기지국 통합감시 DU 목록
				//var $duServerGroup = $duList.find('#equip_' + o.SYSTEM_ID);
				var serverClass = 'server02';
				if(o.DEFAULT_ACT_SBY === 'S') {
					serverClass = 'server01';
				}
				//DU의 개수에 따라 div class 설정 변경
				
				/**
				 * null : 스마트 항공기지
				 * P168 
				 */
				/*if ('P168' == projectProfile) {
                    $duList.closest("div").attr('class', 'server-area base-station more-type');
                } else {
                    $duList.closest("div").attr('class', 'server-area base-station lg-type');
                }*/
				
				//일단VIEW_NAME 사용
				duName = o.VIEW_NAME.replace(/_DU$/, '') 
				if (duName.split('_').length > 1){
					duName = duName.split('_').slice(1).join('_');
				}
				if($duServerGroup.length === 0) {
					var duDivHtml = []; 
					duDivHtml.push('<div id="equip_' + o.SYSTEM_ID + '" class="serverGroup" style="">			');
					duDivHtml.push('	<span class="stage" style="display:none;"></span>	');
					duDivHtml.push('	<div id="' + duServerId + '" class="serverBox ">			');
					duDivHtml.push('		<div class="state">서버</div>						');
					duDivHtml.push('		<strong class="tit">' + o.VIEW_NAME + '</strong>	');
					duDivHtml.push('	</div>												');
					duDivHtml.push('	<div class="engineer" style="display:none;"></div>	');
					duDivHtml.push('	<div class="clear24_icon" style="display: none;">!</div>	'); 
					duDivHtml.push('</div>														');
					$duList.append(duDivHtml.join('')); 
				} else {
					/*// active, standby 에 따라서 위치 조정(active가 앞쪽(아래쪽));
					var duDivHtml = [];
					duDivHtml.push('<div class="serverGroup">									');
					duDivHtml.push('	<span class="stage" style="display:none;"></span>	');
					duDivHtml.push('	<div id="' + duServerId + '" class="serverBox ' + serverClass + '">	');
					duDivHtml.push('		<div class="state">서버</div>				');
					duDivHtml.push('	</div>										');
					duDivHtml.push('	<strong class="tit">' + o.VIEW_NAME + '</strong>	');
					duDivHtml.push('	<div class="engineer" style="display:none;"></div>	');
					duDivHtml.push('	<div class="clear24_icon_sm" style="display: none;">!</div>	');
					duDivHtml.push('</div>													');
					if(o.DEFAULT_ACT_SBY === 'S') {
						$duServerGroup.find('> div.station').prepend(duDivHtml.join(''));
					} else {
						$duServerGroup.find('> div.station > strong').before(duDivHtml.join(''));
					}*/
				}
			});
			
		}
		
		$duList.find('> div').removeData('performanceAlarmLevel');
		$duList.find('> div').removeData('failureAlarmLevel');
		$duList.find('span.stage').removeClass('yellow orange red').hide();
		$duList.find('div.engineer').hide();
		$duList.find('div.clear24_icon').hide();
		$duList.find('div.engineer').removeClass('yellow orange red')
		
		//기지국 통합감시 데이터 삭제
		/*$baseStationDuList.find('i').removeData('performanceAlarmLevel');
		$baseStationDuList.find('i').removeData('failureAlarmLevel');*/
		// 색깔 처리
		$.each(duInfoList, function(i, o) {
			
			var colorClass = 'normalgray';
			if(o.CURRENT_ACT_SBY === 'A') {
				colorClass = 'normalblue';
			}
	
			var duServerId = 'equip_' + o.SYSTEM_ID + '_' +  o.EQUIP_TYPE + '_' +  o.DEFAULT_ACT_SBY;
			
			var performanceAlarmLevel = 4;
			var performanceAlarmClass = 'yellow';	// yellow, orange, red
			
			
			var breakdownAlarmClass = 'minor';	// critical, major, minor, nomal
			
			var performanceAlarmLevelList = [
				o.ATT_RATE_LEVEL,
				o.RRC_RATE_LEVEL,
				o.ANS_RATE_LEVEL,
				o.CD_RATE_LEVEL
			];
			
			performanceAlarmLevel = _.min(performanceAlarmLevelList);
			
			// 알람 클래스 지정, 알람등급(고장 지정)
			if(performanceAlarmLevel < 4) {
				if(performanceAlarmLevel === 1) {
					performanceAlarmClass = 'red';
				} else if(performanceAlarmLevel === 2) {
					performanceAlarmClass = 'orange';
				}
			}
			
			var $duServerGroup = $duList.find('#equip_' + o.SYSTEM_ID);
			
			//기지국 통합감시
			var $baseStationPoint = $baseStationDuList.find('#equip_'+o.SYSTEM_ID);
			$baseStationPoint.data('data', o);
			$baseStationPoint.data('performanceAlarmLevel', performanceAlarmLevel);
			
			var $serverBox = $duList.find('#' + duServerId);
			$serverBox.data('data', o);
			$duServerGroup.data('data', o); 
			
			$duServerGroup.data('performanceAlarmLevel', performanceAlarmLevel);
			
			//serverBox에도 performanceAlarmLevel 설정(mouse over 시에 serverBox를 보고 상태를 판단한다.)
			$duServerGroup.find('.serverBox').data('performanceAlarmLevel', performanceAlarmLevel);
			$duServerGroup.find('div.clear24_icon').data('data',o.EQUIP_TYPE);
			
			// active, standby 색깔 지정
			$serverBox.find("div.state").removeClass('normalgray normalblue').addClass(colorClass);
			
			//기지국 통합감시 baseStationDuList data 삽입
			$baseStationPoint.data('data', o); 
			
			if(performanceAlarmLevel < 4  && performanceAlarmLevel != 0) {
				$duServerGroup.find('span.stage').addClass(performanceAlarmClass).show();
				$duServerGroup.data('failureAlarmLevel', 1); 
				//기지국 통합감시 DU 색 초기화
				$baseStationPoint.data('failureAlarmLevel', 1); 
				
				if($duServerGroup.data('data') != null){
					duPerformanceLowList.push($duServerGroup.data('data'));
				}
			}
			else{
				//기지국 통합감시 DU 색 초기화 
				//$baseStationDuPoint.addClass('critical');
			}
			

			var equipType = o.EQUIP_TYPE + '_' + o.SYSTEM_ID;
			if(_.isEmpty(actSbyObj[equipType]) || actSbyObj[equipType] === 'S') {
				actSbyObj[equipType] = o.CURRENT_ACT_SBY;
			}

		});
		
		
		
		// du 클릭 이벤트 실행
		if(duSelectedIndex !== -1) {
			$('#duList .station').eq(duSelectedIndex).removeClass('selected');
			$('#duList .station').eq(duSelectedIndex).trigger('click');
			
			// 컨택스트 메뉴 좌클릭으로 변경 하면서 DU 선택 유지시 컨택스트 메뉴 숨김.
			$('.dropdown-menu').hide();
		}
		
		setEquipAlarm();
		
		// 성능 알람 카운트
		performanceAlarmCount();
		setTotalAlarmCount();
		
		var performanceAlarmLvl = getPerformanceAlarmLevel();
		// 장비 타입별로 하나라도 act 상태가 없을 경우 알람 발생.
		var maxActSby = _.sortByOrder(_.values(actSbyObj), _.values, 'desc')[0];
		var failureAlarmLvl = getFailureAlarmLevel();
		if(maxActSby === 'S') {
			failureAlarmLvl = 1;
		}
		$("#audioAlarmLevel").val(performanceAlarmLvl);
		NETWORK_TOPOLOGY.alarmLvlGlobal = performanceAlarmLvl;
		
		if (NETWORK_TOPOLOGY.soundFlag) {
			audioFunction.audioPuse();
			audioFunction.networkAudioPlay($('#audioAlarmLevel').val(), 0);
		}
		
		recoverEquipCheck();
		
		// DU 전체알람 일 경우 
		if(duSelectedLine === 'all'){	
			// 전체  DU 목록 보여줌
			showAllDuList();
		}
		
		
		
		// du영역 스크롤 위로
		$('#duServerArea').scrollTop(0);
		
	});	
}

// 전체 DU 목록 그리기
function showAllDuList(){
	$('#duList').children('div').hide();

	// du 정보가 들어있는 리스트 순회
	duInfoList.forEach(function(obj, idx){
		$('#equip_'+obj.SYSTEM_ID).show();
		$('#equip_'+obj.SYSTEM_ID).removeClass('selected');
	});
}

function recoverEquipCheck(){
	
	$('div.serverGroup').find('div.clear24_icon').hide();
	
	var recoverDefault = recoverEquipTypeList.recoverEquipDefault;
	var recoverDuRu = recoverEquipTypeList.recoverEquipDuRu;
	var recoverSwitch = recoverEquipTypeList.recoverEquipSwitch;
	var recoverJrg = recoverEquipTypeList.recoverEquipJrg;
	
	
	$.each(recoverDefault, function(i, o) {
		var $equip = '';
		if($('#'+o.EQUIP_ID+'_A').length > 0){
			$equip = $('#'+o.EQUIP_ID+'_A')
		}else if($('#'+o.EQUIP_ID+'_S').length > 0 ){
			$equip = $('#'+o.EQUIP_ID+'_S')
		}else {
			$equip = $('#'+o.EQUIP_ID+'_N')
		}
		$equip.parent().find('.clear24_icon').css('display','block')
	});
	
	// 중계기 1뎁스 레이어 : 관제, 5호선, 7호선 (!) 표시
	$.each(recoverJrg, function(i, o) {
		var $equip = $('#'+o.EQUIP_ID);
		if ($equip.length > 0){
			$equip.find('.clear24_icon_sm').css('display','block');
		} 
	});
	
	// DU (!) 표시
	$.each(recoverDuRu, function(i, o) {
		var equipId = o.EQUIP_ID.split('-')[0]
		equipId = o.EQUIP_ID.split('/')[0]
		var $equip = $('#'+equipId);
		if ($equip.length > 0){
			$equip.find('.clear24_icon').css('display','block')
		} 
	})
	
	// 스위치 (관제, 하남선, 석남선) (!) 표시
	$.each(recoverSwitch, function(i, o) {
		var $equip = $('#'+o.EQUIP_ID);
		if ($equip.length > 0){
			$equip.find('.clear24_icon').css('display','block')
		}
	});
}

// 정류기 1뎁스 팝업 장애 색상 처리
function jrgPopupFailureEquip(){
	// 숨김 / 스타일 제거
	$('#equip_gwanje_36_N').parent().find('div.engineer').hide();
	$('#equip_gwanje_36_N').find('div.state').removeClass('yellow orange red');
	
	$('#equip_staion5_36_N').parent().find('div.engineer').hide();
	$('#equip_staion5_36_N').find('div.state').removeClass('yellow orange red');
	
	$('#equip_station7_36_N').parent().find('div.engineer').hide();
	$('#equip_station7_36_N').find('div.state').removeClass('yellow orange red');
	
	// 관제 색상 반영
	if(jrgEquip_station0_failureAlarmLevel < '4'){
		var colorClass = '';
		if(jrgEquip_station0_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(jrgEquip_station0_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(jrgEquip_station0_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		
		$('#equip_gwanje_36_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_gwanje_36_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	
	// 5호선 색상 반영
	if(jrgEquip_station5_failureAlarmLevel < '4'){
		var colorClass = '';
		if(jrgEquip_station5_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(jrgEquip_station5_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(jrgEquip_station5_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		
		$('#equip_staion5_36_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_staion5_36_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	
	// 7호선 색상 반영
	if(jrgEquip_station7_failureAlarmLevel < '4'){
		var colorClass = '';
		if(jrgEquip_station7_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(jrgEquip_station7_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(jrgEquip_station7_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		
		$('#equip_station7_36_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_station7_36_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
}

function setRefresh() {
	//감시 중 ON인 경우 Interval 등록
	if(NETWORK_TOPOLOGY.watchFlag) {
		if(NETWORK_TOPOLOGY.refresh) {
			clearTimeout(NETWORK_TOPOLOGY.refresh);
			dataLoad();
		}
		NETWORK_TOPOLOGY.refresh = setInterval(function() {
			dataLoad();
		}, 30 * 1000);		// 정해진 시간 주기로 refresh (30000 = 30초)
	} else {
		//감시중 Off인 경우 Interval 삭제
		clearTimeout(NETWORK_TOPOLOGY.refresh);
		//감시중 Off인 경우 가청 삭제
		audioFunction.audioPuse();
	}
}

/**
 * tooltip 각 항목 생성
 * 
 * @param title
 * @param arr
 * @returns
 */
function getTooltipItem(title, arr) {
	var html = [];
	html.push('<div class="mu-tooltip-inner">');
	if(title) {
		html.push('	<div class="tit">' + title + '</div>');
	}
	html.push('	<table class="mu-formbox">');
	html.push('		<colgroup>');
	html.push('			<col width="50%" />');
	html.push('			<col width="50%" />');
	html.push('		</colgroup>');
	html.push('		<tbody>');
	$.each(arr, function(i, o) {
		var alarmStyle = '';
		if(o.level === 1) {
			alarmStyle = ' style="color:red;"';
		} else if(o.level === 2) {
			alarmStyle = ' style="color:orange;"';
		} else if(o.level === 3) {
			alarmStyle = ' style="color:yellow;"';
		}
		html.push('			<tr>');
		html.push('				<th>' + o.name + '</th>');
		html.push('				<td' + alarmStyle + '>' + o.val + '</td>');
		html.push('			</tr>');
	});
	html.push('		</tbody>');
	html.push('	</table>');
	html.push('</div>');
	
	return html.join('');
}

function getTooltipAlarm(title, level) {
	var html = [];
	html.push('<div class="mu-tooltip-inner" style="clear:left;">');
	html.push('	<div class="tit">' + title + '</div>');
	html.push('	<table class="mu-formbox mobileLoca">');
	html.push('		<tr class="rating">');
	if(level === 1) {
		html.push('			<td><span class="critical">Critical</td>');
	} else if(level === 2) {
		html.push('			<td><span class="major">Major</td>');
	} else if(level === 3) {
		html.push('			<td><span class="minor">Minor</td>');
	} else {
		html.push('			<td><span class="normal">Normal</td>');
	}
	html.push('		</tr>');
	html.push('	</table>');
	html.push('</div>');

	return html.join('');
}


//해제알람 세팅
function setRecover(param){
	if ( param == undefined ){
		return false;
	} 
	var selectRcvSystem = $('#selectRcvSystem');
	selectRcvSystem.empty();
	// 장비들 셀렉트박스
	var equipType = param.EQUIP_TYPE;
	nwtDetail.params = {
			equipType: equipType,
			systemId: '',
			rrh: '',
			lineId: ''
		};
	//DU, 스위치일 경우 SYSTEM_ID 삽입 LTE-M
	if (param.EQUIP_TYPE == '2' || param.EQUIP_TYPE == '57'){
		nwtDetail.params.systemId = param.SYSTEM_ID;
	} else if (param.EQUIP_TYPE == '3' ){
		nwtDetail.params.rrh = param.RRH;
		nwtDetail.params.systemId = param.DU_ID;
	} else if(param.EQUIP_TYPE == 'switch_gwanje' || param.EQUIP_TYPE == 'switch_station5' || param.EQUIP_TYPE == 'switch_station7'){
		nwtDetail.params.equipType = 11;
		nwtDetail.params.lineId = param.LINE_ID;
	} else if (param.EQUIP_TYPE === 11){
		nwtDetail.params.lineId = param.LINE_ID;
		nwtDetail.params.systemId = param.SYSTEM_ID;
	} else if (param.EQUIP_TYPE == 'jrg36'){
		nwtDetail.params.equipType = '36';
		nwtDetail.params.systemId = '';
	} else if(param.EQUIP_TYPE == 'jrg36_gwanje'){
		nwtDetail.params.equipType = '36';
		nwtDetail.params.systemId = '';
		nwtDetail.params.lineId = '0';
	} else if(param.EQUIP_TYPE == 'jrg36_station5'){
		nwtDetail.params.equipType = '36';
		nwtDetail.params.systemId = '';
		nwtDetail.params.lineId = '5';
	} else if(param.EQUIP_TYPE == 'jrg36_station7'){
		nwtDetail.params.equipType = '36';
		nwtDetail.params.systemId = '';
		nwtDetail.params.lineId = '7';
	} 
	if(equipType === 6 || equipType === 8 || equipType === 9 || equipType === 10 
			|| equipType === 13 || equipType === 21 || equipType === 25 || equipType === 45 || equipType === 46  || equipType === 51) {
		selectRcvSystem.append('<span>SYSTEM NAME : </span><select name="systemRcListSelect" class="mu-value"></select>');
		Promise.all([nwtDetail.systemListAjax]).then(function() {
			nwtDetail.getSystemList();
		});
	}
	
	// 주니퍼스위치 셀렉트박스
	else if( equipType === 's11' ) {
		nwtDetail.params.equipType = '11';
		nwtDetail.params.lineId = param.LINE_ID;
		switchCategoryAjax = $.ajax({
			type: 'post',
			url: '/integration/monitor/network/grid/getSwitchCategory',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(nwtDetail.params),
			success:function (data) {
				var selectSystemHtml = []
				selectSystemHtml.push('<span>SWITCH NAME : </span><select name="swithRcListSelect" class="mu-value">');
				selectSystemHtml.push('<option value="">전체</option>');
				data.switchCategory.map(function (v, i) {
					selectSystemHtml.push('<option value="' + v.CATEGORY + '">' + v.CATEGORY + ' 스위치</option>');
				});
				selectSystemHtml.push('</select>');
				selectRcvSystem.append(selectSystemHtml.join(''));
				selectRcvSystem.append('&nbsp;&nbsp;<span>SYSTEM NAME : </span><select name="systemRcListSelect" class="mu-value"></select>');
				nwtDetail.swithIdForFailureDetail = '';
				Promise.all([nwtDetail.systemListAjax]).then(function() {
					nwtDetail.getSystemList();
				});
			}
		});
	}
	
	getRecoverDetail();
	
	$.ajax({
		cache : false,
		type : 'post',
		url : '/integration/monitor/network/getRecoverEquipType',
		contentType: 'application/json',
		dataType : 'json',
		data: JSON.stringify({alarmFilter: NETWORK_TOPOLOGY.params.alarmFilter}),
		success:function (data) {
			recoverEquipTypeList = data;
			
		}
	})
}

function getRecoverDetail(){
	
	var recoverTbody = $('#recoverDetailTbody').find('tbody');
	var recoverHtml = '';
	recoverTbody.empty();
	
	$.ajax({
		type: 'post',
		url: '/integration/monitor/network/grid/recoverdetail',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(nwtDetail.params),
		success: function (data) {
			
			var recoverData = []; 
			if ( data.RECOVER_DETAIL_MAP.hasOwnProperty('RECOVER_DATA') ){
				recoverData = data.RECOVER_DETAIL_MAP.RECOVER_DATA;
			}
			if(recoverData.length !== 0) {
				$(recoverData).each(function (idx, value) {
					recoverHtml += "<tr>";
					recoverHtml += "<td class='stat tc' ><i class='mu-icon alram " + value.SEVERITY.toLowerCase() + "' align='center'></i></td>";
					recoverHtml += "<td title=' " + value.SEVERITY + "' align='center'>" + value.SEVERITY + "</td>";
					recoverHtml += "<td title=' " + value.SYSTEM_NAME + "' align='center'>" + value.SYSTEM_NAME + "</td>";
					recoverHtml += "<td title=' " + value.ALARM_CODE + "' align='center'>" + value.ALARM_CODE + "</td>";
					recoverHtml += "<td title=' " + value.PROBABLE_CAUSE +"' align='center'>" + value.PROBABLE_CAUSE + "</td>";
					recoverHtml += "<td title=' " + value.FDN+"' align='center'>" + value.FDN + "</td>";
					recoverHtml += "<td title=' " + value.EVENT_TIME + "' align='center'>" + value.EVENT_TIME + "</td>";
					recoverHtml += "<td title=' " + value.RECOVER_TIME + "' align='center'>" + value.RECOVER_TIME + "</td>";
					recoverHtml += "</tr>"
				});
				
				recoverTbody.append(recoverHtml);
				
				
			}
		},
		error: function () {
		}
	});
	
	$("#divDialogBackground").show();
	$('#divRecoverFailureDetail').show();
}

/**
 * 이벤트 생성
 * @returns
 */
function setEvent() {
	
	// 윈도우 클릭시 contextmenu 숨김 처리
	$('.topologyWrap, .mu-dialog-body, .mu-dialog-head').on('click', function(e) {
    	if ( e.target.className.indexOf('server') == 0 || e.target.className.indexOf('equipList') == 0 || e.target.childElementCount > 0){
    		if(e.target.parentElement.parentElement.parentElement.id != 'duList'){	// dulist 하위 아닐 때 (20.06.04 DU 선택 시 메뉴 사라져서 추가)
    			if($('.dropdown-menu').css('display') == 'block'){
    				$('.dropdown-menu').hide();
    			}
    		}
    	}
	});
    
    $('.mu-dialog-body').on('click', function(e) {
    	if ( e.target.childElementCount === 1 || e.target.childElementCount ===2 ){   // 5호선팝업 창닫기
    		if($('.dropdown-menu').css('display') == 'block'){
    			$('.dropdown-menu').hide();
    		}
    	}
	});
    $('.dropdown-menu, .gridListWrap, #switchPortSelect').on('click', function(e) {
    	if($('.dropdown-menu').css('display') == 'block'){
			$('.dropdown-menu').hide();
		}
	});
	
	//기지국 통합감시 지도 클릭 시 메뉴 사라짐
	$('.map-image').on('click', function(e) {
    	if($('.dropdown-menu').css('display') == 'block'){
			$('.dropdown-menu').hide();
		}
	});
    
    // 레이어팝업 닫기 이벤트
	$('#divDialogBackground, .cancel').on('click', function(e){
		// 레이어팝업 hide
		$('#divDialogBackground').hide();
		$('#divDialogTrend').hide();
		$('.chartWrap').empty();
		$('#divPerformanceDetail').hide();
		$('#divFailureDetail').hide();
		$('#divSwitchView').hide();
		$('#divDUView').hide();
		$('#divEPCView').hide();
		$('#divRecoverFailureDetail').hide();
	});
	
	// 장비상세리스트 레이어팝업 닫기 이벤트
	$('#divDetailDialogBackground, .detailCancel').on('click', function(e){
		// 레이어팝업 hide 
		$('#divDetailDialogBackground').hide();
		$('#divSwitchListView').hide();
		$('#divEquip36ListView').hide();
		$('#divLineEquipVeiw').hide();	// 장비 목록 레이어 (7호선 장비선택 관련)
	});
	
	// 정류기 노선 선택 팝업 닫기 이벤트
	$('#divEquip36LineListBackground, .equip36LineCancel').on('click', function(e){
		$('#divEquip36LineListBackground').hide();
		$('#divEquip36LineListView').hide();
	});
	
	
	// 해제알람아이콘 클릭
	$('.clear24_icon').on('click', function(e) {
		var $this = $(this);
		$this.css('display','none');
		var param = $this.data('data') ;
		setRecover(param);
	});

	// DU 클릭 이벤트(토글 기능 추가)
	$('#duList').on('click', '.serverGroup', function(e) { 
		
		// 해제알람아이콘 클릭
		if ($(e.target).hasClass('clear24_icon')){
			var $this = $(this);
			$this.find('.clear24_icon').css('display','none');
			setRecover($this.data('data'));
		}
		else{
			var $this = $(this);
			
			if($this.hasClass('selected')) {
				// 선택 해제
				$this.removeClass('selected');
				duSelectedIndex = -1;
				getTopologyRuInfo();
			} else {
				// 선택
				// 현재 선택된 du index 저장
				duSelectedIndex = $('#duList .serverGroup').index($this);
				
				$this.parent().children().removeClass('selected');
				$this.addClass('selected');
				
				getTopologyRuInfo($this.data('data').SYSTEM_ID);
			}
		}
		
	});

	// EPC 리스트
	$('#epcList').on({
		mousemove: function(e) {
			equipMouseOver($(this).parent(), e);
		},
		mouseout: function(e) {
			equipMouseOut($(this), e);
		},
		
		click: function(e) {
			showContextmenu($(this).parent(), e);
		    e.preventDefault();
		},
	}, '> div >');
	
	$('#serviceServerList, #emsList, #reservedEpcList, #etcList').on({

		click: function(e) {
			showContextmenu($(this), e);
		    e.preventDefault();
		},
		
	}, '> div:not(.no-menu) >');	// serviceServerList 하위 정류기에만 이벤트제외
				
	$('.storage').on({
		mousemove: function(e) {
			equipMouseOver($(this), e);
		},
		mouseout: function(e) {
			equipMouseOut($(this), e);
		},
	})
	
	// DU 이벤트
	$('#duList').on({
		mousemove: function(e) {
			equipMouseOver($(this).parent(), e);
		},
		mouseout:function(e) {
			equipMouseOut($(this), e);
		},
		click: function(e) {
			showContextmenu($(this).parent(), e);
		    e.preventDefault();
		},
	}, '> div > ');
	
	// 기지국 통합 감시 DU 이벤트
	$('#baseStationDuList').on({
		mousemove: function(e) {
			equipMouseOver($(this), e);
		},
		mouseout:function(e) {
			equipMouseOut($(this), e);
		},
		click: function(e) {
			showContextmenu($(this), e);
		    e.preventDefault();
		},
	}, 'i');
	
	// RU 이벤트
	/*$('#ruList').on({
		mousemove: function(e) {
			equipMouseOver($(this), e);
		},
		mouseout:function(e) {
			equipMouseOut($(this), e);
		},
		
		click: function(e) {
			// 해제알람 처리
			if ($(e.target).hasClass('clear24_icon_sm')){
				var $this = $(this);
				$this.find('.clear24_icon_sm').css('display','none');
				
				var EQUIP_TYPE = 3;
				var RRH = $this.attr('id').split('_')[2] + '_'+ $this.attr('id').split('_')[3] + '_'+$this.attr('id').split('_')[4];
				var DU_ID = $this.attr('id').split('_')[1];
				var ruInfo = {
						'EQUIP_TYPE' : EQUIP_TYPE
						, 'RRH' : RRH
						, 'DU_ID' : DU_ID
				}
				setRecover(ruInfo);
			}else{
				showContextmenu($(this), e);
				e.preventDefault();
			}
		},
	}, '.serverGroup');*/
	
	$('#juniperSwitchList, #equip36List, #lineEquipList').on({
		click: function(e) {
			// 해제알람 처리
			if ($(e.target).hasClass('clear24_icon')){
				var $this = $(this);
//				$this.css('display','none');
				$this.find('.clear24_icon').css('display','none')
				setRecover($this.data('data'));
				
			}else{
				showContextmenu($(this), e);
				e.preventDefault();
			}
		},
	}, '.serverGroup');
	
	// 성능/고장 상세정보 팝업에서 소팅 이벤트
    var theadId = '';
	$('#failureDetailThead, #performanceDetailThead').on('click', '.sort', function(e) {
		theadId = '#' + $(this).parent().parent().parent().attr('id');
		columnSorting.dataSort(this, e.ctrlKey, theadId);
		if (theadId === '#performanceDetailThead') {
			nwtDetail.getPerformanceDetail();
		} else {
			nwtDetail.getFailureDetail();
		}
	});
	
    // 고장상세정보 팝업에서 장비 셀렉트 박스를 변경할 때
    $('#selectSystem').on('change', 'select[name=systemListSelect]', function () {
        nwtDetail.systemIdForFailureDetail = $('select[name=systemListSelect]').val();
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
		nwtDetail.params.systemId = nwtDetail.systemIdForFailureDetail
        nwtDetail.getFailureDetail();
        
    });
    
    // 해제알람상세정보 팝업에서 장비 셀렉트 박스를 변경할 때
    $('#selectRcvSystem').on('change', 'select[name=systemRcListSelect]', function () {
        nwtDetail.systemIdForRecovereDetail = $('select[name=systemRcListSelect]').val();
		nwtDetail.params.systemId = nwtDetail.systemIdForRecovereDetail
		getRecoverDetail();
        
    });
    
    // 고장상세정보 팝업에서 스위치장비 셀렉트 박스를 변경할 때
    $('#selectSystem').on('change', 'select[name=swithListSelect]', function () {
    	nwtDetail.systemIdForFailureDetail = '';
        nwtDetail.swithIdForFailureDetail = $('select[name=swithListSelect]').val();
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
		nwtDetail.params.category = nwtDetail.swithIdForFailureDetail;
		nwtDetail.params.systemId = '';
		Promise.all([nwtDetail.systemListAjax]).then(function() {
			nwtDetail.getSystemList();
		});
        nwtDetail.getFailureDetail();
        
    });
    
    // 해제알람 장상세정보 팝업에서 스위치장비 셀렉트 박스를 변경할 때
    $('#selectRcvSystem').on('change', 'select[name=swithRcListSelect]', function () {
    	nwtDetail.systemIdForRecovereDetail = '';
        nwtDetail.swithIdForRecovereDetail = $('select[name=swithRcListSelect]').val();
		nwtDetail.params.category = nwtDetail.swithIdForRecovereDetail;
		nwtDetail.params.systemId = '';
		Promise.all([nwtDetail.systemListAjax]).then(function() {
			nwtDetail.getSystemList();
		});
        // 해제알람팝업
        getRecoverDetail();
        
    });

    // 가청, 감시중 클릭 이벤트
	$(".top-buttons").on('click', function() {
		var watch_test = $(this).children().hasClass("watch");
		var sound_test = $(this).children().hasClass("sound");
		
		if(watch_test) {
			if (NETWORK_TOPOLOGY.watchFlag) {
				// 감시 버튼 ON 상태일 때 클릭
				$(this).removeClass("mu-toggle-on");
				$(".top-buttons .sound").parent().removeClass("mu-toggle-on");
				NETWORK_TOPOLOGY.soundFlag = false;
				NETWORK_TOPOLOGY.watchFlag = false;
				setRefresh();
				
				//고장 알람 발생
				$("#failureWatchBtn").children().removeClass('pause');
		        $("#failureWatchBtn").children().addClass('play');
		        $("#btn_alarmSound").removeClass("mu-toggle-on");
		        audioFunction.failureAudioPause();
		        //감시중 Off인 경우 Websocket Close
		        isView = false;
		        ws.close();

			} else {
				// 감시 버튼 OFF 상태일 때 클릭
				$(this).addClass("mu-toggle-on");
				$(".sound").parent().addClass("mu-toggle-on");
				NETWORK_TOPOLOGY.soundFlag = true;
				NETWORK_TOPOLOGY.watchFlag = true;

				audioFile.f_criticalaudio.pause();
				audioFile.f_criticalaudio.currentTime = 0;
				audioFile.f_majoraudio.pause();
				audioFile.f_majoraudio.currentTime = 0;
				audioFile.f_minoraudio.pause();
				audioFile.f_minoraudio.currentTime = 0;
				audioFunction.audioPuse();
				audioFunction.networkAudioPlay($('#audioAlarmLevel').val(), 0);
				setRefresh();
				
				//고장 알람 발생
				$("#failureWatchBtn").children().removeClass('play');
		        $("#failureWatchBtn").children().addClass('pause');
		        $("#btn_alarmSound").addClass("mu-toggle-on");
		        networkMonitoringFailureWebsocketRestart();
		        audioFunction.failureAudioPause();
		        setAlarmSound();
			}
		}

		if(sound_test) {
			if (NETWORK_TOPOLOGY.soundFlag) {
				$(this).removeClass("mu-toggle-on");
				NETWORK_TOPOLOGY.soundFlag = false;
				audioFunction.audioPuse();
				
				//고장 알람 발생
			  	$("#btn_alarmSound").removeClass('mu-toggle-on');
		        audioFunction.failureAudioPause();
			} else {
				if (NETWORK_TOPOLOGY.watchFlag) {
					$(this).addClass("mu-toggle-on");
					NETWORK_TOPOLOGY.soundFlag = true;

					audioFile.f_criticalaudio.pause();
					audioFile.f_criticalaudio.currentTime = 0;
					audioFile.f_majoraudio.pause();
					audioFile.f_majoraudio.currentTime = 0;
					audioFile.f_minoraudio.pause();
					audioFile.f_minoraudio.currentTime = 0;

					audioFunction.audioPuse();
					audioFunction.networkAudioPlay($('#audioAlarmLevel').val(), 3);
					
					//고장 알람 발생
					$("#btn_alarmSound").addClass('mu-toggle-on');
		            setAlarmSound();
				} else {
					alert("감시 중이 아닐 경우 가청을 활성화 할 수 없습니다.");
					return false;
				}
			}
		}
	});
	
	// 스위치 클릭 이벤트
	$('#switchList').on({
		click: function(e) {
			showContextmenu($(this), e);
		    e.preventDefault();
		},
		
	}, '> div >');
	
	// 정류기 클릭 이벤트 
	$("#rectifier").on('click', function(e){
		// (!)가 아닐 경우에만
		if ( !$(e.target).hasClass('clear24_icon')){
			// 관제, 5호선, 7호선 선택 레이어 띄움
			$('#divEquip36LineListBackground').show();
			$('#divEquip36LineListView').show();
		}
	});
	
	// 정류기 > 노선 선택 화면에서 노선별 이벤트
	$('#jrgLineList').on({
		click: function(e) {
			showContextmenu($(this), e);
			e.preventDefault();
		},
	}, '> div >');
	
	// MDM 클릭 이벤트
	$('#mdm').on({
		click:function(e){
			// (!)가 아닐 경우에만
			if ( !$(e.target).hasClass('clear24_icon')){
				var divTop = e.clientY - 40;
				var divLeft = e.clientX;
					
				$('#divDetailDialogBackground').show();
				$('#divLineEquipVeiw').css({ "top": divTop ,"left": divLeft , "position": "absolute" }).show();
				
				setLineEquipView(18);
			}
		}
	});
	
	// 영창처리장치 클릭 이벤트
	$('#image').on({
		click:function(e){
			// (!)가 아닐 경우에만
			if ( !$(e.target).hasClass('clear24_icon')){
				var divTop = e.clientY - 40;
				var divLeft = e.clientX;
					
				$('#divDetailDialogBackground').show();
				$('#divLineEquipVeiw').css({ "top": divTop ,"left": divLeft , "position": "absolute" }).show();
				
				setLineEquipView(27);
			}
		}
	});
}

function setLineEquipView(equipType){
	if(equipType != null){
		cur_lineEquipType = equipType;
	}
	
	var $equipList = $('#lineEquipList');
	$equipList.children('li').hide();
	
	$equipList.children('li').each(function(i, e) {
		var $equip = $('#'+e.id);
		if($equip.data('data').EQUIP_TYPE === cur_lineEquipType){
			$equip.show();
		}
	});
};

// 스위치(주니퍼, 노키아) 분리에 따른 정보 저장
var switch1180Info = {
	category: "거점BB "
	, equipName: "스위치"
	, equipType: 11
	, eventTime: undefined
	, systemId: "1180"
	, systemName: "거점BB  스위치"
};

var switch1164Info = {
	category: "관제소"
	, equipName: "스위치"
	, equipType: 11
	, eventTime: undefined
	, systemId: "1164"
	, systemName: "관제소 스위치"
};

var switch1114Info = {
	category: "역사BB"
	, equipName: "스위치"
	, equipType: 11
	, eventTime: undefined
	, systemId: "1114"
	, systemName: "역사BB 스위치"
};

var switch1134Info = {
	category: "DU"
	, equipName: "스위치"
	, equipType: 11
	, eventTime: undefined
	, systemId: "1134"
	, systemName: "DU 스위치"
};

var switchAll = {
	category: ""
	, equipName: "스위치"
	, equipType: 11
	, eventTime: undefined
	, systemId: "1134"
	, systemName: ""
};
function switchPort(vl){
	if (vl === 'switch1180'){
		nwtDetail.goSwitch(switch1180Info)
	}else if (vl === 'switch1164'){
		nwtDetail.goSwitch(switch1164Info)
	}else if (vl === 'switch1114'){
		nwtDetail.goSwitch(switch1114Info)
	}else if (vl === 'switch1134'){
		nwtDetail.goSwitch(switch1134Info)
	}else {
		nwtDetail.goSwitch(switchAll) 
	}
}

function equip11switch(vl){
	switch11chk = vl;
	var selectName = vl;
	switchCategoryAjax = $.ajax({
		type: 'post',
		url: '/integration/monitor/network/grid/getSwitchCategory',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(nwtDetail.params)
	});

	switchCategoryAjax.then(function (data) {
		var switchCategorySelect = $('select[name=switchPortSelect]');
		switchCategorySelect.empty();
		switchCategorySelect.append('<option value="">전체</option>');
		data.switchCategory.map(function (v, i) {
			switchCategorySelect.append('<option value="' + v.CATEGORY + '">' + v.CATEGORY + ' 스위치</option>');
		});
		$("#switchPortSelect").val(switch11chk).prop("selected", true);
	});

	$.when(equipAjax).done(function(equipData) {
		$.each(equipData, function(i, o) {
			if( o.EQUIP_TYPE === 11 ){
				var $equip = $('#equip_' + o.SYSTEM_ID+'_'+o.EQUIP_TYPE+'_'+'N')
				if ( (o.CATEGORY == vl || switch11chk == '') && ($equip.parent().data('data')['LINE_ID'].indexOf(switchLineId) >=0) ){
					$equip.parent().show();
				}else{
					$equip.parent().hide();
				}
			}
		})
	})
}

/**
 * contextmenu 표시
 * 
 * @param $serverGroup
 * @returns
 */
function showContextmenu($serverGroup, e) {
	
	// 알람 느낌표에서는 이벤트 X
	if ($(e.target).hasClass('clear24_icon') || $(e.target).hasClass('clear24_icon_sm')){
		return;
	}
	
	var data = $serverGroup.data('data');
	if(_.isEmpty(data)) {
		data = $serverGroup.parent().find('.serverBox').data('data');
	}
	var menuList = [];
	
	// 스위치 마지막 뎁스
	if (data.EQUIP_TYPE === 11){
		menuList.push({
			name: '포트 조회',
			callback: function($serverGroup) {
				var data = $serverGroup.data('data');
			if(_.isEmpty(data)) {
				data = $serverGroup.parent().find('.serverBox').data('data');
			}
				var param = {
					eventTime: data.EVENT_TIME,
					equipType: data.EQUIP_TYPE,
					equipName: data.EQUIP_NAME,
					systemId: data.SYSTEM_ID,
					systemName: "",
					category: ""
				};
				$('select[name="switchPortSelect"] option:first').prop('selected', true);
				nwtDetail.goSwitch(param);
			}
		});
	}
 	
	// 스위치 - 관제
	if (data.EQUIP_TYPE ===  'switch_gwanje'){
		switchLineId = '0';
	}
	// 스위치 - 5호선 (Aka.하남선)
	if (data.EQUIP_TYPE ===  'switch_station5'){
		switchLineId = '5';
	}
	// 스위치 - 7호선 (Aka.석남선)
	if (data.EQUIP_TYPE ===  'switch_station7'){
		switchLineId = '7';
	}
	
	// 한 뎁스 없애면서 첫 화면의 스위치 클릭 시 메뉴 
 	if(data.EQUIP_TYPE === 'juniper11' || data.EQUIP_TYPE ===  'switch_gwanje' || data.EQUIP_TYPE ===  'switch_station5' || data.EQUIP_TYPE ===  'switch_station7') {
 		switch11chk = '';
 		equip11switch(switch11chk);

 		menuList.push({
			name: '스위치 리스트',
			callback: function($serverGroup) {
				$("#divDetailDialogBackground").show();
				$('#divSwitchListView').show()
				if ( switchLineId == '0'){
					$('#switch11ListPoptitle').text('관제 - 스위치리스트')
				}else if ( switchLineId == '5'){
					$('#switch11ListPoptitle').text('하남선 - 스위치리스트')
				}else if ( switchLineId == '7'){
					$('#switch11ListPoptitle').text('석남선 - 스위치리스트')
				}
				$('#juniperSwitchList').children('li').hide();
				$('#juniperSwitchList').children('li').each(function(i, e) {
				    if (e.id.split('-')[0].indexOf(switchLineId) >=0 ){
				    	$('#'+e.id).show();
				    }
				})
			}
		});
 	}
 	
 	// 정류기 팝업 관제,5호선, 7호선 클릭시 메뉴
 	if(data.EQUIP_TYPE == 'jrg36_gwanje' || data.EQUIP_TYPE == 'jrg36_station5' || data.EQUIP_TYPE == 'jrg36_station7') {
 		
 		// 선택된 라인 정보 전역에 담아 둠
 		var splitJrgType = data.EQUIP_TYPE.split('_');;
 		var jrgLineInfo = splitJrgType[splitJrgType.length-1];
 		if(jrgLineInfo == 'station5'){
			jrgLineId = '5'
		}else if(jrgLineInfo == 'station7'){
			jrgLineId = '7'
		}else{
			jrgLineId = '0'
		}
 		
 		menuList.push({
			name: '정류기 리스트',
			callback: function($serverGroup) {
				$("#divDetailDialogBackground").show();
				$('#divEquip36ListView').show();
				
				$('#equip36List').children('li').hide();
				$('#equip36List').children('li').each(function(i, e) {
				    if (e.id.split('-')[0].indexOf(jrgLineId) >=0 ){
				    	$('#'+e.id).show();
				    }
				});
			}
		});
 	}

	if(data.EQUIP_TYPE === 1 || data.EQUIP_TYPE === 4 || data.EQUIP_TYPE === 6 || data.EQUIP_TYPE === 7
			|| data.EQUIP_TYPE === 2 || data.EQUIP_TYPE == 41 ||  data.EQUIP_TYPE == 3 ) {
		// MME, PGW/SGW, HSS, PCRF, DU, RU
		menuList.push({
			name: 'Trend',
			callback: function($serverGroup) {
				var data = $serverGroup.data('data');
				if(_.isEmpty(data)) {
					data = $serverGroup.parent().find('.serverBox').data('data');
				}
				var param = {
					eventTime: data.EVENT_TIME,
					equipType: data.EQUIP_TYPE,
					equipName: data.EQUIP_NAME,
					systemId: data.SYSTEM_ID,
					systemName: (data.EQUIP_TYPE === 2 || data.EQUIP_TYPE === 3 ? data.SYSTEM_NAME : data.EQUIP_NAME)
				};
				nwtDetail.goTrend(param);
			}
		});
		menuList.push({
			name: '성능상세조회',
			callback: function($serverGroup) {
				var data = $serverGroup.data('data');
				if(_.isEmpty(data)) {
					data = $serverGroup.parent().find('.serverBox').data('data');
				}
				var param = {
					eventTime: data.EVENT_TIME,
					equipType: data.EQUIP_TYPE,
					equipName: data.EQUIP_NAME,
					systemId: data.SYSTEM_ID,
					systemName: (data.EQUIP_TYPE === 2 || data.EQUIP_TYPE === 3 ? data.SYSTEM_NAME : data.EQUIP_NAME)
				};
				nwtDetail.goPerformanceDetail(param);
			}
		});	
	}
	
	menuList.push({
		name: '고장상세조회',
		callback: function($serverGroup) {
			var data = $serverGroup.data('data');
			if(_.isEmpty(data)) {
				data = $serverGroup.parent().find('.serverBox').data('data');
			}
			var systemName = data.EQUIP_NAME;
			//DU, 스위치 (같은 EQUIP_TYPE를 갖는 장비는 SYSTEM_NAME으로 구분)
			if(data.EQUIP_TYPE === 2 || data.EQUIP_TYPE === 57) {
				systemName = data.SYSTEM_NAME;
			}
			var param = {
				eventTime: data.EVENT_TIME,
				equipType: data.EQUIP_TYPE,
				equipName: data.EQUIP_NAME,
				systemId: data.SYSTEM_ID,
				systemName: systemName,
				rrh: data.RRH,
				duId: data.DU_ID,
				category: data.CATEGORY
			};
			
			
			// 스위치 - 관제
			if( data.EQUIP_TYPE === 'switch_gwanje'){
				param = {
				alarmFilter: ""
				,category: ""
				,equipName: ""
				,equipType: 11
				,eventTime: ""
				,searchType: ""
				,sortOption: []
				,startTime: ""
				,systemId: ""
				,systemName: "관제 스위치"
				}
			}
			// 스위치 - 하남선
			if( data.EQUIP_TYPE === 'switch_station5'){
				param = {
				alarmFilter: ""
				,category: ""
				,equipName: ""
				,equipType: 11
				,eventTime: ""
				,searchType: ""
				,sortOption: []
				,startTime: ""
				,systemId: ""
				,systemName: "하남선 스위치"
				}
			}
			//스위치 - 석남선
			if( data.EQUIP_TYPE === 'switch_station7'){
				param = {
				alarmFilter: ""
				,category: ""
				,equipName: ""
				,equipType: 11
				,eventTime: ""
				,searchType: ""
				,sortOption: []
				,startTime: ""
				,systemId: ""
				,systemName: "석남선 스위치"
				}
			}
			
			//정류기 관제, 5호선, 7호선 
			if(data.EQUIP_TYPE == 'jrg36_gwanje' || data.EQUIP_TYPE == 'jrg36_station5' || data.EQUIP_TYPE == 'jrg36_station7') {
				param = {
				alarmFilter: ""
				,category: ""
				,equipName: ""
				,equipType: 36
				,eventTime: ""
				,searchType: ""
				,sortOption: []
				,startTime: ""
				,systemId: ""
				,systemName: "정류기장비"
				}
			}
			
			nwtDetail.goFailureDetail(param);
		}
	});
//	}
	
	$('.dropdown-menu').empty();
	
	$.each(menuList, function(i, o) {
		var $li = $('<li><a href="#">' + o.name + '</a></li>');
		$li.on('click', function(e) {
			o.callback.apply($serverGroup, [$serverGroup]);
			e.preventDefault();
		});
		
		$('.dropdown-menu').append($li);
	});
	
	var pos = abspos(event);
	var tooltipWidth = pos.x + $('.dropdown-menu').width() + 15;
	var tooltipHeight = pos.y + $('.dropdown-menu').height() + 15;
	
	if(tooltipWidth > document.body.clientWidth) {
		$('.dropdown-menu').css("left", pos.x - 40 - $('.dropdown-menu').width() + 15);
	} else {
		$('.dropdown-menu').css("left", pos.x + 15);
	}
	if(tooltipHeight > document.body.clientHeight) {
		$('.dropdown-menu').css("top", pos.y - 40 - $('.dropdown-menu').height() + 15);
	} else {
		$('.dropdown-menu').css("top", pos.y + 15);
	}
	$('.dropdown-menu').show();
	
}

function equipMouseOut($serverGroup, e) {
	var $tooltip = $('.Q-Tooltip');
	$tooltip.empty();
	$tooltip.hide();
}

function equipMouseOver($serverGroup, e) {
	
	
	if ( $(e.target).hasClass('clear24_icon') || $(e.target).hasClass('clear24_icon_sm') ){
		return;
	}
	
	var data = $serverGroup.data('data');
	if(_.isEmpty(data)) {
		data = $serverGroup.parent().find('.serverBox').data('data');
	}
	var performanceAlarmLevel = $serverGroup.data('performanceAlarmLevel');
	var failureAlarmLevel = $serverGroup.data('failureAlarmLevel');
	var $tooltip = $('.Q-Tooltip');
	if(data) {
		var title = '';
		var html = [];
		html.push('<div class="mu-tooltip" style="min-width:180px;">');
		html.push('<div style="float:left;">');
		if(data.EQUIP_TYPE && data.EQUIP_TYPE === 4) {
			title = 'PGW';
		} else if(data.EQUIP_TYPE && data.EQUIP_TYPE === 6) {
			title = 'HSS';	 
		}else if(data.EQUIP_TYPE && data.EQUIP_TYPE !== 2 && data.EQUIP_TYPE !== 3) {
			title = data.EQUIP_NAME;
		} else {
			title = data.VIEW_NAME;
		}
		
		html.push('<div class="mu-tooltip-header">' + title + '</div>');
		if(data.EQUIP_TYPE === 1) {
			// MME
			var arr;
			if(data.DATA_ATTACH) {
				arr = [
					{name: '시도호', val: data.DATA_ATTACH.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_ATTACH.ATT_RATE), level: data.DATA_ATTACH.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_ATTACH.SUCC_RATE), level: data.DATA_ATTACH.SUCC_RATE_LEVEL},
					/*{name: '접속율(%)', val: convertPercent(data.DATA_ATTACH.ANS_RATE), level: data.DATA_ATTACH.ANS_RATE_LEVEL}*/
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
					/*{name: '접속율(%)', val: '-', level: 4}*/
				];
			}
			html.push(getTooltipItem('Attach', arr));
			if(data.DATA_SR) {
				arr = [
					{name: '시도호', val: data.DATA_SR.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_SR.ATT_RATE), level: data.DATA_SR.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_SR.SUCC_RATE), level: data.DATA_SR.SUCC_RATE_LEVEL},
					/*{name: '접속율(%)', val: convertPercent(data.DATA_SR.ANS_RATE), level: data.DATA_SR.ANS_RATE_LEVEL}*/
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
					/*{name: '접속율(%)', val: '-', level: 4}*/
				];
			}
			html.push(getTooltipItem('SRMO', arr));
			if(data.DATA_SRMT) {
				arr = [
					{name: '시도호', val: data.DATA_SRMT.ATTEMPT}, 
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_SRMT.ATT_RATE), level: data.DATA_SRMT.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_SRMT.SUCC_RATE), level: data.DATA_SRMT.SUCC_RATE_LEVEL},
					/*{name: '접속율(%)', val: convertPercent(data.DATA_SRMT.ANS_RATE), level: data.DATA_SRMT.ANS_RATE_LEVEL}*/
				];
			} else { 
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
					/*{name: '접속율(%)', val: '-', level: 4}*/
				];
			}
			html.push(getTooltipItem('SRMT', arr));
		} else if(data.EQUIP_TYPE === 6) {
			// HSS
			var arr;
			if(data.DATA_S6A_INTERFACE) {
				arr = [
					{name: '시도호', val: data.DATA_S6A_INTERFACE.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_S6A_INTERFACE.ATT_RATE), level: data.DATA_S6A_INTERFACE.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_S6A_INTERFACE.SUCC_RATE), level: data.DATA_S6A_INTERFACE.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
				];
			}
			html.push(getTooltipItem('S6A Interface', arr));
			
			if(data.DATA_CX_INTERFACE) {
				arr = [
					{name: '시도호', val: data.DATA_CX_INTERFACE.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_CX_INTERFACE.ATT_RATE), level: data.DATA_CX_INTERFACE.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_CX_INTERFACE.SUCC_RATE), level: data.DATA_CX_INTERFACE.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
				];
			}
			html.push(getTooltipItem('Cx Interface', arr));
		
		} else if(data.EQUIP_TYPE === 4) {
			// PGW/SGW
			var arr;
			if(data.DATA_PGW_CREATE) {
				arr = [
					{name: '시도호', val: data.DATA_PGW_CREATE.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_PGW_CREATE.ATT_RATE), level: data.DATA_PGW_CREATE.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_PGW_CREATE.SUCC_RATE), level: data.DATA_PGW_CREATE.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4}
				];
			}
			html.push(getTooltipItem('Create', arr));
			if(data.DATA_PGW_DELETE) {
				arr = [
					{name: '시도호', val: data.DATA_PGW_DELETE.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_PGW_DELETE.ATT_RATE), level: data.DATA_PGW_DELETE.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_PGW_DELETE.SUCC_RATE), level: data.DATA_PGW_DELETE.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4}
				];
			}
			html.push(getTooltipItem('Delete', arr));
			if(data.DATA_PGW_MODIFY) {
				arr = [
					{name: '시도호', val: data.DATA_PGW_MODIFY.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_PGW_MODIFY.ATT_RATE), level: data.DATA_PGW_MODIFY.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_PGW_MODIFY.SUCC_RATE), level: data.DATA_PGW_MODIFY.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4}
				];
			}
			html.push(getTooltipItem('Modify', arr));
		} else if(data.EQUIP_TYPE === 10) {
			// REC
			var arr;
			if(data.DATA_REC) {
				arr = [
					{name: '시도호', val: data.DATA_REC.CALL_ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_REC.CALL_ATT_RATE), level: data.DATA_REC.CALL_ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_REC.CALL_SUCC_RATE), level: data.DATA_REC.CALL_SUCC_RATE_LEVEL},
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
				];
			}
			html.push(getTooltipItem('CALL', arr));
			if(data.DATA_REC) {
				arr = [
					{name: '시도호', val: data.DATA_REC.PTT_ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_REC.PTT_ATT_RATE), level: data.DATA_REC.PTT_ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_REC.PTT_SUCC_RATE), level: data.DATA_REC.PTT_SUCC_RATE_LEVEL},
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
				];
			}
			html.push(getTooltipItem('PTT', arr));
		} else if (data.EQUIP_TYPE === 2){

			// DU
			var arr = [ 
				{name: 'RRC 시도호', val: data.ATTEMPT},
				{name: 'RRC 시도호 증감율(%)', val: convertPercent(data.ATT_RATE), level: data.ATT_RATE_LEVEL},
				{name: 'ERAB Setup 시도호', val: data.ERAB_ATTEMPT}, 																// ERAB Setup 시도호
				{name: 'ERAB Setup 시도호 증감율(%)', val: convertPercent(data.ERAB_ATT_RATE), level: data.ERAB_ATT_RATE_LEVEL},	// ERAB Setup 시도호 증감율(%)
				{name: '소통율(RRC 성공율)(%)', val: convertPercent(data.RRC_RATE), level: data.RRC_RATE_LEVEL},
				{name: '완료율(ERAB Setup 성공율)(%)', val: convertPercent(data.ANS_RATE), level: data.ANS_RATE_LEVEL},
				{name: '절단율(%)', val: convertPercent(data.CD_RATE), level: data.CD_RATE_LEVEL}
			];
			html.push(getTooltipItem('', arr));
		}
		html.push('</div>');
		if(data.EQUIP_TYPE === 4) {
			// PGW/SGW
			// 툴팁이 두줄로 표시 되야 함.
			html.push('<div style="float:left;">');
			html.push('<div class="mu-tooltip-header">SGW</div>');
			var arr;
			if(data.DATA_SGW_ATTACH) {
				arr = [
					{name: '시도호', val: data.DATA_SGW_ATTACH.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_SGW_ATTACH.ATT_RATE), level: data.DATA_SGW_ATTACH.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_SGW_ATTACH.SUCC_RATE), level: data.DATA_SGW_ATTACH.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4}
				];
			}
			html.push(getTooltipItem('Create', arr));
			if(data.DATA_SGW_DELETE) {
				arr = [
					{name: '시도호', val: data.DATA_SGW_DELETE.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_SGW_DELETE.ATT_RATE), level: data.DATA_SGW_DELETE.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_SGW_DELETE.SUCC_RATE), level: data.DATA_SGW_DELETE.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4}
				];
			}
			html.push(getTooltipItem('Delete', arr));
			if(data.DATA_SGW_MODIFY) {
				arr = [
					{name: '시도호', val: data.DATA_SGW_MODIFY.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_SGW_MODIFY.ATT_RATE), level: data.DATA_SGW_MODIFY.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_SGW_MODIFY.SUCC_RATE), level: data.DATA_SGW_MODIFY.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4}
				];
			}
			html.push(getTooltipItem('Modify', arr));
			html.push('</div>');
		}
		if(data.EQUIP_TYPE === 6) {
			// HHS/PCRF
			// 툴팁이 두줄로 표시 되야 함.
			html.push('<div style="float:left;">');
			html.push('<div class="mu-tooltip-header">PCRF</div>');

			if(data.DATA_GX) {
				arr = [
					{name: '시도호', val: data.DATA_GX.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_GX.ATT_RATE), level: data.DATA_GX.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_GX.SUCC_RATE), level: data.DATA_GX.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
				];
			}
			html.push(getTooltipItem('Gx', arr));
			if(data.DATA_RX) {
				arr = [
					{name: '시도호', val: data.DATA_RX.ATTEMPT},
					{name: '시도호 증감율(%)', val: convertPercent(data.DATA_RX.ATT_RATE), level: data.DATA_RX.ATT_RATE_LEVEL},
					{name: '성공율(%)', val: convertPercent(data.DATA_RX.SUCC_RATE), level: data.DATA_RX.SUCC_RATE_LEVEL}
				];
			} else {
				arr = [
					{name: '시도호', val: '-'},
					{name: '시도호 증감율(%)', val: '-', level: 4},
					{name: '성공율(%)', val: '-', level: 4},
				];
			}
			html.push(getTooltipItem('Rx', arr));
			html.push('</div>');
		}
		html.push(getTooltipAlarm('알람등급(성능)', performanceAlarmLevel));
		html.push(getTooltipAlarm('알람등급(고장)', failureAlarmLevel));
		html.push('</div>');
		$tooltip.html(html.join(''));
		$tooltip.show();
	}

	var tooltipWidth = e.clientX + $tooltip.width() + 15;
	var tooltipHeight = e.clientY + $tooltip.height() + 15;

	if(tooltipWidth > document.body.clientWidth) {
		$tooltip.css("left", getX(e) - 20 - $tooltip.width() + 5);
	} else {
		$tooltip.css("left", getX(e) + 5);
	}
	if(tooltipHeight > document.body.clientHeight) {
		$tooltip.css("top", getY(e) - 20 - $tooltip.height() + 5);
	} else {
		$tooltip.css("top", getY(e) + 5);
	}
	data = null;
	$serverGroup = null;
}

function getX(event) {// left position
	if (event.pageX) {
		return event.pageX;
	} else {
		return event.clientX;
	}
}

function getY(event) { // top position
	if (event.pageY) {
		return event.pageY;
	} else {
		return event.clientY;
	}
}

/**
 * 서비스장비, 주제어장치, 스위치, 응용시스템, DU, RU 정보 조회
 * @returns
 */
function getTopologyEquipInfo() {
	equipAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/integration/monitor/network/getEquipList',
		data : {alarmFilter: NETWORK_TOPOLOGY.params.alarmFilter},
		dataType : 'json'
	});
	
	duAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/integration/monitor/network/getDuList',
		data : {alarmFilter: NETWORK_TOPOLOGY.params.alarmFilter},
		dataType : 'json'
	});
	
	// du정보 가져올때 ru 정보도 가져와서 ruInfoList에 담아둠.
	ruAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/integration/monitor/network/getRuList',
		data : {alarmFilter: NETWORK_TOPOLOGY.params.alarmFilter},
		dataType : 'json'
	});
	
	recoverEquipTypeAjax = $.ajax({
		cache : false,
		type : 'post',
		url : '/integration/monitor/network/getRecoverEquipType',
		contentType: 'application/json',
		dataType : 'json',
		data: JSON.stringify({alarmFilter: NETWORK_TOPOLOGY.params.alarmFilter})
	});
	
}

function getTopologyRuInfo(duId) {
	var $ruList = $('#ruList');
	
	// ru 목록 없애기
	$ruList.children().remove();
	
	var ruCri = [];
	var ruMaj = [];
	var ruMnr = [];
	var runml = [];
	$('#tb_failure_alarm tr').each(function(i, e) {
		var data = $(e).data('data');
		var failureAlarmLevel = data.alarmLevel;
		
		if(data.equipType == 2) {
            var ruKey = getRuKey(data);
            if(ruKey.split('_').length > 1) {
            	ruKey = 'ru_' + ruKey;
	            
	            if ( Number(failureAlarmLevel) == 1 ){
	            	ruCri.push(ruKey);
	            }else if( Number(failureAlarmLevel) == 2  ){
	            	ruMaj.push(ruKey);
	            }else if( Number(failureAlarmLevel) == 3  ){
	            	ruMnr.push(ruKey);
	            }else{
	            	runml.push(ruKey);
	            }
	        }
		}
	});
	
	var duruInfo = recoverEquipTypeList.recoverEquipDuRu;
	var duruIdList = [];
	if(duruInfo != null){
		if (duruInfo.length > 0) {
			$.each(duruInfo, function(i, o) {
				duruIdList.push(o.EQUIP_ID);
			})
		}
	}
	
	if($ruList.children().length === 0) {
		// 최초에 ru 목록 없으면 생성.
		if (ruInfoList.length > 26){
			$ruList.css('overflow-y', '');
		}else {
			//$('#failureGridDiv').height(260); // 스크롤 생김
		}
		
		if (ruCri.length > 0){
			$.each(ruInfoList, function(i, o) {
				var key = 'ru_' + o.DU_ID + '_' + o.SECTOR + '_' + o.PORT_ID + '_' + o.SEQUENCE_ID;
				if (ruCri.indexOf(key)>=0){
					var ruLiHtml = [];
					ruLiHtml.push('<li id="' + key + '" class="serverGroup station" style="height:85px;display:none;">');
					ruLiHtml.push('	<span class="stage" style="display:none;"></span>');
					ruLiHtml.push('	<div class="serverBox">');
					ruLiHtml.push('	<div class="state normal">서버</div>');
					var ruName = o.SYSTEM_NAME.replace(/-RU$/, '');
					if (ruName.indexOf('_') >0 ){
						if (ruName.split('_')[3] === '본사'){
							var ruNameTop = ruName.split('_')[3];
							var ruNameBottom = '';
							if (ruName.split('_')[4] != undefined ){
								ruNameBottom = '('+ruName.split('_')[4] +')';
							}
						}else {
							var lastUnd = ruName.lastIndexOf('_');
							var ruName1 = ruName.substring(0,lastUnd)
							var ruName2 = ruName.substring(lastUnd+1)
							var ruNameSplt = ruName2.split('-');
							var ruNameTop = ruNameSplt.splice(0, 1);
							var ruNameBottom = '';
							if (ruName2.split('-')[1] != undefined ){
								ruNameBottom = '('+ ruNameSplt.join('_')+')';
							}
						}
						ruLiHtml.push('		<strong class="tit">' + ruNameTop + '<br>' + ruNameBottom +'</strong>');
					}else{
						ruLiHtml.push('		<strong class="tit">' + ruName + '</strong>');
					}
					ruLiHtml.push('	</div>');
					ruLiHtml.push('	<div class="engineer" style="display:none;"></div>');
					if (duruIdList.includes(key)){
						ruLiHtml.push('	<div class="clear24_icon_sm" style="display: block;">!</div>');
					}
					else{
						ruLiHtml.push('	<div class="clear24_icon_sm" style="display: none;">!</div>');
					}
					ruLiHtml.push('</li>');
					
					$ruList.append(ruLiHtml.join(''));
				}
			})
		}
		
		if (ruMaj.length > 0){ 
			$.each(ruInfoList, function(i, o) {
				var key = 'ru_' + o.DU_ID + '_' + o.SECTOR + '_' + o.PORT_ID + '_' + o.SEQUENCE_ID;
				if (ruMaj.indexOf(key)>=0){
					var ruLiHtml = [];
					ruLiHtml.push('<li id="' + key + '" class="serverGroup station" style="height:85px;display:none;">');
					ruLiHtml.push('	<span class="stage" style="display:none;"></span>');
					ruLiHtml.push('	<div class="serverBox">');
					ruLiHtml.push('	<div class="state normal">서버</div>');
					var ruName = o.SYSTEM_NAME.replace(/-RU$/, '');
					if (ruName.indexOf('_') >0 ){
						if (ruName.split('_')[3] === '본사'){
							var ruNameTop = ruName.split('_')[3];
							var ruNameBottom = '';
							if (ruName.split('_')[4] != undefined ){
								ruNameBottom = '('+ruName.split('_')[4] +')';
							}
						}else {
							var lastUnd = ruName.lastIndexOf('_');
							var ruName1 = ruName.substring(0,lastUnd)
							var ruName2 = ruName.substring(lastUnd+1)
							var ruNameSplt = ruName2.split('-');
							var ruNameTop = ruNameSplt.splice(0, 1);
							var ruNameBottom = '';
							if (ruName2.split('-')[1] != undefined ){
								ruNameBottom = '('+ ruNameSplt.join('_')+')';
							}
						}
						ruLiHtml.push('		<strong class="tit">' + ruNameTop + '<br>' + ruNameBottom +'</strong>');
					}else{
						ruLiHtml.push('		<strong class="tit">' + ruName + '</strong>');
					}
					ruLiHtml.push('	</div>');
					ruLiHtml.push('	<div class="engineer" style="display:none;"></div>');
					if (duruIdList.includes(key)){
						ruLiHtml.push('	<div class="clear24_icon_sm" style="display: block;">!</div>');
					}
					else{
						ruLiHtml.push('	<div class="clear24_icon_sm" style="display: none;">!</div>');
					}
					ruLiHtml.push('</li>');
					
					$ruList.append(ruLiHtml.join(''));
				}
			})
		}
		
		if (ruMnr.length > 0){
			$.each(ruInfoList, function(i, o) {
				var key = 'ru_' + o.DU_ID + '_' + o.SECTOR + '_' + o.PORT_ID + '_' + o.SEQUENCE_ID;
				if (ruMnr.indexOf(key)>=0){
					var ruLiHtml = [];
					ruLiHtml.push('<li id="' + key + '" class="serverGroup station" style="height:85px;display:none;">');
					ruLiHtml.push('	<span class="stage" style="display:none;"></span>');
					ruLiHtml.push('	<div class="serverBox">');
					ruLiHtml.push('	<div class="state normal">서버</div>');
					var ruName = o.SYSTEM_NAME.replace(/-RU$/, '');
					if (ruName.indexOf('_') >0 ){
						if (ruName.split('_')[3] === '본사'){
							var ruNameTop = ruName.split('_')[3];
							var ruNameBottom = '';
							if (ruName.split('_')[4] != undefined ){
								ruNameBottom = '('+ruName.split('_')[4] +')';
							}
						}else {
							var lastUnd = ruName.lastIndexOf('_');
							var ruName1 = ruName.substring(0,lastUnd)
							var ruName2 = ruName.substring(lastUnd+1)
							var ruNameSplt = ruName2.split('-');
							var ruNameTop = ruNameSplt.splice(0, 1);
							var ruNameBottom = '';
							if (ruName2.split('-')[1] != undefined ){
								ruNameBottom = '('+ ruNameSplt.join('_')+')';
							}
						}
						ruLiHtml.push('		<strong class="tit">' + ruNameTop + '<br>' + ruNameBottom +'</strong>');
					}else{
						ruLiHtml.push('		<strong class="tit">' + ruName + '</strong>');
					}
					ruLiHtml.push('	</div>');
					ruLiHtml.push('	<div class="engineer" style="display:none;"></div>');
					if (duruIdList.includes(key)){
						ruLiHtml.push('	<div class="clear24_icon_sm" style="display: block;">!</div>');
					}
					else{
						ruLiHtml.push('	<div class="clear24_icon_sm" style="display: none;">!</div>');
					}
					ruLiHtml.push('</li>');
					
					$ruList.append(ruLiHtml.join(''));
				}
			})
		}
		
		$.each(ruInfoList, function(i, o) {
			var key = 'ru_' + o.DU_ID + '_' + o.SECTOR + '_' + o.PORT_ID + '_' + o.SEQUENCE_ID;
			if ( !ruCri.indexOf(key) >=0 &&  !ruMaj.indexOf(key) >=0 && !ruMnr.indexOf(key) >=0 ){
				var ruLiHtml = [];
				ruLiHtml.push('<li id="' + key + '" class="serverGroup station" style="height:85px;display:none;">');
				ruLiHtml.push('	<span class="stage" style="display:none;"></span>');
				ruLiHtml.push('	<div class="serverBox">');
				ruLiHtml.push('	<div class="state normal">서버</div>');
				var ruName = o.SYSTEM_NAME.replace(/-RU$/, '');
				if (ruName.indexOf('_') >0 ){
					if (ruName.split('_')[3] === '본사'){
						var ruNameTop = ruName.split('_')[3];
						var ruNameBottom = '';
						if (ruName.split('_')[4] != undefined ){
							ruNameBottom = '('+ruName.split('_')[4] +')';
						}
					}else {
						var lastUnd = ruName.lastIndexOf('_');
						var ruName1 = ruName.substring(0,lastUnd)
						var ruName2 = ruName.substring(lastUnd+1)
						var ruNameSplt = ruName2.split('-');
						var ruNameTop = ruNameSplt.splice(0, 1);
						var ruNameBottom = '';
						if (ruName2.split('-')[1] != undefined ){
							ruNameBottom = '('+ ruNameSplt.join('_')+')';
						}
					}
					ruLiHtml.push('		<strong class="tit">' + ruNameTop + '<br>' + ruNameBottom +'</strong>');
				}else{
					ruLiHtml.push('		<strong class="tit">' + ruName + '</strong>');
				}
				ruLiHtml.push('	</div>');
				ruLiHtml.push('	<div class="engineer" style="display:none;"></div>');
				if (duruIdList.includes(key)){
					ruLiHtml.push('	<div class="clear24_icon_sm" style="display: block;">!</div>');
				}
				else{
					ruLiHtml.push('	<div class="clear24_icon_sm" style="display: none;">!</div>');
				}
				ruLiHtml.push('</li>');
				
				$ruList.append(ruLiHtml.join(''));
			}
		});
		
	}

	$ruList.find('> li').hide();
	$ruList.find('> li').removeData('performanceAlarmLevel');
	$ruList.find('> li').removeData('failureAlarmLevel');
	$ruList.find('span.stage').removeClass('yellow orange red').hide();
	$ruList.find('div.engineer').hide();
	$ruList.find('div.engineer').removeClass('yellow orange red')
	
	
	$.each(ruInfoList, function(i, o) {
		o.RRH = o.SECTOR + '_' + o.PORT_ID + '_' + o.SEQUENCE_ID;

		// DU 선택
		if(duId && o.DU_ID !== duId) {
			return;
		}
		
		// DU 미선택, DU 라인 전체가 아닐 경우 
		if(duSelectedLine !== 'all'){
			if(o.LINE_ID != null && !o.LINE_ID.match(duSelectedLine)){
				return;
			}
		}
	
		// 성능 알람 처리
		var performanceAlarmLevel = 4;
		performanceAlarmLevel = _.min([
			performanceAlarmLevel,
			o.ATT_RATE_LEVEL,
			o.RRC_RATE_LEVEL,
			o.ANS_RATE_LEVEL,
			o.CD_RATE_LEVEL
		]);
		if(!duId){
			// DU 선택 해제 (알람 발생한 것들만 표시 함.)
			// 고장 알람 확인
			var isFailureAlarm = false;
			$('#tb_failure_alarm tr').each(function(i, e) {
				var data = $(e).data('data');
				if(data.alarmLevel > NETWORK_TOPOLOGY.params.alarmFilter) {
					return;
				}
				if(isFailureAlarm) {
					return;
				}
				// ru 고장알람 색깔 처리
				if(data.equipType == 2) {
		            var ruKey = getRuKey(data);
		            if(ruKey.split('_').length > 1) {
			            if(ruKey === o.DU_ID + '_' + o.RRH) {
			            	isFailureAlarm = true;
			            }
		            }
				}
			});
			
			// 성능 알람, 고장 알람 확인
			if(performanceAlarmLevel === 4 && !isFailureAlarm) {
				return;
			}
		}
		
		var key = 'ru_' + o.DU_ID + '_' + o.SECTOR + '_' + o.PORT_ID + '_' + o.SEQUENCE_ID;
		var $ru = $('#' + key);
		$ru.show();
		
		// 성능 알람 처리
		var performanceAlarmClass = 'yellow';	// yellow, orange, red
		
		// 알람 클래스 지정
		if(performanceAlarmLevel < 4) {
			if(performanceAlarmLevel === 1) {
				performanceAlarmClass = 'red';
			} else if(performanceAlarmLevel === 2) {
				performanceAlarmClass = 'orange';
			}
		}
		
		$ru.data('data', o);
		$ru.data('performanceAlarmLevel', performanceAlarmLevel);

		if(performanceAlarmLevel < 4) {
			$ru.find('span.stage').addClass(performanceAlarmClass).show();
		}
	});
	
	
	// ru 고장 알람 색깔 처리
	$('#tb_failure_alarm tr').each(function(i, e) {
		var data = $(e).data('data');
		var failureAlarmLevel = data.alarmLevel;
		if(data.alarmLevel > NETWORK_TOPOLOGY.params.alarmFilter) {
			return;
		}

		var colorClass = '';
		if(data.alarmLevel  === '1') {
			colorClass = 'red';
		} else if(data.alarmLevel  === '2') {
			colorClass = 'orange';
		} else if(data.alarmLevel  === '3') {
			colorClass = 'yellow';
		}
		
		// ru 고장알람 색깔 처리
		if(data.equipType == 2) {
            var ruKey = getRuKey(data);
            if(ruKey.split('_').length > 1) {
            	var $ru = $('#ru_' + ruKey);
	            if($ru.length > 0) {
	            	if ($ru.find('div.engineer.red').length == 0 && $ru.find('div.engineer.orange').length == 0 && $ru.find('div.engineer.yellow').length == 0){
	    				$ru.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
	    				$ru.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
	    				$ru.data('failureAlarmLevel', _.min([Number(data.alarmLevel), $ru.data('failureAlarmLevel')]));
	    			}else{
	    				var srcColorLevel = 4;
	    				if ($ru.find('div.engineer.red').length == 1){
	    					srcColorLevel = 1;
	    				}else if ($ru.find('div.engineer.orange').length == 1){
	    					srcColorLevel = 2;
	    				}else if ($ru.find('div.engineer.yellow').length == 1){
	    					srcColorLevel = 3;
	    				}else{
	    					srcColorLevel = 4;
	    				}
	    				if(Number(failureAlarmLevel) <= srcColorLevel){
	    					$ru.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
	    					$ru.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
	    					$ru.data('failureAlarmLevel', _.min([Number(data.alarmLevel), $ru.data('failureAlarmLevel')]));
	    				}
	    			}
	            	
	            }
	            
	        }
		}
	});

	var equipCnt = 0;
	var equipNoneCnt= 0;
	$ruList.children().each(function(i, e){
		var dis = $(e).css('display');
		if (dis == 'none'){
			equipNoneCnt+=1;
		}else{
			equipCnt+=1;
		}
	})
	if (equipCnt <= 12){
		// $('#failureGridDiv').height(270);	// 스크롤 생김
	}else{
		// $('#failureGridDiv').height(185);	// 스크롤 생김
	}
	$ruList = null;
	
	
	
}

/**
 * 알람필터 저장
 * 
 * @param flag
 * @param filterLevel
 * @returns
 */
function filterSaveSearch(flag, filterLevel) {
	//그리드 필터 필터링
	if(flag === "INIT") {
		NETWORK_TOPOLOGY.params.gridAlarmFilter = Number(filterLevel);
	/*} else if(flag === "Y") {
		NETWORK_TOPOLOGY.params.gridAlarmFilter = filterLevel === '0' ? 4 : Number(filterLevel);
		//NETWORK_TOPOLOGY.topologyLevelGradeInit();
		networkMonitoringFailureWebsocketRestart();*/
	} else {
		//알람 필터 설정 통합(고장감시 + 성능감시)
		NETWORK_TOPOLOGY.params.gridAlarmFilter = filterLevel === '0' ? 4 : Number(filterLevel);
		networkMonitoringFailureWebsocketRestart();
		
		NETWORK_TOPOLOGY.params.alarmFilter = filterLevel === '0' ? 4 : Number(filterLevel);
		$("#alarm_filter").val(NETWORK_TOPOLOGY.params.alarmFilter);
		// monitor_time = "-1";
		dataLoad();
	}
}

/**
 * 모니터링 리스타트
 * 
 * @returns
 */
function networkMonitoringFailureWebsocketRestart() {
    //실시간으로 받는 테이블 비우기 (하단 고장정보)

	// 알람 카운트 초기화
	NETWORK_TOPOLOGY.failureAlarmCount = {
			1: 0,
			2: 0,
			3: 0,
			4: 0
	};
	$('.troubleAlram span').html('0');
	setTotalAlarmCount();
	
    $("#tb_failure_alarm tbody tr").empty();
    $("#excelTable tbody tr").empty();
    if(ws){
        //console.log('filter socket close');
        isView = false;
        ws.close();
        if(ws_put)
            ws_put.close();
        setTimeout(function() {startAlarmDetect();}, 1000);
    }

}

/**
 * 실시간 고장 알람 개수 카운트
 */
function alarmCount(level, type) {
	/* 알람 Total 개수 갱신 */
	$("#cntAlarmTot").html($("#tb_failure_alarm tbody tr").length);
	/* 등급별 알람 개수 갱신 */
	var cnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='" + level + "']").length;
	$("#cntLevel"+level).html(cnt);
	
	if(level == 4 && cnt != 0){
		$("#cntLevel"+level).parent().css('display','');
		$("#troubleCount"+level).parent().css('display','')
	}
	
	// 등급별 알람 발생 장비 수 갱신
	var $equipTypes = $('#tb_failure_alarm tr');
	var equipTypeList = [];
	$equipTypes.each(function(i, e) {
		var data = $(e).data('data');
		var failureAlarmLevel = data.alarmLevel;
		
		var key = data.systemId + '_' + data.equipType;
		if(failureAlarmLevel === level && equipTypeList.indexOf(key) === -1) {
			equipTypeList.push(key);
		}; 
	});
	$('#tnms_cntLevel' + level).html(equipTypeList.length);
	
	if(level==1){ 
		$("#troubleCount1").html('<i class="mu-icon alarm critical"></i>' + equipTypeList.length );
	}
	if(level==2){
		$("#troubleCount2").html('<i class="mu-icon alarm major"></i>' + equipTypeList.length );
	}
	if(level==3){
		$("#troubleCount3").html('<i class="mu-icon alarm minor"></i>' + equipTypeList.length );
	}
	
	NETWORK_TOPOLOGY.failureAlarmCount[level] = cnt;

	// 고장알람 개수만큼 실행되기 때문에 최초에 여러번 호출 되는것을 방지하기 위해 타임아웃 처리 함.
	window.clearTimeout(alarmRefreshTimeout);
	alarmRefreshTimeout = window.setTimeout(function() {
		setEquipAlarm();
	}, 100);
	
	setTotalAlarmCount();
}

function performanceAlarmCount() {
	NETWORK_TOPOLOGY.performanceAlarmCount = {
			1: 0,
			2: 0,
			3: 0,
			4: 0
	};
	
	// 서비스장비, 주제어장치, 스위치, 응용시스템, DU 성능 알람 카운트
	$('.topologyWrap .serverGroup').each(function(i, e) {
		var performanceAlarmLevel = $(e).data('performanceAlarmLevel');
		
//		console.log("aa " + $(e).attr("class") + " | " + performanceAlarmLevel + " | " + $(e).attr("id"));
		if(performanceAlarmLevel) {
			NETWORK_TOPOLOGY.performanceAlarmCount[performanceAlarmLevel]++;
		}
	});
	
	// 기지국 통합감시 DU 성능 알람 카운트
	$('.alram-map').each(function(i, e) { 
		var performanceAlarmLevel = $(e).data('performanceAlarmLevel');
		 
//		console.log("aa " + $(e).attr("class") + " | " + performanceAlarmLevel + " | " + $(e).attr("id"));
		if(performanceAlarmLevel) {
			NETWORK_TOPOLOGY.performanceAlarmCount[performanceAlarmLevel]++;
		}
	});
}

function setTotalAlarmCount() {
	for(var i = 1; i <= 3; i++) {
		$('#cntAllLevel' + i).text(NETWORK_TOPOLOGY.performanceAlarmCount[i] + NETWORK_TOPOLOGY.failureAlarmCount[i]);
	}
}

/**
 * 고장 알람 발생시 서버에 색깔 표시
 * 
 * @returns
 */
function setEquipAlarm() {
	// 알람 그리드 정보를 기준으로 장비 색깔 표시
	// 고장알람 관련 색깔 제거

	$('div.serverBox > div.state').each(function() {
		var data = $(this).parent().data('data');
		if(data) {
			$(this).removeClass('yellow orange red');
		}
	});
	
	//기지국 통합감시 고장 알람 관련 색 초기화(성능 오류 시 색 표현)
	$('div.monitoring-map > i.mu-icon').each(function() {
		$(this).data('failureAlarmLevel', '4');
		//console.log($(this).data('level'));
		var minLevel = $(this).data('performanceAlarmLevel');
		
		if(minLevel==1){ 
				breakdownAlarmClass = 'critical';
		} else if(minLevel==2){
			breakdownAlarmClass = 'major';  
		} else if(minLevel==3){
			breakdownAlarmClass = 'minor';
		} else{
			breakdownAlarmClass = 'normal';
		}
		$(this).removeClass('minor major critical normal');
		$(this).addClass(breakdownAlarmClass);
	});
	
	// 엔지니어 제거
	$('div.serverGroup').find('div.engineer').hide();
	// 헤제알람 제거
//	$('div.serverGroup').find('div.clear24_icon').hide();
	$('div.serverGroup').removeClass('yellow orange red');
	$('div.serverGroup').find('div.engineer').removeClass('yellow orange red');
	
	$('div.serverBox').find('div.state').removeClass('yellow orange red');
	$('div.engineer').hide();
	
	// 고장 알람 레벨 삭제
	$('.serverGroup').removeData('failureAlarmLevel');
	// 1. active 확인
	// 2. standby 확인
	// 3. 단일서버 확인
	
	// 스위치
	switch0_failureAlarmLevel = '4';
	switch5_failureAlarmLevel = '4';
	switch7_failureAlarmLevel = '4';
	
	// 정류기 
	var jrgEquip_failureAlarmLevel = '4';
	
	jrgEquip_station0_failureAlarmLevel = '4';
	jrgEquip_station5_failureAlarmLevel = '4';
	jrgEquip_station7_failureAlarmLevel = '4';
	
	// MDM 
	var mdmEquip_failureAlarmLevel = '4';
	
	// 영상처리장치
	var imageEquip_failureAlarmLevel = '4';
	
	// 장애 DU리스트 초기화
	duFailList = [];
	
	$('#tb_failure_alarm tr').each(function(i, e) {
		var data = $(e).data('data');

		
		var failureAlarmLevel = data.alarmLevel;
		if(failureAlarmLevel > NETWORK_TOPOLOGY.params.alarmFilter) {
			return;
		}
		
		var systemId = getSystemId(data);
		var equipType = data.equipType;
		var lineId = data.lineId;
 	
		// HSS 는 901 아이디로 할당
		//if(equipType == 6) console.log(systemId);
		
		// DU 일 경우 전체 알림 탭에서 보여줄 것 리스트에 저장
//		if(equipType === '2'){
//			duFailList.push(data);			// DU, RU에 색상 칠해지는 것 둘다
//		}
		
		
		//기지국 통합감시 DU 고장에 따른 색 변경
		if($('#baseStationDuList').length != 0){
			var breakdownAlarmClass = 'normal';	// critical, major, minor, nomal
			var $baseStationDuPoint = $('#equip_' + systemId);
			
			var minLevel = 4;
			if(failureAlarmLevel == 1) {
				$baseStationDuPoint.data('failureAlarmLevel', 1);
			} else if(failureAlarmLevel == 2 && $baseStationDuPoint.data('failureAlarmLevel')>2) {
				$baseStationDuPoint.data('failureAlarmLevel', 2);
			} else if(failureAlarmLevel == 3  && $baseStationDuPoint.data('failureAlarmLevel')>3) {
				$baseStationDuPoint.data('failureAlarmLevel', 3);
			} 
			
			//성능과 고장 비교 후 더 작은 값을 기준으로 색 표현
			minLevel = _.min([$baseStationDuPoint.data('failureAlarmLevel'), $baseStationDuPoint.data('performanceAlarmLevel')]);
			
			
			if(minLevel==1 ){
				breakdownAlarmClass = 'critical';
			} else if(minLevel==2){
				breakdownAlarmClass = 'major';  
			} else if(minLevel==3){
				breakdownAlarmClass = 'minor';
			}
			
			$baseStationDuPoint.removeClass('critical major minor normal')
			
			$baseStationDuPoint.addClass(breakdownAlarmClass);
		}
		
		//네트워크 토폴로지 DU 알림등급(고장)
		/*if($('#duList').length != 0 && equipType == 2){
			
			var $duServer = $('#equip_' + systemId + '_' + equipType + '_' + 'N');
			
			
			$duServer.data('failureAlarmLevel', failureAlarmLevel);
			
		
		}*/	
			
		// 주니퍼스위치 고장알람 검사
		/*if(equipType === '11') {
			if (lineId.indexOf('0') >=0 ){
				switch0_failureAlarmLevel = switch0_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : switch0_failureAlarmLevel
			}else if (lineId.indexOf('5') >= 0 ){
				switch5_failureAlarmLevel = switch5_ > data.alarmLevel ?  data.alarmLevel : switch5_failureAlarmLevel
			}else if( lineId.indexOf('7') >= 0){
				switch7_failureAlarmLevel = switch7_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : switch7_failureAlarmLevel
			}
		}*/
		
		// 정류기 고징알람 검사
		/*if(equipType === '36') {
			if (lineId.indexOf('0') >= 0 ){	
				jrgEquip_station0_failureAlarmLevel = jrgEquip_station0_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : jrgEquip_station0_failureAlarmLevel;
			}else if (lineId.indexOf('5') >=0 ){
				jrgEquip_station5_failureAlarmLevel = jrgEquip_station5_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : jrgEquip_station5_failureAlarmLevel;
			}else if (lineId.indexOf('7') >=0 ){
				jrgEquip_station7_failureAlarmLevel = jrgEquip_station7_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : jrgEquip_station7_failureAlarmLevel;
			}
			jrgEquip_failureAlarmLevel = jrgEquip_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : jrgEquip_failureAlarmLevel;
		}*/
		
		// MDM
		/*if(equipType === '18'){
			setLineEquipView(18);
			mdmEquip_failureAlarmLevel = mdmEquip_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : mdmEquip_failureAlarmLevel;
		}*/
		
		// 영상처리장치
		/*if(equipType === '27'){
			setLineEquipView(27);
			imageEquip_failureAlarmLevel = imageEquip_failureAlarmLevel > data.alarmLevel ?  data.alarmLevel : imageEquip_failureAlarmLevel;
		}*/
		
		var colorClass = '';
		if(failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		
		// ru 색깔 처리
		var isRuAlarm = false;
		if(equipType == 2) {
            var ruKey = getRuKey(data);
            if(ruKey.split('_').length > 1) {
	            var $ru = $('#ru_' + ruKey);
	            if($ru.length > 0) {
	            	// 고장 알람 저장.
	            	if ($ru.find('div.engineer.red').length == 0 && $ru.find('div.engineer.orange').length == 0 && $ru.find('div.engineer.yellow').length == 0){
	    				$ru.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
	    				$ru.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
	    				$ru.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $ru.data('failureAlarmLevel')]));
	    			}else{
	    				var srcColorLevel = 4;
	    				if ($ru.find('div.engineer.red').length == 1){
	    					srcColorLevel= 1
	    				}else if ($ru.find('div.engineer.orange').length == 1){
	    					srcColorLevel= 2
	    				}else if ($ru.find('div.engineer.yellow').length == 1){
	    					srcColorLevel= 3
	    				}else{
	    					srcColorLevel= 4
	    				}
	    				if(Number(failureAlarmLevel) <= srcColorLevel){
	    					$ru.find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
	    					$ru.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
	    					// 고장 알람 저장.
	    					$ru.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $ru.data('failureAlarmLevel')]));
	    				}
	    			}
	            	
	            }
	            isRuAlarm = true;
            }else{
            	// DU 일 경우 전체 알림 탭에서 보여줄 것 리스트에 저장		// DU에 색상 칠해지는 것만 
            	if(data != null){
            		duFailList.push(data);
            	}
            }
		}
		
		if(isRuAlarm) {
			return;
		}
		
		// DU - LSM 알람 처리
		if(equipType == 2 && data.location.indexOf('LSM') === 0 && data.location.split('/').length >= 4) {
			var $duServerList = $('#duList > .serverGroup');
			$duServerList.each(function(i, e) {
				var duData = $(this).data('data');
				if(duData.SYSTEM_NAME === data.location.split('/')[3]) {
					systemId = duData.SYSTEM_ID;
				}
			});
		}
		
		var $equip = $('#equip_' + systemId + '_' + equipType + '_A');
		var $equip_A = $('#equip_' + systemId + '_' + equipType + '_A');
		var $equip_S = $('#equip_' + systemId + '_' + equipType + '_S');

		// system id 가 같을 경우 현재 active, standby 체크해서 active 에 알람 표시
		// 이중화 장비 알람색깔 처리 변경(2017-06-28)
		// A A : 둘다 표시
		// S S : 둘다 표시
		// A S : A에 표시
		if ($equip_A.length === 1 && $equip_S.length === 1) {
			if(!$equip_A.data('data')) {
				// 장비정보가 그려지기 전에 알람 발생시 무시.
				return;
			}
			if ($equip_A.data('data').CURRENT_ACT_SBY === 'A') {
				$equip = $equip_A;
			} else {
				$equip = $equip_S;
			}
		}
		
		if ($equip.length === 0) {
			$equip = $('#equip_' + systemId + '_' + equipType + '_S');
		}
		if ($equip.length === 0) {
			$equip = $('#equip_' + systemId + '_' + equipType + '_N');
		}
		if ($equip.length === 0) {
			if(systemId != '1'){
				return;
			}
		}
	
		// 상위 element에 double 클래스가 있는지 확인하여 이중화인지 확인
		var equipData = $equip.data("data");
		var equipColor = "";
		
		if(failureAlarmLevel === '1') {
			equipColor = 'red';
		} else if(failureAlarmLevel === '2') {
			equipColor = 'orange';
		} else if(failureAlarmLevel === '3') {
			equipColor = 'yellow';
		}
		
		if($equip.parent().hasClass('double') || $equip.parent().hasClass('triple') || $equip.parent().hasClass('quad')) {
			
			if ($equip.parent().find('div.engineer.red').length == 0 && $equip.parent().find('div.engineer.orange').length == 0 && $equip.parent().find('div.engineer.yellow').length == 0){
				
				$equip.parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
				if (equipColor == 'red'){
					$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor).show();	
				}else{
					$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
				}
				var $serverGroup = $equip.closest('.serverGroup');
				$serverGroup.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $serverGroup.data('failureAlarmLevel')]));
			}else{
				var srcColorLevel = 4;
				if ($equip.parent().find('div.engineer.red').length == 1){
					srcColorLevel = 1;
				}else if ($equip.parent().find('div.engineer.orange').length == 1){
					srcColorLevel = 2;
				}else if ($equip.parent().find('div.engineer.yellow').length == 1){
					srcColorLevel = 3;
				}else{
					srcColorLevel = 4;
				}
				if(Number(failureAlarmLevel) <= srcColorLevel){
					$equip.parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
					if (equipColor == 'red'){
						$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor).show();	
					}else{
						$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
					}
					var $serverGroup = $equip.closest('.serverGroup');
					$serverGroup.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $serverGroup.data('failureAlarmLevel')]));
				}else{
					if ($equip.find('div.state.red').length == 0 && $equip.find('div.state.orange').length == 0 && $equip.find('div.state.yellow').length == 0){
						$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor).show();
						
					}
				}
			}
		
		} else {
			
			if ($equip.parent().find('div.engineer.red').length == 0 && $equip.parent().find('div.engineer.orange').length == 0 && $equip.parent().find('div.engineer.yellow').length == 0){
				$equip.parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
				if (equipColor == 'red'){
					$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor).show();	
				}else{
					$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
				}
				//console.log(_.min([Number(failureAlarmLevel), $equip.data('failureAlarmLevel')]))
				$equip.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $equip.data('failureAlarmLevel')]));
				
				//DU일 경우 serverGroup에 고장 등급 적용
				if($equip.data('data').EQUIP_TYPE==2){
					var $serverGroup = $equip.closest('.serverGroup');
					$serverGroup.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $serverGroup.data('failureAlarmLevel')]));
				}
			}else{
				var srcColorLevel = 4;
				if ($equip.parent().find('div.engineer.red').length == 1){ 
					srcColorLevel= 1
				}else if ($equip.parent().find('div.engineer.orange').length == 1){
					srcColorLevel= 2
				}else if ($equip.parent().find('div.engineer.yellow').length == 1){
					srcColorLevel= 3
				}else{
					srcColorLevel= 4
				}
				if(Number(failureAlarmLevel) <= srcColorLevel){
					$equip.parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
					if (equipColor == 'red'){
						$equip.find('div.state').removeClass('yellow orange red').addClass(equipColor).show();	
					}else{
						$equip.find('div.state').removeClass('yellow orange red').addClass(colorClass).show();
					}
					// 고장 알람 저장.
					$equip.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $equip.data('failureAlarmLevel')]));
					
					
					if($equip.data('data').EQUIP_TYPE==2){
					var $serverGroup = $equip.closest('.serverGroup');
					$serverGroup.data('failureAlarmLevel', _.min([Number(failureAlarmLevel), $serverGroup.data('failureAlarmLevel')]));
				}
				}
			}
		}
	});
	
//	// 메시지 들어왔을때 DU 알람 표기===================================
//	// 성능 알람 있는 경우 가장 앞으로 
//	$('#duList').children('div').not('#duList_first').each(function(i, e) {
//		var $du = $('#'+e.id);
//		if($du.find('.stage:visible').length != 0){
//			$('#duList > div:eq(0)').after($du);	// 알람이 있을 경우 가장 앞으로
//		}
//	});
//	
//	// 고장알람 있는 경우 가장 앞으로 
//	$('#duList').children('div').not('#duList_first').each(function(i, e) {
//		var $du = $('#'+e.id);
//		if($du.find('div.engineer:visible').length != 0){
//			$('#duList > div:eq(0)').after($du);	// 알람이 있을 경우 가장 앞으로
//		}
//	});

	// DU 전체알람 일 경우 
	if(duSelectedLine === 'all'){	
		showAllDuList();
	}
	// du영역 스크롤 위로
	$('#duServerArea').scrollTop(0);
	// ========================================================
	
	// 스위치 7호선 고장알람처리
	if (switch7_failureAlarmLevel < '4'){
		var colorClass = '';
		if(switch7_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(switch7_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(switch7_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		$('#equip_station7_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_station7_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	
	// 스위치 5호선 고장알람처리
	if (switch5_failureAlarmLevel < '4'){
		var colorClass = '';
		if(switch5_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(switch5_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(switch5_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		$('#equip_station5_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_station5_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	
	// 스위치 관제 고장알람처리
	if (switch0_failureAlarmLevel < '4'){
		var colorClass = '';
		if(switch0_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(switch0_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(switch0_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		$('#equip_gwanje_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		if ($('#equip_gwanje_N').find('div.state').hasClass('red')){
			$('#equip_gwanje_N').find('div.state').removeClass('yellow orange red').addClass('red');
		}else{
			$('#equip_gwanje_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
		}
	}
	
	// 정류기 고장알람처리
	if (jrgEquip_failureAlarmLevel < '4'){
		var colorClass = '';
		if(jrgEquip_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(jrgEquip_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(jrgEquip_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		$('#equip_jrg_36_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_jrg_36_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	
	jrgPopupFailureEquip();	// 정류기 1뎁스 팝업
	
	// MDM 고장알람처리
	if(mdmEquip_failureAlarmLevel < '4'){
		var colorClass = '';
		if(mdmEquip_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(mdmEquip_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(mdmEquip_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		$('#equip_18_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_18_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	
	// 영상처리장치 고장알람처리
	if(imageEquip_failureAlarmLevel < '4'){
		var colorClass = '';
		if(imageEquip_failureAlarmLevel === '1') {
			colorClass = 'red';
		} else if(imageEquip_failureAlarmLevel === '2') {
			colorClass = 'orange';
		} else if(imageEquip_failureAlarmLevel === '3') {
			colorClass = 'yellow';
		}
		$('#equip_27_N').parent().find('div.engineer').removeClass('yellow orange red').addClass(colorClass).show();
		$('#equip_27_N').find('div.state').removeClass('yellow orange red').addClass(colorClass);
	}
	//RU 사용 안함
	/*if(duSelectedIndex === -1) {
		getTopologyRuInfo();
	} else {
		getTopologyRuInfo($('#duList .station:eq(' + duSelectedIndex + ')').data('data').SYSTEM_ID);
	}*/
}

function getRuKey(data) {
	var ruRegEx = /(RRH|PSU)\[(\d+_\d+_\d+)\]/g;
	var duRegEx = /RACK\[\d+\]/g;
	var duRegEx2 = /^[ㄱ-ㅎ가-힣]+-\w+-\d+/g;
	var duId = '';
	var ruId = '';
	var equipId = '';
	var stationName = '';
	var dataArr = [];

	duId = data.systemId;

	if (ruRegEx.test(data.location)) {
		equipId = duId + '_' + RegExp.$2;
	} else {
		equipId = duId;
	}
	return equipId;
}

function convertPercent(num) {
	if(_.isNumber(num)) {
		return num.toFixed(2);
	} else {
		return '0.00';
	}
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}

function datepickerSetting() {
	$("#start-date-trend").datepicker({
		dateFormat: 'yy/mm/dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월']
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	$('#end-date-trend').datepicker({
		dateFormat: 'yy/mm/dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월']
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	$("#start-date-btn-trend").on("click",function(e){
		var visible = $("#ui-datepicker-div").is(":visible");
		$("#start-date-trend.hasDatepicker").css("position", "relative").css("zIndex", "9999");
		$("#start-date-trend").datepicker(visible ? 'hide' : 'show');
	});


	$("#end-date-btn-trend").on("click",function(e){
		var visible = $("#ui-datepicker-div").is(":visible");
		$("#end-date-trend.hasDatepicker").css("position", "relative").css("zIndex", "9999");
		$("#end-date-trend").datepicker(visible ? 'hide' : 'show');
	});


	$("#start-date-performance").datepicker({
		dateFormat: 'yy/mm/dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월']
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	$('#end-date-performance').datepicker({
		dateFormat: 'yy/mm/dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월']
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	$("#start-date-btn-performance").on("click",function(e){
		var visible = $("#ui-datepicker-div").is(":visible");
		$("#start-date-performance.hasDatepicker").css("position", "relative").css("zIndex", "9999");
		$("#start-date-performance").datepicker(visible ? 'hide' : 'show');
	});


	$("#end-date-btn-performance").on("click",function(e){
		var visible = $("#ui-datepicker-div").is(":visible");
		$("#end-date-performance.hasDatepicker").css("position", "relative").css("zIndex", "9999");
		$("#end-date-performance").datepicker(visible ? 'hide' : 'show');
	});
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
		} 
		else {
			systemId = data.systemId;
		}
	}else {
		systemId = data.systemId;
	}
	return systemId;
}


function failureWatch(that) {
    if(watchFlagFailure) {
        //감시 ON 상태일 때 클릭
        $(that).children().removeClass('pause');
        $(that).children().addClass('play');
        $("#btn_alarmSound").removeClass("mu-toggle-on");
        soundFlagFailure = false;
        watchFlagFailure = false;

        audioFunction.failureAudioPause();
        //감시중 Off인 경우 Websocket Close
        isView = false;
        ws.close();

    } else {
        //감시 off 상태일 때 클릭
        $(that).children().removeClass('play');
        $(that).children().addClass('pause');
        $("#btn_alarmSound").addClass("mu-toggle-on");
        soundFlagFailure = true;
        watchFlagFailure = true;

        networkMonitoringFailureWebsocketRestart();
        audioFunction.failureAudioPause();
        setAlarmSound();
    }
}

function setAlarmSound(){
	var
		$failureGrid = $("#failureGrid"),
		$criRow = $failureGrid.find("tr input[name='alarmLevel'][value='1']"),
		$majRow = $failureGrid.find("tr input[name='alarmLevel'][value='2']"),
		$minRow = $failureGrid.find("tr input[name='alarmLevel'][value='3']"),
		$criRowWithA = $failureGrid.find("tr input[name='alarmType'][value='A_1']"),
		$majRowWithA = $failureGrid.find("tr input[name='alarmType'][value='A_2']"),
		$minRowWithA = $failureGrid.find("tr input[name='alarmType'][value='A_3']");

	var totalCnt = $criRow.length + $majRow.length + $minRow.length;

	if (totalCnt <= 0) {
		audioFunction.failureAudioPause();
	} else {
		var
			alLevel = 5,
			criAlCnt = $criRow.length - $criRowWithA.length,
			majAlCnt = $majRow.length - $majRowWithA.length,
			minAlCnt = $minRow.length - $minRowWithA.length;

		if (criAlCnt > 0) {
			alLevel = 1;
		} else if (majAlCnt > 0) {
			alLevel = 2;
		} else if (minAlCnt > 0) {
			alLevel = 3;
		}

		$('#failureAudioAlarmLevel').val(alLevel);
		audioFunction.failureAudioPause();
		audioFunction.networkfailureAudioSetInterval();
	}
}

function failureSound(that) {
    if(soundFlagFailure) {
        $(that).removeClass('mu-toggle-on');
        soundFlagFailure = false;
        audioFunction.failureAudioPause();
    } else {
        if(watchFlagFailure) {
            $(that).addClass('mu-toggle-on');
            soundFlagFailure = true;
            setAlarmSound();
        } else {
            alert("감시 중이 아닐 경우 가청을 활성화 할 수 없습니다.");
            return false;
        }
    }
}

function getPerformanceAlarmLevel() {
	var alarmLvl = 4;
	for(var i = 1; i <= 3; i++) {
		if(NETWORK_TOPOLOGY.performanceAlarmCount[i]) {
			alarmLvl = i;
			break;
		}
	}
	return alarmLvl;
}

function getFailureAlarmLevel() {
	var alarmLvl = 4;
	for(var i = 1; i <= 3; i++) {
		if(NETWORK_TOPOLOGY.failureAlarmCount[i]) {
			alarmLvl = i;
			break;
		}
	}
	return alarmLvl;
}

// DU 노선을 바꿀 때
function selectDuLine(line){
	
	// 이전이랑 같을 경우 return
	if(duSelectedLine == line) return;
	
	// du 영역
	var $duDiv = $("#duServerArea");
	
	// 탭 버튼 active 스타일 제거
	$('#duTabBtns').find('button').removeClass('active');
	
	// 스타일 제거
	if(duSelectedLine === 'all'){
		$duDiv.removeClass("duServer-all");
	}else if(duSelectedLine === 5){
		$duDiv.removeClass("duServer-5");
	}else if(duSelectedLine === 7){
		$duDiv.removeClass("duServer-7");
	}
	
	// 스타일 추가
	$duDiv.addClass("duServer-"+line);
	
	// du 목록 전체 숨김
	$('#duList').children('div').hide();
	
	

	// (전체가 아닌) 호선 탭이 선택되었을 경우, 탭에 맞는  DU만 출력
	if(line != 'all'){		
		// 탭 버튼 스타일 추가
		$('#duTabLine'+line+'Btn').addClass('active');

		$('#duList').children('div').not('#duList_first').each(function(i, e) {
			// LINE_ID가 현재 선택된 것과 같으면 보여 준다
			var $du = $('#'+e.id);
			if($du.data('data').LINE_ID != null && $du.data('data').LINE_ID.match(line) != null){
				$du.show();
				
				$du.removeClass('selected');	// du 선택 해제
			}
			
		});
	}else{	// 전체일 경우
		$('#duTabAllAlarmBtn').addClass('active');
		
		showAllDuList();
	}
	
	// du영역 스크롤 위로
	$('#duServerArea').scrollTop(0);

	// 전역에 넣어놓음
	duSelectedLine = line;
	
	// ru 목록 다시 출력
	duSelectedIndex = -1;
	getTopologyRuInfo();
	
}

//기지국 통합감시 DU POINT class 초기화
function setBaseStationDuClass(){
	//기지국통합감시 DU 처리
	var $baseStationDuList = $('#baseStationDuList');
	$baseStationDuList.find('i').removeClass('minor major critical normal')
	$baseStationDuList.find('i').addClass('normal')
	
}
