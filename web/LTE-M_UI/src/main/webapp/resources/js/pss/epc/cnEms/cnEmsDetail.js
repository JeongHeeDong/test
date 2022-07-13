$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#cnEmsDetailClose, #cnEmsDetailCancle,#cnEmsDetailBg').on('click',function(e){
		$('#cnEmsDetailBg').fadeOut();
		$('#cnEmsDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#cnEmsDetailUp" ).draggable({'handle' : '#cnEmsDetailTitleBox'});
	$( "#cnEmsDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function cnEmsDetailView(obj){
	
	$('#cnEmsDetailBg').show().fadeIn('fast');
	$('#cnEmsDetailUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#cnEmsDetailUp').height()-100)/2
	var width = (screen.width - $('#cnEmsDetailUp').width())/2
	
	$('#cnEmsDetailUp').css('left',width+'px');
	$('#cnEmsDetailUp').css('top',height+'px');
	
	$("#cnEmsDetailDiv").scrollTop(0);
	
	var cnEms_id = $(obj).text();
	$('#cnEms_Detail_hidden_id').val(cnEms_id);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/cnEms/getCnEmsDetail',
		dataTpye:'json',
		data: {
			cnEms_id : cnEms_id
		},
		success:function(data){
			var cnEmsDetailData = data.cnEmsDetailData.cnEmsDetailData;
			var cnEmsDetailGridData = data.cnEmsDetailData.cnEmsDetailGridData;
			
			$('#cnEms_Detail_id').val(cnEmsDetailData.EMS_ID);
			$('#cnEms_Detail_name').val(cnEmsDetailData.EMS_NAME);
			$('#cnEms_Detail_ip').val(cnEmsDetailData.IP_ADDRESS);
			$('#cnEms_Detail_port').val(cnEmsDetailData.PORT);
			$('#cnEms_Detail_vendor_nm').val(cnEmsDetailData.VENDOR_ID);
			$('#cnEms_Detail_vendor_nm').text(cnEmsDetailData.VENDOR_NAME);
			$('#installcnEmsDetailDateTxt').val(cnEmsDetailData.INSTALL_DATE);
			$('#updatecnEmsDetailDateTxt').val(cnEmsDetailData.UPDATE_DATE);
			
			$('#cnEmsDetailGrid').empty();
			var num = 0;
			
			$(cnEmsDetailGridData).each(function(key,value){
				num++;

				$('#cnEmsDetailGrid').append("" +
						"<tr>" +
							"<td>"+num+"</td>"+
							"<td>"+value.EQUIP_TYPE+"</td>"+
							"<td>"+value.EQUIP_ID+"</td>"+
							"<td>"+value.EQUIP_NAME+"</td>"+
						"</tr>"
				);
			});
		},
		error:function(data){
			
		}
	});
}

function cnEmsDetail_update(){
	
	if(!confirm("수정하시겠습니까?")){
		return false;
	}
	
	var ip = $('#cnEms_Detail_ip').val();
	
	if(!ip_Check(ip)){
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
		return false;
	}
	
	var data = {
			cnEms_name : $('#cnEms_Detail_name').val(),
			cnEms_id : $('#cnEms_Detail_id').val(),
			ip : ip,
			port : $('#cnEms_Detail_port').val(),
			vendor_id : $('#cnEms_Detail_vendor_nm').val(),
			install_date : $('#installcnEmsDetailDateTxt').val(),
			update_date : $('#updatecnEmsDetailDateTxt').val(),
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/epc/cnEms/cnEmsDetailupdate',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.cnEmsDetailResult;
			if(result_code > 0){
				alert("수정 성공");
				pageSearch();
			}else{
				alert("수정 실패");
			}
			
			$('#cnEmsDetailBg').fadeOut();
			$('#cnEmsDetailUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}