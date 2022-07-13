$(document).ready(function(){
	$("#popTrendWindow").draggable({'handle' : '#popTrendTitle'});
	$("#popTrendWindow").resizable();
	
	$("#popTrendWindow").resize(function(){
		
		height = $("#popTrendWindow").height()*0.746;
		width = $("#chartDiv").width();
		$("#chartDiv").highcharts().setSize(width, height, doAnimation = false);
	})
	
	$('#popTrendClose').on('click',function(e){
		$('#popTrendWindow').fadeOut();
	});
	
	$('#startDate').datepicker({
		dateFormat: 'yy-mm-dd',
		onClose: function( selectedDate ) {
	        $( "#endDate" ).datepicker( "option", "minDate", selectedDate );
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
	
	$('#endDate').datepicker({
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
	
	$('#startDateBtn').on('click',function(e){
		$('#startDate').datepicker("show");
	});
	
	
	$('#endDateBtn').on('click',function(e){
		$('#endDate').datepicker("show");
	});
});

function popTrendView(){
	
	var height = (screen.height - $('#popTrendWindow').height()-100)/2
	var width = (screen.width - $('#popTrendWindow').width())/2
	
	$('#popTrendWindow').css('left',width+'px');
	$('#popTrendWindow').css('top',height+'px');
	
	$('#popTrendWindow').show().fadeIn('fast');
	
	var endYear = rightMenu.stdTime.format("yyyy");
	var endMonth = rightMenu.stdTime.format("MM");
	var endDate = rightMenu.stdTime.format("dd");
	var endHour = rightMenu.stdTime.format("HH");
	var endMin = rightMenu.stdTime.format("mm");
	
	var date = new Date(rightMenu.stdTime.getTime() - 1000*60*60*3);
	
	var startYear = date.format("yyyy");
	var startMonth = date.format("MM");
	var startDate = date.format("dd");
	var startHour = date.format("HH");
	var startMin = date.format("mm");
	
	$('#endDate').val(endYear+"-"+endMonth+"-"+endDate);
	$('#startDate').val(startYear+"-"+startMonth+"-"+startDate);
	
	$('#startHourSelect').val(startHour).attr("selected","selected");
	$('#startMinSelect').val(startMin).attr("selected","selected");
	
	$('#endHourSelect').val(endHour).attr("selected","selected");
	$('#endMinSelect').val(endMin).attr("selected","selected");
	
	if(rightMenu.pageType == 1 && (rightMenu.type == 1 || rightMenu.type == 2 || rightMenu.type == 3)){
		// 기지국 감시
		if(rightMenu.equipType == 3) $('#popTrendTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(1)").text()+"("+$(rightMenu.obj).children(":eq(2)").text()+")");
		else $('#popTrendTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(1)").text());
		if(rightMenu.type == 3) {
			setKpiSelect(99,'kpiSelect','kpiDiv',1,'');
			$('#kpiDiv').css('display','');
		} else {
			$('#kpiDiv').css('display','none');
		}
	}else if(rightMenu.pageType == 5) {
		// 녹취저장 감시
		$('#popTrendTitleText').text("품질 Trend : "+$(rightMenu.obj).children(":eq(0)").text());
		$('#kpiDiv').css('display','none');
	}else{
		// 주제어장치 감시
		$('#popTrendTitleText').text("품질 Trend : "+$(rightMenu.obj).children(":eq(0)").text());
		$('#kpiDiv').css('display','');
		setKpiSelect(rightMenu.type,'kpiSelect','kpiDiv',0, rightMenu.typetext);
	}
	
	getPopTrendData();
}

function getPopTrendData(){
	
	var obj = rightMenu.obj;
	var equip_name = '';
	var equip_id = '';
	var getDataUrl = '';
	var ru_cuid = '';
	var equipType = '';
	
	
	if(rightMenu.pageType == 1){
		equip_name = $(obj).children(":eq(0)").text();
		equip_id = $(obj).children(":eq(1)").text();
		ru_cuid = rightMenu.type == 1?$(obj).children(":eq(3)").text():'';
		equipType = rightMenu.equipType;
		getDataUrl = '/pm/monitor/getPopTrendData';
	}else if(rightMenu.pageType == 5){
		equip_name = $(obj).children(":eq(0)").text();
		equip_id = $(obj).children(":eq(1)").text();
		getDataUrl = '/pm/monitor/getPopRecordTrendData';
	}else{
		equip_name = $(obj).children(":eq(0)").text();
		equip_id = $(obj).children(":eq(1)").text();
		getDataUrl = '/pm/monitor/getPopEpcTrendData';
	}
	
	var startDateTimeText = $('#startDate').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#startMinSelect option:selected').val();
	var endDateTimeText = $('#endDate').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#endMinSelect option:selected').val();
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 12){
		alert('최대 12시간 조회만 가능합니다.');
		return false;
	}
	
	var requestData = {
			name : equip_name,
			equip_id : equip_id,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			ru_cuid : ru_cuid,
			equipType : equipType,
			flag : rightMenu.type,
			kpi : $('#kpiSelect option:selected').val()
	}
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url : getDataUrl,
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			createChart(data.getTrendData);
			
			if($('#popTrendFirstView').val() == 1){
				var height = (screen.height - $('#popTrendWindow').height()-100)/2
				var width = (screen.width - $('#popTrendWindow').width())/2
				$('#popTrendWindow').css('left',width+'px');
				$('#popTrendWindow').css('top',height+'px');
				
				$('#popTrendFirstView').val(0);
			}
		},
		error:function(data){
			
		}
	});
}


function createChart(data){
	var tempTimelist = data.timeList
	var dataList = [];
	var yAxis = [];
	var timelist = [];
	
	$.each(tempTimelist, function(i, v) {
		timelist.push(stringToTimestamp(v));
	});

	var ticInterval = 1;
    var maxCnt = 10;
	var timeCount = timelist.length;
    if(timeCount > maxCnt) {
    	ticInterval = Math.ceil(timeCount / maxCnt);
    }
	
	$(data.trendData).each(function(key,value){
		var datalist = [];
		$(value.data).each(function(key,value){
			if(typeof(value) != 'number')
				value = value.replace(/,/gi,'');
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
	
	if(rightMenu.pageType == 1 && rightMenu.type == 2){
		yAxis = [{
			    	labels:{
			    		format : '{value}'
			    	},
			        title: {
			            text: 'KByte'
			        },
			        plotLines: [{
			            value: 0,
			            width: 1,
			            color: '#808080'
			        }],
			        opposite: true,
			        min : 0
			    },
			    {
			    	labels:{
			    		format : '{value}'
			    	},
			        title: {
			            text: 'KBps'
			        },
			        plotLines: [{
			            value: 0,
			            width: 1,
			            color: '#808080'
			        }]
			    }
			];
	}else{
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
	}
	
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
            x: -20 // center
        },
        xAxis: {
        	type: 'datetime',
            categories: timelist,
            tickInterval : ticInterval,
            labels: {
            	formatter: function() {
					return Highcharts.dateFormat('%H:%M',this.value);
				},
                y : 35
            }
        },
        yAxis: yAxis,
        tooltip: {
        	shared: true,
        	xDateFormat: '%H:%M'
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