var
	failureDetailAjax1,
	failureDetailAjax2,
	failureDetailAjax3;

var excelForAlarmId = '',
	excelForSystemId = '',
	excelForAlarmCode = '',
	excelForEquipType = '';

var $actionCaseTables = '',
	actionCaseTableHtml = '';

$(document).ready(function() {
	// 고장정보 그리드 클릭시 조치사례 팝업
	// 조치 사례 테이블 초기화
	var $tbAlarmActionCase = $("#tb_alarmActionCase");
	$tbAlarmActionCase.find("tbody tr td").html("");
	$tbAlarmActionCase.find("tbody tr td").removeProp('title');
	// 고장정보 상세 폼 초기화
	$(".fd_formInfo").val("");

	$actionCaseTables = $('#actionCaseTables');
	actionCaseTableHtml = $actionCaseTables.html().replace('style="max-height: 65px"', '');
});

/**
 * ROP 메세지 DB 조회
 */
function getRopMsgData(alarmId){
	failureDetailAjax3 = $.ajax({
		cache : false,
		type : 'post',
		url : '/failure/popup/failureDetail/getRopMsgData',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify({
			alarmId : alarmId
		}),
		success	: function(data) {
			
			$("#ropMessage").text('해당 내용이 없습니다.');
			
			if(data['getRopMsgData'] != null){
				gridRopMsg(data['getRopMsgData']);
			}
		},
		error : function() {
			
		}
	});
}

function gridRopMsg(obj){
	var row = obj['ropMsgList'][0];
	if(row == null){
		return;
	}
//	console.log(row['ROP_MESSAGE']);
	$("#ropMessage").text(row['ROP_MESSAGE']);

	$("#ropMessagePrint").text("");
	$("#ropMessagePrint").append('<pre>' + row['ROP_MESSAGE'] + '</pre>');
}

/**
 * 실시간알람 클릭시 나오는 팝업에서의 조치사례 DB 조회
 */
function getAlarmActionCaseData(row){
	excelForAlarmId = row.ALARM_ID;
	excelForSystemId = row.SYSTEM_ID;
	excelForAlarmCode = row.ALARM_CODE;
	excelForEquipType = row.EQUIP_TYPE;

	failureDetailAjax2 = $.ajax({
		cache : false,
		type : 'post',
		url : '/failure/popup/majorFailureDetail/getActionCaseData',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(row),
		success	: function(data) {
			
			$("#tb_alarmActionCase").find("tbody tr").remove();
			$("#alarmActionCaseContents").val('해당 내용이 없습니다.');

			if(data['actionCaseData'] != null){
				gridAlarmActionCase(data['actionCaseData']);
			}

			$('#failureDetailBg').show().fadeIn('fast');
			$('#failureDetailUp').show().fadeIn('fast'); 
			
			var height = (screen.height - $('#failureDetailUp').height()-100)/2;
			var width = (screen.width - $('#failureDetailUp').width())/2;
			
			$('#failureDetailUp').css('left',width+'px');
			$('#failureDetailUp').css('top',height+'px');
				
			/*조치사례 및 고장상세 dialog 숨기기*/
			$("#failureDetailClose ,#failureDetailBg").on('click',function(e){
				$('#failureDetailBg').fadeOut();
				$('#failureDetailUp').fadeOut();
			});
			/*조치사례 및 고장상세 dialog 드래그, 창사이즈조절*/
			$( "#failureDetailUp" ).draggable({'handle' : '#failureDetailTitle'});
//			$( "#failureDetailUp" ).resizable({
//				minHeight: 520,
//				minWidth: 790,
//				animate: true
//			});
		},
		error : function() {
			
		}
	});
}

