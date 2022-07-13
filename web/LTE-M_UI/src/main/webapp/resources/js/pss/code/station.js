var lineInfoDict= {};  //노선ID: 노선명 저장

$(document).ready(function() {
	getlineInfo();
	configure();
	initPopup();
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getList(1);
		}
	});
	
});

function getlineInfo() {
	lineAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/pss/code/station/getStationLine',
		dataType : 'json',
		success	: function(data) {
			var lineInfoData = data
			var lineInfoDataLen = lineInfoData.length;
			var $lineHtml = $('[name="lineCategory"]')
			var lineHtmlList = [];
			lineHtmlList.push(' <option value="">전체</option>');
			
			// 노선ID: 노선명 저장
			$.each(lineInfoData ,function(idx, lineinfo){
//				if(lineinfo.LINE_ID != '0'){
//					lineHtmlList.push(' <option value="'+lineinfo.LINE_ID+'">'+ lineinfo.LINE_NAME +'</option>');
//				}
				lineHtmlList.push(' <option value="'+lineinfo.LINE_ID+'">'+ lineinfo.LINE_NAME +'</option>');
			})
			$lineHtml.append(lineHtmlList.join(''));
			
			// 추가/수정 호선 셀렉트박스 구성, lineInfoDict값입력
			$.each(lineInfoData ,function(idx, lineinfo){
				if(lineinfo.LINE_ID != '0'){
					lineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
//					srcIdx = idx
					$('#LINE_ID_POP').append('<li data-id='+lineInfoData[idx].LINE_ID+'>'+lineInfoData[idx].LINE_NAME+'</li>');
//					for(var idx;idx<lineInfoData.length;idx++) {
//						if (lineInfoData[idx+1] != undefined){
//							var lines = lineInfoData[srcIdx].LINE_ID +','+ lineInfoData[idx+1].LINE_ID
//							var lensNm = lineInfoData[srcIdx].LINE_NAME +','+ lineInfoData[idx+1].LINE_NAME
//							$('#LINE_ID_POP').append('<li data-id='+lines+'>'+lensNm+'</li>');
//							lineInfoDict[lines] = lensNm;
//						}
//					}
				}
			})
			drop_down_set();
		},
		error: function () { 
		   }
	})
}

function configure() {
	$('#searchOpt_ul').empty();
	$('#searchOpt_ul').append('<li value="">역사 명</li>');
	$('#STATION_TYPE_POP').append('<li data-id=2>일반역</li>');
	$('#STATION_TYPE_POP').append('<li data-id=1>환승역</li>');

//	$.when(lineAjax).done(function(lineInfoData) {
//		var lineInfoDataLen = lineInfoData.length;
//		var $lineHtml = $('[name="lineCategory"]')
//		var lineHtmlList = [];
//		lineHtmlList.push(' <option value="">전체</option>');
//		$.each(lineInfoData ,function(idx, lineinfo){
//			lineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
//			lineHtmlList.push(' <option value="'+lineinfo.LINE_ID+'">'+ lineinfo.LINE_NAME +'</option>');
//		})
//		$lineHtml.append(lineHtmlList.join(''));
//		
//	})
//	$.each(lineAjaxData ,function(idx, lineinfo){
//		srcIdx = idx
//		for(var idx;idx<lineAjaxData.length;idx++) {
//			if (lineAjaxData[idx+1] != undefined){
//				var lines = lineAjaxData[srcIdx].LINE_ID +','+ lineAjaxData[idx+1].LINE_ID
//				var lensNm = lineAjaxData[srcIdx].LINE_NAME +','+ lineAjaxData[idx+1].LINE_NAME
//				$('#STATION_LINE_POP').append('<li data-id='+lines+'>'+lensNm+'</li>');
//			}
//		}
//	})
//	drop_down_set(); //안에서 pageSearch() 호출
	
	
}

function initPopup() {
	$('#stationAddClose, #stationAddCancel, #stationAddBg').on('click',function(e) {
		$('#stationAddBg').fadeOut();
		$('#stationAddUp').fadeOut();
	});
}

function initForm() {
	$('#stationAddUp').find('input:text, input[type="number"]', 'button').each(function() {
		$(this).val('');
	});
//	$('#station_type_pop_btn').val('');
}

function stationAddView(obj) {
	initForm();
	
	$('#stationAddBg').show().fadeIn('fast');
	$('#stationAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#stationAddUp').height()-100)/2;
	var width = (screen.width - $('#stationAddUp').width())/2;
	
	$('#stationAddUp').css('left',width+'px');
	$('#stationAddUp').css('top',height+'px');
	
	$("#stationAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#stationAddUp .title').html('역사정보 추가');
	$('#stationAddUp input[name="STATION_ID"]').prop('disabled', false);
	
	$('#stationAddSave').attr('onclick','insertstation()');
	$('#STATION_TYPE_NM').val('2');
	$('#LINE_ID').val('1');
	
}

function stationModifyView(){
	initForm();
	
	var checked = $('[name=stationChk]:checked'); 
	if ( checked.length == 0 ) {
		alert('수정할 데이터를 선택해주세요.');
		return;
	} else if ( checked.length > 1  ) {
		alert('수정은 하나씩만 가능합니다.');
		return;
	}
	
	$('#stationAddBg').show().fadeIn('fast');
	$('#stationAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#stationAddUp').height()-100)/2
	var width = (screen.width - $('#stationAddUp').width())/2
	
	$('#stationAddUp').css('left',width+'px');
	$('#stationAddUp').css('top',height+'px');
	
	$("#stationAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#stationAddUp .title').html('역사정보 수정');
	$('#stationAddUp input[name="STATION_ID"]').prop('disabled', true);
	
	$('#stationAddSave').attr('onclick','modifystation()');
	
	// 데이터 셋팅
	var data = checked.closest('tr').data('data');
	$('#stationAddUp').find('input:text, input[type="number"]').each(function() {
		var station_key = $(this).prop('name');
		$(this).val(data[station_key]);
	});
	$('#STATION_TYPE_NM').text(data['STATION_TYPE_NM']);
	$('#STATION_TYPE_NM').val(data['STATION_TYPE']);
	$('#LINE_ID').text(lineInfoDict[data['LINE_ID']]);
	$('#LINE_ID').val(data['LINE_ID']);
	$('#LINE_ID_ORG').val(data['LINE_ID']);
	
}

