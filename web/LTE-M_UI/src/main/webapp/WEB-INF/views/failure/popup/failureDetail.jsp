<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/failure/popup/failureDetail.js"></script>
<div id="failureDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="failureDetailUp" class="mu-dialog" style="display: none; width: 850px; left: 42%; top: 25%;z-index: 11">
    <div id="failureDetailTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">고장상세정보</span></h2>
        <button id="failureDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="failureDetailInfo" style="overflow-y:auto;">
    	<div class="mu-boxWrap" id="alarmActionCaseListDiv">
			<div class="mu-boxRow">
				<div class="mu-boxCell" id="recoverList">
				    <h3 class="mu-title">조치사례</h3>
					<div class="mu-grid-scroll mu-grid-border">
						<div class="mu-scroll-v" style="max-height: 65px">
							<table id="tb_alarmActionCase" class="mu-grid mu-grid-hover mu-grid-strip">
								<colgroup>
									<col width="10">
									<col width="10">
									<col width="10">
									<col width="10">
									<col width="10">
									<col width="10">
									<col width="10">
								</colgroup>
								<thead>
									<tr>
										<th>NO</th>
										<th>알람코드</th>
										<th>알람종류</th>
										<th>장비종류</th>
										<th>장비ID</th>
										<th>작성자</th>
										<th>작성시간</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mu-boxWrap">
			<div class="mu-boxRow">
				<div id="alarmActionCaseContentsDiv" class="mu-boxCell" style="width:66%; height: 120px;">
					<h3 class="mu-title">조치 내용</h3>
					<textarea id="alarmActionCaseContents"  style="width: 100%;height: inherit;resize: none;" readonly></textarea>
				</div>
				<div class="mu-boxCell" style="height: 120px;">
					<h3 class="mu-title">ALARM Message</h3>
					<textarea id="ropMessage" style="width: 100%;height: inherit;resize: none;" readonly></textarea>
					<!-- <button id="failureInfo" type="button" class="mu-btn">고장정보</button> -->
				</div>
			</div>
		</div>
		<div class="mu-boxWrap">
			<div class="mu-boxRow">
				<div class="mu-boxCell" style="width:66%;">
					<h3 class="mu-title">고장정보</h3>
					<table class="mu-formbox">
						<colgroup>
							<col width="80px">
							<col>
							<col width="80px">
							<col>
						</colgroup>
						<tbody>
							<tr>
								<th><label>알람코드</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_alarmCode" readonly /></td>
								<th><label>발생장비</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_equipType" readonly /></td>
							</tr>
							<tr>
								<th><label>고장등급</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_severity" readonly /></td>
								<th><label>발생건수</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_count" readonly /></td>
							</tr>
							<tr>
								<th><label>발생원인</label></th>
								<td colspan="3"><input type="text" class="mu-input fd_formInfo" id="fd_cause" readonly /></td>
							</tr>
							<tr>
								<th><label>발생위치</label></th>
								<td colspan="3"><input type="text" class="mu-input fd_formInfo" id="fd_location" readonly /></td>
							</tr>
							<tr>
								<th><label>발생시간</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_eventTime" readonly /></td>
								<th><label>갱신시간</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_updateTime" readonly /></td>
							</tr>
							<tr>
								<th><label>중요고장</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_majorFailure" readonly /></td>
								<th></th>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="mu-boxCell">
					<h3 class="mu-title">구성정보</h3>
					<table class="mu-formbox">
						<colgroup>
							<col width="80px">
							<col>
						</colgroup>
						<tbody>
							<tr>
								<th><label>시스템</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_systemId" readonly /></td>
							</tr>
							<tr>
								<th><label>장비명</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_systemName" readonly /></td>
							</tr>
							<tr>
								<th><label>운영파트</label></th>
								<td><input type="text" class="mu-input fd_formInfo" id="fd_team" readonly /></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="mu-hgroup mt20">
			<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:popupPrint()"><i class="mu-icon excel"></i>보고서 출력</button>
			<button type="button" class="mu-btn mu-btn-icon green" id="excelDownloadBtn"><i class="mu-icon excel"></i>엑셀 저장</button>
		</div>
    </div>
