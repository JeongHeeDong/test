var select_data;
var scrollPageNo = 1;
var endScrollPageNo = 0;
var scrollNo = 0;
var endScrollNo =0;

$(document).ready(function(){
	$('#tb_failureSpec_alarm_header').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#tb_failureSpec_alarm_header');
		searchFailureSpec(true);
	});
	
	$( "input[name='spinner_failureSpec_hour']" ).spinner({
		numberFormat: "d2",
		max: 23,
		min: 0
	});
	
	$( "input[name='spinner_failureSpec_min']" ).spinner({
		numberFormat: "d2",
		max: 55,
		min: 0,
		step: 5
	});
	
	$("#box_failureSpec_fromtime").datepicker({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		"setDate": new Date(),
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		onClose: function( selectedDate ) {
	        $( "#box_failureSpec_totime" ).datepicker( "option", "minDate", selectedDate );
	    }
	});	
	$("#box_failureSpec_totime").datepicker({
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
	$("#box_failureSpec_fromtime").datepicker().datepicker("setDate", new Date());
	$("#box_failureSpec_totime").datepicker().datepicker("setDate", new Date());
	
	$('#btn_failureSpec_fromtime').on('click',function(e){
		$('#box_failureSpec_fromtime').datepicker("show");
	});
	$('#btn_failureSpec_totime').on('click',function(e){
		$('#box_failureSpec_totime').datepicker("show");
	});
	
	$("#area_failureSpecAlarm").scroll( function() {
		var elem = $("#area_failureSpecAlarm");
		
		if ( elem[0].scrollHeight - elem.scrollTop() < elem.outerHeight()){
			appendGridData();
		}
	});
	
	$('#chk_alarm_filter').on('click', function(e) {
		// 팝업창 선택에 의해 체크되도록 기본 이벤트 중지.
		e.preventDefault();
		faultAlarmFilterView();
	});
	
});


