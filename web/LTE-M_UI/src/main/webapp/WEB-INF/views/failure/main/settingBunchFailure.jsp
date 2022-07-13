<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/failure/main/settingBunchFailure.js"></script>
	<script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/paging.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/selectbox.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/dialog.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid_extend.js"></script>
</head>
<body style="min-width: inherit;min-height: inherit;">
	<div id="ajax_indicator" style="display: none">
		<i class="fa fa-spinner fa-5x fa-pulse" style="text-align: center;  left: 48%; top: 40%; position: absolute; z-index: 9999"></i>
	</div>
	<section>
		<%@ include file="/WEB-INF/views/title/title.jsp" %>
		<div class="mu-dialog-body">
			<h3 class="mu-title">다발 고장 리스트</h3>
			<div class="gridScrollT gridWrap">
				<table id="tb_bunchFailureSetting_header" class="mu-grid mu-grid-border mu-grid-strip">
					<colgroup>
						<col width="10%">
						<col width="15%">
						<col width="18%">
						<col width="auto">
						<col width="18%">
						<col width="18%">
					</colgroup>
					<thead>
						<tr>
							<th>적용</th>
							<th>장비타입</th>
							<th>알람코드</th>
							<th>다발코드</th>
							<th>등급</th>
							<th>건수</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="gridWrap mu-scroll-v" style="height:325px;overflow-y: scroll;">
				<table id="tb_bunchFailureSetting" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip">
					<colgroup>
						<col width="10%">
						<col width="15%">
						<col width="18%">
						<col width="auto">
						<col width="18%">
						<col width="18%">
					</colgroup>
					<tbody>
					</tbody>
				</table>
			</div>
			<div class="gridBtnWrap tr">
				<button id="add_bunchFailureSetting" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon add"></i>등록</button>
				<button id="edit_bunchFailureSetting" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon edit"></i>수정</button>
				<button id="del_bunchFailureSetting" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon del"></i>삭제</button>
			</div>
		</div>
		<div class="mu-dialog-foot">
			<button id="btn_settingBunchFailure_ok" type="button" class="mu-btn mu-pop-btn mu-btn-icon">확인</button>
			<button id="btn_settingBunchFailure_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray">취소</button>
		</div>
	</section>
</body>
</html>

<div>
	<div class="mu-dialog-background hidden"></div>
	
	<div class="mu-dialog hidden" id="dlg_addBunchFailure" style="width:388px;top:35px;left:85px;">
		<div class="mu-dialog-head">
			<h2><span class="title" style="line-height: 200%;">다발 고장 입력</span></h2>
			<button id="addBunchFailureClose" type="button" class="mu-btn mu-btn-icon btnClose btn-close"><i class="mu-icon-img cancel"></i></button>
		</div>
		<div class="mu-dialog-body">
			<h3 class="mu-title">다발 코드/등급 설정</h3>
			<table class="mu-formbox">
				<tbody>
					<tr>
						<th>다발코드</th>
						<td><input id="bunchCode_bunchCodeSetting" type="text" class="mu-input" readonly></td>
					</tr>
					<tr>
						<th>표시등급</th>
						<td>
							<div class="mu-selectbox">
								<select id="grade_bunchCodeSetting" name="grade_bunchCodeSetting" class="mu-value">
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
								</select>
							</div>
						</td>
					</tr>
					<!-- <tr>
						<th></th>
						<td>
							<div class="mu-checkbox">
								<input id="chCode" type="checkbox">
								<label for="chCode">다발 코드 적용</label>
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="2"><div class="infoTxt"><i class="mu-icon err"></i>아래 조건의 알람 발생시, 표시할 <span class="txt_org">알람 코드와 등급</span>을 설정</div></td>
					</tr> -->
				</tbody>
			</table>
			<h3 class="mu-title">알람 코드 선택 및 건수 설정</h3>
			<table class="mu-formbox">
				<tbody>
					<tr>
						<th>장비타입</th>
						<td>
							<div class="mu-selectbox">
								<select id="equip_bunchCodeSetting" name="equip_bunchCodeSetting" class="mu-value">
									<option value="" selected="selected"></option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>제조사</th>
						<td>
							<div class="mu-selectbox">
								<select id="vendor_bunchCodeSetting" name="vendor_bunchCodeSetting" class="mu-value">
									<option value="" selected="selected"></option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>알람코드</th>
						<td>
							<div class="mu-selectbox">
								<select id="alarmCode_bunchCodeSetting" name="alarmCode_bunchCodeSetting" class="mu-value">
									<option value="" selected="selected"></option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>알람건수</th>
						<td><input id="bunchCnt_bunchCodeSetting" type="number" min="0" class="mu-input" style="padding: 0 0 0 8px;"></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mu-dialog-foot">
			<button id="btn_addBunchFailure_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-yes">확인</button>
			<button id="btn_addBunchFailure_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon btn-close mu-btn-cancel gray">취소</button>
		</div>
	</div>
</div>

<script>

</script>