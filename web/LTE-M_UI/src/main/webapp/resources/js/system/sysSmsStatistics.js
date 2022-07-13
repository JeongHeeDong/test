$(document).ready(function() {
	
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		getStatisticsData();
	});
	
	configure();
	pageSearch();
});

function configure() {
	
	var fromDatePicker = {
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
					'8월', '9월', '10월', '11월', '12월' ]
	};
	
	var toDatePicker ={
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
					'8월', '9월', '10월', '11월', '12월' ]
	}
	
	$('#search_from').datepicker(fromDatePicker);
	$('#search_to').datepicker(toDatePicker);
	
	$("#search_from").datepicker().datepicker("setDate", new Date());
	$("#search_to").datepicker().datepicker("setDate", new Date());

	$('#search_from_btn').on('click', function(e) {
		$('#search_from').datepicker("show");
	});
	$('#search_to_btn').on('click', function(e) {
		$('#search_to').datepicker("show");
	});

	$('#dateOpt').change(function() {
		dateOptChange(fromDatePicker,toDatePicker);
	});

	$('#secondOpt').change(function() {
		$('#searchWord').val('');
	});
}

function dateOptChange(fromDatePicker,toDatePicker) {
	var dateOptVal = $('#dateOpt option:selected').val();

	if (dateOptVal == "1") {
		$('#fromHourSelect').css('display','');
		$('#toHourSelect').css('display','');
		
		$("#search_from").datepicker( "option", "dateFormat", 'yy-mm-dd' );
		$("#search_to").datepicker( "option", "dateFormat", 'yy-mm-dd' );
		$("#search_from").datepicker().datepicker("setDate", new Date());
		$("#search_to").datepicker().datepicker("setDate", new Date());
	} else if (dateOptVal == "2") {
		$('#fromHourSelect').css('display','none');
		$('#toHourSelect').css('display','none');
		
		$("#search_from").datepicker( "option", "dateFormat", 'yy-mm-dd' );
		$("#search_to").datepicker( "option", "dateFormat", 'yy-mm-dd' );
		$("#search_from").datepicker().datepicker("setDate", new Date());
		$("#search_to").datepicker().datepicker("setDate", new Date());
	} else {
		$('#fromHourSelect').css('display','none');
		$('#toHourSelect').css('display','none');
		
		$("#search_from").datepicker( "option", "dateFormat", 'yy-mm' );
		$("#search_to").datepicker( "option", "dateFormat", 'yy-mm' );
		$("#search_from").datepicker().datepicker("setDate", new Date());
		$("#search_to").datepicker().datepicker("setDate", new Date());
	}

	$('#searchWord').val('');
}

function searchBtnClick(){
	
	columnSorting.sortInfo = [];
	columnSorting.beforeColNms = [];
	
	$('#headerTr').find('.sort').removeClass('updown');
	$('#headerTr').find('.sort').removeClass('up');
	$('#headerTr').find('.sort').removeClass('down');
	$('#headerTr').find('.sort').addClass('updown');
	
	$('#pageNo').val("1");
	$('#totalCount').val("0");
	
	pageSearch();
}

function pageSearch() {
	getStatisticsData();
}

