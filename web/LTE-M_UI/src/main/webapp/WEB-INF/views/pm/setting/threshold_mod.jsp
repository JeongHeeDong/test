<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
	
<script src="/resources/js/pm/setting/threshold_mod.js"></script>

<style type="text/css">
	.mu-formbox .minor{width:210px;}
	.mu-formbox .major{width:210px;}
	.mu-formbox .critical{width:210px;}
	.mu-formbox .attempt{width:210px;}
</style>

<div id="thresholdModBg" class="mu-dialog-background" style="display:none;z-index: 10"></div>
<div id="thresholdModUp" class="mu-dialog mu-fix-foot" style="display:none;width: 1200px; height: 600px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
	<div id="thresholdModTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
		<h2><span id='pop_title' class="title">임계치 추가</span></h2>
		<button id="thresholdModClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
	</div>
	<div class="mu-dialog-body threshold">
		<div class="mu-search-group"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
			<div class="mu-search-item">
				<div class="mu-item-group">
					<div class="mu-radio">
						<input type="radio" name="mod_search_radio" id="mod_search_access" value= 0 checked="checked">
						<label for="mod_search_access">Access</label>
					</div>
					<div class="mu-radio">
						<input type="radio" name="mod_search_radio" id="mod_search_epc" value= 1>
						<label for="mod_search_epc">EPC</label>
					</div>
					<!-- <div class="mu-radio">
						<input type="radio" name="mod_search_radio" id="mod_search_phone" value= 2>
						<label for="mod_search_phone">단말품질</label>
					</div> -->
					<div class="mu-radio">
						<input type="radio" name="mod_search_radio" id="mod_search_rec" value= 3>
						<label for="mod_search_rec">녹취저장</label>
					</div> 
				</div>
				<div class="mu-item-group">
					<div id = "mod_equipDiv" class="mu-selectbox disabled" style="display: none;">
						<label>대상장비</label>
						<select id="mod_equipSelect" class="mu-value" disabled="disabled">
							<option value=1>MME</option>
							<option value=2>PGW</option>
							<option value=3>SGW</option>
							<option value=4>HSS</option>
							<option value=5>PCRF</option>
						</select>
					</div>
					<div id = "mod_kpiDiv" class="mu-selectbox">
						<label>지표</label>
						<select id="mod_kpiSelect" class="mu-value">
							<option value=1>Traffic</option>
							<option value=2>Data Throughput</option>
							<option value=3>Hand Over</option>
						</select>
					</div>
					<div id = "mod_typeDiv" class="mu-selectbox disabled" style="display: none;">
						<label>타입</label>
						<select id="mod_typeSelect" class="mu-value" disabled="disabled">
							<option value=1>Intra ENB Handover</option>
							<option value=2>X2 In Handover</option>
							<option value=3>X2 Out Handover</option>
						</select>
					</div>
					<div id='mod_mobileTypeDiv' class="mu-selectbox disabled" style="display: none;">
						<label id="mod_mobileTypeLabel">단말종류</label>
						<select id="mod_mobileTypeSelect" class="mu-value" disabled="disabled">
							<option value="2">휴대용단말</option>
							<option value="1">차상단말</option>
							<option value="3">모터카</option>
							<option value="4">관제</option>
						</select>
					</div>
					<div id="mod_storageTypeDiv" class="mu-selectbox disabled" style="display: none;">
						<label for="mod_storageTypeSelect">지표</label>
						<select id="mod_storageTypeSelect" class="mu-value" disabled="disabled">
							<option value="1">CALL</option>
							<option value="2">PTT</option>
						</select>
					</div>
				</div>
			</div>
		</div>
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
					<td><input type="text" id = 'UP_VOL_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_MAJ_DECR_text'>Up Volume 감소율 Major(이하)</span></th>
					<td><input type="text" id = 'UP_VOL_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_VOL_RATE_CRI_DECR_text'>Up Volume 감소율 Critical(이하)</span></th>
					<td><input type="text" id = 'UP_VOL_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
				</tr>
				<tr id = 'DW_VOL_RATE_DECR'>
					<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_MIN_DECR_text'>Down Volume 감소율 Minor(이하)</span></th>
					<td><input type="text" id = 'DW_VOL_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_MAJ_DECR_text'>Down Volume 감소율 Major(이하)</span></th>
					<td><input type="text" id = 'DW_VOL_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_VOL_RATE_CRI_DECR_text'>Down Volume 감소율 Critical(이하)</span></th>
					<td><input type="text" id = 'DW_VOL_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
				</tr>
				<tr id = 'UP_DTP_RATE_DECR'>
					<th class="minor"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_MIN_DECR_text'>Up Throughput 감소율 Minor(이하)</span></th>
					<td><input type="text" id = 'UP_DTP_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_MAJ_DECR_text'>Up Throughput 감소율 Major(이하)</span></th>
					<td><input type="text" id = 'UP_DTP_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='UP_DTP_RATE_CRI_DECR_text'>Up Throughput 감소율 Critical(이하)</span></th>
					<td><input type="text" id = 'UP_DTP_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
				</tr>
				<tr id = 'DW_DTP_RATE_DECR'>
					<th class="minor"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_MIN_DECR_text'>Down Throughput 감소율 Minor(이하)</span></th>
					<td><input type="text" id = 'DW_DTP_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_MAJ_DECR_text'>Down Throughput 감소율 Major(이하)</span></th>
					<td><input type="text" id = 'DW_DTP_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='DW_DTP_RATE_CRI_DECR_text'>Down Throughput 감소율 Critical(이하)</span></th>
					<td><input type="text" id = 'DW_DTP_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
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
					<td><input type="text" id = 'ATT_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_MAJ_DECR_text'>RRC 시도호감소율 Major(이하)</span></th>
					<td><input type="text" id = 'ATT_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='ATT_RATE_CRI_DECR_text'>RRC 시도호감소율 Critical(이하)</span></th>
					<td><input type="text" id = 'ATT_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
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
					<td><input type="text" id = 'ERAB_ATT_RATE_MIN_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_MAJ_DECR_text'>ERAB Setup 시도호감소율 Major(이하)</span></th>
					<td><input type="text" id = 'ERAB_ATT_RATE_MAJ_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='ERAB_ATT_RATE_DECR_CRI_text'>ERAB Setup 시도호감소율 Critical(이하)</span></th>
					<td><input type="text" id = 'ERAB_ATT_RATE_CRI_DECR_input' value = '' class="mu-input" style="width: 60px" onkeypress="return fn_press(event,'numbers')"/></td>
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
	<div class="mu-dialog-foot" style="text-align: center;">
		<button id="thresholdModModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:thresholdCheck()"><i id="mod_btn" class="mu-icon save"></i><span>저장</span></button>
		<button id="thresholdModCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	</div>
</div>
