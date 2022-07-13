var
	vendorData, equipData, equipVendorData, codeData,
	vendorAjax, equipAjax, equipVendorAjax, codeAjax;

$(document).ready(function(){
	
	/*var chk = '';
	$("#chk_bunchSetHead").on('click', function(e){
		if($("#chk_bunchSetHead").prop("checked")){
			chk='checked';
		} else {
			chk='';
		}
		$("#tb_bunchFailureSetting tbody tr td").each(function(){
			if($(this).find('input:checkbox').length > 0){
				$(this).find('input:checkbox').prop('checked',chk);
			}
		});
	});	*/

	/* 장비타입 리스트업 */
	// equipAjax = $.ajax({
	// 	type : 'post',
	// 	url : '/failure/setting/getEquipData',
	// 	dataType:'json',
	// 	success: function (data) {
	// 		if(data != null && data["equipData"].length > 0) {
	// 			equipData = data["equipData"];
	// 		}
	// 	}
	// });

	/* 제조사 리스트업 */
	// vendorAjax = $.ajax({
	// 	type : 'post',
	// 	url : '/failure/setting/getVendorData',
	// 	dataType:'json',
	// 	success: function (data) {
	// 		if(data != null && data["vendorData"].length > 0){
	// 			vendorData = data['vendorData'];
	// 		}
	// 	}
	// });

	equipVendorAjax = $.ajax({
		type : 'post',
		url : '/failure/setting/getEquipVendorData',
		dataType:'json',
		success: function (data) {
			if(data != null && data["equipVendorData"].length > 0){
				equipVendorData = data["equipVendorData"];
			}
		}
	});

	/* 알람코드 리스트업 */
	codeAjax = $.ajax({
		type : 'post',
		url : '/failure/setting/bunchFailureSetting/getAlarmCodeData',
		dataType:'json',
		success: function (data) {
			if(data != null && data["alarmCodeData"].length > 0) {
				codeData = data["alarmCodeData"];
			}
		}
	});

	Promise.all([equipVendorAjax, codeAjax]).then(function() {
		$("#equip_bunchCodeSetting").change(function(e) {
			vendorAndCodeSetting($(this).val());
		});

		$("#btn_settingBunchFailure_ok, #btn_settingBunchFailure_cancel").on('click',function(e){
			window.open("about:blank","_self").close();
		});

		getBunchSettingData();

		$("#add_bunchFailureSetting").on('click',function(e){
			addBunchFailure();
		});
		$("#edit_bunchFailureSetting").on('click',function(e){
			var checkedItem = $("#tb_bunchFailureSetting tbody tr td input:checked");
			if(checkedItem.length < 1){
				alert('수정할 항목을 선택해주세요');
				return false;
			} else if(checkedItem.length > 1){
				alert('한 개의 항목만 선택해주세요.');
				return false;
			} else {
				var checkedRow = $("#tb_bunchFailureSetting tbody tr td input:checked").parent().parent().parent();
				var tdList = checkedRow.find('td');
				var checkedObj = {};
				checkedObj['prev_equipType'] = checkedRow.find('input[name="equipType"]').val();
				checkedObj['prev_vendorId'] = checkedRow.find('input[name="vendorId"]').val();
				checkedObj['prev_alarmCode'] = tdList.eq(2).text();
				checkedObj['prev_bunchCode'] = tdList.eq(3).text();
				checkedObj['prev_severity'] = checkedRow.find('input[name="bunchLevel"]').val();
				checkedObj['prev_bunchCnt'] = tdList.eq(5).text();

				editBunchFailure(checkedObj);
			}

		});
		$("#del_bunchFailureSetting").on('click',function(e){
			var checkedItem = $("#tb_bunchFailureSetting tbody tr td input:checked");
			if(checkedItem.length < 1){
				alert('삭제할 다발고장을 선택해주세요.');
				return false;
			} else {
				var flag = false;
				if (confirm(checkedItem.length + "개의 다발고장을 정말 삭제하시겠습니까?") == true){    //확인
					flag = true;
				}else{   //취소
					falg = false;
					return;
				}

				if(flag){
					var delList = [];
					var checkedRow = $("#tb_bunchFailureSetting tbody tr td input:checked").parent().parent().parent();
					$.each(checkedRow,function(i,e){
						var tdList = $(e).find('td');
						var checkedObj = {};
						checkedObj['prev_equipType'] = $(e).find('input[name="equipType"]').val();
						checkedObj['prev_vendorId'] = $(e).find('input[name="vendorId"]').val();
						checkedObj['prev_alarmCode'] = tdList.eq(2).text();
						checkedObj['prev_bunchCode'] = tdList.eq(3).text();
						checkedObj['prev_severity'] = $(e).find('input[name="bunchLevel"]').val();
						checkedObj['prev_bunchCnt'] = tdList.eq(5).text();
						delList.push(checkedObj);
					});
					delBunchFailure(delList);
				}
			}
		});
	});
});