function gridAlarmActionCase(obj){
	var $actionCaseTable = '';
	var actionCaseTableTbodies = '';
	$actionCaseTables.empty();

	var rows = obj['actionCaseList'];
	var rowLen = rows.length;

	if(rowLen != 0){
		for(var itr = 0; itr < rowLen; itr += 1) {
			$actionCaseTables.append(actionCaseTableHtml);
		}

		$actionCaseTable = $('.actionCaseTable');

		actionCaseTableTbodies = $actionCaseTable.find('table tbody');
		var insertDate = '';
		var alarmRow = '';
		var caseContent = '';
		$.each(rows, function(i,row) {
			insertDate = new Date(row['INSERT_DATE']).format("yyyy/MM/dd");
			alarmRow = "";
			alarmRow += "<tr style='cursor:pointer;'>";
			alarmRow += "	<td align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
			alarmRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['ALARM_TYPE'] + "'>" + row['ALARM_TYPE'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['SYSTEM_ID'] + "'>" + row['SYSTEM_ID'] + "</td>";
			alarmRow += "	<td align='center' title='" + row['INSERT_USER'] + "'>" + row['INSERT_USER'] + "</td>";
			alarmRow += "	<td align='center' title='" + insertDate + "'>" + insertDate + "</td>";
			alarmRow += "</tr>";

			caseContent = "";
			caseContent += "<tr style='cursor:pointer;'>";
			caseContent += "	<td align='center' title='" + row['ACTION_CASE'] + "'>" + row['ACTION_CASE'] + "</td>";
			caseContent += "</tr>";

			$("#tb_alarmActionCase").find("tbody").append(alarmRow);

			actionCaseTableTbodies.eq([i * 2]).empty();
			actionCaseTableTbodies.eq([i * 2]).append(alarmRow);

			actionCaseTableTbodies.eq([i * 2 + 1]).empty();
			actionCaseTableTbodies.eq([i * 2 + 1]).append(caseContent);

			if(i == 0){
				gridAlarmActionCaseContents(row['ACTION_CASE']);
			}
			
			var lastLine = $("#tb_alarmActionCase tbody tr").length;
			$("#tb_alarmActionCase tbody tr").eq(lastLine-1).find('td').each(function(){
				$(this).on("click", function(e){
					gridAlarmActionCaseContents(row['ACTION_CASE']);
				});
			});

			var lastLinePrint = $(".tb_alarmActionCasePrint").find("tbody tr").length;
			$(".tb_alarmActionCasePrint").find("tbody tr").eq(lastLinePrint-1).find('td').each(function(){
				$(this).on("click", function(e){
					gridAlarmActionCaseContentsPrint(row['ACTION_CASE']);
				});
			});
		});
		
		// 조치 사례가 있을 경우 해당 영역 표시
		$('#alarmActionCaseListDiv').show();
		$('#alarmActionCaseContentsDiv').show();
		
	} else {
		$("#tb_alarmActionCase tbody").append('<tr><td colspan="7" align="center" valign="middle">해당 내용이 없습니다.</td></tr>');
		$("#alarmActionCaseContents").val('해당 내용이 없습니다.');

		$actionCaseTables.append(actionCaseTableHtml);
		$actionCaseTable = $('.actionCaseTable');
		actionCaseTableTbodies = $actionCaseTable.find('table tbody');
		actionCaseTableTbodies.eq(0).append('<tr><td colspan="7" align="center" valign="middle">해당 내용이 없습니다.</td></tr>');
		actionCaseTableTbodies.eq(1).append('<tr><td>해당 내용이 없습니다.</td></tr>');

		// 조치 사례 없을 경우 해당 영역 숨김.
		$('#alarmActionCaseListDiv').hide();
		$('#alarmActionCaseContentsDiv').hide();
	}
}

/**
 * 오른쪽 조치사례 내용 채우는 함수
 */
function gridAlarmActionCaseContents(alarmActionCaseContents){
	$("#alarmActionCaseContents").val(alarmActionCaseContents);
}

function gridAlarmActionCaseContentsPrint(alarmActionCaseContents){
	$("#alarmActionCaseContentsPrint").text(alarmActionCaseContents);
}

/**
 *  실시간알람 클릭시 나오는 팝업에서 고장정보(아래쪽) DB 조회
 */
function getFailureData(anomaly,type){
	var msg = anomaly.split("|");
	failureDetailAjax1 = $.ajax({
		cache : false,
		type : 'post',
		url : '/failure/popup/failureDetail/getFailureData',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify({
			alarmId : msg[0]
		}),
		success	: function(data) {
			if(data['failureData'] != null){
				gridAlarmInfo(data['failureData'],type);
			}
		},
		error : function() {
			
		}
	});
}

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
	var eventTime = new Date(row['EVENT_TIME']).format("yyyy/MM/dd HH:mm:ss");
	var updateTime = new Date(row['UPDATE_TIME']).format("yyyy/MM/dd HH:mm:ss");
	
	$("#fd_alarmCode").val(row['ALARM_CODE']);
	
	var equipNm = 1;	//HardCoding
	
	if(type == 'main'){
		for(var index in equipInfo){
			if(row['EQUIP_TYPE'] == equipInfo[index].EQUIP_TYPE){
				equipNm = equipInfo[index].EQUIP_NAME;
				break;
			}else{
				equipNm = '-';
			}
		}
	}else{
		for(var index in equipData){
			if(row['EQUIP_TYPE'] == equipData[index].EQUIP_TYPE){
				equipNm = equipData[index].EQUIP_NAME;
				break;
			}else{
				equipNm = '-';
			}
		}
	}
	
	$("#fd_equipType").val(equipNm);
	$("#fd_severity").val(getAlarmGrade(row['SEVERITY']));
	$("#fd_count").val(row['UPDATE_COUNT']);
	$("#fd_cause").val(row['PROBABLE_CAUSE']);
	$("#fd_location").val(row['FDN']);

	$("#fd_alarmCodePrint").text(row['ALARM_CODE']);
	$("#fd_equipTypePrint").text(row['EQUIP_TYPE']);
	$("#fd_severityPrint").text(row['SEVERITY']);
	$("#fd_countPrint").text(row['UPDATE_COUNT']);
	$("#fd_causePrint").text(row['PROBABLE_CAUSE']);
	$("#fd_locationPrint").text(row['FDN']);
	$("#fd_eventTimePrint").text(eventTime);
	$("#fd_updateTimePrint").text(updateTime);

	var $fd_majorFailure = $("#fd_majorFailure");
	var $fd_majorFailurePrint = $("#fd_majorFailurePrint");
	
	var majorFlag = false;
	
	if(typeof majorAlarmCodeFilterList !== 'undefined' && majorAlarmCodeFilterList.length > 0) {
		for(i in majorAlarmCodeFilterList){
			var majorAlarmCodeFilter = majorAlarmCodeFilterList[i];
			
			if(majorAlarmCodeFilter['ALARM_CODE'] == row['ALARM_CODE'] && majorAlarmCodeFilter['EQUIP_TYPE'] == row['EQUIP_TYPE']){
				majorFlag = true;
				break;
			} else {
				majorFlag = false;
			}
		}
	}
	
	if(majorFlag){
		$fd_majorFailure.val("YES"); //중요고장
		$fd_majorFailurePrint.text("YES"); //중요고장
	} else{
		$fd_majorFailure.val("NO"); //중요고장
		$fd_majorFailurePrint.text("NO"); //중요고장
	}
	
	
	$("#fd_eventTime").val(eventTime);
	$("#fd_updateTime").val(updateTime);

	$("#fd_systemId").val(row['SYSTEM_ID']);
	$("#fd_team").val(row['TEAM_NAME']);
//	$("#").val(); //특수지역
	$("#fd_systemName").val(row['SYSTEM_NAME']);

	$("#fd_systemIdPrint").text(row['SYSTEM_ID']);
	$("#fd_teamPrint").text(row['TEAM_NAME']);
	$("#fd_systemNamePrint").text(row['SYSTEM_NAME']);
}

