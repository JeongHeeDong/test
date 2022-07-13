$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#pcrfDetailClose, #pcrfDetailCancle,#pcrfDetailBg').on('click',function(e){
		$('#pcrfDetailBg').fadeOut();
		$('#pcrfDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#pcrfDetailUp" ).draggable({'handle' : '#pcrfDetailTitleBox'});
	$( "#pcrfDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function pcrfDetailView(obj){
    
    // 접속정보 처리
    if ($(obj).attr('accessId')) {
        $('#pcrfDetailUp').css('height','440px');
        $('#pcrfAccessInfoTable').show();
        $('#pcrfAccessIdText').text($(obj).attr('accessId'));
        $('#pcrfAccessId').val($(obj).attr('accessId'));
         
    } else {
        $('#pcrfDetailUp').css('height','340px');
        $('#pcrfAccessInfoTable').hide();
        $('#pcrfAccessIdText').text('');
        $('#pcrfAccessId').val('');
    }       
	
	$('#pcrfDetailBg').show().fadeIn('fast');
	$('#pcrfDetailUp').show().fadeIn('fast'); 
	
	$('#pcrfDetailUp').css('width','750px');
	//$('#pcrfDetailUp').css('height','340px');
	
	var height = (screen.height - $('#pcrfDetailUp').height()-100)/2
	var width = (screen.width - $('#pcrfDetailUp').width())/2
	
	$('#pcrfDetailUp').css('left',width+'px');
	$('#pcrfDetailUp').css('top',height+'px');
	
	$("#pcrfDetailDiv").scrollTop(0);
	
	var pcrf_id = $(obj).text();
	$('#pcrf_Detail_hidden_id').val(pcrf_id);
	
	$.ajax({
		type:'post',
		url:'/pss/epc/getPcrfDetail',
		dataTpye:'json',
		data: {
			pcrf_id : pcrf_id
		},
		success:function(data){
			var status_nm;
			var status = data.pcrfDetailData.pcrfDetail.OPR_STATUS;
			status_nm = status==0?'미운용':'운용';
			
			$('#pcrf_Detail_id').val(data.pcrfDetailData.pcrfDetail.PCRF_ID);
			$('#pcrf_Detail_name').val(data.pcrfDetailData.pcrfDetail.PCRF_NAME);
			$('#pcrf_Detail_ems_nm').val(data.pcrfDetailData.pcrfDetail.EMS_ID);
			$('#pcrf_Detail_ems_nm').text(data.pcrfDetailData.pcrfDetail.EMS_NAME);
			$('#pcrf_Detail_vendor_nm').val(data.pcrfDetailData.pcrfDetail.VENDOR_ID);
			$('#pcrf_Detail_vendor_nm').text(data.pcrfDetailData.pcrfDetail.VENDOR_NAME);
			$('#installpcrfDetailDateTxt').val(data.pcrfDetailData.pcrfDetail.INSTALL_DATE);
			$('#updatepcrfDetailDateTxt').val(data.pcrfDetailData.pcrfDetail.UPDATE_DATE);
			$('#pcrf_Detail_status_nm').text(status_nm); 
			$('#pcrf_Detail_status_nm').val(status); 
			$('#pcrf_Detail_ip').val(data.pcrfDetailData.pcrfDetail.IP);
			
			/* LTEM 사용안함			
			$('#pcrfNodeGrid').empty();
			var appendTr = '';
			
			
			$.each(data.pcrfDetailData.pcrfDetail_Node,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.NODE + '</td>';
				appendTr += '<td>' + value.PREFER_TYPE + '</td>'
				appendTr += '<td>' + value.NODE_TYPE + '</td>'
				appendTr += '<td>' + value.REDUN_TYPE + '</td>'
				appendTr += '<td>' + value.GRP_NAME + '</td>'
				appendTr += '</tr>';
			});
			$('#pcrfNodeGrid').append(appendTr);
			
			
			$('#pcrfNtpGrid').empty();
			appendTr = '';
			
			$.each(data.pcrfDetailData.pcrfDetail_Ntp,function(i,value){
				appendTr += '<tr>';
				appendTr += '<td>' + value.SERVER + '</td>';
				appendTr += '<td>' + value.STATUS + '</td>'
				appendTr += '<td>' + value.ROLE + '</td>'
				appendTr += '<td>' + value.CHK_STS + '</td>'
				appendTr += '</tr>';
			});
			$('#pcrfNtpGrid').append(appendTr);
			
			$('#pcrfPortGrid').empty();
			appendTr = '';
			
			$.each(data.pcrfDetailData.pcrfDetail_Port,function(i,value){
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
			$('#pcrfPortGrid').append(appendTr);*/
			
		},
		error:function(data){
			
		}
	});
}

function pcrfDetail_update(){
	
    $.alert.open('confirm', '수정하시겠습니까?', function(button) {
        if (button == 'yes') {
	
        	var data = {
        			pcrf_name : $('#pcrf_Detail_name').val(),
        			ems_id : $('#pcrf_Detail_ems_nm').val(),
        			vendor_id : $('#pcrf_Detail_vendor_nm').val(),
        			install_date : $('#installpcrfDetailDateTxt').val(),
        			update_date : $.datepicker.formatDate('yy-mm-dd hh:MM:ss', new Date()),
        			pcrf_ip :  $('#pcrf_Detail_ip').val(), 
        			pcrf_id :  $('#pcrf_Detail_hidden_id').val(),
        			opr_status : $('#pcrf_Detail_status_nm').val()
        		};
        	
        	var requestData = JSON.stringify(data);
        	
        	
        	$.ajax({
        		type:'post',
        		url:'/pss/epc/pcrfDetailupdate',
        		contentType: 'application/json',
        		dataTpye:'json',
        		data : requestData,
        		success:function(data){
        			
        			var result_code = data.pcrfDetailResult;
        			if(result_code > 0){
        				alert("수정 성공");
        				pageSearch();
        			}else{
        				alert("수정 실패");
        			}
        			
        			$('#pcrfDetailBg').fadeOut();
        			$('#pcrfDetailUp').fadeOut();
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


function pcrfDetail_delete(){
    
    $.alert.open('confirm', '삭제하시시겠습니까?', function(button) {
        if (button == 'yes') {
    
            var data = {
                    pcrf_id :  $('#pcrf_Detail_hidden_id').val()
                    };
            
            var requestData = JSON.stringify(data);
            
            
            $.ajax({
                type:'post',
                url:'/pss/epc/pcrfDetaildelete',
                contentType: 'application/json',
                dataTpye:'json',
                data : requestData,
                success:function(data){
                    
                    var result_code = data.pcrfDetailResult;
                    if(result_code > 0){
                        alert("삭제 성공");
                        pageSearch();
                    }else{
                        alert("삭제 실패");
                    }
                    
                    $('#pcrfDetailBg').fadeOut();
                    $('#pcrfDetailUp').fadeOut();
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

function accessPcrfInfoUpdate(equipType) {
    
    if (!$('#pcrfAccessId').val()) {
        alert('ID를 입력하세요.');
        return;
    } 
    
    if (!$('#pcrfAccessPwd').val()) {
        alert('Password를 입력하세요.');
        return;
    }

    var strInfoI = CryptoJS.AES.encrypt( $('#pcrfAccessId').val(), $("#pcrf_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    var strInfoP = CryptoJS.AES.encrypt( $('#pcrfAccessPwd').val(), $("#pcrf_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    
    /*console.log('>>> accessId : ' + $('#pcrfAccessId').val());
    console.log('>>> password : ' + $('#pcrf_Detail_id').val());
    console.log('>>> strInfoI : ' + strInfoI);
    console.log('>>> strInfoP : ' + strInfoP);*/

    var updateInfo = {
        'equipType' : equipType, // MME : 1, HPS : 6, SPGW : 4
        'equipId' : $("#pcrf_Detail_id").val(),
        'equipName' : $("#pcrf_Detail_name").val(),
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
            $('#pcrfAccessId').val('');
            $('#pcrfAccessPwd').val('');
            
            alert(data.resultMsg);
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
    
}