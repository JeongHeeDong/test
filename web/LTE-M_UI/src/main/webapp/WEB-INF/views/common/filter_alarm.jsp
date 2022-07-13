<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<script src="/resources/js/filter_alarm/filter_alarm.js"></script>
<input type="hidden" value="N" id="gridFilterFlag"/>
<div id="filterSetBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
<div id="filterSetUp" class="mu-dialog mu-fix-foot" style="width: 50px; height: 290px;z-index: 11; display: none;"><!-- resize 부분 -->
    <div id="filterSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
		<h2><span class="title" style="line-height: 200%;">알람 필터 설정</span></h2>
        <button id="filterSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="filterSetDiv" style="height: 250px">
	<!-- 가청 설정 -->
		<div class="mu-search-group" >
		    <div class="mu-search-item" style="white-space: nowrap;width: 100%;">
		        <table>
		            <tbody>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="alarmRadio" id = "r0" checked="checked" value= 0>
							        <label for="r0">전 체</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="alarmRadio" id = "r1" value= 1>
							        <label for="r1">Critical 이상</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="alarmRadio" id = "r2" value= 2>
							        <label for="r2">Major 이상</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="alarmRadio" id = "r3" value= 3>
							        <label for="r3">Minor 이상</label>
							    </div>
		                    </td>
			            </tr>
		        	</tbody>
		        </table>
		    </div>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="filterSetModify" type="button" onclick="javascript:filterSave()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확 인</button>
        <button id="filterSetCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취 소</button>
    </div>
</div>

<input type="hidden" id = "audioAlarmLevel" value = 4 >
<input type="hidden" id = "audioIntervalId" >