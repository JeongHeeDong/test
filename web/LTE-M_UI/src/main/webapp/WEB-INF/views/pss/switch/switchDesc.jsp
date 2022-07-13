<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="<c:url value="/resources/js/pss/switch/switchDesc.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
				<div class="mu-search-item">
					<div class="mu-item-group">
						<%--<label>DU ID</label>
						<input id="du_id_value" type="text" class="mu-input">--%>
						<!-- <label>호선</label>
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
					<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:swMgmt.saveChangePort()"><i class="mu-icon edit"></i>수정</button>
				</div>
			</div><!-- //mu-search-group -->
			
			<br>
			<label>※ 스위치 연결정보를 클릭하면 내용을 변경할 수 있고 변경사항을 적용하려면 우측 상단의 수정 버튼을 누르십시오.</label>
			<br>
			<br>
			
			<div class="gridWrap gridScrollT" style="overflow:hidden;">
				<table class="mu-grid mu-grid-border tbFix">
					<colgroup>
						<col width="150">
						<col width="90">
						<col width="150">
						<col width="70">
						<col width="70">
						<col width="2540">
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
			<div class="gridWrap mu-scroll-v" style="border-top:0px; max-height:750px; overflow-y:scroll;">
				<table class="mu-grid mu-grid-border mu-grid-strip tbFix">
					<colgroup>
						<col width="150">
						<col width="90">
						<col width="150">
						<col width="70">
						<col width="70">
						<col width="2520">
					</colgroup>
					<tbody id="switchPort">
					</tbody>
				</table>
			</div>
		</section>
	</div>
</body>
</html>