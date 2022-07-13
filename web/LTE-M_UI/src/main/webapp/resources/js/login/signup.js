$(document).ready(function(){
	//계정 등록 Form 닫기
	$("#signUpClose, #signUpCancle, #signUpBg").on("click",function(){
		$("#signUpBg").fadeOut();
		$("#signUpUp").fadeOut();
	});

	//계정 등록 Form Drag 지정 정의
	$("#signUpUp").draggable({'handle' : ".dragHandle"});

	//계정 등록
	$("#signUp").click(function() {
		signUpPop.register();
	});
});

var signUpPop = {

	//계정 등록 팝
	signUp : function(obj) {

		$("form")[0].reset();

		$("#signUpBg").show().fadeIn('fast');
		$("#signUpUp").show().fadeIn('fast');

		var height = (screen.height - $("#signUpUp").height()-100)/2;
		var width = (screen.width - $("#signUpUp").width())/2;

		$("#signUpUp").css('left',width+'px');
		$("#signUpUp").css('top',height+'px');
	},

	register : function() {
		var
			userId = document.getElementById("userId").value,
			userName = document.getElementById("userName").value,
			userPwd = document.getElementById("userPwd").value,
			userPwdConfirm = document.getElementById("userPwdConfirm").value,
			userMobile = document.getElementById("userMobile").value,
			userPhone = document.getElementById("userPhone").value,
			userEmail = document.getElementById("userEmail").value;

		if(userPwd !== userPwdConfirm) {
			alert("비밀번호가 일치하지 않습니다");
			return false;
		}

		var params = {
			flag			: document.getElementById("flag").value,
			userId			: userId,
			userName		: userName,
			userPwd			: userPwd,
			userPwdConfirm	: userPwdConfirm,
			userMobile		: userMobile,
			userPhone		: userPhone,
			userEmail		: userEmail,
			userAuth		: $("select[name=userAuth]").val()
		};


		$.ajax({
			type : "post",
			url: "/security/account/accountMgmt/register",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {
				$("#signUpBg").fadeOut();
				$("#signUpUp").fadeOut();
				$("form")[0].reset();
			},
			error: function () {
				//alert('에러발생');
			}
		});
	}

};