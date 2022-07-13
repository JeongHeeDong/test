<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/security/unauthorizedUse/unauthSearch.js"></script>
	<link href="/resources/css/accountForm.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>날짜</label>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_from">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_from_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<span> ~ </span>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_to">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_to_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<label>부정사용 종류</label>
						<div id="searchOptDiv" class="mu-selectbox">
	                        <select id="searchOpt" class="mu-value">
	                            <option value="0">전체</option>
								<option value="1">비밀번호 입력 오류</option>
								<option value="2">아이디 입력 오류</option>
								<option value="3">미허가 IP로 접근</option>
								<option value="4">권한이 없는 메뉴 접근</option>
	                        </select>
	                    </div>
	                    <div id="secondOptDiv" class="mu-selectbox">
	                        <select id="secondOpt" class="mu-value">
	                            <option value="0">접속 시도 IP</option>
								<option value="1">접속 시도 ID</option>
								<option value="2">접속 시도 메뉴명</option>
								<option value="3">사용자 ID</option>
	                        </select>
	                    </div>
	               		<input class="mu-input" id="searchWord" type="text" size="40"/>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="btnSearchClick()"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<div class="lineY">
						<div id="listSizeOpstion" class="mu-selectbox">
							<select id="pageSize" class="mu-value">
								<option value=10>10개씩 보기</option>
								<option value=20 selected>20개씩 보기</option>
								<option value=50>50개씩 보기</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap gridScrollT mt10">
						<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup class="js-grid-colgroup">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="20%">
								<col width="10%">
								<col>
							</colgroup>
							<thead>
							<tr id="unauthDataGridHeader">
								<th>시간</th>
								<th>부정사용 종류</th>
								<th>접근 시도 IP</th>
								<th>접근 시도 ID</th>
								<th>접근 시도 URI</th>
								<th>사용자 ID(이름)</th>
								<th>메뉴명</th>
							</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="min-height:225px; max-height: 642px; overflow-y:scroll;">
						<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup class="js-grid-colgroup">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="20%">
								<col width="10%">
								<col>
							</colgroup>
							<tbody id="unauthDataGridBody">
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
		</section>
	</div>
</body>
</html>