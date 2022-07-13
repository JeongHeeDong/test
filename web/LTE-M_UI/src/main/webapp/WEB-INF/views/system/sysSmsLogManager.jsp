<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/system/sysSmsLogManager.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>날짜</label>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_dt_from">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_dt_from_btn"><i class="mu-icon calendar"></i></button>
						</div>
						<span> ~ </span>
						<div class="mu-datepicker">
							<input readonly="readonly" type="text" id="search_dt_to">
							<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_dt_to_btn"><i class="mu-icon calendar"></i></button>
						</div>
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
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getSmsLogData(1)"><i class="mu-icon search"></i>검색</button>
					<button type="button" class="mu-btn mu-btn-icon green" onclick="excelDownload()"><i class="mu-icon excel"></i>엑셀 저장</button>
					<span class="lineY">
					 	<div id="listSizeOption" class="mu-selectbox">
							<select id="pageSize" class="mu-value" onchange="getSmsLogData(1)">
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
					<div class="gridWrap gridScrollT mt10">
						<table id="logTable" class="mu-grid mu-grid-border mu-grid-strip" >
							<colgroup id="headerGroup">
								<col width="8%">
								<col width="8%">
								<col width="15%">
								<col width="8%">
								<col width="7%">
								<col width="18%">
								<col />
							</colgroup>
							<thead>
								<tr>
									<th id="EVENT_TIME"><span class="th_val">날짜</span></th>
									<th id="USER_NAME"><span class="th_val">이름</span></th>
									<th id="TT_NUMBER"><span class="th_val">수신번호</span></th>
									<th id="EQUIP_TYPE"><span class="th_val">장비타입</span></th>
									<th id="ALARM_CODE"><span class="th_val">알람코드</span></th>
									<th id="ALRAM_NAME"><span class="th_val">알람이름</span></th>
									<%--<th id="SYSTEM_ID"><span class="th_val">수신시스템</span> <i class="mu-icon arrow-up" id="order_btn" onclick="ordering()"></i></th>--%>
									<th id="TT_MSG"><span class="th_val">수신내용</span></th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="border-top:0px; max-height:700px; overflow-y:scroll;">
						<table class="mu-grid mu-grid-border mu-grid-strip" >
							<colgroup id="bodyGroup">
								<col width="8%">
								<col width="8%">
								<col width="15%">
								<col width="8%">
								<col width="7%">
								<col width="18%">
								<col />
							</colgroup>
							<tbody id="sysSmsLogGrid">		
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
</body>
</html>