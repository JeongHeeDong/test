$(document).ready(function () {
	//$(".titleWrap").css('display','none');
	
	$('#sendMessage').click(function () {
		sendMessage();
	});

    //단말기 성능정보 dialog 숨기기
    $("#mobilePerformanceClose ,#mobilePerformanceBg").on('click', function (e) {
        $('#mobilePerformanceBg').fadeOut();
        $('.mobileLoca').fadeOut();
    });
    //단말기 성능정보 dialog 드래그
    $('.mobileLoca').draggable({'handle': '#mobilePerformanceTitle'});
    $('.trend').draggable({'handle': '#mobilePerformanceTrend'});
    $('#mobileInfoUp').draggable({'handle': '#mobileInfoTitle'});
    
    $('#mobileInfoClose ,#mobileInfoBg').on('click',function(e){
		$('#mobileInfoUp').fadeOut();
		$('#mobileInfoBg').fadeOut();
	});
    
    $("#divDialogBackground, .chart-close").click(function(e){
        $("#divDialogBackground").hide();
        $(".trend").hide();		//'닫기'버튼을 클릭하면 레이어가 사라진다.
        e.preventDefault();
    });
    
    $("#btn_gradeFt_cancel").on('click', function(e){
		$('#gradeFilterBg').fadeOut();
		$('#gradeFilterUp').fadeOut();
	});
    
    $('.mobilelist').on('click', '.st01', function(evt) {
    	mobileLocationPopView(this);
    });
    
    $(window).click(function(e) {
		if($('#popMenu').css('display') == 'block'){
			$('#popMenu').css('display','none');
		}
	});

    //Datepicker 초기화
    datepickerSetting();

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
	
	$('#mobileInfoPop').on('click', '#setAllPhoneNo', function(evt) {
		allSelectPhones(this);
	});
	
	$('#mobileInfoPop').on('click', '.setPhoneNo', function(evt) {
		singleSelectPhone(this);
	});
	
	$('#initNumbers').on('click', function(evt) {
		$('#phoneNo').val('');
	})
	
	//가청, 감시 ON
	$(".top-buttons").addClass("mu-toggle-on");
	//가청, 감시 버튼 활성화

	$("#mobilePerformancePopTable").on("click", ".searchTrend", function(e) {
        var params = {
            "phoneNo": this.dataset.phone_no,
            "eventTime": MOBILE_LOCATION.monitorTime
        };
	    searchTrend(params);
	});
	
    //단말 성능 트렌드 내 검색 버튼
    $("#trendRequest").click(function(e) {
    	trendCall();
    });
    
    getStationInfoAndMonitorTime();
    intervalSet();
    
    setInterval(function() {
		var now = new Date();
		var hour = now.getHours();
		var min = now.getMinutes();
		
		if((hour+"").length < 2) hour="0"+hour;
		if((min+"").length < 2) min="0"+min;
		if(hour+":"+min == "00:00") location.reload(true);
		
	}, 60000);
});

function intervalSet(){
	var intervalId = setInterval("getStationInfoAndMonitorTime()", 1000*10);
	$('#watchBtn').val(intervalId);
	$('#watchBtn').attr('onclick','javascript:intervalDelete()');
	
	if(!$('#watchBtn').hasClass('mu-toggle-on')){
		$('#watchBtn').addClass('mu-toggle-on');
	}
	
	getStationInfoAndMonitorTime();
}

function intervalDelete(){
	clearInterval($('#watchBtn').val());
	$('#watchBtn').attr('onclick','javascript:intervalSet()');
	
	if($('#watchBtn').hasClass('mu-toggle-on')){
		$('#watchBtn').removeClass('mu-toggle-on');
	}
}

var MOBILE_LOCATION = {
		soundFlag : true,
		watchFlag : true,
		monitorTime : '',
		imagePath : '/resources/images/monitoring/',
		i_normal : 'alarm_ani_normal.gif',
		i_critical : 'alarm_ani_red.gif',
		i_major : 'alarm_ani_orenge.gif',
		i_minor : 'alarm_ani_yellow.gif',
		mobileInfo : [],
		locationInfo : [],
		modifyStationInfo : [],
		filterLevel : 0,
		tempLevel : 4
};

