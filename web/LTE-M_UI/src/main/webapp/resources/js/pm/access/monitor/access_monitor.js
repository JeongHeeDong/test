var win;
var mainFilter = "";
var tempMonitorFlags = [0];

$(document).ready(function(){
	
	win = window.top || window;
	
	if(win.name != "") {
		mainFilter = JSON.parse(win.name);
		win.name = "";
	}
	
	// 구분 셀렉트박스
/*	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})*/
	
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
	
	getbasicSetting(2);
	

	$('#observeSetClose, #observeSetCancle,#observeSetBg').on('click',function(e){
		$('#observeSetBg').fadeOut();
		$('#observeSetUp').fadeOut();
	});
	//observeSet Drag 지정 정의
	$( "#observeSetUp" ).draggable({'handle' : '#observeSetTitleBox'});
	$( "#observeSetUp" ).resizable({
		animate: true
	});
	
	setTimeout("intervalSet()",500);
	
	$(window).click(function(e) {
		if($('#popMenu').css('display') == 'block'){
			$('#popMenu').css('display','none');
		}
	});
	
	$('#accessKpiTable thead tr').on('click', 'th', function(e){
		if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
			sortFunction.dataSort(this,e.ctrlKey, 1);
	});
	$('#accessDtpTable thead tr').on('click', 'th', function(e){
		if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
			sortFunction.dataSort(this,e.ctrlKey, 2);
	});
	$('#accessHandTable thead tr').on('click', 'th', function(e){
		if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
			sortFunction.dataSort(this,e.ctrlKey, 3);
	});
	
	
	if(mainFilter != ""){
	
		 mainFilter.equipType = mainFilter.equipType == 'RU'?'3':'2';
		
		rightMenu.equipType = mainFilter.equipType;
		if(mainFilter.equipType == 2) $('#equipSelect option:eq(0)').attr("selected","selected");
		else {
			$('#equipSelect option:eq(1)').attr("selected","selected");
			changeEquipSelectJob();
		}
	}else{
		rightMenu.equipType = $('#equipSelect option:selected').val();
	}
	
	
	
	$('#equipSelect').change(function(){
		changeEquipSelectJob();
	});
	
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	
});


