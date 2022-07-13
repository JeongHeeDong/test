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
	<script src="/resources/js/system/sysDBManager.js"></script>
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
	            	 	<div class="mu-hgroup" style="display: none;" id="searchType" >
	            	 		<!-- <label>구분 선택</label> -->
		            	 	<div class="mu-radio">
								<input type="radio" name="typeRadio" id="hostRadio" value= 1 checked="checked">
								<label for="hostRadio">Host</label>
							</div>
							<div class="mu-radio">
								<input type="radio" name="typeRadio" id="tableRadio" value= 2>
								<label for="tableRadio">Table</label>
							</div>
						</div>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getBakData(1)"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon" onclick="dbAddView()"><i class="mu-icon add"></i>추가</button>
				 	<button type="button" class="mu-btn mu-btn-icon" onclick="updateView()"><i class="mu-icon edit"></i>수정</button>
				 	<button type="button" class="mu-btn mu-btn-icon" onclick="delBakData()"><i class="mu-icon del"></i>삭제</button>		
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<span class="lineY">
					 	<div id="listSizeOpstion" class="mu-selectbox">
							<select id="pageSize" class="mu-value" onchange="getBakData(1)">
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
					<div class="gridWrap mt10 gridScrollT">
						<table id="bakTable" class="mu-grid mu-grid-border mu-grid-strip" >
							<colgroup>
								<col style="width:6%" />
								<col style="width:18%" />
								<col style="width:10%" />
								<col style="width:34%" />
								<col style="width:10%" />
								<col style="width:10%" />
								<col />
							</colgroup>
							<thead>
								<tr>
									<th>
										<input type="checkbox" id="bakChk_all" onclick="allCheck()"/>
									</th>
									<th id="TABLE_NAME">이름</th>
									<th id="BACKUP_TYPE">구분</th>
									<th id="BACKUP_DESC">설명</th>
									<th id="BACKUP_DAY">백업주기(Day)</th>
									<th id="DATA_EXPIRE">보존기간(Day)</th>
									<th id="LAST_DATE">최종 백업 시간</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v scrollY" style="max-height:700px;">
						<table class="mu-grid mu-grid-border mu-grid-strip">
							<colgroup>
								<col style="width:6%" />
								<col style="width:18%" />
								<col style="width:10%" />
								<col style="width:34%" />
								<col style="width:10%" />
								<col style="width:10%" />
								<col />
							</colgroup>
							<tbody id="sysBakGrid">
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
	<%@ include file="/WEB-INF/views/system/sysDBpopup.jsp" %>
	
</body>
</html>