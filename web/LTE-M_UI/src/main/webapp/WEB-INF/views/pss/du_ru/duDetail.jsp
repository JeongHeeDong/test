<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<script src="/resources/js/login/aes.js"></script>
<script src="/resources/js/login/sha256.js"></script>
<script src="<c:url value="/resources/js/pss/du_ru/duDetail.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>

<div id="duDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="duDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 1000px; height: 550px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="duDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">DU 상세정보</span></h2>
        <button id="duDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="duDetailDiv">
    <!-- 기본 정보 -->
    	<h3 class="mu-title">기본 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>DU 명 이름</label></th>
	                <td>
	                   <input id='du_Detail_du_nm' type="text" class="mu-input">
	                   <input id='du_Detail_du_id' type="hidden" class="mu-input">
	                </td>
	                <th>운용팀명</th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="du_Detail_team_nm" class="mu-value"></button>
	                        <ul id='du_Detail_team_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	                <th>구분</th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="du_Detail_station_nm" class="mu-value"></button>
	                        <ul id='du_Detail_station_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	                <th>VLAN INFO</th>
	                <td>
	                    <input id= 'du_Detail_vlan_info' type="text" class="mu-input">
	                </td>
	                <th>제작사명</th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="du_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='du_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	                <th>SWITCH INFO</th>
	                <td>
	                    <input id= 'du_Detail_sw_info' type="text" class="mu-input">
	                </td>
	                <!--
	                <th><label>호선</label></th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="du_Detail_line_id" class="mu-value"></button>
	                        <ul id='du_Detail_line_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td> -->
	            </tr>
	            <tr>
	            	<th>VLAN INFO2</th>
	                <td>
	                    <input id= 'du_Detail_vlan_info2' type="text" class="mu-input">
	                </td>
	                <th>MASTER IP</th>
	                <td>
	                    <input id= 'du_Detail_master_ip' type="text" class="mu-input">
	                </td>
	                <th>SWITCH INFO2</th>
	                <td>
	                    <input id= 'du_Detail_sw_info2' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	            	<th>EMS IP</th>
	                <td>
	                    <input id= 'du_Detail_onm_ip' type="text" class="mu-input">
	                </td>
	                <th><label>MASTER IP2</label></th>
	                <td>
	                   <input id= 'du_Detail_master_ip2' type="text" class="mu-input">
	                </td>
	                <th></th>
	                <td></td>
					<!-- <th><label>SWITCH INFO2</label></th>
	                <td>
	                   <input id= 'du_Detail_sw_info2' type="text" class="mu-input">
	                </td> -->
	            </tr>
        	</tbody>
        </table>
		
	<!-- 속성 정보 -->
		<h3 class="mu-title">속성 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th>DU TYPE</th>
	                <td>
	                    <input id= 'du_Detail_du_type' type="text" class="mu-input" onkeyPress="javascript:checkInputNum(this);">
	                </td>
	                <th><label>CARD TYPE</label></th>
	                <td>
	                    <input id= 'du_Detail_card_type' type="text" class="mu-input" onkeyPress="javascript:checkInputNum(this);">
	                </td>
	                <th>CELL TYPE</th>
	                <td>
	                    <input id= 'du_Detail_cell_type' type="text" class="mu-input" >
	                </td>
	            </tr>
	            <tr>
	                <th>서비스 형식</th>
	                <td>
	                    <input id= 'du_Detail_service_type' type="text" class="mu-input" onkeyPress="javascript:checkInputNum(this);">
	                </td>
	                <th>등록일자</th>
	                <td>
	                    
	                    <div class="mu-datepicker">
	                    	<input id= 'du_Detail_install_date' type="text" class="mu-input" readonly="readonly"/>
							<button id="du_Detail_install_date_bnt" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
	                </td>
	                <th>SERIAL NO</th>
	                <td>
	                    <input id= 'du_Detail_serial_no' type="text" class="mu-input">
	                </td>
	            </tr>
        	</tbody>
        </table>
		
	<!-- 운영 정보 -->
		<!-- <h3 class="mu-title">운영 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th>Cell 수</th>
	                <td>
	                   <input id= 'du_Detail_cell_cnt' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th>전체 RU 수</th>
	                <td>
	                    <input id ='du_Detail_ru_tot' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
        	</tbody>
        </table> -->
				
	<!-- 관리자 정보 -->
		<!-- <h3 class="mu-title">관리자 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th>관리자</th>
	                <td>
	                   <input id= 'du_Detail_manager_nm' type="text" class="mu-input">
	                </td>
	                <th>FAX</th>
	                <td>
	                    <input id= 'du_Detail_fax' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	                <th>전화번호</th>
	                <td>
	                   <input id= 'du_Detail_tel' type="text" class="mu-input">
	                </td>
	                <th>Mobile</th>
	                <td>
	                    <input id= 'du_Detail_mobile' type="text" class="mu-input">
	                </td>
	            </tr>
        	</tbody>
        </table> -->
					
	<!-- 주소 정보 -->
		<h3 class="mu-title">주소 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>주소</label></th>
	                <td>
	                   <input id= 'du_Detail_area' type="text" class="mu-input">
	                </td>
	            </tr>
        	</tbody>
        </table>

