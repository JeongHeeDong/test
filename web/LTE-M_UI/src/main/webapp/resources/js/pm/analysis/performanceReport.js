var _changeFlag = false;

$(document).ready(function(){
	$("#headerTrRec").hide();
	
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		getFailurePerformData(true);
	});
	
	$('#headerTrRec').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTrRec');
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
	
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	
});

function changeAccessORepc(){
	var accessORepc = $('#accessORepc_sel').val();
	if(accessORepc == '1' ){
		$('#divLine').css("display","");
	}else{
		$('#divLine').css("display","none");
	}
}

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
	
	var lineId = $('#selectedLine').val();
	
	var requestData = {
			searchObject : searchObject,
			accessORepc : accessORepc,
			dayORhour : dayORhour,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			sortOption : columnSorting.sortInfo,
			pageNo : (pageNo-1)*Number(pagingNum),
			pagingNum : Number(pagingNum),
			lineId : lineId
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/analysis/performanceReport/getPerformData',
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
			
			_changeFlag = true;
		},
		error:function(data){
			
		}
	});
}

function changeheader(){
	
	var dayORhour = $('#dayORhour_sel option:selected').val();
	var searchObject = $("input:radio[name=search_radio]:checked").val();
	var accessORepc = $('#accessORepc_sel option:selected').val();
	
	$headerTr = $('#headerTr'),
	$headerColgroup = $('#headerGroup');
	$headerTr.empty();
	$headerColgroup.empty();
	$bodyGroup = $('#bodyGroup')
	$bodyGroup.empty();
	$("#headerTrRec").hide();

	if(searchObject == 1){	// 고장
		$headerTr.append(
			"<th class='updown sort' id='EQUIP_NAME' title='장비타입' >장비타입</th>" +
			"<th class='updown sort' id='SYSTEM_NAME' title='장비명'>장비명</th>" +
			"<th class='updown sort' id='SEVERITY' title='등급'>등급</th>" +
			"<th class='updown sort' id='ALARM_CODE' title='알람코드'>알람코드</th>" +
			"<th class='updown sort' id='FDN' title='발생위치'>발생위치</th>" +
			"<th class='updown sort' id='PROBABLE_CAUSE' title='원인'>원인</th>" +
			"<th class='updown sort' id='EVENT_TIME' title='발생시간'>발생시간</th>" +
			"<th class='updown sort' id='RECOVER_TIME' title='복구시간'>복구시간</th>" +
			"<th class='updown sort' id='TIME_DIFF_SEC' title='고장시간(초)'>고장시간(초)</th>" +
			"<th class='updown sort' id='TIME_DIFF_MIN' title='고장시간(분)'>고장시간(분)</th>"
		);
		
	} else if (searchObject == 2 && accessORepc == 1){ // 성능, 기지국
		if(dayORhour == 1) {
			$headerTr.append("<th class='updown sort' id='EVENT_TIME' title='일자' >일자</th>");
		} else {
			$headerTr.append("<th class='updown sort' id='EVENT_TIME' title='일시' >일시</th>");
		}
		$headerTr.append(
			"<th class='updown sort' id='LINE_NAME' title='호선'>호선</th>" +
			"<th class='updown sort' id='DU_NAME' title='기지국'>기지국</th>" +
			"<th class='updown sort' id='KPI_ATTEMPT' title='RRC 시도호'>RRC 시도호</th>" +
			"<th class='updown sort' id='KPI_STD_ATT' title='RRC 기준 시도호'>RRC 기준 시도호</th>" +
			"<th class='updown sort' id='KPI_ATTEMPT_RATE' title='RRC 시도호 증감율(%)'>RRC 시도호 증감율(%)</th>" +
			"<th class='updown sort' id='KPI_ATTEMPT_LV' title='RRC 시도호 증감율 알람'>RRC 시도호 증감율 알람</th>" +
			
			"<th class='updown sort' id='KPI_ERAB_ATTEMPT' title='ERAB Setup 시도호'>ERAB Setup 시도호</th>" +
			"<th class='updown sort' id='KPI_STD_ERAB' title='ERAB Setup 기준 시도호'>ERAB Setup 기준 시도호</th>" + 
			"<th class='updown sort' id='KPI_ERAB_RATE' title='ERAB Setup 시도호 증감율(%)'>ERAB Setup 시도호 증감율(%)</th>" + 
			"<th class='updown sort' id='KPI_ERAB_LV' title='ERAB Setup 시도호 증감율 알람'>ERAB Setup 시도호 증감율 알람</th>" + 

			"<th class='updown sort' id='KPI_RRC' title='소통호(RRC 성공호)'>소통호(RRC 성공호)</th>" +
			"<th class='updown sort' id='SUCC_RATE' title='소통율(RRC 성공율)(%)'>소통율(RRC 성공율)(%)</th>" +
			"<th class='updown sort' id='SUCC_RATE_LV' title='소통율(RRC 성공율) 알람'>소통율(RRC 성공율) 알람</th>" +
			
			"<th class='updown sort' id='KPI_ANSWER' title='완료호(ERAB Setup 성공호)'>완료호(ERAB Setup 성공호)</th>"+
			"<th class='updown sort' id='ANSWER_RATE' title='완료율(ERAB Setup 성공율)(%)'>완료율(ERAB Setup 성공율)(%)</th>"+
			"<th class='updown sort' id='ANSWER_RATE_LV' title='완료율(ERAB Setup 성공율) 알람'>완료율(ERAB Setup 성공율) 알람</th>"+
			
			"<th class='updown sort' id='KPI_ERAB_ADD_SUCC' title='ERAB Setup Add 성공호'>ERAB Setup Add 성공호</th>" +
			
			"<th class='updown sort' id='KPI_CD' title='절단호'>절단호</th>"+
			"<th class='updown sort' id='CD_RATE' title='절단율'>절단율</th>"+
			"<th class='updown sort' id='CD_RATE_LV' title='절단율 알람'>절단율 알람</th>"
		);
		$('.tableColgorup').html(
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col width="8%"> ' +
			'<col >           '
		);
	} else if (searchObject == 2 && accessORepc == 3){	// 성능, 저장장치
		$("#headerTrRec").show();
		if(dayORhour == 1) {
			$headerTr.append("<th rowspan='2' class='updown sort' id='EVENT_TIME' title='일자'>일자</th>");
		} else {
			$headerTr.append("<th rowspan='2' class='updown sort' id='EVENT_TIME' title='일시'>일시</th>");
		}
		
		$headerTr.append(
				"<th rowspan='2' class='updown sort' id='EQUIP_NAME' title='장비명'>장비명</th>"
				+"<th colspan='7' title='CALL'>CALL</th>"
				+"<th colspan='7' title='PTT'>PTT</th>"
			);
			$('.tableColgorup').html(
				'<col width="6%"> ' +
				'<col width="6%"> ' +
				'<col width="5%"> ' +
				'<col width="6.3%"> ' +
				'<col width="6.3%"> ' +
				'<col width="8%"> ' +
				'<col width="6%"> ' +
				'<col width="6%"> ' +
				'<col width="6%"> ' +
				'<col width="5%"> ' +
				'<col width="6%">' +
				'<col width="6.3%"> ' +
				'<col width="8%"> ' +
				'<col width="6%">' +
				'<col width="6%"> ' +
				'<col >           '
			);
	} else {
		if(dayORhour == 1) {
			$headerTr.append("<th class='updown sort' id='EVENT_TIME' title='일자'>일자</th>");
		} else {
			$headerTr.append("<th class='updown sort' id='EVENT_TIME' title='일시'>일시</th>");
		}
		$headerTr.append(
			"<th class='updown sort' id='EQUIP_NM' title='장비타입'>장비타입</th>" +
			"<th class='updown sort' id='DATA_TYPE' title='데이터 종류'>데이터 종류</th>" +
			"<th class='updown sort' id='ATTEMPT' title='시도호'>시도호</th>" +
			"<th class='updown sort' id='STD_ATT_5M' title='이전시도호'>이전시도호</th>" +
			"<th class='updown sort' id='ATT_RATE' title='시도호 증감율'>시도호 증감율</th>" +
			"<th class='updown sort' id='ATT_RATE_LEVEL' title='시도호 증감율 등급'>시도호 증감율 등급</th>" +
			"<th class='updown sort' id='SUCCESS' title='성공호'>성공호</th>" +
			"<th class='updown sort' id='SUCC_RATE' title='성공율'>성공율</th>" +
			"<th class='updown sort' id='SUCC_RATE_LEVEL' title='성공율 등급'>성공율 등급</th>" +
			"<th class='updown sort' id='CONNECT' title='접속호'>접속호</th>" +
			"<th class='updown sort' id='CONNECT_RATE' title='접속율'>접속율</th>"+
			"<th class='updown sort' id='CONNECT_RATE_LEVEL' title='접속율 등급'>접속율 등급</th>"
		);
		$('.tableColgorup').html(
			'<col width="7%"> ' +
			'<col width="7%"> ' +
			'<col width="9%"> ' +
			'<col width="6%"> ' +
			'<col width="8%"> ' +
			'<col width="9%"> ' +
			'<col width="12%">' +
			'<col width="6%"> ' +
			'<col width="6%"> ' +
			'<col width="8%"> ' +
			'<col width="6%"> ' +
			'<col width="9%"> ' +
			'<col >           '
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
				   		"</tr>"
				   );
		   }
	   }
	} else if (searchObject == 2 && accessORepc == 1) {		// 성능, 기지국
		
		$(data).each(function(key,value){
			number++;
			$('#dataGrid').append(
				'<tr">'+
				'<td title="'+value.EVENT_TIME+'">'+value.EVENT_TIME+'</td>'+
				'<td title="'+value.LINE_NAME+'">'+value.LINE_NAME+'</td>'+
				'<td title="'+value.DU_NAME+'">'+value.DU_NAME+'</td>'+
				'<td title="'+ value.KPI_ATTEMPT +'">'+value.KPI_ATTEMPT+'</td>'+
				'<td title="'+value.KPI_STD_ATT+'">'+value.KPI_STD_ATT+'</td>'+
				'<td title="'+value.KPI_ATTEMPT_RATE+'">'+value.KPI_ATTEMPT_RATE+'</td>'+
				'<td title="'+value.KPI_ATTEMPT_LV+'">'+value.KPI_ATTEMPT_LV+'</td>'+
				
				'<td title="'+value.KPI_ERAB_ATTEMPT+'">'+value.KPI_ERAB_ATTEMPT+'</td>'+
				'<td title="'+value.KPI_STD_ERAB+'">'+value.KPI_STD_ERAB+'</td>'+
				'<td title="'+value.KPI_ERAB_RATE+'">'+value.KPI_ERAB_RATE+'</td>'+
				'<td title="'+value.KPI_ERAB_LV+'">'+value.KPI_ERAB_LV+'</td>'+
				
				'<td title="'+value.KPI_RRC+'">'+value.KPI_RRC+'</td>'+
				'<td title="'+value.SUCC_RATE+'">'+value.SUCC_RATE+'</td>'+
				'<td title="'+value.SUCC_RATE_LV+'">'+value.SUCC_RATE_LV+'</td>'+
				
				'<td title="'+value.KPI_ANSWER+'">'+value.KPI_ANSWER+'</td>'+
				'<td title="'+value.ANSWER_RATE+'">'+value.ANSWER_RATE+'</td>'+
				'<td title="'+value.ANSWER_RATE_LV+'">'+value.ANSWER_RATE_LV+'</td>'+
				
				'<td title="'+value.KPI_ERAB_ADD_SUCC+'">'+value.KPI_ERAB_ADD_SUCC+'</td>'+
				
				'<td title="'+value.KPI_CD+'">'+value.KPI_CD+'</td>'+
				'<td title="'+value.CD_RATE+'">'+value.CD_RATE+'</td>'+
				'<td title="'+value.CD_RATE_LV+'">'+value.CD_RATE_LV+'</td>'+
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
	} else if (searchObject == 2 && accessORepc == 3) {
		
		$(data).each(function(key,value){
			number++;
			$('#dataGrid').append(
				'<tr">'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.EQUIP_NAME+'</td>'+
				'<td>'+value.CALL_ATTEMPT+'</td>'+
				'<td>'+value.CALL_STD_ATT_5M+'</td>'+
				'<td>'+value.CALL_ATT_RATE+'</td>'+
				'<td>'+value.CALL_ATT_RATE_LEVEL+'</td>'+
				'<td>'+value.CALL_SUCCESS+'</td>'+
				'<td>'+value.CALL_SUCC_RATE+'</td>'+
				'<td>'+value.CALL_SUCC_RATE_LEVEL+'</td>'+
				'<td>'+value.PTT_ATTEMPT+'</td>'+
				'<td>'+value.PTT_STD_ATT_5M+'</td>'+
				'<td>'+value.PTT_ATT_RATE+'</td>'+
				'<td>'+value.PTT_ATT_RATE_LEVEL+'</td>'+
				'<td>'+value.PTT_SUCCESS+'</td>'+
				'<td>'+value.PTT_SUCC_RATE+'</td>'+
				'<td>'+value.PTT_SUCC_RATE_LEVEL+'</td>'+
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
    
    if ($('#accessORepc_sel option:selected').val() == '3'){
    	headers = (dayORhour == 1 ? '일자' : '일시') + ',장비명,CALL_시도호,CALL_이전시도호,CALL_시도호증감율,CALL_시도호증감율등급,CALL_성공호,CALL_성공율,CALL_성공률등급,PTT_시도호,PTT_이전시도호,PTT_시도호증감율,PTT_시도호증감율등급,PTT_성공호,PTT_성공율,PTT_성공률등급';
    	columns = 'EVENT_TIME,EQUIP_NAME,CALL_ATTEMPT,CALL_STD_ATT_5M,CALL_ATT_RATE,CALL_ATT_RATE_LEVEL,CALL_SUCCESS,CALL_SUCC_RATE,CALL_SUCC_RATE_LEVEL,PTT_ATTEMPT,PTT_STD_ATT_5M,PTT_ATT_RATE,PTT_ATT_RATE_LEVEL,PTT_SUCCESS,PTT_SUCC_RATE,PTT_SUCC_RATE_LEVEL';
    }
    
    var title = "";
    var subtitle = "";
    
    if(searchObject == 1){
    	title = "고장";
    	subtitle = "일별통계"
    } else if (searchObject == 2 && accessORepc == 1) {
    	title = "기지국";
    	if(dayORhour == 1) subtitle = "일별통계";
    	else subtitle = "시간별통계";
    } else if (searchObject == 2 && accessORepc == 3) {
    	title = "저장장치";
    	if(dayORhour == 1) subtitle = "일별통계";
    	else subtitle = "시간별통계";
    } else {
    	title = "주제어장치";
    	if(dayORhour == 1) subtitle = "일별통계";
    	else subtitle = "시간별통계";
    }
    
	var url =  "/pm/analysis/performanceReport/excelDown?searchObject="+searchObject+"&accessORepc="+accessORepc+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+
				"&dayORhour="+dayORhour+"&HEADERS="+encodeURI(headers)+"&COLUMNS="+columns+"&TITLE="+title+"&SUB_TITLE="+subtitle;
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