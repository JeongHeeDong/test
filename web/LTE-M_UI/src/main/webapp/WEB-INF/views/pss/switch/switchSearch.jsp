<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="<c:url value="/resources/js/pss/switch/switchSearch.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
				<div class="mu-search-item">
					<div class="mu-item-group">
						<!-- <label>구분</label>
						<div class="mu-selectbox">
							<select name="lineId" class="mu-value switchName"></select>
						</div> -->
						<label>스위치 분류</label>
						<div class="mu-selectbox">
							<select name="switchCategory" class="mu-value switchCategory">
								<option value="ALL">전체</option>
								<c:forEach var="category" items="${categoryList}">
									<option value="${category}">${category}</option>
								</c:forEach>
							</select>
						</div>
						<label>스위치 이름</label>
						<div class="mu-selectbox">
							<select name="switchName" class="mu-value switchName"></select>
						</div>
					</div>
				</div><!-- //mu-search-item -->
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:swMgmt.setParams()"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:swMgmt.viewHelp()"><i class="mu-icon"></i>도움말</button>
					<%--<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:swMgmt.switchModify()"><i class="mu-icon save"></i>저장</button>--%>
				</div>
			</div><!-- //mu-search-group -->
			
			<div class="gridWrap gridScrollT mt10">
				<table class="mu-grid mu-grid-border tbFix" id="swHeader">
					<colgroup>
						<col width="150">
						<col width="90">
						<col width="150">
						<col width="70">
						<col width="70">
						<col>
					</colgroup>
					<thead>
					<tr>
						<th>구분</th>
						<th>장비 분류</th>
						<th>장비 이름</th>
						<th>SLOT</th>
						<th>SHELF</th>
						<th>포트</th>
					</tr>
					</thead>
				</table>
			</div>
			<div class="gridWrap mu-scroll-v" style="border-top:0px; max-height:800px; overflow-y:scroll;">
				<table class="mu-grid mu-grid-strip mu-grid-border tbFix">
					<colgroup>
						<col width="150">
						<col width="90">
						<col width="150">
						<col width="70">
						<col width="70">
						<col>
					</colgroup>
					<tbody id="switchPort">
					</tbody>
				</table>
			</div>
		</section>
	</div>

	<div id="helpSetBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
	<div id="helpSetUp" class="mu-dialog mu-fix-foot" style="width: 500px; height: 400px;z-index: 11; display: none;"><!-- resize 부분 -->
		<div id="helpSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
			<h2><span class="title" style="line-height: 200%;">스위치 메세지 도움말</span></h2>
			<button id="helpSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div>


		<div class="mu-dialog-body" id="helpSetDiv" style="height: 310px;overflow-y: hidden;">
		<div class="gridWrap mt5">
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover tbFix">
					<colgroup>
						<col width="50">
						<col width="">
					</colgroup>
					<thead>
					<tr>
						<th>상태</th>
						<th>설명</th>
					</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover tbFix">
					<colgroup>
						<col width="50">
						<col width="">
					</colgroup>
					<tbody>
					<tr>
						<td align="center">1</td>
						<td><span>up - 포트가 활성화 상태(패킷을 보낼 준비가 되어있음)</span></td>
					</tr>
					<tr>
						<td align="center">2</td>
						<td><span>down - 포트가 비활성화(다운)된 상태</span></td>
					</tr>
					<tr>
						<td align="center">3</td>
						<td><span>testing - 테스트 모드에서는 운영상의 패킷이 아닌 것만 통과</span></td>
					</tr>
					<tr>
						<td align="center">4</td>
						<td><span>unknown - 어떤 이유로 인해 상태가 결정되지 않음</span></td>
					</tr>
					<tr>
						<td align="center">5</td>
						<td><span>dormant - 인터페이스가 외부에서의 액션을 기다림</span></td>
					</tr>
					<tr>
						<td align="center">6</td>
						<td><span>notPresent - 어떠한 구성에 문제가 발생(주로 하드웨어적)</span></td>
					</tr>
					<tr>
						<td align="center">7</td>
						<td><span>lowerLayerDown - Low Layer Interface에 의한 다운상태</span></td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="helpSetCancle" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>확 인</button>
		</div>
	</div>
</body>
</html>