function getStationInfoAndMonitorTime() {
	$.ajax({
		type:'post',
		url:'/integration/monitor/mobile/getStationInfoAndMonitorTime',
		contentType: 'application/json',
		dataTpye:'json',
		success:function(data){
			var originStationInfo = data.stationInfoAndMonitorTime.OriginStationInfo;
			var modifyStationInfo = data.stationInfoAndMonitorTime.ModifyStationInfo;
			var monitorTime = data.stationInfoAndMonitorTime.MonitorTime.PERFORMANCE_TIME
			
			MOBILE_LOCATION.modifyStationInfo = modifyStationInfo;
			
			if(MOBILE_LOCATION.monitorTime != monitorTime){
				MOBILE_LOCATION.monitorTime = monitorTime;
				$(".timeWrap").text('감시시간 : '+MOBILE_LOCATION.monitorTime);
				$(".mobilelist").empty();
				var mobileHtml = '';
				$.each(modifyStationInfo, function (i, val) {
					mobileHtml += '<div class="st01 station-'+val.STATION_ID+'" style="visibility: hidden; cursor:pointer;" oncontextmenu="return false"'+
										'onmousedown="javascript:rightMenu.rightClick(event,this)" data-station_id = "'+val.STATION_ID+'">'+
									'<em></em>'+
									'<img src="'+MOBILE_LOCATION.imagePath+MOBILE_LOCATION.i_normal+'" alt="단말기" />'+
								'</div>'
				});
				$(".mobilelist").append(mobileHtml);
				
				$('.subwaylist > ul').empty();
				var stationHtml = '';
				$.each(originStationInfo, function (i, val) {
					stationHtml += '<li>'+val.STATION_NAME+'</li>';
				});
				$('.subwaylist > ul').append(stationHtml);
			}
			
			getMobileLocationAndAlarm();
		},
		error:function(data){
			
		}
	});
}

function getMobileLocationAndAlarm() {
	var requestData = {
			eventTime : MOBILE_LOCATION.monitorTime,
			filterLevel : MOBILE_LOCATION.filterLevel
	};
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/integration/monitor/mobile/getMobileLocationAndAlarm',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			MOBILE_LOCATION.mobileInfo = data.mobileLocationAndAlarm.mobileInfo;
			MOBILE_LOCATION.locationInfo = data.mobileLocationAndAlarm.locationInfo;
			
			var stClass = 'station-';
			$('.st01').css('visibility','hidden');
			
			var critical = 0, major = 0, minor = 0;
			var _minLevel = 4;
			
			
			$('.st01').each(function (i, obj) {
				$.each(data.mobileLocationAndAlarm.locationInfo, function(i, val) {
					if($(obj).hasClass(stClass+val.LOCATION)) {
						
						$(obj).data('phones',val.PHONES);
						$(obj).data('location',val.LOCATION);
						$(obj).css('visibility', '');
						$(obj).find('em').text(val.MOBILE_CNT);
						$(obj).find('img').attr('src',MOBILE_LOCATION.imagePath+MOBILE_LOCATION['i_'+level_numberToText(val.MIN_LEVEL)]);
						
						if(val.MIN_LEVEL < _minLevel) _minLevel = val.MIN_LEVEL;
						
						if(val.MIN_LEVEL == 1) critical++
						else if(val.MIN_LEVEL == 2) major++
						else if(val.MIN_LEVEL == 3) minor++
						
						return false;
					}
				});
			});
			
			if(MOBILE_LOCATION.tempLevel == _minLevel) {
				$('#audioAlarmLevel').val(MOBILE_LOCATION.tempLevel);
			}else {
				MOBILE_LOCATION.tempLevel = _minLevel;
				$('#audioAlarmLevel').val(MOBILE_LOCATION.tempLevel);
				alarmPlay();
			}
			
			
			
			$('#cntAllLevel1').text(critical);
			$('#cntAllLevel2').text(major);
			$('#cntAllLevel3').text(minor);
			
		},
		error:function(data){
			
		}
	});
}

