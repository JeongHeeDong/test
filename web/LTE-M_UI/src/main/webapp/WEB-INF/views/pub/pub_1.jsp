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
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container dashboard">
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

			<!-- Topology -->
			<div class="topologyWrap">
				<div class="mu-row">
					<div class="mu-col mu-col-4"><!-- 22-02-09 MOD : mu-col로 공통 -->
						<div class="server-wrap">
							<div class="tit">EPC</div>
							<div class="server-area epc lg-type" id="epcList"><!-- 22-02-09 ADD : epc + lg-type -->
								<!-- MME -->
								<div class="serverGroup double mme" >
									<span class="stage" style="display:none;"></span>
									<div id="equip_0002_1_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_0001_1_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- GW -->
								<div class="serverGroup double gw">
									<span class="stage" style="display:none;"></span>
									<div id="equip_0022_4_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_0021_4_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- GW -->
								<div class="serverGroup double hss">
									<span class="stage" style="display:none;"></span>
									<div id="equip_0012_6_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_0011_6_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- HSS -->
								<!-- <div class="serverGroup double hss">
									<span class="stage" style="display:none;"></span>
									<div id="equip_902_6_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_901_6_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- PCRF -->
								<!-- div class="serverGroup double pcrf">
									<span class="stage" style="display:none;"></span>
									<div id="equip_0001_7_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_0001_7_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
							</div>
						</div>
					</div>
					<div class="mu-col mu-col-3"><!-- 22-02-09 MOD : mu-col로 공통 -->
						<div class="server-wrap">
							<div class="tit">EMS</div><!-- 22-02-09 DEL : br -->
							<div class="server-area ems lg-type" id="emsList"><!-- 22-02-09 ADD : ems + lg-type -->
								<div class="serverGroup ems-c">
									<span class="stage" style="display:none;"></span>
									<div id="equip_0099_15_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> 
								<!-- EMS-R -->
								<div class="serverGroup ems-r">
									<span class="stage" style="display:none;"></span>
									<div id="equip_0001_38_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> 
								<!-- MME -->
								<!-- <div class="serverGroup epc-re01">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1182_31_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- GW -->
								<!-- <div class="serverGroup epc-re02">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1183_32_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
								</div>
								<div class="serverGroup epc-re03">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1184_33_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
							</div>
						</div>
					</div>
					<div class="mu-col mu-col-5">
						<div class="server-wrap">
							<div class="tit">EMS</div>
							<!-- lg-type -->
							<!--
							<div class="server-area ems lg-type" id="">
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server1</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server2</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server3</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server4</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
							</div>
							-->
							<!-- more-type -->
							<div class="server-area ems more-type" id="">
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server1</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server2</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server3</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server4</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server5</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server6</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server7</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">server8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-col mu-col-12"><!-- 22-02-09 MOD : mu-col로 공통 -->
						<div class="server-wrap">
							<div class="tit">서비스<br>서버</div>
							<div class="server-area service-server lg-type" id="serviceServerList"><!-- 22-02-09 ADD : service-server + lg-type -->
								<!-- MCPTT -->
								<div class="serverGroup storage">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1111_9_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div> 
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- call -->
								<div class="serverGroup message  ">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1121_8_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 음성영상서버 -->
								<div class="serverGroup ucms ">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1131_10_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 영상중계서버 -->
								<div class="serverGroup backup ">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1141_53_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!--  GIS서버 -->
								<div class="serverGroup mdm ">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1161_54_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- IOT서버 -->
								<div class="serverGroup positioning ">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1151_55_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- UTM -->
								<div class="serverGroup double firewall">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1172_56_N" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1171_56_N" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 저장 -->
								<!-- <div class="serverGroup quad storage">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1170_10_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1169_10_S" class="serverBox server02">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1147_10_S" class="serverBox server03">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1113_10_A" class="serverBox server04">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 메세징 -->
								<!-- <div class="serverGroup double message">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1154_25_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1153_25_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- ucms -->
								<!-- <div class="serverGroup ucms">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1156_20_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 백업 -->
								<!-- <div class="serverGroup backup">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1152_23_N" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>  -->
								<!-- MDM -->
								<!-- <div class="serverGroup mdm no-menu" id="mdm">
									<span class="stage" style="display:none;"></span>
									<div id="equip_18_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 복합측위 -->
								<!-- <div class="serverGroup positioning">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1175_35_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 방화벽 -->
								<!-- <div class="serverGroup double firewall">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1186_13_A" class="serverBox server01">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1185_13_N" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- IoT-CSGN -->
								<!-- <div class="serverGroup double iotcsgn">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1194_46_A" class="serverBox server01">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1193_46_N" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- PTP -->
								<!-- div class="serverGroup ptp">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1195_50_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- ppt -->
								<!-- <div class="serverGroup quad ppt">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1168_9_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1167_9_S" class="serverBox server02">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1124_9_S" class="serverBox server03">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1111_9_A" class="serverBox server04">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- call -->
								<!-- <div class="serverGroup call">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1123_8_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1121_8_A" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 지령 -->
								<!-- <div class="serverGroup double order">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1172_12_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1118_12_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 정류기 -->
								<!-- <div class="serverGroup rectifier no-menu" id="rectifier">
									<span class="stage" style="display:none;"></span>
									<div id="equip_jrg_36_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- fota -->
								<!-- <div class="serverGroup fota">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1177_37_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								영상처리장치
								<div class="serverGroup image no-menu" id="image">
									<span class="stage" style="display:none;"></span>
									<div id="equip_27_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								MGW
								<div class="serverGroup mgw">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1150_22_S" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- iot-hss -->
								<!-- <div class="serverGroup double iothss">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1192_45_S" class="serverBox server01">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1191_45_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 통합모니터링 -->
								<!-- <div class="serverGroup totalmonitoring">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1197_52_N" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
								<!-- 영상변동장치 -->
								<!-- <div class="serverGroup double change">
									<span class="stage" style="display:none;"></span>
									<div id="equip_1199_51_S" class="serverBox server01">
										<div class="state normalgray"></div>
										<strong class="tit"></strong>
									</div>
									<div id="equip_1198_51_A" class="serverBox server02">
										<div class="state normalblue"></div>
										<strong class="tit"></strong>
									</div>
									<div class="engineer" style="display:none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div> -->
							</div>
						</div>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-col mu-col-12">
						<!-- 기지국 -->
						<div class="server-wrap">
							<div class="tit">기지국</div>
							
							<div class="server-area base-station lg-type" id=""><!-- 22-02-09 ADD : base-station + lg-type -->
								<!-- 기지국1 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">기지국1</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국2 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국2</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국3 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국3</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국4 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국4</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국5 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국5</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국6 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국6</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국7 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국7</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-col mu-col-12">
						<!-- 기지국 -->
						<div class="server-wrap">
							<div class="tit">기지국</div>
							
							<div class="server-area base-station more-type" id=""><!-- 22-02-09 ADD : base-station + more-type -->
								<!-- 기지국1 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalgray"></div>
										<strong class="tit">기지국1</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국2 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국2</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국3 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국3</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국4 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국4</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국5 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국5</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국6 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국6</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국7 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국7</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
								<!-- 기지국8 -->
								<div class="serverGroup">
									<span class="stage" style="display: none;"></span>
									<div id="" class="serverBox">
										<div class="state normalblue"></div>
										<strong class="tit">기지국8</strong>
									</div>
									<div class="engineer" style="display: none;"></div>
									<div class="clear24_icon" style="display: none;">!</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>


			<%--
			서버 세트 예시 (기본)
			<div class="serverBox">
			
				<!-- 성능/품질 단계 -->
				<span class="stage yellow">성능/품질 1단계</span>
				<span class="stage orange">성능/품질 2단계</span>
				<span class="stage red">성능/품질 3단계</span>
				
				<!-- 고장상태 -->
				<div class="state yellow">서버 고장 1단계</div>
				<div class="state orange">서버 고장 2단계</div>
				<div class="state red">서버 고장 3단계</div>
				
				<strong class="tit">장비이름</strong>
				<div class="engineer"></div>
			</div> -->
			
			서버 세트 예시 (이중화서버)
			<div class="double">
			
				<!-- 성능/품질 단계 -->
				<span class="stage yellow">성능/품질 1단계</span>
				<span class="stage orange">성능/품질 2단계</span>
				<span class="stage red">성능/품질 3단계</span>
				
				<!-- 고장상태 -->
				<div class="serverBox server01 normalgray">
					<div class="state">서버</div>
				</div>
				<div class="serverBox server02 normalblue">
					<div class="state">서버</div>
				</div>
				<div class="serverBox server02 yellow">
					<div class="state">서버</div>
				</div>
				<div class="serverBox server02 orange">
					<div class="state">서버</div>
				</div>
				<div class="serverBox server02 red">
					<div class="state">서버</div>
				</div>
				<strong class="tit">장비이름</strong>
				<div class="engineer"></div>
			</div>
			--%>
