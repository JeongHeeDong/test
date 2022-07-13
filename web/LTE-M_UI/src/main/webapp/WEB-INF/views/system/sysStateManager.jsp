<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script src="/resources/js/system/sysStateManager.js"></script>
	<script src="/resources/js/system/stateManagerThreshold.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container sysState">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div class="timeWrap"><i class="mu-icon clock"></i><span id="maxDateTime">감시시간 : </span></div>
					</div>
					<div class="mu-item-group"><label id="alarmTot">Total : 0</label></div><!-- 추가 - 기능구현안됨 -->
					<div class="troubleAlram">
						<ul>
							<li><i class="mu-icon alram critical"></i><span class="num" id="criticalCnt">0</span></li>
							<li><i class="mu-icon alram major"></i><span class="num" id="majorCnt">0</span></li>
							<li><i class="mu-icon alram minor"></i><span class="num" id="minorCnt">0</span></li>
						</ul>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn" onclick="javascript:thresholdView()">임계치 설정</button>
					<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn " onclick="javascript:filterAlarmView(event,params.alarmFilter)"><i class="mu-icon filter"></i>알람필터</button>
					<span class="lineY">
						<button id="alarmBtn" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:alarmSound()"><i class="mu-icon sound"></i>가청</button>
						<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="javascript:getStateData()"><i class="mu-icon refresh"></i></button><!-- 추가 - 기능구현안됨 -->
						<button id="repeatBtn" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only mu-toggle-btn mu-toggle-on" onclick="javascript:intervalSet()"><i class="mu-icon pause" id="playBtn"></i></button>
					</span>
				</div>
			</div>
			<div class="gridWrap mt10" style="height:422px">
				<table id="sysStateTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover" >
					<thead>
						<tr>
							<th>등급</th>
							<th>장비타입</th>
							<th>장비명</th>
							<th>CPU(EA)</th>
							<th>MEM(GB)</th>
							<th>시간</th>
							<th>CPU(%)</th>
							<th>Memory(%)</th>
							<th id="diskColumnTh" colspan="1">Disk(%)</th>
						</tr>
					</thead>
					<tbody id="sysStateGrid" style="text-align: center;">
					</tbody>
				</table>
			</div><!-- //gridWarp -->

			<div class="subtitleWrap">
				<h4 class="mu-title" id="trendTitle">시스템 상태 Trend(전체)</h4>
			</div>
			<div class="mu-boxWrap" id="sysTrendTable">
				<div class="mu-boxRow" id="sysTrendGrid">
					<div class="mu-boxCell chartWrap">
						<h5 class="mu-title">CPU 사용율(%)</h5>
						<div id="cpu_chart">cpu trend</div>
					</div>
					<div class="mu-boxCell chartWrap">
						<h5 class="mu-title">Memory 사용율(%)</h5>
						<div id="memory_chart">memory trend</div>
					</div>
					<div class="mu-boxCell chartWrap">
						<h5 class="mu-title">Disk 사용율(%)</h5>
						<div id="disk_chart">disk trend</div>
					</div>
				</div>
			</div>
			<!--<div class="chartWrap">
				<table id="sysTrendTable" class="mu-grid mu-grid-border">
					<tbody id="sysTrendGrid">
						<tr>
							<td>
								<div id="cpu_chart" style="width: 600px;height: 330px">cpu trend</div>
							</td>
							<td>
								<div id="memory_chart" style="width: 600px;height: 330px">memory trend</div>
							</td>
							<td>
								<div id="disk_chart" style="width: 600px;height: 330px">disk trend</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>-->
			<%@ include file="/WEB-INF/views/common/filter_alarm.jsp" %>
			<%@ include file="/WEB-INF/views/system/stateManagerThreshold.jsp" %>
			<input type="hidden" id = "rowIndex" value="">
			<input type="hidden" id = "pageFlag" value=<c:out value="${pageFlag}"/>>
		</section>
	</div>
</body>
</html>