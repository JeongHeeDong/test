var _changeFlag = false;
var lineId = '';

$(document).ready(function(){
	
	// 호선 셀렉트박스
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		getFailurePerformData(true);
	});
	
	$("#accessORepc_sel").change(function() {
		_changeFlag = false;
	});
	
	$("#dayORhour_sel").change(function() {
		_changeFlag = false;
	});
	
	$('#start-date').datepicker({
		dateFormat: 'yy-mm-dd',
		onClose: function( selectedDate ) {
	        $( "#end-date" ).datepicker( "option", "minDate", selectedDate );
	    }
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dateFormat: 'yy-mm-dd'
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});
	
	$('#end-date').datepicker({
		dateFormat: 'yy-mm-dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dateFormat: 'yy-mm-dd'
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});
	
	$('#start-date-btn').on('click',function(e){
		$('#start-date').datepicker("show");
	});
	
	
	$('#end-date-btn').on('click',function(e){
		$('#end-date').datepicker("show");
	});
});

function getFailurePerformData(flag){
	
	var startDateTimeText = $('#start-date').val()+" 00:00:00";
	var endDateTimeText = $('#end-date').val()+" 23:59:00";
	
	var searchObject = $("input:radio[name=search_radio]:checked").val();
	var accessORepc ;
	var dayORhour ;
	
	if(searchObject == 1) {
		accessORepc = "";
		dayORhour = "";
	} else {
		accessORepc = $('#accessORepc_sel option:selected').val();
		dayORhour = $('#dayORhour_sel option:selected').val();
	}
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmmss");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmmss");
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	} else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 720){
		alert('최대 30일 조회만 가능합니다.');
		return false;
	}
	
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	var pagingNum = $('#pageSize option:selected').val();
	
	//새로이 검색할 경우 소팅 옵션을 초기화
	if(!flag) {
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
	}
	
	var requestData = {
			searchObject : searchObject,
			accessORepc : accessORepc,
			dayORhour : dayORhour,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			sortOption : columnSorting.sortInfo,
			pageNo : (pageNo-1)*Number(pagingNum),
			pagingNum : Number(pagingNum),
			lineId : $('#selectedLine').val()
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/failure/analysis/failureReport/getFailureData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			var
				$headerTr = $('#headerTr'),
				$bodyGroup = $('#bodyGroup');

			var classNames = {};
			if(flag) {
				$.each($headerTr.find('.sort'), function (i, val) {
					classNames[val.id] = $(val).attr('class');
				});
			}

			changeheader();
			createTd(data.gridData);
			
			if(flag) {
				var keys = Object.keys(classNames);
				keys.map(function (v, i) {
					document.querySelector('#' + v).className = classNames[v];
				});
			}
			lineId = $('#selectedLine').val();
			_changeFlag = true;
		},
		error:function(data){
			
		}
	});
}

