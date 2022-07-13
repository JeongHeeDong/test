<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    
<script src="/resources/js/system/sysSmsConfPopup.js"></script>
	
<div id="confAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="confAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 860px; height: 680px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="confAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">장애정보알림 SMS 발행 권한 설정 - 추가</span></h2>
        <button id="confAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="confAddDiv">
		<!-- <div id="search_bar" style="margin-top:10px">
			<div style="float:left;display:inline-flex">
				<h3 class="mu-title">수신 시스템 설정</h3>
		    	<input type="text" id="code_word" class="mu-input" style="width:100px;margin:-3px 0px 0px 120px" placeholder="알람코드 검색"/>
				<button type="button" class="mu-btn mu-btn-icon" style="margin-top:-3px" onclick="getAlarmCode()">
					<i class="mu-icon search"></i>
				</button>
			</div>			
		</div> -->
		<div id="search_bar">
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>알람코드</label>
						<input type="text" id="code_word" class="mu-input" placeholder="알람코드 검색"/>
					</div>
				</div>
				<div class="mu-search-btn" style="height: inherit;">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getAlarmCode()"><i class="mu-icon search"></i>조회</button>
				</div>
			</div>
		</div>
		<h3 class="mu-title">수신 시스템 설정</h3>
		<div class="listBox">
			<div class="inBox fl" style="width:190px;">
				<table id="" class="mu-grid mu-grid-border mu-grid-strip mu-grid-item mu-grid-center" style="text-align:center">
					<colgroup>
						<col width="30px">
						<col>
					</colgroup>
					<thead>
						<tr>
							<th>
							</th>
							<th>시스템</th>
						</tr>
					</thead>
					<tbody id="systemGrid">
					</tbody>
				</table>
				<input type="hidden" id="originSys"/>
			</div>
			<div class="inBox fl" style="width:190px;margin-left:10px">
				<table id="codeTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-item mu-grid-center" style="text-align:center">
					<colgroup>
						<col width="30px">
						<col>
					</colgroup>
					<thead>
						<tr>
							<th>
								<input type="checkbox" onclick="allCodeCheck(this)">
							</th>
							<th>Code</th>
						</tr>
					</thead>
					<tbody id="codeGrid">
					</tbody>
				</table>
			</div>
			<div class="inBox fl" style="width:400px;margin-left:10px">
				<table id="phoneTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-item mu-grid-center" style="text-align:center">
					<colgroup>
						<col width="35px">
						<col width="100px">
					</colgroup>
					<thead>
						<tr>
							<th>
								<input type="checkbox" onclick="allPhoneCheck(this)">
							</th>
							<th>수신번호</th>
							<th>그룹명</th>
							<th>장비명</th>
						</tr>
					</thead>
					<tbody id="phoneGrid">
					</tbody>
				</table>
			</div>
			<div class="fr hidden" id="sel_severity">
				<div class="mu-radio">
						<input type="radio" id="r1" name="sel_severity" value="1" checked="checked">
						<label for="r1">CRITICAL</label>
				</div>
				<div class="mu-radio">
					<input type="radio" id="r2" name="sel_severity" value="2">
					<label for="r2">MAJOR</label>
				</div>
				<div class="mu-radio">
					<input type="radio" id="r3" name="sel_severity" value="3">
					<label for="r3">MINOR</label>
				</div>
			</div>
		</div>
		<h3 class="mu-title">수신 시간 설정</h3>
		<div id="hourDiv" class="tc">
			<div style="mu-hgroup">
				<button type="button" class="mu-btn" id="all_select_btn">전체선택</button>
				<button type="button" class="mu-btn mu-btn-cancel" id="all_cancel_btn">전체해제</button>
			</div>
			<ol class="table_hour" id="table_hour" style="width:690px; height:100px; margin-top:10px">
				<li><button type="button" id="hour0" class="mu-btn mu-btn-icon">0</button></li>
				<li><button type="button" id="hour1" class="mu-btn mu-btn-icon">1</button></li>
				<li><button type="button" id="hour2" class="mu-btn mu-btn-icon">2</button></li>
				<li><button type="button" id="hour3" class="mu-btn mu-btn-icon">3</button></li>
				<li><button type="button" id="hour4" class="mu-btn mu-btn-icon">4</button></li>
				<li><button type="button" id="hour5" class="mu-btn mu-btn-icon">5</button></li>
				<li><button type="button" id="hour6" class="mu-btn mu-btn-icon">6</button></li>
				<li><button type="button" id="hour7" class="mu-btn mu-btn-icon">7</button></li>
				<li><button type="button" id="hour8" class="mu-btn mu-btn-icon">8</button></li>
				<li><button type="button" id="hour9" class="mu-btn mu-btn-icon">9</button></li>
				<li><button type="button" id="hour10" class="mu-btn mu-btn-icon">10</button></li>
				<li><button type="button" id="hour11" class="mu-btn mu-btn-icon">11</button></li>
				<li><button type="button" id="hour12" class="mu-btn mu-btn-icon">12</button></li>
				<li><button type="button" id="hour13" class="mu-btn mu-btn-icon">13</button></li>
				<li><button type="button" id="hour14" class="mu-btn mu-btn-icon">14</button></li>
				<li><button type="button" id="hour15" class="mu-btn mu-btn-icon">15</button></li>
				<li><button type="button" id="hour16" class="mu-btn mu-btn-icon">16</button></li>
				<li><button type="button" id="hour17" class="mu-btn mu-btn-icon">17</button></li>
				<li><button type="button" id="hour18" class="mu-btn mu-btn-icon">18</button></li>
				<li><button type="button" id="hour19" class="mu-btn mu-btn-icon">19</button></li>
				<li><button type="button" id="hour20" class="mu-btn mu-btn-icon">20</button></li>
				<li><button type="button" id="hour21" class="mu-btn mu-btn-icon">21</button></li>
				<li><button type="button" id="hour22" class="mu-btn mu-btn-icon">22</button></li>
				<li><button type="button" id="hour23" class="mu-btn mu-btn-icon">23</button></li>
			</ol>
		</div>
		<div class="mu-hgroup">
			<h3>※ 설정 저장시 시스템 반영에 최대 5분의 시간이 소요됩니다.</h3>
		</div>

		<table id="codeView" class="mu-grid mu-grid-strip mu-grid-item mu-grid-center mu-grid-border hidden" style="text-align:center">
			<colgroup>
				<col width="100px">
			</colgroup>
			<thead>
				<tr>
					<th>Code</th>
				</tr>
			</thead>
			<tbody id="codeViewbody">
			</tbody>
		</table>
	</div>	
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="confUpdSave" type="button" onclick="javascript:updateData()" class="mu-btn mu-pop-btn mu-btn-icon hidden"><i class="mu-icon save"></i>저장</button>
        <button id="confAddSave" type="button" onclick="javascript:insertData()" class="mu-btn mu-pop-btn mu-btn-icon hidden"><i class="mu-icon save"></i>저장</button>
        <button id="confAddCancel" type="button" class="mu-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취 소</button>
    </div>
</div>