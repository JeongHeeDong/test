<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<script src="/resources/js/failure/popup/unrecoveredInfo.js"></script>
<div id="equipAnalysisBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="equipAnalysisUp" class="mu-dialog" style="display: none; width: 1600px; height:; left: 42%; top: 25%;z-index: 11">
    <div id="equipAnalysisTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">장비별 알람통계 상세리스트</span></h2>
        <button id="equipAnalysisClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
	<div class="mu-dialog-body">
		<div class="gridScrollT gridWrap mt10">
			<table id="tb_equipAnalysis_detail_header" class="mu-grid mu-grid-border mu-grid-strip tbFix">
				<colgroup>
					<col width="3%">
					<col width="7%">
					<col width="6%">
					<col width="auto">
					<col width="5%">
					<col width="5%">
					<col width="5%">
					<col width="10%">
					<col width="10%">
					<col width="5%">
					<col width="5%">
					<col width="4%">
					<col width="6%">
					<col width="11%">
				</colgroup>
				<thead>
		            <tr>
		            	<th class='overTxt' title='No'>No</th> 		<!-- NO -->
		                <th class='overTxt' title='장비명'>장비명</th>  	<!-- VW_SYSTEM.SYSTEM_NAME  (SYSTEM_ID로 조인) -->
		                <th class='overTxt' title='알람코드'>알람코드</th> 	<!-- ALARM_CODE -->
		                <th class='overTxt' title='알람명'>알람명</th>  	<!-- PROBABLECAUSE -->
		                <th class='overTxt' title='장비종류'>장비종류</th> 	<!-- EQUIP_TYPE(EQUIP_NAME로 표현) -->
		                <th class='overTxt' title='알람등급'>알람등급</th> 	<!-- SEVERITY (1:CRI, 2:MAJ, 3:MIN, 4:WARN) -->
		                <th class='overTxt' title='알람상태'>알람상태</th> 	<!-- ALARM_STATE (0:Clear, 1:Open, 2:Ack, 3:Delete) -->
		                <th class='overTxt' title='발생시간'>발생시간</th>  <!-- EVENT_TIME -->
		                <th class='overTxt' title='복구시간'>복구시간</th>  <!-- RECOVER_TIME -->
		                <th class='overTxt' title='고장시간(초)'>고장시간(초)</th>  <!-- TIME_TO_REPAIR -->
		                <th class='overTxt' title='고장분류'>고장분류</th>  <!-- ALARM_TYPE (1:ALARM, 2:FAULT, 3:STATUS, 4:ETC) -->
		                <th class='overTxt' title='제조사'>제조사</th> 	<!--  VENDOR_NAME-->
		                <th class='overTxt' title='팀'>팀</th> 		<!-- TEAM_NAME -->
		                <th class='overTxt' title='발생위치'>발생위치</th> 	<!-- FDN -->
		            </tr>
		        </thead>
			</table>
		</div>
		<div class="gridWrap mu-scroll-v" style="height: 480px;max-height: 480px;overflow-y: scroll;">
			<table id="tb_equipAnalysis_detail" class="mu-grid mu-grid-border mu-grid-strip tbFix">
	            <colgroup>
					<col width="3%">
					<col width="7%">
					<col width="6%">
					<col width="auto">
					<col width="5%">
					<col width="5%">
					<col width="5%">
					<col width="10%">
					<col width="10%">
					<col width="5%">
					<col width="5%">
					<col width="4%">
					<col width="6%">
					<col width="11%">
				</colgroup>
	            <tbody>
	            </tbody>
			</table>
		</div>
	</div>
	<div class="mu-dialog-foot">
		<button id="btn_equipAnalysisOk" type="button" class="mu-btn mu-pop-btn mu-btn-icon">확인</button>
	</div>
</div>

<script>
function getEquipAnalysisDetailData(condition){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failureStatistic/analysis/failureAnalysisByEquip/getEquipAnalysisDetailData',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify(condition),
		success: function(data) {
			if(data['equipAnalysisDetailData'] != null && data['equipAnalysisDetailData'].length > 0){
				gridEquipAnalysisDetail(data['equipAnalysisDetailData']);
				
			} else {
				$("#tb_equipAnalysis_detail tbody tr").remove();
				$("#equipAnalysisClose").click();
				alert('조회된 데이터가 없습니다.');
			}
		}
	});
}

function gridEquipAnalysisDetail(detailData){
	var searchRow = "";
	var severity = '';
	var alarmStat = '';
	var alarmType = '';
	
	$.each(detailData, function(i,row) {
		
		severity = getDataConvert('NAME', 'SEVERITY', row['SEVERITY']);
		alarmStat = getDataConvert('NAME', 'ALARM_STATE', row['ALARM_STATE']);
		alarmType = getDataConvert('NAME', 'ALARM_TYPE', row['ALARM_TYPE']);
		searchRow += "<tr>";
		searchRow += 	"<td class='overTxt' align='center' title='" + (i+1) + "'>" + (i+1) + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['SYSTEM_NAME'] + "'>" + row['SYSTEM_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";	
		searchRow += 	"<td class='overTxt' align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + severity + "'>" + severity + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + alarmStat + "'>" + alarmStat + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + getDatetime(row['EVENT_TIME']) + "'>" + getDatetime(row['EVENT_TIME']) + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + getDatetime(row['RECOVER_TIME']) + "'>" + getDatetime(row['RECOVER_TIME']) + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['TIME_TO_REPAIR'] + "'>" + row['TIME_TO_REPAIR'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + alarmType + "'>" + alarmType + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['VENDOR_NAME'] + "'>" + row['VENDOR_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['TEAM_NAME'] + "'>" + row['TEAM_NAME'] + "</td>";
		searchRow += 	"<td class='overTxt' align='center' title='" + row['FDN'] + "'>" + row['FDN'] + "</td>";
		searchRow += "</tr>";
		
		
	});
	
	$("#tb_equipAnalysis_detail tbody").append(searchRow);
	
	searchRow = '';
}
</script>