function getParam(){
	
	var from_dateTime;
	var to_dateTime;
	
	var from_text;
	var to_text;
	
	var dateOptVal;
	var searchOptVal;
	var searchWord;
	var chk_number;
	var chk_code;
	var chk_severity;
	var chk_equip;
	var pagingNum;
	var pageNo;
	
	//날짜 검사
	dateOptVal = $('#dateOpt option:selected').val();
	
	if (dateOptVal == "1") {
		from_text = $('#search_from').val()+" "+$('#fromHourSelect option:selected').val()+":00:00";
		to_text = $('#search_to').val()+" "+$('#toHourSelect option:selected').val()+":00:00";
		
		from_dateTime = $('#search_from').val()+" "+$('#fromHourSelect option:selected').val();

		var to_date = new Date(to_text);
		to_dateTime = new Date(to_date.getFullYear(),to_date.getMonth(),to_date.getDate(),to_date.getHours()+1).format("yyyy-MM-dd HH");
		
	}else if(dateOptVal == "2"){
		from_text = $('#search_from').val()+" 00:00:00";
		to_text = $('#search_to').val()+" 00:00:00";
		
		from_dateTime = $('#search_from').val();

		var to_date = new Date(to_text);
		to_dateTime = new Date(to_date.getFullYear(),to_date.getMonth(),to_date.getDate()+1).format("yyyy-MM-dd");
		
//		to_dateTime = $('#search_to').val();
	}else{
		from_text = $('#search_from').val()+" 00:00:00";
		to_text = $('#search_to').val()+" 00:00:00";
		
		from_dateTime = $('#search_from').val();

		var to_date = new Date(to_text);
		to_dateTime = new Date(to_date.getFullYear(),to_date.getMonth()+1).format("yyyy-MM");
		
//		to_dateTime = $('#search_to').val();
	}
	
	if((new Date(to_text).getTime() - new Date(from_text).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}
	
	//검색어
	searchOptVal = $('#searchOpt option:selected').val();
	searchWord = $('#searchWord').val();
	
	//체크 박스
	chk_number = $('#chk_number').prop("checked");
	chk_code =  $('#chk_code').prop("checked");
	chk_severity =  $('#chk_severity').prop("checked");
	chk_equip =  $('#chk_equip').prop("checked");
	
	//페이징
	pagingNum = $('#pageSize').val();
	pageNo = $('#pageNo').val();
	
	var requestData = {
			from_dateTime : from_dateTime,
			to_dateTime : to_dateTime,
			dateOptVal : dateOptVal,
			searchOptVal : searchOptVal,
			searchWord : searchWord,
			chk_number : chk_number+'',
			chk_code : chk_code+'',
			chk_severity : chk_severity+'',
			chk_equip : chk_equip+'',
			pagingNum : Number(pagingNum)+(pageNo-1)*Number(pagingNum),
			pageNo : (pageNo-1)*Number(pagingNum),
			sortOption : columnSorting.sortInfo
	};
	
	return JSON.stringify(requestData);
	
}

function getStatisticsData(){
	
	var requestData = getParam();
	var pagingNum = $('#pageSize').val();
	var pageNo = $('#pageNo').val();
	
	$.ajax({
		type : 'post',
		url : '/system/sysSmsStatistics/getStatisticsData',
		contentType : 'application/json',
		dataTpye : 'json',
		data : requestData,
		success : function(data) {			
			
			
			$('#statisticsDataGrid tbody').empty();
			var num = (pageNo - 1) * Number(pagingNum);
			var gridTd = '';
			
			$.each(data.getStatisticsData,function(i,value){
				
				num++;
				
				gridTd += '<tr>';
				gridTd += '<td>'+value.EVENT_TIME+'</td>';
				gridTd += '<td>'+value.TT_NUMBER+'</td>';
				gridTd += '<td>'+value.ALARM_CODE+'</td>';
				gridTd += '<td>'+value.SEVERITY+'</td>';
				gridTd += '<td>'+value.EQUIP_TYPE+'</td>';
				gridTd += '<td>'+value.CNT+'</td>';
				gridTd += '</tr>';
				
			});
			
			$('#statisticsDataGrid tbody').append(gridTd);
		
			totalcount = data.getStatisticsData.length <= 0 ? 0 : data.getStatisticsData[0].TOTAL_COUNT;
		
			if (pageNo * Number(pagingNum) > num) {
				for (var index = 0; index < (pageNo * Number(pagingNum))- num; index++) {
					$('#statisticsDataGrid tbody').append(
							'' + '<tr style="height:31px;">' + '<td></td><td></td><td></td><td></td><td></td><td></td>'
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
	
	var requestData = JSON.parse(getParam());
	
	chk_number = $('#chk_number').prop("checked");
	chk_code =  $('#chk_code').prop("checked");
	chk_severity =  $('#chk_severity').prop("checked");
	chk_equip =  $('#chk_equip').prop("checked");
	
	var url = "/system/sysSmsStatistics/excelDown?from_dateTime="
			+ requestData.from_dateTime + "&to_dateTime="
			+ requestData.to_dateTime + "&dateOptVal=" + requestData.dateOptVal
			+ "&searchOptVal=" + requestData.searchOptVal + "&searchWord="
			+ requestData.searchWord + "&chk_number=" + requestData.chk_number
			+ "&chk_code=" + requestData.chk_code + "&chk_severity="
			+ requestData.chk_severity + "&chk_equip="
			+ requestData.chk_equip;
		
	$(location).attr('href', url);
}

//function getAlarmGrade(grade) {
//	if(grade == 1) grade = "CRITICAL";
//	else if(grade == 2) grade = "MAJOR";
//	else if(grade == 3) grade = "MINOR";
//	else if(grade == 4) grade = "NORMAL";
//	return grade;
//}