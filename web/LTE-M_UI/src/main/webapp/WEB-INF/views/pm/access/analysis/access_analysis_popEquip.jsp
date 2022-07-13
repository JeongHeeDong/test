<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<div id="equipSelectBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="equipSelectUp" class="mu-dialog mu-fix-foot" style="width:1100px; height: 460px;z-index: 13; display: none;"><!-- resize 부분 -->
    <div id="equipSelectTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title" id="equipSetTitle">조회 장비 설정</span></h2>
        <button id="equipSelectClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;" id="equipSelectDiv">
    
    <!-- 장비 설정 -->
		<div class="mu-search-group">
		    <div class="mu-search-item">
		        <div class="mu-item-group">
<!-- 		 			<label>호선</label>
					<div class="mu-selectbox">
						<select id="selectedLine" class="mu-value"></select>
					</div> -->
                    <label>장비 명</label>
                    <input type="text" id="equip_search" class="mu-input">
		        </div>
		    </div>
		    <div class="mu-search-btn">
		    	<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:getEquipList()"><i class="mu-icon search"></i>조회</button>
		    </div>
		</div>
		<div class="listBox">
			<div class="inBox fl" style="width:500px;">
				<table id="deSelectEquipTB" class="mu-grid mu-grid-border mu-grid-strip">
					<thead>
						<tr>
							<th>
								<div class="mu-checkbox">
					   				<input type="checkbox"  id="deselectHead">
					   				<label for="deselectHead"></label>
					   			</div>
							</th>
							<th>구분</th>
							<th>장비 ID</th>
							<th>장비 명</th>
						</tr>
					</thead>
					<tbody id="deSelectEquipGrid" style="text-align: center;">
					</tbody>
				</table>
			</div>
			<button class="mu-btn btnAdd" onclick="javascript:select_equip()" type="button" style="left:515px;"><span>&gt;</span></button>
			<div class="inBox fr" style="width:500px;">
				<table  id="selectEquipTB" class="mu-grid mu-grid-border mu-grid-strip">
					<thead>
						<tr>
							<th>
								<div class="mu-checkbox">
					   				<input type="checkbox" id="selectHead">
					   				<label for="selectHead"></label>
					   			</div>
							</th>
							<th>구분</th>
							<th>장비 ID</th>
							<th>장비 명</th>
						</tr>
					</thead>
					<tbody  id="selectEquipGrid" style="text-align: center;">
					</tbody>
				</table>
			</div>
			<button class="mu-btn btnDel" onclick="javascript:delete_equip()" type="button" style="left:515px;"><span>&lt;</span></button>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="equipSelectModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:equipSelect_add()"><i class="mu-icon check"></i>확인</button>
	    <button id="equipSelectCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
    <input id="flag" type="hidden">
    <input id="equipSelectEquipType" type="hidden">
</div>
