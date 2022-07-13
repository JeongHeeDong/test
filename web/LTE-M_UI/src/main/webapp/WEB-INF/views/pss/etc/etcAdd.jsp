<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/etc/etcAdd.js"></script>
	
<div id="etcAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="etcAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 450px; height: 420px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="etcAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">장비 추가</span></h2>
        <button id="etcAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="etcAddDiv">
    <!-- 기본 정보 -->
    	<h3 class="mu-title">추가</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th><label>장비 구분</label></th>
					<td>
						<div class="mu-selectbox">
							<select id="selectedEquip" class="mu-value"></select>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>장비명</label></th>
					<td>
					   <input id='etc_name_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>장비 ID</label></th>
					<td>
						<div class="mu-item-group">
						   <input id='etc_id_add' type="text" class="mu-input">
						   <button id='etc_id_check' type="button" class="mu-btn" onclick="javascirpt:idCheck()">중복체크</button>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>IP</label></th>
					<td>
					   <input id='etc_add_ip' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>VENDOR</label></th>
					<td>
						<div class="mu-selectbox">
							<select id="selectedVendor" class="mu-value"></select>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>상용일자</label></th>
					<td>
						<div class="mu-datepicker">
							<input id="installetcAddDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installetcAddDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<br>
		<div id="rtf_add" style="display: none;">
			<div>
				<h3 class="mu-title" style="position:relative;">
					전원감시장치 상세정보 추가
					<button type="button" style="position:absolute; top:-5px; right:0" class="mu-btn mu-btn-icon" onclick="javascript:rowAdd()"> <i class="mu-icon add"></i>추가</button>
				</h3>
			</div>
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup>
						<col width="22%">
						<col width="28%">
						<col width="30%">
						<col width="20%">
					</colgroup>
	
					<thead>
						<tr>
							<th>장비 ID</th>
							<th>역사명</th>
							<th>장비 IP</th>
							<th>삭제</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height: 210px; overflow-y: scroll;">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
					<colgroup>
						<col width="22%">
						<col width="28%">
						<col width="30%">
						<col width="20%">
					</colgroup>
					<tbody id="rtf_add_tobody">
						<tr>
							<td></td>
							<td contenteditable="true"></td>
							<td contenteditable="true"></td>
							<td align="center"><button type="button" class="mu-btn mu-btn-icon" onclick="javascript:rowDel(this)"><i class="mu-icon del"></i>삭제</button></td>
						</tr>
					</tbody>
				</table>
			</div>
        </div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="etcAddSave" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:etc_Add()"><i class="mu-icon save"></i>저장</button>
	    <button id="etcAddCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>