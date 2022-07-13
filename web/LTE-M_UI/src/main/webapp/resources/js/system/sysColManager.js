var colthd  = [];

$(document).ready(function(){
	intervalSet();
	initPopup();
});

function intervalSet(){
	var intervalId = setInterval("getColData()", 1000*60);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
//	if(!$('#repeatBtn').hasClass('mu-toggle-on')){
//		$('#repeatBtn').addClass('mu-toggle-on');
//	}
	
	if ( $('#repeatBtn').find('i').hasClass('play') ) {
		$('#repeatBtn').find('i').removeClass('play')
		$('#repeatBtn').find('i').addClass('pause');
	}
	
	getColData();
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

function getColData(){
	var radios = $('[name="search_col"]');
	var radioflag = false;
	
	$.each(radios, function(){
		if ( $(this).is(':checked') ) {
			if ( $(this).val() != 'all' ) {
				radioflag = true;
				return;
			}
		}
	});
	
	if ( radioflag ) {
		optionSearch();
		$.ajax({
			   type : 'post',
			   url: '/system/sysColManager/getColData',
			   dataType: "json",
			   success: function (data) {
				   setFailureGrid(data);
			   },
			   error: function () { 
				   //alert('에러 발생');
			   }
		});
	} else {
		$.ajax({
			   type : 'post',
			   url: '/system/sysColManager/getColData',
			   dataType: "json",
			   success: function (data) {
				   setGridInfo(data);
				   setFailureGrid(data);
			   },
			   error: function () { 
				   //alert('에러 발생');
			   }
		});
	}
}

function optionSearch(){
	var radios = $('[name="search_col"]');
	var flag; //1 : 구성, 2 : 성능, 3 : 고장
	$.each(radios, function(){
		if ( $(this).is(':checked') ) {
			if ( $(this).val() == 'config' ) {
				flag = "1";
			}
			else if ( $(this).val() == 'perform' ) {
				flag = "2";
			}
			return;
		}
	});
	
	var optionData  = { data : flag };
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysColManager/radioSearch',
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
	var nowTime = new Date();
	var nowDate = nowTime.format("yyyy-MM-dd HH:mm:ss");
	var collectData = respDat.getColData.colData;
	var ok  = 0;
	var nok = 0;

	var thdMap = respDat.getColData.getTHD;

	$('#sysColGrid').empty();
	$('#nowDateTime').html('감시시간 : ' + nowDate);

    $.each(collectData, function(i, o){
    	var sys_id    = (o.SYSTEM_ID != null)? o.SYSTEM_ID : ' ';
    	var data_name = o.DATA_NAME;

    	var data_type;
    	if ( o.DATA_TYPE == 1 ) {
    		data_type = '구성';
    	} else if ( o.DATA_TYPE == 2) {
    		data_type = '성능';
    	}
	   
    	var colTime  = new Date(o.COLLECT_DATE); //수집시간
    	var col_date  = colTime.format("yyyy/MM/dd HH:mm:ss");
	  
    	var col_type;
    	if ( o.COLLECT_TYPE == 1 ) {
    		col_type = '실시간';
    	} else if ( o.COLLECT_TYPE == 2) {
    		col_type = '5분';
    	} else if ( o.COLLECT_TYPE == 3 ) {
    		col_type = '1시간';
    	} else if ( o.COLLECT_TYPE == 4 ) {
		   	col_type = '1일';
    	}

    	var cal_time = ( (nowTime - colTime) / 1000 ) / 60 ;
    	var col_stat;
    	$.each(thdMap, function(i, thd){
    		colthd[i] = thd;
    		
    		if ( thd.COLLECT_TYPE == o.COLLECT_TYPE ){
    			if ( cal_time <= thd.COLLECT_THD ) { 
    				//임계치보다 작거나 같은 경우, 완료
    	    		col_stat = '<i name="colstatus" class="mu-icon alram warning"></i>'; 
    	    		ok++;
    			}
    			else {
    				//임계치보다 큰 경우, 지연
    	    		col_stat = '<i name="colstatus" class="mu-icon alram critical"></i>'; 
    	    		nok++;
    			}
    		}
    	});

    	if ( col_stat.indexOf('warning') == -1) {
    		$('#sysColGrid').prepend(
    				'<tr>'+
    				'<td>'+ col_stat +'</td>'+
    				'<td name="datatype">'+ data_type +'</td>'+
    				'<td>'+ sys_id +'</td>'+
    				'<td>'+ data_name +'</td>'+
    				'<td>'+ col_type +'</td>'+
    				'<td>'+ col_date +'</td>'+
    				'</tr>'
    		);
    	} else {
    		$('#sysColGrid').append(
    				'<tr>'+
    				'<td>'+ col_stat +'</td>'+
    				'<td name="datatype">'+ data_type +'</td>'+
    				'<td>'+ sys_id +'</td>'+
    				'<td>'+ data_name +'</td>'+
    				'<td>'+ col_type +'</td>'+
    				'<td>'+ col_date +'</td>'+
    				'</tr>'
    		);    		
    	}
   });
   
   $('#okCnt').html(ok);
   $('#nokCnt').html(nok);
}

function setFailureGrid(data){
	
	var nowTime = new Date();
	$('#sysColFailureGrid').empty();
	
	var thdMap = data.getColData.getTHD;
	var failureData = data.getColData.failureData;

    $.each(failureData, function(i, o){
    	var sys_id    = (o.SYSTEM_ID != null)? o.SYSTEM_ID : ' ';
    	var data_name = o.DATA_NAME;

    	var data_type = '고장';
//    	if ( o.DATA_TYPE == 1 ) {
//    		data_type = '구성';
//    	} else if ( o.DATA_TYPE == 2) {
//    		data_type = '성능';
//    	}
	   
    	var colTime  = new Date(o.COLLECT_DATE); //수집시간
    	var col_date  = colTime.format("yyyy/MM/dd HH:mm:ss");
	  
    	var col_type;
    	if ( o.COLLECT_TYPE == 1 ) {
    		col_type = '실시간';
    	} else if ( o.COLLECT_TYPE == 2) {
    		col_type = '5분';
    	} else if ( o.COLLECT_TYPE == 3 ) {
    		col_type = '1시간';
    	} else if ( o.COLLECT_TYPE == 4 ) {
		   	col_type = '1일';
    	}

    	var cal_time = ( (nowTime - colTime) / 1000 ) / 60 ;
    	var col_stat;
    	col_stat = '<i name="colstatus" class="mu-icon alram nomal"></i>'; 

    	if ( col_stat.indexOf('warning') == -1) {
    		$('#sysColFailureGrid').prepend(
    				'<tr>'+
    				'<td>'+ col_stat +'</td>'+
    				'<td name="datatype">'+ data_type +'</td>'+
    				'<td>'+ sys_id +'</td>'+
    				'<td>'+ data_name +'</td>'+
    				'<td>'+ col_type +'</td>'+
    				'<td>'+ col_date +'</td>'+
    				'</tr>'
    		);
    	} else {
    		$('#sysColFailureGrid').append(
    				'<tr>'+
    				'<td>'+ col_stat +'</td>'+
    				'<td name="datatype">'+ data_type +'</td>'+
    				'<td>'+ sys_id +'</td>'+
    				'<td>'+ data_name +'</td>'+
    				'<td>'+ col_type +'</td>'+
    				'<td>'+ col_date +'</td>'+
    				'</tr>'
    		);    		
    	}
   });
	
}

function excelDownload(){
	   var headerList = [];
	   var columnList = [];
	   var statusList = [];
	   var headers;
	   var columns;
	   var status;
	   var flag;
	   var index=0;
	   
	   $('#colTable thead tr th').each(function(i, th){
		   if ( th.hasAttribute('id') ) {
			   headerList[index] = th.innerHTML;
			   columnList[index] = th.id;
			   index++;
		   }
	   });
	   
	   $.each($('[name="colstatus"]'), function(i, stat){
		  if ( $(stat).hasClass('warning') || $(stat).hasClass('nomal')) {
			  statusList[i] = "1";
		  } else if ( $(stat).hasClass('critical') ){
			  statusList[i] = "2";
		  }
	   });
	   
	   headers = headerList.join(",");
	   columns = columnList.join(",");
	   status  = statusList.join(",");
	   
	   var radios = $('[name="search_col"]');
	   $.each(radios, function(){
			if ( $(this).is(':checked') ) {
				if ( $(this).val() == 'config' ) {
					flag = "1";
				}
				else if ( $(this).val() == 'perform' ) {
					flag = "2";
				} 
				return;
			}
		});

	   var url =  '/system/sysColManager/excelDown?TITLE=수집관리&HEADERS='+headers+'&COLUMNS='+columns+'&STATUS='+status+'&OPTION='+flag;
	   $(location).attr('href', url);
}