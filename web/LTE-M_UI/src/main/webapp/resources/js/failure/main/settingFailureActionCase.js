var equipAjax, systemAjax, equipData, systemData;

$(document).ready(function () {
	
	// 호선 셀렉트박스
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	$("#divSystemLine").hide();
	
	$('#headerTable').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTable');
		getActionCaseSettingData();
	});

	equipAjax = $.ajax({
		type: 'post',
		url: '/failure/setting/getEquipData',
		dataType: 'json',
		success: function (data) {
			equipData = data.equipData;
		}
	});

	systemAjax = $.ajax({
		type : 'post',
		url : '/failure/setting/failureActionCaseSetting/getSystemData',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
			equipType : $("#equipType-add").val()
		}),
		success: function (data) {
			systemData = data.systemData;
		}

	});

	
	$("#action-case-ok, #action-case-cancel").on('click',function(e){
		window.open("about:blank","_self").close();
	});
	
	$("#addCase").on('click',function(e){
		addFailureActionCase();
	});
	
	$("#modifyCase").on('click',function(e){
		var tbl = $("#tbodyTable");
		var checkList = $(":checkbox", tbl).filter(":checked").parent().parent().parent();

		if(checkList.length < 1){
			alert('수정할 조치사례을 선택해주세요.');
			return false;
		} else if(checkList.length > 1){
			alert('한 개의 항목만 선택해주세요.');
			return false;
		} else {
			var delList = [];
			var a;
			var checkedObj = {};

			$.each(checkList,function(i,v){
				a= v.querySelector("input");
				var alarmType = 4;
				if(/^A/.test(a.dataset.alarmcode)){
					alarmType = 1;
				} else if(/^F/.test(a.dataset.alarmcode)){
					alarmType = 2;
				} else if(/^S/.test(a.dataset.alarmcode)){
					alarmType = 3;
				} else {
					alarmType = 4;
				}
				console.log(a.dataset.actioncase);
				checkedObj = {
					'equipType' : a.dataset.equiptype,
					'systemId'  : a.dataset.systemid,
					'alarmCode' : a.dataset.alarmcode,
					'alarmGrade': a.dataset.alarmgrade,
					'actionCase': a.dataset.actioncase,
					'alarmType' : alarmType
				};
				delList.push(checkedObj);
			});
			modifyFailureActionCase(checkedObj);
		}
	});
	$("#removeCase").on('click',function(e){
		var tbl = $("#tbodyTable");
		var checkList = $(":checkbox", tbl).filter(":checked").parent().parent().parent();

		if(checkList.length < 1){
			alert('삭제할 조치사례을 선택해주세요.');
			return false;
		} else {
			if (confirm(checkList.length + "개의 조치사례을 정말 삭제하시겠습니까?")){    //확인
				var delList = [];
				var a;
				var checkedObj = {};

				$.each(checkList,function(i,v){
					a= v.querySelector("input");
					var alarmType = 4;
					if(/^A/.test(a.dataset.alarmcode)){
						alarmType = 1;
					} else if(/^F/.test(a.dataset.alarmcode)){
						alarmType = 2;
					} else if(/^S/.test(a.dataset.alarmcode)){
						alarmType = 3;
					} else {
						alarmType = 4;
					}
					checkedObj = {
						'prev_equipType' : a.dataset.equiptype,
						'prev_systemId'  : a.dataset.systemid,
						'prev_alarmCode' : a.dataset.alarmcode,
						'prev_alarmGrade': a.dataset.alarmgrade,
						'prev_actionCase' : a.dataset.actioncase,
						'prev_alarmType' : alarmType
					};
					delList.push(checkedObj);
				});
				delFailureActionCase(delList);
			}else{   //취소
			    return false;
			}
		}
	});
	
	$("#alarmCodeBtn").on('click',function(e){
		selectAlarmCode();
	});
	
	$("#equipType-add").on('change',function(){
		setSystemOption();
	});
	
	$("#selectedLine").on('change',function(){
		setSystemLineOption();
	});
	
	// $("#equip_failureActionCaseSettingSub").on('change',function(){
	// 	setAlarmCodeTable($(this).val());
	// 	$("#equip_failureActionCaseSetting").val($(this).val());
	// 	setSystemOption();
	// });

	Promise.all([equipAjax, systemAjax]).then(function() {
		getActionCaseSettingData();
	});

//	setEquipOption("equip_failureActionCaseSetting");
//	setSystemOption();
});

