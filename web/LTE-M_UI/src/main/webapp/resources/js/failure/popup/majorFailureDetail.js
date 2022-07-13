var select_data;
var scrollPageNo = 1;
var endScrollPageNo = 0;
var scrollNo = 0;
var endScrollNo =0;

$(document).ready(function(){
	// 중요고장 상세 테이블 초기화
	$("#tb_majorFailureDetail tbody tr td").html("");
	$("#tb_majorFailureDetail tbody tr td").removeProp('title');
	// 조치 사례 테이블 초기화
	$("#tb_actionCase tbody tr td").html("");
	$("#tb_actionCase tbody tr td").removeProp('title');
	// 중요고장 상세 폼 초기화
	$(".mfd_formInfo").val("");
	// 조치사례 내용 초기화
	$("#actionCaseContents").html("");
	
	$("#majorFailureDiv").scroll( function() {
		var elem = $("#majorFailureDiv");
		
		if ( elem[0].scrollHeight - elem.scrollTop() < elem.outerHeight()){
			appendData();
		}
	});
});

/**
 * 중요고장알람 DB 조회
 */
function getMajorFailureData(){
	
	$("#mfd_alarmCode").val("");
	$("#mfd_equipType").val("");
	$("#mfd_severity").val("");
	$("#mfd_count").val("");
	$("#mfd_cause").val("");
	$("#mfd_location").val("");
	$("#mfd_majorFailure").val(""); 
	$("#mfd_eventTime").val("");
	$("#mfd_updateTime").val("");
	$("#mfd_recoverId").val("");
	$("#mfd_insertTime").val("");
	$("#mfd_recoverTime").val("");
	$("#mfd_systemId").val("");
	$("#mfd_team").val("");
	$("#mfd_systemName").val("");
	$("#tb_majorFailureDetail tbody").empty();
	$("#tb_actionCase tbody").empty();
	gridActionCaseContents("");
	select_data = [];
	scrollNo = 0;
	
	var requestData = JSON.stringify(majorAlarmCodeFilterList);
	
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/main/failureMain/getMajorFailureData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success	: function(data) {
			if(data['majorFailureData'] != null){
				gridMajorAlarmDetail(data['majorFailureData']);
			}
		},
		error : function() {
			
		}
	});
}

/**
 * 중요고장알람 테이블 Grid 함수
 */
function gridMajorAlarmDetail(obj){
	select_data = obj['majorFailureList'];
	
	if(select_data.length != 0){
		
		scrollPageNo = 1;
		scrollNo = 0;
		endScrollNo = select_data.length;
		endScrollPageNo = (endScrollNo%500)==0?(endScrollNo/500):Math.floor(endScrollNo/500)+1;
		
		$.each(select_data, function(i,row) {
			
			if(scrollNo < 500){
				var eventTime = new Date(row['EVENT_TIME']).format("yyyy/MM/dd HH:mm:ss");
				var alarmRow = "";
				alarmRow += "<tr style='cursor:pointer;'>";
				alarmRow += "	<td align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
				
//				alarmRow += "	<td align='center' title='" + select_data[i].SEVERITY + "'>" + select_data[i].SEVERITY + "</td>";
				
				var alarmGrade = '';
				var alarmGrade = getAlarmGrade(select_data[i].SEVERITY);
				
				alarmRow += 	"<td class='stat tc'><i class='mu-icon alram " + alarmGrade.toLowerCase() + "'></i></td>";
				alarmRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
				alarmRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
				alarmRow += "	<td align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
				alarmRow += "	<td align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
				alarmRow += "	<td align='center' title='" + eventTime + "'>" + eventTime + "</td>";
				alarmRow += "	<td align='center' title='" + row['FDN'] + "'>" + row['FDN'] + "</td>";
				alarmRow += "</tr>";
				
				$("#tb_majorFailureDetail tbody").append(alarmRow);
				
				if(i == 0){
					getActionCaseData(row);
					gridMajorAlarmInfo(row);
				}
				
				var lastLine = $("#tb_majorFailureDetail tbody tr").length;
				
				$("#tb_majorFailureDetail tbody tr").eq(lastLine-1).on("click",function(e){
					getActionCaseData(row);
					gridMajorAlarmInfo(row);
				});
				scrollNo++;
			}else{
				return false;
			}
//			$("#tb_majorFailureDetail tbody tr").eq(lastLine-1).find('td').each(function(){
//				$(this).on("click", function(e){
//					getActionCaseData(row);
//					gridMajorAlarmInfo(row);
//				});
//			});
		});
	}
}


/**
 * 중요고장상세 팝업에서의 조치사례 DB 조회
 */
function getActionCaseData(row){
	
	$("#tb_actionCase tbody").empty();
	gridActionCaseContents("");
	
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/popup/majorFailureDetail/getActionCaseData',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(row),
		success	: function(data) {
			if(data['actionCaseData'] != null){
				gridActionCase(data['actionCaseData']);
			}
		},
		error : function() {
			
		}
	});
}

/**
 * 조치사례 테이블 Grid 함수
 */
