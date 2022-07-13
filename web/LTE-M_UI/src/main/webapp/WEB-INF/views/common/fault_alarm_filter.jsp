<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<script src="/resources/js/fault_alarm_filter.js"></script>
<div id="faultAlarmFilterBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
<div id="faultAlarmFilterUp" class="mu-dialog mu-fix-foot" style="width: 50px; height: 290px;z-index: 11; display: none;"><!-- resize 부분 -->
    <div id="faultAlarmFilterTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
		<h2><span class="title" style="line-height: 200%;">알람 필터 설정</span></h2>
        <button id="faultAlarmFilterClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="faultAlarmFilterDiv" style="height: 250px">
	<!-- 가청 설정 -->
		<div class="mu-search-group" >
		    <div class="mu-search-item" style="white-space: nowrap;width: 100%;">
		        <table>
		            <tbody>
			            <tr>
			            	<td>
				                <div class="mu-checkbox">
							        <input type="checkbox" id="alarmType1" name="alarmType" checked="checked" value="1">
							        <label for="alarmType1">고장 알람</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-checkbox">
							        <input type="checkbox" id="alarmType2" name="alarmType" value="2">
							        <label for="alarmType2">Fault 알람</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-checkbox">
							        <input type="checkbox" id="alarmType3" name="alarmType" value="3">
							        <label for="alarmType3">상태 알람</label>
							    </div>
		                    </td>
			            </tr>
		        	</tbody>
		        </table>
		    </div>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="faultAlarmFilterModify" type="button" onclick="javascript:faultAlarmfilterSave()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저 장</button>
        <button id="faultAlarmFilterCancle" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>취 소</button>
    </div>
</div>
