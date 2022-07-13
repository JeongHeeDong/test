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
	$('#searchOpt_ul').append('<li value="">제조사명</li>');
	$('#searchOpt_ul').append('<li value="">설명</li>');

	drop_down_set(); //안에서 pageSearch() 호출
}

function initPopup() {
	$('#vendorAddClose, #vendorAddCancel, #vendorAddBg').on('click',function(e) {
		$('#vendorAddBg').fadeOut();
		$('#vendorAddUp').fadeOut();
	});
}

function initForm() {
	$('#vendorAddUp').find('input:text, input[type="number"]').each(function() {
		$(this).val('');
	});
}

function vendorAddView(obj) {
	initForm();
	
	$('#vendorAddBg').show().fadeIn('fast');
	$('#vendorAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#vendorAddUp').height()-100)/2;
	var width = (screen.width - $('#vendorAddUp').width())/2;
	
	$('#vendorAddUp').css('left',width+'px');
	$('#vendorAddUp').css('top',height+'px');
	
	$("#vendorAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#vendorAddUp .title').html('제조사 추가');
	$('#vendorAddUp input[name="VENDOR_ID"]').prop('disabled', false);
	
	$('#vendorAddSave').attr('onclick','insertVendor()');
}

function vendorModifyView(){
	initForm();
	
	var checked = $('[name=vendorChk]:checked'); 
	if ( checked.length == 0 ) {
		alert('수정할 데이터를 선택해주세요.');
		return;
	} else if ( checked.length > 1  ) {
		alert('수정은 하나씩만 가능합니다.');
		return;
	}
	
	$('#vendorAddBg').show().fadeIn('fast');
	$('#vendorAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#vendorAddUp').height()-100)/2
	var width = (screen.width - $('#vendorAddUp').width())/2
	
	$('#vendorAddUp').css('left',width+'px');
	$('#vendorAddUp').css('top',height+'px');
	
	$("#vendorAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#vendorAddUp .title').html('제조사 수정');
	$('#vendorAddUp input[name="VENDOR_ID"]').prop('disabled', true);
	
	$('#vendorAddSave').attr('onclick','modifyVendor()');
	
	// 데이터 셋팅
	var data = checked.closest('tr').data('data');
	$('#vendorAddUp').find('input:text, input[type="number"]').each(function() {
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
		$.each($('#vendorTable').find('th') ,function(i, th){
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
		url: '/pss/code/vendor/list',
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
		
	 $('#vendorGrid').empty();
	 
	$.each(dataList, function(i, o) {
		$('#vendorGrid').append(
			$('<tr>'+
				'<td><input type="checkbox" name="vendorChk" value="' + o.VENDOR_ID + '" /></td>'+
				'<td>'+ o.VENDOR_ID +'</td>'+
				'<td>'+ o.VENDOR_NAME +'</td>'+
				'<td>'+ o.VENDOR_DESC +'</td>'+
			'</tr>').data('data', o)
		);
	});
}

function getFormData() {
	var data = {};
	$('#vendorAddUp').find('input:text, input[type="number"]').each(function() {
		data[$(this).prop('name')] = $(this).val();
	});
	
	return data;
}

function insertVendor() {
	var requestData = getFormData();
	
	if(requestData.VENDOR_ID === '') {
		alert('제조사ID를 입력하세요.');
		return;
	}
	if(requestData.VENDOR_NAME === '') {
		alert('제조사명을 입력하세요.');
		return;
	}
	
	$.ajax({
		type : 'post',
		url: '/pss/code/vendor/insert',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('등록 되었습니다.');
				getList();
				$('#vendorAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function modifyVendor() {
	var requestData = getFormData();
	
	if(requestData.VENDOR_NAME === '') {
		alert('제조사명을 입력하세요.');
		return;
	}

	$.ajax({
		type : 'post',
		url: '/pss/code/vendor/modify',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('수정 되었습니다.');
				getList();
				$('#vendorAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function deleteVendor() {
	var checks = $('[name="vendorChk"]:checked');
	
	if(checks.length == 0) {
		alert('삭제할 데이터를 선택해주세요.');
		return;
	}
	if(!confirm('선택된 데이터를 삭제 하시겠습니까?')) {
		return;
	}
	
	var vendorIdList = [];
	$.each(checks, function(i, check){
		var data  = $(this).closest('tr').data('data');
		vendorIdList.push(data.VENDOR_ID);
	});

	$.ajax({
		type : 'post',
		url: '/pss/code/vendor/delete',
		contentType: 'application/json',
		data: JSON.stringify(vendorIdList),
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
	
	$('#vendorTable thead tr th').each(function(i, th){
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
		$.each($('#vendorTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
	var word	= $('#searchWord').val();
	
	var url =  '/pss/code/excelDown?PAGE=vendor&TITLE=제조사_관리&HEADERS='+headers+'&COLUMNS='+columns
	+'&searchOpt='+option+'&searchWord='+word;
	$(location).attr('href', url);
}

function pageSearch() {
	getList();
}

function allCheck() {
	$.each( $('[name="vendorChk"]'), function(i, chk){
		if ( $('#vendorChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}
