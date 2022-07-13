// var spTime = null;
var spTime = [];
var spDate = null;
var alarmFilter = [4];
var alarmCodeSet = null;

var newDate = new Date();
var yy = newDate.getFullYear();
var mm = newDate.getMonth()+1;
var dd = newDate.getDate();
var hh = newDate.getHours()-1;
hh = hh==0?24:hh;
var grideData ;

$(document).ready(function(){
	
	initialize();
	
	$("#box_analyTm_fromtime").datepicker({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		"setDate": new Date(),
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		onClose: function(selectedDate) {
//			$('#box_analyEq_totime').datepicker('option', 'minDate', selectedDate);
			var year  = selectedDate.substring(0, 4);
			var month = selectedDate.substring(5, 7);
			var day   = selectedDate.substring(8, 10);
			
			//최소 하루 뒤의 날짜로 설정
			var min_dt = new Date(year, month, day); 							
			min_dt.setMonth(min_dt.getMonth()-1);
			min_dt.setDate(min_dt.getDate());
			$('#box_analyTm_totime').datepicker('option', 'minDate', min_dt);
			
			//최대 선택된 날짜의 한달 이후까지만 설정
			var max_dt = new Date(year, month, day);
			$('#box_analyTm_totime').datepicker("option", 'maxDate', max_dt);
		}
	});	
	$("#box_analyTm_totime").datepicker({
//		minDate: "+1D",
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		defaultDate: new Date(),
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});
	$("#box_analyTm_fromtime").datepicker().datepicker("setDate", new Date());
	$("#box_analyTm_totime").datepicker().datepicker("setDate", new Date());

	$('#btn_analyTm_fromtime').on('click',function(e){
		$('#box_analyTm_fromtime').datepicker("show");
	});
	$('#btn_analyTm_totime').on('click',function(e){
		$('#box_analyTm_totime').datepicker("show");
	});
	
//	$("input:radio[name='rd_analyTm_graph']").on('change',function(e){
//		getAlarmAnalysisByTime();
//	});
//	
	$("input:radio[name='rd_search_ea']").on('change',function(e){
		$("#target_system").val("");
		searchTargetSystemList = [];
	});
	
	$('#chk_fault').change(function(e) {
		if( $(this).is(':checked') ) faultFilterView();
		else {
			$('#faultState').val(0);
		}
	});
});

function initSpTime() {
	spTime = [];
	for(var t = 0; t < 24; t += 1) {
		spTime.push(t);
	}
}

