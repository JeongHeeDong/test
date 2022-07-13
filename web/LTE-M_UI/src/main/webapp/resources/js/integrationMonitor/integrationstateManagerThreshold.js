$(document).ready(function(){
	$('#thresholdClose, #thresholdCancle,#thresholdBg').on('click',function(e){
		$('#thresholdBg').fadeOut();
		$('#thresholdUp').fadeOut();
	});
	//thresholdMod Drag 지정 정의
	$( "#thresholdUp" ).draggable({'handle' : '#thresholdTitleBox'});
	$( "#thresholdUp" ).resizable({
		animate: true
	});
	
	$('#equipSelect').change(function(){
		getEquipTypeData();
		var nonDiskEquipList = [1, 4, 7, 11, 13, 31, 32]
		if( nonDiskEquipList.includes(Number($('#equipSelect option:selected').val())) ){
			$('#disk_radio').css('display','none');
		}else{
			$('#disk_radio').css('display','');
		}
	});
	
	$("input:radio[name=type_radio]").change(function() {
		getEquipTypeData();
	});
});

function thresholdView(){
	
	$('#thresholdBg').show().fadeIn('fast');
	$('#thresholdUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#thresholdUp').height()-50)/2
	var width = ($(window).width() - $('#thresholdUp').width())/2
	
	$('#thresholdUp').css('left',width+'px');
	$('#thresholdUp').css('top',height+'px');
	
	getSysEquipList();
}

function getSysEquipList(){
	var pageFlag = $('#pageFlag').val();
	
	$.ajax({
		   type : 'post',
		   url: '/integration/monitor/sysstate/getSysThOption',
		   dataType: "json",
		   data: {pageFlag : pageFlag},
		   success: function (data) {
			   $('#equipSelect').empty();
			   
			   $(data.getSysThOption).each(function(index, value){
				   $('#equipSelect').append
				   (
						   '<option value ="'+value.NE_TYPE+'">'+value.NE_TYPE_NAME+'</option>'
				   );
			   });
			   
			   $('#equipSelect').change();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getEquipTypeData(){
	var data_type = $("input:radio[name=type_radio]:checked").val();
	var equip_type = Number($('#equipSelect option:selected').val());
	
	var requestData = 
	{
	data_type : Number(data_type), 
	equip_type : Number(equip_type)
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/integration/monitor/sysstate/getEquipTypeData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			if(data.getEquipTypeData != null){
				$('#mod_minor').val(data.getEquipTypeData.MINOR);
				$('#mod_major').val(data.getEquipTypeData.MAJOR);
				$('#mod_critical').val(data.getEquipTypeData.CRITICAL);
			}else{
				$('#mod_minor').val(0);
				$('#mod_major').val(0);
				$('#mod_critical').val(0);
			}
		},
		error: function () { 
		   //alert('에러발생');
	   }
	});
}

function threshold_save(){
	
	var data_type = $("input:radio[name=type_radio]:checked").val();
	var equip_type = Number($('#equipSelect option:selected').val());
	var minor = $('#mod_minor').val();
	var major = $('#mod_major').val();
	var critical = $('#mod_critical').val();
	
	var requestData = 
			{
			data_type : Number(data_type), 
			equip_type : Number(equip_type),
			minor : Number(minor),
			major : Number(major),
			critical : Number(critical)
			};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/integration/monitor/sysstate/thresholdEdit',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			if(data.FLAG == 1 || data.FLAG == 2){
				alert("설정 저장 성공");
				$('#thresholdBg').fadeOut();
				$('#thresholdUp').fadeOut();
				$('#rowIndex').val(9999);
				getStateData();
				
			}else{
				alert("설정 저장 실패");
			}
		},
		error: function () { 
		   //alert('에러발생');
	   }
	});
}