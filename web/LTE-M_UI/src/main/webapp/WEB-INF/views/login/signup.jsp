<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/login/signup.js"></script>

<!-- 계정 등록/수정 Form -->
<div id="signUpBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="signUpUp" class="mu-dialog" style="display: none;z-index: 11"><!-- resize 부분 -->
	<div class="mu-dialog-head dragHandle">
		<span class="title">사용자 정보 등록</span>
		<button type="button" class="mu-btn mu-btn-icon" id="signUpClose"><i class="mu-icon-img cancel"></i></button>
	</div>

	<form id="signUpForm">
		<div class="mu-dialog-body">
			<fieldset>
				<legend style="display:none">계정등록</legend>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>ID</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userId" class="mu-input"/>
					</div>
					<div class="mu-hgroup">
						<button id="idDuplicationCheck" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon edit"></i>중복확인</button>
					</div>
				</div>
				<div class="mu-row">
					<div id="idMsg" style="display:none">필수 정보입니다</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>이름</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userName" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div id="nameMsg" style="display:none">필수 정보입니다</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>비밀번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="password" value id="userPwd" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div id="pwd1Msg" style="display:none">필수 정보입니다</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>비밀번호 확인</label>
					</div>
					<div class="mu-hgroup">
						<input type="password" value id="userPwdConfirm" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div id="pwd2Msg" style="display:none">필수 정보입니다</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>핸드폰번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userMobile" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>단말번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userPhone" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>E-Mail</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userEmail" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>사용자등급</label>
					</div>
					<div class="mu-hgroup mu-selectbox">
						<select name="userAuth" class="mu-value">
							<option value="1">시스템 관리자</option>
							<option value="2">관리자</option>
							<option value="3">운영자</option>
							<option value="4">사용자</option>
						</select>
					</div>
				</div>
			</fieldset>
		</div>

		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="signUp" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon edit"></i>확인</button>
			<button id="signUpCancle" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</form>
</div>