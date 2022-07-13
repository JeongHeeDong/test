$(document).ready(function(){
	
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getCnEmsSearchOption();
	datepickerSetting();
});


function getCnEmsSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/epc/cnEms/getCnEmsSearchOption',
		   dataType: "json",
		   success: function (data) {
			   var vendor = data.cnEmsSearchOption.VENDOR;
			   
			   $('#cnEms_Detail_vendor_ul').empty();
			   
			   $(vendor).each(function(key,value){
				   $('#cnEms_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   $('#cnEms_vendor_ul_add').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   });
			   
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function getCnEmsSearch(){
	
	var cnEms_name = $('#cnEms_nm_value').val();
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	
	var requestData ={
			cnEms_name : cnEms_name,
			pageNo : (pageNo-1)*20,
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pss/epc/cnEms/getCnEmsSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : requestData,
		   success: function (data) {
			   
			   var num = (pageNo-1)*20;
			   $('#cnEmsGrid').empty();
			   
			   $(data.cnEmsSearchData).each(function(key,value){
					num++;
					
					$('#cnEmsGrid').append("" +
							 "<tr>" +
							 	"<td>"+num+"</td>"+
							 	"<td style='cursor:pointer;'>" +
							 		"<a onclick='javascript:cnEmsDetailView(this)'>"+value.EMS_ID+"</a>" +
							 	"</td>"+
							 	"<td>"+value.EMS_NAME+"</td>"+
							 	"<td>"+value.IP_ADDRESS+"</td>"+
							 	"<td>"+value.PORT+"</td>"+
							 	"<td>"+value.VENDOR_NAME+"</td>"+
							 	"<td>"+value.INSTALL_DATE+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   totalcount = data.cnEmsSearchData.length <= 0?0:data.cnEmsSearchData[0].TOTAL_COUNT;
			   
			   if(pageNo*20 > num){
				   for(var index = 0;index<(pageNo*20)-num; index++){
					   $('#cnEmsGrid').append("" +
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
	$('#installcnEmsDetailDateTxt').datepicker({
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
	
	$('#updatecnEmsDetailDateTxt').datepicker({
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
	
	$('#installcnEmsAddDateTxt').datepicker({
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
	
	$('#installcnEmsDetailDateBtn').on('click',function(e){
		$('#installcnEmsDetailDateTxt').datepicker("show");
	});
	
	$('#updatecnEmsDetailBtn').on('click',function(e){
		$('#updatecnEmsDetailDateTxt').datepicker("show");
	});
	
	$('#installcnEmsAddDateBtn').on('click',function(e){
		$('#installcnEmsAddDateTxt').datepicker("show");
	});
}

function pageSearch(){
	
	getCnEmsSearch();
}