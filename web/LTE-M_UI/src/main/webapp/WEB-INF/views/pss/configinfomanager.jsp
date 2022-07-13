<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="<c:url value="/resources/js/pss/configinfomanager.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>

			<!-- Data -->
			<div class="mu-grid-formbox">
				<table class="mu-grid mu-grid-border">
					<thead>
						<tr id="equipTypeTr">
							<th>장비타입</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
							<th class="js-data-cell">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr id="updateTimeTr">
							<th>수집시간</th>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
						</tr>
						<tr id="addCountTr">
							<th>추가</th>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
						</tr>
						<tr id="modCountTr">
							<th>변경</th>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
						</tr>
						<tr id="delCountTr">
							<th>삭제</th>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
							<td class="js-data-cell">&nbsp;</td>
						</tr>
					</tbody>
				</table>
				<!-- <table class="mu-grid mu-grid-strip mu-grid-border mu-grid-hover">
					<colgroup>
						<col style="width:20%" span="5">
					</colgroup>
					<thead>
						<tr>
							<th>장비타입</th>
							<th>수집시간</th>
							<th>추가</th>
							<th>변경</th>
							<th>삭제</th>
						</tr>
					</thead>
					<tbody style="text-align: center;" id="compSummaryInfo">
						<%
							for(int index = 0; index<7; index++){
						%>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<%	
							}
						%>
					</tbody>
				</table> -->
			</div>
			<!-- Tab -->
			<ul class="mu-tab line">
				<li class="active"><a id='duTab' onclick="javascript:changeTab('du','duTab')">기지국(DU)</a></li>
				<li><a id='ruTab' onclick="javascript:changeTab('ru','ruTab')">중계기(RU)</a></li>
				<li><a id='cellTab' onclick="javascript:changeTab('cell','cellTab')">CELL</a></li>
				<li><a id='channelTab' onclick="javascript:changeTab('channel','channelTab')">CHANNEL_CARD</a></li>
				<li><a id='mmeTab' onclick="javascript:changeTab('mme','mmeTab')">MME</a></li>
				<li><a id='mmeNodeTab' onclick="javascript:changeTab('mme_node','mme_nodeTab')">MME NODE</a></li>
				<li><a id='mmeNtpTab' onclick="javascript:changeTab('mme_ntp','mme_ntpTab')">MME NTP</a></li>
				<li><a id='mmePortTab' onclick="javascript:changeTab('mme_port','mme_portTab')">MME PORT</a></li>
				<!-- <li><a id='mme_svcTab' onclick="javascript:changeTab('mme_svc','mme_svcTab')">MME SVC MYIP</a></li> -->
				<li><a id='gwTab' onclick="javascript:changeTab('gw','gwTab')">GW</a></li>
				<li><a id='gwNodeTab' onclick="javascript:changeTab('gw_node','gw_nodeTab')">GW NODE</a></li>
				<li><a id='gwNtpTab' onclick="javascript:changeTab('gw_ntp','gw_ntpTab')">GW NTP</a></li>
				<li><a id='gwPortTab' onclick="javascript:changeTab('gw_port','gw_portTab')">GW PORT</a></li>
				<li><a id='pcrfTab' onclick="javascript:changeTab('pcrf','pcrfTab')">PCRF</a></li>
				<li><a id='pcrfNodeTab' onclick="javascript:changeTab('pcrf_node','pcrf_nodeTab')">PCRF NODE</a></li>
				<li><a id='pcrfNtpTab' onclick="javascript:changeTab('pcrf_ntp','pcrf_ntpTab')">PCRF NTP</a></li>
				<li><a id='pcrfPortTab' onclick="javascript:changeTab('pcrf_port','pcrf_portTab')">PCRF PORT</a></li>
				<!-- <li><a id='gw_svcTab' onclick="javascript:changeTab('gw_svc','gw_svcTab')">GW SVC MYIP</a></li> -->
				<!-- <li><a id='gw_gtpTab' onclick="javascript:changeTab('gw_gtp','gw_gtpTab')">GW GTP INTF</a></li> -->
				<!-- <li><a id='emsTab' onclick="javascript:changeTab('ems','emsTab')">관리장치(EMS)</a></li> -->
			</ul>
			<div class="mu-tab-body line">
				<!-- Tab Cont 기지국 -->
				<div class="mu-tabCont show" id="tabCont">
					<!-- Sub Title -->
					<div class="subtitleWrap" id="subtitleWrapAdd" style="margin:10px 0 5px;">
						<h4 class="mu-title">추가</h4>
						<div class="hdRight">
							<button type="button" class="mu-btn mu-btn-icon" id="addBtn" onclick="javascript:addcheckFunction('du',$('#addBodyTbl'))"><i class="mu-icon add"></i>선택추가</button>
						</div>
					</div>
					<!-- Grid -->
					<div class="gridScrollT" id="gridScrollTAdd" >
						<table class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;" id="addHeaderTbl">
							<colgroup>
								<col style="width:7.14%" span="14">
							</colgroup>
							<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
										<input id="ch01" type="checkbox">
										<label for="ch01"></label>
									</div>
								</th>
								<th>RU_NAME</th>
								<th>OPR_STATUS</th>
								<th>SECTOR</th>
								<th>PORT_ID</th>
								<th>SEQUENCE_ID</th>
								<th>LATITUDE</th>
								<th>LONGITUDE</th>
								<th>FREQUENCY</th>
								<th>CONNECT_RUTYPE</th>
								<th>PLD_RU_NAME</th>
								<th>BOARD_TYPE</th>
								<th>DU_ID</th>
								<th>CELL_NUM</th>
							</tr>
							</thead>
						</table>
					</div>
					<div class="mu-scroll-v scrollY" id="scrollAdd" style="height:99px;">
						<table class="mu-grid mu-grid-border2 mu-grid-strip" style="table-layout:fixed;text-align: center;" id="addBodyTbl">
							<colgroup>
								<col style="width:7.14%" span="14">
							</colgroup>
							<tbody>

							</tbody>
						</table>
					</div>
					<!-- Sub Title -->
					<div class="subtitleWrap" id="subtitleWrapMod" style="margin:10px 0 5px;">
						<h4 class="mu-title">변경</h4>
						<div class="hdRight">
							<button type="button" class="mu-btn mu-btn-icon" id="modBtn" onclick="javascript:modcheckFunction('du',$('#modBodyTbl'))"><i class="mu-icon edit"></i>선택변경</button>
						</div>
					</div>
					<!-- Grid -->
					<div class="gridScrollT" id="gridScrollTMod">
						<table class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;" id="modHeaderTbl">
							<colgroup>
								<col style="width:7.14%" span="14">
							</colgroup>
							<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
										<input id="ch01" type="checkbox">
										<label for="ch01"></label>
									</div>
								</th>
								<th>RU_NAME</th>
								<th>OPR_STATUS</th>
								<th>SECTOR</th>
								<th>PORT_ID</th>
								<th>SEQUENCE_ID</th>
								<th>LATITUDE</th>
								<th>LONGITUDE</th>
								<th>FREQUENCY</th>
								<th>CONNECT_RUTYPE</th>
								<th>PLD_RU_NAME</th>
								<th>BOARD_TYPE</th>
								<th>DU_ID</th>
								<th>CELL_NUM</th>
							</tr>
							</thead>
						</table>
					</div>
					<div class="mu-scroll-v scrollY" id="scrollMod" style="height:132px;">
						<table class="mu-grid mu-grid-border2 mu-grid-strip" style="table-layout:fixed;text-align: center;" id="modBodyTbl">
							<colgroup>
								<col style="width:5%" span="20">
							</colgroup>
							<tbody>

							</tbody>
						</table>
					</div>				
					<!-- Sub Title -->
					<div class="subtitleWrap" id="subtitleWrapDel" style="margin:10px 0 5px;">
						<h4 class="mu-title">삭제</h4>
						<div class="hdRight">
							<button type="button" class="mu-btn mu-btn-icon" id="delBtn" onclick="javascript:delcheckFunction('du',$('#delBodyTbl'))"><i class="mu-icon trash"></i>선택삭제</button>
						</div>
					</div>
					<!-- Grid -->
					<div class="gridScrollT" id="gridScrollTDel" >
						<table class="mu-grid mu-grid-border mu-grid-strip" style="table-layout:fixed;" id="delHeaderTbl">
							<colgroup>
								<col style="width:7.14%" span="14">
							</colgroup>
							<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
										<input id="ch01" type="checkbox">
										<label for="ch01"></label>
									</div>
								</th>
								<th>RU_NAME</th>
								<th>OPR_STATUS</th>
								<th>SECTOR</th>
								<th>PORT_ID</th>
								<th>SEQUENCE_ID</th>
								<th>LATITUDE</th>
								<th>LONGITUDE</th>
								<th>FREQUENCY</th>
								<th>CONNECT_RUTYPE</th>
								<th>PLD_RU_NAME</th>
								<th>BOARD_TYPE</th>
								<th>DU_ID</th>
								<th>CELL_NUM</th>
							</tr>
							</thead>
						</table>
					</div>
					<div class="mu-scroll-v scrollY" id="scrollDel" style="height:99px;">
						<table class="mu-grid mu-grid-border2 mu-grid-strip" style="table-layout:fixed;text-align: center;" id="delBodyTbl">
							<colgroup>
								<col style="width:5%" span="20">
							</colgroup>
							<tbody>

							</tbody>
						</table>
					</div>
				</div>
			</div>
		
		</section>
	</div>
</body>
</html>