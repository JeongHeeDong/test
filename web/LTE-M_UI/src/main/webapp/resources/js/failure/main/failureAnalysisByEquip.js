//var analysisData = null;
var spTime = null; 
var spDate = null;
var alarmFilter = [4];
var alarmCodeSet = null;

var newDate = new Date();
var yy = newDate.getFullYear();
var mm = newDate.getMonth()+1;
var dd = newDate.getDate();
var hh = newDate.getHours()-1;
hh = hh==0?24:hh;

var classNames = {};

$(document).ready(function(){
	
	initialize();

	$('#tb_alarmAnalysis_equip_header').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#tb_alarmAnalysis_equip_header');
		classNames = {};
		$.each($('#tb_alarmAnalysis_equip_header').find('.sort'),function(i,val){
			classNames[val.id] = $(val).attr('class');
		});
		getAlarmAnalysisByEquip(true);
	});
	
	$("#box_analyEq_fromtime").datepicker({
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
			$('#box_analyEq_totime').datepicker('option', 'minDate', min_dt);
			
			//최대 선택된 날짜의 한달 이후까지만 설정
			var max_dt = new Date(year, month, day);
			$('#box_analyEq_totime').datepicker("option", 'maxDate', max_dt);
		}
	});	
	$("#box_analyEq_totime").datepicker({
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
	$("#box_analyEq_fromtime").datepicker().datepicker("setDate", new Date());
	$("#box_analyEq_totime").datepicker().datepicker("setDate", new Date());
	
	$('#btn_analyEq_fromtime').on('click',function(e){
		$('#box_analyEq_fromtime').datepicker("show");
	});
	$('#btn_analyEq_totime').on('click',function(e){
		$('#box_analyEq_totime').datepicker("show");
	});
	
//	$("input:radio[name='rd_analyEq_graph']").on('change',function(e){
//		var radioVal = $("input:radio[name='rd_analyEq_graph']:checked").val();
//		if(analysisData != null){
//			if(radioVal == "alarmCode"){
//				setGraphData("alarmCode",analysisData);	
//			} else if(radioVal == "equip"){
//				setGraphData("equip",analysisData);
//			}			
//		}
//	});
	
	$("input:radio[name='rd_search_ea']").on('change',function(e){
		$("#target_system").val("");
		$("#target_system").prop("title", "");
		searchTargetSystemList = [];
	});
	
	$('#chk_fault').change(function(e) {
		if( $(this).is(':checked') ) faultFilterView();
		else {
			$('#faultState').val(0);
		}
	});
	
});

