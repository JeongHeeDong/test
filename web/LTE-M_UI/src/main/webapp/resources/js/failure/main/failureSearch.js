//var searchResData = null; //조회하여 가져온 데이터
var condition = {};
var spTime = null;
var spDate = null;
var flTime = null;
var spAlarm = null;
var alarmFilter = 4;
// var unRecover = null;

var newDate = new Date();
var yy = newDate.getFullYear();
var mm = newDate.getMonth()+1;
var dd = newDate.getDate();
var hh = newDate.getHours()-1;
hh = hh == 0 ? 24 : hh;

var flag = false;

$(document).ready(function(){

	initialize();
	drop_down_set_fSearch();

	$('#failureSearchBtn').on('click', function (e) {
		flag = false;
		btnSearchClick();
	});

	//그리드 소팅
	$('#tb_failureSearch_alarm_header').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#tb_failureSearch_alarm_header');
		flag = true;
		btnSearchClick();
	});

	$("#box_search_fromtime").datepicker({
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
			$('#box_search_totime').datepicker('option', 'minDate', selectedDate);
		}
	});
	$("#box_search_totime").datepicker({
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
	$("#box_search_fromtime").datepicker().datepicker("setDate", new Date());
	$("#box_search_totime").datepicker().datepicker("setDate", new Date());

	$('#btn_search_fromtime').on('click',function(e){
		$('#box_search_fromtime').datepicker("show");
	});
	$('#btn_search_totime').on('click',function(e){
		$('#box_search_totime').datepicker("show");
	});

//	$("input:radio[name='rd_search_failure']").on('change',function(e){
//		var delFlag = $("input:radio[name='rd_search_failure']:checked").val();
//		if(searchResData != null){
//			if(delFlag=="all"){
//				gridSearchFailureAlarm(searchResData);						
//			} else {
//				var flagFilterRes = setGridTableData(delFlag,searchResData);
//				gridSearchFailureAlarm(flagFilterRes);
//			}
//		}
//	});

	$("input:radio[name='rd_search_ea']").on('change',function(e){
		$("#target_system").val("");
		$("#target_system").prop("title", "");
		searchTargetSystemList = [];
	});

});


