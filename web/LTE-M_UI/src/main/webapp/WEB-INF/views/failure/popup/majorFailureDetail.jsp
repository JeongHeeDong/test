<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/failure/popup/majorFailureDetail.js"></script>
<div id="majorFailureDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="majorFailureDetailUp" class="mu-dialog" style="display: none; width: 850px; height:; left: 42%; top: 25%;z-index: 11">
    <div id="majorFailureDetailTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">중요 고장 이력 조회</span></h2>
        <button id="majorFailureDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;">
    	<div class="mu-boxWrap">
	    	<div class="mu-boxRow">
	        	<div class="mu-boxCell">
	        		<h3 class="mu-title">중요 고장 알림 목록</h3>
					<div class="mu-grid-scroll mu-grid-border">
					    <div class="mu-scroll-v" style="max-height:170px" id="majorFailureDiv">
					        <table id="tb_majorFailureDetail" class="mu-grid mu-grid-hover mu-grid-strip">
					        	<colgroup>
					                <col width="10">
						            <col width="10">
						            <col width="15">
					                <col width="15">
						            <col width="20">
						            <col width="40">
					                <col width="30">
						            <col width="15">
					            </colgroup>
					            <thead>
						            <tr>
						            	<th>NO</th>
						                <th>등급</th>
						                <th>알람코드</th>
						                <th>장비종류</th>
						                <th>장비명</th>
						                <th>발생원인</th>
						                <th>발생시간</th>
						                <th>발생위치</th>
						            </tr>
						        </thead>
					            <tbody>
					               <%-- <% for(int i = 1; i< 10; i++){ %>
								    	<tr>
								    		<td><%=i %></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
									<%} %> --%>
					            </tbody>
					        </table>
						</div>
				    </div>
	       		</div>
	    	</div>
    	</div>
    	<div class="mu-boxWrap" id="actionCaseDiv">
	    	<div class="mu-boxRow">
	        	<div class="mu-boxCell">
	        		<h3 class="mu-title">조치사례</h3>
					<div class="mu-grid-scroll mu-grid-border">
						<div class="mu-scroll-v" style="max-height: 80px">
							<table id="tb_actionCase" class="mu-grid mu-grid-hover mu-grid-strip">
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
								<tbody>
									<%-- <% for(int i = 1; i< 10; i++){ %>
									    	<tr>
									    		<td><%=i %></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
											</tr>
										<%} %> --%>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mu-boxWrap" id="actionCaseContentDiv">
			<div class="mu-boxRow">
				<div class="mu-boxCell" style="height: 50px;">
					<h3 class="mu-title">조치사례 내용</h3>
					<textarea id="actionCaseContents" style="width: 100%;height: inherit;resize: none;" readonly></textarea>
				</div>
			</div>
		</div>
		<div class="mu-boxWrap">
			<div class="mu-boxRow">
				<div class="mu-boxCell" style="width: 66%;">
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
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_alarmCode" value="" readonly /></td>
								<th><label>발생장비</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_equipType" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>고장등급</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_severity" value="" readonly /></td>
								<th><label>발생건수</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_count" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>발생원인</label></th>
								<td colspan="3"><input type="text" class="mu-input mfd_formInfo" id="mfd_cause" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>발생위치</label></th>
								<td colspan="3"><input type="text" class="mu-input mfd_formInfo" id="mfd_location" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>발생시간</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_eventTime" value="" readonly /></td>
								<th><label>갱신시간</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_updateTime" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>수집시간</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_insertTime" value="" readonly /></td>
								<th><label>복구시간</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_recoverTime" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>중요고장</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_majorFailure" value="" readonly /></td>
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
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_systemId" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>장비명</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_systemName" value="" readonly /></td>
							</tr>
							<tr>
								<th><label>팀명</label></th>
								<td><input type="text" class="mu-input mfd_formInfo" id="mfd_team" value="" readonly /></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>