login = {
	popupDrag: function(target) {
		if (target == null || target == undefined)
			target = '';

		$(target + ".drag").draggable({
			handle: ".dragHandle",
			create: function(event,ui){
				$(this).css({"position":"absolute"});
			},
			start: function(event, ui) {
				$(this).css("zIndex", 100);
			},
			scroll: false,
			grid: [ 5, 5 ]
		});

		$(target + ".drag").css("zIndex", 100);

		$(target + '.drag').click(function () {
			$(this).addClass('top').removeClass('bottom');
			$(this).siblings().removeClass('top').addClass('bottom');
			var idx = $(this).css("zIndex");
			$(this).css("zIndex", Math.max(idx, 100));
		});
		$(target + ".resize").resizable({
			grid: 5
		});
	},

	getNotice: function () {
		$.ajax({
			type:'post',
			url:'/login/getnotice',
			contentType: 'application/json',
			dataType : 'json',
			success : function(data) {
				data = data.noticeList;
				var content = '';
				$(data).each(function(idx, value) {
					var time = value.EVENT_TIME.substr(0,10);
					content += '<li style="cursor:pointer;" data-user="' + value.USER_ID + '" data-time="' + value.EVENT_TIME + '" data-title="' + value.NOTICE_TITLE + '">[' + time + ']   ' + value.NOTICE_TITLE + '</li>';
				});

				$(".noticeBox ul").append(content);
			},
			error : function(xhr, stat, err) {
			}
		});
	},

	getNoticeContent: function(param) {
		$.ajax({
			type: 'post',
			url: '/login/getnoticecontents',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(param),
			success: function(data) {
				login.noticeView(data.noticeContent);
			},
			error : function(xhr, stat, err) {
			}
		});
	},

	noticeView: function (data) {
		var height = (screen.height - $('#notiAddUp').height()-100)/2
		var width = (screen.width - $('#notiAddUp').width())/2

		$('#notiAddUp').css('left',width+'px');
		$('#notiAddUp').css('top',height+'px');

		$("#notiAddDiv").scrollTop(0);

		//콤포넌트 초기화
		$('#notiAddTitleBox').find('.title').html('공지사항');

		$('.mu-file-attach').addClass('hidden');
		$('#originFile').removeClass('hidden');

		var id = data.USER_ID;
		var time = data.EVENT_TIME.replace(/\//g,'-');

		title = data.NOTICE_TITLE;
		desc  = data.NOTICE_DESC;
		fileName = data.FILE_NAME;

		$('#noti_subject').val(title);
		$('#noti_content').val(desc);
		$('#originFile').html(fileName);
		$('[name="originFile"]').val(fileName);

		$('#noti_subject').attr('readonly', true);
		$('#noti_content').attr('readonly', true);
		$('#originFile').attr('onclick', 'login.downLoadFile()');

		$('#originFile').addClass('noFile');
		if ( $('#originFile').html() == '첨부파일 없음' ) {
			$('#originFile').removeClass('attachFile');
			$('#originFile').addClass('noFile');

		} else {
			$('#originFile').attr('style','cursor:pointer');
			$('#originFile').removeClass('noFile');
			$('#originFile').addClass('attachFile');
		}

		$('#fileDelBtn').addClass('hidden');

		login.popupDrag('#notiAddUp');
		$('#notiAddBg').show().fadeIn('fast');
		$('#notiAddUp').show().fadeIn('fast');
	},

	signIn: function (){



		document.encodedLoginForm.encodedUserID.value = encodeURIComponent(document.loginForm.userID.value);
		document.encodedLoginForm.encodedUserPW.value = encodeURIComponent(document.loginForm.userPW.value).replace(/[!'()']/g, escape).replace(/\*/g, '%2A');

		var
			id = document.encodedLoginForm.encodedUserID.value,
			pw = document.encodedLoginForm.encodedUserPW.value;

		if(id == '' && pw == ''){
			return false;

		}else{
			if($("#saveChk").is(":checked")){ // 저장 체크시
				login.saveLogin($("#userID").val());
			}else{ // 체크 해제시는 공백
				login.saveLogin("");
			}

			// document.getElementById("loginForm").submit();
			document.encodedLoginForm.submit();
		}
	},

	signUp: function () {
		accountRegister.accountRegisterPop("deleteRadio")
	},

	setCookie: function () {
		var cookie_user_id = login.getLogin();
		if(cookie_user_id != "") {
			$("#userID").val(cookie_user_id);
			$("#saveChk").attr("checked", true);
		}

		$("#saveChk").on("click", function(){
			var _this = this;
			var isRemember;

			if($(_this).is(":checked")) {
				isRemember = confirm("이 PC에 로그인 정보를 저장하시겠습니까? PC방등의 공공장소에서는 개인정보가 유출될 수 있으니 주의해주십시오.");

				if(!isRemember)
					$(_this).attr("checked", false);
			}
		});
	},

	saveLogin: function (id) {
		if(id != "") {
			// userid 쿠키에 id 값을 7일간 저장
			login.setSave("userid", id, 7);
		}else{
			// userid 쿠키 삭제
			login.setSave("userid", id, -1);
		}
	},

	setSave: function  (name, value, expiredays) {
		var today = new Date();
		today.setDate( today.getDate() + expiredays );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";"
	},

	getLogin: function () {
	// userid 쿠키에서 id 값을 가져온다.
		var ck = document.cookie + ";";
		var idx = ck.indexOf("userid", 0);
		var val = "";

		if(idx != -1) {
			ck = ck.substring(idx, ck.length);
			begin = ck.indexOf("=", 0) + 1;
			end = ck.indexOf(";", begin);
			val = unescape(ck.substring(begin, end));
		}
		return val;
	},
	
	downLoadFile : function () {
		var originName = $('#originFile').html();
		location.href = '/system/sysNotiManager/fileDown?fileName='+originName;
	},
	
	deleteFile : function () {
		var origin = $('#originFile').html();
		if ( origin != '첨부파일 없음' ) {
			origin+=':DEL';		
		}
		//$('#originFile').html(origin);
		$('[name="originFile"]').val(origin);
		
		$('#originFile').addClass('hidden');
		$('#fileDelBtn').addClass('hidden');
	}
};