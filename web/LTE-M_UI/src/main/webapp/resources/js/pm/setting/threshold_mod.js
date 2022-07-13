var viewFlag = true;
$(document).ready(function(){
	$('#thresholdModClose, #thresholdModCancle,#thresholdModBg').on('click',function(e){
		$('#thresholdModBg').fadeOut();
		$('#thresholdModUp').fadeOut();
	});
	//thresholdMod Drag 지정 정의
	$( "#thresholdModUp" ).draggable({'handle' : '#thresholdModTitleBox'});
	$( "#thresholdModUp" ).resizable({
		animate: true
	});
	
	$("input[name=mod_search_radio]").change(function() {
		radioValue = $(this).val();
		mod_searchRadioChange(radioValue);
	});
	
	$("#mod_equipSelect").change(function() {
		mod_kpiSetting($(this).val());
	});
	
	$("#mod_kpiSelect").change(function() {
		mod_kpiChange($("#mod_kpiSelect option:selected").text());
	});
	
	$('#mod_typeSelect').change(function() {
		inputSetting();
	});
	
	$("#mod_mobileTypeSelect").change(function() {
		inputSetting();
	});
	
	$("#mod_storageTypeSelect").change(function() {
		inputSetting();
	});
	
	inputSetting();
});

function mod_searchRadioChange(radioValue){
	if(radioValue == 0) {
		$('#mod_newLine2').css('display', 'none');
		
		$('#mod_equipDiv').css('display', 'none');
		$("#mod_equipSelect").prop('disabled', true);
		$('#mod_equipDiv').hasClass("disabled") ? '' : $('#mod_equipDiv').addClass("disabled");
		
		$('#mod_kpiDiv').css('display', 'inline-block');
		$("#mod_kpiSelect").prop('disabled', false);
		$('#mod_kpiDiv').hasClass("disabled") ? $('#mod_kpiDiv').removeClass("disabled") : '';
		$("#mod_kpiSelect").val(1).attr("selected", "selected");
		
		$('#mod_typeDiv').css('display', 'none');
		$("#mod_typeSelect").prop('disabled', true);
		$('#mod_typeDiv').hasClass("disabled") ? '' : $('#mod_typeDiv').addClass("disabled");
		
		$('#mod_mobileTypeDiv').css('display', 'none');
		$('#mod_mobileTypeDiv').hasClass("disabled") ? '' : $('#mod_mobileTypeDiv').addClass("disabled");
		$("#mod_mobileTypeSelect").prop('disabled', true);
		
		$('#mod_storageTypeDiv').css('display', 'none');
		$('#mod_storageTypeDiv').addClass("disabled");
		$("#mod_storageTypeSelect").prop('disabled', true);
		
		mod_kpiSetting('0');
		
	} else if(radioValue == 1) {
		$('#mod_newLine2').css('display', 'none');
		
		$('#mod_equipDiv').css('display', 'inline-block');
		$("#mod_equipSelect").prop('disabled', false);
		$('#mod_equipDiv').hasClass("disabled") ? $('#mod_equipDiv').removeClass("disabled") : '';
		$("#mod_equipSelect").val(1).attr("selected", "selected");
		
		$('#mod_kpiDiv').css('display', 'inline-block');
		$("#mod_kpiSelect").prop('disabled', false);
		$('#mod_kpiDiv').hasClass("disabled") ? $('#mod_kpiDiv').removeClass("disabled") : '';
		$("#mod_kpiSelect").val(1).attr("selected", "selected");
		
		mod_kpiSetting('1');
		
		$('#mod_typeDiv').css('display', 'none');
		$("#mod_typeSelect").prop('disabled', true);
		$('#mod_typeDiv').hasClass("disabled") ? '' : $('#mod_typeDiv').addClass("disabled");
		
		$('#mod_mobileTypeDiv').css('display', 'none');
		$('#mod_mobileTypeDiv').hasClass("disabled") ? '' : $('#mod_mobileTypeDiv').addClass("disabled");
		$("#mod_mobileTypeSelect").prop('disabled', true);
		
		$('#mod_storageTypeDiv').css('display', 'none');
		$('#mod_storageTypeDiv').addClass("disabled");
		$("#mod_storageTypeSelect").prop('disabled', true);
		
	} else if(radioValue == 2) {
		$('#mod_newLine2').css('display', '');
		
		$('#mod_equipDiv').css('display', 'none');
		$('#mod_equipDiv').hasClass("disabled") ? '' : $('#mod_equipDiv').addClass("disabled");
		$("#mod_equipSelect").prop('disabled', true);
		
		$('#mod_kpiDiv').css('display', 'none');
		$('#mod_kpiDiv').hasClass("disabled") ? '' : $('#mod_kpiDiv').addClass("disabled");
		$("#mod_kpiSelect").prop('disabled', true);
		
		$('#mod_typeDiv').css('display', 'none');
		$("#mod_typeSelect").prop('disabled', true);
		$('#mod_typeDiv').hasClass("disabled") ? '' : $('#mod_typeDiv').addClass("disabled");
		
		$('#mod_mobileTypeDiv').css('display', 'inline-block');
		$("#mod_mobileTypeSelect").prop('disabled', false);
		$('#mod_mobileTypeDiv').hasClass("disabled") ? $('#mod_mobileTypeDiv').removeClass("disabled") : '';
		$("#mod_mobileTypeSelect").val(2).attr("selected", "selected");
		
		$('#mod_storageTypeDiv').css('display', 'none');
		$('#mod_storageTypeDiv').addClass("disabled");
		$("#mod_storageTypeSelect").prop('disabled', true);
		
		$("#mod_mobileTypeSelect").trigger('change');
	} else if(radioValue == 3) {
		$('#mod_newLine2').css('display', '');
		
		$('#mod_equipDiv').css('display', 'none');
		$('#mod_equipDiv').hasClass("disabled") ? '' : $('#mod_equipDiv').addClass("disabled");
		$("#mod_equipSelect").prop('disabled', true);
		
		$('#mod_kpiDiv').css('display', 'none');
		$('#mod_kpiDiv').hasClass("disabled") ? '' : $('#mod_kpiDiv').addClass("disabled");
		$("#mod_kpiSelect").prop('disabled', true);
		
		$('#mod_typeDiv').css('display', 'none');
		$("#mod_typeSelect").prop('disabled', true);
		$('#mod_typeDiv').hasClass("disabled") ? '' : $('#mod_typeDiv').addClass("disabled");
		
		$('#mod_mobileTypeDiv').css('display', 'none');
		$('#mod_mobileTypeDiv').hasClass("disabled") ? '' : $('#mod_mobileTypeDiv').addClass("disabled");
		$("#mod_mobileTypeSelect").prop('disabled', true);
		
		$('#mod_storageTypeDiv').css('display', 'inline-block');
		$('#mod_storageTypeDiv').removeClass("disabled");
		$("#mod_storageTypeSelect").prop('disabled', false);
		
		$("#mod_storageTypeSelect").trigger('change');
	}
}

