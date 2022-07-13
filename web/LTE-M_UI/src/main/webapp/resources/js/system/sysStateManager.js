var params = {
	alarmFilter: "0"
};
var chartObj = {};

$(document).ready(function(){
	
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
	
	var host_name = '';
	var event_time = '';
	var host_ip = '';
	
	intervalSet();
});


function intervalSet(){
	var intervalId = setInterval("getStateData()", 1000*60);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	var pageFlag = $('#pageFlag').val();
	
	if(pageFlag == 1){
		if(!$('#repeatBtn').hasClass('mu-toggle-on')){
			$('#repeatBtn').addClass('mu-toggle-on');
		}
	}else{
		if($('#playBtn').hasClass('play')){
			$('#playBtn').removeClass('play');
			$('#playBtn').addClass('pause');
		}else{
			$('#playBtn').addClass('pause');
		}
	}
	
	getStateData();
}

function intervalDelete(){
	clearInterval($('#repeatBtn').val());
	$('#repeatBtn').attr('onclick','javascript:intervalSet()');
	var pageFlag = $('#pageFlag').val();
	
	if(pageFlag == 1){
		if($('#repeatBtn').hasClass('mu-toggle-on')){
			$('#repeatBtn').removeClass('mu-toggle-on');
		}
	}else{
		if($('#playBtn').hasClass('pause')){
			$('#playBtn').removeClass('pause');
			$('#playBtn').addClass('play');
		}else{
			$('#playBtn').addClass('play');
		}
	}
}

