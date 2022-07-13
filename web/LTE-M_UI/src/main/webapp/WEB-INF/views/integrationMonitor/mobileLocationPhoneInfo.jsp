<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/integrationMonitor/mobileLocationPhoneInfo.js"></script>
<div id="failureDetailBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="failureDetailUp" class="mu-dialog" style="display: none; width: 830px; height:; left: 42%; top: 25%;z-index: 11">
    <div id="failureDetailTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">조치사례 및 고장상세정보</span></h2>
        <button id="failureDetailClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" style="overflow-y:auto;">
		<div class="mu-boxWrap">
			<div class="mu-boxRow">
				<div class="mu-boxCell" style="width:61%; height: 120px;">
					<h3 class="mu-title">고장정보</h3>
					<table class="mu-formbox">
						<tbody>
		                	<tr>
		                		<td>
									<div class="mu-item-group">
					            		<label>알람코드</label>
					             		<input type="text" class="mu-input fd_formInfo" id="fd_alarmCode" value="" style="width:65px" readonly />
					             		<label>발생장비</label>
					             		<input type="text" class="mu-input fd_formInfo" id="fd_equipType" value="" style="width:45px" readonly />
					             		<label>고장등급</label>
					             		<input type="text" class="mu-input fd_formInfo" id="fd_severity" value="" style="width:45px" readonly />
					             		<label>발생건수</label>
					             		<input type="text" class="mu-input fd_formInfo" id="fd_count" value="" style="width:45px" readonly />
					            	</div>
					            </td>
		                	</tr>
		               		<tr>
		               			<td>
					            	<div class="mu-item-group">
				            			<label>발생원인</label>
				            			<input type="text" class="mu-input fd_formInfo" id="fd_cause" value="" style="width:386px" readonly />	
					            	</div>
					            </td>
		                	</tr>
		               		<tr>
		               			<td>
					            	<div class="mu-item-group">
					             		<label>발생위치</label>
					             		<input type="text" class="mu-input fd_formInfo" id="fd_location" value="" style="width:386px" readonly />
				            		</div>
					            </td>
		                	</tr>
	               		</tbody>
	                </table>
				</div>
			</div>
		</div>
    </div>
</div>