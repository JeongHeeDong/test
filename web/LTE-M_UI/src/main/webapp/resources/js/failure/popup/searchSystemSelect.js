var searchTargetSystemList = [];
var equipDesc = 'all';
var lineInfoDict= {}; //노선ID: 노선명 

$(document).ready(function(){
	
	/* 대상장비 선택화면 팝업 */
	$("#btn_search_target").on('click', function(e){
		$('#equip_search').val('');
		$('#searchSystemBg').show().fadeIn('fast');
		$('#searchSystemUp').show().fadeIn('fast');
		var height = (screen.height - $('#searchSystemUp').height()-100)/2;
		var width = (screen.width - $('#searchSystemUp').width())/2;
		$('#searchSystemUp').css('left',width+'px');
		$('#searchSystemUp').css('top',height+'px');
		
		$("#divSystemLine").hide();
		/* 팝업창의 장비옵션 세팅 */		
		optSearchSystem();
		
		/* 대상장비 팝업시  searchTargetSystemList에 데이터가 있다면 세팅*/
		targetSystemListSetting();
	});
	$("#searchSystemClose ,#searchSystemBg").on('click',function(e){
		$('#searchSystemBg').fadeOut();
		$('#searchSystemUp').fadeOut();
	});
	$("#searchSystemUp").draggable({'handle' : '#searchSystemTitle'});
	$("#btn_searchSystem_cancel").on('click', function(e){
		$('#searchSystemBg').fadeOut();
		$('#searchSystemUp').fadeOut();
	});
	
	
	$("#btn_systemSearch").on('click', function(e){
		getSearchSystemList($("#selectedEquip").val());
	});
	
	var chk = '';
	$("#chk_unselectHead").on('click', function(e){
		if($("#chk_unselectHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_unselected_searchSystem tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				if($(this).parents('tr').css('display') !== 'none' ){
					$(this).find('input:checkbox').prop('checked',chk);
				}
			}
		});
	});	
	
	$("#chk_selectHead").on('click', function(e){
		if($("#chk_selectHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_selected_searchSystem tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				if($(this).parents('tr').css('display') !== 'none' ){
					$(this).find('input:checkbox').prop('checked',chk);
				}
			}
		});
	});
	
	$('#equip_search').keyup(function(){
		$(":checkbox", $('#tb_unselected_searchSystem')).prop("checked", false);
		$(":checkbox", $('#tb_selected_searchSystem')).prop("checked", false);
		$("#tb_unselected_searchSystem tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				$(this).find('input:checkbox').prop('checked','');
			}
		});
		var search_text = $('#equip_search').val();
		$('#tb_unselected_searchSystem tr').each(function(i,e){
			var tr_length = $(this).children().length;
			for(var index = 1; index<tr_length ; index++){
				var td_element = $(this).children()[index];
				
				//match로 바꿀 필요성 고려
//				if($(td_element).text() != search_text){
				if(i != 0 && !$(td_element).text().match(search_text)){
					$(this).css('display','none');
				} else{
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


/*EPC, ACCESS에 따라 다른 장비로 옵션세팅*/
function optSearchSystem(){
	$("#tb_unselected_searchSystem tbody tr").remove();
	$("#tb_selected_searchSystem tbody tr").remove();
	var options = [];
	
	equipDesc = "all"; // 고장감시-고장이력조회 화면에서 '시스템선택' 버튼 클릭시 세팅(EPC, ACCESS 선택 안하고 모든 장비 조회함) 
	if($("input:radio[name='rd_search_ea']:checked").val() != null){ // 고장통계-장비별알람분석, 고장통계-일일고장조회 화면에서 '시스템선택' 버튼 클릭시 세팅(EPC인지 ACCESS인지 먼저 선택함) 
		equipDesc = $("input:radio[name='rd_search_ea']:checked").val() == 'all' ? 'all' : $("input:radio[name='rd_search_ea']:checked").val().toUpperCase();
	}
	
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
			
			if(data != null && 'getEquipTypeList' in data){
				var equipTypeList = [];
				var lineList = [];
				if(data != null && data.getEquipTypeList.EQUIPTYPELIST.length > 0){
					equipTypeList = data.getEquipTypeList.EQUIPTYPELIST;
					equipOptions = [];
					equipOptions.push('<option value=0>전체</option>');
					$.each(equipTypeList, function (i,row){
						equipOptions.push('<option value=' + row['EQUIP_TYPE'] + '>' + row['EQUIP_NAME'] + '</option>');
					});
					$("#selectedEquip").html(equipOptions.join(''));
				}
				if(data != null && data.getEquipTypeList.LINELIST.length > 0){
					lineList = data.getEquipTypeList.LINELIST;
					lineOptions = [];
					lineOptions.push('<option value="">전체</option>');
					$.each(lineList, function (i,row){
//						if(row.LINE_ID != '0'){
//							lineOptions.push('<option value=' + row['LINE_ID'] + '>' + row['LINE_NAME'] + '</option>');
//						}
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
								
			}
			
			/* 시스템선택 팝업창 Default 조회 */
			$("#btn_systemSearch").click();
		}
	});
	
}

function getSearchSystemList(equipType){
	var lineId = $("#selectedLine").val()
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/popup/searchSystemSelect/getSearchSystemList',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
			equipDesc: equipDesc
			,equipType: equipType
			,lineId: lineId
		}),
		success: function (data) {
			var rows = data['getSearchSystemList'];
			$("#tb_unselected_searchSystem tbody tr").remove();
			if(rows != null && rows.length != 0){
				$.each(rows, function(i,row) {
					
					// 호선 명
					var LINE_NAME = '';
					LINE_NAME = getLineName(row.LINE_ID);
					
//					// 관제센터 '-'표시
//					if( row.LINE_ID == '0'){
//						LINE_NAME = '-'
//					}
					
					var tbLen = $("#tb_unselected_searchSystem tbody tr").length;
					var systemRow = '';
					systemRow += "<tr style='cursor:pointer;'>";
					systemRow += 	"<td align='center'>";
					systemRow += 		"<div class='mu-checkbox'>";
					systemRow += 			"<input type='checkbox' id='chk_unselected" + tbLen + "'>";
					systemRow += 			"<label for='chk_unselected" + tbLen + "'></label>";
					systemRow += 		"</div>";
					systemRow += 	"</td>";
					systemRow += 	"<td align='center' title='" + row['LINE_ID'] + "'>" + LINE_NAME + "</td>";
					systemRow += 	"<td align='center' title='" + row['SYSTEM_ID'] + "'>" + row['SYSTEM_ID'];
					
					if(equipType == 0 || equipType == 14) {
						systemRow += 		"<input type='hidden' name='equipType' value='" + row['EQUIP_TYPE'] + "' />";
					} else {
						systemRow += 		"<input type='hidden' name='equipType' value='" + equipType + "' />";
					}
					
					systemRow += 	"</td>";
					systemRow += 	"<td align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
					systemRow += "</tr>";
					
					$("#tb_unselected_searchSystem").append(systemRow);
				});
			}
			
			$("#tb_unselected_searchSystem tbody tr input:checkbox").bind('click',function(e){
				var tbLen = $("#tb_unselected_searchSystem tbody tr").length;
				var chkLen = $("#tb_unselected_searchSystem tbody tr").find('input:checkbox:checked').length;
				if(tbLen != 0 && tbLen == chkLen){
					$("#chk_unselectHead").prop("checked",true);
				} else {
					$("#chk_unselectHead").prop("checked",false);
				}
			});
			
			$("#chk_unselectHead").prop("checked",false);
			
			// 장비타입이 DU/정류기/스위치 외에는 호선컬럼,호선셀렉트박스 미표현
			if ( $('[name="rd_search_ea"]:checked').val() == 'epc' ){
				$("#tb_unselected_searchSystem td:nth-child(2)").hide();
				$("#tb_unselected_searchSystem th:nth-child(2)").hide();
				$("#divSystemLine").hide();
			}else if ( $('[name="rd_search_ea"]:checked').val() == 'all' || $('[name="rd_search_ea"]:checked').val() == 'app' ){
				$("#divSystemLine").hide();
				$("#tb_unselected_searchSystem td:nth-child(2)").show();
				$("#tb_unselected_searchSystem th:nth-child(2)").show();
				if ( $('#selectedEquip').val() == '2' || $('#selectedEquip').val() == '11' || $('#selectedEquip').val() == '36'){
					$("#divSystemLine").show();
				}
			}else if ( $('[name="rd_search_ea"]:checked').val() == 'access' ){
				$("#tb_unselected_searchSystem td:nth-child(2)").show();
				$("#tb_unselected_searchSystem th:nth-child(2)").show();
				$("#divSystemLine").show();
			}
		}
	});
}

