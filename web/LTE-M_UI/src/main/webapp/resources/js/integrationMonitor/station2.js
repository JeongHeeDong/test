var STATION_MONITOR = {
		params : {},
		monitorTime : '',
		tabFlag : false,
		tabStationNm : ''
};

$(document).ready(function () {
	//$(".titleWrap").css('display','none');

	var alarmVolumes = getAlarmVolume();
	//가청 오디오 세팅
	audioFile.criticalaudio.src='/criticalAlarm';
	audioFile.criticalaudio.load();
	audioFile.criticalaudio.volume = alarmVolumes.P_CRITICAL_VOLUME/100;

	audioFile.majoraudio.src='/majorAlarm';
	audioFile.majoraudio.load();
	audioFile.majoraudio.volume = alarmVolumes.P_MAJOR_VOLUME/100;

	audioFile.minoraudio.src='/minorAlarm';
	audioFile.minoraudio.load();
	audioFile.minoraudio.volume = alarmVolumes.P_MINOR_VOLUME/100;

	//가청, 감시 ON
	$(".top-buttons").addClass("mu-toggle-on");
	
	STATION_MONITOR.params.stationId = 9999;
	STATION_MONITOR.params.filterLevel = 0;
	STATION_MONITOR.tabStationId = 9999;
	STATION_MONITOR.tabStationNm = '';
	
//	$('.stationTbl > table > thead > tr > th').click(function () {
//		STATION_MONITOR.tabFlag = true;
//		getStationData(this);
//	});
	
	$('.sybway-station > li').click(function () {
		STATION_MONITOR.tabFlag = true;
		getStationData(this);
	});
	
	$("#excelExportBtn").click(function () {
		excel_download();
	});
	
	//tab 기능 초기화
	tabs();
	$("ul.mu-tab li").click(function () {
		$("ul.mu-tab li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).show();
		
		if(activeTab == 'tab1') {
			STATION_MONITOR.tabStationId = 9999;
			STATION_MONITOR.tabStationNm = '';
		} else {
			STATION_MONITOR.tabStationId = $("#stationName > a").data('id');
			STATION_MONITOR.tabStationNm = $("#stationName > a").text();
		}
		
		tabs();
	});
	
	$('#stationGridAllThead > thead > tr, #stationGridThead > thead > tr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#'+$(this).parent().parent().parent().attr('id'));
		getStationData();
	});
	
	$(".tab_content").on("click", "tr.trend_popup_data", function (event) {
		var data = $(this).data('data');
		
		STATION_MONITOR.params.duId = data.DU_ID;
		STATION_MONITOR.params.ruId = data.RU_CUID;
		STATION_MONITOR.params.stationId = data.STATION_ID;
		STATION_MONITOR.params.duName = data.DU_NAME;
		STATION_MONITOR.params.ruName = data.RU_NAME;
		STATION_MONITOR.params.stationName = data.STATION_NAME;

		$("#start-date").val('');
		$("#end-date").val('');
		
		trendCall();
		event.stopPropagation();
	});
	
	datepickerSetting();
	//get MonitorTime -> get Data
	intervalSet();
	
	setInterval(function() {
		var now = new Date();
		var hour = now.getHours();
		var min = now.getMinutes();
		
		if((hour+"").length < 2){
			hour="0"+hour;      
		}
		if((min+"").length < 2){
			min="0"+min;      
		}

		if(hour+":"+min == "00:00") {
			location.reload(true);
		}
		
	}, 60000);

	// 품질 Trend 검색 버튼 이벤트
	$('#trendRequest').on('click', function(e) {
		trendCall();
	});
	
	setEvent();
});

function setEvent() {
		
	$('.sybway-station > li').on({
		mousemove: function(e) {
			stationMouseOver($(this), e);
		},
		mouseout: function(e) {
			stationMouseOut($(this), e);
		}
	});
}

