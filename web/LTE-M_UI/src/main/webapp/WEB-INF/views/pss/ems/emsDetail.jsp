<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/ems/emsDetail.js"></script>
	
<div id="emsDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="emsDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 450px; height: 400px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="emsDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">EMS 상세정보</span></h2>
        <button id="emsDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="emsDetailDiv">
    <!-- 기본 정보 -->
    	<h3 class="mu-title">EMS 등록 정보</h3>
        <table class="mu-formbox">
            <tbody>
	            <tr>
	                <th><label>EMS ID</label></th>
	                <td>
	                   <input id='ems_Detail_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>EMS NAME</th>
	                <td>
	                    <input id='ems_Detail_name' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>IP</th>
	                <td>
	                    <input id='ems_Detail_ip' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>Port</th>
	                <td>
	                    <input id='ems_Detail_port' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="ems_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='ems_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installemsDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installemsDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>갱신일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="updateemsDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="updateemsDetailBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
        	</tbody>
        </table>
    </div>
    <input id="emsEquipType" type="hidden"/>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="emsDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:emsDetail_update()"><i class="mu-icon edit"></i>수정</button>
	    <button id="emsDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>