function initialize(){
	/* 특정시간 선택화면 팝업 */
	$("#chk_analyTm_spTime").on('click', function(e){
		if( $(this).is(':checked') ){
			// var activeArray = [];

			$("#timeChkArea").hide();
			// $("#dlg_hour .mu-dialog-head .title").html('특정 시간 설정');
			$("#setSpecificTimeTitle .title").html('특정 시간 설정');

			$('#setSpecificTimeBg').show().fadeIn('fast');
			$('#setSpecificTimeUp').show().fadeIn('fast');
			var height = (screen.height - $('#setSpecificTimeUp').height()-100)/2;
			var width = (screen.width - $('#setSpecificTimeUp').width())/2;

			$('#setSpecificTimeUp').css('left',width+'px');
			$('#setSpecificTimeUp').css('top',height+'px');
		} else {
			$('#table_hour li button').removeClass('active');
			initSpTime();
		}
	});

	$("#setSpecificTimeOk").on("click", function () {
		var activeArray = [];
		//확인 버튼 클릭시에만 콜백 호출됨
		var timeStr;
		$.each($('#table_hour li button'), function(i, time) {
			if ( $(time).hasClass('active') ) {
				if($(time).text().length === 1) {
					timeStr = '0' + $(time).text();
				} else {
					timeStr = $(time).text();
				}
				activeArray.push( timeStr );
			}
		});

		if(activeArray != null && activeArray.length > 0){
			spTime = activeArray;
			$('#chk_analyTm_spTime').prop('checked',true);
		} else {
			$('#chk_analyTm_spTime').prop('checked',false);
			initSpTime();
		}
		$('#setSpecificTimeBg').fadeOut();
		$('#setSpecificTimeUp').fadeOut();
	});

	// $('#setSpecificTimeClose, #setSpecificTimeCancel, #setSpecificTimeBg').attr('onclick', 'closeCallBack(this)');
	$("#setSpecificTimeClose, #setSpecificTimeBg, #setSpecificTimeCancel").on('click',function(e){
		$('#setSpecificTimeBg').fadeOut();
		$('#setSpecificTimeUp').fadeOut();

		$('#table_hour li button').removeClass('active');
		$('#chk_analyTm_spTime').prop('checked',false);
		initSpTime();
	});
	$("#setSpecificTimeUp").draggable({'handle' : '#setSpecificTimeTitle'});
	
	$('#spAlarmClose, #spAlarmCancel, #spAlarmBg').attr('onclick', 'closeCallBack(this)');
	
	/*-----------------------------------------------------------------*/
	/* 특정일자제외 화면 팝업 */
	$('#analyTm_spDate').datepicker({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		defaultDate: new Date(),
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        onClose: function (selectedDate) {
            $("#chk_analyTm_spDate").attr("checked",true);
            spDate = selectedDate;
            if(selectedDate == ""){
            	$("#chk_analyTm_spDate").attr("checked",false);
            }
        }
    });
	
	$('#chk_analyTm_spDate').on('click',function(e){
		if( $(this).is(':checked') ){
			$('#analyTm_spDate').datepicker("show");
		} else {
			spDate = null;
		}
    });
	
	$('#chk_analyTm_spAlarm').on('click', function(e){
		if ( $(this).is(':checked') ) {
			if($("#target_system").val() == ""){
				alert("조회대상을 먼저 선택하세요.");
				$('#chk_analyTm_spAlarm').prop('checked',false);
				return;
			}
			$("#dlg_alarmCode .mu-dialog-head .title").html('알람코드 선택');
			var checkedRadio;
			$.each($('[name="rd_search_ea"]'), function(i, rd){
				if ( $(rd).is(':checked') ) {
					checkedRadio = $(rd);
				}
			});
			var systemIds = [];
			$.each(searchTargetSystemList, function(i,e){
				systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
			});
			var alarmCodeCondition = {};
			alarmCodeCondition['systemIds'] = '\'' + systemIds.join('\',\'') + '\'';
			alarmCodeCondition['alarmDesc'] = checkedRadio.val();
			searchAlarmCode(alarmCodeCondition);
			
	        openDialog('#dlg_alarmCode', function (fnCloseDlg) {
	        	alarmCodeSet = [];
	        	
	        	$("#tb_alarmCode tbody tr").each(function(i,row){
	        		if($(this).find('input:checkbox').prop('checked')){
	        			alarmCodeSet.push($(this).find('input[name="alarmCode"]').val());
	        		}
	        	});
	        	
	        	if ( alarmCodeSet.length == 0 ) {
	        		$('#chk_analyTm_spAlarm').prop('checked', false);
	        	}    	
	            fnCloseDlg();
	        });
		} else {
			alarmCodeSet = [];
		}
	});

	/* 알람등급 팝업 */
	$("#chk_alarmFilter").on('click', function(e){
		if( $(this).is(':checked') ){
			filterAlarmView(e, alarmFilter);
		} else {
			alarmFilter = [4];
		}
	});
	
	/*-----------------------------------------------------------------*/
	/* 그래프 표시안함 체크시 */
	$("#chk_analyTm_noGraph").on('click', function(e){
		if( $(this).is(':checked') ){
			$("#alarmAnalysisGraph_area").parent().hide();
			$("#alarmByTimeTable").parent().height("788px");
		} else {
			$("#alarmAnalysisGraph_area").parent().show();
			$("#alarmByTimeTable").parent().height("438px");
			getAlarmAnalysisByTime();
		}
	});
	
//	/*체크박스 클릭시 화면리플레시(그래프 쥼인/아웃 버그이슈때문) */
//	$(".mu-checkbox").on('click', function(e){
//		getAlarmAnalysisByTime();
//	});
}

