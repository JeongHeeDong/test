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
	<script src="/resources/js/system/sioefProcessManage.js"></script>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="mu-item-group">
						<label>호스트 선택</label>
						<div class="mu-selectbox">
			                <button id="host_name_btn" class="mu-value" style="width:95px">전체</button>
			                <ul id="host_name_ul" class="mu-list">   
			                </ul>
			                <input type="hidden" id="searchHostIp">
		                </div>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="refreshData()"><i class="mu-icon refresh"></i></button>
					<button id="repeatBtn" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only mu-toggle-btn mu-toggle-on"><i class="mu-icon pause"></i></button>
				</div>
			</div>

			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="" class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
							<thead>
								<tr>
									<th>
										<input type="checkbox" id="portChkAll" onclick="allPortCheck()"/>
									</th>
									<th>호스트 명</th>
									<th>호스트 IP</th>
									<th>포트</th>
									<th>설명</th>
								</tr>
							</thead>
							<tbody id="portTable">		
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<br>
			<div class="mu-search-group">
				<div class="mu-search-item">
					<div class="troubleAlram">
						<div class="tit"><i></i>Active/DeActive</div>
						<ul>
							<li><i class="mu-icon alram warning"></i><span class="num" id="actCnt">0</span></li>
							<li><i class="mu-icon alram critical"></i><span class="num" id="trmCnt">0</span></li>
						</ul>
					</div>
					<div class="mu-item-group">
						<label>상태</label>
						<div class="mu-selectbox">
			                <button id="status_select" class="mu-value" style="width:95px">전체</button>
			                <ul id="status_name_ul" class="mu-list">
			                </ul>
			                <input type='hidden' id='searchStatus'/>
		                </div>
		                
		                <label>그룹</label>
						<div class="mu-selectbox">
			                <button id="group_select" class="mu-value" style="width:95px">전체</button>
			                <ul id="group_name_ul" class="mu-list">   
			             		<li onclick="setSearchGroup('')">전체</li>
			                </ul>
		                </div>
		                <label>검색 조건</label>
		                <div class="mu-selectbox">
			                <button id="type_select" class="mu-value" style="width:105px">프로세스 명</button>
			                <ul id="search_type_ul" class="mu-list"> 
			                </ul>
			                <input type='hidden' id='searchType' value = 'procName'/>
		                </div>
		                <input type="text" class="mu-input" id="searchValue" value = '' size="40"/>
		                <input type='hidden' id='searchGroup'/>
						<input type="hidden" id="port"/>
						<input type="hidden" id="hostIp"/>
						<input type="hidden" id="hostInfo"/>
						<input type="hidden" id="portCnt"/>
						<input type="hidden" id="nodeCnt"/>
					</div>
				</div>
				<div class="mu-search-btn">
					<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="getNodeList()"><i class="mu-icon search"></i>검색</button>
					<button id="actBtn" type="button" onclick ="nodeActTrm('ACT');" class="mu-btn mu-btn-icon mu-btn-icon-only mu-toggle-btn mu-toggle-on">실행</button>
					<button id="trmBtn" type="button" onclick="nodeActTrm('TRM');" class="mu-btn mu-btn-icon mu-btn-icon-only mu-toggle-btn mu-toggle-on">중지</button>
				</div>
			</div>
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" >
						<table id="" class="mu-grid mu-grid-border mu-grid-strip mu-grid-hover">
							<thead>
								<tr>
									<th>
										<input type="checkbox" id="nodeChkAll" onclick="allNodeCheck()"/>
									</th>
									<th>상태</th>
									<th>호스트 명</th>
									<th>호스트 IP</th>
									<th>포트</th>
									<th>그룹 ID</th>
									<th>프로세스 ID</th>
									<th>프로세스 명</th>
									<th>프로세스 설명</th>
									<th>실행 시간</th>
									<th>CPU 사용율(%)</th>
									<th>Memory 사용율(%)</th>
									<th>Memory Size(MB)</th>
								</tr>
							</thead>
							<tbody id="nodeTable">		
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	</div>
	<div id="sioefCmdBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="sioefCmdUp" class="mu-dialog mu-fix-foot" style="display: none; width: 730px; height: 330px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
		<div id="sioefTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
	        <h2><span class="title">프로세스 실행/중지</span></h2>
	    </div>
	    <div class="mu-dialog-body" style="overflow-y:auto;" id="cmdDlgBody">
	    	<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto">
						<table id="" class="mu-grid mu-grid-border mu-grid-strip">
							<thead>
								<tr>
									<th>NODE</th>
									<th>STATUS</th>
								</tr>
							</thead>
							<tbody id="cmdTable">		
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	     <div class="mu-dialog-foot" style="text-align: center;">
			<div class="mu-selectbox" style="margin-top:10px">
				<button type="button" id = "runComplete" class="mu-btn mu-btn-icon" onclick="runComplete()"><i class="mu-icon"></i>완료</button>
			</div>
		</div>
	</div>
</body>
</html>