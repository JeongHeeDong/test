<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
		<script type="text/javascript" src="/resources/js/security/permitIp/permit_Ip.js"></script>
		<script type="text/javascript" src="/resources/js/security/permitIp/permit_Ip_Add.js"></script>
	</head>
	<body style="min-width: inherit;min-height: inherit;">
		<div id="ajax_indicator" style="display: none">
			<i class="fa fa-spinner fa-5x fa-pulse" style="text-align: center;  left: 48%; top: 40%; position: absolute; z-index: 9999"></i>
		</div>
		<div class="mu-container" style="min-height: calc(100% - 76px)">
			<section>
				<%@ include file="/WEB-INF/views/title/title.jsp" %>
				<div class="mu-dialog-body">
					<h3 class="mu-title">허용 아이피 대역 리스트</h3>
					<div class="gridScrollT gridWrap">
						<table id="headerTable" class="mu-grid mu-grid-border mu-grid-strip">
							<colgroup>
								<col width="5%">
								<col width="25%">
								<col width="25%">
								<col width="15%">
								<col width="30%">
							</colgroup>
							<thead>
								<tr>
									<th>
										<div class="mu-checkbox"><input type="checkbox" id="headcheck"><label for="headcheck"></label></div>
									</th>
									<th>시작 아이피</th>
									<th>끝 아이피</th>
									<th>등록자</th>
									<th>등록일자</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="height:325px;overflow-y: scroll;">
						<table id="tbodyTable" class="mu-grid mu-grid-border mu-grid-hover mu-grid-strip">
							<colgroup>
								<col width="5%">
								<col width="25%">
								<col width="25%">
								<col width="15%">
								<col width="30%">
							</colgroup>
							<tbody id="ipListGrid" style="text-align: center;" >
								
							</tbody>
						</table>
					</div>
					<div class="gridBtnWrap tr">
						<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:ipAddView()"><i class="mu-icon add"></i>등록</button>
						<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:ipDel()"><i class="mu-icon del"></i>삭제</button>
					</div>
				</div>
				<div class="mu-dialog-foot">
					<button id="confirmBtn" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
					<button id="cancelBtn" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
				</div>
				<%@ include file="/WEB-INF/views/security/permitIp/permit_Ip_Add.jsp" %>
			</section>
		</div>
	</body>
</html>