function getAlarmAnalysisByTime() {	
	if($("#target_system").val() != "" && searchTargetSystemList != null && searchTargetSystemList.length != 0){
		var radioVal = $("input:radio[name='rd_analyTm_graph']:checked").val();
		var condition = {};
		/* 조회대상 리스트 조건 */
		var systemIds = [];
		
		$.each(searchTargetSystemList, function(i,e){
			systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
		});
		
		/* 날짜 조건 */
		var fromTime = $("#box_analyTm_fromtime").val();
		var toTime = $("#box_analyTm_totime").val();
	
		/* 체크버튼 조건(특정시간, 특정일자 제외, 알람필터, 그래프 표시안함 )*/
		if($("#chk_analyTm_spTime").is(':checked')){
			// if(spTime != null){
				condition['spTime'] = '\'' + spTime.join('\',\'') + '\'';
			// }
		} else {
			initSpTime();
		}
		
		if($("#chk_analyTm_spDate").is(':checked')){
			if(spDate != null){
				condition['spDate'] = spDate;
				condition['spFromDate'] = spDate;
				condition['spToDate'] = spDate+' 23:59:59';
			}
		}

		if($("#chk_alarmFilter").is(':checked')){
			condition['alarmFilter'] = alarmFilter;
		}
		
		if(alarmCodeSet != null && alarmCodeSet.length != 0){
			condition['spAlarm'] = '\'' + alarmCodeSet.join('\',\'') + '\'';
		}
		
		if(systemIds.length == 0){
			alert('조회대상을 선택하세요.');
			return;
		}
		
		condition['systemIds'] = '\'' + systemIds.join('\',\'') + '\'';
		condition['fromTime'] = fromTime;
		var today = new Date();
		if(toTime == today.format('yyyy-MM-dd')){
			toTime = today.format('yyyy-MM-dd:HH')+':59'
		}else{
			toTime = toTime + ':23:59'
		}
		condition['toTime'] = toTime;
		condition['graphType'] = radioVal;
		condition['alarmtype'] = $('#faultState').val();
		
		/* 화면 초기화*/
		//테이블 초기화
		$('#alarmByTimeTableHead').find('colgroup, thead').empty();
		$('#alarmByTimeTable').find('colgroup, tbody').empty();

		//엑셀 다운로드 테이블 초기화
		$('#excel-export-head').find('colgroup, thead').empty();
		$('#excel-export-body').find('colgroup, tbody').empty();

		//그래프 초기화
		try {
			graphChart.destroy();
			graphChart = '';			
		} catch(e) {
		}

		$.ajax({
			cache : false,
			type : 'post',
			url : '/failureStatistic/analysis/failureAnalysisByTime/getAlarmByTime',
			contentType: 'application/json; charset=UTF-8',
			dataType:'json',
			data : JSON.stringify(condition),
			success: function(data) {
				if ( data.alarmCntList.length != 0 ) {
					if ( radioVal == 'time') {
						gridAlarmAnalysisByTime(data, condition);
					} else if ( radioVal == 'date') {
						gridAlarmAnalysisByDate(data, condition);
					}
					setGraphData(radioVal, data);
				} else {
					alert('조회된 데이터가 없습니다.');
				}
			}
		});
	} else {
		alert('조회대상을 선택하세요.');
	}
}

function valueCheck(value){
	if(value == null){
		value = 0;
	} else {
		value = parseInt(value);
	}
	return value;
}

function setGraphData(graphType,data){
	if(!$('#chk_analyTm_noGraph').prop('checked')) {
		$("#alarmByTimeTable").parent().height("425px");
	}
	
    var xData = [];
    var alarmTypeList = data['alarmTypeList'];
    var alarmCntList = data['alarmCntList'];

    var allData = [];
    var alarmData = [];
    var faultData = [];
    var statusData = [];
    var etcData = [];

    var dataObj = {};

	/*시간별*/
	if(graphType === "time"){

		xData = ['0','1','2','3','4',
                 '5','6','7','8','9',
                 '10','11','12','13','14',
                 '15','16','17','18','19',
                 '20','21','22','23'];

		$.each(alarmTypeList, function(i,alarmType){
			if(alarmType == "1"){
				alarmTypeList[i] = "ALARM";
			} else if(alarmType == "2"){
				alarmTypeList[i] = "FAULT";
			} else if(alarmType == "3"){
				alarmTypeList[i] = "STATUS";
			} else if (alarmType == "4"){
				alarmTypeList[i] = "ETC";
			}
		});
		
		var timeCntList = [];
        var time = 0;
		for (time; time < 24; time++ ){
			var totalCnt = 0;
			$.each($('[name=\"'+ time +'\"]'), function(i, td){
				var  oneCnt = $(td).html();
				totalCnt += Number(oneCnt);
			});
			timeCntList.push(totalCnt);
		}

        allData = [];
        alarmData = [];
        faultData = [];
        statusData = [];
        etcData = [];

		//초기화
        time = 0;
		for (time; time < 24; time++ ){
			allData.push(0);
			alarmData.push(0);
			faultData.push(0);
			statusData.push(0);
			etcData.push(0);
		}

		$.each(alarmCntList, function(i,cntData){ 
			for ( var time = 0; time < 24; time++ ){
				if ( Number(cntData.C_TIME) == time ) {		
					allData[time] += Number(cntData.CNT);
					alarmData[time] += Number(cntData.ALARM);
					faultData[time] += Number(cntData.FAULT);
					statusData[time] += Number(cntData.STATUS);
					etcData[time] += Number(cntData.ETC);
				} else {
					if ( Number(cntData.C_TIME) == time ) {		
						allData[time] += Number(cntData.CNT);
						alarmData[time] += Number(cntData.ALARM);
						faultData[time] += Number(cntData.FAULT);
						statusData[time] += Number(cntData.STATUS);
						etcData[time] += Number(cntData.ETC);
					}
				}
			}
		});
		
		dataObj = {};
		//dataObj['timeTotal'] = timeCntList;
		dataObj['alarmType'] = alarmTypeList;
		dataObj['yData'] = allData;
		dataObj['ALARM'] = alarmData;
		dataObj['FAULT'] = faultData;
		dataObj['STATUS'] = statusData;
		dataObj['ETC'] = etcData;
		
		viewGraph(xData, dataObj, graphType);
	}	

	if(graphType === "date"){
		xData = [];
		$.each($('#headers').children(), function(i, th){
			if ( i > 1 ) {
				xData.push( $(th).html().split("<")[0] );
			}
		});

		$.each(alarmTypeList, function(i,alarmType){
			if(alarmType == "1"){
				alarmTypeList[i] = "ALARM";
			} else if(alarmType == "2"){
				alarmTypeList[i] = "FAULT";
			} else if(alarmType == "3"){
				alarmTypeList[i] = "STATUS";
			} else if(alarmType == "4"){
				alarmTypeList[i] = "ETC";
			}
		});

        allData = [];
        alarmData = [];
        faultData = [];
        statusData = [];
        etcData = [];

		//초기화
		for ( var idx = 0; idx < xData.length; idx++ ) {
			allData.push(0);
			alarmData.push(0);
			faultData.push(0);
			statusData.push(0);
			etcData.push(0);
		}

		$.each(alarmCntList, function(i,cntData){
			var y = cntData.C_DATE.substring(0,4);
			var m = cntData.C_DATE.substring(4,6);
			var d = cntData.C_DATE.substring(6,8);
			var dt = y + '-' + m + '-'+ d;

			for ( var idx = 0; idx < xData.length; idx++ ){
				if ( dt == xData[idx] ) {
					allData[idx] += Number(cntData.CNT);
					alarmData[idx] += Number(cntData.ALARM);
					faultData[idx] += Number(cntData.FAULT);
					statusData[idx] += Number(cntData.STATUS);
					etcData[idx] += Number(cntData.ETC);
				}
			}
		});
		
		dataObj = {};
		dataObj['alarmType'] = alarmTypeList;
		dataObj['yData'] = allData;
		dataObj['ALARM'] = alarmData;
		dataObj['FAULT'] = faultData;
		dataObj['STATUS'] = statusData;
		dataObj['ETC'] = etcData;

		viewGraph(xData, dataObj, graphType);
	}
}

