$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#hssEmsDetailClose, #hssEmsDetailCancle,#hssEmsDetailBg').on('click',function(e){
		$('#hssEmsDetailBg').fadeOut();
		$('#hssEmsDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#hssEmsDetailUp" ).draggable({'handle' : '#hssEmsDetailTitleBox'});
	$( "#hssEmsDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function hssEmsDetailView(obj){
	
	$('#hssEmsDetailBg').show().fadeIn('fast');
	$('#hssEmsDetailUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#hssEmsDetailUp').height()-100)/2
	var width = (screen.width - $('#hssEmsDetailUp').width())/2
	
	$('#hssEmsDetailUp').css('left',width+'px');
	$('#hssEmsDetailUp').css('top',height+'px');
	
	$("#hssEmsDetailDiv").scrollTop(0);
	
	var hssEms_id = $(obj).text();
	$('#hssEms_Detail_hidden_id').val(hssEms_id);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/hssEms/getHssEmsDetail',
		dataTpye:'json',
		data: {
			hssEms_id : hssEms_id
		},
		success:function(data){
			$('#hssEms_Detail_id').val(data.hssEmsDetailData.EMS_ID);
			$('#hssEms_Detail_name').val(data.hssEmsDetailData.EMS_NAME);
			$('#hssEms_Detail_ip').val(data.hssEmsDetailData.IP_ADDRESS);
			$('#hssEms_Detail_port').val(data.hssEmsDetailData.PORT);
			$('#hssEms_Detail_vendor_nm').val(data.hssEmsDetailData.VENDOR_ID);
			$('#hssEms_Detail_vendor_nm').text(data.hssEmsDetailData.VENDOR_NAME);
			$('#installhssEmsDetailDateTxt').val(data.hssEmsDetailData.INSTALL_DATE);
			$('#updatehssEmsDetailDateTxt').val(data.hssEmsDetailData.UPDATE_DATE);
		},
		error:function(data){
			
		}
	});
}

function hssEmsDetail_update(){
	
	if(!confirm("수정하시겠습니까?")){
		return false;
	}
	
	var ip = $('#hssEms_Detail_ip').val();
	
	if(!ip_Check(ip)){
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.");
		return false;
	}
	
	var data = {
			hssEms_name : $('#hssEms_Detail_name').val(),
			hssEms_id : $('#hssEms_Detail_id').val(),
			ip : ip,
			port : $('#hssEms_Detail_port').val(),
			vendor_id : $('#hssEms_Detail_vendor_nm').val(),
			install_date : $('#installhssEmsDetailDateTxt').val(),
			update_date : $('#updatehssEmsDetailDateTxt').val(),
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/hssEms/hssEmsDetailupdate',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.hssEmsDetailResult;
			if(result_code > 0){
				alert("수정 성공");
				pageSearch();
			}else{
				alert("수정 실패");
			}
			
			$('#hssEmsDetailBg').fadeOut();
			$('#hssEmsDetailUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}