function initialize(){

	/* 미복구 체크 */
	// $("#chk_unRecover").on('click', function(e){
	// 	if( $(this).is(':checked') ){
	// 		unRecover = 'Y';
	// 	} else{
	// 		unRecover = null;
	// 	}
	// });

	/* 특정알람 선택화면 팝업 */
	$("#chk_spAlarm").on('click', function(e){
		if( $(this).is(':checked') ){
			$("#dlg_alarm .mu-dialog-head .title").html('알람조건설정');
			spAlarm = new Object();
			spAlarm['select'] = null;
			spAlarm['except'] = null;
	        openDialog('#dlg_alarm', function (fnCloseDlg) {

	        	if(spAlarm['select'] != null || spAlarm['except'] != null){
                    $('#chk_spAlarm').prop('checked',true);
	            } else {
	            	$('#chk_spAlarm').prop('checked',false);
	            }

	        	fnCloseDlg();
	        });
		}
	});

	/*-----------------------------------------------------------------*/

	/* 특정시간 선택화면 팝업 */
	$("#chk_spTime").on('click', function(e){
		if( $(this).is(':checked') ){

			/* 초기화 (기본 조회 시간은 현재시간-1 시간) */
			$("#"+hh).addClass("active");
			$("#chk_occurTime").prop("checked",true);
			// var activeArray = [];
//			activeArray.push(hh.toString());

			/* 아래 시간버튼 하나라도 클릭(활성화)될 경우 발생시간에 체크 */
			$("#table_hour li button").on('click',function(e){
				if($('#table_hour li button.active').text().trim() == ""){
					$("#chk_occurTime").prop("checked",false);
				} else{
					$("#chk_occurTime").is(":checked");
					if(!$("#chk_occurTime").is(":checked") && !$("#chk_recoverTime").is(":checked")){
						$("#chk_occurTime").prop("checked",true);
					}
				}
			});

			/* 발생시간 혹은 복구시간 체크시 아래의 (현재시간-1)시 버튼이 활성화 */
			$("#chk_occurTime, #chk_recoverTime").on('click',function(e){
				if($("#chk_occurTime").is(":checked") || $("#chk_recoverTime").is(":checked")){
					if($('#table_hour li button.active').text().trim() == ""){
						$("#"+hh).addClass("active");
					}
				} else{
					$('#table_hour li button.active').removeClass("active");
				}
			});

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
		spTime = {};
		var activeArray = [];
		spTime['ehour'] = null;
		spTime['rhour'] = null;
		spTime['operator'] = null;

		var timeStr;
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

		if(activeArray != null && activeArray.length > 0){
			if($("#chk_occurTime").is(":checked")){
				spTime['ehour'] = activeArray;
			}
			if($("#chk_recoverTime").is(":checked")){
				spTime['rhour'] = activeArray;
			}
			if(spTime['ehour'] != null && spTime['rhour'] != null){
				spTime['operator'] = $("#operator :selected").val();
			}
			$('#chk_spTime').prop('checked',true);
		} else {
			spTime = null;
			$('#chk_spTime').prop('checked',false);
			$("#chk_occurTime").prop('checked',false);
			$("#chk_recoverTime").prop('checked',false);
		}

		$('#setSpecificTimeBg').fadeOut();
		$('#setSpecificTimeUp').fadeOut();
	});

	$("#setSpecificTimeClose, #setSpecificTimeBg, #setSpecificTimeCancel").on('click',function(e){
		$('#setSpecificTimeBg').fadeOut();
		$('#setSpecificTimeUp').fadeOut();

		spTime = null;
		$('#table_hour li button').removeClass('active');
		$('#chk_spTime').prop('checked',false);
	});
	$("#setSpecificTimeUp").draggable({'handle' : '#setSpecificTimeTitle'});

	// $('#setSpecificTimeClose, #setSpecificTimeCancel, #setSpecificTimeBg').attr('onclick', 'closeCallBack(this)');

	/*-----------------------------------------------------------------*/

	/* 고장시간 화면 팝업 */
	$("#chk_flTime").on('click', function(e){
		if( $(this).is(':checked') ){
			$('#searchFailureHourBg').show().fadeIn('fast');
			$('#searchFailureHourUp').show().fadeIn('fast');
			var height = (screen.height - $('#searchFailureHourUp').height()-100)/2;
			var width = (screen.width - $('#searchFailureHourUp').width())/2;

			$('#searchFailureHourUp').css('left',width+'px');
			$('#searchFailureHourUp').css('top',height+'px');

			$( "input[name='spinner_failureTime']" ).spinner({
				max: 60,
				min: 1
			});
			$( "input[name='spinner_failureTime_hour']" ).spinner({
				max: 24,
				min: 1
			});

			$("#spinner_failureTime_sec").val("10");
			$("#spinner_failureTime_min").val("5");
			$("#spinner_failureTime_hour").val("24");
			flTime = new Object();
			flTime['upper'] = 0;
		}
	});

	$("#searchFailureHourOk").on('click',function(e){
		flTime['upper'] = null;
		flTime['lower'] = null;
		/* 고장시간 라디오 버튼 값 확인(초, 분) */
		var chkTime = $("input[name='rd_search_failureTime']:checked").val();
		if(chkTime != "all"){
			if(chkTime == "sec"){
				flTime['upper'] = parseInt($("#spinner_failureTime_sec").val());
			} else if(chkTime == "min"){
				flTime['upper'] = parseInt($("#spinner_failureTime_min").val()) * 60;
			}
		} else {
			flTime['upper'] = 0;
		}

		/* 고장시간 체크 버튼 값 확인(시간) */
		if($("#chk_failureTime").is(":checked")){
			flTime['lower'] = parseInt($("#spinner_failureTime_hour").val()) * 3600;
		}

		$('#searchFailureHourBg').fadeOut();
		$('#searchFailureHourUp').fadeOut();
	});

	$("#searchFailureHourClose, #searchFailureHourBg, #searchFailureHourCancel").on('click',function(e){
		$('#searchFailureHourBg').fadeOut();
		$('#searchFailureHourUp').fadeOut();

		flTime = null;
		$('#chk_flTime').prop('checked',false);
	});
	$("#searchFailureHourUp").draggable({'handle' : '#searchFailureHourTitle'});
	// $('#searchFailureHourClose, #searchFailureHourCancel, #searchFailureHourBg').attr('onclick', 'closeCallBack(this)');

	/*-----------------------------------------------------------------*/

	/* 특정일자제외 화면 팝업 */
	$('#search_spDate').datepicker({
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
            $("#chk_spDate").attr("checked",true);
            spDate = selectedDate;
            if(selectedDate == ""){
            	$("#chk_spDate").attr("checked",false);
            }
        }
    });

	$('#chk_spDate').on('click',function(e){
		if( $(this).is(':checked') ){
			$('#search_spDate').datepicker("show");
		} else {
//			$('#search_spDate').val('');
		}
    });

	/* 알람등급 팝업 */
	$("#chk_alarmFilter").on('click', function(e){
		if( $(this).is(':checked') ){
			filterAlarmView(e, alarmFilter);
		} else {
			alarmFilter = 4;
		}
	});
	// $('#filterSetClose, #filterSetCancle, #filterSetBg, #filterSetUp').attr('onclick', 'closeCallBack(this)');
}

