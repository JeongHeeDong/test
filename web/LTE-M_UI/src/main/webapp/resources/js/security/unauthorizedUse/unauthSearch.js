$(document).ready(function() {
	configure();
	pageSearch();
});

function configure() {
	$('#search_from').datepicker(
			{
				dateFormat : 'yy-mm-dd',
				changeYear : true,
				changeMonth : true,
				showButtonPanel : true,
				"setDate" : new Date(),
				stepMonths : 1,
				dayNamesMin : [ '일', '월', '화', '수', '목', '금', '토' ],
				monthNames : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월',
						'9월', '10월', '11월', '12월' ],
				monthNamesShort : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월',
						'8월', '9월', '10월', '11월', '12월' ],
				onClose : function(selectedDate) {
					$('#search_to').datepicker('option', 'minDate',
							selectedDate);
				}
			});

	$('#search_to').datepicker(
			{
				minDate : "+1D",
				dateFormat : 'yy-mm-dd',
				changeYear : true,
				changeMonth : true,
				showButtonPanel : true,
				defaultDate : new Date(),
				stepMonths : 1,
				dayNamesMin : [ '일', '월', '화', '수', '목', '금', '토' ],
				monthNames : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월',
						'9월', '10월', '11월', '12월' ],
				monthNamesShort : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월',
						'8월', '9월', '10월', '11월', '12월' ]
			});

	$("#search_from").datepicker().datepicker("setDate", new Date());
	$("#search_to").datepicker().datepicker("setDate", new Date());

	$('#search_from_btn').on('click', function(e) {
		$('#search_from').datepicker("show");
	});
	$('#search_to_btn').on('click', function(e) {
		$('#search_to').datepicker("show");
	});

	$('#searchOpt').change(function() {
		searchOptChange();
	});

	$('#secondOpt').change(function() {
		$('#searchWord').val('');
	});
}

function searchOptChange() {
	var searchOptVal = $('#searchOpt option:selected').val();

	if (searchOptVal == "0") {
		$('#secondOpt').empty();
		$('#secondOpt').append(
				'<option value="0">접속 시도 IP</option>'
						+ '<option value="1">접속 시도 ID</option>'
						+ '<option value="2">접속 시도 메뉴명</option>'
						+ '<option value="3">사용자 ID</option>');
	} else if (searchOptVal == "4") {
		$('#secondOpt').empty();
		$('#secondOpt').append(
				'<option value="0">접속 시도 IP</option>'
						+ '<option value="2">접속 시도 메뉴명</option>'
						+ '<option value="3">사용자 ID</option>');
	} else {
		$('#secondOpt').empty();
		$('#secondOpt').append(
				'<option value="0">접속 시도 IP</option>'
						+ '<option value="1">접속 시도 ID</option>');
	}

	$('#searchWord').val('');
}

function pageSearch() {
	 getUnauthData();
}

function theadChange() {
	var searchOptVal = $('#searchOpt option:selected').val();

	if (searchOptVal == "0") {
		$("#unauthDataGridHeader").html(
				'<th>시간</th>' +
				'<th>부정사용 종류</th>' +
				'<th>접근 시도 IP</th>' +
				'<th>접근 시도 ID</th>' +
				'<th>접근 시도 URI</th>' +
				'<th>사용자 ID(이름)</th>' +
				'<th>메뉴명</th>');
		$(".js-grid-colgroup").html(
				'<col width="10%">' +
				'<col width="10%">' +
				'<col width="10%">' +
				'<col width="10%">' +
				'<col width="20%">' +
				'<col width="10%">' +
				'<col>');
	} else if (searchOptVal == "4") {
		$("#unauthDataGridHeader").html(
				'<th>시간</th>' +
				'<th>부정사용 종류</th>' +
				'<th>접근 시도 IP</th>' +
				'<th>접근 시도 URI</th>' +
				'<th>사용자 ID(이름)</th>' +
				'<th>메뉴명</th>');
		$(".js-grid-colgroup").html(
				'<col width="15%">' +
				'<col width="15%">' +
				'<col width="15%">' +
				'<col width="25%">' +
				'<col width="15%">' +
				'<col width="15%">' +
				'<col>');
	} else {
		$("#unauthDataGridHeader").html(
				'<th>시간</th>' +
				'<th>부정사용 종류</th>' +
				'<th>접근 시도 IP</th>' +
				'<th>접근 시도 ID</th>');
		$(".js-grid-colgroup").html(
				'<col width="25%">' +
				'<col width="25%">' +
				'<col width="25%">' +
				'<col>');
	}
}


