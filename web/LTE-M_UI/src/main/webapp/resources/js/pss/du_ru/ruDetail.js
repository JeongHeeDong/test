// var from = to = "-1";
var locationId = "0";

$(document).ready(function(){
	//ruDetail 숨기기 기능    
    $('#ruDetailClose, #ruDetailCancle,#ruDetailBg').on('click',function(e){
		$('#ruDetailBg').fadeOut();
		$('#ruDetailUp').fadeOut();
	});
	
    //ruDetail Drag 지정 정의
	$( "#ruDetailUp" ).draggable({'handle' : '#ruDetailTitleBox'});
	$( "#ruDetailUp" ).resizable({
		minHeight: 350,
		minWidth: 250,
		animate: true
	});
});

function changeRuLocation() {
	$("#ru_location_detail_ul").on("click", function() {
		locationId = document.querySelector("#ru_location_detail_ul > li.active > input").value;
	});

	// $("#ru_from_station_ul").on("click", function() {
	// 	from = document.querySelector("#ru_from_station_ul > li.active > input").value;
	// });
    //
	// $("#ru_to_station_ul").on("click", function() {
	// 	to = document.querySelector("#ru_to_station_ul > li.active > input").value;
	// });
}

function ruDetailView(obj){
	
	$('#ruDetailBg').show().fadeIn('fast');
	$('#ruDetailUp').show().fadeIn('fast'); 
	
	if($('#duDetailBg').css('display') == 'none'){
		var height = (screen.height - $('#ruDetailUp').height()-100)/2
		var width = (screen.width - $('#ruDetailUp').width())/2
	}else{
		var height = (screen.height - $('#ruDetailUp').height()-200)/2
		var width = (screen.width - $('#ruDetailUp').width()+200)/2
	}
	
	$('#ruDetailUp').css('left',width+'px');
	$('#ruDetailUp').css('top',height+'px');
	
	$("#ruDetailDiv").scrollTop(0);
	
	var cUid = $(obj).text();
	$('#ru_cuid').val(cUid);
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/ru/getRuDetail',
		dataTpye:'json',
		data: {
			cUid : cUid
		},
		success:function(data){
			var basicInfo = data.ruDetailData.returnBasicInfo;
			var propertiyInfo = data.ruDetailData.returnPropertyInfo;
			var locationInfo = data.ruDetailData.returnLocationInfo;
			var managerInfo = data.ruDetailData.returnManagerInfo;
			var addrInfo = data.ruDetailData.returnAddrInfo;
			
			//기본정보
			$('#ru_Detail_ru_nm').val(basicInfo.RU_NAME);
			$('#ru_Detail_team_nm').text(basicInfo.TEAM_NAME);
			$('#ru_Detail_team_nm').val(basicInfo.TEAM_ID);
			$('#ru_Detail_serial_no').val(basicInfo.SERIALNUMBER);
			$('#ru_Detail_vendor_nm').text(basicInfo.VENDOR_NAME);
			$('#ru_Detail_vendor_nm').val(basicInfo.VENDOR_ID);
			$('#ru_Detail_station_nm').val(addrInfo.STATION_ID);
			$('#ru_Detail_station_nm').text(addrInfo.STATION_NAME);
			$('#ru_Detail_p_cuid').val(basicInfo.P_CUID);
			
			//속성정보
			$('#ru_Detail_ru_type').val(propertiyInfo.TYPE);
			$('#ru_Detail_frequency').val(propertiyInfo.FREQUENCY);
			$('#ru_Detail_port').val(propertiyInfo.PORT_ID);
			$('#ru_Detail_install_date').val(propertiyInfo.INSTALL_DATE);
			$('#ru_Detail_seq_id').val(propertiyInfo.SEQUENCE_ID);
			
			//위치정보
			$('#ru_location_desc_detail').val(locationInfo.AREA_INFO);
			RU_LOCATION.map(function (v, i) {
				if(v.STATION_ID === locationInfo.LOCATION) {
					$('#ru_location_detail').val(v.STATION_ID);
					$('#ru_location_detail').text(v.STATION_NAME);
				}
			});

			//관리자 정보
			$('#ru_Detail_manager_nm').val(managerInfo.MAOPERATOR);
			$('#ru_Detail_fax').val(managerInfo.FAX_NUM);
			$('#ru_Detail_tel').val(managerInfo.TEL_NUM);
			$('#ru_Detail_mobile').val(managerInfo.MOBILE_NUM);
			
			//주소정보
			$('#ru_Detail_area').val(addrInfo.STATION_NAME);
		},
		error:function(data){
			
		}
	});
}