function getList(firstPage){
	var pageNo;
	var pageSize = $('#pageSize').val();
	var line = $('[name="lineCategory"]').val();
	
	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}
	var totalCount = 0;
	
	var option = $('#searchOpt_btn').html();
	if ( option != '선택') {
		$.each($('#stationTable').find('th') ,function(i, th){
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
		pageSize : pageSize,
		line : line
	};
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/pss/code/station/list',
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
		
	 $('#stationGrid').empty();
	 
	$.each(dataList, function(i, o) {
//		var STATION_TYPE_NAME = '일반역';
//		if (o.STATION_TYPE === '1'){
//			var STATION_TYPE_NAME = '환승역' 
//		}
		// 호선 명
//		var LINE_NAME = '';
//		LINE_NAME = getLineName(o.LINE_ID)
		
//		o['STATION_TYPE_NAME'] = STATION_TYPE_NAME;
		$('#stationGrid').append(
			$('<tr>'+
				'<td><input type="checkbox" name="stationChk" value="' + o.STATION_ID + '" /></td>'+
				'<td>'+ o.LINE_NAME +'</td>'+
				'<td>'+ o.STATION_ID +'</td>'+
				'<td>'+ o.STATION_NAME +'</td>'+
				'<td>'+ o.STATION_TYPE_NM +'</td>'+
			'</tr>').data('data', o)
		);
	});
}

function getFormData() {
	var data = {};
	$('#stationAddUp').find('input:text, input[type="number"]').each(function() {
		data[$(this).prop('name')] = $(this).val();
	});
	data['STATION_TYPE'] = $('#STATION_TYPE_NM').val();
	data['LINE_ID'] = $('#LINE_ID').val();
	data['LINE_ID_ORG'] = $('#LINE_ID_ORG').val();
	
	
	return data;
}

function insertstation() {
	var requestData = getFormData();
	
	if(requestData.STATION_ID === '' || requestData.STATION_ID === undefined) {
		alert('역사 ID를 입력하세요.');
		return;
	}
	if(requestData.STATION_NUM === '' || requestData.STATION_NUM === undefined) {
		alert('역사 정렬 코드를 입력하세요.');
		return;
	}
	if(requestData.STATION_NAME === '' || requestData.STATION_NAME === undefined) {
		alert('역사 명을 입력하세요.');
		return;
	}
	if(requestData.LINE_ID === '' || requestData.LINE_ID === undefined) {
		alert('호선을 선택하세요');
		return;
	}
	
	
	$.ajax({
		type : 'post',
		url: '/pss/code/station/insert',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('등록 되었습니다.');
				getList();
				$('#stationAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function modifystation() {
	var requestData = getFormData();
	
	if(requestData.STATION_NUM === '') {
		alert('역사정렬코드를 입력하세요.');
		return;
	}
	
	if(requestData.STATION_NAME === '') {
		alert('역사명을 입력하세요.');
		return;
	}
	
//	if (requestData['STATION_TYPE'] == '일반역'){
//		requestData['STATION_TYPE'] = '2';
//	}else{
//		requestData['STATION_TYPE'] = '1';
//	}

	$.ajax({
		type : 'post',
		url: '/pss/code/station/modify',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('수정 되었습니다.');
				getList();
				$('#stationAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function deleteStation() {
	var checks = $('[name="stationChk"]:checked');
	
	if(checks.length == 0) {
		alert('삭제할 데이터를 선택해주세요.');
		return;
	}
	if(!confirm('선택된 데이터를 삭제 하시겠습니까?')) {
		return;
	}
	
	var stationIdList = [];
	$.each(checks, function(i, check){
		var data  = $(this).closest('tr').data('data');
		stationIdList.push(data.STATION_ID);
	});

	$.ajax({
		type : 'post',
		url: '/pss/code/station/delete',
		contentType: 'application/json',
		data: JSON.stringify(stationIdList),
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
	var line = $('[name="lineCategory"]').val();
	
	$('#stationTable thead tr th').each(function(i, th){
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
		$.each($('#stationTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
	var word	= $('#searchWord').val();
	
	var url =  '/pss/code/excelDown?PAGE=station&TITLE=역사정보_관리&HEADERS='+headers+'&COLUMNS='+columns
	+'&searchOpt='+option+'&searchWord='+word+'&line='+line;
	$(location).attr('href', url);
}

function pageSearch() {
	getList();
}

function getLineName(value){
	var LINE_NAME =  '';
	if(value != undefined){
		if(value.includes(',')){
			lineList = value.split(',');
			lineNameList = []
			$.each(lineList, function(i, line) {
				if(line in lineInfoDict){
					lineNameList.push(lineInfoDict[line]);
				}else{
					lineNameList.push(line);
				}
			})
			LINE_NAME = lineNameList.splice(',');
		}else{
			if(value in lineInfoDict){
				LINE_NAME = lineInfoDict[value];
			}else{
				LINE_NAME = value;
			}
		}
	}
	return LINE_NAME;
}

function allCheck() {
	$.each( $('[name="stationChk"]'), function(i, chk){
		if ( $('#stationChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}