var graphChart;
function viewGraph(xData, dataObj, graphType){
	var xTitle = '';
	if(graphType=="time"){
		xTitle = '시간';
	} else if(graphType=="day"){
		xTitle = '일자';
	}
	
	var graphOption  = {
		chart: {
			renderTo : alarmAnalysisGraph_area,
            zoomType: 'xy'
        },
		credits: {
			enabled: false
		},
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
        	title: {
                text: xTitle
        	},
            categories: xData,
            crosshair: true
        }],
        yAxis: [{ 
            gridLineWidth: 0,
            title: {
                text: '건수'
            },
            labels: {
                format: '{value}'
            }

        }],
        plotOptions: {
        	spline: {
            	marker: {
                	enabled: false
            	}
       		},
            series: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        tooltip: {
            shared: true
        },
        series: [{
            name: '건수',
            type: 'column',
            yAxis: 0,
            data: dataObj['yData']
        }],
        legend: {
            align: 'center',
            x: 10,
            verticalAlign: 'top',
            y: 10,
            floating: false,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
		}
	};
	
	var minVal = 0;
	var maxVal = 0;
//	$.each(dataObj['alarmType'], function(i,alarmType){
//		
//		var seriesData = {
//				name: alarmType,
//				type: 'spline',
//				yAxis: 1,
//				data: dataObj[alarmType]
//		};
//		graphOption.series.push(seriesData);
//		
//		
//		$.each(dataObj[alarmType], function(i,data){
//			if(maxVal < data){
//				maxVal = data;
//			} 				
//		});
//		
//	});
	
	var yAxisData = {
			title: {
				text: ' '
			},
//			opposite: true,
//			labels: {
//				format: '{value}'
//			},
//			min: minVal,
//			max: maxVal
	};
	graphOption.yAxis.push(yAxisData);
	graphChart = new Highcharts.Chart(graphOption);
}

