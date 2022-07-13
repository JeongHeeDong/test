var faultAlarmFilter = ['1'];

$(document).ready(function(){
	$('#faultAlarmFilterClose, #faultAlarmFilterCancle,#faultAlarmFilterBg').on('click',function(e){
		$('#faultAlarmFilterBg').fadeOut();
		$('#faultAlarmFilterUp').fadeOut();
	});
	//faultAlarmFilter Drag 지정 정의
	$( "#faultAlarmFilterUp" ).draggable({'handle' : '#faultAlarmFilterTitleBox'});
	$( "#faultAlarmFilterUp" ).resizable({
		animate: true
	});
});

function faultAlarmFilterView(){
	$('#faultAlarmFilterBg').show().fadeIn('fast');
	$('#faultAlarmFilterUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#faultAlarmFilterUp').height()-50)/2
	var width = ($(window).width() - $('#faultAlarmFilterUp').width())/2
	
	$('#faultAlarmFilterUp').css('left',width+'px');
	$('#faultAlarmFilterUp').css('top',height+'px');
	
	// 현재 선택된 알람 표시
	$('#faultAlarmFilterDiv input:checkbox').prop('checked', false);
	_.forEach(faultAlarmFilter, function(val, idx) {
		$('#faultAlarmFilterDiv input:checkbox[value="' + val + '"]').prop('checked', true);
	});
	
}

//function abspos(e){
//    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
//    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
//    return this;
//}

function faultAlarmfilterSave(){
	// 현재 선택된 알람 저장
	var $checkboxCheckedList = $('#faultAlarmFilterDiv input:checkbox:checked');
	if($checkboxCheckedList.length === 0) {
		alert('알람 항목을 하나 이상 선택 하세요.');
		return;
	}
	faultAlarmFilter = [];
	$checkboxCheckedList.each(function(idx, el) {
		faultAlarmFilter.push($(el).val());
	});
	if(_.indexOf(faultAlarmFilter, '2') !== -1 || _.indexOf(faultAlarmFilter, '3') !== -1) {
		$('#chk_alarm_filter').prop('checked', true);
	} else {
		$('#chk_alarm_filter').prop('checked', false);
	}
	
	$('#faultAlarmFilterBg').fadeOut();
	$('#faultAlarmFilterUp').fadeOut();
}

