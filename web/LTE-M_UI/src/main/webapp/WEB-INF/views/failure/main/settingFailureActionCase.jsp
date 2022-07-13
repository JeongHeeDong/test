<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/failure/main/settingFailureActionCase.js"></script>
	<script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/paging.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/selectbox.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/dialog.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid_extend.js"></script>
</head>
<body style="min-width: 1040px;min-height: 600px;">
	<div class="mu-container" style="min-height: 500px">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="subtitleWrap" style="margin:10px 0 0px;">
				<h4 class="mu-title">고장 조치사례</h4>
			</div>
			<div class="mu-dialog-body">
				<div class="gridBtnWrap tr">
					<button id="addCase" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon add"></i>등록</button>
					<button id="modifyCase" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon edit"></i>수정</button>
					<button id="removeCase" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon del"></i>삭제</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excelExport()"><i class="mu-icon excel"></i>엑셀 저장</button>
				</div>
				<div class="gridScrollT gridWrap">
					<table id="headerTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2 tbFix">
						<colgroup>
							<col width="4%">
							<col width="11%">
							<col width="11%">
							<col width="11%">
							<col width="12%">
							<col width="12%">
							<col width="auto">
							<col width="13%">
							<col width="10%">
						</colgroup>
						<thead>
							<tr>
								<th>
									<div class='mu-checkbox'>
										<input type='checkbox' id='headcheck'>
										<label for='headcheck'></label>
									</div>
								</th>
								<th class='overTxt updown sort'><input type="hidden" value="EQUIP_LINE.LINE_NAME" />호선</th>
								<th class='overTxt updown sort'><input type="hidden" value="ac.ORG_SEVERITY" />등급</th>
								<th class='overTxt updown sort'><input type="hidden" value="eq.EQUIP_NAME" />장비타입</th>
								<th class='overTxt updown sort'><input type="hidden" value="aa.SYSTEM_ID" />장비ID</th>
								<th class='overTxt updown sort'><input type="hidden" value="aa.ALARM_CODE" />알람코드</th>
								<th class='overTxt'>조치내용</th>
								<th class='overTxt updown sort'><input type="hidden" value="aa.INSERT_DATE" />등록일</th>
								<th class='overTxt updown sort'><input type="hidden" value="aa.INSERT_USER" />등록자</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="gridWrap mu-scroll-v" style="height:300px;overflow-y: scroll;">
					<table id="tbodyTable" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip tbFix">
						<colgroup>
							<col width="4%">
							<col width="11%">
							<col width="11%">
							<col width="11%">
							<col width="12%">
							<col width="12%">
							<col width="auto">
							<col width="13%">
							<col width="10%">
						</colgroup>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
			<div class="mu-dialog-foot">
				<button id="action-case-ok" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
			</div>
		</section>
	</div>

	<!-- 조치사례 등록 팝업 레이어 -->
	<div>
		<div class="mu-dialog-background hidden"></div>
		<div class="mu-dialog hidden" id="dlg_addFailureActionCase" style="width:628px;top:1920px;">
			<div class="mu-dialog-head">
				<h2><span class="title" style="line-height: 200%;">장애 조치 방법 등록</span></h2>
				<button id="addFailureActionCaseClose" type="button" class="mu-btn mu-btn-icon btnClose btn-close"><i class="mu-icon-img cancel"></i></button>
			</div>
			<div class="mu-dialog-body">
				<h3 class="mu-title">장애 조치 방법</h3>
				<table class="mu-formbox">
					<colgroup>
						<col width="80px">
						<col width="">
					</colgroup>
					<tbody>
					<tr>
						<th>장비타입</th>
						<td>
							<div class="mu-item-group">
								<select id="equipType-add" name="equipType-create" class="mu-value" style="width:144px;">
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>장비ID</th>
						<td>
							<div class="mu-item-group">
								<select id="systemId-add" name="systemId-add" class="mu-value" style="width:144px;">
								</select>
								<div class="mu-selectbox" id="divSystemLine" >
			                    <label>호선</label>
								<div class="mu-selectbox">
									<select id="selectedLine" class="mu-value"></select>
								</div>
								</div>
							</div>
						</td>
						<!-- <td>호선</td>
						<td>
							<div class="mu-selectbox">
								<select id="selectedLine" class="mu-value"></select>
							</div>
						</td>			 -->				
					</tr>
					<tr>
						<th>알람코드</th>
						<td>
							<div class="mu-item-group">
								<input id="alarmCode-add" type="text" class="mu-input" readonly>
								<input type="hidden" id="alarmGrade-add" type="text" class="mu-input" readonly>
								<button id="alarmCodeBtn" type="button" class="mu-btn mu-btn-icon">선택</button>
							</div>
						</td>
					</tr>
					<tr>
						<th>조치내용</th>
						<td>
							<textarea id="actionCase-add" class="mu-area"></textarea>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="mu-dialog-foot">
				<button type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-yes"><i class="mu-icon save"></i>저장</button>
				<button type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-close mu-btn-cancel gray"><i class="mu-icon cancel"></i>취소</button>
			</div>
		</div>
	</div>

	<!-- 조치사례 수정 팝업 레이어 -->
	<div>
		<div class="mu-dialog-background hidden"></div>
		<div class="mu-dialog hidden" id="dlg_modFailureActionCase" style="width:628px;top:1920px;">
			<div class="mu-dialog-head">
				<h2><span class="title" style="line-height: 200%;">장애 조치 방법 수정</span></h2>
				<button id="modFailureActionCaseClose" type="button" class="mu-btn mu-btn-icon btnClose btn-close"><i class="mu-icon-img cancel"></i></button>
			</div>
			<div class="mu-dialog-body">
				<h3 class="mu-title">장애 조치 방법</h3>
				<table class="mu-formbox">
					<colgroup>
						<col width="80px">
						<col width="">
					</colgroup>
					<tbody>
					<tr>
						<th>장비타입</th>
						<td>
							<div class="mu-item-group">
								<input id="equipName-modify" type="text" class="mu-input" readonly>
								<input type="hidden" id="equipType-modify" type="text" class="mu-input" readonly>
							</div>
						</td>
					</tr>
					<tr>
						<th>장비ID</th>
						<td>
							<div class="mu-item-group">
								<input id="systemName-modify" type="text" class="mu-input" readonly>
								<input type="hidden" id="systemId-modify" type="text" class="mu-input" readonly>
							</div>
						</td>
					</tr>
					<tr>
						<th>알람코드</th>
						<td>
							<div class="mu-item-group">
								<input id="alarmCode-modify" type="text" class="mu-input" readonly>
								<input type="hidden" id="alarmGrade-modify" type="text" class="mu-input" readonly>
							</div>
						</td>
					</tr>
					<tr>
						<th>조치내용</th>
						<td>
							<textarea id="actionCase-modify" class="mu-area"></textarea>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="mu-dialog-foot">
				<button type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-yes"><i class="mu-icon save"></i>저장</button>
				<button type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-close mu-btn-cancel gray"><i class="mu-icon cancel"></i>취소</button>
			</div>
		</div>
	</div>

	<!-- 알람코드 선택 팝업 레이어 -->
	<div>
		<div class="mu-dialog-background hidden"></div>
		<div class="mu-dialog hidden" id="dlg_selectAlarmCode" style="width:628px;top:1920px;left:640px;">
			<div class="mu-dialog-head">
				<h2><span class="title" style="line-height: 200%;">알람 코드 선택</span></h2>
				<button id="selectAlarmCodeClose" type="button" class="mu-btn mu-btn-icon btnClose btn-close"><i class="mu-icon-img cancel"></i></button>
			</div>
			<div class="mu-dialog-body">
				<h3 class="mu-title">알람 코드 리스트</h3>
				<%--<div class="mu-search-group">--%>
					<%--<div class="mu-search-item">--%>
						<%--<div class="mu-item-group">--%>
							<%--<label>장비유형</label>--%>
							<%--<select id="equip_failureActionCaseSettingSub" name="equip_failureActionCaseSetting" class="mu-value" style="width:144px;">--%>
							<%--</select>--%>
						<%--</div>--%>
					<%--</div>--%>
				<%--</div>--%>
				<div class="gridWrap" style="height:163px;">
					<table id="alarmCode-table" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip">
						<thead>
						<tr>
							<th>적용</th>
							<th>등급</th>
							<th>알람코드</th>
							<th>장비종류</th>
							<th>알람Cause</th>
						</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
			<div class="mu-dialog-foot">
				<button type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-yes"><i class="mu-icon check"></i>확인</button>
				<button type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-close mu-btn-cancel gray"><i class="mu-icon cancel"></i>취소</button>
			</div>
		</div>
	</div>

	<div style="display:none;">
		<table id="excelTable" class="mu-grid">
			<thead>
			<tr>
				<th style='text-align:center'>등급</th>
				<th style='text-align:center'>장비타입</th>
				<th style='text-align:center'>장비ID</th>
				<th style='text-align:center'>알람코드</th>
				<th style='text-align:center'>조치내용</th>
				<th style='text-align:center'>등록일</th>
				<th style='text-align:center'>등록자</th>
			</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</body>
</html>