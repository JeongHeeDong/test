$(document).ready(function(){
	$("#tb_unRecoveredInfo tbody tr").remove();
});

function getUnrecoveredData(){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/main/failureMain/getUnrecoveredData',
		dataType : 'json',
		success	: function(data) {
			if(data['unrecoveredData'] != null){
				gridUnrecoveredInfo(data['unrecoveredData']);
			}
		},
		error : function() {
			
		}
	});
}

function gridUnrecoveredInfo(obj){
	var rows = obj['unrecoveredList'];
	$("#tb_unRecoveredInfo tbody tr").remove();
	
	var alarmRow = "";
	var index = 0;
	
	$.each(rows, function(i,row) {
		index = i;
		
		var eventTime = new Date(row['EVENT_TIME']).format("yyyy/MM/dd HH:mm:ss");
		var severity = getAlarmGrade(row['SEVERITY']);
		
		alarmRow += "<tr style='cursor:pointer;'>";
		alarmRow += "	<td align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
		alarmRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
		alarmRow += 	"<td class='stat tc'><i class='mu-icon alram " + severity.toLowerCase() + "'></i></td>";
		alarmRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
		alarmRow += "	<td align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
		alarmRow += "	<td align='center' title='" + eventTime + "'>" + eventTime + "</td>";
		alarmRow += "	<td align='center' title='" + row['FDN'] + "'>" + row['FDN'] + "</td>";
		alarmRow += "	<td align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
		alarmRow += "</tr>";
		
	});
	
	//index 비교 후 빈 grid 그리는거 추가
	if(index < 8){
		for(var i = 8-index; 0<i; i--){
			alarmRow += "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
		}
	}
	
	$("#tb_unRecoveredInfo tbody").append(alarmRow);
	
	var tableLine = $("#tb_unRecoveredInfo tbody tr").length;
	$("#unRecoverCnt").html(index==0?0:index+1);
}

function getAlarmGrade(grade) {
	if(grade == 1) grade = "CRITICAL";
	else if(grade == 2) grade = "MAJOR";
	else if(grade == 3) grade = "MINOR";
	else if(grade == 4) grade = "NORMAL";
	return grade;
}