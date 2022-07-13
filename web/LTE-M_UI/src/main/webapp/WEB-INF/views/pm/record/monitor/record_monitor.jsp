<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<style type="text/css">
		.mu-grid thead > tr, .mu-grid thead > tr > th {height:29px;}
	</style>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script src="/resources/js/pm/record/monitor/record_monitor.js"></script>
	<script src="/resources/js/pm/common/popTrend.js"></script>
	<script src="/resources/js/pm/common/popDetail.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group" id="update_time">
					</div>
					<div>
						<label>감시대상</label>
						<div id = "equipDiv" class="mu-selectbox">
							<select id="equipSelect" class="mu-value">
								<option value="0" selected="selected">전체</option>
								<option value="8">CALL</option>
								<option value="9">PTT</option>
							</select>
						</div>
					</div>
				</div>
				<div class="mu-search-btn">
					<button id='basic_setting_btn' type="button" onclick="javascript:observeSetView()" class="mu-btn mu-btn-icon">감시범위설정</button>
					<button id='basic_setting_btn' type="button" onclick="javascript:basicSetView(10)" class="mu-btn mu-btn-icon">가청설정</button>
					<span class="lineY">
						<button type="button" onclick="javascript:getMaxDateTime()" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon refresh"></i></button>
						<button id="repeatBtn" type="button" onclick="javascript:intervalSet()" class="mu-btn mu-btn-icon mu-btn-icon-only"><i id="repeatIcon" class="mu-icon pause"></i></button>
					</span>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excel_download()"><i class="mu-icon excel"></i>엑셀 저장</button>
				</div>
			</div>
			
			<div id="callTitle" class="subtitleWrap" style="margin:10px 0 0px;">
				<h4 class="mu-title">CALL</h4>
			</div>
			<div id="callDiv" class="gridWrap" style="overflow:auto;">
				<table id="callTable" class="mu-grid mu-grid-border mu-grid-strip">
					<thead id="callHead">
						<tr>
							<th style="width:91px">장비명</th>
							<th>시도호</th>
							<th>성공호</th>
							<th>시도호증감율(%)</th>
							<th>성공율(%)</th>
						</tr>
					</thead>
					<tbody id="callGrid" style="text-align: center;" oncontextmenu="return false">
					</tbody>
				</table>
			</div><!-- //gridWarp -->
			
			<div id="pttTitle" class="subtitleWrap" style="margin:10px 0 0px;">
				<h4 class="mu-title">PTT</h4>
			</div>
			<div id="pttDiv" class="gridWrap" style="overflow:auto;">
				<table id="pttTable" class="mu-grid mu-grid-border mu-grid-strip">
					<thead id="pttHead">
						<tr>
							<th style="width:91px">장비명</th>
							<th>시도호</th>
							<th>성공호</th>
							<th>시도호증감율(%)</th>
							<th>성공율(%)</th>
						</tr>
					</thead>
					<tbody id="pttGrid" style="text-align: center;" oncontextmenu="return false">
					</tbody>
				</table>
			</div><!-- //gridWarp -->
			
			<input id='alarmInterval' type="hidden">
			<input id='maxDateTime' type="hidden">
			<%@ include file="/WEB-INF/views/pm/common/epcBasicSetting.jsp" %>
			<%@ include file="/WEB-INF/views/pm/common/popTrend.jsp" %>
			<%@ include file="/WEB-INF/views/pm/common/popDetail.jsp" %>
			
			<div id="observeSetBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
			<div id="observeSetUp" class="mu-dialog mu-fix-foot" style="width: 300px; height: 260px;z-index: 11; display: none;"><!-- resize 부분 -->
				<div id="observeSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
					<h2><span class="title">감시 지표별 주기 범위</span></h2>
					<button id="observeSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
				</div>
				<div class="mu-dialog-body" style="overflow-y:auto;">
					<!-- 감시기준 설정 -->
					<h3 class="mu-title">감시 지표별 주기 범위</h3>
					<table class="mu-formbox">
						<tbody>
							<tr>
								<th>
									<label>Call</label>
								</th>
								<td>
									<div class="mu-selectbox">
										<select id="call_monitor_range" class="mu-value">
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
											<option value="5">5</option>
										</select>
									</div>
								</td>
							</tr>
							<tr>
								<th>
									<label>PTT</label>
								</th>
								<td>
									<div class="mu-selectbox">
										<select id="ptt_monitor_range" class="mu-value">
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
											<option value="5">5</option>
										</select>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="mu-dialog-foot" style="text-align: center;">
					<button id="observeSetModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:observeSettingSave()"><i class="mu-icon check"></i>확인</button>
					<button id="observeSetCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
				</div>
			</div>
			
			<div style="display: none;position: absolute;"id="popMenu">
				<ul class="mu-popup-menu">
					<li><a href="javascript:popTrendView()">Trend 분석</a></li>
					<li><a href="javascript:popDetailView()">상세분석</a></li>
				</ul>
			</div>
			</section>
		</div>
</body>
</html>