<div id="duAccessInfoTable">					
        <h3 class="mu-title">접속 정보</h3>
        <table class="mu-formbox">
            <tbody>
                <tr>
                    <td style="width:200px; text-align:center; ">
						  ID : <span id="duAccessIdText">duAccessId</span>
						  <input type="hidden" id="duAccessId" name="duAccessId" value="" />
					</td>
					<td>
						<input id ="duAccessPwd" name="duAccessPwd" type="password" title="Password" class="mu-input pw" placeholder="Password" maxlength="30" size="20" />
                    </td>
					<td>
						<button id="duAccessInfoUpdate" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:duAccessInfoUpdate()"><i class="mu-icon edit"></i>수정</button>
                    </td>
                </tr>
            </tbody>
        </table>
</div>        
	<!-- RU 정보 -->
		<!-- <div class="subtitleWrap">
			<h3 class="mu-title">RU 정보</h3>
		</div>
        <div id="ruDiv" class="gridWrap mt10" style="overflow:auto;max-height:186px;">
			<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
				<thead>
					<tr>
						<th>C_UID</th>
						<th>CELL</th>
						<th>PORT</th>
						<th>SEQ</th>
						<th>주파수</th>
						<th>주소</th>
					</tr>
				</thead>
				<tbody id ='du_Detail_ru_list'>
				</tbody>
			</table>
		</div> -->
		<!-- //gridWarp -->
									
	<!-- 채널카드 정보 -->
		<!-- <div class="subtitleWrap">
			<h3 class="mu-title">채널카드 정보</h3>
		</div>
        <div class="gridWrap mt10" style="overflow:auto;max-height:186px;">
			<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
				<thead>
					<tr>
						<th>UNIT ID</th>
						<th>UNIT TYPE</th>
						<th>PORT_TYPE</th>
						<th>SHELF_ID</th>
						<th>SLOT_ID</th>
						<th>PORT_ID</th>
						<th>CASCADE_ID</th>
						<th>SERIALNUMBER</th>
					</tr>
				</thead>
				<tbody id= 'du_Detail_du_card_list'>
				</tbody>
			</table>
		</div> -->
		<!-- //gridWarp -->
		
		<!-- Cell 정보 -->
		<!-- <div class="subtitleWrap">
			<h3 class="mu-title">Cell 정보</h3>
		</div>
        <div class="gridWrap mt10" style="overflow:auto;max-height:186px;">
			<table id='table' class="mu-grid mu-grid-border mu-grid-strip">
				<thead>
					<tr>
						<th>Cell ID</th>
						<th>Cell 번호</th>
						<th>SECTOR</th>
						<th>FA</th>
						<th>PCI</th>
						<th>FREQUENCY</th>
						<th>ADM STATE</th>
					</tr>
				</thead>
				<tbody id= 'du_Detail_du_cell_list'>
				</tbody>
			</table>
		</div>
		 -->
		 <input type="hidden" id = 'du_cuid'>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
     	<button id="duDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:duDetail_update()"><i class="mu-icon edit"></i>수정</button>
     	<button id="duDetailDelete" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:duDetail_delete()"><i class="mu-icon del"></i>삭제</button>
	    <button id="duDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>