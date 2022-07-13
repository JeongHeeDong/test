$(document).ready(function(){
	
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getEmsSearchOption();
	datepickerSetting();
});


function getEmsSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/ems/info/getEmsSearchOption',
		   dataType: "json",
		   success: function (data) {
			   var vendor = data.emsSearchOption.VENDOR;
			   
			   $('#ems_Detail_vendor_ul').empty();
			   
			   $(vendor).each(function(key,value){
				   $('#ems_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   $('#ems_vendor_ul_add').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   });
			   
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function getEmsSearch(){
	
	var ems_name = $('#ems_nm_value').val();
	var equip_type = $('#emsSelect option:selected').val();
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	var pagingNum = $('#pageSize').val();
	
	var requestData ={
			ems_name : ems_name,
			pageNo : (pageNo-1)*Number(pagingNum),
			pagingNum : Number(pagingNum),
			equip_type : equip_type
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pss/ems/info/getEmsSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : requestData,
		   success: function (data) {
			   
			   var num = (pageNo-1)*Number(pagingNum);
			   $('#emsGrid').empty();
			   
			   $(data.emsSearchData).each(function(key,value){
					num++;
					
					$('#emsGrid').append("" +
							 "<tr>" +
							 	"<td>"+num+"</td>"+
							 	"<td style='cursor:pointer;'>" +
							 		"<a onclick='javascript:emsDetailView(this)' style='color:blue;' data-type="+value.EQUIP_TYPE+">"+value.EMS_ID+"</a>" +
							 	"</td>"+
							 	"<td>"+value.EMS_NAME+"</td>"+
							 	"<td style='display:none'>"+value.EQUIP_TYPE+"</td>"+
							 	"<td>"+value.IP_ADDRESS+"</td>"+
							 	"<td>"+value.PORT+"</td>"+
							 	"<td>"+value.VENDOR_NAME+"</td>"+
							 	"<td>"+value.INSTALL_DATE+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   totalcount = data.emsSearchData.length <= 0?0:data.emsSearchData[0].TOTAL_COUNT;
			   
			   if(pageNo*Number(pagingNum) > num){
				   for(var index = 0;index<(pageNo*Number(pagingNum))-num; index++){
					   $('#emsGrid').append("" +
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
			   
			   pagingSetting(totalcount, $('#pageNo').val(), pagingNum);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
	
}


function datepickerSetting(){
	$('#installemsDetailDateTxt').datepicker({
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
	
	$('#updateemsDetailDateTxt').datepicker({
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
	
	$('#installemsAddDateTxt').datepicker({
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
	
	$('#installemsDetailDateBtn').on('click',function(e){
		$('#installemsDetailDateTxt').datepicker("show");
	});
	
	$('#updateemsDetailBtn').on('click',function(e){
		$('#updateemsDetailDateTxt').datepicker("show");
	});
	
	$('#installemsAddDateBtn').on('click',function(e){
		$('#installemsAddDateTxt').datepicker("show");
	});
}

function pageSearch(){
	
	getEmsSearch();
}