function changeheader(){
	
	var searchObject = $("input:radio[name=search_radio]:checked").val();
	var accessORepc = $('#accessORepc_sel option:selected').val();
	
	$headerTr = $('#headerTr'),
	$headerColgroup = $('#headerGroup');
	$headerTr.empty();
	$headerColgroup.empty();
	$bodyGroup = $('#bodyGroup')
	$bodyGroup.empty();

	if(searchObject == 1){
		$headerTr.append(
			"<th class='updown sort' id='LINE_NAME'>호선</th>" +
			"<th class='updown sort' id='EQUIP_NAME'>장비타입</th>" +
			"<th class='updown sort' id='SYSTEM_NAME'>장비명</th>" +
			"<th class='updown sort' id='SEVERITY'>등급</th>" +
			"<th class='updown sort' id='ALARM_CODE'>알람코드</th>" +
			"<th class='updown sort' id='FDN'>발생위치</th>" +
			"<th class='updown sort' id='PROBABLE_CAUSE'>원인</th>" +
			"<th class='updown sort' id='EVENT_TIME'>발생일시</th>" +
			"<th class='updown sort' id='RECOVER_TIME'>복구일시</th>" +
			"<th class='updown sort' id='TIME_DIFF_SEC'>발생기간(초)</th>" +
			"<th class='updown sort' id='TIME_DIFF_MIN'>발생기간(분)</th>"
		);
		$headerColgroup.append(
			"<col width='9.5%'>"+
			"<col width='7%'>"+
			"<col width='7%'>"+
			"<col width='9%'>"+
			"<col width='10%'>"+
			"<col width='20.5%'>"+
			"<col width='9.5%'>"+
			"<col width='11.5%'>"+
			"<col width='9.5%'>"+
			"<col width='6.5%'>"+
			"<col width='6.5%'>"
		);
		$bodyGroup.append(
			"<col width='9.5%'>"+
			"<col width='7%'>"+
			"<col width='7%'>"+
			"<col width='9%'>"+
			"<col width='10%'>"+
			"<col width='20.5%'>"+
			"<col width='9.5%'>"+
			"<col width='11.5%'>"+
			"<col width='9.5%'>"+
			"<col width='6.5%'>"+
			"<col width='6.5%'>"
		);
		
	} else if (searchObject == 2 && accessORepc == 1){
		$headerTr.append(
			"<th class='updown sort' id='EVENT_TIME'>시간</th>" +
			"<th class='updown sort' id='DU_NAME'>기지국</th>" +
			"<th class='updown sort' id='KPI_ATTEMPT'>시도호</th>" +
			"<th class='updown sort' id='KPI_STD_ATT'>이전시도호</th>" +
			"<th class='updown sort' id='KPI_ATTEMPT_RATE'>시도호 증감율</th>" +
			"<th class='updown sort' id='KPI_ATTEMPT_LV'>시도호 증감율 등급</th>" +
			"<th class='updown sort' id='KPI_RRC'>소통호</th>" +
			"<th class='updown sort' id='SUCC_RATE'>소통율</th>" +
			"<th class='updown sort' id='SUCC_RATE_LV'>소통율 등급</th>" +
			"<th class='updown sort' id='KPI_ANSWER'>완료호</th>"+
			"<th class='updown sort' id='ANSWER_RATE'>완료율</th>"+
			"<th class='updown sort' id='ANSWER_RATE_LV'>완료율 등급</th>"+
			"<th class='updown sort' id='KPI_CD'>절단호</th>"+
			"<th class='updown sort' id='CD_RATE'>절단율</th>"+
			"<th class='updown sort' id='CD_RATE_LV'>절단율 등급</th>"
		);
		$headerColgroup.append(
			"<col width='7.5%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.7%'>"
		);
		$bodyGroup.append(
			"<col width='7.5%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.6%'>"+
			"<col width='6.7%'>"
		);
	} else {
		$headerTr.append(
			"<th class='updown sort' id='EVENT_TIME'>시간</th>" +
			"<th class='updown sort' id='EQUIP_NM'>장비타입</th>" +
			"<th class='updown sort' id='DATA_TYPE'>데이터 종류</th>" +
			"<th class='updown sort' id='ATTEMPT'>시도호</th>" +
			"<th class='updown sort' id='STD_ATT_5M'>이전시도호</th>" +
			"<th class='updown sort' id='ATT_RATE'>시도호 증감율</th>" +
			"<th class='updown sort' id='ATT_RATE_LEVEL'>시도호 증감율 등급</th>" +
			"<th class='updown sort' id='SUCCESS'>성공호</th>" +
			"<th class='updown sort' id='SUCC_RATE'>성공율</th>" +
			"<th class='updown sort' id='SUCC_RATE_LEVEL'>성공율 등급</th>" +
			"<th class='updown sort' id='CONNECT'>접속호</th>" +
			"<th class='updown sort' id='CONNECT_RATE'>접속율</th>"+
			"<th class='updown sort' id='CONNECT_RATE_LEVEL'>접속율 등급</th>"
		);
		$headerColgroup.append(
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='8.8%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"
		);
		$bodyGroup.append(
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='8.8%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"+
			"<col width='7.6%'>"
		);
	}
}

