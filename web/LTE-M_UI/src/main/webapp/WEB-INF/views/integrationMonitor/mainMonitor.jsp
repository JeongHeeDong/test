<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="ko">
	<head>
		<%@ include file="/WEB-INF/views/import/import_page.jsp"%>
		<!-- <script src="/resources/js/integrationMonitor/mainMonitor.js"></script> -->
		<!-- <script src="/resources/js/integrationMonitor/integrationstateManagerThreshold.js"></script> -->
		<script src="<c:url value="/resources/js/integrationMonitor/mainMonitor.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
		
		<style type="text/css">
		::-webkit-scrollbar{width: 18px;}
		::-webkit-scrollbar-track {background-color:#000}
		::-webkit-scrollbar-thumb {background-color:#3c3f43;border-radius:0}
		::-webkit-scrollbar-thumb:hover {background: #4e5156;}
		::-webkit-scrollbar-button:start:decrement,::-webkit-scrollbar-button:end:increment {width:18px;height:18px;background:#4e5156} 
		</style>
	</head>
	<body>
		<%@ include file="/WEB-INF/views/menu/menu.jsp"%>
		<div class="mu-container dashboard main">
			<section>
				<!-- 네트워크 토폴로지 Top -->
				<div class="nwTopologyWrap">
					<div class="nwTopology fr">
						<%@ include file="/WEB-INF/views/title/title.jsp" %>
						<div class="timeWrap" id="nowDateTime">감시시간 : </div>
<!-- 						<div class="totalAlram"> -->
<!-- 							<div class="tit"> -->
<!-- 								성능 고장<br>통합 알람 -->
<!-- 							</div> -->
<!-- 							<ul> -->
<!-- 								<li><i class="mu-icon alram critical"></i><span id="cntLevel1" class="num">0</span></li> -->
<!-- 								<li><i class="mu-icon alram major"></i><span id="cntLevel2" class="num">0</span></li> -->
<!-- 								<li><i class="mu-icon alram minor"></i><span id="cntLevel3" class="num">0</span></li> -->
<!-- 							</ul> -->
<!-- 						</div> -->
						<div>
							<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn " onclick="javascript:filterAlarmView(event,MAINMONITOR.filterLevel)"><i class="mu-icon filter"></i>알람필터</button>
							<button id="alarmBtn" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:alarmSound()"><i class="mu-icon sound"></i>가청</button>
							<button id="repeatBtn" type="button" class="mu-btn mu-toggle-btn mu-toggle-on" onclick="javascript:intervalDelete()"><i class="mu-icon watch"></i>감시중</button>
						</div>
					</div>
				</div>

				<!-- Main Monitoring -->
				<div class="monitoring topologyWrap">
					<div class="monitoring-server">
						<div class="server-area">
							<div class="mu-row">
								<div class="mu-col mu-col-2">
									<!-- MGW -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_22">
											<div class="state normalgray"></div>
											<strong class="tit">MGW</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //MGW -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 정류기 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_36">
											<div class="state normalgray"></div>
											<strong class="tit">정류기</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //정류기 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 스위치 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_11">
											<div class="state normalgray"></div>
											<strong class="tit">스위치</strong>
										</div>
										<input type="hidden" class="serverBox" id="equip_44" />
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //스위치 -->
								</div>
								<div class="mu-col mu-col-2">
									IoT-HSS
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_45">
											<div class="state normalgray"></div>
											<strong class="tit">IoT HSS</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									//IoT-HSS
								</div>
								<!-- IoT CSGN 가림 (20/07/22) -->
								<div class="mu-col mu-col-2">
									IoT-CSGN
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_46">
											<div class="state normalgray"></div>
											<strong class="tit">IoT CSGN</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									//IoT-CSGN
								</div>
							</div>
						</div>
						<div class="server-area">
							<div class="mu-row">
								<div class="mu-col mu-col-2">
									<!-- 방화벽 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_13">
											<div class="state normalgray"></div>
											<strong class="tit">방화벽</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //방화벽 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 백업 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_23">
											<div class="state normalgray"></div>
											<strong class="tit">백업</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //백업 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- UCMS -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_20">
											<div class="state normalgray"></div>
											<strong class="tit">UCMS</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //UCMS -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- HSS -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_6">
											<div class="state normalgray"></div>
											<strong class="tit">HSS</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //HSS -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- PCRF -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_7">
											<div class="state normalgray"></div>
											<strong class="tit">PCRF</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //PCRF -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- HPS -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_33">
											<div class="state normalgray"></div>
											<strong class="tit">예비용 HPS</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //예비용 HSS -->
								</div>
								
							</div>
						</div>
						<div class="server-area">
							<div class="mu-row">
								<div class="mu-col mu-col-2">
									<!-- 영상처리장치 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_27">
											<div class="state normalgray"></div>
											<strong class="tit">영상처리장치</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //영상처리장치 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 복합측위 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_35">
											<div class="state normalgray"></div>
											<strong class="tit">복합측위</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //복합측위 -->
								</div>
								<div class="mu-col mu-col-2"></div>
								<div class="mu-col mu-col-2">
									<!-- PTP -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_50">
											<div class="state normalgray"></div>
											<strong class="tit">PTP</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //PTP -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- GW -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_4">
											<div class="state normalgray"></div>
											<strong class="tit">GW</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //GW -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 예비용 GW -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_32">
											<div class="state normalgray"></div>
											<strong class="tit">예비용 GW</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //예비용 GW -->
								</div>
							</div>
						</div>
						<div class="server-area">
							<div class="mu-row">
								<div class="mu-col mu-col-2">
									<!-- MDM -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_18">
											<div class="state normalgray"></div>
											<strong class="tit">MDM</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //MDM -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- FOTA -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_37">
											<div class="state normalgray"></div>
											<strong class="tit">FOTA</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //FOTA -->
								</div>
								<div class="mu-col mu-col-2"></div>
								<div class="mu-col mu-col-2">
									<!-- 통합모니터링 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_52">
											<div class="state normalgray"></div>
											<strong class="tit">통합모니터링</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //통합모니터링 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- MME -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_1">
											<div class="state normalgray"></div>
											<strong class="tit">MME</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //MME -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 예비용 MME -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_31">
											<div class="state normalgray"></div>
											<strong class="tit">예비용 MME</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //예비용 MME -->
								</div>
							</div>
						</div>
						<div class="server-area">
							<div class="mu-row">
								<div class="mu-col mu-col-2">
									<!-- 저장 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_10">
											<div class="state normalgray"></div>
											<strong class="tit">저장</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //저장 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 메시징 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_25">
											<div class="state normalgray"></div>
											<strong class="tit">메시징</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //메세징 -->
								</div>
								<div class="mu-col mu-col-2"></div>
								<div class="mu-col mu-col-2">
									<!-- 영상변동장치 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_51">
											<div class="state normalgray"></div>
											<strong class="tit">영상변동장치</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //영상변동장치 -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- DU -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="du">
											<div class="state normalgray"></div>
											<strong class="tit">DU</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //DU -->
								</div>
								<div class="mu-col mu-col-2"></div>
							</div>
						</div>
						<div class="server-area">
							<div class="mu-row">
								<div class="mu-col mu-col-2">
									<!-- PTT -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_9">
											<div class="state normalgray"></div>
											<strong class="tit">PTT</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //PTT -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- CALL -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_8">
											<div class="state normalgray"></div>
											<strong class="tit">CALL</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //CALL -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- 지령 -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_12">
											<div class="state normalgray"></div>
											<strong class="tit">지령</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //지령 -->
								</div>
								<div class="mu-col mu-col-2"></div>
								<div class="mu-col mu-col-2">
									<!-- RU -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="ru">
											<div class="state normalblue"></div>
											<strong class="tit">RU</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //RU -->
								</div>
								<div class="mu-col mu-col-2">
									<!-- EMS -->
									<div class="serverGroup">
										<span class="stage" style="display:none;"></span>
										<div class="serverBox" id="equip_14">
											<div class="state normalgray"></div>
											<strong class="tit">EMS</strong>
										</div>
										<div class="engineer" style="display:none;"></div>
									</div>
									<!-- //EMS -->
								</div>
							</div>
						</div>
					</div>
					<div class="monitoring-state">
						<div class="total-state">
							<div class="mu-panel">
								<div class="mu-panel-head">통합감시 현황</div>
								<div class="mu-panel-body">
									<ul>
										<li class="state-work" style="cursor:pointer" onclick="networkGo();">
											<div class="tit">동작상태</div>
											<div class="state">
												<span id="activeState1" style="cursor:pointer"><i class="mu-icon alarm normal"></i>0</span>
												<span id="activeState2" style="cursor:pointer"><i class="mu-icon alarm gray"></i>0</span>
											</div>
										</li>
										<li class="state-trouble" style="cursor:pointer" onclick="failureMainGo();">
											<div class="tit" >고장</div>
											<div class="state">
												<span id="troubleCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
												<span id="troubleCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
												<span id="troubleCount3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
											</div>
										</li>
										<li class="state-performace" style="cursor:pointer" onclick="accessMonitorGo();">
											<div class="tit" >성능</div>
											<div class="state">
												<span id="performanceCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
												<span id="performanceCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
												<span id="performanceCount3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
											</div>
										</li>
										<li class="state-server" style="cursor:pointer" onclick="sysstateGo();">
											<div class="tit">서버상태</div>
											<div class="state">
												<span id="serverState1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
												<span id="serverState2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
												<span id="serverState3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="nms-state" id="nmsSystemState">
							<div class="mu-panel">
								<div class="mu-panel-head">NMS 시스템 현황</div>
								<div class="mu-panel-body">
									<ul>
										<li id="serverProcessState" style="cursor:pointer" onclick="sioefProcessManageGo();">
											<div class="tit" >프로세스</div>
											<div class="state">
												<span id="nmsProcessCount1" style="cursor:pointer"><i class="mu-icon alarm normal"></i>0</span>
												<span id="nmsProcessCount2" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
											</div>
										</li>
										<li id="serverCondition" style="cursor:pointer" onclick="sysStateManagerGo();">
											<div class="tit" >서버상태</div>
											<div class="state">
												<span id="nmsServerState1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
												<span id="nmsServerState2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
												<span id="nmsServerState3" style="cursor:pointer"><i class="mu-icon alarm minor"></i>0</span>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="data-state" id="dataCollectState">
							<div class="mu-panel">
								<div class="mu-panel-head">데이터 수집 현황</div>
								<div class="mu-panel-body">
									<ul>
										<li style="cursor:pointer" onclick="sysColManagerPerformGo();">
											<div class="tit">성능정보</div>
											<div class="state">
												<span id="dataPerformanceCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
												<span id="dataPerformanceCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
											</div>
										</li>
										<!-- <li>
											<div class="tit">수집시간</div>
											<div class="date" id="processCountDate">2018/05/17 13:40:04</div>
										</li> -->
										<li style="cursor:pointer" onclick="sysColManagerConfigGo();">
											<div class="tit">구성정보</div>
											<div class="state">
												<span id="organizationCount1" style="cursor:pointer"><i class="mu-icon alarm critical"></i>0</span>
												<span id="organizationCount2" style="cursor:pointer"><i class="mu-icon alarm major"></i>0</span>
<!-- 												<span id="organizationCount1"><i class="mu-icon alarm minor"></i>999</span> -->
											</div>
										</li>
										<!-- <li>
											<div class="tit">수집시간</div>
											<div class="date" id="organizationCountDate">2018/05/17 13:40:04</div>
										</li> -->
									</ul>
									
								</div>
							</div>
						</div>
						<div class="clear-state">
							<div class="mu-panel">
								<div class="mu-panel-head">최근해제된 고장알람</div>
								<div class="mu-panel-body">
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
								<div class="mu-scroll-v scrollY">
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

<!-- 				<div class="monitoring" style="display:none;"> -->
<!-- 					<div class="serverGroupStat"> -->
<!-- 						<div class="serverGroupL default"></div>critical, major, minor, normal, default -->
<!-- 						<div class="serverGroupR default"></div> -->
<!-- 					</div> -->
					
<!-- 					<div class="serverGroup"> -->
					
<!-- 						EMS -->
<!-- 						<div class="serverModel ems"> -->
<!-- 							<div class="serverBox" id = "equip_0099_14_N"> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
					
<!-- 						백업 -->
<!-- 						<div class="serverModel backup"> -->
<!-- 							<div class="serverBox" id = "equip_1152_23_N"> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
						
<!-- 						영상표출장치 -->
<!-- 						<div class="serverModel imgdisplay"> -->
<!-- 							<div class="serverBox" id="equip_1155_27_N"> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
						
<!-- 					</div> -->
					
<!-- 					저장장치 -->
<!-- 					<div class="serverModel double storage"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_1147_10_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_1113_10_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					Media GW -->
<!-- 					<div class="serverModel double mediaGW"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_1151_22_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_1150_22_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					메시징 -->
<!-- 					<div class="serverModel double messaging"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_1154_25_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_1153_25_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					IM -->
<!-- 					<div class="serverModel double im"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_1149_21_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_1148_21_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					PTT -->
<!-- 					<div class="serverModel double ptt"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_1124_9_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_1111_9_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					CALL -->
<!-- 					<div class="serverModel double call"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_1123_8_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_1112_8_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					지령 -->
<!-- 					<div class="serverModel order"> -->
<!-- 						<div class="serverBox" id = "equip_1118_12_N"> -->
<!-- 							<div class="state normalgray">서버</div> -->
<!-- 							<strong class="tit"></strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
					
<!-- 					행선안내 -->
<!-- 					<div class="serverModel sailInfo"> -->
<!-- 						<div class="serverBox" id = "equip_1157_24_N"> -->
<!-- 							<div class="state normalgray">서버</div> -->
<!-- 							<strong class="tit"></strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					UCMS -->
<!-- 					<div class="serverModel ucms"> -->
<!-- 						<div class="serverBox" id = "equip_1156_20_N"> -->
<!-- 							<div class="state normalgray">서버</div> -->
<!-- 							<strong class="tit"></strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					HSS -->
<!-- 					<div class="serverModel double hss"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_902_6_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_901_6_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					PCRF -->
<!-- 					<div class="serverModel double pcrf"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_0002_7_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit near"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_0002_7_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit near"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					SP/GW -->
<!-- 					<div class="serverModel double spGW"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_0003_4_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit near"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_0003_4_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit near"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					MME -->
<!-- 					<div class="serverModel double mme"> -->
<!-- 						<div class="serverBox"> -->
<!-- 							<div class="server01 normalgray" id = "equip_0001_1_S"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit near"></strong> -->
<!-- 							</div> -->
<!-- 							<div class="server02 normalblue" id = "equip_0001_1_A"> -->
<!-- 								<div class="state normal">서버</div> -->
<!-- 								<strong class="tit near"></strong> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					DU -->
<!-- 					<div class="serverModel du"> -->
<!-- 						<div class="serverBox" id = "du-2"> -->
<!-- 							<div class="state normalgray">서버</div> -->
<!-- 							<strong class="tit">DU</strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					RU -->
<!-- 					<div class="serverModel ru"> -->
<!-- 						<div class="serverBox" id = "ru-3"> -->
<!-- 							<div class="state normalblue">서버</div> -->
<!-- 							<strong class="tit">RU</strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					IP/MPLS 스위치 -->
<!-- 					<div class="serverModel ipSwitch"> -->
<!-- 						<div class="serverBox" id = "equip_1128_11_N" data-alias = "IP/MPLS"> -->
<!-- 							<div class="state normalgray"></div> -->
<!-- 							<strong class="tit"></strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
					
<!-- 					L2 스위치 -->
<!-- 					<div class="serverModel l2Switch"> -->
<!-- 						<div class="serverBox" id = "equip_1114_11_N" data-alias = "L2/L3"> -->
<!-- 							<div class="state normalgray"></div> -->
<!-- 							<strong class="tit"></strong> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				</div> -->
				<%@ include file="/WEB-INF/views/common/filter_alarm_noall.jsp" %>
				<input type="hidden" id="localIp" value="${ip}" />
				<input type="hidden" id="websocketPort" value="${websocketPort}" />
				<input type="hidden" id="userId" value="<c:out value="${user_id}" />"/>
				
				<input type="hidden" id="audioAlarmLevel" value=4>
				<input type="hidden" id="failureAudioAlarmLevel" value=4>
				<input type="hidden" id="failureAudioIntervalId">
				<input type="hidden" id="audioIntervalId">
				
				<table id="tb_failure_alarm" class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover tbFix" style="display: none;" >
					<colgroup>
						<col width="4%">
						<col width="8%">
						<col width="auto">
						<col width="9%">
						<col width="11%">
						<col width="11%">
						<col width="13%">
						<col width="17%">
						<col width="6%">
						<col width="6%">
					</colgroup>
					<tbody id="failureGrid"></tbody>
				</table>
				
			</section>
		</div>
	</body>
</html>