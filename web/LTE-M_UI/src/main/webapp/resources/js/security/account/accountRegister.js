$(document).ready(function(){
	$('#accountRegisterClose, #accountRegisterCancel, #accountRegisterBg').on("click",function(e) {
		accountRegister.accountPopClose();
	});

	//계정 등록 Form Drag 지정 정의
	$( "#accountRegisterUp" ).draggable({'handle' : ".dragHandle"});

	//계정 등록
	$("#accountRegister").click(function() {
		accountRegister.accountRegisterSubmit();
	});

	//ID 중복 확인
	$("#idDuplicationCheck").click(function() {
		accountRegister.duplicationCheck();
	});

	//등록 Form 확인
	$(".mu-input").blur(function() {
		var $this = $(this);
		var id = $this.attr("id");
		var value = $this.val();
		//var value = document.getElementById(id).value;
		accountRegister.formValidation(id, value);
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
			$('select[name=userAuth]').append(selectOption);
		},
		error: function () {
			//alert('에러발생');
		}
	});
})();

var accountRegister = {

	//사용자 등급
	userRoll: {},

	//로그인화면 회원가입 or 계정관리 구분
	//true : 계정관리, false : 로그인
	accountMgmtFlag : true,
	//0 : 사용자 ID
	//1 : 사용자 이름
	//2 : 현재 비밀번호
	//3 : 변경할 비밀번호
	//4 : 이메일 양식
	flag : [false, false, false, false, false],
	submitFlag : false,
	duplicationCheckFlag : '',
	msgText : [
		"사용 가능한 아이디입니다",
		"이미 존재하는 아이디입니다",
		"필수 정보입니다",
		"아이디는 3 ~ 20글자 이내에서 영문 소문자와 숫자만 사용해야 합니다.", // "2~20자 영소문자, 한글, 숫자, 특수기호(_,-,.)만 가능합니다",
		"아이디는 영문 소문자로 시작하여야 합니다.",						  // "아이디의 첫글자는 영문 대소문자, 한글, 숫자만 가능합니다",
		"아이디 중복체크를 하여야합니다.",
		"9자 이상, 문자/숫자/특수문자를 포함하여 등록하세요",
		"이메일 양식에 맞지 않습니다."],

	//비밀번호 정규식
	regExp : function(value) {
		var regEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{9,}$/;;
		return regEx.test(value);
	},

	//이메일 정규식
	regExpEmail : function(value) {
		var regEx = /^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}/;
		return regEx.test(value);
	},

	//계정 등록 Form 닫기
	accountPopClose : function() {
		$("#accountRegisterBg").hide();
		$("#accountRegisterUp").hide();
	},

	//보안 > 사용자관리 > 등록
	accountRegisterPop : function(flag) {
		
		accountRegister.accountMgmtFlag = true;

		if(flag) {
			$('.js-account-mgmt').remove();
			
			accountRegister.accountMgmtFlag = false;

			document.getElementById("accountRegister").textContent = "계정신청";
		}

		accountRegister.popup(flag);
	},

	//계정 등록 팝업
	popup : function(flag) {
		accountRegister.flag = [false, false, false, false, false];
		accountRegister.submitFlag = false;
		accountRegister.duplicationCheckFlag = '';

		//로그인 화면 및 계정관리 화면에서 같은 form의 위치지만 일단은 변경하지 않고 유지
		if(flag) {
			//로그인 화면에서 계정등록
			$("form")[2].reset();
		} else {
			//계정관리 화면에서 계정등록
			$("form")[1].reset();
		}

		var $messages = $(".messages");
		$messages.css("display", "none");
		$messages.text("");

		var $accountRegisterUp = $('#accountRegisterUp');

		$('#accountRegisterBg').show().fadeIn('fast');
		$accountRegisterUp.show().fadeIn('fast');

		var height = (screen.height - $accountRegisterUp.height()-100)/2;
		var width = (screen.width - $accountRegisterUp.width())/2;

		$accountRegisterUp.css('left',width+'px');
		$accountRegisterUp.css('top',height+'px');
	},

	accountRegisterSubmit : function() {
		var
		    usePeriod= document.getElementById("usePeriod").value,
			userId = document.getElementById("userId").value,
			userName = document.getElementById("userName").value,
			userPwd = document.getElementById("userPwd").value,
			userPwdConfirm = document.getElementById("userPwdConfirm").value,
			//userMobile = document.getElementById("userMobile").value,
			userPhone = document.getElementById("userPhone").value;
			//userEmail = document.getElementById("userEmail").value;
			

		accountRegister.formValidation();

		if(!accountRegister.submitFlag) {
			return false;
		}

		var params = {
			userId			: userId,
			userName		: userName,
			userPwd			: sha256(userPwd),
			userPwdConfirm	: sha256(userPwdConfirm),
			//userMobile		: userMobile,
			userPhone		: userPhone,
			//userEmail		: userEmail,
			userAuth		: $("select[name=userAuth]").val(),
			usePeriod       : usePeriod
		};

		if(accountRegister.accountMgmtFlag) {
			var $userConfirm = $("#userConfirm");
			params.userAuth = $("select[name=userAuth]").val();
			params.userFlag = $userConfirm.is(':checked') ? $userConfirm.val() : $("#userReject").val();
		} else {
			params.userAuth = '3';
			params.userFlag = '0';
		}

		$.ajax({
			type : "post",
			url: "/security/account/accountMgmt/register",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {
				if(data.registerResult.IDX) {
					document.getElementById("idMsg").textContent = accountRegister.msgText[data.registerResult.IDX];
					document.getElementById("idMsg").style.color = "red";
					document.getElementById("idMsg").style.display = "inline-block";
					$("#userId").focus();

				} else {
					if(accountRegister.accountMgmtFlag) {
						pageSearch();
						alert("등록되었습니다.");
						$("form")[1].reset();
						accountRegister.accountPopClose();
					} else {
						accountRegister.accountPopClose();
						alert("신청되었습니다.");
						$("form")[2].reset();
					}
					$(".messages").css("display", "none");
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	duplicationCheck : function() {
		$.ajax({
			type : "post",
			url: "/security/account/accountMgmt/duplicationCheck",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify({userId : $("#userId").val()}),
			success: function (data) {

				var $idMsg = $("#idMsg");
				$idMsg.text(accountRegister.msgText[data.duplicationResult]);
				$idMsg.css("display", "inline-block");

				data.duplicationResult === 0 ? $idMsg.css("color", "green") : $idMsg.css("color", "red");

				accountRegister.duplicationCheckFlag = data.duplicationResult;
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	formValidation : function(id, value) {
		//submit시 validation 체크
		if(id === undefined && value === undefined) {
			var idVal = document.getElementById("userId").value;
			if(idVal) {
				if (accountRegister.duplicationCheckFlag === 0) {
					accountRegister.flag[0] = true;
				} else if(accountRegister.duplicationCheckFlag === '') {
					document.getElementById("idMsg").textContent = accountRegister.msgText[5];
					document.getElementById("idMsg").style.color = "red";
					document.getElementById("idMsg").style.display = "inline-block";
					accountRegister.flag[0] = false;
				} else if(accountRegister.duplicationCheckFlag !== 0) {
					document.getElementById("idMsg").textContent = accountRegister.msgText[accountRegister.duplicationCheckFlag];
					document.getElementById("idMsg").style.color = "red";
					document.getElementById("idMsg").style.display = "inline-block";
					accountRegister.flag[0] = false;
				}
			} else {
				document.getElementById("idMsg").textContent = accountRegister.msgText[2];
				document.getElementById("idMsg").style.color = "red";
				document.getElementById("idMsg").style.display = "inline-block";
				accountRegister.flag[0] = false;
			}

			var nameVal = document.getElementById("userName").value;
			if(nameVal) {
				document.getElementById("nameMsg").style.display = "none";
				//$("#nameMsg").css("display", "none");
				accountRegister.flag[1] = true;
			} else {
				document.getElementById("nameMsg").textContent = accountRegister.msgText[2];
				document.getElementById("nameMsg").style.color = "red";
				document.getElementById("nameMsg").style.display = "inline-block";
				accountRegister.flag[1] = false;
			}

			var pwdVal = document.getElementById("userPwd").value || "";
			if(pwdVal) {
				if(accountRegister.regExp(pwdVal)) {
					accountRegister.flag[2] = true;
				} else {
					document.getElementById("pwd1Msg").textContent = accountRegister.msgText[6];
					document.getElementById("pwd1Msg").style.color = "red";
					document.getElementById("pwd1Msg").style.display = "inline-block";
					accountRegister.flag[2] = false;
				}
			} else {
				document.getElementById("pwd1Msg").textContent = accountRegister.msgText[2];
				document.getElementById("pwd1Msg").style.color = "red";
				document.getElementById("pwd1Msg").style.display = "inline-block";
			}

			var pwdConfirmVal = document.getElementById("userPwdConfirm").value || "";
			if(pwdConfirmVal) {
				if(pwdVal !== "") {
					if(pwdVal === pwdConfirmVal) {
						accountRegister.flag[3] = true;
					} else {
						accountRegister.flag[3] = false;
						document.getElementById("pwd2Msg").textContent = "비밀번호가 일치하지 않습니다.";
						document.getElementById("pwd2Msg").style.color = "red";
						document.getElementById("pwd2Msg").style.display = "inline-block";
						document.getElementById("userPwdConfirm").value = "";
					}
				}
			} else {
				document.getElementById("pwd2Msg").textContent = accountRegister.msgText[2];
				document.getElementById("pwd2Msg").style.color = "red";
				document.getElementById("pwd2Msg").style.display = "inline-block";
			}

			var emailVal = '';//document.getElementById("userEmail").value || "";
			if(emailVal) {
				if(accountRegister.regExpEmail(emailVal)) {
					accountRegister.flag[4] = true;
				} else {
					accountRegister.flag[4] = false;
					document.getElementById("emailMsg").textContent = accountRegister.msgText[7];
					document.getElementById("emailMsg").style.color = "red";
					document.getElementById("emailMsg").style.display = "inline-block";
				}
			} else {
				accountRegister.flag[4] = true;
				/*document.getElementById("emailMsg").textContent = "";
				document.getElementById("emailMsg").style.color = "green";
				document.getElementById("emailMsg").style.display = "none";*/
			}

			//accountRegister.submitFlag = accountRegister.flag.every(value => value === true);
			accountRegister.submitFlag = accountRegister.flag.every(function(value) {
				return value === true;
			});

		} else {
			switch(id) {
				case "userId":
					if(value) {
						if(accountRegister.duplicationCheckFlag === '') {
							document.getElementById("idMsg").textContent = accountRegister.msgText[5];
							document.getElementById("idMsg").style.color = "red";
							document.getElementById("idMsg").style.display = "inline-block";
						}
					} else {
						document.getElementById("idMsg").textContent = accountRegister.msgText[2];
						document.getElementById("idMsg").style.color = "red";
						document.getElementById("idMsg").style.display = "inline-block";
					}
					break;
				case "userName":
					var $nameMsg = $("#nameMsg");
					if(value) {
						document.getElementById("nameMsg").style.display = "none";
					} else {
						$nameMsg.text(accountRegister.msgText[2]);
						$nameMsg.css("color", "red");
						$nameMsg.css("display", "inline-block");
					}
					break;
				case "userPwd":
					var $pwd1Msg = $("#pwd1Msg");
					if(value) {
						if(accountRegister.regExp(value)) {
							$pwd1Msg.text("OK");
							$pwd1Msg.css("color", "green");
							$pwd1Msg.css("display", "inline-block");
						} else {
							$pwd1Msg.text(accountRegister.msgText[6]);
							$pwd1Msg.css("color", "red");
							$pwd1Msg.css("display", "inline-block");
						}
					} else {
						$pwd1Msg.text(accountRegister.msgText[2]);
						$pwd1Msg.css("color", "red");
						$pwd1Msg.css("display", "inline-block");
					}
					break;
				case "userPwdConfirm":
					if(value) {
						var userPwd = document.getElementById("userPwd").value,
							userPwdConfirm = document.getElementById("userPwdConfirm").value;

						if(userPwd !== userPwdConfirm) {
							document.getElementById("pwd2Msg").textContent = "비밀번호가 일치하지 않습니다.";
							document.getElementById("pwd2Msg").style.color = "red";
							document.getElementById("pwd2Msg").style.display = "inline-block";
							document.getElementById("userPwdConfirm").value = "";
						} else {
							document.getElementById("pwd2Msg").style.display = "none";
							document.getElementById("pwd2Msg").textContent = "";
						}
					} else {
						document.getElementById("pwd2Msg").textContent = accountRegister.msgText[2];
						document.getElementById("pwd2Msg").style.color = "red";
						document.getElementById("pwd2Msg").style.display = "inline-block";
					}
					break;
				case "userEmail":
					/*var $emailMsg = $("#emailMsg");
					if(value) {
						if(accountRegister.regExpEmail(value)) {
							$emailMsg.text("OK");
							$emailMsg.css("color", "green");
							$emailMsg.css("display", "inline-block");
						} else {
							$emailMsg.text(accountRegister.msgText[7]);
							$emailMsg.css("color", "red");
							$emailMsg.css("display", "inline-block");
						}
					}*/

					//else {
					//	$("#emailMsg").text(accountRegister.msgText[2]);
					//	$("#emailMsg").css("color", "red");
					//	$("#emailMsg").css("display", "inline-block");
					//}
					break;
			}
		}
	}
};

function pageSearch(){
	accountMgmt.accountList();
}
