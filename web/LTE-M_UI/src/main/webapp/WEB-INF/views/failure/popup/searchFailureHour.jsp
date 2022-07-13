<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script>
</script>
<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css"> -->
<!-- <link rel="stylesheet" href="/resources/css/jquery-ui.css"> -->
<script src="/resources/lib/jquery-ui.js"></script>
<div id="searchFailureHourBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="searchFailureHourUp" class="mu-dialog mu-fix-foot" style="width: 440px; height: 280px;z-index: 13; display: none;"><!-- resize 부분 -->

	<div id="searchFailureHourTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">고장 시간 선택</span></h2>
        <button id="searchFailureHourClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
	<div class="mu-dialog-body">
		<h3 class="mu-title">고장시간</h3>
		<table class="mu-formbox">
			<tbody>
				<tr>
					<td>
						<div class="mu-radio">
							<input type="radio" name="rd_search_failureTime" id="rd_failureTime_all" value="all" checked="checked">
							<label for="rd_failureTime_all">전체</label>
						</div>
					<td>
					<td>
						<div class="mu-radio">
							<input type="radio" name="rd_search_failureTime" id="rd_failureTime_sec" value="sec">
							<label for="rd_failureTime_sec"></label>
						</div>
						<input id="spinner_failureTime_sec" name="spinner_failureTime" style="width: 30px;">초 이상
					</td>
					<td>
						<div class="mu-radio">
							<input type="radio" name="rd_search_failureTime" id="rd_failureTime_min" value="min">
							<label for="rd_failureTime_min"></label>
						</div>
						<input id="spinner_failureTime_min" name="spinner_failureTime" style="width: 30px;">분 이상
					</td>
				</tr>
			</tbody>
		</table>
		<h3 class="mu-title"></h3>
		<table class="mu-formbox">
			<tbody>
				<tr>
					<td>
						<div class="mu-checkbox">
							<input type="checkbox" id="chk_failureTime">
							<label for="chk_failureTime"></label>
						</div>
						<input id="spinner_failureTime_hour" name="spinner_failureTime_hour" style="width: 30px;">시간 이내
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="mu-dialog-foot">
		<button id="searchFailureHourOk" type="button" class="mu-btn mu-pop-btn">확인</button>
        <button id="searchFailureHourCancel" type="button" class="mu-btn">취 소</button>
	</div>
</div>
		        
