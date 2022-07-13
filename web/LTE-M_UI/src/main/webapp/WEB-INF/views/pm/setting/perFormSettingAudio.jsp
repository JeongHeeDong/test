
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/pm/setting/perFormSettingAudio.js"></script>
</head>
<body style="min-width: inherit;min-height: inherit;">
	<div id="ajax_indicator" style="display: none">
		<i class="fa fa-spinner fa-5x fa-pulse" style="text-align: center;  left: 48%; top: 40%; position: absolute; z-index: 9999"></i>
	</div>
	<section>
		<%@ include file="/WEB-INF/views/title/title.jsp" %>
	<!-- <div class="mu-dialog" style="width:628px;height:;top:1480px;">
		<div class="mu-dialog-head">
			<h2><span class="title">가청 설정</span></h2>
			<button id="mmeAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div> -->
		<div class="mu-dialog-body">
			<form id="uploadAudioForm" action="/pm/setting/perFormSettingAudio/ajaxUploadFile" method="post" enctype="multipart/form-data">
				<table class="mu-formbox" style="display: none;">
					<tbody>
						<tr>
							<td>
								<div class="mu-search-item">
									<div class="mu-item-group">
										<label>가청 적용 범위</label>
										<select id="monitorType_settingAudio" name="monitorType_settingAudio" class="mu-value" style="width:100px;" onchange="initialAudioForm()">
											<option value="1" selected="selected">성능</option>
											<option value="2">고장</option>
										</select>
									</div>
									<!-- <div class="mu-item-group">
										<div class="mu-checkbox">
											<input id="" type="checkbox">
											<label for="">최한시 가청 제외</label>
										</div>
									</div> -->
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<h3 class="mu-title">등급별 설정</h3>
				<table id="tb_audioSetting" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip">
					<colgroup>
						<col width="5%">
						<col width="5%">
						<col width="15%">
						<col width="auto">
						<col width="10%">
						<col width="10%">
						<col width="10%">
					</colgroup>
					<thead>
						<tr>
							<th>No</th>
							<th>적용</th>
							<th>등급</th>
							<th>가청파일</th>
							<th>파일등록</th>
							<th>미리듣기</th>
							<th>볼륨설정</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="tc">1</td>
							<td class="tc">
								<div class="mu-checkbox">
									<input id="chk_audio1" name="chk_critical" type="checkbox" value="critical">
									<label for="chk_audio1"></label>
								</div>
							</td>
							<td><i class="mu-icon alram critical"></i><span>CRITICAL</span></td>
							<td>
								<span id="audioFileNameCritical"></span>
								<input type="hidden" name="fileName_critical" value="" />
							</td>
							<td class="tc">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="fileInputClick('Critical');"><i class="mu-icon save"></i></button>
								<!-- <form id="uploadAudioFormCritical" action="/failure/setting/audioSetting/ajaxUploadFile" method="post" enctype="multipart/form-data"> -->
									<div style="height:0px;overflow:hidden">
										<input type="file" id="audioFileInputCritical" name="audioFileInput_critical" onchange="setAudioFile('Critical', this);" style="width: 100px;" />
										<audio id="audioElementCritical"></audio>
									</div>
								<!-- </form> -->
							</td>
							<td class="tc">
								<button id="audioPlayCritical" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon volume-up"></i></button>
							</td>
							<td class="tr"><input type="number" id="volumeLevelCritical" name="volumeLevel_critical" min=0 max=100 value=10 class="mu-input" style="padding: 0 0 0 4px;"></td>
						</tr>
						<tr>
							<td class="tc">2</td>
							<td class="tc">
								<div class="mu-checkbox">
									<input id="chk_audio2" name="chk_major" type="checkbox" value="major">
									<label for="chk_audio2"></label>
								</div>
							</td>
							<td><i class="mu-icon alram major"></i><span>MAJOR</span></td>
							<td>
								<span id="audioFileNameMajor"></span>
								<input type="hidden" name="fileName_major" value="" />
							</td>
							<td class="tc">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="fileInputClick('Major');"><i class="mu-icon save"></i></button>
								<!-- <form id="uploadAudioFormMajor" action="/failure/setting/audioSetting/ajaxUploadFile" method="post" enctype="multipart/form-data"> -->
									<div style="height:0px;overflow:hidden">
										<input type="file" id="audioFileInputMajor" name="audioFileInput_major" onchange="setAudioFile('Major', this);" style="width: 100px;" />
										<audio id="audioElementMajor"></audio>
									</div>
								<!-- </form> -->
							</td>
							<td class="tc">
								<button id="audioPlayMajor" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon volume-up"></i></button>
							</td>
							<td class="tr"><input type="number" id="volumeLevelMajor" name="volumeLevel_major" min=0 max=100 value=10 class="mu-input" style="padding: 0 0 0 4px;"></td>
						</tr>
						<tr>
							<td class="tc">3</td>
							<td class="tc">
								<div class="mu-checkbox">
									<input id="chk_audio3" name="chk_minor" type="checkbox" value="minor">
									<label for="chk_audio3"></label>
								</div>
							</td>
							<td><i class="mu-icon alram minor"></i><span>MINOR</span></td>
							<td>
								<span id="audioFileNameMinor"></span>
								<input type="hidden" name="fileName_minor" value="" />
							</td>
							<td class="tc">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="fileInputClick('Minor');"><i class="mu-icon save"></i></button>
								<!-- <form id="uploadAudioFormMinor" action="/failure/setting/audioSetting/ajaxUploadFile" method="post" enctype="multipart/form-data"> -->
									<div style="height:0px;overflow:hidden">
										<input type="file" id="audioFileInputMinor" name="audioFileInput_minor" onchange="setAudioFile('Minor', this);" style="width: 100px;" />
										<audio id="audioElementMinor"></audio>
									</div>
								<!-- </form> -->
							</td>
							<td class="tc">
								<button id="audioPlayMinor" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon volume-up"></i></button>
							</td>
							<td class="tr"><input type="number" id="volumeLevelMinor" name="volumeLevel_minor" min=0 max=100 value=10 class="mu-input" style="padding: 0 0 0 4px;"></td>
						</tr>
						<!-- <tr>
							<td class="tc">4</td>
							<td class="tc">
								<div class="mu-checkbox">
									<input id="chk_audio4" name="chk_warning" type="checkbox" value="warning">
									<label for="chk_audio4"></label>
								</div>
							</td>
							<td><i class="mu-icon alram warning"></i><span>WARNING</span></td>
							<td>
								<span id="audioFileNameWarning"></span>
								<input type="hidden" name="fileName_warning" value="" />
							</td>
							<td class="tc">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="fileInputClick('Warning');"><i class="mu-icon save"></i></button>
								<form id="uploadAudioFormWarning" action="/failure/setting/audioSetting/ajaxUploadFile" method="post" enctype="multipart/form-data">
									<div style="height:0px;overflow:hidden">
										<input type="file" id="audioFileInputWarning" name="audioFileInput_warning" onchange="setAudioFile('Warning', this);" style="width: 100px;" />
										<audio id="audioElementWarning"></audio>
									</div>
								</form>
							</td>
							<td class="tc">
								<button id="audioPlayWarning" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon volume-up"></i></button>
							</td>
							<td class="tr"><input type="number" name="volumeLevel_warning" min="0" class="mu-input" style="padding: 0 0 0 4px;"></td>
						</tr> -->
					</tbody>
				</table>
			</form>
		</div>
		<div class="mu-dialog-foot">
			<button id="btn_settingAudio_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
			<button id="btn_settingAudio_close" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</section>
</body>
</html>