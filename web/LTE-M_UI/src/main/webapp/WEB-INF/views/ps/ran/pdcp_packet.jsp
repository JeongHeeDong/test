<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>


<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
    <script type="text/javascript" src="/resources/lib/lodash.min.js"></script>
    <!-- for modal dialog -->
    <script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/paging.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/selectbox.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/dialog.js"></script>
    <script type="text/javascript" src="/resources/js/ps/common/components/grid_extend.js"></script>
    
    <script src="<c:url value="/resources/js/ps/ran/pdcp_packet.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
	
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="mu-search-group mu-more-item">
						<div class="mu-search-item">
							<table id='search_estab'>
								<colgroup>
									<col width="147px">
									<col width="100px">
									<col width="150px">
									<col width="150px">
									<col width="150px">
									<col width="*">
								</colgroup>
								<tbody>
									<tr>
										<td>
											<button id='search_du_btn' type="button" class="mu-btn mu-btn-icon"><i class="mu-icon search"></i>조회대상</button>
										</td>
										<td colspan="5">
											<input id='search_du' type="text" class="mu-input" readonly="readonly">
                                            <input id='search_du_hidden' type="hidden" class="mu-input"> 
										</td>
									</tr>
									<tr>
										<td>
											<div class="mu-vgroup">
												<div class="mu-datepicker">
													<input readonly="readonly" type="text" id="search_dt_from">
													<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_dt_from_btn"><i class="mu-icon calendar"></i></button>
												</div>
												<span>~</span>
												<div class="mu-datepicker">
													<input readonly="readonly" type="text" id="search_dt_to">
													<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_dt_to_btn"><i class="mu-icon calendar"></i></button>
												</div>
											</div>
										</td>
										<td>
											<div class="mu-vgroup">
												<div class="mu-radio">
													<input type="radio" id="r1" name="search_cal" value="sum" checked="checked">
													<label for="r1">합계</label>
												</div>
												<div class="mu-radio">
													<input type="radio" id="r2" name="search_cal" value="day">
													<label for="r2">일평균</label>
												</div>
												<div class="mu-radio">
													<input type="radio" id="r3" name="search_cal" value="hour">
													<label for="r3">시평균</label>
												</div>
											</div>
										</td>
										<td>
											<div class="mu-vgroup">
												<div class="mu-checkbox">
                                                    <input id="search_time" type="checkbox"> 
													<label for="search_time">시간지정</label>
												</div>
												<div class="mu-datepicker">
													<input readonly="readonly" type="text" class="mu-input" id="search_hour"/>
													<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" id='search_hour_btn'><i class="mu-icon clock"></i></button>
												</div>
											</div>
										</td>
										<td>
											<div class="mu-vgroup">
												<div class="mu-checkbox">
													<input id="except_day" type="checkbox">
													<label for="except_day">특정일자제외</label>
												</div>
												<div class="mu-datepicker">
													<input readonly="readonly" type="text" id="search_except_day">
													<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="search_except_day_btn"><i class="mu-icon calendar"></i></button>
												</div>
											</div>
										</td>
										<td>
											<div class="mu-vgroup">
												<div class="mu-checkbox">
													<input id="search_trend_day" type="checkbox">
													<label for="search_trend_day">일간추세소통</label>
												</div>
												<div class="mu-checkbox">
													<input id="search_trend_hour" type="checkbox">
													<label for="search_trend_hour">시간추세소통</label>
												</div>
												<div class="mu-checkbox">
													<input id="search_system" type="checkbox">
													<label for="search_system">개별시스템별</label>
												</div>
											</div>
										</td>
										<td>
											<div class="mu-vgroup">
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="mu-search-btn" >
							<div class="mu-vgroup">
								<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:analSearchClick()"><i class="mu-icon search"></i>조회</button>
                                <button type="button" class="mu-btn mu-btn-icon green" onclick="javascript:excel_download()"><i class="mu-icon excel"></i>엑셀저장</button>
								<c:choose>
                                	<c:when test="${fn:length(package_List) == 0}">
                                		<div class="mu-selectbox" style="display:none">
                                	</c:when>
									<c:otherwise>
										<div class="mu-selectbox">
									</c:otherwise>
								</c:choose>
									<button id = 'pkg_version' class="mu-value" value = ''></button>
									<ul id='pkg_version_ul' class="mu-list">
										<c:forEach var="package_List" items="${package_List}" >
											<li data-id="${package_List}">${package_List}</li>
										</c:forEach>
									</ul>
								</div>
								<div class="mu-selectbox">
									<button class="mu-value" id='pageSize' value ='20'>20개씩 보기</button>
									<ul class="mu-list">
										<li data-id="20">20개씩 보기</li>
										<li data-id="50">50개씩 보기</li>
										<li data-id="100">100개씩 보기</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="max-height:660px">
                        <table class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2" id='grid_estab'>
							<thead>
								<tr id="headerTr">
										<th class="updown sort" id="LINE_NAME">구분</th>
										<th class="updown sort" id="NE_NAME">DU명</th>
										<th class="updown sort" id="CNUM">CELL NUMBER</th>
										<th class="updown sort" id="C_DATE">일자</th>
										<th class="updown sort" id="WEEK_ID">WEEK</th>
										<th class="updown sort" id="TEAM_NAME">TEAM</th>
										<th class="updown sort" id="PKG_VER">Package Version</th>
                                        <c:forEach begin="1" end="${pegCnt}" var="i" varStatus="s">
                                        	<c:set var="tempName">PEG${i}</c:set>
                                        	<th class="updown sort" id="${tempName}">${pegList[tempName]}</th>
                                        </c:forEach>
								</tr>
							</thead>
							<tbody id="grid_contents">
							<c:set var ="listSize" value = "${fn:length(pdcpPacketInfoList)}"/>
							<c:choose>
									<c:when test="${listSize eq null}">
