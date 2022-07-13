var $alarmCheckbox = '';

$(document).ready(function(){
	$alarmCheckbox = $('input:checkbox[name="alarmCheckbox"]');

	$alarmCheckbox.change(function(e) {
		if($(this).is(':checked')) {
			if($(this).val() !== '4') {
				$('#all').prop('checked', false);
			} else {
				$('#cri').prop('checked', false);
				$('#maj').prop('checked', false);
				$('#min').prop('checked', false);
				$('#all').prop('checked', true);
			}
		}
	});

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
	$alarmCheckbox.prop('checked',false);
	value.map(function(v, i) {
		$alarmCheckbox.filter('[value=' + v + ']').prop('checked', true);
	});
	$('#filterSetBg').show().fadeIn('fast');
	$('#filterSetUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#filterSetUp').height()-50)/2
	var width = ($(window).width() - $('#filterSetUp').width())/2
	
	$('#filterSetUp').css('left',width+'px');
	$('#filterSetUp').css('top',height+'px');
	
}

function filterSave(){
	var filterLevel = [];

	for (var i = 0, len = $alarmCheckbox.length; i < len; i += 1) {
		// Take only those inputs which are checkbox
		if ($alarmCheckbox.eq(i).is(':checked')) {
			filterLevel.push($alarmCheckbox.eq(i).val());
		}
	}


	$('#filterSetBg').fadeOut();
	$('#filterSetUp').fadeOut();

	filterSaveSearch(flag, filterLevel);
}