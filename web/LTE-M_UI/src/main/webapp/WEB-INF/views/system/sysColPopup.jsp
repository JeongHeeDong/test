<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    
<script src="/resources/js/system/sysColPopup.js"></script>
	
<div id="colSetBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="colSetUp" class="mu-dialog mu-fix-foot" style="display: none; min-width:300px; width: 330px; height: 290px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="colSetTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">임계치 설정</span></h2>
        <button id="colSetClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="colSetDiv">
		<input type="hidden"  id="userId" value="${user_id}"/>
		<h3 class="mu-title">현재 설정된 임계치 정보 (단위 : 분)</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="80px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th>5분</th>
					<td><input type="text" name="inp_time" id="min" class="mu-input"/></td>
				</tr>
				<tr>
					<th>1시간</th>
					<td><input type="text" name="inp_time" id="hour" class="mu-input"/></td>
				</tr>
				<tr>
					<th>1일</th>
					<td><input type="text" name="inp_time" id="day" class="mu-input"/></td>
				</tr>
			</tbody>
		</table>
		<!-- <div class="mu-row" style="text-align:center; margin-bottom:15px">
			<span>현재 설정된 임계치 정보 (단위 : 분)</span>
		</div>
		<div class="mu-row" style="margin-bottom:5px">
			<div class="mu-hgroup">
				<label style="width:50px">5분</label>
			</div>
			<div class="mu-hgroup">
				<input type="text" name="inp_time" id="min" class="mu-input" style="text-align:right"/>
			</div>		
		</div>
		<div class="mu-row" style="margin-bottom:5px">
			<div class="mu-hgroup">
				<label style="width:50px">1시간</label>
			</div>
			<div class="mu-hgroup">
				<input type="text" name="inp_time" id="hour" class="mu-input" style="text-align:right"/>
			</div>		
		</div>
		<div class="mu-row" style="margin-bottom:5px">
			<div class="mu-hgroup">
				<label style="width:50px">1일</label>
			</div>
			<div class="mu-hgroup">
				<input type="text" name="inp_time" id="day" class="mu-input" style="text-align:right"/>
			</div>		
		</div> -->
	</div>	
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="colSetSave" type="button" onclick="javascript:updateTHD()" class="mu-btn mu-pop-btn mu-btn-icon" s><i class="mu-icon save"></i>저장</button>
        <button id="colSetCancel" type="button" class="mu-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>