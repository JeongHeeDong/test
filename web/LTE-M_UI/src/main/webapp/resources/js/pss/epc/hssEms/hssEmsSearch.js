$(document).ready(function(){
	
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getHssEmsSearchOption();
	datepickerSetting();
});


function getHssEmsSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/epc/hssEms/getHssEmsSearchOption',
		   dataType: "json",
		   success: function (data) {
			   var vendor = data.hssEmsSearchOption.VENDOR;
			   
			   $('#hssEms_Detail_vendor_ul').empty();
			   
			   $(vendor).each(function(key,value){
				   $('#hssEms_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   $('#hssEms_vendor_ul_add').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   });
			   
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function getHssEmsSearch(){
	
	var hssEms_name = $('#hssEms_nm_value').val();
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	
	var requestData ={
			hssEms_name : hssEms_name,
			pageNo : (pageNo-1)*20,
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pss/epc/hssEms/getHssEmsSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : requestData,
		   success: function (data) {
			   
			   var num = (pageNo-1)*20;
			   $('#hssEmsGrid').empty();
			   
			   $(data.hssEmsSearchData).each(function(key,value){
					num++;
					
					$('#hssEmsGrid').append("" +
							 "<tr>" +
							 	"<td>"+num+"</td>"+
							 	"<td style='cursor:pointer;'>" +
							 		"<a onclick='javascript:hssEmsDetailView(this)'>"+value.EMS_ID+"</a>" +
							 	"</td>"+
							 	"<td>"+value.EMS_NAME+"</td>"+
							 	"<td>"+value.IP_ADDRESS+"</td>"+
							 	"<td>"+value.PORT+"</td>"+
							 	"<td>"+value.VENDOR_NAME+"</td>"+
							 	"<td>"+value.INSTALL_DATE+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   totalcount = data.hssEmsSearchData.length <= 0?0:data.hssEmsSearchData[0].TOTAL_COUNT;
			   
			   if(pageNo*20 > num){
				   for(var index = 0;index<(pageNo*20)-num; index++){
					   $('#hssEmsGrid').append("" +
						   		"<tr style='height:31px;'>" +
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
						   		"</tr>"
						   );
				   }
			   }
			   
			   pagingSetting(totalcount,pageNo);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
	
}


function datepickerSetting(){
	$('#installhssEmsDetailDateTxt').datepicker({
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
	
	$('#updatehssEmsDetailDateTxt').datepicker({
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
	
	$('#installhssEmsAddDateTxt').datepicker({
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
	
	$('#installhssEmsDetailDateBtn').on('click',function(e){
		$('#installhssEmsDetailDateTxt').datepicker("show");
	});
	
	$('#updatehssEmsDetailBtn').on('click',function(e){
		$('#updatehssEmsDetailDateTxt').datepicker("show");
	});
	
	$('#installhssEmsAddDateBtn').on('click',function(e){
		$('#installhssEmsAddDateTxt').datepicker("show");
	});
}

function pageSearch(){
	
	getHssEmsSearch();
}