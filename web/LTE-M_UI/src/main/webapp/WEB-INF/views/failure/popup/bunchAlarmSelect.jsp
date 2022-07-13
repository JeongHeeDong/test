<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/failure/popup/bunchAlarmSelect.js"></script>

<div id="bunchAlarmBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="bunchAlarmUp" class="mu-dialog mu-fix-foot" style="width: 840px; height: 450px;z-index: 13; display: none;"><!-- resize 부분 -->
    <div id="bunchAlarmTitle" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title" style="line-height: 200%;">다발알람 선택</span></h2>
        <button id="bunchAlarmClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;">
    
    <!-- 장비 설정 -->
		<div class="mu-search-group">
		    <div class="mu-search-item">
		        <div>장비 :</div>
		        <div class="mu-item-group">
		 			<div class="mu-selectbox">
                        <select id="equipOption_bunchAlarm" class="mu-value">
                        </select>
                    </div>
		        </div>
		        <div>ALARM :</div>
		        <div class="mu-item-group">
		 			<div class="mu-selectbox">
                        <select id="searchAlarmName" class="mu-value">
                        	<!-- value는 아래 테이블의 컬럼인덱스  -->
                        	<option value='2'>BunchCode</option>
                        	<option value='3'>AlarmCode</option>
                        	<option value='4'>Cause</option>
                        </select>
                    </div>
                    <input id="searchAlarmValue" type="text" class="mu-input" value="" style="width: 150px;">
		        </div>
		    </div>
		    <div class="mu-search-btn" style="height: inherit;">
		        <button type="button" id="btn_bunchAlarmSearch" class="mu-btn mu-btn-icon"><i class="mu-icon search"></i>조회</button>
		    </div>
		</div>
		
		<div class="listBox">
			<div class="inBox fl" style="height: 250px; width: 360px;">
				<table id="tb_unselected_bunchAlarm" class="mu-grid mu-grid-strip mu-grid-item mu-grid-center">
					<thead>
						<tr>
							<th>
								<div class="mu-checkbox">
					   				<input type="checkbox" id="chk_unselect_bunchAlarmHead">
					   				<label for="chk_unselect_bunchAlarmHead"></label>
					   			</div>
							</th>
							<th>장비 종류</th>
							<th>다발코드</th>
							<th>알람코드</th>
							<th>CAUSE</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<button class="mu-btn btnAdd" onclick="javascript:addBunchAlarmList()" type="button" style="left: 375px;"><span>&gt;</span></button>
			<div class="inBox fr" style="height: 250px; width: 360px;">
				<table id="tb_selected_bunchAlarm" class="mu-grid mu-grid-strip mu-grid-item mu-grid-center">
					<thead>
						<tr>
							<th>
								<div class="mu-checkbox">
					   				<input type="checkbox" id="chk_select_bunchAlarmHead">
					   				<label for="chk_select_bunchAlarmHead"></label>
					   			</div>
							</th>
							<th>장비 종류</th>
							<th>다발코드</th>
							<th>알람코드</th>
							<th>CAUSE</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<button class="mu-btn btnDel" onclick="javascript:deleteBunchAlarmList()" type="button" style="left: 375px;"><span>&lt;</span></button>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="btn_bunchAlarm_save" type="button" onclick="javascript:saveBunchAlarmList()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
        <button id="btn_bunchAlarm_cancel" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>취 소</button>
    </div>
    <input id = "flag" type="hidden">
</div>
