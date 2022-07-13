

var searchInfo = new Object();
var totalcount = 0;
var newDate = new Date();
var yy = newDate.getFullYear();
var mm = newDate.getMonth()+1;
var dd = newDate.getDate();
var hh = newDate.getHours()-1;
hh = hh==0?24:hh;
mm = mm < 10? '0'+mm : mm;
dd = dd < 10 ? '0' + dd : dd;
function configure() {
	
	var selection=$(':radio[name="search_cal"]:checked').val();
	
	if(!$("#search_chk_spr").is(":checked")){
		$("#grid_estab th:nth-child(6)").hide();
		$("#grid_estab td:nth-child(6)").hide();
		
		$("#grid_estab th:nth-child(6)").removeClass('updown');
		$("#grid_estab th:nth-child(6)").removeClass('up');
		$("#grid_estab th:nth-child(6)").removeClass('down');
		$("#grid_estab th:nth-child(6)").addClass('updown');
		
	}else{
		$("#grid_estab th:nth-child(6)").show();
		$("#grid_estab td:nth-child(6)").show();
	}
	if(!$("#search_chk_spr_type").is(":checked")){
		$("#grid_estab th:nth-child(7)").hide();
		$("#grid_estab td:nth-child(7)").hide();
		
		$("#grid_estab th:nth-child(7)").removeClass('updown');
		$("#grid_estab th:nth-child(7)").removeClass('up');
		$("#grid_estab th:nth-child(7)").removeClass('down');
		$("#grid_estab th:nth-child(7)").addClass('updown');
		
	}else{
		$("#grid_estab th:nth-child(7)").show();
		$("#grid_estab td:nth-child(7)").show();
	}
	
	if(selection=='sum'){
		//합계이면서 모두 체크가 되어있지 않은경우
		if(!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked") && !$("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").show();
			$("#grid_estab th:nth-child(1)").show();
			$("#grid_estab td:nth-child(2)").hide();
			$("#grid_estab th:nth-child(2)").hide();
			
			$("#grid_estab th:nth-child(2)").removeClass('updown');
			$("#grid_estab th:nth-child(2)").removeClass('up');
			$("#grid_estab th:nth-child(2)").removeClass('down');
			$("#grid_estab th:nth-child(2)").addClass('updown');
		// 합계이면서 일간,시간 추세소통 둘 중 하나가 체크 되어있고 시스템이 체크되지 않은 경우
		}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && !$("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").hide();
			$("#grid_estab th:nth-child(1)").hide();
			$("#grid_estab td:nth-child(2)").show();
			$("#grid_estab th:nth-child(2)").show();
			
			$("#grid_estab th:nth-child(1)").removeClass('updown');
			$("#grid_estab th:nth-child(1)").removeClass('up');
			$("#grid_estab th:nth-child(1)").removeClass('down');
			$("#grid_estab th:nth-child(1)").addClass('updown');
		// 합계이면서 일간,시간 추세소통 둘다 체크가 되지 않고 시스템이 체크된 경우
		}else if((!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").show();
			$("#grid_estab th:nth-child(1)").show();
			$("#grid_estab td:nth-child(2)").hide();
			$("#grid_estab th:nth-child(2)").hide();
			
			$("#grid_estab th:nth-child(2)").removeClass('updown');
			$("#grid_estab th:nth-child(2)").removeClass('up');
			$("#grid_estab th:nth-child(2)").removeClass('down');
			$("#grid_estab th:nth-child(2)").addClass('updown');
		// 합계이면서 일간,시간 추세소통 둘 중 하나가 체크 되어있고 시스템이 체크된 경우
		}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").show();
			$("#grid_estab th:nth-child(1)").show();
			$("#grid_estab td:nth-child(2)").show();
			$("#grid_estab th:nth-child(2)").show();
		}
	} else if(selection=='day' || selection=='hour'){
		if(!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked") && !$("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").show();
			$("#grid_estab th:nth-child(1)").show();
			$("#grid_estab td:nth-child(2)").show();
			$("#grid_estab th:nth-child(2)").show();
		}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && !$("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").hide();
			$("#grid_estab th:nth-child(1)").hide();
			$("#grid_estab td:nth-child(2)").show();
			$("#grid_estab th:nth-child(2)").show();
			
			$("#grid_estab th:nth-child(1)").removeClass('updown');
			$("#grid_estab th:nth-child(1)").removeClass('up');
			$("#grid_estab th:nth-child(1)").removeClass('down');
			$("#grid_estab th:nth-child(1)").addClass('updown');
		}else if((!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").show();
			$("#grid_estab th:nth-child(1)").show();
			$("#grid_estab td:nth-child(2)").show();
			$("#grid_estab th:nth-child(2)").show();
		}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
			$("#grid_estab td:nth-child(1)").show();
			$("#grid_estab th:nth-child(1)").show();
			$("#grid_estab td:nth-child(2)").show();
			$("#grid_estab th:nth-child(2)").show();
		}
	}
}

