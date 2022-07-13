<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/pss/phone/phone.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>조회대상</label>
						<div class="mu-selectbox">
							<button id="searchOpt_btn" class="mu-value" style="width:95px">선택</button>
							<ul id="searchOpt_ul" class="mu-list">
							</ul>
						</div>
						<input class="mu-input" id="searchWord" type="text" size="40"/>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getList(1)"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="phoneAddView()"><i class="mu-icon add"></i>추가</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="phoneModifyView()"><i class="mu-icon edit"></i>수정</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="deletePhone()"><i class="mu-icon del"></i>삭제</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<div class="lineY">
						<button type="button" class="mu-btn mu-btn-icon" onclick="csvUploadView()"><i class="mu-icon upload"></i>CSV 업로드</button>
					</div>
					<div class="lineY">
						<div id="listSizeOption" class="mu-selectbox">
							<select id="pageSize" class="mu-value" onchange="getList(1)">
								<option value="10">10개씩 보기</option>
								<option value="20" selected>20개씩 보기</option>
								<option value="50">50개씩 보기</option>
							</select>
						</div>
					</div>
				</div>
			</div>			
			
			<div class="mu-row">				
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="phoneTable" class="mu-grid mu-grid-border mu-grid-strip" >
							<thead>
								<tr>
									<th style="width:50px">
										<input type="checkbox" id="phoneChk_all" onclick="allCheck()"/>
									</th>
									<th id="PHONE_NO"><span class="th_val">단말 번호</span></th>
									<th id="PHONE_TYPE"><span class="th_val">단말 구분</span></th>
									<th id="PHONE_USE_CODE_NAME"><span class="th_val">그룹명</span></th>
									<th id="PHONE_USE_NAME"><span>단말 사용명</span></th>
									<th id="MSISDN"><span class="th_val">MSISDN</span></th>
								</tr>
							</thead>
							<tbody id="phoneGrid">		
							</tbody>
						</table>
					</div><!-- //gridWarp -->
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">

					<div class="mu-pagination mt20">
						<button type="button" class="mu-first" onclick="javascript:pagingBtn('first')"><span></span></button>
						<button type="button" class="mu-prev"onclick="javascript:pagingBtn('prev')"><span></span></button>
						<ul id="page_Btn_No">
							<li class="active"><a href="">1</a></li>
						</ul>
						<button type="button" class="mu-next" onclick="javascript:pagingBtn('next')"><span></span></button>
						<button type="button" class="mu-last" onclick="javascript:pagingBtn('last')"><span></span></button>
						<input id ="totalCount" type="hidden" value="0">
						<input id="pageNo" type="hidden" value="1">
					</div><!-- //mu-pagination -->

				</div>
			</div>
		</section>
	</div>
	
	<div id="phoneAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="phoneAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 400px; height: 350px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
		<div id="phoneAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
			<h2><span class="title">단말 추가</span></h2>
			<button id="phoneAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div>
		<div class="mu-dialog-body">
			<table class="mu-formbox">
				<colgroup>
					<col width="120px">
					<col>
				</colgroup>
				<tbody>
					<tr>
						<th><label>단말 번호</label></th>
						<td>
							<input type="text" name="PHONE_NO" class="mu-input"/>
						</td>
					</tr>
					<tr>
						<th><label>단말 구분</label></th>
						<td>
							<div class="mu-selectbox">
								<button id="phoneTypeBtn" class="mu-value">휴대용</button>
								<ul id="phoneTypeUl" class="mu-list">
								</ul>
							</div>
						</td>
					</tr>
					<tr>
						<th><label>그룹명</label></th>
						<td>
							<div class="mu-selectbox">
								<button id="phoneUseCodeBtn" class="mu-value">선택</button>
								<ul id="phoneUseCodeUl" class="mu-list">
								</ul>
							</div>
						</td>
					</tr>
					<tr>
						<th><label>단말 사용명</label></th>
						<td>
							<input type="text" name="PHONE_USE_NAME" maxlength="40" class="mu-input"/>
						</td>
					</tr>
					<tr>
						<th><label>MSISDN</label></th>
						<td>
							<input type="text" name="MSISDN" maxlength="20" class="mu-input"/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="phoneAddSave" type="button"  class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
			<button id="phoneAddCancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</div>
	
	<div id="csvUploadBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="csvUploadUp" class="mu-dialog mu-fix-foot" style="display: none; width: 400px; height: 320px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
		<div id="csvUploadTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
			<h2><span class="title">CSV 업로드</span></h2>
			<button id="csvUploadClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div>
		<div class="mu-dialog-body">
			<table class="mu-formbox">
				<colgroup>
					<col width="120px">
					<col>
				</colgroup>
				<tbody>
					<tr>
						<th><label>단말 구분</label></th>
						<td>
							<div class="mu-selectbox">
								<button id="csvPhoneTypeBtn" class="mu-value">휴대용</button>
								<ul id="csvPhoneTypeUl" class="mu-list">
								</ul>
							</div>
						</td>
					</tr>
					<tr>
						<th><label>그룹명</label></th>
						<td>
							<div class="mu-selectbox">
								<button id="csvPhoneUseCodeBtn" class="mu-value">선택</button>
								<ul id="csvPhoneUseCodeUl" class="mu-list">
								</ul>
							</div>
						</td>
					</tr>
					<tr>
						<th><label>CSV 파일</label></th>
						<td>
							<div class="mu-file-attach">
								<input type="text" name="csvFileName" id="csvFileName" class="mu-input" readonly="readonly">
								<div class="mu-file-btn">
									<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon save"></i></button>
									<input type="file" id="csvFile" name="csvFile" class="mu-btn-hide" onchange="extValidCheck(this)">
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<button type="button" class="mu-btn mu-btn-icon" onclick="csvSampleDownload()"><i class="mu-icon download"></i>Sample 다운로드</button>
		</div>
		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="csvUploadSave" type="button" onclick="csvUploadSave();"  class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
			<button id="csvUploadCancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</div>
</body>
</html>