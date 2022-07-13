/*적용(체크)된 등급과 적용(체크)안된 등급 모두 저장함(Y/N으로 구분) */
$(document).ready(function(){
	
	$("#btn_settingUnrecoveredAlarm_close").on('click',function(e){
		window.open("about:blank","_self").close();
	});
	
	initialBunchFailureForm();
	
	$("#chk_unselectHead").on('click', function(e){
		if($("#chk_unselectHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_unselected_alarmCode tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				$(this).find('input:checkbox').prop('checked',chk);
			}
		});
	});	
	
	$("#chk_selectHead").on('click', function(e){
		if($("#chk_selectHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_selected_alarmCode tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				$(this).find('input:checkbox').prop('checked',chk);
			}
		});
	});
	
	$('#alarmCode_search').keyup(function(){	
		var search_text = $('#alarmCode_search').val();
		$('#tb_unselected_alarmCode tbody tr').each(function(){
			var tr_length = $(this).children().length;
			for(var index = 1; index<tr_length ; index++){
				var td_element = $(this).children()[index];
				
				//match로 바꿀 필요성 고려
//				if($(td_element).text() != search_text){
				if(!$(td_element).text().match(search_text)){
					$(this).css('display','none');
				}else{
					$(this).css('display','');
					break;
				}
			}
			
			if('' == search_text){
				$(this).css('display','');
			}
		});
	});
});


function initialBunchFailureForm(){
	
	/* 제조사 리스트업 */
	$.ajax({
		cache : false,
		async : false,
		type : 'post',
		url : '/failure/setting/getVendorData',
		dataType:'json',
		success: function (data) {
			if(data != null && data['vendorData'].length > 0){
				var options = [];
				$.each(data['vendorData'], function (i,row){
					options.push('<option value=' + row['VENDOR_ID'] + '>' + row['VENDOR_NAME'] + '</option>');
				});
				$("#vendor_unRecoverSetting").html(options.join(''));
			}
		}
	});
	
	/* 장비타입 리스트업 */
	$.ajax({
		cache : false,
		async : false,
		type : 'post',
		url : '/failure/setting/getEquipData',
		dataType:'json',
		success: function (data) {
			if(data != null && data['equipData'].length > 0){
				var options = [];
				$.each(data['equipData'], function (i,row){
					options.push('<option value=' + row['EQUIP_TYPE'] + '>' + row['EQUIP_NAME'] + '</option>');
				});
				$("#equip_unRecoverSetting").html(options.join(''));
			}
		}
	});
	
	/* 미복구 알람설정 폼 초기화 */
	$("#tb_unRecoverSetting tbody tr").each(function(i,e){
		$(this).find('td input[name="unrecoverChk"]').eq(0).prop("checked", false);
		$(this).find('td input[name="unrecoverTime"]').eq(0).val("");
	});
	
	/* 미복구 알람설정 데이터 조회 */
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/unrecoveredAlarmSetting/getUnrecoveredAlarmSettingData',
		dataType:'json',
		success: function (data) {
			if(data != null && data['unrecoveredAlarmSettingData'].length > 0){
				$.each(data['unrecoveredAlarmSettingData'], function (i,row){
					//critical
					$("#criticalTime").val(row['CRITICAL_TIME']);
					if(row['USE_FLAG_CRITICAL'] != null && row['USE_FLAG_CRITICAL'] == "Y"){
						$("#chk_unRecover1").prop("checked", true);							
					} else if(row['USE_FLAG_CRITICAL'] != null && row['USE_FLAG_CRITICAL'] == "N"){
						$("#chk_unRecover1").prop("checked", false);														
					}
					//major
					$("#majorTime").val(row['MAJOR_TIME']);
					if(row['USE_FLAG_MAJOR'] != null && row['USE_FLAG_MAJOR'] == "Y"){
						$("#chk_unRecover2").prop("checked", true);							
					} else if(row['USE_FLAG_MAJOR'] != null && row['USE_FLAG_MAJOR'] == "N"){
						$("#chk_unRecover2").prop("checked", false);														
					}
					//minor
					$("#minorTime").val(row['MINOR_TIME']);
					if(row['USE_FLAG_MINOR'] != null && row['USE_FLAG_MINOR'] == "Y"){
						$("#chk_unRecover3").prop("checked", true);							
					} else if(row['USE_FLAG_MINOR'] != null && row['USE_FLAG_MINOR'] == "N"){
						$("#chk_unRecover3").prop("checked", false);														
					}
				});
				
			}
		}
	});
}

