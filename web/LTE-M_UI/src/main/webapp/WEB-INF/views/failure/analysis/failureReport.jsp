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
	<script src="<c:url value="/resources/js/failure/analysis/failureReport.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div id="combo_div" style="display: none;">
	                    	<label>구분</label>
	                    	<div class="mu-selectbox">
		                        <select id="accessORepc_sel" class="mu-value">
		                            <option value=1>기지국</option>
									<option value=2>주제어장치</option>
		                        </select>
		                    </div>
		                    <span id="dayORhour"  class="lineY">
			                   	<label>통계단위</label>
			                   	<div class="mu-selectbox">
			                        <select id="dayORhour_sel" class="mu-value">
			                            <option value=1>일별</option>
										<option value=2>시간별</option>
			                        </select>
			                    </div>
		                    </span>
	                    </div>
	                   	<%
		                   	Date nowDateTime = new Date();
							SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
							nowDateTime.setTime(nowDateTime.getTime()-((long)1000*60*5));
							String nowDate = dateFormat.format(nowDateTime);
						%>
<!-- 		            	<label>구분</label>
						<div class="mu-selectbox">
							<select id="selectedLine" class="mu-value"></select>
						</div> -->
		                <label>조회 기간</label>
						<div class="mu-datepicker">
							<input class="datepicker-time" id="start-date" type="text" value="<%=nowDate%>" readonly="readonly">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn"><i class="mu-icon calendar"></i></button>
						</div>
						<span class="txtS">~</span>
						<div class="mu-datepicker">
							<input class="datepicker-time" id="end-date" type="text" value="<%=nowDate%>" readonly="readonly">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn"><i class="mu-icon calendar"></i></button>
						</div>
                   </div>
                   <div class="mu-item-group" style="display: none">
						<div class="mu-radio">
					        <input type="radio" name="search_radio" id="search_failure" value= 1 checked="checked">
					        <label for="search_failure">고장</label>
					    </div>
						<div class="mu-radio">
					        <input type="radio" name="search_radio" id="search_performance" value= 2>
					        <label for="search_performance">성능</label>
					    </div>
					</div>
                </div>
			    <div class="mu-search-btn">
    				<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:_btnSearchClick()"><i class="mu-icon search"></i>검색</button>
    				<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excel_download()"><i class="mu-icon excel"></i>엑셀 저장</button>
    				<span class="lineY">
	    				<div class="mu-selectbox">
	                        <select id="pageSize" class="mu-value">
								<option value="10">10개씩 보기</option>
								<option value="20" selected>20개씩 보기</option>
								<option value="50">50개씩 보기</option>
	                        </select>
	                    </div>
                    </span>
			    </div>
			</div><!-- //mu-search-group -->
				
			<div class="gridWrap gridScrollT mt10">
				<table id="gridHeader" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2">
					<colgroup id="headerGroup">
						<col width='9.5%'>
						<col width='7%'>
						<col width='8%'>
						<col width='8%'>
						<col width='15%'>
						<col width='20%'>
						<col width='9.5%'>
						<col width='9.5%'>
						<col width='9.5%'>
						<col width='6.5%'>
						<col width='6.5%'>
						<col />
					</colgroup>
					<thead>
						<tr id="headerTr">
							<th class='updown sort' id='LINE_NAME'>구분</th>
							<th class='updown sort' id='EQUIP_NAME'>장비타입</th>
							<th class='updown sort' id='SYSTEM_NAME'>장비명</th>
							<th class='updown sort' id='SEVERITY'>등급</th>
							<th class='updown sort' id='ALARM_CODE'>알람코드</th>
							<th class='updown sort' id='FDN'>발생위치</th>
							<th class='updown sort' id='PROBABLE_CAUSE'>원인</th>
							<th class='updown sort' id='EVENT_TIME'>발생일시</th>
							<th class='updown sort' id='RECOVER_TIME'>복구일시</th>
							<th class='updown sort' id='TIME_DIFF_SEC'>발생기간(초)</th>
							<th class='updown sort' id='TIME_DIFF_MIN'>발생기간(분)</th>
						</tr>
					</thead>
				</table>
			</div><!-- //gridWarp -->
				
			<div class="gridWrap mu-scroll-v" style="border-top:0px; max-height:700px; overflow-y:scroll;">
				<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup id="bodyGroup">
						<col width='9.5%'>
						<col width='7%'>
						<col width='8%'>
						<col width='8%'>
						<col width='15%'>
						<col width='20%'>
						<col width='9.5%'>
						<col width='9.5%'>
						<col width='9.5%'>
						<col width='6.5%'>
						<col width='6.5%'>
						<col />
					</colgroup>
					<tbody id="dataGrid" style="text-align: center;">
						<%
							for(int i = 0; i < 20 ; i++){
						%>
						<tr style = "height: 31px;">
							<td></td><td></td>
							<td></td><td></td>
							<td></td><td></td>
							<td></td><td></td>
							<td></td><td></td>
							<td></td>
						</tr>
						<% } %>
					</tbody>
				</table>
			</div><!-- //gridWarp -->
			
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
			</section>
		</div>
</body>
</html>