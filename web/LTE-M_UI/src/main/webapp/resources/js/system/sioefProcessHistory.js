/**
 * 이벤트 플로우 프로세스 관리 js
 * 2016-04-27 ES1 Kim sung hun 
 */

$(document).ready(function(){
	getHostSelectList();
	setStatusSelBox();
	setGroupSelBox();
	setSearchTypeSelBox();
	configure();
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
}

//server 목록 가져오기
function getHostSelectList(){
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefHostList',
		   dataType: "json",
		   success: function (data) {
			   $('#host_name_ul').empty();
			   $('#host_name_ul').append('<li onclick="searchHostSet()">' + '전체' +'</li>');
		
			   _.each(data.serverList, function (value,key){
				   $('#host_name_ul').append('<li onclick="searchHostSet(' + '\'' + value['HOST_IP'] + '\'' +')">' + value['HOST_NAME'] +'</li>');
			   });
			   
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

//검색조건 셋팅
function searchHostSet(hostIp){
	$('#searchHostIp').val(hostIp);
	getHistoryList(1);
}

function setStatusSelBox(){
	$('#status_name_ul > li').remove();
	$('#status_name_ul').append('<li onclick="setSearchStatus('+'\'' +'\'' +')">' + '전체' +'</li>');
	var processStatus = ['ACT','TRM'];
	_.each(['실행','중지'], function (value,key){
		$('#status_name_ul').append('<li onclick="setSearchStatus(' + '\'' + processStatus[key]+ '\'' +')">' + value +'</li>');
	});
	$('#status_select').text('전체');
	$('#status_name_ul > li').eq(0).prop('class','ACTIVE');
	drop_down_set();
}

function setSearchStatus(value){
	$('#searchStatus').val(value);
	getHistoryList(1);
	
}

function setSearchTypeSelBox(){
	$('#search_type_ul > li').remove();
	var processType = ['procName','procDesc'];
	_.each(['프로세스 명','프로세스 설명'], function (value,key){
		$('#search_type_ul').append('<li onclick="setSearchProcType(' + '\'' + processType[key]+ '\'' +')">' + value +'</li>');
	});
	$('#type_select').text('프로세스 명');
	$('#search_type_ul > li').eq(0).prop('class','ACTIVE');
//	drop_down_set();
}

function setSearchProcType(value){
	$('#searchType').val(value);
	
}

//group select box 셋팅
function setGroupSelBox(){
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefGroupList',
		   dataType: "json",
		   success: function (data) {
			   $('#group_name_ul > li').remove();
			   $('#group_name_ul').append('<li onclick="setSearchGroup('+'\'' +'\'' +')">' + '전체' +'</li>');
			   _.each(data.groupList, function (value,key){
				   if(value.indexOf('*')=== -1){
					   $('#group_name_ul').append('<li onclick="setSearchGroup(' + '\'' + value + '\'' +')">' + value +'</li>');
				   }
			   });
				$('#group_select').text('전체');
				$('#group_name_ul > li').eq(0).prop('class','ACTIVE');
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setSearchGroup(value){
	$('#searchGroup').val(value);
	getHistoryList(1);
}

function getHistoryList(firstPage){
	
	if ( firstPage != undefined ) {
		pageNo = firstPage;
		$('#pageNo').val(firstPage);
	} else {
		pageNo = $('#pageNo').val();
	}	
	var pageSize = $('#pageSize').val();
	var totalCount = 0;
	
	var from = $('#search_dt_from').val();
	var to   = $('#search_dt_to').val();
	to += ' 23:59:59';
	
	var optionData  = { 
						fromDate : from, 
						toDate : to,  
						searchHostIp : $('#searchHostIp').val(),
						searchStatus : $('#searchStatus').val(), 
						searchGroup : $('#searchGroup').val(),
						searchType : $('#searchType').val(),
						searchValue : $('#searchValue').val(),
						pageNo : (pageNo-1)*pageSize,
						pageSize : pageSize };
	
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessHistory/sioefProcHisotryList',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {
			   setHistoryGrid(data);
			   totalCount = data.totalCnt;
			   pagingSetting(totalCount, pageNo, pageSize);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setHistoryGrid(data) {
	$('#historyTable > tr').remove();
	var actCnt = 0;
	var trmCnt = 0;
	var status;
	_.each(data.historyList,function (value,key){
		
		 if (value['CTRL_TYPE'] === 'ACT' ) {
			 status = '<i class="mu-icon alram warning"></i>';
		 } else {
			 status = '<i class="mu-icon alram critical"></i>';
		 }

		 var cmdResult = value['CTRL_RESULT'].replace('+','').replace('-','').split(' ')[0];
		 var nokComment = '';
		 if(cmdResult =='NOK'){
			 var cmdResultTooltip = value['CTRL_RESULT'].replace('+','').replace('-','').split(':');
			 nokComment = cmdResultTooltip[cmdResultTooltip.length-1];
		 }
		 var eml = ['<tr>',
		           '<td>',key+1,'</td>',
		           '<td>',value['CTRL_TIME'],'</td>',
		           '<td>',value['USER_ID'],'</td>',
		           '<td>',value['HOST_NAME'],'</td>',
		           '<td>',value['HOST_IP'],'</td>',
		           '<td>',value['SIOEF_NAME'].replace(/_#_/gi,' '),'</td>',
		           '<td>',value['PROCESS_DESC'],'</td>',
		           '<td>',value['SIOEF_PORT'],'</td>',	           
		           '<td>',value['NODE_NAME'],'</td>',
		           '<td>',value['GROUP_NAME'].replace('***','-'),'</td>',
		           '<td>',status,'</td>',
		           '<td>',value['CTRL_CMD'].replace(/_#_/gi,' '),'</td>',
		           '<td title="',nokComment,'">',cmdResult,'</td>',
		           '</tr>'].join('');
		
		 $('#historyTable').append(eml);
		 $('#historyTable').tooltip();
	});

}

function pageSearch(){
	getHistoryList();
}