function initialize(){
	/* 특정시간 선택화면 팝업 */
	$("#chk_analyEq_spTime").on('click', function(e){
		if( $(this).is(':checked') ){
			
			/* 초기화 (기본 조회 시간은 현재시간-1 시간) */
			$("#"+hh).addClass("active");
			// var activeArray = [];
//			activeArray.push(hh.toString());

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
			spTime = null;
		}
	});

	$("#setSpecificTimeOk").on("click", function () {
		var activeArray = [];
		var timeStr;
		spTime = null;
		// activeArray = $('#table_hour li button.active').text().trim().split(' ');
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

		// if(activeArray != null && activeArray[0] != ""){
		if(activeArray != null && activeArray.length > 0){
			spTime = activeArray;
			$('#chk_analyEq_spTime').prop('checked',true);
		} else {
			spTime = null;
			$('#chk_analyEq_spTime').prop('checked',false);
		}
		$('#setSpecificTimeBg').fadeOut();
		$('#setSpecificTimeUp').fadeOut();
	});

	$('#setSpecificTimeClose, #setSpecificTimeCancel, #setSpecificTimeBg').attr('onclick', 'closeCallBack(this)');
	$("#setSpecificTimeClose, #setSpecificTimeBg, #setSpecificTimeCancel").on('click',function(e){
		$('#setSpecificTimeBg').fadeOut();
		$('#setSpecificTimeUp').fadeOut();
	});
	$("#setSpecificTimeUp").draggable({'handle' : '#setSpecificTimeTitle'});
	
	$('#spAlarmClose, #spAlarmCancel, #spAlarmBg').attr('onclick', 'closeCallBack(this)');
	
	/*-----------------------------------------------------------------*/
	/* 특정일자제외 화면 팝업 */
	$('#analyEq_spDate').datepicker({
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
            $("#chk_analyEq_spDate").attr("checked",true);
            spDate = selectedDate;
            if(selectedDate == ""){
            	$("#chk_analyEq_spDate").attr("checked",false);
            }
        }
    });
	
	$('#chk_analyEq_spDate').on('click',function(e){
		if( $(this).is(':checked') ){
			$('#analyEq_spDate').datepicker("show");
		} else {
//			$('#search_spDate').val('');
		}
    });
	
	$('#chk_analyEq_spAlarmCode').on('click',function(e){
		if( $(this).is(':checked') ){
			if($("#target_system").val() == ""){
				alert("조회대상을 먼저 선택하세요.");
				$('#chk_analyEq_spAlarmCode').prop('checked',false);
				return;
			}
			$("#dlg_alarmCode .mu-dialog-head .title").html('알람코드 선택');
			var alarmCodeCondition = {};
			var systemIds = [];
			$.each(searchTargetSystemList, function(i,e){
				systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
			});
			alarmCodeCondition['systemIds'] = '\'' + systemIds.join('\',\'') + '\'';
			alarmCodeCondition['alarmDesc'] = $(":radio[name='rd_search_ea']:checked").val();
			searchAlarmCode(alarmCodeCondition);
	        
			openDialog('#dlg_alarmCode', function (fnCloseDlg) {
	        	alarmCodeSet = [];
	        	$("#tb_alarmCode tbody tr").each(function(i,row){
	        		if($(this).find('input:checkbox').prop('checked')){
        				alarmCodeSet.push($(this).find('input[name="alarmCode"]').val());
	        		}
	        	});
	        	
	        	if(alarmCodeSet != null && alarmCodeSet.length > 0){
                    $('#chk_analyEq_spAlarmCode').prop('checked',true);
	            } else {
	            	alarmCodeSet = null;
	            	$('#chk_analyEq_spAlarmCode').prop('checked',false);
	            }
	            fnCloseDlg();
	        });
			
		} 
    });

	/* 알람등급 팝업 */
	$("#chk_alarmFilter").on('click', function(e){
		if( $(this).is(':checked') ){
			filterAlarmView(e, alarmFilter);
		} 
		else {
			alarmFilter = [4];
		}
	});
	
	/*-----------------------------------------------------------------*/
	/* 그래프 표시안함 체크시 */
	$("#chk_analyEq_noGraph").on('click', function(e){
		if( $(this).is(':checked') ){
			$("#alarmAnalysisGraph_area").parent().hide();
			$("#tb_alarmAnalysis_equip").parent().height("788px");
		} else {
			$("#alarmAnalysisGraph_area").parent().show();
			$("#tb_alarmAnalysis_equip").parent().height("438px");
			getAlarmAnalysisByEquip();
		}
	});
}

