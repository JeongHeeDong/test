<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<style type="text/css">
		ul.tabs {
			margin: 0;
			padding: 0;
			float: left;
			list-style: none;
			height: 32px;
			border-bottom: 1px solid #eee;
			border-left: 1px solid #eee;
			width: 100%;
			font-family:"dotum";
			font-size:12px;
		}
		ul.tabs li {
			float: left;
			text-align:center;
			cursor: pointer;
			width:82px;
			height: 31px;
			line-height: 31px;
			border: 1px solid #eee;
			border-left: none;
			font-weight: bold;
			background: #fafafa;
			overflow: hidden;
			position: relative;
		}
		ul.tabs li.active {
			background: #FFFFFF;
			border-bottom: 1px solid #FFFFFF;
		}
		.tab_container {
			border: 1px solid #eee;
			border-top: none;
			clear: both;
			float: left;
			width: 100%;
			background: #FFFFFF;
		}
		.tab_content {
			padding: 5px;
			font-size: 12px;
			display: none;
		}
		.tab_container .tab_content ul {
			width:100%;
			margin:0px;
			padding:0px;
		}
		.tab_container .tab_content ul li {
			padding:5px;
			list-style:none;
		}
		.mu-toggle-btn.top-buttons {
			height:35px;
		}

		a.cbtn {display:inline-block; height:25px; padding:0 14px 0; border:1px solid #304a8a; background-color:#3f5a9d; font-size:13px; color:#fff; line-height:25px;}
		a.cbtn:hover {border: 1px solid #091940; background-color:#1f326a; color:#fff;}
		.mu-dialog {display:none; position: absolute; top: 50%; left: 50%; z-index: 5;}
		.mu-boxWrap {border-spacing: 0px}
	</style>
	<script src="/resources/lib/qunee/qunee-min.js"></script>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
	<script type="text/javascript" src="/resources/js/integrationMonitor/trainOperation.js"></script>
	<link rel="stylesheet" href="/resources/css/qunee-tooltip.css">
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<%--<div class="mu-container dbSubway">--%>
	<div class="mu-container dbSubway">
		<section>
			<!-- 네트워크 토폴로지 Top -->
			<div class="nwTopologyWrap">
				<div class="nwTopology fr">
					<%@ include file="/WEB-INF/views/title/title.jsp" %>
					<div class="timeWrap"></div>
					<div class="totalAlram">
						<div class="tit" style="padding-top: 12px">성능 알람</div>
						<ul>
							<li id="criIndicator"><i class="mu-icon alram critical"></i><span id="cntAllLevel1" class="num"></span></li>
							<li id="majIndicator"><i class="mu-icon alram major"></i><span id="cntAllLevel2" class="num"></span></li>
							<li id="minIndicator"><i class="mu-icon alram minor"></i><span id="cntAllLevel3" class="num"></span></li>
							<%--<li id="warIndicator"><i class="mu-icon alram warning"></i><span id="cntAllLevel4" class="num"></span></li>--%>
						</ul>
					</div>
					<div>
						<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn" onclick="javascript:filterAlarmView(event, TRAIN_MONITOR.params.filterLevel)"><i class="mu-icon filter"></i>알람필터</button>
						<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="soundBtn"><i class="mu-icon sound"></i>가청</button>
						<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="watchBtn"><i class="mu-icon watch"></i>감시중</button>
					</div>
				</div>
			</div>


			<!-- Subway -->
			<div id="topology" class="trainOpertionWrap" style="background-color: #556371;"></div>

			<!-- Grid -->
			<!-- 차량단말이 제대로 들어올 때 다시 사용 -->
			<div class="gridListWrap" style="z-index: 100">
				<div class="tab_container">
					<ul class="mu-tab">
						<li rel="tab1" class="active" style="cursor: pointer"><a>전체</a></li>
						<li rel="tab2" id="trainNo" style="cursor: pointer"><a></a></li>
					</ul>
					<%--<div class="btnWrap fr">--%>
						<%--<button type="button" class="mu-btn mu-btn-img" id="excelExportBtn"><i class="mu-icon excel2"></i></button>--%>
					<%--</div>--%>
					<div class="mu-tab-body">
						<div id="tab1" class="mu-tabCont tab_content"></div>

						<div id="tab2" class="mu-tabCont tab_content">
							<div class="mu-boxWrap">
								<div class="mu-boxRow">
									<div class="mu-boxCell chartWrap">
										<h5 class="mu-title"></h5>
										<div id="phone1"></div>
									</div>
									<div class="mu-boxCell chartWrap">
										<h5 class="mu-title"></h5>
										<div id="phone2"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<%--<div class="popupArea"></div>--%>
	<%--<div class="popupDuImgArea"></div>--%>
	<%--<div class="mu-dialog du-trend drag" style="width:1000px;height:445px;top:300px;left:200px;">--%>
		<%--<div class="mu-dialog-head dragHandle">--%>
			<%--<h2><span class="title"></span></h2>--%>
			<%--<button type="button" class="mu-btn mu-btn-icon chart-close"><i class="mu-icon-img cancel"></i></button>--%>
		<%--</div>--%>
		<%--<div class="mu-dialog-body-top">--%>
			<%--<div class="mu-search-group">--%>
				<%--<div class="mu-hgroup">--%>
					<%--<div class="mu-datepicker">--%>
						<%--<input class="datepicker-time" id="start-date" type="text" value="" readonly="readonly">--%>
						<%--<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn"><i class="mu-icon calendar"></i></button>--%>
					<%--</div>--%>
					<%--<div class="mu-selectbox">--%>
						<%--<select name="start-hour" class="mu-value select-hour"></select>--%>
					<%--</div>--%>
					<%--<div class="mu-selectbox">--%>
						<%--<select name="start-minute" class="mu-value select-minute"></select>--%>
					<%--</div>--%>
				<%--</div>--%>
				<%--<span>~</span>--%>
				<%--<div class="mu-hgroup">--%>
					<%--<div class="mu-datepicker">--%>
						<%--<input class="datepicker-time" id="end-date" type="text" value="" readonly="readonly">--%>
						<%--<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn"><i class="mu-icon calendar"></i></button>--%>
					<%--</div>--%>
					<%--<div class="mu-selectbox">--%>
						<%--<select name="end-hour" class="mu-value select-hour"></select>--%>
					<%--</div>--%>
					<%--<div class="mu-selectbox">--%>
						<%--<select name="end-minute" class="mu-value select-minute"></select>--%>
					<%--</div>--%>
				<%--</div>--%>
				<%--<div class="mu-hgroup">--%>
					<%--<div class="mu-selectbox">--%>
						<%--<select name="trendAxis" class="mu-value">--%>
							<%--<option value="0">전체</option>--%>
							<%--<option value="1">성공율</option>--%>
							<%--<option value="2">절단율</option>--%>
						<%--</select>--%>
					<%--</div>--%>
				<%--</div>--%>
				<%--<button id="trendRequest" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" data-duid="" data-stationid=""><i class="mu-icon search"></i></button>--%>
			<%--</div>--%>
		<%--</div>--%>
		<%--<div class="mu-dialog-body">--%>
			<%--<div id="chartWrap"></div>--%>
		<%--</div>--%>
	<%--</div>--%>

	<%@ include file="/WEB-INF/views/common/filter_alarm.jsp" %>

	<%--차량 단말 성능 툴팁--%>
	<%--줄바꿈 하면 안됨--%>
	<div id="tooltip" class="mu-tooltip trainMonitor" style="display:none;width:400px;"><div class="mu-tooltip-header main"></div><div class="mu-tooltip-header sub"></div><div class="mu-tooltip-inner"><table class="mu-formbox"><colgroup><col width="28%"><col width="28%"><col width="22%"><col width="22%"></colgroup><thead><tr><th>단말번호</th><th>호</th><th>발신</th><th>착신</th></tr></thead><tbody id="tooltipTable"></tbody></table></div></div>

	<div id="test"></div>

	<!-- 파일 다운로드를 위한 form -->
	<%--<div style="display:none">
		<form action="/integration/monitor/station/grid/excelExport" method="post">
			<input type="hidden" id="title" value="역사별 통합 감시" />
			<input type="hidden" id="headers" value />
			<input type="hidden" id="columns" value />
		</form>
	</div>--%>
	<iframe id="excelDownload" style='display: none;' ></iframe>
</body>
</html>
