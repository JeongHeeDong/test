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
	<script src="<c:url value="/resources/js/pss/code/alarm.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
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
							<button id="searchOpt_btn" class="mu-value" style="width:120px">선택</button>
							<ul id="searchOpt_ul" class="mu-list">
							</ul>
						</div>
						<input class="mu-input" id="searchWord" type="text" size="40"/>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getList(1)"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="alarmAddView()"><i class="mu-icon add"></i>추가</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="alarmModifyView()"><i class="mu-icon edit"></i>수정</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="deleteAlarm()"><i class="mu-icon del"></i>삭제</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
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
						<table id="alarmTable" class="mu-grid mu-grid-border mu-grid-strip" >
							<thead>
								<tr>
									<th style="width:50px">
										<input type="checkbox" id="alarmChk_all" onclick="allCheck()"/>
									</th>
									<th id="EQUIP_NAME"><span class="th_val">장비 명</span></th>
									<th id="ALARM_CODE"><span class="th_val">알람 CODE</span></th>
									<th id="PROBABLE_CAUSE"><span class="th_val">알람 CAUSE</span></th>
									<th id="ORG_SEVERITY_NAME"><span class="th_val">알람 등급</span></th>
									<th id="VENDOR_NAME"><span class="th_val">제조사 명</span></th>
									<th id="UPDATE_TIME"><span class="th_val">등록일</span></th>
								</tr>
							</thead>
							<tbody id="alarmGrid">		
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
	
	<div id="alarmAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="alarmAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 500px; height: 310px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
		<div id="alarmAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
			<h2><span class="title">알람정보 추가</span></h2>
			<button id="alarmAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div>
		<div class="mu-dialog-body">
			<table class="mu-formbox">
				<colgroup>
					<col width="120px">
					<col>
				</colgroup>
				<tbody>
					<tr>
						<th><label>알람 CODE</label></th>
						<td>
							<input type="text" name="ALARM_CODE" class="mu-input"/>
						</td>
					</tr>
					<tr>
						<th><label>알람 CAUSE</label></th>
						<td>
							<input type="text" name="PROBABLE_CAUSE" class="mu-input"/>
						</td>
					</tr>
					<tr>
						<th><label>알람 등급</label></th>
						<td>
							<div class="mu-selectbox">
								<button id ='ORG_SEVERITY_NAME' class="mu-value"></button>
								<ul name='org_severity_name_ul' class="mu-list">
								</ul>			
							</div>	
						</td>
					</tr>
					<tr>
						<th><label>장비 명</label></th>
						<td>
							<div class="mu-selectbox">
								<button id ='EQUIP_NAME' class="mu-value"></button>
								<ul id='equip_name_ul' class="mu-list">
								</ul>			
							</div>	
						</td>
					</tr>
					<tr>
						<th><label>제조사 명</label></th>
						<td>
							<div class="mu-selectbox">
								<button id ='VENDOR_NAME' class="mu-value"></button>
								<ul id='vendor_name_ul' class="mu-list">
								</ul>			
							</div>	
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="alarmAddSave" type="button"  class="mu-btn mu-pop-btn mu-btn-icon" onclick="insertalarm()"><i class="mu-icon save"></i>저장</button>
			<button id="alarmAddCancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</div>
	
	
	
	<div id="alarmMdfBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="alarmMdfUp" class="mu-dialog mu-fix-foot" style="display: none; width: 500px; height: 310px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
		<div id="alarmMdfTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
			<h2><span class="title">알람정보 수정</span></h2>
			<button id="alarmMdfClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div>
		<div class="mu-dialog-body">
			<table class="mu-formbox">
				<colgroup>
					<col width="120px">
					<col>
				</colgroup>
				<tbody>
					<tr>
						<th><label>알람 CODE</label></th>
						<td>
							<input type="text" name="ALARM_CODE" class="mu-input" disabled="disabled"/>
						</td>
					</tr>
					<tr>
						<th><label>알람 CAUSE</label></th>
						<td>
							<input type="text" name="PROBABLE_CAUSE" class="mu-input"/>
						</td>
					</tr>
					<tr>
						<th><label>알람 등급</label></th>
						<td>
							<div class="mu-selectbox">
								<button id ='ORG_SEVERITY_NAME' class="mu-value"></button>
								<ul name='org_severity_name_ul' class="mu-list">
								</ul>			
							</div>	
						</td>
					</tr>
					<tr>
						<th><label>장비 명</label></th>
						<td>
							<input type="text" name="EQUIP_NAME" class="mu-input" disabled="disabled"/>
						</td>
					</tr>
					<tr>
						<th><label>제조사 명</label></th>
						<td>
							<input type="text" name="VENDOR_NAME" class="mu-input" disabled="disabled"/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="alarmMdfSave" type="button"  class="mu-btn mu-pop-btn mu-btn-icon" onclick="modifyalarm()"><i class="mu-icon save"></i>저장</button>
			<button id="alarmMdfCancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</div>
	
</body>
</html>