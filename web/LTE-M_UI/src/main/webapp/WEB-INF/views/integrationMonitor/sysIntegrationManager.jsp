<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script src="/resources/js/integrationMonitor/sysIntegrationStateManager.js"></script>
	<script src="/resources/js/integrationMonitor/integrationstateManagerThreshold.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container system">
		<section>
			<!-- 네트워크 토폴로지 Top -->
			<div class="nwTopologyWrap">
				<!-- tabbutton -->
					<div class="sysstate_tab">
						<div class="syss_tapbutton">
							<!-- <button type="button" class="mu-btn tap" onclick="" disabled><span>전체</span></button>
							<button type="button" class="mu-btn tap active" onclick=""><i class="mu-line_icon line5"></i><span>구분</span></button>
							<button type="button" class="mu-btn tap" onclick="" disabled><i class="mu-line_icon line6"></i><span>구분</span></button>
							<button type="button" class="mu-btn tap" onclick="" disabled><i class="mu-line_icon line7"></i><span>구분</span></button>
							<button type="button" class="mu-btn tap" onclick="" disabled><i class="mu-line_icon line8"></i><span>구분</span></button> -->
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<div class="mu-selectbox" >
								<select id="selectedLine" class="mu-value" style="width:180px;height:35px;">
								</select>
							</div>
						</div>
						
					</div>
				<!-- tabbutton -->
				<div class="nwTopology fr">
					<%@ include file="/WEB-INF/views/title/title.jsp" %>
					<div class="timeWrap" id = "maxDateTime">감시시간 : <c:out value="${nowDateTime}"/></div>
					<div class="totalAlram">
						<div class="tit">성능 고장<br>통합 알람</div>
						<ul>
							<li><i class="mu-icon alram critical"></i><span class="num" id="criticalCnt">0</span></li>
							<li><i class="mu-icon alram major"></i><span class="num" id="majorCnt">0</span></li>
							<li><i class="mu-icon alram minor"></i><span class="num" id="minorCnt">0</span></li>
						</ul>
					</div>
					<div>
						<button type="button" class="mu-btn mu-toggle-btn mu-btn-icon" onclick="javascript:thresholdView()"><i class="mu-icon threshold"></i>임계치 설정</button>
						<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn " onclick="javascript:filterAlarmView(event,params.alarmFilter)"><i class="mu-icon filter"></i>알람필터</button>
						<button id="alarmBtn" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:alarmSound()"><i class="mu-icon sound"></i>가청</button>
						<button id="repeatBtn" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:intervalSet()"><i class="mu-icon watch"></i>감시중</button>
					</div>
				</div>
			</div>

			<div class="topologyWrap">
				<h4 class="mu-title">주제어장치 상태 감시</h4>
				<div class="gridWrap" style="height:420px;">
					<table id="sysVmStateTable" class="mu-grid mu-grid-border mu-grid-strip" style="border:0;">
						<thead>
							<tr>
								<th>등급</th>
								<th>구분</th>
								<th>장비타입</th>
								<th>장비명</th>
								<th>NODE</th>
								<th>시간</th>
								<th>CPU(%)</th>
								<th>Memory(%)</th>
								<th id="vmDiskColumnTh" colspan="1">Disk(%)</th>
							</tr>
						</thead>
						<tbody id="sysVmStateGrid" style="text-align: center;">
						</tbody>
					</table>
				</div><!-- //gridWarp -->
				
				<h4 class="mu-title">서비스 장비 상태 감시</h4>
				<div class="gridWrap" style="height:420px;">
					<table id="sysStateTable" class="mu-grid mu-grid-border mu-grid-strip" style="border:0;">
						<thead>
							<tr>
								<th>등급</th>
								<th>구분</th>
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

				<%@ include file="/WEB-INF/views/common/filter_alarm.jsp" %>
				<%@ include file="/WEB-INF/views/system/stateManagerThreshold.jsp" %>
				<input type="hidden" id = "rowIndex" value=9999>
				<input type="hidden" id = "pageFlag" value=<c:out value="${pageFlag}"/>>
				
				
				<div id="chartBg" class="mu-dialog-background" style="z-index: 14; display: none;"></div>
				<div id="chartUp" class="mu-dialog" style="width: 1700px; height: 480px;z-index: 15; display: none;"><!-- resize 부분 -->
					<div id="chartTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
						<h2><span class="title" id="trendTitle">시스템 상태 Trend</span></h2>
						<button id="chartClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
					</div>
					<div class="mu-dialog-body" style="overflow-y:auto;">
						<div class="gridListWrap">
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
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</body>
</html>