// Kpi select box 설정
function mod_kpiSetting(equipValue) {
	if(equipValue == '0') {
		$('#mod_kpiSelect').empty();
		$('#mod_kpiSelect').append(
			'<option value=1 slected="selected">Traffic</option>' +
			'<option value=2>Data Throughput</option>' +
			'<option value=3>Hand Over</option>'
		);
	} else if(equipValue != '0') {
		switch (equipValue) {
			case '1' : 
				$('#mod_kpiSelect').empty();
				$('#mod_kpiSelect').append(
					'<option value=1 selected = "selected">Attach</option>' +
					'<option value=2>SR</option>'
				);
				break;
			case '2' : 
				$('#mod_kpiSelect').empty();
				$('#mod_kpiSelect').append(
					'<option value=1 selected = "selected">Create</option>'+
					'<option value=2>Delete</option>'+
					'<option value=3>Modify</option>'
				);
				break;
			case '3' : 
				$('#mod_kpiSelect').empty();
				$('#mod_kpiSelect').append(
					'<option value=1 selected = "selected">Create</option>'+
					'<option value=3>Delete</option>'+
					'<option value=2>Modify</option>'
				);
				break;
			case '4' : 
				$('#mod_kpiSelect').empty();
				$('#mod_kpiSelect').append(
					'<option value=1 selected = "selected">Diameter Stack</option>'+
					'<option value=2>S6A Interface</option>'+
					'<option value=3>S13 Interface</option>'+
					'<option value=4>SP Interface</option>'
				);
				break;
			case '5' : 
				$('#mod_kpiSelect').empty();
				$('#mod_kpiSelect').append(
					'<option value=1 selected = "selected">PCEF</option>'+
					'<option value=2>SPR</option>'+
					'<option value=3>AF</option>'
				);
				break;
		}
	}
	
	$("#mod_kpiSelect").trigger('change');
}

