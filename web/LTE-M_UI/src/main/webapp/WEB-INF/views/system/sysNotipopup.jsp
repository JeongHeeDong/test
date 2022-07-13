<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/system/sysNotipopup.js"></script>
<%-- <form id="fileUploadForm" action="/system/insertNoti" method="post" enctype="multipart/form-data"> --%>
    <form id="fileUploadForm" action="/system/insertNoti" method="post">		
	<div id="notiAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="notiAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 700px; height: 500px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
	    <div id="notiAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
	        <h2><span class="title">공지사항 추가</span></h2>
	        <button id="notiAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
	    </div>
	    <div class="mu-dialog-body" id="dbAddDiv">
	    	<table class="mu-formbox">
				<colgroup>
					<col width="120px">
					<col>
				</colgroup>
				<tbody>
					<tr>
						<th><label>제목</label></th>
						<td>
							<input type="text" id="noti_subject" name="subject" class="mu-input"/>
						</td>
					</tr>
                    <tr>
                        <th><label>공지 기간</label></th>
                        <td>
	                        <div class="mu-datepicker">
	                            <input type="text" readonly="readonly" id="notice_dt_from" name="noticeFrom">
	                            <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" id="notice_dt_from_btn"><i class="mu-icon calendar"></i></button>
	                        </div>
	                        <span>~</span>
	                        <div class="mu-datepicker">
	                            <input type="text" readonly="readonly" id="notice_dt_to" name="noticeTo">
	                            <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" id="notice_dt_to_btn"><i class="mu-icon calendar"></i></button>
	                        </div>
                        </td>
                    </tr>		
                    <tr>
                        <th><label>메인 공지 여부</label></th>
                        <td>
                            <input type="checkbox" id="mainNotice" name="mainNotice" />
                        </td>
                    </tr>   			
					<tr>
						<th><label>내용</label></th>
						<td>
							<textarea class="mu-area" id="noti_content" name="content" rows="13" ></textarea>
						</td>
					</tr>
                    <%--
					<tr>
						<th><label>파일 첨부</label></th>
						<td>
							<div class="mu-file-attach">
								<input type="text" name="fileName" id="fileName" class="mu-input" readonly="readonly">
								<div class="mu-file-btn">
									<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon save"></i></button>
									<input type="file" id="file" name="file_obj" class="mu-btn-hide" onchange="extValidCheck(this)">
								</div>
							</div>
							<span id="originFile" class="hidden" style="cursor:pointer;color:blue"></span>
							<i class="mu-icon cancel hidden" id="fileDelBtn" style="color:red;margin-left:5px;cursor:pointer" onclick="deleteFile()"></i>
						</td>
					</tr>
					 --%>
					 <input type="hidden" id="selectedId" name="selectedId" />
                     <input type="hidden" id="selectedTime" name="selectedTime"/>
                     <input type="hidden" name="originFile"/>
				</tbody>
			</table>
	    </div>
	    <div class="mu-dialog-foot" style="text-align: center;">
	        <button id="notiAddSave" type="button"  class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
	        <button id="notiAddCancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	    </div>
	</div>
</form>