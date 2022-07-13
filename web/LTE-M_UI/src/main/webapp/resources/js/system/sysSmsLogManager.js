var order;

$(document).ready(function(){	
	configure();
	
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getSmsLogData(1);
		}
	});
});

function configure(){	
	$('#search_dt_from').datepicker({
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
			$('#search_dt_to').datepicker('option', 'minDate', selectedDate);
		}
	});
	
	$('#search_dt_to').datepicker({
		minDate: "+1D",
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
	
	$("#search_dt_from").datepicker().datepicker("setDate", new Date());
	$("#search_dt_to").datepicker().datepicker("setDate", new Date());
	
	$('#search_dt_from_btn').on('click',function(e){
		$('#search_dt_from').datepicker("show");
	});
	$('#search_dt_to_btn').on('click',function(e){
		$('#search_dt_to').datepicker("show");
	});
	
   $('#searchOpt_ul').empty();
   $('#searchOpt_ul').append('<li><input type="hidden" value="all" />전체</li>');
   $('#searchOpt_ul').append('<li><input type="hidden" value="userName" />이름</li>');
   $('#searchOpt_ul').append('<li><input type="hidden" value="teamName" />부서</li>');
   $('#searchOpt_ul').append('<li><input type="hidden" value="equipType" />장비타입</li>');
   $('#searchOpt_ul').append('<li><input type="hidden" value="number" />수신번호</li>');
   $('#searchOpt_ul').append('<li><input type="hidden" value="msg" />수신내용</li>');
		  
   drop_down_set(); //안에서 pageSearch() 호출
}

function getSmsLogData(firstPage){
	var pageNo;
	var pageSize = $('#pageSize').val();
	
	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}
	var totalCount = 0;
	
	var from = $('#search_dt_from').val();
	var to   = $('#search_dt_to').val();
	to += ' 23:59:59';

	var option = "",
		optionText = $('#searchOpt_btn').html();
	if ( optionText != '선택') {
		option = document.querySelector("#searchOpt_ul > li.active > input").value;
		// $.each($('#logTable').find('th') ,function(i, th){
		// 	if ( $(th).find('span').html() == option ) {
		// 		option = $(th).attr('id');
		// 		return;
		// 	}
		// });
	} else {
		option = "";
	}
		
	var word   = $('#searchWord').val();
	var optionData  = { fromDate : from, 
						toDate : to, 
						searchOpt : option, 
						searchWord : word, 
						ordering : order,
						pageNo : (pageNo-1)*pageSize,
						pageSize : pageSize
						};
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsLogManager/getSmsLogData',
		   contentType: 'application/json',
		   data: requestData,
		   dataType: "json",
		   success: function (data) {
			   setGridInfo(data);
			   totalCount = data.getTotalCnt;
			   pagingSetting(totalCount, pageNo, pageSize);
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});
}

function setGridInfo(respDat) {
    var smsLogData = respDat.getSmsLogData.logData;
	   
    $('#sysSmsLogGrid').empty();
    
   $.each(smsLogData, function(i, o){
	   var
		   eventTime = new Date(o.EVENT_TIME),
		   userId    = o.USER_ID,
		   userName  = o.USER_NAME,
		   teamName    = o.TEAM_NAME,
		   sysId     = o.SYSTEM_ID,
		   equipType = o.EQUIP_TYPE,
		   alarmCode = o.ALARM_CODE,
		   alarmName = o.ALARM_NAME,
		   ttNum     = o.TT_NUMBER,
		   ttMsg     = o.TT_MSG;
	   if (ttMsg) {
		   ttMsg = ttMsg.replace(/(?:\r\n|\r|\n)/g, '<br />');
	   }
	   
   	   var date  = eventTime.format("yyyy/MM/dd HH:mm:ss");
	  
	   $('#sysSmsLogGrid').append(
			'<tr>'+
				'<td>'+ date +'</td>'+
				'<td>'+ userName +'</td>'+
				'<td style="white-space:normal;">'+ ttNum.replace(/,/g, ', ') +'</td>'+
				'<td>'+ equipType +'</td>'+
				'<td>'+ alarmCode +'</td>'+
				'<td>'+ alarmName +'</td>'+
				'<td name="msgtd">'+ ttMsg +'</td>'+
			'</tr>'
	   );
   });
   
   $('[name="msgtd"]').css('text-align','left');
}

function excelDownload(){
	   var headerList = [];
	   var columnList = [];
	   var headers;
	   var columns;
	   var index=0;
	   
	   $('#logTable thead tr th').each(function(i, th){
		   if ( th.hasAttribute('id') ) {
			   headerList[index] = $(th).find('.th_val').html();
			   columnList[index] = th.id;
			   index++;
		   }
	   });
	   
	   headers = headerList.join(",");
	   columns = columnList.join(",");
	   
	   var from   = $('#search_dt_from').val();
	   var to     = $('#search_dt_to').val();
	   to += ' 23:59:59';
	   
	   var option = $('#searchOpt_btn').html();
	   if ( option != '선택') {
		   $.each($('#logTable').find('th') ,function(i, th){
			   if ( $(th).find('span').html() == option ) {
				   option = $(th).attr('id');
				   return;
			   }
		   });
	   } else {
		   option = "";
	   }
	   var word   = $('#searchWord').val();
//페이지 단위 출력시 주석해제
//	   var pageNo = $('#pageNo').val();
//	   pageNo = (pageNo-1)*20;
	   
//	   var url =  '/system/sysSmsLogManager/excelDown?TITLE=장애정보알림_SMS발행이력&HEADERS='+headers+'&COLUMNS='+columns
//	   +'&fromDate='+from+'&toDate='+to+'&searchOpt='+option+'&searchWord='+word+'&pageNo='+pageNo;
	   
	   var url =  '/system/sysSmsLogManager/excelDown?TITLE=장애정보알림_SMS발행이력&HEADERS='+headers+'&COLUMNS='+columns
	   +'&fromDate='+from+'&toDate='+to+'&searchOpt='+option+'&searchWord='+word;
	   $(location).attr('href', url);
}

function ordering(){
	if ( $('#order_btn').hasClass('arrow-up') ){
		order = 'up';
		$('#order_btn').removeClass('arrow-up');
		$('#order_btn').addClass('arrow-down');
	} else if ( $('#order_btn').hasClass('arrow-down') ){
		order = 'down';
		$('#order_btn').removeClass('arrow-down');
		$('#order_btn').addClass('arrow-up');		
	}
	pageSearch();
}

function pageSearch(){
	getSmsLogData();
}