function saveUnrecoverTime(){
	var saveList = [];
	var flag = false;

	$("#tb_unRecoverSetting tbody tr").each(function(i,row){
		var saveObj = {};
		var unrecoverTime = $(row).find('td input[name="unrecoverTime"]').val();
		
		if(!flag){
			if($(row).find('td input[name="unrecoverChk"]').prop('checked')){
				if(unrecoverTime == ""){
					flag = true;
					alert("적용할 등급의 미복구 시간을 채워주세요");
				} 
				saveObj['flag'] = 'Y';
			} else {
				if(unrecoverTime == ""){
					unrecoverTime = 0;
				}
				saveObj['flag'] = 'N';
			}
			
			saveObj['grade'] = $(row).find('td input[name="gradeNum"]').val();
			saveObj['time'] = unrecoverTime;
			saveList.push(saveObj);
		}
	});
	
	if(!flag){
		$.ajax({
			cache : false,
			type : 'post',
			url : '/failure/setting/unrecoveredAlarmSetting/addUnrecoveredAlarmTime',
			contentType: 'application/json; charset=UTF-8',
			dataType:'json',
			data : JSON.stringify(saveList),
			success: function (data) {
				if(data != null && data['addUnrecoveredAlarmTimeResult'].length > 0){
					alert(data['addUnrecoveredAlarmTimeResult']);
				}
			}
		});		
	}
}

function saveUnrecoverAlarmCode(){
	var saveList = [];
	var flag = false;
	$("#tb_selected_alarmCode tbody tr").each(function(){ 
		var td = $(this).parent().parent().parent().find('td');
		var alarmCode = td.eq(1).text().trim();
		var unrecoverTime = td.eq(2).text().trim();
	
		if(!flag){
			if($(row).find('td input[name="unrecoverChk"]').prop('checked')){
				if(unrecoverTime == ""){
					flag = true;
					alert("선택한 알람코드의 미복구 시간을 채워주세요");
				} 
				saveObj['flag'] = 'Y';
			} else {
				if(unrecoverTime == ""){
					unrecoverTime = 0;
				}
				saveObj['flag'] = 'N';
			}
			
			saveObj['alarmCode'] = alarmCode;
			saveObj['time'] = unrecoverTime;
			saveObj['equipType'] = $("#equip_unRecoverSetting").val();
			saveObj['vendorId'] = $("#vendor_unRecoverSetting").val();
			saveList.push(saveObj);
		}
	});
	
	if(!flag){
		$.ajax({
			cache : false,
			type : 'post',
			url : '/failure/setting/settingUnrecoveredAlarm/addUnrecoveredAlarmCode',
			contentType: 'application/json; charset=UTF-8',
			dataType:'json',
			data : JSON.stringify(saveList),
			success: function (data) {
				if(data != null && data['addUnrecoveredAlarmCodeResult'].length > 0){
					alert(data['addUnrecoveredAlarmResult']);
				}
			}
		});
	}
	
	
}

