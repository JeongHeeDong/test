$(document).ready(function(){
	$('#searchOpt_ul').empty();
	$('#searchOpt_ul').append('<li>ID</li>');
	$('#searchOpt_ul').append('<li>수신시스템</li>');
	
	initPopup();
	drop_down_set(); //안에서 pageSearch() 호출
	
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getConfData(1);
		}
	});
	
});
function getConfData(firstPage){
	var pageNo;
	var pageSize = $('#pageSize').val();

	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}
	var totalCount = 0;
	
	var option = $('#searchOpt_btn').html();
	if ( option == 'ID') {
		option = 'USER_ID';
	} else if ( option == '수신시스템') {
		option = 'SYSTEM_ID';
	} else {
		option = '';
	}
	
	var word   = $('#searchWord').val();
	var optionData = {
		searchOpt : option,
		searchWord : word,
		pageNo : (pageNo-1)*pageSize,
		pageSize : pageSize
	};
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsConfManager/getConfInfo',
		   contentType: 'application/json',
		   data: requestData,
		   dataType: "json",
		   success: function (data) {
			   setGridInfo(data.getConfInfo.confInfo);
			   totalCount = data.getTotalCnt;
			   pagingSetting(totalCount, pageNo, pageSize);
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});
}

function setGridInfo(respDat) {
    var confData = respDat;
	   
    $('#sysConfGrid').empty();
    
    $.each(confData, function(i, o){
	   var id      = o.USER_ID;
	   var system  = o.SYSTEM_ID;
	   var cel     = o.TT_NUMBER;
	   var time    = o.TT_TIME;
	   var simpletext = cel;
	   
	   if(150 <= cel.length){
			simpletext = cel.substring(0,149)+'...';
		}
	   $('#sysConfGrid').append(
			'<tr>'+
				'<td><input type="checkbox" name="confChk"></td>'+
				'<td>'+ id +'</td>'+
				'<td>'+ system+'</td>'+
				'<td>'+ time+'</td>'+
				'<td><button class="mu-btn" onclick="showAlarmCode(this)">보기</button></td>'+
				'<td title="'+cel+'" data-phone="'+cel+'">'+ simpletext +'</td>'+
				'<td style="display:none;">'+ cel +'</td>'+
			'</tr>'
	   );
   });
}

function pageSearch(){
	getConfData();
}

function delConfData(){
	var checkboxes = $('[name="confChk"]:checked');
	var cnt = 0;
	
	if ( $('[name="confChk"]:checked').length != 0 ) {
		$.each(checkboxes, function(i, checkbox){
			var length  = checkboxes.length;
			
			if ( $(checkbox).is(':checked') ) {
				var id     = $(checkbox).parent().parent().children(':eq(1)').html();
				var system = $(checkbox).parent().parent().children(':eq(2)').html();
				var time = $(checkbox).parent().parent().children(':eq(3)').html();
				var optionData = {
						USER : id,
						SYSTEM : system,
						TIMES : time
				};
				
				var requestData = JSON.stringify(optionData);
				$.ajax({
					type : 'post',
					url: '/system/sysSmsConfManager/delConfData',
					contentType: 'application/json',
					data: requestData,
					dataType: "json",
					async:false,
					success: function (data) {
						if ( data.result > 0 ) {
							cnt++;
						}
					},
					error: function () { 
						//alert('에러 발생');
					}
				});
			}
			
			if ( i == length-1) {
				alert(cnt+"개 데이터를 삭제하였습니다.");
				location.reload();			
			}
		});
	} else {
		alert('먼저 삭제할 데이터를 선택해주세요.');
	}
}

function updateView() {
	if ( $('[name="confChk"]:checked').length == 0 ) {
		alert('먼저 수정할 데이터를 선택해주세요.');
	} else if ( $('[name="confChk"]:checked').length > 1 ) {
		alert('데이터 수정은 하나씩 가능합니다.');
	} else {
		var system = $('[name="confChk"]:checked').parent().parent().children(':eq(2)').html();
		var time   = $('[name="confChk"]:checked').parent().parent().children(':eq(3)').html();
		var phone  = $('[name="confChk"]:checked').parent().parent().children(':eq(6)').html();
		var user_id  = $('[name="confChk"]:checked').parent().parent().children(':eq(1)').html();
		confUpdView();
		setUpdateInfo(system, time, phone, user_id);		
	}
}

function excelDownload(){
	   var headerList = [];
	   var columnList = [];
	   var headers;
	   var columns;
	   var index=0;
	   
	   $('#confTable thead tr th').each(function(i, th){
		   if ( th.hasAttribute('id') ) {
			   headerList[index] = $(th).html();
			   columnList[index] = th.id;
			   index++;
		   }
	   });
	   
	   headers = headerList.join(",");
	   columns = columnList.join(",");
	   
	   var option = $('#searchOpt_btn').html();
	   if ( option != '선택') {
		   $.each($('#confTable').find('th') ,function(i, th){
			   if ( $(th).html() == option ) {
				   option = $(th).attr('id');
				   return;
			   }
		   });
	   } else {
		   option = "";
	   }
	   var word   = $('#searchWord').val();
	   var pageNo = $('#pageNo').val();
	   pageNo = (pageNo-1)*20;
	   
	   var url =  '/system/sysSmsConfManager/excelDown?TITLE=장애정보알림문자_권한_설정&HEADERS='+headers+'&COLUMNS='+columns
	   +'&searchOpt='+option+'&searchWord='+word+'&pageNo='+pageNo;
	   $(location).attr('href', url);
}

function allCheck(){
	$.each( $('[name="confChk"]'), function(i, chk){
		if ( $('#confChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}