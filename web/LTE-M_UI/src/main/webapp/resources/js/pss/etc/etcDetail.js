$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#etcDetailClose, #etcDetailCancle,#etcDetailBg').on('click',function(e){
		$('#etcDetailBg').fadeOut();
		$('#etcDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#etcDetailUp" ).draggable({'handle' : '#etcDetailTitleBox'});
	$( "#etcDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function etcDetailView(obj){
    
    console.log('>>> obj : ' + $(obj).attr('accessId'));
	
    // 접속정보 처리
    if ($(obj).attr('accessId')) {
        $('#etcDetailUp').css('height','520px');
        $('#etcAccessInfoTable').show();
        $('#etcAccessIdText').text($(obj).attr('accessId'));
        $('#etcAccessId').val($(obj).attr('accessId'));
         
    } else {
        $('#etcDetailUp').css('height','420px');
        $('#etcAccessInfoTable').hide();
        $('#etcAccessIdText').text('');
        $('#etcAccessId').val('');
    }    
    
    	
	var etc_id = $(obj).text();
	var etc_type = $(obj).data('type');
	var etc_name = $(obj).data('name');
	if(etc_type == 17){
		//$('#etcDetailUp').css('height','700px');
		$('#etcDetailUp').css('width','450px');
		$('#rtf_detail').css('display','block');
		getRtfDetailData(etc_id);
	}else {
		//$('#etcDetailUp').css('height','420px');
		$('#etcDetailUp').css('width','450px');
		$('#rtf_detail').css('display','none');
	}
	
	$('#etc_Detail_hidden_id').val(etc_id);
	
	$.ajax({
		type:'post',
		url:'/pss/etc/getEtcDetail',
		dataTpye:'json',
		data: {
			etc_id : etc_id,
			etc_type : etc_type,
			etc_name : etc_name
		},
		success:function(data){
			
			$('#etc_Detail_id').val(data.etcDetailData.NE_ID);
			$('#etc_Detail_name').val(data.etcDetailData.NE_NAME);
			$('#etc_Detail_equip_nm').val(data.etcDetailData.EQUIP_TYPE);
			$('#etc_Detail_equip_nm').text(data.etcDetailData.EQUIP_NAME);
			$('#etc_Detail_vendor_nm').val(data.etcDetailData.VENDOR_ID);
			$('#etc_Detail_vendor_nm').text(data.etcDetailData.VENDOR_NAME);
			$('#installetcDetailDateTxt').val(data.etcDetailData.INSTALL_DATE);
			$('#updateetcDetailDateTxt').val(data.etcDetailData.UPDATE_DATE);
			$('#etc_Detail_ip').val(data.etcDetailData.IP);
			
			$('#etcDetailBg').show().fadeIn('fast');
			$('#etcDetailUp').show().fadeIn('fast'); 
			
			var height = (screen.height - $('#etcDetailUp').height()-100)/2
			var width = (screen.width - $('#etcDetailUp').width())/2
			
			$('#etcDetailUp').css('left',width+'px');
			$('#etcDetailUp').css('top',height+'px');
			
			$("#etcDetailDiv").scrollTop(0);
			
		},
		error:function(data){
			
		}
	});
}

function getRtfDetailData(ne_id){
	var data = {
			ne_id : ne_id
	}
	
	var requestData = JSON.stringify(data);
	
	$.ajax({
		type:'post',
		url:'/pss/etc/getRtfDetailData',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			$('#rtf_tobody').empty();
				
			$(data.rtfDetailData).each(function(key,value){
				
				$('#rtf_tobody').append('' +
					 '<tr>' +
					 	'<td>'+value.SYSTEM_ID+'</td>'+
					 	'<td contenteditable="true">'+value.STATION_NAME+'</td>'+
					 	'<td hidden="true">'+value.STATION_NAME+'</td>'+
					 	'<td contenteditable="true">'+value.SYSTEM_IP+'</td>'+
					 	'<td hidden="true">'+value.SYSTEM_IP+'</td>'+
					 "</tr>"
				 );
			});
					
		},
		error:function(data){
			
		}
	});
}

