<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src=""></script>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="<c:url value="/resources/js/failure/main/failureAnalysisByEquip.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	
	<script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/paging.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/selectbox.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/dialog.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid_extend.js"></script>
</head>

<%
	Date nowDateTime = new Date();
								
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	String nowDate = dateFormat.format(nowDateTime);
%>

<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
		<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group mu-more-item"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
				<div class="mu-search-item" style="vertical-align: middle;">
					<div class="mu-item-group">
						<div class="mu-radio">
							<input type="radio" id="rd_analyEq_epc" name="rd_search_ea" value="epc" checked="checked">
							<label for="rd_analyEq_epc">EPC</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="rd_analyEq_access" name="rd_search_ea" value="access" >
							<label for="rd_analyEq_access">Access</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="rd_search_app" name="rd_search_ea" value="app">
							<label for="rd_search_app">서비스</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="rd_search_all" name="rd_search_ea" value="all">
							<label for="rd_search_all">전체</label>
						</div>
					</div>
					<div class="mu-item-group">
						<div class="searchTarget" style="margin-bottom: 10px">
							<button id="btn_search_target" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon search"></i>조회대상</button>
							<input id="target_system" type="text" class="mu-input" value="" title="" readonly="readonly">
						</div>
						<div class="mt5">
							<div class="mu-hgroup">
								<div class="mu-datepicker">
									<input id="box_analyEq_fromtime" type="text" value="<%=nowDate%>" readonly="readonly">
									<button id="btn_analyEq_fromtime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
								</div>
								<span>~</span>
								<div class="mu-datepicker">
									<input id="box_analyEq_totime" type="text" value="<%=nowDate%>" readonly="readonly">
									<button id="btn_analyEq_totime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
								</div>
							</div>
							<div class="mu-hgroup">
								<span>그래프:</span>
								<div class="mu-radio">
									<input type="radio" id="rd_byEquip" name="rd_analyEq_graph" value="equip" checked="checked">
									<label for="rd_byEquip">장비별</label>
								</div>
								<div class="mu-radio">
									<input type="radio" id="rd_byAlarmCode" name="rd_analyEq_graph" value="alarmCode">
									<label for="rd_byAlarmCode">알람코드별</label>
								</div>
							</div>
							<div class="mu-hgroup">
								<div class="mu-checkbox">
									<input id="chk_analyEq_spAlarmCode" type="checkbox">
									<label for="chk_analyEq_spAlarmCode">특정알람코드</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_analyEq_spTime" type="checkbox">
									<label for="chk_analyEq_spTime">특정시간</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_fault" type="checkbox"> 
									<label for="chk_fault"> Fault 알람</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_analyEq_spDate" type="checkbox">
									<label for="chk_analyEq_spDate">특정일자제외</label>
									<div class="mu-datepicker">
										<input readonly="readonly" type="text" id="analyEq_spDate">
									</div>
								</div>
								<div class="mu-checkbox">
									<input id="chk_alarmFilter" type="checkbox">
									<label for="chk_alarmFilter">알람필터</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_analyEq_noGraph" type="checkbox">
									<label for="chk_analyEq_noGraph">그래프 표시안함</label>
								</div>
							</div>
						</div>
					</div>
				</div><!-- //mu-search-item -->
				<div class="mu-search-btn">
					<div class="mu-vgroup">
						<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:getAlarmAnalysisByEquip(false)"><i class="mu-icon search"></i>조회</button>
						<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excelReport()"><i class="mu-icon excel"></i>엑셀저장</button>
					</div>
				</div>
			</div>
			
			<div class="chartWrap mt10" style="height:340px">
				<div id="alarmAnalysisGraph_area" class="chart"></div>
			</div>
			
			<div class="gridScrollT mt10">
				<table id="tb_alarmAnalysis_equip_header" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2 tbFix">
					<colgroup>
					</colgroup>
					<thead>
						<tr>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height: 438px;overflow-y: scroll;">
				<table id="tb_alarmAnalysis_equip" class="mu-grid mu-grid-border mu-grid-strip tbFix">
					<colgroup>
					</colgroup>
					<tbody>
					</tbody>
				</table>
			</div>	
		
			<div id="excel-export-div" style="display: none;">
				<div class="gridScrollT mt10">
					<table id="excel-export-header" class="mu-grid mu-grid-border mu-grid-strip tbFix">
						<colgroup>
						</colgroup>
						<thead>
							<tr>
							</tr>
						</thead>
					</table>
				</div>
				<div class="mu-scroll-v" style="height: 438px;overflow-y: scroll;">
					<table id="excel-export-body" class="mu-grid mu-grid-border mu-grid-strip tbFix">
						<colgroup>
						</colgroup>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
				
			<%@ include file="/WEB-INF/views/failure/popup/searchSystemSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/searchHourSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/alarmCodeSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/failureAnalysisByEquipDetail.jsp" %>
			<%@ include file="/WEB-INF/views/common/filter_alarm_checkbox.jsp" %>
			<%@ include file="/WEB-INF/views/common/fault_filter.jsp" %>
		</section>
	</div>
</body>
</html>