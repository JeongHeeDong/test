<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/security/logMgmt/logMgmt.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="mu-search-group">
						<div class="mu-search-item">
							<div class="mu-item-group">
								<div class="mu-datepicker">
									<input class="datepicker-time" id="start-date" type="text" value="" readonly="readonly">
									<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn"><i class="mu-icon calendar"></i></button>
								</div>
								<span>~</span>
								<div class="mu-datepicker">
									<input class="datepicker-time" id="end-date" type="text" value="" readonly="readonly">
									<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn"><i class="mu-icon calendar"></i></button>
								</div>
								<span class="lineY">
									<div id="searchOption" class="mu-selectbox">
										<select name="searchOptSelect" class="mu-value">
											<option value="id">사용자 ID</option>
											<option value="name">사용자 이름</option>
											<option value="ip">접속 IP</option>
											<option value="menu">메뉴명</option>
										</select>
									</div>
									<input type="text" value id="searchInput" class="mu-input"/>
								</span>
							</div>
						</div>
						<div class="mu-search-btn">
							<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:logMgmt.search()"><i class="mu-icon search"></i>조회</button>
							<span class="lineY">
								<div id="listSizeOpstion" class="mu-selectbox">
									<select id="pageSize" class="mu-value">
										<option value=10>10개씩 보기</option>
										<option value=20 selected>20개씩 보기</option>
										<option value=50>50개씩 보기</option>
									</select>
								</div>
							</span>
						</div>
					</div>
				</div>
			</div>

			<%--<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="logTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-number">
							<thead>
							<tr>
								<th>No</th>
								<th>ID</th>
								<th>이름</th>
								<th>접속 IP</th>
								<th>메뉴명</th>
								<th>접속시간</th>
							</tr>
							</thead>
							<tbody id="logGrid">
							</tbody>
						</table>
					</div><!-- //gridWarp -->

				</div>
			</div>--%>

			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap gridScrollT mt10">
						<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="20%">
								<col width="20%">
								<col width="20%">
								<col width="">
								<col width="20%">
							</colgroup>
							<thead>
							<tr>
								<th>ID</th>
								<th>이름</th>
								<th>접속 IP</th>
								<th>메뉴명</th>
								<th>접속시간</th>
							</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="min-height:225px; max-height: 642px; overflow-y:scroll;">
						<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="20%">
								<col width="20%">
								<col width="20%">
								<col width="">
								<col width="20%">
							</colgroup>
							<tbody id="logGrid">
							</tbody>
						</table>
					</div>

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





			<%--<div class="mu-row">
				<div class="mu-col mu-col-12">
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
			</div>--%>
		</section>
	</div>
</body>
</html>