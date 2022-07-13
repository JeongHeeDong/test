<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/login/aes.js"></script>
<script src="/resources/js/login/sha256.js"></script>        
<script src="/resources/js/pss/etc/etcDetail.js"></script>
	
<div id="etcDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="etcDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 400px; height: 450px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="etcDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">장비 상세정보</span></h2>
        <button id="etcDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="etcDetailDiv">
    <!-- 기본 정보 -->
		<h3 class="mu-title">장비 등록 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>장비 ID</label></th>
	                <td>
	                   <input id='etc_Detail_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	            	<th>장비명</th>
	                <td>
	                    <input id='etc_Detail_name' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	                <th><label>장비 구분</label></th>
	                <td>
	                    <div class="mu-selectbox disabled">
	                        <button id="etc_Detail_equip_nm" class="mu-value" disabled="disabled"></button>
	                        <ul id='etc_Detail_equip_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="etc_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='etc_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installetcDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installetcDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	                
	            </tr>
	            <tr>
	            	<th><label>갱신일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="updateetcDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="updateetcDetailBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th>IP</th>
	                <td>
	                    <input id='etc_Detail_ip' type="text" class="mu-input">
	                </td>
	            </tr>
	            
        	</tbody>
        </table>
        <div id="rtf_detail" style="display: none;">
        	<br>
	        <h3 class="mu-title">전원감시장치 상세정보</h3>
			<div class="gridScrollT">
				<table class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup>
						<col width="33.33%">
						<col width="33.33%">
						<col width="33.33%">
					</colgroup>
	
					<thead>
						<tr>
							<th>장비 ID</th>
							<th>역사명</th>
							<th>장비 IP</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="mu-scroll-v" style="height: 210px; overflow-y: scroll;">
				<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
					<colgroup>
						<col width="33.33%">
						<col width="33.33%">
						<col width="33.33%">
					</colgroup>
					<tbody id="rtf_tobody">
						<tr>
							<td></td>
							<td></td>
							<td contenteditable="true"></td>
							<td hidden="true"></td>
						</tr>
					</tbody>
				</table>
			</div>
        </div>
        <input type="hidden" id = 'etc_Detail_hidden_id'>
        
<div id="etcAccessInfoTable">    
        <h3 class="mu-title">접속 정보</h3>
        <table class="mu-formbox">
            <tbody>
                <tr>
                    <td style="width:100px; text-align:center; ">
                          ID : <span id="etcAccessIdText">duAccessId</span>
                          <input type="hidden" id="etcAccessId" name="etcAccessId" value="" />
                    </td>
                    <td>
                        <input id ="etcAccessPwd" name="etcAccessPwd" type="password" title="Password" class="mu-input pw" placeholder="Password" maxlength="30" size="20" />
                    </td>
                    <td>
                        <button id="etcAccessInfoUpdate" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:accessEtcInfoUpdate()"><i class="mu-icon edit"></i>수정</button>
                    </td>
                </tr>
            </tbody>
        </table>
</div>      
   
        
    </div>
        
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="etcDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:etcDetail_update()"><i class="mu-icon edit"></i>수정</button>
    	<button id="etcDetailDelete" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:etcDetail_delete()"><i class="mu-icon del"></i>삭제</button>
	    <button id="etcDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>