$(document).ready(function(){
	//ruAdd 숨기기 기능    
    $('#ruAddClose, #ruAddCancle,#ruAddBg').on('click',function(e){
		$('#ruAddBg').fadeOut();
		$('#ruAddUp').fadeOut();
	});
	
    //ruAdd Drag 지정 정의
	$( "#ruAddUp" ).draggable({'handle' : '#ruAddTitleBox'});
	$( "#ruAddUp" ).resizable({
		animate: true
	});
	
	$('#installRuAddDateTxt').datepicker({
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
	
	$('#installRuAddDateBtn').on('click',function(e){
		$('#installRuAddDateTxt').datepicker("show");
	});
});

function ruAddView(obj){
	var firstSelectOption;
	$('#ru_name_add').val('');
	$('#ru_status_add').val('1');
	$('#ru_status_add').text('사용');
	$('#ru_sector_add').val('0');
	$('#ru_port_add').val('0');
	$('#ru_sequence_add').val('0');
	
	firstSelectOption = $('#ru_vendor_add').parent().find('ul li:first');
	$('#ru_vendor_add').val(firstSelectOption.data('id'));
	$('#ru_vendor_add').text(firstSelectOption.text());

	firstSelectOption = $('#ru_team_add').parent().find('ul li:first');
	$('#ru_team_add').val(firstSelectOption.data('id'));
	$('#ru_team_add').text(firstSelectOption.text());
	
	$('#installRuAddDateTxt').val('');

	firstSelectOption = $('#ru_team_add').parent().find('ul li:first');
	$('#ru_team_add').val(firstSelectOption.data('id'));
	$('#ru_team_add').text(firstSelectOption.text());

	firstSelectOption = $('#ru_station_add').parent().find('ul li:first');
	$('#ru_station_add').val(firstSelectOption.data('id'));
	$('#ru_station_add').text(firstSelectOption.text());
	
	$('#ru_frequency_add').val('');
	$('#ru_connectType_add').val('');
	$('#ru_serialnumber_add').val('');
	$('#ru_boardType_add').val('');

	firstSelectOption = $('#ru_du_add').parent().find('ul li:first');
	$('#ru_du_add').val(firstSelectOption.data('id'));
	$('#ru_du_add').text(firstSelectOption.text());
	
	$('#ru_cellNumber_add').val('-1');
	$('#ru_locationDesc_add').val('');

	firstSelectOption = $('#ru_location_add').parent().find('ul li:first');
	$('#ru_location_add').val(firstSelectOption.data('id'));
	$('#ru_location_add').text(firstSelectOption.text());
	
	$('#ruAddBg').show().fadeIn('fast');
	$('#ruAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#ruAddUp').height()-100)/2
	var width = (screen.width - $('#ruAddUp').width())/2
	
	$('#ruAddUp').css('left',width+'px');
	$('#ruAddUp').css('top',height+'px');
	
}

function ruadd(){
	
	var ru_name = $('#ru_name_add').val();
	var opr_status = $('#ru_status_add').val();
	var sector = $('#ru_sector_add').val();
	var port_id = $('#ru_port_add').val();
	var sequence_id = $('#ru_sequence_add').val();
	var du_id = $('#ru_du_add').val();
	
	if(ru_name == '' || ru_name == null || ru_name == 'undefined'){
		alert('RU 이름을 입력해주세요.');
		return false;
	}else if(opr_status == '' || opr_status == null || opr_status == 'undefined'){
		alert('운용상태를 선택해주세요.');
		return false;
	}else if(sector == '' || sector == null || sector == 'undefined'){
		alert('Sector를 입력해주세요.');
		return false;
	}else if(port_id == '' || port_id == null || port_id == 'undefined'){
		alert('Port ID를 입력해주세요.');
		return false;
	}else if(sequence_id == '' || sequence_id == null || sequence_id == 'undefined'){
		alert('Sequence ID를 입력해주세요.');
		return false;
	}else if(du_id == '' || du_id == null || du_id == 'undefined'){
		alert('DU를 선택해주세요.');
		return false;
	}
	
	var requestData ={
			ru_name : ru_name,
			opr_status : opr_status,
			installDate : $('#installRuAddDateTxt').val()==''?null:$('#installRuAddDateTxt').val(),
			sector : sector,
			port_id : port_id,
			sequence_id : sequence_id,
			du_id : du_id,
			vendor_id : $('#ru_vendor_add').val(),
			team_id : $('#ru_team_add').val(),
			station_id : $('#ru_station_add').val(),
			frequency : $('#ru_frequency_add').val(),
			connect_ru_type : $('#ru_connectType_add').val()==''?null:$('#ru_connectType_add').val(),
			serialnumber : $('#ru_serialnumber_add').val(),
			board_type : $('#ru_boardType_add').val(),
			cell_num : $('#ru_cellNumber_add').val(),
			area_info : $('#ru_locationDesc_add').val(),
			location : $('#ru_location_add').val()
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/ru/ruAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.ruAddResult;
			if(result_code == 0){
				alert("RU 추가 성공");
				pageSearch();
			}else if(result_code == 1){
				alert("RU 추가 실패");
			}else if(result_code == 2){
				alert("RU 추가 실패");
			}
			
			$('#ruAddBg').fadeOut();
			$('#ruAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}