function initialFailureActionCase(){
	$("#alarmCode-add").val("");
	$("#actionCase-add").val("");
	setEquipOption("equipType-add");
//	setSystemOption();
}

function getActionCaseSettingData(){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/failureActionCaseSetting/getActionCaseSettingData',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({'sortOption': columnSorting.sortInfo}),
		success: function (data) {
			var tableGrid = $("#tbodyTable");
			tableGrid.find("tbody tr").remove();
			if(data != null && data['actionCaseSettingData'].length > 0){
				var bunchFailureSettingList = data['actionCaseSettingData'];
				var key = "check";
				var searchRow = "";
				$.each(bunchFailureSettingList, function (i,row){
//					key = row.EQUIP_TYPE + "_" + row.SYSTEM_ID + "_" + row.ALARM_CODE + "_" + row.ORG_SEVERITY;
					// var tbLen = $("#tb_failureActionCaseSetting tbody tr").length + 1;
					searchRow = "<tr>";
					searchRow +=
								"<td align='center'>" +
									"<div class='mu-checkbox'>"+
										"<input name='accountCheck' type='checkbox' id='" + key+i + "' data-equiptype='" + row.EQUIP_TYPE + "' data-systemid='" + row.SYSTEM_ID + "' data-alarmcode='" + row.ALARM_CODE + "' data-alarmgrade='" + row.GRADE_TXT + "' data-actioncase='" + encodeHTML(row.ACTION_CASE) + "'>"+
										"<label for='" + key+i + "'></label>" +
									"</div>"+
								"</td>";
					// searchRow += 	"<td class='overTxt' align='center' title='" + tbLen + "'>" + tbLen + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['LINE_NAME'] + "'>" + row['LINE_NAME'] + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['GRADE_TXT'] + "'>" + row['GRADE_TXT'] + "</td>";
					// searchRow += 		"<input type='hidden' name='equipType' value='" + row['EQUIP_TYPE'] + "' />";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['SYSTEM_ID'] + "'>" + row['SYSTEM_ID'] + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + encodeHTML(row['ACTION_CASE']) + "'>" + encodeHTML(row['ACTION_CASE']) + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['INSERT_DATE'] + "'>" + row['INSERT_DATE'] + "</td>";
					searchRow += 	"<td class='overTxt' align='center' title='" + row['INSERT_USER'] + "'>" + row['INSERT_USER'] + "</td>";
					searchRow += "</tr>";
					
					tableGrid.find("tbody").append(searchRow);

					checkBoxSet($("#headerTable"), $("#tbodyTable"));

// 					var lastLine = tableGrid.find("tbody tr").length;
// 					tableGrid.find("tbody tr").eq(lastLine-1).find('td').each(function(){
// 						$(this).on("click",function(e){
// 							if($(this).parent().prop("class")==""){
// //								$(this).parent().parent().find('tr').prop("class",""); //다중선택 안되도록 처리
// 								$(this).parent().prop("class","selected");
// 							} else if($(this).parent().prop("class")=="selected"){
// 								$(this).parent().prop("class","");
// 							}
// 						});
// 					});
				});
				
			}
		}
	});
}

function checkBoxSet(headerTbl, tbodyTbl) {
	// 테이블 헤더에 있는 checkbox 클릭시
	$(":checkbox:first", headerTbl).click(function(){
		// 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
		if( $(this).is(":checked") ){
			$(":checkbox", tbodyTbl).prop("checked", true);
		}
		else{
			$(":checkbox", tbodyTbl).prop("checked", false);
		}
		// 모든 체크박스에 change 이벤트 발생시키기
		$(":checkbox", tbodyTbl).trigger("change");
	});


	$(":checkbox", tbodyTbl).click(function(){
		var allCnt = $(":checkbox", tbodyTbl).length;
		var checkedCnt = $(":checkbox", tbodyTbl).filter(":checked").length;

		// 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
		if( allCnt==checkedCnt ){
			$(":checkbox:first", headerTbl).prop("checked", true);
		}
		else{
			$(":checkbox:first", headerTbl).prop("checked", false);
		}
	}).change(function(){
		if( $(this).is(":checked") ){
			// 체크박스의 부모 > 부모 니까 tr 이 되고 tr 에 selected 라는 class 를 추가한다.
		}
		else{
		}
	});
}