function ruDetail_update() {
	// if(from !== "-1" && to !== "-1") {
	// 	//두 역정보 모두 값이 있는 경우
	// 	//인접한 양쪽의 역정보만 들어있어야 한다.
	// 	subStationId = Math.abs(Number(from) - Number(to));
    //
	// 	if((from === "35" && to === "34") || (from === "34" && to === "35")) {
	// 		//노포가 34 동매가 35라 차이는 1이지만 이어져있는 역이 아니기 때문에 예외
	// 		alert("위치 정보가 잘못 입력되었습니다.");
	// 		return false;
    //
	// 	} else if((from === "35" && to === "1") || (from === "1" && to === "35")) {
	// 		//동매 - 신평의 경우 동매역 id는 35, 신평은 1이기 때문에 예외로 허용
	// 		if(location === "") {
	// 			alert("RU 위치를 입력하여야합니다.");
	// 			return false;
    //
	// 		} else if(!confirm("수정하시겠습니까?")) {
	// 			return false;
	// 		}
    //
	// 	} else if((subStationId !== 1) && (subStationId !== 0)) {
	// 		//인접한 역 id의 차이는 1이어야하므로 1이 아닌 경우 수정불가
	// 		//역 ID의 차이가 0이면 같은 역을 입력한 것이므로 해당 역으로 등록
	// 		alert("위치 정보가 잘못 입력되었습니다.");
	// 		return false;
	// 	}
	// }
    //
	// if(location === "" && (from === "-1" && to === "-1")) {
	// 	if(!confirm("수정하시겠습니까?")){
	// 		return false;
	// 	}
    //
	// } else if(location !== "" && (from !== "-1" || to !== "-1")) {
	// 	if(!confirm("수정하시겠습니까?")){
	// 		return false;
	// 	}
    //
	// } else if(location === "") {
	// 	alert("RU 위치를 입력하여야합니다.");
	// 	return false;
    //
	// } else if((from === "-1" && to === "-1")) {
	// 	alert("위치를 선택하여야합니다.");
	// 	return false;
	// }

	var data = {
			ru_name: $('#ru_Detail_ru_nm').val(),
			team_id: $('#ru_Detail_team_nm').val(),
			serial_no: $('#ru_Detail_serial_no').val(),
			vendor_id: $('#ru_Detail_vendor_nm').val(),
			manager_nm: $('#ru_Detail_manager_nm').val(),
			fax: $('#ru_Detail_fax').val(),
			tel: $('#ru_Detail_tel').val(),
			mobile: $('#ru_Detail_mobile').val(),
			c_uid:  $('#ru_cuid').val(),
			location_id: locationId,
			area_info: document.querySelector("#ru_location_desc_detail").value,
			station_id: $('#ru_Detail_station_nm').val(),
			p_cuid: $('#ru_Detail_p_cuid').val(),
		};
	
	var requestData = JSON.stringify(data);
	
	
	$.ajax({
		type:'post',
		url:'/pss/du_ru/ru/ruDetailupdate',
		contentType: 'application/json',
		dataTpye:'json',
		data : requestData,
		success:function(data){
			
			var result_code = data.ruDetailResult;
			if(result_code > 0){
				alert("수정 성공");
				pageSearch();
			}else{
				alert("수정 실패");
			}
			
			$('#ruDetailBg').fadeOut();
			$('#ruDetailUp').fadeOut();
		},
		error:function(data){
			
		}
	});
}