function changeSortOption(){
	if(!$("#search_chk_spr").is(":checked")){
		var key = $("#grid_estab th:nth-child(6)").attr('id');
		if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1)){
			var index = columnSorting.beforeColNms.indexOf(key);
			columnSorting.sortInfo.splice(index,1);
		}
	}
	
	if(!$("#search_chk_spr_type").is(":checked")){
		var key = $("#grid_estab th:nth-child(7)").attr('id');
		if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1)){
			var index = columnSorting.beforeColNms.indexOf(key);
			columnSorting.sortInfo.splice(index,1);
		}
	}
	
	if(searchInfo.TYPE=='sum'){
		if(!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked") && !$("#search_system").is(":checked")){
			var key = $("#grid_estab th:nth-child(2)").attr('id');
			if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1)){
				var index = columnSorting.beforeColNms.indexOf(key);
				columnSorting.sortInfo.splice(index,1);
			}
		}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && !$("#search_system").is(":checked")){
			var key = $("#grid_estab th:nth-child(1)").attr('id');
			if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1)){
				var index = columnSorting.beforeColNms.indexOf(key);
				columnSorting.sortInfo.splice(index,1);
			}
		}else if((!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
			var key = $("#grid_estab th:nth-child(2)").attr('id');
			if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1)){
				var index = columnSorting.beforeColNms.indexOf(key);
				columnSorting.sortInfo.splice(index,1);
			}
		}
	} else if(searchInfo.TYPE=='day' || searchInfo.TYPE=='hour'){
		if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && !$("#search_system").is(":checked")){
			var key = $("#grid_estab th:nth-child(1)").attr('id');
			if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1)){
				var index = columnSorting.beforeColNms.indexOf(key);
				columnSorting.sortInfo.splice(index,1);
			}
		}
	}
}

function searchConfig () {
	searchInfo.PCRF_ID = ("'"+$('#search_du_hidden').val().replace(/,/g, "','")+"'")=="''"?'':("'"+$('#search_du_hidden').val().replace(/,/g, "','")+"'");
	searchInfo.T_DAY =$("#search_trend_day").is(":checked");
	searchInfo.T_HOUR = $("#search_trend_hour").is(":checked");
	searchInfo.T_DU =$("#search_system").is(":checked");
	var temp = $('#search_hour').val();
	temp = temp.replace('시','');
	searchInfo.EXCEPT_HOUR = active==''? temp:active;
	
	if(!$('#search_time').is(":checked")) searchInfo.EXCEPT_HOUR = '';
	
	searchInfo.EXCEPT_DAY =$('#search_except_day').val().replace(/-/g, '');
	searchInfo.TYPE = $('#search_estab :radio[name="search_cal"]:checked').val();
	searchInfo.SPR = $("#search_chk_spr").is(":checked");
	searchInfo.SPR_TYPE = $("#search_chk_spr_type").is(":checked");

	searchInfo.FROM = $('#search_dt_from').val().replace(/-/g, '');
	searchInfo.TO = $('#search_dt_to').val().replace(/-/g, '');
	searchInfo.pageNo =$('#pageNo').val();
	searchInfo.pageNo = (searchInfo.pageNo-1)*Number($('#pageSize').val());
	searchInfo.PACKAGE_VER = $('#pkg_version').text();
	searchInfo.PAGINGNUM = $('#pageSize').val();
	
	searchInfo.SORTOPTION = columnSorting.sortInfo;
}

