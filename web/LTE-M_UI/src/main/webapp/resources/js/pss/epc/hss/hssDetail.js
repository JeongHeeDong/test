$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#hssDetailClose, #hssDetailCancle,#hssDetailBg').on('click',function(e){
		$('#hssDetailBg').fadeOut();
		$('#hssDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#hssDetailUp" ).draggable({'handle' : '#hssDetailTitleBox'});
	$( "#hssDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function hssDetailView(obj){
	
	$('#hssDetailBg').show().fadeIn('fast');
	$('#hssDetailUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#hssDetailUp').height()-100)/2
	var width = (screen.width - $('#hssDetailUp').width())/2
	
	$('#hssDetailUp').css('left',width+'px');
	$('#hssDetailUp').css('top',height+'px');
	
	$("#hssDetailDiv").scrollTop(0);
	
	var hss_id = $(obj).text();
	$('#hss_Detail_hidden_id').val(hss_id);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/getHssDetail',
		dataTpye:'json',
		data: {
			hss_id : hss_id
		},
		success:function(data){
			
			$('#hss_Detail_id').val(data.hssDetailData.HSS_ID);
			$('#hss_Detail_name').val(data.hssDetailData.HSS_NAME);
			$('#hss_Detail_ems_nm').val(data.hssDetailData.EMS_ID);
			$('#hss_Detail_ems_nm').text(data.hssDetailData.EMS_NAME);
			$('#hss_Detail_vendor_nm').val(data.hssDetailData.VENDOR_ID);
			$('#hss_Detail_vendor_nm').text(data.hssDetailData.VENDOR_NAME);
			$('#installhssDetailDateTxt').val(data.hssDetailData.INSTALL_DATE);
			$('#updatehssDetailDateTxt').val(data.hssDetailData.UPDATE_DATE);
			$('#hss_Detail_ip').val(data.hssDetailData.IP);
			
			
		},
		error:function(data){
			
		}
	});
}

function hssDetail_update(){
	
	if(!confirm("수정하시겠습니까?")){
		return false;
	}
	
	var ip = $('#hss_Detail_ip').val();
	
	if(ip_Check(ip)){
		
	}else{
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
		return false;
	}
	
	var data = {
			hss_name : $('#hss_Detail_name').val(),
			ems_id : $('#hss_Detail_ems_nm').val(),
			vendor_id : $('#hss_Detail_vendor_nm').val(),
			install_date : $('#installhssDetailDateTxt').val(),
			update_date : $.datepicker.formatDate('yy-mm-dd', new Date()),
			hss_id :  $('#hss_Detail_hidden_id').val(),
			ip : ip
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/hssDetailupdate',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.hssDetailResult;
			if(result_code > 0){
				alert("수정 성공");
				pageSearch();
			}else{
				alert("수정 실패");
			}
			
			$('#hssDetailBg').fadeOut();
			$('#hssDetailUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}