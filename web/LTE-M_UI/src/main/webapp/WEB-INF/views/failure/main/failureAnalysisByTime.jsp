<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="<c:url value="/resources/js/failure/main/failureAnalysisByTime.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="/resources/js/highchart/highcharts.js"></script>
	
	<script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/paging.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/selectbox.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/dialog.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid_extend.js"></script>
	
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
		<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group mu-more-item"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
				<div class="mu-search-item" style="vertical-align: middle;">
					<div class="mu-item-group">
						<div class="mu-radio">
							<input type="radio" id="rd_analyTm_epc" name="rd_search_ea" value="epc" checked="checked">
							<label for="rd_analyTm_epc">EPC</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="rd_analyTm_access" name="rd_search_ea" value="access" >
							<label for="rd_analyTm_access">Access</label>
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
							<input id="target_system" type="text" class="mu-input" value="" readonly="readonly">
						</div>
						<div class="mt5">
							<div class="mu-hgroup">
								<div class="mu-datepicker">
									<input id="box_analyTm_fromtime" type="text" value="" readonly="readonly">
									<button id="btn_analyTm_fromtime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
								</div>
								<span>~</span>
								<div class="mu-datepicker">
									<input id="box_analyTm_totime" type="text" value="" readonly="readonly">
									<button id="btn_analyTm_totime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
								</div>
							</div>
							<div class="mu-hgroup">
								<span>그래프:</span>
								<div class="mu-radio">
									<input type="radio" id="rd_byTime" name="rd_analyTm_graph" value="time" checked="checked">
									<label for="rd_byTime">시간별</label>
								</div>
								<div class="mu-radio">
									<input type="radio" id="rd_byDate" name="rd_analyTm_graph" value="date">
									<label for="rd_byDate">일자별</label>
								</div>
							</div>
							<div class="mu-hgroup">
								<div class="mu-checkbox">
									<input id="chk_analyTm_spAlarm" type="checkbox">
									<label for="chk_analyTm_spAlarm">특정알람</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_analyTm_spTime" type="checkbox">
									<label for="chk_analyTm_spTime">특정시간</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_fault" type="checkbox"> 
									<label for="chk_fault"> Fault 알람</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_analyTm_spDate" type="checkbox">
									<label for="chk_analyTm_spDate">특정일자제외</label>
									<div class="mu-datepicker">
										<input readonly="readonly" type="text" id="analyTm_spDate">
									</div>
								</div>
								<div class="mu-checkbox">
									<input id="chk_alarmFilter" type="checkbox">
									<label for="chk_alarmFilter">알람필터</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_analyTm_noGraph" type="checkbox">
									<label for="chk_analyTm_noGraph">그래프 표시안함</label>
								</div>
							</div>
						</div>
					</div>
				</div><!-- //mu-search-item -->
				<div class="mu-search-btn">
					<div class="mu-vgroup">
						<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:getAlarmAnalysisByTime()"><i class="mu-icon search"></i>조회</button>
						<button type="button" class="mu-btn mu-btn-icon green" onclick="tableToExcel()"><i class="mu-icon excel"></i>엑셀저장</button>
					</div>
				</div>
			</div>
			
			<div class="chartWrap mt10" style="height:340px">
				<div id="alarmAnalysisGraph_area" class="chart"></div>
			</div>
			
			<div class="gridScrollT mt10">
				<table id="alarmByTimeTableHead" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2 tbFix">
					<colgroup>
					</colgroup>
					<thead id="tb_alarmAnalysis_time_header">
						<tr>
						</tr>
					</thead>
				</table>
			</div>
						
			<div class="mu-scroll-v" style="height: 438px;overflow-y: scroll;">
				<table id="alarmByTimeTable" class="mu-grid mu-grid-border mu-grid-strip tbFix" style="text-align:center">
					<!-- <thead id="tb_alarmAnalysis_time_header">
					</thead> -->
					<colgroup>
					</colgroup>
					<tbody id="tb_alarmAnalysis_time">
					</tbody>
				</table>
			</div>

			<div id="excel-export-div" style="display: none;">
				<div class="gridScrollT mt10">
					<table id="excel-export-head" class="mu-grid mu-grid-border mu-grid-strip tbFix">
						<colgroup>
						</colgroup>
						<thead id="excel-export-thead">
							<tr>
							</tr>
						</thead>
					</table>
				</div>

				<div class="mu-scroll-v" style="height: 438px;overflow-y: scroll;">
					<table id="excel-export-body" class="mu-grid mu-grid-border mu-grid-strip tbFix" style="text-align:center">
						<colgroup>
						</colgroup>
						<tbody id="excel-export-tbody">
						</tbody>
					</table>
				</div>
			</div>
			
			<iframe id="txtArea_failureAnalByTime" style="display:none"></iframe>	

			<%@ include file="/WEB-INF/views/failure/popup/searchSystemSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/searchHourSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/alarmCodeSelect.jsp" %>
			<%@ include file="/WEB-INF/views/common/filter_alarm_checkbox.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/failureAnalysisByTimeDetail.jsp" %>
			<%@ include file="/WEB-INF/views/common/fault_filter.jsp" %>
		</section>
	</div>
</body>
</html>