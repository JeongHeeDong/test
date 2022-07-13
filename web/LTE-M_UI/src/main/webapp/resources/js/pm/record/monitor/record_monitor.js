var win;
var mainFilter = "";

$(document).ready(function() {
	
	win = window.top || window;
	
	if(win.name != "") {
		mainFilter = JSON.parse(win.name);
		win.name = "";
	}
	
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
	
	$('#observeSetClose, #observeSetCancle,#observeSetBg').on('click',function(e){
		$('#observeSetBg').fadeOut();
		$('#observeSetUp').fadeOut();
	});
	//observeSet Drag 지정 정의
	$( "#observeSetUp" ).draggable({'handle' : '#observeSetTitleBox'});
	$( "#observeSetUp" ).resizable({
		animate: true
	});
	
	setTimeout("intervalSet()", 500);
	
	$(window).click(function(e) {
		if($('#popMenu').css('display') == 'block') {
			$('#popMenu').css('display','none');
		}
	});
	
	var equipType;
	
	if (mainFilter != "") {
		equipType = getEquipType(mainFilter.equipType);
		if(equipType == '8') $('#equipSelect option:eq(1)').attr("selected","selected");
		else if(equipType == '9') $('#equipSelect option:eq(2)').attr("selected","selected");
		
		changeEquipType(equipType);
	}
	
	$('#equipSelect').change(function(){
		equipType = $('#equipSelect option:selected').val();
		changeEquipType(equipType);
	});
	
});

function intervalSet(){
	var intervalId = setInterval("getMaxDateTime()", 1000*30);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
	if($('#repeatIcon').hasClass('play')){
		$('#repeatIcon').removeClass('play');
		$('#repeatIcon').addClass('pause');
	}else{
		$('#repeatIcon').addClass('pause');
	}
	
	getMaxDateTime();
}

function intervalDelete(){
	clearInterval($('#repeatBtn').val());
	$('#repeatBtn').attr('onclick','javascript:intervalSet()');
	
	if($('#repeatIcon').hasClass('pause')){
		$('#repeatIcon').removeClass('pause');
		$('#repeatIcon').addClass('play');
	}else{
		$('#repeatIcon').addClass('play');
	}
	
	deleteAlarmInterval();
}
//최근 수집시간 get
function getMaxDateTime(){
	
	$.ajax({
		type:'post',
		url:'/pm/pm_monitor/record_monitor/getMaxDateTime',
		dataTpye:'json',
		success:function(data){
			
			$('#update_time').text("기준시간 : "+data.getMaxDateTime);
			
			var callRange = Number($('#call_monitor_range').val());
			var pttRange = Number($('#ptt_monitor_range').val());
			
			var callDateArray = headerTimeArray(data.getMaxDateTime, callRange);
			var pttDateArray = headerTimeArray(data.getMaxDateTime, pttRange);
			
			//==================== Call 서버 헤더 설정
			var callTimeTag = '';
			for(var i = 0; i < 4; i++){
				for(var tag in callDateArray){
					callTimeTag += callDateArray[tag];
				}
			}
			
			$('#callHead').empty();
			$('#callHead').append(
				'<tr>'+
					'<th rowspan="2" style="width:91px">장비명</th>' +
					'<th colspan="' + callRange + '">시도호</th>' +
					'<th colspan="' + callRange + '">성공호</th>' +
					'<th colspan="' + callRange + '">시도호증감율(%)</th>' +
					'<th colspan="' + callRange + '">성공율(%)</th>' +
				'</tr>'+
				'<tr>' +
				callTimeTag +
				'</tr>'
			);
			
			//==================== PTT 서버
			var pttTimeTag = '';
			for(var i = 0; i < 4 ; i++){
				for(var tag in pttDateArray){
					pttTimeTag += pttDateArray[tag];
				}
			}
			
			$('#pttHead').empty();
			$('#pttHead').append(
				'<tr>'+
					'<th rowspan="2" style="width:91px">장비명</th>' +
					'<th colspan="' + pttRange + '">시도호</th>' +
					'<th colspan="' + pttRange + '">성공호</th>' +
					'<th colspan="' + pttRange + '">시도호증감율(%)</th>' +
					'<th colspan="' + pttRange + '">성공율(%)</th>' +
				'</tr>' +
				'<tr>' +
				pttTimeTag +
				'</tr>'
			);
			
			$('#maxDateTime').val(data.getMaxDateTime);
			getSearchData(data.getMaxDateTime);
		},
		error:function(data){
			
		}
	});
}

