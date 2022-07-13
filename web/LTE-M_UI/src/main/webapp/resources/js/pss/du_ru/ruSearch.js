$(document).ready(function(){
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getRuSearchOption();
});

var RU_LOCATION = {};
var lineInfoDict= {}; //노선ID: 노선명 


function getRuSearchOption(){
	
	$.ajax({
		   type : 'post',
		   url: '/pss/du_ru/ru/getRuSearchOption',
		   dataType: "json",
		   success: function (data) {
			   
			   var ems_name = data.ruSearchOption.EMSNAME;
			   var du = data.ruSearchOption.DU;
			   var ru_type = data.ruSearchOption.RU_TYPE;
			   var team = data.ruSearchOption.TEAM;
			   var vendor = data.ruSearchOption.VENDOR;
			   var stationInfo = data.ruSearchOption.STATION_INFO;
			   var station = data.ruSearchOption.STATION;
			   RU_LOCATION = data.ruSearchOption.LOCATION;
			   var stationLine = data.ruSearchOption.STATIONLINE;
			   
			   $('#ems_enb_ul').empty();
			   $('#line_ul').empty();
			   $('#du_name_ul').empty();
			   $('#ru_type_ul').empty();
			   $('#du_Detail_team_ul').empty();
			   $('#ru_Detail_team_ul').empty();
			   $('#du_Detail_vendor_ul').empty();
			   $('#ru_Detail_vendor_ul').empty();
			   $('#du_Detail_station_ul').empty();
			   $('#ru_Detail_station_ul').empty();
			   
			   
			   $('#ru_vendor_ul_add').empty();
			   $('#ru_team_ul_add').empty();
			   $('#ru_station_ul_add').empty();
			   $('#ru_du_ul_add').empty();
			   $('#ru_location_ul_add').empty();
			   
			   
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
				   $('#ems_enb_ul').append('<li data-id ="'+value.EMS_ID+'">'+value.EMS_NAME+'</li>');
			   });
			   
			   $(du).each(function(key,value){
				   $('#du_name_ul').append('<li data-id ="'+value.DU_ID+'">'+value.DU_NAME+'</li>');
				   if(value.DU_NAME != '전체'){
					  $('#ru_du_ul_add').append('<li data-id="'+value.DU_ID+'">'+value.DU_NAME+'</li>');
				  }
			   });
			   
			   $(ru_type).each(function(key,value){
				   $('#ru_type_ul').append('<li data-id ="'+value.CONNECT_RUTYPE+'">'+value.RU_TYPE_NAME+'</li>');
			   });
			   
			   $(team).each(function(key,value){
				   $('#du_Detail_team_ul').append('<li data-id='+value.TEAM_ID+'>'+value.TEAM_NAME+'</li>');
				   $('#ru_Detail_team_ul').append('<li data-id='+value.TEAM_ID+'>'+value.TEAM_NAME+'</li>');
				   if(value.TEAM_NAME != '전체'){
					  $('#ru_team_ul_add').append('<li data-id="'+value.TEAM_ID+'">'+value.TEAM_NAME+'</li>');
				  }
			   });
			   
			   $(vendor).each(function(key,value){
				   $('#du_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   $('#ru_Detail_vendor_ul').append('<li data-id='+value.VENDOR_ID+'>'+value.VENDOR_NAME+'</li>');
				   if(value.VENDOR_NAME != '전체'){
					  $('#ru_vendor_ul_add').append('<li data-id="'+value.VENDOR_ID+'">'+value.VENDOR_NAME+'</li>');
				  }
			   });
			   
			   $.each(station,function(key,value){
				   $('#ru_station_ul_add').append('<li data-id="'+value.STATION_ID+'">'+value.STATION_NAME+'</li>');
				   $('#du_Detail_station_ul').append('<li data-id="'+value.STATION_ID+'">'+value.STATION_NAME+'</li>');
				   $('#ru_Detail_station_ul').append('<li data-id="'+value.STATION_ID+'">'+value.STATION_NAME+'</li>');
			   });
			   
			   $.each(RU_LOCATION,function(key,value){
				   $('#ru_location_ul_add').append('<li data-id="'+value.STATION_ID+'">'+value.STATION_NAME+'</li>');
			   });
			   $.each(RU_LOCATION,function (key, value) {
					$('#ru_location_detail_ul').append('<li><input type="hidden" value="' + value.STATION_ID + '"/>' + value.STATION_NAME + '</li>');
			   });
               //
			   // $.each(RU_LOCATION,function (key, value) {
				//    $('#ru_location_detail_ul').append('<li><input type="hidden" value="' + value.STATION_ID + '"/>' + value.STATION_NAME + '</li>');
			   // });

			   // var elmLi = "<li><input type='hidden' value='-1'/>미선택</li>"
			   // stationInfo.forEach(function (v, i) {
				//    elmLi += "<li><input type='hidden' value='" + v.STATION_ID + "'/>" + v.STATION_NAME + "</li>"
			   // });
			   // $("#ru_from_station_ul").append(elmLi);
			   // $("#ru_to_station_ul").append(elmLi);

				//RU 위치 변경
				changeRuLocation();
				drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getRuSearch(){
	
	var pageNo = $('#pageNo').val();
	var totalcount = 0;
	
	var option_data = {};
	
	var ems_id = $('#ems_btn').val();
	var ems_name = $('#ems_btn').text();
	var du_id = $('#du_value').val();
	var du_name = $('#du_name_value').val();
	var pagingNum = $('#pageSize').val();
	
	var obj = $('#Detail_Btn').find('i').hasClass('down');
	
	if(obj){
		option_data = {
				emsId : ems_id,
				emsName : ems_name,
				duId : $('#du_btn').val(),
				duName : $('#du_btn').text(),
				ru_type : $('#ru_type_btn').val(),
				du_cuid : $('#du_cuid_txt').val(),
				ru_cuid : $('#ru_cuid_txt').val(),
				lineId : $('#line_id').val(),
				pageNo : (pageNo-1)*Number(pagingNum),
				optionFlag : 'true',
				pagingNum : Number(pagingNum)
			};
	}else{
		option_data = {
			emsId : ems_id,
			emsName : ems_name,
			duId : du_id,
			duName : du_name,
			lineId : $('#line_id').val(),
			pageNo : (pageNo-1)*Number(pagingNum),
			optionFlag : 'false',
			pagingNum : Number(pagingNum)
		};
	}
	
	var requestData = JSON.stringify(option_data);
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/ru/getRuSearch',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			var num = (pageNo-1)*Number(pagingNum);
			$('#ruSearchGrid').empty();
			
			$(data.ruSearchData).each(function(key,value){
				num++;
				
				// 호선 명
				var LINE_NAME = '';
				if(value.LINE_ID != undefined){
					LINE_NAME = getLineName(value.LINE_ID);
				}
				
				 $('#ruSearchGrid').append("" +
						 "<tr>" +
						 	"<td>"+num+"</td>"+
						 	"<td>"+value.EMS_NAME+"</td>"+
						 	"<td style='cursor:pointer;'>" +
						 		"<a onclick='javascript:duDetailView(this)' style='color:blue;'>"+value.DU_CUID+"</a>" +
						 	"</td>"+
						 	"<td>"+value.DU_ID+"</td>"+
						 	"<td>"+value.DU_NAME+"</td>"+
						 	"<td style='cursor:pointer;'>" +
					 			"<a onclick='javascript:ruDetailView(this)' style='color:blue;'>"+value.RU_CUID+"</a>" +
					 		"</td>"+
					   		"<td>"+value.RU_TYPE_NAME+"</td>"+
					   		"<td>"+value.SERIALNUMBER+"</td>"+
					   		"<td>"+value.PLD_RU_NAME+"</td>"+
					   		"<td>"+LINE_NAME+"</td>"+
					   		/*"<td>"+value.STATION_NAME+"</td>"+*/
					   		"<td>"+value.CELL_NUM+"</td>"+
					   		"<td>"+value.SECTOR+"</td>"+
					   		"<td>"+value.PORT_ID+"</td>"+
					   		"<td>"+value.PCI+"</td>"+
					   		"<td>"+value.SEQUENCE_ID+"</td>"+
					   		"<td>"+value.FREQUENCY+"</td>"+
							"<td>"+value.UPDATE_DATE+"</td>"+
						 "</tr>"
				 );
			});
			
			totalcount = data.ruSearchData.length <= 0?0:data.ruSearchData[0].TOTAL_COUNT;
			
			if(pageNo*Number(pagingNum) > num){
				   for(var index = 0;index<(pageNo*Number(pagingNum))-num; index++){
				   $('#ruSearchGrid').append("" +
					   		"<tr style='height:31px;'>" +
						   		"<td></td>"+
						   		"<td></td>"+
						   		"<td></td>"+
						   		"<td></td>"+
						   		"<td></td>"+
						   		"<td></td>"+
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
	
	getRuSearch();
}