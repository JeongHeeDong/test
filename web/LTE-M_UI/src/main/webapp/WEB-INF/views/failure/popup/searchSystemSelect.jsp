<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="<c:url value="/resources/js/failure/popup/searchSystemSelect.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>

<div id="searchSystemBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="searchSystemUp" class="mu-dialog mu-fix-foot" style="width: 1100px; height: 455px; z-index: 13; display: none;"><!-- resize 부분 -->
    <div id="searchSystemTitle" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title" style="line-height: 200%;">시스템 선택</span></h2>
        <button id="searchSystemClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;">
    
    <!-- 장비 설정 -->
		<div class="mu-search-group">
		    <div class="mu-search-item">
		        <div class="mu-item-group">
					<label>장비</label>
		 			<div class="mu-selectbox">
                        <select id="selectedEquip" class="mu-value" onchange="changeSystemLine()">
                        </select>
                    </div>
                    <div class="mu-selectbox" id="divSystemLine" >
	                    <label>구분</label>
						<div class="mu-selectbox">
							<select id="selectedLine" class="mu-value"></select>
						</div>
					</div>
					<label>장비 명</label>
					<input type="text" id="equip_search">
		        </div>
				<!-- <div id="set_equipDiv">
					<label>장비 명</label>
					<input type="text" id="equip_search">
				</div> -->
		    </div>
		    <div class="mu-search-btn" style="height: inherit;">
		        <button type="button" id="btn_systemSearch" class="mu-btn mu-btn-icon mu-btn-search"><i class="mu-icon search"></i>조회</button>
		    </div>
		</div>
		
		<div class="listBox">
			<div class="inBox fl" style="width:500px; height: 250px">
				<table id="tb_unselected_searchSystem" class="mu-grid mu-grid-border mu-grid-strip" style="text-align: center;">
					<thead>
						<tr>
							<th>
								<div class="mu-checkbox">
					   				<input type="checkbox" id="chk_unselectHead">
					   				<label for="chk_unselectHead"></label>
					   			</div>
							</th>
							<th>구분</th>
							<th>장비 ID</th>
							<th>장비 명</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<button class="mu-btn btnAdd" onclick="javascript:addSearchSystemList()" type="button" style="left:515px;"><span>&gt;</span></button>
			<div class="inBox fr" style="width:500px; height: 250px">
				<table id="tb_selected_searchSystem" class="mu-grid mu-grid-border mu-grid-strip" style="text-align: center;">
					<thead>
						<tr>
							<th>
								<div class="mu-checkbox">
					   				<input type="checkbox" id="chk_selectHead">
					   				<label for="chk_selectHead"></label>
					   			</div>
							</th>
							<th>구분</th>
							<th>장비 ID</th>
							<th>장비 명</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<button class="mu-btn btnDel" onclick="javascript:deleteSearchSystemList()" type="button" style="left:515px;"><span>&lt;</span></button>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="btn_searchSystem_save" type="button" onkeydown="javascript:if (window.event.keyCode == 13) {javascript:saveSearchSystemList(); return false;}" onclick="javascript:saveSearchSystemList()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
        <button id="btn_searchSystem_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취 소</button>
    </div>
    <input id = "flag" type="hidden">
</div>
