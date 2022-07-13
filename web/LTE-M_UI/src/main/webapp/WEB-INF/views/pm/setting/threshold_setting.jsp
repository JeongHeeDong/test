<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/import/import_page.jsp"%>
<script src="/resources/js/pm/setting/threshold_setting.js"></script>
<!-- <script src="/resources/js/pm/setting/threshold_mod.js"></script> -->
</head>
<body style="min-width: 1000px; min-height: 500px">
	<section>
		<%@ include file="/WEB-INF/views/title/title.jsp"%>

		<div class="mu-dialog-body">
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div class="mu-radio">
							<input type="radio" name="search_radio" id="search_access"
								value=0 checked="checked"> <label for="search_access">Access</label>
						</div>
						<div class="mu-radio">
							<input type="radio" name="search_radio" id="search_epc" value=1>
							<label for="search_epc">EPC</label>
						</div>
						<!-- <div class="mu-radio">
							<input type="radio" name="search_radio" id="search_rec" value=3>
							<label for="search_rec">녹취저장</label>
						</div> -->
					</div>
					<div class="mu-item-group">
						<div id="equipDiv" class="mu-selectbox disabled"
							style="display: none;">
							<label>대상장비</label> <select id="equipSelect" class="mu-value"
								disabled="disabled">
								<option value=1>MME</option>
								<option value=2>PGW</option>
								<option value=3>SGW</option>
								<option value=4>HSS</option>
								<option value=5>PCRF</option>
							</select>
						</div>
						<div id="kpiDiv" class="mu-selectbox" style="display: none;"">
							<label>지표</label> <select id="kpiSelect" class="mu-value">
								<option value=1>Traffic</option>
								<option value=2>Data Throughput</option>
								<option value=3>Hand Over</option>
							</select>
						</div>
						<div id="typeDiv" class="mu-selectbox disabled"
							style="display: none;">
							<label>타입</label> <select id="typeSelect" class="mu-value"
								disabled="disabled">
								<option value=1>Intra ENB Handover</option>
								<option value=2>X2 In Handover</option>
								<option value=3>X2 Out Handover</option>
							</select>
						</div>
						<div id='mobileTypeDiv' class="mu-selectbox disabled"
							style="display: none;">
							<label id="mobileTypeLabel">단말종류</label> <select
								id="mobileTypeSelect" class="mu-value" disabled="disabled">
								<option value="99">전체</option>
								<option value="2">휴대용단말</option>
								<option value="1">차상단말</option>
								<option value="3">모터카</option>
								<option value="4">관제</option>
							</select>
						</div>
						<div id="storageTypeDiv" class="mu-selectbox disabled"
							style="display: none;">
							<label for="storageTypeSelect">지표</label>
							<select id="storageTypeSelect" class="mu-value" disabled="disabled">
								<option value="1">CALL</option>
								<option value="2">PTT</option>
							</select>
						</div>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon" onclick="pageSearch()">
						<i class="mu-icon search"></i>조회
					</button>
				</div>
			</div>
			<div class="gridWrap mt10" style="display: none">
				<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
					<thead id="threshold_head">
					</thead>
					<tbody id="threshold_body" style="text-align: center;">
					</tbody>
				</table>
			</div>
			<div class="gridWrap mt10 mu-dialog-body threshold" id="div_mody_area" style="display: none">
				<table class="mu-formbox">
					<colgroup>
						<col width="285px">
						<col width="">
						<col width="285px">
						<col width="">
						<col width="285px">
						<col width="">
					</colgroup>
					<tbody>
						<tr id='ATTEMPT_TR'>
							<th class="attempt" id = 'ATTEMPT_text' ><i class="mu-icon mu-circle"></i></th>
							<td><input type="text" id = 'ATTEMPT_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th></th>
							<td></td>
							<th></th>
							<td></td>
						</tr>
						<tr id = 'ATTEMPT_VOL'>
							<th class="attempt"><i class="mu-icon mu-circle"></i><span id='UP_ATTEMPT_text'>Up Volume</span></th>
							<td><input type="text" id = 'UP_ATTEMPT_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="attempt"><i class="mu-icon mu-circle"></i><span id='DW_ATTEMPT_text'>Down Volume</span></th>
							<td><input type="text" id = 'DW_ATTEMPT_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th></th>
							<td></td>
						</tr>
						<tr id = 'UP_VOL_RATE_INCR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_MIN_INCR_text'>Up Volume 증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'UP_VOL_RATE_MIN_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_MAJ_INCR_text'>Up Volume 증가율 Major(이상)</span></th>
							<td><input type="text" id = 'UP_VOL_RATE_MAJ_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_CRI_INCR_text'>Up Volume 증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'UP_VOL_RATE_CRI_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'DW_VOL_RATE_INCR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_MIN_INCR_text'>Down Volume 증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'DW_VOL_RATE_MIN_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_MAJ_INCR_text'>Down Volume 증가율 Major(이상)</span></th>
							<td><input type="text" id = 'DW_VOL_RATE_MAJ_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_CRI_INCR_text'>Down Volume 증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'DW_VOL_RATE_CRI_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'UP_DTP_RATE_INCR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_MIN_INCR_text'>Up Throughput 증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'UP_DTP_RATE_MIN_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_MAJ_INCR_text'>Up Throughput 증가율 Major(이상)</span></th>
							<td><input type="text" id = 'UP_DTP_RATE_MAJ_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_CRI_INCR_text'>Up Throughput 증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'UP_DTP_RATE_CRI_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'DW_DTP_RATE_INCR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_MIN_INCR_text'>Down Throughput 증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'DW_DTP_RATE_MIN_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_MAJ_INCR_text'>Down Throughput 증가율 Major(이상)</span></th>
							<td><input type="text" id = 'DW_DTP_RATE_MAJ_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_CRI_INCR_text'>Down Throughput 증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'DW_DTP_RATE_CRI_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'UP_VOL_RATE_DECR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_MIN_DECR_text'>Up Volume 감소율 Minor(이하)</span></th>
							<td><input type="text" id = 'UP_VOL_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_MAJ_DECR_text'>Up Volume 감소율 Major(이하)</span></th>
							<td><input type="text" id = 'UP_VOL_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_CRI_DECR_text'>Up Volume 감소율 Critical(이하)</span></th>
							<td><input type="text" id = 'UP_VOL_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
						</tr>
						<tr id = 'DW_VOL_RATE_DECR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_MIN_DECR_text'>Down Volume 감소율 Minor(이하)</span></th>
							<td><input type="text" id = 'DW_VOL_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_MAJ_DECR_text'>Down Volume 감소율 Major(이하)</span></th>
							<td><input type="text" id = 'DW_VOL_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_CRI_DECR_text'>Down Volume 감소율 Critical(이하)</span></th>
							<td><input type="text" id = 'DW_VOL_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
						</tr>
						<tr id = 'UP_DTP_RATE_DECR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_MIN_DECR_text'>Up Throughput 감소율 Minor(이하)</span></th>
							<td><input type="text" id = 'UP_DTP_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_MAJ_DECR_text'>Up Throughput 감소율 Major(이하)</span></th>
							<td><input type="text" id = 'UP_DTP_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_CRI_DECR_text'>Up Throughput 감소율 Critical(이하)</span></th>
							<td><input type="text" id = 'UP_DTP_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
						</tr>
						<tr id = 'DW_DTP_RATE_DECR'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_MIN_DECR_text'>Down Throughput 감소율 Minor(이하)</span></th>
							<td><input type="text" id = 'DW_DTP_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_MAJ_DECR_text'>Down Throughput 감소율 Major(이하)</span></th>
							<td><input type="text" id = 'DW_DTP_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_CRI_DECR_text'>Down Throughput 감소율 Critical(이하)</span></th>
							<td><input type="text" id = 'DW_DTP_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
						</tr>
						<tr id = 'UP_DTP' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='UP_DTP_MIN_text'>UP Throughput Minor(이하)</span></th>
							<td><input type="text" id = 'UP_DTP_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_DTP_MAJ_text'>UP Throughput Major(이하)</span></th>
							<td><input type="text" id = 'UP_DTP_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_DTP_CRI_text'>UP Throughput Critical(이하)</span></th>
							<td><input type="text" id = 'UP_DTP_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'DW_DTP' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_DTP_MIN_text'>DOWN Throughput Minor(이하)</span></th>
							<td><input type="text" id = 'DW_DTP_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_DTP_MAJ_text'>DOWN Throughput Major(이하)</span></th>
							<td><input type="text" id = 'DW_DTP_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_DTP_CRI_text'>DOWN Throughput Critical(이하)</span></th>
							<td><input type="text" id = 'DW_DTP_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						
						<tr id = 'ATT_RATE'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MIN_text'>시도호증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'ATT_RATE_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MAJ_text'>시도호증가율 Major(이상)</span></th>
							<td><input type="text" id = 'ATT_RATE_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_CRI_text'>시도호증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'ATT_RATE_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'ATT_RATE_INCR' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MIN_INCR_text'>RRC 시도호증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'ATT_RATE_MIN_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MAJ_INCR_text'>RRC 시도호증가율 Major(이상)</span></th>
							<td><input type="text" id = 'ATT_RATE_MAJ_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_CRI_INCR_text'>RRC 시도호증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'ATT_RATE_CRI_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'ATT_RATE_DECR' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MIN_DECR_text'>RRC 시도호감소율 Minor(이하)</span></th>
							<td><input type="text" id = 'ATT_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MAJ_DECR_text'>RRC 시도호감소율 Major(이하)</span></th>
							<td><input type="text" id = 'ATT_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_CRI_DECR_text'>RRC 시도호감소율 Critical(이하)</span></th>
							<td><input type="text" id = 'ATT_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
						</tr>
						<tr id = 'ERAB_ATT_RATE_INCR' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_MIN_INCR_text'>ERAB Setup 시도호증가율 Minor(이상)</span></th>
							<td><input type="text" id = 'ERAB_ATT_RATE_MIN_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_MAJ_INCR_text'>ERAB Setup 시도호증가율 Major(이상)</span></th>
							<td><input type="text" id = 'ERAB_ATT_RATE_MAJ_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_CRI_INCR_text'>ERAB Setup 시도호증가율 Critical(이상)</span></th>
							<td><input type="text" id = 'ERAB_ATT_RATE_CRI_INCR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'ERAB_ATT_RATE_DECR' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_MIN_DECR_text'>ERAB Setup 시도호감소율 Minor(이하)</span></th>
							<td><input type="text" id = 'ERAB_ATT_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_MAJ_DECR_text'>ERAB Setup 시도호감소율 Major(이하)</span></th>
							<td><input type="text" id = 'ERAB_ATT_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_DECR_CRI_text'>ERAB Setup 시도호감소율 Critical(이하)</span></th>
							<td><input type="text" id = 'ERAB_ATT_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'negativeNumbers')"/></td>
						</tr>
						<tr id = 'SEIZER_RATE'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='SEIZER_RATE_MIN_text'>소통율 Minor(이하)</span></th>
							<td><input type="text" id = 'SEIZER_RATE_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='SEIZER_RATE_MAJ_text'>소통율 Major(이하)</span></th>
							<td><input type="text" id = 'SEIZER_RATE_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='SEIZER_RATE_CRI_text'>소통율 Critical(이하)</span></th>
							<td><input type="text" id = 'SEIZER_RATE_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'SUCC_RATE' style="display: none;">
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='SUCC_RATE_MIN_text'>Minor</span></th>
							<td><input type="text" id = 'SUCC_RATE_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='SUCC_RATE_MAJ_text'>Major</span></th>
							<td><input type="text" id = 'SUCC_RATE_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='SUCC_RATE_CRI_text'>Critical</span></th>
							<td><input type="text" id = 'SUCC_RATE_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'ANS_RATE'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='ANS_RATE_MIN_text'>완료율 Minor(이하)</span></th>
							<td><input type="text" id = 'ANS_RATE_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='ANS_RATE_MAJ_text'>완료율 Major(이하)</span></th>
							<td><input type="text" id = 'ANS_RATE_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='ANS_RATE_CRI_text'>완료율 Critical(이하)</span></th>
							<td><input type="text" id = 'ANS_RATE_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						<tr id = 'CD_RATE'>
							<th class="minor"><i class="mu-icon mu-circle"></i><span id='CD_RATE_MIN_text'>절단율 Minor(이상)</span></th>
							<td><input type="text" id = 'CD_RATE_MIN_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="major"><i class="mu-icon mu-circle"></i><span id='CD_RATE_MAJ_text'>절단율 Major(이상)</span></th>
							<td><input type="text" id = 'CD_RATE_MAJ_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
							<th class="critical"><i class="mu-icon mu-circle"></i><span id='CD_RATE_CRI_text'>절단율 Critical(이상)</span></th>
							<td><input type="text" id = 'CD_RATE_CRI_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
						</tr>
						
					</tbody>
				</table>
			</div>
			<%-- <%@ include file="/WEB-INF/views/pm/setting/threshold_mod.jsp" %> --%>
			<div id="ajax_indicator" style="display: none">
				<i class="fa fa-spinner fa-5x fa-pulse"
					style="text-align: center; left: 48%; top: 40%; position: absolute; z-index: 9999"></i>
			</div>
		</div>
		<div class="mu-dialog-foot">
			<button id="btn_thresholdModModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon blue" 
				onclick="thresholdMod(true)" style="display: none">
				<i class="mu-icon save"></i>수정
			</button>
			<button id="btn_threshold_close" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray">
				<i class="mu-icon cancel"></i>닫기
			</button>
		</div>
	</section>
</body>
</html>