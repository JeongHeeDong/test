$(document).ready(function(){
	$('#filterSetClose, #filterSetCancle,#filterSetBg').on('click',function(e){
		$('#filterSetBg').fadeOut();
		$('#filterSetUp').fadeOut();

        var $chk_alarmFilter = $('#chk_alarmFilter');
        if($chk_alarmFilter.length === 1) {
            $chk_alarmFilter.prop('checked',false);
        }
	});
	//filterSet Drag 지정 정의
	$( "#filterSetUp" ).draggable({'handle' : '#filterSetTitleBox'});
	$( "#filterSetUp" ).resizable({
		animate: true
	});
});

function filterAlarmView(e, value, flag){
	$("#gridFilterFlag").val(flag); 
	if(value !== undefined) {
		if(value === 4) {
			value = 0;
		}
		$('input:radio[name="alarmRadio"]').filter('[value=' + parseInt(value, 10) + ']').prop('checked', true);
	}

	$('#filterSetBg').show().fadeIn('fast');
	$('#filterSetUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#filterSetUp').height()-50)/2
	var width = ($(window).width() - $('#filterSetUp').width())/2
	
	$('#filterSetUp').css('left',width+'px');
	$('#filterSetUp').css('top',height+'px');
	
}

//function abspos(e){
//    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
//    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
//    return this;
//}

function filterSave(){

	var flag = $('#gridFilterFlag').val();

	var filterLevel = $(':radio[name="alarmRadio"]:checked').val();
	
	if(filterLevel == 0){
		if($('#filterAlarmBtn').hasClass('mu-toggle-on')){
			$('#filterAlarmBtn').removeClass('mu-toggle-on');
		}
	}else{
		if(!$('#filterAlarmBtn').hasClass('mu-toggle-on')){
			$('#filterAlarmBtn').addClass('mu-toggle-on');
		}
	}
	
	$('#filterSetBg').fadeOut();
	$('#filterSetUp').fadeOut();

	filterSaveSearch(flag, filterLevel);
}