<!-- 			<div class="topologyWrap" style="display:none;"> -->
<!-- 				<div class="allServer"> -->
<!-- 					<div> -->
<!-- 						서비스장비 -->
<!-- 						<div class="serviceServer"> -->
<!-- 							<div class="tit">서비스장비</div> -->
<!-- 							저장장치 -->
<!-- 							<div class="double storage serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_1147_10_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state"></div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_1113_10_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state"></div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							Media GW -->
<!-- 							<div class="double mediaGW serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_1151_22_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_1150_22_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							UMCS -->
<!-- 							<div id="equip_1156_20_N" class="serverBox ucms serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							메시징 -->
<!-- 							<div class="double messaging serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_1154_25_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_1153_25_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							IM -->
<!-- 							<div class="double im serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_1149_21_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_1148_21_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							PTT -->
<!-- 							<div class="double ptt serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_1124_9_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_1111_9_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							CALL -->
<!-- 							<div class="double call serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_1123_8_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_1112_8_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							지령 -->
<!-- 							<div id="equip_1118_12_N" class="serverBox order serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							행선안내 -->
<!-- 							<div id="equip_1157_24_N" class="serverBox sailInfo serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
<!-- 						</div> -->
						
<!-- 						주제어장치 -->
<!-- 						<div class="mainServer normal">critical, major, minor -->
<!-- 							<div class="tit">주제어장치</div> -->
<!-- 							HSS -->
<!-- 							<div class="double hss serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_902_6_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_901_6_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							PCRF -->
<!-- 							<div class="double pcrf serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_0002_7_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_0002_7_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							MME -->
<!-- 							<div class="double mme serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_0001_1_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_0001_1_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							SP/GW -->
<!-- 							<div class="double spgw serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div id="equip_0003_4_S" class="serverBox server01 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div id="equip_0003_4_A" class="serverBox server02 normalgray"> -->
<!-- 									<div class="state">서버</div> -->
<!-- 									<strong class="tit"></strong> -->
<!-- 								</div> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
<!-- 						</div> -->
						
