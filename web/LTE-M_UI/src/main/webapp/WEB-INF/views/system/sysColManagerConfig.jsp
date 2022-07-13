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
	<script src="/resources/js/system/sysColManager.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div class="timeWrap"><i class="mu-icon clock"></i><span id="nowDateTime"></span></div>
					</div>
					<div class="troubleAlram">
						<div class="tit"><i></i>정상수집 / 지연</div>
						<ul>
							<li><i class="mu-icon alram warning"></i><span class="num" id="okCnt">0</span></li>
							<li><i class="mu-icon alram critical"></i><span class="num" id="nokCnt">0</span></li>
						</ul>
					</div>
					<div class="mu-item-group">
						<div class="mu-radio">
							<input type="radio" id="r1" name="search_col" value="all"  onclick="optionSearch()">
							<label for="r1">전체</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="r2" name="search_col" value="config" checked="checked" onclick="optionSearch()">
							<label for="r2">구성</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="r3" name="search_col" value="perform" onclick="optionSearch()">
							<label for="r3">성능</label>
						</div>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn" onclick="showSettingPopup()">임계치 설정</button>									
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<span class="lineY">
						<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="getColData()"><i class="mu-icon refresh"></i></button>
						<button id="repeatBtn" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only mu-toggle-btn mu-toggle-on"><i class="mu-icon pause"></i></button>
					</span>
				</div>
			</div>
			<div class="gridScrollT" style="margin-top: 10px">
				<table id="colTable" class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;">
					<colgroup>
						<col width="10.1%">
						<col width="6.8%">
						<col width="11.8%">
						<col width="39.2%">
						<col width="10.2%">
						<col width="21.5%">
					</colgroup>
					<thead>
						<tr>
							<th id="COLLECT_STATUS">수집상태</th>
							<th id="DATA_TYPE">구분</th>
							<th id="SYSTEM_ID">수집장비명</th>
							<th id="DATA_NAME">항목</th>
							<th id="COLLECT_TYPE">수집유형</th>
							<th id="COLLECT_DATE">최종수집시간</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v scrollY" style="height:420px;">
				<table class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;text-align: center;">
					<colgroup>
						<col width="10.1%">
						<col width="6.8%">
						<col width="11.8%">
						<col width="39.2%">
						<col width="10.2%">
						<col width="21.5%">
					</colgroup>
					<tbody id="sysColGrid">		
					</tbody>
				</table>
			</div>
			<!-- 고장 정보 grid -->
			
			<div class="subtitleWrap">
				<h4 class="mu-title">고장 수집 목록</h4>
			</div>
			
			<div class="gridScrollT" style="margin-top: 10px">
				<table id="colFailureTable" class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;">
					<colgroup>
						<col width="10.1%">
						<col width="6.8%">
						<col width="11.8%">
						<col width="39.2%">
						<col width="10.2%">
						<col width="21.5%">
					</colgroup>
					<thead>
						<tr>
							<th id="COLLECT_STATUS">수집상태</th>
							<th id="DATA_TYPE">구분</th>
							<th id="SYSTEM_ID">수집장비명</th>
							<th id="DATA_NAME">항목</th>
							<th id="COLLECT_TYPE">수집유형</th>
							<th id="COLLECT_DATE">최종수집시간</th>
						</tr>
					</thead>
				</table>
			</div>
			
			<div class="mu-scroll-v scrollY" style="height:300px">
				<table class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;text-align: center;">
					<colgroup>
						<col width="10.1%">
						<col width="6.8%">
						<col width="11.8%">
						<col width="39.2%">
						<col width="10.2%">
						<col width="21.5%">
					</colgroup>
					<tbody id="sysColFailureGrid">		
					</tbody>
				</table>
			</div>
		</section>
	</div>
	<%@ include file="/WEB-INF/views/system/sysColPopup.jsp" %>	
</body>
</html>