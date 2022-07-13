$(document).ready(function(){
	//emsDetail 숨기기 기능    
    $('#emsAddClose, #emsAddCancle,#emsAddBg').on('click',function(e){
		$('#emsAddBg').fadeOut();
		$('#emsAddUp').fadeOut();
	});
	
    //emsAdd Drag 지정 정의
	$( "#emsAddUp" ).draggable({'handle' : '#emsAddTitleBox'});
	$( "#emsAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function emsAddView(obj){
	
	$('#emsAddBg').show().fadeIn('fast');
	$('#emsAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#emsAddUp').height()-100)/2
	var width = (screen.width - $('#emsAddUp').width())/2
	
	$('#emsAddUp').css('left',width+'px');
	$('#emsAddUp').css('top',height+'px');
	
	$('#ems_vendor_nm_add').val($('#ems_vendor_ul_add').children('li').eq(0).data('id'));
	$('#ems_vendor_nm_add').text($('#ems_vendor_ul_add').children('li').eq(0).text());
	
	$('#ems_name_add').val('');
	$('#installemsAddDateTxt').val('');
	$('#ems_id_add').val('');
	checkFlag = false;
	
	$("#emsAddDiv").scrollTop(0);
	
//	$.ajax({
//		type:'post',
//		url:'/pss/ems/info/maxID',
//		dataTpye:'json',
//		success:function(data){
//			
//			var max_id = data.getMaxId.MAXID;
//			
//			$('#ems_id_add').val(max_id.MAX_ID);
//		},
//		error:function(data){
//			
//		}
//	});
}

function idCheck(){
	
	var ems_id = $('#ems_id_add').val();
	if(ems_id == ''){
		alert('EMS ID를 입력해주세요.');
		return false;
	}
	$.ajax({
		type:'post',
		url:'/pss/ems/info/emsIdCheck',
		dataTpye:'json',
		data : {ems_id : ems_id},
		success:function(data){
			
			var result_length = data.emsIdCheckResult;
			if(result_length > 0){
				alert("입력하신 EMS ID는 사용 불가능합니다.");
				$('#ems_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 EMS ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function ems_Add(){
	
	
	
	var ems_id = $('#ems_id_add').val();
	var ems_name = $('#ems_name_add').val();
	var equip_type = $('#emsSelect_detail option:selected').val();
	var ip =  $('#ems_ip_add').val();
	var port =  $('#ems_port_add').val();
	var vendor_id = $('#ems_vendor_nm_add').val();
	var install_date = $('#installemsAddDateTxt').val()==''?null:$('#installemsAddDateTxt').val();
	
	if(!checkFlag){
		alert('EMS ID 중복체크를 해주세요');
		return false;
	}
	
	if(!ip_Check(ip)){
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
		return false;
	}
	
	if(ems_id == '' || ems_name == '' || ip == '' || port == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			ems_id : ems_id,
			ems_name : ems_name,
			ip : ip,
			port : port,
			vendor_id : Number(vendor_id),
			install_date : install_date,
			equip_type : equip_type
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/ems/info/emsAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.emsAddResult;
			if(result_code > 0){
				alert("EMS 추가 성공");
				pageSearch();
			}else{
				alert("EMS 추가 실패");
			}
			
			$('#emsAddBg').fadeOut();
			$('#emsAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}