function changeEquipSelectJob(){
	var equipType = $('#equipSelect option:selected').val();
	rightMenu.equipType = equipType;

	sortFunction.sortInfo = [];
	var kpiColHtml = [];
	var kpiThHtml = [];
	
	if(equipType == 3) {
		var indexs = [];
		$.each(sortFunction.sortInfo,function(index,value){
			if(value['colName'] == "RU_NAME" || value['colName'] == "RU_CUID"){
				indexs.push(index);
				return false;
			}
		});
		$.each(indexs,function(index,value){
			sortFunction.sortInfo.splice(value,1);
		});
		
		kpiThHtml.push('<th class="updown" id="LINE_ID">구분</th>');
		kpiThHtml.push('<th class="updown" id="DU_ID">장비 ID</th>');
		kpiThHtml.push('<th class="updown" id="DU_NAME">기지국</th>');
		if(ruCellType === 'RU') {
			kpiThHtml.push('<th class="updown" id="RU_NAME">중계기</th>');
			kpiThHtml.push('<th class="updown" id="RU_CUID">Cell</th>');

			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
		} else if(ruCellType === 'CELL') {
			kpiThHtml.push('	<th class="updown" id="RU_CUID">Cell</th>');

			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
			kpiColHtml.push('<col width="8%">');
		}
	} else {
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		kpiColHtml.push('<col width="8%">');
		
		kpiThHtml.push('<th class="updown" id="LINE_ID">구분</th>');
		kpiThHtml.push('<th class="updown" id="DU_ID">장비 ID</th>');
		kpiThHtml.push('<th class="updown" id="DU_NAME">기지국</th>');
	}
	
	kpiThHtml.push('<th class="updown" id="ATTEMPT" title="RRC 시도호">RRC 시도호</th>                                    	');
	kpiThHtml.push('<th class="updown" id="LINE_ID" title="RRC 기준 시도호">RRC 기준 시도호</th>                             	');
	kpiThHtml.push('<th class="updown" id="ATT_RATE" title="RRC 시도호 증감율(%)">RRC 시도호 증감율(%)</th>                    	');
	kpiThHtml.push('<th class="updown" id="ERAB_ATTEMPT" title="ERAB Setup 시도호">ERAB Setup 시도호</th>                 	');
	kpiThHtml.push('<th class="updown" id="STD_ERAB_5M" title="ERAB Setup 기준 시도호">ERAB Setup 기준 시도호  </th>          	');
	kpiThHtml.push('<th class="updown" id="ERAB_ATT_RATE" title="ERAB Setup 시도호 증/감율">ERAB Setup 시도호 증/감율</th>      ');
	kpiThHtml.push('<th class="updown" id="RRC" title="소통호(RRC 성공호)">소통호(RRC 성공호)</th>                             ');
	kpiThHtml.push('<th class="updown" id="RRC_RATE" title="소통율(RRC 성공율)(%)">소통율(RRC 성공율)(%)</th>                  ');
	kpiThHtml.push('<th class="updown" id="ANSWER" title="완료호(ERAB Setup 성공호)">완료호(ERAB Setup 성공호)</th>            ');
	kpiThHtml.push('<th class="updown" id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)">완료율(ERAB Setup 성공율)(%)</th> ');
	kpiThHtml.push('<th class="updown" id="ERAB_ADD_SUCCESS" title="ERAB Setup Add 성공호">ERAB Setup Add 성공호</th>     	');
	kpiThHtml.push('<th class="updown" id="CD" title="절단호">절단호</th>                                                 	');
	kpiThHtml.push('<th class="updown" id="CD_RATE" title="절단율(%)">절단율(%)</th>                                      	');
	
	$('.js-kpi-colgroup').html(kpiColHtml.join('\n'));
	$('#kpiTheadTr').html(kpiThHtml.join('\n'));
	$('#accessKpiGrid').html('');
	
	getSearchData();
	
}