function searchFailureSpec(flag){
	
	/* 조회대상 리스트 조건 (searchSystemSelect.js에 있는 전역변수 searchTargetSystemList에 조회된 데이터가 있을 경우에만 조회) */
	if(searchTargetSystemList != null && searchTargetSystemList.length != 0) {		
		var condition = {};
		if(!flag) {
			columnSorting.beforeColNms = [];
			columnSorting.sortInfo = [];

			var sort = document.querySelectorAll('#tb_failureSpec_alarm_header .sort');

			for(var i = 0; i < sort.length; i += 1) {
				sort[i].className = 'overTxt updown sort';
			}
		}
		condition['sortOption'] = columnSorting.sortInfo;

		var systemIds = [];// equipType도 추가하여 조건넣음
		$.each(searchTargetSystemList, function(i,e){
			systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
		});

		/* 날짜 조건 */
		var fromTime = $("#box_failureSpec_fromtime").val() + ' ' + $("#spinner_failureSpec_fromhour").val() + ':' + $("#spinner_failureSpec_frommin").val();
		var toTime = $("#box_failureSpec_totime").val() + ' ' + $("#spinner_failureSpec_tohour").val() + ':' + $("#spinner_failureSpec_tomin").val();

		/* 날짜 범위 */
		if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/3600 < 0){
			alert('조회 범위가 잘못되었습니다.');
			return false;
		}else if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/3600 > 168){
			alert('최대 일주일 조회만 가능합니다.');
			return false;
		}

		if(systemIds.length == 0){
			alert('조회대상을 선택하세요.');
			return;
		}
		
		condition['systemIds'] = '\'' + systemIds.join('\',\'') + '\'';
		condition['fromTime'] = fromTime;
		condition['toTime'] = toTime;
		condition['severity'] = $("#specAlarmType").val();
		condition['alarmtype'] = $('#faultState').val();
		condition['faultAlarmFilter'] = faultAlarmFilter;
		
		/* 화면 초기화 */
		$("#alarmMsg").val("");
		$("#tb_failureSpec_alarm tbody tr").remove();
		try {
			$('#failureSpecGraph_datetime_area').highcharts().destroy();
		} catch (e) {
		}
		try {
			$('#failureSpecGraph_alarmCode_area').highcharts().destroy();
		} catch (e) {
		}
		/* 상단 알람 카운트 초기화 */
		for(var j=1; j<=3; j++){
			$("#cntLevel"+j).html(0);		
		}
		
		$.ajax({
			cache : false,
			type : 'post',
			url : '/failure/spec/failureSpec/getFailureSpecAlarm',
			contentType: 'application/json; charset=UTF-8',
			dataType:'json',
			data : JSON.stringify(condition),
			success: function(data) {
				select_data = data['failureSpecAlarm'];
				
				scrollPageNo = 1;
				scrollNo = 0;
				endScrollNo = select_data.length;
				endScrollPageNo = (endScrollNo%100)==0?(endScrollNo/100):Math.floor(endScrollNo/100)+1;
				
				if(select_data.length > 0){
					var appendTr = '';
					
					$.each(select_data,function(i,row){
						
						if(scrollNo < 100){
							appendTr += "<tr style='cursor:pointer;' onclick='javascript:viewAlarmMsg(this)'>";
							appendTr += 	"<td class='overTxt' align='center' title='" + (scrollNo+1) + "'>" + (scrollNo+1) + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['SEVERITY'] + "'>";
							appendTr += 		row['SEVERITY'];
							appendTr += 	" 	<input type='hidden' name='specLevel' value='" + row['SEVERITY_NO'] + "' />";
							appendTr += 	"</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['ALARM_STATE'] + "'>" + row['ALARM_STATE'] + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['FDN'] + "'>" + row['FDN'] + "</td>";
							appendTr += 	"<td class='overTxt' align='center' title='" + row['EVENT_TIME'] + "'>" + row['EVENT_TIME'] + "</td>";
							appendTr += 	"	<input type='hidden' name='specRopMsg' value='" + row['ROP_MESSAGE'] + "' />";
							appendTr += 	"	<input type='hidden' name='specAlarmType' value='" + row['ALARM_TYPE'] + "' />";
		//					searchRow += 	"<td style='display:none'>"+row['SYSTEM_ID']+"</td>";
							appendTr += "</tr>";
							
							scrollNo++;
						}else{
							return false;
						}
					});
					
					$("#tb_failureSpec_alarm tbody").append(appendTr);
					
					alarmCount(select_data);
					
					//차트 그리기 코드
					var graphData = data['failureSpecGraph'];
					createChart(graphData['failureSpecGraphByDatetime'], 'failureSpecGraph_datetime_area');
					createChart(graphData['failureSpecGraphByAlarmcode'], 'failureSpecGraph_alarmCode_area');
					
				} else {
					alert('조회된 데이터가 없습니다.');
				}
				
				/*if(obj != null && obj['failureSpecGraphByDatetime'].length > 0){
					setGraphData("dateTime",obj['failureSpecGraphByDatetime']);
					setGraphData("alarmCode",obj['failureSpecGraphByAlarmcode']);			
				} */
			}
		});
	} else {
		alert('조회대상을 선택하세요.');
	}
}

