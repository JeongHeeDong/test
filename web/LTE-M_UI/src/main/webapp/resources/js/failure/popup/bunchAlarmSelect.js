var searchBunchAlarmList = [];

$(document).ready(function(){
	
	/* 대상장비 선택화면 팝업 */
	$("#btn_bunchAlarm").on('click', function(e){
		$('#bunchAlarmBg').show().fadeIn('fast');
		$('#bunchAlarmUp').show().fadeIn('fast');
		var height = (screen.height - $('#bunchAlarmUp').height()-100)/2;
		var width = (screen.width - $('#bunchAlarmUp').width())/2;
		$('#bunchAlarmUp').css('left',width+'px');
		$('#bunchAlarmUp').css('top',height+'px');
		
		/* 팝업창의 장비옵션 세팅 */		
		optSetSystem(); 
		
		/* 다발알람 팝업시  searchBunchAlarmList에 데이터가 있다면 세팅*/
		targetBunchAlarmListSetting();
	});
	$("#bunchAlarmClose ,#bunchAlarmBg").on('click',function(e){
		$('#bunchAlarmBg').fadeOut();
		$('#bunchAlarmUp').fadeOut();
	});
	$("#bunchAlarmUp").draggable({'handle' : '#bunchAlarmTitle'});
	$("#btn_bunchAlarm_cancel").on('click', function(e){
		$('#bunchAlarmBg').fadeOut();
		$('#bunchAlarmUp').fadeOut();
	});
	
	
	$("#btn_bunchAlarmSearch").on('click', function(e){
//		getSearchBunchAlarms($("#equipOption_bunchAlarm").val(), $("#searchAlarmName").val(), $("#searchAlarmValue").val());
		getSearchBunchAlarms($("#equipOption_bunchAlarm").val());
	});
	
	var chk = '';
	$("#chk_unselect_bunchAlarmHead").on('click', function(e){
		if($("#chk_unselect_bunchAlarmHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_unselected_bunchAlarm tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				$(this).find('input:checkbox').prop('checked',chk);
			}
		});
	});	
	
	$("#chk_select_bunchAlarmHead").on('click', function(e){
		if($("#chk_select_bunchAlarmHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_selected_bunchAlarm tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				$(this).find('input:checkbox').prop('checked',chk);
			}
		});
	});
	
	$('#searchAlarmValue').keyup(function(){	
		var search_text = $('#searchAlarmValue').val();
		$('#tb_unselected_bunchAlarm tr').each(function(i,e){
			var searchAlarmName = $("#searchAlarmName").val();
			var td_target = $(this).children()[searchAlarmName];
						
			if(i != 0 && !$(td_target).text().match(search_text)){
				$(this).css('display','none');
			}else{
				$(this).css('display','');
			}

			if('' == search_text){
				$(this).css('display','');
			}
		});
	});
});


/*EPC, ACCESS에 따라 다른 장비로 옵션세팅*/
function optSetSystem(){
	$("#tb_unselected_bunchAlarm tbody tr").remove();
	$("#tb_selected_bunchAlarm tbody tr").remove();
	var options = [];
	
	var equipDesc = "all"; // 고장감시-고장이력조회 화면에서 '시스템선택' 버튼 클릭시 세팅(EPC, ACCESS 선택 안하고 모든 장비 조회함) 
	
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/popup/searchSystemSelect/getEquipType',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
				equipDesc: equipDesc
			   }),
		success: function (data) {
			
			if(data != null && data['getEquipTypeList'].length > 0){
				var equipTypeList = data['getEquipTypeList'];
				options = [];
				$.each(equipTypeList, function (i,row){
					options.push('<option value=' + row['EQUIP_TYPE'] + '>' + row['EQUIP_NAME'] + '</option>');
				});
				
			}
			$("#equipOption_bunchAlarm").html(options.join(''));
			
			/* 다발알람 팝업창 Default 조회 */
			$("#btn_bunchAlarmSearch").click();
		}
	});
	
}

