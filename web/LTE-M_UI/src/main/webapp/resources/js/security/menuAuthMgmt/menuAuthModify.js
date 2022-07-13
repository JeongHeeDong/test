$(document).ready(function(){
	//계정 등록/수정 Form 닫기
	$('#menuAuthModifyClose, #menuAuthModifyCancel, #menuAuthModifyBg').on("click",function(e){
		$("#menuAuthModifyBg").fadeOut();
		$("#menuAuthModifyUp").fadeOut();
	});

	//계정 등록/수정 Form Drag 지정 정의
	$( "#menuAuthModifyUp" ).draggable({'handle' : ".dragHandle"});

	//계정 등록, 수정
	$("#menuAuthModify").click(function() {
		menuAuthModify.menuAuthModifySubmit();
	});
});

var menuAuthModify = {

	menuList : {},

	//보안 > 사용자관리 > 수정
	menuAuthModifyPop : function() {
		var params = {}, menuId = [];

		$("input[name=menuAuthCheck]").each(function(idx, value) {
			if($(this).is(":checked")) {
				menuId.push($(this).data("id"));
			}
		});

		//if(userId.length > 1) {
		//	alert("수정은 한번에 하나의 계정만 가능합니다.");
		//	return false;
		//} else if (userId.length === 0) {
		//	alert("수정할 계정을 선택해야합니다.");
		//	return false;
		//}

		//params.userId = menuId[0];

		$.ajax({
			type : "post",
			url: "/security/menuAuthMgmt/menuList",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {
				menuAuthModify.popup(data.menuList);
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	//계정 수정 팝업
	popup : function(obj) {

		var menuIdSelect = $("select[name=menuIdSelect]");
		menuIdSelect.empty().data("option");

		obj.map(function(val, idx) {
			menuIdSelect.append("<option value='" + val.MENU_ID + "'>" + val.MENU_NAME + "</option>");
		});

		//$("select[name=menuIdSelect]").val(obj.MENU_ID),
		//$("select[name=menuAuthSelect]").val(obj.MENU_AUTH)

		$('#menuAuthModifyBg').show().fadeIn('fast');
		$('#menuAuthModifyUp').show().fadeIn('fast');

		var height = (screen.height - $('#menuAuthModifyUp').height()-100)/2;
		var width = (screen.width - $('#menuAuthModifyUp').width())/2;

		$('#menuAuthModifyUp').css('left',width+'px');
		$('#menuAuthModifyUp').css('top',height+'px');
	},

	menuAuthModifySubmit : function() {

		var params = {
			menuId   : $("select[name=menuIdSelect]").val(),
			menuAuth : $("select[name=menuAuthSelect]").val()
		};

		$.ajax({
			type : "post",
			url: "/security/menu/authMgmt/modify",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {
				if(data.result === "SUCCESS") {
					pageSearch();
				} else {
					alert("권한 변경이 실패하였습니다.");
				}

			},
			error: function () {
				//alert('에러발생');
			}
		});
	}
};

function pageSearch(){
	menuAuthMgmt.menuList();
}