function appendGridData(){
	scrollPageNo++;
	if(scrollPageNo <= endScrollPageNo){
		var i = scrollNo;
		var j = 0;
		
		if(select_data.length%100 == 0){
			j = scrollNo+100;
		}else{
			j = scrollPageNo==endScrollPageNo?scrollNo+select_data.length%100:scrollNo+100;
		}
		
		var appendTr = '';
		
		for(i; i< j ; i++){
			
			appendTr += "<tr style='cursor:pointer;' onclick='javascript:viewAlarmMsg(this)'>";
			appendTr += 	"<td class='overTxt' align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].SEVERITY + "'>";
			appendTr += 		select_data[i].SEVERITY;
			appendTr += 	" 	<input type='hidden' name='specLevel' value='" + select_data[i].SEVERITY_NO + "' />";
			appendTr += 	"</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].ALARM_CODE + "'>" + select_data[i].ALARM_CODE + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].PROBABLE_CAUSE + "'>" + select_data[i].PROBABLE_CAUSE + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].ALARM_STATE + "'>" + select_data[i].ALARM_STATE + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].EQUIP_NAME + "'>" + select_data[i].EQUIP_NAME + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].SYSTEM_NAME + "'>" + select_data[i].SYSTEM_NAME + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].FDN + "'>" + select_data[i].FDN + "</td>";
			appendTr += 	"<td class='overTxt' align='center' title='" + select_data[i].EVENT_TIME + "'>" + select_data[i].EVENT_TIME + "</td>";
			appendTr += 	"	<input type='hidden' name='specRopMsg' value='" + select_data[i].ROP_MESSAGE + "' />";
			appendTr += 	"	<input type='hidden' name='specAlarmType' value='" + select_data[i].ALARM_TYPE + "' />";
			appendTr += "</tr>";
			
			scrollNo++;
		}
		$('#tb_failureSpec_alarm tbody').append(appendTr);
	}
}

function viewAlarmMsg(obj){
	if($(obj).prop("class")==""){
		$(obj).parent().find('tr').prop("class","");
		$(obj).prop("class","selected");
		$("#alarmMsg").val($(obj).find("input[name='specRopMsg']").val());
	} else if($(obj).prop("class")=="selected"){
		$(obj).prop("class","");
		$("#alarmMsg").val("");
	}
}

/**
 * 실시간 알람 개수 카운트
 */
function alarmCount(select_data) {
	//등급별 알람 개수 갱신
	var criCnt = 0;
	var maCnt = 0;
	var miCnt = 0;
	
	for(var i in select_data){
		if(select_data[i].SEVERITY_NO == 1) criCnt++;
		else if(select_data[i].SEVERITY_NO == 2) maCnt++;
		else if(select_data[i].SEVERITY_NO == 3) miCnt++;
	}
	
	$("#cntLevel1").html(criCnt);
	$("#cntLevel2").html(maCnt);
	$("#cntLevel3").html(miCnt);
	
}

