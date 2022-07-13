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
	<script src="/resources/js/integrationMonitor/baseStation.js"></script>
	<script src="<c:url value="/resources/js/integrationMonitor/networkTopology.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<script src="<c:url value="/resources/js/integrationMonitor/networkTopologyDetailInfo.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	<%-- <script src="<c:url value="/resources/js/failure/main/failureGrid.js"><c:param name="version" value="${nowDate}"/></c:url>"></script> --%>
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
						<%-- <div class="totalAlram">
							<div class="tit">성능 고장<br>통합 알람</div>
							<ul>
								<li><i class="mu-icon alram critical"></i><span id="cntAllLevel1" class="num">0</span></li>
								<li><i class="mu-icon alram major"></i><span id="cntAllLevel2" class="num">0</span></li>
								<li><i class="mu-icon alram minor"></i><span id="cntAllLevel3" class="num">0</span></li>
								<li><i class="mu-icon alram warning"></i><span id="cntAllLevel4" class="num">0</span></li>
							</ul>
						</div> --%>
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
							<div class="monitoring-map" id="baseStationDuList">
								<!-- critical, major, minor, nomal -->
								<img class="map-image" src="/resources/images/monitoring/m-map.png" alt="">
								
								<i class="mu-icon alram-map normal" id="equip_FEMTO1" style="left:440px;top:80px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO2" style="left:460px;top:90px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO3" style="left:505px;top:110px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO4" style="left:710px;top:140px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO5" style="left:730px;top:165px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO6" style="left:430px;top:175px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO7" style="left:740px;top:390px"></i>
								<i class="mu-icon alram-map normal" id="equip_FEMTO8" style="left:740px;top:450px"></i>
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
														<span id="activeState1" style="cursor:pointer"><i class="mu-icon alarm normal"></i>0</span>
														<span id="activeState2" style="cursor:pointer"><i class="mu-icon alarm gray"></i>0</span>
													</div>
												</li>
												<li class="state-trouble" style="cursor:pointer" onclick="failureMainGo();">
													<div class="tit">고장</div>
													<div class="state" style="cursor: default;">
														<span id="troubleCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
														<span id="troubleCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
														<span id="troubleCount3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
													</div>
												</li> 
												<li class="state-performace" style="cursor:pointer" onclick="accessMonitorGo();">
													<div class="tit">성능</div>
													<div class="state" style="cursor: default;">
														<span id="performanceCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
														<span id="performanceCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
														<span id="performanceCount3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
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
								<!-- <div class="troubleAlram" style="padding-left: 15px">
									<div class="tit"><i></i>알람 발생 장비 수</div>
									<ul>
										<li><i class="mu-icon alram critical"></i><span id="tnms_cntLevel1" class="num">0</span></li>
										<li><i class="mu-icon alram major"></i><span id="tnms_cntLevel2" class="num">0</span></li>
										<li><i class="mu-icon alram minor"></i><span id="tnms_cntLevel3" class="num">0</span></li>
									</ul>
								</div> -->
							</div>
							<div class="mu-search-btn" style="display:none">
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
					            <col width="25%">
					            <col width="6%">
					            <col width="4.5%">
							</colgroup>
							<thead>
							<tr>
								<th class='overTxt' title='등급'>등급</th>
								<th class='overTxt' title='알람코드'>알람코드</th>
								<th class='overTxt' title='알람내용'>알람내용</th>
								<th class='overTxt' title='장비타입'>장비타입</th>
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
					            <col width="25%">
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
		
		<div style="display:none;">
		<table id="excelTable" class="mu-grid">
			<thead>
			<tr>
				<th bgcolor="#BDBDBD" style="text-align:center">등급</th>
				<th bgcolor="#BDBDBD" style="text-align:center">알람코드</th>
				<th bgcolor="#BDBDBD" style="text-align:center">알람내용</th>
				<th bgcolor="#BDBDBD" style="text-align:center">장비타입</th>
				<th bgcolor="#BDBDBD" style="text-align:center">장비명</th>
				<th bgcolor="#BDBDBD" style="text-align:center">발생시간</th>
				<th bgcolor="#BDBDBD" style="text-align:center">발생위치</th>
				<th bgcolor="#BDBDBD" style="text-align:center">인지상태</th>
			</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	
	<div id="divDialogBackground" class="mu-dialog-background" style="display:none;z-index:12 " ></div>
	<!-- 품질 Trend -->
	<div id="divDialogTrend" class="mu-dialog layer-trend drag" style="width:1000px;top:500px;left:200px;display:none;z-index:12">
		<div class="mu-dialog-head dragHandle">
			<span class="title">품질 Trend : DU#1</span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="trendDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<div class="mu-dialog-body-top">
			<div class="mu-search-group">
				<div class="mu-hgroup">
					<div class="mu-datepicker">
						<input id="start-date-trend" readonly="readonly" type="text">
						<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn-trend"><i class="mu-icon calendar"></i></button>
					</div>
					<div class="mu-selectbox">
						<select id="start-hour-trend" class="mu-value">
							<c:forEach begin="0" end="23" var="item">
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}시</option>
							</c:forEach>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="start-min-trend" class="mu-value">
							<c:forEach begin="0" end="59" var="item" >
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}분</option>
							</c:forEach>
						</select>
					</div>
				</div>
				<span>~</span>
				<div class="mu-hgroup">
					<div class="mu-datepicker">
						<input id="end-date-trend" readonly="readonly" type="text">
						<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn-trend"><i class="mu-icon calendar"></i></button>
					</div>
					<div class="mu-selectbox">
						<select id="end-hour-trend" class="mu-value">
							<c:forEach begin="0" end="23" var="item">
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}시</option>
							</c:forEach>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="end-min-trend" class="mu-value">
							<c:forEach begin="0" end="59" var="item" >
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}분</option>
							</c:forEach>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="search-type-select-trend" class="mu-value">
							<option value="Attach">Attach</option>
							<option value="SR">SR</option>
							<option value="SGS">SGS</option>
						</select>
					</div>
				</div>
				<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="nwtDetail.getTrend();"><i class="mu-icon search"></i></button>
			</div>
		</div>
		<div class="mu-dialog-body">
			<div class="chartWrap" style="min-width:950px; min-height:400px;"></div>
		</div>
	</div>
	
	
	
	<!-- 성능 상세 조회 -->
	<div id="divPerformanceDetail" class="mu-dialog layer-detail drag" style="width:850px;top:100px;left:200px;display:none;z-index:12">
		<div class="mu-dialog-head dragHandle">
			<span class="title">성능 상세조회 : SYSTEM_NAME</span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="performanceDetailDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<div class="mu-dialog-body-top">
			<div class="mu-search-group">
				<div class="mu-hgroup">
					<div class="mu-datepicker">
						<input id="start-date-performance" value="2015/12/21" readonly="readonly" type="text">
						<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn-performance"><i class="mu-icon calendar"></i></button>
					</div>
					<div class="mu-selectbox">
						<select id="start-hour-performance" class="mu-value">
							<c:forEach begin="0" end="23" var="item">
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}시</option>
							</c:forEach>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="start-min-performance" class="mu-value">
							<c:forEach begin="0" end="59" var="item" >
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}분</option>
							</c:forEach>
						</select>
					</div>
				</div>
				<span>~</span>
				<div class="mu-hgroup">
					<div class="mu-datepicker">
						<input id="end-date-performance" value="2015-12-21" readonly="readonly" type="text">
						<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn-performance"><i class="mu-icon calendar"></i></button>
					</div>
					<div class="mu-selectbox">
						<select id="end-hour-performance" class="mu-value">
							<c:forEach begin="0" end="23" var="item">
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}시</option>
							</c:forEach>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="end-min-performance" class="mu-value">
							<c:forEach begin="0" end="59" var="item" >
								<fmt:formatNumber var="fmtItem" value="${item}" pattern="00" />
								<option value="${fmtItem}">${fmtItem}분</option>
							</c:forEach>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="search-type-select-performance" class="mu-value">
							<option value="Attach">Attach</option>
							<option value="SR">SR</option>
							<option value="SGS">SGS</option>
						</select>
					</div>
				</div>
				<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="nwtDetail.getPerformanceDetail();"><i class="mu-icon search"></i></button>
			</div>
		</div>
		<div class="mu-dialog-body">
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover mu-grid-sort2" id="performanceDetailThead">
					<colgroup>
						<col width="">
						<col width="20%">
						<col width="20%">
						<col width="20%">
						<col width="20%">
					</colgroup>
					<thead>
						<tr>
							<th class="updown sort">시간</th>
							<th class="updown sort">시도호</th>
							<th class="updown sort">시도호 증감율</th>
							<th class="updown sort">성공율</th>
							<th class="updown sort">완료율</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height:129px;">
				<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover tbFix" id="performanceDetailTbody">
					<colgroup>
						<col width="">
						<col width="20%">
						<col width="20%">
						<col width="20%">
						<col width="20%">
					</colgroup>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- 고장상세조회 -->
	<div id="divFailureDetail" class="mu-dialog layer-detail drag" style="width:900px; height: 370px; top:100px;left:200px;display:none;z-index:12;">
		<div class="mu-dialog-head dragHandle">
			<span class="title">고장 상세 조회 : SYSTEM_NAME</span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="failureDetailDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<div class="mu-dialog-body">
		<!-- <div id="btnSwitchFauldetail">
			<button class="mu-btn mu-btn-icon" onclick="switch1180failDetail()"><i class="mu-icon search">거점BB 스위치</i></button>
			<button class="mu-btn mu-btn-icon" onclick="switch1164failDetail()"><i class="mu-icon search">관제소 스위치</i></button>
			<button class="mu-btn mu-btn-icon" onclick="switch1114failDetail()"><i class="mu-icon search">역사BB 스위치</i></button>
			<button class="mu-btn mu-btn-icon" onclick="switch1134failDetail()"><i class="mu-icon search">DU 스위치</i></button>
			<br>
		</div> -->
		
			<!-- <span>SWITCH NAME : </span>
			<select name="swithListSelect" class="mu-value">
				<option value="">전체</option>
				<option value="switch1180failDetail">거점BB 스위치</option>
				<option value="switch1164failDetail">관제소 스위치</option>
				<option value="switch1114failDetail">역사BB 스위치</option>
				<option value="switch1134failDetail">DU 스위치</option>
			</select> -->
			<div id="selectSystem">
				<span>SYSTEM NAME : </span><select name="systemListSelect" class="mu-value"></select>
			</div>
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-sort2" id="failureDetailThead">
					<colgroup>
						<%-- <col width="35">
						<col width="80">
						<col width="100">
						<col width="100">
						<col width="185">
						<col width="185">
						<col width=""> --%>
						<col width="5%">
						<col width="10%">
						<col width="15%">
						<col width="10%">
						<col width="20%">
						<col width="20%">
						<col width="20%">
					</colgroup>
					<thead>
					<tr>
						<th class="stat"></th>
						<th class="updown sort" id="LEVEL"><input type="hidden" value="LEVEL" />등급</th>
						<th>장비명</th>
						<th>알람코드</th>
						<th>알람내용</th>
						<th>발생위치</th>
						<th class="updown sort" id="EVENT_TIME"><input type="hidden" value="EVENT_TIME" />발생시간</th>
					</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height:250px;overflow-y:scroll;">
				<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip tbFix" id="failureDetailTbody">
					<colgroup>
						<%-- <col width="35">
						<col width="80">
						<col width="100">
						<col width="100">
						<col width="185">
						<col width="185">
						<col width=""> --%>
						<col width="5%">
						<col width="10%">
						<col width="15%">
						<col width="10%">
						<col width="20%">
						<col width="20%">
						<col width="20%">
					</colgroup>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	</body>
</html>

		