<!-- 									<td colspan="32" class="last regist" align = "center"><b>조회 결과가 없습니다.</b></td> -->
                                        <c:forEach begin="0" end="${pagingNum}" step="1">
                                                <tr height="25px">
                                                        <c:forEach begin="1" end="${pegCnt+6}" step="1">
                                                            <td></td>
                                                        </c:forEach>
                                                </tr>
                                        </c:forEach>
									</c:when>
									<c:otherwise>
										<c:forEach var="pdcpPacketInfoList" items="${pdcpPacketInfoList}">
										<tr height="25px">
											<td>${pdcpPacketInfoList.LINE_NAME}</td>
											<td>${pdcpPacketInfoList.NE_NAME}</td>
											<td>${pdcpPacketInfoList.CNUM}</td>
											<td>${pdcpPacketInfoList.C_DATE}</td>
											<td>${pdcpPacketInfoList.WEEK_ID}</td>
											<td>${pdcpPacketInfoList.TEAM_NAME}</td>
											<td>${pdcpPacketInfoList.PKG_VER}</td>
											<c:forEach begin="1" end="${pegCnt}" var="i" varStatus="s">
	                                        	<c:set var="tempName">PEG${i}</c:set>
	                                        	<td>${pdcpPacketInfoList[tempName]}</td>
                                        	</c:forEach>
										</tr>
										</c:forEach>
<%--                                         <c:set var ="listSize" value = "${fn:length(pdcpPacketInfoList)}"/> --%>
                                        <c:forEach   begin="1" end="${pagingNum-listSize}" step="1">
                                                <tr height="25px">
                                                        <c:forEach begin="1" end="${pegCnt+6}" step="1">
                                                            <td></td>
                                                        </c:forEach>
                                                </tr>
                                        </c:forEach>
								   </c:otherwise>
						 </c:choose>
						 </tbody>
						</table>
					</div>
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
			<%@ include file="/WEB-INF/views/ps/common/searchDU.jsp" %>
            <%@ include file="/WEB-INF/views/ps/common/searchHour.jsp" %>
			</section>
		</div>
</body>
</html>