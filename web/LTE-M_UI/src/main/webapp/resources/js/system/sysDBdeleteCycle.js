$(document).ready(function(){
	
	getDelData(1);
	//엔터키 검색 허용
	$('#searchWord').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getDelData(1);
		}
	});
	
	$('#sysDelPopClose, #sysDelPopCancle,#sysDelPopBg').on('click',function(e){
		$('#sysDelPopBg').fadeOut();
		$('#sysDelPopUp').fadeOut();
	});
	//sysDelPop Drag 지정 정의
	$( "#sysDelPopUp" ).draggable({'handle' : '#sysDelPopTitleBox'});
	$( "#sysDelPopUp" ).resizable({
		animate: true
	});
	
	$("input:radio[name=pop_radio]").change(function() {
		$('#del_cycle').prop('disabled',false);
		
		if($(this).val() =='N'){
			$('#del_cycle').val("");
			$('#del_cycle').prop('disabled',true);
		}
	});
	
});

function getDelData(firstPage){
	var pageNo;
	var pageSize = $('#pageSize').val();
	
	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}	var totalCount = 0;
	
	var option = $('#searchOpt option:selected').text();
	if ( option == '테이블명') {
		option = 'TABLE_NAME';
	} else if ( option == '테이블설명') {
		option = 'TABLE_DESC';
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
		   url: '/system/sysDBdeleteCycle/getDelData',
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
    var delData = respDat.getDelData;
	   
    $('#sysDelGrid').empty();
   $.each(delData, function(i, o){
	   var desc    = o.TABLE_DESC;
	   
	   //설명 100자 넘으면 자른다.
	   if ( desc.length > 100 ) {
		   desc = desc.substring(0, 100);
		   desc += '...';
	   }
	   
	   var txt = o.PARTITION_TYPE=='일별'?'일':o.PARTITION_TYPE=='월별'?'개월':o.PARTITION_TYPE=='시간별'?'시간':"";
	   
	   $('#sysDelGrid').append(
			'<tr">'+
				'<td>'+
					'<div class="mu-checkbox"><input type="checkbox" id ="check'+i+'"><label for="check'+i+'"></label></div>'+
				'</td>'+
				'<td>'+ o.TABLE_NAME +'</td>'+
				'<td name="desctd" title="'+o.TABLE_DESC+'">'+ desc +'</td>'+
				'<td>'+ o.PARTITION_TYPE +'</td>'+
				'<td data-val="'+o.PARTITION_TERM+'">'+ o.PARTITION_TERM+txt +'</td>'+
				'<td>'+ o.DELETE_DATE +'</td>'+
			'</tr>'
	   );
   });
   
   //checkBox 세팅
//   checkboxSetting("delTable");
   $('[name="desctd"]').css('text-align','left');
}

function pageSearch(){
	getDelData();
}

function excelDownload(){
	   var headerList = [];
	   var columnList = [];
	   var headers;
	   var columns;
	   var index=0;
	   
	   $('#delTable thead tr th').each(function(i, th){
		   if ( th.hasAttribute('id') ) {
			   headerList[index] = $(th).html();
			   columnList[index] = th.id;
			   index++;
		   }
	   });
	   
	   headers = headerList.join(",");
	   columns = columnList.join(",");
	   
	   var option = $('#searchOpt option:selected').text();
		if ( option == '테이블명') {
			option = 'TABLE_NAME';
		} else if ( option == '테이블설명') {
			option = 'TABLE_DESC';
		} else {
			option = '';
		}
		
	   var word   = $('#searchWord').val();
	   //var pageNo = $('#pageNo').val();
	   //pageNo = (pageNo-1)*20;
	   
	   var url =  '/system/sysDBdeleteCycle/excelDown?TITLE=DB데이터_삭제_설정&HEADERS='+headers+'&COLUMNS='+columns
	   +'&searchOpt='+option+'&searchWord='+word;
	   $(location).attr('href', url);
}


function checkboxSetting(tableName){
	var tbl = $("#"+tableName);
	// 테이블 헤더에 있는 checkbox 클릭시
    $(":checkbox:first", tbl).click(function(){
        // 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
        if( $(this).is(":checked") ){
            $(":checkbox", tbl).prop("checked", true);
        }
        else{
            $(":checkbox", tbl).prop("checked", false);
        }
        // 모든 체크박스에 change 이벤트 발생시키기                
        $(":checkbox", tbl).trigger("change");
    });
	   
	   
    $(":checkbox:not(:first)", tbl).click(function(){
        var allCnt = $(":checkbox:not(:first)", tbl).length;
        var checkedCnt = $(":checkbox:not(:first)", tbl).filter(":checked").length;
        
        // 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
        if( allCnt==checkedCnt ){
            $(":checkbox:first", tbl).prop("checked", true);
        }
        else{
            $(":checkbox:first", tbl).prop("checked", false);
        }
    }).change(function(){
        if( $(this).is(":checked") ){
            // 체크박스의 부모 > 부모 니까 tr 이 되고 tr 에 selected 라는 class 를 추가한다.
        }
        else{
        }
    });
}