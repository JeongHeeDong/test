<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/pm/common/basicSetting.js"></script>

<div id="basicSetBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
<div id="basicSetUp" class="mu-dialog mu-fix-foot" style="width: 550px; height: 490px;z-index: 11; display: none;"><!-- resize 부분 -->
    <div id="basicSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">기본 환경설정</span></h2>
        <button id="basicSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="basicSetDiv">
    
    <!-- 장비 설정 -->
    	<h3 class="mu-title">장비 설정</h3>
     	<table class="mu-formbox">
			<colgroup>
				<col width="180px">
				<col>
			</colgroup>
            <tbody>
	            <tr>
	                <th>
	                	<label>감시 장비 설정</label>
					</th>
					<td>
						<div class="mu-hgroup">
							<button id='equip_select' type="button" onclick="javascript:equipSelectView(1,0)" class="mu-btn width100">장비선택</button>
							<input type="text" class="mu-input" readonly="readonly" id="selectEquipText" />
							<input type="hidden" readonly="readonly" id="selectEquipVal" />
						</div>
	                </td>
	            </tr>
	            <tr>
	            	<th>
	                    <div class='mu-checkbox'>
			   				<input type='checkbox' id='equip_except'>
			   				<label for='equip_except'>감시제외 설정 적용</label>
			   			</div>
					</th>
					<td>
						<div class="mu-hgroup">
							<button id='equip_except_select' type="button" onclick="javascript:equipSelectView(0,0)" class="mu-btn width100" disabled="disabled">감시제외설정</button>
							<input type="text" class="mu-input" readonly="readonly" id="deSelectEquipText" />
							<input type="hidden" readonly="readonly" id="deSelectEquipVal" />
						</div>
					</td>
	            </tr>
        	</tbody>
        </table>
		
	<!-- 가청 설정 -->
        <h3 class="mu-title">가청</h3>
     	<table class="mu-formbox">
			<colgroup>
				<col width="180px">
				<col>
			</colgroup>
            <tbody>
            	<tr>
            		<th colspan="2">
            			<div class='mu-checkbox'>
			   				<input type='checkbox' id='alarm_check' checked="checked">
			   				<label for='alarm_check'>가청 설정</label>
			   			</div>
            		</th>
            	</tr>
	            <tr>
	            	<th>
	            		<label>감시 등급</label>
	            	</th>
	            	<td>
		                <div class="mu-selectbox" id="alarm_level_div">
	                        <select id="alarm_level" class="mu-value">
	                            <option value=3>Minor 이상</option>
								<option value=2>Major 이상</option>
								<option value=1>Critical 이상</option>
	                        </select>
	                    </div>
                    </td>
	            </tr>
	            <tr>
	            	<th>
	            		<label>가청 시간</label>
	            	</th>
	            	<td>
		                <div class="mu-selectbox" id="alarm_time_div">
	                        <select id="alarm_time" class="mu-value">
	                            <option value=1>항상(24H)</option>
								<option value=2>09:00 ~ 17:59</option>
								<option value=3>18:00 ~ 08:59</option>
	                        </select>
	                    </div>
                    </td>
	            </tr>
        	</tbody>
        </table>
		<!-- 감시기준 설정 -->
       	<h3 class="mu-title">감시기준 설정</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="180px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th><label>감시 등급</label></th>
					<td>
						<div class="mu-selectbox">
							<select id="std_alarm" class="mu-value">
								<option value=5>전체</option>
								<option value=3>Minor 이상</option>
								<option value=2>Major 이상</option>
								<option value=1>Critical 이상</option>
							</select>
						</div>
					</td>
					<!-- 기준시도호 및 달력은 기능 삭제, 관련 코드는 남아있지만 전주를 기준으로 실행됨 -->
					<th style="display: none;"><label>기준시도호</label></th>
					<td style="display: none;">
						<div class="mu-selectbox">
							<select id="std_alarm_time" class="mu-value">
								<option value=0 selected="selected">전주</option>
								<option value=1>특정일자</option>
							</select>
						</div>
					</td>
				</tr>
				<tr style="display: none;">
					<th></th>
					<td id="dateBox">
						<div class="mu-datepicker">
							<input id="basicSetDateTxt" type="text" value=""
								readonly="readonly" />
							<button id="basicSetDateDateBtn"
								class="mu-btn mu-btn-icon mu-btn-icon-only">
								<i class="mu-icon calendar"></i>
							</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="basicSetModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:basicSettingSave()"><i class="mu-icon save"></i>저장</button>
	    <button id="basicSetCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
    <input id="sound_level" type="hidden">
    <input id="sound_time" type="hidden">
    <input id="monitorflag" type="hidden" value = 0>
    <input id="tempmonitorflag" type="hidden" value = 0>
</div>

<%@ include file="/WEB-INF/views/pm/common/equipSelect.jsp" %>