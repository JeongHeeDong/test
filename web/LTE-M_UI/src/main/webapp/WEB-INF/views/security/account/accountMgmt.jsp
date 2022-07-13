<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<link href="/resources/css/accountForm.css" rel="stylesheet" type="text/css" />
	<script src="/resources/js/security/account/accountMgmt.js"></script>
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
								<label>계정 등급</label>
								<div id = "userLevel" class="mu-selectbox">
									<select name="userLevelSelect" class="mu-value">
										<option value="0">전체</option>
										<option value="1">시스템 관리자</option>
										<option value="2">관리자</option>
										<option value="3">운영자</option>
									</select>
								</div>
								<label>상태</label>
								<div id=userState" class="mu-selectbox">
									<select name="userStateSelect" class="mu-value">
										<option value="0">전체</option>
										<option value="1">승인</option>
										<option value="99">승인대기</option>
									</select>
								</div>
								<label>검색 옵션</label>
								<div id="searchOption" class="mu-selectbox">
									<select name="searchOptSelect" class="mu-value">
										<option value="id">ID</option>
										<option value="name">이름</option>
									</select>
								</div>
								<input type="text" value id="searchInput" class="mu-input"/>
							</div>
						</div>
						<div class="mu-search-btn">
							<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:accountMgmt.search()"><i class="mu-icon search"></i>검색</button>
							<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:accountRegister.accountRegisterPop()"><i class="mu-icon add"></i>등록</button>
							<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:accountModify.accountModifyPop()"><i class="mu-icon edit"></i>수정</button>
							<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:accountMgmt.accountRemove()"><i class="mu-icon del"></i>삭제</button>
                            <button type="button" class="mu-btn mu-btn-icon" onclick="javascript:accountMgmt.accountPasswordInit()"><i class="mu-icon cancel"></i>접속정보 초기화</button>							
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

			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap gridScrollT mt10">
						<table id="accountTable" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="57">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
							</colgroup>
							<thead>
								<tr>
									<th>
										<div class='mu-checkbox'>
											<input type='checkbox' id='headcheck'>
											<label for='headcheck'></label>
										</div>
									</th>
									<th>사용자등급</th>
									<th>이름</th>
									<th>ID</th>
									<th>상태</th>
									<!-- <th>핸드폰번호</th> -->
									<th>단말번호</th>
									<!-- <th>E-Mail</th> -->
									<th>접속 상태</th>
									<th>비밀번호 오류횟수</th>
									<th>접속정보 초기화</th>
									<th>비밀번호 변경일</th>
									<th>사용기간</th>
									<th>등록일</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="min-height:225px; max-height: 642px; overflow-y:scroll;">
						<table id="accountBodyTable" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="57">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
								<col width="">
							</colgroup>
							<tbody id="accountGrid">
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
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="accountTable" class="mu-grid mu-grid-border mu-grid-strip ">
							<thead>
							<tr>
								<th>
									<div class='mu-checkbox'>
										<input type='checkbox' id='headcheck'>
										<label for='headcheck'></label>
									</div>
								</th>
								<th>사용자등급</th>
								<th>이름</th>
								<th>ID</th>
								<th>상태</th>
								<th>핸드폰번호</th>
								<th>단말번호</th>
								<th>E-Mail</th>
							</tr>
							</thead>
							<tbody id="accountGrid">
							</tbody>
						</table>
					</div><!-- //gridWarp -->

				</div>
			</div>
			<div class="mu-row">
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

	<%@ include file="/WEB-INF/views/security/account/accountRegister.jsp" %>
	<%@ include file="/WEB-INF/views/security/account/accountModify.jsp" %>
</body>
</html>