function getSearchData(stdDate){

	var date = new Date(stdDate);
	
	var callStartTime = getStartTime(stdDate,$('#call_monitor_range').val()).format("yyyyMMddHHmm");
	var callEndTime = date.format("yyyyMMddHHmm");
	var callArrayTime = paramTimeArray(stdDate,$('#call_monitor_range').val());
	
	var pttStartTime = getStartTime(stdDate,$('#ptt_monitor_range').val()).format("yyyyMMddHHmm");
	var pttEndTime = date.format("yyyyMMddHHmm");
	var pttArrayTime = paramTimeArray(stdDate,$('#ptt_monitor_range').val());
	
	var requestData = {
			callStartTime : callStartTime,
			callEndTime : callEndTime,
			callArrayTime : callArrayTime,
			pttStartTime : pttStartTime,
			pttEndTime : pttEndTime,
			pttArrayTime : pttArrayTime
	};
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/pm_monitor/record_monitor/getRecordSearchData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			var callData = data.getSearchData.CALL;
			var pttData = data.getSearchData.PTT;
			
			$('#callGrid').empty();
			$('#pttGrid').empty();
			
			var audioLevel = 4;
			var compLevel;
			
			$(callData).each(function(i,value){
				
				compLevel = compKeyLevel(value, callArrayTime, 'CAR'); // 시도호 증감율
				if(compKeyLevel(value, callArrayTime, 'CSR') < compLevel) compLevel = compKeyLevel(value, callArrayTime, 'CSR'); // 성공율
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				$('#callGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event, this, 8)">' +
							'<td>'+value.SYSTEM_NAME+'</td>' +
							'<td style="display:none;">' + value.SYSTEM_ID + '</td>' +
							getTD(value, callArrayTime, 'CA') +
							getTD(value, callArrayTime, 'CS') +
							getTD(value, callArrayTime, 'CAR') +
							getTD(value, callArrayTime, 'CSR') +
						'</tr>'
				);
			});
			$(pttData).each(function(i,value){

				compLevel = compKeyLevel(value, pttArrayTime, 'PAR'); // 시도호 증감율
				if(compKeyLevel(value, pttArrayTime, 'PSR') < compLevel) compLevel = compKeyLevel(value, pttArrayTime, 'PSR'); // 성공율
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				$('#pttGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event, this, 9)">' +
							'<td>'+value.SYSTEM_NAME+'</td>' +
							'<td style="display:none;">' + value.SYSTEM_ID + '</td>' +
							getTD(value, pttArrayTime, 'PA') +
							getTD(value, pttArrayTime, 'PS') +
							getTD(value, pttArrayTime, 'PAR') +
							getTD(value, pttArrayTime, 'PSR') +
						'</tr>'
				);
			});
			
			//alarm 가청 지정
			var playLevel = $('#alarm_level').val();
			var timeFlag = alarmTimeFlag();
			if(!$('#repeatIcon').hasClass('play')){
				if($('#alarm_check').is(':checked') && timeFlag){
					if(audioLevel == 1 && audioLevel <= playLevel){
						audioFile.criticalaudio.play();
						deleteAlarmInterval();
						setAlarmInterval(audioLevel);
					}else if(audioLevel == 2 && audioLevel <= playLevel){
						audioFile.majoraudio.play();
						deleteAlarmInterval();
						setAlarmInterval(audioLevel);
					}else if(audioLevel == 3 && audioLevel <= playLevel){
						audioFile.minoraudio.play();
						deleteAlarmInterval();
						setAlarmInterval(audioLevel);
					}else{
						audioFile.criticalaudio.pause();
						audioFile.criticalaudio.currentTime = 0;
						
						audioFile.majoraudio.pause();
						audioFile.majoraudio.currentTime = 0;
						
						audioFile.minoraudio.pause();
						audioFile.minoraudio.currentTime = 0;
						
						deleteAlarmInterval();
					}
				}else{
					audioFile.criticalaudio.pause();
					audioFile.criticalaudio.currentTime = 0;
					
					audioFile.majoraudio.pause();
					audioFile.majoraudio.currentTime = 0;
					
					audioFile.minoraudio.pause();
					audioFile.minoraudio.currentTime = 0;
					
					deleteAlarmInterval();
				}
			}else{
				if(audioLevel == 1 && audioLevel <= playLevel){
					audioFile.criticalaudio.play();
				}else if(audioLevel == 2 && audioLevel <= playLevel){
					audioFile.majoraudio.play();
				}else if(audioLevel == 3 && audioLevel <= playLevel){
					audioFile.minoraudio.play();
				}else{
					audioFile.criticalaudio.pause();
					audioFile.criticalaudio.currentTime = 0;
					
					audioFile.majoraudio.pause();
					audioFile.majoraudio.currentTime = 0;
					
					audioFile.minoraudio.pause();
					audioFile.minoraudio.currentTime = 0;
				}
			}
		},
		error:function(data){
			
		}
	});
}