function alarmPlay() {
	if($('#soundBtn').hasClass('mu-toggle-on')){
		audioFunction.audioPuse();
		audioFunction.audioPlay();
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

function mobileLocationPopView(obj) {
	
	var phones = $(obj).data('phones').split(',');
	var location_nm = '';
	var use_nm = '';
	var area_info = '';
	var cell_id = '';
	var bodyhtml = '';
	var locations = [];
	
	$.each(MOBILE_LOCATION.modifyStationInfo, function(i, val) {
		if(MOBILE_LOCATION.modifyStationInfo[i].STATION_ID == $(obj).data('location')) {
			location_nm = MOBILE_LOCATION.modifyStationInfo[i].STATION_NAME;
			return false;
		}
	});
	
	location_nm = location_nm.replace(' 본선','');
	locations = location_nm.split('-');
	
	$('#mobileInfoPop').empty();
	
	var title = '';
	if(locations.length == 1) {
		title = '<span class="prevStation">' + locations[0] + '</span>'
	} else {
		title = '<span class="prevStation">' + locations[0] + '</span><span class="dotLine"></span><span class="nextStation">' + locations[1] + '</span>';
	}
	var createTopContent =
		'<div class="phoneLocaTop">' +
			'<table class="mu-formbox">' +
				'<tbody>' +
					'<tr>' +
						'<td class="tc">' +
							title +
						'</td>' +
						'<td>' +
							'<button id="setAllPhoneNo" type="button" class="mu-btn" data-cell_location="' + $(obj).data('location') + '">전체 선택</button>' +
						'</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' +
		'</div>';

	$('#mobileInfoPop').append(createTopContent);
	
	$.each(phones, function(i, phoneNo) {
		$.each(MOBILE_LOCATION.mobileInfo, function(j, val) {
			if(val.PHONE_NO == phones[i]) {
				use_nm = val.PHONE_USE_NAME;
				area_info = val.AREA_INFO;
				cell_id = val.CELL_ID;
				return false;
			}
		});
		
		bodyhtml += 
			'<div class="phoneLocaBody">' +
				'<table class="mu-formbox">' +
					'<tbody>' +
						'<tr>' +
							'<td>' +
								'<div class="mu-item-group">' +
									'<label>단말기번호</label>' +
									'<input type="text" class="mu-input" name=popPhoneNo" value="' + phones[i] + '" style="width:150px" readonly />' +
								'</div>' +
							'</td>' +
							'<td rowspan="3">' +
								'<button type="button" class="setPhoneNo mu-btn" data-phone="' + phones[i] + '" data-id="' + cell_id + '" value>선택</button>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td>' +
								'<div class="mu-item-group">' +
									'<label>사용자</label>' +
									'<input type="text" class="mu-input" name="popUser" value="' + use_nm + '" style="width:150px" readonly />' +
								'</div>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td>' +
								'<div class="mu-item-group">' +
									'<label>위치</label>' +
									'<input type="text" class="mu-input" id="popCellLocation" value="' + area_info + '" style="width:150px" readonly />' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			'</div>'
	});
	
	$('#mobileInfoPop').append(bodyhtml);
	
	$('#mobileInfoBg').show().fadeIn('fast');
	$('#mobileInfoUp').show().fadeIn('fast');
}

function allSelectPhones(obj) {
	var loc = $(obj).data('cell_location');
	var phones = '';
	var phonesList = [];
	
	$.each(MOBILE_LOCATION.locationInfo, function(i,val) {
		if(val.LOCATION == loc) {
			phones = val.PHONES;
			return false;
		}
	});
	
	phonesList = phones.split(',');
	
	var selectPhones = $('#phoneNo').val();
	
	$.each(phonesList, function (i, val) {
		if(!selectPhones.match(phonesList[i])) {
			selectPhones = selectPhones+', '+phonesList[i];
		}
	});
	
	$('#phoneNo').val(selectPhones.replace(/^, / , ""));
}

function singleSelectPhone(obj) {
	var phone = $(obj).data('phone');
	var selectPhones = $('#phoneNo').val();
	
	if(!selectPhones.match(phone)) {
		selectPhones = selectPhones+', '+phone;
	}
	
	$('#phoneNo').val(selectPhones.replace(/^, / , ""));
}

function popPerformView() {
	var station_id = $(rightMenu.obj).data('station_id');
	var phones = '';
	var eventTime = MOBILE_LOCATION.monitorTime;
	
	$.each(MOBILE_LOCATION.locationInfo, function(i,val) {
		if(val.LOCATION == station_id) {
			phones = val.PHONES;
			return false;
		}
	});
	
	var requestData = {
			eventTime : eventTime,
			station_id : station_id,
			phones : phones.replace(/, /gi, ","),
			filterLevel : MOBILE_LOCATION.filterLevel
	};
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/integration/monitor/mobile/getPopPerformData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			$('#mobilePerformancePopTable').empty();

			var performance_thead_info =
						'<colgroup>' +
							'<col width="25%">' +
							'<col width="25%">' +
							'<col width="25%">' +
							'<col width="25%">' +
							'<col width="25%">' +
						'</colgroup>' +
						'<thead>' +
							'<tr>' +
								'<th>단말번호</th>' +
								'<th>위치</th>' +
								'<th>호</th>' +
								'<th>발신</th>' +
								'<th>착신</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody id="mobilePerformanceInfoTbody">' +
						'</tbody>';


			$('#mobilePerformancePopTable').append(performance_thead_info);
			var performance_tr_info = '';
			var locationNm = '';
			
			$.each(MOBILE_LOCATION.modifyStationInfo, function(j, val) {
				if(MOBILE_LOCATION.modifyStationInfo[j].STATION_ID == station_id) {
					locationNm = MOBILE_LOCATION.modifyStationInfo[j].STATION_NAME;
					return false;
				}
			});
			
			var minlevel = 4;
			
			$.each(data.popPerformData, function(i, value) {
				var area_info = '';
				
				$.each(MOBILE_LOCATION.mobileInfo, function(j, val) {
					if(MOBILE_LOCATION.mobileInfo[j].PHONE_NO == value.PHONE_NO) {
						area_info = MOBILE_LOCATION.mobileInfo[j].AREA_INFO;
						return false;
					}
				});
				
				performance_tr_info +=
	                '<tr class="rating">' +
						'<td rowspan="4" class="phoneNo">' + value.PHONE_NO +
							'<br>' +
							'<button type="button" class="mu-btn searchTrend" data-phone_no="' + value.PHONE_NO + '">Trend</button>' +
						'</td>' +
	                    '<td rowspan="4" class="cellId">' + area_info + '<br>(' + locationNm + ')</td>' +
	                    '<td>시도호</td>' +
	                    '<td><span>' + value.ATTEMPT_C + '</span></td>' +
	                    '<td><span>' + value.ATTEMPT_R + '</span></td>' +
	                '</tr>' +
	                '<tr class="rating">' +
	                    '<td>성공호</td>' +
	                    '<td><span>' + value.SUCCESS_C + '</span></td>' +
	                    '<td><span>' + value.SUCCESS_R + '</span></td>' +
	                '</tr>' +
	                '<tr class="rating">' +
	                    '<td>시도호 증감율(%)</td>' +
	                    '<td><span class="' + level_numberToClass(value.ATT_RATE_LEVEL_C) + '">' + value.ATT_RATE_C + '</span></td>' +
	                    '<td><span class="' + level_numberToClass(value.ATT_RATE_LEVEL_R) + '">' + value.ATT_RATE_R + '</span></td>' +
	                '</tr>' +
	                '<tr class="rating">' +
	                    '<td>성공율(%)</td>' +
	                    '<td><span class="' + level_numberToClass(value.SUCC_RATE_LEVEL_C) + '">' + value.SUCC_RATE_C + '</span></td>' +
	                    '<td><span class="' + level_numberToClass(value.SUCC_RATE_LEVEL_R) + '">' + value.SUCC_RATE_R + '</span></td>' +
	                '</tr>';
				
				if(value.ATT_RATE_LEVEL_C < minlevel) minlevel = value.ATT_RATE_LEVEL_C;
				if(value.ATT_RATE_LEVEL_R < minlevel) minlevel = value.ATT_RATE_LEVEL_R;
				if(value.SUCC_RATE_LEVEL_C < minlevel) minlevel = value.SUCC_RATE_LEVEL_C;
				if(value.SUCC_RATE_LEVEL_R < minlevel) minlevel = value.SUCC_RATE_LEVEL_R;
			});

            $('#mobilePerformanceInfoTbody').append(performance_tr_info);
			
            var alarm_grade =
                '<tr class="rating">' +
                    '<td>알람등급</td>' +
                    '<td colspan="4"><span class="main-alarm ' + level_numberToText(minlevel) + '">' + level_numberToText(minlevel).charAt(0).toUpperCase() + level_numberToText(minlevel).slice(1) + '</span></td>' +
                '</tr>';

    		$('#mobilePerformanceInfoTbody').append(alarm_grade);
            
			$('.eventDate').text(eventTime);
			var mobilePerformanceUp = $('.mobileLoca');
			//조치사례 및 고장상세 리스트 클릭이벤트
			$('#mobilePerformanceBg').show().fadeIn('fast');
			mobilePerformanceUp.show().fadeIn('fast');

			var height = (screen.height - mobilePerformanceUp.height() - 100) / 2;
			var width = (screen.width - mobilePerformanceUp.width()) / 2;

			mobilePerformanceUp.css('left', width + 'px');
			mobilePerformanceUp.css('top', height + 'px');
			
		},
		error:function(data){
			
		}
	});
}

