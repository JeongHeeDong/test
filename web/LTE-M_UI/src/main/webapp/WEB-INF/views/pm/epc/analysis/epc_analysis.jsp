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
	<script src="/resources/js/pm/epc/analysis/epc_analysis.js"></script>
	<script src="/resources/js/pm/common/popDetail.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group mu-more-item">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>대상장비</label>
						<div class="mu-selectbox">
	                        <select id="equipSelect" class="mu-value">
	                            <option value=1>MME</option>
								<option value=4>PGW</option>
								<option value=4>SGW</option>
								<option value=6>HSS</option>
								<option value=6>PCRF</option>
	                        </select>
	                    </div>
	                    <span class="lineY" id='equipSelectSpan'>
	                    	<label>장비</label>
	                    	<input id="equipListText" type="text" class="mu-input" readonly="readonly">
		                    <input id="equipListVal" type="hidden" class="mu-input">
		                    <button type="button" class="mu-btn" onclick="javascript:$('#equipListVal').val('');$('#equipListText').val('');">초기화</button>
		                    <button type="button" class="mu-btn" onclick="javascript:equipSelectView(2,1)">장비선택</button>
	                    </span>
	                    <span class="lineY">
	                    	<label>지표</label>
	                    	<div id='kpiDiv' class="mu-selectbox">
		                        <select id="kpiSelect" class="mu-value">
		                            <option value=1>Attach</option>
									<option value=2>SRMO</option>
									<option value=3>SRMT</option>
		                        </select>
		                    </div>
	                    </span>
	                    
	                    <br><br>
						<%
							Date startDateTime = new Date();
							Date endDateTime = new Date();
										
							SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
							SimpleDateFormat hourFormat = new SimpleDateFormat("HH");
							SimpleDateFormat minFormat = new SimpleDateFormat("mm");
							
							endDateTime.setTime(endDateTime.getTime()-((long)1000*60*5));

							startDateTime.setTime(endDateTime.getTime()-((long)1000*3600*3));
							
							String startDate = dateFormat.format(startDateTime);
							String startHour = hourFormat.format(startDateTime);
							
							String endDate = dateFormat.format(endDateTime);
							String endHour = hourFormat.format(endDateTime);
							String minute = minFormat.format(endDateTime);
							
							int subMin = Integer.parseInt(minute.substring(minute.length()-1));
							int intMin = Integer.parseInt(minute);
							
							if(subMin == 5 || subMin == 0){
								
							}else{
								if(subMin < 5){
									subMin = 0;
								}else if(subMin > 5){
									subMin = 5;
								}
								
								if(intMin < 10){
									minute = subMin+"";
								}else{
									minute = minute.substring(0, 1)+subMin;
								}
							}
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
	                    <div class="mu-selectbox">
	                        <select id="startMinSelect" class="mu-value">
	                            <%
	                            	for(int i = 0; i<60;){
	                            		String min = "";
	                            		
	                            		if(i < 10){
	                            			min = "0"+i;
	                            		}else{
	                            			min = i+"";
	                            		}
                         				if(min.equals(minute)){
		                        %>
		                          		<option value="<%=min %>" selected="selected"><%=min %></option>
								<%    	
			                      		}else{ 
			                    %>
			                          		<option value="<%=min %>"><%=min %></option>
			                    <%
		                     			}
		                         		i += 5;
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
	                    <div class="mu-selectbox">
	                        <select id="endMinSelect" class="mu-value">
	                            <%
	                            	for(int i = 0; i<60;){
	                            		String min = "";
	                            		
	                            		if(i < 10){
	                            			min = "0"+i;
	                            		}else{
	                            			min = i+"";
	                            		}
	                            		if(min.equals(minute)){
	                            %>
		                            		<option value="<%=min %>" selected="selected"><%=min %></option>
		                        <%    	
		                        		}else{ 
		                        %>
		                            		<option value="<%=min %>"><%=min %></option>
		                            	
	                            <%
	                        			}
	                            		i += 5;
		                            }
	                            %>
	                        </select>
	                    </div>
                   </div>
			    </div>
			    <div class="mu-search-btn">
			    	<table>
			    		<tbody align="right">
			    		<tr>
			    			<td>
			    				<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:getEpcTrendData(false)" style="margin: 5px 5px 5px 5px;"><i class="mu-icon search"></i>검색</button>
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
			<div class="chartWrap" style="height: 340px;margin:10px 0 10px;">
				<div class="chart" id='chartDiv'></div>
			</div>
			
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2">
					<colgroup id="headerGroup">
						<col width="4%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
					</colgroup>
					<thead>
						<tr id="headerTr">
							<th>No</th>
							<th class="updown sort">시간</th>
							<th class="updown sort">시도호</th>
							<th class="updown sort">기준 시도호</th>
							<th class="updown sort">시도호 증감율(%)</th>
							<th class="updown sort">성공호</th>
							<th class="updown sort">성공율(%)</th>
						</tr>
					</thead>
				</table>
			</div><!-- //gridWarp -->
				
				
			<div class="mu-scroll-v" style="overflow-y:scroll;max-height:430px">
				<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup id="bodyGroup">
						<col width="4%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
						<col width="12%">
					</colgroup>
					<tbody id="dataGrid" style="text-align: center;" oncontextmenu="return false">
					</tbody>
				</table>
			</div><!-- //gridWarp -->

			<%@ include file="/WEB-INF/views/pm/common/equipSelect.jsp" %>
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