function targetSystemListSetting(){
	if(searchTargetSystemList.length > 0){
		$.each(searchTargetSystemList, function(i,row){
			var tbLen = $("#tb_selected_searchSystem tbody tr").length;
			var systemRow = '';
			systemRow += "<tr style='cursor:pointer;'>";
			systemRow += "	<td align='center'>";
			systemRow += "		<div class='mu-checkbox'>";
			systemRow += "			<input type='checkbox' id='chk_selected" + tbLen + "'>";
			systemRow += "			<label for='chk_selected" + tbLen + "'></label>";
			systemRow += "		</div>";
			systemRow += "	</td>";
			systemRow += "	<td align='center' title='" + row['LINE_NAME'] + "'>" + row['LINE_NAME'] + "</td>";
			systemRow += "	<td align='center' title='" + row['SYSTEM_ID'] + "'>" + row['SYSTEM_ID'];
			systemRow += "		<input type='hidden' name='equipType' value='" + row['EQUIP_TYPE'] + "' />";
			systemRow += "	</td>";
			systemRow += "	<td align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
			systemRow += "</tr>";
			
			$("#tb_selected_searchSystem").append(systemRow);
		});
	}
}

function addSearchSystemList(){
	var existed = false;
	$("#tb_unselected_searchSystem tbody tr input:checkbox:checked").each(function(i,e) { 
		var td = $(this).parent().parent().parent().find('td');
		var lineName = td.eq(1).text().trim();
		var systemId = td.eq(2).text().trim();
		var systemName = td.eq(3).text().trim();
		var equipType = td.eq(2).find('input[name="equipType"]').val();
		var flag = false;
		$("#tb_selected_searchSystem tbody tr").each(function(){ 
			if(!flag && systemId == $(this).find('td').eq(2).text().trim() 
					&& systemName == $(this).find('td').eq(3).text().trim()
					&& equipType == $(this).find('input[name="equipType"]').val()) {
				flag = true;
			}
		});
		
		if(!flag) {
			var tbLen = $("#tb_selected_searchSystem tbody tr").length;
			var systemRow = '';
			systemRow += "<tr style='cursor:pointer;'>";
			systemRow += "	<td align='center'>";
			systemRow += "		<div class='mu-checkbox'>";
			systemRow += "			<input type='checkbox' id='chk_selected" + tbLen + "'>";
			systemRow += "			<label for='chk_selected" + tbLen + "'></label>";
			systemRow += "		</div>";
			systemRow += "	</td>";
			systemRow += "	<td align='center' title='" + lineName + "'>" + lineName + "</td>";
			systemRow += "	<td align='center' title='" + systemId + "'>" + systemId;
			systemRow += "		<input type='hidden' name='equipType' value='" + equipType + "' />";
			systemRow += "	</td>";
			systemRow += "	<td align='center' title='" + systemName + "'>" + systemName + "</td>";
			systemRow += "</tr>";
			
			$("#tb_selected_searchSystem").append(systemRow);
			existed = true;
		}
	});
	
	if(!existed){
		alert("이미 추가된 장비입니다.");
	}
	
	$("#tb_selected_searchSystem tbody tr input:checkbox").bind('click',function(e) {
		var tbLen = $("#tb_selected_searchSystem tbody tr").length;
		var chkLen = $("#tb_selected_searchSystem tbody tr").find('input:checkbox:checked').length;
		if(tbLen != 0 && tbLen == chkLen) {
			$("#chk_selectHead").prop("checked",true);
		} else {
			$("#chk_selectHead").prop("checked",false);
		}
	});

	$("#chk_selectHead").prop("checked",false);
}