function trendCall () {
    var
        $endDate = $("#end-date"),
        $startDate = $("#start-date"),
        params = {
            "eventTime":
                $endDate.datepicker({ dateFormat: 'yy-mm-dd' }).val() + " " +
                $("select[name=end-hour]").val() + ":" +
                $("select[name=end-minute]").val() + ":00",
            "startEventTime":
                $startDate.datepicker({ dateFormat: 'yy-mm-dd' }).val() + " " +
                $("select[name=start-hour]").val() + ":" +
                $("select[name=start-minute]").val() + ":00",
            "phoneNo": $("#trendRequest").data("phone_no")
        };

    var startDateTime = new Date(params.startEventTime);
    var endDateTime = new Date(params.eventTime);

    if((endDateTime.getTime() - startDateTime.getTime())/1000/60/60 < 0){
        alert('조회 범위가 잘못되었습니다.');
        return false;
    }else if((endDateTime.getTime() - startDateTime.getTime())/1000/60/60 > 1){
        alert('최대 1시간 조회만 가능합니다.');
        return false;
    }
    searchTrend(params);
}

function searchTrend(params) {
    var
        $eventDate = $("#eventDate"),
        $eventHour = $("select[name=eventTime-hour]"),
        $eventMinute = $("select[name=eventTime-minute]");

    var eventTime =
        $eventDate.datepicker({ dateFormat: 'yy-mm-dd' }).val() + " " +
        $eventHour.val() + ":" +
        $eventMinute.val() + ":00";

	var trendAjax = $.ajax({
		type: 'post',
		url: '/integration/monitor/mobile/searchTrend',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(params)
	});

	trendAjax.then(function (data) {
	    data = data.trendInfo;

        $("#start-date").datepicker("setDate", data.START_EVENT_TIME.substr(0,10));
        $("select[name=start-hour]").val(data.START_EVENT_TIME.substr(11,2));
        $("select[name=start-minute]").val(data.START_EVENT_TIME.substr(14,2));

        $("#end-date").datepicker("setDate", data.END_EVENT_TIME.substr(0,10));
        $("select[name=end-hour]").val(data.END_EVENT_TIME.substr(11,2));
        $("select[name=end-minute]").val(data.END_EVENT_TIME.substr(14,2));

        var
            $chart = $("#chartWrap"),
            phoneNo = data.PHONE_NO,
            sendAtmp,
            sendSuccRate,
            recvAtmp,
            recvSuccRate,
            category;

        $("#trendRequest").data("phone_no", phoneNo);
        document.querySelector("#mobilePerformanceTrend .title").textContent = "단말번호: " + phoneNo;

        if($chart.highcharts() !== undefined) {
            sendAtmp = $chart.highcharts().series[0];
            sendSuccRate = $chart.highcharts().series[1];
            recvAtmp = $chart.highcharts().series[2];
            recvSuccRate = $chart.highcharts().series[3];
            category = $chart.highcharts().xAxis[0];

            setTimeout(function () {
                category.update({categories: data.CATEGORY});
            }, 0);
            sendAtmp.setData(data.SEND_ATTEMPTS, true);
            sendSuccRate.setData(data.SEND_SUCC_RATES, true);
            recvAtmp.setData(data.RECV_ATTEMPTS, true);
            recvSuccRate.setData(data.RECV_SUCC_RATES, true);

            $chart.highcharts().setTitle({text: phoneNo});
        } else {
            drawChart(data);
        }
        $(".trend").show();
        $("#divDialogBackground").show();
	});
}

