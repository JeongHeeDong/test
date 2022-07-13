<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/login/aes.js"></script>
<script src="/resources/js/login/sha256.js"></script>       
<script src="/resources/js/pss/epc/pgw/pgwDetail.js"></script>
	
<div id="pgwDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="pgwDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 750px; height: 651px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="pgwDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 --> 
        <h2><span class="title">GW 상세정보</span></h2>  
        <button id="pgwDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="pgwDetailDiv">
    <!-- 기본 정보 -->
        <h3 class="mu-title">GW 등록 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>GW ID</label></th>
	                <td>
	                   <input id='pgw_Detail_id' type="text" class="mu-input"  disabled="disabled">
	                </td>
	                <th>NAME</th>
	                <td>
	                    <input id='pgw_Detail_name' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	                <th style="display:none"><label>EMS_NAME</label></th>
	                <td style="display:none">
	                    <div class="mu-selectbox">
	                        <button id="pgw_Detail_ems_nm" class="mu-value" ></button>
	                        <ul id='pgw_Detail_ems_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="pgw_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='pgw_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installpgwDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installpgwDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	                <th><label>갱신일자</label></th>
	                <td>
						<input id="updatepgwDetailDateTxt" type="text" value="" disabled="disabled"/>
	                </td>
	            </tr>
	            <tr>
	            	<th><label>IP</label></th>
	                <td>
						<input id='pgw_Detail_ip' type="text" class="mu-input" >
	                </td>
	                <th>STATUS</th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="pgw_Detail_status_nm" class="mu-value" ></button>
	                        <ul id='pgw_Detail_status' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
        	</tbody>
        </table>
    
<div id="pgwAccessInfoTable">    
        <h3 class="mu-title">접속 정보</h3>
        <table class="mu-formbox">
            <tbody>
                <tr>
                    <td style="width:200px; text-align:center; ">
                          ID : <span id="pgwAccessIdText">duAccessId</span>
                          <input type="hidden" id="pgwAccessId" name="pgwAccessId" value="" />
                    </td>
                    <td>
                        <input id ="pgwAccessPwd" name="pgwAccessPwd" type="password" title="Password" class="mu-input pw" placeholder="Password" maxlength="30" size="20" />
                    </td>
                    <td>
                        <button id="pgwAccessInfoUpdate" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:accessPgwInfoUpdate('4')"><i class="mu-icon edit"></i>수정</button>
                    </td>
                </tr>
            </tbody>
        </table>
</div>        
                   
        <!-- <h3 class="mu-title">GW 노드 정보(*)</h3>
		<div class="gridScrollT">
			<table class="mu-grid mu-grid-border mu-grid-strip">
				<colgroup>
					<col width="20%">
					<col width="20%">
					<col width="20%">
					<col width="20%">
					<col width="20%">
				</colgroup>

				<thead>
					<tr>
						<th>NODE</th>
						<th>PREFER TYPE</th>
						<th>NODE TYPE</th>
						<th>REDUN TYPE</th>
						<th>GRP NAME</th>
					</tr>
				</thead>
			</table>
		</div>
		<div class="mu-scroll-v" style="height: 100px; overflow-y: scroll;">
			<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
				<colgroup>
					<col width="20%">
					<col width="20%">
					<col width="20%">
					<col width="20%">
					<col width="20%">
				</colgroup>
				<tbody id="pgwNodeGrid">
				</tbody>
			</table>
		</div>
		<h3 class="mu-title">GW NTP 정보(*)</h3>
		<div class="gridScrollT">
			<table class="mu-grid mu-grid-border mu-grid-strip">
				<colgroup>
					<col width="25%">
					<col width="25%">
					<col width="25%">
					<col width="25%">
				</colgroup>

				<thead>
					<tr>
						<th>SERVER</th>
						<th>STATUS</th>
						<th>ROLE</th>
						<th>CHK STS</th>
					</tr>
				</thead>
			</table>
		</div>
		<div class="mu-scroll-v" style="height: 100px; overflow-y: scroll;">
			<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
				<colgroup>
					<col width="25%">
					<col width="25%">
					<col width="25%">
					<col width="25%">
				</colgroup>
				<tbody id="pgwNtpGrid">
				</tbody>
			</table>
		</div>
		<h3 class="mu-title">GW PORT 정보(*)</h3>
		<div class="gridScrollT">
			<table class="mu-grid mu-grid-border mu-grid-strip">
				<colgroup>
					<col width="14%">
					<col width="14%">
					<col width="14%">
					<col width="14%">
					<col width="auto">
					<col width="14%">
					<col width="14%">
				</colgroup>

				<thead>
					<tr>
						<th>NODE</th>
						<th>PORT</th>
						<th>ACT_STS</th>
						<th>OPR_STS</th>
						<th>MATE_PORT</th>
						<th>DETAIL_STS</th>
						<th>DESCRIPTION</th>
					</tr>
				</thead>
			</table>
		</div>
		<div class="mu-scroll-v" style="height: 69px; overflow-y: scroll;">
			<table class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
				<colgroup>
					<col width="14%">
					<col width="14%">
					<col width="14%">
					<col width="14%">
					<col width="auto">
					<col width="14%">
					<col width="14%">
				</colgroup>
				<tbody id="pgwPortGrid">
				</tbody>
			</table>
		</div> -->
        
        <input type="hidden" id = 'pgw_Detail_hidden_id'>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="pgwDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:pgwDetail_update()"><i class="mu-icon edit"></i>수정</button>
        <button id="pgwDetailDelete" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:pgwDetail_delete()"><i class="mu-icon del"></i>삭제</button>
	    <button id="pgwDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>