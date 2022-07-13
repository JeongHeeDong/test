$(document).ready(function(){
	//Datepicker 초기화
	logMgmt.datepickerSetting();

	logMgmt.listSize = 20;
	logMgmt.listSizeSetting();
	pageSearch();
});

var logMgmt = {

	//검색 조건
	searchParams : {},

	//한 페이지에 보여줄 리스트 개수
	listSize : 0,

	//리스트 사이즈
	listSizeSetting : function() {
		$("#pageSize").change(function() {
			logMgmt.listSize = $(this).val();
			logMgmt.logList();
		});
	},

	//사용자 리스트
	logList : function() {

		var pageNo = $('#pageNo').val(), totalcount = 0;

		logMgmt.searchParams.pageNo = (pageNo-1)*logMgmt.listSize;
		logMgmt.searchParams.pageSize = logMgmt.listSize;
		logMgmt.searchParams.startEventTime = $('#start-date').val();
		logMgmt.searchParams.endEventTime = $('#end-date').val();

		$.ajax({
			type : "post",
			url: "/security/log/logMgmt/list",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(logMgmt.searchParams),
			success: function (data) {

				data = data.logList;

				var num = (pageNo-1)*logMgmt.listSize;
				$('#logGrid').empty();

				$(data).each(function(key,value){
					num++;

					$('#logGrid').append(
							"<tr>" +
							"<td>"+value.USER_ID+"</td>"+
							"<td>"+value.USER_NAME+"</td>"+
							"<td>"+value.IP+"</td>"+
							"<td>"+value.MENU_NAME+"</td>"+
							"<td>"+value.EVENT_TIME+"</td>"+
							"</tr>"
					);
				});

				totalcount = data.length <= 0?0:data[0].TOTAL_COUNT;

				if(pageNo*logMgmt.listSize > num){
					for(var index = 0;index<(pageNo*logMgmt.listSize)-num; index++){
						$('#logGrid').append("" +
								"<tr style='height:31px;'>" +
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"</tr>"
						);
					}
				}

				//if($("#logTable tr").length < 21) {
				//	$(".gridWrap > div:first-child").removeClass("gridScrollT");
				//} else {
				//	$(".gridWrap > div:first-child").removeClass("gridScrollT");
				//	$(".gridWrap > div:first-child").addClass("gridScrollT");
				//}

				/*
				var tbl = $("#logTable");
				// 테이블 헤더에 있는 checkbox 클릭시
				$(":checkbox:first", tbl).click(function(){
					// 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
					if( $(this).is(":checked") ){
						$(":checkbox", tbl).prop("checked", true);
					}
					else{
						$(":checkbox", tbl).prop("checked", false);
					}
					// 모든 체크박스에 change 이벤트 발생시키기
					$(":checkbox", tbl).trigger("change");
				});


				$(":checkbox:not(:first)", tbl).click(function(){
					var allCnt = $(":checkbox:not(:first)", tbl).length;
					var checkedCnt = $(":checkbox:not(:first)", tbl).filter(":checked").length;

					// 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
					if( allCnt==checkedCnt ){
						$(":checkbox:first", tbl).prop("checked", true);
					}
					else{
						$(":checkbox:first", tbl).prop("checked", false);
					}
				}).change(function(){
					if( $(this).is(":checked") ){
						// 체크박스의 부모 > 부모 니까 tr 이 되고 tr 에 selected 라는 class 를 추가한다.
					}
					else{
					}
				});
*/
				pagingSetting(totalcount,pageNo,logMgmt.listSize);

				if(logMgmt.listSize != 50) {
					$(".gridWrap > div:first-child").removeClass("gridScrollT");
				} else {
					if(!$(".gridWrap > div:first-child").hasClass("gridScrollT")) {
						$(".gridWrap > div:first-child").addClass("gridScrollT");
					}
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	datepickerSetting : function() {
		$("#start-date").datepicker({
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

		$('#end-date').datepicker({
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

		$("#start-date-btn").on("click",function(e){
			var visible = $("#ui-datepicker-div").is(":visible");
			$("#start-date.hasDatepicker").css("position", "relative").css("zIndex", "9999");
			$("#start-date").datepicker(visible ? 'hide' : 'show');
		});


		$("#end-date-btn").on("click",function(e){
			var visible = $("#ui-datepicker-div").is(":visible");
			$("#end-date.hasDatepicker").css("position", "relative").css("zIndex", "9999");
			$("#end-date").datepicker(visible ? 'hide' : 'show');
		});

		$('#start-date').val($.datepicker.formatDate('yy-mm-dd', new Date()));
		$('#end-date').val($.datepicker.formatDate('yy-mm-dd', new Date()));
	},

	search : function() {

		logMgmt.searchParams.option = $("select[name=searchOptSelect]").val();
		logMgmt.searchParams.optionWord = $("#searchInput").val();

		btnSearchClick();
	}
};

function pageSearch(){
	logMgmt.logList();
}
