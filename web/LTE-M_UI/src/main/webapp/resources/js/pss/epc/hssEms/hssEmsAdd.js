$(document).ready(function(){
	//hssEmsDetail 숨기기 기능    
    $('#hssEmsAddClose, #hssEmsAddCancle,#hssEmsAddBg').on('click',function(e){
		$('#hssEmsAddBg').fadeOut();
		$('#hssEmsAddUp').fadeOut();
	});
	
    //hssEmsAdd Drag 지정 정의
	$( "#hssEmsAddUp" ).draggable({'handle' : '#hssEmsAddTitleBox'});
	$( "#hssEmsAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function hssEmsAddView(obj){
	
	$('#hssEmsAddBg').show().fadeIn('fast');
	$('#hssEmsAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#hssEmsAddUp').height()-100)/2
	var width = (screen.width - $('#hssEmsAddUp').width())/2
	
	$('#hssEmsAddUp').css('left',width+'px');
	$('#hssEmsAddUp').css('top',height+'px');
	
	$('#hssEms_vendor_nm_add').val($('#hssEms_vendor_ul_add').children('li').eq(0).data('id'));
	$('#hssEms_vendor_nm_add').text($('#hssEms_vendor_ul_add').children('li').eq(0).text());
	
	$('#hssEms_name_add').val('');
	$('#installhssEmsAddDateTxt').val('');
	checkFlag = false;
	
	$("#hssEmsAddDiv").scrollTop(0);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/hssEms/maxID',
		dataTpye:'json',
		success:function(data){
			
			var max_id = data.getMaxId.MAXID;
			
			$('#hssEms_id_add').val(max_id.MAX_ID);
		},
		error:function(data){
			
		}
	});
}

function idCheck(){
	
	var hssEms_id = $('#hssEms_id_add').val();
//	if(hssEms_id.length != 4){
//		alert('HSS-EMS ID는 숫자 4자리로 입력해야 합니다.');
//		return false;
//	}
	$.ajax({
		type:'post',
		url:'/pss/epc/hssEms/hssEmsIdCheck',
		dataTpye:'json',
		data : {hssEms_id : hssEms_id},
		success:function(data){
			
			var result_length = data.hssEmsIdCheckResult;
			if(result_length > 0){
				alert("입력하신 HSS-EMS ID는 사용 불가능합니다.");
				$('#hssEms_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 HSS-EMS ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function hssEms_Add(){
	
	var hssEms_id = $('#hssEms_id_add').val();
	var hssEms_name = $('#hssEms_name_add').val();
	var ip =  $('#hssEms_ip_add').val();
	var port =  $('#hssEms_port_add').val();
	var vendor_id = $('#hssEms_vendor_nm_add').val();
	var install_date = $('#installhssEmsAddDateTxt').val();
	
	if(!checkFlag){
		alert('HSS-EMS ID 중복체크를 해주세요');
		return false;
	}
	
	if(!ip_Check(ip)){
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.");
		return false;
	}
	
	if(hssEms_id == '' && hssEms_name == '' && ip == '' && port == '' && vendor_id == '' && install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			hssEms_id : hssEms_id,
			hssEms_name : hssEms_name,
			ip : ip,
			port : port,
			vendor_id : Number(vendor_id),
			install_date : install_date
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/hssEms/hssEmsAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.hssEmsAddResult;
			if(result_code > 0){
				alert("HSS-EMS 추가 성공");
				pageSearch();
			}else{
				alert("HSS-EMS 추가 실패");
			}
			
			$('#hssEmsAddBg').fadeOut();
			$('#hssEmsAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}