function createChart(data, div){
	var tempTimelist = data.timeList
	var dataList = [];
	var yAxis = [];
	var xAxis = [];
	var timelist = [];
	
	$.each(tempTimelist, function(i, v) {
		if(parseInt(v))
			timelist.push(stringToTimestamp(v));
		else
			timelist.push(v);
	});
	
	var ticInterval = 1;
    var maxCnt = 5;
	var timeCount = timelist.length;
    if(timeCount > maxCnt) {
    	ticInterval = Math.ceil(timeCount / maxCnt);
    }
	
	$(data.graphData).each(function(key,value){
		var datalist = [];
		// 시간별 추이 차트 생성시 고장알람만 선택 되어 있으면 NORMAL은 표시하지 않음.
		if(div === 'failureSpecGraph_datetime_area' && value.name === 'NORMAL' && _.isEqual(faultAlarmFilter, ['1'])) {
			return;
		}
		var data = {
			name:value.name,
			type:value.type,
			data:value.data,
			yAxis : Number(value.yAxis),
			zIndex : Number(value.zIndex),
			tooltip:{
				valueSuffix:value.suffix
			}
		};
		if(value.Column === 'CRITICAL') {
			data.color = '#eb0606';
		} else if(value.Column === 'MAJOR') {
			data.color = '#eb8206';
		} else if(value.Column === 'MINOR') {
			data.color = '#ebe806';
		}
		dataList.push(data);
	});
	
	dataList.sort(function(a,b){
		return  b.zIndex - a.zIndex;
	});
	
	if(div == 'failureSpecGraph_datetime_area'){
		yAxis = [ {
			labels : {
				format : '{value}'
			},
			title : {
				text : '건수'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ],
			opposite : true,
			min : 0
		} ];

		xAxis = [ {
			type : 'datetime',
			categories : timelist,
			tickInterval : ticInterval,
			labels : {
				formatter : function() {
					return Highcharts.dateFormat('%m-%d %H:%M', this.value);
				}
			}
		} ];
	}else{
		yAxis = [ {
			labels : {
				format : '{value}'
			},
			title : {
				text : '건수'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ],
			opposite : true,
			min : 0
		} ];
		
		xAxis = [ {
			type : 'text',
			categories : timelist,
			tickInterval : ticInterval
		} ];
	}

	$('#'+div).show();
	$('#'+div).highcharts({
		chart:{
			zoomType: 'x',
			events : {
				selection : function(event) {
					if (event.resetSelection) {
						try {
							setTimeout(function() {
								$('#'+div).highcharts().xAxis[0].update({
									tickInterval : ticInterval
								});
							}, 0);
						} catch (e) {
						}
					} else {
						var _ticInterval = 1;
						var _xCnt = event.xAxis[0].max - event.xAxis[0].min;
						if (_xCnt > maxCnt) {
							_ticInterval = Math.ceil(_xCnt / maxCnt);
						}
						try {
							setTimeout(function() {
								$('#'+div).highcharts().xAxis[0].update({
									tickInterval : _ticInterval
								});
							}, 0);
						} catch (e) {
						}
					}
				}
			}
		},
		credits: {
            enabled: false
        },
        title: {
            text: '',
            x: -20 // center
        },
        xAxis: xAxis,
        yAxis: yAxis,
        tooltip: {
        	shared: true,
        	xDateFormat: '%Y-%m-%d %H:%M'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions:{
        	spline: {
                marker: {
                    enabled: false
                }
        	}
        },
        series: dataList
    });
}

function stringToTimestamp(yyyyMMddHHmm) {
	var year = parseInt(yyyyMMddHHmm.substring(0,4), 10);
	var month = parseInt(yyyyMMddHHmm.substring(4,6), 10) - 1;
	var day = parseInt(yyyyMMddHHmm.substring(6,8), 10);
	var hour = parseInt(yyyyMMddHHmm.substring(8,10), 10);
	var min = parseInt(yyyyMMddHHmm.substring(10,12), 10);
	return Date.UTC(year, month, day, hour, min, 0);
}

function excelReport() {
	var
		sortOption = [],
		headerList = [],
		columnList = [],
		headers,
		columns,
		index = 0;

	var $header = $('#tb_failureSpec_alarm_header');
	$header.find('thead tr th').each(function(i, th) {
		if (th.hasAttribute('id')) {
			if($(th).html() != 'No'){
				headerList[index] = th.title;
				columnList[index] = th.id;
				index++;
			}
		}
	});

	headers = headerList.join(",");
	columns = columnList.join(",");
	// sortOption = JSON.stringify(columnSorting.sortInfo);

	var systemIds = [];// equipType도 추가하여 조건넣음
	$.each(searchTargetSystemList, function(i,e){
		systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
	});

	/* 날짜 조건 */
	var fromTime = $("#box_failureSpec_fromtime").val() + ' ' + $("#spinner_failureSpec_fromhour").val() + ':' + $("#spinner_failureSpec_frommin").val();
	var toTime = $("#box_failureSpec_totime").val() + ' ' + $("#spinner_failureSpec_tohour").val() + ':' + $("#spinner_failureSpec_tomin").val();

	/* 날짜 범위 */
	if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/3600 > 168){
		alert('최대 일주일 조회만 가능합니다.');
		return false;
	}

	if(systemIds.length == 0){
		alert('조회대상을 선택하세요.');
		return;
	}
	
	var systemId = '\'' + systemIds.join('\',\'') + '\'';

	var url = '/failure/spec/failureSpec/excelDown?TITLE=고장이력_조회&HEADERS='
			+ headers + '&COLUMNS=' + columns + '&systemIds=' + systemId
			+ '&fromTime=' + fromTime + '&toTime=' + toTime + '&severity='
			+ $("#specAlarmType").val() + '&pageNm=spec&faultAlarmFilter=' + faultAlarmFilter.join(',');
	$(location).attr('href', encodeURI(url));
}