function getStateData(){
	
	var filterLevel = params.alarmFilter;
	var pageFlag = $('#pageFlag').val();
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysStateManager/getStateData',
		   dataType: "json",
		   data : {
			   filterLevel : 4,
			   pageFlag : pageFlag
		   },
		   success: function (data) {
			   var num = 0;
			   var maxDateTime = data.getStateData.maxDateTime;
			   var stateData = data.getStateData.stateData;
			   var maxDiskCnt = data.getStateData.maxDiskCnt;
			   
			   if(maxDiskCnt < 1) {
				   $('#diskColumnTh').attr('colspan', 1);
			   } else {
				   $('#diskColumnTh').attr('colspan', maxDiskCnt);
			   }
			   
			   $('#maxDateTime').text('감시시간 : ' + maxDateTime);
			   
			   var divObj = $('#sysStateGrid tr td div');
			   
			   for(var index = 0; index < divObj.size(); index++){
					if ($(divObj[index]).highcharts()) {
						$(divObj[index]).highcharts().destroy();
					} 
			   }
			   
			   $('#sysStateGrid').empty();
			   
			   var criticalCount = 0;
			   var majorCount = 0;
			   var minorCount = 0;
			   var max_level = 4;
			   
			   var cpuDiv = '';
			   var memDiv = '';
			   
			   var nowDateTime = new Date();
			   
			   var fristRowIndex = $('#rowIndex').val();
			   $(stateData).each(function(i,value){
				   num++;
				   if(_.isEmpty(fristRowIndex)) {
					   fristRowIndex = value.HOST_IP;
				   }
				   
				   cpuDiv = 'cpuDiv'+num;
				   memDiv = 'memDiv'+num;
				   var memSize = Number(value.MEM_SIZE)/1024;
				   
				   var maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				   if(value.MAX_LEVEL == 1){
					   criticalCount++;
				   }else if(value.MAX_LEVEL == 2){
					   majorCount++;
				   }else if(value.MAX_LEVEL == 3){
					   minorCount++;
				   }
				   
				   if(max_level > value.MAX_LEVEL){
					   max_level = value.MAX_LEVEL;
				   }
				   
				   var event_time = value.EVENT_TIME;
				   var eventDateTime = new Date(event_time);
				   var eventTimeStyle = "";
				   
				   if((nowDateTime.getTime() - eventDateTime.getTime())/1000/60 > 1440){
					   event_time = "(미수집)<br>"+event_time;
					   eventTimeStyle = 'style="color:#FF0000"'
					}
				   
				  var tdText = "'td'";
				   $('#sysStateGrid').append(
						'<tr onclick="javascript:getTrendData($(this).find('+tdText+').eq(6).text())" style="cursor:pointer;">'+
							'<td class="stat"><i class="mu-icon alram '+maxlevelclass+'"></i></td>'+   
							'<td>'+value.HOST_TYPE+'</td>'+
							'<td>'+value.HOST_NAME+'</td>'+	// 서버 상태 관리 페이지는 HOST_NAME을 보여줘야 함
							'<td>'+value.CPU_EA+'</td>'+
							'<td>'+memSize.toFixed(1)+'</td>'+
							'<td '+eventTimeStyle+'>'+event_time+'</td>'+
							'<td style="display:none">'+value.HOST_IP+'</td>'+
							'<td style="text-align:center;"><div style="display: inline-flex;" id="'+cpuDiv+'"></div></td>'+
							'<td style="text-align:center;"><div style="display: inline-flex;" id="'+memDiv+'"></div></td>'+
							disk_td_progress(value.DISK_USED,value.DISK_LEVEL,value.DISK_COUNT,maxDiskCnt)+
						'</tr>'
				   );
				   
				   td_progress(value.CPU_RATE,value.CPU_LEVEL,cpuDiv);
				   td_progress(value.MEMORY_USED,value.MEMORY_LEVEL,memDiv);
			   });
			   
			   var emptyTd = '';
			   for(var i =0; i< maxDiskCnt ; i++){
				   emptyTd += '<td></td>';
			   }
			   
			   if(stateData.length < 4){
				   for(var index = 0; index<4-stateData.length; index++)
				   $('#sysStateGrid').append(
						   '<tr>'+
						   '<td></td>'+
						   '<td></td>'+
						   '<td></td>'+
						   '<td></td>'+
						   '<td></td>'+
						   '<td></td>'+
						   '<td></td>'+
						   '<td></td>'+
						   emptyTd+
						   '</tr>'
				   )
			   }
			   
			   $('#audioAlarmLevel').val(max_level);
			   $('#criticalCnt').text(criticalCount);
			   $('#majorCnt').text(majorCount);
			   $('#minorCnt').text(minorCount);
			   
			   if(pageFlag == "2"){
				   $('#alarmTot').text('Total : '+(criticalCount+majorCount+minorCount));
			   }
			   
			   if(!_.isEmpty(fristRowIndex)) {
				   getTrendData(fristRowIndex);
			   }
			   
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function disk_td_progress(rate,level,count,max_cnt){
	var disk_rate_list = rate.split("^");
	var disk_level_list = level.split("^");
	var index = 0;
	var tdList = [];
	var returnTag = '';
	var addStyle = '';
	var _height = '';
	
	if(max_cnt > 8){
		_height = ' style="height:120px;" '
	}
	
	if(4 <= max_cnt){
		tdList = ['<td'+_height+'>','<td'+_height+'>','<td'+_height+'>','<td'+_height+'>'];
	}else{
		var tdList = ['<td'+_height+'>'];
		for(i=0; i < max_cnt-1; i++)
			tdList.push('<td'+_height+'>');
	}
	
	var j = 0;
	for(var i =0 ; i< count; i++){
		if(j == 4){
			j = 0;
			addStyle = 'style="margin-top: 30px;';
		}
		var rate = disk_rate_list[i].split("|")[1];
		var level = disk_level_list[i];
		var text = disk_rate_list[i].split("|")[0];
		var diskTotalUsed = Number(disk_rate_list[i].split("|")[2])/1024/1024;
		diskTotalUsed = diskTotalUsed.toFixed(2);
		
		if(1 > diskTotalUsed){
			diskTotalUsed = Number(disk_rate_list[i].split("|")[2])/1024;
			diskTotalUsed = diskTotalUsed.toFixed(2);
			diskTotalUsed = diskTotalUsed+'GB'
		}else{
			diskTotalUsed = diskTotalUsed+'TB';
		}
		
		
		var simpletext = text;
//		simpletext = simpletext==''?'':simpletext+':';
		simpletext = simpletext.replace(/(\s*)/g,"");
		
		if(21 < simpletext.length){
			simpletext = simpletext.substring(0,18)+'...';
		}
		tdList[j] = tdList[j]+'<div class="mu-progress" '+addStyle+'">'+
								'<div class="mu-pbar" style="width:'+rate+'%; '+color_level(level)+'>'+
								'<span class="cNum" title="'+text+'">'+rate+'%</span>'+
								'<span class="tNum" title="'+text+'">'+simpletext+'('+diskTotalUsed+')</span>'+
								'</div>'+
								'</div>';
		j++
	}
	
	if(count/ 4 > 1){
		var remainder = 4-(count%4);
		
		for(index = tdList.length - remainder; index < tdList.length; index++){
			tdList[index] = tdList[index]+'<div '+addStyle+';height:10px"></div>';
		}
	}
	
	for(var index in tdList){
		tdList[index] = tdList[index]+'</td>';
		returnTag += tdList[index];
	}
	
	return returnTag;
}

function td_progress(rate, level,divId) {

	if($('#'+divId).highcharts()) $('#'+divId).highcharts().destroy();
	
	var pageFlag = $('#pageFlag').val();

	var emptyColor = pageFlag == '2' ? '#cfcfcf' : '#252525';
	var backgourndColor = pageFlag == '2' ? '' : '#3c3c3c';
	var textColor = pageFlag == '2' ? '#000000' : '#ffffff';
	var fillColor = '';
	
	if(level == 1){
		fillColor = '#ff0000';
	}else if(level == 2){
		fillColor = '#eb8206';
	}else if(level == 3){
		fillColor = '#ebe806';
	}else{
		fillColor = '#7cd93d';
	}

	Highcharts.getOptions().plotOptions.pie.colors = (function() {
		var colors = [ fillColor, emptyColor ]

		return colors;
	}());

	$('#'+divId).highcharts({
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		credits : {
			enabled : false
		},
		chart : {
			backgroundColor : backgourndColor,
			width : 110,
			height : 93,
			margin: [0, 0, 0, 0]
		},
		title : {
			text : rate+'%',
			align : 'center',
			verticalAlign : 'middle',
			style : {
				color : textColor,
				fontSize : '100%',
				display : 'block'
				
			}
		},
		plotOptions : {
			pie : {
				dataLabels : {
					enabled : false
				},
				startAngle : 0,
				endAngle : 360,
				center : [ '50%', '50%' ],
				borderWidth : 0
			}
		},
		tooltip : {
			enabled : false
		},
		series : [ {
			type : 'pie',
			innerSize : '80%',
			states: {
	            hover: {
	                enabled: false
	            }
	        },
			data : [ [ rate+'%', rate ], [ '', 100-rate ], ]
		} ]
	});
}

function color_level(level){
	if(level == 1){
		return 'background-color:#ff0000"';
	}else if(level == 2){
		return 'background-color:#eb8206"';
	}else if(level == 3){
		return 'background-color:#ebe806"';
	}else{
		return 'background-color:#7cd93d"';
	}
}

function getTrendData(rowIndex){
	
//	var host_name = '';
//	var event_time = '';
//	var host_ip = '';
	
	if(rowIndex != 9999){
		
		$('#rowIndex').val(rowIndex);
		var o;
		var rows = $('#sysStateGrid').children('tr');
		
		for (var i = 0; i < rows.length; i++ ) {
			var row = rows[i];
			
			if(rowIndex == $(row).find('td').eq(6).text()){
				o = row;
				break;
			}
		}
		
		host_name = $(o).children(":eq(2)").text();
		event_time = $(o).children(":eq(5)").text();
//		host_ip = "'"+$(o).children(":eq(6)").text()+"'";
		host_ip = $(o).children(":eq(6)").text();
		
		$('#trendTitle').text('시스템 상태 Trend('+host_name+')');
		
	}else{
//		event_time = $('#maxDateTime').text().replace('감시시간 : ', "");
//		$('#trendTitle').text('시스템 상태 Trend(전체)');
//		
//		var rows = $('#sysStateGrid').children('tr');
//		
//		for (var i = 0; i < rows.length; i++ ) {
//			var row = rows[i];
//			host_ip += "'"+$(row).find('td').eq(6).text()+"',";
//		}
//		
//		if(host_ip != ''){
//			host_ip = host_ip.slice(0,-1);
//		}
	}

	var date = moment(event_time, 'YYYY-MM-DD HH:mm:ss');
	var endTime = date.format("YYYYMMDDHHmmss");
	var startTime = date.add(-3, 'hours').format("YYYYMMDDHHmmss");
	
	var date = new Date(event_time);
	var startTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-180,date.getSeconds()).format("yyyyMMddHHmmss");
	
	var requestData = {
		host_name : host_name,
		event_time : event_time,
		host_ip : host_ip,
		startTime : startTime,
		endTime : date.format("yyyyMMddHHmmss"),
		pageFlag : $('#pageFlag').val()
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/system/sysStateManager/getTrendData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			//console.log(data);
			var cpuSeriesData = [];
			var memorySeriesData = [];
			var diskSeriesData = [];

			// 날짜형식 변환
			var timeList = [];
			$.each(data.getTrendData.timeList, function(timeIdx, timeStr) {
				// 한국시간  +9시간 해줌.
				timeList.push(Number(moment(timeStr, 'YYYYMMDDHHmmss').format('x')) + (9 * 60 * 60 * 1000));
			});

			// cpu, memory 차트 데이터 생성
			$.each(data.getTrendData.host_name_list, function(i, hostName) {
				var _cpuDataList = [];
				var _memoryDataList = [];
				$.each(timeList, function(timeIdx, time) {
					_cpuDataList.push([time, data.getTrendData.cpu_data_map[hostName][timeIdx]]);
					_memoryDataList.push([time, data.getTrendData.memory_data_map[hostName][timeIdx]]);
				});
				cpuSeriesData.push({
					name: hostName,
					data: _cpuDataList,
					marker: {
						symbol: 'circle'
					}
				});
				memorySeriesData.push({
					name: hostName,
					data: _memoryDataList,
					marker: {
						symbol: 'circle'
					}
				});
			});
			// disk 차트 데이터 생성
			$.each(data.getTrendData.disk_name_list, function(i, diskName) {
				var _diskDataList = [];
				$.each(timeList, function(timeIdx, time) {
					_diskDataList.push([time, data.getTrendData.disk_data_map[diskName][timeIdx]]);
				});
				diskSeriesData.push({
					name: diskName,
					data: _diskDataList,
					marker: {
						symbol: 'circle'
					}
				});
			});
			
			createChart(cpuSeriesData,'cpu_chart','CPU 사용율(%)');
			createChart(memorySeriesData,'memory_chart','Memory 사용율(%)');
			createChart(diskSeriesData,'disk_chart','Disk 사용율(%)');
			
			if($('#alarmBtn').hasClass('mu-toggle-on')){
				audioFunction.audioPuse();
				audioFunction.audioPlay();
			}
		},
		error:function(data){
			
		}
	});
}

