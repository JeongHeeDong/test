$(document).ready(function(){
	//pcrfDetail 숨기기 기능    
    $('#pcrfAddClose, #pcrfAddCancle,#pcrfAddBg').on('click',function(e){
		$('#pcrfAddBg').fadeOut();
		$('#pcrfAddUp').fadeOut();
	});
	
    //pcrfAdd Drag 지정 정의
	$( "#pcrfAddUp" ).draggable({'handle' : '#pcrfAddTitleBox'});
	$( "#pcrfAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function pcrfAddView(obj){
	
	$('#pcrfAddBg').show().fadeIn('fast');
	$('#pcrfAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#pcrfAddUp').height()-100)/2
	var width = (screen.width - $('#pcrfAddUp').width())/2
	
	$('#pcrfAddUp').css('left',width+'px');
	$('#pcrfAddUp').css('top',height+'px');
	
	$('#pcrf_ems_nm_add').val($('#pcrf_ems_ul_add').children('li').eq(0).data('id'));
	$('#pcrf_ems_nm_add').text($('#pcrf_ems_ul_add').children('li').eq(0).text());
	$('#pcrf_vendor_nm_add').val($('#pcrf_vendor_ul_add').children('li').eq(0).data('id'));
	$('#pcrf_vendor_nm_add').text($('#pcrf_vendor_ul_add').children('li').eq(0).text());
	
	$('#pcrf_id_add').val('');
	$('#pcrf_name_add').val('');
	$('#installpcrfAddDateTxt').val('');
	checkFlag = false;
	
	
	$("#pcrfAddDiv").scrollTop(0);
}

function idCheck(){
	
	var pcrf_id = $('#pcrf_id_add').val();
	if(pcrf_id == ''){
		alert('PCRF ID를 입력해주세요.');
		return false;
	}
	$.ajax({
		type:'post',
		url:'/pss/epc/pcrf/pcrfIdCheck',
		dataTpye:'json',
		data : {pcrf_id : pcrf_id},
		success:function(data){
			
			var result_length = data.pcrfIdCheckResult;
			if(result_length > 0){
				alert("입력하신 PCRF ID는 사용 불가능합니다.");
				$('#pcrf_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 PCRF ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function pcrf_Add(){
	
	var pcrf_id = $('#pcrf_id_add').val()
	var pcrf_name = $('#pcrf_name_add').val()
	var ems_id = $('#pcrf_ems_nm_add').val()
	var vendor_id = $('#pcrf_vendor_nm_add').val()
	var install_date = $('#installpcrfAddDateTxt').val()==''?null:$('#installpcrfAddDateTxt').val();
	
	if(!checkFlag){
		alert('PCRF ID 중복체크를 해주세요');
		return false;
	}
	
	if(pcrf_id == '' || pcrf_name == '' || ems_id == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			pcrf_id : pcrf_id,
			pcrf_name : pcrf_name,
			ems_id : ems_id,
			vendor_id : Number(vendor_id),
			install_date : install_date
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/pcrf/pcrfAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.pcrfAddResult;
			if(result_code > 0){
				alert("PCRF 추가 성공");
				pageSearch();
			}else{
				alert("PCRF 추가 실패");
			}
			
			$('#pcrfAddBg').fadeOut();
			$('#pcrfAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}