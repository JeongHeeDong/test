<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<div id="setSpecificTimeBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="setSpecificTimeUp" class="mu-dialog mu-fix-foot" style="width: 400px; height: 460px;z-index: 13; display: none;"><!-- resize 부분 -->

	<div id="setSpecificTimeTitle" class="mu-dialog-head">
		<h2><span class="title" style="line-height: 200%;">특정 시간 설정</span></h2>
		<button id="setSpecificTimeClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
	</div>
	<div class="mu-dialog-body">
		<div id="timeChkArea">
			<h3 class="mu-title">시간 조건 선택</h3>
			<div class="mu-dialog-body-top">
				<div class="mu-checkbox">
					<input type="checkbox" id="chk_occurTime">
					<label for="chk_occurTime">발생시간</label>
				</div>
				<select id="operator" name="" style="width: 60px">
					<option value="or" selected="selected">또는</option>
					<option value="and">그리고</option>
				</select>
				<div class="mu-checkbox">
					<input type="checkbox" id="chk_recoverTime">
					<label for="chk_recoverTime">복구시간</label>
				</div>
			</div>
		</div>
		<h3 class="mu-title" style="margin:10px 10px 10px 0px">시간 설정</h3>
		<div class="tc">
			<ol class="table_hour" id="table_hour">
				<c:forEach begin="1" end="4" var="x">
					<c:forEach begin="1" end="6" var="y">
						<li><button type="button" class="mu-btn mu-btn-icon">${(6*(x-1))+(y-1)}</button></li>
					</c:forEach>
				</c:forEach>
			</ol>
			<div style="mu-hgroup">
				<button id='all_select_btn' type="button" class="mu-btn mu-btn-icon">전체선택</button>
				<button id='all_cancel_btn' type="button" class="mu-btn mu-btn-icon mu-btn-cancel">선택해제</button>
			</div>
		</div>
	</div>
	<div class="mu-dialog-foot">
		<button id="setSpecificTimeOk" type="button" class="mu-btn mu-pop-btn">확인</button>
		<button id="setSpecificTimeCancel" type="button" class="mu-btn">취 소</button>
	</div>
</div>



<div>
	<!-- for modal dialog -->
	<div class="mu-dialog-background dlg_hour hidden" id="spTimeBg"></div>

	<div class="mu-dialog hidden" id="dlg_hour">
		<div class="mu-dialog-head">
			<h2><span class="title" style="line-height: 200%;">특정 시간 설정</span></h2>
			<a href="javascript:" class="mu-btn mu-btn-icon mu-btn-icon-only btnClose btn-close" id="spTimeClose">
			<i class="mu-icon-img close"></i></a>
		</div>

		<%--<div id="timeChkArea" class="mu-dialog-body-top">
			<div>시간 바로 선택</div>
			<div class="mu-checkbox">
				<input type="checkbox" id="chk_occurTime">
				<label for="chk_occurTime">발생시간</label>
			</div>
			<select id="operator" name="" style="width: 60px">
				<option value="or" selected="selected">또는</option>
				<option value="and">그리고</option>
			</select>
			<div class="mu-checkbox">
				<input type="checkbox" id="chk_recoverTime">
				<label for="chk_recoverTime">복구시간</label>
			</div>
		</div>--%>

		<%--<div class="mu-dialog-body-top">
			<div class="mu-search-group">
				<div class="mu-hgroup">
					<button id='all_select_btn' type="button" class="mu-btn mu-btn-icon">전체선택</button>
					<button id='all_cancel_btn' type="button" class="mu-btn mu-btn-icon mu-btn-cancel">선택해제</button>
				</div>
			</div>
		</div>--%>
		<%--<div class="mu-dialog-body">
			<ol class="table_hour" id="table_hour">
				<c:forEach begin="1" end="4" var="x">
					<c:forEach begin="1" end="6" var="y">
						<li><button id="${1+(6*(x-1))+(y-1)}" type="button" class="mu-btn mu-btn-icon">${1+(6*(x-1))+(y-1)}&nbsp;</button></li>
					</c:forEach>
				</c:forEach>
			</ol>
		</div>--%>
		<div class="mu-dialog-foot">
			<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes">확인</button>
			<button id="spTimeCancel" class="mu-btn mu-btn-icon btn-close mu-btn-cancel">취소</button>
		</div>
	</div>
</div>

<script>
	var active = ''; //selected value

	$('#all_select_btn').click(function() {
		$("#table_hour li button").removeClass();
		$("#table_hour li button").addClass('mu-btn mu-btn-icon active');
	});

	$('#all_cancel_btn').click(function() {
		$("#table_hour li button").removeClass();
		$("#table_hour li button").addClass('mu-btn mu-btn-icon');
	});

	$('#table_hour li button').click(function() {
		if (!$(this).hasClass('active')) {
			$(this).removeClass();
			$(this).addClass('mu-btn mu-btn-icon active');
		} else {
			$(this).removeClass();
			$(this).addClass('mu-btn mu-btn-icon');
		}
	});	
</script>