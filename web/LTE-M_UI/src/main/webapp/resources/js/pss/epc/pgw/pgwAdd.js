$(document).ready(function(){
	//pgwDetail 숨기기 기능    
    $('#pgwAddClose, #pgwAddCancle,#pgwAddBg').on('click',function(e){
		$('#pgwAddBg').fadeOut();
		$('#pgwAddUp').fadeOut();
	});
	
    //pgwAdd Drag 지정 정의
	$( "#pgwAddUp" ).draggable({'handle' : '#pgwAddTitleBox'});
	$( "#pgwAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});


//중복체크 여부
var checkFlag = false;
function pgwAddView(obj){
	
	$('#pgwAddBg').show().fadeIn('fast');
	$('#pgwAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#pgwAddUp').height()-100)/2
	var width = (screen.width - $('#pgwAddUp').width())/2
	
	$('#pgwAddUp').css('left',width+'px');
	$('#pgwAddUp').css('top',height+'px');
	
	$('#pgw_ems_nm_add').val($('#pgw_ems_ul_add').children('li').eq(0).data('id'));
	$('#pgw_ems_nm_add').text($('#pgw_ems_ul_add').children('li').eq(0).text());
	$('#pgw_vendor_nm_add').val($('#pgw_vendor_ul_add').children('li').eq(0).data('id'));
	$('#pgw_vendor_nm_add').text($('#pgw_vendor_ul_add').children('li').eq(0).text());
	
	$('#pgw_id_add').val('');
	$('#pgw_name_add').val('');
	$('#installpgwAddDateTxt').val('');
	checkFlag = false;
	
	
	$("#pgwAddDiv").scrollTop(0);
}

function idCheck(){
	
	var pgw_id = $('#pgw_id_add').val();
	if(pgw_id == ''){
		alert('GW ID를 입력해주세요.');
		return false;
	}
	$.ajax({
		type:'post',
		url:'/pss/epc/pgw/pgwIdCheck',
		dataTpye:'json',
		data : {pgw_id : pgw_id},
		success:function(data){
			
			var result_length = data.pgwIdCheckResult;
			if(result_length > 0){
				alert("입력하신 GW ID는 사용 불가능합니다.");
				$('#pgw_id_add').val('');
				checkFlag = false;
			}else{
				alert("입력하신 GW ID는 사용 가능합니다.");
				checkFlag = true;
			}
		},
		error:function(data){
			
		}
	});
	
}

function pgw_Add(){
	
	var pgw_id = $('#pgw_id_add').val()
	var pgw_name = $('#pgw_name_add').val()
	var ems_id = $('#pgw_ems_nm_add').val()
	var vendor_id = $('#pgw_vendor_nm_add').val()
	var install_date = $('#installpgwAddDateTxt').val()==''?null:$('#installpgwAddDateTxt').val();
	
	if(!checkFlag){
		alert('GW ID 중복체크를 해주세요');
		return false;
	}
	
	if(pgw_id == '' || pgw_name == '' || ems_id == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	var data = {
			pgw_id : pgw_id,
			pgw_name : pgw_name,
			ems_id : ems_id,
			vendor_id : Number(vendor_id),
			install_date : install_date
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/pgw/pgwAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.pgwAddResult;
			if(result_code > 0){
				alert("GW 추가 성공");
				pageSearch();
			}else{
				alert("GW 추가 실패");
			}
			
			$('#pgwAddBg').fadeOut();
			$('#pgwAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}