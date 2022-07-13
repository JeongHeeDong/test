<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%
	Date nowDateTime = new Date();
	Date startDateTime = new Date();
	Date endDateTime = new Date();

	SimpleDateFormat hourFormat = new SimpleDateFormat("HH");

	startDateTime.setTime(nowDateTime.getTime() - ((long) 1000 * 3600 * 3));
	String startHour = hourFormat.format(startDateTime);

	endDateTime.setTime(nowDateTime.getTime());
	String endHour = hourFormat.format(endDateTime);
%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/system/sysSmsStatistics.js"></script>
	<link href="/resources/css/accountForm.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div id="dateOptDiv" class="mu-selectbox">
	                        <select id="dateOpt" class="mu-value">
	                            <option value="1">시간별</option>
								<option value="2">일별</option>
								<option value="3">월별</option>
	                        </select>
	                    </div>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_from">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_from_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<div class="mu-selectbox">
	                        <select id="fromHourSelect" class="mu-value">
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
						<span> ~ </span>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_to">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_to_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<div class="mu-selectbox">
	                        <select id="toHourSelect" class="mu-value">
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
						<!-- <label>검색 종류</label>
						<div id="searchOptDiv" class="mu-selectbox">
	                        <select id="searchOpt" class="mu-value">
	                            <option value="1">수신번호</option>
								<option value="2">알람코드</option>
								<option value="3">장비타입</option>
	                        </select>
	                    </div>
	               		<input class="mu-input" id="searchWord" type="text" size="40"/>
	               		 -->
	               		
						<span class="lineY">
							<div class="mu-hgroup">
								<span>통계 종류 :</span>
								<div class="mu-checkbox">
									<input id="chk_number" type="checkbox" checked="checked"> 
									<label for="chk_number">수신번호</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_code" type="checkbox" checked="checked">
									<label for="chk_code">알람코드</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_severity" type="checkbox" checked="checked">
									<label for="chk_severity">알람등급</label>
								</div>
								<div class="mu-checkbox">
									<input id="chk_equip" type="checkbox" checked="checked">
									<label for="chk_equip">장비타입</label>
								</div>
							</div>
						</span>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="searchBtnClick()"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<span class="lineY">
						<div id="listSizeOpstion" class="mu-selectbox">
							<select id="pageSize" class="mu-value">
								<option value=10>10개씩 보기</option>
								<option value=20 selected>20개씩 보기</option>
								<option value=50>50개씩 보기</option>
							</select>
						</div>
					</span>
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap gridScrollT mt10">
						<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2 mu-grid-hover">
							<colgroup id="headerGroup">
								<col width='15%'>
								<col />
								<col width='15%'>
								<col width='15%'>
								<col width='15%'>
								<col width='10%'>
							</colgroup>
							<thead>
								<tr id="headerTr">
									<th class="updown sort" id="EVENT_TIME">시간</th>
									<th class="updown sort" id="TT_NUMBER">수신번호</th>
									<th class="updown sort" id="ALARM_CODE">알람코드</th>
									<th class="updown sort" id="SEVERITY">알람등급</th>
									<th class="updown sort" id="EQUIP_TYPE">장비타입</th>
									<th class="updown sort" id="CNT">건수</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="border-top:0px; max-height:700px; overflow-y:scroll;">
						<table id="statisticsDataGrid" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2 mu-grid-hover">
							<colgroup id="bodyGroup">
								<col width='15%'>
								<col />
								<col width='15%'>
								<col width='15%'>
								<col width='15%'>
								<col width='10%'>
							</colgroup>
							<tbody>
							</tbody>
						</table>
					</div>

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