function getUnauthData(){
	
	var requestData;
	var pagingNum = $('#pageSize').val();
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	var searchOptVal = $('#searchOpt option:selected').val();
	var secondType = $('#secondOpt option:selected').val();
	var secondTypeCol = '';
	
	if(secondType == "0") secondTypeCol = 'INET_NTOA(ACCESS_IP)';
	else if(secondType == "1") secondTypeCol = 'AT_ID';
	else if(secondType == "2") secondTypeCol = 'MENU_INFO';
	else if(secondType == "3") secondTypeCol = 'TB_SE_FDETECT.USER_ID';
	
	requestData = {
			type :searchOptVal,
			secondTypeCol : secondTypeCol,
			searchWord : $('#searchWord').val(),
			pageNo : (pageNo-1)*Number(pagingNum),
			pagingNum : Number(pagingNum),
			startDateTime : $('#search_from').val(),
			endDateTime : $('#search_to').val()
		};
	
	requestData = JSON.stringify(requestData);
	
	
	$.ajax({
		type : 'post',
		url : '/security/unauthorizedUse/unauthSearch/getUnauthData',
		contentType : 'application/json',
		dataTpye : 'json',
		data : requestData,
		success : function(data) {
			
			theadChange();
			
			$('#unauthDataGridBody').empty();
			var num = (pageNo - 1) * Number(pagingNum);
			var thLength = $('#unauthDataGridHeader th').length;
			var tdTag = '';
			var gridTd = '';
			
			$.each(data.getUnauthData,function(i,value){
				
				num++;
				
				gridTd += '<tr>';
				gridTd += '<td>'+value.EVENT_TIME+'</td>';
				
				var type = value.TYPE;
				
				gridTd += '<td>'+type+'</td>';
				gridTd += '<td>'+value.ACCESS_IP+'</td>';
				
				if (searchOptVal == "0") {
					gridTd += '<td>'+value.AT_ID+'</td>';
					gridTd += '<td>'+value.AT_URI+'</td>';
					gridTd += '<td>'+value.USER_IDNAME+'</td>';
					gridTd += '<td>'+value.MENU_INFO+'</td>';
					
				} else if (searchOptVal == "4") {
					gridTd += '<td>'+value.AT_URI+'</td>';
					gridTd += '<td>'+value.USER_IDNAME+'</td>';
					gridTd += '<td>'+value.MENU_INFO+'</td>';

				} else {
					gridTd += '<td>'+value.AT_ID+'</td>';
				}
				
				gridTd += '</tr>';
				
			});
			
			$('#unauthDataGridBody').append(gridTd);
		
			for (var cnt = 0; cnt < thLength; cnt++) tdTag += '<td></td>';
		
			totalcount = data.getUnauthData.length <= 0 ? 0 : data.getUnauthData[0].TOTAL_COUNT;
		
			if (pageNo * Number(pagingNum) > num) {
				for (var index = 0; index < (pageNo * Number(pagingNum))- num; index++) {
					$('#unauthDataGridBody').append(
							'' + '<tr style="height:31px;">' + tdTag
									+ '</tr>');
				}
			}
			pagingSetting(totalcount, $('#pageNo').val(), pagingNum);
		},
		error : function(data) {
		
		}
	});
}

function excelDownload(){
	
	var searchOptVal = $('#searchOpt option:selected').val();
	var secondType = $('#secondOpt option:selected').val();
	var secondTypeCol = '';
	
	if(secondType == "0") secondTypeCol = 'INET_NTOA(ACCESS_IP)';
	else if(secondType == "1") secondTypeCol = 'AT_ID';
	else if(secondType == "2") secondTypeCol = 'MENU_INFO';
	else if(secondType == "3") secondTypeCol = 'TB_SE_FDETECT.USER_ID';
	

		var url = "/security/unauthorizedUse/unauthSearch/excelDown?type="
			+ searchOptVal + "&secondTypeCol=" + secondTypeCol + "&searchWord="
			+ $('#searchWord').val() + "&startDateTime="
			+ $('#search_from').val() + "&endDateTime=" + $('#search_to').val();
		
	$(location).attr('href', url);
}