function stationMouseOver($station, e) {
	var data = $station.data('data');
	
	var $tooltip = $('.Q-Tooltip');

	if(data) {
		
		var title = data.STATION_NAME;
		var html = [];
		html.push('<div class="mu-tooltip" style="min-width:180px;">');
		html.push('<div style="clear:left;">');
		html.push('<div class="mu-tooltip-header">' + title + '</div>');
		
		var arr;
		
		arr = [
			{name: "증가율", val: data.ATT_RATE, level: data.ATT_RATE_LEVEL},
			{name: "소통율", val: data.RRC_RATE, level: data.RRC_RATE_LEVEL},
			{name: "완료율", val: data.ANSWER_RATE, level: data.ANSWER_RATE_LEVEL},
			{name: "절단율", val: data.CD_RATE, level: data.CD_RATE_LEVEL}
		];
		
		html.push(getTooltipItem('', arr));
		html.push('</div>');
		html.push(getTooltipAlarm('알람등급(성능)', data.LEVEL));
		html.push('</div>');
		
		$tooltip.get(0).innerHTML = html.join('');
		$tooltip.show();
	}

	var tooltipWidth = e.clientX + $tooltip.width() + 15;
	var tooltipHeight = e.clientY + $tooltip.height() + 15;

	if(tooltipWidth > document.body.clientWidth) {
		$tooltip.css("left", getX(e) - 20 - $tooltip.width() + 5);
	} else {
		$tooltip.css("left", getX(e) + 5);
	}
	if(tooltipHeight > document.body.clientHeight) {
		$tooltip.css("top", getY(e) - 20 - $tooltip.height() + 5);
	} else {
		$tooltip.css("top", getY(e) + 5);
	}
	
}

function getX(event) {// left position
	if (event.pageX) {
		return event.pageX;
		//return event.pageX - (document.body.scrollLeft || document.documentElement.scrollLeft);
	} else {
		return event.clientX;
	}
}

function getY(event) { // top position
	if (event.pageY) {
		return event.pageY;
		//return event.pageY - (document.body.scrollTop || document.documentElement.scrollTop);
	} else {
		return event.clientY;
	}
}

function getTooltipAlarm(title, level) {
	var html = [];
	html.push('<div class="mu-tooltip-inner" style="clear:left;">');
	html.push('	<div class="tit">' + title + '</div>');
	html.push('	<table class="mu-formbox mobileLoca">');
	html.push('		<tr class="rating">');
	if(level === 1) {
		html.push('			<td><span class="critical">Critical</td>');
	} else if(level === 2) {
		html.push('			<td><span class="major">Major</td>');
	} else if(level === 3) {
		html.push('			<td><span class="minor">Minor</td>');
	} else {
		html.push('			<td><span class="normal">Normal</td>');
	}
	html.push('		</tr>');
	html.push('	</table>');
	html.push('</div>');

	return html.join('');
}

function getTooltipItem(title, arr) {
	var html = [];
	html.push('<div class="mu-tooltip-inner">');
	if(title) {
		html.push('	<div class="tit">' + title + '</div>');
	}
	html.push('	<table class="mu-formbox">');
	html.push('		<colgroup>');
	html.push('			<col width="50%" />');
	html.push('			<col width="50%" />');
	html.push('		</colgroup>');
	html.push('		<tbody>');
	$.each(arr, function(i, o) {
		var alarmStyle = '';
		if(o.level === 1) {
			alarmStyle = ' style="color:red;"';
		} else if(o.level === 2) {
			alarmStyle = ' style="color:orange;"';
		} else if(o.level === 3) {
			alarmStyle = ' style="color:yellow;"';
		}
		html.push('			<tr>');
		html.push('				<th>' + o.name + '</th>');
		html.push('				<td' + alarmStyle + '>' + o.val + '</td>');
		html.push('			</tr>');
	});
	html.push('		</tbody>');
	html.push('	</table>');
	html.push('</div>');
	
	return html.join('');
}

function stationMouseOut($serverGroup, e) {
	var $tooltip = $('.Q-Tooltip');
	$tooltip.empty();
	$tooltip.hide();
}

function intervalSet(){
	var intervalId = setInterval("getMonitorTime()", 1000*30);
	$('#watchBtn').val(intervalId);
	$('#watchBtn').attr('onclick','javascript:intervalDelete()');
	
	if(!$('#watchBtn').hasClass('mu-toggle-on')){
		$('#watchBtn').addClass('mu-toggle-on');
	}
	
	getMonitorTime();
}

