<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/pss/etc/etcSearch.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="mu-search-group"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
						<div class="mu-search-item">
							<div class="mu-item-group">
								<label>장비명</label>
								<input id="etc_nm_value" type="text" class="mu-input">
							</div>
						</div><!-- //mu-search-item -->
						<div class="mu-search-btn">
							<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:btnSearchClick()"><i class="mu-icon search"></i>검색</button>
							<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:etcAddView()"><i class="mu-icon add"></i>추가</button>
							<span class="lineY">
							 	<div class="mu-selectbox">
									<button class="mu-value" id="pageSize" value ='20'>20개씩 보기</button>
									<ul class="mu-list">
										<li data-id="20">20개씩 보기</li>
										<li data-id="50">50개씩 보기</li>
										<li data-id="100">100개씩 보기</li>
									</ul>
								</div>
							</span>
						</div>
					</div><!-- //mu-search-group -->
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">

					<div class="gridWrap gridScrollT mt10">
						<table id='table' class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="6%">
								<col width="15%" span="5">
								<col>
							</colgroup>
							<thead>
								<tr>
									<th>NO</th>
									<th>장비 구분</th>
									<th>장비명</th>
									<th>장비 ID</th>
									<th>IP</th>
									<th>Vendor</th>
									<th>상용일자</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="max-height: 691px; overflow-y:scroll;">
						<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="6%">
								<col width="15%" span="5">
								<col>
							</colgroup>
							<tbody id="etcGrid">
							</tbody>
						</table>
					</div><!-- //gridWarp -->

					<div class="mu-pagination mt20">
						<button type="button" class="mu-first" onclick="javascript:pagingBtn('first')"><span></span></button>
						<button type="button" class="mu-prev"onclick="javascript:pagingBtn('prev')"><span></span></button>
						<ul id="page_Btn_No">
							<li class="active"><a href="">1</a></li>
						</ul>
						<button type="button" class="mu-next" onclick="javascript:pagingBtn('next')"><span></span></button>
						<button type="button" class="mu-last" onclick="javascript:pagingBtn('last')"><span></span></button>
						<input id ="totalCount" type="hidden" value="0">
						<input id="pageNo" type="hidden" value="1">
					</div><!-- //mu-pagination -->

				</div>
			</div>
			</section>
		</div>
		<%@ include file="/WEB-INF/views/pss/etc/etcDetail.jsp" %>
		<%@ include file="/WEB-INF/views/pss/etc/etcAdd.jsp" %>
		
</body>
</html>