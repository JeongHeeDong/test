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
	$('#searchOpt_ul').append('<li value="">단말그룹 CODE명</li>');

	drop_down_set(); //안에서 pageSearch() 호출
}

function initPopup() {
	$('#phoneAddClose, #phoneAddCancel, #phoneAddBg').on('click',function(e) {
		$('#phoneAddBg').fadeOut();
		$('#phoneAddUp').fadeOut();
	});
}

function initForm() {
	$('#phoneAddUp').find('input:text, input[type="number"]').each(function() {
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
	$('#phoneAddUp .title').html('단말그룹 CODE 추가');
	$('#phoneAddUp input[name="USE_CODE"]').prop('disabled', false);
	
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
	$('#phoneAddUp .title').html('단말그룹 CODE 수정');
	$('#phoneAddUp input[name="USE_CODE"]').prop('disabled', true);
	
	$('#phoneAddSave').attr('onclick','modifyPhone()');
	
	// 데이터 셋팅
	var data = checked.closest('tr').data('data');
	$('#phoneAddUp').find('input:text, input[type="number"]').each(function() {
		$(this).val(data[$(this).prop('name')]);
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
		url: '/pss/code/phone/list',
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
		$('#phoneGrid').append(
			$('<tr>'+
				'<td><input type="checkbox" name="phoneChk" value="' + o.USE_CODE + '" /></td>'+
				'<td>'+ o.USE_CODE +'</td>'+
				'<td>'+ o.USE_CODE_NAME +'</td>'+
			'</tr>').data('data', o)
		);
	});
}

function getFormData() {
	var data = {};
	$('#phoneAddUp').find('input:text, input[type="number"]').each(function() {
		data[$(this).prop('name')] = $(this).val();
	});
	
	return data;
}

function insertPhone() {
	var requestData = getFormData();
	
	if(requestData.USE_CODE === '') {
		alert('단말그룹 CODE를 입력하세요.');
		return;
	}
	if(requestData.USE_CODE_NAME === '') {
		alert('단말그룹 CODE명을 입력하세요.');
		return;
	}
	
	$.ajax({
		type : 'post',
		url: '/pss/code/phone/insert',
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
	
	if(requestData.PHONE_NAME === '') {
		alert('제조사명을 입력하세요.');
		return;
	}

	$.ajax({
		type : 'post',
		url: '/pss/code/phone/modify',
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
	
	var phoneIdList = [];
	$.each(checks, function(i, check){
		var data  = $(this).closest('tr').data('data');
		phoneIdList.push(data.USE_CODE);
	});

	$.ajax({
		type : 'post',
		url: '/pss/code/phone/delete',
		contentType: 'application/json',
		data: JSON.stringify(phoneIdList),
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
	
	var url =  '/pss/code/excelDown?PAGE=phone&TITLE=단말그룹코드_관리&HEADERS='+headers+'&COLUMNS='+columns
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