function intervalDelete(){
	clearInterval($('#watchBtn').val());
	$('#watchBtn').attr('onclick','javascript:intervalSet()');
	
	if($('#watchBtn').hasClass('mu-toggle-on')){
		$('#watchBtn').removeClass('mu-toggle-on');
	}
}

function alarmSound(){
	
	if($('#soundBtn').hasClass('mu-toggle-on')){
		$('#soundBtn').removeClass('mu-toggle-on');
		audioFunction.audioPuse();
	}else{
		$('#soundBtn').addClass('mu-toggle-on');
		audioFunction.audioPuse();
		audioFunction.audioPlay();
	}
}

function getMonitorTime() {
	$.ajax({
		type: 'post',
		url: '/integration/monitor/station/monitorTime',
		dataType: "json",
		success: function (data) {
			if(STATION_MONITOR.monitorTime !== data.MONITOR_TIME) {
				STATION_MONITOR.monitorTime = data.MONITOR_TIME;
				$('.timeWrap').text("감시시간 : " + STATION_MONITOR.monitorTime);
				STATION_MONITOR.params.eventTime = STATION_MONITOR.monitorTime;
				
				getStationInfoData();
				getTotData();
			}
		},
		error: function () {
			//alert('에러발생');
		}
	});
}

function getTotData() {
	$.ajax({
		type: 'post',
		url: '/integration/monitor/station/getTotData',
		dataType: "json",
		data: {eventTime : STATION_MONITOR.monitorTime},
		success: function (data) {
			$('tbody[name=tot_performance]').empty();
			
			var totPerferm = '<tr>'+
							'<td>시도호/기준시도호</td>'+
							'<td>'+data.ATTEMPT+'/'+data.STD_ATTEMPT+'</td>'+
							'<td>소통호</td>'+
							'<td>'+data.RRC+'</td>'+
							'<td>완료호</td>'+
							'<td>'+data.ANSWER+'</td>'+
							'<td>절단호</td>'+
							'<td>'+data.CD+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>시도호 증감율</td>'+
							'<td>'+data.ATT_RATE+'%</td>'+
							'<td>소통율</td>'+
							'<td>'+data.RRC_RATE+'%</td>'+
							'<td>완료율</td>'+
							'<td>'+data.ANSWER_RATE+'%</td>'+
							'<td>절단율</td>'+
							'<td>'+data.CD_RATE+'%</td>'+
						'</tr>'
			$('tbody[name=tot_performance]').append(totPerferm);
			
			getStationTotData();
			getStationData();
		},
		error: function () {
			//alert('에러발생');
		}
	});
}

function getStationInfoData() {
	$.ajax({
		type: 'post',
		url: '/integration/monitor/station/getStationInfoData',
		dataType: "json",
		success: function (data) {
			var stationInfoData = data.stationInfoData;
			
			$.each($('.sybway-station > li'), function(i,val) {
				var stationText = $(val).text();
				$.each(stationInfoData, function(i, _val) {
					if(stationText.match(_val.STATION_NAME)) {
						$(val).data('id',_val.STATION_ID);
						$(val).data('name',_val.STATION_NAME);
						return false;
					}
				});
			});
			
//			$.each($('.stationTbl > table > thead > tr > th'), function(i,val) {
//				var stationText = $(val).text();
//				$.each(stationInfoData, function(i, _val) {
//					if(stationText.match(_val.STATION_NAME)) {
//						$(val).data('id',_val.STATION_ID);
//						$(val).data('name',_val.STATION_NAME);
//						return false;
//					}
//				});
//			});
		},
		error: function () {
			//alert('에러발생');
		}
	});
}