function gridAlarmAnalysisByTime(data, condition){
	columnSorting.sortInfo = [];
	
	var startTime = Number(data.alarmCntList[0].C_TIME),
		timeLength = spTime.length,
		colSize = 0;

	if(timeLength === 24) {
		colSize = 100/26; //24(시간컬럼) + 2(장비구분,총계컬럼)
	} else {
		colSize = 100/(timeLength + 2); // + 2(장비구분,총계컬럼)
	}
	// var colSize = 100/26; //24(시간컬럼) + 2(장비구분,총계컬럼)
	// var colSize = 100/(data.alarmCntList.length + 2); // + 2(장비구분,총계컬럼)


	var
		$timeTableHead = $('#alarmByTimeTableHead'),
		$timeTable = $('#alarmByTimeTable'),
		$excel_export_head = $('#excel-export-head'),
		$excel_export_body = $('#excel-export-body');
	for(var colCnt = 0; colCnt < timeLength + 2; colCnt++){
		$timeTableHead.find('colgroup').append("<col width='" + colSize + "%'>");
		$timeTable.find('colgroup').append("<col width='" + colSize + "%'>");

		$excel_export_head.find('colgroup').append("<col width='" + colSize + "%'>");
		$excel_export_body.find('colgroup').append("<col width='" + colSize + "%'>");
	}
	
	//헤더 생성
	var
		headers = '<tr id="headers"></tr>',
		excelHeaders = '<tr id="excel-headers"></tr>';
	$('#tb_alarmAnalysis_time_header').append(headers);
	$('#excel-export-thead').append(excelHeaders);

	var
		$headers = $('#headers'),
		$excelHeaders = $('#excel-headers');

	$headers.append('<th class="overTxt updown sort" title="장비구분">장비구분<input type="hidden" value='+'"장비구분"'+'/></th>');
	$headers.append('<th class="overTxt updown sort" title="총계">총계<input type="hidden" value='+'"총계"'+'/></th>');

	$excelHeaders.append('<th>장비구분</th>');
	$excelHeaders.append('<th>총계</th>');

	for ( var idx = 0; idx < timeLength; idx++ ) {
		$headers.append('<th class="updown sort">' + Number(spTime[idx]) + '<input type="hidden" value="' + Number(spTime[idx]) + '"/></th>');
		$excelHeaders.append('<th>' + Number(spTime[idx]) + '</th>');
	}

	//조회한 시스템의 개수 만큼 로우 생성
	var systems = $('#target_system').val();
	var sysArr = [];
	sysArr = systems.split(',');
	
	$.each(sysArr, function(i, system){
		// var oneRow = '<tr name="rowData"></tr>';
		var
			oneRow = '<tr class="rowData"></tr>',
			excelOneRow = '<tr class="excel-rowData"></tr>';

		$('#alarmByTimeTable').find('tbody').append(oneRow);
		$('#excel-export-body').find('tbody').append(excelOneRow);

		var
			$rowData = $('.rowData'),
			$excelRowData = $('.excel-rowData');

		// $rowData.eq(i).append('<td class="overTxt" title="' + system + '" name="sysName">'+system+'</td>');
		$rowData.eq(i).append('<td class="overTxt sysName" title="' + system + '">'+system+'</td>');
		// $rowData.eq(i).append('<td class="overTxt" title="0" name="sysTotal">0</td>');
		$rowData.eq(i).append('<td class="overTxt sysTotal" style="cursor:pointer;"  data-hour="" data-systemName="' + system + '" title="0">0</td>');

		$excelRowData.eq(i).append('<td class="sysName">'+system+'</td>');
		$excelRowData.eq(i).append('<td class="sysTotal">0</td>');

		for ( var idx = 0; idx < timeLength; idx++ ) {
			// $rowData.eq(i).append('<td class="overTxt" title="0" class=\"'+ spTime[idx] +'\">0</td>');
			var hourVl = spTime[idx]
			if (hourVl === 0 ){
				hourVl = '00'
			}
			$rowData.eq(i).append('<td class="overTxt ' + Number(spTime[idx]) + '" title="0" style="cursor:pointer;" data-hour="' + hourVl + '" data-systemName="' + system + '">0</td>');
			$excelRowData.eq(i).append('<td class=\"'+ Number(spTime[idx]) +'\">0</td>');
		}
		
		/* 카운트 클릭이벤트 */
		var lastLine = $timeTable.find('tbody tr').length;
		var $time_analysis_detail = $("#tb_timeAnalysis_detail");
		var $timeAnalysisUp = $('#timeAnalysisUp');
		$timeTable.find('tbody tr').eq(lastLine-1).find('td').each(function(i, e){
			if(i > 0){
				$(this).on("click",function(e){
					if($(this).prop("class").includes("selected")){
						$(this).removeClass("selected");
					} else {
						$(this).parent().parent().find('td').each(function(i,e){
							if($(e).prop("class").includes("selected")){
								$(this).removeClass("selected");
							}
						});
						$(this).addClass("selected");
		
						condition['systemName'] = $(this).data("systemname");
						condition['hour'] = $(this).data("hour");
						$time_analysis_detail.find('tbody tr').remove();
						getTimeAnalysisDetailData(condition);
						
						/* 다이얼로그 팝업 */
						$('#timeAnalysisBg').show().fadeIn('fast');
						$timeAnalysisUp.show().fadeIn('fast');
						var height = (screen.height - $timeAnalysisUp.height()-100)/2;
						var width = (screen.width - $timeAnalysisUp.width())/2;
						$timeAnalysisUp.css('left',width+'px');
						$timeAnalysisUp.css('top',height+'px');
					    $("#timeAnalysisClose ,#timeAnalysisBg, #btn_timeAnalysisOk").on('click',function(e){
					    	delete condition['hour']
					    	$(this).removeClass("selected");
							$('#timeAnalysisBg').fadeOut();
							$('#timeAnalysisUp').fadeOut();
						});
						$( "#timeAnalysisUp" ).draggable({'handle' : '#timeAnalysisTitle'});
					}
				});
			}
		});
		
		
	});
	
	//가져온 데이터의 시스템 이름과 동일한 로우를 찾고, 각 시간에 CNT를 대입
	// $.each( $('[name="sysName"]'), function(i, td){
	$.each( $('.sysName'), function(i, td){
		var totalCnt = 0;
		$.each ( data.alarmCntList, function(j, obj){
			if ( $(td).html() == obj.SYSTEM_NAME ) {
				// $(td).parent().find('[name=\"' + Number(obj.C_TIME) +'\"]').prop('title',obj.CNT);
				$(td).parent().find('.' + Number(obj.C_TIME)).prop('title',obj.CNT);
				// $(td).parent().find('[name=\"' + Number(obj.C_TIME) +'\"]').html(obj.CNT);
				$(td).parent().find('.' + Number(obj.C_TIME)).html(obj.CNT);
				totalCnt += obj.CNT;
			}
		});
		// $('[name="sysTotal"]').eq(i).html(totalCnt);
		$('.sysTotal').eq(i).html(totalCnt);
	});

	$headers.on('click', '.sort', function(e){ columnSorting.dataSort(this, e.ctrlKey, '#headers');
	if(columnSorting.sortInfo.length > 0){
		 var compKey = [];
		 var compOption = [];
		 
		 $.each(columnSorting.sortInfo, function(i,val){
			 compKey.push(val.colName);
			 compOption.push(val.order);
		 });
		 
		var tblData = tableToJson('alarmByTimeTableHead','alarmByTimeTable');
		
		tblData.sort(function(a,b){
			return sortComparator(a,b,compKey,compOption);
		});
		
		var _tblhdr = $('table#alarmByTimeTableHead th').map(function () {
		    return $(this).text();
		}).get();
		
		// $('#alarmByTimeTable tbody').empty();
		$timeTable.find('tbody').empty();
	
		var appendText = '';
		$.each(tblData, function(i, data){
			appendText += '<tr>';
			$.each(_tblhdr, function(i, col){
				appendText += '<td class="overTxt" title="'+data[col]+'">'+data[col]+'</td>';
			});
			appendText += '</tr>';
		});
		
		// $('#alarmByTimeTable tbody').append(appendText);
		$timeTable.find('tbody').append(appendText);
	
		}
	});
	 

}