function popupPrint() {
	var contents = document.querySelectorAll('#printDiv .mu-boxCell');
	var recover = contents[0].innerHTML.replace('style="max-height: 65px"', '');
	var content = contents[1].innerHTML;
	var message = contents[2].innerHTML;
	var failure = contents[3].innerHTML;
	var config = contents[4].innerHTML;

	var html = '';

	html += '<html><head>';
	html += '<script>function printReport() { window.print(); } window.onload = printReport;</script>';
	html += '<link href="/resources/css/font-awesome.min.css" rel="stylesheet" type="text/css" />';
	html += '<link href="/resources/css/common.css" rel="stylesheet" type="text/css" />';
	html += '<link href="/resources/css/style.css" rel="stylesheet" type="text/css" />';
	html += '<style type="text/css">.vertical-space {display: block;height:50px;}</style>';
	html += '</head><body >';
	if($(recover).find('.actionCasePrint tbody tr').length > 0 && $(recover).find('.actionCasePrint tbody tr td').length > 1) {
		// 조치 사례가 있을 경우에만 표시
		html += '<div class="vertical-space"></div>';
		html += '<div>' + recover + '</div>';
	}
	html += '<div class="vertical-space"></div>';
	html += '<div>' + message + '</div>';
	html += '<div class="vertical-space"></div>';
	html += '<div>' + failure + '</div>';
	html += '<div class="vertical-space"></div>';
	html += '<div>' + config + '</div>';
	html += '</body></html>';

	var mywindow = window.open('', '', 'width=600, height=400');
	//mywindow.document.open();
	mywindow.document.write(html);
	mywindow.document.close();
	mywindow.focus();

	return true;
}

function excelFailureActionCase() {
	//엑셀 다운로드 이벤트
	$("#excelDownloadBtn").on('click', function () {
		// var url = "/failure/popup/getActionCase/excelExport?" +
		// 	"alarmId=" + excelForAlarmId + "&systemId=" + excelForSystemId +
		// 	"&alarmCode=" + excelForAlarmCode + "&equipType=" + excelForEquipType +
		// 	"&majorFailure=" + $("#fd_majorFailure").val();
		// $(location).attr('href', url);

		document.getElementById('excelDownload').src =
			"/failure/popup/getActionCase/excelExport?" +
			"alarmId=" + excelForAlarmId + "&systemId=" + excelForSystemId +
				"&alarmCode=" + excelForAlarmCode + "&equipType=" + excelForEquipType +
				"&majorFailure=" + $("#fd_majorFailure").val() + "&eventTime=" + setDate();
	});
}
