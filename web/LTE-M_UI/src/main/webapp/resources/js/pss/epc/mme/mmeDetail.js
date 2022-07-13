$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#mmeDetailClose, #mmeDetailCancle,#mmeDetailBg').on('click',function(e){
		$('#mmeDetailBg').fadeOut();
		$('#mmeDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#mmeDetailUp" ).draggable({'handle' : '#mmeDetailTitleBox'});
	$( "#mmeDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function mmeDetailView(obj){
    
    console.log('>>> mme id : ' + $(obj).attr('accessId'));
    // 접속정보 처리
    if ($(obj).attr('accessId')) {
        $('#mmeDetailUp').css('height','440px');
        $('#mmeAccessInfoTable').show();
        $('#mmeAccessIdText').text($(obj).attr('accessId'));
        $('#mmeAccessId').val($(obj).attr('accessId'));
         
    } else {
        $('#mmeDetailUp').css('height','340px');
        $('#mmeAccessInfoTable').hide();
        $('#mmeAccessIdText').text('');
        $('#mmeAccessId').val('');
    }  
        
	
	$('#mmeDetailBg').show().fadeIn('fast');
	$('#mmeDetailUp').show().fadeIn('fast'); 
	
	$('#mmeDetailUp').css('width','750px');
	//$('#mmeDetailUp').css('height','340px');
	
	var height = (screen.height - $('#mmeDetailUp').height()-100)/2
	var width = (screen.width - $('#mmeDetailUp').width())/2
	
	$('#mmeDetailUp').css('left',width+'px');
	$('#mmeDetailUp').css('top',height+'px');
	
	$("#mmeDetailDiv").scrollTop(0);
	
	var mme_id = $(obj).text();
	$('#mme_Detail_hidden_id').val(mme_id);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/getMmeDetail',
		dataTpye:'json',
		data: {
			mme_id : mme_id
		},
		success:function(data){
			var status_nm;
			var status = data.mmeDetailData.mmeDetail.OPR_STATUS;
			status_nm = status==0?'미운용':'운용'; 
			$('#mme_Detail_id').val(data.mmeDetailData.mmeDetail.MME_ID);
			$('#mme_Detail_name').val(data.mmeDetailData.mmeDetail.MME_NAME);
			$('#mme_Detail_code').val(data.mmeDetailData.mmeDetail.MME_CODE);
			$('#mme_Detail_ems_nm').val(data.mmeDetailData.mmeDetail.EMS_ID);
			$('#mme_Detail_ems_nm').text(data.mmeDetailData.mmeDetail.EMS_NAME);
			$('#mme_Detail_vendor_nm').val(data.mmeDetailData.mmeDetail.VENDOR_ID);
			$('#mme_Detail_vendor_nm').text(data.mmeDetailData.mmeDetail.VENDOR_NAME);
			$('#installMmeDetailDateTxt').val(data.mmeDetailData.mmeDetail.INSTALL_DATE);
			$('#updateMmeDetailDateTxt').val(data.mmeDetailData.mmeDetail.UPDATE_DATE);
			$('#mme_Detail_status_nm').text(status_nm); 
			$('#mme_Detail_status_nm').val(status); 
			$('#mme_Detail_mme_ip').val(data.mmeDetailData.mmeDetail.MME_IP);
			/* LTEM 사용 안함
			$('#mmeNodeGrid').empty();
			var appendTr = '';
			
			$.each(data.mmeDetailData.mmeDetail_Node,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.NODE + '</td>';
				appendTr += '<td>' + value.PREFER_TYPE + '</td>'
				appendTr += '<td>' + value.NODE_TYPE + '</td>'
				appendTr += '<td>' + value.REDUN_TYPE + '</td>'
				appendTr += '<td>' + value.GRP_NAME + '</td>'
				appendTr += '</tr>';
			});
			$('#mmeNodeGrid').append(appendTr);
			
			
			$('#mmeNtpGrid').empty();
			appendTr = '';
			
			$.each(data.mmeDetailData.mmeDetail_Ntp,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.SERVER + '</td>';
				appendTr += '<td>' + value.STATUS + '</td>'
				appendTr += '<td>' + value.ROLE + '</td>'
				appendTr += '<td>' + value.CHK_STS + '</td>'
				appendTr += '</tr>';
			});
			$('#mmeNtpGrid').append(appendTr);
			
			$('#mmePortGrid').empty();
			appendTr = '';
			
			$.each(data.mmeDetailData.mmeDetail_Port,function(i,value){
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
			$('#mmePortGrid').append(appendTr);*/
		},
		error:function(data){
			
		}
	});
}

