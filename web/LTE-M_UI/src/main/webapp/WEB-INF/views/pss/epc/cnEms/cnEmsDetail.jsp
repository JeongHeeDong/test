<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/epc/cnEms/cnEmsDetail.js"></script>
	
<div id="cnEmsDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="cnEmsDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 800px; height: 560px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="cnEmsDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">CN-EMS 상세정보</span></h2>
        <button id="cnEmsDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="cnEmsDetailDiv">
    <!-- 기본 정보 -->
        <h3 class="mu-title">CN-EMS 등록 정보</h3>
        <table class="mu-formbox">
            <tbody>
	            <tr>
	                <th><label>EMS ID</label></th>
	                <td>
	                   <input id='cnEms_Detail_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="cnEms_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='cnEms_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th>EMS NAME</th>
	                <td>
	                    <input id='cnEms_Detail_name' type="text" class="mu-input">
	                </td>
	                <th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installcnEmsDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installcnEmsDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th>IP Address</th>
	                <td>
	                    <input id='cnEms_Detail_ip' type="text" class="mu-input">
	                </td>
	                <th><label>갱신일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="updatecnEmsDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="updatecnEmsDetailBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th>Port</th>
	                <td>
	                    <input id='cnEms_Detail_port' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	            	<th>관리장비</th>
	            </tr>
        	</tbody>
        </table>
        
		<div class="gridWrap mt10" style="height: 180px; overflow-y:auto; text-align: center;">
			<table class="mu-grid mu-grid-border mu-grid-strip">
				<thead>
					<tr>
						<th>NO</th>
						<th>장비 TYPE</th>
						<th>장비 ID</th>
						<th>장비명</th>
					</tr>
				</thead>
               	<tbody id = 'cnEmsDetailGrid'>
               	</tbody>
			</table>
		</div><!-- //gridWarp -->
	</div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="cnEmsDetailModify" type="button" onclick="javascript:cnEmsDetail_update()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon edit"></i>수 정</button>
        <button id="cnEmsDetailCancle" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>취 소</button>
    </div>
</div>