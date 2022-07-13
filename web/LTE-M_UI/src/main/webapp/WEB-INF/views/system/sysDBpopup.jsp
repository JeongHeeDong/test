<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/system/sysDBpopup.js"></script>
	
<div id="dbAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="dbAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 830px; height: 600px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="dbAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">DB 백업 관리 추가</span></h2>
        <button id="dbAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="dbAddDiv">
		<!-- <div class="mu-radio">
				<input type="radio" id="r1" name="selectOpt" value="host" checked="checked" onclick="addComponent(this)">
				<label for="r1">Host</label>
		</div>
		    	<div class="mu-radio">
				<input type="radio" id="r2" name="selectOpt" value="table" onclick="addComponent(this)">
				<label for="r2">DBTable</label>
		</div>
		<div class="mu-item-group" id="hostComp">
			<div class="mu-selectbox" style="margin-top:10px">
		            	<button id="host_btn" class="mu-value">Host 선택</button>
		            	<ul id="host_ul" class="mu-list">   
		            	</ul>
		       		</div>
		</div>
		<div class="mu-item-group hidden" id="tableComp" style="margin-top:10px">
			<div id="tableSearchBar">
				<div class="mu-selectbox">
			            	<button id="table_btn" class="mu-value">조회대상</button>
			            	<ul id="table_ul" class="mu-list">   
			            	</ul>
			       		</div>
			       		<input type="text" class="mu-input" id="table_word" placeholder="검색어를 입력하세요."/>
			   			<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getTableInfo()"><i class="mu-icon search"></i>검색</button>
			</div>
		</div> -->
		<div class="mu-search-group">
		    <div class="mu-search-item">
		        <div class="mu-item-group">
					<div class="mu-radio">
						<input type="radio" id="r1" name="selectOpt" value="host" checked="checked" onclick="addComponent(this)">
						<label for="r1">Host</label>
					</div>
					<div class="mu-radio">
						<input type="radio" id="r2" name="selectOpt" value="table" onclick="addComponent(this)">
						<label for="r2">DBTable</label>
					</div>
					<div class="lineY" id="hostComp">
						<div class="mu-selectbox">
							<button id="host_btn" class="mu-value">Host 선택</button>
							<ul id="host_ul" class="mu-list">   
							</ul>
						</div>
					</div>
					<div class="lineY hidden" id="tableComp">
						<div id="tableSearchBar" class="mu-hgroup">
							<div class="mu-selectbox">
								<button id="table_btn" class="mu-value">조회대상</button>
								<ul id="table_ul" class="mu-list">   
								</ul>
							</div>
							<input type="text" class="mu-input" id="table_word" placeholder="검색어를 입력하세요."/>
							<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getTableInfo()"><i class="mu-icon search"></i>검색</button>
						</div>
					</div>
				</div>
		    </div>
		</div>
		
		<div class="gridScrollT">
			<table id="gridHeader" class="mu-grid mu-grid-border mu-grid-strip tbFix">
				<colgroup id="headerGroup">
					<col width="8%">
					<col width="40%">
					<col width="52%">
				</colgroup>
				<thead>
					<tr id="headerTr">
						<th>선택</th>
						<th>Table</th>
						<th>설명</th>
					</tr>
				</thead>
			</table>
		</div>
				
		<div class="mu-scroll-v" style="overflow-y:auto;overflow-x:hidden;max-height:200px">
			<table id='table' class="mu-grid mu-grid-border mu-grid-strip tbFix">
				<colgroup id="bodyGroup">
					<col width="8%">
					<col width="40%">
					<col width="52%">
				</colgroup>
				<tbody id="tableGrid">
				</tbody>
			</table>
		</div>

		<table class="mu-formbox mt10">
			<colgroup>
				<col width="130px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th>설명</th>
					<td>
						<textarea class="mu-area" id="bak_desc" rows="3"></textarea>
					</td>
				</tr>
				<tr>
					<th>백업주기</th>
					<td>
						<div class="mu-item-group">
							<input type="text" class="mu-input" id="bak_day"/> 일
						</div>
					</td>
				</tr>
				<tr>
					<th>보존기간</th>
					<td>
						<div class="mu-item-group">
							<input type="text" class="mu-input" id="bak_expire"/> 일
						</div>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="dbAddSave" type="button" onclick="javascript:insertData()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
        <button id="dbAddCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>