$(document).ready(function(){	
	getProcSearchOption();
	intervalSet();
});

function getProcSearchOption(){
	$.ajax({
		   type : 'post',
		   url: '/system/sysProcManager/getProcSearchOption',
		   dataType: "json",
		   success: function (data) {
			   $('#host_name_ul').empty();
			   $('#host_name_ul').append('<li onclick="getProcData()">' + '전체' +'</li>');
			   
			   $.each(data.getProcSearchOption, function(i,v){
				   $('#host_name_ul').append('<li onclick="optionSearch(' + '\'' + v + '\'' +')">' + v +'</li>');   
			   });
			   
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function intervalSet(){
	var intervalId = setInterval("getProcData()", 1000*60);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
//	if(!$('#repeatBtn').hasClass('mu-toggle-on')){
//		$('#repeatBtn').addClass('mu-toggle-on');
//	}
	
	if ( $('#repeatBtn').find('i').hasClass('play') ) {
		$('#repeatBtn').find('i').removeClass('play')
		$('#repeatBtn').find('i').addClass('pause');
	}
	
	if ( $('#host_name_btn').html() == '전체' ) {
		getProcData();		
	} else {
		optionSearch( $('#host_name_btn').html() );
	}
}

function intervalDelete(){
	clearInterval($('#repeatBtn').val());
	$('#repeatBtn').attr('onclick','javascript:intervalSet()');
	
//	if($('#repeatBtn').hasClass('mu-toggle-on')){
//		$('#repeatBtn').removeClass('mu-toggle-on');
//	}
	if ( $('#repeatBtn').find('i').hasClass('pause') ) {
		$('#repeatBtn').find('i').removeClass('pause')
		$('#repeatBtn').find('i').addClass('play');
	}
}

function getProcData(){
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysProcManager/getProcessData',
		   dataType: "json",
		   success: function (data) {
			   setGridInfo(data);
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});
}

function optionSearch(word){
	var optionData  = { data : word };
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysProcManager/optionSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {
			   setGridInfo(data);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setGridInfo(respDat) {
 	var nowDateTime = respDat.getProcData.nowDateTime;
    var processData = respDat.getProcData.procData;
	   
    $('#nowDateTime').html('감시시간 : ' + nowDateTime);
    $('#sysProcGrid').empty();
    
    $('#activeCnt').html('0');
    $('#deactiveCnt').html('0');
   
   $.each(processData, function(i, o){
	   var no       = i+1;
	   var host     = o.HOST_NAME;
	   var ip       = o.HOST_IP;
	   var procname = o.PROCESS_NAME;
	   var procdesc = (o.PROCESS_DESC != null)? o.PROCESS_DESC : ' ';
	   var status   = o.PROCESS_STATUS;
	   
	   if ( status == 'ACT' ) {
		   status = '<i class="mu-icon alram warning"></i>';
	   } else {
		   status = '<i class="mu-icon alram critical"></i>';
	   }

	   var cpurate = 0;
	   var memrate = 0;
	   var memsize = 0;
	   
	   if ( o.CPU_RATE != null ) {
		   cpurate  = o.CPU_RATE;
		   
	   } 
	   if ( o.MEMORY_RATE != null ) {
		   memrate  = o.MEMORY_RATE;
		   
	   } 
	   if ( o.MEMORY_SIZE != null ) {
		   memsize  = o.MEMORY_SIZE;		   
	   }
	   
	   $('#sysProcGrid').append(
			'<tr>'+
				'<td>'+ status +'</td>'+
				'<td>'+ host +'</td>'+
				'<td>'+ ip +'</td>'+
				'<td>'+ procname +'</td>'+
				'<td>'+ cpurate +'</td>'+
				'<td>'+ memrate +'</td>'+
				'<td>'+ memsize +'</td>'+
				'<td>'+ procdesc +'</td>'+
			'</tr>'
	   );
	   
	   if ( status == '<i class="mu-icon alram warning"></i>' ) {
		   var cnt = $('#activeCnt').html();
		   cnt++;
		   $('#activeCnt').html(cnt);
	   }
	   else if ( status == '<i class="mu-icon alram critical"></i>' ) {
		   var cnt = $('#deactiveCnt').html();
		   cnt++;
		   $('#deactiveCnt').html(cnt);
	   }
   });
}

function refreshData() {
	if ( $('#host_name_btn').html() == '전체' ) {
		getProcData();		
	} else {
		optionSearch( $('#host_name_btn').html() );
	}
}

function pageSearch(){
	
}