function etcDetail_update(){
	
    $.alert.open('confirm', '수정하시시겠습니까?', function(button) {
        if (button == 'yes') {
	
        	var ip = $('#etc_Detail_ip').val();
        	
        	if(ip_Check(ip)){
        		
        	}else{
        		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
        		return false;
        	}
        	
        	var data = {
        			etc_name : $('#etc_Detail_name').val(),
        			equip_type : $('#etc_Detail_equip_nm').val(),
        			vendor_id : $('#etc_Detail_vendor_nm').val(),
        			install_date : $('#installetcDetailDateTxt').val(),
        			update_date : $('#updateetcDetailDateTxt').val(),
        			etc_id :  $('#etc_Detail_hidden_id').val(),
        			ip : ip
        		};
        	
        	var _array = [];
        	var _arrayStation = [];
        	var obj;
        	var objStation;
        	
        	if($('#rtf_detail').css('display') == 'block'){
        		
        		$("#rtf_tobody tr").each(function(key,value){
        			
        			if($(value).find('td:eq(1)').text() != $(value).find('td:eq(2)').text()) {
        				objStation = new Object();
        				
        				objStation.after_rtf_station = $(value).find('td:eq(1)').text();
        				objStation.before_rtf_station = $(value).find('td:eq(2)').text();
        				
        				_arrayStation.push(objStation);
        			}
        			
        			if($(value).find('td:eq(3)').text() != $(value).find('td:eq(4)').text()) {
        				obj = new Object();
        				
        				obj.after_rtf_ips = $(value).find('td:eq(3)').text();
        				obj.before_rtf_ips = $(value).find('td:eq(4)').text();
        				
        				_array.push(obj);
        			}
        		});
        		if(_array.length != 0) {
        			data["rtf_ips"] = _array;
        		}
        		if(_arrayStation.length != 0){
        			data["rtf_station"] = _arrayStation;
        		}
        	}
        	
        	var requestData = JSON.stringify(data);
        	
        	
        	$.ajax({
        		type:'post',
        		url:'/pss/etc/etcDetailupdate',
        		contentType: 'application/json',
        		dataTpye:'json',
        		data : requestData,
        		success:function(data){
        			
        			var result_code = data.etcDetailResult;
        			if(result_code > 0){
        				alert("수정 성공");
        				pageSearch();
        			}else{
        				alert("수정 실패");
        			}
        			
        			$('#etcDetailBg').fadeOut();
        			$('#etcDetailUp').fadeOut();
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



function etcDetail_delete(){
    
    $.alert.open('confirm', '삭제하시겠습니까?', function(button) {
        if (button == 'yes') {
            
            var data = {
                    equip_type : $('#etc_Detail_equip_nm').val(),
                    etc_id :  $('#etc_Detail_hidden_id').val()
                };
            
            var requestData = JSON.stringify(data);
            
            $.ajax({
                type:'post',
                url:'/pss/etc/etcDetaildelete',
                contentType: 'application/json',
                dataTpye:'json',
                data : requestData,
                success:function(data){
                    
                    var result_code = data.etcDetailResult;
                    if(result_code > 0){
                        alert("삭제 성공");
                        pageSearch();
                    }else{
                        alert("삭제 실패");
                    }
                    
                    $('#etcDetailBg').fadeOut();
                    $('#etcDetailUp').fadeOut();
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

function accessEtcInfoUpdate(equipType) {
    
    if (!$('#etcAccessId').val()) {
        alert('ID를 입력하세요.');
        return;
    } 
    
    if (!$('#etcAccessPwd').val()) {
        alert('Password를 입력하세요.');
        return;
    }

    var strInfoI = CryptoJS.AES.encrypt( $('#etcAccessId').val(), $("#etc_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    var strInfoP = CryptoJS.AES.encrypt( $('#etcAccessPwd').val(), $("#etc_Detail_id").val(), {format: CryptoJSAesJson}).toString();
    
    /*console.log('>>> accessId : ' + $('#etcAccessId').val());
    console.log('>>> password : ' + $('#etc_Detail_id').val());
    console.log('>>> strInfoI : ' + strInfoI);
    console.log('>>> strInfoP : ' + strInfoP);*/

    var updateInfo = {
        'equipType' : $("#etc_Detail_equip_nm").val(),
        'equipId' : $("#etc_Detail_id").val(),
        'equipName' : $("#etc_Detail_name").val(),
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
            $('#etcAccessId').val('');
            $('#etcAccessPwd').val('');
            
            alert(data.resultMsg);
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
    
}