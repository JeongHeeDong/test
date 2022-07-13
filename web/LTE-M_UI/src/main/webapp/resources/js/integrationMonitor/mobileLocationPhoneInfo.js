$(document).ready(function(){
	// 고장정보 상세 폼 초기화
	$(".fd_formInfo").val("");
});

/**
 * 아래쪽 고장정보 폼 작성
 */
function gridAlarmInfo(obj,type){
	// 고장정보 상세 폼 초기화
	$(".fd_formInfo").val("");
	
	var row = obj['failureList'][0];
	if (row == null){
		return;
	}
	var eventTime = new Date(row['EVENT_TIME']).format("yyyy/MM/dd-hh:mm:ss");
	var updateTime = new Date(row['UPDATE_TIME']).format("yyyy/MM/dd-hh:mm:ss");
	
	$("#fd_alarmCode").val(row['ALARM_CODE']);
	$("#fd_equipType").val(row['EQUIP_TYPE']);
	$("#fd_severity").val(row['SEVERITY']);
	$("#fd_count").val(row['UPDATE_COUNT']);
	$("#fd_cause").val(row['PROBABLE_CAUSE']);
	$("#fd_location").val(row['FDN']);
	if(type == "main"){
		$("#fd_majorFailure").val("NO"); //중요고장		
	} else if(type == "major"){
		$("#fd_majorFailure").val("YES"); //중요고장		
	}
	$("#fd_eventTime").val(eventTime);
	$("#fd_updateTime").val(updateTime);
	$("#fd_systemId").val(row['SYSTEM_ID']);
	$("#fd_team").val(row['TEAM_NAME']);
//	$("#").val(); //특수지역
	$("#fd_systemName").val(row['SYSTEM_NAME']);
	
}