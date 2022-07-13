<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 

<!DOCTYPE html>
<html lang="ko">
<head>
	<title>LTE-M > Login</title>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="/resources/css/font-awesome.min.css">
	<link href="/resources/css/common.css" rel="stylesheet" type="text/css" />
	<link href="/resources/css/layout_top.css" rel="stylesheet" type="text/css">
	<link href="/resources/css/style.css" rel="stylesheet" type="text/css" />
	<link href="/resources/css/accountForm.css" rel="stylesheet" type="text/css" />
	<script src="/resources/lib/jquery-1.11.2.min.js"></script>
	<script src="/resources/lib/jquery-ui.min.js"></script>
	<script src="/resources/js/login/login.js"></script>
	<script>
		$(document).ready(function () {
			login.getNotice();
			login.setCookie();
			//login.noticeCall();
			$('div.noticeBox').on('click', 'li', function(evt) {
				var self = $(this);
				var param = {};
				param.userId = self.data('user');
				param.title = self.data('title');
				param.eventTime = self.data('time');

				evt.stopPropagation();

				login.getNoticeContent(param);
			});

			$('#notiAddClose, #notiAddCancel,#notiAddBg').on('click',function(e){
				$('#notiAddBg').hide();
				$('#notiAddUp').hide();
			});

			var msg = '<c:out value="${message}" />';
				if(msg != '') {
				alert(msg);
			}

			$("#userID").focus();
		});
	</script>
</head>
<body id="login">

