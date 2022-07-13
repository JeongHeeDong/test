<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<div id="sysDelPopBg" class="mu-dialog-background" style="display:none;z-index: 10"></div>
<div id="sysDelPopUp" class="mu-dialog mu-fix-foot" style="display:none;width: 720px; height: 430px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="sysDelPopTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span id='pop_title' class="title">대상 테이블 추가</span></h2>
        <button id="sysDelPopClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body threshold">
    	<h3 class="mu-title">대상 테이블</h3>
    	<div style="max-height: 250px;overflow-y: auto;">
			<table id="popTable" class="mu-grid mu-grid-border mu-grid-strip">
				<thead>
					<tr>
						<!-- <th>
							<div class="mu-checkbox">
				   				<input type="checkbox" id="popCheckHead">
				   				<label for="popCheckHead"></label>
				   			</div>
						</th> -->
						<th>테이블명</th>
						<th>설명</th>
					</tr>
				</thead>
				<tbody id="tableInfoTbody" style="text-align: center;">
					
				</tbody>
			</table>
		</div>

		<h3 class="mu-title">삭제 주기 단위</h3>
		<div class="mu-search-group">
			<div class="mu-item-group">
				<!-- <div class="mu-radio">
					<input type="radio" name="pop_radio" id="pop_Hour" value= "H">
					<label for="pop_Hour">시간 단위</label>
				</div> -->
				<div class="mu-radio">
					<input type="radio" name="pop_radio" id="pop_Day" value= "D" checked="checked">
					<label for="pop_Day">일 단위</label>
				</div>
				<div class="mu-radio">
					<input type="radio" name="pop_radio" id="pop_Month" value= "M">
					<label for="pop_Month">월 단위</label>
				</div>
				<div class="mu-radio">
					<input type="radio" name="pop_radio" id="pop_NOT" value= "N">
					<label for="pop_NOT">데이터 삭제 안함</label>
				</div>
			</div>
		</div>
		
		<h3 class="mu-title">삭제 주기</h3>
		<div class="mu-search-group">
			<div class="mu-item-group">
				<input type="text" id="del_cycle" class="mu-input" onkeypress="return fn_press(event,'numbers')"/><label id="cycleText"></label>
			</div>
		</div>
	</div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="sysDelPopModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:cyclePopSave()"><i id="mod_btn" class="mu-icon save"></i>저장</button>
	    <button id="sysDelPopCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>
