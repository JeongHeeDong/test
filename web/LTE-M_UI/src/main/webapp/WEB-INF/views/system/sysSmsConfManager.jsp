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
	<script src="/resources/js/system/sysSmsConfManager.js"></script>
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
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getConfData(1)"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="confAddView()"><i class="mu-icon add"></i>추가</button>
			 		<button type="button" class="mu-btn mu-btn-icon" onclick="updateView()"><i class="mu-icon edit"></i>수정</button>
			 		<button type="button" class="mu-btn mu-btn-icon" onclick="delConfData()"><i class="mu-icon del"></i>삭제</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<span class="lineY">
					 	<div id="listSizeOption" class="mu-selectbox">
							<select id="pageSize" class="mu-value" onchange="getConfData(1)">
								<option value="10">10개씩 보기</option>
								<option value="20" selected>20개씩 보기</option>
								<option value="50">50개씩 보기</option>
							</select>
						</div>
					</span>
				</div>
			</div>

			<div class="mu-row">
				<div class="mu-col mu-col-12">			
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="confTable" class="mu-grid mu-grid-border mu-grid-strip" style="text-align:center">
							<thead>
								<tr>
									<th style="width:50px">
										<input type="checkbox" id="confChk_all" onclick="allCheck()"/>
									</th>
									<th id="USER_ID">ID</th>
									<th id="SYSTEM_ID">수신시스템</th>
									<th id="TT_TIME" style="width:200px">수신시간</th>
									<th id="ALARM_CODE">알람Code</th>
									<th id="TT_NUMBER">수신번호</th>
								</tr>
							</thead>
							<tbody id="sysConfGrid">		
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
	<%@ include file="/WEB-INF/views/system/sysSmsConfPopup.jsp" %>
</body>
</html>