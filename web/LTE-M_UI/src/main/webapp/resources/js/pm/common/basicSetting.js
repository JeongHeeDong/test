
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
			$('#deSelectEquipVal').val('');
			$('#deSelectEquipText').val('');
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
	
	$('#std_alarm_time').change(function(){
		var val = $(this).val();
		
		if(val == 0){
			$('#dateBox').css('display','none');
			$('#basicSetDateTxt').val('');
		}else{
			$('#dateBox').css('display','');
		}
		
	});
	
	$('#basicSetDateTxt').datepicker({
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
	
	$('#basicSetDateDateBtn').on('click',function(e){
		$('#basicSetDateTxt').datepicker("show");
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
			var std_alarm = data.getBasicSetting.getStdAlarm;
			var alarm = data.getBasicSetting.getaAlarm;
			
			if(alarm != null){
				$('#alarm_level').val(alarm.SEVERITY);
				$('#alarm_time').val(alarm.SOUND_TIME);
				$('#sound_level').val(alarm.SEVERITY);
				$('#sound_time').val(alarm.SOUND_TIME);
				'Y'==alarm.PLAY_FLAG?$('#alarm_check').prop('checked',true):$('#alarm_check').prop('checked',false);
				$('#alarm_check').change();
			}
			if(std_alarm != null){
				$('#std_alarm').val(std_alarm.SEVERITY);
				$('#std_alarm_time').val(std_alarm.STD_ATT);
				$('#basicSetDateTxt').val(std_alarm.STD_DATE);
			}
			$('#std_alarm_time').change();
			
			if(data.getBasicSetting.deSelectCnt > 0){
				$('#equip_except').prop('checked',true);
				$('#equip_except').change();
			}else{
				$('#equip_except').prop('checked',false);
				$('#equip_except').change();
			}
			
			var selectEquipText = '';
			var selectEquipVal = '';
			var deSelectEquipText = '';
			var deSelectEquipVal = '';
			
			$(data.getBasicSetting.equipSelectList).each(function(index,value){
				selectEquipText += value.SYSTEM_NAME+',';
				selectEquipVal += value.SYSTEM_ID+',';
			});
			
			if(selectEquipVal != ''){
				selectEquipVal = selectEquipVal.slice(0,-1);
				selectEquipText = selectEquipText.slice(0,-1);
				
				var simpletext = selectEquipText;
				if(40 < simpletext.length){
					simpletext = simpletext.substring(0,35)+'.....';
				}
				
				$('#selectEquipVal').val(selectEquipVal);
				$('#selectEquipText').val(simpletext);
				$('#selectEquipText').attr('title',selectEquipText);
			}
			
			$(data.getBasicSetting.excuteEquipSelectList).each(function(index,value){
				deSelectEquipText += value.SYSTEM_NAME+',';
				deSelectEquipVal += value.SYSTEM_ID+',';
			});
			
			if(deSelectEquipVal != ''){
				deSelectEquipVal = deSelectEquipVal.slice(0,-1);
				deSelectEquipText = deSelectEquipText.slice(0,-1);
				
				var simpletext = deSelectEquipText;
				if(23 < simpletext.length){
					simpletext = simpletext.substring(0,18)+'.....';
				}
				
				$('#deSelectEquipVal').val(deSelectEquipVal);
				$('#deSelectEquipText').val(simpletext);
				$('#deSelectEquipText').attr('title',deSelectEquipText);
			}
		},
		error:function(data){
			
		}
	});
}

function basicSettingSave(){
	var equip = $('#selectEquipVal').val().split(",");
	var deEquip = $('#deSelectEquipVal').val().split(",");
	var equipList = [];
	var deEquipList = [];
	
	for(var index in equip){
		if('' != equip[index]) equipList.push({equip_id : equip[index]});
	}
	for(var index in deEquip){
		if('' != deEquip[index]) deEquipList.push({equip_id : deEquip[index]});
	}
	
	var requestData = {
			equip_type:"2",
			al_level : $('#alarm_level').val(),
			al_time : $('#alarm_time').val(),
			std_al : $('#std_alarm').val(),
			std_al_time : $('#std_alarm_time').val(),
			std_date : $('#basicSetDateTxt').val(),
			play_flag : $('#alarm_check').is(':checked')?"Y":"N",
			equipList : equipList,
			deEquipList : deEquipList,
		};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pm/monitor/basicSettingSave',
		   contentType: 'application/json',
		   dataTpye:'json',
		   data : requestData,
		   success: function (data) {
			   if(data.basicSetSaveFlag != 0){
				   alert("설정 저장 성공");
			   }else{
				   alert("설정 저장 실패");
			   }
			   
			   $('#basicSetBg').fadeOut();
			   $('#basicSetUp').fadeOut();
			   getSearchData();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	}); 
}