function gridAlarmAnalysisByDate(data, condition){
	columnSorting.sortInfo = [];
	
	var colSize = 100/(data.timeList + 2);
    var
        $timeTableHead = $('#alarmByTimeTableHead'),
        $timeTable = $('#alarmByTimeTable'),
        $excel_export_head = $('#excel-export-head'),
        $excel_export_body = $('#excel-export-body');

	for(var colCnt = 0; colCnt < data.timeList; colCnt++){
		$timeTableHead.find('colgroup').append("<col width='" + colSize + "%'>");
		$timeTable.find('colgroup').append("<col width='" + colSize + "%'>");

        $excel_export_head.find('colgroup').append("<col width='" + colSize + "%'>");
        $excel_export_body.find('colgroup').append("<col width='" + colSize + "%'>");
	}

    //헤더 생성
    var
        headers = '<tr id="headers"></tr>',
        excelHeaders = '<tr id="excel-headers"></tr>';
    $('#tb_alarmAnalysis_time_header').append(headers);
    $('#excel-export-thead').append(excelHeaders);

    var
        $headers = $('#headers'),
        $excelHeaders = $('#excel-headers');

    $headers.append('<th class="overTxt updown sort" title="장비구분">장비구분<input type="hidden" value='+'"장비구분"'+'/></th>');
    $headers.append('<th class="overTxt updown sort" title="총계">총계<input type="hidden" value='+'"총계"'+'/></th>');

    $excelHeaders.append('<th>장비구분</th>');
    $excelHeaders.append('<th>총계</th>');

	$.each(data.alarmCntList,function(i, oneRow){
		var y = oneRow.C_DATE.substring(0,4);
		var m = oneRow.C_DATE.substring(4,6);
		var d = oneRow.C_DATE.substring(6,8);
		
		var dt = y + '-' + m + '-' + d; 
		
		// if ( $('[name=\"th_'+ oneRow.C_DATE +'\"]').length == 0 ) {
		// 	$('#headers').append('<th class="overTxt updown sort" title="' + dt + '" name=\"th_'+ oneRow.C_DATE +'\">' + dt + '<input type="hidden" value="'+dt+'"/></th>');
		// }

        if ( $('.th_'+ oneRow.C_DATE).length == 0 ) {
            $headers.append('<th class="overTxt updown sort th_' + oneRow.C_DATE + '" title="' + dt + '">' + dt + '<input type="hidden" value="' + dt + '"/></th>');
            $excelHeaders.append('<th>' + dt + '</th>');
        }
	});

	//$('#headers').find('th').css('width','100px');

	//조회한 시스템의 개수 만큼 로우 생성
	var systems = $('#target_system').val();
	var sysArr = [];
	sysArr = systems.split(',');
	
	$.each(sysArr, function(i, system){
		// var oneRow = '<tr name="rowData"></tr>';
        var
            oneRow = '<tr class="rowData"></tr>',
            excelOneRow = '<tr class="excel-rowData"></tr>';

        $('#alarmByTimeTable').find('tbody').append(oneRow);
        $('#excel-export-body').find('tbody').append(excelOneRow);

        var
            $rowData = $('.rowData'),
            $excelRowData = $('.excel-rowData');

        // $rowData.eq(i).append('<td class="overTxt" title="' + system + '" name="sysName">'+system+'</td>');
        $rowData.eq(i).append('<td class="overTxt sysName" title="' + system + '">'+system+'</td>');
        // $rowData.eq(i).append('<td class="overTxt" title="0" name="sysTotal">0</td>');
        $rowData.eq(i).append('<td class="overTxt sysTotal" style="cursor:pointer;" ' + '" data-systemName="' + system + '"title="0">0</td>');
        
        $excelRowData.eq(i).append('<td class="sysName">'+system+'</td>');
        $excelRowData.eq(i).append('<td class="sysTotal">0</td>');

        $.each(data.alarmCntList,function(idx, oneRow){
            if ( $rowData.eq(i).find('.td_' + oneRow.C_DATE).length == 0 ) {
                $rowData.eq(i).append('<td class="overTxt td_' + oneRow.C_DATE + '" data-eventdate="' + oneRow.C_DATE + '" data-systemName="' + system + '" style="cursor:pointer;" title="0" >0</td>');
            }

            if ( $excelRowData.eq(i).find('.td_' + oneRow.C_DATE).length == 0 ) {
                $excelRowData.eq(i).append('<td class="td_' + oneRow.C_DATE + '" title="0">0</td>');
            }
            
            
        });
        /* 카운트 클릭이벤트 */
		var lastLine = $timeTable.find('tbody tr').length;
		var $time_analysis_detail = $("#tb_timeAnalysis_detail");
		var $timeAnalysisUp = $('#timeAnalysisUp');
		$timeTable.find('tbody tr').eq(lastLine-1).find('td').each(function(i, e){
			if(i > 0){
				$(this).on("click",function(e){
					if($(this).prop("class").includes("selected")){
						$(this).removeClass("selected");
					} else {
						$(this).parent().parent().find('td').each(function(i,e){
							if($(e).prop("class").includes("selected")){
								$(this).removeClass("selected");
							}
						});
						$(this).addClass("selected");
						condition['systemName'] = $(this).data("systemname");
						condition['eventDate'] = $(this).data("eventdate");
						$time_analysis_detail.find('tbody tr').remove();
						getTimeAnalysisDetailData(condition);
						
						/* 다이얼로그 팝업 */
						$('#timeAnalysisBg').show().fadeIn('fast');
						$timeAnalysisUp.show().fadeIn('fast');
						var height = (screen.height - $timeAnalysisUp.height()-100)/2;
						var width = (screen.width - $timeAnalysisUp.width())/2;
						$timeAnalysisUp.css('left',width+'px');
						$timeAnalysisUp.css('top',height+'px');
					    $("#timeAnalysisClose ,#timeAnalysisBg, #btn_timeAnalysisOk").on('click',function(e){
					    	delete condition['eventDate']
					    	$(this).removeClass("selected");
							$('#timeAnalysisBg').fadeOut();
							$('#timeAnalysisUp').fadeOut();
						});
						$( "#timeAnalysisUp" ).draggable({'handle' : '#timeAnalysisTitle'});
					}
				});
			}
		});
        
	});
	
	//가져온 데이터의 시스템 이름과 동일한 로우를 찾고, 각 시간에 CNT를 대입
	$.each( $('.sysName'), function(i, td){
		var totalCnt = 0;
		$.each ( data.alarmCntList, function(j, obj){
			if ( $(td).html() == obj.SYSTEM_NAME ) {
				$(td).parent().find('.td_' + obj.C_DATE).prop('title',obj.CNT);
				$(td).parent().find('.td_' + obj.C_DATE).html(obj.CNT);
				totalCnt += obj.CNT;
			}
		});
		$('.sysTotal').eq(i).html(totalCnt);
	});
	
	$headers.on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headers');
		
		if(columnSorting.sortInfo.length > 0){
			 var compKey = [];
			 var compOption = [];
			 
			 $.each(columnSorting.sortInfo, function(i,val){
				 compKey.push(val.colName);
				 compOption.push(val.order);
			 });
			 
			var tblData = tableToJson('alarmByTimeTableHead','alarmByTimeTable');
			
			tblData.sort(function(a,b){
				return sortComparator(a,b,compKey,compOption);
			});
			
			var _tblhdr = $('table#alarmByTimeTableHead th').map(function () {
			    return $(this).text();
			}).get();

            $timeTable.find('tbody').empty();
			
			var appendText = '';
			$.each(tblData, function(i, data){
				appendText += '<tr>';
				$.each(_tblhdr, function(i, col){
					appendText += '<td class="overTxt" title="'+data[col]+'">'+data[col]+'</td>';
				});
				appendText += '</tr>';
			});

            $timeTable.find('tbody').append(appendText);
			
		}
	});
	
}

