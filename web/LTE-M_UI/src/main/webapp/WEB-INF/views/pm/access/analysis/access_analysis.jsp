<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.util.Calendar, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script src="/resources/js/pm/common/popDetail.js"></script>
	<script src="<c:url value="/resources/js/pm/access/analysis/access_analysis.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group mu-more-item">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>지표</label>
						<div class="mu-selectbox"  style="display:none">
	                        <select id="kpiSelect" class="mu-value" >
	                            <option value=1>KPI</option>
								<option value=2>Data Throughput</option>
								<option value=3>Hand Over</option>
	                        </select>
	                    </div>
	                    <span id="detailSpan" style="display: none;" class="lineY">
	                    	<label>상세지표</label>
	                    	<div class="mu-selectbox">
		                        <select id="detailKpiSelect" class="mu-value">
		                            <option value=1>UP</option>
									<option value=2>down</option>
		                        </select>
		                    </div>
	                    </span>
	                    <span class="lineY">
	                    	<label>DU#</label>
	                    	<input id="equipListText" type="text" class="mu-input" readonly="readonly">
		                    <input id="equipListVal" type="hidden" class="mu-input">
		                    <button type="button" class="mu-btn" onclick="javascript:$('#equipListVal').val('');$('#equipListText').val('');">초기화</button>
		                    <button type="button" class="mu-btn" onclick="javascript:equipSelectView(2,0)">장비선택</button>
	                    </span><br><br>
						<%
						    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
						    SimpleDateFormat hourFormat = new SimpleDateFormat("HH");
						    SimpleDateFormat minFormat = new SimpleDateFormat("mm");
						    Date endDateTime = new Date();
	
						    Calendar cal = Calendar.getInstance();
						    cal.setTime(endDateTime);
	
						    cal.add(Calendar.HOUR, -1);
						    cal.set(Calendar.MINUTE, 59);
						    String endDate = dateFormat.format(cal.getTime());
						    String endHour = hourFormat.format(cal.getTime());
						    String endMin = minFormat.format(cal.getTime());
	
						    cal.add(Calendar.DATE, -1);
						    cal.add(Calendar.HOUR, 1);
						    cal.set(Calendar.MINUTE, 00);
						    String startDate = dateFormat.format(cal.getTime());
						    String startHour = hourFormat.format(cal.getTime());
						    String startMin = minFormat.format(cal.getTime());
						%>
		            
		                <label>조회 기간</label>
						<div class="mu-datepicker">
							<input class="datepicker-time" id="start-date" type="text" value="<%=startDate%>" readonly="readonly">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn"><i class="mu-icon calendar"></i></button>
						</div>
						<div class="mu-selectbox">
	                        <select id="startHourSelect" class="mu-value">
	                            <%
	                            	for(int i = 0; i<24; i++){
	                            		String hour = "";
	                            		
	                            		if(i < 10){
	                            			hour = "0"+i;
	                            		}else{
	                            			hour = i+"";
	                            		}
	                            		if(hour.equals(startHour)){
	                            %>
		                            		<option value="<%=hour %>" selected="selected"><%=hour %></option>
		                        <%    	
		                        		}else{ 
		                        %>
		                            		<option value="<%=hour %>"><%=hour %></option>
		                            	
	                            <%
	                        			}
		                            }
	                            %>
	                        </select>
	                    </div>
						<span class="txtS">~</span>
						<div class="mu-datepicker">
							<input class="datepicker-time" id="end-date" type="text" value="<%=endDate%>" readonly="readonly">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn"><i class="mu-icon calendar"></i></button>
						</div>
						<div class="mu-selectbox">
	                        <select id="endHourSelect" class="mu-value">
	                            <%
	                            	for(int i = 0; i<24; i++){
	                            		String hour = "";
	                            		
	                            		if(i < 10){
	                            			hour = "0"+i;
	                            		}else{
	                            			hour = i+"";
	                            		}
	                            		if(hour.equals(endHour)){
	                            %>
		                            		<option value="<%=hour %>" selected="selected"><%=hour %></option>
		                        <%    	
		                        		}else{ 
		                        %>
		                            		<option value="<%=hour %>"><%=hour %></option>
	                            <%
	                        			}
		                            }
	                            %>
	                        </select>
	                    </div>
	                    <input type="hidden" id="start-min" name="start-min" value="<%= startMin %>" />
	                    <input type="hidden" id="end-min" name="end-min" value="<%= endMin %>" />
                   </div>
                </div>
			    <div class="mu-search-btn">
			    	<table>
			    		<tbody align="right">
			    		<tr>
			    			<td>
			    				<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:getAccessTrendData(false)" style="margin: 5px 5px 5px 5px;"><i class="mu-icon search"></i>검색</button>
			    			</td>
			    		</tr>
			    		<tr>
			    			<td>
			    				<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excel_download()" style="margin: 5px 5px 5px 5px;"><i class="mu-icon excel"></i>엑셀저장</button>
			    			</td>
			    		</tr>
				        </tbody>
			    	</table>
			    </div>
			</div><!-- //mu-search-group -->
			<div class="chartWrap" id="chartDivWrap" style="height: 340px;margin:10px 0 10px;">
				<div class="chart" id='chartDiv'></div>
			</div>
			<div class="chartWrap" id="chartDiv2Wrap" style="display:none; height: 340px;margin:10px 0 10px;">
				<div class="chart" id='chartDiv2'></div>
			</div>
				
			<div class="gridScrollT">
				<table id="gridHeader" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2">
					<colgroup id="headerGroup">
						<col width="4.5%">
						<col width="10%">
						<col width="6.7%">
						<col width="7.7%">
						<col width="7.7%">
						<col width="6.7%">
						<col width="6.7%">
						<col width="9.7%">
						<col width="9.7%">
						<col width="6.7%">
						<col width="9.7%">
						<col width="6.7%">
						<col width="6.7%">
					</colgroup>
					<thead>
						<tr id="headerTr">
							<th title="No" >No</th>
							<th title="시간" >시간</th>
							<th title="시도호" >시도호</th>
							<th title="이전 시도호" >이전 시도호</th>
							<th title="시도호 증감율(%)" >시도호 증감율(%)</th>
							<th title="소통호" >소통호</th>
							<th title="소통율(%)" >소통율(%)</th>
							<th title="ERAB SETUP 시도호" >ERAB SETUP 시도호</th>
							<th title="완료호(ERAB SETUP 성공호)" >완료호(ERAB SETUP 성공호)</th>
							<th title="완료율(%)" >완료율(%)</th>
							<th title="ERAB SETUP ADD 성공호" >ERAB SETUP ADD 성공호</th>
							<th title="절단호" >절단호</th>
							<th title="절단율(%)" >절단율(%)</th>
						</tr>
					</thead>
				</table>
			</div><!-- //gridWarp -->
				
				
			<div class="mu-scroll-v" style="overflow-y:scroll;max-height:430px">
				<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup id="bodyGroup">
						<col width="4.5%">
						<col width="10%">
						<col width="6.7%">
						<col width="7.7%">
						<col width="7.7%">
						<col width="6.7%">
						<col width="6.7%">
						<col width="9.7%">
						<col width="9.7%">
						<col width="6.7%">
						<col width="9.7%">
						<col width="6.7%">
						<col width="6.7%">
					</colgroup>
					<tbody id="dataGrid" style="text-align: center;" oncontextmenu="return false">
					</tbody>
				</table>
			</div><!-- //gridWarp --> 
			<%@ include file="/WEB-INF/views/pm/access/analysis/access_analysis_popEquip.jsp" %>
			<%@ include file="/WEB-INF/views/pm/common/popDetail.jsp" %>
			<div style="display: none;position: absolute;"id="popMenu">
				<ul class="mu-popup-menu">
				    <li><a href="javascript:popDetailView()">상세분석</a></li>
				</ul>
			</div>
			</section>
		</div>
</body>
</html>