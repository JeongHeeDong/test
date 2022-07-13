<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<link rel="stylesheet" type="text/css" href="/resources/css/jstree.css" />
<script src="/resources/js/jstree.min.js"></script>

<div id="codeFilterBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="codeFilterUp" class="mu-dialog" style="display: none; width: 780px; height: 465px; left: 42%; top: 25%;z-index: 11">
	<div id="codeFilterTitle" class="mu-dialog-head">
		<h2><span class="title" style="line-height: 200%;">알람 코드 필터 설정</span></h2>
		<button id="codeFilterClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
	</div>
	<div class="mu-dialog-body">
		<div class="mu-boxWrap">
			<div class="mu-boxCell">
				<h3 class="mu-title">알람 코드 리스트</h3>
				<div class="mu-tree-box">
					<div id="codeFilterTree"></div>
				</div>
			</div>
			<div class="mu-boxCell">
				<h3 class="mu-title">설정된 알람 코드</h3>
				<div class="mu-list-box">
					<div class="p5">
						<div class="mu-vgroup">
							<div class="mu-radio">
								<input type="radio" id="rd1" name="radioAlarmCode" value="Y" checked="checked">
								<label for="rd1">아래 설정된 알람코드만 보임</label>
							</div>
							<div class="mu-radio">
								<input type="radio" id="rd2" name="radioAlarmCode" value="N">
								<label for="rd2">아래 설정된 알람코드만 보이지 않음</label>
							</div>
							<div class="mu-radio">
								<input type="radio" id="rd3" name="radioAlarmCode" value="">
								<label for="rd3">일시사용중지 : 알람코드필터 사용을 중지합니다</label>
							</div>
						</div>
						<!-- <label><input type="radio" id="rd1" name="radioAlarmCode" value="Y" checked />아래 설정된 알람코드만 보임 <br/></label>
						<label><input type="radio" id="rd2" name="radioAlarmCode" value="N" />아래 설정된 알람코드만 보이지 않음 <br/></label>
						<label><input type="radio" id="rd3" name="radioAlarmCode" value="" />일시사용중지 : 알람코드필터 사용을 중지합니다 <br/></label> -->
					</div>
					<div id="selectedAlarmCode">
						<div class="mu-scroll-v" style="min-height:200px;max-height:200px;">
							<table id="tb_alarmCodeFilter" class="mu-grid mu-grid-hover mu-grid-strip mu-grid-scroll mu-grid-border">
								<colgroup>
									<col width="10">
									<col width="10">
									<col width="10">
									<col width="10">
								</colgroup>
								<thead>
									<tr>
										<th>구분</th>
										<th>장비</th>
										<th>알람코드</th>
										<th>CAUSE</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="mu-dialog-foot">
		<button id="btn_codeFt_allRemove" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel"><i class="mu-icon del"></i>전체삭제</button>
		<button id="btn_codeFt_remove" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel"><i class="mu-icon del"></i>삭제</button>
		<button id="btn_codeFt_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
		<button id="btn_codeFt_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	</div>
</div>