function mod_kpiChange(kpiName) {
	
	if(kpiName.match('Hand Over')) {
		mod_typeSetting();
	} else {
		$('#mod_typeDiv').css('display', 'none');
		$("#mod_typeSelect").prop('disabled', true);
		$('#mod_typeDiv').hasClass("disabled") ? '' : $('#mod_typeDiv').addClass("disabled");
		
		inputSetting();
	}
}

function mod_typeSetting() {
	$('#mod_typeDiv').css('display', 'inline-block');
	$("#mod_typeSelect").prop('disabled', false);
	$('#mod_typeDiv').hasClass("disabled") ? $('#mod_typeDiv').removeClass("disabled") : '';
	
	$('#mod_typeSelect').empty();
	$('#mod_typeSelect').append(
		'<option value=1 selected = "selected">Intra ENB Handover</option>' +
		'<option value=2>X2 In Handover</option>' +
		'<option value=3>X2 Out Handover</option>'
	);
	
	$('#mod_typeSelect').trigger('change');
}

function thresholdAddView() {
	viewFlag = true;
	mod_searchRadioChange(0);
	addSetting();
	
	$('#thresholdModBg').show().fadeIn('fast');
	$('#thresholdModUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#thresholdModUp').height()-50)/2
	var width = ($(window).width() - $('#thresholdModUp').width())/2
	
	$('#thresholdModUp').css('left',width+'px');
	$('#thresholdModUp').css('top',height+'px');
	
	$('.mu-formbox input').val('');
	
	if($('#mod_btn').hasClass('edit')){
		$('#thresholdModModify').empty();
		$('#thresholdModModify').append("<i id = 'mod_btn' class='mu-icon save'> ");
		$('#thresholdModModify').append("저장</i>");
		$('#pop_title').text("임계치 추가");
		$('#thresholdModModify').attr("onclick","javascript:thresholdCheck()");
	}
	
	inputSetting();
}

function thresholdModView() {
	viewFlag = false;
	
//	var tbl = $("#table");
//	var checkCount = $(":checkbox:not(:first)", tbl).filter(":checked").length;
//	
//	if(checkCount == 0){
//		alert("수정하고자 하는 항목을 선택해주세요");
//		return false;
//	}else if(checkCount > 1){
//		alert("수정은 한 번에 한 개의 항목만 가능합니다.");
//		return false;
//	}
	
	modifySetting();
	
	$('#thresholdModBg').show().fadeIn('fast');
	$('#thresholdModUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#thresholdModUp').height()-50)/2
	var width = ($(window).width() - $('#thresholdModUp').width())/2
	
	$('#thresholdModUp').css('left',width+'px');
	$('#thresholdModUp').css('top',height+'px');
	
	if($('#mod_btn').hasClass('save')){
		$('#thresholdModModify').empty();
		$('#thresholdModModify').append("<i id = 'mod_btn' class='mu-icon edit'> ");
		$('#thresholdModModify').append("수정</i>");
		$('#pop_title').text("임계치 수정");
		$('#thresholdModModify').attr("onclick","javascript:thresholdMod(true)");
	}
	
	inputSetting();
}

