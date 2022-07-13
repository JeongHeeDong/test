<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<link rel="stylesheet" type="text/css" href="/resources/css/jstree.css" />
<script src="/resources/js/jstree.min.js"></script>

<div id="stationFilterBg" class="mu-dialog-background" style="display: none; z-index: 10"></div>
<div id="stationFilterUp" class="mu-dialog" style="display: none; width: 900px; height: 465px; left: 42%; top: 25%; z-index: 11">
	<div id="stationFilterTitle" class="mu-dialog-head">
		<h2><span class="title" style="line-height: 200%;">역사별 필터 설정</span></h2>
		<button id="stationFilterClose" type="button" class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="mu-icon-img cancel"></i></button>
	</div>
	<div class="mu-dialog-body">
		<div class="mu-boxWrap">
			<div class="mu-boxCell">
				<h3 class="mu-title">역사 리스트</h3>
				<div class="mu-tree-box">
					<div id="stationFilterTree"></div>
				</div>
			</div>
			<div class="mu-boxCell" style="width: 550px;">
				<h3 class="mu-title">선택된 역사(제외)</h3>
				<div class="mu-list-box">
					<div id="selectedStation">
						<div class="mu-scroll-v" style="min-height: 273px; max-height: 273px;">
							<table id="tb_stationFilter" class="mu-grid mu-grid-hover mu-grid-strip mu-grid-scroll mu-grid-border">
								<colgroup>
									<col width="10">
									<col width="40">
									<col width="40">
								</colgroup>
								<thead>
									<tr>
										<th>NO</th>
										<th>호선</th>
										<th>역사명</th>
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
		<button id="btn_stationFt_allRemove" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel"><i class="mu-icon del"></i>전체삭제</button>
		<button id="btn_stationFt_remove" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel"><i class="mu-icon del"></i>삭제</button>
		<button id="btn_stationFt_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
		<button id="btn_stationFt_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	</div>
</div>