function setEquipOption(selectorId){
	$("#"+selectorId).html();

	var options = [];
	equipData.map(function(v, i) {
		options.push('<option value=' + v['EQUIP_TYPE'] + '>' + v['EQUIP_NAME'] + '</option>');
	});
	$("#"+selectorId).html(options.join(''));
	/* 장비타입 리스트업 */
	// $.ajax({
	// 	type : 'post',
	// 	url : '/failure/setting/getEquipData',
	// 	dataType:'json',
	// 	success: function (data) {
	// 		if(data != null && data['equipData'].length > 0){
	// 			var options = [];
	// 			$.each(data['equipData'], function (i,row){
	// 				options.push('<option value=' + row['EQUIP_TYPE'] + '>' + row['EQUIP_NAME'] + '</option>');
	// 			});
	// 			$("#"+selectorId).html(options.join(''));
	// 		}
	// 	}
	// });
}

function setSystemOption(sysId){
	$("#systemId-add").html();

	var options = [];
	var equipType = document.querySelector("#equipType-add").value;
	if ( equipType == '2' || equipType == '11' || equipType == '36' || equipType == '44'){
		$('#selectedLine').val('');
		$("#divSystemLine").show();
	}else{
		$('#selectedLine').val('');
		$("#divSystemLine").hide();
	}
	
	systemData.map(function(v, i) {
		if(v.EQUIP_TYPE === equipType) {
			options.push('<option value=' + v['SYSTEM_ID'] + '>' + v['SYSTEM_NAME'] + '</option>');
		}
	});
	// $.each(data['systemData'], function (i,row){
	// 	options.push('<option value=' + row['SYSTEM_ID'] + '>' + row['SYSTEM_NAME'] + '</option>');
	// });
	$("#systemId-add").html(options.join(''));

	if(sysId){
		$("#systemId-add option[value=" + sysId + "]").prop('selected',true);
	}
	
	// $.ajax({
	// 	type : 'post',
	// 	url : '/failure/setting/failureActionCaseSetting/getSystemData',
	// 	contentType: 'application/json; charset=UTF-8',
	// 	dataType:'json',
	// 	data : JSON.stringify({
	// 			equipType : $("#equipType-add").val()
	// 		   }),
	// 	success: function (data) {
	// 		if(data != null && data['systemData'].length > 0){
	// 			var options = [];
	// 			$.each(data['systemData'], function (i,row){
	// 				options.push('<option value=' + row['SYSTEM_ID'] + '>' + row['SYSTEM_NAME'] + '</option>');
	// 			});
	// 			$("#systemId-add").html(options.join(''));
	// 		}
	//
	// 		if(sysId){
	// 			$("#systemId-add option[value=" + sysId + "]").prop('selected',true);
	// 		}
	// 	}
	// });
}

function setSystemLineOption(sysId){
	$("#systemId-add").html();

	var options = [];
	var equipType = document.querySelector("#equipType-add").value;
	var lineId = document.querySelector("#selectedLine").value;
	if ( equipType == '2' || equipType == '11' || equipType == '36' || equipType == '44'){
		
	}
	
	systemData.map(function(v, i) {
		if(v.EQUIP_TYPE === equipType) {
			if(v.LINE_ID.includes(lineId)){
				options.push('<option value=' + v['SYSTEM_ID'] + '>' + v['SYSTEM_NAME'] + '</option>');
			}
		}
	});
	// $.each(data['systemData'], function (i,row){
	// 	options.push('<option value=' + row['SYSTEM_ID'] + '>' + row['SYSTEM_NAME'] + '</option>');
	// });
	$("#systemId-add").html(options.join(''));

	if(sysId){
		$("#systemId-add option[value=" + sysId + "]").prop('selected',true);
	}
	
	// $.ajax({
	// 	type : 'post',
	// 	url : '/failure/setting/failureActionCaseSetting/getSystemData',
	// 	contentType: 'application/json; charset=UTF-8',
	// 	dataType:'json',
	// 	data : JSON.stringify({
	// 			equipType : $("#equipType-add").val()
	// 		   }),
	// 	success: function (data) {
	// 		if(data != null && data['systemData'].length > 0){
	// 			var options = [];
	// 			$.each(data['systemData'], function (i,row){
	// 				options.push('<option value=' + row['SYSTEM_ID'] + '>' + row['SYSTEM_NAME'] + '</option>');
	// 			});
	// 			$("#systemId-add").html(options.join(''));
	// 		}
	//
	// 		if(sysId){
	// 			$("#systemId-add option[value=" + sysId + "]").prop('selected',true);
	// 		}
	// 	}
	// });
}




