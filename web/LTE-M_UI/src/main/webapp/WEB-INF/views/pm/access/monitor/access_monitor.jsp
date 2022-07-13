<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<c:set var="ruCellType"><spring:eval expression="@locationconfig['ru.cell.type']" /></c:set>
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script type="text/javascript">
		var ruCellType = '${ruCellType}';
	</script>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script src="<c:url value="/resources/js/pm/access/monitor/access_monitor.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/pm/common/popTrend.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/pm/common/popDetail.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
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
<!-- 					<label>구분</label>
					<div class="mu-selectbox">
						<select id="selectedLine" class="mu-value" onchange="changeEquipSelectJob()"></select>
					</div> -->
				</div>
				<div class="mu-search-btn">
					<!-- <button id='basic_setting_btn' type="button" onclick="javascript:observeSetView()" class="mu-btn mu-btn-icon">감시 대상 필터</button> -->
					<button id='basic_setting_btn' type="button" onclick="javascript:basicSetView(2)" class="mu-btn mu-btn-icon">기본설정</button>
					<span class="lineY">
						<button type="button" onclick="javascript:getSearchData()" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon refresh"></i></button>
						<button id="repeatBtn" type="button" onclick="javascript:intervalSet()" class="mu-btn mu-btn-icon mu-btn-icon-only"><i id="repeatIcon" class="mu-icon pause"></i></button>
					</span>
				</div>
			</div>
			<div id="accessKpiDiv">
				<div class="subtitleWrap">
					<h4 class="mu-title" style="display:inline-block">KPI</h4>
					<!-- <div style="display:inline-block;padding-left:20px;"> -->
					<div style="display:none">
						<label>감시대상</label>
						<div id = "equipDiv" class="mu-selectbox">
	                        <select id="equipSelect" class="mu-value">
								<option value=2 selected="selected">기지국</option>
								<c:if test="${ruCellType == 'RU'}">
									<option value=3>중계기</option>
								</c:if>
								<c:if test="${ruCellType == 'CELL'}">
									<option value=3>Cell</option>
								</c:if>
	                        </select> 
	                    </div>
                    </div>
					
					<div class="hdRight">
						<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:kpi_excel_download()"><i class="mu-icon excel"></i>엑셀 저장</button>
					</div>
				</div>
				<div class="gridScrollT">
					<table id="accessKpiTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2">
						<colgroup class="js-kpi-colgroup">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
						</colgroup>
						<thead>
							<tr id="kpiTheadTr">
								<th class="updown" id="LINE_ID">구분</th>
								<th class="updown" id="DU_ID">장비 ID</th>
								<th class="updown" id="DU_NAME">기지국</th>
								<th class="updown" id="ATTEMPT" title="RRC 시도호">RRC 시도호</th>
								<th class="updown" id="LINE_ID" title="RRC 기준 시도호">RRC 기준 시도호</th>
								<th class="updown" id="ATT_RATE" title="RRC 시도호 증감율(%)">RRC 시도호 증감율(%)</th>
								<th class="updown" id="ERAB_ATTEMPT" title="ERAB Setup 시도호">ERAB Setup 시도호</th>
								<th class="updown" id="STD_ERAB_5M" title="ERAB Setup 기준 시도호">ERAB Setup 기준 시도호  </th>
								<th class="updown" id="ERAB_ATT_RATE" title="ERAB Setup 시도호 증/감율">ERAB Setup 시도호 증/감율</th>
								<th class="updown" id="RRC" title="소통호(RRC 성공호)">소통호(RRC 성공호)</th>
								<th class="updown" id="RRC_RATE" title="소통율(RRC 성공율)(%)">소통율(RRC 성공율)(%)</th>
								<th class="updown" id="ANSWER" title="완료호(ERAB Setup 성공호)">완료호(ERAB Setup 성공호)</th>
								<th class="updown" id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)">완료율(ERAB Setup 성공율)(%)</th>
								<th class="updown" id="ERAB_ADD_SUCCESS" title="ERAB Setup Add 성공호">ERAB Setup Add 성공호</th>
								<th class="updown" id="CD" title="절단호">절단호</th>
								<th class="updown" id="CD_RATE" title="절단율(%)">절단율(%)</th>
							</tr>
						</thead>
					</table>
				</div><!-- //gridWarp -->
				
				<div class="mu-scroll-v" style="max-height:750px; overflow-y: scroll; ">
					<table id="tb_failure_alarm" class="mu-grid mu-grid-border mu-grid-strip">
						<colgroup class="js-kpi-colgroup">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
						</colgroup>
						<tbody id="accessKpiGrid" style="text-align: center;" oncontextmenu="return false">
						</tbody>
					</table>
				</div>
			</div>
			
			<%@ include file="/WEB-INF/views/pm/common/basicSetting.jsp" %>
			<%@ include file="/WEB-INF/views/pm/common/popTrend.jsp" %>
			<%@ include file="/WEB-INF/views/pm/common/popDetail.jsp" %>
			
			<div id="observeSetBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
			<div id="observeSetUp" class="mu-dialog mu-fix-foot" style="width: 290px; height: 290px;z-index: 11; display: none;"><!-- resize 부분 -->
			    <div id="observeSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
			        <h2><span class="title">감시 대상 필터</span></h2>
			        <button id="observeSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
			    </div>
			    <div class="mu-dialog-body" style="overflow-y:auto;">
					<!-- 감시 대상 설정 -->
			        <h3 class="mu-title">감시 대상 필터</h3>
			     	<table class="mu-formbox">
			            <tbody>
				            <tr>
				            	<td>
				                    <div class='mu-checkbox'>
						   				<input type='checkbox' id='kpi_check' checked="checked">
						   				<label for='kpi_check'>KPI 감시</label>
						   			</div>
			                   </td>
				            </tr>
				            <!-- <tr>
				            	<td>
				                    <div class='mu-checkbox'>
						   				<input type='checkbox' id='dtp_check' checked="checked">
						   				<label for='dtp_check'>Data Throughput 감시</label>
						   			</div>
			                   </td>
				            </tr>
				            <tr>
				            	<td>
				                    <div class='mu-checkbox'>
						   				<input type='checkbox' id='hand_check' checked="checked">
						   				<label for='hand_check'>HandOver 감시</label>
						   			</div>
			                   </td>
				            </tr> -->
			        	</tbody>
			        </table>
				</div>
			    <div class="mu-dialog-foot" style="text-align: center;">
			    	<button id="observeSetModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:observeSettingSave()"><i class="mu-icon check"></i>확인</button>
				    <button id="observeSetCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
			    </div>
			</div>
			
			
			
			<input id='alarmInterval' type="hidden">
			<div style="display: none; position: absolute;"id="popMenu">
				<ul class="mu-popup-menu">
				    <li><a href="javascript:popTrendView()">Trend 분석</a></li>
				    <li><a href="javascript:popDetailView()">상세분석</a></li>
				</ul>
			</div>
		</section>
	</div>
</body>
</html>