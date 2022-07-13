var isView = false;
var win;
var mainFilter = "";


$(document).ready(function(){
	win = window.top || window;
	
	if(win.name != "") {
		mainFilter = JSON.parse(win.name);
		win.name = "";
	}
	
	/* 가청 기능*/
	var alarmVolumes = getAlarmVolume();
	
	audioFile.f_criticalaudio.src='/criticalFailureAlarm';
	audioFile.f_criticalaudio.load();
	audioFile.f_criticalaudio.volume = alarmVolumes.F_CRITICAL_VOLUME/100;
	
	audioFile.f_majoraudio.src='/majorFailureAlarm';
	audioFile.f_majoraudio.load();
	audioFile.f_majoraudio.volume = alarmVolumes.F_MAJOR_VOLUME/100;
	
	audioFile.f_minoraudio.src='/minorFailureAlarm';
	audioFile.f_minoraudio.load();
	audioFile.f_minoraudio.volume = alarmVolumes.F_MINOR_VOLUME/100;
	
	audioFile.f_criticalaudio
	
	/*미복구 버튼 클릭이벤트*/
	$("#btn_unRecoveredInfo").on('click', function(e){
		$('#unRecoveredInfoBg').show().fadeIn('fast');
		$('#unRecoveredInfoUp').show().fadeIn('fast'); 
		
		var height = (screen.height - $('#unRecoveredInfoUp').height()-100)/2;
		var width = (screen.width - $('#unRecoveredInfoUp').width())/2;
		
		$('#unRecoveredInfoUp').css('left',width+'px');
		$('#unRecoveredInfoUp').css('top',height+'px');
		
		/*미복구 알람 DB 조회*/
		getUnrecoveredData();
	});
	/*미복구 알람정보 dialog 숨기기*/
	$("#unRecoveredInfoClose ,#unRecoveredInfoBg").on('click',function(e){
		$('#unRecoveredInfoBg').fadeOut();
		$('#unRecoveredInfoUp').fadeOut();
	});
	/*미복구 알람정보 dialog 드래그, 창사이즈조절*/
	$( "#unRecoveredInfoUp" ).draggable({'handle' : '#unRecoveredInfoTitle'});
//	$( "#unRecoveredInfoUp" ).resizable({
//		minHeight: 520,
//		minWidth: 630,
//		animate: true
//	});
	
	/*중요고장상세 버튼 클릭이벤트*/
	$("#btn_majorFailureDetail").on('click', function(e){
		$('#actionCaseDiv').hide();
		$('#actionCaseContentDiv').hide();
		
		$('#majorFailureDetailBg').show().fadeIn('fast');
		$('#majorFailureDetailUp').show().fadeIn('fast'); 
		
		//var top = (screen.height - $('#majorFailureDetailUp').height()-100)/2;
		var top = 50;
		var left = (screen.width - $('#majorFailureDetailUp').width())/2;
		
		$('#majorFailureDetailUp').css('top', top + 'px');
		$('#majorFailureDetailUp').css('left', left + 'px');
		
		/*중요고장상세 중요고장알람 DB 조회*/
		getMajorFailureData();
	});
	/*중요고장상세 알람정보 dialog 숨기기*/
	$("#majorFailureDetailClose ,#majorFailureDetailBg").on('click',function(e){
		$('#majorFailureDetailBg').fadeOut();
		$('#majorFailureDetailUp').fadeOut();
	});
	/*중요고장상세 알람정보 dialog 드래그, 창사이즈조절*/
	$( "#majorFailureDetailUp" ).draggable({'handle' : '#majorFailureDetailTitle'});
//	$( "#majorFailureDetailUp" ).resizable({
//		minHeight: 624,
//		minWidth: 790,
//		animate: true
//	});
	//DU실장도 dialog 숨기기
	$("#divDUBackground, #divDUView .cancel").on('click',function(e){
		$('#divDUBackground').hide();
		$('#divDUView').hide();
	});

	//EPC(MME, GW, PCRF) 실장도 dialog 숨기기
	$("#divEPCBackground, #divEPCView .cancel").on('click',function(e){
		$('#divEPCBackground').hide();
		$('#divEPCView').hide();
	});

	//고장목록 클릭시 팝업되는 조치사례 및 고장상세정보 엑셀 저장
	excelFailureActionCase();
	
	getAlarmGradeFilter();
	getAlarmCodeFilter();
	getSystemFilter();
	getMajorAlarmFilter();
	getStationFilter();
	initialAlarmGrid();
	getEquipInfo();
	getStationInfo();
	
	$.when(stationInfo).then(function() {
		startAlarmDetect();
	});
	
	
	$("#btn_alarmPause").on('click', function(e){
		
		if($(this).children().hasClass('play')){
			$(this).children().removeClass('play');
			$(this).children().addClass('pause');
			
			$("#tb_majorFailure_alarm tbody").empty();
			$("#tb_failure_alarm tbody").empty();
			$("#excelTable tbody").empty();
			
			startAlarmDetect();
		}else{
			$(this).children().removeClass('pause');
			$(this).children().addClass('play');
			
			isView = false;
			ws.close();
//			ws_put.close();
		}
		
	});
	
	/* 알람등급 필터 */
	$("#btn_alarmGradeFilter").on('click', function(e){
		$('#gradeFilterBg').show().fadeIn('fast');
		$('#gradeFilterUp').show().fadeIn('fast'); 
		
		var height = (screen.height - $('#gradeFilterUp').height()-100)/2;
		var width = (screen.width - $('#gradeFilterUp').width())/2;
		
		$('#gradeFilterUp').css('left',width+'px');
		$('#gradeFilterUp').css('top',height+'px');
		
		// DB 조회
		gridAlarmGradeFilter();
	});
	$("#gradeFilterClose ,#gradeFilterBg").on('click',function(e){
		$('#gradeFilterBg').fadeOut();
		$('#gradeFilterUp').fadeOut();
	});
	$("#gradeFilterUp").draggable({'handle' : '#gradeFilterTitle'});
	
	/* 알람코드 필터 */
	$("#btn_alarmCodeFilter").on('click', function(e){
		$('#codeFilterBg').show().fadeIn('fast');
		$('#codeFilterUp').show().fadeIn('fast'); 
		
		var height = (screen.height - $('#codeFilterUp').height()-100)/2;
		var width = (screen.width - $('#codeFilterUp').width())/2;
		
		$('#codeFilterUp').css('left',width+'px');
		$('#codeFilterUp').css('top',height+'px');
		
		// 왼쪽 트리세팅을 위한 DB 조회
		gridAlarmCodeTree();
		// 오른쪽 테이블세팅을 위한 DB조회
		gridAlarmCodeFilter();
	});
	$("#codeFilterClose ,#codeFilterBg").on('click',function(e){
		$('#codeFilterBg').fadeOut();
		$('#codeFilterUp').fadeOut();
	});
	$("#codeFilterUp").draggable({'handle' : '#codeFilterTitle'});
	
	/* 장비 필터 */
	$("#btn_systemFilter").on('click', function(e){
		$('#systemFilterBg').show().fadeIn('fast');
		$('#systemFilterUp').show().fadeIn('fast'); 
		
		var height = (screen.height - $('#systemFilterUp').height()-100)/2;
		var width = (screen.width - $('#systemFilterUp').width())/2;
		
		$('#systemFilterUp').css('left',width+'px');
		$('#systemFilterUp').css('top',height+'px');
		
		// 왼쪽 트리세팅을 위한 DB조회
		gridSystemTree();
		// 오른쪽 테이블세팅을 위한 DB조회
		gridSystemFilter();
	});
	$("#systemFilterClose ,#systemFilterBg").on('click',function(e){
		$('#systemFilterBg').fadeOut();
		$('#systemFilterUp').fadeOut();
	});
	$("#systemFilterUp").draggable({'handle' : '#systemFilterTitle'});

	/* 중요고장 필터 */
	$("#btn_majorFailureFilter").on('click', function(e){
		$('#majorAlarmFilterBg').show().fadeIn('fast');
		$('#majorAlarmFilterUp').show().fadeIn('fast'); 
		
		var height = (screen.height - $('#majorAlarmFilterUp').height()-100)/2;
		var width = (screen.width - $('#majorAlarmFilterUp').width())/2;
		
		$('#majorAlarmFilterUp').css('left',width+'px');
		$('#majorAlarmFilterUp').css('top',height+'px');
		
		// 왼쪽 트리세팅을 위한 DB 조회
		gridMajorAlarmTree();
		// 오른쪽 테이블세팅을 위한 DB조회
		gridMajorAlarmFilter();
	});
	$("#majorAlarmFilterClose ,#majorAlarmFilterBg").on('click',function(e){
		$('#majorAlarmFilterBg').fadeOut();
		$('#majorAlarmFilterUp').fadeOut();
	});
	$("#majorAlarmFilterUp").draggable({'handle' : '#majorAlarmFilterTitle'});

	/* 역사별 필터 */
	$("#btn_stationFilter").on('click', function(e){
		$('#stationFilterBg').show().fadeIn('fast');
		$('#stationFilterUp').show().fadeIn('fast'); 
		
		var height = (screen.height - $('#stationFilterUp').height()-100)/2;
		var width = (screen.width - $('#stationFilterUp').width())/2;
		
		$('#stationFilterUp').css('left',width+'px');
		$('#stationFilterUp').css('top',height+'px');
		
		// 왼쪽 트리세팅을 위한 DB조회
		gridStationTree();
		// 오른쪽 테이블세팅을 위한 DB조회
		gridStationFilter();
	});
	$("#stationFilterClose ,#stationFilterBg").on('click',function(e){
		$('#stationFilterBg').fadeOut();
		$('#stationFilterUp').fadeOut();
	});
	$("#stationFilterUp").draggable({'handle' : '#stationFilterTitle'});
	
	//time out 방지
	setInterval("timeOutGuard()", 1000*120);
});

