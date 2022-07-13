$(document).ready(function(){
	
	var radioValue = 0;
	
	//라디오 버튼 변경
	$("input[name=search_radio]").change(function() {
		radioValue = $(this).val();
		searchRadioChange(radioValue);
	});
	
	$("#equipSelect").change(function() {
		kpiSetting($(this).val());
	});
	
	$("#kpiSelect").change(function() {
		kpiChange($("#kpiSelect option:selected").text());
	});
	
	$('#btn_threshold_close').click(function() {
		window.close();
	});
	
});


/*
 * 라디오 버튼 선택시 선택 박스들 변경
 * radioValue == 0 : access , value == 1 : epc
 */
function searchRadioChange(radioValue){
	if(radioValue == 0) {
		$('#newLine2').css('display', 'none');
		
		$('#equipDiv').css('display', 'none');
		$("#equipSelect").prop('disabled', true);
		$('#equipDiv').hasClass("disabled") ? '' : $('#equipDiv').addClass("disabled");
		
		$('#kpiDiv').css('display', 'none');
		$("#kpiSelect").prop('disabled', false);
		$('#kpiDiv').hasClass("disabled") ? $('#kpiDiv').removeClass("disabled") : '';
		$("#kpiSelect").val(1).attr("selected", "selected");
		
		$('#typeDiv').css('display', 'none');
		$("#typeSelect").prop('disabled', true);
		$('#typeDiv').hasClass("disabled") ? '' : $('#typeDiv').addClass("disabled");
		
		$('#mobileTypeDiv').css('display', 'none');
		$('#mobileTypeDiv').hasClass("disabled") ? '' : $('#mobileTypeDiv').addClass("disabled");
		$("#mobileTypeSelect").prop('disabled', true);
		
		$('#storageTypeDiv').css('display', 'none');
		$('#storageTypeDiv').addClass("disabled");
		$("#storageTypeSelect").prop('disabled', true);
		
		kpiSetting('0');
		
	} else if(radioValue == 1) {
		$('#newLine2').css('display', 'none');
		
		$('#equipDiv').css('display', 'inline-block');
		$("#equipSelect").prop('disabled', false);
		$('#equipDiv').hasClass("disabled") ? $('#equipDiv').removeClass("disabled") : '';
		$("#equipSelect").val(1).attr("selected", "selected");
		
		$('#kpiDiv').css('display', 'inline-block');
		$("#kpiSelect").prop('disabled', false);
		$('#kpiDiv').hasClass("disabled") ? $('#kpiDiv').removeClass("disabled") : '';
		$("#kpiSelect").val(1).attr("selected", "selected");
		
		kpiSetting('1');
		
		$('#typeDiv').css('display', 'none');
		$("#typeSelect").prop('disabled', true);
		$('#typeDiv').hasClass("disabled") ? '' : $('#typeDiv').addClass("disabled");
		
		$('#mobileTypeDiv').css('display', 'none');
		$('#mobileTypeDiv').hasClass("disabled") ? '' : $('#mobileTypeDiv').addClass("disabled");
		$("#mobileTypeSelect").prop('disabled', true);
		
		$('#storageTypeDiv').css('display', 'none');
		$('#storageTypeDiv').addClass("disabled");
		$("#storageTypeSelect").prop('disabled', true);
		
	} else if(radioValue == 2) {
		$('#newLine2').css('display', '');
		
		$('#equipDiv').css('display', 'none');
		$('#equipDiv').hasClass("disabled") ? '' : $('#equipDiv').addClass("disabled");
		$("#equipSelect").prop('disabled', true);
		
		$('#kpiDiv').css('display', 'none');
		$('#kpiDiv').hasClass("disabled") ? '' : $('#kpiDiv').addClass("disabled");
		$("#kpiSelect").prop('disabled', true);
		
		$('#typeDiv').css('display', 'none');
		$("#typeSelect").prop('disabled', true);
		$('#typeDiv').hasClass("disabled") ? '' : $('#typeDiv').addClass("disabled");
		
		$('#mobileTypeDiv').css('display', 'inline-block');
		$("#mobileTypeSelect").prop('disabled', false);
		$('#mobileTypeDiv').hasClass("disabled") ? $('#mobileTypeDiv').removeClass("disabled") : '';
		$("#mobileTypeSelect").val(99).attr("selected", "selected");
		
		$('#storageTypeDiv').css('display', 'none');
		$('#storageTypeDiv').addClass("disabled");
		$("#storageTypeSelect").prop('disabled', true);
		$("#mobileTypeSelect").trigger('change');
	} else if(radioValue == 3) {
		$('#newLine2').css('display', '');
		
		$('#equipDiv').css('display', 'none');
		$('#equipDiv').hasClass("disabled") ? '' : $('#equipDiv').addClass("disabled");
		$("#equipSelect").prop('disabled', true);
		
		$('#kpiDiv').css('display', 'none');
		$('#kpiDiv').hasClass("disabled") ? '' : $('#kpiDiv').addClass("disabled");
		$("#kpiSelect").prop('disabled', true);
		
		$('#typeDiv').css('display', 'none');
		$("#typeSelect").prop('disabled', true);
		$('#typeDiv').hasClass("disabled") ? '' : $('#typeDiv').addClass("disabled");
		
		$('#mobileTypeDiv').css('display', 'none');
		$('#mobileTypeDiv').hasClass("disabled") ? '' : $('#mobileTypeDiv').addClass("disabled");
		$("#mobileTypeSelect").prop('disabled', true);
		
		$('#storageTypeDiv').css('display', 'inline-block');
		$('#storageTypeDiv').removeClass("disabled");
		$("#storageTypeSelect").prop('disabled', false);

		$("#storageTypeSelect").trigger('change');
	}
}

// Kpi select box 설정
function kpiSetting(equipValue) {
	if(equipValue == '0') {
		$('#kpiSelect').empty();
		$('#kpiSelect').append(
			'<option value=1 slected="selected">Traffic</option>' +
			'<option value=2>Data Throughput</option>' +
			'<option value=3>Hand Over</option>'
		);
	} else if(equipValue != '0') {
		switch (equipValue) {
			case '1' : 
				$('#kpiSelect').empty();
				$('#kpiSelect').append(
					'<option value=1 selected = "selected">Attach</option>' +
					'<option value=2>SRMO</option>' +
					'<option value=3>SRMT</option>'
				);
				break;
			case '2' : 
				$('#kpiSelect').empty();
				$('#kpiSelect').append(
					'<option value=1 selected = "selected">Create</option>'+
					'<option value=2>Delete</option>'+
					'<option value=3>Modify</option>'
				);
				break;
			case '3' : 
				$('#kpiSelect').empty();
				$('#kpiSelect').append(
					'<option value=1 selected = "selected">Create</option>'+
					'<option value=2>Delete</option>'+
					'<option value=3>Modify</option>'
				);
				break;
			case '4' : 
				$('#kpiSelect').empty();
				$('#kpiSelect').append(
					'<option value=1 selected = "selected">S6A Interface</option>'+
					'<option value=2>Cx Interface</option>'
				);
				break;
			case '5' : 
				$('#kpiSelect').empty();
				$('#kpiSelect').append(
					'<option value=1 selected = "selected">GX</option>'+
					'<option value=2>RX</option>'
				);
				break;
		}
	}
	
	$("#kpiSelect").trigger('change');
}

function kpiChange(kpiName) {
	
	if(kpiName.match('Hand Over')) {
		typeSetting();
	} else {
		$('#typeDiv').css('display', 'none');
		$("#typeSelect").prop('disabled', true);
		$('#typeDiv').hasClass("disabled") ? '' : $('#typeDiv').addClass("disabled");
		
//		pageSearch();
	}
}

function typeSetting() {
	$('#typeDiv').css('display', 'inline-block');
	$("#typeSelect").prop('disabled', false);
	$('#typeDiv').hasClass("disabled") ? $('#typeDiv').removeClass("disabled") : '';
	
	$('#typeSelect').empty();
	$('#typeSelect').append(
		'<option value=1 selected = "selected">Intra ENB Handover</option>' +
		'<option value=2>X2 In Handover</option>' +
		'<option value=3>X2 Out Handover</option>'
	);
	
	$('#typeSelect').trigger('change');
}

