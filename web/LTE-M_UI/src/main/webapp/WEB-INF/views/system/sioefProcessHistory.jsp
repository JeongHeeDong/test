<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	
	<script src="/resources/js/system/sioefProcessHistory.js"></script>
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
							<input readonly="readonly" type="text" id="search_dt_from">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_dt_from_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<span>~</span>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_dt_to">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_dt_to_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<label>호스트 선택</label>
						<div class="mu-selectbox">
			                <button id="host_name_btn" class="mu-value" style="width:95px">전체</button>
			                <ul id="host_name_ul" class="mu-list">   
			                	<li onclick="searchHostSet('')">전체</li>
			                </ul>
			                <input type="hidden" id="searchHostIp" value = ''>
		                </div>	
						<label>상태</label>
						<div class="mu-selectbox">
			                <button id="status_select" class="mu-value" style="width:95px">전체</button>
			                <ul id="status_name_ul" class="mu-list">
			                	<li onclick="setSearchStatus('')">전체</li>
			                </ul>
			                <input type='hidden' id='searchStatus' value = ''/>
		                </div>                
		                <label>그룹</label>
						<div class="mu-selectbox">
			                <button id="group_select" class="mu-value" style="width:95px">전체</button>
			                <ul id="group_name_ul" class="mu-list">   
			             		<li onclick="setSearchGroup('')">전체</li>
			                </ul>
			                <input type='hidden' id='searchGroup' value = ''/>
		                </div>
		                <label>검색 조건</label>
		                <div class="mu-selectbox">
			                <button id="type_select" class="mu-value" style="width:105px">프로세스 명</button>
			                <ul id="search_type_ul" class="mu-list"> 
			                </ul>
			                <input type='hidden' id='searchType' value = 'procName'/>
		                </div>
		                <input type="text" class="mu-input" id="searchValue" value = '' size="40"/>
						<input type="hidden" id="port"/>
						<input type="hidden" id="hostIp"/>
						<input type="hidden" id="hostInfo"/>
						<input type="hidden" id="totalCnt"/>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getHistoryList(1)"><i class="mu-icon search"></i>검색</button>
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="" class="mu-grid mu-grid-border mu-grid-strip">
							<thead>
								<tr>
									<th>번호</th>
									<th>실행시간</th>
									<th>사용자 ID</th>
									<th>호스트명</th>
									<th>호스트 IP</th>
									<th>프로세스 명</th>
									<th>프로세스 설명</th>
									<th>포트</th>
									<th>프로세스 ID</th>
									<th>그룹 ID</th>
									<th>실행 타입</th>
									<th>실행 멸령어</th>
									<th>실행결과</th>
								</tr>
							</thead>
							<tbody id="historyTable">		
							</tbody>
						</table>
					</div>
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
						<input id="pageSize" type="hidden" value="20"/>
					</div><!-- //mu-pagination -->

				</div>
			</div>
		</section>
	</div>
</body>
</html>