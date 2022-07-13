$(document).ready(function(){
	//mmeDetail 숨기기 기능    
    $('#epcAddClose, #epcAddCancle,#epcAddBg').on('click',function(e){
		$('#epcAddBg').fadeOut();
		$('#epcAddUp').fadeOut();
	});
	
    //mmeAdd Drag 지정 정의
	$( "#epcAddUp" ).draggable({'handle' : '#epcAddTitleBox'});
	$( "#epcAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function epcAddView(obj){
	
	$('#epcAddBg').show().fadeIn('fast');
	$('#epcAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#epcAddUp').height()-100)/2
	var width = (screen.width - $('#epcAddUp').width())/2
	
	$('#epcAddUp').css('left',width+'px');
	$('#epcAddUp').css('top',height+'px');
	
	$('#epc_type_nm_add').val($('#epc_type_ul_add').children('li').eq(0).data('id'));
	$('#epc_type_nm_add').text($('#epc_type_ul_add').children('li').eq(0).text());
	$('#epc_ems_nm_add').val($('#epc_ems_ul_add').children('li').eq(0).data('id'));
	$('#epc_ems_nm_add').text($('#epc_ems_ul_add').children('li').eq(0).text());
	$('#epc_vendor_nm_add').val($('#epc_vendor_ul_add').children('li').eq(0).data('id'));
	$('#epc_vendor_nm_add').text($('#epc_vendor_ul_add').children('li').eq(0).text());
	
	$('#epc_id_add').val('');
	$('#epc_name_add').val('');
	$('#installepcAddDateTxt').val('');
	checkFlag = false;
	
	
	$("#epcAddDiv").scrollTop(0);
}

function idCheck(){
	
	var epc_id = $('#epc_id_add').val();
	if(epc_id == ''){
		alert('장비 ID를 입력해주세요.');
		return false;
	}
	
	var type = $('#epc_type_nm_add').val();
	
	var requestData = {epc_id : epc_id, type : type};
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/epcIdCheck',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_length = data.epcIdCheckResult;
			if(result_length > 0){
				alert("입력하신 장비 ID는 사용 불가능합니다.");
				$('#epc_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 장비 ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function epc_Add(){
	
	var epc_id = $('#epc_id_add').val();
    var epc_ip = $('#epc_ip_add').val();
	var epc_name = $('#epc_name_add').val();
	var ems_id = $('#epc_ems_nm_add').val();
	var vendor_id = $('#epc_vendor_nm_add').val();
	var install_date = $('#installepcAddDateTxt').val()==''?null:$('#installepcAddDateTxt').val();
	var type = $('#epc_type_nm_add').val();
	
	if(!checkFlag){
		alert('장비 ID 중복체크를 해주세요');
		return false;
	}
	
	if(epc_id == '' || epc_name == '' || ems_id == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			epc_id : epc_id,
			epc_ip : epc_ip,
			epc_name : epc_name,
			ems_id : ems_id,
			vendor_id : Number(vendor_id),
			install_date : install_date,
			type : type
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/epcAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.epcAddResult;
			if(result_code > 0){
				alert("장비 추가 성공");
				pageSearch();
			}else{
				alert("장비 추가 실패");
			}
			
			$('#epcAddBg').fadeOut();
			$('#epcAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}