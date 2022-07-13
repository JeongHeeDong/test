
$(document).ready(function(){
	//etcDetail 숨기기 기능    
    $('#etcAddClose, #etcAddCancle,#etcAddBg').on('click',function(e){
		$('#etcAddBg').fadeOut();
		$('#etcAddUp').fadeOut();
	});
	
    //etcAdd Drag 지정 정의
	$( "#etcAddUp" ).draggable({'handle' : '#etcAddTitleBox'});
	$( "#etcAddUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
	
});


//중복체크 여부
var checkFlag = false;
var _equipTypeSelect = "12";
function etcAddView(obj){
	
	vendorOptions = [];
	$.each(vendorList, function (i,row){
		if ( i == 0 ){
			vendorOptions.push('<option value=' + row.VENDOR_ID + ' selected="selected" >' + row.VENDOR_NAME + '</option>');
		}else{
			vendorOptions.push('<option value=' + row.VENDOR_ID + '>' + row.VENDOR_NAME + '</option>');
		}
	});
	$("#selectedVendor").html(vendorOptions.join(''));
	
	etcEquipOptions = [];
	$.each(etcEquipList, function (i,row){
		if ( i == 0 ){
			etcEquipOptions.push('<option value=' + row.EQUIP_TYPE + ' selected="selected" >' + row.EQUIP_NAME + '</option>');
		}else{
			etcEquipOptions.push('<option value=' + row.EQUIP_TYPE + '>' + row.EQUIP_NAME + '</option>');
		}
	});
	$("#selectedEquip").html(etcEquipOptions.join(''));
	
	$('#etc_name_add').val('');
	$('#etc_id_add').val('');
	$('#etc_add_ip').val('');
	$('#installetcAddDateTxt').val('');
	
	$('#etcAddBg').show().fadeIn('fast');
	$('#etcAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#etcAddUp').height()-100)/2
	var width = (screen.width - $('#etcAddUp').width())/2
	
	$('#etcAddUp').css('left',width+'px');
	$('#etcAddUp').css('top',height+'px');
	

	$("#etcAddDiv").scrollTop(0);
}

function click_equip_type(){
	
	if($('#etc_equip_nm_add').val() != _equipTypeSelect) 
		_equipTypeSelect = $('#etc_equip_nm_add').val();
	
	if(_equipTypeSelect == "17"){
		$('#etcAddUp').css('height','700px');
		$('#etcAddUp').css('width','450px');
		$('#rtf_add').css('display','block');
	}else {
		$('#etcAddUp').css('height','420px');
		$('#etcAddUp').css('width','450px');
		$('#rtf_add').css('display','none');
	}
	
	var height = (screen.height - $('#etcAddUp').height()-100)/2
	var width = (screen.width - $('#etcAddUp').width())/2
	
	$('#etcAddUp').css('left',width+'px');
	$('#etcAddUp').css('top',height+'px');
	
	$("#etcAddDiv").scrollTop(0);
}

function idCheck(){
	
	var etc_id = $('#etc_id_add').val();
	if(etc_id == ''){
		alert('장비 ID를 입력해주세요');
		return false;
	}
	
	var equip_type = $('#etc_equip_nm_add').val();
	
	$.ajax({
		type:'post',
		url:'/pss/etc/etcIdCheck',
		dataTpye:'json',
		data : {etc_id : etc_id, equip_type : equip_type},
		success:function(data){
			
			var result_length = data.etcIdCheckResult;
			if(result_length > 0){
				alert("입력하신 장비 ID는 사용 불가능합니다.");
				$('#etc_id_add').val('');
				checkFlag = false;
				
				if($('#rtf_add').css('display') == 'block') {
					
					$("#rtf_add_tobody tr").find("td:eq(0)").text("");
				}
			}else{
				alert("입력하신 장비 ID는 사용 가능합니다.");
				checkFlag = true;
				
				if($('#rtf_add').css('display') == 'block') {
					
					$("#rtf_add_tobody tr").find("td:eq(0)").text(etc_id);
				}
			}
		},
		error:function(data){
			
		}
	});
	
}


function etc_Add(){
	
	var etc_id = $('#etc_id_add').val()
	var etc_name = $('#etc_name_add').val()
	var equip_type = $('#selectedEquip').val()
	var vendor_id = $('#selectedVendor').val()
	var install_date = $('#installetcAddDateTxt').val()==''?null:$('#installetcAddDateTxt').val();
	
	if(!checkFlag){
		alert('장비 ID 중복체크를 해주세요');
		return false;
	}
	
	if(etc_id == '' || etc_name == '' || equip_type == '' || vendor_id == '' || install_date == ''){
		alert('모든 필드를 채워주세요');
		return false;
	}
	
	var ip = $('#etc_add_ip').val();
	
	if(ip_Check(ip)){
		
	}else{
		alert("IPv4, IPv6 형식의 IP만 입력 가능합니다.")
		return false;
	}
	
	var data = {
			etc_id : etc_id,
			etc_name : etc_name,
			equip_type : equip_type,
			vendor_id : Number(vendor_id),
			install_date : install_date,
			ip : ip
		};
	
	if($('#rtf_add').css('display') == 'block') {
		
		var returnFlag = true;
		var obj;
		var _array = [];
		
		$("#rtf_add_tobody tr").each(function(key,value){
			
			if($(value).find('td:eq(1)').text() == '' || $(value).find('td:eq(2)').text() == '') {
				_array = [];
				returnFlag = false;
				alert('전원감시장치 상세정보의 모든 필드를 채워주세요');
				return false;
			} else {
				if(ip_Check($(value).find('td:eq(2)').text())){
					obj = new Object();
					
					obj.system_id = $(value).find('td:eq(0)').text();
					obj.station_name = $(value).find('td:eq(1)').text();
					obj.ip = $(value).find('td:eq(2)').text();
					obj.system_name = etc_name;
					
					_array.push(obj);
				} else {
					_array = [];
					returnFlag = false;
					alert('전원감시장치 상세정보의 IP 항목은 IPv4, IPv6 형식의 IP만 입력 가능합니다.');
					return false;
				}
			}
		});
		
		if(_array.length != 0) {
			data["rtf_data"] = _array;
		}
		
		if(!returnFlag) return false;
	}
	
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/etc/etcAdd',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.etcAddResult;
			if(result_code > 0){
				alert("장비 추가 성공");
				pageSearch();
			}else{
				alert("장비 추가 실패");
			}
			
			$('#etcAddBg').fadeOut();
			$('#etcAddUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}

function rowAdd() {
	
	var id = '';
	if(checkFlag) id = $('#etc_id_add').val();
	
	$("#rtf_add_tobody").append(
			'<tr>'+
			'<td>'+id+'</td>'+
			'<td contenteditable="true"></td>'+
			'<td contenteditable="true"></td>'+
			'<td align="center"><button type="button" class="mu-btn mu-btn-icon" onclick="javascript:rowDel(this)"><i class="mu-icon del"></i>삭제</button></td>'+
			'</tr>'
	);
}

function rowDel(obj) {
	var tr = $(obj).parent().parent();
	
	tr.remove();
}