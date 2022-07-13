<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/security/menuAuthMgmt/menuAuthModify.js"></script>

<!-- 메뉴 권한 수정 Form -->
<div id="menuAuthModifyBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="menuAuthModifyUp" class="mu-dialog" style="display: none;z-index: 11"><!-- resize 부분 -->
	<div class="mu-dialog-head dragHandle">
		<h2><span class="title">메뉴 권한 관리</span></h2>
		<button type="button" class="mu-btn mu-btn-icon" id="menuAuthModifyClose"><i class="mu-icon-img cancel"></i></button>
	</div>

	<div class="mu-dialog-body">
		<div class="mu-row">
			<div class="mu-hgroup">
				<label>메뉴명</label>
			</div>
			<div class="mu-hgroup mu-selectbox">
				<select name="menuIdSelect" class="mu-value">
					<option value="1">시스템 관리자</option>
					<option value="2">관리자</option>
					<option value="3">운영자</option>
					<option value="4">사용자</option>
				</select>
			</div>
			<div class="mu-hgroup">
				<label>사용자등급</label>
			</div>
			<div class="mu-hgroup mu-selectbox">
				<select name="menuAuthSelect" class="mu-value">
					<option value="1">시스템 관리자</option>
					<option value="2">관리자</option>
					<option value="3">운영자</option>
					<option value="4">사용자</option>
				</select>
			</div>
		</div>
	</div>

	<div class="mu-dialog-foot" style="text-align: center;">
		<button id="menuAuthModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon">저장</button>
		<button id="menuAuthModifyCancel" type="button" class="mu-btn mu-btn-icon gray">취소</button>
	</div>
</div>