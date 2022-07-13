<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/js/pss/epc/cnEms/cnEmsSearch.js"></script>
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
								<label>CN-EMS Name</label>
								<input id="cnEms_nm_value" type="text" class="mu-input">
							</div>
						</div><!-- //mu-search-item -->
						<div class="mu-search-btn">
							<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:btnSearchClick()"><i class="mu-icon search"></i>검색</button>
							<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:cnEmsAddView()"><i class="mu-icon add"></i>추가</button>
						</div>
					</div><!-- //mu-search-group -->
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">

					<div class="gridWrap mt10" style="overflow:auto;max-height:691px">
						<table id='table' class="mu-grid mu-grid-border mu-grid-strip mu-grid-number">
							<thead>
								<tr>
									<th>NO</th>
									<th>EMS ID</th>
									<th>EMS Name</th>
									<th>IP Address</th>
									<th>Port</th>
									<th>Vendor</th>
									<th>상용일자</th>
								</tr>
							</thead>
							<tbody id="cnEmsGrid">
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
		<%@ include file="/WEB-INF/views/pss/epc/cnEms/cnEmsDetail.jsp" %>
		<%@ include file="/WEB-INF/views/pss/epc/cnEms/cnEmsAdd.jsp" %>
		
</body>
</html>