function modifySetting() {
	var tbl = $("#table");
	
	$("input:radio[name=mod_search_radio][value="+$("input:radio[name=search_radio]:checked").val()+"]").prop("checked", true);
	$('#mod_equipSelect').val($('#equipSelect option:selected').val()).attr("selected","selected");
	$('#mod_kpiSelect').val($('#kpiSelect option:selected').val()).attr("selected","selected");
	$('#mod_typeSelect').val($('#typeSelect option:selected').val()).attr("selected","selected");
	$('#mod_mobileTypeSelect').val($('#mobileTypeSelect option:selected').val()).attr("selected","selected");
	$('#mod_storageTypeSelect').val($('#storageTypeSelect option:selected').val()).attr("selected","selected");
	
	if($("input:radio[name=search_radio]:checked").val() == 0 && $('#kpiSelect option:selected').val() == 3) {
	} else if($("input:radio[name=search_radio]:checked").val() == 0) {
	} else if($("input:radio[name=search_radio]:checked").val() == 1) {
	} else {
		$('#mod_mobileTypeSelect').val($(":checkbox:not(:first)", tbl).filter(":checked").parent().parent().parent().find('td:eq(1)').data("id")).attr("selected","selected");
	}
	
	$('#mod_search_access').prop("disabled",true);
	$('#mod_search_epc').prop("disabled",true);
	$('#mod_search_phone').prop("disabled",true);
	$('#mod_search_rec').prop("disabled",true);
	$('#mod_equipSelect').prop("disabled",true);
	$('#mod_kpiSelect').prop("disabled",true);
	$('#mod_typeSelect').prop("disabled",true);
	$('#mod_mobileTypeSelect').prop("disabled",true);
	$("#mod_storageTypeSelect").prop('disabled', true);
	
	$('#mod_equipSelect').parent().addClass('disabled');
	$('#mod_kpiSelect').parent().addClass('disabled');
	$('#mod_typeSelect').parent().addClass('disabled');
	$('#mod_mobileTypeSelect').parent().addClass('disabled');
	$('#mod_storageTypeSelect').parent().addClass("disabled");
}

function addSetting() {
	$("input:radio[name=mod_search_radio][value=0]").prop("checked", true);
	$('#mod_equipSelect').val(1).attr("selected","selected");
	$('#mod_kpiSelect').val(1).attr("selected","selected");
	$('#mod_typeSelect').val(1).attr("selected","selected");
	$('#mod_mobileTypeSelect').val(2).attr("selected","selected");
	
	$('#mod_search_access').prop("disabled",false);
	$('#mod_search_epc').prop("disabled",false);
	$('#mod_search_phone').prop("disabled",false);
	$('#mod_search_rec').prop("disabled",false);
	$('#mod_kpiSelect').prop("disabled",false);
	$('#mod_typeSelect').prop("disabled",false);
	$('#mod_mobileTypeSelect').prop("disabled",false);
	
	$('#mod_equipSelect').parent().removeClass('disabled');
	$('#mod_kpiSelect').parent().removeClass('disabled');
	$('#mod_typeSelect').parent().removeClass('disabled');
	$('#mod_mobileTypeSelect').parent().removeClass('disabled');
}