function setAlarmInterval(level){
	var value;
	
	if(level == 1){
		value = setInterval("audioFile.criticalaudio.play()", 1000*60);
	}else if(level == 2){
		value = setInterval("audioFile.majoraudio.play()", 1000*60);
	}else if(level == 3){
		value = setInterval("audioFile.minoraudio.play()", 1000*60);
	}
	
	$('#alarmInterval').val(value);
}

function deleteAlarmInterval(){
	clearInterval($('#alarmInterval').val());
}

function color_level(level){
	
	if(level == 1){
		return 'class="critical"';
	}else if(level == 2){
		return 'class="major"';
	}else if(level == 3){
		return 'class="minor"';
	}else{
		return "";
	}
}

function alarmTimeFlag(){
	
	var returnFlag = true;
	
	var now = new Date().format("yyyyMMddHHmm");
	var next = new Date();
	next.setDate(next.getDate()+1);
	next = next.format("yyyyMMddHHmm");
	var yester = new Date();
	yester.setDate(yester.getDate()-1);
	yester = yester.format("yyyyMMddHHmm");
	
	var nowTime = now.substring(8,10);
	var nowDay = now.substring(0,8);
	var nextDay = next.substring(0,8);
	var yesterDay = yester.substring(0,8);
	
	
	var selectTimeVal = $('#alarm_time option:selected').val();
	var selectTime = $('#alarm_time option:selected').text();
	
	if(selectTimeVal == 2){
		var startTime = selectTime.split(" ~ ")[0].split(":");
		var endTime = selectTime.split(" ~ ")[1].split(":");
		
		startTime = nowDay+startTime[0]+startTime[1];
		endTime = nowDay+endTime[0]+endTime[1];
		
		if(Number(startTime) <= Number(now) && Number(now) <= Number(endTime)){
			returnFlag = true;
		}else{
			returnFlag = false;
		}
	}else if(selectTimeVal == 3){
		var startTime = selectTime.split(" ~ ")[0].split(":");
		var endTime = selectTime.split(" ~ ")[1].split(":");
		
		if(Number(startTime) < Number(nowTime)){
			startTime = nowDay+startTime[0]+startTime[1];
			endTime = nextDay+endTime[0]+endTime[1];
		}else{
			startTime = yesterDay+startTime[0]+startTime[1];
			endTime = nowDay+endTime[0]+endTime[1];
		}
		
		
		
		if(Number(startTime) <= Number(now) && Number(now) <= Number(endTime)){
			returnFlag = true;
		}else{
			returnFlag = false;
		}
	}else{
		returnFlag = true;
	}
	
	return returnFlag;
}

function headerTimeArray(stdDate,range){
	var date = new Date(stdDate);
	var dateArray = [];
	var newDateArray = [];
	
	for(var i = range-1; 0 <= i; i--){
		dateArray.push('<th>'+new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*i)).format("HH:mm")+'</th>');
	}
	
	for(var index = dateArray.length-1 ; 0 <= index; index--){
		newDateArray.push(dateArray[index]);
	}
	
	return newDateArray;
}