function gridActionCase(obj){
	var rows = obj['actionCaseList'];
	
	if(rows.length != 0){
		$('#actionCaseDiv').show();
		$('#actionCaseContentDiv').show();
		
		$.each(rows, function(i,row) {
			var insertDate = new Date(row['INSERT_DATE']).format("yyyy/MM/dd HH:mm:ss");
			var alarmRow = "";
			alarmRow += "<tr style='cursor:pointer;'>";
			alarmRow += "	<td align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
			alarmRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['ALARM_TYPE'] + "'>" + row['ALARM_TYPE'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['SYSTEM_ID'] + "'>" + row['SYSTEM_ID'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['INSERT_USER'] + "'>" + row['INSERT_USER'] + "</td>";
			alarmRow += "	<td align='center' title='" + insertDate + "'>" + insertDate + "</td>";
			alarmRow += "</tr>";
			
			$("#tb_actionCase tbody").append(alarmRow);
			
			if(i == 0){
				gridActionCaseContents(row['ACTION_CASE']);
			}
			
			var lastLine = $("#tb_actionCase tbody tr").length;
			$("#tb_actionCase tbody tr").eq(lastLine-1).find('td').each(function(){
				$(this).on("click", function(e){
					gridActionCaseContents(row['ACTION_CASE']);
//					formAlarmInfo(row);
				});
			});
		});
	} else {
		$('#actionCaseDiv').hide();
		$('#actionCaseContentDiv').hide();
	}
}

/**
 * 아래 알람 정보 폼 작성 함수 --> 조치사례 클릭시 나온다면 이 함수 사용. 아래와 둘중 하나
 */
function formAlarmInfo(obj){
	
}

/**
 * 아래 알람 정보 폼 작성 함수 --> 중요고장알림 클릭시 나온다면 이 함수 사용. 위와 둘중 하나
 */
function gridMajorAlarmInfo(row){
	// 중요고장 상세 폼 초기화
	$(".mfd_formInfo").val("");
	
	var eventTime = new Date(row['EVENT_TIME']).format("yyyy/MM/dd HH:mm:ss");
	var updateTime = new Date(row['UPDATE_TIME']).format("yyyy/MM/dd HH:mm:ss");
	var insertTime = new Date(row['INSERT_TIME']).format("yyyy/MM/dd HH:mm:ss");
	var recoverTime = new Date(row['RECOVER_TIME']).format("yyyy/MM/dd HH:mm:ss");
	
	$("#mfd_alarmCode").val(row['ALARM_CODE']);
	$("#mfd_equipType").val(row['EQUIP_NAME']);
	$("#mfd_severity").val(getAlarmGrade(row['SEVERITY']));
	$("#mfd_count").val(row['UPDATE_COUNT']);
	$("#mfd_cause").val(row['PROBABLE_CAUSE']);
	$("#mfd_location").val(row['FDN']);
	$("#mfd_majorFailure").val("YES"); //중요고장
	$("#mfd_eventTime").val(eventTime);
	$("#mfd_updateTime").val(updateTime);
	$("#mfd_recoverId").val(row['RECOVER_ID']);
	$("#mfd_insertTime").val(insertTime);
	$("#mfd_recoverTime").val(recoverTime);
	$("#mfd_systemId").val(row['SYSTEM_ID']);
	$("#mfd_team").val(row['TEAM_NAME']);
	$("#mfd_systemName").val(row['SYSTEM_NAME']);
	
}

/**
 * 오른쪽 조치사례 내용 채우는 함수
 */
function gridActionCaseContents(actionContents){
//	$("#actionCaseContents").html(actionContents);
	$("#actionCaseContents").val(actionContents);
}

function appendData(){
	scrollPageNo++;
	if(scrollPageNo <= endScrollPageNo){
		var i = scrollNo;
		var j = 0;
		
		if(select_data.length%500 == 0){
			j = scrollNo+500;
		}else{
			j = scrollPageNo==endScrollPageNo?scrollNo+select_data.length%500:scrollNo+500;
		}
		
		for(i; i< j ; i++){
			
			(function(){
				var eventTime = new Date(select_data[i].EVENT_TIME).format("yyyy/MM/dd HH:mm:ss");
				var alarmRow = "";
				
				var row = new Object();
				$.extend(row,select_data[i]);
				
				alarmRow += "<tr style='cursor:pointer;'>";
				alarmRow += "	<td align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
				alarmRow += "	<td align='center' title='" + select_data[i].SEVERITY + "'>" + select_data[i].SEVERITY + "</td>";
				alarmRow += "	<td align='center' title='" + select_data[i].ALARM_CODE + "'>" + select_data[i].ALARM_CODE + "</td>";
				alarmRow += "	<td align='center' title='" + select_data[i].EQUIP_NAME + "'>" + select_data[i].EQUIP_NAME + "</td>";
				alarmRow += "	<td align='center' title='" + select_data[i].SYSTEM_NAME + "'>" + select_data[i].SYSTEM_NAME + "</td>";
				alarmRow += "	<td align='center' title='" + select_data[i].PROBABLE_CAUSE + "'>" + select_data[i].PROBABLE_CAUSE + "</td>";
				alarmRow += "	<td align='center' title='" + eventTime + "'>" + eventTime + "</td>";
				alarmRow += "	<td align='center' title='" + select_data[i].FDN + "'>" + select_data[i].FDN + "</td>";
				alarmRow += "</tr>";
				
				$("#tb_majorFailureDetail tbody").append(alarmRow);
				
				var lastLine = $("#tb_majorFailureDetail tbody tr").length;
				
				$("#tb_majorFailureDetail tbody tr").eq(lastLine-1).on("click",function(e){
					getActionCaseData(row);
					gridMajorAlarmInfo(row);
				});
				scrollNo++;
			})();
		}
	}
}