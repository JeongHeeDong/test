var checkFlag = false;

$(document).ready(function(){
	//duAdd 숨기기 기능    
    $('#duAddClose, #duAddCancle,#duAddBg').on('click',function(e){
		$('#duAddBg').fadeOut();
		$('#duAddUp').fadeOut();
	});
	
    //duAdd Drag 지정 정의
	$( "#duAddUp" ).draggable({'handle' : '#duAddTitleBox'});
	$( "#duAddUp" ).resizable({
		animate: true
	});
	
	$('#installDuAddDateTxt').datepicker({
		dateFormat: 'yy-mm-dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dateFormat: 'yy-mm-dd'
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});
	
	$('#installDuAddDateBtn').on('click',function(e){
		$('#installDuAddDateTxt').datepicker("show");
	});
	
	$('#du_id_add,#du_masterIp_add,#du_onmIp_add,#du_masterIp2_add').attr("onkeypress","return fn_press(event,'float')");
});

function duAddView(obj){
	checkFlag = false;
	var firstSelectOption;
	
	$('#du_id_add').val('');
	$('#du_name_add').val('');
	$('#installDuAddDateTxt').val('');
	$('#du_area_add').val('');
	$('#du_masterIp_add').val('');
	$('#du_onmIp_add').val('');
	$('#du_group_add').val('');
	$('#du_masterIp2_add').val('');
	$('#du_version_add').val('');
	$('#du_line_add').val('');

	firstSelectOption = $('#du_station_add').parent().find('ul li:first');
	$('#du_station_add').val(firstSelectOption.data('id'));
	$('#du_station_add').text(firstSelectOption.text());

	firstSelectOption = $('#du_team_add').parent().find('ul li:first');
	$('#du_team_add').val(firstSelectOption.data('id'));
	$('#du_team_add').text(firstSelectOption.text());

	firstSelectOption = $('#du_vendor_add').parent().find('ul li:first');
	$('#du_vendor_add').val(firstSelectOption.data('id'));
	$('#du_vendor_add').text(firstSelectOption.text());

	firstSelectOption = $('#du_ems_add').parent().find('ul li:first');
	$('#du_ems_add').val(firstSelectOption.data('id'));
	$('#du_ems_add').text(firstSelectOption.text());
	
//	firstSelectOption = $('#du_line_add').parent().find('ul li:first');
//	$('#du_line_add').val(firstSelectOption.data('id'));
//	$('#du_line_add').text(firstSelectOption.text());
	
	$('#du_status_add').val('1');
	$('#du_status_add').text('사용');
	
//	document.getElementsByName("file_obj")[0].form.reset();
	$('#duAddBg').show().fadeIn('fast');
	$('#duAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#duAddUp').height()-100)/2
	var width = (screen.width - $('#duAddUp').width())/2
	
	$('#duAddUp').css('left',width+'px');
	$('#duAddUp').css('top',height+'px');
}

function idCheck(){
	var du_id = $('#du_id_add').val();
	
	if(du_id == '' || du_id == null || du_id == 'undefined'){
		alert('DU ID를 입력해주세요.');
		return false;
	}
	
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/du/duIdCheck',
		dataTpye:'json',
		data : {du_id : du_id},
		success:function(data){
			
			var result_length = data.duIdCheckResult;
			if(result_length > 0){
				alert("입력하신 DU ID는 사용 불가능합니다.");
				$('#du_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 DU ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
}

function duadd(){
	
	var du_name = $('#du_name_add').val();
	var master_ip = $('#du_masterIp_add').val();
	var opr_status = $('#du_status_add').val();
//	var line_id = $('#du_line_add').val();
	
	if(!checkFlag){
		alert('DU ID 중복 체크를 해주세요.');
		return false;
	}else if(du_name == '' || du_name == null || du_name == 'undefined'){
		alert('DU 이름을 입력해주세요.');
		return false;
	}else if(master_ip == '' || master_ip == null || master_ip == 'undefined'){
		alert('Master IP를 입력해주세요.');
		return false;
	}else if(opr_status == '' || opr_status == null || opr_status == 'undefined'){
		alert('운용상태를 입력해주세요.');
		return false;
	}else if(!ip_Check(master_ip)){
		alert('Master IP를 올바른 형식으로 입력해주세요.');
		return false;
	}
//	else if(line_id == '' || line_id == null || line_id == 'undefined'){
//		alert('호선을 선택해주세요.');
//		return false;
//	}
	
	if($('#du_onmIp_add').val() != ''){
		if(!ip_Check($('#du_onmIp_add').val())){
			alert('ONM IP를 올바른 형식으로 입력해주세요.');
			return false;
		}
	}
	if($('#du_masterIp2_add').val() != ''){
		if(!ip_Check($('#du_onmIp_add').val())){
			alert('ONM IP를 올바른 형식으로 입력해주세요.');
			return false;
		}
	}
	
	var requestData ={
			du_id : $('#du_id_add').val(),
			du_name : du_name,
			installDate : $('#installDuAddDateTxt').val()==''?null:$('#installDuAddDateTxt').val(),
			area_info : $('#du_area_add').val(),
			master_ip : master_ip,
			onm_ip : $('#du_onmIp_add').val(),
			du_group : $('#du_group_add').val(),
			master_ip2 : $('#du_masterIp2_add').val(),
			du_version : $('#du_version_add').val(),
			station_id : $('#du_station_add').val(),
			team_id : $('#du_team_add').val(),
			vendor_id : $('#du_vendor_add').val(),
			ems_id : $('#du_ems_add').val(),
			opr_status : opr_status,
//			line_id : line_id
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/du/duAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.duAddResult;
			if(result_code == 0){
				alert("DU 추가 성공");
				pageSearch();
			}else if(result_code == 1){
				alert("DU 추가 실패");
			}else if(result_code == 2){
				alert("DU 추가 실패");
			}
			
			$('#duAddBg').fadeOut();
			$('#duAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}