function pageSearch(){
	searchFailureAlarm();
}
function drop_down_set_fSearch(){

	//Drop down 버튼 기능
	var select_root = $('div.mu-selectbox');
	var select_value = $('.mu-value');
	var select_li = $('div.mu-selectbox>ul>li');

	// Show
	function show_option(){
		$(this).parents('div.mu-selectbox:first').toggleClass('on');
	}

	// Hover
	function i_hover(){
		$(this).parents('ul:first').children('li').removeClass('hover');
		$(this).parents('li:first').toggleClass('hover');
	}

	// Hide
	function hide_option(){
		var t = $(this);
		setTimeout(function(){
			t.parents('div.mu-selectbox:first').removeClass('on');
		}, 1);
	}

	// Set Anchor
	function set_anchor(){
		var v = $(this).text();
		var value = $(this).data('id');
		$(this).parents('ul:first').prev('.mu-value').text('').append(v);
		$(this).parents('ul:first').prev('.mu-value').val(value);
		$(this).parents('ul:first').prev('.mu-value').addClass('select');
		$(this).parents('ul:first').find('li').removeClass('active');
		$(this).addClass('active');
	}

	// Anchor Focus Out
	$('*:not("div.mu-selectbox li")').focus(function(){
		$('.mu-list').parent('.select').removeClass('on');
	});

	select_value.click(show_option);
	select_root.removeClass('on');
	select_root.mouseleave(function(){$(this).removeClass('on');});
	select_li.click(set_anchor).click(hide_option).focus(i_hover).hover(i_hover);

}

