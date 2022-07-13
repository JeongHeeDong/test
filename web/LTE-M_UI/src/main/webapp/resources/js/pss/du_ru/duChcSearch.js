var lineInfoDict = {};  //노선ID: 노선명
var requestData = {};// 검색 옵션

$(document).ready(function(){
	
//	$("#table").colResizable({liveDrag: true, minWidth: 50}) ;
	getSearchOption();
});

function getSearchOption(){
	$.ajax({
		type : 'post',
		url : '/pss/du_ru/chc/getSearchOption',
		dataType : "json",
		success : function(data) {
			
			var emsName = data.searchOption.EMSNAME;
			var stationLine = data.searchOption.STATIONLINE;
		   
			$('#line_ul').empty();
			$('#ems_id_ul').empty();
		   
			$('#line_ul').append('<li data-id="">전체</li>');
			$.each(stationLine ,function(idx, lineinfo){
//				if(lineinfo.LINE_ID != '0'){
//					$('#line_ul').append('<li data-id='+lineinfo.LINE_ID+'>'+ lineinfo.LINE_NAME +'</li>');
//				}
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
			
			
			$(emsName).each(function(i,value){
				$('#ems_id_ul').append('<li data-id='+value.EMS_ID+'>'+value.EMS_NAME+'</li>');
			});
			drop_down_set();
		},
		error : function() {
			// alert('에러발생');
		}
	});
}


function getLineName(value){
	var LINE_NAME =  '';
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
	return LINE_NAME;
}


function getduChcSearch(){
	
	var line_id = $('#line_id').val();
	var ems_id = $('#ems_id_btn').val();
	var du_id = $('#du_id_value').val();
	var du_name = $('#du_name_value').val();
	
	requestData ={
		lineId : line_id,
		emsId : ems_id,
		duId : du_id,
		duName : du_name
	};
	
	$.ajax({
		   type : 'post',
		   url: '/pss/du_ru/chc/getduChcSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : JSON.stringify(requestData),
		   success: function (data) {
			   var num = 0;
			   $('#du_grid').empty();
			   $(data.duChcSearchData).each(function(key,value){
					num++;
					
					var LINE_NAME = '';
					if(value.LINE_ID != undefined){
						LINE_NAME = getLineName(value.LINE_ID);
					}
					$('#du_grid').append("" +
							 "<tr style='cursor:pointer;' onclick='javascript:getChcData($(this).parent().children().index($(this)))'>" +
							 	"<td>"+num+"</td>"+
							 	"<td>"+value.EMS_ID+"</td>"+
							 	"<td>"+value.C_UID+"</td>"+
							 	"<td>"+LINE_NAME+"</td>"+
							 	"<td>"+value.DU_ID+"</td>"+
							 	"<td>"+value.DU_NAME+"</td>"+
							 	"<td>"+value.TEAM_NAME+"</td>"+
							 	"<td>"+value.SERIALNUMBER+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   if(11 > num){
				   for(var index = 0;index<11-num; index++){
					   $('#du_grid').append("" +
						   		"<tr style='height:31px;'>" +
							   		"<td></td>"+
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
			   if(num != 0){
				   getChcData(0);
			   }
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getChcData(rowIndex){
	
//	var o = $('#du_grid').children()[rowIndex];
//	
//	var line_id = $('#line_id').val();
//	var ems_id = $('#ems_id_btn').val();
//	var du_id = $('#du_id_value').val();
//	
//	var requestData ={
//			du_id : du_id,
//			ems_id : ems_id
//	};
//	
	
	var o = $('#du_grid').children()[rowIndex];
	
	var emsId = $(o).children(":eq(1)").text();
	var duId = $(o).children(":eq(4)").text();
	var duName = $(o).children(":eq(5)").text();
	
	$('#chcText').text("CHANNEL CARD 상세정보 ("+duName+")");
	
	var requestData ={
			emsId : emsId,
			duId : duId
	};
	
	$.ajax({
		   type : 'post',
		   url: '/pss/du_ru/chc/getChcSearch',
		   contentType: 'application/json',
		   dataType: "json",
		   data : JSON.stringify(requestData),
		   success: function (data) {
			   var num = 0;
			   $('#channel_grid').empty();
			   $(data.chcSearchData).each(function(key,value){
					num++;
					$('#channel_grid').append("" +
							 "<tr>" +
							 	"<td>"+num+"</td>"+
							 	"<td>"+value.UNIT_ID+"</td>"+
							 	"<td>"+value.UNITTYPE+"</td>"+
							 	"<td>"+value.PORTTYPE+"</td>"+
							 	"<td>"+value.SHELF_ID+"</td>"+
							 	"<td>"+value.SLOT_ID+"</td>"+
							 	"<td>"+value.PORT_ID+"</td>"+
							 	"<td>"+value.CASC_ID+"</td>"+
							 	"<td>"+value.SERIALNUMBER+"</td>"+
							 "</tr>"
					 );
			   });
			   
			   if(10 > num){
				   for(var index = 0;index<10-num; index++){
					   $('#channel_grid').append("" +
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
						   		"</tr>"
						   );
				   }
			   }
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}


function pageSearch(){
	
	getduChcSearch();
}