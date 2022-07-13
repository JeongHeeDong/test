<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<div id="alarmUpBg" class="mu-dialog-background" style="z-index: 10"></div>
<div id="alarmUpUp" class="mu-dialog mu-fix-foot" style="width: 550px; height: 550px; left: 20%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="alarmUpTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">알람 설정</span></h2>
        <button id="alarmUpClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="alarmUpDiv">
    
	<!-- 감시 대상 설정 -->
		<div class="mu-search-group" >
		    <div class="mu-search-item" style="white-space: nowrap;width: 100%">
		    	<label>지표별 감시 설정</label>
		        <table>
		        	<thead>
		        		<tr>
			        		<th>알람등급</th>
			        		<th>가청파일</th>
			        		<th>파일찾기</th>
			        		<th>미리듣기</th>
		        		</tr>
		        	</thead>
		            <tbody>
			            <tr>
			            	<td>Critical</td>
			            	<td></td>
			            	<td><input type="file" onchange="javascript:"></td>
			            	<td></td>
			            </tr>
			            <tr>
			            	<td>Major</td>
			            	<td></td>
			            	<td></td>
			            	<td></td>
			            </tr>
			            <tr>
			            	<td>Minor</td>
			            	<td></td>
			            	<td></td>
			            	<td></td>
			            </tr>
		        	</tbody>
		        </table>
		    </div>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="alarmUpModify" type="button" onclick="javascript:alarmUp_save()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon edit"></i>수 정</button>
        <button id="alarmUpCancle" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>취 소</button>
    </div>
</div>