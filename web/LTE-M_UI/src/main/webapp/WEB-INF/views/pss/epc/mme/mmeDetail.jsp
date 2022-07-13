<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<script src="/resources/js/login/aes.js"></script>
<script src="/resources/js/login/sha256.js"></script>
<script src="/resources/js/pss/epc/mme/mmeDetail.js"></script>
	
<div id="mmeDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="mmeDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 750px; height: 700px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="mmeDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">MME 상세정보</span></h2>
        <button id="mmeDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="mmeDetailDiv">
    <!-- 기본 정보 -->
    	<h3 class="mu-title">MME 등록 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>MME ID</label></th>
	                <td>
	                   <input id='mme_Detail_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th>NAME</th>
	                <td>
	                    <input id='mme_Detail_name' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	                <th><label>EMS_NAME</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="mme_Detail_ems_nm" class="mu-value"></button>
	                        <ul id='mme_Detail_ems_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	                <th><label>VENDOR</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="mme_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='mme_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div> 
	                </td>
	            </tr>
	            <tr>
	            	<th><label>상용일자</label></th>
	                <td>
						<div class="mu-datepicker">
							<input id="installMmeDetailDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installMmeDetailDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	                <th><label>갱신일자</label></th>
	                <td>
						<input id="updateMmeDetailDateTxt" type="text" value="" disabled="disabled"/>
	                </td>
	            </tr>
	            <tr>
	            	<th>MME IP</th>
	                <td>
	                    <input id='mme_Detail_mme_ip' type="text" class="mu-input">
	                </td>
					<th>STATUS</th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="mme_Detail_status_nm" class="mu-value" ></button>
	                        <ul id='mme_Detail_status' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
        	</tbody>
        </table>
        
<div id="mmeAccessInfoTable">    
        <h3 class="mu-title">접속 정보</h3>
        <table class="mu-formbox">
            <tbody>
                <tr>
                    <td style="width:200px; text-align:center; ">
                          ID : <span id="mmeAccessIdText">duAccessId</span>
                          <input type="hidden" id="mmeAccessId" name="mmeAccessId" value="" />
                    </td>
                    <td>
                        <input id ="mmeAccessPwd" name="mmeAccessPwd" type="password" title="Password" class="mu-input pw" placeholder="Password" maxlength="30" size="20" />
                    </td>
                    <td>
                        <button id="mmeAccessInfoUpdate" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:accessMmeInfoUpdate('1')"><i class="mu-icon edit"></i>수정</button>
                    </td>
                </tr>
            </tbody>
        </table>
</div>              
         
        <!-- LTEM 사용 안함
        <h3 class="mu-title">MME 노드 정보(*)</h3>
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
				<tbody id="mmeNodeGrid">
				</tbody>
			</table>
		</div>
		<h3 class="mu-title">MME NTP 정보(*)</h3>
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
				<tbody id="mmeNtpGrid">
				</tbody>
			</table>
		</div>
		<h3 class="mu-title">MME PORT 정보(*)</h3>
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
				<tbody id="mmePortGrid">
				</tbody>
			</table>
		</div> -->
		<!-- //gridWarp -->
		<input type="hidden" id = 'mme_Detail_hidden_id'>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
		<button id="mmeDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:mmeDetail_update()"><i class="mu-icon edit"></i>수정</button>
        <button id="mmeDetailDetail" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:mmeDetail_delete()"><i class="mu-icon del"></i>삭제</button>
	    <button id="mmeDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>