function getStationTotData() {
	
	
	
	
	var requestData = {
			eventTime : STATION_MONITOR.monitorTime,
			filterLevel : STATION_MONITOR.params.filterLevel,
			stationId : STATION_MONITOR.tabStationId,
			sortOption : columnSorting.sortInfo
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/integration/monitor/station/getStationTotData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
//			$('#RRC_RATE, #ANSWER_RATE, #CD_RATE, #LEVEL').empty();
//			$('#RRC_RATE').append('<th scope="row">소통율</th>');
//			$('#ANSWER_RATE').append('<th scope="row">완료율</th>');
//			$('#CD_RATE').append('<th scope="row">절단율</th>');
//			$('#LEVEL').append('<th scope="row">알람등급</th>');
			
			$.each(data.stationTotData, function (i,val) {
//				console.log("id " + val.STATION_ID);
				var $subwayStationList = $(".sybway-station");
				
				var levelColor = "";
				
				if (val.LEVEL == 1) {
					levelColor = "red";
				} else if (val.LEVEL == 2) {
					levelColor = "orange";
				} else if (val.LEVEL == 3) {
					levelColor = "yellow";
				}
				
				$('li[name='+ val.STATION_ID+']').removeClass('yellow orange red').addClass(levelColor);
				$('li[name='+ val.STATION_ID+']').data("data", val);
				
//				$('#RRC_RATE').append('<td>'+val.RRC_RATE+'%</td>');
//				$('#ANSWER_RATE').append('<td>'+val.ANSWER_RATE+'%</td>');
//				$('#CD_RATE').append('<td>'+val.CD_RATE+'%</td>');
//				
//				var levelText = level_numberToText(val.LEVEL);
//				var leveldiv = '';
//				if('normal' == levelText) leveldiv = '';
//				else leveldiv = '<div class="alramClass '+levelText+'">'+levelText.toUpperCase()+'</div>';
//				
//				$('#LEVEL').append('<td>'+leveldiv+'</td>');
			});
		},
		error:function(data){
			
		}
	});
}

function getStationData(obj) {
	if(obj == 'undefined' || obj == null) {}
	else {
		//console.log($(obj).data('id'));
		STATION_MONITOR.tabStationId = $(obj).data('id');
		STATION_MONITOR.tabStationNm = $(obj).data('name');
		$("#stationName > a").text($(obj).data('name'));
		$("#stationName > a").data('id', $(obj).data('id'));
	}
	
	var requestData = {
			eventTime : STATION_MONITOR.monitorTime,
			filterLevel : STATION_MONITOR.params.filterLevel,
			stationId : STATION_MONITOR.tabStationId,
			sortOption : columnSorting.sortInfo
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/integration/monitor/station/getStationData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			var tbodyNm = "";
			var tabNm = "";
			if(STATION_MONITOR.tabStationId == 9999){
				tbodyNm = "stationGridAllBody tbody";
				tabNm = "tab1";
			} else{
				tbodyNm = "stationGridBody tbody";
				tabNm = "tab2";
			}
			
			$("#"+tbodyNm).empty();
			
			$(data.stationData).each(function (key, value) {
				var html = [];
				//html.push("<tr class='trend_popup_data' data-ruid='" + value.RU_CUID + "' data-duid='" + value.DU_ID + "' data-stationid='" + value.STATION_ID + "' data-stationname='" + value.STATION_NAME + "' style='cursor:pointer'>");
				html.push("<tr class='trend_popup_data' style='cursor:pointer' " + "id='tr_" + value.STATION_ID + "'>");
				// html.push("<td class='stat'><i class='mu-icon alram " + stat.toLowerCase() + "'></i></td>");
				html.push("<td class='stat' data-level="+value.AL_LV+"><i class='mu-icon alram " + value["AL_LV_NM"].toLowerCase() + "'></i></td>");
				html.push("<td align='center'>" + value.STATION_NAME + "</td>");
				html.push("<td align='center'>" + value.DU_NAME + "</td>");
				if(ruCellType === 'RU') {
					html.push("<td align='center'>" + value.RU_NAME + "</td>");
					html.push("<td align='center'>" + value.RU_CUID + "</td>");
				} else if(ruCellType === 'CELL') {
					html.push("<td align='center'>" + value.RU_CUID + "</td>");
				}
				html.push("<td align='right'>" + value.ATTEMPT + "</td>");
				html.push("<td align='right'>" + value.STD_ATTEMPT + "</td>");
				html.push("<td align='right'>" + value.ATT_RATE + "</td>");
				html.push("<td align='right'>" + value.RRC + "</td>");
				html.push("<td align='center'>" + value.RRC_RATE + "</td>");
				html.push("<td align='right'>"+value.ANSWER+"</td>");
				html.push("<td align='center'>"+value.ANSWER_RATE+"</td>");
				html.push("<td align='right'>" + value.CD + "</td>");
				html.push("<td align='center'>" + value.CD_RATE + "</td>");
				html.push("<td align='center'>" + value.EVENT_TIME + "</td>");
				html.push("</tr>");
				
				$("#"+tbodyNm).append($(html.join('\n')).data('data', value));
//				$('li[name='+ value.STATION_ID+']').data("data", value);
			});

			if($("#"+tbodyNm+" tr").length < 8) {
				$("#"+tabNm+" > div:first-child").removeClass("gridScrollT");
			} else {
				$("#"+tabNm+" > div:first-child").removeClass("gridScrollT");
				$("#"+tabNm+" > div:first-child").addClass("gridScrollT");
			}
			
			tabs();
			alarmCnt();
		},
		error:function(data){
			
		}
	});
}