function createTd(data){
	
	var pageNo = $('#pageNo').val();
	var pagingNum = $('#pageSize option:selected').val();
	
	$('#dataGrid').empty();
	
	var searchObject = $("input:radio[name=search_radio]:checked").val();
	var accessORepc = $('#accessORepc_sel option:selected').val();
	var number = (pageNo-1)*Number(pagingNum);
	
	if(searchObject == 1){
		$(data).each(function(key,value){
			number++;
			$('#dataGrid').append(
				'<tr">'+
				'<td>'+value.LINE_NAME+'</td>'+
				'<td>'+value.EQUIP_NAME+'</td>'+
				'<td>'+value.SYSTEM_NAME+'</td>'+
				'<td>'+value.SEVERITY+'</td>'+
				'<td>'+value.ALARM_CODE+'</td>'+
				'<td>'+value.FDN+'</td>'+
				'<td>'+value.PROBABLE_CAUSE+'</td>'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.RECOVER_TIME+'</td>'+
				'<td>'+value.TIME_DIFF_SEC+'</td>'+
				'<td>'+value.TIME_DIFF_MIN+'</td>'+
				'</tr>'
			);
		})
		
		if(pageNo*Number(pagingNum) > number){
		   for(var index = 0;index<(pageNo*Number(pagingNum))-number; index++){
			   $('#dataGrid').append("" +
				   		"<tr style='height:31px;'>" +
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
				   		"</tr>"
				   );
		   }
	   }
	} else if (searchObject == 2 && accessORepc == 1) {
		
		$(data).each(function(key,value){
			number++;
			$('#dataGrid').append(
				'<tr">'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.DU_NAME+'</td>'+
				'<td>'+value.KPI_ATTEMPT+'</td>'+
				'<td>'+value.KPI_STD_ATT+'</td>'+
				'<td>'+value.KPI_ATTEMPT_RATE+'</td>'+
				'<td>'+value.KPI_ATTEMPT_LV+'</td>'+
				'<td>'+value.KPI_RRC+'</td>'+
				'<td>'+value.SUCC_RATE+'</td>'+
				'<td>'+value.SUCC_RATE_LV+'</td>'+
				'<td>'+value.KPI_ANSWER+'</td>'+
				'<td>'+value.ANSWER_RATE+'</td>'+
				'<td>'+value.ANSWER_RATE_LV+'</td>'+
				'<td>'+value.KPI_CD+'</td>'+
				'<td>'+value.CD_RATE+'</td>'+
				'<td>'+value.CD_RATE_LV+'</td>'+
				'</tr>'
			);
		})
		
		if(pageNo*Number(pagingNum) > number){
		   for(var index = 0;index<(pageNo*Number(pagingNum))-number; index++){
			   $('#dataGrid').append("" +
				   		"<tr style='height:31px;'>" +
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
				   		"</tr>"
				   );
		   }
	   }
	} else {
		
		$(data).each(function(key,value){
			number++;
			$('#dataGrid').append(
				'<tr">'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.EQUIP_NM+'</td>'+
				'<td>'+value.DATA_TYPE+'</td>'+
				'<td>'+value.ATTEMPT+'</td>'+
				'<td>'+value.STD_ATT_5M+'</td>'+
				'<td>'+value.ATT_RATE+'</td>'+
				'<td>'+value.ATT_RATE_LEVEL+'</td>'+
				'<td>'+value.SUCCESS+'</td>'+
				'<td>'+value.SUCC_RATE+'</td>'+
				'<td>'+value.SUCC_RATE_LEVEL+'</td>'+
				'<td>'+value.CONNECT+'</td>'+
				'<td>'+value.CONNECT_RATE+'</td>'+
				'<td>'+value.CONNECT_RATE_LEVEL+'</td>'+
				'</tr>'
			);
		})

		if(pageNo*Number(pagingNum) > number){
		   for(var index = 0;index<(pageNo*Number(pagingNum))-number; index++){
			   $('#dataGrid').append("" +
				   		"<tr style='height:31px;'>" +
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
					   		"<td></td>"+
				   		"</tr>"
				   );
		   }
	   }
	}

	
	totalcount = data.length <= 0?0:data[0].TOTAL_COUNT;
	pagingSetting(totalcount, $('#pageNo').val(), pagingNum);
}

function excel_download(){
	console.log("엑셀저장")
	if(!_changeFlag) {
		alert('조건이 변경되었습니다 조회를 한번 더 하고 엑셀 다운로드를 해주십시오.');
		return false;
	}
	
	var startDateTimeText = $('#start-date').val()+" 00:00:00";
	var endDateTimeText = $('#end-date').val()+" 23:59:00";
	
	var searchObject = $("input:radio[name=search_radio]:checked").val();
	var accessORepc ;
	var dayORhour ;
	
	if(searchObject == 1) {
		accessORepc = "";
		dayORhour = "";
	} else {
		accessORepc = $('#accessORepc_sel option:selected').val();
		dayORhour = $('#dayORhour_sel option:selected').val();
	}
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmmss");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmmss");
	
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	} else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 720){
		alert('최대 30일 조회만 가능합니다.');
		return false;
	}
	
	var headerList = [];
    var columnList = [];
    var headers;
    var columns;
    var i=0;
    $('#headerTr').each(function(){
        $(this).find('th').each(function(index,th){
            if($(th).css('display')!= 'none'){
                headerList[i] = th.innerHTML;
                columnList[i] = th.id;
                i++;
            }
        });
    });
    headers = headerList.join(",");
    columns = columnList.join(",");
    
    var title = "";
    var subtitle = "";
    
    if(searchObject == 1){
    	title = "알람";
    	subtitle = "일별통계"
    } else if (searchObject == 2 && accessORepc == 1) {
    	title = "기지국";
    	if(dayORhour == 1) subtitle = "일별통계";
    	else subtitle = "시간별통계";
    } else {
    	title = "주제어장치";
    	if(dayORhour == 1) subtitle = "일별통계";
    	else subtitle = "시간별통계";
    }
    
	var url =  "/failure/analysis/failureReport/excelDown?searchObject="+searchObject+"&accessORepc="+accessORepc+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+
				"&dayORhour="+dayORhour+"&HEADERS="+headers+"&COLUMNS="+columns+"&TITLE="+title+"&SUB_TITLE="+subtitle+"&lineId="+lineId;
    $(location).attr('href', url);
}

function _btnSearchClick() {
	$('#pageNo').val("1");
	$('#totalCount').val("0");
	getFailurePerformData();
}

function pageSearch(){
	getFailurePerformData(true);
}