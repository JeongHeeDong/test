<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script src="/resources/lib/qunee/qunee-min.js"></script>
	<script src="/resources/lib/qunee/popupMenu-mobilelocation.js"></script>
    <script src="/resources/js/highchart/highcharts.js"></script>
    <script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
	<script type="text/javascript" src="/resources/js/integrationMonitor/mobileLocation.js"></script>
	<style type="text/css">
		/* 통합감시Grid */
		.bottomBox{padding:0 20px;/*max-width:1880px;*/margin:0 auto;height:342px;}
		.bottomBoxContent {padding-right:17px;border:1px solid #c6c6c6;border-bottom:none;background:#c2d8de;}

		.ttl {
			display: inline-block;
			width: 150px;
		}

		#sendMsg {
			width: 1200px;
			height: 150px;
		}

		.popupLabel {
			display: inline-block;
			width: 100px;
		}

		.mu-toggle-btn.top-buttons {
			height:35px;
		}
		.mu-tooltip.mu-tooltip-sm {display:none; position: absolute; top: 50%; left: 50%; z-index: 10;}
		.mu-tooltip-inner .btn-r {width: 100%; margin:10px 0 20px; padding-top: 10px; border-top: 1px solid #DDD; text-align:right;}

		a.cbtn {display:inline-block; height:25px; padding:0 14px 0; border:1px solid #304a8a; background-color:#3f5a9d; font-size:13px; color:#fff; line-height:25px;}
		a.cbtn:hover {border: 1px solid #091940; background-color:#1f326a; color:#fff;}
		.mu-dialog {display:none; position: absolute; top: 50%; left: 50%; z-index: 5;}
	</style>
	<link rel="stylesheet" href="/resources/css/qunee-context-menu.css">
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container dbSubway">
		<section>
			<!-- 네트워크 토폴로지 Top -->
			<div class="nwTopologyWrap">
				<div class="nwTopology fr">
					<%@ include file="/WEB-INF/views/title/title.jsp" %>
					<div class="timeWrap">감시시간 : 2015/12/01 00:00</div>
					<div class="totalAlram">
						<div class="tit" style="padding-top: 12px">성능 알람</div>
						<ul>
							<li><i class="mu-icon alram critical"></i><span id="cntAllLevel1" class="num">0</span></li>
							<li><i class="mu-icon alram major"></i><span id="cntAllLevel2" class="num">0</span></li>
							<li><i class="mu-icon alram minor"></i><span id="cntAllLevel3" class="num">0</span></li>
							<%--<li><i class="mu-icon alram warning"></i><span id="cntAllLevel4" class="num">0</span></li>--%>
						</ul>
					</div>
					<div>
						<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn" onclick="javascript:filterAlarmView(event, MOBILE_LOCATION.filterLevel)"><i class="mu-icon filter"></i>알람필터</button>
						<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="soundBtn" onclick="javascript:alarmSound()"><i class="mu-icon sound"></i>가청</button>
						<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="watchBtn"><i class="mu-icon watch"></i>감시중</button>
					</div>
				</div>
			</div>

			<!-- 지하철 노선도 -->
			<div class="mobilelocation">
				<div>
					<div class="mobilelist"> </div>
					<div class="subwaylist">
						<ul> </ul>
					</div>
					<div style="position:absolute; right:30px; bottom:30px; font-size:16px; color:darkblue; font-weight:bold;">
						※ 표출되는 단말 위치정보의 갱신주기는 2분입니다.
					</div>
				</div>
			</div>
			
			<!-- Grid -->
			<div class="gridListWrap">
				<div class="gridTopContent">
					<h4 class="mu-title">메세지 발송</h4>
				</div>
				<div class="messageWrap">
					<table class="mu-formbox">
						<colgroup>
							<col width="120px">
							<col>
							<col width="112px">
						</colgroup>
						<tbody>
							<tr>
								<th>착신단말기 번호</th>
								<td><input type="text" class="mu-input" id="phoneNo" name="phoneNo" /></td>
								<td><button type="button" class="mu-btn" id="initNumbers">번호초기화</button></td>
							</tr>
							<tr>
								<th>발송메세지</th>
								<td colspan="2"><textarea class="mu-area" id="msgText"></textarea></td>
							</tr>
						</tbody>
					</table>
					<div class="btnBottom">
						<button type="button" class="mu-btn" id="sendMessage">발송하기</button>
					</div>
				</div>
			</div>
		</section>
	</div>

	<div id="mobileInfoBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
	<div id="mobileInfoUp" class="mu-dialog" style="display:none;width:400px;height:auto;left:42%;top:25%;z-index:11;">
		<div id="mobileInfoTitle" class="mu-dialog-head">
			<h2><span class="title" style="line-height: 200%;">단말기 위치 정보</span></h2>
			<button id="mobileInfoClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
		</div>
		<div class="mu-dialog-body phoneInfo" style="height:auto;min-height:150px;max-height:500px;">
			<div id="mobileInfoPop"></div>
		</div>
	</div>

	<div id="mobilePerformanceBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
		<div class="mu-dialog mobileLoca" style="display:none;left:42%;top:25%;z-index:11;">
			<div id="mobilePerformanceTitle" class="mu-dialog-head">
				<span class="title">단말기 성능 정보</span>
				<button id="mobilePerformanceClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
			</div>
			<div class="mu-dialog-body" style="width:670px;height:620px;overflow-y:scroll;">
				<div class="mu-search-group">
					<div class="mu-hgroup">
						<span>단말성능시간 : </span>
						<span class="eventDate"></span>
					</div>
				</div>
				<table class="mu-grid mu-grid-border mu-grid-strip" id="mobilePerformancePopTable">
				</table>
			</div>
		</div>
	</div>

    <div id="divDialogBackground" class="mu-dialog-background" style="display:none;" id="dialogBackground"></div>
    <div class="mu-dialog trend drag" style="width:1010px;height:470px;top:300px;left:450px;z-index:12;">
        <div id="mobilePerformanceTrend" class="mu-dialog-head">
            <h2><span class="title"></span></h2>
            <button type="button" class="mu-btn mu-btn-icon chart-close"><i class="mu-icon-img cancel"></i></button>
        </div>
        <div class="mu-dialog-body-top">
            <div class="mu-search-group">
                <div class="mu-hgroup">
                    <div class="mu-datepicker">
                        <input class="datepicker-time" id="start-date" type="text" value="" readonly="readonly">
                        <button class="mu-btn mu-btn-icon mu-btn-icon-only" id="start-date-btn"><i class="mu-icon calendar"></i></button>
                    </div>
                    <div class="mu-selectbox">
                        <select name="start-hour" class="mu-value select-hour"></select>
                    </div>
                    <div class="mu-selectbox">
                        <select name="start-minute" class="mu-value select-minute"></select>
                    </div>
                </div>
                <span>~</span>
                <div class="mu-hgroup">
                    <div class="mu-datepicker">
                        <input class="datepicker-time" id="end-date" type="text" value="" readonly="readonly">
                        <button class="mu-btn mu-btn-icon mu-btn-icon-only" id="end-date-btn"><i class="mu-icon calendar"></i></button>
                    </div>
                    <div class="mu-selectbox">
                        <select name="end-hour" class="mu-value select-hour"></select>
                    </div>
                    <div class="mu-selectbox">
                        <select name="end-minute" class="mu-value select-minute"></select>
                    </div>
                </div>
                <button id="trendRequest" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" data-phone_no=""><i class="mu-icon search"></i></button>
            </div>
        </div>
        <div class="mu-dialog-body">
            <div class="chartWrap" style="overflow: hidden;" id="chartWrap"></div>
        </div>
    </div>
    
    <div style="display: none;position: absolute;"id="popMenu">
		<ul class="mu-popup-menu">
		    <li><a href="javascript:popPerformView()">단말 성능 정보</a></li>
		</ul>
	</div>
	
	<%@ include file="/WEB-INF/views/common/filter_alarm.jsp" %>
	
</body>
</html>