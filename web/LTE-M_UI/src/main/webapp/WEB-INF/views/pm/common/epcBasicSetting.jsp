<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/pm/common/epcBasicSetting.js"></script>

<div id="basicSetBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
<div id="basicSetUp" class="mu-dialog mu-fix-foot" style="width: 400px; height: 290px;z-index: 11; display: none;"><!-- resize 부분 -->
    <div id="basicSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">기본 환경설정</span></h2>
        <button id="basicSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="basicSetDiv">
	<!-- 가청 설정 -->
        <h3 class="mu-title">가청</h3>
     	<table class="mu-formbox">
			<colgroup>
				<col width="150px">
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