function getBunchSettingData(){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/bunchFailureSetting/getBunchFailureSettingData',
//		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
//		data : JSON.stringify({
//			   }),
		success: function (data) {
			$("#tb_bunchFailureSetting tbody tr").remove();
			if(data != null && data['bunchFailureSettingData'].length > 0){
				var bunchFailureSettingList = data['bunchFailureSettingData'];
				$.each(bunchFailureSettingList, function (i,row){
					var tbLen = $("#tb_bunchFailureSetting tbody tr").length;
					var severity = getDataConvert('NAME', 'SEVERITY', row['SEVERITY']);
					var searchRow = "";
					searchRow += "<tr style='cursor:pointer;'>";
					searchRow += 	"<td align='center'>";
					searchRow += 		"<div class='mu-checkbox'>";
					searchRow += 			"<input type='checkbox' id='chk_bunchSet" + tbLen + "'>";
					searchRow += 			"<label for='chk_bunchSet" + tbLen + "'></label>";
					searchRow += 		"</div>";
					searchRow += 	"</td>";
					searchRow += 	"<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
					searchRow += 		"<input type='hidden' name='equipType' value='" + row['EQUIP_TYPE'] + "' />";
					searchRow +=		"<input type='hidden' name='vendorId' value='" + row['VENDOR_ID'] + "' />";
					searchRow += 	"<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
					searchRow += 	"<td align='center' title='" + row['BUNCH_CODE'] + "'>" + row['BUNCH_CODE'] + "</td>";
					searchRow += 	"<td align='center' title='" + severity + "'>" + severity + "</td>";
					searchRow += 		"<input type='hidden' name='bunchLevel' value='" + row['SEVERITY'] + "' />";
					searchRow += 	"<td align='center' title='" + row['BUNCH_COUNT'] + "'>" + row['BUNCH_COUNT'] + "</td>";
					searchRow += "</tr>";
					
					$("#tb_bunchFailureSetting tbody").append(searchRow);
				});
				
				/*$("#tb_bunchFailureSetting tbody tr input:checkbox").bind('click',function(e) {
					var tbLen = $("#tb_bunchFailureSetting tbody tr").length;
					var chkLen = $("#tb_bunchFailureSetting tbody tr").find('input:checkbox:checked').length;
					if(tbLen != 0 && tbLen == chkLen) {
						$("#chk_bunchSetHead").prop("checked",true);
					} else {
						$("#chk_bunchSetHead").prop("checked",false);
					}
				});

				$("#chk_bunchSetHead").prop("checked",false);*/
			}
		}
	});
}

function initialBunchFailureForm(equipType){
	$("#bunchCode_bunchCodeSetting").val("");
	$("#bunchCnt_bunchCodeSetting").val("");


	// 장비타입 리스트업
	var equipSelect = $("#equip_bunchCodeSetting");
	var equipOpt = [];
	var equipVal = "";
	$.each(equipVendorData, function (i,row){
		equipOpt.push('<option value=' + row['EQUIP_TYPE'] + '>' + row['EQUIP_NAME'] + '</option>');
	});
	equipSelect.html(equipOpt.join(''));

	if(typeof equipType === "undefined") {
		equipVal = equipSelect.val();
	} else {
		equipVal = equipType;
	}

	vendorAndCodeSetting(equipVal);

	
	// /* 제조사 리스트업 */
	// $.ajax({
	// 	cache : false,
	// 	async : false,
	// 	type : 'post',
	// 	url : '/failure/setting/getVendorData',
	// 	dataType:'json',
	// 	success: function (data) {
	// 		if(data != null && data['vendorData'].length > 0){
	// 			var options = [];
	// 			$.each(data['vendorData'], function (i,row){
	// 				options.push('<option value=' + row['VENDOR_ID'] + '>' + row['VENDOR_NAME'] + '</option>');
	// 			});
	// 			$("#vendor_bunchCodeSetting").html(options.join(''));
	// 		}
	// 	}
	// });
	//
	// /* 장비타입 리스트업 */
	// $.ajax({
	// 	cache : false,
	// 	async : false,
	// 	type : 'post',
	// 	url : '/failure/setting/getEquipData',
	// 	dataType:'json',
	// 	success: function (data) {
	// 		if(data != null && data['equipData'].length > 0){
	// 			var options = [];
	// 			$.each(data['equipData'], function (i,row){
	// 				options.push('<option value=' + row['EQUIP_TYPE'] + '>' + row['EQUIP_NAME'] + '</option>');
	// 			});
	// 			$("#equip_bunchCodeSetting").html(options.join(''));
	// 		}
	// 	}
	// });
	//
	// /* 알람코드 리스트업 */
	// $.ajax({
	// 	cache : false,
	// 	async : false,
	// 	type : 'post',
	// 	url : '/failure/setting/bunchFailureSetting/getAlarmCodeData',
	// 	dataType:'json',
	// 	success: function (data) {
	// 		if(data != null && data['alarmCodeData'].length > 0){
	// 			var options = [];
	// 			$.each(data['alarmCodeData'], function (i,row){
	// 				options.push('<option value=' + row['ALARM_CODE'] + '>' + row['ALARM_CODE'] + '</option>');
	// 			});
	// 			$("#alarmCode_bunchCodeSetting").html(options.join(''));
	// 		}
	// 	}
	// });
}

