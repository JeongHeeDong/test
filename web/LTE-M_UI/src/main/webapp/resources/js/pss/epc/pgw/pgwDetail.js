$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#pgwDetailClose, #pgwDetailCancle,#pgwDetailBg').on('click',function(e){
		$('#pgwDetailBg').fadeOut();
		$('#pgwDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#pgwDetailUp" ).draggable({'handle' : '#pgwDetailTitleBox'});
	$( "#pgwDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function pgwDetailView(obj){
    
    // 접속정보 처리
    if ($(obj).attr('accessId')) {
        $('#pgwDetailUp').css('height','440px');
        $('#pgwAccessInfoTable').show();
        $('#pgwAccessIdText').text($(obj).attr('accessId'));
        $('#pgwAccessId').val($(obj).attr('accessId'));
         
    } else {
        $('#pgwDetailUp').css('height','340px');
        $('#pgwAccessInfoTable').hide();
        $('#pgwAccessIdText').text('');
        $('#pgwAccessId').val('');
    }    
	
	$('#pgwDetailBg').show().fadeIn('fast');
	$('#pgwDetailUp').show().fadeIn('fast'); 
	
	$('#pgwDetailUp').css('width','750px');
	//$('#pgwDetailUp').css('height','340px');
	
	var height = (screen.height - $('#pgwDetailUp').height()-100)/2
	var width = (screen.width - $('#pgwDetailUp').width())/2
	
	$('#pgwDetailUp').css('left',width+'px');
	$('#pgwDetailUp').css('top',height+'px');
	
	$("#pgwDetailDiv").scrollTop(0);
	
	var pgw_id = $(obj).text();
	$('#pgw_Detail_hidden_id').val(pgw_id);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/getPgwDetail',
		dataTpye:'json',
		data: {
			pgw_id : pgw_id
		},
		success:function(data){
			var status_nm;
			var status = data.pgwDetailData.pgwDetail.OPR_STATUS;
			status_nm = status==0?'미운용':'운용';
			
			$('#pgw_Detail_id').val(data.pgwDetailData.pgwDetail.PGW_ID);
			$('#pgw_Detail_name').val(data.pgwDetailData.pgwDetail.PGW_NAME);
			$('#pgw_Detail_ems_nm').val(data.pgwDetailData.pgwDetail.EMS_ID);
			$('#pgw_Detail_ems_nm').text(data.pgwDetailData.pgwDetail.EMS_NAME);
			$('#pgw_Detail_vendor_nm').val(data.pgwDetailData.pgwDetail.VENDOR_ID);
			$('#pgw_Detail_vendor_nm').text(data.pgwDetailData.pgwDetail.VENDOR_NAME);
			$('#installpgwDetailDateTxt').val(data.pgwDetailData.pgwDetail.INSTALL_DATE);
			$('#updatepgwDetailDateTxt').val(data.pgwDetailData.pgwDetail.UPDATE_DATE);
			$('#pgw_Detail_status_nm').text(status_nm); 
			$('#pgw_Detail_status_nm').val(status); 
			$('#pgw_Detail_ip').val(data.pgwDetailData.pgwDetail.IP)
			
			/*$('#pgwNodeGrid').empty();
			var appendTr = ''; 
			
			$.each(data.pgwDetailData.pgwDetail_Node,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.NODE + '</td>';
				appendTr += '<td>' + value.PREFER_TYPE + '</td>'
				appendTr += '<td>' + value.NODE_TYPE + '</td>'
				appendTr += '<td>' + value.REDUN_TYPE + '</td>'
				appendTr += '<td>' + value.GRP_NAME + '</td>'
				appendTr += '</tr>';
			});
			$('#pgwNodeGrid').append(appendTr);
			
			
			$('#pgwNtpGrid').empty();
			appendTr = '';
			
			$.each(data.pgwDetailData.pgwDetail_Ntp,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.SERVER + '</td>';
				appendTr += '<td>' + value.STATUS + '</td>'
				appendTr += '<td>' + value.ROLE + '</td>'
				appendTr += '<td>' + value.CHK_STS + '</td>'
				appendTr += '</tr>';
			});
			$('#pgwNtpGrid').append(appendTr);
			
			$('#pgwPortGrid').empty();
			appendTr = '';
			
			$.each(data.pgwDetailData.pgwDetail_Port,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.NODE + '</td>';
				appendTr += '<td>' + value.PORT + '</td>'
				appendTr += '<td>' + value.ACT_STS + '</td>'
				appendTr += '<td>' + value.OPR_STS + '</td>'
				appendTr += '<td>' + value.MATE_PORT + '</td>'
				appendTr += '<td>' + value.DETAIL_STS + '</td>'
				appendTr += '<td>' + value.DESCRIPTION + '</td>'
				appendTr += '</tr>';
			});
			$('#pgwPortGrid').append(appendTr);*/
		},
		error:function(data){
			
		}
	});
}

