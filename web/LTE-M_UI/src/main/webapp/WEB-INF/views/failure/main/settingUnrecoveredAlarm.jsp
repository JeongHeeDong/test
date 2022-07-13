<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/failure/main/settingUnrecoveredAlarm.js"></script>
</head>
<body style="min-width: inherit;min-height: inherit;">
	<div id="ajax_indicator" style="display: none">
		<i class="fa fa-spinner fa-5x fa-pulse" style="text-align: center;  left: 48%; top: 40%; position: absolute; z-index: 9999"></i>
	</div>
	<section>
		<%@ include file="/WEB-INF/views/title/title.jsp" %>
		<div class="mu-dialog-body">
			<h3 class="mu-title">등급별 설정</h3>
			<div class="gridWrap" style="height:131px;">
				<table id="tb_unRecoverSetting" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip">
					<colgroup>
						<col width="10%">
						<col width="15%">
						<col width="35%">
						<col width="40%">
					</colgroup>
					<thead>
						<tr>
							<th>No</th>
							<th>적용</th>
							<th>등급</th>
							<th>미복구 기간(분)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td align='center'>1</td>
							<td align='center'>
								<div class='mu-checkbox'>
									<input type='checkbox' id='chk_unRecover1' name="unrecoverChk"> 
									<label for='chk_unRecover1'></label>
								</div>
							</td>
							<td>
								<i class="mu-icon alram critical"></i><span>CRITICAL</span>
								<input type='hidden' name="gradeNum" value="1">
							</td>
							<td align='center'><input id="criticalTime" name="unrecoverTime" type="number" min="0" class="mu-input" value=60></td>
						</tr>
						<tr>
							<td align='center'>2</td>
							<td align='center'>
								<div class='mu-checkbox'>
									<input type='checkbox' id='chk_unRecover2' name="unrecoverChk"> 
									<label for='chk_unRecover2'></label>
								</div>
							</td>
							<td>
								<i class="mu-icon alram major"></i><span>MAJOR</span>
								<input type='hidden' name="gradeNum" value="2">
							</td>
							<td align='center'><input id="majorTime" name="unrecoverTime" type="number" min="0" class="mu-input" value=45></td>
						</tr>
						<tr>
							<td align='center'>3</td>
							<td align='center'>
								<div class='mu-checkbox'>
									<input type='checkbox' id='chk_unRecover3' name="unrecoverChk"> 
									<label for='chk_unRecover3'></label>
								</div>
							</td>
							<td>
								<i class="mu-icon alram minor"></i><span>MINOR</span>
								<input type='hidden' name="gradeNum" value="3">
							</td>
							<td align='center'><input id="minorTime" name="unrecoverTime" type="number" min="0" class="mu-input" value=30></td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- <div style="padding: 5px 0; text-align: right;">
				<button type="button" onclick="saveUnrecoverTime()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
			</div> -->
			
			<!-- 알람코드별 설정 기능 애매하여 개발 중단 -->
			<%-- <h3 class="mu-title">알람 코드별 설정</h3>
			<div class="mu-search-group mu-more-item">
				<div class="mu-search-item">
					<table>
						<colgroup>
							<col width="12%">
							<col width="33%">
							<col width="22%">
							<col width="33%">
						</colgroup>
						<tbody>
							<tr>
								<th>제조사</th>
								<td>
									<div class="mu-selectbox">
										<select id="vendor_unRecoverSetting" name="vendor_bunchCodeSetting" class="mu-value">
											<option value="" selected="selected"></option>
										</select>
									</div>
								</td>
								<th>장비타입</th>
								<td>
									<div class="mu-selectbox">
										<select id="equip_unRecoverSetting" name="equip_bunchCodeSetting" class="mu-value">
											<option value="" selected="selected"></option>
										</select>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="mu-search-btn mu-vgroup">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:btnSearchClick()"><i class="mu-icon search"></i>검색</button>
				</div>
			</div>
			
			<div id="" class="mu-search-item" style="font-weight: bold;padding: 5px 0;text-align: right;">
				<label>알람코드 검색:</label>
				<input type="text" id="alarmCode_search">
			</div>
			<!-- <div class="gridWrap" style="height:163px;">
				<table id="tb_unrecoveredSetting_alarmCode" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip">
					<thead>
						<tr> 
							<th>No</th>
							<th>적용</th>
							<th>알람코드</th>
							<th>미복구 기간(분)</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div> -->
			<div class="listBox">
				<div class="inBox fl" style="height: 250px">
					<table id="tb_unselected_alarmCode" class="mu-grid mu-grid-strip mu-grid-item mu-grid-center">
						<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
						   				<input type="checkbox" id="chk_unselectHead">
						   				<label for="chk_unselectHead"></label>
						   			</div>
								</th>
								<th>No</th>
								<th>알람코드</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
				<button class="mu-btn btnAdd" onclick="javascript:addUnrecoveredAlarmCode()" type="button"><span>&gt;</span></button>
				<div class="inBox fr" style="height: 250px">
					<table id="tb_selected_alarmCode" class="mu-grid mu-grid-strip mu-grid-item mu-grid-center">
						<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
						   				<input type="checkbox" id="chk_selectHead">
						   				<label for="chk_selectHead"></label>
						   			</div>
								</th>
								<th>알람코드</th>
								<th>미복구 기간(분)</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
				<button class="mu-btn btnDel" onclick="javascript:deleteUnrecoveredAlarmCode()" type="button"><span>&lt;</span></button>
			</div>
			<div style="padding: 5px 0; text-align: right;">
				<button id="" type="button" onclick="saveUnrecoverAlarmCode()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
			</div> --%>
		</div>
		<div class="mu-dialog-foot">
			<button id="btn_settingUnrecoveredAlarm_save" onclick="saveUnrecoverTime()" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
			<button id="btn_settingUnrecoveredAlarm_close" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray">닫기</button>
		</div>
	</section>
</body>
</html>