function vendorAndCodeSetting(equipVal) {
	var
		vendorSelect = $("#vendor_bunchCodeSetting"),
		codeSelect = $("#alarmCode_bunchCodeSetting");

	vendorSelect.empty();
	codeSelect.empty();

	//장비 타입에 따른 제조사 리스트업
	var vendorOpt = [];
	$.each(equipVendorData, function (i,row){
		if(equipVal === row["EQUIP_TYPE"]) {
			vendorOpt.push('<option value=' + row['VENDOR_ID'] + '>' + row['VENDOR_NAME'] + '</option>');
		}
	});
	vendorSelect.html(vendorOpt.join(''));

	//장비 타입에 따른 알람코드 리스트업(노멀(S)은 언제나 제외)
	var codeOpt = [];
	$.each(codeData, function (i,row){
		if(equipVal === row["EQUIP_TYPE"] + "") {
			codeOpt.push('<option value=' + row['ALARM_CODE'] + '>' + row['ALARM_CODE'] + '</option>');
		}
	});
	codeSelect.html(codeOpt.join(''));
}

function leadingZeros(n, digits) {
	  var zero = '';
	  n = n.toString();

	  if (n.length < digits) {
		for (var i = 0; i < digits - n.length; i++)
		  zero += '0';
	  }
	  return zero + n;
}

function getBunchCodeMax(){
	$.ajax({
		cache : false,
		async : false,
		type : 'post',
		url : '/failure/setting/bunchFailureSetting/getBunchCodeMax',
		dataType:'json',
		success: function (data) {
			if(data != null){
				if(data['bunchCodeMax'] == null){ //테이블에 데이터가 없을 경우 'BCH00000' 으로 세팅
					var bunchCodeNext = leadingZeros(0, 5);
					$("#bunchCode_bunchCodeSetting").val("BCH"+bunchCodeNext);
				} else {
					var bunchCodeMax = parseInt(data['bunchCodeMax']);
					if(bunchCodeMax >= 99999){
						alert("다발코드는 최대 10만 건까지 입력 가능합니다.");
						window.location.reload();
					} else {
						var bunchCodeNext = leadingZeros(bunchCodeMax + 1, 5);
						$("#bunchCode_bunchCodeSetting").val("BCH"+bunchCodeNext);					
					}
				}
			} 
		}
	});
}

