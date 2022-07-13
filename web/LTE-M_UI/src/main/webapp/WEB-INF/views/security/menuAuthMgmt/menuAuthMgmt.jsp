<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/security/menuAuthMgmt/menuAuthMgmt.js"></script>
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
							<label>사용자 등급</label>
							<div class="mu-selectbox">
								<select name="authSelect" class="mu-value userRoll"></select>
							</div>
						</div>
						<div class="mu-search-btn">
							<div class="mu-item-group">
								<label>메뉴명</label>
								<input type="text" value id="searchInput" class="mu-input"/>
								<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:menuAuthMgmt.search()"><i class="mu-icon search"></i>조회</button>
								<%--<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:menuAuthModify.menuAuthModifyPop()"><i class="mu-icon edit"></i>수정</button>--%>
								<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:menuAuthMgmt.menuAuthModify()"><i class="mu-icon edit"></i>수정</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10">
						<div class="gridScrollT">
							<table class="mu-grid mu-grid-border mu-strip mu-grid-number">
								<colgroup>
									<col width="10%">
									<col width="30%">
									<col width="30%">
									<col width="30%">
								</colgroup>
								<thead>
								<tr>
									<th>No</th>
									<th>메뉴명</th>
									<th>메뉴 설명</th>
									<th>권한</th>
								</tr>
								</thead>
							</table>
						</div>
						<div class="mu-scroll-v" style="height: 642px;">
							<table id="menuAuthTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-number mu-scroll-v">
								<colgroup>
									<col width="10%">
									<col width="30%">
									<col width="30%">
									<col width="30%">
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>

					<%--<div class="mu-pagination mt20">
						<button type="button" class="mu-first" onclick="javascript:pagingBtn('first')"><span></span></button>
						<button type="button" class="mu-prev"onclick="javascript:pagingBtn('prev')"><span></span></button>
						<ul id="page_Btn_No">
							<li class="active"><a href="">1</a></li>
						</ul>
						<button type="button" class="mu-next" onclick="javascript:pagingBtn('next')"><span></span></button>
						<button type="button" class="mu-last" onclick="javascript:pagingBtn('last')"><span></span></button>
						<input id ="totalCount" type="hidden" value="0">
						<input id="pageNo" type="hidden" value="1">
					</div><!-- //mu-pagination -->--%>
				</div>
			</div>

		</section>
	</div>
</body>
</html>