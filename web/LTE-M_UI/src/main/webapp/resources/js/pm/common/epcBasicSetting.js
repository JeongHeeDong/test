$(document).ready(function(){
	$('#basicSetClose, #basicSetCancle,#basicSetBg').on('click',function(e){
		$('#basicSetBg').fadeOut();
		$('#basicSetUp').fadeOut();
	});
	//basicSet Drag 지정 정의
	$( "#basicSetUp" ).draggable({'handle' : '#basicSetTitleBox'});
	$( "#basicSetUp" ).resizable({
		animate: true
	});
	
	$('#equip_except').change(function() {
		if($(this).is(':checked')){
			$('#equip_except_select').prop('disabled',false);
		}else{
			$('#equip_except_select').prop('disabled',true);
		}
	});
	
	$('#alarm_check').change(function() {
		if($(this).is(':checked')){
			$('#alarm_level').prop('disabled',false);
			$('#alarm_level_div').removeClass('disabled');
			
			$('#alarm_time').prop('disabled',false);
			$('#alarm_time_div').removeClass('disabled');
		}else{
			$('#alarm_level').prop('disabled',true);
			$('#alarm_level_div').addClass('disabled');
			
			$('#alarm_time').prop('disabled',true);
			$('#alarm_time_div').addClass('disabled');
		}
	});
});

function basicSetView(equip_type){
	
	$('#basicSetBg').show().fadeIn('fast');
	$('#basicSetUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#basicSetUp').height()-100)/2
	var width = (screen.width - $('#basicSetUp').width())/2
	
	$('#basicSetUp').css('left',width+'px');
	$('#basicSetUp').css('top',height+'px');
	
	getbasicSetting(equip_type);
	
}

function getbasicSetting(equip_type){
	
	$.ajax({
		type:'post',
		url:'/pm/monitor/getBasicSetting',
		dataTpye:'json',
		data: {
			equip_type : equip_type
		},
		success:function(data){
			var alarm = data.getBasicSetting.getaAlarm;
			
			if(alarm != null){
				$('#alarm_level').val(alarm.SEVERITY);
				$('#alarm_time').val(alarm.SOUND_TIME);
				$('#sound_level').val(alarm.SEVERITY);
				$('#sound_time').val(alarm.SOUND_TIME);
				'Y'==alarm.PLAY_FLAG?$('#alarm_check').prop('checked',true):$('#alarm_check').prop('checked',false);
				$('#alarm_check').change();
			}
		},
		error:function(data){
			
		}
	});
}

function basicSettingSave(){
	
	var requestData = {
			equip_type:"1",
			al_level : $('#alarm_level').val(),
			al_time : $('#alarm_time').val(),
			play_flag : $('#alarm_check').is(':checked')?"Y":"N"
			};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pm/monitor/basicSettingSave',
		   contentType: 'application/json',
		   dataTpye:'json',
		   data : requestData,
		   success: function (data) {
			   if(data.basicSetSaveFlag == 1 || data.basicSetSaveFlag == 2){
				   alert("설정 저장 성공");
			   }else{
				   alert("설정 저장 실패");
			   }
			   
			   $('#basicSetBg').fadeOut();
			   $('#basicSetUp').fadeOut();
			   getMaxDateTime();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	}); 
}