function paramTimeArray(stdDate,range){
	var date = new Date(stdDate);
	var dateArray = [];
	var newDateArray = [];
	
	for(var i = range-1; 0 <= i; i--){
		dateArray.push(new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*i)).format("yyyyMMddHHmm"));
	}
	
	for(var index = dateArray.length-1 ; 0 <= index; index--){
		newDateArray.push(dateArray[index]);
	}
	
	return newDateArray;
}

function getStartTime(stdDate,range){
	var date = new Date(stdDate);
	var returnDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*Number(range)));
	
	return returnDate;
}

function getTD(object, timeArray, key){
	var returnStr = '';
	var colorStr = '';
	
	for(index in timeArray){
		colorStr = '';
		colorStr = color_level(object[key+'L_'+timeArray[index]]);
		returnStr += '<td><span '+colorStr+'>'+object[key+'_'+timeArray[index]]+'</span></td>';
	}
	
	return returnStr;
}

function compKeyLevel(object, timeArray, key){
	var level = 4;
	
	for(index in timeArray){
		if(level > Number(object[key+'L_'+timeArray[index]])){
			level = Number(object[key+'L_'+timeArray[index]]);
		}
	}
	
	return level;
}


function excel_download(){
	
	var stdDate = $('#maxDateTime').val();
	var date = new Date(stdDate);

	
	var callStartTime = getStartTime(stdDate,$('#call_monitor_range').val()).format("yyyyMMddHHmm");
	var callEndTime = date.format("yyyyMMddHHmm");
	var callArrayTime = paramTimeArray(stdDate,$('#call_monitor_range').val());
	
	var pttStartTime = getStartTime(stdDate,$('#ptt_monitor_range').val()).format("yyyyMMddHHmm");
	var pttEndTime = date.format("yyyyMMddHHmm");
	var pttArrayTime = paramTimeArray(stdDate,$('#ptt_monitor_range').val());
	
	var equipType = $('#equipSelect option:selected').val();
	
	var url =  "/pm/pm_monitor/record_monitor/recordExcel?callStartTime="+callStartTime+"&callEndTime="+callEndTime+"&callArrayTime_join="+callArrayTime+
					"&pttStartTime="+pttStartTime+"&pttEndTime="+pttEndTime+"&pttArrayTime_join="+pttArrayTime+"&equipType="+equipType;
	
	$(location).attr('href', url);
}

var rightMenu = {
		rightClick : function(event, obj, type){
			if(event.button == 2){
				$('#popMenu').css('display','block');
				var updateTime = $('#update_time').text();
				updateTime = updateTime.replace(" ","T");
				updateTime = new Date(updateTime);
				rightMenu.stdTime = updateTime;
				rightMenu.obj = obj;
				rightMenu.type = type;
				
				var pos = abspos(event);
				$('#popMenu').css('left',(pos.x+10)+'px');
				$('#popMenu').css('top',(pos.y-135)+'px');
			}
		},
		type : '',
		obj : {},
		stdTime : '',
		pageType : '5'
}

function abspos(e){
	this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
	this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
	return this;
}

function getEquipType(equipName){
	var equipType = 8;
	if(equipName == 'CALL') equipType = 8;
	else if(equipName == 'PTT') equipType = 9;
	else equipType = equipName;
	
	return equipType;
}

function changeEquipType(equipType){
	if(equipType == '0') {
		$('#callDiv').css('display','block');
		$('#callTitle').css('display','block');
		$('#pttDiv').css('display','block');
		$('#pttTitle').css('display','block');
	} else {
		$('#callDiv').css('display','none');
		$('#callTitle').css('display','none');
		$('#pttDiv').css('display','none');
		$('#pttTitle').css('display','none');
		
		if(equipType == '8') {
			$('#callDiv').css('display','block');
			$('#callTitle').css('display','block');
		} else if(equipType == '9') {
			$('#pttDiv').css('display','block');
			$('#pttTitle').css('display','block');
		}
	}
}

function observeSetView() {
	$('#observeSetBg').show().fadeIn('fast');
	$('#observeSetUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#observeSetUp').height()-100)/2
	var width = (screen.width - $('#observeSetUp').width())/2
	
	$('#observeSetUp').css('left',width+'px');
	$('#observeSetUp').css('top',height+'px');
}

function observeSettingSave() {
	$('#observeSetBg').fadeOut();
	$('#observeSetUp').fadeOut();
	getMaxDateTime();
}