function intervalSet(){
	var intervalId = setInterval("getSearchData()", 1000*30);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
	if($('#repeatIcon').hasClass('play')){
		$('#repeatIcon').removeClass('play');
		$('#repeatIcon').addClass('pause');
	}else{
		$('#repeatIcon').addClass('pause');
	}
	
	getSearchData();
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

function getSearchData(){
	var monitorFlag = [];
	var equipType;
	
	if($('#kpi_check').is(':checked') && $('#dtp_check').is(':checked') && $('#hand_check').is(':checked')) {
		monitorFlag = [0];
	} else {
		monitorFlag = [];
		if($('#kpi_check').is(':checked')) monitorFlag.push(1);
		if($('#dtp_check').is(':checked')) monitorFlag.push(2);
		if($('#hand_check').is(':checked')) monitorFlag.push(3);
	}
	
	equipType = $('#equipSelect option:selected').val();
	lineId = $('#selectedLine').val();
	
	var requestData = {
			equip_type:"2",
			monitorFlag : monitorFlag,
			sortOption : sortFunction.sortInfo,
			dtpSortOption : sortFunction.dtpSortInfo,
			handSortOption : sortFunction.handSortInfo,
			equipType : equipType,
			lineId : lineId
			};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/pm_monitor/access_monitor/getSearchData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			var accessKpiData = data.getSearchData.getAccessKpiData;
			var accessDtpData = data.getSearchData.getAccessDTPData;
			var accessHandData = data.getSearchData.getAccessHANDData;
			
			$('#update_time').text("기준시간 : "+data.getSearchData.updateTime);
			$('#accessKpiGrid').empty();
			$('#accessDtpGrid').empty();
			$('#accessHandGrid').empty();
			
			var att_color = '';
			var erab_att_color = '';
			var rrc_color = '';
			var ans_color = '';
			var cd_color = '';
			var up_color = '';
			var dw_color = '';
			var succ_color = '';
			
			var audioLevel = 4;
			var compLevel;
			
			$(accessKpiData).each(function(key,value){
				att_color = '';
				erab_att_color = '';
				rrc_color = '';
				ans_color = '';
				cd_color = '';

				
				att_color = color_level(value.ATT_RATE_5M_LEVEL);
				erab_att_color = color_level(value.ERAB_ATT_RATE_LEVEL);
				rrc_color = color_level(value.RRC_RATE_LEVEL);
				ans_color = color_level(value.ANSWER_RATE_LEVEL);
				cd_color = color_level(value.CD_RATE_LEVEL);
				
				compLevel = value.ATT_RATE_5M_LEVEL;
				
				if(value.RRC_RATE_LEVEL < compLevel) compLevel = value.RRC_RATE_LEVEL;
				if(value.ANSWER_RATE_LEVEL < compLevel) compLevel = value.ANSWER_RATE_LEVEL;
				if(value.CD_RATE_LEVEL < compLevel) compLevel = value.CD_RATE_LEVEL;
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				
				var ruData = '';
				if(ruCellType === 'RU') {
					ruData = equipType == 3 ? '<td title="'+value.RU_NAME+'">' + value.RU_NAME + '</td><td title="'+value.RU_CUID+'">' + value.RU_CUID + '</td>' : '';
				} else if(ruCellType === 'CELL') {
					ruData = equipType == 3 ? '<td title="'+value.RU_CUID+'">' + value.RU_CUID + '</td>' : '';
				}
				
				LINE_NAME = getClineName(value.LINE_ID);
				$('#accessKpiGrid').append(
					'<tr onmousedown="javascript:rightMenu.rightClick(event,this,1)">'+
						'<td title="'+LINE_NAME+'">'+LINE_NAME+'</td>'+
						'<td title="'+value.DU_ID+'">'+value.DU_ID+'</td>'+
						'<td title="'+value.DU_NAME+'">'+value.DU_NAME+'</td>'+
						ruData+
						'<td>'+value.ATTEMPT+'</td>'+									// RRC 시도호
						'<td>'+value.STD_ATT_5M+'</td>'+								// RRC 기준 시도호
						'<td><span '+att_color+'>'+value.ATT_RATE+'</span></td>'+		// RRC 시도호 증감율(%)
						'<td>'+value.ERAB_ATTEMPT+'</td>'+								// ERAB Setup 시도호
						'<td>'+value.STD_ERAB_5M+'</td>'+								// ERAB Setup 기준 시도호
						'<td><span '+erab_att_color+'>'+value.ERAB_ATT_RATE+'</span></td>'+		// ERAB SEtup 시도호 증감율(%)
						'<td>'+value.RRC+'</td>'+										// 소통호 (RRC 성공호)
						'<td><span '+rrc_color+'>'+value.RRC_RATE+'</span></td>'+		// 소통율(RRC 성공율)(%)
						'<td>'+value.ANSWER+'</td>'+									// 완료호(ERAB Setup 성공호)
						'<td><span '+ans_color+'>'+value.ANSWER_RATE+'</span></td>'+	// 완료율(ERAB Setup 성공율)(%)
						'<td>'+value.ERAB_ADD_SUCCESS+'</td>'+							// ERAB Setup Add 성공호
						'<td>'+value.CD+'</td>'+										// 절단호
						'<td><span '+cd_color+'>'+value.CD_RATE+'</span></td>'+			// 절단율 (%)
					'</tr>'
				);
			});
			
			$(accessDtpData).each(function(key,value){
				up_color = '';
				dw_color = '';
				
				up_color = color_level(value.UP_DTP_LEVEL);
				dw_color = color_level(value.DW_DTP_LEVEL);
				
				compLevel = value.UP_DTP_LEVEL;
				
				if(value.UP_DTP_LEVEL < compLevel) compLevel = value.UP_DTP_LEVEL;
				if(value.DW_DTP_LEVEL < compLevel) compLevel = value.DW_DTP_LEVEL;
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				LINE_NAME = getClineName(value.LINE_ID);
				$('#accessDtpGrid').append(
					'<tr onmousedown="javascript:rightMenu.rightClick(event,this,2)">'+
						'<td>'+LINE_NAME+'</td>'+
						'<td>'+value.DU_ID+'</td>'+
						'<td title="'+value.DU_NAME+'">'+value.DU_NAME+'</td>'+
						
						'<td>'+value.UP_VOLUMN.format()+'</td>'+
						'<td>'+value.UP_VOLUMN_STD.format()+'</td>'+
						'<td>'+value.UP_VOLUMN_RATE.format()+'</td>'+
						
						'<td><span '+up_color+'>'+value.UP_DTP.format()+'</span></td>'+
						'<td>'+value.UP_DTP_STD.format()+'</td>'+
						'<td>'+value.UP_DTP_RATE.format()+'</td>'+
						
						'<td>'+value.DW_VOLUMN.format()+'</td>'+
						'<td>'+value.DW_VOLUMN_STD.format()+'</td>'+
						'<td>'+value.DW_VOLUMN_RATE.format()+'</td>'+
						
						'<td><span '+dw_color+'>'+value.DW_DTP.format()+'</span></td>'+
						'<td>'+value.DW_DTP_STD.format()+'</td>'+
						'<td>'+value.DW_DTP_RATE.format()+'</td>'+
					'</tr>'
				);
			});
			
			$(accessHandData).each(function(key,value){
				att_color = '';
				succ_color = '';
				
				att_color = color_level(value.ATT_RATE_LEVEL);
				succ_color = color_level(value.SUCC_RATE_LEVEL);
				
				compLevel = value.ATT_RATE_LEVEL;
				
				if(value.ATT_RATE_LEVEL < compLevel) compLevel = value.ATT_RATE_LEVEL;
				if(value.SUCC_RATE_LEVEL < compLevel) compLevel = value.SUCC_RATE_LEVEL;
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				LINE_NAME = getClineName(value.LINE_ID);
				$('#accessHandGrid').append(
					'<tr onmousedown="javascript:rightMenu.rightClick(event,this,3)">'+
						'<td>'+LINE_NAME+'</td>'+
						'<td>'+value.DU_ID+'</td>'+
						'<td>'+value.DU_NAME+'</td>'+
						'<td>'+value.STATISTICS_TYPE+'</td>'+
						'<td>'+value.ATTEMPT+'</td>'+
						'<td>'+value.STD_ATT_5M+'</td>'+
						'<td><span '+att_color+'>'+value.ATT_RATE.format()+'</span></td>'+
						'<td>'+value.SUCCESS+'</td>'+
						'<td><span '+succ_color+'>'+value.SUCC_RATE.format()+'</span></td>'+
					'</tr>'
				);
			});
			
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

function kpi_excel_download(){
	var updateTime = $('#update_time').text();
	updateTime = updateTime.replace(" ","T");
	updateTime = new Date(updateTime).format("yyyyMMddHHmmss");
	var equipType = $('#equipSelect option:selected').val();
	
//	return false;
	
    var url =  "/pm/pm_monitor/access_monitor/kpiExcel?equip_type=2&monitorFlag=1&updateTime="+updateTime+"&equipType="+equipType;
    $(location).attr('href', url);
}

function dtp_excel_download(){
	var updateTime = $('#update_time').text();
	updateTime = updateTime.replace(" ","T");
	updateTime = new Date(updateTime).format("yyyyMMddHHmmss");
	var equipType = $('#equipSelect option:selected').val();
	
	var url =  "/pm/pm_monitor/access_monitor/dtpExcel?equip_type=2&monitorFlag=2&updateTime="+updateTime+"&equipType="+equipType;
    $(location).attr('href', url);
}

function hand_excel_download(){
	var updateTime = $('#update_time').text();
	updateTime = updateTime.replace(" ","T");
	updateTime = new Date(updateTime).format("yyyyMMddHHmmss");
	var equipType = $('#equipSelect option:selected').val();
	
	var url =  "/pm/pm_monitor/access_monitor/handExcel?equip_type=2&monitorFlag=3&updateTime="+updateTime+"&equipType="+equipType;
    $(location).attr('href', url);
}


var rightMenu = {
		rightClick : function(event,obj,type){
			
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
		pageType : '1',
		equipType : '3'
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}

var sortFunction = {
	sortInfo : [],
	dtpSortInfo : [],
	handSortInfo : [],
	beforeColNms : [],
	dtpBeforeColNms : [],
	handBeforeColNms : [],
	dataSort : function(obj, ctrlKey, type) {
		if (ctrlKey) {
			var index = 9999;
			var sortOption = {};
			
			if(type == 1){
				if ((jQuery.inArray(obj.id,sortFunction.beforeColNms) != -1)) index = sortFunction.beforeColNms.indexOf(obj.id);
			} else if(type == 2){
				if ((jQuery.inArray(obj.id,sortFunction.dtpBeforeColNms) != -1)) index = sortFunction.dtpBeforeColNms.indexOf(obj.id);
			} else {
				if ((jQuery.inArray(obj.id,sortFunction.handBeforeColNms) != -1)) index = sortFunction.handBeforeColNms.indexOf(obj.id);
			}
			
			if ($(obj).hasClass('updown')) {
				$(obj).removeClass('updown');
				$(obj).addClass('up');

				if (index == 9999) {
					sortOption['colName'] = obj.id;
					sortOption['order'] = 'ASC';
				} else {
					if(type == 1) sortOption = sortFunction.sortInfo[index];
					else if(type == 2) sortOption = sortFunction.dtpSortInfo[index];
					else sortOption = sortFunction.handSortInfo[index];
					
					sortOption['order'] = 'ASC';
				}

			} else if ($(obj).hasClass('up')) {
				$(obj).removeClass('up');
				$(obj).addClass('down');

				if (index == 9999) {
					sortOption['colName'] = obj.id;
					sortOption['order'] = 'DESC';
				} else {
					if(type == 1) sortOption = sortFunction.sortInfo[index];
					else if(type == 2) sortOption = sortFunction.dtpSortInfo[index];
					else sortOption = sortFunction.handSortInfo[index];
					
					sortOption['order'] = 'DESC';
				}

			} else {
				$(obj).removeClass('down');
				$(obj).addClass('up');

				if (index == 9999) {
					sortOption['colName'] = obj.id;
					sortOption['order'] = 'ASC';
				} else {
					if(type == 1) sortOption = sortFunction.sortInfo[index];
					else if(type == 2) sortOption = sortFunction.dtpSortInfo[index];
					else sortOption = sortFunction.handSortInfo[index];
					
					sortOption['order'] = 'ASC';
				}

			}

			if (index == 9999 && type == 1) sortFunction.sortInfo.push(sortOption);
			else if(index == 9999 && type == 2) sortFunction.dtpSortInfo.push(sortOption);
			else if(index == 9999 && type == 3) sortFunction.handSortInfo.push(sortOption);
			
		} else {

			if (type == 1) {
				sortFunction.sortInfo = [];
				sortFunction.beforeColNms = [];
			}
			else if (type == 2) {
				sortFunction.dtpSortInfo = [];
				sortFunction.dtpBeforeColNms = [];
			} else {
				sortFunction.handSortInfo = [];
				sortFunction.handBeforeColNms = [];
			}
			
			var classNm = '';
			var sortOption = {};

			if ($(obj).hasClass('updown')) {
				$(obj).removeClass('updown');

				classNm = 'up';
				sortOption['colName'] = obj.id;
				sortOption['order'] = 'ASC';

			} else if ($(obj).hasClass('up')) {
				$(obj).removeClass('up');

				classNm = 'down';
				sortOption['colName'] = obj.id;
				sortOption['order'] = 'DESC';

			} else {
				$(obj).removeClass('down');

				classNm = 'up';
				sortOption['colName'] = obj.id;
				sortOption['order'] = 'ASC';

			}

			if(type == 1){
				$('#accessKpiTable thead tr th').removeClass('updown');
				$('#accessKpiTable thead tr th').removeClass('up');
				$('#accessKpiTable thead tr th').removeClass('down');
				$('#accessKpiTable thead tr th').addClass('updown');
			}else if(type == 2) {
				$('#accessDtpTable thead tr th').removeClass('updown');
				$('#accessDtpTable thead tr th').removeClass('up');
				$('#accessDtpTable thead tr th').removeClass('down');
				$('#accessDtpTable thead tr th').addClass('updown');
			} else {
				$('#accessHandTable thead tr th').removeClass('updown');
				$('#accessHandTable thead tr th').removeClass('up');
				$('#accessHandTable thead tr th').removeClass('down');
				$('#accessHandTable thead tr th').addClass('updown');
			}

			$(obj).removeClass('updown');
			$(obj).addClass(classNm);

			if(type == 1) sortFunction.sortInfo.push(sortOption);
			else if(type == 2) sortFunction.dtpSortInfo.push(sortOption);
			else sortFunction.handSortInfo.push(sortOption);
		}
		
		if(type == 1) {
			if ((jQuery.inArray(obj.id,sortFunction.beforeColNms) == -1)) sortFunction.beforeColNms.push(obj.id);
		}
		else if(type == 2) {
			if ((jQuery.inArray(obj.id,sortFunction.dtpBeforeColNms) == -1)) sortFunction.dtpBeforeColNms.push(obj.id);
		} else {
			if ((jQuery.inArray(obj.id,sortFunction.handBeforeColNms) == -1)) sortFunction.handBeforeColNms.push(obj.id);
		}
		
		getSearchData();
	}
};


function observeSetView() {
	$('#observeSetBg').show().fadeIn('fast');
	$('#observeSetUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#observeSetUp').height()-100)/2
	var width = (screen.width - $('#observeSetUp').width())/2
	
	$('#observeSetUp').css('left',width+'px');
	$('#observeSetUp').css('top',height+'px');
	
	if(tempMonitorFlags.indexOf(0) != -1) {
		$('#kpi_check, #dtp_check, #hand_check').prop('checked', true);
	} else {
		$('#kpi_check, #dtp_check, #hand_check').prop('checked', false);
		if(tempMonitorFlags.indexOf(1) != -1) $('#kpi_check').prop('checked',true);
		if(tempMonitorFlags.indexOf(2) != -1) $('#dtp_check').prop('checked',true);
		if(tempMonitorFlags.indexOf(3) != -1) $('#hand_check').prop('checked',true);
	}
}

function observeSettingSave() {
	if($('#kpi_check').is(':checked') && $('#dtp_check').is(':checked') && $('#hand_check').is(':checked')) {
		tempMonitorFlags = [0];
	} else {
		tempMonitorFlags = [];
		if($('#kpi_check').is(':checked')) tempMonitorFlags.push(1);
		if($('#dtp_check').is(':checked')) tempMonitorFlags.push(2);
		if($('#hand_check').is(':checked')) tempMonitorFlags.push(3);
	}

   $('#accessKpiDiv, #accessDtpDiv, #accessHandDiv').css('display','none');
   $.each(tempMonitorFlags, function (i, val) {
		if(val == '0') {
			$('#accessKpiDiv, #accessDtpDiv, #accessHandDiv').css('display','');
		}
		if(val == '1') {
			$('#accessKpiDiv').css('display','');
		}
		if(val == '2') {
			$('#accessDtpDiv').css('display','');
		}
		if(val == '3') {
			$('#accessHandDiv').css('display','');
		}
	});

   $('#observeSetBg').fadeOut();
   $('#observeSetUp').fadeOut();
}