function getAlarmAnalysisByEquip(flag) {
	
	if($("#target_system").val() != "" && searchTargetSystemList != null && searchTargetSystemList.length != 0){
		var condition = {};
		condition['sortOption'] = columnSorting.sortInfo;
		/* 조회대상 리스트 조건 */
		var systemIds = [];// equipType도 추가하여 조건넣음
		$.each(searchTargetSystemList, function(i,e){
			systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
		});
		
		/* 날짜 조건 */
		var fromTime = $("#box_analyEq_fromtime").val();
		var toTime = $("#box_analyEq_totime").val();

		/* 날짜 범위 */
		if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/3600 < 0){
			alert('조회 범위가 잘못되었습니다.');
			return false;
		}else if((new Date(toTime).getMonth() - new Date(fromTime).getMonth()) > 1){
			alert('최대 한달 조회만 가능합니다.');
			return false;
		}
		
		/* 체크버튼 조건(특정시간, 특정일자 제외, 알람필터, 그래프 표시안함 )*/
		if($("#chk_analyEq_spTime").is(':checked')){
			if(spTime != null){
				condition['spTime'] = '\'' + spTime.join('\',\'') + '\'';
			}
		} 
		if($("#chk_analyEq_spDate").is(':checked')){
			if(spDate != null){
				condition['spDate'] = spDate;
				condition['spFromDate'] = spDate;
				condition['spToDate'] = spDate+' 23:59:59';
			}
		}

		if($("#chk_alarmFilter").is(':checked')){
			condition['alarmFilter'] = alarmFilter;
		}

		if($("#chk_analyEq_spAlarmCode").is(':checked')){
			if(alarmCodeSet != null){
				condition['alarmCodeSet'] = '\'' + alarmCodeSet.join('\',\'') + '\'';
			}
		}
		
		if(systemIds.length == 0){
			alert('조회대상을 선택하세요.');
			return;
		}
		
		if ('alarmFilter' in condition){
			if ( condition['alarmFilter'][0] == ['4'] ){
				delete condition['alarmFilter']
			}
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
		condition['alarmtype'] = $('#faultState').val();
		condition['graphType'] = $("input:radio[name='rd_analyEq_graph']:checked").val();
		
		/* 화면 초기화*/
		$("#tb_alarmAnalysis_equip tbody tr").remove(); //테이블 초기화
		$("#tb_alarmAnalysis_equip_header thead tr").remove();
		try {
			graphChart.destroy();
			graphChart = '';
		} catch(e) {
		}
		
		$.ajax({
			cache : false,
			type : 'post',
			url : '/failureStatistic/analysis/failureAnalysisByEquip/getAlarmAnalysisByEquip',
			contentType: 'application/json; charset=UTF-8',
			dataType:'json',
			data : JSON.stringify(condition),
			success: function(data) {
				var graphType = $("input:radio[name='rd_analyEq_graph']:checked").val();
				if(data['alarmAnalysisTableList'] != null && data['alarmAnalysisTableList'].length > 0){
					gridAlarmAnalysisByEquip(data, condition, flag);
					if(graphType == "alarmCode"){
						setGraphData(graphType,data);
					} else if(graphType == "equip" && data['alarmAnalysisGraphList'] != null && data['alarmAnalysisGraphList'].length > 0){
						setGraphData(graphType,data);
					}
//					analysisData = data;
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
	if(!$('#chk_analyEq_noGraph').prop('checked')) {
		$("#tb_alarmAnalysis_equip").parent().height("438px");
	}
	
	/*알람코드별*/
	if(graphType == "alarmCode"){ //{SYSTEM_ID:'V_MME0001', A0001:50, A0002:13 ...} 알람코드가 나열된 결과.
		var alarmCodeList = data['alarmCodeList'];
		var alarmAnalysisTableList = data['alarmAnalysisTableList'];
		var graphData = [];
		
		var _alarmCodeList = [];
		$.each(alarmCodeList, function(i,obj){
			_alarmCodeList.push(obj.ALARM_CODE);
			var countByCode = 0;
			$.each(alarmAnalysisTableList, function(j,cntData){
				countByCode += parseInt(cntData[obj.ALARM_CODE]);
			});
			graphData.push(countByCode);
		});
		var dataObj = {};
		dataObj['yData'] = graphData;
		viewGraph(_alarmCodeList, dataObj, graphType);
	}
	/*장비별*/
	else if(graphType == "equip"){ //{SYSTEM_ID:'V_MME0001', 1:15, 2:115 ...} 타입이 나열된 결과.
		var alarmTypeList = data['alarmTypeList'];
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
		var alarmAnalysisGraphList = data['alarmAnalysisGraphList'];
		var allData = [];
		var alarmData = [];
		var faultData = [];
		var statusData = [];
		var etcData = [];
		var xData = [];
		$.each(alarmAnalysisGraphList, function(i,cntData){ 
			xData.push(cntData['EQUIP_NAME'] + "-" + cntData['SYSTEM_NAME']);
			alarmData.push(valueCheck(cntData['ALARM']));
			faultData.push(valueCheck(cntData['FAULT']));
			statusData.push(valueCheck(cntData['STATUS']));
			etcData.push(valueCheck(cntData['ETC']));
			allData.push(valueCheck(cntData['ALARM']) + valueCheck(cntData['FAULT']) + valueCheck(cntData['STATUS']) + valueCheck(cntData['ETC']));
		});
		
		var dataObj = {};
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
	if(graphType=="equip"){
		xTitle = 'SYSTEM_NAME';
	} else if(graphType=="alarmCode"){
		xTitle = '알람코드';
	}
	
	var graphOption  = {
		chart: {
			renderTo : alarmAnalysisGraph_area,
            zoomType: 'xy'
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
	
//	if(graphType == "equip"){
//		
//		var minVal = 0;
//		var maxVal = 0;
//		$.each(dataObj['alarmType'], function(i,alarmType){
//			
//			var seriesData = {
//					name: alarmType,
//					type: 'spline',
//					yAxis: 1,
//					data: dataObj[alarmType]
//			};
//			graphOption.series.push(seriesData);
//			
//			
//			$.each(dataObj[alarmType], function(i,data){
//				if(minVal > data && data >= 0){
//					minVal = data;
//				} 
//				if(maxVal < data){
//					maxVal = data;
//				} 				
//			});
//		});
//		
//		var yAxisData = {
//				title: {
//					text: '알람건수'
//				},
//				opposite: true,
//				labels: {
//					format: '{value}'
//				},
//				min: minVal,
//				max: maxVal
//		};
//		graphOption.yAxis.push(yAxisData);
//		
//	}
	
	graphChart = new Highcharts.Chart(graphOption);
	
//	$('#container').highcharts({graphOption});
}

function gridAlarmAnalysisByEquip(data, condition, flag){
	var alarmCodeList = data['alarmCodeList'],
		alarmAnalysisTableList = data['alarmAnalysisTableList'];

	var $alarmAnalysis_equip_header = $("#tb_alarmAnalysis_equip_header"),
		$alarmAnalysis_equip_body = $("#tb_alarmAnalysis_equip"),
		$excel_export_header = $("#excel-export-header"),
		$excel_export_body = $("#excel-export-body");

	var colSize = 100/(alarmCodeList.length+2),
		colRow = "",
		headRow = "";

	$alarmAnalysis_equip_header.find('colgroup col').remove();
	$alarmAnalysis_equip_header.find('thead tr').remove();

	colRow += "<col width='" + colSize + "%'>";
	colRow += "<col width='" + colSize + "%'>";
	headRow += "<tr>";
	headRow += "	<th class='overTxt updown sort' title='장비구분' id='system-name'><input type='hidden' value='TOTAL.SYSTEM_NAME' />장비구분</th>";
	headRow += "	<th class='overTxt updown sort' title='총계' id='total-count'><input type='hidden' value='TOTAL.TOTAL_CNT' />총계</th>";
	$.each(alarmCodeList, function(i,obj){
		colRow += "	<col width='" + colSize + "%'>";
//		headRow += "<th class='overTxt updown sort' title='ALARM_CODE:" +obj.ALARM_CODE + " , "+obj.PROBABLE_CAUSE + "' id='" + obj.ALARM_CODE + "'><input type='hidden' value='TOTAL." + obj.ALARM_CODE + "' />" + obj.ALARM_CODE + "</th>";
		headRow += "<th class='overTxt updown sort' title='ALARM_CODE : " +obj.ALARM_CODE +"' id='" + obj.ALARM_CODE + "'><input type='hidden' value='TOTAL." + obj.ALARM_CODE + "' />" + obj.ALARM_CODE + "</th>";
	});
	headRow += "</tr>";

	$alarmAnalysis_equip_header.find('colgroup').append(colRow);
	$alarmAnalysis_equip_header.find('thead').append(headRow);
	$alarmAnalysis_equip_body.find('colgroup col').remove();
	$alarmAnalysis_equip_body.find('colgroup').append(colRow);

	if(!flag) {
		$excel_export_header.find('colgroup col').remove();
		$excel_export_header.find('thead tr').remove();
		$excel_export_header.find('colgroup').append(colRow);
		$excel_export_header.find('thead').append(headRow);
		$excel_export_body.find('colgroup col').remove();
		$excel_export_body.find('colgroup').append(colRow);

		$excel_export_body.find('tbody tr').remove();
	}

	if(flag) {
		var keys = Object.keys(classNames);
		keys.map(function (v, i) {
			if (v != ''){
				document.querySelector('#' + v).className = classNames[v];
			}
		});
	}

	$alarmAnalysis_equip_body.find('tbody tr').remove();

	$.each(alarmAnalysisTableList, function(i,row) {
		var bodyRow = "";
		bodyRow += "<tr>";
		bodyRow += "	<td class='overTxt' align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'];
		bodyRow += "		<input type='hidden' name='systemId-equipType' value='" + row['SYSTEM_ID'] + "-" + row['EQUIP_TYPE'] + "' />";
		bodyRow += "	</td>";
		bodyRow += "	<td class='overTxt' style='cursor:pointer;' align='center' data-id='0' title='" + row['TOTAL_CNT'] + "'>" + row['TOTAL_CNT'] + "</td>";
		$.each(alarmCodeList, function (i, obj) {
			bodyRow += "<td class='overTxt' style='cursor:pointer;' align='center' title='" + row[obj.ALARM_CODE] + "' data-id='" + obj.ALARM_CODE + "'>" + row[obj.ALARM_CODE] + "</td>";
		});
		bodyRow += "</tr>";
		$alarmAnalysis_equip_body.find('tbody').append(bodyRow);

		if (!flag) {
			$excel_export_body.find('tbody').append(bodyRow);
		}

		/* 카운트 클릭이벤트 */
		var lastLine = $alarmAnalysis_equip_body.find('tbody tr').length;
		var $equip_analysis_detail = $("#tb_equipAnalysis_detail");
		var $equipAnalysisUp = $('#equipAnalysisUp');
		$alarmAnalysis_equip_body.find('tbody tr').eq(lastLine-1).find('td').each(function(i, e){
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

						condition['systemId-equipType'] = $(this).parent().find('input[name="systemId-equipType"]').val();
						condition['alarmCode'] = $(this).data("id");
						$equip_analysis_detail.find('tbody tr').remove();
						getEquipAnalysisDetailData(condition);
						
						/* 다이얼로그 팝업 */
						$('#equipAnalysisBg').show().fadeIn('fast');
						$equipAnalysisUp.show().fadeIn('fast');
						var height = (screen.height - $equipAnalysisUp.height()-100)/2;
						var width = (screen.width - $equipAnalysisUp.width())/2;
						$equipAnalysisUp.css('left',width+'px');
						$equipAnalysisUp.css('top',height+'px');
					    $("#equipAnalysisClose ,#equipAnalysisBg, #btn_equipAnalysisOk").on('click',function(e){
					    	$(this).removeClass("selected");
							$('#equipAnalysisBg').fadeOut();
							$('#equipAnalysisUp').fadeOut();
						});
						$( "#equipAnalysisUp" ).draggable({'handle' : '#equipAnalysisTitle'});
					}
				});
			}
		});
	});
	
}

function excelReport() {
	if($('#excel-export-body').find('tbody tr').length <= 0){
		alert("조회된 데이터가 없습니다.");
		return;
	}
	
	var tab_text = 
		"<html>" +
		"<head>" +
		"<meta http-equiv='Content-Type' content='application/vnd.ms-excel;charset=utf-8'/>" +
		"</head>" +
		"<body>";
	
	tab_text+="<table border='2px'>";
	var textRange; var j=0;
	tab = document.getElementById("excel-export-body"); // id of table
	tabHead = document.getElementById("excel-export-header");

	for(j = 0 ; j < tab.rows.length ; j++) {
		if(j == 0){
			var headerText = '<tr>';
			var headerCnt = 0;
			var splitList = tabHead.rows[j].innerHTML.split(">");
			var idx = 0;
			var splitArr = splitList.filter(function (v, i) {
				if((i + 1) % 3 === 0) {
					return v;
				}
			});
			for(var index in splitArr){
				
				if(!splitArr[index].match('<th') && '' != splitArr[index] && !splitArr[index].match('\n')){
					headerText = headerText + '<th bgcolor="#BDBDBD" style="text-align:center">' +splitArr[index].substring(0, splitArr[index].length-4) + '</th>'
					headerCnt++;
				}
			}
			
			headerText = '<tr>'
				+ '<th colspan="'+headerCnt+'" style="height: 35px; font-size: 20">장비별 알람 통계</th>'
				+ '</tr>' + headerText;
			
			tab_text = tab_text + headerText + '</tr>';
			
		} 
		tab_text += "<tr>"+tab.rows[j].innerHTML+"</tr>";
	}

	tab_text = tab_text + "</table>" + '</body></html>';
	tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
	tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

	var table_html = encodeURIComponent(tab_text);
    var data_type = 'data:application/vnd.ms-excel';
	
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	// If Internet Explorer
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		//IE
		txtArea_failureAnalByTime.document.open("txt/html","replace");
		txtArea_failureAnalByTime.document.write(tab_text);
		txtArea_failureAnalByTime.document.close();
		txtArea_failureAnalByTime.focus();
		sa = txtArea_failureAnalByTime.document.execCommand("SaveAs",true,"장비별 알람통계.xls");
	} else {
		//CHROME
	    var a = document.createElement('a');
	    a.href = data_type + ', ' + table_html;
	    a.download = '장비별 알람통계.xls';	   
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

				/*if (arr[1] == 'hour') {  //searchHourSelect.jsp화면 (다이얼로그: dlg_hour)
					spTime = null;
					$('#table_hour li button').removeClass('active');
					$('#chk_analyEq_spTime').prop('checked',false);		
				} else if ( arr[1] == 'alarmCode') {  //alarmCodeSelect.jsp화면 (다이얼로그: dlg_alarmCode)
					alarmCodeSet = null;
					$('#chk_analyEq_spAlarmCode').prop('checked', false);
				}*/

				if (idStr === 'setSpecificTimeUp') {  //searchHourSelect.jsp화면 (다이얼로그: dlg_hour)
					spTime = null;
					$('#table_hour li button').removeClass('active');
					$('#chk_analyEq_spTime').prop('checked',false);
				} else if (idStr === 'dlg_alarmCode') {  //alarmCodeSelect.jsp화면 (다이얼로그: dlg_alarmCode)
					alarmCodeSet = null;
					$('#chk_analyEq_spAlarmCode').prop('checked', false);
				}
			}
		});
	}
	//취소, 닫기 버튼 눌렀을 때는 시간 선택 UI 초기화 후, 체크박스 해제 되게함
	else if ( obj.id.indexOf('setSpecificTime') != -1 ) {
		spTime = null;
		$('#table_hour li button').removeClass('active');
		$('#chk_analyEq_spTime').prop('checked',false);		
	} else if ( obj.id.indexOf('spAlarm') != -1 ) {
		alarmCodeSet = null;
		$('#chk_analyEq_spAlarmCode').prop('checked', false);
	}
}
