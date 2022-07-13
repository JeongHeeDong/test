<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<c:set var="ruCellType"><spring:eval expression="@locationconfig['ru.cell.type']" /></c:set>
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<style type="text/css">
		ul.tabs {
			margin: 0;
			padding: 0;
			float: left;
			list-style: none;
			height: 32px;
			border-bottom: 1px solid #eee;
			border-left: 1px solid #eee;
			width: 100%;
			font-family: "dotum";
			font-size:12px;
		}
		ul.tabs li {
			float: left;
			text-align:center;
			cursor: pointer;
			width:82px;
			height: 31px;
			line-height: 31px;
			border: 1px solid #eee;
			border-left: none;
			font-weight: bold;
			background: #fafafa;
			overflow: hidden;
			position: relative;
		}
		ul.tabs li.active {
			background: #FFFFFF;
			border-bottom: 1px solid #FFFFFF;
		}
		.tab_container {
			border: 1px solid #eee;
			border-top: none;
			clear: both;
			float: left;
			width: 100%;
			background: #FFFFFF;
		}
		.tab_content {
			padding: 5px;
			font-size: 12px;
			display: none;
		}
		.tab_container .tab_content ul {
			width: 100%;
			margin: 0px;
			padding: 0px;
		}
		.tab_container .tab_content ul li {
			padding:5px;
			list-style:none;
		}
		.mu-toggle-btn.top-buttons {
			height:35px;
		}
		/*.mu-tooltip.mu-tooltip-sm {display:none; position: absolute; top: 50%; left: 50%; z-index: 10;}*/
		/*.mu-tooltip-inner .btn-r {width: 100%; margin:10px 0 20px; padding-top: 10px; border-top: 1px solid #DDD; text-align:right;}*/

		a.cbtn {display:inline-block; height:25px; padding:0 14px 0; border:1px solid #304a8a; background-color:#3f5a9d; font-size:13px; color:#fff; line-height:25px;}
		a.cbtn:hover {border: 1px solid #091940; background-color:#1f326a; color:#fff;}
		.mu-dialog {display:none; position: absolute; top: 50%; left: 50%; z-index: 5;}
		.Q-Tooltip {
			position:absolute;
			z-index:99999;
			margin:0px;
			padding:2px 4px;
			overflow-x:visible;
			overflow-y:visible;
		    border-color:rgba( 255, 255, 255, 0 );
		    background-color:rgba( 255, 255, 255, 0 );
		    color:rgba( 255, 255, 255, 0 );
		    box-shadow:0 5px 10px rgba(136, 136, 136, 0);
		}
	</style>
	<script type="text/javascript">
		var ruCellType = '${ruCellType}';
	</script>
	<script src="/resources/lib/qunee/qunee-min.js"></script>
	<script src="/resources/lib/qunee/qunee-util.js"></script>
	<%--<script src="/resources/lib/qunee/popupMenu-station.js"></script>--%>
	<script src="/resources/js/highchart/highcharts.js"></script>
	<script src="/resources/lib/highcharts/modules/exporting.js"></script>
	<script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
	<script src="<c:url value="/resources/js/integrationMonitor/station.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>

	<link rel="stylesheet" href="/resources/css/qunee-tooltip.css">
	<%--<link rel="stylesheet" href="/resources/css/qunee-context-menu.css">--%>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container dbSubway">
		<section>
			<!-- 역사별 통합감시 Top -->
			<div class="nwTopologyWrap">
				<div class="nwTopology fr">
					<%@ include file="/WEB-INF/views/title/title.jsp" %>
					
					<div class="timeWrap"></div>
					<div class="totalAlram">
						<div class="tit" style="padding-top: 12px">성능 알람</div>
						<ul>
							<li><i class="mu-icon alram critical"></i><span id="cntAllLevel1" class="num">0</span></li>
							<li><i class="mu-icon alram major"></i><span id="cntAllLevel2" class="num">0</span></li>
							<li><i class="mu-icon alram minor"></i><span id="cntAllLevel3" class="num">0</span></li>
							<%--<li id="warIndicator"><i class="mu-icon alram warning"></i><span class="num"></span></li>--%>
						</ul>
					</div>
					<div>
						<button id="filterAlarmBtn" type="button" class="mu-btn mu-toggle-btn" onclick="javascript:filterAlarmView(event, STATION_MONITOR.params.filterLevel, 'N')"><i class="mu-icon filter"></i>알람필터</button>
						<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="soundBtn" onclick="javascript:alarmSound()" ><i class="mu-icon sound"></i>가청</button>
						<button type="button" class="mu-btn mu-toggle-btn top-buttons" id="watchBtn"><i class="mu-icon watch"></i>감시중</button>
					</div>
				</div>
			</div>
			

			<!-- Subway -->
			<div class="subwayWrap" id="subwayWrap">
			<!-- 전체 노선 -->
				<div class="subwayCont subway-all" id="subwayLineAll" style="display:true;">
				<!-- tobbutton -->
					<div class="station_tab">
						<div class="st_tapbutton">
							<button type="button" class="mu-btn tap active" onclick="javascript:changeLine('all')"><span>전체</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(5)"><i class="mu-line_icon line5"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(6)" disabled><i class="mu-line_icon line6"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(7)"><i class="mu-line_icon line7"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(8)" disabled><i class="mu-line_icon line8"></i><span>호선</span></button>
						</div>
					</div>
				<!-- tobbutton -->
					<div class="subway-line"></div>
					<div class="subway-line-5">
						<ul class="sybway-station">
							<li class="station st-510" name="510"><span class="station-name">방화</span></li>
							<li class="station st-511" name="511"><span class="station-name">개화산</span></li>
							<li class="station st-512" name="512"><span class="station-name">김포공항</span></li>
							<li class="station st-513" name="513"><span class="station-name">송정</span></li>
							<li class="station st-514" name="514"><span class="station-name">마곡</span></li>
							<li class="station st-515" name="515"><span class="station-name">발산</span></li>
							<li class="station st-516" name="516"><span class="station-name">우장산</span></li>
							<li class="station st-517" name="517"><span class="station-name">화곡</span></li>
							<li class="station st-518" name="518"><span class="station-name">까치산</span></li>
							<li class="station st-519" name="519"><span class="station-name">신정</span></li>
							<li class="station st-520" name="520"><span class="station-name">목동</span></li>
							<li class="station st-521" name="521"><span class="station-name">오목교</span></li>
							<li class="station st-522" name="522"><span class="station-name">양평</span></li>
							<li class="station st-523" name="523"><span class="station-name">영등포구청</span></li>
							<li class="station st-524" name="524"><span class="station-name">영등포시장</span></li>
							<li class="station st-525" name="525"><span class="station-name">신길</span></li>
							<li class="station st-526" name="526"><span class="station-name">여의도</span></li>
							<li class="station st-527" name="527"><span class="station-name">여의나루</span></li>
							<li class="station st-528" name="528"><span class="station-name">마포</span></li>
							<li class="station st-529" name="529"><span class="station-name">공덕</span></li>
							<li class="station st-530" name="530"><span class="station-name">애오개</span></li>
							<li class="station st-531" name="531"><span class="station-name">충정로</span></li>
							<li class="station st-532" name="532"><span class="station-name">서대문</span></li>
							<li class="station st-533" name="533"><span class="station-name">광화문</span></li>
							<li class="station st-534" name="534"><span class="station-name">종로3가</span></li>
							<li class="station st-535" name="535"><span class="station-name">을지로4가</span></li>
							<li class="station st-536" name="536"><span class="station-name">동대문역사문화공원</span></li>
							<li class="station st-537" name="537"><span class="station-name">청구</span></li>
							<li class="station st-538" name="538"><span class="station-name">신금호</span></li>
							<li class="station st-539" name="539"><span class="station-name">행당</span></li>
							<li class="station st-540" name="540"><span class="station-name">왕십리</span></li>
							<li class="station st-541" name="541"><span class="station-name">마장</span></li>
							<li class="station st-542" name="542"><span class="station-name">답십리</span></li>
							<li class="station st-543" name="543"><span class="station-name">장한평</span></li>
							<li class="station st-544" name="544"><span class="station-name">군자</span></li>
							<li class="station st-545" name="545"><span class="station-name">아차산</span></li>
							<li class="station st-546" name="546"><span class="station-name">광나루</span></li>
							<li class="station st-547" name="547"><span class="station-name">천호</span></li>
							<li class="station st-548" name="548"><span class="station-name">강동</span></li>
							<!-- 상일동행 -->
							<li class="station st-549" name="549"><span class="station-name">길동</span></li>
							<li class="station st-550" name="550"><span class="station-name">굽은다리</span></li>
							<li class="station st-551" name="551"><span class="station-name">명일</span></li>
							<li class="station st-552" name="552"><span class="station-name">고덕</span></li>
							<li class="station st-553" name="553"><span class="station-name">상일동</span></li>
							<!-- 하남선 -->
							<li class="station st-554" name="554"><span class="station-name">강일</span></li>
							<li class="station st-555" name="555"><span class="station-name">미사</span></li>
							<li class="station st-556" name="556"><span class="station-name">하남풍산</span></li>
							<li class="station st-557" name="557"><span class="station-name">하남시청</span></li>
							<li class="station st-558" name="558"><span class="station-name">하남검단산</span></li>
							<!-- 마천행 -->
							<li class="station st-p549" name="p549"><span class="station-name">둔촌동</span></li>
							<li class="station st-p550" name="p550"><span class="station-name">올림픽공원</span></li>
							<li class="station st-p551" name="p551"><span class="station-name">방이</span></li>
							<li class="station st-p552" name="p552"><span class="station-name">오금</span></li>
							<li class="station st-p553" name="p553"><span class="station-name">개롱</span></li>
							<li class="station st-p554" name="p554"><span class="station-name">거여</span></li>
							<li class="station st-p555" name="p555"><span class="station-name">마천</span></li>
						</ul>
					</div>
					<div class="subway-line-disabled">
						<ul class="sybway-station">
							<li class="station st-610" name="610"><span class="station-name">응암</span></li>
							<li class="station st-611" name="611"><span class="station-name">역촌</span></li>
							<li class="station st-612" name="612"><span class="station-name">불광</span></li>	
							<li class="station st-613" name="613"><span class="station-name">독바위</span></li>
							<li class="station st-614" name="614"><span class="station-name">연신내</span></li>
							<li class="station st-615" name="615"><span class="station-name">구산</span></li>
							<li class="station st-616" name="616"><span class="station-name">새절(신사)</span></li>
							<li class="station st-617" name="617"><span class="station-name">증산(명지대앞)</span></li>
							<li class="station st-618" name="618"><span class="station-name">디지털<br>미디어시티</span></li>
							<li class="station st-619" name="619"><span class="station-name">월드컵경기장<br>(성산)</span></li>
							<li class="station st-620" name="620"><span class="station-name">마포구청</span></li>
							<li class="station st-621" name="621"><span class="station-name">망원</span></li>
							<li class="station st-622" name="622"><span class="station-name">합정</span></li>
							<li class="station st-623" name="623"><span class="station-name">상수</span></li>
							<li class="station st-624" name="624"><span class="station-name">광흥창<br>(서강)</span></li>
							<li class="station st-625" name="625"><span class="station-name">대흥<br>(서강대앞)</span></li>

							<li class="station st-627" name="627"><span class="station-name">효창공원앞</span></li>
							<li class="station st-628" name="628"><span class="station-name">삼각지</span></li>
							<li class="station st-629" name="629"><span class="station-name">녹사평<br>(용산구청)</span></li>
							<li class="station st-630" name="630"><span class="station-name">이태원</span></li>
							<li class="station st-631" name="631"><span class="station-name">한강진</span></li>
							<li class="station st-632" name="632"><span class="station-name">버티고개</span></li>
							<li class="station st-633" name="633"><span class="station-name">약수</span></li>

							<li class="station st-635" name="635"><span class="station-name">신당</span></li>
							<li class="station st-636" name="636"><span class="station-name">동묘앞</span></li>
							<li class="station st-637" name="637"><span class="station-name">창신</span></li>
							<li class="station st-638" name="638"><span class="station-name">보문</span></li>
							<li class="station st-639" name="639"><span class="station-name">안암(고대병원앞)</span></li>
							<li class="station st-640" name="640"><span class="station-name">고려대(종암)</span></li>
							<li class="station st-641" name="641"><span class="station-name">월곡(동덕여대)</span></li>
							<li class="station st-642" name="642"><span class="station-name">상월곡<br>(한국과학기술원)</span></li>
							<li class="station st-643" name="643"><span class="station-name">돌곶이</span></li>
							<li class="station st-644" name="644"><span class="station-name">석계</span></li>

							<li class="station st-646" name="646"><span class="station-name">화랑대<br>(서울여대입구)</span></li>
							<li class="station st-647" name="647"><span class="station-name">봉화산<br>(서울의료원)</span></li>
						</ul>
					</div>
					<div class="subway-line-7">
						<ul class="sybway-station">
							<li class="station st-709" name="709"><span class="station-name">장암</span></li>
							<li class="station st-710" name="710"><span class="station-name">도봉산</span></li>
							<li class="station st-711" name="711"><span class="station-name">수락산</span></li>	
							<li class="station st-712" name="712"><span class="station-name">마들</span></li>
							<li class="station st-713" name="713"><span class="station-name">노원</span></li>
							<li class="station st-714" name="714"><span class="station-name">중계</span></li>
							<li class="station st-715" name="715"><span class="station-name">하계</span></li>
							<li class="station st-716" name="716"><span class="station-name">공릉</span></li>
							<li class="station st-717" name="717"><span class="station-name">태릉입구</span></li>
							<li class="station st-718" name="718"><span class="station-name">먹골</span></li>
							<li class="station st-719" name="719"><span class="station-name">중화</span></li>
							<li class="station st-720" name="720"><span class="station-name">상봉</span></li>
							<li class="station st-721" name="721"><span class="station-name">면목</span></li>
							<li class="station st-722" name="722"><span class="station-name">사가정</span></li>
							<li class="station st-723" name="723"><span class="station-name">용마산</span></li>
							<li class="station st-724" name="724"><span class="station-name">중곡</span></li>

							<li class="station st-726" name="726"><span class="station-name">어린이대공원</span></li>
							<li class="station st-727" name="727"><span class="station-name">건대입구</span></li>
							<li class="station st-728" name="728"><span class="station-name">뚝섬유원지</span></li>
							<li class="station st-729" name="729"><span class="station-name">청담</span></li>
							<li class="station st-730" name="730"><span class="station-name">강남구청</span></li>
							<li class="station st-731" name="731"><span class="station-name">학동</span></li>
							<li class="station st-732" name="732"><span class="station-name">논현</span></li>
							<li class="station st-733" name="733"><span class="station-name">반포</span></li>
							<li class="station st-734" name="734"><span class="station-name">고속터미널</span></li>
							<li class="station st-735" name="735"><span class="station-name">내방</span></li>
							<li class="station st-736" name="736"><span class="station-name">이수(총신대)</span></li>
							<li class="station st-737" name="737"><span class="station-name">남성</span></li>
							<li class="station st-738" name="738"><span class="station-name">숭실대입구</span></li>
							<li class="station st-739" name="739"><span class="station-name">상도</span></li>
							<li class="station st-740" name="740"><span class="station-name">장승배기</span></li>
							<li class="station st-741" name="741"><span class="station-name">신대방삼거리</span></li>
							<li class="station st-742" name="742"><span class="station-name">보라맨</span></li>
							<li class="station st-743" name="743"><span class="station-name">신풍</span></li>
							<li class="station st-744" name="744"><span class="station-name">대림</span></li>
							<li class="station st-745" name="745"><span class="station-name">남구로</span></li>
							<li class="station st-746" name="746"><span class="station-name">가산디지털단지</span></li>
							<li class="station st-747" name="747"><span class="station-name">철산</span></li>
							<li class="station st-748" name="748"><span class="station-name">광명사거리</span></li>
							<li class="station st-749" name="749"><span class="station-name">천왕</span></li>
							<li class="station st-750" name="750"><span class="station-name">온수</span></li>
							<li class="station st-751" name="751"><span class="station-name">까치울</span></li>
							<li class="station st-752" name="752"><span class="station-name">부천종합운동장</span></li>
							<li class="station st-753" name="753"><span class="station-name">춘의</span></li>
							<li class="station st-754" name="754"><span class="station-name">신중동</span></li>
							<li class="station st-755" name="755"><span class="station-name">부천시청</span></li>
							<li class="station st-756" name="756"><span class="station-name">상동</span></li>
							<li class="station st-757" name="757"><span class="station-name">삼산체육관</span></li>
							<li class="station st-758" name="758"><span class="station-name">굴포천</span></li>
							<li class="station st-759" name="759"><span class="station-name">부평구청</span></li>
						
							<!-- 7호선 연장선-->
							<li class="station st-760" name="760"><span class="station-name">산곡</span></li>
							<li class="station st-761" name="761"><span class="station-name">석남</span></li>
						</ul>
					</div>
					<div class="subway-line-disabled">
						<ul class="sybway-station">
							<li class="station st-810" name="810"><span class="station-name">암사</span></li>
							
							<li class="station st-812" name="812"><span class="station-name">강동구청</span></li>	
							<li class="station st-813" name="813"><span class="station-name">몽촌토성<br>(평화의문)</span></li>
							<li class="station st-814" name="814"><span class="station-name">잠실<br>(송파구청)</span></li>
							<li class="station st-815" name="815"><span class="station-name">석촌</span></li>
							<li class="station st-816" name="816"><span class="station-name">송파</span></li>
							<li class="station st-817" name="817"><span class="station-name">가락시장</span></li>
							<li class="station st-818" name="818"><span class="station-name">문정</span></li>
							<li class="station st-819" name="819"><span class="station-name">장지</span></li>
							<li class="station st-820" name="820"><span class="station-name">복정</span></li>
							<li class="station st-821" name="821"><span class="station-name">산성</span></li>
							<li class="station st-822" name="822"><span class="station-name">남한산성입구<br>(성남법원·검찰청)</span></li>
							<li class="station st-823" name="823"><span class="station-name">단대오거리</span></li>
							<li class="station st-824" name="824"><span class="station-name">신흥</span></li>
							<li class="station st-825" name="825"><span class="station-name">수진</span></li>
							<li class="station st-826" name="826"><span class="station-name">모란</span></li>
						</ul>
					</div>
					
					
					<div class="integrationQuality">
						<table>
							<colgroup>
								<col width="190px" />
								<col width="140px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
							</colgroup>
							<thead>
								<tr>
									<th scope="col" colspan="8">통합품질</th>
								</tr>
							</thead>
							<tbody name = "tot_performance">
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!--전체 노선 끝 -->		
				<!-- 8호선 -->
				<div class="subwayCont subway-8" id="subwayLine8" style="display:none;">
				<!-- tobbutton -->
					<div class="station_tab">
						<div class="st_tapbutton">
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine('all')"><span>전체</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(5)"><i class="mu-line_icon line5"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(6)" disabled><i class="mu-line_icon line6"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(7)"><i class="mu-line_icon line7"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap active" onclick="javascript:changeLine(8)" disabled><i class="mu-line_icon line8"></i><span>호선</span></button>
						</div>
					</div>
				<!-- tobbutton -->
					<div class="subway-line"></div>
					<ul class="sybway-station">
						<li class="station st-510" id="810"><span class="station-name">암사</span></li>
					</ul>
					<div class="integrationQuality">
						<table>
							<colgroup>
								<col width="190px" />
								<col width="140px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
							</colgroup>
							<thead>
								<tr>
									<th scope="col" colspan="8">통합품질</th>
								</tr>
							</thead>
							<tbody name = "tot_performance">
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!--8호선 끝 -->				
				<!-- 7호선 -->
				<div class="subwayCont subway-7" id="subwayLine7" style="display:none;">
				<!-- tobbutton -->
					<div class="station_tab">
						<div class="st_tapbutton">
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine('all')"><span>전체</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(5)"><i class="mu-line_icon line5"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(6)" disabled><i class="mu-line_icon line6"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap active" onclick="javascript:changeLine(7)"><i class="mu-line_icon line7"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(8)" disabled><i class="mu-line_icon line8"></i><span>호선</span></button>
						</div>
					</div>
				<!-- tobbutton -->
					<div class="subway-line"></div>
						<ul class="sybway-station">
							<li class="station st-709" name="709"><span class="station-name">장암</span></li>
							<li class="station st-710" name="710"><span class="station-name">도봉산</span></li>
							<li class="station st-711" name="711"><span class="station-name">수락산</span></li>	
							<li class="station st-712" name="712"><span class="station-name">마들</span></li>
							<li class="station st-713" name="713"><span class="station-name">노원</span></li>
							<li class="station st-714" name="714"><span class="station-name">중계</span></li>
							<li class="station st-715" name="715"><span class="station-name">하계</span></li>
							<li class="station st-716" name="716"><span class="station-name">공릉</span></li>
							<li class="station st-717" name="717"><span class="station-name">태릉입구</span></li>
							<li class="station st-718" name="718"><span class="station-name">먹골</span></li>
							<li class="station st-719" name="719"><span class="station-name">중화</span></li>
							<li class="station st-720" name="720"><span class="station-name">상봉</span></li>
							<li class="station st-721" name="721"><span class="station-name">면목</span></li>
							<li class="station st-722" name="722"><span class="station-name">사가정</span></li>
							<li class="station st-723" name="723"><span class="station-name">용마산</span></li>
							<li class="station st-724" name="724"><span class="station-name">중곡</span></li>
							<li class="station st-725" name="544"><span class="station-name">군자</span></li>
							<li class="station st-726" name="726"><span class="station-name">어린이대공원</span></li>
							<li class="station st-727" name="727"><span class="station-name">건대입구</span></li>
							<li class="station st-728" name="728"><span class="station-name">뚝섬유원지</span></li>
							<li class="station st-729" name="729"><span class="station-name">청담</span></li>
							<li class="station st-730" name="730"><span class="station-name">강남구청</span></li>
							<li class="station st-731" name="731"><span class="station-name">학동</span></li>
							<li class="station st-732" name="732"><span class="station-name">논현</span></li>
							<li class="station st-733" name="733"><span class="station-name">반포</span></li>
							<li class="station st-734" name="734"><span class="station-name">고속터미널</span></li>
							<li class="station st-735" name="735"><span class="station-name">내방</span></li>
							<li class="station st-736" name="736"><span class="station-name">이수(총신대)</span></li>
							<li class="station st-737" name="737"><span class="station-name">남성</span></li>
							<li class="station st-738" name="738"><span class="station-name">숭실대입구</span></li>
							<li class="station st-739" name="739"><span class="station-name">상도</span></li>
							<li class="station st-740" name="740"><span class="station-name">장승배기</span></li>
							<li class="station st-741" name="741"><span class="station-name">신대방삼거리</span></li>
							<li class="station st-742" name="742"><span class="station-name">보라맨</span></li>
							<li class="station st-743" name="743"><span class="station-name">신풍</span></li>
							<li class="station st-744" name="744"><span class="station-name">대림(구로구청)</span></li>
							<li class="station st-745" name="745"><span class="station-name">남구로</span></li>
							<li class="station st-746" name="746"><span class="station-name">가산디지털단지</span></li>
							<li class="station st-747" name="747"><span class="station-name">철산</span></li>
							<li class="station st-748" name="748"><span class="station-name">광명사거리</span></li>
							<li class="station st-749" name="749"><span class="station-name">천왕</span></li>
							<li class="station st-750" name="750"><span class="station-name">온수</span></li>
							<li class="station st-751" name="751"><span class="station-name">까치울</span></li>
							<li class="station st-752" name="752"><span class="station-name">부천종합운동장</span></li>
							<li class="station st-753" name="753"><span class="station-name">춘의</span></li>
							<li class="station st-754" name="754"><span class="station-name">신중동</span></li>
							<li class="station st-755" name="755"><span class="station-name">부천시청</span></li>
							<li class="station st-756" name="756"><span class="station-name">상동</span></li>
							<li class="station st-757" name="757"><span class="station-name">삼산체육관</span></li>
							<li class="station st-758" name="758"><span class="station-name">굴포천</span></li>
							<li class="station st-759" name="759"><span class="station-name">부평구청</span></li>
						
							<!-- 7호선 연장선-->
							<li class="station st-760" name="760"><span class="station-name">산곡</span></li>
							<li class="station st-761" name="761"><span class="station-name">석남</span></li>
						</ul>
						<div class="integrationQuality">
							<table>
								<colgroup>
									<col width="190px" />
									<col width="140px" />
									<col width="115px" />
									<col width="100px" />
									<col width="115px" />
									<col width="100px" />
									<col width="115px" />
									<col width="100px" />
								</colgroup>
								<thead>
									<tr>
										<th scope="col" colspan="8">통합품질</th>
									</tr>
								</thead>
								<tbody name = "tot_performance">
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<!--7호선 끝 -->				
					<!-- 6호선 -->
				<div class="subwayCont subway-6" id="subwayLine8" style="display:none;">
				<!-- tobbutton -->
					<div class="station_tab">
						<div class="st_tapbutton">
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine('all')"><span>전체</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(5)"><i class="mu-line_icon line5"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap active" onclick="javascript:changeLine(6)" disabled><i class="mu-line_icon line6"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(7)"><i class="mu-line_icon line7"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(8)" disabled><i class="mu-line_icon line8"></i><span>호선</span></button>
						</div>
					</div>
				<!-- tobbutton -->
					<div class="subway-line"></div>
					<ul class="sybway-station">
						<li class="station st-510" id="510"><span class="station-name">응암</span></li>
					</ul>
					<div class="integrationQuality">
						<table>
							<colgroup>
								<col width="190px" />
								<col width="140px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
							</colgroup>
							<thead>
								<tr>
									<th scope="col" colspan="8">통합품질</th>
								</tr>
							</thead>
							<tbody name = "tot_performance">
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!--6호선 끝 -->
				<!-- 5호선 -->
				<div class="subwayCont subway-5" id="subwayLine5" style="display:none;">
					<!-- tobbutton -->
					<div class="station_tab">
						<div class="st_tapbutton">
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine('all')"><span>전체</span></button>
							<button type="button" class="mu-btn tap active" onclick="javascript:changeLine(5)"><i class="mu-line_icon line5"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(6)" disabled><i class="mu-line_icon line6"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(7)"><i class="mu-line_icon line7"></i><span>호선</span></button>
							<button type="button" class="mu-btn tap" onclick="javascript:changeLine(8)" disabled><i class="mu-line_icon line8"></i><span>호선</span></button>
						</div>
					</div>
					<!-- tobbutton -->
					<div class="subway-line"></div>
					<ul class="sybway-station">
						<li class="station st-510" name="510"><span class="station-name">방화</span></li>
							<li class="station st-511" name="511"><span class="station-name">개화산</span></li>
							<li class="station st-512" name="512"><span class="station-name">김포공항</span></li>
							<li class="station st-513" name="513"><span class="station-name">송정</span></li>
							<li class="station st-514" name="514"><span class="station-name">마곡</span></li>
							<li class="station st-515" name="515"><span class="station-name">발산</span></li>
							<li class="station st-516" name="516"><span class="station-name">우장산</span></li>
							<li class="station st-517" name="517"><span class="station-name">화곡</span></li>
							<li class="station st-518" name="518"><span class="station-name">까치산</span></li>
							<li class="station st-519" name="519"><span class="station-name">신정</span></li>
							<li class="station st-520" name="520"><span class="station-name">목동</span></li>
							<li class="station st-521" name="521"><span class="station-name">오목교</span></li>
							<li class="station st-522" name="522"><span class="station-name">양평</span></li>
							<li class="station st-523" name="523"><span class="station-name">영등포구청</span></li>
							<li class="station st-524" name="524"><span class="station-name">영등포시장</span></li>
							<li class="station st-525" name="525"><span class="station-name">신길</span></li>
							<li class="station st-526" name="526"><span class="station-name">여의도</span></li>
							<li class="station st-527" name="527"><span class="station-name">여의나루</span></li>
							<li class="station st-528" name="528"><span class="station-name">마포</span></li>
							<li class="station st-529" name="529"><span class="station-name">공덕</span></li>
							<li class="station st-530" name="530"><span class="station-name">애오개</span></li>
							<li class="station st-531" name="531"><span class="station-name">충정로</span></li>
							<li class="station st-532" name="532"><span class="station-name">서대문</span></li>
							<li class="station st-533" name="533"><span class="station-name">광화문</span></li>
							<li class="station st-534" name="534"><span class="station-name">종로3가</span></li>
							<li class="station st-535" name="535"><span class="station-name">을지로4가</span></li>
							<li class="station st-536" name="536"><span class="station-name">동대문역사문화공원</span></li>
							<li class="station st-537" name="537"><span class="station-name">청구</span></li>
							<li class="station st-538" name="538"><span class="station-name">신금호</span></li>
							<li class="station st-539" name="539"><span class="station-name">행당</span></li>
							<li class="station st-540" name="540"><span class="station-name">왕십리</span></li>
							<li class="station st-541" name="541"><span class="station-name">마장</span></li>
							<li class="station st-542" name="542"><span class="station-name">답십리</span></li>
							<li class="station st-543" name="543"><span class="station-name">장한평</span></li>
							<li class="station st-544" name="544"><span class="station-name">군자</span></li>
							<li class="station st-545" name="545"><span class="station-name">아차산</span></li>
							<li class="station st-546" name="546"><span class="station-name">광나루</span></li>
							<li class="station st-547" name="547"><span class="station-name">천호</span></li>
							<li class="station st-548" name="548"><span class="station-name">강동</span></li>
							<!-- 상일동행 -->
							<li class="station st-549" name="549"><span class="station-name">길동</span></li>
							<li class="station st-550" name="550"><span class="station-name">굽은다리</span></li>
							<li class="station st-551" name="551"><span class="station-name">명일</span></li>
							<li class="station st-552" name="552"><span class="station-name">고덕</span></li>
							<li class="station st-553" name="553"><span class="station-name">상일동</span></li>
							<!-- 하남선 -->
							<li class="station st-554" name="554"><span class="station-name">강일</span></li>
							<li class="station st-555" name="555"><span class="station-name">미사</span></li>
							<li class="station st-556" name="556"><span class="station-name">하남풍산</span></li>
							<li class="station st-557" name="557"><span class="station-name">하남시청</span></li>
							<li class="station st-558" name="558"><span class="station-name">하남검단산</span></li>
							<!-- 마천행 -->
							<li class="station st-p549" name="p549"><span class="station-name">둔촌동</span></li>
							<li class="station st-p550" name="p550"><span class="station-name">올림픽공원</span></li>
							<li class="station st-p551" name="p551"><span class="station-name">방이</span></li>
							<li class="station st-p552" name="p552"><span class="station-name">오금</span></li>
							<li class="station st-p553" name="p553"><span class="station-name">개롱</span></li>
							<li class="station st-p554" name="p554"><span class="station-name">거여</span></li>
							<li class="station st-p555" name="p555"><span class="station-name">마천</span></li>
					</ul>
					<div class="integrationQuality">
						<table>
							<colgroup>
								<col width="190px" />
								<col width="140px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
								<col width="115px" />
								<col width="100px" />
							</colgroup>
							<thead>
								<tr>
									<th scope="col" colspan="8">통합품질</th>
								</tr>
							</thead>
							<tbody name = "tot_performance">
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		
			<div class="gridListWrap" style="z-index: 100;height:300px;">
				<div class="tab_container">
					<ul class="mu-tab">
						<li rel="tab0" class="sb_line-t active" style="cursor:pointer"><a>전체</a></li>
						<li rel="tab1" class="sb_line-5" style="cursor:pointer"><a>5호선</a></li>
						<li rel="tab3" class="sb_line-7" style="cursor:pointer"><a>7호선</a></li>
						<li rel="tab2" id="stationName" style="cursor: pointer; display: inline-block;"><a></a></li>
					</ul>
					<div class="btnWrap fr">
						<div class="mu-search-btn">
						<button type="button" class="mu-btn mu-btn-icon green" id="excelExportBtn"><i class="mu-icon excel"></i>엑셀저장</button>
						</div>
					</div>
					<div class="mu-tab-body">
						<div id="tab0" class="mu-tabCont tab_content">
							<div class="gridScrollT">
								<table id="stationAllGridThead" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover mu-grid-sort2">
									<colgroup>
										<col width="57">
										<col width="6%">
										<col width="6%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="6%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="6%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<thead>
									<tr>
										<th class="stat updown sort" data-id="AL_LV_NM" title="등급"><input type="hidden" value="TB.AL_LV">등급</th>
										<th class="updown sort" data-id="STATION_NAME" title="역사명"><input type="hidden" value="TB.STATION_NAME">역사명</th>
										<th class="updown sort" data-id="DU_NAME" title="기지국"><input type="hidden" value="TB.DU_NAME">기지국</th>
										<c:if test="${ruCellType == 'RU'}">
											<th class="updown sort" data-id="RU_NAME" title="중게기"><input type="hidden" value="TB.RU_NAME">중계기</th>
											<th class="updown sort" data-id="RU_CUID" title="Cell"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<th class="updown sort" data-id="RU_NAME" title="Cell"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<th class="updown sort" data-id="ATTEMPT" title="RRC 시도호"><input type="hidden" value="TB.ATTEMPT">RRC 시도호</th>
										<th class="updown sort" data-id="STD_ATTEMPT" title="RRC 기준시도호"><input type="hidden" value="TB.STD_ATTEMPT">RRC 기준시도호</th>
										<th class="updown sort" data-id="ATT_RATE" title="RRC 시도호 증감율(%)"><input type="hidden" value="TB.ATT_RATE">RRC 시도호 증감율(%)</th>
										<th class="updown sort" data-id="ERAB_ATTEMPT" title="ERAB Setup 시도호"><input type="hidden" value="TB.ERAB_ATTEMPT">ERAB Setup 시도호</th>
										<th class="updown sort" data-id="STD_ERAB_ATTEMPT" title="ERAB Setup 기준시도호"><input type="hidden" value="TB.STD_ERAB_ATTEMPT">ERAB Setup 기준시도호</th>
										<th class="updown sort" data-id="ERAB_ATT_RATE" title="RRC ERAB Setup 증가율(%)"><input type="hidden" value="TB.ERAB_ATT_RATE">ERAB Setup 시도호 증감율(%)</th>
										<th class="updown sort" data-id="RRC" title="소통호(RRC 성공호)"><input type="hidden" value="TB.RRC">소통호(RRC 성공호)</th>
										<th class="updown sort" data-id="RRC_RATE" title="소통율(RRC 성공율)(%)"><input type="hidden" value="TB.RRC_RATE">소통율(RRC 성공율)(%)</th>
										<th class="updown sort" data-id="ANSWER" title="완료호(ERAB Setup 성공호)"><input type="hidden" value="TB.ANSWER">완료호(ERAB Setup 성공호)</th>
										<th class="updown sort" data-id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)"><input type="hidden" value="TB.ANSWER_RATE">완료율(ERAB Setup 성공율)(%)</th>
										<th class="updown sort" data-id="ERAB_ADD_SUCCESS" title="ERAB Setup Add  성공호"><input type="hidden" value="TB.ERAB_ADD_SUCCESS">ERAB Setup 성공호</th>
										<th class="updown sort" data-id="CD" title="절단호"><input type="hidden" value="TB.CD">절단호</th>
										<th class="updown sort" data-id="CD_RATE" title="절단율(%)"><input type="hidden" value="TB.CD_RATE">절단율(%)</th>
										<th class="updown sort" data-id="EVENT_TIME" title="수집시간"><input type="hidden" value="TB.EVENT_TIME">수집시간</th>
									</tr>
									</thead>
								</table>
							</div>
							<div class="mu-scroll-v" style="height:240px;">
								<table id="stationAllGridBody" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover">
									<colgroup>
										<col width="57">
										<col width="6%">
										<col width="6%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="6%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="6%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					
						<div id="tab1" class="mu-tabCont tab_content">
							<div class="gridScrollT">
								<table id="station5GridThead" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover mu-grid-sort2">
									<colgroup>
										<col width="57">
										<col width="6%">
										<col width="6%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="6%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="6%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<thead>
									<tr>
										<th class="stat updown sort" data-id="AL_LV_NM" title="등급"><input type="hidden" value="TB.AL_LV">등급</th>
										<th class="updown sort" data-id="STATION_NAME" title="역사명"><input type="hidden" value="TB.STATION_NAME">역사명</th>
										<th class="updown sort" data-id="DU_NAME" title="기지국"><input type="hidden" value="TB.DU_NAME">기지국</th>
										<c:if test="${ruCellType == 'RU'}">
											<th class="updown sort" data-id="RU_NAME" title="중게기"><input type="hidden" value="TB.RU_NAME">중계기</th>
											<th class="updown sort" data-id="RU_CUID" title="Cell"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<th class="updown sort" data-id="RU_NAME" title="Cell"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<th class="updown sort" data-id="ATTEMPT" title="RRC 시도호"><input type="hidden" value="TB.ATTEMPT">RRC 시도호</th>
										<th class="updown sort" data-id="STD_ATTEMPT" title="RRC 기준시도호"><input type="hidden" value="TB.STD_ATTEMPT">RRC 기준시도호</th>
										<th class="updown sort" data-id="ATT_RATE" title="RRC 시도호 증감율(%)"><input type="hidden" value="TB.ATT_RATE">RRC 시도호 증감율(%)</th>
										<th class="updown sort" data-id="ERAB_ATTEMPT" title="ERAB Setup 시도호"><input type="hidden" value="TB.ERAB_ATTEMPT">ERAB Setup 시도호</th>
										<th class="updown sort" data-id="STD_ERAB_ATTEMPT" title="ERAB Setup 기준시도호"><input type="hidden" value="TB.STD_ERAB_ATTEMPT">ERAB Setup 기준시도호</th>
										<th class="updown sort" data-id="ERAB_ATT_RATE" title="RRC ERAB Setup 증가율(%)"><input type="hidden" value="TB.ERAB_ATT_RATE">ERAB Setup 시도호 증감율(%)</th>
										<th class="updown sort" data-id="RRC" title="소통호(RRC 성공호)"><input type="hidden" value="TB.RRC">소통호(RRC 성공호)</th>
										<th class="updown sort" data-id="RRC_RATE" title="소통율(RRC 성공율)(%)"><input type="hidden" value="TB.RRC_RATE">소통율(RRC 성공율)(%)</th>
										<th class="updown sort" data-id="ANSWER" title="완료호(ERAB Setup 성공호)"><input type="hidden" value="TB.ANSWER">완료호(ERAB Setup 성공호)</th>
										<th class="updown sort" data-id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)"><input type="hidden" value="TB.ANSWER_RATE">완료율(ERAB Setup 성공율)(%)</th>
										<th class="updown sort" data-id="ERAB_ADD_SUCCESS" title="ERAB Setup Add  성공호"><input type="hidden" value="TB.ERAB_ADD_SUCCESS">ERAB Setup 성공호</th>
										<th class="updown sort" data-id="CD" title="절단호"><input type="hidden" value="TB.CD">절단호</th>
										<th class="updown sort" data-id="CD_RATE" title="절단율(%)"><input type="hidden" value="TB.CD_RATE">절단율(%)</th>
										<th class="updown sort" data-id="EVENT_TIME" title="수집시간"><input type="hidden" value="TB.EVENT_TIME">수집시간</th>
									</tr>
									</thead>
								</table>
							</div>
							<div class="mu-scroll-v" style="height:240px;">
								<table id="station5GridBody" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover">
									<colgroup>
										<col width="57">
										<col width="6%">
										<col width="6%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="6%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="6%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>

						<div id="tab3" class="mu-tabCont tab_content">
							<div class="gridScrollT">
								<table id="station7GridThead" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover mu-grid-sort2">
									<colgroup>
										<col width="57">
										<col width="6%">
										<col width="6%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="6%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="6%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<thead>
									<tr>
										<th class="stat updown sort" data-id="AL_LV_NM" title="등급"><input type="hidden" value="TB.AL_LV">등급</th>
										<th class="updown sort" data-id="STATION_NAME" title="역사명"><input type="hidden" value="TB.STATION_NAME">역사명</th>
										<th class="updown sort" data-id="DU_NAME" title="기지국"><input type="hidden" value="TB.DU_NAME">기지국</th>
										<c:if test="${ruCellType == 'RU'}">
											<th class="updown sort" data-id="RU_NAME" title="중게기"><input type="hidden" value="TB.RU_NAME">중계기</th>
											<th class="updown sort" data-id="RU_CUID" title="Cell"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<th class="updown sort" data-id="RU_NAME" title="Cell"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<th class="updown sort" data-id="ATTEMPT" title="RRC 시도호"><input type="hidden" value="TB.ATTEMPT">RRC 시도호</th>
										<th class="updown sort" data-id="STD_ATTEMPT" title="RRC 기준시도호"><input type="hidden" value="TB.STD_ATTEMPT">RRC 기준시도호</th>
										<th class="updown sort" data-id="ATT_RATE" title="RRC 시도호 증감율(%)"><input type="hidden" value="TB.ATT_RATE">RRC 시도호 증감율(%)</th>
										<th class="updown sort" data-id="ERAB_ATTEMPT" title="ERAB Setup 시도호"><input type="hidden" value="TB.ERAB_ATTEMPT">ERAB Setup 시도호</th>
										<th class="updown sort" data-id="STD_ERAB_ATTEMPT" title="ERAB Setup 기준시도호"><input type="hidden" value="TB.STD_ERAB_ATTEMPT">ERAB Setup 기준시도호</th>
										<th class="updown sort" data-id="ERAB_ATT_RATE" title="RRC ERAB Setup 증가율(%)"><input type="hidden" value="TB.ERAB_ATT_RATE">ERAB Setup 시도호 증감율(%)</th>
										<th class="updown sort" data-id="RRC" title="소통호(RRC 성공호)"><input type="hidden" value="TB.RRC">소통호(RRC 성공호)</th>
										<th class="updown sort" data-id="RRC_RATE" title="소통율(RRC 성공율)(%)"><input type="hidden" value="TB.RRC_RATE">소통율(RRC 성공율)(%)</th>
										<th class="updown sort" data-id="ANSWER" title="완료호(ERAB Setup 성공호)"><input type="hidden" value="TB.ANSWER">완료호(ERAB Setup 성공호)</th>
										<th class="updown sort" data-id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)"><input type="hidden" value="TB.ANSWER_RATE">완료율(ERAB Setup 성공율)(%)</th>
										<th class="updown sort" data-id="ERAB_ADD_SUCCESS" title="ERAB Setup Add  성공호"><input type="hidden" value="TB.ERAB_ADD_SUCCESS">ERAB Setup 성공호</th>
										<th class="updown sort" data-id="CD" title="절단호"><input type="hidden" value="TB.CD">절단호</th>
										<th class="updown sort" data-id="CD_RATE" title="절단율(%)"><input type="hidden" value="TB.CD_RATE">절단율(%)</th>
										<th class="updown sort" data-id="EVENT_TIME" title="수집시간"><input type="hidden" value="TB.EVENT_TIME">수집시간</th>
									</tr>
									</thead>
								</table>
							</div>
							<div class="mu-scroll-v" style="height:240px;">
								<table id="station7GridBody" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover">
									<colgroup>
										<col width="57">
										<col width="6%">
										<col width="6%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="6%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="6%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
						
						<div id="tab2" class="mu-tabCont tab_content">
							<div class="gridScrollT">
								<table id="stationGridThead" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover mu-grid-sort2">
									<colgroup>
										<col width="57">
										<col width="9%">
										<col width="7%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="10%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="10%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<thead>
									<tr>
										<th class="stat updown sort" data-id="AL_LV_NM"><input type="hidden" value="TB.AL_LV">등급</th>
										<th class="updown sort" data-id="STATION_NAME"><input type="hidden" value="TB.STATION_NAME">역사명</th>
										<th class="updown sort" data-id="DU_NAME"><input type="hidden" value="TB.DU_NAME">기지국</th>
										<c:if test="${ruCellType == 'RU'}">
											<th class="updown sort" data-id="RU_NAME"><input type="hidden" value="TB.RU_NAME">중계기</th>
											<th class="updown sort" data-id="RU_CUID"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<th class="updown sort" data-id="RU_NAME"><input type="hidden" value="TB.RU_CUID">Cell</th>
										</c:if>
										<th class="updown sort" data-id="ATTEMPT" title="RRC 시도호"><input type="hidden" value="TB.ATTEMPT">RRC 시도호</th>
										<th class="updown sort" data-id="STD_ATTEMPT" title="RRC 기준시도호"><input type="hidden" value="TB.STD_ATTEMPT">RRC 기준시도호</th>
										<th class="updown sort" data-id="ATT_RATE" title="RRC 시도호 증감율(%)"><input type="hidden" value="TB.ATT_RATE">RRC 시도호 증감율(%)</th>
										<th class="updown sort" data-id="ERAB_ATTEMPT" title="ERAB Setup 시도호"><input type="hidden" value="TB.ERAB_ATTEMPT">ERAB Setup 시도호</th>
										<th class="updown sort" data-id="STD_ERAB_ATTEMPT" title="ERAB Setup 기준시도호"><input type="hidden" value="TB.STD_ERAB_ATTEMPT">ERAB Setup 기준시도호</th>
										<th class="updown sort" data-id="ERAB_ATT_RATE" title="RRC ERAB Setup 증가율(%)"><input type="hidden" value="TB.ERAB_ATT_RATE">ERAB Setup 시도호 증감율(%)</th>
										<th class="updown sort" data-id="RRC" title="소통호(RRC 성공호)"><input type="hidden" value="TB.RRC">소통호(RRC 성공호)</th>
										<th class="updown sort" data-id="RRC_RATE" title="소통율(RRC 성공율)(%)"><input type="hidden" value="TB.RRC_RATE">소통율(RRC 성공율)(%)</th>
										<th class="updown sort" data-id="ANSWER" title="완료호(ERAB Setup 성공호)"><input type="hidden" value="TB.ANSWER">완료호(ERAB Setup 성공호)</th>
										<th class="updown sort" data-id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)"><input type="hidden" value="TB.ANSWER_RATE">완료율(ERAB Setup 성공율)(%)</th>
										<th class="updown sort" data-id="ERAB_ADD_SUCCESS" title="ERAB Setup Add  성공호"><input type="hidden" value="TB.ERAB_ADD_SUCCESS">ERAB Setup 성공호</th>
										<th class="updown sort" data-id="CD" title="절단호"><input type="hidden" value="TB.CD">절단호</th>
										<th class="updown sort" data-id="CD_RATE" title="절단율(%)"><input type="hidden" value="TB.CD_RATE">절단율(%)</th>
										<th class="updown sort" data-id="EVENT_TIME" title="수집시간"><input type="hidden" value="TB.EVENT_TIME">수집시간</th>
									</tr>
									</thead>
								</table>
							</div>
							<div id="stationGridBodyDivSize" class="mu-scroll-v" style="height:240px; ">
								<table id="stationGridBody" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-hover">
									<colgroup>
										<col width="57">
										<col width="9%">
										<col width="7%">
										<c:if test="${ruCellType == 'RU'}">
											<col width="10%">
											<col width="6%">
										</c:if>
										<c:if test="${ruCellType == 'CELL'}">
											<col width="10%">
										</c:if>
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="6%">
										<col width="">
									</colgroup>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<div id="divDialogBackground" class="mu-dialog-background" style="display:none;" id="dialogBackground"></div>
	<div class="mu-dialog du-trend drag" style="width:1010px;height:470px;top:300px;left:460px;">
		<div class="mu-dialog-head dragHandle">
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
				<button id="trendRequest" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" data-ruid="" data-duid="" data-stationid=""><i class="mu-icon search"></i></button>
			</div>
		</div>
		<div class="mu-dialog-body">
			<div class="chartWrap">
				<div class="chart" id="chartWrap"></div>
			</div>
		</div>
	</div>

	<%@ include file="/WEB-INF/views/common/filter_alarm_noall.jsp" %>

	<iframe id="excelDownload" style='display: none;' ></iframe>
	
	<div class="Q-Tooltip" style="display:none;">
	</div>
</body>
</html>
