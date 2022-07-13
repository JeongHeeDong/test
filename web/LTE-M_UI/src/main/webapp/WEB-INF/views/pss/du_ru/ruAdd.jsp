<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="/resources/js/pss/du_ru/ruAdd.js"></script>

<div id="ruAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="ruAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 500px; height: 780px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="ruAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">RU 추가</span></h2>
        <button id="ruAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body">
		<h3 class="mu-title">추가</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="160px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th><label>RU 명(*)</label></th>
					<td>
						<input id='ru_name_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>OPR STATUS(*)</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="ru_status_add" class="mu-value" value="1">사용</button>
							<ul id='ru_status_ul_add' class="mu-list">
								<li data-id="1">사용</li>
								<li data-id="0">미사용</li>
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>SECTOR(*)</label></th>
					<td>
						<input id='ru_sector_add' type="text" class="mu-input" value="0">
					</td>
				</tr>
				<tr>
					<th><label>PORT ID(*)</label></th>
					<td>
						<input id='ru_port_add' type="text" class="mu-input" value="0">
					</td>
				</tr>
				<tr>
					<th><label>SEQUENCE ID(*)</label></th>
					<td>
						<input id='ru_sequence_add' type="text" class="mu-input" value="0">
					</td>
				</tr>
				<tr>
					<th><label>제조사</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="ru_vendor_add" class="mu-value" value="1">삼성</button>
							<ul id='ru_vendor_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>운용팀</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="ru_team_add" class="mu-value" value="1">통신운용부</button>
							<ul id='ru_team_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>상용일자</label></th>
					<td>
						<div class="mu-datepicker">
							<input id="installRuAddDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installRuAddDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
					</td>
				</tr>
				<tr style="display:none">
					<th><label>역사</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="ru_station_add" class="mu-value" value = "0">관제소</button>
							<ul id='ru_station_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>RU 위치 설명</label></th>
					<td>
						<input id='ru_locationDesc_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr style="display:none">
					<th><label>RU 위치</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="ru_location_add" class="mu-value" value = "0">관제소</button>
							<ul id='ru_location_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>FREQUENCY</label></th>
					<td>
						<input id='ru_frequency_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>CONNECT RU TYPE</label></th>
					<td>
						<input id='ru_connectType_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>SERIALNUMBER</label></th>
					<td>
						<input id='ru_serialnumber_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>BOARD TYPE</label></th>
					<td>
						<input id='ru_boardType_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>DU(*)</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="ru_du_add" class="mu-value" value="101">본사-DU1</button>
							<ul id='ru_du_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>CELL NUMBER</label></th>
					<td>
						<input id='ru_cellNumber_add' type="text" class="mu-input" value="-1">
					</td>
				</tr>
				<tr>
            		<th colspan="2">*은 필수 요소입니다.</th>
            	</tr>
			</tbody>
		</table>
	</div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="ruAddModify" type="submit" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:ruadd()"><i class="mu-icon edit"></i>저장</button>
	    <button id="ruAddCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>