function setAlarmCodeTable(equipTypeVal){
	var alarmCodeTable = $("#alarmCode-table");
	alarmCodeTable.find("tbody tr").remove();
	// setEquipOption("equip_failureActionCaseSettingSub");
	// $("#equip_failureActionCaseSettingSub").val(equipTypeVal);
	
	/* 알람코드 리스트업 */
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/failureActionCaseSetting/getAlarmCodeTableData',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
			equipType : equipTypeVal
		   }),
		success: function (data) {
			if(data != null && data['alarmCodeTableData'].length > 0){
				$.each(data['alarmCodeTableData'], function (i,row){
					var tbLen = alarmCodeTable.find("tbody tr").length;
					var alarmCodeRow = "";
					alarmCodeRow += "<tr>";
					alarmCodeRow += 	"<td align='center'>";
					alarmCodeRow += 		"<div class='mu-radio'>";
					alarmCodeRow +=				"<input type='radio' id='rd_alarmCode" + tbLen + "' name='rd_alarmCode'>";
					alarmCodeRow += 			"<label for='rd_alarmCode" + tbLen + "'></label>";
					alarmCodeRow +=			"<div>";
					alarmCodeRow += 	"</td>";
					alarmCodeRow += 	"<td align='center' title='" + row['GRADE_TXT'] + "'>" + row['GRADE_TXT'] + "</td>";
					alarmCodeRow += 	"<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>"; 
					alarmCodeRow += 	"<td align='center' title='" + row['EQUIP_TYPE'] + "'>" + row['EQUIP_NAME'] + "</td>"; 
					alarmCodeRow += 	"<td align='left' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>"; 
					alarmCodeRow += "</tr>";

					alarmCodeTable.find("tbody").append(alarmCodeRow);
				});
			}
		}
	});
	
}

function addFailureActionCase(){
//	$("#alarmCode_failureActionCaseSetting").val("");
//	$("#actionCase_failureActionCaseSetting").val("");
	initialFailureActionCase();
	setSystemOption();
	/* 등록시에는 활성화 */
//	$("#equip_failureActionCaseSetting").prop("disabled",false);
//	$("#system_failureActionCaseSetting").prop("disabled",false);
//	$("#btn_alarmCode_failureActionCaseSetting").prop("disabled",false);
	
	openDialog('#dlg_addFailureActionCase', function(fnCloseDlg){
		var
			$alarmCode = $("#alarmCode-add"),
			$actionCase = $("#actionCase-add");
		if($alarmCode.val() == "" || $actionCase.val() == ""){
			alert("입력 값을 모두 채워주세요.");
			return false;
		}
		var equipType = $("#equipType-add").val();
		var systemId = $("#systemId-add").val();
		var alarmCode = $alarmCode.val();
		var actionCase = $actionCase.val();
		var alarmGrade = $("#alarmGrade-add").val();
		
		var alarmType = 4;
		if(/^A/.test(alarmCode)){
			alarmType = 1;
		} else if(/^F/.test(alarmCode)){
			alarmType = 2;
		} else if(/^S/.test(alarmCode)){
			alarmType = 3;
		} else {
			alarmType = 4;
		}
		
		var flag = true;
		$("#tbodyTable").find("tbody tr").each(function(i,e){
			var tdArr = $(e).find('td');
			if(alarmGrade == tdArr.eq(1).text() 
					&& equipType == $(e).find('input[name="equipType"]').val() 
					&& systemId == tdArr.eq(3).text() 
					&& alarmCode == tdArr.eq(4).text()){
				flag = false;
			}
		});

		if(flag){
			$.ajax({
				cache : false,
				type : 'post',
				url : '/failure/setting/failureActionCaseSetting/addFailureActionCase',
				contentType: 'application/json; charset=UTF-8',
				dataType:'json',
				data : JSON.stringify({
					'EQUIP_TYPE': equipType,
					'SYSTEM_ID': systemId,
					'ALARM_CODE': alarmCode,
					'ALARM_TYPE': alarmType,
					'ACTION_CASE': actionCase
				}),
				success: function (data) {
					if(data != null && data['addFailureActionCaseResult'].length > 0){
						alert(data['addFailureActionCaseResult']);
					}
					getActionCaseSettingData();
				}
			});
			fnCloseDlg();
		} else {
			alert("이미 등록한 알람코드입니다. 해당 알람코드를 수정하세요.");
		}
	});
}

