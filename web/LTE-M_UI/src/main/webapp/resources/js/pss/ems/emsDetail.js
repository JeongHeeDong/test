$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#emsDetailClose, #emsDetailCancle,#emsDetailBg').on('click',function(e){
		$('#emsDetailBg').fadeOut();
		$('#emsDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#emsDetailUp" ).draggable({'handle' : '#emsDetailTitleBox'});
	$( "#emsDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function emsDetailView(obj){
	
	$('#emsDetailBg').show().fadeIn('fast');
	$('#emsDetailUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#emsDetailUp').height()-100)/2
	var width = (screen.width - $('#emsDetailUp').width())/2
	
	$('#emsDetailUp').css('left',width+'px');
	$('#emsDetailUp').css('top',height+'px');
	
	$("#emsDetailDiv").scrollTop(0);
	
	var ems_id = $(obj).text();
	$('#ems_Detail_hidden_id').val(ems_id);
	var equip_type = $(obj).parent().parent().children(":eq(3)").text();
	var data = {
			ems_id : ems_id,
			equip_type : equip_type
		};
	
	var requestData = JSON.stringify(data);
	
	$.ajax({
		type:'post',
		url:'/pss/ems/info/getEmsDetail',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			$('#ems_Detail_id').val(data.emsDetailData.EMS_ID);
			$('#ems_Detail_name').val(data.emsDetailData.EMS_NAME);
			$('#ems_Detail_ip').val(data.emsDetailData.IP_ADDRESS);
			$('#ems_Detail_port').val(data.emsDetailData.PORT);
			$('#ems_Detail_vendor_nm').val(data.emsDetailData.VENDOR_ID);
			$('#ems_Detail_vendor_nm').text(data.emsDetailData.VENDOR_NAME);
			$('#installemsDetailDateTxt').val(data.emsDetailData.INSTALL_DATE);
			$('#updateemsDetailDateTxt').val(data.emsDetailData.UPDATE_DATE);
			$('#emsEquipType').val(data.emsDetailData.EQUIP_TYPE);
		},
		error:function(data){
			
		}
	});
}

function emsDetail_update(){
	
	if(!confirm("수정하시겠습니까?")){
		return false;
	}
	
	var ip = $('#ems_Detail_ip').val();
	
	if(!ip_Check(ip)){
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
		return false;
	}
	
	var data = {
			ems_id : $('#ems_Detail_id').val(),
			equip_type : $('#emsEquipType').val(),
			port : $('#ems_Detail_port').val(),
			vendor_id : $('#ems_Detail_vendor_nm').val(),
			install_date : $('#installemsDetailDateTxt').val(),
			update_date : $('#updateemsDetailDateTxt').val(),
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/ems/info/emsDetailupdate',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.emsDetailResult;
			if(result_code > 0){
				alert("수정 성공");
				pageSearch();
			}else{
				alert("수정 실패");
			}
			
			$('#emsDetailBg').fadeOut();
			$('#emsDetailUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}