function drawChart(data) {
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
            width: 930,
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
                            // console.log(e);
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
                            // console.log(e);
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        title:{
            text:data.PHONE_NO
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
            //gridLineWidth: 0,
            title: {
                text: '율',
                rotation: 0,
                style: {
                    color: "#E07400"
                }
            },
            labels: {
                x: -10,
                format: '{value}',
                style: {
                    color: "#E07400"
                }
            },
            opposite: true,
            showEmpty: false
        }],
        tooltip: {
            shared: true
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 0,
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
            name: '발신 시도호',
            type: 'column',
            yAxis: 0,
            data: data.SEND_ATTEMPTS,
            color: "#4572A6",
            tooltip: {
                valueSuffix: ''
            },
            zIndex: 10
        },{
            name: '발신 성공율',
            type: 'spline',
            yAxis: 1,
            data: data.SEND_SUCC_RATES,
            color: "#E07400",
            tooltip: {
                valueSuffix: ''
            },
            zIndex: 20
        },{
            name: '착신 시도호',
            type: 'column',
            yAxis: 0,
            data: data.RECV_ATTEMPTS,
            color: "#8BC34A",
            tooltip: {
                valueSuffix: ''
            },
            zIndex: 11
        },{
            name: '착신 성공율',
            type: 'spline',
            yAxis: 1,
            data: data.RECV_SUCC_RATES,
            color: "#E040FB",
            tooltip: {
                valueSuffix: ''
            },
            zIndex: 21
        }]
    });
}

