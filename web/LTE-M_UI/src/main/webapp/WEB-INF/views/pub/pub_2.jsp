<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.util.*, java.text.*"  %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%
	response.setHeader("Cache-Control","no-cache");
	response.setHeader("Pragma","no-cache");
	response.setDateHeader("Expires",0);
%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<style type="text/css">
		.backbone-10gigabit {
			/*display: -webkit-flex;*/
			/*display: flex;*/
			/*-webkit-align-items: flex-end;*/
					/*align-items: flex-end;*/
			/*-webkit-justify-content: flex-end;*/
					/*justify-content: flex-end;*/
			width: 214px;Q
		}

		.etc-utp {
			display: -webkit-flex;
			display: flex;
			-webkit-align-items: flex-start;
			align-items: flex-start;
			-webkit-justify-content: flex-start;
			justify-content: flex-start;
		}

		.etc-10gigabit {
			display: -webkit-flex;
			display: flex;
			-webkit-align-items: flex-end;
			align-items: flex-end;
			-webkit-justify-content: flex-end;
			justify-content: flex-end;
		}

		.mu-toggle-btn.top-buttons {
			height:35px;
		}
		.Q-Tooltip {
			position:absolute;
			z-index:99999;
			margin:0px;
			padding:2px 4px;
			overflow-x:visible;
			overflow-y:visible;
		    border-color:rgba( 255, 255, 255, 0 );
		    background-color:rgba( 255, 255, 255, 0 );
		    color:rgba( 255, 255, 255, 0 );
		    box-shadow:0 5px 10px rgba(136, 136, 136, 0);
		}
		/* .dropdown-menu {
			position:absolute;
			z-index:99999;
			margin:0px;
			padding:2px 4px;
			overflow-x:visible;
			overflow-y:visible;
		    border-color:rgba( 255, 255, 255, 0 );
		    background-color:rgba( 255, 255, 255, 0 );
		    color:rgba( 255, 255, 255, 0 );
		    box-shadow:0 5px 10px rgba(136, 136, 136, 0);
		} */
	</style>
	<link href="/resources/css/context-menu.css" rel="stylesheet" type="text/css" />
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script src="<c:url value="/resources/js/integrationMonitor/networkTopology.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/integrationMonitor/networkTopologyDetailInfo.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/failure/main/failureGrid.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
	<body>
		<%@ include file="/WEB-INF/views/menu/menu.jsp"%>
		<div class="mu-container basestation">
			<section>
				<!-- 네트워크 토폴로지 Top -->
				<div class="nwTopologyWrap">
					<div class="nwTopology fr">
						<%@ include file="/WEB-INF/views/title/title.jsp" %>
						<div class="timeWrap" id = "maxDateTime">감시시간 : <c:out value="${nowDateTime}"/></div>
						<div class="totalAlram">
							<div class="tit">성능 고장<br>통합 알람</div>
							<ul>
								<li><i class="mu-icon alram critical"></i><span id="cntAllLevel1" class="num">0</span></li>
								<li><i class="mu-icon alram major"></i><span id="cntAllLevel2" class="num">0</span></li>
								<li><i class="mu-icon alram minor"></i><span id="cntAllLevel3" class="num">0</span></li>
								<%--<li><i class="mu-icon alram warning"></i><span id="cntAllLevel4" class="num">0</span></li>--%>
							</ul>
						</div>
						<div>
							<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn" onclick="javascript:filterAlarmView(event, NETWORK_TOPOLOGY.params.alarmFilter, 'N')"><i class="mu-icon filter"></i>알람필터</button>
							<%--<div class="mu-selectbox topAlarmFilter">
								<button type="button" class="mu-btn mu-toggle-btn"><i class="mu-icon filter"></i>알람필터</button>
								<ul class="mu-list">
									<li>
										<input type="checkbox" id="criFilter" class="topFilter critical" checked="true">
										<label for="criFilter">Critical</label>
									</li>
									<li>
										<input type="checkbox" id="majFilter" class="topFilter major" checked="true">
										<label for="majFilter">Major</label>
									</li>
									<li>
										<input type="checkbox" id="minFilter" class="topFilter minor" checked="true">
										<label for="minFilter">Minor</label>
									</li>
									<li>
										<input type="checkbox" id="warFilter" class="topFilter warning" checked="true">
										<label for="warFilter">Warning</label>
									</li>
								</ul>
							</div>--%>
							
							<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="btn-top-alarm-sound"><i class="mu-icon sound"></i>가청</button>
							<button type="button" class="mu-btn mu-toggle-btn top-buttons"><i class="mu-icon watch"></i>감시중</button>
						</div>
					</div>
				</div>
				<!-- monitoring -->
				<div class="monitoringWrap">
					<div class="mu-row">
						<div class="mu-col mu-col-9">
							<div class="monitoring-map">
								<img src="/resources/images/monitoring/m-map.png" alt="">
								<i class="mu-icon alram-map critical" style="left:400px;top:100px"></i>
								<i class="mu-icon alram-map major" style="left:500px;top:300px"></i>
								<i class="mu-icon alram-map minor" style="left:540px;top:400px"></i>
								<i class="mu-icon alram-map normal" style="left:850px;top:300px"></i>
							</div>
						</div>
						<div class="mu-col mu-col-3">
							<!-- monitoring-state -->
							<div class="monitoring-state">
								<div class="total-state">
									<div class="mu-panel">
										<div class="mu-panel-head">기지국 통합감시 현황</div>
										<div class="mu-panel-body">
											<ul>
												<li class="state-work" style="cursor:pointer" onclick="networkGo();">
													<div class="tit">동작상태</div>
													<div class="state" style="cursor: default;">
														<span id="activeState1" style="cursor:pointer"><i class="mu-icon alarm normal"></i>195</span>
														<span id="activeState2" style="cursor:pointer"><i class="mu-icon alarm gray"></i>23</span>
													</div>
												</li>
												<li class="state-trouble" style="cursor:pointer" onclick="failureMainGo();">
													<div class="tit">고장</div>
													<div class="state" style="cursor: default;">
														<span id="troubleCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>4</span>
														<span id="troubleCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>1</span>
														<span id="troubleCount3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
													</div>
												</li>
												<li class="state-performace" style="cursor:pointer" onclick="accessMonitorGo();">
													<div class="tit">성능</div>
													<div class="state" style="cursor: default;">
														<span id="performanceCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>5</span>
														<span id="performanceCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>26</span>
														<span id="performanceCount3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>98</span>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<!-- 고장알람 -->
							<div class="">
								<div class="subtitleWrap">
									<h4 class="mu-title">최근 해제된 고장알람</h4>
								</div>
								<div class="gridWrap">
									<div class="gridScrollT">
										<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
											<colgroup>
												<col width="10%">
												<col width="15%">
												<col width="18%">
												<col width="17%">
												<col width="20%">
												<col width="20%">
											</colgroup>
											<thead>
												<tr>
													<th class="stat">등급</th>
													<th>알람</th>
													<th>장비</th>
													<th>역사</th>
													<th>발생시간</th>
													<th>해제시간</th>
												</tr>
											</thead>
										</table>
									</div>
									<div class="mu-scroll-v scrollY" style="height:282px;">
										<div class="clearmessage" style="display:none"><span>최근24시간 이내에 해제된 고장알람은 없습니다.</span></div>
										<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover tbFix">
											<colgroup>
												<col width="10%">
												<col width="15%">
												<col width="18%">
												<col width="17%">
												<col width="20%">
												<col width="20%">
											</colgroup>
											<tbody id="recoverFailureGrid">
											<!-- <tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr>
											<tr>
												<td style="cursor: pointer;" class="stat tc"><i
													class="mu-icon alram major"></i><input type="hidden"
													name="alarmId" value="212496"><input type="hidden"
													name="alarmLevel" value="2"><input type="hidden"
													name="alarmType" value="O_2"></td>
												<td>A2703</td>
												<td>MME</td>
												<td>관제센터</td>
												<td>2020/01/01 12:58:15</td>
												<td>2020/01/01 13:58:15</td>
											</tr> -->
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Grid -->
				<div class="gridListWrap" style="height:200px">
					<div class="gridTopContent">
						<div class="mu-search-group">
							<div class="mu-search-item">
								<h4 class="mu-title fl">고장정보</h4>
								<div class="troubleAlram">
									<div class="tit"><i></i>고장알람</div>
									<ul>
										<li><i class="mu-icon alram critical"></i><span id="cntLevel1" class="num">0</span></li>
										<li><i class="mu-icon alram major"></i><span id="cntLevel2" class="num">0</span></li>
										<li><i class="mu-icon alram minor"></i><span id="cntLevel3" class="num">0</span></li>
										<li style="display:none"><i class="mu-icon alram nomal"></i><span id="cntLevel4" class="num">0</span></li>
									</ul>
								</div>
								<div class="troubleAlram" style="padding-left: 15px">
									<div class="tit"><i></i>알람 발생 장비 수</div>
									<ul>
										<li><i class="mu-icon alram critical"></i><span id="tnms_cntLevel1" class="num">0</span></li>
										<li><i class="mu-icon alram major"></i><span id="tnms_cntLevel2" class="num">0</span></li>
										<li><i class="mu-icon alram minor"></i><span id="tnms_cntLevel3" class="num">0</span></li>
									</ul>
								</div>
							</div>
							<div class="mu-search-btn">
								<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excelReport()"><i class="mu-icon excel"></i><span>엑셀 저장</span></button>
								<span class="lineY">
								<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:filterAlarmView(event, NETWORK_TOPOLOGY.params.gridAlarmFilter, 'Y')">알람필터</button>
								</span>
								<span class="lineY">
								<button type="button" class="mu-btn mu-toggle-btn mu-toggle-on grid-buttons" id="btn_alarmSound" onclick="javascript:failureSound(this)"><i class="mu-icon sound"></i>가청</button>
								</span>
								<span class="lineY">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only grid-buttons" id="failureWatchBtn" onclick="javascript:failureWatch(this)"><i class="mu-icon pause"></i></button>
								</span>
							</div>
						</div>
					</div>
					<div class="gridScrollT">
						<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
							<colgroup>
								<col width="5%">
					            <col width="8%">
					            <col>
					            <col width="8%">
					            <col width="10%">
								<%-- <col width="8%"> --%>
					            <%-- <col width="10%"> --%>
					            <col width="12%">
					            <col width="10%">
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
								<!--<th class='overTxt' title='장비명'>구분</th>
								 <th class='overTxt' title='역사명'>역사명</th>  -->
								<th class='overTxt' title='발생시간'>발생시간</th>
								<th class='overTxt' title='발생위치'>발생위치</th>
								<th class='overTxt' title='인지상태'>인지상태</th>
								<th class='overTxt' title='해제'>해제</th>
							</tr>
							</thead>
						</table>
					</div>
					<div class="mu-scroll-v scrollY" id ="failureGridDiv" style="height:185px">
						<table id="tb_failure_alarm" class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover tbFix" oncontextmenu="return false;">
							<colgroup>
								<col width="5%">
					            <col width="8%">
					            <col>
					            <col width="8%">
					            <col width="10%">
			<%-- 		            <col width="8%"> --%>
					            <%-- <col width="10%"> --%>
					            <col width="12%">
					            <col width="10%">
					            <col width="6%">
					            <col width="4.5%">
							</colgroup>
							<tbody id="failureGrid"></tbody>
						</table>
					</div>
	
					<form>
						<input type="hidden" id="localIp" value="${ip}" />
						<input type="hidden" id="websocketPort" value="${websocketPort}" />
						<input type="hidden" id="userId" value="<c:out value="${user_id}" />"/>
						<!-- 고장정보 알람 가청 -->
						<input type="hidden" id="failureAudioAlarmLevel" value=4>
						<input type="hidden" id="failureAudioIntervalId">
					</form>
				</div>	
			</section>
			
				<%@ include file="/WEB-INF/views/failure/popup/failureLocationWithPicture.jsp" %>
				<%@ include file="/WEB-INF/views/failure/popup/failureDetail.jsp" %>
				<%@ include file="/WEB-INF/views/common/filter_alarm_noall.jsp" %>
				
				<div style="display: none;position: absolute; z-index: 999998;" id="poptooltip">
					<ul class="mu-popup-menu" style="background : #363d44">
					    <li class="mu-popup-li" style="font-size: 12pt; margin : 5pt; color : #fff;"></li>
					</ul>
				</div>
				<div class="Q-Tooltip" style="display:none;">
				</div>
				<ul class="dropdown-menu" style="display:none; z-index: 999999;">
				</ul>
		</div>
	</body>
</html>

		