function deleteSearchSystemList(){
	$("#tb_selected_searchSystem tbody tr input:checkbox:checked").each(function(i,e) { 
		$(this).parent().parent().parent().remove();
	});
	
	var tbLen = $("#tb_selected_searchSystem tbody tr").length;
	var chkLen = $("#tb_selected_searchSystem tbody tr").find('input:checkbox:checked').length;
	if(tbLen != 0 && tbLen == chkLen) {
		$("#chk_selectHead").prop("checked",true);
	} else {
		$("#chk_selectHead").prop("checked",false);
	}
}

function saveSearchSystemList(){
	var systemNames = [];
	if($("#tb_selected_searchSystem tbody tr").length != 0){
		searchTargetSystemList = [];
		$("#tb_selected_searchSystem tbody tr").each(function(i,e) {
			var rowItem = {};
			rowItem['LINE_NAME'] = $(this).find('td').eq(1).text().trim();
			rowItem['SYSTEM_ID'] = $(this).find('td').eq(2).text().trim();
			rowItem['SYSTEM_NAME'] = $(this).find('td').eq(3).text().trim();
			rowItem['EQUIP_TYPE'] = $(this).find('input[name="equipType"]').val();
			searchTargetSystemList.push(rowItem);
			systemNames.push($(this).find('td').eq(3).text().trim());
		});
		
	} else {
		alert("추가된 장비가 없습니다.");
		return;
	}
	
	$("#target_system").val(systemNames.join(','));
	$("#target_system").prop("title", $("#target_system").val());
	$("#btn_searchSystem_cancel").click();
	
}

function changeSystemLine(){
	$("#selectedLine").val('')
	// 장비타입이 DU/정류기/스위치에만 호선셀렉트박스 표현
	if ( $('#selectedEquip').val() == '2' || $('#selectedEquip').val() == '11' || $('#selectedEquip').val() == '36'){
		$("#divSystemLine").show();
	}else{
		$("#divSystemLine").hide();
	}
}

function getLineName(value){
	var LINE_NAME =  '';
	if(value != undefined){
		if(value.includes(',')){
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




