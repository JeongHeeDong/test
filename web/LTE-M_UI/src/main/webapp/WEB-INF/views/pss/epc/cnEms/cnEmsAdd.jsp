<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/epc/cnEms/cnEmsAdd.js"></script>
	
<div id="cnEmsAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="cnEmsAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 450px; height: 435px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="cnEmsAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">CN-EMS 추가</span></h2>
        <button id="cnEmsAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="cnEmsAddDiv">
    <!-- 기본 정보 -->
    	<h3 class="mu-title">추가</h3>
		<table class="mu-formbox">
			<tbody>
				<tr>
					<th><label>EMS ID</label></th>
					<td>
						<div class="mu-item-group">
						   <input id='cnEms_id_add' type="text" class="mu-input">
						   <button id='cnEms_id_check' type="button" class="mu-btn" onclick="javascirpt:idCheck()">중복체크</button>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>EMS NAME</label></th>
					<td>
					   <input id='cnEms_name_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>IP Address</label></th>
					<td>
					   <input id='cnEms_ip_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>Port</label></th>
					<td>
					   <input id='cnEms_port_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>VENDOR</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="cnEms_vendor_nm_add" class="mu-value"></button>
							<ul id='cnEms_vendor_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>상용일자</label></th>
					<td>
						<div class="mu-datepicker">
							<input id="installcnEmsAddDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installcnEmsAddDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="cnEmsAddSave" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:cnEms_Add()"><i class="mu-icon save"></i>저장</button>
	    <button id="cnEmsAddCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>