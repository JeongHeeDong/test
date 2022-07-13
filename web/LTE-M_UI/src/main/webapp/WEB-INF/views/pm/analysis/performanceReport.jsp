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
	<script src="<c:url value="/resources/js/pm/analysis/performanceReport.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group mu-more-item">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div id="combo_div" >
	                    	<label>구분</label>
	                    	<div class="mu-selectbox">
		                        <select id="accessORepc_sel" class="mu-value" onchange="changeAccessORepc()">
		                            <option value=1>기지국</option>
									<option value=2>주제어장치</option>
									<option value=3>저장장치</option>
		                        </select>
		                    </div>
		                    <div class="mu-item-group" id="divLine" style="display:">
					 			<label>호선</label>
								<div class="mu-selectbox">
									<select id="selectedLine" class="mu-value"></select>
								</div>
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
	                   	<%
	                   		Date nowDateTime = new Date();
							SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
							nowDateTime.setTime(nowDateTime.getTime()-((long)1000*60*5));
							String nowDate = dateFormat.format(nowDateTime);
						%>
			            	<span class="lineY">
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
							</span>
						</div>
                   </div>
                   <div class="mu-item-group" style="display: none">
						<div class="mu-radio">
					        <input type="radio" name="search_radio" id="search_failure" value= 1>
					        <label for="search_failure">고장</label>
					    </div>
						<div class="mu-radio">
					        <input type="radio" name="search_radio" id="search_performance" value= 2 checked="checked">
					        <label for="search_performance">성능</label>
					    </div>
					</div>
                </div>
			    <div class="mu-search-btn">
			    	<table style="width: 360px;">
			    		<tbody align="right">
			    		<tr>
			    			<td>
			    				<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:_btnSearchClick()" style="margin: 5px 5px 5px 5px;"><i class="mu-icon search"></i>검색</button>
			    			</td>
			    			<td>
			    				<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excel_download()" style="margin: 5px 5px 5px 5px;"><i class="mu-icon excel"></i>엑셀저장</button>
			    			</td>
			    			<td>
			    				<span class="lineY">
				    				<div class="mu-selectbox">
				                        <select id="pageSize" class="mu-value">
				                            <option value="20">20개씩 보기</option>
											<option value="50">50개씩 보기</option>
											<option value="100">100개씩 보기</option>
				                        </select>
				                    </div>
			                    </span>
			    			</td>
			    		</tr>
				        </tbody>
			    	</table>
			    </div>
			</div><!-- //mu-search-group -->
				
			<div class="gridScrollT mt10">
				<table id="gridHeader" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2">
					<colgroup class="tableColgorup">
						<col width="5%">
						<col width="7%">
						<col width="4%">
						<col width="5%">
						<col width="6%">
						<col width="8%">
						<col width="4%">
						<col width="4%">
						<col width="5%">
						<col width="8%">
						<col width="11%">
						<col width="4%">
						<col width="5%">
						<col width="10%">
						<col width="4%">
						<col width="4%">
						<col >
					</colgroup>
					<thead>
						<tr id="headerTr">
							<th class='updown sort' id='EVENT_TIME' title='일자' >일자</th>
							<th class='updown sort' id='DU_NAME' title='기지국' >기지국</th>
							<th class='updown sort' id='KPI_ATTEMPT' title='시도호' >시도호</th>
							<th class='updown sort' id='KPI_STD_ATT' title='이전시도호' >이전시도호</th>
							<th class='updown sort' id='KPI_ATTEMPT_RATE' title='시도호 증감율' >시도호 증감율</th>
							<th class='updown sort' id='KPI_ATTEMPT_LV' title='시도호 증감율 등급' >시도호 증감율 등급</th>
							<th class='updown sort' id='KPI_RRC' title='소통호' >소통호</th>
							<th class='updown sort' id='SUCC_RATE' title='소통율' >소통율</th>
							<th class='updown sort' id='SUCC_RATE_LV' title='소통율 등급' >소통율 등급</th>
							<th class='updown sort' id='KPI_ERAB_ATTEMPT' title='ERAB SETUP 시도호' >ERAB SETUP 시도호</th>
							<th class='updown sort' id='KPI_ANSWER' title='완료호(ERAB SETUP 성공호)' >완료호(ERAB SETUP 성공호)</th>
							<th class='updown sort' id='ANSWER_RATE' title='완료율' >완료율</th>
							<th class='updown sort' id='ANSWER_RATE_LV' title='완료율 등급' >완료율 등급</th>
							<th class='updown sort' id='KPI_ERAB_ADD_SUCC' title='ERAB SETUP ADD 성공호' >ERAB SETUP ADD 성공호</th>
							<th class='updown sort' id='KPI_CD' title='절단호' >절단호</th>
							<th class='updown sort' id='CD_RATE' title='절단율' >절단율</th>
							<th class='updown sort' id='CD_RATE_LV' title='절단율 등급' >절단율 등급</th>
						</tr>
						<tr id="headerTrRec">
							<th class='updown sort' id='CALL_ATTEMPT' title='시도호' >시도호</th>
							<th class='updown sort' id='CALL_STD_ATT' title='이전시도호' >이전시도호</th>
							<th class='updown sort' id='CALL_ATT_RATE' title='시도호 증감율' >시도호 증감율</th>
							<th class='updown sort' id='CALL_ATT_LEVEL' title='시도호 증감율 등급' >시도호 증감율 등급</th>
							<th class='updown sort' id='CALL_SUCCESS' title='성공호' >성공호</th>
							<th class='updown sort' id='CALL_SUCC_RATE' title='성공율' >성공율</th>
							<th class='updown sort' id='CALL_SUCC_RATE_LEVEL' title='성공율 등급' >성공율 등급</th>
							<th class='updown sort' id='PTT_ATTEMPT' title='시도호' >시도호</th>
							<th class='updown sort' id='PTT_STD_ATT' title='이전시도호' >이전시도호</th>
							<th class='updown sort' id='PTT_ATT_RATE' title='시도호 증감율' >시도호 증감율</th>
							<th class='updown sort' id='PTT_ATT_LEVEL' title='시도호 증감율 등급' >시도호 증감율 등급</th>
							<th class='updown sort' id='PTT_SUCCESS' title='성공호' >성공호</th>
							<th class='updown sort' id='PTT_SUCC_RATE' title='성공율' >성공율</th>
							<th class='updown sort' id='PTT_SUCC_RATE_LV' title='성공율 등급' >성공율 등급</th>
					</thead>
				</table>
			</div><!-- //gridWarp -->
			
			<div class="mu-scroll-v" style="overflow-y:scroll;max-height:700px">
				<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup class="tableColgorup">
						<col width="5%">
						<col width="7%">
						<col width="4%">
						<col width="5%">
						<col width="6%">
						<col width="8%">
						<col width="4%">
						<col width="4%">
						<col width="5%">
						<col width="8%">
						<col width="11%">
						<col width="4%">
						<col width="5%">
						<col width="10%">
						<col width="4%">
						<col width="4%">
						<col >
					</colgroup>
					<tbody id="dataGrid" style="text-align: center;" >
						<%
							for(int i = 0; i < 20 ; i++){
						%>
						<tr style = "height: 31px;">
							<td></td><td></td><td></td>
					   		<td></td><td></td><td></td>
					   		<td></td><td></td><td></td>
					   		<td></td><td></td><td></td>
					   		<td></td><td></td><td></td>
					   		<td></td><td></td>
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