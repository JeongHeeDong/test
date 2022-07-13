$(document).ready(function(){
	//hssDetail 숨기기 기능    
    $('#hssAddClose, #hssAddCancle,#hssAddBg').on('click',function(e){
		$('#hssAddBg').fadeOut();
		$('#hssAddUp').fadeOut();
	});
	
    //hssAdd Drag 지정 정의
	$( "#hssAddUp" ).draggable({'handle' : '#hssAddTitleBox'});
	$( "#hssAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function hssAddView(obj){
	
	$('#hssAddBg').show().fadeIn('fast');
	$('#hssAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#hssAddUp').height()-100)/2
	var width = (screen.width - $('#hssAddUp').width())/2
	
	$('#hssAddUp').css('left',width+'px');
	$('#hssAddUp').css('top',height+'px');
	
	$('#hss_ems_nm_add').val($('#hss_ems_ul_add').children('li').eq(0).data('id'));
	$('#hss_ems_nm_add').text($('#hss_ems_ul_add').children('li').eq(0).text());
	$('#hss_vendor_nm_add').val($('#hss_vendor_ul_add').children('li').eq(0).data('id'));
	$('#hss_vendor_nm_add').text($('#hss_vendor_ul_add').children('li').eq(0).text());
	
	$('#hss_id_add').val('');
	$('#hss_name_add').val('');
	$('#installhssAddDateTxt').val('');
	checkFlag = false;
	
	
	$("#hssAddDiv").scrollTop(0);
}

function idCheck(){
	
	var hss_id = $('#hss_id_add').val();
	if(hss_id == ''){
		alert('HSS ID를 입력해주세요');
		return false;
	}
	$.ajax({
		type:'post',
		url:'/pss/epc/hss/hssIdCheck',
		dataTpye:'json',
		data : {hss_id : hss_id},
		success:function(data){
			
			var result_length = data.hssIdCheckResult;
			if(result_length > 0){
				alert("입력하신 HSS ID는 사용 불가능합니다.");
				$('#hss_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 HSS ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function hss_Add(){
	
	var hss_id = $('#hss_id_add').val()
	var hss_name = $('#hss_name_add').val()
	var ems_id = $('#hss_ems_nm_add').val()
	var vendor_id = $('#hss_vendor_nm_add').val()
	var install_date = $('#installhssAddDateTxt').val()==''?null:$('#installhssAddDateTxt').val();
	
	if(!checkFlag){
		alert('HSS ID 중복체크를 해주세요');
		return false;
	}
	
	if(hss_id == '' || hss_name == '' || ems_id == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			hss_id : hss_id,
			hss_name : hss_name,
			ems_id : ems_id,
			vendor_id : Number(vendor_id),
			install_date : install_date
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/hss/hssAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.hssAddResult;
			if(result_code > 0){
				alert("HSS 추가 성공");
				pageSearch();
			}else{
				alert("HSS 추가 실패");
			}
			
			$('#hssAddBg').fadeOut();
			$('#hssAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}