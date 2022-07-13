<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/epc/epcAdd.js"></script>
	
<div id="epcAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="epcAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 450px; height: 435px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="epcAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">장비 추가</span></h2>
        <button id="epcAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="epcAddDiv">
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
							<button id="epc_type_nm_add" class="mu-value"></button>
							<ul id='epc_type_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>장비 ID</label></th>
					<td>
						<div class="mu-item-group">
						   <input id='epc_id_add' type="text" class="mu-input">
						   <button id='epc_id_check' type="button" class="mu-btn" onclick="javascirpt:idCheck()">중복체크</button>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>장비명</label></th>
					<td>
					   <input id='epc_name_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>EMS_NAME</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="epc_ems_nm_add" class="mu-value"></button>
							<ul id='epc_ems_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>VENDOR</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="epc_vendor_nm_add" class="mu-value"></button>
							<ul id='epc_vendor_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
                <tr>
                    <th><label>IP</label></th>
                    <td>
                        <input id='epc_ip_add' type="text" class="mu-input">
                    </td>
                </tr>				
				<tr>
					<th><label>상용일자</label></th>
					<td>
						<div class="mu-datepicker">
							<input id="installepcAddDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installepcAddDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="epcAddSave" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:epc_Add()"><i class="mu-icon save"></i>저장</button>
	    <button id="epcAddCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>