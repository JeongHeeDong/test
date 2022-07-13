<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<div class="mu-dialog" style="max-width: 1130px; top: 400px; left: 20px; display: none;width: auto;" id="popDetailWindow">
	<div class="mu-dialog-head" id="popDetailTitle">
		<span class="title" id="popDetailTitleText">상세보기 : DU#1</span>
		<button type="button" class="mu-btn mu-btn-icon" id="popDetailClose">
			<i class="mu-icon-img cancel"></i>
		</button>
	</div>
	<div class="mu-dialog-body-top" style="border-bottom:0px" id='_bodyDiv'>
		<div class="mu-search-group">
			<div class="mu-hgroup">
				<div class="mu-datepicker">
					<input value="05/20/2015" readonly="readonly" type="text" id="startDetailDate">
					<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="startDetailDateBtn">
						<i class="mu-icon calendar"></i>
					</button>
				</div>
				<div class="mu-selectbox">
					<select id="startDetailHourSelect" class="mu-value">
						<%
							for (int i = 0; i < 24; i++) {
								String hour = "";

								if (i < 10) {
									hour = "0" + i;
								} else {
									hour = i + "";
								}
						%>
						<option value="<%=hour%>"><%=hour%></option>
						<%
							}
						%>
					</select>
				</div>
				<div class="mu-selectbox">
					<select id="startDetailMinSelect" class="mu-value">
						<%
							for (int i = 0; i < 60;) {
								String min = "";

								if (i < 10) {
									min = "0" + i;
								} else {
									min = i + "";
								}
						%>
						<option value="<%=min%>"><%=min%></option>
						<%
							i += 5;
							}
						%>
					</select>
				</div>
				<span>~</span>
				<div class="mu-hgroup">
					<div class="mu-datepicker">
						<input value="05/20/2015" readonly="readonly" type="text" id="endDetailDate">
						<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="endDetailDateBtn">
							<i class="mu-icon calendar"></i>
						</button>
					</div>
					<div class="mu-selectbox">
						<select id="endDetailHourSelect" class="mu-value">
							<%
								for (int i = 0; i < 24; i++) {
									String hour = "";

									if (i < 10) {
										hour = "0" + i;
									} else {
										hour = i + "";
									}
							%>
							<option value="<%=hour%>"><%=hour%></option>
							<%
								}
							%>
						</select>
					</div>
					<div class="mu-selectbox">
						<select id="endDetailMinSelect" class="mu-value">
							<%
								for (int i = 0; i < 60;) {
									String min = "";

									if (i < 10) {
										min = "0" + i;
									} else {
										min = i + "";
									}
							%>
							<option value="<%=min%>"><%=min%></option>
							<%
								i += 5;
								}
							%>
						</select>
					</div>
					<div class="mu-selectbox" style="display: none" id="detailKpiDiv">
						<select id="_detailKpiSelect" class="mu-value">
							
						</select>
					</div>
				</div>
				<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="javascript:getPopDetailData()" id="searchBtn">
					<i class="mu-icon search"></i>
				</button>
			</div>
		</div>
		<div class="mu-dialog-body">
			<div class="gridWrap mt10" id='_tableDiv' style="overflow-y:scroll; max-height:395px;">
				<table id="detailTable" class="mu-grid mu-grid-border mu-grid-strip mu-grid-sort2">
					<thead>
						<tr id='detailHeaderTr'>
							<th>장비 ID</th>
							<th>기지국</th>
							<th>시도호</th>
							<th>기준 시도호</th>
							<th>시도호 증감율</th>
							<th>소통율</th>
							<th>완료율</th>
							<th>절단율</th>
						</tr>
					</thead>
					<tbody id="detailGrid" style="text-align: center;">
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<input type="hidden" id="popDetailFirstView" value=1>