function remakeTd(){

		if(!$("#search_chk_spr").is(":checked")){
			$("#grid_estab td:nth-child(6)").hide();
		}else{
			$("#grid_estab td:nth-child(6)").show();
		}
		
		if(!$("#search_chk_spr_type").is(":checked")){
			$("#grid_estab td:nth-child(7)").hide();
		}else{
			$("#grid_estab td:nth-child(7)").show();
		}

	  if(searchInfo.TYPE=='sum'){
			if(!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked") && !$("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").show();
				$("#grid_estab td:nth-child(2)").hide();
			}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && !$("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").hide();
				$("#grid_estab td:nth-child(2)").show();
			}else if((!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").show();
				$("#grid_estab td:nth-child(2)").hide();
			}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").show();
				$("#grid_estab td:nth-child(2)").show();
			}
		} else if(searchInfo.TYPE=='day' || searchInfo.TYPE=='hour'){
			if(!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked") && !$("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").show();
				$("#grid_estab td:nth-child(2)").show();
			}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && !$("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").hide();
				$("#grid_estab td:nth-child(2)").show();
			}else if((!$("#search_trend_day").is(":checked") && !$("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").show();
				$("#grid_estab td:nth-child(2)").show();
			}else if(($("#search_trend_day").is(":checked") || $("#search_trend_hour").is(":checked")) && $("#search_system").is(":checked")){
				$("#grid_estab td:nth-child(1)").show();
				$("#grid_estab td:nth-child(2)").show();
			}
		}
}

function pageSearch() {
	changeSortOption();
	searchConfig();
	searchInfo.GET = 'contents';
	
	var requestData = JSON.stringify(searchInfo);
	
	$.ajax({
		type: 'POST',
		url: '/ps/ps_epc/ps_pcrf/ps_pcrf_spr/search',
		contentType: 'application/json',
		dataType: 'html',
		data: requestData,
		beforeSend: function () {
			// 통신을 시작할때 처리
			$('#ajax_indicator').show().fadeIn('fast');
		},
		complete: function () {
			// 통신이 완료된 후 처리
			$('#ajax_indicator').fadeOut();
		},
		success: function (data) {
			$("#grid_contents").empty();
			$("#grid_contents").append($(data).find("#grid_contents").html());
			configure();
			getlength();
		},
		error: function (xhr, status, message) {
		}
	});
}

function getlength(){
	searchInfo.GET = 'length';
	
	var requestData = JSON.stringify(searchInfo);
	$.ajax({
		type: 'POST',
		url: '/ps/ps_epc/ps_pcrf/ps_pcrf_spr/search',
		contentType: 'application/json',
		dataType: 'json',
		data: requestData,
		beforeSend: function () {
			// 통신을 시작할때 처리
			$('#ajax_indicator').show().fadeIn('fast');
		},
		complete: function () {
			// 통신이 완료된 후 처리
			$('#ajax_indicator').fadeOut();
		},
		success: function (data) {
			   totalcount = data.sprInfoLength.length <= 0?0:data.sprInfoLength[0].TOT_CNT;
			   pagingSetting(totalcount, $('#pageNo').val(), searchInfo.PAGINGNUM);
			   remakeTd();
		},
		error: function (xhr, status, message) {
		}
	});
}
function excel_download(){
		searchConfig();
		var headerList = [];
		var columnList = [];
		var headers;
		var columns;
		var i=0;
		$('#grid_estab thead tr').each(function(){
			$(this).find('th').each(function(index,th){
				if($(th).css('display')!= 'none'){
					headerList[i] = th.innerHTML;
					columnList[i] = th.id;
					i++;
				}
			});
		});
		headers = headerList.join(",");
		columns = columnList.join(",");
		var temp = $('#search_hour').val();
		temp = temp.replace('시','');

		var url =  "/ps/excelDown?PAGE=SPR&HEADERS="+headers+"&COLUMNS="+columns+
				"&PCRF_ID="+searchInfo.PCRF_ID+"&T_DAY="+searchInfo.T_DAY+"&T_HOUR="+searchInfo.T_HOUR+"&FROM="+searchInfo.FROM+
				"&TO="+searchInfo.TO+"&T_DU="+searchInfo.T_DU+"&EXCEPT_HOUR="+searchInfo.EXCEPT_HOUR +"&EXCEPT_DAY="+searchInfo.EXCEPT_DAY +
				"&TYPE="+searchInfo.TYPE +"&SPR="+searchInfo.SPR+"&SPR_TYPE="+searchInfo.SPR_TYPE+
				"&TITLE=SPR_통계&SUB_TITLE=("+ searchInfo.FROM + "~"+ searchInfo.TO +")&PACKAGE_VER="+searchInfo.PACKAGE_VER;
		$(location).attr('href', url);
	}