function sendMessage () {
	var params = {
		'phone': $("#phoneNo").val().replace(/, /gi, ","),
		'message': $('#msgText').val()
	};
	var sendMsg = $.ajax({
		type: 'post',
		url: '/integration/monitor/mobile/sendMessage',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(params)
	});

	sendMsg.then(function (data) {
		alert('메세지가 발송되었습니다.');
	});
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

    var hour_idx;
    for(hour_idx = 1; hour_idx <= 24; hour_idx+=1) {
        var h= hour_idx < 10 ? "0" + hour_idx : hour_idx;
        var hour = h + "시";
        $(".select-hour").append("<option value='"+h+"'>"+hour+"</option>");
    }

    var minute_idx;
    for(minute_idx = 0; minute_idx <= 59; minute_idx += 1) {
        var m = minute_idx < 10 ? "0" + minute_idx : minute_idx;
        var minute = m + "분";
        $(".select-minute").append("<option value='"+m+"'>"+minute+"</option>");
    }
}

var rightMenu = {
		rightClick : function(event,obj){
			
			if(event.button == 2){
				$('#popMenu').css('display','block');
				
				var pos = abspos(event);
				$('#popMenu').css('left',(pos.x+30)+'px');
				$('#popMenu').css('top',(pos.y)+'px');
				
				rightMenu.obj = obj;
			}
		},
		obj : {}
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}

function level_numberToText(level) {
	var alarmLevelObj = {
			'1' : 'critical',
			'2' : 'major',
			'3' : 'minor',
			'4' : 'normal',
			'5' : 'normal'
	};
	
	if(alarmLevelObj[level]) {
		return alarmLevelObj[level];
	} else {
		return level;
	}
}

function level_numberToClass(level) {
	var alarmLevelObj = {
			'1' : 'critical',
			'2' : 'major',
			'3' : 'minor',
			'4' : '',
			'5' : '',
	};
	
	if(alarmLevelObj[level]) {
		return alarmLevelObj[level];
	} else {
		return level;
	}
}

function filterSaveSearch(flag, filterLevel) {
	MOBILE_LOCATION.filterLevel = filterLevel;
	getStationInfoAndMonitorTime();
}
