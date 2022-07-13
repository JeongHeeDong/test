<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="<c:url value="/resources/js/pss/du_ru/duSearch.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="mu-search-group"><!-- // 다단 검색폼을 사용할 경우 해당 태그에  mu-more-item  클래스를 추가해주시면 됩니다. -->
						<div class="mu-search-item">
							<div class="mu-item-group">
<!-- 								<label>구분</label>
								<div class="mu-selectbox">
									<button id="line_id" class="mu-value">전체</button>
									<ul id="line_ul" class="mu-list" style="max-height:150px;">
									</ul>
								</div> -->
								<!-- <label>EMS Name</label> -->
								<div class="mu-selectbox" style="display:none">
									<button id="ems_enb_name" class="mu-value">전체</button>
									<ul id="ems_enb_ul" class="mu-list" >
										<li value="all">전체</li>
										<li value="ems#1">EMS#1</li>
									</ul>
								</div>
								
								<label>DU ID</label>
								<input id="du_value" type="text" class="mu-input">
								
								<label>DU 명</label>
								<input id="du_name_value" type="text" class="mu-input">
							</div>
						</div><!-- //mu-search-item -->
						<div class="mu-search-btn">
							<!-- <button id="Detail_Btn" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon up"></i>상세조건</button> -->
							<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:btnSearchClick()"><i class="mu-icon search"></i>검색</button>
							<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:duAddView()"><i class="mu-icon add"></i>추가</button>
							<div class="lineY">
								<div id="listSizeOpstion" class="mu-selectbox">
									<select id="pageSize" class="mu-value">
										<option value=10>10개씩 보기</option>
										<option value=20 selected>20개씩 보기</option>
										<option value=50>50개씩 보기</option>
									</select>
								</div>
							</div>
						</div>
					</div>				
					<!-- 노선추가할때 '상세조건' 삭제 -->	
					<%-- <div id='Detail_Con' class="mu-search-group mu-more-item" style="display: none;">
					    <div class="mu-search-item">
					        <table>
					        	<colgroup>
									<col width="12%">
									<col width="auto">
									<col width="12%">
									<col width="auto">
								</colgroup>
					            <tbody>
					            <tr>
					                <th><label>DU 명</label></th>
					                <td>
					                    <div class="mu-selectbox">
					                        <button id="du_dropdown_text" class="mu-value">전체</button>
					                        <ul id='du_ul' class="mu-list">
					                            <li value="all">전체</li>
					                            <li value="DU#1">DU#1</li>
					                        </ul>
					                    </div>
					                </td>
					                <th>C_UID</th>
					                <td>
					                    <input id="c_uid_value" type="text" class="mu-input">
					                </td>
					            </tr>
					            <tr>
					                <th>VLAN</th>
					                <td>
					                    <input id="vlan_value" type="text" class="mu-input">
					                </td>
					                <th>MCType</th>
					                <td>
					                    <input id="mcType_value" type="text" class="mu-input">
					                </td>
					            </tr>
					            <tr>
					                <th>SWITCH</th>
					                <td>
					                    <input id="switch_value" type="text" class="mu-input">
					                </td>
					            </tr>
					        </tbody></table>
					    </div>
					    <div class="mu-search-btn">
					    	<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:btnSearchClick()"><i class="mu-icon search"></i>검색</button>
					    </div>
					</div> --%>
				
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap gridScrollT mt10">
						<table id='table' class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="3%">
								<col width="6%">
								<col width="6%">
								<col width="6%">
								<col width="9%">
								<col>
							</colgroup>
							<thead>
								<tr>
									<th>No</th>
									<th>CUID</th>
									<!-- <th>EMS 명</th> -->
									<th>DU ID</th>
									<th>DU 명</th>
									<th>구분</th>
									<!-- <th>역사 명</th> -->
									<th>운용 Cell 수</th>
									<th>Serial No</th>
									<th>Master IP</th>
									<th>Master IP2</th>
									<th>EMS IP</th>
									<th>갱신일자</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="max-height: 691px; overflow-y:scroll;">
						<table class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col width="3%">
								<col width="6%">
								<col width="6%">
								<col width="6%">
								<col width="9%" >
								<col>
							</colgroup>
							<tbody id="duSearchGrid">
							</tbody>
						</table>
					</div><!-- //gridWarp -->

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
			
			<%@ include file="/WEB-INF/views/pss/du_ru/duDetail.jsp" %>
			<%@ include file="/WEB-INF/views/pss/du_ru/duAdd.jsp" %>
			<%@ include file="/WEB-INF/views/pss/du_ru/ruDetail.jsp" %>
			</section>
		</div>
</body>
</html>