function btnSearchClick(){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/getUnrecoveredAlarmCode',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
				vendorId : $("#vendor_unRecoverSetting").val(),
				equipType: $("#equip_unRecoverSetting").val(),
			   }),
		success: function (data) {
			var rows = data['unrecoveredAlarmCodeResult'];
			if(rows != null && rows.length != 0){
				$("#tb_unselected_alarmCode tbody tr").remove();
				$.each(rows, function(i,row) {
					var tbLen = $("#tb_unselected_alarmCode tbody tr").length;
					var num = tbLen+1;
					var systemRow = '';
					systemRow += "<tr style='cursor:pointer;'>";
					systemRow += 	"<td align='center'>";
					systemRow += 		"<div class='mu-checkbox'>";
					systemRow += 			"<input type='checkbox' id='chk_unselected" + tbLen + "'>";
					systemRow += 			"<label for='chk_unselected" + tbLen + "'></label>";
					systemRow += 		"</div>";
					systemRow += 	"</td>";
					systemRow += 	"<td align='center' title='" + num + "'>" + num + "</td>";
					systemRow += 	"<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
					systemRow += "</tr>";
					
					$("#tb_unselected_alarmCode").append(systemRow);
				});
			}
			
			$("#tb_unselected_alarmCode tbody tr input:checkbox").bind('click',function(e){
				var tbLen = $("#tb_unselected_alarmCode tbody tr").length;
				var chkLen = $("#tb_unselected_alarmCode tbody tr").find('input:checkbox:checked').length;
				if(tbLen != 0 && tbLen == chkLen){
					$("#chk_unselectHead").prop("checked",true);
				} else {
					$("#chk_unselectHead").prop("checked",false);
				}
			});
			
			$("#chk_unselectHead").prop("checked",false);
		}
	});
}

function addUnrecoveredAlarmCode(){
	var tmpList = [];
	$("#tb_unselected_alarmCode tbody tr input:checkbox:checked").each(function(i,e) { 
		var td = $(this).parent().parent().parent().find('td');
		var alarmCode = td.eq(2).text().trim();
		var flag = false;
		$("#tb_selected_alarmCode tbody tr").each(function(){ 
			if(!flag && alarmCode == $(this).find('td').eq(1).text().trim()) {
				tmpList.push(alarmCode);
				flag = true;
			}
		});
		
		if(!flag){
			var tbLen = $("#tb_selected_alarmCode tbody tr").length;
			var systemRow = '';
			systemRow += "<tr style='cursor:pointer;'>";
			systemRow += "	<td align='center'>";
			systemRow += "		<div class='mu-checkbox'>";
			systemRow += "			<input type='checkbox' id='chk_selected" + tbLen + "'>";
			systemRow += "			<label for='chk_selected" + tbLen + "'></label>";
			systemRow += "		</div>";
			systemRow += "	</td>";
			systemRow += "	<td align='center' title='" + alarmCode + "'>" + alarmCode + "</td>";
			systemRow += "	<td align='center'>";
			systemRow += "		<input id='' name='alarmCodeUnrecoveredTime' type='number' min='0' class='mu-input' value=''>";
			systemRow += "	</td>";
			systemRow += "</tr>";
			
			$("#tb_selected_alarmCode").append(systemRow);
		}
	});
	
	if(tmpList.length > 0){
		alert("이미 추가된 알람코드 입니다. \n[" + tmpList.join(", ") + "]");
	}
	
	$("#tb_selected_alarmCode tbody tr input:checkbox").bind('click',function(e) {
		var tbLen = $("#tb_selected_alarmCode tbody tr").length;
		var chkLen = $("#tb_selected_alarmCode tbody tr").find('input:checkbox:checked').length;
		if(tbLen != 0 && tbLen == chkLen) {
			$("#chk_selectHead").prop("checked",true);
		} else {
			$("#chk_selectHead").prop("checked",false);
		}
	});

	$("#chk_selectHead").prop("checked",false);
	
}

function deleteUnrecoveredAlarmCode(){
	$("#tb_selected_alarmCode tbody tr input:checkbox:checked").each(function(i,e) { 
		$(this).parent().parent().parent().remove();
	});
	
	var tbLen = $("#tb_selected_alarmCode tbody tr").length;
	var chkLen = $("#tb_selected_alarmCode tbody tr").find('input:checkbox:checked').length;
	if(tbLen != 0 && tbLen == chkLen) {
		$("#chk_selectHead").prop("checked",true);
	} else {
		$("#chk_selectHead").prop("checked",false);
	}
	
}