function inputSetting() {
	var flag = $("input:radio[name=mod_search_radio]:checked").val();
	var equip = $('#mod_equipSelect option:selected').val();
	var kpi = $('#mod_kpiSelect option:selected').val();
	var type = $('#mod_typeSelect option:selected').val();
	var weekday = '99';
	var hourscope = '99';
	var mobileType = $('#mod_mobileTypeSelect option:selected').val();
	var succTxt = '';
	var ansTxt = '';
	
	$('.mu-formbox tr').css('display', 'none');
	
	if( flag != 0 && flag != 3 && equip == 1) {
		succTxt = '접속율';
		ansTxt = '성공율';
	} else {
		succTxt = '성공율';
		ansTxt = '완료율';
	}
	
	$('#ATT_RATE_INCR').hide();
	$('#ATT_RATE_DECR').hide();
	$('#ERAB_ATT_RATE_INCR').hide();
	$('#ERAB_ATT_RATE_DECR').hide();
	
	if(viewFlag) {
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
				
				$('#SEIZER_RATE').css('display', 'table-row');
				$('#ANS_RATE').css('display', 'table-row');
				$('#ANS_RATE_MIN_text').text(ansTxt+' Minor(이하)');
				$('#ANS_RATE_MAJ_text').text(ansTxt+' Major(이하)');
				$('#ANS_RATE_CRI_text').text(ansTxt+' Critical(이하)');
				
				$('#CD_RATE').css('display', 'table-row');
				
			} else if(kpi == "2") {	
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
				
			} else {	// Hand Over
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
	} else {
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
}

function thresholdCheck(){
	
	if(!confirm("저장하시겠습니까?")){
		return false;
	}
	
	var flag = $("input:radio[name=mod_search_radio]:checked").val();
	var equip = $('#mod_equipSelect option:selected').val();
	var kpi = $('#mod_kpiSelect option:selected').val();
	var type = $('#mod_typeSelect option:selected').val();
	var mobileType = $('#mod_mobileTypeSelect option:selected').val();
	var storageType = $('#mod_storageTypeSelect option:selected').val();
	
	var data = {
		equip : equip, 
		kpi : kpi, 
		type : type, 
		weekday : '99',
		hourscope : '99',
		flag : flag, 
		mobileType : mobileType,
		storageType: storageType
	};
	
	var requestData = JSON.stringify(data);
	
	$.ajax({
			type : 'post',
			url: '/pm/pm_setting/threshold_setting/thresholdCheck',
			contentType: 'application/json',
			dataTpye:'json',
			data : requestData,
			success: function (data) {
				if(data.thresholdCheckFlag > 0){
					alert("이미 등록된 항목입니다.")
					return false;
				}else{
					thresholdMod(false);
				}
			},
			error: function () { 
				//alert('에러발생');
			}
	}); 
	
}

function thresholdMod(check){
	
	if(check){
		if(!confirm("수정하시겠습니까?")){
			return false;
		}
	}
	
	var flag = $("input:radio[name=mod_search_radio]:checked").val();
	var equip = $('#mod_equipSelect option:selected').val();
	var kpi = $('#mod_kpiSelect option:selected').val();
	var type = $('#mod_typeSelect option:selected').val();
	var weekday = '99';
	var hourscope = '';
	var mobileType = $('#mod_mobileTypeSelect option:selected').val();
	var storageType = $('#mod_storageTypeSelect option:selected').val();
	
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
			if(succ_rate_cri >= succ_rate_maj){
				alert("접속율 Critical 임계치는 Major 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			if(succ_rate_maj >= succ_rate_min){
				alert("접속율 Major 임계치는 Minor 임계치보다 크거나 같을 수 없습니다.");
				return false;
			}
			
			
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
		ATTEMPT : attempt, ATT_RATE_MIN : att_rate_min, ATT_RATE_MAJ : att_rate_maj, ATT_RATE_CRI : att_rate_cri,
		SEIZER_RATE_MIN : seizer_rate_min, SEIZER_RATE_MAJ : seizer_rate_maj, SEIZER_RATE_CRI : seizer_rate_cri,
		ANS_RATE_MIN : ans_rate_min, ANS_RATE_MAJ : ans_rate_maj, ANS_RATE_CRI : ans_rate_cri,
		CD_RATE_MIN : cd_rate_min, CD_RATE_MAJ : cd_rate_maj, CD_RATE_CRI : cd_rate_cri,
		SUCC_RATE_MIN : succ_rate_min, SUCC_RATE_MAJ : succ_rate_maj, SUCC_RATE_CRI : succ_rate_cri,
		ATT_RATE_MIN_DECR: att_rate_decr_min, ATT_RATE_MAJ_DECR : att_rate_decr_maj, ATT_RATE_CRI_DECR : att_rate_decr_cri,
		ERAB_ATT_RATE_MIN_INCR: erab_att_rate_incr_min, ERAB_ATT_RATE_MAJ_INCR: erab_att_rate_incr_maj, ERAB_ATT_RATE_CRI_INCR: erab_att_rate_incr_cri,
		ERAB_ATT_RATE_MIN_DECR : erab_att_rate_decr_min, ERAB_ATT_RATE_MAJ_DECR: erab_att_rate_decr_maj, ERAB_ATT_RATE_CRI_DECR: erab_att_rate_decr_cri,
		
		UP_ATTEMPT:up_attempt, DW_ATTEMPT:dw_attempt,
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
		UP_DTP_MIN : up_dtp_min, UP_DTP_MAJ : up_dtp_maj, UP_DTP_CRI : up_dtp_cri,
		DW_DTP_MIN : dw_dtp_min, DW_DTP_MAJ : dw_dtp_maj, DW_DTP_CRI : dw_dtp_cri
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
				
				$('#thresholdModBg').fadeOut();
				$('#thresholdModUp').fadeOut();
				//pageSearch();
				
				alert('등록/수정 되었습니다.');
			},
			error: function () { 
				//alert('에러발생');
			}
	});
}