<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<div id="gradeFilterBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="gradeFilterUp" class="mu-dialog" style="display: none; width: 620px; height: 790px; left: 42%; top: 25%;z-index: 11">
    <div id="gradeFilterTitle" class="mu-dialog-head">
    	<h2><span class="title" style="line-height: 200%;">알람 등급 필터</span></h2>
        <button id="gradeFilterClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body">
    	<h3 class="mu-title">등급 설정 목록</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="100px">
				<col width="">
			</colgroup>
			<tbody>
				<tr>
					<th>빠른설정</th>
					<td>
						<button id="btn_gradeFt_all" type="button" class="mu-btn mu-btn-xs">All</button>
						<button id="btn_gradeFt_minor" type="button" class="mu-btn mu-btn-xs minor">Minor</button>
						<button id="btn_gradeFt_major" type="button" class="mu-btn mu-btn-xs major">Major</button>
						<button id="btn_gradeFt_critical" type="button" class="mu-btn mu-btn-xs critical">Critical</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div id="gradeFilterArea" class="mt5">
			<table class="mu-formbox">
				<colgroup>
					<col width="140px">
					<col width="">
					<col width="140px">
					<col width="">
				</colgroup>
				<tbody>
					<tr>
						<th>MME</th>
						<td>
							<div class="mu-selectbox">
								<select name="1" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>GW</th>
						<td>
							<div class="mu-selectbox">
								<select name="4" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>SMetro</th>
						<td>
							<div class="mu-selectbox">
								<select name="2" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>HSS</th>
						<td>
							<div class="mu-selectbox">
								<select name="6" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>방화벽</th>
						<td>
							<div class="mu-selectbox">
								<select name="13" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>PCRF</th>
						<td>
							<div class="mu-selectbox">
								<select name="7" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>CALL</th>
						<td>
							<div class="mu-selectbox">
								<select name="8" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>MCPTT</th>
						<td>
							<div class="mu-selectbox">
								<select name="9" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>저장장치</th>
						<td>
							<div class="mu-selectbox">
								<select name="10" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>지령서버</th>
						<td>
							<div class="mu-selectbox">
								<select name="12" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>하남선스위치</th>
						<td>
							<div class="mu-selectbox">
								<select name="11" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>노키아스위치</th>
						<td>
							<div class="mu-selectbox">
								<select name="44" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>정류기 EMS</th>
						<td>
							<div class="mu-selectbox">
								<select name="42" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>EMS-R</th>
						<td>
							<div class="mu-selectbox">
								<select name="14" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>EMS-C</th>
						<td>
							<div class="mu-selectbox">
								<select name="15" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>EMS-HSS</th>
						<td>
							<div class="mu-selectbox">
								<select name="16" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>메세징 EMS</th>
						<td>
							<div class="mu-selectbox">
								<select name="29" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>EMS-NW</th>
						<td>
							<div class="mu-selectbox">
								<select name="30" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>IM(메시징)</th>
						<td>
							<div class="mu-selectbox">
								<select name="21" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>MGW</th>
						<td>
							<div class="mu-selectbox">
								<select name="22" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>백업</th>
						<td>
							<div class="mu-selectbox">
								<select name="23" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>행선안내</th>
						<td>
							<div class="mu-selectbox">
								<select name="24" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>메시징</th>
						<td>
							<div class="mu-selectbox">
								<select name="25" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>영상처리장치</th>
						<td>
							<div class="mu-selectbox">
								<select name="27" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>MDM</th>
						<td>
							<div class="mu-selectbox">
								<select name="18" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>EPC-HOST</th>
						<td>
							<div class="mu-selectbox">
								<select name="28" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						
					</tr>
					<tr>
						<th>UCMS</th>
						<td>
							<div class="mu-selectbox">
								<select name="20" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>예비용MME</th>
						<td>
							<div class="mu-selectbox">
								<select name="31" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>예비용GW</th>
						<td>
							<div class="mu-selectbox">
								<select name="32" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>예비용HPS</th>
						<td>
							<div class="mu-selectbox">
								<select name="33" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>복합측위</th>
						<td>
							<div class="mu-selectbox">
								<select name="35" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>정류기</th>
						<td>
							<div class="mu-selectbox">
								<select name="36" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
					<tr>
						<th>FOTA</th>
						<td>
							<div class="mu-selectbox">
								<select name="37" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
						<th>콘텔라 EMS</th>
						<td>
							<div class="mu-selectbox">
								<select name="39" class="mu-value">
									<option value="0" selected="selected">ALL</option>
									<option value="1">CRITICAL</option>
									<option value="2">MAJOR</option>
									<option value="3">MINOR</option>
									<option value="9">NONE</option>
								</select>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="mu-dialog-foot">
		<!-- <button id="btn_gradeFt_default" type="button" class="mu-btn mu-pop-btn mu-btn-icon mu-btn-cancel">기본값</button> -->
		<button id="btn_gradeFt_save" type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon check"></i>확인</button>
		<button id="btn_gradeFt_cancel" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
	</div>
</div>