function addBunchFailure(){
	initialBunchFailureForm();
	getBunchCodeMax();
	
	openDialog('#dlg_addBunchFailure', function(fnCloseDlg){
		
		if($("#bunchCode_bunchCodeSetting").val() == "" || $("#bunchCnt_bunchCodeSetting").val() == ""){
			alert("입력 값을 모두 채워주세요.");
			return false;
		}
		
		var bunchCode = $("#bunchCode_bunchCodeSetting").val();
		var vendorId = $("#vendor_bunchCodeSetting").val();
		var equipType = $("#equip_bunchCodeSetting").val();
		var alarmCode = $("#alarmCode_bunchCodeSetting").val();
		var flag_bunchCode = true;
		var flag_alarmCode = true;
		$("#tb_bunchFailureSetting tbody tr").each(function(i,e){
			if(flag_bunchCode && bunchCode == $(e).find('td').eq(3).text()){
				flag_bunchCode = false;
			}
			if(vendorId == $(e).find('input[name="vendorId"]').val()
					&& equipType == $(e).find('input[name="equipType"]').val()
					&& alarmCode == $(e).find('td').eq(2).text()){
				flag_alarmCode = false;
			}
		});
		
		if(flag_bunchCode && flag_alarmCode){
			$.ajax({
				cache : false,
				type : 'post',
				url : '/failure/setting/bunchFailureSetting/addBunchFailure',
				contentType: 'application/json; charset=UTF-8',
				dataType:'json',
				data : JSON.stringify({
					'BUNCH_CODE': $("#bunchCode_bunchCodeSetting").val(),
					'SEVERITY': $("#grade_bunchCodeSetting").val(),
					'VENDOR_ID': $("#vendor_bunchCodeSetting").val(),
					'EQUIP_TYPE': $("#equip_bunchCodeSetting").val(),
					'ALARM_CODE': $("#alarmCode_bunchCodeSetting").val(),
					'BUNCH_COUNT': $("#bunchCnt_bunchCodeSetting").val(),
				}),
				success: function (data) {
					if(data != null && data['addBunchFailureResult'].length > 0){
						alert(data['addBunchFailureResult']);
					}
					getBunchSettingData();
				}
			});
			fnCloseDlg();
		} else if(!flag_bunchCode) {
			alert("동일한 다발코드가 존재하여 새로운 다발코드로 세팅합니다.");
			getBunchCodeMax();
		} else if(!flag_alarmCode){
			alert("이미 다발코드로 등록된 알람코드입니다.");
		}
	});
}

function editBunchFailure(checkedObj){
	initialBunchFailureForm(checkedObj['prev_equipType']);
	$("#bunchCode_bunchCodeSetting").val(checkedObj['prev_bunchCode']);
	$("#grade_bunchCodeSetting option[value=" + checkedObj['prev_severity'] + "]").prop('selected',true);
	$("#equip_bunchCodeSetting option[value=" + checkedObj['prev_equipType'] + "]").prop('selected',true);
	$("#vendor_bunchCodeSetting option[value=" + checkedObj['prev_vendorId'] + "]").prop('selected',true);
	$("#alarmCode_bunchCodeSetting option[value=" + checkedObj['prev_alarmCode'] + "]").prop('selected',true);
	$("#bunchCnt_bunchCodeSetting").val(checkedObj['prev_bunchCnt']);
	
	openDialog('#dlg_addBunchFailure', function(fnCloseDlg){
		
		if($("#bunchCode_bunchCodeSetting").val() == "" || $("#bunchCnt_bunchCodeSetting").val() == ""){
			alert("입력 값을 모두 채워주세요.");
			return false;
		}
		var bunchCode = $("#bunchCode_bunchCodeSetting").val();
		/*var flag = true;
		$("#tb_bunchFailureSetting tbody tr").each(function(i,e){
			if(bunchCode == $(e).find('td').eq(3).text()){
				flag = false;
				return false;
			}
		});*/
		
		/*if(flag){*/
			$.ajax({
				cache : false,
				type : 'post',
				url : '/failure/setting/bunchFailureSetting/editBunchFailure',
				contentType: 'application/json; charset=UTF-8',
				dataType:'json',
				data : JSON.stringify({
					'prev_bunchCode':checkedObj['prev_bunchCode'],
					'prev_severity': checkedObj['prev_severity'],
					'prev_vendorId': checkedObj['prev_vendorId'],
					'prev_equipType': checkedObj['prev_equipType'],
					'prev_alarmCode': checkedObj['prev_alarmCode'],
					'prev_bunchCnt': checkedObj['prev_bunchCnt'],	
					'BUNCH_CODE': $("#bunchCode_bunchCodeSetting").val(),
					'SEVERITY': $("#grade_bunchCodeSetting").val(),
					'VENDOR_ID': $("#vendor_bunchCodeSetting").val(),
					'EQUIP_TYPE': $("#equip_bunchCodeSetting").val(),
					'ALARM_CODE': $("#alarmCode_bunchCodeSetting").val(),
					'BUNCH_COUNT': $("#bunchCnt_bunchCodeSetting").val()
				}),
				success: function (data) {
					if(data != null && data['editBunchFailureResult'].length > 0){
						alert(data['editBunchFailureResult']);
					}
					getBunchSettingData();
				}
			});
			fnCloseDlg();
		/*} else {
			alert("동일한 다발코드가 존재합니다.");
		}*/
	});
}

function delBunchFailure(checkedList){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/bunchFailureSetting/delBunchFailure',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify(checkedList),
		success: function (data) {
			if(data != null && data['delBunchFailureResult'].length > 0){
				alert(data['delBunchFailureResult']);
			}
			getBunchSettingData();
		}
	});
}
