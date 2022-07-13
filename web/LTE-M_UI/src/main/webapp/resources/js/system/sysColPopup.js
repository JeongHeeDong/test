function initPopup(){
    $('#colSetClose, #colSetCancel,#colSetBg').on('click',function(e){
		$('#colSetBg').fadeOut();
		$('#colSetUp').fadeOut();
	});
	
	$( "#colSetUp" ).draggable({'handle' : '#colSetTitleBox'});
//	$( "#colSetUp" ).resizable({
//		//minWidth: 800,
//		//minHeight: 400,
//		animate: true
//	});
	
	$('[name="inp_time"]').keyup(function(){
		this.value=this.value.replace(/[^0-9]/g,'');
	});
}

function showSettingPopup() {	
	$('#colSetBg').show().fadeIn('fast');
	$('#colSetUp').show().fadeIn('fast'); 

	var height = (screen.height - $('#colSetUp').height()-100)/2
	var width = (screen.width - $('#colSetUp').width())/2
	
	$('#colSetUp').css('left',width+'px');
	$('#colSetUp').css('top',height+'px');
	
	$("#colSetDiv").scrollTop(0); 	
	
	$.each(colthd, function(index,val){
		if(val.COLLECT_TYPE == 2) $('#min').val(colthd[index].COLLECT_THD);
		else if(val.COLLECT_TYPE == 3) $('#hour').val(colthd[index].COLLECT_THD);
		else if(val.COLLECT_TYPE == 4) $('#day').val(colthd[index].COLLECT_THD);
	});
}


function updateTHD() {			
	var id = $('#userId').val();
	var min = $('#min').val();
	var hour = $('#hour').val();
	var day = $('#day').val();
	
	var invalid = false;
	$.each($('#colSetDiv').find('input'), function(i, v){
		if ( $(v).val().length == 0 ) {
			invalid = true;
			return;
		}
	});
	
	if ( invalid ) {
		alert('임계치 설정값은 반드시 모두 입력되어야 합니다.');
		return;
	}
	
	var optionData = {
		userId : id,
		min : min,
		hour : hour,
		day : day
	};
		
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/system/sysColManager/updateTHD',
		contentType: 'application/json',
		data: requestData,
		dataType: 'json',
		success: function (data) {
			if ( data.result == 'SUCCESS' ) {
				alert('수정된 정보를 저장하였습니다.');
				location.reload();
			} else {
				alert('에러 발생 : ' + data.msg);				
			}
		},
		error: function () { 
		   //alert('에러 발생');
		}
	});
}


