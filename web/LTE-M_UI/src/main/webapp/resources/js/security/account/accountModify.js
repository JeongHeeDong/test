$(document).ready(function(){
	//계정 등록/수정 Form 닫기
	$('#accountModifyClose, #accountModifyCancel, #accountModifyBg').on("click",function(){
		$("#accountModifyBg").fadeOut();
		$("#accountModifyUp").fadeOut();
	});

	//계정 등록/수정 Form Drag 지정 정의
	$( "#accountModifyUp" ).draggable({'handle' : ".dragHandle"});

	//계정 등록, 수정
	$("#accountModify").click(function() {
		accountModify.accountModifySubmit();
	});

	//등록 Form 확인
	$(".mu-input").blur(function() {
		var id = $(this).attr("id");
		var value = document.getElementById(id).value;
		accountModify.formValidation(id, value);
	});
	
    
    $('#userId').change(function(e) {
        var $idMsg = $("#idMsg");
            $idMsg.text(accountRegister.msgText[5]);
            $idMsg.css("display", "inline-block");
            $idMsg.css("color", "red");
            accountRegister.duplicationCheckFlag = 5;
    }); 
    	
});

(function () {
	$.ajax({
		type : "post",
		url: "/user/roll",
		contentType: "application/json",
		dataType:"json",
		success: function (data) {
			var selectOption = '';
			$(data.userRoll).each(function (idx, value) {
				selectOption += "<option value='" + value.ROLL_ID + "'>" + value.ROLL_NAME + "</option>";
			});
			$('select[name=modifyUserAuth]').append(selectOption);
		},
		error: function () {
			//alert('에러발생');
		}
	});
})();