<div id="loginWrap">
	<div id="loginContainer">
		<h1 class="loginLogo">
		<c:choose>
            <c:when test="${'P168' == projectProfile}">
                <span>스마트쉽<br>무선네트워크 통합관제시스템</span>
            </c:when>
            <c:otherwise>
                <span>스마트항공기지<br>무선네트워크 통합관제시스템</span>
            </c:otherwise>
        </c:choose>
		</h1><!-- 22-02-09 MOD : logo -->
		<div class="loginArea">
			<div class="loginBox">
				<h3>User Login</h3>
				<%--<form id="login" name="login" action="/login/process" method="POST" onsubmit="return false;">
					<fieldset>
						<legend>로그인입력폼</legend>
						<div class="loginInput">
							<input id ="userID" type="text" placeholder="ID" title="ID" class="mu-input id" onkeydown="javascript:if (window.event.keyCode == 13) {signIn(); return false;}">
						</div>
						<div class="loginInput">
							<input id="userPW" type="password" placeholder="Password" title="Password" class="mu-input pw" onkeydown="javascript:if (window.event.keyCode == 13) {signIn(); return false;}">
						</div>
						<button type="button" class="btnLogin" onkeydown="javascript:if (window.event.keyCode == 13) {signIn(); return false;}" onclick="signIn();">Login</button>
						&lt;%&ndash;<div class="joinGroup">
							<div class="mu-checkbox">
								<input type="checkbox" id="ckb1">
								<label for="ckb1">아이디 저장</label>
							</div>
							<div class="join" onclick="signUp();"><a style="cursor: pointer">회원가입</a></div>
						</div>&ndash;%&gt;
					</fieldset>
				</form>--%>
				<form id="loginForm" name="loginForm" action="" method="POST" onsubmit="return false;">
					<fieldset>
						<legend>로그인입력폼</legend>
						<div class="loginInput mu-input-id">
							<input id ="userID" name="userID" type="text" title="ID" class="mu-input id" placeholder="ID" onkeydown="javascript:if (window.event.keyCode == 13) {login.signIn(); return false;}"/>
						</div>
						<div class="loginInput mu-input-pw">
							<input id ="userPW" name="userPW" type="password" title="Password" class="mu-input pw" placeholder="Password" onkeydown="javascript:if (window.event.keyCode == 13) {login.signIn(); return false;}"/>
						</div>
						<div class="joinGroup">
							<div class="mu-checkbox">
								<input type="checkbox" id="saveChk">
								<label for="saveChk">아이디 저장</label>
							</div>
							<div class="join" onclick="login.signUp();"><a style="cursor: pointer">계정신청</a></div>
						</div>
						<button type="button" class="btnLogin" onkeydown="javascript:if (window.event.keyCode == 13) {login.signIn(); return false;}" onclick="login.signIn();">로그인</button>
					</fieldset>
				</form>

				<form id="encodedLoginForm" name="encodedLoginForm" action="/login/process" method="POST">
					<fieldset>
						<legend>Encoded Info</legend>
						<div class="loginInput">
							<input id ="encodedUserID" name="encodedUserID" type="hidden" title="ID" class="mu-input id" />
						</div>
						<div class="loginInput">
							<input id ="encodedUserPW" name="encodedUserPW" type="hidden" title="Password" class="mu-input pw" />
						</div>
					</fieldset>
				</form>
			</div>
			<%-- <div class="noticeBox">
				<h3>Notice</h3>
				<ul class="noticeList">
				</ul>
				<a class="iconMore">공지사항 더보기</a>
			</div> --%>
		</div>
	</div>
	<div id="loginFooter">
		<!-- <address>Copyright (C) 2018 <span>서울교통공사.</span> All Rights Reserved.</address> -->
	</div>

	<div id="noticeContent">
		<div id="notiAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
		<div id="notiAddUp" class="mu-dialog mu-fix-foot drag accountRegist noticeView" style="display:none;width: 700px; height: 500px;left:42%;top:25%;z-index:11"><!-- resize 부분 -->
			<div id="notiAddTitleBox" class="mu-dialog-head dragHandle" ><!-- 창 이동 부분 -->
				<h2><span class="title">공지사항 추가</span></h2>
				<button id="notiAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
			</div>
			<div class="mu-dialog-body" id="dbAddDiv">
				<table class="mu-formbox">
					<colgroup>
						<col width="120px">
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th><label>제목</label></th>
							<td>
								<input type="text" id="noti_subject" name="subject" class="mu-input"/>
							</td>
						</tr>
						<tr>
							<th><label>내용</label></th>
							<td>
								<textarea class="mu-area" id="noti_content" name="content" rows="13" ></textarea>
							</td>
						</tr>
						<tr>
							<th><label>파일 첨부</label></th>
							<td>
								<div class="mu-file-attach">
									<input type="text" name="fileName" id="fileName" class="mu-input" readonly="readonly">
									<div class="mu-file-btn">
										<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon save"></i></button>
										<input type="file" id="file" name="file_obj" class="mu-btn-hide" onchange="extValidCheck(this)">
									</div>
								</div>
								<span id="originFile" class="hidden" style="cursor:pointer;color:blue"></span>
								<i class="mu-icon cancel hidden" id="fileDelBtn" style="color:red;margin-left:5px;cursor:pointer" onclick="login.deleteFile()"></i>
								<input type="hidden" id="selectedId" name="selectedId" />
								<input type="hidden" id="selectedTime" name="selectedTime"/>
								<input type="hidden" name="originFile"/>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- 
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>제목</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" id="noti_subject" name="subject" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>내용</label>
					</div>
					<div class="mu-hgroup">
						<textarea class="mu-area" id="noti_content" name="content" rows="20" ></textarea>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>파일 첨부</label>
					</div>
					<div class="mu-hgroup">
						<div class="mu-file-attach">
							<input type="text" name="fileName" id="fileName" class="mu-input" readonly="readonly">
							<div class="mu-file-btn">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon save"></i></button>
								<input type="file" id="file" name="file_obj" class="mu-btn-hide" onchange="extValidCheck(this)">
							</div>
						</div>
						<span id="originFile" class="hidden"></span>
						<i class="mu-icon cancel hidden" id="fileDelBtn" style="color:red;margin-left:5px;cursor:pointer" onclick="login.deleteFile()"></i>
						<input type="hidden" id="selectedId" name="selectedId" />
						<input type="hidden" id="selectedTime" name="selectedTime"/>
						<input type="hidden" name="originFile"/>
					</div>
				</div> -->
			</div>
			<div class="mu-dialog-foot" style="text-align: center;">
				<button id="notiAddCancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon cancel"></i>닫 기</button>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/security/account/accountRegister.jsp" %>
</body>
</html>