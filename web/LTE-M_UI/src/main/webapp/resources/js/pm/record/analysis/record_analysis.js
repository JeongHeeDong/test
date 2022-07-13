var classNames = {};
$(document).ready(function(){
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		getRecordTrendData(true);
	});
	
	$('#equipSelect').change(function(){
		$('#equipListText').val('');
		$('#equipListVal').val('');
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
		minDate: "+1D",
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
	
	$(window).click(function(e) {
		if($('#popMenu').css('display') == 'block'){
			$('#popMenu').css('display','none');
		}
	});
});

function getRecordTrendData(flag){
	var kpitext = $('#kpiSelect option:selected').text();
	
	var startDateTimeText = $('#start-date').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#startMinSelect option:selected').val();
	var endDateTimeText = $('#end-date').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#endMinSelect option:selected').val();
	var detailKpiSelect = '';
	
	var kpival = $('#kpiSelect option:selected').val();
	var equipList = $('#equipListVal').val();
	
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 12){
		alert('최대 12시간 조회만 가능합니다.');
		return false;
	}

	if(!flag) {
		classNames = {};
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
	}
	
	var requestData = {
			kpival : kpival,
			equipList : equipList,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			sortOption : columnSorting.sortInfo
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/record/analysis/record_analysis/getRecordTrendData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			var sort = document.querySelectorAll('#headerTr .sort');
			if(flag) {
				var keys = Object.keys(classNames);
				keys.map(function (v, i) {
					document.querySelector('#' + v).className = classNames[v];
				});
			} else {
				for(var i = 0; i < sort.length; i += 1) {
					sort[i].className = 'overTxt updown sort';
				}
			}

			createChart(data.getTrendData);
			
			createTd(data.getTrendData.gridData);
			
		},
		error:function(data){
			
		}
	});
}

function createTd(data){
	$('#dataGrid').empty();
	var number = 0;
	$(data).each(function(key,value){
		number++;
		
		$('#dataGrid').append(
			'<tr onmousedown="javascript:rightMenu.rightClick(event,this,\'10\')">'+
				'<td>'+number+'</td>'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.ATTEMPT+'</td>'+
				'<td>'+value.STD_ATT+'</td>'+
				'<td>'+value.ATT_RATE+'</td>'+
				'<td>'+value.SUCCESS+'</td>'+
				'<td>'+value.SUCC_RATE+'</td>'+
			'</tr>'
		);
	})
	
	if(number < 9){
		var loopCnt = 9 - number;
		for(var i=0; i<loopCnt; i++){
			$('#dataGrid').append(
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'
			);
		}
	}
}


function createChart(data){
	var tempTimelist = data.timeList;
	var dataList = [];
	var yAxis = [];
	var timelist = [];
	
	$.each(tempTimelist, function(i, v) {
		timelist.push(stringToTimestamp(v));
	});
	
	var ticInterval = 1;
	var maxCnt = 20;
	var timeCount = timelist.length;
	if(timeCount > maxCnt) {
		ticInterval = Math.ceil(timeCount / maxCnt);
	}
	
	$(data.trendData).each(function(key,value){
		
		var datalist = [];
		$(value.data).each(function(key,value){
			if(typeof value != 'number') value = value.replace(/,/gi,'');
			datalist.push(Number(value));
		});
		
		dataList.push(
				{
					name:value.name,
					type:value.type,
					data:datalist,
					yAxis : Number(value.yAxis),
					zIndex : Number(value.zIndex),
					tooltip:{
						valueSuffix:value.suffix
					}
				}
		);
	});
	
	dataList.sort(function(a,b){
		return  b.zIndex - a.zIndex;
	});
	
	yAxis = [{
					labels:{
						format : '{value}호(건)'
					},
					title: {
						text: '호(건)'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				{
					labels:{
						format : '{value}%'
					},
					title: {
						text: '%'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}],
					opposite: true
				}
			];
	
	$('#chartDiv').highcharts({
		chart:{
			marginBottom : 60,
			zoomType: 'x',
			events : {
				selection : function(event) {
					if (event.resetSelection) {
						try {
							setTimeout(function() {
								$('#chartDiv').highcharts().xAxis[0].update({
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
								$('#chartDiv').highcharts().xAxis[0].update({
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
			x: -20 //center
		},
		xAxis: {
			type: 'datetime',
			categories: timelist,
			tickInterval : ticInterval,
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%m-%d %H:%M',this.value);
				},
				y : 35
			}
		},
		yAxis: yAxis,
		tooltip: {
			shared: true,
			xDateFormat: '%m-%d %H:%M'
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


function excel_download(){
	
	var kpitext = $('#kpiSelect option:selected').text();
	var equiptext = $('#equipSelect option:selected').text();
	
	var startDateTimeText = $('#start-date').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#startMinSelect option:selected').val();
	var endDateTimeText = $('#end-date').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#endMinSelect option:selected').val();
	var detailKpiSelect = '';
	
	var kpival = $('#kpiSelect option:selected').val();
	var equipList = $('#equipListVal').val();
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	var url =  "/pm/record/analysis/record_analysis/excelDownRecord?kpival="+kpival+"&equipList="+equipList+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+
				"&equiptext=녹취저장&kpitext="+kpitext;
	$(location).attr('href', url);
}

function stringToTimestamp(yyyyMMddHHmm) {
	var year = parseInt(yyyyMMddHHmm.substring(0,4), 10);
	var month = parseInt(yyyyMMddHHmm.substring(4,6), 10) - 1;
	var day = parseInt(yyyyMMddHHmm.substring(6,8), 10);
	var hour = parseInt(yyyyMMddHHmm.substring(8,10), 10);
	var min = parseInt(yyyyMMddHHmm.substring(10,12), 10);
	return Date.UTC(year, month, day, hour, min, 0);
}

var rightMenu = {
		rightClick : function(event,obj,type){
			
			if(event.button == 2){
				$('#popMenu').css('display','block');
				var updateTime = $(obj).children(":eq(1)").text();
				updateTime = new Date(updateTime);
				rightMenu.stdTime = updateTime;
				rightMenu.obj = obj;
				rightMenu.type = type;
				
				var pos = abspos(event);
				$('#popMenu').css('left',(pos.x+10)+'px');
				$('#popMenu').css('top',(pos.y-90)+'px');
			}
		},
		type : '',
		obj : {},
		stdTime : '',
		pageType : '6'
}

function abspos(e){
	this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
	this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
	return this;
}