function modifyFailureActionCase(checkedObj){
	// initialFailureActionCase();
	var equipName = equipData.filter(function(v, i) {
		if(v.EQUIP_TYPE + "" === checkedObj.equipType) {
			return true;
		}
	});
	var systemName = systemData.filter(function(v, i) {
		if(v.SYSTEM_ID + "" === checkedObj.systemId) {
			return true;
		}
	});

	document.querySelector("#equipType-modify").value = checkedObj.equipType;
	document.querySelector("#systemId-modify").value = checkedObj.systemId;
	document.querySelector("#equipName-modify").value = equipName[0].EQUIP_NAME;
	document.querySelector("#systemName-modify").value = systemName[0].SYSTEM_NAME;
	document.querySelector("#alarmCode-modify").value = checkedObj.alarmCode;
	document.querySelector("#alarmGrade-modify").value = checkedObj.alarmGrade;
	document.querySelector("#actionCase-modify").value = checkedObj.actionCase;

	openDialog('#dlg_modFailureActionCase', function(fnCloseDlg){
		// if($("#alarmCode_failureActionCaseSetting").val() == "" || $("#actionCase_failureActionCaseSetting").val() == ""){
		// 	alert("입력 값을 모두 채워주세요.");
		// 	return false;
		// }
		if(document.querySelector("#actionCase-modify").value === ""){
			alert("입력 값을 모두 채워주세요.");
			return false;
		}

		// var flag = true;
		// $("#tb_failureActionCaseSetting tbody tr").each(function(i,e){
		// 	var tdArr = $(e).find('td');
		// 	if(alarmGrade == tdArr.eq(1).text()
		// 		&& equipType == $(e).find('input[name="equipType"]').val()
		// 		&& systemId == tdArr.eq(3).text()
		// 		&& alarmCode == tdArr.eq(4).text()){
		//
		// 		if(alarmGrade != checkedObj['prev_alarmGrade']
		// 			|| equipType != checkedObj['prev_equipType']
		// 			|| systemId != checkedObj['prev_systemId']
		// 			|| alarmCode != checkedObj['prev_alarmCode']){
		// 			flag = false;
		// 		}
		// 	}
		// });

		// if(flag){
			$.ajax({
				type : 'post',
				url : '/failure/setting/failureActionCaseSetting/modifyFailureActionCase',
				contentType: 'application/json; charset=UTF-8',
				dataType:'json',
				data : JSON.stringify({
					'equipType': checkedObj.equipType,
					'systemId': checkedObj.systemId,
					'alarmCode': checkedObj.alarmCode,
					'alarmType': checkedObj.alarmType,
					'actionCase': document.querySelector("#actionCase-modify").value,
					'originActionCase' : checkedObj.actionCase

				}),
				success: function (data) {
					if(data != null && data['modifyFailureActionCaseResult'].length > 0){
						alert(data['modifyFailureActionCaseResult']);
					}
					getActionCaseSettingData();
				}
			});
			fnCloseDlg();
		/*} else {
			alert("이미 등록한 알람코드입니다. 해당 알람코드를 수정하세요.");
		}*/
	});
}

function delFailureActionCase(delList){
	$.ajax({
		type : 'post',
		url : '/failure/setting/failureActionCaseSetting/deleteFailureActionCase',
		contentType: 'application/json',
		dataType:'json',
		data : JSON.stringify(delList),
		success: function (data) {
			if(data != null && data['deleteFailureActionCaseResult'].length > 0){
				alert(data['deleteFailureActionCaseResult']);
				getActionCaseSettingData();
			}
		}
	});
}

function selectAlarmCode(){
	// 장비유형도 장애조치방법등록화면에서 설정된 장비타입으로 설정
	setAlarmCodeTable($("#equipType-add").val());
	openDialog('#dlg_selectAlarmCode', function(fnCloseDlg){
		var selectedRow = $(":radio[name='rd_alarmCode']:checked").parent().parent().parent().find("td");
		var selectedAlarmCode = selectedRow.eq(2).text();
		var selectedAlarmGrade = selectedRow.eq(1).text();
		$("#alarmCode-add").val(selectedAlarmCode);
		$("#alarmGrade-add").val(selectedAlarmGrade);
		fnCloseDlg();
	});
}

function excelExport() {
	var url =  "/failure/setting/failureActionCaseSetting/excelExport";
	$(location).attr('href', url);
}