$(document).ready(function(){	
	configure();
	initPopup();
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getNotiData(1);
		}
	});
});

function configure(){	
	$('#search_dt_from').datepicker({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		//"setDate": new Date(),
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		onClose: function(selectedDate) {
			$('#search_dt_to').datepicker('option', 'minDate', selectedDate);
		}
	});
		
	$('#search_dt_to').datepicker({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});

	var from_dt = new Date();
	from_dt.setFullYear(from_dt.getFullYear()-1);

	$("#search_dt_from").datepicker("setDate", from_dt);
	$("#search_dt_to").datepicker("setDate", new Date());
	$('#search_dt_to').datepicker("option","minDate", from_dt);
	
	$('#search_dt_from_btn').on('click',function(e){
		$('#search_dt_from').datepicker("show");
	});
	$('#search_dt_to_btn').on('click',function(e){
		$('#search_dt_to').datepicker("show");
	});

   $('#searchOpt_ul').empty();
   $('#searchOpt_ul').append('<li value="">제목</li>');
   $('#searchOpt_ul').append('<li value="">내용</li>');
   $('#searchOpt_ul').append('<li value="">작성자</li>');
		  
   drop_down_set(); //안에서 pageSearch() 호출
}

function getNotiData(firstPage){
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
	
	var option = $('#searchOpt_btn').html();
	if ( option != '선택') {
		$.each($('#notiTable').find('th') ,function(i, th){
			if ( $(th).find('span').html() == option ) {
				option = $(th).attr('id');
				return;
			}
		});
	} else {
		option = "";
	}
		
	var word   = $('#searchWord').val();
	var optionData  = { fromDate : from, 
						toDate : to, 
						searchOpt : option, 
						searchWord : word, 
						pageNo : (pageNo-1)*pageSize,
						pageSize : pageSize
						};
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysNotiManager/getNotiData',
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
    var notiData = respDat.getNotiData.notiData;
	   
    $('#sysNotiGrid').empty();
    
   $.each(notiData, function(i, o){
	   var eventTime = new Date(o.EVENT_TIME);
	   var title    = o.NOTICE_TITLE;
	   var desc     = o.NOTICE_DESC;
	   var noticePeriod = o.NOTI_PERIOD;
	   var fromDate = moment(o.FROM_DATE, 'YYYY-MM-DD');
	   var toDate = moment(o.TO_DATE, 'YYYY-MM-DD');

	   var mainNotiYn = o.MAIN_NOTI_YN;
	   
	   if ( desc.length > 50 ) {
		   desc = desc.substring(0, 50);
		   desc += '...';
	   }
	   
	   var file     = o.FILE_NAME;
	   
	   if ( file == '첨부파일 없음' ) {
		  file = '없음';
	   } else {
		  file = '<i class="mu-icon download" onclick="goToDownload(' + '\''+ o.FILE_NAME + '\'' + ')" style="cursor:pointer"></i>';
	   }
	   
	   var id       = o.USER_ID;
   	   var date  = eventTime.format("yyyy/MM/dd HH:mm:ss");
	  
	   $('#sysNotiGrid').append(
			'<tr>'+
				'<td><input type="checkbox" name="notiChk" /></td>'+
				'<td onclick="notiReadView(this)" style="cursor:pointer;">'+ title +'</td>'+
				'<td onclick="notiReadView(this)" style="cursor:pointer;text-align:left">'+ desc +'</td>'+
				'<td >'+ mainNotiYn +'</td>'+
				'<td>'+ noticePeriod + '</td>'+
				'<td onclick="notiReadView(this)" name="userId" style="cursor:pointer;">'+ id +'</td>'+
				'<td onclick="notiReadView(this)" name="eventTime" style="cursor:pointer;">'+ date +'</td>'+
			'</tr>'
	   );
   });
}

function deleteNoti(){
	var id;
	var time;
	var checks = $('[name="notiChk"]:checked');
	var cnt = 0;
	
	if ( checks.length == 0 ) {
		alert('먼저 삭제할 데이터를 선택해주세요.');
		return;
	}
	
	$.each(checks, function(i, check){
		id = $(check).parent().parent().find('[name="userId"]').html();
		time = $(check).parent().parent().find('[name="eventTime"]').html();
		
		var optionData  = {
				ID : id,
				TIME : time
				};
		var requestData = JSON.stringify(optionData);
		
		$.ajax({
		   type : 'post',
		   url: '/system/sysNotiManager/deleteNoti',
		   contentType: 'application/json',
		   data: requestData,
		   dataType: "json",
		   async:false,
		   success: function (data) {
			   /*if ( data.result == 'OK' ) {
				   cnt++;
			   }*/
           $.alert.open("삭제하였습니다", {A: '확인'}, function(button) {
                if (!button) {
                    location.reload();
                } else {
                    location.reload();
                }
            });
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
		});
	});
	
	//alert(cnt + '개의 데이터를 삭제하였습니다.');
	//location.reload();
}

function excelDownload(){
	   var headerList = [];
	   var columnList = [];
	   var headers;
	   var columns;
	   var index=0;
	   
	   $('#notiTable thead tr th').each(function(i, th){
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
		   $.each($('#notiTable').find('th') ,function(i, th){
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
	   
	   var url =  '/system/sysNotiManager/excelDown?TITLE=공지사항_관리&HEADERS='+headers+'&COLUMNS='+columns
	   +'&fromDate='+from+'&toDate='+to+'&searchOpt='+option+'&searchWord='+word;
	   $(location).attr('href', url);
}

function pageSearch(){
	getNotiData();
}

function allCheck(){
	$.each( $('[name="notiChk"]'), function(i, chk){
		if ( $('#notiChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}

function goToDownload(fileName){
	$('#originFile').html(fileName);
	downloadFile();
}