function tableToExcel(){
	//JSP 페이지 엑셀 EXPORT 구현
	
	if($("#excel-export-tbody").find("tr").length <= 0){
		alert("조회된 데이터가 없습니다.");
		return;
	}
	
	//한글 깨짐 방지를 위한 meta 태그 포함
	var tab_text = 
		"<html>" +
		"<head>" +
		"<meta http-equiv='Content-Type' content='application/vnd.ms-excel;charset=utf-8'/>" +
		"</head>" +
		"<body>";
	
	tab_text += tab_text + '<table border="2px">';
	var textRange; 
	var j=0;
	
	tab = document.getElementById("excel-export-tbody");
	tabHead = document.getElementById("excel-export-thead");
	
	
	for(j = 0 ; j < tab.rows.length ; j++) {
		if(j == 0){
			var headerText = '<tr>';
			var headerCnt = 0;
			var splitList = tabHead.rows[j].innerHTML.split(">");
			for(var index in splitList){
				
				if(!splitList[index].match('<th') && '' != splitList[index] && !splitList[index].match('\n')){
					headerText = headerText + '<th bgcolor="#BDBDBD" style="text-align:center">' +splitList[index].substring(0, splitList[index].length-4) + '</th>'
					headerCnt++;
				}
			}
			
			headerText = '<tr>'
				+ '<th colspan="'+headerCnt+'" style="height: 35px; font-size: 20">시간별 알람통계</th>'
				+ '</tr>' + headerText;
			
			tab_text = tab_text + headerText + '</tr>';
			
		} 
		tab_text = "<tr>"+tab_text+tab.rows[j].innerHTML+"</tr>";
	}
	
	tab_text = tab_text + "</table>" + "</body></html>";
	
	var table_html = encodeURIComponent(tab_text);
    var data_type = 'data:application/vnd.ms-excel';
    
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		//IE
		txtArea_failureAnalByTime.document.open("txt/html","replace");
		txtArea_failureAnalByTime.document.write(tab_text);
		txtArea_failureAnalByTime.document.close();
		txtArea_failureAnalByTime.focus();
		sa = txtArea_failureAnalByTime.document.execCommand("SaveAs",true,"시간별 알람통계.xls");
	} else {
		//CHROME
	    var a = document.createElement('a');
	    a.href = data_type + ', ' + table_html;
	    a.download = '시간별 알람통계.xls';	   
	    a.click();
	}
}