function trendCall() {
	
	$(".du-trend").show();
	$("#divDialogBackground").show();
	
	var $endDate = $("#end-date");
	var $startDate = $("#start-date");
	
	if ($endDate.val() === null || $endDate.val() === undefined || $endDate.val() === "") {
		STATION_MONITOR.params.eventTime = STATION_MONITOR.monitorTime;
	} else {
		STATION_MONITOR.params.eventTime = $endDate.datepicker({
			dateFormat : 'yy-mm-dd'
		}).val() + " " + $("select[name=end-hour]").val() + ":"
				+ $("select[name=end-minute]").val() + ":00";
	}

	if ($startDate.val() === null || $startDate.val() === undefined || $startDate.val() === "") {
		STATION_MONITOR.params.startEventTime = "";
	} else {
		STATION_MONITOR.params.startEventTime = $startDate.datepicker({
			dateFormat : 'yy-mm-dd'
		}).val() + " " + $("select[name=start-hour]").val() + ":"
				+ $("select[name=start-minute]").val() + ":00";
	}

	var startDateTime = new Date(STATION_MONITOR.params.startEventTime).format("yyyy-MM-dd HH:mm");
	var endDateTime = new Date(STATION_MONITOR.params.eventTime).format("yyyy-MM-dd HH:mm");

	if ((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 1000 / 3600 < 0) {
		alert('조회 범위가 잘못되었습니다.');
		return false;
	} else if ((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 1000 / 3600 > 12) {
		alert('최대 12시간 조회만 가능합니다.');
		return false;
	}
	trendPop(STATION_MONITOR.params);
}

function trendPop(params) {

	popupDrag(".du-trend");

	$("#divDialogBackground, .chart-close").click(function(e){
		$("#divDialogBackground").hide();
		$(".du-trend").hide();		//'닫기'버튼을 클릭하면 레이어가 사라진다.
//		$('.chartWrap').empty();
		$('#chartWrap').html(""); 
		e.preventDefault();
	});

	$("select[name=trendAxis]").val(0);
	$.ajax({
		type: 'post',
		url: '/integration/monitor/station/trend',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(params),
		success: function (data) {
			data = data.stationQualityTrend;

			$("#start-date").datepicker("setDate", data.START_EVENT_TIME.substr(0,10));
			$("select[name=start-hour]").val(data.START_EVENT_TIME.substr(11,2));
			$("select[name=start-minute]").val(data.START_EVENT_TIME.substr(14,2));


			$("#end-date").datepicker("setDate", data.END_EVENT_TIME.substr(0,10));
			$("select[name=end-hour]").val(data.END_EVENT_TIME.substr(11,2));
			$("select[name=end-minute]").val(data.END_EVENT_TIME.substr(14,2));

			$("#trendRequest").data("duid", data.DU_ID);
			$("#trendRequest").data("ruid", data.RU_CUID);
			$("#trendRequest").data("stationid", params.stationId);

			if(ruCellType === 'RU') {
				$(".du-trend").find(".title").text("품질 Trend - 기지국 : " + params.duName + " / 중계기 : " + params.ruName + " / Cell : " + params.ruId);
			} else if(ruCellType === 'CELL') {
				$(".du-trend").find(".title").text("품질 Trend - 기지국 : " + params.duName + " / Cell : " + params.ruId);
			}

			var ticInterval = 1;
			var maxCnt = 8;
			var timeCount = data.CATEGORY.length;
			if(timeCount > maxCnt) {
				ticInterval = Math.ceil(timeCount / maxCnt);
			}

			$('#chartWrap').highcharts({
			//new Highcharts.Chart({
				chart: {
					//renderTo: 'chartWrap',
					height: 320,
					zoomType: 'x',
					events: {
						selection: function(event) {
							if (event.resetSelection) {
								try {
									setTimeout(function () {
										$('#chartWrap').highcharts().xAxis[0].update({
											tickInterval: ticInterval
										});
									}, 0);
								} catch (event) {
								}
							} else {
								var _ticInterval = 1;
								var _xCnt = event.xAxis[0].max - event.xAxis[0].min;
								if (_xCnt > maxCnt) {
									_ticInterval = Math.ceil(_xCnt / maxCnt);
								}
								try {
									setTimeout(function () {
										$('#chartWrap').highcharts().xAxis[0].update({
											tickInterval: _ticInterval
										});
									}, 0);
								} catch (event) {
								}
							}
						}
					}
				},
				credits: {
					enabled: false
				},
				title:{
					text:params.stationName
				},
				xAxis: [{
					categories: data.CATEGORY,
					tickInterval: ticInterval
				}],
				yAxis: [{
					min: 0,
					title: {
						text: '호',
						rotation: 0,
						style: {
							color: "#4572A6"
						}
					},
					labels: {
						format: '{value}',
						style: {
							color: "#4572A6"
						}
					},
					showEmpty: false
				}, {
					min: 0,
					max: 100,
					title: {
						text: '율',
						rotation: 0,
						style: {
							color: "red"
						}
					},
					labels: {
						format: '{value}',
						style: {
							color: "red"
						}
					},
					opposite: true,
					showEmpty: false
				}
				],
				tooltip: {
					shared: true
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					x: -260,
					y: -5,
					backgroundColor: '#FFFFFF',
					borderWidth: 0
				},
				plotOptions:{
					spline: {
						marker: {
							enabled: false
						}
					}
				},
				series: [{
					name: '시도호',
					type: 'column',
					yAxis: 0,
					data: data.ATTEMPTS,
					color: "#4572A6",
					tooltip: {
						valueSuffix: ''
					}

				}, {
					name: '완료율',
					type: 'spline',
					yAxis: 1,
					data: data.ANSWER_RATES,
					color: "red",
					dashStyle: 'shortdot',
					tooltip: {
						valueSuffix: ''
					}

				}, {
					name: '소통율',
					type: 'spline',
					yAxis: 1,
					data: data.RRC_RATES,
					color: "#E07400",
					tooltip: {
						valueSuffix: ''
					}
				}, {
					name: '절단율',
					type: 'spline',
					yAxis: 1,
					data: data.CD_RATES,
					color: "#86AB16",
					dashStyle: 'shortdot',
					tooltip: {
						valueSuffix: ''
					}

				}]
			});

		},
		error: function () {
			//alert('에러발생');
		}
	});
}

function popupDrag(target) {

	if (target == null || target == undefined)
		target = '';

	$(target + ".drag").draggable({
		handle: ".dragHandle",
		create: function(event,ui){
			$(this).css({"position":"absolute"});
		},
		start: function(event, ui) {
			$(this).css("zIndex", 100);
		},
		scroll: false,
		grid: [ 5, 5 ]
	});

	$(target + ".drag").css("zIndex", 100);

	$(target + '.drag').click(function () {
		$(this).addClass('top').removeClass('bottom');
		$(this).siblings().removeClass('top').addClass('bottom');
		var idx = $(this).css("zIndex");
		$(this).css("zIndex", Math.max(idx, 100));
	});
	$(target + ".resize").resizable({
		grid: 5
	});

}

function tabs() {
	if(!STATION_MONITOR.tabFlag) {
		$('#stationName').css('display', 'none');
	} else {
		$('#stationName').css('display', 'inline-block');
	}

	$(".tab_content").hide();

	$("ul.mu-tab li").removeClass("active");
	if(STATION_MONITOR.tabStationNm == '') {
		$(".tab_content:first").show();
		$("li[rel~='tab1']").addClass("active");
	} else {
		$(".tab_content:nth-child(2)").show();
		$("li[rel~='tab2']").addClass("active");
	}
}

//알람필터 설정
function filterSaveSearch(flag, filterLevel) {
	STATION_MONITOR.params.filterLevel = filterLevel;
	getStationInfoData();
	getTotData();
}
//level 숫자를 text로 변경
function level_numberToText(level) {
	var alarmLevelObj = {
			'1' : 'critical',
			'2' : 'major',
			'3' : 'minor',
			'4' : 'normal'
	};
	
	if(alarmLevelObj[level]) {
		return alarmLevelObj[level];
	} else {
		return level;
	}
}

function datepickerSetting() {

	$("#start-date").datepicker({
		dateFormat: 'yy/mm/dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월']
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	$('#end-date').datepicker({
		dateFormat: 'yy/mm/dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월']
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	$("#start-date-btn").on("click",function(e){
		var visible = $("#ui-datepicker-div").is(":visible");
		$("#start-date.hasDatepicker").css("position", "relative").css("zIndex", "9999");
		$("#start-date").datepicker(visible ? 'hide' : 'show');
	});


	$("#end-date-btn").on("click",function(e){
		var visible = $("#ui-datepicker-div").is(":visible");
		$("#end-date.hasDatepicker").css("position", "relative").css("zIndex", "9999");
		$("#end-date").datepicker(visible ? 'hide' : 'show');
	});

	for(var idx = 1; idx <= 24; idx+=1) {
		var h= idx < 10 ? "0" + idx : idx;
		var hour = h;
		$(".select-hour").append("<option value='"+h+"'>"+hour+"</option>");
	}

	for(var idx = 0; idx <= 59; idx+=1) {
		var m = idx < 10 ? "0" + idx : idx;
		var minute = m;
		$(".select-minute").append("<option value='"+m+"'>"+minute+"</option>");
	}
}

function alarmCnt () {
	$('#cntAllLevel1, #cntAllLevel2, #cntAllLevel3').text(0);
	var critical = 0, major = 0, minor = 0;
	var _level = 4, _minLevel = 4;
	
	$.each($('#stationGridAllBody tbody tr'), function (i, value) {
		_level = $(value).find('td:eq(0)').data('level');
		
		if(_level == 1) critical ++;
		else if(_level == 2) major ++;
		else if(_level == 3) minor ++;
		
		if(_minLevel > _level) _minLevel = _level;
	});
	
	$('#cntAllLevel1').text(critical);
	$('#cntAllLevel2').text(major);
	$('#cntAllLevel3').text(minor);
	
	$('#audioAlarmLevel').val(_minLevel);
	
	if($('#soundBtn').hasClass('mu-toggle-on')){
		audioFunction.audioPuse();
		audioFunction.audioPlay();
	}
}

function excel_download(){
    var headerList = [];
    var columnList = [];
    var headers;
    var columns;
	var tabNm = "";
	
	if(STATION_MONITOR.params.stationId == 9999){
		tabNm = "tab1";
	} else{
		tabNm = "tab2";
	}
    
	var i=0;
    $('#'+tabNm).each(function(){
        $(this).find('th').each(function(index,th){
            if($(th).css('display')!= 'none'){
                headerList[i] = $(th).text();
                columnList[i] = $(th).data("id");
                i++;
            }
        });
    });
    headers = headerList.join(",");
    columns = columnList.join(",");
    var params = {};
    
	params.eventTime = STATION_MONITOR.monitorTime;
	params.stationId = STATION_MONITOR.tabStationId;
	params.stationName = STATION_MONITOR.tabStationNm;
	params.title = "역사별통합감시";

	var url =
		"/integration/monitor/station/excelExport?eventTime=" + STATION_MONITOR.monitorTime
		+ "&stationId=" + params.stationId + "&stationName=" + params.stationName + "&title=" + params.title + "&headers=" + encodeURI(headers) + "&columns=" + columns;
	
	 $(location).attr('href', url);
}