$(document).ready(function(){
	//cnEmsDetail 숨기기 기능    
    $('#cnEmsAddClose, #cnEmsAddCancle,#cnEmsAddBg').on('click',function(e){
		$('#cnEmsAddBg').fadeOut();
		$('#cnEmsAddUp').fadeOut();
	});
	
    //cnEmsAdd Drag 지정 정의
	$( "#cnEmsAddUp" ).draggable({'handle' : '#cnEmsAddTitleBox'});
	$( "#cnEmsAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function cnEmsAddView(obj){
	
	$('#cnEmsAddBg').show().fadeIn('fast');
	$('#cnEmsAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#cnEmsAddUp').height()-100)/2
	var width = (screen.width - $('#cnEmsAddUp').width())/2
	
	$('#cnEmsAddUp').css('left',width+'px');
	$('#cnEmsAddUp').css('top',height+'px');
	
	$('#cnEms_vendor_nm_add').val($('#cnEms_vendor_ul_add').children('li').eq(0).data('id'));
	$('#cnEms_vendor_nm_add').text($('#cnEms_vendor_ul_add').children('li').eq(0).text());
	
	$('#cnEms_name_add').val('');
	$('#installcnEmsAddDateTxt').val('');
	checkFlag = false;
	
	$("#cnEmsAddDiv").scrollTop(0);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/cnEms/maxID',
		dataTpye:'json',
		success:function(data){
			
			var max_id = data.getMaxId.MAXID;
			
			$('#cnEms_id_add').val(max_id.MAX_ID);
		},
		error:function(data){
			
		}
	});
	
}

function idCheck(){
	
	var cnEms_id = $('#cnEms_id_add').val();
//	if(cnEms_id.length != 4){
//		alert('CN-EMS ID는 숫자 4자리로 입력해야 합니다.');
//		return false;
//	}
	$.ajax({
		type:'post',
		url:'/pss/epc/cnEms/cnEmsIdCheck',
		dataTpye:'json',
		data : {cnEms_id : cnEms_id},
		success:function(data){
			
			var result_length = data.cnEmsIdCheckResult;
			if(result_length > 0){
				alert("입력하신 CN-EMS ID는 사용 불가능합니다.");
				$('#cnEms_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 CN-EMS ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function cnEms_Add(){
	
	var cnEms_id = $('#cnEms_id_add').val();
	var cnEms_name = $('#cnEms_name_add').val();
	var ip =  $('#cnEms_ip_add').val();
	var port =  $('#cnEms_port_add').val();
	var vendor_id = $('#cnEms_vendor_nm_add').val();
	var install_date = $('#installcnEmsAddDateTxt').val();
	
	if(!checkFlag){
		alert('CN-EMS ID 중복체크를 해주세요');
		return false;
	}
	
	if(!ip_Check(ip)){
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.");
		return false;
	}
	
	if(cnEms_id == '' && cnEms_name == '' && ip == '' && port == '' && vendor_id == '' && install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			cnEms_id : cnEms_id,
			cnEms_name : cnEms_name,
			ip : ip,
			port : port,
			vendor_id : Number(vendor_id),
			install_date : install_date
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/cnEms/cnEmsAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.cnEmsAddResult;
			if(result_code > 0){
				alert("CN-EMS 추가 성공");
				pageSearch();
			}else{
				alert("CN-EMS 추가 실패");
			}
			
			$('#cnEmsAddBg').fadeOut();
			$('#cnEmsAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}