function pgwDetail_update(){
	
    $.alert.open('confirm', '수정하시시겠습니까?', function(button) {
        if (button == 'yes') {
        	
        	var data = {
        			pgw_name : $('#pgw_Detail_name').val(),
        			ems_id : $('#pgw_Detail_ems_nm').val(),
        			vendor_id : $('#pgw_Detail_vendor_nm').val(),
        			install_date : $('#installpgwDetailDateTxt').val(),
        			update_date : $.datepicker.formatDate('yy-mm-dd hh:MM:ss', new Date()),
        			pgw_ip :  $('#pgw_Detail_ip').val(), 
        			pgw_id :  $('#pgw_Detail_hidden_id').val(),
        			opr_status : $('#pgw_Detail_status_nm').val()
        		};
        	
        	var requestData = JSON.stringify(data);
        	
        	
        	$.ajax({
        		type:'post',
        		url:'/pss/epc/pgwDetailupdate',
        		contentType: 'application/json',
        		dataTpye:'json',
        		data : requestData,
        		success:function(data){
        			
        			var result_code = data.pgwDetailResult;
        			if(result_code > 0){
        				alert("수정 성공");
        				pageSearch();
        			}else{
        				alert("수정 실패");
        			}
        			
        			$('#pgwDetailBg').fadeOut();
        			$('#pgwDetailUp').fadeOut();
        		},
        		error:function(data){
        			
        		}
        	});
        } else if (button == 'no') {
            return;
        } else {
            return;
        }
    });            	
}



function pgwDetail_delete(){
    
    $.alert.open('confirm', '삭제하시시겠습니까?', function(button) {
        if (button == 'yes') {
            
            var data = {
                    pgw_id :  $('#pgw_Detail_hidden_id').val()
                };
            
            var requestData = JSON.stringify(data);
            
            
            $.ajax({
                type:'post',
                url:'/pss/epc/pgwDetaildelete',
                contentType: 'application/json',
                dataTpye:'json',
                data : requestData,
                success:function(data){
                    
                    var result_code = data.pgwDetailResult;
                    if(result_code > 0){
                        alert("삭제 성공");
                        pageSearch();
                    }else{
                        alert("삭제 실패");
                    }
                    
                    $('#pgwDetailBg').fadeOut();
                    $('#pgwDetailUp').fadeOut();
                },
                error:function(data){
                    
                }
            });
        } else if (button == 'no') {
            return;
        } else {
            return;
        }
    });                
}



var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    }
}

function accessPgwInfoUpdate(equipType) {
    
    if (!$('#pgwAccessId').val()) {
        alert('ID를 입력하세요.');
        return;
    } 
    
    if (!$('#pgwAccessPwd').val()) {
        alert('Password를 입력하세요.');
        return;
    }

    var strInfoI = CryptoJS.AES.encrypt( $('#pgwAccessId').val(), $("#pgw_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    var strInfoP = CryptoJS.AES.encrypt( $('#pgwAccessPwd').val(), $("#pgw_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    
    /*console.log('>>> accessId : ' + $('#pgwAccessId').val());
    console.log('>>> password : ' + $('#pgw_Detail_id').val());
    console.log('>>> strInfoI : ' + strInfoI);
    console.log('>>> strInfoP : ' + strInfoP);*/

    var updateInfo = {
        'equipType' : equipType, // MME : 1, HPS : 6, SPGW : 4
        'equipId' : $("#pgw_Detail_id").val(),
        'equipName' : $("#pgw_Detail_name").val(),
        'accessId' : strInfoI,
        'accessPwd' : strInfoP
    };    

    $.ajax({
        type:'post',
        url:'/v2/updateAccessInfo',
        data : JSON.stringify(updateInfo),
        contentType: 'application/json',
        dataType : 'json',
        success : function(data) {
            $('#pgwAccessId').val('');
            $('#pgwAccessPwd').val('');
            
            alert(data.resultMsg);
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
    
}