function mmeDetail_update(){
	
	
    $.alert.open('confirm', '수정하시겠습니까?', function(button) {
        if (button == 'yes') {	
        	var data = {
        			mme_name : $('#mme_Detail_name').val(),
        			ems_id : $('#mme_Detail_ems_nm').val(),
        			vendor_id : $('#mme_Detail_vendor_nm').val(),
        			install_date : $('#installMmeDetailDateTxt').val(),
        			update_date : $.datepicker.formatDate('yy-mm-dd hh:MM:ss', new Date()),
        			mme_ip : $('#mme_Detail_mme_ip').val(),
        			mme_id :  $('#mme_Detail_hidden_id').val(),
        			opr_status : $('#mme_Detail_status_nm').val()
        		};
        	
        	var requestData = JSON.stringify(data);
        	
        	
        	$.ajax({
        		type:'post',
        		url:'/pss/epc/mmeDetailupdate',
        		contentType: 'application/json',
        		dataTpye:'json',
        		data : requestData,
        		success:function(data){
        			
        			var result_code = data.mmeDetailResult;
        			if(result_code > 0){
        				alert("수정 성공");
        				pageSearch();
        			}else{
        				alert("수정 실패");
        			}
        			
        			$('#mmeDetailBg').fadeOut();
        			$('#mmeDetailUp').fadeOut();
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



function mmeDetail_delete(){
    
    $.alert.open('confirm', '삭제하시겠습니까?', function(button) {
        if (button == 'yes') {
            var data = {
                    mme_id :  $('#mme_Detail_hidden_id').val()
                };
            
            var requestData = JSON.stringify(data);
            
            
            $.ajax({
                type:'post',
                url:'/pss/epc/mmeDetaildelete',
                contentType: 'application/json',
                dataTpye:'json',
                data : requestData,
                success:function(data){
                    
                    var result_code = data.mmeDetailResult;
                    if(result_code > 0){
                        alert("삭제 성공");
                        pageSearch();
                    }else{
                        alert("삭제 실패");
                    }
                    
                    $('#mmeDetailBg').fadeOut();
                    $('#mmeDetailUp').fadeOut();
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

function accessMmeInfoUpdate(equipType) {
    
    if (!$('#mmeAccessId').val()) {
        alert('ID를 입력하세요.');
        return;
    } 
    
    if (!$('#mmeAccessPwd').val()) {
        alert('Password를 입력하세요.');
        return;
    }

    var strInfoI = CryptoJS.AES.encrypt( $('#mmeAccessId').val(), $("#mme_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    var strInfoP = CryptoJS.AES.encrypt( $('#mmeAccessPwd').val(), $("#mme_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    
    /*console.log('>>> accessId : ' + $('#mmeAccessId').val());
    console.log('>>> password : ' + $('#mme_Detail_id').val());
    console.log('>>> strInfoI : ' + strInfoI);
    console.log('>>> strInfoP : ' + strInfoP);*/

    var updateInfo = {
        'equipType' : equipType, // MME : 1, HPS : 6, SPGW : 4
        'equipId' : $("#mme_Detail_id").val(),
        'equipName' : $("#mme_Detail_name").val(),
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
            $('#mmeAccessId').val('');
            $('#mmeAccessPwd').val('');
            
            alert(data.resultMsg);
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
    
}