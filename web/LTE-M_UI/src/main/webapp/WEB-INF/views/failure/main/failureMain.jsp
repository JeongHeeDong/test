<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<link rel="stylesheet" type="text/css" href="/resources/css/data_tables.css" />
	<script src="<c:url value="/resources/js/failure/main/failureMain.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/failure/main/failureGrid.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/failure/filter/failureFilter.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<!-- <script src="/resources/js/jquery.dataTables.min.js"></script> -->
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div class="timeWrap"><i class="mu-icon clock"></i>기준시간 : <span id="today_time"></span></div>
					</div>
					<!-- <div class="mu-item-group"><label>Total : 0</label></div> -->
					<div class="mu-item-group">
						<label>Total :</label>
						<span id="cntAlarmTot">0</span>
						<!-- <input id="cntAlarmTot" type="text" value="0" class="mu-input"> -->
					</div>
					<div class="troubleAlram">
						<ul>
							<li><i class="mu-icon alram critical"></i><span id="cntLevel1" class="num">0</span></li>
							<li><i class="mu-icon alram major"></i><span id="cntLevel2" class="num">0</span></li>
							<li><i class="mu-icon alram minor"></i><span id="cntLevel3" class="num">0</span></li>
							<li><i class="mu-icon alram nomal"></i><span id="cntLevel4" class="num">0</span></li>
						</ul>
					</div>
					<!-- <div class="mu-search-item" style="float:right;"> -->
	<!-- 				<div class="mu-item-group">
						<label>구분</label>
						<div class="mu-selectbox" >
							<select id="selectedLine" class="mu-value" onchange="changeSelectLine()"></select>
						</div>
					</div> -->
				</div>
				<div class="mu-search-btn">
					<!-- <button id="btn_unRecoveredInfo" type="button" class="mu-btn mu-btn-icon">미복구</button> -->
					<!-- <span class="lineY"> -->
						<button id="btn_alarmGradeFilter" type="button" class="mu-btn mu-btn-icon">알람등급</button>
						<button id="btn_alarmCodeFilter" type="button" class="mu-btn mu-btn-icon">알람코드</button>
						<button id="btn_systemFilter" type="button" class="mu-btn mu-btn-icon">장비</button>
						<!-- <button id="btn_stationFilter" type="button" class="mu-btn mu-btn-icon">역사</button> -->
					<!-- </span> -->
					<span class="lineY">
						<button id="btn_alarmSound" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:alarmSound()"><i class="mu-icon sound"></i>가청</button>
						<button id="btn_alarmPause" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon pause"></i></button>
					</span>
				</div>
			</div>
			<div class="mu-boxWrap">
				<div class="mu-boxRow">
					<div class="mu-boxCell wp35">
						<div class="subtitleWrap">
							<h4 class="mu-title">중요고장 목록</h4>
							<div class="hdRight">
								<button id="btn_majorFailureFilter" type="button" class="mu-btn mu-btn-icon">중요고장 필터</button>
								<!-- <button id="btn_majorFailureDetail" type="button" class="mu-btn mu-btn-icon">중요고장 이력 조회</button> -->
							</div>
						</div>
						
						<div class="gridScrollT">
							<table class="mu-grid mu-grid-border mu-grid-strip tbFix">
								<colgroup>
									<col width="8%">
									<col width="8%">
					                <col width="12%">
						            <col>
						            <%-- <col width="12%"> --%>
						            <%-- <col width="15%"> --%>
						            <col width="16%">
						            <col width="8%">
								</colgroup>
								<thead>
								<tr>
									<th class='overTxt' title='등급'>등급</th>
									<th class='overTxt' title='알람코드'>알람코드</th>
									<th class='overTxt' title='장비타입'>장비타입</th>
									<th class='overTxt' title='장비명'>장비명</th>
									<!-- <th class='overTxt' title='장비명'>구분</th> -->
									<!-- <th class='overTxt' title='역사명'>역사명</th> -->
									<th class='overTxt' title='발생시간'>발생시간</th>
									<th class='overTxt' title='인지상태'>인지상태</th>
								</tr>
								</thead>
							</table>
						</div>
						<div class="gridWrap mu-scroll-v" style="height: 770px;overflow-y: scroll;">
							<table id="tb_majorFailure_alarm" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip tbFix" oncontextmenu="return false;">
								<colgroup>
									<col width="8%">
									<col width="8%">
					                <col width="12%">
						            <col>
						            <%-- <col width="12%"> --%>
						            <%-- <col width="15%"> --%>
						            <col width="16%">
						            <col width="8%">
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
					<div class="mu-boxCell">								
						<div class="subtitleWrap">
							<div class="gridTopContent" style="padding: 0">
								<h4 class="mu-title fl">고장목록</h4>
								<!-- <div class="troubleAlram fl">
									<ul>
										<li><i class="mu-icon alram critical"></i><span id="cntLevel1" class="num">0</span></li>
										<li><i class="mu-icon alram major"></i><span id="cntLevel2" class="num">0</span></li>
										<li><i class="mu-icon alram minor"></i><span id="cntLevel3" class="num">0</span></li>
										<li><i class="mu-icon alram warning"></i><span id="cntLevel4" class="num">0</span></li>
									</ul>
								</div> -->
								<div class="hdRight">
									<!-- <button id="btn_alarmSound" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:alarmSound()"><i class="mu-icon sound"></i>가청</button> -->
									<button type="button" class="mu-btn mu-btn-icon " onclick="javascript:allClearAlarm()">전체해제</button>
									<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excelReport()"><i class="mu-icon excel"></i>엑셀 저장</button>
								</div>
							</div>
						</div>
						
						<div class="gridScrollT">
							<table class="mu-grid mu-grid-border mu-grid-strip tbFix">
								<colgroup>
					                <col width="5%">
						            <col width="8%">
						            <col>
						            <col width="8%">
						            <col width="10%">
						            <%-- <col width="8%"> --%>
						           <%--  <col width="10%"> --%>
						            <col width="12%">
						            <col width="25%">
						            <col width="6%">
						            <col width="4.5%">
					            </colgroup>
								<thead>
									<tr>
										<th class='overTxt' title='등급'>등급</th>
										<th class='overTxt' title='알람코드'>알람코드</th>
										<th class='overTxt' title='장비타입'>알람내용</th>
										<th class='overTxt' title='장비ID'>장비타입</th>
										<th class='overTxt' title='장비명'>장비명</th>
										<!-- <th class='overTxt' title='장비명'>구분</th> -->
										<!-- <th class='overTxt' title='역사명'>역사명</th> -->
										<th class='overTxt' title='발생시간'>발생시간</th>
										<th class='overTxt' title='발생위치'>발생위치</th>
										<th class='overTxt' title='인지상태'>인지상태</th>
										<th class='overTxt' title='해제'>해제</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="gridWrap mu-scroll-v" style="height: 770px;overflow-y: scroll;">
							<table id="tb_failure_alarm" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip tbFix" oncontextmenu="return false;">
								<colgroup>
					                <col width="5%">
						            <col width="8%">
						            <col>
						            <col width="8%">
						            <col width="10%">
						            <%-- <col width="8%">  --%>
						            <%-- <col width="10%"> --%>
						            <col width="12%">
						            <col width="25%">
						            <col width="6%">
						            <col width="4.5%">
					            </colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				
				<form>
					<input type="hidden" id="localIp" value="${ip}" />
					<input type="hidden" id="websocketPort" value="${websocketPort}" />
					<input type="hidden" id="userId" value="<c:out value="${user_id}" />"/>
					<input type="hidden" id="failureAudioAlarmLevel" value=4>
					<input type="hidden" id="failureAudioIntervalId">
				</form>
				
				<div style="display:none;">
					<table id="excelTable" class="mu-grid">
						<thead>
						<tr>
							<th colspan="10" style="height: 35px; font-size: 20">고장 목록</th>
						</tr>
						<tr>
							<th bgcolor='#BDBDBD' style='text-align:center'>등급</th>
							<th bgcolor='#BDBDBD'>알람코드</th>
							<th bgcolor='#BDBDBD'>알람내용</th>
							<th bgcolor='#BDBDBD'>장비타입</th>
							<th bgcolor='#BDBDBD'>장비명</th>
							<!-- <th bgcolor='#BDBDBD'>구분</th> -->
							<!-- <th bgcolor='#BDBDBD'>역사명</th> -->
							<th bgcolor='#BDBDBD'>발생시간</th>
							<th bgcolor='#BDBDBD'>발생위치</th>
							<th bgcolor='#BDBDBD'>인지상태</th>
						</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>	
			
			<iframe id="txtArea_failureMain" style="display:none"></iframe>

			<%@ include file="/WEB-INF/views/failure/popup/failureLocationWithPicture.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/unrecoveredInfo.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/majorFailureDetail.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/failureDetail.jsp" %>
			<%@ include file="/WEB-INF/views/failure/filter/gradeFilter.jsp" %>
			<%@ include file="/WEB-INF/views/failure/filter/codeFilter.jsp" %>
			<%@ include file="/WEB-INF/views/failure/filter/systemFilter.jsp" %>
			<%@ include file="/WEB-INF/views/failure/filter/majorAlarmFilter.jsp" %>
			<%@ include file="/WEB-INF/views/failure/filter/stationFilter.jsp" %>
		</section>
	</div>
</body>
</html>