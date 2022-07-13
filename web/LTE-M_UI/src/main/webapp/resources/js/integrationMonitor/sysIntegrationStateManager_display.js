var params = {
	alarmFilter: "0"
};
var chartObj = {};
var lineId_slt = '';
var criCnt = 0;
var mjrCnt = 0;
var mnrCnt = 0;

var stateData = [];
var vmStateData = [];


$(document).ready(function(){
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
	
	// 호선 셀렉트박스
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	
	intervalSet();
	
	// 그리드 row click 이벤트
	$('#sysStateGrid').on('click', 'tr', function(e){
		getTrendData('', $(this).data('data'));
	});
	// 그리드 row click 이벤트
	$('#sysVmStateGrid').on('click', 'tr', function(e){
		getTrendData('vm', $(this).data('data'));
	});

	//thresholdMod Drag 지정 정의
	$( "#chartUp" ).draggable({'handle' : '#chartTitleBox'});
	$( "#chartUp" ).resizable({
		animate: true
	});
	$('#chartClose,#chartBg').on('click', function(e) {
		$('#chartBg').hide();
		$('#chartUp').hide(); 
	});
	
	$("#selectedLine").on('change',function(e){
//		getStateData();
		
		lineSelectSet();
	});
});

function lineSelectSet(){
	lineId_slt = $("#selectedLine").val();
	if (lineId_slt == '0' ){
		lineId_slt = '관제';
	}
	criCnt = 0;
	mjrCnt = 0;
	mnrCnt = 0;
	if ( vmStateData.length > 0 ){
		$("#sysVmStateGrid tr").each(function(i, row){
			if (lineId_slt == '' ){
				$(row).css('display','block');
				if ( $(row).find('i').attr('class').indexOf('critical') >0 ){
					criCnt+= 1;
				}else if ( $(row).find('i').attr('class').indexOf('major') >0 ){
					mjrCnt+= 1;
				}else if ( $(row).find('i').attr('class').indexOf('minor') >0 ){
					mnrCnt+= 1;
				}	
			}
			else {
				$(row).css('display','none');
				lineName_tbl = $(row).find('td').eq(1).html();
				if (lineName_tbl != null && lineName_tbl != undefined){
					if ( lineName_tbl.indexOf(lineId_slt) >= 0  || lineId_slt == ''  ){
						$(row).css('display','block');
						if ( $(row).find('i').attr('class').indexOf('critical') >0 ){
							criCnt+= 1;
						}else if ( $(row).find('i').attr('class').indexOf('major') >0 ){
							mjrCnt+= 1;
						}else if ( $(row).find('i').attr('class').indexOf('minor') >0 ){
							mnrCnt+= 1;
						}
					}
				}
			}
			
		})
	}
	
	if ( stateData.length > 0 ){
		$("#sysStateGrid tr").each(function(i, row){
			if (lineId_slt == '' ){
				$(row).css('display','block');
				if ( $(row).find('i').attr('class').indexOf('critical') >0 ){
					criCnt+= 1;
				}else if ( $(row).find('i').attr('class').indexOf('major') >0 ){
					mjrCnt+= 1;
				}else if ( $(row).find('i').attr('class').indexOf('minor') >0 ){
					mnrCnt+= 1;
				}	
			}
			else {
				$(row).css('display','none');
				lineName_tbl = $(row).find('td').eq(1).html();
				if (lineName_tbl != null && lineName_tbl != undefined){
					if ( lineName_tbl.indexOf(lineId_slt) >= 0  || lineId_slt == '' ){
						$(row).css('display','block');
						if ( $(row).find('i').attr('class').indexOf('critical') >0 ){
							criCnt+= 1;
						}else if ( $(row).find('i').attr('class').indexOf('major') >0 ){
							mjrCnt+= 1;
						}else if ( $(row).find('i').attr('class').indexOf('minor') >0 ){
							mnrCnt+= 1;
						}
					}
				}
			}
			
		})
	}
	
	
	$('#criticalCnt').text(criCnt);
	$('#majorCnt').text(mjrCnt);
	$('#minorCnt').text(mnrCnt);
}


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
	
	var filterLevel = $(':radio[name="alarmRadio"]:checked').val();
	var pageFlag = $('#pageFlag').val();
	var lineId = $('#selectedLine').val();
	
	if(filterLevel == 0){
		filterLevel = 4;
	}
	$.ajax({
		type : 'post',
		url: '/integration/monitor/sysstate/getStateData',
		dataType: "json",
		data : {
			filterLevel : filterLevel,
			pageFlag : pageFlag,
//			lineId : lineId
		},
		success: function (data) {
			var num = 0;
			var maxDateTime = data.getStateData.maxDateTime;
			stateData = data.getStateData.stateData;
			var maxDiskCnt = data.getStateData.maxDiskCnt;
			filterLevel = data.filterLevel;
			
			if(maxDiskCnt < 1) {
				$('#diskColumnTh').attr('colspan', 1);
			} else {
				$('#diskColumnTh').attr('colspan', maxDiskCnt);
			}
			
//			var vmStateDatas = data.getVmStateData.vmStateData;
//			var vmStateData = [];
//			$(vmStateDatas).each(function(i,srcObj){
//				if(vmStateData.length == 0){
//					vmStateData.push(srcObj)					
//				}else{
//					var vmcheck = false;
//					var removeCheck = false;
//					var removeIdx = 0;
//					$(vmStateData).each(function(i,destObj){
//						if (_.isMatch(destObj, {HOST_NAME: srcObj['HOST_NAME'], HOST_TYPE: srcObj['HOST_TYPE'], NODE: srcObj['NODE']}) ){
//							if(destObj['EVENT_TIME'] > srcObj['EVENT_TIME']){
//								vmcheck = true;
//							}else{
//								removeCheck = true
//								removeIdx = i
//							}
//						}
//					})
//					if (removeCheck){
//						vmStateData.splice(removeIdx, 1);
//					}
//					if (!vmcheck){
//						vmStateData.push(srcObj);
//					}
//				}
//			})
			vmStateData = data.getVmStateData.vmStateData;
			var vmMaxDateTime = data.getVmStateData.vmMaxDateTime;
			if (maxDateTime == '1970-01-01 09:00:00'){
				maxDateTime = vmMaxDateTime;
			}
			var vmMaxDiskCnt = data.getVmStateData.vmMaxDiskCnt;
			
			if(vmMaxDiskCnt < 1) {
				$('#vmDiskColumnTh').attr('colspan', 1);
			} else {
				$('#vmDiskColumnTh').attr('colspan', vmMaxDiskCnt);
			}
			
			$('#maxDateTime').text('감시시간 : '+maxDateTime);
			
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
			
			$(stateData).each(function(i,value){
				num++;
				
				cpuDiv = 'cpuDiv'+num;
				memDiv = 'memDiv'+num;
				var memSize = Number(value.MEM_SIZE)/1024;
				
//				var maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				
				var maxlevelclass = 'normal_state';
				if( Number(filterLevel) >= value.MAX_LEVEL ){
					maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				}
				
//				전체
//				if(value.MAX_LEVEL == 1){
//					criticalCount++;
//				}else if(value.MAX_LEVEL == 2){
//					majorCount++;
//				}else if(value.MAX_LEVEL == 3){
//					minorCount++;
//				}

				
				if(max_level > value.MAX_LEVEL ){
					max_level = value.MAX_LEVEL;
				}
				
				if( Number(filterLevel) >= Number(value.EVENT_TIME_LEVEL)){
					if(value.EVENT_TIME_LEVEL == 1){
						criticalCount++;
					}else if(value.EVENT_TIME_LEVEL == 2){
						majorCount++;
					}else if(value.EVENT_TIME_LEVEL == 3){
						minorCount++;
					}
				}
				
				if( Number(filterLevel) >= Number(value.CPU_LEVEL)){
					if(value.CPU_LEVEL == 1){
						criticalCount++;
					}else if(value.CPU_LEVEL == 2){
						majorCount++;
					}else if(value.CPU_LEVEL == 3){
						minorCount++;
					}
				}
				
				if( Number(filterLevel) >= Number(value.MEMORY_LEVEL)){
					if(value.MEMORY_LEVEL == 1){
						criticalCount++;
					}else if(value.MEMORY_LEVEL == 2){
						majorCount++;
					}else if(value.MEMORY_LEVEL == 3){
						minorCount++;
					}
				}
				
				if ( value.DISK_LEVEL.indexOf('^') >0 ){
					value.DISK_LEVEL = _.min(value.DISK_LEVEL.split('^'))
				}
				if( Number(filterLevel) >= Number(value.DISK_LEVEL)){
					if(value.DISK_LEVEL == 1){
						criticalCount++;
					}else if(value.DISK_LEVEL == 2){
						majorCount++;
					}else if(value.DISK_LEVEL == 3){
						minorCount++;
					}
				}
				
				var event_time = value.EVENT_TIME;
				var eventDateTime = new Date(event_time);
				var eventTimeStyle = "";
				
				if((nowDateTime.getTime() - eventDateTime.getTime())/1000/60 > 1440){
					event_time = "(미수집)<br>"+event_time;
					eventTimeStyle = 'style="color:#FF0000"'
				}
			
				$('#sysStateGrid').append(
					$('<tr style="cursor:pointer;">'+
						'<td class="stat"><i class="mu-icon alram '+maxlevelclass+'"></i></td>'+
						'<td>'+value.LINE_NAME+'</td>'+
						'<td>'+value.HOST_TYPE+'</td>'+
						'<td>'+value.HOST_NAME+'</td>'+
						'<td>'+value.CPU_EA+'</td>'+
						'<td>'+memSize.toFixed(1)+'</td>'+
						'<td '+eventTimeStyle+'>'+event_time+'</td>'+
						'<td style="display:none">'+value.HOST_IP+'</td>'+
						'<td style="text-align:center;"><div style="display: inline-flex;" id="'+cpuDiv+'"></div></td>'+
						'<td style="text-align:center;"><div style="display: inline-flex;" id="'+memDiv+'"></div></td>'+
						disk_td_progress(value.DISK_USED,value.DISK_LEVEL,value.DISK_COUNT,maxDiskCnt,filterLevel)+
					'</tr>').data('data', value)
				);
			   
				td_progress(value.CPU_RATE,value.CPU_LEVEL,cpuDiv,filterLevel);
				td_progress(value.MEMORY_USED,value.MEMORY_LEVEL,memDiv,filterLevel);
			});
			
			var emptyTd = '';
			var emptyTdCount = maxDiskCnt > 4 ? 4 : maxDiskCnt;
			for(var i =0; i< emptyTdCount; i++){
			   emptyTd += '<td></td>';
			}
			
			if(stateData.length < 3){
			   for(var index = 0; index<3-stateData.length; index++)
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
					   '<td></td>'+
					   emptyTd+
					   '</tr>'
			   )
			}
			
			
			// vm 장비 처리
			$('#sysVmStateGrid').empty();
			$(vmStateData).each(function(i,value){
				num++;
				
				cpuDiv = 'cpuDiv'+num;
				memDiv = 'memDiv'+num;
				
//				var maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
				
				var maxlevelclass = 'normal_state';
				if (value.HOST_NAME === 'SMetroTEST'){
					console.log(value);
					console.log(Number(filterLevel));
				}
				if( Number(filterLevel) >= value.MAX_LEVEL){
					maxlevelclass = value.MAX_LEVEL == 1?'critical':value.MAX_LEVEL ==2?'major':value.MAX_LEVEL ==3?'minor':'normal_state';
					
				}
//				if(value.MAX_LEVEL == 1){
//					criticalCount++;
//				}else if(value.MAX_LEVEL == 2){
//					majorCount++;
//				}else if(value.MAX_LEVEL == 3){
//					minorCount++;
//				}
				
				if(max_level > value.MAX_LEVEL){
					max_level = value.MAX_LEVEL;
				}
				
				if( Number(filterLevel) >= Number(value.EVENT_TIME_LEVEL)){
					if(value.EVENT_TIME_LEVEL == 1){
						criticalCount++;
					}else if(value.EVENT_TIME_LEVEL == 2){
						majorCount++;
					}else if(value.EVENT_TIME_LEVEL == 3){
						minorCount++;
					}
				}
				
				if( Number(filterLevel) >= Number(value.CPU_LEVEL)){
					if(value.CPU_LEVEL == 1){
						criticalCount++;
					}else if(value.CPU_LEVEL == 2){
						majorCount++;
					}else if(value.CPU_LEVEL == 3){
						minorCount++;
					}
				}
				
				if( Number(filterLevel) >= Number(value.MEMORY_LEVEL)){
					if(value.MEMORY_LEVEL == 1){
						criticalCount++;
					}else if(value.MEMORY_LEVEL == 2){
						majorCount++;
					}else if(value.MEMORY_LEVEL == 3){
						minorCount++;
					}
				}
				
				if ( value.DISK_LEVEL.indexOf('^') >0 ){
					value.DISK_LEVEL = _.min(value.DISK_LEVEL.split('^'))
				}
				if( Number(filterLevel) >= Number(value.DISK_LEVEL)){
					if(value.DISK_LEVEL == 1){
						criticalCount++;
					}else if(value.DISK_LEVEL == 2){
						majorCount++;
					}else if(value.DISK_LEVEL == 3){
						minorCount++;
					}
				}
				
				
				var event_time = value.EVENT_TIME;
				var eventDateTime = new Date(event_time);
				var eventTimeStyle = "";
				
				if((nowDateTime.getTime() - eventDateTime.getTime())/1000/60 > 1440){
					event_time = "(미수집)<br>"+event_time;
					eventTimeStyle = 'style="color:#FF0000"'
				}
			
				$('#sysVmStateGrid').append(
					$('<tr style="cursor:pointer;">'+
						'<td class="stat"><i class="mu-icon alram '+maxlevelclass+'"></i></td>'+   
						'<td>'+value.LINE_NAME+'</td>'+
						'<td>'+value.HOST_TYPE+'</td>'+
						'<td>'+value.HOST_NAME+'</td>'+
						'<td>'+value.NODE+'</td>'+
						'<td>'+value.ACT_SBY+'</td>'+
						'<td '+eventTimeStyle+'>'+event_time+'</td>'+
						'<td style="display:none">'+value.HOST_IP+'</td>'+
						'<td style="text-align:center;"><div style="display: inline-flex;" id="'+cpuDiv+'"></div></td>'+
						'<td style="text-align:center;"><div style="display: inline-flex;" id="'+memDiv+'"></div></td>'+
						disk_td_progress(value.DISK_USED,value.DISK_LEVEL,value.DISK_COUNT,vmMaxDiskCnt,filterLevel)+
					'</tr>').data('data', value)
				);
			   
				td_progress(value.CPU_RATE,value.CPU_LEVEL,cpuDiv,filterLevel);
				td_progress(value.MEMORY_USED,value.MEMORY_LEVEL,memDiv,filterLevel);
			});
			
			emptyTd = '';
			emptyTdCount = vmMaxDiskCnt > 4 ? 4 : vmMaxDiskCnt;
			for(var i =0; i< emptyTdCount; i++){
			   emptyTd += '<td></td>';
			}
			
			if(vmStateData.length < 3){
			   for(var index = 0; index<3-vmStateData.length; index++)
			   $('#sysVmStateGrid').append(
					   '<tr>'+
					   '<td></td>'+
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
			
			if(pageFlag == "2") {
			   $('#alarmTot').text('Total : '+(criticalCount+majorCount+minorCount));
			}
//			lineSelectSet();
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function disk_td_progress(rate,level,count,max_cnt,filterLevel){
	var disk_rate_list = rate.split("^");
	var disk_level_list = level.split("^");
	var index = 0;
	var tdList = [];
	var returnTag = '';
	var addStyle = '';
	var _height = '';
	
	if(disk_rate_list.length > 8){
		_height = ' style="height:130px;" ';
	} else if(disk_rate_list.length > 4) {
		_height = ' style="height:100px;" ';
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
			addStyle = 'style="margin-top: 25px;';
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
								'<div class="mu-pbar" style="width:'+rate+'%; '+color_level(level, filterLevel)+'>'+
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

function td_progress(rate, level,divId,filterLevel) {

	var pageFlag = $('#pageFlag').val();

	var emptyColor = pageFlag == '2' ? '#cfcfcf' : '#ffffff';
	var backgourndColor = pageFlag == '2' ? '' : 'rgba(255, 255, 255, 0.0)';
	var textColor = pageFlag == '2' ? '#000000' : '#000000';
	var fillColor = '';
	
	fillColor = '#7cd93d';
	if( Number(filterLevel) >= level ){
		if(level == 1){
			fillColor = '#ff0000';
		}else if(level == 2){
			fillColor = '#eb8206';
		}else if(level == 3){
			fillColor = '#ebe806';
		}else{
			fillColor = '#7cd93d';
		}
	}

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
			width : 95,
			height : 78,
			margin: [0, 0, 0, 0]
		},
		title : {
			text : rate+'%',
			align : 'center',
			verticalAlign : 'middle',
			style : {
				color : textColor,
				fontSize : '90%',
				display : 'block'
				
			}
		},
		plotOptions : {
			pie : {
				colors : [ fillColor, emptyColor ],
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
			innerSize : '85%',
			states: {
	            hover: {
	                enabled: false
	            }
	        },
			data : [ [ rate+'%', rate ], [ '', 100-rate ], ]
		} ]
	});
}

function color_level(level, filterLevel){
//	if(level == 1){
//		return 'background-color:#ff0000"';
//	}else if(level == 2){
//		return 'background-color:#eb8206"';
//	}else if(level == 3){
//		return 'background-color:#ebe806"';
//	}else{
//		return 'background-color:#7cd93d"';
//	}
	if( Number(filterLevel) >= level ){
		if(level == 1){
			return 'background-color:#ff0000"';
		}else if(level == 2){
			return 'background-color:#eb8206"';
		}else if(level == 3){
			return 'background-color:#ebe806"';
		}else{
			return 'background-color:#7cd93d"';
		}
	}else{
		return 'background-color:#7cd93d"';
	}
	
}


function chartPopupView(){
	$('#chartBg').show().fadeIn('fast');
	$('#chartUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#chartUp').height()-50)/2
	var width = ($(window).width() - $('#chartUp').width())/2
	
	$('#chartUp').css('left',width+'px');
	$('#chartUp').css('top',height+'px');
}

function getTrendData(type, data){
	if(_.isEmpty(data)) {
		return;
	}
	
	var equipName = data.HOST_NAME;
	if(data.NODE) {
		equipName += ' - ' + data.NODE
	}
	$('#trendTitle').text('시스템 상태 Trend(' + equipName + ')');
	
	var date = moment(data.EVENT_TIME, 'YYYY-MM-DD HH:mm:ss');
	var endTime = date.format("YYYYMMDDHHmmss");
	var startTime = date.add(-3, 'hours').format("YYYYMMDDHHmmss");
	
	var requestData = {
		host_name : data.HOST_NAME,
		event_time : data.EVENT_TIME,
		host_ip : data.HOST_IP,
		act_sby : data.ACT_SBY,
		startTime : startTime,
		endTime : endTime,
		pageFlag : $('#pageFlag').val(),
		node : data.NODE
	};
	
	requestData = JSON.stringify(requestData);
	
	var url = '/integration/monitor/sysstate/getTrendData';
	if(type === 'vm') {
		url = '/integration/monitor/sysstate/getVmTrendData';
	}
	$.ajax({
		type:'post',
		url:url,
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			chartPopupView();
			
			
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