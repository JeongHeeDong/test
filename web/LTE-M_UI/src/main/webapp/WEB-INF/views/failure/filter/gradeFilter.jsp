<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<div id="gradeFilterBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="gradeFilterUp" class="mu-dialog" style="display: none; width: 620px; height: 820px; left: 42%; top: 10%;z-index: 11">
    <div id="gradeFilterTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">알람 등급 필터</span></h2>
        <button id="gradeFilterClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body">
    	<h3 class="mu-title">등급 설정 목록</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="100px">
				<col width="">
			</colgroup>
			<tbody>
				<tr>
					<th>빠른설정</th>
					<td>
						<button id="btn_gradeFt_all" type="button" class="mu-btn mu-btn-xs">All</button>
						<button id="btn_gradeFt_minor" type="button" class="mu-btn mu-btn-xs minor">Minor</button>
						<button id="btn_gradeFt_major" type="button" class="mu-btn mu-btn-xs major">Major</button>
						<button id="btn_gradeFt_critical" type="button" class="mu-btn mu-btn-xs critical">Critical</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div id="gradeFilterArea" class="mt5" >
			<table class="mu-formbox">
				<colgroup>
					<col width="140px">
					<col width="">
					<col width="140px">
					<col width="">
				</colgroup>
				<tbody id="gradefilterbody">
				</tbody>
			</table>
		</div>
	</div>
	<div class="mu-dialog-foot">
		<!-- <button id="btn_gradeFt_default" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel">기본값</button> -->
		<button id="btn_gradeFt_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
		<button id="btn_gradeFt_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	</div>
</div>