function createChart(seriesData, id, title){

	try {
		chartObj[id].destroy();
	} catch(e) {}

	var chartOptions = {
		chart:{
			zoomType: 'x'
		},
		credits: {
			enabled: false
		},
		title: {
			text: title,
			x: -20 //center
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				millisecond: '%H:%M:%S',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%Y-%m-%d',
				week: '%Y-%m / %e',
				month: '%Y-%m',
				year: '%Y'
			}
		},
		yAxis: {
			title: {
				text: '사용률 (%)'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			max: 100
		},
		tooltip: {
			valueSuffix: '%',
			shared: true,
			dateTimeLabelFormats: {
				millisecond: '%Y-%m-%d %H:%M:%S',
				second: '%Y-%m-%d %H:%M:%S',
				minute: '%Y-%m-%d %H:%M',
				hour: '%Y-%m-%d %H:%M',
				day: '%Y-%m-%d',
				week: '%Y-%m / %e',
				month: '%Y-%m',
				year: '%Y'
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0,
			labelFormatter: function () {
				var simpletext = this.name;

				if(21 < simpletext.length){
					simpletext = simpletext.substring(0,18)+'...';
				}

				return simpletext;
			}
		},
		plotOptions:{
			line: {
				marker: {
//					enabled: false
				}
			}
		},
		series: seriesData
	};
	if(id === 'cpu_chart' || id === 'memory_chart') {
		chartOptions.legend.enabled = false;
	}

	chartObj[id] = Highcharts.chart(id, chartOptions);
}

function alarmSound(){
	
	if($('#alarmBtn').hasClass('mu-toggle-on')){
		$('#alarmBtn').removeClass('mu-toggle-on');
		audioFunction.audioPuse();
	}else{
		$('#alarmBtn').addClass('mu-toggle-on');
		audioFunction.audioPuse();
		audioFunction.audioPlay();
	}
}

function filterSaveSearch(flag,filterLevel){
	
	params.alarmFilter = filterLevel;
	$('#rowIndex').val(9999);
	getStateData();
}