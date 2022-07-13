<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<link rel="stylesheet" type="text/css" href="/resources/css/jstree.css" />
<script src="/resources/js/jstree.min.js"></script>

<div id="majorAlarmFilterBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="majorAlarmFilterUp" class="mu-dialog" style="display: none; width: 780px; height: 465px; left: 42%; top: 25%;z-index: 11">
    <div id="majorAlarmFilterTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">중요 알람 필터 설정</span></h2>
        <button id="majorAlarmFilterClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body">
		<div class="mu-boxWrap">
			<div class="mu-boxCell">
				<h3 class="mu-title">알람 코드 리스트</h3>
				<div class="mu-tree-box">
					<div id="majorAlarmFilterTree"></div>
				</div>
			</div>
			<div class="mu-boxCell">
				<h3 class="mu-title">설정된 알람 코드</h3>
				<div class="mu-list-box">
					<div id="selectedMajorAlarm">
						<div class="mu-scroll-v" style="min-height:273px;max-height:273px;">
							<table id="tb_majorAlarmFilter" class="mu-grid mu-grid-hover mu-grid-strip mu-grid-scroll mu-grid-border">
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
		<button id="btn_mjAlarmFt_allRemove" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel"><i class="mu-icon del"></i>전체삭제</button>
		<button id="btn_mjAlarmFt_remove" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel"><i class="mu-icon del"></i>삭제</button>
		<button id="btn_mjAlarmFt_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
		<button id="btn_mjAlarmFt_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	</div>
</div>