function searchFailureAlarm(){

	if($("#target_system").val() != "" && searchTargetSystemList != null && searchTargetSystemList.length != 0){
		condition = {};
		if(!flag) {
			columnSorting.beforeColNms = [];
			columnSorting.sortInfo = [];

			var sort = document.querySelectorAll('#tb_failureSearch_alarm_header .sort');

			for(var i = 0; i < sort.length; i += 1) {
				sort[i].className = 'overTxt updown sort';
			}
		}
		condition['sortOption'] = columnSorting.sortInfo;
		/* 조회대상 리스트 조건 */
		var systemIds = []; // equipType도 추가하여 조건넣음
//		var systemNames = [];
		$.each(searchTargetSystemList, function(i,e){
			systemIds.push(e['SYSTEM_ID'] + "-" +e['EQUIP_TYPE']);
//			systemNames.push(e['SYSTEM_NAME']);
		});

		/* 날짜 조건 */
		var fromTime = $("#box_search_fromtime").val();
		var toTime = $("#box_search_totime").val();

		/* 날짜 범위 */
		if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/3600 < 0){
			alert('조회 범위가 잘못되었습니다.');
			return false;
		}else if((new Date(toTime).getTime() - new Date(fromTime).getTime())/1000/60/60/24 >= 7){
			alert('최대 일주일까지 가능합니다.');
			return false;
		}

		/* DEL_FLAG(전체, 고장, 삭제) --> DEL_FLAG가 아닌 ALARM_STATE 컬럼으로 구별하기로 수정 */
		var alarmState = $("input:radio[name='rd_search_failure']:checked").val();

		/* 체크버튼 조건(미복구, 특정알람, 특정시간, 고장시간, 특정일자 제외, 알람필터 )*/
		var chkList = [];
		// if($("#chk_unRecover").is(':checked')){
		// 	if(unRecover != null){
		// 		chkList.push('unRecover');
		// 		condition['unRecover'] = unRecover;
		// 	}
		// }
		if($("#chk_spAlarm").is(':checked')){
			if(spAlarm['select'] != null){
				chkList.push('selectAlarm');
				condition['selectAlarm'] = '\'' + spAlarm['select'].join('\',\'') + '\'';
			}
			if(spAlarm['except'] != null){
				chkList.push('exceptAlarm');
				condition['exceptAlarm'] = '\'' + spAlarm['except'].join('\',\'') + '\'';
			}
		}
		if($("#chk_spTime").is(':checked')){
			if(spTime['ehour'] != null){
				chkList.push('ehour');
				condition['ehour'] = '\'' + spTime['ehour'].join('\',\'') + '\'';
			}
			if(spTime['rhour'] != null){
				chkList.push('rhour');
				condition['rhour'] = '\'' + spTime['rhour'].join('\',\'') + '\'';
			}
			if(spTime['operator'] != null){
				chkList.push('operator');
				condition['operator'] = spTime['operator'];
			}
		}
		if($("#chk_flTime").is(':checked')){
			if(flTime['upper'] != null){
				chkList.push('upper');
				condition['upper'] = flTime['upper'];
			}
			if(flTime['lower'] != null){
				chkList.push('lower');
				condition['lower'] = flTime['lower'];
			}
		}
		if($("#chk_spDate").is(':checked')){
			if(spDate != null){
				chkList.push('spDate');
				condition['spDate'] = spDate;
			}
		}

		if($("#chk_alarmFilter").is(':checked')){
			chkList.push('alarmFilter');
			condition['alarmFilter'] = alarmFilter;
		}

		if(systemIds.length == 0){
			alert('조회대상을 선택하세요.');
			return;
		}

		condition['systemIds'] = '\'' + systemIds.join('\',\'') + '\'';
		condition['fromTime'] = fromTime;
		condition['toTime'] = toTime;

		condition['alarmState'] = alarmState;

		var pageNo = $('#pageNo').val();
		var pagingNum = $('#pageSize').val();
		var totalcount = 0;
		condition['pageNo'] = (pageNo-1)*Number(pagingNum);
		condition['pagingNum'] = Number(pagingNum);
		condition['pagingFlag'] = "Y";

		$.ajax({
			cache : false,
			type : 'post',
			url : '/failureStatistic/search/failureSearch/searchFailureAlarm',
			contentType: 'application/json; charset=UTF-8',
			dataType:'json',
			data : JSON.stringify(condition),
			success: function(data) {
				if(data['searchFailureAlarmList'] != null && data['searchFailureAlarmList'].length > 0){
//					searchResData = data['searchFailureAlarmList'];
					gridSearchFailureAlarm(data['searchFailureAlarmList']);

					totalcount = data['searchFailureAlarmList'].length <= 0?0:data['searchFailureAlarmList'][0].TOTAL_COUNT;
					pagingSetting(totalcount, $('#pageNo').val(), pagingNum);
//					if(delFlag=="all"){
//						gridSearchFailureAlarm(searchResData);
//					} else {
//						var flagFilterRes = setGridTableData(delFlag,searchResData);
//						gridSearchFailureAlarm(flagFilterRes);
//					}

				} else {
					$("#tb_failureSearch_alarm tbody tr").remove();
					alert('조회된 데이터가 없습니다.');
				}
			}
		});
	} else {
		alert('조회대상을 선택하세요.');
	}
}