//function getSearchBunchAlarms(equipType, searchAlarmName, searchAlarmValue){
function getSearchBunchAlarms(equipType){
	
	$("#tb_unselected_bunchAlarm tbody tr").remove();
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/spec/failureBunchSpec/getSearchBunchAlarms',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
			   equipType: equipType,
//			   searchAlarmName: searchAlarmName,
//			   searchAlarmValue: searchAlarmValue
			   }),
		success: function (data) {
			var rows = data['searchBunchAlarms'];
			if(rows != null && rows.length != 0){
				$.each(rows, function(i,row) {
					var tbLen = $("#tb_unselected_bunchAlarm tbody tr").length;
					var bunchRow = '';
					bunchRow += "<tr>";
					bunchRow += "	<td align='center'>";
					bunchRow += "		<div class='mu-checkbox'>";
					bunchRow += "			<input type='checkbox' id='chk_unselected_bunch" + tbLen + "'>";
					bunchRow += "			<label for='chk_unselected_bunch" + tbLen + "'></label>";
					bunchRow += "		</div>";
					bunchRow += "	</td>";
					bunchRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'];
					bunchRow += "		<input type='hidden' name='equipType' value='" + equipType + "' />";
					bunchRow += "	</td>";
					bunchRow += "	<td align='center' title='" + row['BUNCH_CODE'] + "'>" + row['BUNCH_CODE'] + "</td>";
					bunchRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
					bunchRow += "	<td title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
					bunchRow += "</tr>";
					
					$("#tb_unselected_bunchAlarm").append(bunchRow);
				});
			}
			
			$("#tb_unselected_bunchAlarm tbody tr input:checkbox").bind('click',function(e){
				var tbLen = $("#tb_unselected_bunchAlarm tbody tr").length;
				var chkLen = $("#tb_unselected_bunchAlarm tbody tr").find('input:checkbox:checked').length;
				if(tbLen != 0 && tbLen == chkLen){
					$("#chk_unselect_bunchAlarmHead").prop("checked",true);
				} else {
					$("#chk_unselect_bunchAlarmHead").prop("checked",false);
				}
			});
			
			$("#chk_unselect_bunchAlarmHead").prop("checked",false);
		}
	});
}

function targetBunchAlarmListSetting(){
	if(searchBunchAlarmList.length > 0){
		$.each(searchBunchAlarmList, function(i,row){
			var tbLen = $("#tb_selected_bunchAlarm tbody tr").length;
			var bunchRow = '';
			bunchRow += "<tr>";
			bunchRow += "	<td align='center'>";
			bunchRow += "		<div class='mu-checkbox'>";
			bunchRow += "			<input type='checkbox' id='chk_selected_bunch" + tbLen + "'>";
			bunchRow += "			<label for='chk_selected_bunch" + tbLen + "'></label>";
			bunchRow += "		</div>";
			bunchRow += "	</td>";
			bunchRow += "	</td>";
			bunchRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'];
			bunchRow += "		<input type='hidden' name='equipType' value='" + row['EQUIP_TYPE'] + "' />";
			bunchRow += "	</td>";
			bunchRow += "	<td align='center' title='" + row['BUNCH_CODE'] + "'>" + row['BUNCH_CODE'] + "</td>";
			bunchRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
			bunchRow += "	<td title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
			bunchRow += "</tr>";
			
			$("#tb_selected_bunchAlarm").append(bunchRow);
		});
	}
}

