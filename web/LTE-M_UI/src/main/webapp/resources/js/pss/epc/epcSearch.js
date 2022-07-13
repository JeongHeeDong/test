$(document).ready(function(){
	
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getEpcSearchOption();
	datepickerSetting();
});


function getEpcSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/epc/getEpcSearchOption',
		   dataType: "json",
		   success: function (data) {
			   var ems_name = data.epcSearchOption.EMSNAME;
			   var vendor = data.epcSearchOption.VENDOR;
			   
			   $('#mme_Detail_ems_ul, #mme_Detail_vendor_ul').empty();
			   $('#pgw_Detail_ems_ul, #pgw_Detail_vendor_ul').empty();
			   $('#hss_Detail_ems_ul, #hss_Detail_vendor_ul').empty();
			   $('#pcrf_Detail_ems_ul, #pcrf_Detail_vendor_ul').empty();
			   $('#epc_type_ul_add, #epc_ems_ul_add, #epc_vendor_ul_add').empty();
			   
			   $(ems_name).each(function(key,value){
				  $('#mme_Detail_ems_ul, #pgw_Detail_ems_ul, #hss_Detail_ems_ul, #pcrf_Detail_ems_ul, #epc_ems_ul_add').append('<li data-id ='+value.EMS_ID+'>'+value.EMS_NAME+'</li>');
			   });
			   
			   $(vendor).each(function(key,value){
				   $('#mme_Detail_vendor_ul, #pgw_Detail_vendor_ul, #hss_Detail_vendor_ul, #pcrf_Detail_vendor_ul, #epc_vendor_ul_add').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   });
			   
				$('#epc_type_ul_add').append('<li data-id ="MME">MME</li>');
				$('#epc_type_ul_add').append('<li data-id ="GW">GW</li>');
				/*$('#epc_type_ul_add').append('<li data-id ="HSS">HSS</li>');*/
				$('#epc_type_ul_add').append('<li data-id ="PCRF">HPS</li>');
				
				$('#pcrf_Detail_status').append('<li data-id ="0">미운용</li>');
				$('#pcrf_Detail_status').append('<li data-id ="1">운용</li>');
				
				$('#pgw_Detail_status').append('<li data-id ="0">미운용</li>');
				$('#pgw_Detail_status').append('<li data-id ="1">운용</li>');
				
				$('#mme_Detail_status').append('<li data-id ="0">미운용</li>');
				$('#mme_Detail_status').append('<li data-id ="1">운용</li>');

			   
			   drop_down_set(); 
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function getEpcSearch(){
	
	var epc_name = $('#epc_nm_value').val();
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	var pagingNum = $('#pageSize').val();
	
	var requestData ={
			epc_name : epc_name,
			pageNo : (pageNo-1)*Number(pagingNum),
			pagingNum : Number(pagingNum)
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pss/epc/getEpcSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : requestData,
		   success: function (data) {
			   
			   var num = (pageNo-1)*Number(pagingNum);
			   $('#epcGrid').empty();
			   var functionType = '';
			   $(data.epcSearchData).each(function(key,value){
					num++;
					
					if(value.TYPE == 'MME') functionType = '<a onclick="javascript:mmeDetailView(this)" accessId="' + value.ACCESS_ID + '" style="color:blue;">';
					else if(value.TYPE == 'GW') functionType = '<a onclick="javascript:pgwDetailView(this)" accessId="' + value.ACCESS_ID + '" style="color:blue;">';
					else if(value.TYPE == 'HSS') functionType = '<a onclick="javascript:hssDetailView(this)" accessId="' + value.ACCESS_ID + '" style="color:blue;">';
					else functionType = '<a onclick="javascript:pcrfDetailView(this)" accessId="' + value.ACCESS_ID + '" style="color:blue;">';
					
					$('#epcGrid').append("" +
							 "<tr>" +
							 	"<td>"+num+"</td>"+
							 	"<td style='cursor:pointer;'>" +
							 		functionType+value.NE_ID+"</a>" +
							 	"</td>"+
							 	"<td>"+value.NE_NAME+"</td>"+
							 	"<td>"+value.NE_IP+"</td>"+
							 	/*"<td>"+value.EMS_NAME+"</td>"+*/
							 	"<td>"+value.VENDOR_NAME+"</td>"+
							 	"<td>"+value.INSTALL_DATE+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   totalcount = data.epcSearchData.length <= 0?0:data.epcSearchData[0].TOT_COUNT;
			   
			   if(pageNo*Number(pagingNum) > num){
				   for(var index = 0;index<(pageNo*Number(pagingNum))-num; index++){
					   $('#epcGrid').append("" +
						   		"<tr style='height:31px;'>" +
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
							   		"<td></td>"+
							   		/*"<td></td>"+*/
							   		"<td></td>"+
							   		"<td></td>"+
						   		"</tr>"
						   );
				   }
			   }
			   
			   pagingSetting(totalcount, $('#pageNo').val(), pagingNum);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
	
}


function datepickerSetting(){
	$('#installMmeDetailDateTxt, #installpgwDetailDateTxt, #installhssDetailDateTxt, #installpcrfDetailDateTxt').datepicker({
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
	
	$('#updatehssDetailDateTxt').datepicker({
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
	
	$('#installepcAddDateTxt').datepicker({
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
	
	$('#installMmeDetailDateBtn, #installpgwDetailDateBtn, #installhssDetailDateBtn, #installpcrfDetailDateBtn').on('click',function(e){
		$('#installMmeDetailDateTxt').datepicker("show");
	});
	
	$('#updateMmeDetailBtn, #updatepgwDetailBtn, #updatehssDetailBtn, #updatepcrfDetailBtn').on('click',function(e){
		$('#updateMmeDetailDateTxt').datepicker("show");
	});
	
	$('#installepcAddDateBtn').on('click',function(e){
		$('#installepcAddDateTxt').datepicker("show");
	});
}

function pageSearch(){
	
	getEpcSearch();
}