function thresholdSearch(){
	
	var flag = $("input:radio[name=search_radio]:checked").val();
	var equip = $('#equipDiv').hasClass('disabled')?"":$('#equipSelect option:selected').val();
	var kpi = $('#kpiDiv').hasClass('disabled')?"":$('#kpiSelect option:selected').val();
	var type = $('#typeDiv').hasClass('disabled')?"":$('#typeSelect option:selected').val();
	if (flag == "3" ) type = '1';
	var mobileType = $('#mobileTypeDiv').hasClass('disabled')?"":$('#mobileTypeSelect option:selected').val();
	var storageType = $('#storageTypeDiv').hasClass('disabled')?"":$('#storageTypeSelect option:selected').val();
	
	// Traffic :  true, Hand Over : false
	var isTrarric = ($('input[name=search_radio]:checked').val() == '0' && $('#kpiSelect option:selected').val() == '1');
	
	var data = {
			equip : equip,
			kpi : kpi,
			type : type,
			weekday : '99',
			hourscope : '99',
			flag : flag,
			mobileType : mobileType,
			storageType : storageType
	}
	
	var requestData = JSON.stringify(data);
	
	$.ajax({
			type : 'post',
			url: '/pm/pm_setting/threshold_setting/getSearchData',
			contentType: 'application/json',
			dataTpye:'json',
			data : requestData,
			success: function (data) {
				$('#threshold_head').empty();
				$('#threshold_body').empty();

				var isfirst = true;
				var head = "";
				var body = "";
				var index = 1;
				var phone_type = '';
				var attemptTxt = '';
				var ansTxt = '';
				var succTxt = '';
				
				if(flag == 0 && kpi == 2) {
					attemptTxt = 'TOTAL VOLUMN(이상)';
				} else {
					attemptTxt = '시도호(이상)';
				}
				
				if(equip == 1) {
					/*succTxt = '접속율(이하)';*/
					ansTxt = '성공율(이하)';
				} else {
					succTxt = '성공율(이하)';
					ansTxt = '완료율(이하)';
				}
				
				$(data.thresholdSearchData).each(function(key,value){
					if(value.hasOwnProperty("PHONE_TYPE")) {
						if(value.PHONE_TYPE == 1)  phone_type = '차상단말';
						else if(value.PHONE_TYPE == 2) phone_type = '휴대용단말';
						else if(value.PHONE_TYPE == 3) phone_type = '모터카';
						else phone_type = '관제';
					}
					if(isfirst){
						
						head += "<tr>" +
									"<th rowspan='2'>" +
										"<div class='mu-checkbox' style='display:none;'>"+
											"<input type='checkbox' id='headcheck'>"+
											"<label for='headcheck'></label>" +
										"</div>"+
									"</th>" +
									(value.hasOwnProperty("PHONE_TYPE")?"<th rowspan='2' data-row='true' data-id='PHONE_TYPE'>단말종류</th>":"")+
									(value.hasOwnProperty("ATTEMPT") ? "<th rowspan='2' data-row='true' data-id='ATTEMPT'>시도호(이상)</th>" : "") +
									
									(value.hasOwnProperty("UP_ATTEMPT") ? "<th colspan='2' data-col='true' data-id='UP_ATTEMPT'>임계치 적용 제외</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_INCR") ? "<th colspan='3' data-col='true' data-id='UP_VOL_RATE_MIN_INCR'>Up Volume 증가율</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_INCR") ? "<th colspan='3' data-col='true' data-id='DW_VOL_RATE_MIN_INCR'>Down Volume 증가율</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_INCR") ? "<th colspan='3' data-col='true' data-id='UP_DTP_RATE_MIN_INCR'>Up Throughput 증가율</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_INCR") ? "<th colspan='3' data-col='true' data-id='DW_DTP_RATE_MIN_INCR'>Down Throughput 증가율</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_DECR") ? "<th colspan='3' data-col='true' data-id='UP_VOL_RATE_MIN_DECR'>Up Volume 감소율</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_DECR") ? "<th colspan='3' data-col='true' data-id='DW_VOL_RATE_MIN_DECR'>Down Volume 감소율</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_DECR") ? "<th colspan='3' data-col='true' data-id='UP_DTP_RATE_MIN_DECR'>Up Throughput 감소율</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_DECR") ? "<th colspan='3' data-col='true' data-id='DW_DTP_RATE_MIN_DECR'>Down Throughput 감소율</th>" : "") +
									
									(value.hasOwnProperty("ATT_RATE_MIN_INCR")?"<th colspan='3' data-col='true'>RRC 시도호증가율(이상)</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN")?"<th colspan='3' data-col='true'>시도호 증가율(이상)</th>":"") +

									(isTrarric && value.hasOwnProperty("ATT_RATE_MIN_DECR")?"<th colspan='3' data-col='true'>RRC 시도호 감소율(이하)</th>":"") +	// Traffic
									(!isTrarric && value.hasOwnProperty("ATT_RATE_MIN_DECR")?"<th colspan='3' data-col='true'>시도호 감소율(이하)</th>":"") +	// Hand Over
									
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_INCR")?"<th colspan='3' data-col='true'>ERAB Setup 시도호 증가율(이상)</th>":"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_DECR")?"<th colspan='3' data-col='true'>ERAB Setup 시도호 감소율(이하)</th>":"") +
									
									(value.hasOwnProperty("SEIZER_RATE_MIN")?"<th colspan='3' data-col='true'>소통율(이하)</th>":"") +
									(value.hasOwnProperty("SUCC_RATE_MIN")?"<th colspan='3' data-col='true'>" + succTxt + "</th>":"") +
									(value.hasOwnProperty("ANS_RATE_MIN")?"<th colspan='3' data-col='true'>" + ansTxt + "</th>":"") +
									(value.hasOwnProperty("CD_RATE_MIN")?"<th colspan='3' data-col='true'>절단율(이상)</th>":"") +
									(value.hasOwnProperty("UP_DTP_MIN")?"<th colspan='3' data-col='true'>UP Throughput(이하)</th>":"") +
									(value.hasOwnProperty("DW_DTP_MIN")?"<th colspan='3' data-col='true'>DOWN Throughput(이하)</th>":"") +
								"</tr>" +
								"<tr>" +
									(value.hasOwnProperty("ATT_RATE_CRI_INCR")?"<th data-second='true' data-id='ATT_RATE_CRI_INCR'>CRITICAL</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ_INCR")?"<th data-second='true' data-id='ATT_RATE_MAJ_INCR'>MAJOR</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN_INCR")?"<th data-second='true' data-id='ATT_RATE_MIN_INCR'>MINOR</th>":"") +
									
									(value.hasOwnProperty("ATT_RATE_CRI")?"<th data-second='true' data-id='ATT_RATE_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ")?"<th data-second='true' data-id='ATT_RATE_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN")?"<th data-second='true' data-id='ATT_RATE_MIN'>MINOR</th>":"") +
									
									(value.hasOwnProperty("ATT_RATE_CRI_DECR")?"<th data-second='true' data-id='ATT_RATE_CRI_DECR'>CRITICAL</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ_DECR")?"<th data-second='true' data-id='ATT_RATE_MAJ_DECR'>MAJOR</th>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN_DECR")?"<th data-second='true' data-id='ATT_RATE_MIN_DECR'>MINOR</th>":"") +
									
									(value.hasOwnProperty("ERAB_ATT_RATE_CRI_INCR")?"<th data-second='true' data-id='ERAB_ATT_RATE_CRI_INCR'>CRITICAL</th>":"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MAJ_INCR")?"<th data-second='true' data-id='ERAB_ATT_RATE_MAJ_INCR'>MAJOR</th>":"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_INCR")?"<th data-second='true' data-id='ERAB_ATT_RATE_MIN_INCR'>MINOR</th>":"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_CRI_DECR")?"<th data-second='true' data-id='ERAB_ATT_RATE_CRI_DECR'>CRITICAL</th>":"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MAJ_DECR")?"<th data-second='true' data-id='ERAB_ATT_RATE_MAJ_DECR'>MAJOR</th>":"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_DECR")?"<th data-second='true' data-id='ERAB_ATT_RATE_MIN_DECR'>MINOR</th>":"") +
									
									(value.hasOwnProperty("UP_ATTEMPT") ? "<th data-second='true' data-id='UP_ATTEMPT'>Up Volume</th>" : "") +
									(value.hasOwnProperty("DW_ATTEMPT") ? "<th data-second='true' data-id='DW_ATTEMPT'>Down Volume</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_CRI_INCR") ? "<th data-second='true' data-id='UP_VOL_RATE_CRI_INCR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MAJ_INCR") ? "<th data-second='true' data-id='UP_VOL_RATE_MAJ_INCR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_INCR") ? "<th data-second='true' data-id='UP_VOL_RATE_MIN_INCR'>MINOR</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_CRI_INCR") ? "<th data-second='true' data-id='DW_VOL_RATE_CRI_INCR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MAJ_INCR") ? "<th data-second='true' data-id='DW_VOL_RATE_MAJ_INCR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_INCR") ? "<th data-second='true' data-id='DW_VOL_RATE_MIN_INCR'>MINOR</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_CRI_INCR") ? "<th data-second='true' data-id='UP_DTP_RATE_CRI_INCR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MAJ_INCR") ? "<th data-second='true' data-id='UP_DTP_RATE_MAJ_INCR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_INCR") ? "<th data-second='true' data-id='UP_DTP_RATE_MIN_INCR'>MINOR</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_CRI_INCR") ? "<th data-second='true' data-id='DW_DTP_RATE_CRI_INCR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MAJ_INCR") ? "<th data-second='true' data-id='DW_DTP_RATE_MAJ_INCR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_INCR") ? "<th data-second='true' data-id='DW_DTP_RATE_MIN_INCR'>MINOR</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_CRI_DECR") ? "<th data-second='true' data-id='UP_VOL_RATE_CRI_DECR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MAJ_DECR") ? "<th data-second='true' data-id='UP_VOL_RATE_MAJ_DECR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_DECR") ? "<th data-second='true' data-id='UP_VOL_RATE_MIN_DECR'>MINOR</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_CRI_DECR") ? "<th data-second='true' data-id='DW_VOL_RATE_CRI_DECR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MAJ_DECR") ? "<th data-second='true' data-id='DW_VOL_RATE_MAJ_DECR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_DECR") ? "<th data-second='true' data-id='DW_VOL_RATE_MIN_DECR'>MINOR</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_CRI_DECR") ? "<th data-second='true' data-id='UP_DTP_RATE_CRI_DECR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MAJ_DECR") ? "<th data-second='true' data-id='UP_DTP_RATE_MAJ_DECR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_DECR") ? "<th data-second='true' data-id='UP_DTP_RATE_MIN_DECR'>MINOR</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_CRI_DECR") ? "<th data-second='true' data-id='DW_DTP_RATE_CRI_DECR'>CRITICAL</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MAJ_DECR") ? "<th data-second='true' data-id='DW_DTP_RATE_MAJ_DECR'>MAJOR</th>" : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_DECR") ? "<th data-second='true' data-id='DW_DTP_RATE_MIN_DECR'>MINOR</th>" : "") +
									
									(value.hasOwnProperty("SEIZER_RATE_CRI")?"<th data-second='true' data-id='SEIZER_RATE_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("SEIZER_RATE_MAJ")?"<th data-second='true' data-id='SEIZER_RATE_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("SEIZER_RATE_MIN")?"<th data-second='true' data-id='SEIZER_RATE_MIN'>MINOR</th>":"") +
									(value.hasOwnProperty("SUCC_RATE_CRI")?"<th data-second='true' data-id='SUCC_RATE_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("SUCC_RATE_MAJ")?"<th data-second='true' data-id='SUCC_RATE_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("SUCC_RATE_MIN")?"<th data-second='true' data-id='SUCC_RATE_MIN'>MINOR</th>":"") +
									(value.hasOwnProperty("ANS_RATE_CRI")?"<th data-second='true' data-id='ANS_RATE_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("ANS_RATE_MAJ")?"<th data-second='true' data-id='ANS_RATE_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("ANS_RATE_MIN")?"<th data-second='true' data-id='ANS_RATE_MIN'>MINOR</th>":"") +
									(value.hasOwnProperty("CD_RATE_CRI")?"<th data-second='true' data-id='CD_RATE_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("CD_RATE_MAJ")?"<th data-second='true' data-id='CD_RATE_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("CD_RATE_MIN")?"<th data-second='true' data-id='CD_RATE_MIN'>MINOR</th>":"") +
									(value.hasOwnProperty("UP_DTP_CRI")?"<th data-second='true' data-id='UP_DTP_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("UP_DTP_MAJ")?"<th data-second='true' data-id='UP_DTP_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("UP_DTP_MIN")?"<th data-second='true' data-id='UP_DTP_MIN'>MINOR</th>":"") +
									(value.hasOwnProperty("DW_DTP_CRI")?"<th data-second='true' data-id='DW_DTP_CRI'>CRITICAL</th>":"") +
									(value.hasOwnProperty("DW_DTP_MAJ")?"<th data-second='true' data-id='DW_DTP_MAJ'>MAJOR</th>":"") +
									(value.hasOwnProperty("DW_DTP_MIN")?"<th data-second='true' data-id='DW_DTP_MIN'>MINOR</th>":"") +
								"</tr>"
						
						body += "<tr>" +
									"<td>" +
									"<div class='mu-checkbox'>"+
										"<input type='checkbox' id='body"+index+"'>"+
										"<label for='body"+index+"'></label>" +
									"</div>"+
									"</td>" +
									(value.hasOwnProperty("PHONE_TYPE")?"<td data-id='"+value.PHONE_TYPE+"'>"+phone_type+"</td>":"")+
									(value.hasOwnProperty("ATTEMPT") ? "<td data-id='"+value.ATTEMPT+"'>"+value.ATTEMPT+"</td>" : "")+
									(value.hasOwnProperty("ATT_RATE_CRI_INCR")?"<td data-id='"+value.ATT_RATE_CRI_INCR+"'>"+value.ATT_RATE_CRI_INCR+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ_INCR")?"<td data-id='"+value.ATT_RATE_MAJ_INCR+"'>"+value.ATT_RATE_MAJ_INCR+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN_INCR")?"<td data-id='"+value.ATT_RATE_MIN_INCR+"'>"+value.ATT_RATE_MIN_INCR+"</td>":"") +
									
									(value.hasOwnProperty("ATT_RATE_CRI")?"<td data-id='"+value.ATT_RATE_CRI+"'>"+value.ATT_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ")?"<td data-id='"+value.ATT_RATE_MAJ+"'>"+value.ATT_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN")?"<td data-id='"+value.ATT_RATE_MIN+"'>"+value.ATT_RATE_MIN+"</td>":"") +
									
									(value.hasOwnProperty("ATT_RATE_CRI_DECR")? ("<td data-id='"+value.ATT_RATE_CRI_DECR+"'>"+value.ATT_RATE_CRI_DECR+"</td>") :"") +
									(value.hasOwnProperty("ATT_RATE_MAJ_DECR")? ("<td data-id='"+value.ATT_RATE_MAJ_DECR+"'>"+value.ATT_RATE_MAJ_DECR+"</td>") :"") +
									(value.hasOwnProperty("ATT_RATE_MIN_DECR")? ("<td data-id='"+value.ATT_RATE_MIN_DECR+"'>"+value.ATT_RATE_MIN_DECR+"</td>") :"") +
									
									(value.hasOwnProperty("ERAB_ATT_RATE_CRI_INCR")? ("<td data-id='"+value.ERAB_ATT_RATE_CRI_INCR+"'>"+value.ERAB_ATT_RATE_CRI_INCR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MAJ_INCR")? ("<td data-id='"+value.ERAB_ATT_RATE_MAJ_INCR+"'>"+value.ERAB_ATT_RATE_MAJ_INCR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_INCR")? ("<td data-id='"+value.ERAB_ATT_RATE_MIN_INCR+"'>"+value.ERAB_ATT_RATE_MIN_INCR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_CRI_DECR")? ("<td data-id='"+value.ERAB_ATT_RATE_CRI_DECR+"'>"+value.ERAB_ATT_RATE_CRI_DECR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MAJ_DECR")? ("<td data-id='"+value.ERAB_ATT_RATE_MAJ_DECR+"'>"+value.ERAB_ATT_RATE_MAJ_DECR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_DECR")? ("<td data-id='"+value.ERAB_ATT_RATE_MIN_DECR+"'>"+value.ERAB_ATT_RATE_MIN_DECR+"</td>") :"") +
									
									(value.hasOwnProperty("UP_ATTEMPT") ? ("<td data-id='"+value.UP_ATTEMPT+"'>"+value.UP_ATTEMPT+"</td>") : "") +
									(value.hasOwnProperty("DW_ATTEMPT") ? ("<td data-id='"+value.DW_ATTEMPT+"'>"+value.DW_ATTEMPT+"</td>")  : "") +
									(value.hasOwnProperty("UP_VOL_RATE_CRI_INCR") ? ("<td data-id='"+value.UP_VOL_RATE_CRI_INCR+"'>"+value.UP_VOL_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MAJ_INCR") ? ("<td data-id='"+value.UP_VOL_RATE_MAJ_INCR+"'>"+value.UP_VOL_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_INCR") ? ("<td data-id='"+value.UP_VOL_RATE_MIN_INCR+"'>"+value.UP_VOL_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_CRI_INCR") ? ("<td data-id='"+value.DW_VOL_RATE_CRI_INCR+"'>"+value.DW_VOL_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MAJ_INCR") ? ("<td data-id='"+value.DW_VOL_RATE_MAJ_INCR+"'>"+value.DW_VOL_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_INCR") ? ("<td data-id='"+value.DW_VOL_RATE_MIN_INCR+"'>"+value.DW_VOL_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_CRI_INCR") ? ("<td data-id='"+value.UP_DTP_RATE_CRI_INCR+"'>"+value.UP_DTP_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MAJ_INCR") ? ("<td data-id='"+value.UP_DTP_RATE_MAJ_INCR+"'>"+value.UP_DTP_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_INCR") ? ("<td data-id='"+value.UP_DTP_RATE_MIN_INCR+"'>"+value.UP_DTP_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_CRI_INCR") ? ("<td data-id='"+value.DW_DTP_RATE_CRI_INCR+"'>"+value.DW_DTP_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MAJ_INCR") ? ("<td data-id='"+value.DW_DTP_RATE_MAJ_INCR+"'>"+value.DW_DTP_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_INCR") ? ("<td data-id='"+value.DW_DTP_RATE_MIN_INCR+"'>"+value.DW_DTP_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_CRI_DECR") ? ("<td data-id='"+value.UP_VOL_RATE_CRI_DECR+"'>"+value.UP_VOL_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MAJ_DECR") ? ("<td data-id='"+value.UP_VOL_RATE_MAJ_DECR+"'>"+value.UP_VOL_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_DECR") ? ("<td data-id='"+value.UP_VOL_RATE_MIN_DECR+"'>"+value.UP_VOL_RATE_MIN_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_CRI_DECR") ? ("<td data-id='"+value.DW_VOL_RATE_CRI_DECR+"'>"+value.DW_VOL_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MAJ_DECR") ? ("<td data-id='"+value.DW_VOL_RATE_MAJ_DECR+"'>"+value.DW_VOL_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_DECR") ? ("<td data-id='"+value.DW_VOL_RATE_MIN_DECR+"'>"+value.DW_VOL_RATE_MIN_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_CRI_DECR") ? ("<td data-id='"+value.UP_DTP_RATE_CRI_DECR+"'>"+value.UP_DTP_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MAJ_DECR") ? ("<td data-id='"+value.UP_DTP_RATE_MAJ_DECR+"'>"+value.UP_DTP_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_DECR") ? ("<td data-id='"+value.UP_DTP_RATE_MIN_DECR+"'>"+value.UP_DTP_RATE_MIN_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_CRI_DECR") ? ("<td data-id='"+value.DW_DTP_RATE_CRI_DECR+"'>"+value.DW_DTP_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MAJ_DECR") ? ("<td data-id='"+value.DW_DTP_RATE_MAJ_DECR+"'>"+value.DW_DTP_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_DECR") ? ("<td data-id='"+value.DW_DTP_RATE_MIN_DECR+"'>"+value.DW_DTP_RATE_MIN_DECR+"</td>") : "") +
									
									(value.hasOwnProperty("SEIZER_RATE_CRI")?"<td data-id='"+value.SEIZER_RATE_CRI+"'>"+value.SEIZER_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("SEIZER_RATE_MAJ")?"<td data-id='"+value.SEIZER_RATE_MAJ+"'>"+value.SEIZER_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("SEIZER_RATE_MIN")?"<td data-id='"+value.SEIZER_RATE_MIN+"'>"+value.SEIZER_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("SUCC_RATE_CRI")?"<td data-id='"+value.SUCC_RATE_CRI+"'>"+value.SUCC_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("SUCC_RATE_MAJ")?"<td data-id='"+value.SUCC_RATE_MAJ+"'>"+value.SUCC_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("SUCC_RATE_MIN")?"<td data-id='"+value.SUCC_RATE_MIN+"'>"+value.SUCC_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("ANS_RATE_CRI")?"<td data-id='"+value.ANS_RATE_CRI+"'>"+value.ANS_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("ANS_RATE_MAJ")?"<td data-id='"+value.ANS_RATE_MAJ+"'>"+value.ANS_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("ANS_RATE_MIN")?"<td data-id='"+value.ANS_RATE_MIN+"'>"+value.ANS_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("CD_RATE_CRI")?"<td data-id='"+value.CD_RATE_CRI+"'>"+value.CD_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("CD_RATE_MAJ")?"<td data-id='"+value.CD_RATE_MAJ+"'>"+value.CD_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("CD_RATE_MIN")?"<td data-id='"+value.CD_RATE_MIN+"'>"+value.CD_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("UP_DTP_CRI")?"<td data-id='"+value.UP_DTP_CRI+"'>"+value.UP_DTP_CRI+"</td>":"") +
									(value.hasOwnProperty("UP_DTP_MAJ")?"<td data-id='"+value.UP_DTP_MAJ+"'>"+value.UP_DTP_MAJ+"</td>":"") +
									(value.hasOwnProperty("UP_DTP_MIN")?"<td data-id='"+value.UP_DTP_MIN+"'>"+value.UP_DTP_MIN+"</td>":"") +
									(value.hasOwnProperty("DW_DTP_CRI")?"<td data-id='"+value.DW_DTP_CRI+"'>"+value.DW_DTP_CRI+"</td>":"") +
									(value.hasOwnProperty("DW_DTP_MAJ")?"<td data-id='"+value.DW_DTP_MAJ+"'>"+value.DW_DTP_MAJ+"</td>":"") +
									(value.hasOwnProperty("DW_DTP_MIN")?"<td data-id='"+value.DW_DTP_MIN+"'>"+value.DW_DTP_MIN+"</td>":"") +
								"</tr>";
						index++;
						$('#threshold_head').append(head);
						isfirst = false;
					}else{
						body += "<tr>" +
									"<td>" +
									"<div class='mu-checkbox'>"+
										"<input type='checkbox' id='body"+index+"'>"+
										"<label for='body"+index+"'></label>" +
									"</div>"+
									"</td>" +
									(value.hasOwnProperty("PHONE_TYPE")?"<td data-id='"+value.PHONE_TYPE+"'>"+phone_type+"</td>":"")+
									"<td data-id='"+value.ATTEMPT+"'>"+value.ATTEMPT+"</td>" +
									(value.hasOwnProperty("ATT_RATE_CRI_INCR")?"<td data-id='"+value.ATT_RATE_CRI_INCR+"'>"+value.ATT_RATE_CRI_INCR+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ_INCR")?"<td data-id='"+value.ATT_RATE_MAJ_INCR+"'>"+value.ATT_RATE_MAJ_INCR+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN_INCR")?"<td data-id='"+value.ATT_RATE_MIN_INCR+"'>"+value.ATT_RATE_MIN_INCR+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_CRI")?"<td data-id='"+value.ATT_RATE_CRI+"'>"+value.ATT_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MAJ")?"<td data-id='"+value.ATT_RATE_MAJ+"'>"+value.ATT_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("ATT_RATE_MIN")?"<td data-id='"+value.ATT_RATE_MIN+"'>"+value.ATT_RATE_MIN+"</td>":"") +
									
									(value.hasOwnProperty("ATT_RATE_CRI_DECR")? ("<td data-id='"+value.ATT_RATE_CRI_DECR+"'>"+value.ATT_RATE_CRI_DECR+"</td>") :"") +
									(value.hasOwnProperty("ATT_RATE_MAJ_DECR")? ("<td data-id='"+value.ATT_RATE_MAJ_DECR+"'>"+value.ATT_RATE_MAJ_DECR+"</td>") :"") +
									(value.hasOwnProperty("ATT_RATE_MIN_DECR")? ("<td data-id='"+value.ATT_RATE_MIN_DECR+"'>"+value.ATT_RATE_MIN_DECR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_CRI_INCR")? ("<td data-id='"+value.ERAB_ATT_RATE_CRI_INCR+"'>"+value.ERAB_ATT_RATE_CRI_INCR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MAJ_INCR")? ("<td data-id='"+value.ERAB_ATT_RATE_MAJ_INCR+"'>"+value.ERAB_ATT_RATE_MAJ_INCR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_INCR")? ("<td data-id='"+value.ERAB_ATT_RATE_MIN_INCR+"'>"+value.ERAB_ATT_RATE_MIN_INCR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_CRI_DECR")? ("<td data-id='"+value.ERAB_ATT_RATE_CRI_DECR+"'>"+value.ERAB_ATT_RATE_CRI_DECR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MAJ_DECR")? ("<td data-id='"+value.ERAB_ATT_RATE_MAJ_DECR+"'>"+value.ERAB_ATT_RATE_MAJ_DECR+"</td>") :"") +
									(value.hasOwnProperty("ERAB_ATT_RATE_MIN_DECR")? ("<td data-id='"+value.ERAB_ATT_RATE_MIN_DECR+"'>"+value.ERAB_ATT_RATE_MIN_DECR+"</td>") :"") +
									
									(value.hasOwnProperty("UP_ATTEMPT") ? ("<td data-id='"+value.UP_ATTEMPT+"'>"+value.UP_ATTEMPT+"</td>") : "") +
									(value.hasOwnProperty("DW_ATTEMPT") ? ("<td data-id='"+value.DW_ATTEMPT+"'>"+value.DW_ATTEMPT+"</td>")  : "") +
									(value.hasOwnProperty("UP_VOL_RATE_CRI_INCR") ? ("<td data-id='"+value.UP_VOL_RATE_CRI_INCR+"'>"+value.UP_VOL_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MAJ_INCR") ? ("<td data-id='"+value.UP_VOL_RATE_MAJ_INCR+"'>"+value.UP_VOL_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_INCR") ? ("<td data-id='"+value.UP_VOL_RATE_MIN_INCR+"'>"+value.UP_VOL_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_CRI_INCR") ? ("<td data-id='"+value.DW_VOL_RATE_CRI_INCR+"'>"+value.DW_VOL_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MAJ_INCR") ? ("<td data-id='"+value.DW_VOL_RATE_MAJ_INCR+"'>"+value.DW_VOL_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_INCR") ? ("<td data-id='"+value.DW_VOL_RATE_MIN_INCR+"'>"+value.DW_VOL_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_CRI_INCR") ? ("<td data-id='"+value.UP_DTP_RATE_CRI_INCR+"'>"+value.UP_DTP_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MAJ_INCR") ? ("<td data-id='"+value.UP_DTP_RATE_MAJ_INCR+"'>"+value.UP_DTP_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_INCR") ? ("<td data-id='"+value.UP_DTP_RATE_MIN_INCR+"'>"+value.UP_DTP_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_CRI_INCR") ? ("<td data-id='"+value.DW_DTP_RATE_CRI_INCR+"'>"+value.DW_DTP_RATE_CRI_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MAJ_INCR") ? ("<td data-id='"+value.DW_DTP_RATE_MAJ_INCR+"'>"+value.DW_DTP_RATE_MAJ_INCR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_INCR") ? ("<td data-id='"+value.DW_DTP_RATE_MIN_INCR+"'>"+value.DW_DTP_RATE_MIN_INCR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_CRI_DECR") ? ("<td data-id='"+value.UP_VOL_RATE_CRI_DECR+"'>"+value.UP_VOL_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MAJ_DECR") ? ("<td data-id='"+value.UP_VOL_RATE_MAJ_DECR+"'>"+value.UP_VOL_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_VOL_RATE_MIN_DECR") ? ("<td data-id='"+value.UP_VOL_RATE_MIN_DECR+"'>"+value.UP_VOL_RATE_MIN_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_CRI_DECR") ? ("<td data-id='"+value.DW_VOL_RATE_CRI_DECR+"'>"+value.DW_VOL_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MAJ_DECR") ? ("<td data-id='"+value.DW_VOL_RATE_MAJ_DECR+"'>"+value.DW_VOL_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_VOL_RATE_MIN_DECR") ? ("<td data-id='"+value.DW_VOL_RATE_MIN_DECR+"'>"+value.DW_VOL_RATE_MIN_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_CRI_DECR") ? ("<td data-id='"+value.UP_DTP_RATE_CRI_DECR+"'>"+value.UP_DTP_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MAJ_DECR") ? ("<td data-id='"+value.UP_DTP_RATE_MAJ_DECR+"'>"+value.UP_DTP_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("UP_DTP_RATE_MIN_DECR") ? ("<td data-id='"+value.UP_DTP_RATE_MIN_DECR+"'>"+value.UP_DTP_RATE_MIN_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_CRI_DECR") ? ("<td data-id='"+value.DW_DTP_RATE_CRI_DECR+"'>"+value.DW_DTP_RATE_CRI_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MAJ_DECR") ? ("<td data-id='"+value.DW_DTP_RATE_MAJ_DECR+"'>"+value.DW_DTP_RATE_MAJ_DECR+"</td>") : "") +
									(value.hasOwnProperty("DW_DTP_RATE_MIN_DECR") ? ("<td data-id='"+value.DW_DTP_RATE_MIN_DECR+"'>"+value.DW_DTP_RATE_MIN_DECR+"</td>") : "") +
									
									(value.hasOwnProperty("SEIZER_RATE_CRI")?"<td data-id='"+value.SEIZER_RATE_CRI+"'>"+value.SEIZER_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("SEIZER_RATE_MAJ")?"<td data-id='"+value.SEIZER_RATE_MAJ+"'>"+value.SEIZER_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("SEIZER_RATE_MIN")?"<td data-id='"+value.SEIZER_RATE_MIN+"'>"+value.SEIZER_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("SUCC_RATE_CRI")?"<td data-id='"+value.SUCC_RATE_CRI+"'>"+value.SUCC_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("SUCC_RATE_MAJ")?"<td data-id='"+value.SUCC_RATE_MAJ+"'>"+value.SUCC_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("SUCC_RATE_MIN")?"<td data-id='"+value.SUCC_RATE_MIN+"'>"+value.SUCC_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("ANS_RATE_CRI")?"<td data-id='"+value.ANS_RATE_CRI+"'>"+value.ANS_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("ANS_RATE_MAJ")?"<td data-id='"+value.ANS_RATE_MAJ+"'>"+value.ANS_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("ANS_RATE_MIN")?"<td data-id='"+value.ANS_RATE_MIN+"'>"+value.ANS_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("CD_RATE_CRI")?"<td data-id='"+value.CD_RATE_CRI+"'>"+value.CD_RATE_CRI+"</td>":"") +
									(value.hasOwnProperty("CD_RATE_MAJ")?"<td data-id='"+value.CD_RATE_MAJ+"'>"+value.CD_RATE_MAJ+"</td>":"") +
									(value.hasOwnProperty("CD_RATE_MIN")?"<td data-id='"+value.CD_RATE_MIN+"'>"+value.CD_RATE_MIN+"</td>":"") +
									(value.hasOwnProperty("UP_DTP_CRI")?"<td data-id='"+value.UP_DTP_CRI+"'>"+value.UP_DTP_CRI+"</td>":"") +
									(value.hasOwnProperty("UP_DTP_MAJ")?"<td data-id='"+value.UP_DTP_MAJ+"'>"+value.UP_DTP_MAJ+"</td>":"") +
									(value.hasOwnProperty("UP_DTP_MIN")?"<td data-id='"+value.UP_DTP_MIN+"'>"+value.UP_DTP_MIN+"</td>":"") +
									(value.hasOwnProperty("DW_DTP_CRI")?"<td data-id='"+value.DW_DTP_CRI+"'>"+value.DW_DTP_CRI+"</td>":"") +
									(value.hasOwnProperty("DW_DTP_MAJ")?"<td data-id='"+value.DW_DTP_MAJ+"'>"+value.DW_DTP_MAJ+"</td>":"") +
									(value.hasOwnProperty("DW_DTP_MIN")?"<td data-id='"+value.DW_DTP_MIN+"'>"+value.DW_DTP_MIN+"</td>":"") +
								"</tr>";
						index++;
					}
				});
				$('#threshold_body').append(body);
				
				var tbl = $("#table");  
				// 테이블 헤더에 있는 checkbox 클릭시
				$(":checkbox:first", tbl).click(function(){
					// 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
					if( $(this).is(":checked") ){
						$(":checkbox", tbl).prop("checked", true);
					}
					else{
						$(":checkbox", tbl).prop("checked", false);
					}
					// 모든 체크박스에 change 이벤트 발생시키기					 
					$(":checkbox", tbl).trigger("change");
				});
				
				
				$(":checkbox:not(:first)", tbl).click(function(){
					var allCnt = $(":checkbox:not(:first)", tbl).length;
					var checkedCnt = $(":checkbox:not(:first)", tbl).filter(":checked").length;
					
					// 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
					if( allCnt==checkedCnt ){
						$(":checkbox:first", tbl).prop("checked", true);
					}
					else{
						$(":checkbox:first", tbl).prop("checked", false);
					}
				}).change(function(){
					if( $(this).is(":checked") ){
						// 체크박스의 부모 > 부모 니까 tr 이 되고 tr 에 selected 라는 class 를 추가한다.
					}
					else{
					}
				});
				
				// =============== 수정화면 띄우기
				$('input:checkbox[id="body1"]').prop('checked', true);	// 첫 줄 체크
				thresholdModView();
				// =============// 수정화면 띄우기
			},
			error: function () { 
				//alert('에러발생');
			}
	}); 
	
}

function excel_download(){
	
	var rowHeaderList = [];
	var colHeaderList = [];
	var secondHeaderList = [];
	var colIdList = [];
	
	var rowHeaders = '', colHeaders = '', secondHeaders = '', colIds = '';
	
	$('#threshold_head tr').each(function(){
		$(this).find('th').each(function(index,th){
			if($(th).css('display')!= 'none'){
				if($(th).data('row')) {
					rowHeaderList.push($(th).text());
				} else if($(th).data('col')){
					colHeaderList.push($(th).text());
				} else if($(th).data('second')) {
					secondHeaderList.push($(th).text());
				}
				
				if($(th).data('id')) {
					colIdList.push($(th).data('id'));
				}
			}
		});
	});
	
	rowHeaders = rowHeaderList.join(",");
	colHeaders = colHeaderList.join(",");
	secondHeaders = secondHeaderList.join(",");
	colIds = colIdList.join(",");
	
	var flag = $("input:radio[name=search_radio]:checked").val();
	var equip = $('#equipDiv').hasClass('disabled')?"":$('#equipSelect option:selected').val();
	var kpi = $('#kpiDiv').hasClass('disabled')?"":$('#kpiSelect option:selected').val();
	var type = $('#typeDiv').hasClass('disabled')?"":$('#typeSelect option:selected').val();
	var weekday = "99";
	var hourscope = "99";
	var mobileType = $('#mobileTypeDiv').hasClass('disabled')?"":$('#mobileTypeSelect option:selected').val();
	var storageType = $('#storageTypeDiv').hasClass('disabled')?"":$('#storageTypeSelect option:selected').val();
	
	var url =  "/pm/pm_setting/threshold_setting/excelDown?flag="+flag+"&equip="+equip+"&kpi="+kpi+"&weekday="+weekday+"&hourscope="+hourscope+
			"&type="+type+"&mobileType="+mobileType+"&storageType="+storageType+"&rowHeaders="+rowHeaders+"&colHeaders="+colHeaders+"&secondHeaders="+secondHeaders+"&colIds="+colIds;
	$(location).attr('href', url);
}

function pageSearch(){
	thresholdSearch();
}

// 수정 화면 띄우기
function thresholdModView() {
	// 수정 버튼 보이기
	$('#div_mody_area').show();
	$('#btn_thresholdModModify').show();
	inputSetting();
}

// 입력영역 설정
function inputSetting() {
	var flag = $("input:radio[name=search_radio]:checked").val();
	var equip = $('#equipSelect option:selected').val();
	var kpi = $('#kpiSelect option:selected').val();
	var succTxt = '';
	var ansTxt = '';
	
	$('.mu-formbox tr').css('display', 'none');
	
	if( flag != 0 && flag != 3 && equip == 1) {
		/*succTxt = '접속율';*/
		ansTxt = '성공율';
	} else {
		succTxt = '성공율';
		ansTxt = '완료율';
	}
	
	$('#ATT_RATE_INCR').hide();
	$('#ATT_RATE_DECR').hide();
	$('#ERAB_ATT_RATE_INCR').hide();
	$('#ERAB_ATT_RATE_DECR').hide();
	
	if(flag == "0") {
		if(kpi == "1") {
			$('#ATTEMPT_text').html('<i class="mu-icon mu-circle"></i>시도호 제외(이상)');
			$('#ATTEMPT_TR').css('display', 'table-row');
			
			//
			$('#ATT_RATE_INCR').css('display', 'table-row');
			$('#ATT_RATE_DECR').css('display', 'table-row');
			$('#ERAB_ATT_RATE_INCR').css('display', 'table-row');
			$('#ERAB_ATT_RATE_DECR').css('display', 'table-row');
			$('#SEIZER_RATE').css('display', 'table-row');
			//
			
			$('#ANS_RATE').css('display', 'table-row');
			$('#ANS_RATE_MIN_text').text(ansTxt+' Minor(이하)');
			$('#ANS_RATE_MAJ_text').text(ansTxt+' Major(이하)');
			$('#ANS_RATE_CRI_text').text(ansTxt+' Critical(이하)');
			
			$('#CD_RATE').css('display', 'table-row');
			
		} else if(kpi == "2") {	// Data Throughput
			$('#ATTEMPT_VOL').css('display', 'table-row');
			
			$('#UP_VOL_RATE_INCR').css('display', 'table-row');
			$('#DW_VOL_RATE_INCR').css('display', 'table-row');
			$('#UP_DTP_RATE_INCR').css('display', 'table-row');
			$('#DW_DTP_RATE_INCR').css('display', 'table-row');
			$('#UP_VOL_RATE_DECR').css('display', 'table-row');
			$('#DW_VOL_RATE_DECR').css('display', 'table-row');
			$('#UP_DTP_RATE_DECR').css('display', 'table-row');
			$('#DW_DTP_RATE_DECR').css('display', 'table-row');
			
			$('#UP_DTP').css('display', 'table-row');
			$('#DW_DTP').css('display', 'table-row');
		} else {	// HandOver
			$('#ATTEMPT_text').html('<i class="mu-icon mu-circle"></i>시도호 제외(이상)');
			$('#ATTEMPT_TR').css('display', 'table-row');
			$('#ATT_RATE').css('display', 'table-row');
			
			$('#ATT_RATE_DECR').css('display', 'table-row');
			$('#ATT_RATE_MIN_DECR_text').text('시도호감소율 Minor(이하)');
			$('#ATT_RATE_MAJ_DECR_text').text('시도호감소율 Major(이하)');
			$('#ATT_RATE_CRI_DECR_text').text('시도호감소율 Critical(이하)');
			
			$('#SUCC_RATE').css('display', 'table-row');
			$('#SUCC_RATE_MIN_text').text(succTxt+' Minor(이하)');
			$('#SUCC_RATE_MAJ_text').text(succTxt+' Major(이하)');
			$('#SUCC_RATE_CRI_text').text(succTxt+' Critical(이하)');
		}
		
	} else if(flag == "1") {
		if(equip == 1) {
			$('#ATTEMPT_text').html('<i class="mu-icon mu-circle"></i>시도호 제외(이상)');
			$('#ATTEMPT_TR').css('display', 'table-row');
			$('#ATT_RATE').css('display', 'table-row');
			
			$('#ATT_RATE_DECR').css('display', 'table-row');
			$('#ATT_RATE_MIN_DECR_text').text('시도호감소율 Minor(이하)');
			$('#ATT_RATE_MAJ_DECR_text').text('시도호감소율 Major(이하)');
			$('#ATT_RATE_CRI_DECR_text').text('시도호감소율 Critical(이하)');
			
			$('#SUCC_RATE').css('display', 'table-row');
			$('#SUCC_RATE_MIN_text').text(succTxt+' Minor(이하)');
			$('#SUCC_RATE_MAJ_text').text(succTxt+' Major(이하)');
			$('#SUCC_RATE_CRI_text').text(succTxt+' Critical(이하)');
			
			$('#ANS_RATE').css('display', 'table-row');
			$('#ANS_RATE_MIN_text').text(ansTxt+' Minor(이하)');
			$('#ANS_RATE_MAJ_text').text(ansTxt+' Major(이하)');
			$('#ANS_RATE_CRI_text').text(ansTxt+' Critical(이하)');
		}else {
			$('#ATTEMPT_text').html('<i class="mu-icon mu-circle"></i>시도호 제외(이상)');
			$('#ATTEMPT_TR').css('display', 'table-row');
			$('#ATT_RATE').css('display', 'table-row');
			
			$('#ATT_RATE_DECR').css('display', 'table-row');
			$('#ATT_RATE_MIN_DECR_text').text('시도호감소율 Minor(이하)');
			$('#ATT_RATE_MAJ_DECR_text').text('시도호감소율 Major(이하)');
			$('#ATT_RATE_CRI_DECR_text').text('시도호감소율 Critical(이하)');
			
			$('#SUCC_RATE').css('display', 'table-row');
			$('#SUCC_RATE_MIN_text').text(succTxt+' Minor(이하)');
			$('#SUCC_RATE_MAJ_text').text(succTxt+' Major(이하)');
			$('#SUCC_RATE_CRI_text').text(succTxt+' Critical(이하)');
		}
		
	} else {
		$('#ATTEMPT_text').html('<i class="mu-icon mu-circle"></i>시도호 제외(이상)');
		$('#ATTEMPT_TR').css('display', 'table-row');
		$('#ATT_RATE').css('display', 'table-row');
		
		$('#ATT_RATE_DECR').css('display', 'table-row');
		$('#ATT_RATE_MIN_DECR_text').text('시도호감소율 Minor(이하)');
		$('#ATT_RATE_MAJ_DECR_text').text('시도호감소율 Major(이하)');
		$('#ATT_RATE_CRI_DECR_text').text('시도호감소율 Critical(이하)');
		
		$('#SUCC_RATE').css('display', 'table-row');
		$('#SUCC_RATE_MIN_text').text(succTxt+' Minor(이하)');
		$('#SUCC_RATE_MAJ_text').text(succTxt+' Major(이하)');
		$('#SUCC_RATE_CRI_text').text(succTxt+' Critical(이하)');
		
	}
	var tbl = $("#table");
	var checkValList = [];
	var idx = 1;
	var id = '';
	
	$('#threshold_head tr').each(function(){
		$(this).find('th').each(function(index,th){
			var obj = {};
			if($(th).css('display')!= 'none'){
				if($(th).data('row')) {
					obj[$(th).data('id')] = idx;
					checkValList.push(obj);
					idx++;
				} else if($(th).data('second')) {
					obj[$(th).data('id')] = idx;
					checkValList.push(obj);
					idx++;
				}
			}
		});
	});
	
	$('.mu-formbox tr').each(function (i, val) {
		if($(val).css('display') != 'none') {
			$.each($(val).find('input'), function (k, obj) {
				id = $(obj).attr('id');
				
				$.each(checkValList, function(j, value) {
					if(value.hasOwnProperty(id.replace('_input', ''))) {
						$('#'+id).val($(":checkbox:not(:first)", tbl).filter(":checked").parent().parent().parent().find('td:eq('+ value[id.replace('_input', '')] +')').text());
						return false;
						
					}
				}); 
			});
			
		}
	});

}

// 수정
function thresholdMod(check){
	
	if(check){
		if(!confirm("수정하시겠습니까?")){
			return false;
		}
	}
	
	var flag = $("input:radio[name=search_radio]:checked").val();
	var equip = $('#equipSelect option:selected').val();
	var kpi = $('#kpiSelect option:selected').val();
	var type = $('#typeSelect option:selected').val();
	var mobileType = $('#mobileTypeSelect option:selected').val();
	var storageType = $('#storageTypeSelect option:selected').val();
	
	var attempt = 0, att_rate_min = 0, att_rate_maj = 0, att_rate_cri = 0;
	var seizer_rate_min = 0, seizer_rate_maj = 0, seizer_rate_cri = 0
	var ans_rate_min = 0, ans_rate_maj = 0, ans_rate_cri = 0
	var cd_rate_min = 0, cd_rate_maj = 0, cd_rate_cri = 0
	var succ_rate_min = 0, succ_rate_maj = 0, succ_rate_cri = 0
	
	var att_rate_decr_cri = 0, att_rate_decr_maj = 0, att_rate_decr_min = 0;
	var erab_att_rate_incr_cri = 0, erab_att_rate_incr_maj = 0, erab_att_rate_incr_min = 0;
	var erab_att_rate_decr_cri = 0, erab_att_rate_decr_maj = 0, erab_att_rate_decr_min = 0;
	
	var up_attempt = 0, dw_attempt = 0;
	var up_vol_rate_cri_incr = 0, up_vol_rate_maj_incr = 0, up_vol_rate_min_incr = 0;
	var dw_vol_rate_cri_incr = 0, dw_vol_rate_maj_incr = 0, dw_vol_rate_min_incr = 0;
	var up_dtp_rate_cri_incr = 0, up_dtp_rate_maj_incr = 0, up_dtp_rate_min_incr = 0;
	var dw_dtp_rate_cri_incr = 0, dw_dtp_rate_maj_incr = 0, dw_dtp_rate_min_incr = 0;
	var up_vol_rate_cri_decr = 0, up_vol_rate_maj_decr = 0, up_vol_rate_min_decr = 0;
	var dw_vol_rate_cri_decr = 0, dw_vol_rate_maj_decr = 0, dw_vol_rate_min_decr = 0;
	var up_dtp_rate_cri_decr = 0, up_dtp_rate_maj_decr = 0, up_dtp_rate_min_decr = 0;
	var dw_dtp_rate_cri_decr = 0, dw_dtp_rate_maj_decr = 0, dw_dtp_rate_min_decr = 0;
	var up_dtp_cri = 0, up_dtp_maj = 0, up_dtp_min = 0;
	var dw_dtp_cri = 0, dw_dtp_maj = 0, dw_dtp_min = 0;
	
	if(flag == "0") {
		if(kpi == "1") {
			 attempt = Number($('#ATTEMPT_input').val());
			 att_rate_min = Number($('#ATT_RATE_MIN_INCR_input').val());
			 att_rate_maj = Number($('#ATT_RATE_MAJ_INCR_input').val());
			 att_rate_cri = Number($('#ATT_RATE_CRI_INCR_input').val());
			 
			 att_rate_decr_cri = Number($('#ATT_RATE_CRI_DECR_input').val());
			 att_rate_decr_maj = Number($('#ATT_RATE_MAJ_DECR_input').val());
			 att_rate_decr_min = Number($('#ATT_RATE_MIN_DECR_input').val());
				 
			 erab_att_rate_incr_cri = Number($('#ERAB_ATT_RATE_CRI_INCR_input').val());
			 erab_att_rate_incr_maj = Number($('#ERAB_ATT_RATE_MAJ_INCR_input').val());
			 erab_att_rate_incr_min = Number($('#ERAB_ATT_RATE_MIN_INCR_input').val());
				
			 erab_att_rate_decr_cri = Number($('#ERAB_ATT_RATE_CRI_DECR_input').val());
			 erab_att_rate_decr_maj = Number($('#ERAB_ATT_RATE_MAJ_DECR_input').val());
			 erab_att_rate_decr_min = Number($('#ERAB_ATT_RATE_MIN_DECR_input').val());
				 
			 seizer_rate_min = Number($('#SEIZER_RATE_MIN_input').val());
			 seizer_rate_maj = Number($('#SEIZER_RATE_MAJ_input').val());
			 seizer_rate_cri = Number($('#SEIZER_RATE_CRI_input').val());
			 
			 ans_rate_min = Number($('#ANS_RATE_MIN_input').val());
			 ans_rate_maj = Number($('#ANS_RATE_MAJ_input').val());
			 ans_rate_cri = Number($('#ANS_RATE_CRI_input').val());
			 
			 cd_rate_min = Number($('#CD_RATE_MIN_input').val());
			 cd_rate_maj = Number($('#CD_RATE_MAJ_input').val());
			 cd_rate_cri = Number($('#CD_RATE_CRI_input').val());
			 
			 if(attempt == 0 || att_rate_min == 0 || att_rate_maj == 0 || att_rate_cri == 0 || seizer_rate_min == 0 || seizer_rate_maj == 0 || seizer_rate_cri == 0 
					 || ans_rate_min == 0 || ans_rate_maj == 0 || ans_rate_cri == 0 || cd_rate_min == 0 || cd_rate_maj == 0 || cd_rate_cri == 0
					 || att_rate_decr_cri == 0 || att_rate_decr_maj == 0 || att_rate_decr_min == 0 
					 || erab_att_rate_incr_cri == 0 || erab_att_rate_incr_maj == 0 || erab_att_rate_incr_min == 0 
					 || erab_att_rate_decr_cri == 0 || erab_att_rate_decr_maj == 0 || erab_att_rate_decr_min == 0
			 	) {
				alert("임계치 항목을 모두 채워주세요");
				return false;
			 }
			 
			if(att_rate_cri <= att_rate_maj){
				alert("시도호증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_maj <= att_rate_min){
				alert("RRC 시도호증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			
			if(att_rate_decr_cri >= att_rate_decr_maj){
				alert("RRC 시도호감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_maj >= att_rate_decr_min){
				alert("RRC 시도호감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			
			if(erab_att_rate_incr_cri <= erab_att_rate_incr_maj){
				alert("ERAB Setup 시도호증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(erab_att_rate_incr_maj <= erab_att_rate_incr_min){
				alert("ERAB Setup  시도호증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(erab_att_rate_decr_cri >= erab_att_rate_decr_maj){
				alert("ERAB Setup 시도호감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(erab_att_rate_decr_maj >= erab_att_rate_decr_min){
				alert("ERAB Setup 시도호감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			
			if(seizer_rate_cri >= seizer_rate_maj){
				alert("소통율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(seizer_rate_maj >= seizer_rate_min){
				alert("소통율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(ans_rate_cri >= ans_rate_maj){
				alert("완료율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(ans_rate_maj >= ans_rate_min){
				alert("완료율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(cd_rate_cri <= cd_rate_maj){
				alert("절단율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(cd_rate_maj <= cd_rate_min){
				alert("절단율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			 
			 
		} else if(kpi == "2") {
			up_attempt = Number($('#UP_ATTEMPT_input').val()); 
			dw_attempt = Number($('#DW_ATTEMPT_input').val()); 
			
			up_vol_rate_cri_incr = Number($('#UP_VOL_RATE_CRI_INCR_input').val()); 
			up_vol_rate_maj_incr = Number($('#UP_VOL_RATE_MAJ_INCR_input').val()); 
			up_vol_rate_min_incr = Number($('#UP_VOL_RATE_MIN_INCR_input').val()); 
			
			dw_vol_rate_cri_incr = Number($('#DW_VOL_RATE_CRI_INCR_input').val()); 
			dw_vol_rate_maj_incr = Number($('#DW_VOL_RATE_MAJ_INCR_input').val()); 
			dw_vol_rate_min_incr = Number($('#DW_VOL_RATE_MIN_INCR_input').val()); 
			
			up_dtp_rate_cri_incr = Number($('#UP_DTP_RATE_CRI_INCR_input').val()); 
			up_dtp_rate_maj_incr = Number($('#UP_DTP_RATE_MAJ_INCR_input').val()); 
			up_dtp_rate_min_incr = Number($('#UP_DTP_RATE_MIN_INCR_input').val()); 
			
			dw_dtp_rate_cri_incr = Number($('#DW_DTP_RATE_CRI_INCR_input').val()); 
			dw_dtp_rate_maj_incr = Number($('#DW_DTP_RATE_MAJ_INCR_input').val()); 
			dw_dtp_rate_min_incr = Number($('#DW_DTP_RATE_MIN_INCR_input').val()); 
			
			up_vol_rate_cri_decr = Number($('#UP_VOL_RATE_CRI_DECR_input').val()); 
			up_vol_rate_maj_decr = Number($('#UP_VOL_RATE_MAJ_DECR_input').val()); 
			up_vol_rate_min_decr = Number($('#UP_VOL_RATE_MIN_DECR_input').val()); 

			dw_vol_rate_cri_decr = Number($('#DW_VOL_RATE_CRI_DECR_input').val()); 
			dw_vol_rate_maj_decr = Number($('#DW_VOL_RATE_MAJ_DECR_input').val()); 
			dw_vol_rate_min_decr = Number($('#DW_VOL_RATE_MIN_DECR_input').val()); 

			up_dtp_rate_cri_decr = Number($('#UP_DTP_RATE_CRI_DECR_input').val()); 
			up_dtp_rate_maj_decr = Number($('#UP_DTP_RATE_MAJ_DECR_input').val()); 
			up_dtp_rate_min_decr = Number($('#UP_DTP_RATE_MIN_DECR_input').val()); 

			dw_dtp_rate_cri_decr = Number($('#DW_DTP_RATE_CRI_DECR_input').val()); 
			dw_dtp_rate_maj_decr = Number($('#DW_DTP_RATE_MAJ_DECR_input').val()); 
			dw_dtp_rate_min_decr = Number($('#DW_DTP_RATE_MIN_DECR_input').val()); 
			
			up_dtp_min = Number($('#UP_DTP_MIN_input').val());
			up_dtp_maj = Number($('#UP_DTP_MAJ_input').val());
			up_dtp_cri = Number($('#UP_DTP_CRI_input').val());
			
			dw_dtp_min = Number($('#DW_DTP_MIN_input').val());
			dw_dtp_maj = Number($('#DW_DTP_MAJ_input').val());
			dw_dtp_cri = Number($('#DW_DTP_CRI_input').val());
			
			if(up_attempt == 0 || dw_attempt == 0 
					|| up_vol_rate_cri_incr == 0 || up_vol_rate_maj_incr == 0 || up_vol_rate_min_incr == 0
					|| dw_vol_rate_cri_incr == 0 || dw_vol_rate_maj_incr == 0 || dw_vol_rate_min_incr == 0
					|| up_dtp_rate_cri_incr == 0 || up_dtp_rate_maj_incr == 0 || up_dtp_rate_min_incr == 0
					|| dw_dtp_rate_cri_incr == 0 || dw_dtp_rate_maj_incr == 0 || dw_dtp_rate_min_incr == 0
					|| up_vol_rate_cri_decr == 0 || up_vol_rate_maj_decr == 0 || up_vol_rate_min_decr == 0
					|| dw_vol_rate_cri_decr == 0 || dw_vol_rate_maj_decr == 0 || dw_vol_rate_min_decr == 0
					|| up_dtp_rate_cri_decr == 0 || up_dtp_rate_maj_decr == 0 || up_dtp_rate_min_decr == 0
					|| dw_dtp_rate_cri_decr == 0 || dw_dtp_rate_maj_decr == 0 || dw_dtp_rate_min_decr == 0
					|| up_dtp_min == 0 || up_dtp_maj == 0 || up_dtp_cri == 0 
					|| dw_dtp_min == 0 || dw_dtp_maj == 0 || dw_dtp_cri == 0) {
				alert("임계치 항목을 모두 채워주세요");
				return false;
			 }
			if(up_vol_rate_cri_incr <= up_vol_rate_maj_incr){
				alert("Up Volume 증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(up_vol_rate_maj_incr <= up_vol_rate_min_incr){
				alert("Up Volume 증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(dw_vol_rate_cri_incr <= dw_vol_rate_maj_incr){
				alert("Down Volume 증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(dw_vol_rate_maj_incr <= dw_vol_rate_min_incr){
				alert("Down Volume 증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(up_dtp_rate_cri_incr <= up_dtp_rate_maj_incr){
				alert("Up Throughput 증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(up_dtp_rate_maj_incr <= up_dtp_rate_min_incr){
				alert("Up Throughput 증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(dw_dtp_rate_cri_incr <= dw_dtp_rate_maj_incr){
				alert("Down Throughput 증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(dw_dtp_rate_maj_incr <= dw_dtp_rate_min_incr){
				alert("Down Throughput 증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(up_vol_rate_cri_decr >= up_vol_rate_maj_decr){
				alert("Up Volume 감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(up_vol_rate_maj_decr >= up_vol_rate_min_decr){
				alert("Up Volume 감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(dw_vol_rate_cri_decr >= dw_vol_rate_maj_decr){
				alert("Down Volume 감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(dw_vol_rate_maj_decr >= dw_vol_rate_min_decr){
				alert("Down Volume 감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(up_dtp_rate_cri_decr >= up_dtp_rate_maj_decr){
				alert("Up Throughput 감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(up_dtp_rate_maj_decr >= up_dtp_rate_min_decr){
				alert("Up Throughput 감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(dw_dtp_rate_cri_decr >= dw_dtp_rate_maj_decr){
				alert("Down Throughput 감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(dw_dtp_rate_maj_decr >= dw_dtp_rate_min_decr){
				alert("Down Throughput 감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(up_dtp_cri >= up_dtp_maj){
				alert("UP DTP Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(up_dtp_maj >= up_dtp_min){
				alert("UP DTP Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(dw_dtp_cri >= dw_dtp_maj){
				alert("DW DTP Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(dw_dtp_maj >= dw_dtp_min){
				alert("DW DTP Major 임계치는 Minor 임계치보다  크거나 같을 수 없습니다.");
				return false;
			}
			
		} else {	// Hand Over
			attempt = Number($('#ATTEMPT_input').val());
			att_rate_min = Number($('#ATT_RATE_MIN_input').val());
			att_rate_maj = Number($('#ATT_RATE_MAJ_input').val());
			att_rate_cri = Number($('#ATT_RATE_CRI_input').val());
			
			att_rate_decr_cri = Number($('#ATT_RATE_CRI_DECR_input').val());
			att_rate_decr_maj = Number($('#ATT_RATE_MAJ_DECR_input').val());
			att_rate_decr_min = Number($('#ATT_RATE_MIN_DECR_input').val());
			
			succ_rate_min = Number($('#SUCC_RATE_MIN_input').val());
			succ_rate_maj = Number($('#SUCC_RATE_MAJ_input').val());
			succ_rate_cri = Number($('#SUCC_RATE_CRI_input').val());
			
			if(attempt == 0 || att_rate_min == 0 || att_rate_maj == 0 || att_rate_cri == 0 
					|| att_rate_decr_cri == 0 || att_rate_decr_maj == 0 || att_rate_decr_min == 0
					|| succ_rate_min == 0 || succ_rate_maj == 0 || succ_rate_cri == 0) {
				alert("임계치 항목을 모두 채워주세요");
				return false;
			 }
			
			if(att_rate_cri <= att_rate_maj){
				alert("시도호증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_maj <= att_rate_min){
				alert("시도호증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_cri >= att_rate_decr_maj){
				alert("시도호감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_maj >= att_rate_decr_min){
				alert("시도호감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(succ_rate_cri >= succ_rate_maj){
				alert("성공율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(succ_rate_maj >= succ_rate_min){
				alert("성공율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
		}
		
	} else if(flag == "1") {
		if(equip == 1) {
			attempt = Number($('#ATTEMPT_input').val());
			att_rate_min = Number($('#ATT_RATE_MIN_input').val());
			att_rate_maj = Number($('#ATT_RATE_MAJ_input').val());
			att_rate_cri = Number($('#ATT_RATE_CRI_input').val());
			
			att_rate_decr_min = Number($('#ATT_RATE_MIN_DECR_input').val());
			att_rate_decr_maj = Number($('#ATT_RATE_MAJ_DECR_input').val());
			att_rate_decr_cri = Number($('#ATT_RATE_CRI_DECR_input').val());
			
			ans_rate_min = Number($('#ANS_RATE_MIN_input').val());
			ans_rate_maj = Number($('#ANS_RATE_MAJ_input').val());
			ans_rate_cri = Number($('#ANS_RATE_CRI_input').val());
			
			succ_rate_min = Number($('#SUCC_RATE_MIN_input').val());
			succ_rate_maj = Number($('#SUCC_RATE_MAJ_input').val());
			succ_rate_cri = Number($('#SUCC_RATE_CRI_input').val());
			
			if(attempt == 0 || att_rate_min == 0 || att_rate_maj == 0 || att_rate_cri == 0 
					|| att_rate_decr_min == 0 || att_rate_decr_maj == 0 || att_rate_decr_cri == 0 
					|| succ_rate_min == 0 || succ_rate_maj == 0 || succ_rate_cri == 0
					|| ans_rate_min == 0 || ans_rate_maj == 0 || ans_rate_cri == 0) {
				alert("임계치 항목을 모두 채워주세요");
				return false;
			 }
			
			if(att_rate_cri <= att_rate_maj){
				alert("시도호증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_maj <= att_rate_min){
				alert("시도호증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_cri >= att_rate_decr_maj){
				alert("시도호감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_maj >= att_rate_decr_min){
				alert("시도호감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(ans_rate_cri >= ans_rate_maj){
				alert("성공율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(ans_rate_maj >= ans_rate_min){
				alert("성공율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			/*if(succ_rate_cri >= succ_rate_maj){
				alert("접속율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(succ_rate_maj >= succ_rate_min){
				alert("접속율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}*/
			
			
		}else {
			attempt = Number($('#ATTEMPT_input').val());
			att_rate_min = Number($('#ATT_RATE_MIN_input').val());
			att_rate_maj = Number($('#ATT_RATE_MAJ_input').val());
			att_rate_cri = Number($('#ATT_RATE_CRI_input').val());
			
			att_rate_decr_min = Number($('#ATT_RATE_MIN_DECR_input').val());
			att_rate_decr_maj = Number($('#ATT_RATE_MAJ_DECR_input').val());
			att_rate_decr_cri = Number($('#ATT_RATE_CRI_DECR_input').val());
			
			succ_rate_min = Number($('#SUCC_RATE_MIN_input').val());
			succ_rate_maj = Number($('#SUCC_RATE_MAJ_input').val());
			succ_rate_cri = Number($('#SUCC_RATE_CRI_input').val());
			
			if(attempt == 0 || att_rate_min == 0 || att_rate_maj == 0 || att_rate_cri == 0 
					|| att_rate_decr_min == 0 || att_rate_decr_maj == 0 || att_rate_decr_cri == 0 
					|| succ_rate_min == 0 || succ_rate_maj == 0 || succ_rate_cri == 0) {
				alert("임계치 항목을 모두 채워주세요");
				return false;
			 }
			
			if(att_rate_cri <= att_rate_maj){
				alert("시도호증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_maj <= att_rate_min){
				alert("시도호증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_cri >= att_rate_decr_maj){
				alert("시도호감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(att_rate_decr_maj >= att_rate_decr_min){
				alert("시도호감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(succ_rate_cri >= succ_rate_maj){
				alert("성공율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(succ_rate_maj >= succ_rate_min){
				alert("성공율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
		}
		
	} else {
		attempt = Number($('#ATTEMPT_input').val());
		att_rate_min = Number($('#ATT_RATE_MIN_input').val());
		att_rate_maj = Number($('#ATT_RATE_MAJ_input').val());
		att_rate_cri = Number($('#ATT_RATE_CRI_input').val());
		
		att_rate_decr_min = Number($('#ATT_RATE_MIN_DECR_input').val());
		att_rate_decr_maj = Number($('#ATT_RATE_MAJ_DECR_input').val());
		att_rate_decr_cri = Number($('#ATT_RATE_CRI_DECR_input').val());
		
		succ_rate_min = Number($('#SUCC_RATE_MIN_input').val());
		succ_rate_maj = Number($('#SUCC_RATE_MAJ_input').val());
		succ_rate_cri = Number($('#SUCC_RATE_CRI_input').val());
		
		if(attempt == 0 || att_rate_min == 0 || att_rate_maj == 0 || att_rate_cri == 0 
				|| att_rate_decr_min == 0 || att_rate_decr_maj == 0 || att_rate_decr_cri == 0 
				|| succ_rate_min == 0 || succ_rate_maj == 0 || succ_rate_cri == 0) {
			alert("임계치 항목을 모두 채워주세요");
			return false;
		 }
		
		if(att_rate_cri <= att_rate_maj){
			alert("시도호증가율 Critical 임계치는 Major 임계치보다 작거나 같을 수 없습니다.");
			return false;
		}
		if(att_rate_maj <= att_rate_min){
			alert("시도호증가율 Major 임계치는 Minor 임계치보다 작거나 같을 수 없습니다.");
			return false;
		}
		if(att_rate_decr_cri >= att_rate_decr_maj){
			alert("시도호감소율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
			return false;
		}
		if(att_rate_decr_maj >= att_rate_decr_min){
			alert("시도호감소율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
			return false;
		}
		if(succ_rate_cri >= succ_rate_maj){
			alert("성공율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
			return false;
		}
		if(succ_rate_maj >= succ_rate_min){
			alert("성공율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
			return false;
		}
		
		if(flag == "3"){
			type = '1';
		}
		
	}
	
	var data = {
		equip : equip, 
		kpi : kpi, 
		type : type, 
		weekday : '99',
		hourscope : '99', 
		flag : flag, 
		mobileType : mobileType,
		storageType: storageType,
		ATTEMPT : attempt, 
		ATT_RATE_MIN : att_rate_min, 
		ATT_RATE_MAJ : att_rate_maj, 
		ATT_RATE_CRI : att_rate_cri,
		SEIZER_RATE_MIN : seizer_rate_min, 
		SEIZER_RATE_MAJ : seizer_rate_maj, 
		SEIZER_RATE_CRI : seizer_rate_cri,
		ANS_RATE_MIN : ans_rate_min, 
		ANS_RATE_MAJ : ans_rate_maj, 
		ANS_RATE_CRI : ans_rate_cri,
		CD_RATE_MIN : cd_rate_min,
		CD_RATE_MAJ : cd_rate_maj, 
		CD_RATE_CRI : cd_rate_cri,
		SUCC_RATE_MIN : succ_rate_min, 
		SUCC_RATE_MAJ : succ_rate_maj, 
		SUCC_RATE_CRI : succ_rate_cri,
		ATT_RATE_MIN_DECR: att_rate_decr_min, 
		ATT_RATE_MAJ_DECR : att_rate_decr_maj, 
		ATT_RATE_CRI_DECR : att_rate_decr_cri,
		ERAB_ATT_RATE_MIN_INCR: erab_att_rate_incr_min, 
		ERAB_ATT_RATE_MAJ_INCR: erab_att_rate_incr_maj, 
		ERAB_ATT_RATE_CRI_INCR: erab_att_rate_incr_cri,
		ERAB_ATT_RATE_MIN_DECR : erab_att_rate_decr_min, 
		ERAB_ATT_RATE_MAJ_DECR: erab_att_rate_decr_maj, 
		ERAB_ATT_RATE_CRI_DECR: erab_att_rate_decr_cri,
		
		UP_ATTEMPT:up_attempt, 
		DW_ATTEMPT:dw_attempt,
		UP_VOL_RATE_CRI_INCR : up_vol_rate_cri_incr,
		UP_VOL_RATE_MAJ_INCR : up_vol_rate_maj_incr,
		UP_VOL_RATE_MIN_INCR : up_vol_rate_min_incr,
		DW_VOL_RATE_CRI_INCR : dw_vol_rate_cri_incr,
		DW_VOL_RATE_MAJ_INCR : dw_vol_rate_maj_incr,
		DW_VOL_RATE_MIN_INCR : dw_vol_rate_min_incr,
		UP_DTP_RATE_CRI_INCR : up_dtp_rate_cri_incr, 
		UP_DTP_RATE_MAJ_INCR : up_dtp_rate_maj_incr, 
		UP_DTP_RATE_MIN_INCR : up_dtp_rate_min_incr, 
		DW_DTP_RATE_CRI_INCR : dw_dtp_rate_cri_incr, 
		DW_DTP_RATE_MAJ_INCR : dw_dtp_rate_maj_incr, 
		DW_DTP_RATE_MIN_INCR : dw_dtp_rate_min_incr, 
		UP_VOL_RATE_CRI_DECR : up_vol_rate_cri_decr,
		UP_VOL_RATE_MAJ_DECR : up_vol_rate_maj_decr,
		UP_VOL_RATE_MIN_DECR : up_vol_rate_min_decr,
		DW_VOL_RATE_CRI_DECR : dw_vol_rate_cri_decr,
		DW_VOL_RATE_MAJ_DECR : dw_vol_rate_maj_decr,
		DW_VOL_RATE_MIN_DECR : dw_vol_rate_min_decr,
		UP_DTP_RATE_CRI_DECR : up_dtp_rate_cri_decr,
		UP_DTP_RATE_MAJ_DECR : up_dtp_rate_maj_decr,
		UP_DTP_RATE_MIN_DECR : up_dtp_rate_min_decr,
		DW_DTP_RATE_CRI_DECR : dw_dtp_rate_cri_decr,
		DW_DTP_RATE_MAJ_DECR : dw_dtp_rate_maj_decr,
		DW_DTP_RATE_MIN_DECR : dw_dtp_rate_min_decr,
		UP_DTP_MIN : up_dtp_min, 
		UP_DTP_MAJ : up_dtp_maj, 
		UP_DTP_CRI : up_dtp_cri,
		DW_DTP_MIN : dw_dtp_min, 
		DW_DTP_MAJ : dw_dtp_maj, 
		DW_DTP_CRI : dw_dtp_cri
	}
	
	var requestData = JSON.stringify(data);
	
	$.ajax({
			type : 'post',
			url: '/pm/pm_setting/threshold_setting/thresholdMod',
			contentType: 'application/json',
			dataTpye:'json',
			data : requestData,
			success: function (data) {
				if(data.thresholdModFlag <= 0){
					if(check){
						alert("임계치 등록 실패");
					}else{
						alert("임계치 수정 실패");
					}
				}
				
				alert('수정 되었습니다.');
			},
			error: function () { 
				//alert('에러발생');
			}
	});
}