function addBunchAlarmList(){
	var existed = false;
	$("#tb_unselected_bunchAlarm tbody tr input:checkbox:checked").each(function(i,e) { 
		var td = $(this).parent().parent().parent().find('td');
		var equipName = td.eq(1).text().trim();
		var equipType = td.eq(1).find('input[name="equipType"]').val();
		var bunchCode = td.eq(2).text().trim();
		var alarmCode = td.eq(3).text().trim();
		var cause = td.eq(4).text().trim();
		var flag = false;
		$("#tb_selected_bunchAlarm tbody tr").each(function(){ 
			if(equipName == $(this).find('td').eq(1).text().trim() 
					&& equipType == $(this).find('input[name="equipType"]').val()
					&& bunchCode == $(this).find('td').eq(2).text().trim()
					&& alarmCode == $(this).find('td').eq(3).text().trim()
					&& cause == $(this).find('td').eq(4).text().trim()) {
				flag = true;
			}
		});
		
		if(!flag) {
			var tbLen = $("#tb_selected_bunchAlarm tbody tr").length;
			var bunchRow = '';
			bunchRow += "<tr>";
			bunchRow += "	<td align='center'>";
			bunchRow += "		<div class='mu-checkbox'>";
			bunchRow += "			<input type='checkbox' id='chk_selected_bunch" + tbLen + "'>";
			bunchRow += "			<label for='chk_selected_bunch" + tbLen + "'></label>";
			bunchRow += "		</div>";
			bunchRow += "	</td>";
			bunchRow += "	</td>";
			bunchRow += "	<td align='center' title='" + equipName + "'>" + equipName;
			bunchRow += "		<input type='hidden' name='equipType' value='" + equipType + "' />";
			bunchRow += "	</td>";
			bunchRow += "	<td align='center' title='" + bunchCode + "'>" + bunchCode + "</td>";
			bunchRow += "	<td align='center' title='" + alarmCode + "'>" + alarmCode + "</td>";
			bunchRow += "	<td title='" + cause + "'>" + cause + "</td>";
			bunchRow += "</tr>";
			
			$("#tb_selected_bunchAlarm").append(bunchRow);
			existed = true;
		}
	});
	
	if(!existed){
		alert("이미 추가된 알람입니다.");
	}
	
	$("#tb_selected_bunchAlarm tbody tr input:checkbox").bind('click',function(e) {
		var tbLen = $("#tb_selected_bunchAlarm tbody tr").length;
		var chkLen = $("#tb_selected_bunchAlarm tbody tr").find('input:checkbox:checked').length;
		if(tbLen != 0 && tbLen == chkLen) {
			$("#chk_select_bunchAlarmHead").prop("checked",true);
		} else {
			$("#chk_select_bunchAlarmHead").prop("checked",false);
		}
	});

	$("#chk_select_bunchAlarmHead").prop("checked",false);
}

function deleteBunchAlarmList(){
	$("#tb_selected_bunchAlarm tbody tr input:checkbox:checked").each(function(i,e) { 
		$(this).parent().parent().parent().remove();
	});
	
	var tbLen = $("#tb_selected_bunchAlarm tbody tr").length;
	var chkLen = $("#tb_selected_bunchAlarm tbody tr").find('input:checkbox:checked').length;
	if(tbLen != 0 && tbLen == chkLen) {
		$("#chk_select_bunchAlarmHead").prop("checked",true);
	} else {
		$("#chk_select_bunchAlarmHead").prop("checked",false);
	}
}

function saveBunchAlarmList(){
	var bunchAlarmCode = [];
	if($("#tb_selected_bunchAlarm tbody tr").length != 0){
		searchBunchAlarmList = [];
		$("#tb_selected_bunchAlarm tbody tr").each(function(i,e) {
			var rowItem = {};
			rowItem['EQUIP_NAME'] = $(this).find('td').eq(1).text().trim();
			rowItem['BUNCH_CODE'] = $(this).find('td').eq(2).text().trim();
			rowItem['ALARM_CODE'] = $(this).find('td').eq(3).text().trim();
			rowItem['PROBABLE_CAUSE'] = $(this).find('td').eq(4).text().trim();
			rowItem['EQUIP_TYPE'] = $(this).find('input[name="equipType"]').val();
			searchBunchAlarmList.push(rowItem);
			bunchAlarmCode.push($(this).find('td').eq(2).text().trim());
		});
		
	} else {
		searchBunchAlarmList = [];
	}
	
	$("#target_bunchAlarm").val(bunchAlarmCode.join(','));
	$("#target_bunchAlarm").prop("title", $("#target_bunchAlarm").val());
	$("#btn_bunchAlarm_cancel").click();
	
}
