<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<div class="mu-dialog" style="width: 800px; top: 400px; left: 20px; display: none;" id="popTrendWindow">
	<div class="mu-dialog-head" id="popTrendTitle">
		<span class="title" id="popTrendTitleText">품질 Trend : DU#1</span>
		<button type="button" class="mu-btn mu-btn-icon" id="popTrendClose">
			<i class="mu-icon-img cancel"></i>
		</button>
	</div>
	<div class="mu-dialog-body-top" style="border-bottom:0px">
		<div class="mu-search-group">
			<div class="mu-hgroup">
				<div class="mu-datepicker">
					<input value="05/20/2015" readonly="readonly" type="text" id="startDate">
					<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="startDateBtn">
						<i class="mu-icon calendar"></i>
					</button>
				</div>
				<div class="mu-selectbox">
					<select id="startHourSelect" class="mu-value">
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
					<select id="startMinSelect" class="mu-value">
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
						<input value="05/20/2015" readonly="readonly" type="text" id="endDate">
						<button class="mu-btn mu-btn-icon mu-btn-icon-only" id="endDateBtn">
							<i class="mu-icon calendar"></i>
						</button>
					</div>
					<div class="mu-selectbox">
						<select id="endHourSelect" class="mu-value">
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
						<select id="endMinSelect" class="mu-value">
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
					<div class="mu-selectbox" style="display: none" id="kpiDiv">
						<select id="kpiSelect" class="mu-value">
							
						</select>
					</div>
				</div>
				<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" onclick="javascript:getPopTrendData()">
					<i class="mu-icon search"></i>
				</button>
			</div>
		</div>
		<div class="mu-dialog-body">
			<div class="chartWrap" id="chartDiv" style="overflow:hidden; padding:0;"></div>
		</div>
	</div>
</div>
<input type="hidden" id="popTrendFirstView" value=1>