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
	<script src="/resources/js/system/sysProcManager.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<div class="timeWrap"><i class="mu-icon clock"></i><span id="nowDateTime">기준시간 : <c:out value="${nowDateTime}"/></span></div>
					</div>
					<div class="troubleAlram">
						<div class="tit"><i></i>Active/DeActive</div>
						<ul>
							<li><i class="mu-icon alram warning"></i><span class="num" id="activeCnt">0</span></li>
							<li><i class="mu-icon alram critical"></i><span class="num" id="deactiveCnt">0</span></li>
						</ul>
					</div>
					<div class="mu-item-group">
						<label>호스트 선택</label>
						<div class="mu-selectbox">
			                <button id="host_name_btn" class="mu-value" style="width:95px">전체</button>
			                <ul id="host_name_ul" class="mu-list">   
			                </ul>
		                </div>	
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="refreshData()"><i class="mu-icon refresh"></i></button>
					<button id="repeatBtn" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only mu-toggle-btn mu-toggle-on"><i class="mu-icon pause"></i></button>
					<!-- 	<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-toggle-btn mu-toggle-on"><i class="mu-icon sound" onclick="alert('기능 구현중..')"></i>가청</button>
				</div> -->
				</div>
			</div>			

			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="" class="mu-grid mu-grid-border mu-grid-strip">
							<thead>
								<tr>
									<th>Status</th>
									<th>Host</th>
									<th>Ip Address</th>
									<th>Process Name</th>
									<th>CPU 사용율(%)</th>
									<th>Memory 사용율(%)</th>
									<th>Memory Size(MB)</th>
									<th>설명</th>
								</tr>
							</thead>
							<tbody id="sysProcGrid">		
							</tbody>
						</table>
					</div><!-- //gridWarp -->
				</div>
			</div>
		</section>
	</div>
</body>
</html>