</div>
<div style="display:none;" id="printDiv">
	<div class="mu-boxWrap">
		<div class="mu-boxRow">
			<div class="mu-boxCell">
				<h3 class="mu-title">조치사례</h3>
				<div id="actionCaseTables">
					<table class="mu-formbox actionCaseTable">
						<tr>
							<td>
								<div class="mu-grid-scroll mu-grid-border ">
									<div class="mu-scroll-v" style="max-height: 65px">
										<table class="mu-grid mu-grid-hover mu-grid-strip actionCasePrint">
											<colgroup>
												<col width="10">
												<col width="10">
												<col width="10">
												<col width="10">
												<col width="10">
												<col width="10">
												<col width="10">
											</colgroup>
											<thead>
											<tr>
												<th>NO</th>
												<th>알람코드</th>
												<th>알람종류</th>
												<th>장비종류</th>
												<th>장비ID</th>
												<th>작성자</th>
												<th>작성시간</th>
											</tr>
											</thead>
											<tbody></tbody>
										</table>
										<table class="mu-grid mu-grid-hover mu-grid-strip actionCaseContentPrint">
											<thead>
											<tr>
												<th>조치내용</th>
											</tr>
											</thead>
											<tbody></tbody>
										</table>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="mu-boxWrap">
		<div class="mu-boxRow">
			<div class="mu-boxCell" style="width:61%; height: 120px;">
				<h3 class="mu-title">조치 내용</h3>
				<%--<textarea name="alarmActionCaseContentsPrint" class="textarea-size" id="alarmActionCaseContentsPrint" style="resize: none;line-height: 150%;width: 100%;overflow:visible;border: 1px solid #ccc;" readonly></textarea>--%>
				<table class="mu-formbox">
					<tr>
						<td>
							<div id="alarmActionCaseContentsPrint" contenteditable="true"></div>
						</td>
					</tr>
				</table>
				<%--<span id="alarmActionCaseContentsPrint" style="resize: none;line-height: 150%;width: 100%;"></span>--%>
			</div>
		</div>
	</div>
	<div class="mu-boxWrap">
		<div class="mu-boxRow">
			<div class="mu-boxCell">
				<h3 class="mu-title">ALARM Message</h3>
				<%--<textarea name="ropMessagePrint" class="textarea-size" id="ropMessagePrint" style="resize: none;line-height: 150%;width: 100%;overflow:visible;border: 1px solid #ccc;" readonly></textarea>--%>
				<table class="mu-formbox">
					<tr>
						<td>
							<div id="ropMessagePrint" contenteditable="true"></div>
						</td>
					</tr>
				</table>
				<%--<span id="ropMessagePrint" style="resize: none;line-height: 150%;width: 100%;"></span>--%>
			</div>
		</div>
	</div>
	<div class="mu-boxWrap">
		<div class="mu-boxRow">
			<div class="mu-boxCell" style="width:61%; height: 120px;">
				<h3 class="mu-title">고장정보</h3>
				<table class="mu-formbox">
					<tbody>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>알람코드: </label>
								<span id="fd_alarmCodePrint"  style="width:65px"></span>
							</div>
						</td>
					</tr>

					<tr>
						<td>
							<div class="mu-item-group">
								<label>발생장비: </label>
								<span id="fd_equipTypePrint"  style="width:45px"></span>
							</div>
						</td>
					</tr>

					<tr>
						<td>
							<div class="mu-item-group">
								<label>고장등급: </label>
								<span id="fd_severityPrint"  style="width:45px"></span>
							</div>
						</td>
					</tr>

					<tr>
						<td>
							<div class="mu-item-group">
								<label>발생건수: </label>
								<span id="fd_countPrint"  style="width:45px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>발생원인: </label>
								<span id="fd_causePrint"  style="width:220px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>발생위치: </label>
								<span id="fd_locationPrint"  style="width:220px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>발생시간: </label>
								<span id="fd_eventTimePrint" style="width:162px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>갱신시간: </label>
								<span id="fd_updateTimePrint" style="width:162px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>중요고장: </label>
								<span id="fd_majorFailurePrint"  style="width:56px"></span>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="mu-boxCell">
				<h3 class="mu-title">구성정보</h3>
				<table class="mu-formbox">
					<tbody>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>시스템: </label>
								<span id="fd_systemIdPrint"  style="width:220px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>장비명: </label>
								<span id="fd_systemNamePrint"  style="width:220px"></span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="mu-item-group">
								<label>운영파트: </label>
								<span id="fd_teamPrint"  style="width:220px"></span>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<iframe id="excelDownload" style='display: none;' ></iframe>