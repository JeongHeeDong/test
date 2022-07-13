<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/failure/popup/unrecoveredInfo.js"></script>
<div id="unRecoveredInfoBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="unRecoveredInfoUp" class="mu-dialog" style="display: none; width: 880px; height:; left: 42%; top: 25%;z-index: 11">
    <div id="unRecoveredInfoTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">미복구 알람 정보</span></h2>
        <button id="unRecoveredInfoClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;">
        <h3 class="mu-title">총 <span id="unRecoverCnt" class="txt_org">0</span> 건이 검색되었습니다.</h3>
		<div class="mu-grid-scroll mu-grid-border">
		    <div class="mu-scroll-v" style="max-height:400px">
		        <table id="tb_unRecoveredInfo" class="mu-grid mu-grid-border mu-grid-strip">
		        	<colgroup>
		                <col width="5">
		                <col width="10">
			            <col width="10">
			            <col width="15">
			            <col width="10">
			            <col width="20">
			            <col width="30">
			            <col width="30">
		            </colgroup>
		            <thead>
			            <tr>
			            	<th>No</th>
			                <th>알람코드</th>
			                <th>등급</th>
			                <th>장비타입</th>
			                <th>장비명</th>
			                <th>발생시간</th>
			                <th>발생위치</th>
			                <th>발생원인</th>
			            </tr>
			        </thead>
		            <tbody>
		            </tbody>
		        </table>
			</div>
	    </div>
	</div>
</div>