<!-- 						응용시스템 -->
<!-- 						<div class="systemServer"> -->
<!-- 							<div class="tit">응용시스템</div> -->
							
<!-- 							백업 -->
<!-- 							<div id="equip_1152_23_N" class="serverBox backup serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							영상표출장치 -->
<!-- 							<div id="equip_1155_27_N" class="serverBox imgdisplay serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							EMS -->
<!-- 							<div id="equip_0099_14_N" class="serverBox ems serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
<!-- 						</div> -->
						
<!-- 						스위치 -->
<!-- 						<div class="switchServer"> -->
<!-- 							<div class="tit">스위치</div> -->
							
<!-- 							IP/MPLS 스위치 -->
<!-- 							<div id="equip_1128_11_N" class="serverBox ipswitch serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
							
<!-- 							L2스위치 -->
<!-- 							<div id="equip_1114_11_N" class="serverBox l2switch serverGroup"> -->
<!-- 								<span class="stage" style="display:none;"></span> -->
<!-- 								<div class="state normalgray">서버</div> -->
<!-- 								<strong class="tit"></strong> -->
<!-- 								<div class="engineer" style="display:none;"></div> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 				<div class="duServer"> -->
<!-- 					<strong class="tit">DU</strong> -->
<!-- 					<div id="duList"> -->
<%-- 						<div class="station st01">
<%-- 							<div class="serverBox"> --%>
<%-- 								<span class="stage yellow">성능/품질 1단계</span> --%>
<%-- 								<div class="state red">서버 고장 3단계</div> --%>
<%-- 								<strong class="tit">김포한강기지</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station double st02"> --%>
<%-- 							<div class="double"> --%>
<%-- 								<span class="stage yellow">성능/품질 1단계</span> --%>
<%-- 								<div class="serverBox server01 normalgray"> --%>
<%-- 									<div class="state">서버</div> --%>
<%-- 								</div> --%>
<%-- 								<div class="serverBox server02 normalblue"> --%>
<%-- 									<div class="state">서버</div> --%>
<%-- 								</div> --%>
<%-- 								<strong class="tit">양촌역-100</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st03 selected"> --%>
<%-- 							<div class="serverBox"> --%>
<%-- 								<div class="state orange">서버 고장 2단계</div> --%>
<%-- 								<strong class="tit">구래역-101</strong> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st04"> --%>
<%-- 							<div class="double"> --%>
<%-- 								<span class="stage orange">성능/품질 1단계</span> --%>
<%-- 								<div class="serverBox server01 yellow"> --%>
<%-- 									<div class="state">서버 고장 1단계</div> --%>
<%-- 								</div> --%>
<%-- 								<div class="serverBox server02 orange"> --%>
<%-- 									<div class="state">서버 고장 2단계</div> --%>
<%-- 								</div> --%>
<%-- 								<strong class="tit">마산역-102</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st05"> --%>
<%-- 							<div class="double"> --%>
<%-- 								<span class="stage red">성능/품질 3단계</span> --%>
<%-- 								<div class="serverBox server01 orange"> --%>
<%-- 									<div class="state">서버 고장 2단계</div> --%>
<%-- 								</div> --%>
<%-- 								<div class="serverBox server02 red"> --%>
<%-- 									<div class="state">서버 고장 3단계</div> --%>
<%-- 								</div> --%>
<%-- 								<strong class="tit">장기역103</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st06"> --%>
<%-- 							<div class="double"> --%>
<%-- 								<div class="serverBox server01 normalgray"> --%>
<%-- 									<div class="state">서버</div> --%>
<%-- 								</div> --%>
<%-- 								<div class="serverBox server02 normalblue"> --%>
<%-- 									<div class="state">서버</div> --%>
<%-- 								</div> --%>
<%-- 								<strong class="tit">운양역-104</strong> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st07"> --%>
<%-- 							<div class="serverBox"> --%>
<%-- 								<div class="state red">서버 고장 3단계</div> --%>
<%-- 								<strong class="tit">걸포북변역-105</strong> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st08"> --%>
<%-- 							<div class="serverBox"> --%>
<%-- 								<div class="state normal">서버</div> --%>
<%-- 								<strong class="tit">김포시청역-106</strong> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st09"> --%>
<%-- 							<div class="double"> --%>
<%-- 								<span class="stage orange">성능/품질 2단계</span> --%>
<%-- 								<div class="serverBox server01 yellow"> --%>
<%-- 									<div class="state">서버 고장 1단계</div> --%>
<%-- 								</div> --%>
<%-- 								<div class="serverBox server02 yellow"> --%>
<%-- 									<div class="state">서버 고장 1단계</div> --%>
<%-- 								</div> --%>
<%-- 								<strong class="tit">풍무역-107</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st10"> --%>
<%-- 							<div class="serverBox"> --%>
<%-- 								<div class="state normal">서버</div> --%>
<%-- 								<strong class="tit">고촌역-108</strong> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st11"> --%>
<%-- 							<div class="serverBox"> --%>
<%-- 								<div class="state yellow">서버 고장 1단계</div> --%>
<%-- 								<strong class="tit">김포공항역-109</strong> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<%-- 						<div class="station st12"> --%>
<%-- 							<div class="double"> --%>
<%-- 								<span class="stage yellow">성능/품질 1단계</span> --%>
<%-- 								<div class="serverBox server01 red"> --%>
<%-- 									<div class="state">서버 고장 3단계</div> --%>
<%-- 								</div> --%>
<%-- 								<div class="serverBox server02 red"> --%>
<%-- 									<div class="state">서버 고장 3단계</div> --%>
<%-- 								</div> --%>
<%-- 								<strong class="tit">김포공항역-110</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</div> --%>
<%-- 						</div> --%>
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 					RU -->
<!-- 					<div class="ruServer"> -->
<!-- 						<strong class="tit">RU</strong> -->
<!-- 						<ul id="ruList"> -->
<%-- 							
<%-- 							<li class="serverBox"> --%>
<%-- 								<span class="stage yellow">성능/품질 1단계</span> --%>
<%-- 								<div class="state yellow">서버 고장 1단계</div> --%>
<%-- 								<strong class="tit">RU_001</strong> --%>
<%-- 								<div class="engineer"></div> --%>
<%-- 							</li> --%>
<%-- 							<li class="serverBox"> --%>
<%-- 								<span class="stage orange">성능/품질 2단계</span> --%>
<%-- 								<div class="state orange">서버 고장 2단계</div> --%>
<%-- 								<strong class="tit">RU_002</strong> --%>
<%-- 							</li> --%>
<%-- 							<li class="serverBox"> --%>
<%-- 								<span class="stage red">성능/품질 3단계</span> --%>
<%-- 								<div class="state red">서버 고장 3단계</div> --%>
<%-- 								<strong class="tit">RU_003</strong> --%>
<%-- 							</li> --%>
<%-- 							<li class="serverBox"> --%>
<%-- 								<div class="state normal">서버</div> --%>
<%-- 								<strong class="tit">RU_004</strong> --%>
<%-- 							</li> --%>
<%-- 							<li class="serverBox"> --%>
<%-- 								<div class="state normal">서버</div> --%>
<%-- 								<strong class="tit">RU_005</strong> --%>
<%-- 							</li> --%>
<%-- 							--%>
<!-- 						</ul> -->
<!-- 					</div> -->
<!-- 			</div> -->
			
			<!-- 기존소스 삭제예정 -->
			<!-- div id="topology" class="topologyWrap" oncontextmenu="setContextMenu();"></div -->

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
<%-- 				            <col width="8%"> --%>
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
<!-- 							<th class='overTxt' title='장비명'>구분</th>
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
	
	<!-- 최근 해제된 고장알람 -->
	<div id="divRecoverFailureDetail" class="mu-dialog layer-detail drag" style="width:1150px; height: 370px; top:355px;left:485px;display:none;z-index:12;">
		<div class="mu-dialog-head dragHandle">
			<span class="title">최근 해제된 고장알람</span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="failureDetailDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<div class="mu-dialog-body">
			<div id="selectRcvSystem">
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
						<%-- <col width="5%"> --%>
						<col width="5%">
						<col width="9%">
						<col width="15%">
						<col width="9%">
						<col width="15%">
						<col width="15%">
						<col width="14%">
						<col width="14%">
					</colgroup>
					<thead>
						<tr>
							<th class="stat"></th>
							<th id="LEVEL"><input type="hidden" value="LEVEL" />등급</th>
							<th>장비명</th>
							<th>알람코드</th>
							<th>알람내용</th>
							<th>발생위치</th>
							<th id="EVENT_TIME"><input type="hidden" value="EVENT_TIME" />발생시간</th>
							<th id="EVENT_TIME"><input type="hidden" value="EVENT_TIME" />해제시간</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height:250px;overflow-y:scroll;">
				<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip tbFix" id="recoverDetailTbody">
					<colgroup>
						<%-- <col width="35">
						<col width="80">
						<col width="100">
						<col width="100">
						<col width="185">
						<col width="185">
						<col width=""> --%>
						<%-- <col width="5%"> --%>
						<col width="5%">
						<col width="9%">
						<col width="15%">
						<col width="9%">
						<col width="15%">
						<col width="15%">
						<col width="14%">
						<col width="14%">
					</colgroup>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- 스위치포트조회 -->
	<!-- <div id="divSwitchView" class="mu-dialog layer-detail drag" style="top:100px;left:200px;display:none;z-index:12;">
		<div class="mu-dialog-head dragHandle">
			<span class="title">스위치 </span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="switchViewDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<section>
			<div><br></div>
			<span>SYSTEM NAME : </span>
			<select name="switchPortSelect" onchange="javascript:switchPort(this.value);">
				<option value="">전체</option>
				<option value="switch1180">거점BB 스위치</option>
				<option value="switch1164">관제소 스위치</option>
				<option value="switch1114">역사BB 스위치</option>
				<option value="switch1134">DU 스위치</option>
			</select>
			<button class="mu-btn mu-btn-icon" onclick="switch1180()"><i class="mu-icon search">거점BB 스위치</i></button>
			<button class="mu-btn mu-btn-icon" onclick="switch1164()"><i class="mu-icon search">관제소 스위치</i></button>
			<button class="mu-btn mu-btn-icon" onclick="switch1114()"><i class="mu-icon search">역사BB 스위치</i></button>
			<button class="mu-btn mu-btn-icon" onclick="switch1134()"><i class="mu-icon search">DU 스위치</i></button>
			<div id="switchOuter"></div>
		
		</section>
	</div> -->
	<div id="divSwitchView" class="mu-dialog layer-detail drag" style="top:100px;left:200px;height:610px;display:none;z-index:13;">
		<div class="mu-dialog-head dragHandle">
			<span class="title">포트 조회</span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="switchViewDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<div><br></div>
		<section>
			<div id="switchOuter"></div>
		</section>
	</div>
	
	<div id="divDetailDialogBackground" class="mu-dialog-background" style="display:none;" ></div>
	
	<!-- 주니퍼 리스트조회 -->
	<div id="divSwitchListView" class="mu-dialog layer-detail drag" style="top: 235px; left: 341.5px; width: 1250px; height: 680px; display:none">
		<div class="mu-dialog-head dragHandle">
			<span class="title" id="switch11ListPoptitle">스위치 리스트 </span>
			<button type="button" class="mu-btn mu-btn-icon detailCancel" id="switchListDialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<div><br></div>
		<section>
			<span>SYSTEM NAME : </span>
			<select id="switchPortSelect" name="switchPortSelect"  onchange="javascript:equip11switch(this.value);">
			</select>
		<div class="mu-dialog-body" style="background: #b4c3d7; height: 590px">
			<ul id="juniperSwitchList" class="equipList">
			</ul>
		</div>
		</section>
	</div>
	
	<!-- 노키아 상세리스트조회 -->
	<!-- <div id="divEquip44ListView" class="mu-dialog layer-detail drag" style="top: 235px; left: 341.5px; width: 1220px; height: 680px; display:none">
		<div class="mu-dialog-head dragHandle">
			<span class="title" id="switch44ListPoptitle" >스위치 리스트 </span>
			<button type="button" class="mu-btn mu-btn-icon detailCancel" id="divEquip44DialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<section>
			<div><br></div>
		<div class="mu-dialog-body" style="background: #b4c3d7; height: 590px">
			<ul id="equip44List" class="equipList">
			</ul>
		</div>
		</section>
	</div> -->
	
	<!-- 정류기 노선 선택 -->
	<div id="divEquip36LineListBackground" class="mu-dialog-background" style="z-index:8; display:none;" ></div>
	<div id="divEquip36LineListView" class="mu-dialog layer-detail drag" style="top: 235px; left: 341.5px; width: 650px; height: 260px; z-index:9; display:none;">
		<div class="mu-dialog-head dragHandle">
			<span class="title">노선 선택 </span>
			<button type="button" class="mu-btn mu-btn-icon equip36LineCancel"><i class="mu-icon-img"></i></button>
		</div>
		<section>
			<div><br></div>
			<div class="mu-dialog-body" id="jrgLineList" style="background: #b4c3d7; height: 200px">
				<div class="serverGroup sw-station" id="equip36_gwanje" style="left:3%;">
					<span class="stage" style="display:true;"></span>
					<div id="equip_gwanje_36_N" class="serverBox">
						<div class="state normalgray"></div>
						<strong class="tit">관제</strong>
					</div>
					<div class="engineer" style="display:none;"></div>
					<div class="clear24_icon" style="display: none;">!</div>
				</div>
				<div class="serverGroup sw-station" id="equip36_station5" style="left:13%;" >
					<span class="stage" style="display:none;"></span>
					<div id="equip_staion5_36_N" class="serverBox">
						<div class="state normalgray"></div>
						<strong class="tit">5호선</strong>
					</div>
					<div class="engineer" style="display:none;"></div>
					<div class="clear24_icon" style="display: none;">!</div>
				</div>
				<div class="serverGroup sw-station" id="equip36_station7" style="left:23%;" >
					<span class="stage" style="display:none;"></span>
					<div id="equip_station7_36_N" class="serverBox">
						<div class="state normalgray"></div>
						<strong class="tit">7호선</strong>
					</div>
					<div class="engineer" style="display:none;"></div>
					<div class="clear24_icon" style="display: none;">!</div>
				</div>
			</div>
		</section>
	</div>
	
	<!-- 정류기 상세리스트조회 -->
	<div id="divEquip36ListView" class="mu-dialog layer-detail drag" style="top: 235px; left: 341.5px; width: 1220px; height: 680px; display:none">
		<div class="mu-dialog-head dragHandle">
			<span class="title">정류기 리스트 </span>
			<button type="button" class="mu-btn mu-btn-icon detailCancel"><i class="mu-icon-img"></i></button>
		</div>
		<section>
			<div><br></div>
		<div class="mu-dialog-body" style="background: #b4c3d7; height: 590px">
			<ul id="equip36List" class="equipList">
				<li class="serverGroup station">
					<span class="stage" style="display:;"></span>
					<div class="serverBox">
						<div class="state normalblue"></div>
						<strong class="tit"></strong>
					</div>
					<div class="engineer" style="display:;"></div>
				</li>
			</ul>
		</div>
		</section>
	</div>
	
	<!-- 장비 목록 (장비 5호선, 7호선 분리) -->
	<div id="divLineEquipVeiw" class="mu-dialog layer-detail drag" style="width: 620px; display:none">
		<div class="mu-dialog-head dragHandle">
			<span class="title">장비 리스트</span>
			<button type="button" id="lineEquipCancel" class="mu-btn mu-btn-icon detailCancel"><i class="mu-icon-img"></i></button>
		</div>
		<section>
			<div><br></div>
		<div class="mu-dialog-body" style="background: #b4c3d7; height: 220px">
			<ul id="lineEquipList" class="equipList">
				<li class="serverGroup station">
					<span class="stage" style="display:;"></span>
					<div class="serverBox">
						<div class="state normalblue"></div>
						<strong class="tit"></strong>
					</div>
					<div class="engineer" style="display:;"></div>
				</li>
			</ul>
		</div>
		</section>
	</div>
	
	<!-- <div id="divDialogLine5Background" class="mu-dialog-background" style="display:none;z-index:8 " ></div>
	스위치 관제, 5호선, 7호선 팝업
	<div id="divLine5ListView" class="mu-dialog layer-detail drag" style="top: 200px; left: 300.5px; width: 650px; height: 260px; display:none; z-index: 9;">
		<div class="mu-dialog-head dragHandle">
			<span class="title" id="switchPoptitle">스위치 종류 </span>
			<button type="button" class="mu-btn mu-btn-icon cancel" id="divLine5DialogCancel"><i class="mu-icon-img"></i></button>
		</div>
		<section>
			<div><br></div>
		<div id="line5List" class="mu-dialog-body" style="background: #b4c3d7; height: 200px">
			<div class="serverGroup sw-station" id="switchHanam"  style="left:10%;" >
			<div class="serverGroup sw-station" id="switchHanam"  style="left:38%;" >
				<span class="stage" style="display:none;"></span>
				<div id="equip_hanam_11_N" class="serverBox">
					<div class="state normalgray"></div>
					<strong class="tit">하남선 스위치</strong>
				</div>
				<div class="engineer" style="display:none;"></div>
				<div class="clear24_icon" style="display: none;">!</div>
			</div>
			<div class="serverGroup sw-station" id="switchNokia" style="left:30%; display:none;" >
				<span class="stage" style="display:none;"></span>
				<div id="equip_nokia_44_N" class="serverBox">
					<div class="state normalblue"></div>
					<strong class="tit">노키아 스위치</strong>
				</div>
				<div class="engineer" style="display:none;"></div>
				<div class="clear24_icon" style="display: none;">!</div>
			</div>
		</div>
		</section>
	</div> -->

	<!-- 검색폼 -->
	<form id="searchForm" name="searchForm" method="post">
		<input type="hidden" id="equip_type" name="equip_type" />
		<input type="hidden" id="equip_name" name="equip_name" />
		<input type="hidden" id="system_id" name="system_id" />
		<input type="hidden" id="system_name" name="system_name" />
		<input type="hidden" id="category" name="category" />

		<input type="hidden" id="search_type" name="search_type" />
		<input type="hidden" id="alarm_filter" name="alarm_filter" />
		
		<input type="hidden" id="search_date_start" name="search_date_start" />
		<input type="hidden" id="search_date_start_hour" name="search_date_start_hour" />
		<input type="hidden" id="search_date_start_min" name="search_date_start_min" />
		<input type="hidden" id="search_date_end" name="search_date_end" />
		<input type="hidden" id="search_date_end_hour" name="search_date_end_hour" />
		<input type="hidden" id="search_date_end_min" name="search_date_end_min" />
	</form>
	
	<form id="defaultForm" name="defaultForm" method="post">
		<input type="hidden" id="default_start_date" name="default_start_date" />
		<input type="hidden" id="default_start_hour" name="default_start_hour" />
		<input type="hidden" id="default_start_min" name="default_start_min" />
		<input type="hidden" id="default_end_date" name="default_end_date" />
		<input type="hidden" id="default_end_hour" name="default_end_hour" />
		<input type="hidden" id="default_end_min" name="default_end_min" />
	</form>

	<div style="display:none;">
		<table id="excelTable" class="mu-grid">
			<thead>
			<tr>
				<th bgcolor="#BDBDBD" style="text-align:center">등급</th>
				<th bgcolor="#BDBDBD" style="text-align:center">알람코드</th>
				<th bgcolor="#BDBDBD" style="text-align:center">알람설명</th>
				<th bgcolor="#BDBDBD" style="text-align:center">장비타입</th>
				<th bgcolor="#BDBDBD" style="text-align:center">장비명</th>
				<th bgcolor="#BDBDBD" style="text-align:center">구분</th>  
				<th bgcolor="#BDBDBD" style="text-align:center">발생시간</th>
				<th bgcolor="#BDBDBD" style="text-align:center">발생위치</th>
				<th bgcolor="#BDBDBD" style="text-align:center">인지상태</th>
			</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>

	<div style="display:none;">
		<input type="hidden" name="criCnt" value="0" />
		<input type="hidden" name="majCnt" value="0" />
		<input type="hidden" name="minCnt" value="0" />
		<input type="hidden" name="norCnt" value="0" />
	</div>

	<iframe id="txtArea1" style="display:none"></iframe>

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
	
	 <script>
      
    </script>
</body>
</html>
