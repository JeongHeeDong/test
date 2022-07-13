var select_data;
var scrollPageNo = 1;
var endScrollPageNo = 0;
var scrollNo = 0;
var endScrollNo =0;

$(document).ready(function(){
	//duDetail 숨기기 기능    
    $('#duDetailClose, #duDetailCancle,#duDetailBg').on('click',function(e){
		$('#duDetailBg').fadeOut();
		$('#duDetailUp').fadeOut();
	});
	
    //duDetail Drag 지정 정의
	$( "#duDetailUp" ).draggable({'handle' : '#duDetailTitleBox'});
	$( "#duDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
	
	$("#ruDiv").scroll( function() {
		var elem = $("#ruDiv");
		
		if ( elem[0].scrollHeight - elem.scrollTop() < elem.outerHeight()){
			/*appendRuData();*/
		}
	});
});

function duDetailView(obj){
    
    // 접속정보 처리
    if ($(obj).attr('accessId')) {
        $('#duDetailUp').css('height','650px');
        $('#duAccessInfoTable').show();
        $('#duAccessIdText').text($(obj).attr('accessId'));
        $('#duAccessId').val($(obj).attr('accessId'));
         
    } else {
        $('#duDetailUp').css('height','550px');
        $('#duAccessInfoTable').hide();
        $('#duAccessIdText').text('');
        $('#duAccessId').val('');
    }
	
	
	$('#duDetailBg').show().fadeIn('fast');
	$('#duDetailUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#duDetailUp').height()-100)/2
	var width = (screen.width - $('#duDetailUp').width())/2
	
	$('#duDetailUp').css('left',width+'px');
	$('#duDetailUp').css('top',height+'px');
	
	$("#duDetailDiv").scrollTop(0);
	
	var cUid = $(obj).text();
	$('#du_cuid').val(cUid);

	$.ajax({
		type:'post',
		url:'/pss/du_ru/du/getDuDetail',
		dataTpye:'json',
		data: {
			cUid : cUid
		},
		success:function(data){
			var basicInfo = data.duDetailData.returnBasicInfo;
			var propertiyInfo = data.duDetailData.returnPropertyInfo;
			var operatorInfo = data.duDetailData.returnOperationsInfo;
			var managerInfo = data.duDetailData.returnManagerInfo;
			var addrInfo = data.duDetailData.returnAddrInfo;
			//스크롤 페이징 이유로 전역 변수 사용
			/*select_data = data.duDetailData.returnRuInfo;*/
			var chCardInfo = data.duDetailData.returnChCardInfo;
			var cellInfo = data.duDetailData.returnCellInfo;
			
			//기본정보 
			$('#du_Detail_du_nm').val(basicInfo.DU_NAME);
			$('#du_Detail_du_id').val(basicInfo.DU_ID);
			$('#du_Detail_onm_ip').val(basicInfo.ONM_IP);
			$('#du_Detail_sw_info').val(basicInfo.SWITCH_INFO);
			$('#du_Detail_vlan_info').val(basicInfo.VLAN_INFO);
			$('#du_Detail_sw_info2').val(basicInfo.SWITCH_INFO_2);
			$('#du_Detail_vendor_nm').val(basicInfo.VENDOR_ID);
			$('#du_Detail_vendor_nm').text(basicInfo.VENDOR_NAME);
			$('#du_Detail_vlan_info2').val(basicInfo.VLAN_INFO_2);
			$('#du_Detail_team_nm').val(basicInfo.TEAM_ID);
			$('#du_Detail_team_nm').text(basicInfo.TEAM_NAME);
			$('#du_Detail_master_ip').val(basicInfo.MASTER_IP);
			$('#du_Detail_master_ip2').val(basicInfo.MASTER_IP_2);
			$('#du_Detail_station_nm').val(addrInfo.STATION_ID);
			$('#du_Detail_station_nm').text(addrInfo.STATION_NAME);
//			$('#du_Detail_line_id').val(basicInfo.LINE_ID);
//			$('#du_Detail_line_id').text(basicInfo.LINE_NAME);
			
			//속성정보
			$('#du_Detail_du_type').val(propertiyInfo.DU_TYPE);
			$('#du_Detail_card_type').val(propertiyInfo.CARD_TYPE);
			$('#du_Detail_cell_type').val(propertiyInfo.CELL_TYPE);
			$('#du_Detail_service_type').val(propertiyInfo.SERVICE_TYPE);
			$('#du_Detail_install_date').val(propertiyInfo.INSTALL_DATE);
			$('#du_Detail_serial_no').val(propertiyInfo.SERIALNUMBER);
			
			//운영정보
			/*$('#du_Detail_cell_cnt').val(operatorInfo.CELL_CNT);
			$('#du_Detail_ru_tot').val(operatorInfo.SET_CNT+'/'+operatorInfo.DROP_CNT);*/
			
			//관리자 정보
			/*$('#du_Detail_manager_nm').val(managerInfo.MAOPERATOR);
			$('#du_Detail_fax').val(managerInfo.FAX_NUM);
			$('#du_Detail_tel').val(managerInfo.TEL_NUM);
			$('#du_Detail_mobile').val(managerInfo.MOBILE_NUM);*/
			
			//주소정보
			$('#du_Detail_area').val(basicInfo.AREA_INFO);
			
			//RU 리스트
			/*$('#du_Detail_ru_list').empty();*/
			
			scrollPageNo = 1;
			scrollNo = 0;
			/*endScrollNo = select_data.length;
			endScrollPageNo = (endScrollNo%500)==0?(endScrollNo/500):Math.floor(endScrollNo/500)+1;*/
			
			var appendTr = '';
			
			/*$.each(select_data,function(key,value){
				if(scrollNo < 500){
					appendTr += "<tr>" +
							 	"<td style='cursor:pointer;'>" +
						 		"<a onclick='javascript:ruDetailView(this)' style='color:blue;'>"+value.RU_CUID+"</a>" +
							 	"</td>"+
							 	"<td>"+value.CELL_NUM+"</td>"+
							 	"<td>"+value.PORT_ID+"</td>"+
							 	"<td>"+value.SEQUENCE_ID+"</td>"+
							 	"<td>"+value.FREQUENCY+"</td>"+
							 	"<td>"+value.STATION_NAME+"</td>"+
							 "</tr>";
					scrollNo++;
				}else{
					return false;
				}
			});
			
			$('#du_Detail_ru_list').append(appendTr);*/
			
			//DU Card 리스트
			/*$('#du_Detail_du_card_list').empty();
			$(chCardInfo).each(function(key,value){
				 $('#du_Detail_du_card_list').append("" +
						 "<tr>" +
						 	"<td>"+value.UNIT_ID+"</td>"+
						 	"<td>"+value.UNITTYPE+"</td>"+
						 	"<td>"+value.PORT_TYPE+"</td>"+
						 	"<td>"+value.SHELF_ID+"</td>"+
						 	"<td>"+value.SLOT_ID+"</td>"+
						 	"<td>"+value.PORT_ID+"</td>"+
						 	"<td>"+value.CASC_ID+"</td>"+
						 	"<td>"+value.SERIALNUMBER+"</td>"+
						 "</tr>"
				 );
			});*/
			
			//DU Cell 리스트
			/*$('#du_Detail_du_cell_list').empty();
			$(cellInfo).each(function(key,value){
				 $('#du_Detail_du_cell_list').append("" +
						 "<tr>" +
						 	"<td>"+value.CELL_ID+"</td>"+
						 	"<td>"+value.CELL_NUM+"</td>"+
						 	"<td>"+value.SECTOR+"</td>"+
						 	"<td>"+value.FA+"</td>"+
						 	"<td>"+value.PCI+"</td>"+
						 	"<td>"+value.FREQUENCY+"</td>"+
						 	"<td>"+value.ADM_STATE+"</td>"+
						 "</tr>"
				 );
			});*/
		},
		error:function(data){
			
		}
	});
	
}

