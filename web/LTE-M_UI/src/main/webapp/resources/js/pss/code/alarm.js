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
	$('#searchOpt_ul').append('<li value="">장비 명</li>');
	$('#searchOpt_ul').append('<li value="">알람 CODE</li>');
	$('#searchOpt_ul').append('<li value="">알람 CAUSE</li>');
	$('#searchOpt_ul').append('<li value="">알람 등급</li>');
	$('#searchOpt_ul').append('<li value="">제조사 명</li>');
	$('[name=org_severity_name_ul]').empty();
	$('[name=org_severity_name_ul]').append('<li data-id=4>NORMAL</li>');
	$('[name=org_severity_name_ul]').append('<li data-id=3>MINOR</li>');
	$('[name=org_severity_name_ul]').append('<li data-id=2>MAJOR</li>');
	$('[name=org_severity_name_ul]').append('<li data-id=1>CRITICAL</li>');
	$('[name=org_severity_name_ul]').append('<li data-id=9>ETC</li>');
	
	$.ajax({
		   type : 'post',
		   url: '/pss/code/alarm/getConfigInfo',
		   dataType: "json",
		   success: function (data) {
			   $(data.equipInfo).each(function(key,value){
				   $('#equip_name_ul').append('<li data-id='+value.EQUIP_TYPE+'>'+value.EQUIP_NAME+'</li>');
			   })
			   $(data.vendorInfo).each(function(key,value){
				   $('#vendor_name_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   })
			   drop_down_set();
		   },
		   error: function () { 
			   alert('에러발생');
		   }
	})
	

//	drop_down_set(); //안에서 pageSearch() 호출
}

function initPopup() {
	$('#alarmAddClose, #alarmAddCancel, #alarmAddBg, #alarmMdfClose , #alarmMdfCancel, #alarmMdfBg').on('click',function(e) {
		$('#alarmAddBg').fadeOut();
		$('#alarmAddUp').fadeOut();
		$('#alarmMdfBg').fadeOut();
		$('#alarmMdfUp').fadeOut();
	});
}

function initForm() {
	$('#alarmAddUp').find('input:text, input[type="number"]').each(function() {
		$(this).val('');
	});
	$('#alarmAddUp button.mu-value').val('');
	$('#alarmAddUp button.mu-value').text('선택');
	
//	$('#alarm_type_pop_btn').val('');
}

function alarmAddView(obj) {
	initForm();
	
	$('#alarmAddBg').show().fadeIn('fast');
	$('#alarmAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#alarmAddUp').height()-100)/2;
	var width = (screen.width - $('#alarmAddUp').width())/2;
	
	$('#alarmAddUp').css('left',width+'px');
	$('#alarmAddUp').css('top',height+'px');
	
	$("#alarmAddDiv").scrollTop(0);
}

function alarmModifyView(){
	initForm();
	$('#alarmMdfUp #ORG_SEVERITY_NAME').val('');
	
	var checked = $('[name=alarmChk]:checked'); 
	if ( checked.length == 0 ) {
		alert('수정할 데이터를 선택해주세요.');
		return;
	} else if ( checked.length > 1  ) {
		alert('수정은 하나씩만 가능합니다.');
		return;
	}
	
	$('#alarmMdfBg').show().fadeIn('fast');
	$('#alarmMdfUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#alarmMdfUp').height()-100)/2
	var width = (screen.width - $('#alarmMdfUp').width())/2
	
	$('#alarmMdfUp').css('left',width+'px');
	$('#alarmMdfUp').css('top',height+'px');
	
	$("#alarmMdfDiv").scrollTop(0);
	
	// 데이터 셋팅
	var data = checked.closest('tr').data('data');
	$('#alarmMdfUp').find('input:text, input[type="number"]').each(function() {
		$(this).val(data[$(this).prop('name')]);
	});
	$('#alarmMdfUp #ORG_SEVERITY_NAME').text(data['ORG_SEVERITY_NAME']);
	
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
		$.each($('#alarmTable').find('th') ,function(i, th){
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
		url: '/pss/code/alarm/list',
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
		
	 $('#alarmGrid').empty();
	 
	$.each(dataList, function(i, o) {
		$('#alarmGrid').append(
			$('<tr>'+
				'<td><input type="checkbox" name="alarmChk" value="' + o.ALARM_CODE + '" /></td>'+
				'<td>'+ o.EQUIP_NAME +'</td>'+
				'<td>'+ o.ALARM_CODE +'</td>'+
				'<td>'+ o.PROBABLE_CAUSE +'</td>'+
				'<td>'+ o.ORG_SEVERITY_NAME +'</td>'+
				'<td>'+ o.VENDOR_NAME +'</td>'+
				'<td>'+ o.UPDATE_TIME +'</td>'+
			'</tr>').data('data', o)
		);
	});
}

function getFormData() {
	var data = {};
	$('#alarmAddUp').find('input:text, input[type="number"]').each(function() {
		data[$(this).prop('name')] = $(this).val();
	});
	
	return data;
}

function insertalarm() {
	var requestData = getFormData();
	
	if(requestData.ALARM_CODE === '') {
		alert('알람CODE를 입력하세요.');
		return;
	}
	if(requestData.PROBABLE_CAUSE === '') {
		alert('알람 CAUSE를 입력하세요.');
		return;
	}
	var ORG_SEVERITY_NAME = $('#alarmAddUp #ORG_SEVERITY_NAME').val();
	var EQUIP_NAME = $('#alarmAddUp #EQUIP_NAME').val();
	var VENDOR_NAME = $('#alarmAddUp #VENDOR_NAME').val();
	
	if (ORG_SEVERITY_NAME === ''){
		alert('등급을 선택하세요');
		return;
	}
	if (EQUIP_NAME === ''){
		alert('장비를 선택하세요');
		return;
	}
	if (VENDOR_NAME === ''){
		alert('제조사를 선택하세요');
		return;
	}
	
	requestData['ORG_SEVERITY_NAME'] = ORG_SEVERITY_NAME;
	requestData['EQUIP_NAME'] = EQUIP_NAME;
	requestData['VENDOR_NAME'] = VENDOR_NAME;
	
	
	$.ajax({
		type : 'post',
		url: '/pss/code/alarm/insert',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('등록 되었습니다.');
				getList();
				$('#alarmAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function modifyalarm() {
	var requestData = {};
	$('#alarmMdfUp').find('input:text, input[type="number"]').each(function() {
		requestData[$(this).prop('name')] = $(this).val();
	});
	
	if(requestData.PROBABLE_CAUSE === '') {
		alert('알람 CAUSE를 입력하세요.');
		return;
	}
	var ORG_SEVERITY_NAME = $('#alarmMdfUp #ORG_SEVERITY_NAME').val();
	if (ORG_SEVERITY_NAME != ''){
		requestData['ORG_SEVERITY_NAME'] = ORG_SEVERITY_NAME;
	}

	$.ajax({
		type : 'post',
		url: '/pss/code/alarm/modify',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('수정 되었습니다.');
				getList();
				$('#alarmAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function deleteAlarm() {
	var checks = $('[name="alarmChk"]:checked');
	
	if(checks.length == 0) {
		alert('삭제할 데이터를 선택해주세요.');
		return;
	}
	if(!confirm('선택된 데이터를 삭제 하시겠습니까?')) {
		return;
	}
	
	var alarmIdList = [];
	$.each(checks, function(i, check){
		var data  = $(this).closest('tr').data('data');
		alarmInfo = {}
		alarmInfo['ALARM_CODE'] = data.ALARM_CODE;
		alarmInfo['EQUIP_NAME'] = data.EQUIP_NAME;
		alarmInfo['VENDOR_NAME'] = data.VENDOR_NAME;
		alarmIdList.push(alarmInfo);
	});

	$.ajax({
		type : 'post',
		url: '/pss/code/alarm/delete',
		contentType: 'application/json',
		data: JSON.stringify(alarmIdList),
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
	
	$('#alarmTable thead tr th').each(function(i, th){
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
		$.each($('#alarmTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
	var word	= $('#searchWord').val();
	
	var url =  '/pss/code/excelDown?PAGE=alarm&TITLE=알람코드_관리&HEADERS='+headers+'&COLUMNS='+columns
	+'&searchOpt='+option+'&searchWord='+word;
	$(location).attr('href', url);
}

function pageSearch() {
	getList();
}

function allCheck() {
	$.each( $('[name="alarmChk"]'), function(i, chk){
		if ( $('#alarmChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}