function filterSaveSearch(flag, filterLevel) {
	alarmFilter = filterLevel;
}

function closeCallBack(obj) {
	//Background는 따로 처리 
	if ( obj.id.indexOf('Bg') != -1 ) {
		$.each( $('.ui-draggable') ,function(i, dlg){
			if ( $(dlg).css('display') != 'none' ) {
				var idStr = dlg.id;
				// var arr   = idStr.split('_');
				
				// if (arr[1] == 'hour') {
				// 	$('#table_hour li button').removeClass('active');
				// 	$('#chk_analyTm_spTime').prop('checked',false);
				// } else if ( arr[1] == 'alarmCode') {
				// 	$('#chk_analyTm_spAlarm').prop('checked', false);
				// }

				if (idStr === 'setSpecificTimeUp') {  //searchHourSelect.jsp화면 (다이얼로그: dlg_hour)
					$('#table_hour li button').removeClass('active');
					$('#chk_analyTm_spTime').prop('checked',false);
					initSpTime();
				} else if ( idStr === 'dlg_alarmCode') {  //alarmCodeSelect.jsp화면 (다이얼로그: dlg_alarmCode)
					$('#chk_analyTm_spAlarm').prop('checked', false);
					alarmCodeSet = null;
				}
			}
		});
	}
	//취소, 닫기 버튼 눌렀을 때는 시간 선택 UI 초기화 후, 체크박스 해제 되게함
	// else if ( obj.id.indexOf('spTime') != -1 ) {
	else if (obj.id.indexOf('setSpecificTime') != -1) {  //searchHourSelect.jsp화면 (다이얼로그: dlg_hour)
		$('#table_hour li button').removeClass('active');
		$('#chk_analyTm_spTime').prop('checked',false);
		initSpTime();
	} else if ( obj.id.indexOf('spAlarm') != -1 ) {
		$('#chk_analyTm_spAlarm').prop('checked', false);
		alarmCodeSet = null;
	}
}
