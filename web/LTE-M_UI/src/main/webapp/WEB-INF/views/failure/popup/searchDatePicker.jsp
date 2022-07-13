<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script>
</script>
<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css"> -->
<link rel="stylesheet" href="/resources/css/jquery-ui.css">
<script src="/resources/lib/jquery-ui.js"></script>
<div id="searchDatePickerBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="searchDatePickerUp" class="mu-dialog mu-fix-foot" style="width: 320px; height: 400px;z-index: 13; display: none;"><!-- resize 부분 -->	

	<div id="searchDatePickerTitle" class="mu-dialog-head">
    	<h2><span class="title">특정일자제외</span></h2>
        <button id="searchDatePickerClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
	<div class="mu-dialog-body">
		<!-- <div class="mu-datepicker">
		</div> -->
		<div class="mu-datepicker">
			<input readonly="readonly" type="text" id="search_spDate">
			<!-- <button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_except_day_btn"><i class="mu-icon calendar"></i></button> -->
		</div>
	</div>
	<div class="mu-dialog-foot">
		<button id="btn_datePicker_ok" type="button" onclick="" class="mu-btn mu-pop-btn">확인</button>
        <button id="btn_datePicker_cancel" type="button" class="mu-btn">취 소</button>
	</div>
</div>