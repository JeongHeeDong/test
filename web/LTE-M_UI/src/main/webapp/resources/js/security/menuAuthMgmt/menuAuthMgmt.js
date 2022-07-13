$(document).ready(function (){
	menuAuthMgmt.listSize = 20;
	menuAuthMgmt.menuList();
	menuAuthMgmt.authSelect();
	menuAuthMgmt.menuAuthToggle();
});

(function () {
	$.ajax({
		type: "post",
		url: "/user/roll",
		contentType: "application/json",
		dataType:"json",
		success: function (data) {
			var selectOption = '';
			selectOption = "<option value='99'>전체</option>";
			$(data.userRoll).each(function (idx, value) {
				menuAuthMgmt.selectOption += "<option value='" + value.ROLL_ID + "'>" + value.ROLL_NAME + "</option>";
			});
			$('.userRoll').append(selectOption + menuAuthMgmt.selectOption);
		},
		error: function () {
			//alert('에러발생');
		}
	});
})();

var menuAuthMgmt = {

	selectOption: '',

	//메뉴 정보
	menuData: {},

	//메뉴명 배열
	menuArr: [],

	//권한 배열
	authArr: [],

	//검색 조건
	searchParams: {},

	//메뉴 리스트
	menuList: function () {
		menuAuthMgmt.menuArr = [];
		menuAuthMgmt.authArr = [];

		$.ajax({
			type: "post",
			url: "/security/menu/authMgmt/list",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(menuAuthMgmt.searchParams),
			success: function (data) {

				menuAuthMgmt.menuData = data.menuList;

				$('#menuAuthTable tbody').empty();
				//$('#menuAuthGridDiff').empty();

				$(menuAuthMgmt.menuData).each(function(idx,value){
					idx+=1;

					menuAuthMgmt.menuArr.push(value.MENU_ID);
					menuAuthMgmt.authArr.push(value.MENU_AUTH);

					var space = "    ";
					for(var i = 0; i < Number(value.LEVEL); i+=1) {
						space = space + "    ";
					}

					var menuName = space + value.MENU_NAME;

					$('#menuAuthTable tbody').append(
							"<tr>" +
								"<td>" + idx+ "</td>" +
								"<td class='tl'>"+ menuName.replace(/ /g, '&nbsp;') + "</td>" +
								"<td class='tl'>"+value.MENU_DESC+"</td>" +
								"<td>" +
									"<div class='mu-selectbox'>" +
										"<select name='"+value.MENU_ID + "_userRollSelect' class='mu-value userRoll' " +
											"data-id='" + value.MENU_ID + "' data-child='" + value.CHILD_YN + "' " +
											"data-parent='" + value.PARENT_ID + "'>" +
											menuAuthMgmt.selectOption +
										"</select>" +
									"</div>" +
								"</td>"+
							"</tr>"
					);

					$("select[name=" + value.MENU_ID + "_userRollSelect]").val(value.MENU_AUTH);
				});

				var trLen = $("#menuAuthTable tr").length;

				if(trLen < 21) {
					$(".gridWrap > div:first-child").removeClass("gridScrollT");
					for (var index = 0; index < 20 - trLen; index++) {
						$('#menuAuthTable tbody').append("" +
							"<tr>" +
							"<td></td>" +
							"<td></td>" +
							"<td></td>" +
							"<td></td>" +
							"</tr>"
						);
					}
				} else {
					$(".gridWrap > div:first-child").removeClass("gridScrollT");
					$(".gridWrap > div:first-child").addClass("gridScrollT");
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	authSelect: function () {
		$("select[name=authSelect]").change(function() {
			menuAuthMgmt.searchParams.authSelected = $(this).val();
			menuAuthMgmt.menuList();
		});
	},

	search: function () {
		menuAuthMgmt.searchParams.optionWord = $("#searchInput").val();
		menuAuthMgmt.menuList();
	},

	menuAuthToggle: function () {
		var id = '';
		var parent = '';
		var child = '';
		var optVal = '';

		$('#menuAuthTable tbody').on("change", "select", function () {
			var that = $(this);
			id = that.data("id");
			parent = that.data("parent");
			optVal = that.val();

			menuAuthMgmt.toggleRecur(optVal, id, parent);
		});
	},

	toggleRecur: function (optVal, id, parent) {
		var tgRecuId = '';
		var oriOptVal = '';

		//선택한 메뉴에 대해 하위 메뉴 권한 설정
		$(menuAuthMgmt.menuData).each(function (idx, value) {
			if(value.PARENT_ID == id) {
				oriOptVal = $("select[name=" + value.MENU_ID + "_userRollSelect]").val();

				if(optVal - oriOptVal < 0) {
					$("select[name=" + value.MENU_ID + "_userRollSelect]").val(optVal);
				}

				if(value.CHILD_YN === 'Y') {
					tgRecuId = value.MENU_ID;
					menuAuthMgmt.toggleRecur(optVal, tgRecuId);
				}
			}
		});

		//선택한 메뉴에 대해 상위 메뉴 권한 설정
		$(menuAuthMgmt.menuData).each(function (idx, value) {
			if(value.MENU_ID == parent) {
				oriOptVal = $("select[name=" + value.MENU_ID + "_userRollSelect]").val();

				if(optVal - oriOptVal > 0) {
					$("select[name=" + value.MENU_ID + "_userRollSelect]").val(optVal);
				}

				if(value.PARENT_ID !== '0') {
					tgRecuId = value.PARENT_ID;
					menuAuthMgmt.toggleRecur(optVal, '', tgRecuId);
				}
			}
		});
	},

	menuAuthModify: function () {
		var oriValue, tmpValue, tmp;
		var tmpArr = [];
		var modifiedAuthArr = [];

		menuAuthMgmt.menuArr.forEach(function (value, idx) {
			oriValue = menuAuthMgmt.authArr[idx];
			tmpValue = $("select[name=" + value + "_userRollSelect]").val();

			tmpArr.push(tmpValue);

			if(oriValue != tmpValue) {
				tmp = { "menuId" : menuAuthMgmt.menuArr[idx], "menuAuth" : tmpValue };
				modifiedAuthArr.push(tmp);
			}
		});

		if(modifiedAuthArr.length != 0) {
			menuAuthMgmt.authArr = tmpArr;
			var modify = $.ajax({
				type: 'POST',
				url: '/security/menu/authMgmt/modify',
				dataType: 'JSON',
				contentType: "application/json",
				data: JSON.stringify({data: modifiedAuthArr})
			});

			modify.then(function (data) {
				if(data.result === "SUCCESS") {
					alert("수정되었습니다.");
				} else {
					alert("실패하였습니다.");
				}
			});
		}
	}
};