function duDetail_update(){

    $.alert.open('confirm', '수정하시겠습니까?', function(button) {
        if (button == 'yes') {
            
            var onm_ip = $('#du_Detail_onm_ip').val();
            var master_ip = $('#du_Detail_master_ip').val();
            var master_ip2 = $('#du_Detail_master_ip2').val();
        //  
        //  if(ip_Check(onm_ip) && ip_Check(master_ip) && ip_Check(master_ip2)){
        //      
        //  }else{
        //      alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
        //      return false;
        //  }
            
            var data = {
                    //기본 정보
                    du_name : $('#du_Detail_du_nm').val(),
                    du_id : $('#du_Detail_du_id').val(),
                    onm_ip : onm_ip,
                    sw_info : $('#du_Detail_sw_info').val(),
                    vlan_info : $('#du_Detail_vlan_info').val(),
                    sw_info2 : $('#du_Detail_sw_info2').val(),
                    vendor_id : $('#du_Detail_vendor_nm').val(),
                    vlan_info2 : $('#du_Detail_vlan_info2').val(),
                    team_id : $('#du_Detail_team_nm').val(),
                    master_ip :master_ip,
                    master_ip2 : master_ip2,
                    manager_nm : $('#du_Detail_manager_nm').val(),
                    fax : $('#du_Detail_fax').val(),
                    tel : $('#du_Detail_tel').val(),
                    mobile : $('#du_Detail_mobile').val(),
                    c_uid :  $('#du_cuid').val(),
                    station_id : $('#du_Detail_station_nm').val(),
        //          line_id : $('#du_Detail_line_id').val()
        
                    //속성 정보
                    du_type : $('#du_Detail_du_type').val(),
                    card_type : $('#du_Detail_card_type').val(),
                    cell_type : $('#du_Detail_cell_type').val(),
                    service_type : $('#du_Detail_service_type').val(),
                    install_date : $('#du_Detail_install_date').val(),
                    serial_no : $('#du_Detail_serial_no').val(),
                    
                    //주소 정보
                    area_info : $('#du_Detail_area').val(),
                };
            
            var requestData = JSON.stringify(data);
            
            
            $.ajax({
                type:'post',
                url:'/pss/du_ru/du/duDetailupdate',
                contentType: 'application/json',
                dataTpye:'json',
                data : requestData,
                success:function(data){
                    
                    var result_code = data.duDetailResult;
                    if(result_code > 0){
                        alert("수정 성공");
                        pageSearch();
                    }else{
                        alert("수정 실패");
                    }
                    
                    $('#duDetailBg').fadeOut();
                    $('#duDetailUp').fadeOut();
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



function duDetail_delete(){
    
 $.alert.open('confirm', '삭제하시겠습니까?', function(button) {
        if (button == 'yes') {
            
            var data = {
                    du_id : $('#du_Detail_du_id').val(),
                    c_uid :  $('#du_cuid').val(),
                };
            
            var requestData = JSON.stringify(data);
            
            $.ajax({
                type:'post',
                url:'/pss/du_ru/du/duDetaildelete',
                contentType: 'application/json',
                dataTpye:'json',
                data : requestData,
                success:function(data){
                    
                    var result_code = data.duDetailResult;
                    if(result_code > 0){
                        alert("삭제 성공");
                        pageSearch();
                    }else{
                        alert("삭제 실패");
                    }
                    
                    $('#duDetailBg').fadeOut();
                    $('#duDetailUp').fadeOut();
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


function appendRuData(){
	scrollPageNo++;
	if(scrollPageNo <= endScrollPageNo){
		var i = scrollNo;
		var j = 0;
		
		if(select_data.length%500 == 0){
			j = scrollNo+500;
		}else{
			j = scrollPageNo==endScrollPageNo?scrollNo+select_data.length%500:scrollNo+500;
		}
		
		var appendTr = '';
		
		for(i; i< j ; i++){
			
			appendTr += "<tr>" +
					 	"<td style='cursor:pointer;'>" +
				 		"<a onclick='javascript:ruDetailView(this)'>"+select_data[i].RU_CUID+"</a>" +
					 	"</td>"+
					 	"<td>"+select_data[i].CELL_NUM+"</td>"+
					 	"<td>"+select_data[i].PORT_ID+"</td>"+
					 	"<td>"+select_data[i].SEQUENCE_ID+"</td>"+
					 	"<td>"+select_data[i].FREQUENCY+"</td>"+
					 	"<td>"+select_data[i].STATION_NAME+"</td>"+
					 "</tr>";
			scrollNo++;
		}
		$('#du_Detail_ru_list').append(appendTr);
	}
}

var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    }
}

function duAccessInfoUpdate() {
    
    if (!$('#duAccessId').val()) {
        alert('ID를 입력하세요.');
        return;
    } 
    
    if (!$('#duAccessPwd').val()) {
        alert('Password를 입력하세요.');
        return;
    }

    var strInfoI = CryptoJS.AES.encrypt( $('#duAccessId').val(), $("#du_Detail_du_id").val(), {format: CryptoJSAesJson}).toString();
    var strInfoP = CryptoJS.AES.encrypt( $('#duAccessPwd').val(), $("#du_Detail_du_id").val(), {format: CryptoJSAesJson}).toString();
    
    /*console.log('>>> accessId : ' + $('#duAccessId').val());
    console.log('>>> password : ' + $('#du_Detail_du_id').val());
    console.log('>>> strInfoI : ' + strInfoI);
    console.log('>>> strInfoP : ' + strInfoP);*/

    var updateInfo = {
        'equipType' : '2', // DU
        'equipId' : $("#du_Detail_du_id").val(),
        'equipName' : $("#du_Detail_du_nm").val(),
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
            $('#duAccessPwd').val('');
            alert(data.resultMsg);
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
    
}