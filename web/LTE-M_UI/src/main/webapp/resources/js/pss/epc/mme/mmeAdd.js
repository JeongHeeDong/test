$(document).ready(function(){
	//mmeDetail 숨기기 기능    
    $('#mmeAddClose, #mmeAddCancle,#mmeAddBg').on('click',function(e){
		$('#mmeAddBg').fadeOut();
		$('#mmeAddUp').fadeOut();
	});
	
    //mmeAdd Drag 지정 정의
	$( "#mmeAddUp" ).draggable({'handle' : '#mmeAddTitleBox'});
	$( "#mmeAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function mmeAddView(obj){
	
	$('#mmeAddBg').show().fadeIn('fast');
	$('#mmeAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#mmeAddUp').height()-100)/2
	var width = (screen.width - $('#mmeAddUp').width())/2
	
	$('#mmeAddUp').css('left',width+'px');
	$('#mmeAddUp').css('top',height+'px');
	
	$('#mme_ems_nm_add').val($('#mme_ems_ul_add').children('li').eq(0).data('id'));
	$('#mme_ems_nm_add').text($('#mme_ems_ul_add').children('li').eq(0).text());
	$('#mme_vendor_nm_add').val($('#mme_vendor_ul_add').children('li').eq(0).data('id'));
	$('#mme_vendor_nm_add').text($('#mme_vendor_ul_add').children('li').eq(0).text());
	
	$('#mme_id_add').val('');
	$('#mme_name_add').val('');
	$('#installMmeAddDateTxt').val('');
	checkFlag = false;
	
	
	$("#mmeAddDiv").scrollTop(0);
}

function idCheck(){
	
	var mme_id = $('#mme_id_add').val();
	if(mme_id == ''){
		alert('MME ID를 입력해주세요.');
		return false;
	}
	$.ajax({
		type:'post',
		url:'/pss/epc/mme/mmeIdCheck',
		dataTpye:'json',
		data : {mme_id : mme_id},
		success:function(data){
			
			var result_length = data.mmeIdCheckResult;
			if(result_length > 0){
				alert("입력하신 MME ID는 사용 불가능합니다.");
				$('#mme_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 MME ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function mme_Add(){
	
	var mme_id = $('#mme_id_add').val()
	var mme_name = $('#mme_name_add').val()
	var ems_id = $('#mme_ems_nm_add').val()
	var vendor_id = $('#mme_vendor_nm_add').val()
	var install_date = $('#installMmeAddDateTxt').val()==''?null:$('#installMmeAddDateTxt').val();
	
	if(!checkFlag){
		alert('MME ID 중복체크를 해주세요');
		return false;
	}
	
	if(mme_id == '' || mme_name == '' || ems_id == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			mme_id : mme_id,
			mme_name : mme_name,
			ems_id : ems_id,
			vendor_id : Number(vendor_id),
			install_date : install_date
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/mme/mmeAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.mmeAddResult;
			if(result_code > 0){
				alert("MME 추가 성공");
				pageSearch();
			}else{
				alert("MME 추가 실패");
			}
			
			$('#mmeAddBg').fadeOut();
			$('#mmeAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}