$(document).ready(function(){
	
	$("#grid_estab th:nth-child(6)").hide();
	$("#grid_estab td:nth-child(6)").hide();
	$("#grid_estab th:nth-child(7)").hide();
	$("#grid_estab td:nth-child(7)").hide();
	$("#grid_estab th:nth-child(2)").hide();
	$("#grid_estab td:nth-child(2)").hide();
	$("#search_time").attr("checked",false);
	$('#search_dt_from').datepicker({
		dateFormat: 'yy-mm-dd',
		onClose: function( selectedDate ) {
			$( "#search_dt_to" ).datepicker( "option", "minDate", selectedDate );
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
	$('#search_dt_to').datepicker({
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
	$('#search_except_day').datepicker({
		dateFormat: 'yy-mm-dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dateFormat: 'yy-mm-dd'
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
		,onClose: function (selectedDate) {
			$("#except_day").attr("checked",true);
		}
	});

	$('#search_dt_from_btn').on('click',function(e){
		$('#search_dt_from').datepicker("show");
	});
	$('#search_dt_to_btn').on('click',function(e){
		$('#search_dt_to').datepicker("show");
	});
	$('#search_except_day_btn').on('click',function(e){
		$('#search_except_day').datepicker("show");
	});

	var toDay = yy + "-" + mm + "-" + dd;
	$('#search_dt_from').val(toDay);
	$('#search_dt_to').val(toDay);


	$('#search_hour_btn').click(function () {
		$("#dlg_hour .mu-dialog-head .title").html('특정 시간 설정');

		var temp = $('#search_hour').val();
		temp = active ? active.split(',') : [temp.replace('시', '')];
		$('#table_hour li button').removeClass('active');
		$('#table_hour li button').each(function() {
			if(_.include(temp, $(this).text())) {
				$(this).addClass('active');
			}
		});
		
		openDialog('#dlg_hour', function (fnCloseDlg) {
			active = $('#table_hour li button.active').map(function() {return $(this).text()}).get().join(',');

			if(active == '') {
				$('#search_hour').val('');
				$('#search_time').prop('checked', false);
			} else if(active.indexOf(',') < 0){
				if(active != null && active != ''){
					$('#search_hour').val(active+'시');
					$('#search_time').prop('checked',true);
				}
			} else {
				$('#search_hour').val('다중선택됨');
				$('#search_time').prop('checked',true);
			}

			fnCloseDlg();
		});
	});

	$('#search_du_btn').click(function () {
		openDialog('#dlg_du', function (fnCloseDlg) {
			var sids;
			var rows = gridEquipShow.rows();
			sidArr = _.pluck(rows, 'PCRF_NAME');
			sids = sidArr.join(",");
			$('#search_du').val(sids);
			sidArr = _.pluck(rows, 'PCRF_ID');
			sids = sidArr.join(",");
			$('#search_du_hidden').val(sids);
			fnCloseDlg();
		});
		//dialog 떳을때
		getPCRF();
	});


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
	select_root.mouseleave(function(){$(this).removeClass('on')});
	select_li.click(set_anchor).click(hide_option).focus(i_hover).hover(i_hover);
	
	$("input[name='search_cal']").change(function () {
		var selection=$(this).val();
		if(selection=='day'){
			$('#search_trend_day').prop("disabled",false);
			$('#search_trend_hour').prop("disabled",true);
		}else if(selection =='hour'){
			$('#search_trend_day').prop("disabled",true);
			$('#search_trend_hour').prop("disabled",false);
		}else {
			$('#search_trend_day').prop("disabled",false);
			$('#search_trend_hour').prop("disabled",false);
		}
		$("#search_system").attr("checked",false);
		$("#search_trend_day").attr("checked",false);
		$("#search_trend_hour").attr("checked",false);
	});
	
	$('#search_time').on('click',function(e){
		if(!$("#search_time").is(":checked")){
			$('#search_hour').val('');
			active = '';
		} else {
			$('#search_hour').val(hh+'시');
		}
	});
	$('#except_day').on('click',function(e){
		if(!$("#except_day").is(":checked")){
			$('#search_except_day').val('');
		} else {
		}
	});
	
	$("#search_trend_day").click(function() {
		$("#search_system").attr("checked",false);
		$("#search_trend_hour").attr("checked",false);
	});
	
	$("#search_trend_hour").click(function() {
		$("#search_system").attr("checked",false);
		$("#search_trend_day").attr("checked",false);
	});
	
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		pageSearch();
	});
	
	configure();
	analSearchClick();
	setting_searchEquip('PCRF');
});