var accountModify = {

	//0: 사용자 이름, 이름이 없는 경우 false, 이름이 있으면 true
	//1: 현재 비밀번호 => 현재 비밀번호와 비교하는 로직 제외. 항상 true로 함
	//2: 변경할 비밀번호 => 비밀번호가 있고 패턴에 적절하면 true, 아니면 false
	//3: Email. 기본은 True(이메일 값을 입력하지 않아도 됨. False가 되는 경우는 이메일 양식이 잘못됐을 경우)
	flag : [false, true, false, false],
	submitFlag : false,
	msgText : [
		"",
		"현재 비밀번호를 입력하여야합니다",
		"비밀번호가 일치하지 않습니다.",
		"필수 정보입니다",
		"9자 이상, 문자/숫자/특수문자를 포함하여 등록하세요",
		"변경할 비밀번호를 입력하여야합니다.",
		"이메일 양식에 맞지 않습니다.",
		"필수 정보입니다.",
		"기존 비밀번호와 다른 비밀번호를 입력하세요."],

	//보안 > 사용자관리 > 수정
	accountModifyPop : function() {
		var params = {}, userId = [];

		$("input[name=accountCheck]").each(function(idx, value) {
			if($(this).is(":checked")) {
				userId.push($(this).data("id"));
			}
		});

		if(userId.length > 1) {
			alert("수정은 한번에 하나의 계정만 가능합니다.");
			return false;
		} else if (userId.length === 0) {
			alert("수정할 계정을 선택해야합니다.");
			return false;
		}

		params.userId = userId[0];

		$.ajax({
			type : "post",
			url: "/security/account/accountMgmt/list",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {
				accountModify.popup(data.accountList[0]);
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	//계정 수정 팝업
	popup : function(obj) {
		accountModify.flag = [false, true, false, false];
		accountModify.submitFlag = false;

		//계정 관리의 계정 수정은 3번째 폼(1st: 메뉴, 2nd:계정등록)이다.
		$("form")[2].reset();

		var $modifyMessages = $(".modifyMessages");
		$modifyMessages.css("display", "none");
		$modifyMessages.text("");
		
		document.getElementById("modifyUserId").value= obj.USER_ID;
		document.getElementById("modifyUserName").value = obj.USER_NAME;
		//document.getElementById("modifyUserMobile").value = obj.USER_MOBILE;
		document.getElementById("modifyUserPhone").value = obj.USER_PHONE;
		//document.getElementById("modifyUserEmail").value = obj.EMAIL;
		$("select[name=modifyUserAuth]").val(obj.AUTH);
		if(obj.USE_FLAG === 1) {
			document.getElementsByName("modifyUserFlag")[1].checked = true;
		} else {
			document.getElementsByName("modifyUserFlag")[0].checked = true;
		}
		
		$("#updateUsePeriod").val(obj.USE_PERIOD).prop("selected", true);  // 사용 기간 

		//계정 수정 팝업에서는 '승인'을 기본으로 세팅
		//document.getElementsByName("modifyUserFlag")[1].checked = true;


		var $accountModifyUp = $('#accountModifyUp');
		$('#accountModifyBg').show().fadeIn('fast');
		$accountModifyUp.show().fadeIn('fast');

		var height = (screen.height - $accountModifyUp.height()-100)/2;
		var width = (screen.width - $accountModifyUp.width())/2;

		$accountModifyUp.css('left',width+'px');
		$accountModifyUp.css('top',height+'px');
	},

	accountModifySubmit : function() {
		var
			userId = document.getElementById("modifyUserId").value,
			userName = document.getElementById("modifyUserName").value,
			// currentPwd = document.getElementById("currentPwd").value || '',
			changePwd = document.getElementById("changePwd").value || '',
			//userMobile = document.getElementById("modifyUserMobile").value,
			userPhone = document.getElementById("modifyUserPhone").value,
			usePeriod = $("#updateUsePeriod").val()
			//userEmail = document.getElementById("modifyUserEmail").value
		accountModify.formValidation();
		var $modifyUserConfirm = $("#modifyUserConfirm");
		var params = {
			userId			: userId,
			userName		: userName,
			//userMobile		: userMobile,
			userPhone		: userPhone,
			//userEmail		: userEmail,
			userAuth		: $("select[name=modifyUserAuth]").val(),
			userFlag		: $modifyUserConfirm.is(':checked') ? $modifyUserConfirm.val() : $("#modifyUserReject").val(),
			usePeriod       : usePeriod
		};

		// if(currentPwd !== '' && changePwd !== '') {
		// 	params.currentPwd = currentPwd;
		// 	params.changePwd = changePwd;
		// }

		if(changePwd !== '') {
			params.changePwd = sha256(changePwd);
		}

		if(!accountModify.submitFlag) {
			return false;
		}

		$.ajax({
			type : "post",
			url: "/security/account/accountMgmt/modify",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {
				if(data.modifyResult.IDX) {
					var idMsg = document.getElementById("idMsg");
					idMsg.textContent = accountRegister.msgText[data.registerResult.IDX];
					idMsg.style.color = "red";
					idMsg.style.display = "inline-block";
				} else {
					alert("수정되었습니다.");
					$("#accountModifyBg").fadeOut();
					$("#accountModifyUp").fadeOut();
					$("form")[1].reset();
					pageSearch();
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});

		//0 : 사용자 이름
		//1 : 현재 비밀번호
		//2 : 변경할 비밀번호
	},

	formValidation : function(id, value) {
		//submit시 validation 체크
		if(id === undefined && value === undefined) {
			var nameVal = document.getElementById("modifyUserName").value;
			//var emailVal = document.getElementById("modifyUserEmail").value || "";
			// var currentVal = document.getElementById("currentPwd").value || "";
			var changeVal = document.getElementById("changePwd").value || "";

			accountModify.flag[0] = nameVal ? true : false;

			//이메일이 있을 경우 양식 체크
/*			if(emailVal !== "") {
				accountModify.flag[3] = accountRegister.regExpEmail(emailVal);
			//이메일이 없을 경우 true
			} else {*/
				accountModify.flag[3] = true;
			/*}*/

			//비밀번호 변경을 안할 때
			if (changeVal === "") {
				accountModify.flag[2] = true;
			} else {
                if(!accountRegister.regExp(changeVal)) {
                    accountModify.flag[2] = false;
                } else {
                    accountModify.flag[2] = true;
                }
            }
            
			//비밀번호 변경시(현재 또는 변경할 비밀번호 Form에 값이 있고 flag값이 true일 때)
			// if( currentVal !== "" && changeVal !== "" && accountModify.flag[1] && accountModify.flag[2]) {
			// 	accountModify.flag[1] = true;
			// 	accountModify.flag[2] = true;
			// }

			// 비밀번호가 한쪽만 들어있을 때
			// if( (changeVal === "" && currentVal !== "") || (changeVal !== "" && currentVal === "") ) {
			// 	accountModify.flag[1] = false;
			// 	accountModify.flag[2] = false;
			// }

			//비밀번호 변경을 안할 때
			// if (currentVal === "" && changeVal === "") {
			// 	accountModify.flag[1] = true;
			// 	accountModify.flag[2] = true;
			// }
			accountModify.submitFlag = accountModify.flag.every(function (value) {
				return value === true;
			});

		} else {
			// var currentPwd = document.getElementById("currentPwd").value || "",
			// 	changePwd = document.getElementById("changePwd").value || "";

			var changePwd = document.getElementById("changePwd").value || "";

			switch(id) {
				case "modifyUserName":
					var $modifyNameMsg = $("#modifyNameMsg");
					if(value) {
						$modifyNameMsg.css("display", "none");
						accountModify.flag[0] = true;
					} else {
						$modifyNameMsg.text(accountModify.msgText[3]);
						$modifyNameMsg.css("color", "red");
						$modifyNameMsg.css("display", "inline-block");
						accountModify.flag[0] = false;
					}
					break;
				// case "currentPwd":
				// 	if(value) {
				// 		var promise = $.ajax({
				// 			type : "post",
				// 			url : "/security/account/accountMgmt/modifyCheck",
				// 			data : JSON.stringify({"currentPwd" : value, "userId" : $("#modifyUserId").val()}),
				// 			contentType: "application/json",
				// 			dataType:"json"
				// 		});
                //
				// 		promise.then(function(data) {
				// 			$("#currentPwdMsg").text(accountModify.msgText[data.checkResult]);
				// 			if(data.checkResult == 0 ? true : false) {
				// 				$("#currentPwdMsg").css("display", "none");
				// 				$("#currentPwdMsg").css("color", "green");
				// 				accountModify.flag[1] = true;
                //
				// 			} else {
				// 				$("#currentPwdMsg").css("color", "red");
				// 				$("#currentPwdMsg").css("display", "inline-block");
				// 				accountModify.flag[1] = false;
				// 			}
				// 		});
				// 	} else {
				// 		if(!changePwd) {
				// 			$("#currentPwdMsg").css("display", "none");
				// 			$("#currentPwdMsg").css("color", "green");
                //
				// 			$("#changePwdMsg").css("display", "none");
				// 			$("#changePwdMsg").css("color", "green");
                //
				// 			accountModify.flag[1] = true;
				// 		} else {
				// 			$("#currentPwdMsg").text(accountModify.msgText[1]);
				// 			$("#currentPwdMsg").css("color", "red");
				// 			$("#currentPwdMsg").css("display", "inline-block");
				// 			accountModify.flag[1] = false;
				// 		}
				// 	}
				// 	break;
				case "changePwd":
					if(value) {
						var $changePwdMsg = $("#changePwdMsg");
						if(accountRegister.regExp(value)) {
							// if(value === $("#currentPwd").val()) {
							// 	$("#changePwdMsg").text(accountModify.msgText[8]);
							// 	$("#changePwdMsg").css("color", "red");
							// 	$("#changePwdMsg").css("display", "inline-block");
							// 	$("#changePwd").val("");
                            //
							// 	accountModify.flag[2] = false;
							// } else {
							$changePwdMsg.css("color", "green");
							$changePwdMsg.css("display", "none");
							accountModify.flag[2] = true;

							// }

						} else {
							$changePwdMsg.text(accountModify.msgText[4]);
							$changePwdMsg.css("color", "red");
							$changePwdMsg.css("display", "inline-block");
							//$("#changePwd").val("");
							accountModify.flag[2] = false;

						}

						// if(!currentPwd) {
						// 	$("#currentPwdMsg").text(accountModify.msgText[1]);
						// 	$("#currentPwdMsg").css("color", "red");
						// 	$("#currentPwdMsg").css("display", "inline-block");
						// 	accountModify.flag[1] = false;
                        //
						// }

					} else {
						accountModify.flag[2] = true;
						// if(!currentPwd) {
						// 	$("#currentPwdMsg").css("display", "none");
						// 	$("#currentPwdMsg").css("color", "green");
                        //
						// 	$("#changePwdMsg").css("display", "none");
						// 	$("#changePwdMsg").css("color", "green");
                        //
						// 	accountModify.flag[1] = true;
						// 	accountModify.flag[2] = true;
                        //
						// } else {
						// 	$("#changePwdMsg").text(accountModify.msgText[5]);
						// 	$("#changePwdMsg").css("color", "red");
						// 	$("#changePwdMsg").css("display", "inline-block");
						// 	$("#changePwd").text("");
						// 	accountModify.flag[2] = false;
						// }
					}
					break;
				case "modifyUserEmail":
					var $modifyEmailMsg = $("#modifyEmailMsg");
					if(value) {
						if(accountRegister.regExpEmail(value)) {
							$modifyEmailMsg.css("color", "green");
							$modifyEmailMsg.css("display", "none");
							accountModify.flag[3] = true;
						} else {
							$modifyEmailMsg.text(accountModify.msgText[6]);
							$modifyEmailMsg.css("color", "red");
							$modifyEmailMsg.css("display", "inline-block");
							accountModify.flag[3] = false;
						}

					//이메일이 빈 값을 때
					} else {
						$modifyEmailMsg.css("color", "green");
						$modifyEmailMsg.css("display", "none");
						accountModify.flag[3] = true;
					}
					break;
			}
		}
	}
};

function pageSearch(){
	accountMgmt.accountList();
}