function gridSearchFailureAlarm(searchResults){
	var pageNo = $('#pageNo').val();
	var pagingNum = $('#pageSize').val();
	var num = (pageNo-1)*Number(pagingNum);
	$("#tb_failureSearch_alarm tbody tr").remove();
	$.each(searchResults, function(i,row) {
		num++;
		var severity = getDataConvert('NAME', 'SEVERITY', row['SEVERITY']);
		var alarmStat = getDataConvert('NAME', 'ALARM_STATE', row['ALARM_STATE']);
		var alarmType = getDataConvert('NAME', 'ALARM_TYPE', row['ALARM_TYPE']);

		var timeToRepairMinute = row['TIME_TO_REPAIR'];
		var minute = Math.floor(timeToRepairMinute / 60);
		var second = timeToRepairMinute % 60;
		var m = minute, s = second, ms = '';
		if(minute < 10) {
			m = '0' + minute;
		}
		if(second < 10) {
			s = '0' + second;
		}
		ms = m + ':' + s;

		var searchRow = "";
		searchRow += "<tr>";
		searchRow += 	"<td class='overTxt' align='center' title='" + num + "'>" + num + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + severity + "'>" + severity + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + alarmStat + "'>" + alarmStat + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + getDatetime(row['EVENT_TIME']) + "'>" + getDatetime(row['EVENT_TIME']) + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + getDatetime(row['RECOVER_TIME']) + "'>" + getDatetime(row['RECOVER_TIME']) + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['TIME_TO_REPAIR'] + "'>" + row['TIME_TO_REPAIR'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + ms + "'>" + ms + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + alarmType + "'>" + alarmType + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['VENDOR_NAME'] + "'>" + row['VENDOR_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['TEAM_NAME'] + "'>" + row['TEAM_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['FDN'] + "'>" + row['FDN'] + "</td>";
		searchRow += "</tr>";

		$("#tb_failureSearch_alarm tbody").append(searchRow);

		/* 로우별로 선택 되도록 클릭이벤트 
		var lastLine = $("#tb_failureSearch_alarm tbody tr").length;
		$("#tb_failureSearch_alarm tbody tr").eq(lastLine-1).find('td').each(function(){
			$(this).on("click",function(e){
				if($(this).parent().prop("class")==""){
					$(this).parent().prop("class","selected");
				} else if($(this).parent().prop("class")=="selected"){
					$(this).parent().prop("class","");
				}
			});
		});	*/

	});

}

function excelExport(){
	// var keyArr = ["unRecover", "selectAlarm", "exceptAlarm", "ehour", "rhour", "operator", "upper", "lower", "spDate", "systemIds", "fromTime", "toTime", "alarmState"];
	var keyArr = ["selectAlarm", "exceptAlarm", "ehour", "rhour", "operator", "upper", "lower", "spDate", "systemIds", "fromTime", "toTime", "alarmState", "alarmFilter"];

	var a = "";
	keyArr.forEach(function (v, i) {
		if(typeof condition[v] !== "undefined") {
			if(a === "") {
				a = v + "=" + condition[v];
			} else {
				a += "&" + v + "=" + condition[v];
			}
		}
	});
	var url =  "/failureStatistic/search/failureSearch/excelExport?" + a;
	$(location).attr('href', url);
}

function filterSaveSearch(flag, filterLevel) {
	alarmFilter = filterLevel === '0' ? 4 : Number(filterLevel);
}

function closeCallBack(obj) {
	//Background는 따로 처리
	if ( obj.id.indexOf('Bg') != -1 ) {
		$.each( $('.ui-draggable') ,function(i, dlg){
			if ( $(dlg).css('display') != 'none' ) {
				var idStr = dlg.id;
				if (idStr === 'setSpecificTimeUp') {  //searchHourSelect.jsp화면 (다이얼로그: dlg_hour)
					spTime = null;
					$('#table_hour li button').removeClass('active');
					$('#chk_spTime').prop('checked',false);
				} else if(idStr == 'searchFailureHourUp') { //searchFailureHour.jsp화면 (다이얼로그: searchFailureHourUp)
					flTime = null;
					$('#chk_flTime').prop('checked',false);
				} else if(idStr == 'filterSetUp') {
					$('#chk_alarmFilter').prop('checked',false);
				}
			}
		});
	//취소, 닫기 버튼 눌렀을 때는 시간 선택 UI 초기화 후, 체크박스 해제 되게함
	} else if ( obj.id.indexOf('setSpecificTime') != -1 ) {
		spTime = null;
		$('#table_hour li button').removeClass('active');
		$('#chk_spTime').prop('checked',false);
	} else if ( obj.id.indexOf('searchFailureHour') != -1 ) {
		flTime = null;
		$('#chk_flTime').prop('checked',false);
	} else if ( obj.id.indexOf('filterSet') != -1 ) {
		$('#chk_alarmFilter').prop('checked',false);
	}
}
