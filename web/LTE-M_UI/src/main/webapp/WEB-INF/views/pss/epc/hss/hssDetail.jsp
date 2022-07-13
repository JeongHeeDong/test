<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/epc/hss/hssDetail.js"></script>
	
<div id="hssDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="hssDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 400px; height: 420px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="hssDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">HSS 상세정보</span></h2>
        <button id="hssDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="hssDetailDiv">
    <!-- 기본 정보 -->
		<h3 class="mu-title">HSS 등록 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>HSS ID</label></th>
	                <td>
	                   <input id='hss_Detail_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>NAME</th>
	                <td>
	                    <input id='hss_Detail_name' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	                <th><label>EMS_NAME</label></th>
	                <td>
	                    <div class="mu-selectbox" >
	                        <button id="hss_Detail_ems_nm" class="mu-value" disabled="disabled" style="background:#c3c3c3; line-border-color:#bfbfbf; color:#e3e2e2"></button>
	                        <ul id='hss_Detail_ems_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="hss_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='hss_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installhssDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installhssDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	                
	            </tr>
	            <tr>
	            	<th><label>갱신일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="updatehssDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="updatehssDetailBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th>IP</th>
	                <td>
	                    <input id='hss_Detail_ip' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            
        	</tbody>
        </table>
        <input type="hidden" id = 'hss_Detail_hidden_id'>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="hssDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:hssDetail_update()"><i class="mu-icon edit"></i>수정</button>
	    <button id="hssDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>