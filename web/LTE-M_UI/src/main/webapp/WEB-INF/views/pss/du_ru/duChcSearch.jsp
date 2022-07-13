<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/import/import_page.jsp"%>
<script src="<c:url value="/resources/js/pss/du_ru/duChcSearch.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp"%>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp"%>
			<div class="mu-search-group">
				<!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
				<div class="mu-search-item">
					<div class="mu-item-group">
<!-- 						<label>호선</label>
						<div class="mu-selectbox">
							<button id="line_id" class="mu-value">전체</button>
							<ul id="line_ul" class="mu-list" style="max-height:150px;">
							</ul>
						</div> -->
						<label>EMS NAME</label>
						<div class="mu-selectbox">
							<button id="ems_id_btn" class="mu-value" value="전체">전체</button>
							<ul id="ems_id_ul" class="mu-list">
							</ul>
						</div>
						<label>DU ID</label> 
						<input id="du_id_value" type="text"class="mu-input"> 
						<label>DU 명</label>
						<input id="du_name_value" type="text" class="mu-input">
					</div>
				</div>
				<!-- //mu-search-item -->
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search"
						onclick="javascript:btnSearchClick()">
						<i class="mu-icon search"></i>검색
					</button>
				</div>
			</div>
			<!-- //mu-search-group -->
			<br>
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup>
						<col width="6.65%">
						<col width="11.05%">
						<col width="10.83%">
						<col width="9.95%">
						<col width="15%">
						<col width="21.20%">
						<col width="14.17%">
						<col width="10.50%">
					</colgroup>
					<thead>
						<tr>
							<th>NO</th>
							<th>EMS ID</th>
							<th>C_UID</th>
							<th>구분</th>
							<th>DU ID</th>
							<th>DU명</th>
							<th>운용팀</th>
							<th>SERIALNUMBER</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height: 350px; overflow-y: scroll;">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
					<colgroup>
						<col width="6.65%">
						<col width="11.05%">
						<col width="10.83%">
						<col width="9.95%">
						<col width="15%">
						<col width="21.20%">
						<col width="14.17%">
						<col width="10.50%">
					</colgroup>
					<tbody id="du_grid" style="text-align: center;">
					</tbody>
				</table>
			</div>
			<!-- //gridWarp -->

			<div class="subtitleWrap">
				<h4 class="mu-title" id="chcText">CHANNEL CARD 상세정보</h4>
			</div>

			<br>
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup>
						<col width="5%">
						<col width="14%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col>
					</colgroup>
					<thead>
						<tr>
							<th>NO</th>
							<th>UNIT ID</th>
							<th>UNIT TYPE</th>
							<th>PORT TYPE</th>
							<th>SHELF ID</th>
							<th>SLOT ID</th>
							<th>PORT ID</th>
							<th>CASCADE ID</th>
							<th>SERIALNUMBER</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height: 350px; overflow-y: scroll;">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
					<colgroup>
						<col width="5%">
						<col width="14%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col width="11%">
						<col>
					</colgroup>
					<tbody id="channel_grid" style="text-align: center;">
					</tbody>
				</table>
			</div>
		</section>
	</div>
</body>
</html>