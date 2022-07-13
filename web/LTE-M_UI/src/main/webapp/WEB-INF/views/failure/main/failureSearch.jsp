<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/failure/main/failureSearch.js"></script>
	
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
							<input type="radio" id="rd_search_epc" name="rd_search_ea" value="epc" checked="checked">
							<label for="rd_search_epc">EPC</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="rd_search_access" name="rd_search_ea" value="access">
							<label for="rd_search_access">Access</label>
						</div>
						<div class="mu-radio">
							<input type="radio" id="rd_search_app" name="rd_search_ea" value="app">
							<label for="rd_search_app">서비스</label>
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
									<input id="box_search_fromtime" type="text" value="<%=nowDate%>" readonly="readonly">
									<button id="btn_search_fromtime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
								</div>
								<span>~</span>
								<div class="mu-datepicker">
									<input id="box_search_totime" type="text" value="<%=nowDate%>"  readonly="readonly">
									<button id="btn_search_totime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
								</div>
							</div>
							<div class="mu-hgroup">
								<div class="mu-radio">
									<input type="radio" id="rd_search_all" name="rd_search_failure" value="all" checked="checked">
									<label for="rd_search_all">전체</label>
								</div>
								<div class="mu-radio">
									<input type="radio" id="rd_search_fail" name="rd_search_failure" value="0" >
									<label for="rd_search_fail">고장</label>
								</div>
								<div class="mu-radio">
									<input type="radio" id="rd_search_delete" name="rd_search_failure" value="3" >
									<label for="rd_search_delete">삭제</label>
								</div>
							</div>
							<div class="mu-hgroup">
								<%--<div class="mu-checkbox">--%>
									<%--<input id="chk_unRecover" type="checkbox">--%>
									<%--<label for="chk_unRecover">미복구</label>--%>
								<%--</div>--%>
								<!-- <div class="mu-checkbox">
									<input id="chk_spAlarm" type="checkbox">
									<label for="chk_spAlarm">특정알람</label>
								</div> -->
								<div class="mu-checkbox">
									<input id="chk_flTime" type="checkbox">
									<label for="chk_flTime">고장시간</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_spTime" type="checkbox">
									<label for="chk_spTime">특정시간</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_spDate" type="checkbox">
									<label for="chk_spDate">특정일자제외</label>
									<div class="mu-datepicker">
										<input readonly="readonly" type="text" id="search_spDate">
									</div>
								</div>
								<div class="mu-checkbox">
									<input id="chk_alarmFilter" type="checkbox">
									<label for="chk_alarmFilter">알람필터</label>
								</div>
							</div>
						</div>
					</div>
				</div><!-- //mu-search-item -->
				<div class="mu-search-btn">
					<div class="mu-vgroup">
						<button type="button" class="mu-btn mu-btn-icon mu-btn-search" id="failureSearchBtn"><i class="mu-icon search"></i>조회</button>
						<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excelExport()"><i class="mu-icon excel"></i>엑셀저장</button>
						<div class="mu-selectbox">
							<button class="mu-value" id='pageSize' value ='20'>20개씩 보기</button>
							<ul class="mu-list">
								<li data-id="20">20개씩 보기</li>
								<li data-id="50">50개씩 보기</li>
								<li data-id="100">100개씩 보기</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			
			<div class="gridScrollT gridWrap mt10">
				<table id="tb_failureSearch_alarm_header" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2 tbFix">
					<colgroup>
						<col width="3%">
						<col width="7%">
						<col width="6%">
						<col width="auto">
						<col width="5%">
						<col width="5%">
						<col width="5%">
						<col width="10%">
						<col width="10%">
						<col width="5%">
						<col width="5%">
						<col width="5%">
						<col width="4%">
						<col width="6%">
						<col width="11%">
					</colgroup>
					<thead>
			            <tr>
			            	<th class='overTxt' title='No'>No</th> 		<!-- NO -->
			                <th class='overTxt updown sort' title='장비명'><input type="hidden" value="vs.SYSTEM_NAME" />장비명</th>  	<!-- VW_SYSTEM.SYSTEM_NAME  (SYSTEM_ID로 조인) -->
			                <th class='overTxt updown sort' title='알람코드'><input type="hidden" value="ab.ALARM_CODE" />알람코드</th> 	<!-- ALARM_CODE -->
			                <th class='overTxt' title='알람명'>알람명</th>  	<!-- PROBABLECAUSE -->
			                <th class='overTxt' title='장비종류'>장비종류</th> 	<!-- EQUIP_TYPE(EQUIP_NAME로 표현) -->
			                <th class='overTxt updown sort' title='알람등급'><input type="hidden" value="ab.SEVERITY" />알람등급</th> 	<!-- SEVERITY (1:CRI, 2:MAJ, 3:MIN, 4:WARN) -->
			                <th class='overTxt updown sort' title='알람상태'><input type="hidden" value="ab.ALARM_STATE" />알람상태</th> 	<!-- ALARM_STATE (0:Clear, 1:Open, 2:Ack, 3:Delete) -->
			                <th class='overTxt updown sort' title='발생시간'><input type="hidden" value="ab.EVENT_TIME" />발생시간</th>  <!-- EVENT_TIME -->
			                <th class='overTxt updown sort' title='복구시간'><input type="hidden" value="ab.RECOVER_TIME" />복구시간</th>  <!-- RECOVER_TIME -->
			                <th class='overTxt updown sort' title='고장시간(초)'><input type="hidden" value="ab.TIME_TO_REPAIR" />고장시간(초)</th>  <!-- TIME_TO_REPAIR -->
			                <th class='overTxt' title='고장시간(분)'>고장시간(분)</th>  <!-- TIME_TO_REPAIR -->
			                <th class='overTxt updown sort' title='고장분류'><input type="hidden" value="ab.ALARM_TYPE" />고장분류</th>  <!-- ALARM_TYPE (1:ALARM, 2:FAULT, 3:STATUS, 4:ETC) -->
			                <th class='overTxt updown sort' title='제조사'><input type="hidden" value="vd.VENDOR_NAME" />제조사</th> 	<!--  VENDOR_NAME-->
			                <th class='overTxt updown sort' title='팀'><input type="hidden" value="tm.TEAM_NAME" />팀</th> 		<!-- TEAM_NAME -->
			                <th class='overTxt' title='발생위치'>발생위치</th> 	<!-- FDN -->
			            </tr>
			        </thead>
				</table>
			</div>
			<div class="gridWrap mu-scroll-v" style="height: 643px;overflow-y: scroll;">
				<table id="tb_failureSearch_alarm" class="mu-grid mu-grid-border mu-grid-strip tbFix">
		            <colgroup>
						<col width="3%">
						<col width="7%">
						<col width="6%">
						<col width="auto">
						<col width="5%">
						<col width="5%">
						<col width="5%">
						<col width="10%">
						<col width="10%">
						<col width="5%">
						<col width="5%">
						<col width="5%">
						<col width="4%">
						<col width="6%">
						<col width="11%">
					</colgroup>
		            <tbody>
		            </tbody>
				</table>
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
                    </div><!-- //mu-pagination -->

                </div>
            </div>

			<iframe id="txtArea_failureSearch" style="display:none"></iframe>
			<iframe id="excelDownload" style='display: none;' ></iframe>
				
			<%@ include file="/WEB-INF/views/failure/popup/searchSystemSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/searchAlarmSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/searchHourSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/searchFailureHour.jsp" %>
			<%@ include file="/WEB-INF/views/common/filter_alarm.jsp" %>
		</section>
	</div>
</body>
</html>