function initialAlarmGrid(){
	isView = false;

	initLevelIndicator();
	//실시간으로 받는 테이블 비우기 (오른쪽 테이블)
	$("#tb_failure_alarm tbody tr").remove();
	$("#tb_majorFailure_alarm tbody tr").remove();
	$("#excelTable tbody tr").remove();
}

function initLevelIndicator() {
	for(var i=1; i<=4; i++){
		$("#cntLevel"+i).html('0');
	}
//	$("#cntLevel4").parent().css("display", "none");
}


function timeOutGuard(){
	
	$.ajax({
		type : 'post',
		url: '/failure/main/failureMain/timeOutGuard',
		dataType: "json",
		success: function (data) {
		},
		error: function () {
			//alert('에러발생');
		}
	});
}

function setAlarmSound(){
	var totalCnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='1']").length
			+ $("#tb_failure_alarm tr input[name='alarmLevel'][value='2']").length
			+ $("#tb_failure_alarm tr input[name='alarmLevel'][value='3']").length
			+ $("#tb_majorFailure_alarm tr input[name='majorAlarmLevel'][value='1']").length
			+ $("#tb_majorFailure_alarm tr input[name='majorAlarmLevel'][value='2']").length
			+ $("#tb_majorFailure_alarm tr input[name='majorAlarmLevel'][value='3']").length;

	if (totalCnt <= 0)
		audioFunction.failureAudioPause();
	else {
		var alLevel = 5;
		
		var criAlCnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='1']").length
				+ $("#tb_majorFailure_alarm tr input[name='majorAlarmLevel'][value='1']").length
				- $("#tb_failure_alarm tr input[name='alarmType'][value='A_1']").length
				- $("#tb_majorFailure_alarm tr input[name='alarmType'][value='A_1']").length;
		
		var majAlCnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='2']").length
				+ $("#tb_majorFailure_alarm tr input[name='majorAlarmLevel'][value='2']").length
				- $("#tb_failure_alarm tr input[name='alarmType'][value='A_2']").length
				- $("#tb_majorFailure_alarm tr input[name='alarmType'][value='A_2']").length;
		
		var minAlCnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='3']").length
				+ $("#tb_majorFailure_alarm tr input[name='majorAlarmLevel'][value='3']").length
				- $("#tb_failure_alarm tr input[name='alarmType'][value='A_3']").length
				- $("#tb_majorFailure_alarm tr input[name='alarmType'][value='A_3']").length;
		
		if (criAlCnt > 0) {
			alLevel = 1;
		} else if (majAlCnt > 0) {
			alLevel = 2;
		} else if (minAlCnt > 0) {
			alLevel = 3;
		}

		audioFunction.failureAudioPause();
		$('#failureAudioAlarmLevel').val(alLevel);
		audioFunction.failureAudioSetInterval();
	}
}

/**
 * 실시간 알람 개수 카운트
 */
function alarmCount(level) {
	/* 알람 Total 개수 갱신 */
	$("#cntAlarmTot").html($("#tb_failure_alarm tbody tr").length);
	/* 등급별 알람 개수 갱신 */
	var cnt = $("#tb_failure_alarm tr input[name='alarmLevel'][value='" + level + "']").length;
	$("#cntLevel"+level).html(cnt);
	
	// S알람 카운트
	if(level == '' && cnt != 0){
		$("#cntLevel4").parent().css('display','');
		$("#cntLevel4").html($("#tb_failure_alarm tr input[name='alarmLevel'][value='" + level + "']").length);
	}
}
