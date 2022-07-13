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
	$('#searchOpt_ul').append('<li value="">운용팀명</li>');
	$('#searchOpt_ul').append('<li value="">설명</li>');

	drop_down_set(); //안에서 pageSearch() 호출
}

function initPopup() {
	$('#teamAddClose, #teamAddCancel, #teamAddBg').on('click',function(e) {
		$('#teamAddBg').fadeOut();
		$('#teamAddUp').fadeOut();
	});
}

function initForm() {
	$('#teamAddUp').find('input:text, input[type="number"]').each(function() {
		$(this).val('');
	});
}

function teamAddView(obj) {
	initForm();
	
	$('#teamAddBg').show().fadeIn('fast');
	$('#teamAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#teamAddUp').height()-100)/2;
	var width = (screen.width - $('#teamAddUp').width())/2;
	
	$('#teamAddUp').css('left',width+'px');
	$('#teamAddUp').css('top',height+'px');
	
	$("#teamAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#teamAddUp .title').html('운용팀 추가');
	$('#teamAddUp input[name="TEAM_ID"]').prop('disabled', false);
	
	$('#teamAddSave').attr('onclick','insertTeam()');
}

function teamModifyView(){
	initForm();
	
	var checked = $('[name=teamChk]:checked'); 
	if ( checked.length == 0 ) {
		alert('수정할 데이터를 선택해주세요.');
		return;
	} else if ( checked.length > 1  ) {
		alert('수정은 하나씩만 가능합니다.');
		return;
	}
	
	$('#teamAddBg').show().fadeIn('fast');
	$('#teamAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#teamAddUp').height()-100)/2
	var width = (screen.width - $('#teamAddUp').width())/2
	
	$('#teamAddUp').css('left',width+'px');
	$('#teamAddUp').css('top',height+'px');
	
	$("#teamAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('#teamAddUp .title').html('운용팀 수정');
	$('#teamAddUp input[name="TEAM_ID"]').prop('disabled', true);
	
	$('#teamAddSave').attr('onclick','modifyTeam()');
	
	// 데이터 셋팅
	var data = checked.closest('tr').data('data');
	$('#teamAddUp').find('input:text, input[type="number"]').each(function() {
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
		$.each($('#teamTable').find('th') ,function(i, th){
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
		url: '/pss/code/team/list',
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
		
	 $('#teamGrid').empty();
	 
	$.each(dataList, function(i, o) {
		$('#teamGrid').append(
			$('<tr>'+
				'<td><input type="checkbox" name="teamChk" value="' + o.TEAM_ID + '" /></td>'+
				'<td>'+ o.TEAM_ID +'</td>'+
				'<td>'+ o.TEAM_NAME +'</td>'+
				'<td>'+ o.TEAM_DESC +'</td>'+
			'</tr>').data('data', o)
		);
	});
}

function getFormData() {
	var data = {};
	$('#teamAddUp').find('input:text, input[type="number"]').each(function() {
		data[$(this).prop('name')] = $(this).val();
	});
	
	return data;
}

function insertTeam() {
	var requestData = getFormData();
	
	if(requestData.TEAM_ID === '') {
		alert('운용팀ID를 입력하세요.');
		return;
	}
	if(requestData.TEAM_NAME === '') {
		alert('운용팀명을 입력하세요.');
		return;
	}
	
	$.ajax({
		type : 'post',
		url: '/pss/code/team/insert',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('등록 되었습니다.');
				getList();
				$('#teamAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function modifyTeam() {
	var requestData = getFormData();

	if(requestData.TEAM_NAME === '') {
		alert('운용팀명을 입력하세요.');
		return;
	}

	$.ajax({
		type : 'post',
		url: '/pss/code/team/modify',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		dataType: "json",
		async:false,
		success: function (data) {
			if(data.result == 'OK' ) {
				alert('수정 되었습니다.');
				getList();
				$('#teamAddClose').trigger('click');
			} else if(data.result) {
				alert(data.result);
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function deleteTeam() {
	var checks = $('[name="teamChk"]:checked');
	
	if(checks.length == 0) {
		alert('삭제할 데이터를 선택해주세요.');
		return;
	}
	if(!confirm('선택된 데이터를 삭제 하시겠습니까?')) {
		return;
	}
	
	var teamIdList = [];
	$.each(checks, function(i, check){
		var data  = $(this).closest('tr').data('data');
		teamIdList.push(data.TEAM_ID);
	});

	$.ajax({
		type : 'post',
		url: '/pss/code/team/delete',
		contentType: 'application/json',
		data: JSON.stringify(teamIdList),
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
	
	$('#teamTable thead tr th').each(function(i, th){
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
		$.each($('#teamTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
	var word	= $('#searchWord').val();
	
	var url =  '/pss/code/excelDown?PAGE=team&TITLE=운용팀_관리&HEADERS='+headers+'&COLUMNS='+columns
	+'&searchOpt='+option+'&searchWord='+word;
	$(location).attr('href', url);
}

function pageSearch() {
	getList();
}

function allCheck() {
	$.each( $('[name="teamChk"]'), function(i, chk){
		if ( $('#teamChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}
