<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/failure/main/failureBunchSpec.js"></script>
	<script src="/resources/js/highchart/highcharts.js"></script>
	
	<!-- <link rel="stylesheet" href="/resources/css/jquery-ui.css"> -->
	<script src="/resources/lib/jquery-ui.js"></script>

</head>

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

<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
	    	<%@ include file="/WEB-INF/views/title/title.jsp" %>
	    	<div class="mu-search-group mu-more-item">
	    		<div class="mu-search-item">
	    			<table>
	    				<colgroup>
	    					<col width="600px">
	    					<col>
	    					<col>
	    				</colgroup>
	    				<tbody>
	    					<tr>
	    						<td>
	    							<div class="mu-item-group">
										<div class="mu-datepicker">
											<input id="box_failureBunchSpec_fromtime" value="<%=startDate%>" readonly="readonly" type="text">
											<button id="btn_failureBunchSpec_fromtime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
										</div>
										<input id="spinner_failureBunchSpec_fromhour" type="text" name="spinner_failureBunchSpec_hour" value="<%=startHour %>" readonly="readonly"><span class="txtS">시</span>
										<input id="spinner_failureBunchSpec_frommin" type="text" name="spinner_failureBunchSpec_min" value="<%=minute %>" readonly="readonly"><span class="txtS">분</span>
										<span class="txtS">~</span>
										<div class="mu-datepicker">
											<input id="box_failureBunchSpec_totime" value="<%=endDate%>" readonly="readonly" type="text">
											<button id="btn_failureBunchSpec_totime" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
										</div>		
										<input id="spinner_failureBunchSpec_tohour" type="text" name="spinner_failureBunchSpec_hour" value="<%=endHour %>" readonly="readonly"><span class="txtS">시</span>
										<input id="spinner_failureBunchSpec_tomin" type="text" name="spinner_failureBunchSpec_min" value="<%=minute %>" readonly="readonly"><span class="txtS">분</span>
									</div>
	    						</td>
	    						<td>
	    							<div class="mu-item-group">
		    							<div class="mu-hgroup" style="width: calc(100%);">
											<label>알람 등급</label>
											<div id="searchOption" class="mu-selectbox">
												<select id="specAlarmType" class="mu-value">
													<option value="0">ALL</option>
													<option value="1">CRITICAL</option>
													<option value="2">MAJOR</option>
													<option value="3">MINOR</option>
												</select>
											</div>
											<button id="btn_bunchAlarm" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon search"></i>다발알람</button>
											<input id="target_bunchAlarm" type="text" class="mu-input" value="" title="" readonly="readonly" style="width: calc(100% - 300px);">
										</div>
									</div>
								</td>
	    						<td>
	    							<div class="searchTarget">
										<button id="btn_search_target" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon search"></i>조회대상</button>
										<input id="target_system" type="text" class="mu-input" value="" title="" readonly="readonly">
									</div>
	    						</td>
	    					</tr>
	    				</tbody>
	    			</table>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:searchFailureBunchSpec(false)"><i class="mu-icon search"></i>조회</button>
				</div>
	    	</div>
	    	
			<div class="mu-boxWrap" style="height: 425px;">
				<div class="mu-boxRow">
					<div class="mu-boxCell wp70">
						<div class="subtitleWrap">
							<div class="gridTopContent" style="padding: 0">
								<h4 class="mu-title fl">다발고장이력 목록</h4>
								<div class="troubleAlram fl" style="margin-left:20px;">
									<ul>
										<li><i class="mu-icon alram critical"></i><span id="cntLevel1" class="num">0</span></li>
										<li><i class="mu-icon alram major"></i><span id="cntLevel2" class="num">0</span></li>
										<li><i class="mu-icon alram minor"></i><span id="cntLevel3" class="num">0</span></li>
									</ul>
								</div>
								<div class="lineY">
									<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excelReport()"><i class="mu-icon excel"></i>엑셀저장</button>
								</div>
							</div>
						</div>

						<div class="gridScrollT gridWrap">
							<table id="tb_failureBunchSpec_alarm_header" class="mu-grid mu-grid-border mu-grid-strip tbFix mu-grid-sort2">
								<colgroup>
									<col width="5%">
									<col width="8%">
									<col width="8%">
									<col width="7%">
									<col width="auto">
									<col width="7%">
									<col width="7%">
									<col width="9%">
									<col width="11%">
									<col width="16%">
								</colgroup>
								<thead>
									<tr>
										<th class='overTxt' title='No'>No</th>
										<th class='overTxt updown sort' title='등급' id="SEVERITY" ><input type="hidden" value="TFA.SEVERITY" />등급</th>
										<th class='overTxt updown sort' title='다발코드' id="BUNCH_CODE" ><input type="hidden" value="TFAB.BUNCH_CODE" />다발코드</th>
										<th class='overTxt updown sort' title='알람코드' id="ALARM_CODE" ><input type="hidden" value="TFA.ALARM_CODE" />알람코드</th>
										<th class='overTxt' title='Cause' id="PROBABLE_CAUSE" >Cause</th>
										<th class='overTxt updown sort' title='알람상태' id="ALARM_STATE" ><input type="hidden" value="TFA.ALARM_STATE" />알람상태</th>
										<th class='overTxt' title='장비' id="EQUIP_NAME" >장비</th>
										<th class='overTxt' title='장비명' id="SYSTEM_NAME" >장비명</th>
										<th class='overTxt' title='발생위치' id="FDN" >발생위치</th>
										<th class='overTxt updown sort' title='발생시간' id="EVENT_TIME" ><input type="hidden" value="TFA.EVENT_TIME" />발생시간</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="area_failureBunchSpec" class="gridWrap mu-scroll-v" style="height: 470px;overflow-y: scroll;">
					        <table id="tb_failureBunchSpec_alarm" class="mu-grid mu-grid-border mu-grid-strip tbFix">
					            <colgroup>
									<col width="5%">
									<col width="8%">
									<col width="8%">
									<col width="7%">
									<col width="auto">
									<col width="7%">
									<col width="7%">
									<col width="9%">
									<col width="11%">
									<col width="16%">
								</colgroup>
					            <tbody>
					            </tbody>
					        </table>
						</div>							
					</div>
					<div class="mu-boxCell">								
						<div class="subtitleWrap">
							<h4 class="mu-title">Alarm Message</h4>
						</div>
						<textarea id="alarmMsg" style="width: 100%;height: 504px;resize: none;" readonly=""></textarea>	
					</div>
				</div>
				
				<!-- <div id="failureSpec_graphArea" class="mu-boxRow">
					<div class="mu-boxCell" id="failureSpecGraph_datetime_area">
                    </div>
                    <div class="mu-boxCell" id="failureSpecGraph_alarmCode_area">
                    </div>
				</div> -->
			</div> 
			
			<div class="mu-boxWrap" style="height: 280px;">
				<div class="mu-boxRow" id="failureBunchSpec_graphArea">
					<div class="mu-boxCell" id="failureBunchSpecGraph_datetime_area">
                    </div>
                    <div class="mu-boxCell" id="failureBunchSpecGraph_alarmCode_area">
                    </div>
				</div>
			</div>
			
			<iframe id="txtArea_failureBunchSpec" style="display:none"></iframe>
				
			<%@ include file="/WEB-INF/views/failure/popup/searchSystemSelect.jsp" %>
			<%@ include file="/WEB-INF/views/failure/popup/bunchAlarmSelect.jsp" %>
			</section>
	</div>
</body>
</html>