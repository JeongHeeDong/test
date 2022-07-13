
var etcEquipList = [];
var vendorList = []; 
$(document).ready(function(){
	
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getEtcSearchOption();
	datepickerSetting();
});


function getEtcSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/etc/getEtcSearchOption',
		   dataType: "json",
		   success: function (data) {
			   var equip_name = data.etcSearchOption.EQUIP;
			   var vendor = data.etcSearchOption.VENDOR;
			   etcEquipList = data.etcSearchOption.EQUIP;
			   vendorList = data.etcSearchOption.VENDOR;
			   $('#etc_Detail_equip_ul').empty();
			   $('#etc_Detail_vendor_ul').empty();
			   
			   $(equip_name).each(function(key,value){
				   
				  $('#etc_Detail_equip_ul').append('<li data-id ='+value.EQUIP_TYPE+'>'+value.EQUIP_NAME+'</li>')
//				  $('#etc_equip_ul_add').append('<li data-id ='+value.EQUIP_TYPE+'>'+value.EQUIP_NAME+'</li>')
				  
			   });
			   
			   $(vendor).each(function(key,value){
				   $('#etc_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
//				   $('#etc_vendor_ul_add').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   });
			   
			   drop_down_set();
			   $('#etc_equip_ul_add').children('li').click(click_equip_type);
//			   $('#etc_vendor_ul_add').children('li').click(click_equip_type);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function getEtcSearch(){
	
	var etc_name = $('#etc_nm_value').val();
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	var pagingNum = $('#pageSize').val();
	
	var requestData ={
			etc_name : etc_name,
			pageNo : (pageNo-1)*Number(pagingNum),
			pagingNum : Number(pagingNum)
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pss/etc/getEtcSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : requestData,
		   success: function (data) {
			   
			   var num = (pageNo-1)*Number(pagingNum);
			   $('#etcGrid').empty();
			   
			   $(data.etcSearchData).each(function(key,value){
					num++;
					
					$('#etcGrid').append("" +
							 "<tr>" +
							 	"<td>"+num+"</td>"+
							 	"<td>"+value.EQUIP_NAME+"</td>"+
							 	"<td>"+value.NE_NAME+"</td>"+
							 	"<td style='cursor:pointer;'>" +
							 		"<a onclick='javascript:etcDetailView(this)' style='color:blue;' accessId='" + value.ACCESS_ID + "'' data-type="+value.EQUIP_TYPE+" data-name="+value.EQUIP_NAME + ">"+value.NE_ID+"</a>" +
							 	"</td>"+
							 	"<td>"+value.IP+"</td>"+
							 	"<td>"+value.VENDOR_NAME+"</td>"+
							 	"<td>"+value.INSTALL_DATE+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   totalcount = data.etcSearchData.length <= 0?0:data.etcSearchData[0].TOTAL_COUNT;
			   
			   if(pageNo*Number(pagingNum) > num){
				   for(var index = 0;index<(pageNo*Number(pagingNum))-num; index++){
					   $('#etcGrid').append("" +
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
	$('#installetcDetailDateTxt').datepicker({
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
	
	$('#updateetcDetailDateTxt').datepicker({
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
	
	$('#installetcAddDateTxt').datepicker({
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
	
	$('#installetcDetailDateBtn').on('click',function(e){
		$('#installetcDetailDateTxt').datepicker("show");
	});
	
	$('#updateetcDetailBtn').on('click',function(e){
		$('#updateetcDetailDateTxt').datepicker("show");
	});
	
	$('#installetcAddDateBtn').on('click',function(e){
		$('#installetcAddDateTxt').datepicker("show");
	});
}

function pageSearch(){
	
	getEtcSearch();
}