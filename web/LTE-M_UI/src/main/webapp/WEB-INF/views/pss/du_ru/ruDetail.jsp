<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="<c:url value="/resources/js/pss/du_ru/ruDetail.js"><c:param name="dt" value="${nowDate}"/></c:url>"></script>
	
<div id="ruDetailBg" class="mu-dialog-background" style="display: none;z-index: 12"></div>
<div id="ruDetailUp" class="mu-dialog mu-fix-foot" style="display: none; width: 900px; height: 550px; left: 42%; top: 25%;z-index: 13"><!-- resize 부분 -->
    <div id="ruDetailTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">RU 상세정보</span></h2>
        <button id="ruDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="ruDetailDiv">
    
    <!-- 기본 정보 -->
    	<h3 class="mu-title">기본 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>RU 명</label></th>
	                <td>
	                   <input id='ru_Detail_ru_nm' type="text" class="mu-input" disabled="disabled">
	                   <input id='ru_Detail_p_cuid' type="hidden" class="mu-input">
	                </td>
	                <th>운용팀명</th>
	                <td>
	                    <div class="mu-selectbox">
	                        <button id="ru_Detail_team_nm" class="mu-value"></button>
	                        <ul id='ru_Detail_team_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
	            </tr>
	            <tr>
	            	<th>SerialNumber</th>
	                <td>
	                    <input id='ru_Detail_serial_no' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th>제작사명</th>
	                <td>
	                	<div class="mu-selectbox">
	                        <button id="ru_Detail_vendor_nm" class="mu-value"></button>
	                        <ul id='ru_Detail_vendor_ul' class="mu-list">
	                        </ul>
	                    </div>
	                </td>
				</tr>
				<tr>
				<th><label>역사 명</label></th>
				<td>
                    <div class="mu-selectbox">
                        <button id="ru_Detail_station_nm" class="mu-value"></button>
                        <ul id='ru_Detail_station_ul' class="mu-list">
                        </ul>
                    </div>
                </td>
                <th></th>
				<td></td>
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
	                <th><label>RU 타입</label></th>
	                <td>
	                   <input id= 'ru_Detail_ru_type' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th><label>주파수</label></th>
	                <td>
	                   <input id= 'ru_Detail_frequency' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th>SEQ ID</th>
	                <td>
	                    <input id= 'ru_Detail_seq_id' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
	            <tr>
	                <th><label>PORT</label></th>
	                <td>
	                    <input id= 'ru_Detail_port' type="text" class="mu-input" disabled="disabled">
	                </td>
	                <th>등록일자</th>
	                <td>
	                    <input id= 'ru_Detail_install_date' type="text" class="mu-input" disabled="disabled">
	                </td>
					<th></th>
					<td></td>
	            </tr>
        	</tbody>
        </table>


		<!-- 위치 정보 -->

		<h3 class="mu-title">위치 정보</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th><label>RU 위치 설명</label></th>
					<td>
						<input id='ru_location_desc_detail' type="text" class="mu-input" />
					</td>
					<th><label>RU 위치</label></th>
					<td>
						<div class="mu-selectbox" style="width: 270px;">
							<button id="ru_location_detail" class="mu-value">관제소</button>
							<ul id='ru_location_detail_ul' class="mu-list">
							</ul>
						</div>
					</td>
					<%--<td>--%>
						<%--<div class="mu-selectbox">--%>
							<%--<button id="ru_from_station" class="mu-value">미선택</button>--%>
							<%--<ul id='ru_from_station_ul' class="mu-list">--%>
							<%--</ul>--%>
						<%--</div>--%>
					<%--</td>--%>
					<%--<th><label>위치2</label></th>--%>
					<%--<td>--%>
						<%--<div class="mu-selectbox">--%>
							<%--<button id="ru_to_station" class="mu-value">미선택</button>--%>
							<%--<ul id='ru_to_station_ul' class="mu-list">--%>
							<%--</ul>--%>
						<%--</div>--%>
					<%--</td>--%>
				</tr>
			</tbody>
		</table>
		
	<!-- 관리자 정보 -->
	
		<h3 class="mu-title">관리자 정보</h3>
        <table class="mu-formbox">
			<colgroup>
				<col width="120px">
				<col>
				<col width="120px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th><label>관리자</label></th>
	                <td>
	                   <input id= 'ru_Detail_manager_nm' type="text" class="mu-input">
	                </td>
	                <th>FAX</th>
	                <td>
	                    <input id= 'ru_Detail_fax' type="text" class="mu-input">
	                </td>
	            </tr>
	            <tr>
	                <th><label>전화번호</label></th>
	                <td>
	                   <input id= 'ru_Detail_tel' type="text" class="mu-input">
	                </td>
	                <th>Mobile</th>
	                <td>
	                    <input id= 'ru_Detail_mobile' type="text" class="mu-input">
	                </td>
	            </tr>
        	</tbody>
        </table>
					
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
	                   <input id= 'ru_Detail_area' type="text" class="mu-input" disabled="disabled">
	                </td>
	            </tr>
        	</tbody>
        </table>
		<input type="hidden" id = 'ru_cuid'>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="ruDetailModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:ruDetail_update()"><i class="mu-icon edit"></i>수정</button>
	    <button id="ruDetailCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>