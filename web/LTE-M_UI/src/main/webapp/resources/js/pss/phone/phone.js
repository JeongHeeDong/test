$(document).ready(function() {
	configure();
	initPopup();
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getList(1);
		}
	});
});

function configure() {
	$('#searchOpt_ul').empty();
	$('#searchOpt_ul').append('<li value="">단말 번호</li>');
	$('#searchOpt_ul').append('<li value="">단말 사용명</li>');

	$('#phoneTypeUl').empty();
	$('#phoneTypeUl').append('<li data-value="1">차상</li>');
	$('#phoneTypeUl').append('<li data-value="2" class="active">휴대용</li>');

	$('#csvPhoneTypeUl').empty();
	$('#csvPhoneTypeUl').append('<li data-value="1">차상</li>');
	$('#csvPhoneTypeUl').append('<li data-value="2" class="active">휴대용</li>');

	//drop_down_set(); //안에서 pageSearch() 호출

	$.ajax({
		type : 'post',
		url: '/pss/phone/phoneUseCodeList',
		contentType: 'application/json',
		dataType: "json",
		success: function (data) {
			var $phoneUseCodeUl = $('#phoneUseCodeUl');
			var $csvPhoneUseCodeUl = $('#csvPhoneUseCodeUl');
			
			$phoneUseCodeUl.empty();
			$phoneUseCodeUl.append('<li data-value="" class="active">선택</li>');
			$csvPhoneUseCodeUl.empty();
			$csvPhoneUseCodeUl.append('<li data-value="" class="active">선택</li>');
			$.each(data.list, function() {
				$phoneUseCodeUl.append('<li data-value="' + this.USE_CODE + '">' + this.USE_CODE_NAME + '</li>');
				$csvPhoneUseCodeUl.append('<li data-value="' + this.USE_CODE + '">' + this.USE_CODE_NAME + '</li>');
			});
			drop_down_set(); //안에서 pageSearch() 호출
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function initPopup() {
	$('#phoneAddClose, #phoneAddCancel, #phoneAddBg').on('click',function(e) {
		$('#phoneAddBg').fadeOut();
		$('#phoneAddUp').fadeOut();
	});
	
	$('#csvUploadClose, #csvUploadCancel, #csvUploadBg').on('click',function(e) {
		$('#csvUploadBg').fadeOut();
		$('#csvUploadUp').fadeOut();
	});
}

function initForm() {
	$('#phoneTypeUl li:last, #phoneUseCodeUl li:first').trigger('click');
	$('#phoneAddUp').find('input:text').each(function() {
		$(this).val('');
	});
}

function phoneAddView(obj) {
	initForm();
	
	$('#phoneAddBg').show().fadeIn('fast');
	$('#phoneAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#phoneAddUp').height()-100)/2;
	var width = (screen.width - $('#phoneAddUp').width())/2;
	
	$('#phoneAddUp').css('left',width+'px');
	$('#phoneAddUp').css('top',height+'px');
	
	$("#phoneAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#phoneAddUp .title').html('단말 추가');
	$('#phoneAddUp input[name="PHONE_NO"]').prop('disabled', false);
	
	$('#phoneAddSave').attr('onclick','insertPhone()');
}

function phoneModifyView(){
	initForm();
	
	var checked = $('[name=phoneChk]:checked'); 
	if ( checked.length == 0 ) {
		alert('수정할 데이터를 선택해주세요.');
		return;
	} else if ( checked.length > 1  ) {
		alert('수정은 하나씩만 가능합니다.');
		return;
	}
	
	$('#phoneAddBg').show().fadeIn('fast');
	$('#phoneAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#phoneAddUp').height()-100)/2
	var width = (screen.width - $('#phoneAddUp').width())/2
	
	$('#phoneAddUp').css('left',width+'px');
	$('#phoneAddUp').css('top',height+'px');
	
	$("#phoneAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#phoneAddUp .title').html('단말 수정');
	$('#phoneAddUp input[name="PHONE_NO"]').prop('disabled', true);
	
	$('#phoneAddSave').attr('onclick','modifyPhone()');
	
	// 데이터 셋팅
	var data = checked.closest('tr').data('data');
	$('#phoneTypeUl li').each(function() {
		if($(this).data('value') == data.PHONE_TYPE) {
			$(this).trigger('click');
		}
	});
	$('#phoneUseCodeUl li').each(function() {
		if($(this).data('value') == data.PHONE_USE_CODE) {
			$(this).trigger('click');
		}
	});
	$('#phoneAddUp').find('input:text').each(function() {
		$(this).val(data[$(this).prop('name')]);
	});
}

function csvUploadView() {
	$('#csvUploadBg').show().fadeIn('fast');
	$('#csvUploadUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#csvUploadUp').height()-100)/2;
	var width = (screen.width - $('#csvUploadUp').width())/2;
	
	$('#csvUploadUp').css('left',width+'px');
	$('#csvUploadUp').css('top',height+'px');
	
	$("#csvUploadDiv").scrollTop(0);

	$('#csvPhoneTypeUl li:last, #csvPhoneUseCodeUl li:first').trigger('click');
	$('#csvFileName, #csvFile').val('');
}

function csvSampleDownload() {
	location.href = '/pss/phone/csvSampleDownload';
}

function csvUploadSave() {
	var formData = new FormData();
	formData.append('PHONE_TYPE', $('#csvPhoneTypeUl li.active').data('value'));
	formData.append('PHONE_USE_CODE', $('#csvPhoneUseCodeUl li.active').data('value'));
	formData.append('csvFile', $('#csvFile').get(0).files[0]);

	if(formData.get('PHONE_USE_CODE') === '') {
		alert('그룹명을 선택하세요.');
		return;
	}
	if($('#csvFile').val() === '') {
		alert('CSV 파일을 선택하세요.');
		return;
	}
	
	$.ajax({
		url: "/pss/phone/csvUpload",
		data: formData,
		dataType: 'json',
		processData: false,
		contentType: false,
		type: 'POST',
		success: function (data) {
			alert(data.result);
			$('#csvUploadClose').trigger('click');
			getList(1);
		},
		error: function (jqXHR) {
		}
	});
}

function getList(firstPage){
	var pageNo;
	var pageSize = $('#pageSize').val();
	
	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}
	var totalCount = 0;
	
	var option = $('#searchOpt_btn').html();
	if ( option != '선택') {
		$.each($('#phoneTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
		
	var word	= $('#searchWord').val();
	var optionData  = {
		searchOpt : option, 
		searchWord : word, 
		pageNo : (pageNo - 1) * pageSize,
		pageSize : pageSize
	};
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/pss/phone/phoneList',
		contentType: 'application/json',
		data: requestData,
		dataType: "json",
		success: function (data) {
			setGridInfo(data);
			totalCount = data.totalCount;
			pagingSetting(totalCount, pageNo, pageSize);
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function setGridInfo(data) {
	 var dataList = data.list;
		
	 $('#phoneGrid').empty();
	 
	$.each(dataList, function(i, o) {
		var phoneType = o.PHONE_TYPE;
		if(o.PHONE_TYPE == '1') {
			phoneType = '차상';
		} else if(o.PHONE_TYPE == '2') {
			phoneType = '휴대용';
		}
		$('#phoneGrid').append(
			$('<tr>'+
				'<td><input type="checkbox" name="phoneChk" value="' + o.PHONE_NO + '" /></td>'+
				'<td>'+ o.PHONE_NO +'</td>'+
				'<td>'+ phoneType +'</td>'+
				'<td>'+ o.PHONE_USE_CODE_NAME +'</td>'+
				'<td>'+ o.PHONE_USE_NAME +'</td>'+
				'<td>'+ o.MSISDN +'</td>'+
			'</tr>').data('data', o)
		);
	});
}

function getFormData() {
	var data = {};
	data.PHONE_TYPE = $('#phoneTypeUl li.active').data('value');
	data.PHONE_USE_CODE = $('#phoneUseCodeUl li.active').data('value');
	$('#phoneAddUp').find('input:text').each(function() {
		data[$(this).prop('name')] = $(this).val();
	});
	
	return data;
}

function insertPhone() {
	var requestData = getFormData();
	
	if(requestData.PHONE_NO === '') {
		alert('단말 번호를 입력하세요.');
		return;
	}
	if(requestData.PHONE_TYPE === '') {
		alert('단말 구분을 입력하세요.');
		return;
	}
	if(requestData.PHONE_USE_CODE === '') {
		alert('그룹명을 선택하세요.');
		return;
	}
	
	$.ajax({
		type : 'post',
		url: '/pss/phone/insertPhone',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('등록 되었습니다.');
				getList();
				$('#phoneAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function modifyPhone() {
	var requestData = getFormData();

	if(requestData.PHONE_TYPE === '') {
		alert('단말 구분을 입력하세요.');
		return;
	}
	if(requestData.PHONE_USE_CODE === '') {
		alert('그룹명을 선택하세요.');
		return;
	}
	
	$.ajax({
		type : 'post',
		url: '/pss/phone/modifyPhone',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('수정 되었습니다.');
				getList();
				$('#phoneAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function deletePhone() {
	var checks = $('[name="phoneChk"]:checked');
	
	if(checks.length == 0) {
		alert('삭제할 데이터를 선택해주세요.');
		return;
	}
	if(!confirm('선택된 데이터를 삭제 하시겠습니까?')) {
		return;
	}
	
	var phoneNoList = [];
	$.each(checks, function(i, check){
		var data  = $(this).closest('tr').data('data');
		phoneNoList.push(data.PHONE_NO);
	});

	$.ajax({
		type : 'post',
		url: '/pss/phone/deletePhone',
		contentType: 'application/json',
		data: JSON.stringify(phoneNoList),
		dataType: "json",
		async:false,
		success: function (data) {
			if (data.result == 'OK') {
				alert('삭제 되었습니다.');
				getList();
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function excelDownload(){
	var headerList = [];
	var columnList = [];
	var headers;
	var columns;
	var index=0;
	
	$('#phoneTable thead tr th').each(function(i, th){
		if ( th.hasAttribute('id') ) {
			headerList[index] = $(th).find('.th_val').html();
			columnList[index] = th.id;
			index++;
		}
	});
	
	headers = headerList.join(",");
	columns = columnList.join(",");
	
	
	var option = $('#searchOpt_btn').html();
	if ( option != '선택') {
		$.each($('#phoneTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
	var word	= $('#searchWord').val();
	
	var url =  '/pss/phone/excelDown?TITLE=단말_관리&HEADERS='+headers+'&COLUMNS='+columns
	+'&searchOpt='+option+'&searchWord='+word;
	$(location).attr('href', url);
}

function pageSearch() {
	getList();
}

function allCheck() {
	$.each( $('[name="phoneChk"]'), function(i, chk){
		if ( $('#phoneChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}

function extValidCheck(obj) {
	var fileName = $(obj).val();
	var length = fileName.length;
	var dot = fileName.lastIndexOf('.');
	
	var fileExt = fileName.substring(dot + 1, length);
	if(fileExt !== 'csv') {
		alert('CSV 파일만 업로드 할 수 있습니다.');
		$('#csvFileName, #csvFile').val('');
	} else {
		$('#csvFileName').val($('#csvFile').val());
	}
}
