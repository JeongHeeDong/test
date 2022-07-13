var RU_LOCATION = {};
var lineInfoDict= {};  //노선ID: 노선명 

$(document).ready(function(){
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
//	$.ajax({
//		type: 'post',
//		url: '/pss/du_ru/ru/getRuLocation',
//		dataTpye: 'json',
//		success: function (data) {
//			RU_LOCATION = data.ruLocation;
//			getDuSearchOption();
//		},
//		error: function (data) {
//
//		}
//	});
	getDuSearchOption();
	datepickerSetting();
});

function getDuSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/du_ru/du/getDuSearchOption',
		   dataType: "json",
		   success: function (data) {
			   
			   var ems_name = data.duSearchOption.EMSNAME;
			   var du = data.duSearchOption.DU;
			   var team = data.duSearchOption.TEAM;
			   var vendor = data.duSearchOption.VENDOR;
			   var station = data.duSearchOption.STATION;
			   var stationLine = data.duSearchOption.STATIONLINE;
//			   var board_type = data.duSearchOption.BOARDTYPE;
			   
			   $('#ems_enb_ul').empty();
			   $('#line_ul').empty();
			   $('#du_ul').empty();
			   $('#du_Detail_team_ul').empty();
			   $('#ru_Detail_team_ul').empty();
			   $('#du_Detail_vendor_ul').empty();
			   $('#ru_Detail_vendor_ul').empty();
			   $('#du_Detail_station_ul').empty();
			   
			   $('#du_team_ul_add').empty();
			   $('#du_vendor_ul_add').empty();
			   $('#du_ems_ul_add').empty();
			   $('#du_station_ul_add').empty();
			   
			   
				$('#line_ul').append('<li data-id="">전체</li>');
				$.each(stationLine ,function(idx, lineinfo){
//					if(lineinfo.LINE_ID != '0'){
//						$('#line_ul').append('<li data-id='+lineinfo.LINE_ID+'>'+ lineinfo.LINE_NAME +'</li>');
//					}
					$('#line_ul').append('<li data-id='+lineinfo.LINE_ID+'>'+ lineinfo.LINE_NAME +'</li>');
				})
				
				// 추가/수정 호선 셀렉트박스 구성, lineInfoDict값입력
				$.each(stationLine ,function(idx, lineinfo){
					lineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
					srcIdx = idx
					$('#du_Detail_line_ul').append('<li data-id='+stationLine[srcIdx].LINE_ID+'>'+stationLine[srcIdx].LINE_NAME+'</li>');
					$('#du_line_ul_add').append('<li data-id="'+stationLine[srcIdx].LINE_ID+'">'+stationLine[srcIdx].LINE_NAME+'</li>');
					for(var idx;idx<stationLine.length;idx++) {
						if (stationLine[idx+1] != undefined){
							var lines = stationLine[srcIdx].LINE_ID +','+ stationLine[idx+1].LINE_ID
							var lensNm = stationLine[srcIdx].LINE_NAME +','+ stationLine[idx+1].LINE_NAME
							$('#du_Detail_line_ul').append('<li data-id='+lines+'>'+lensNm+'</li>');
							$('#du_line_ul_add').append('<li data-id="'+lines+'">'+lensNm+'</li>');
							lineInfoDict[lines] = lensNm;
						}
					}
				})
			   
			   $(ems_name).each(function(key,value){
				   
				  $('#ems_enb_ul').append('<li data-id ="'+value.EMS_ID+'">'+value.EMS_NAME+'</li>')
				  if(value.EMS_NAME != '전체'){
					  $('#du_ems_ul_add').append('<li data-id="'+value.EMS_ID+'">'+value.EMS_NAME+'</li>');
				  }
			   });
			   
			   $(du).each(function(key,value){
				   $('#du_ul').append('<li data-id ="'+value.DU_ID+'">'+value.DU_NAME+'</li>')
			   });
			   
			   $(team).each(function(key,value){
				   $('#du_Detail_team_ul').append('<li data-id='+value.TEAM_ID+'>'+value.TEAM_NAME+'</li>');
				   $('#ru_Detail_team_ul').append('<li data-id='+value.TEAM_ID+'>'+value.TEAM_NAME+'</li>');
				   $('#du_team_ul_add').append('<li data-id='+value.TEAM_ID+'>'+value.TEAM_NAME+'</li>');
			   });
			   
			   $(vendor).each(function(key,value){
				   $('#du_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   $('#ru_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   $('#du_vendor_ul_add').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
			   });
			   
			   $.each(station,function(key,value){
				   $('#du_Detail_station_ul').append('<li data-id='+value.STATION_ID+'>'+value.STATION_NAME+'</li>'); 
				   $('#du_station_ul_add').append('<li data-id='+value.STATION_ID+'>'+value.STATION_NAME+'</li>'); 
			   });

//				$(board_type).each(function(key,value){
//					$('#board_type_ul').empty();
//					$('#board_type_ul').append('<li>'+value.BD_NAME+'</li>')
//				});
			   
				drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getDuSearch(){
	
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	
	var option_data = {};
	
	var ems_name = $('#ems_enb_name').text();
	var du_id = $('#du_value').val();
	var du_name = $('#du_name_value').val();
	var pagingNum = $('#pageSize').val();
	var line_id = $('#line_id').val();
	
	var obj = $('#Detail_Btn').find('i').hasClass('down');
	
	if(obj){
		option_data = {
				lineId : line_id,
				emsName : ems_name,
				duId : du_id,
				duName : $('#du_dropdown_text').text(),
				switchType : $('#switch_value').val(),
				mcType : $('#mcType_value').val(),
				cUid : $('#c_uid_value').val(),
				vlan : $('#vlan_value').val(),
				pageNo : (pageNo-1)*Number(pagingNum),
				optionFlag : 'true',
				pagingNum : Number(pagingNum)
			};
	}else{
		option_data = {
			lineId : line_id,
			emsName : ems_name,
			duId : du_id,
			duName : du_name,
			pageNo : (pageNo-1)*Number(pagingNum),
			optionFlag : 'false',
			pagingNum : Number(pagingNum)
		};
	}
	
	var requestData = JSON.stringify(option_data);
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/du/getDuSearch',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			var num = (pageNo-1)*Number(pagingNum);
			$('#duSearchGrid').empty();
			
			$(data.duSearchData).each(function(key,value){
				num++;
				
				// 호선 명
				var LINE_NAME = '';
				if(value.LINE_ID != undefined){
					LINE_NAME = getLineName(value.LINE_ID);
				}
				
				 $('#duSearchGrid').append('' +
						 '<tr>' +
						 	'<td>'+num+'</td>'+
						 	'<td style="cursor:pointer;">' +
						 		'<a onclick="javascript:duDetailView(this)" accessId="' + value.ACCESS_ID + '" data-st="aaaa" style="color:blue;">'+value.C_UID+'</a>' +
						 	'</td>'+
						 	/*'<td>'+value.EMS_NAME+'</td>'+*/
						 	'<td>'+value.DU_ID+'</td>'+
						 	'<td>'+value.DU_NAME+'</td>'+
						 	'<td>'+LINE_NAME+'</td>'+
						 	/*'<td>'+value.STATION_NAME+'</td>'+*/
						 	'<td>'+value.CELL_CNT+'</td>'+
					   		'<td>'+value.SERIALNUMBER+'</td>'+
					   		'<td>'+value.MASTER_IP+'</td>'+
					   		'<td>'+value.MASTER_IP_2+'</td>'+ 
					   		'<td>'+value.ONM_IP+'</td>'+
					   		'<td>'+value.UPDATE_DATE+'</td>'+
						 '</tr>'
				 );
			});
			
			totalcount = data.duSearchData.length <= 0?0:data.duSearchData[0].TOTAL_COUNT;
			
			if(pageNo*Number(pagingNum) > num){
			   for(var index = 0;index<(pageNo*Number(pagingNum))-num; index++){
				   $('#duSearchGrid').append("" +
					   		"<tr style='height:31px;'>" +
						   		"<td></td>"+
						   		"<td></td>"+
						   		/*"<td></td>"+*/
						   		"<td></td>"+
						   		"<td></td>"+
						   		"<td></td>"+
						   		/*"<td></td>"+*/
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
		error:function(data){
			
		}
	});
}

function getLineName(value){
	var LINE_NAME =  '';
	if(value != undefined){
		if(value.includes(',')){
			lineList = value.split(',');
			lineNameList = []
			$.each(lineList, function(i, line) {
				if(line in lineInfoDict){
					lineNameList.push(lineInfoDict[line]);
				}else{
					lineNameList.push(line);
				}
			})
			LINE_NAME = lineNameList.splice(',');
		}else{
			if(value in lineInfoDict){
				LINE_NAME = lineInfoDict[value];
			}else{
				LINE_NAME = value;
			}
		}
	}
	return LINE_NAME;
}

function pageSearch(){
	
	getDuSearch();
}

function datepickerSetting(){
	$('#du_Detail_install_date').datepicker({
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
	
	$('#du_Detail_install_date_bnt').on('click',function(e){
		$('#du_Detail_install_date').datepicker("show");
	});
}