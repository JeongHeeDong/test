$(document).ready(function(){
	$('#searchOpt_ul').empty();
	$('#searchOpt_ul').append('<li data-id="DB_BackType">구분</li>');
	$('#searchOpt_ul').append('<li data-id="DB_BackOption">이름</li>');
	$('#searchOpt_ul').append('<li data-id="DB_BackOption">설명</li>');
	
	initPopup();
	
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getBakData(1);
		}
	});
});

function getBakData(firstPage){
	var pageNo;
	var pageSize = $('#pageSize').val();
	
	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}	var totalCount = 0;
	
	var option = $('#searchOpt_btn').html();
	if ( option == '이름') {
		option = 'TABLE_NAME';
	} else if ( option == '설명') {
		option = 'BACKUP_DESC';
	} else if(option == '구분') {
		option = 'BACKUP_TYPE';
	} else {
		option = '';
	}
	
	var word   = '';
	if(option == 'BACKUP_TYPE'){
		word = $("input:radio[name=typeRadio]:checked").val();
	}else{
		word = $('#searchWord').val();
	}
	var optionData = {
		searchOpt : option,
		searchWord : word,
		pageNo : (pageNo-1)*pageSize,
		pageSize : pageSize
	};
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sysDBManager/getBakData',
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
    var bakData = respDat.getBakData.bakData;
	   
    $('#sysBakGrid').empty();
    
   $.each(bakData, function(i, o){
	   var type   = o.BACKUP_TYPE;
	   var name    = o.TABLE_NAME;
	   var desc    = o.BACKUP_DESC;
	   
	   //설명 100자 넘으면 자른다.
	   if ( desc.length > 100 ) {
		   desc = desc.substring(0, 100);
		   desc += '...';
	   }
	   
	   var bakDay    = o.BACKUP_DAY;
	   var expire  = o.DATA_EXPIRE;
	   var last    = o.LAST_DATE;
	   
	   var typeName = '';
	   if ( type == 1 ) {
		   typeName = 'Host';
	   } else if ( type == 2 ) {
		   typeName = 'Table';
	   }
	   
   	   var lastdate  = new Date(last);
   		   lastdate  = lastdate.format("yyyy/MM/dd HH:mm:ss");    	   

	   $('#sysBakGrid').append(
			'<tr>'+
				'<td><input type="checkbox" name="bakChk"><span class="hidden">'+ type +'</span></td>'+
				'<td>'+ name +'</td>'+
				'<td>'+ typeName +'</td>'+
				'<td name="desctd">'+ desc +'</td>'+
				'<td>'+ bakDay +'</td>'+
				'<td>'+ expire +'</td>'+
				'<td>'+ lastdate +'</td>'+
			'</tr>'
	   );
   });
   
   $('[name="desctd"]').css('text-align','left');
}

function pageSearch(){
	getBakData();
}

function delBakData(){
	var checkboxes = $('[name="bakChk"]');
	var cnt = 0;
	
	if (confirm("삭제하시겠습니까?") == true){}
	else{ return; }
	
	if ( $('[name="bakChk"]:checked').length != 0 ) {
		$.each(checkboxes, function(i, checkbox){
			var length  = checkboxes.length;
			
			if ( $(checkbox).is(':checked') ) {
				var bakType = $(checkbox).siblings().html();
				var name      = $(checkbox).parent().siblings().first().html();
				
				var optionData = {
						TYPE : bakType,
						NAME : name,
				};
				
				var requestData = JSON.stringify(optionData);
				$.ajax({
					type : 'post',
					url: '/system/sysDBManager/delBakData',
					contentType: 'application/json',
					data: requestData,
					async: false,
					dataType: "json",
					success: function (data) {
						if ( data.result == 1 ) {
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
	if ( $('[name="bakChk"]:checked').length == 0 ) {
		alert('먼저 수정할 데이터를 선택해주세요.');
	} else if ( $('[name="bakChk"]:checked').length > 1 ) {
		alert('데이터 수정은 하나씩 가능합니다.');
	} else {
		var dataName  = $('[name="bakChk"]:checked').parent().next().html();
		var bakType = $('[name="bakChk"]:checked').siblings().html();
		console.log('tataName : '+dataName);
		console.log('bakType : '+bakType);
		dbAddView();
		getOneBakData(dataName, bakType);	
	}
}

function excelDownload(){
	   var headerList = [];
	   var columnList = [];
	   var headers;
	   var columns;
	   var index=0;
	   
	   $('#bakTable thead tr th').each(function(i, th){
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
		   $.each($('#bakTable').find('th') ,function(i, th){
			   if ( $(th).html() == option ) {
				   option = $(th).attr('id');
				   return;
			   }
		   });
	   } else {
		   option = "";
	   }
	   var word   = '';
		if(option == 'BACKUP_TYPE'){
			word = $("input:radio[name=typeRadio]:checked").val();
		}else{
			word = $('#searchWord').val();
		}
	   //var pageNo = $('#pageNo').val();
	   //pageNo = (pageNo-1)*20;
	   
	   var url =  '/system/sysDBManager/excelDown?TITLE=DB백업관리&HEADERS='+headers+'&COLUMNS='+columns
	   +'&searchOpt='+option+'&searchWord='+word;
	   $(location).attr('href', url);
}

function allCheck(){
	$.each( $('[name="bakChk"]'), function(i, chk){
		if ( $('#bakChk_all').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}

function dbChangeOption(flag){
	if(flag){
		$('#searchWord').css('display','none');
		$('#searchType').css('display','');
		$('#hostRadio').prop('checked',true);
	}else{
		$('#searchWord').css('display','');
		$('#searchType').css('display','none');
	}
}