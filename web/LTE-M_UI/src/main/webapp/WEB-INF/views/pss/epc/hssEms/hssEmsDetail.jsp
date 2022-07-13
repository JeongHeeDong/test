<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/epc/hssEms/hssEmsDetail.js"></script>
	
<div id="hssEmsDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="hssEmsDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 450px; height: 490px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="hssEmsDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">HSS-EMS 상세정보</span></h2>
        <button id="hssEmsDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="hssEmsDetailDiv">
    <!-- 기본 정보 -->
		<h3 class="mu-title">HSS-EMS 등록 정보</h3>
        <table class="mu-formbox">
            <tbody>
	            <tr>
	                <th><label>EMS ID</label></th>
	                <td>
	                   <input id='hssEms_Detail_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>EMS NAME</th>
	                <td>
	                    <input id='hssEms_Detail_name' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>IP Address</th>
	                <td>
	                    <input id='hssEms_Detail_ip' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>Port</th>
	                <td>
	                    <input id='hssEms_Detail_port' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="hssEms_Detail_vendor_nm" class="mu-value" ></button>
	                        <ul id='hssEms_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installhssEmsDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installhssEmsDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>갱신일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="updatehssEmsDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="updatehssEmsDetailBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
        	</tbody>
        </table>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="hssEmsDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:hssEmsDetail_update()"><i class="mu-icon edit"></i>수정</button>
	    <button id="hssEmsDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>