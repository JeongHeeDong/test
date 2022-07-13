<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<script src="<c:url value="/resources/js/pss/du_ru/duAdd.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>

<div id="duAddBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="duAddUp" class="mu-dialog mu-fix-foot" style="display: none; width: 480px; height: 550px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="duAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
       <h2><span class="title">DU 추가</span></h2>
       <button id="duAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
   </div>
	<div class="mu-dialog-body" id="duAddDiv">
		<!-- 기본 정보 -->
		<h3 class="mu-title">추가</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="130px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th><label>DU ID(*)</label></th>
					<td>
						<div class="mu-item-group">
						   <input id='du_id_add' type="text" class="mu-input">
						   <button id='du_id_check' type="button" class="mu-btn" onclick="javascirpt:idCheck()">중복체크</button>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>DU 명(*)</label></th>
					<td>
						<input id='du_name_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>  
					<th><label>구분(*)</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="du_line_add" class="mu-value">선택</button>
							<ul id='du_line_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr> 
				<tr>
					<th><label>OPR STATUS(*)</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="du_status_add" class="mu-value" value="1">사용</button>
							<ul id='du_status_ul_add' class="mu-list">
								<li data-id="1">사용</li>
								<li data-id="0">미사용</li>
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>제조사</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="du_vendor_add" class="mu-value" value="1")>삼성</button>
							<ul id='du_vendor_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>운용팀</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="du_team_add" class="mu-value" value="1">통신운용부</button>
							<ul id='du_team_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>상용일자</label></th>
					<td>
						<div class="mu-datepicker">
							<input id="installDuAddDateTxt" type="text" value="" readonly="readonly"/>
							<button id="installDuAddDateBtn" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon calendar"></i></button>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>위치</label></th>
					<td>
						<input id='du_area_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr  style="display:none">
					<th><label>역사</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="du_station_add" class="mu-value" value="0">관제소</button>
							<ul id='du_station_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<th><label>MASTER IP(*)</label></th>
					<td>
						<input id='du_masterIp_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr style="display:none">
					<th><label>EMS</label></th>
					<td>
						<div class="mu-selectbox">
							<button id="du_ems_add" class="mu-value" value="9999">LSM</button>
							<ul id='du_ems_ul_add' class="mu-list">
							</ul>
						</div>
					</td>
				</tr>
				<tr style="display:none">
					<th><label>EMS IP</label></th>
					<td>
						<input id='du_onmIp_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr style="display:none">
					<th><label>DU GROUP</label></th>
					<td>
						<input id='du_group_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
					<th><label>MASTER IP2</label></th>
					<td>
						<input id='du_masterIp2_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr style="display:none">
					<th><label>DU VERSION</label></th>
					<td>
						<input id='du_version_add' type="text" class="mu-input">
					</td>
				</tr>
				<tr>
            		<th colspan="2">*은 필수 요소입니다.</th>
            	</tr>
			</tbody>
		</table>
	</div>
	<div class="mu-dialog-foot" style="text-align: center;">
	    <button id="duAddModify" type="submit" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascirpt:duadd()"><i class="mu-icon edit"></i>저장</button>
	    <button id="duAddCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>
