<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<div>
	<!-- for modal dialog -->
	<div class="mu-dialog-background dlg_alarm hidden"></div>

	<div class="mu-dialog hidden" id="dlg_alarm" style="width:560px;">
		<div class="mu-dialog-head">
			<span class="title" style="line-height: 200%;">알람 조건 설정</span> 
			<a href="javascript:" class="mu-btn mu-btn-icon mu-btn-icon-only btnClose btn-close">
			<i class="mu-icon-img close"></i></a>
		</div>
		
		<div class="mu-dialog-body">
		
			<div class="mu-row" style="width: 49.5%;display: inline-table;">
				<div class="mu-col mu-col-12">
					<div>
						<span>▶선택 알람 그룹</span>
						<button id="btn_searchAlarmGroup1" class="mu-btn" onclick="javascript:popupAlarmGroupSelect('select')">알람그룹 조회</button>
					</div>
					<div class="gridWrap mt10" style="overflow:auto;height:297px">
						<table id="tb_select_alarmGroup" class="mu-grid mu-grid-border">
							<thead>
								<tr>
									<th>그룹명</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="mu-row" style="width: 49.5%;display: inline-table;">
				<div class="mu-col mu-col-12">
					<div>
						<span>▶제외 알람 그룹</span>
						<button id="btn_searchAlarmGroup2" class="mu-btn" onclick="javascript:popupAlarmGroupSelect('except')">알람그룹 조회</button>
					</div>
					<div class="gridWrap mt10" style="overflow:auto;height:297px">
						<table id="tb_except_alarmGroup" class="mu-grid mu-grid-border">
							<thead>
								<tr>
									<th>그룹명</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="mu-dialog-foot">
			<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes">확인</button>
			<button class="mu-btn mu-btn-icon btn-close mu-btn-cancel">취소</button>
		</div>
	</div>
</div>

<div>
	<!-- for modal dialog -->
	<div class="mu-dialog-background hidden"></div>

	<div class="mu-dialog hidden" id="dlg_alarm_sub" style="width:700px;">
		<input id='alarmGroupType' type='hidden' val=''>
		<div class="mu-dialog-head">
			<span class="title">알람 그룹 선택</span> 
			<a href="javascript:" class="mu-btn mu-btn-icon mu-btn-icon-only btnClose btn-close">
			<i class="mu-icon-img close"></i></a>
		</div>
		
		<div class="mu-dialog-body">
		
			<div class="listBox">
				<div class="inBox fl" style="height: 250px">
					<div>
						<span>▶알람 그룹 리스트</span>
					</div>
					<table id="tb_alarmGroupList" class="mu-grid mu-grid-border">
						<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
						   				<input type="checkbox" id="chk_alarmGroupHead">
						   				<label for="chk_alarmGroupHead"></label>
						   			</div>
						   		</th>
								<th>그룹명</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
				<button class="mu-btn btnAdd" onclick="javascript:addAlarmGroupList()" type="button"><span>&gt;</span></button>
				<div class="inBox fr" style="height: 250px">
					<div>
						<span>▶선택 알람 그룹</span>
					</div>
					<table id="tb_selected_alarmGroupList" class="mu-grid mu-grid-border">
						<thead>
							<tr>
								<th>
									<div class="mu-checkbox">
						   				<input type="checkbox" id="chk_selected_alarmGroupHead">
						   				<label for="chk_selected_alarmGroupHead"></label>
						   			</div>
						   		</th>
								<th>그룹명</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
				<button class="mu-btn btnDel" onclick="javascript:deleteAlarmGroupList()" type="button"><span>&lt;</span></button>
			</div>
			
			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap mt10" style="overflow:auto;height:200px">
						<table id="tb_selected_alarmGroup_detailList" class="mu-grid mu-grid-border">
							<thead>
								<tr>
									<th>고장그룹</th>
									<th>알람코드</th>
									<th>등급</th>
									<th>장비명</th>
									<th>PROBABLE_CAUSE</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="mu-dialog-foot">
			<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes" onClick="javascript:saveAlarmGroupList()">확인</button>
			<button class="mu-btn mu-btn-icon btn-close mu-btn-cancel">취소</button>
		</div>
	</div>
</div>

<script>
var failureGroupDataList = null;

$("#chk_alarmGroupHead").on('click', function(e){
	var chk = '';
	if($("#chk_alarmGroupHead").prop("checked")){
		chk='checked';
	} else {
		chk='';
	}
	$("#tb_alarmGroupList tbody tr td").each(function(){
		if($(this).find('input:checkbox').length > 0){
			$(this).find('input:checkbox').prop('checked',chk);
		}
	});
});

$("#chk_selected_alarmGroupHead").on('click', function(e){
	var chk = '';
	if($("#chk_selected_alarmGroupHead").prop("checked")){
		chk='checked';
	} else {
		chk='';
	}
	$("#tb_selected_alarmGroupList tbody tr td").each(function(){
		if($(this).find('input:checkbox').length > 0){
			$(this).find('input:checkbox').prop('checked',chk);
		}
	});
});

function popupAlarmGroupSelect(groupType){
	$("#dlg_alarm_sub .mu-dialog-head .title").html('알람 그룹 선택');
   	searchAlarmGroup();
   	$("#alarmGroupType").val(groupType);
   	
    openDialog('#dlg_alarm_sub', function (fnCloseDlg) {
    	
    	$("#tb_" + groupType + "_alarmGroup tbody tr").remove();
		$("#tb_selected_alarmGroupList tbody tr").each(function(i, e){
	    	var tbLen = $("#tb_" + groupType + "_alarmGroup tbody tr").length;
	    	var groupId = $(e).find('input[name="alarmGroupId"]').text();
	    	var groupName = $(e).find('td').eq(1).text();
			var groupRow = "";
			groupRow += "<tr style='cursor:pointer;'>";
			groupRow += 	"<td align='center' title='" + groupName + "'>" + groupName + "</td>";
			groupRow += 	"<input type='hidden' name='" + groupType + "GroupId' value='" + groupId + "' />";
			groupRow += "</tr>";
			$("#tb_" + groupType + "_alarmGroup tbody").append(groupRow);
		});
    	
    	
    	fnCloseDlg();
    });
}

function searchAlarmGroup(){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/main/failureSearch/searchAlarmGroupSelect',
		dataType:'json',
		success: function(data) {
			if(data != null && data['searchAlarmGroupList'].length > 0){
				failureGroupDataList = data['searchAlarmGroupList'];
				gridAlarmGroupList(data['searchAlarmGroupList']);
			}
		}
	});
}

function gridAlarmGroupDetail(){
	$("#tb_selected_alarmGroup_detailList tbody tr").remove();
	
	var checkedGroupIds = [];
	$("#tb_alarmGroupList tbody tr input:checkbox:checked").each(function(i,e){
		var groupId = $(this).parent().parent().parent().find('input[name="alarmGroupId"]').val();
		checkedGroupIds.push(parseInt(groupId));
	});
	
	if(failureGroupDataList != null){
		$.each(failureGroupDataList,function(i,row){
			
			if(checkedGroupIds.indexOf(row['ALARM_GROUP_ID']) > -1){
				var severity = 'WARNING';
				if(row['ORG_SEVERITY'] == 1){
					severity = 'CRITICAL';
				} else if(row['ORG_SEVERITY'] == 2){
					severity = 'MAJOR';
				} else if(row['ORG_SEVERITY'] == 3){
					severity = 'MINOR';
				} 
				
				var groupRow = "";
				groupRow += "<tr style='cursor:pointer;'>";
				groupRow += 	"<td align='center' title='" + row['ALARM_GROUP_NAME'] + "'>" + row['ALARM_GROUP_NAME'] + "</td>";
				groupRow += 	"<input type='hidden' name='alarmGroupId' value='" + row['ALARM_GROUP_ID'] + "' />";
				groupRow += 	"<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
				groupRow += 	"<td align='center' title='" + severity + "'>" + severity + "</td>";
				groupRow += 	"<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
				groupRow += 	"<td align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
				groupRow += "</tr>";
				
				$("#tb_selected_alarmGroup_detailList tbody").append(groupRow);
			}
		});
	}
}

function gridAlarmGroupList(alarmGroupList){
	
	$("#tb_alarmGroupList tbody tr").remove();
	$("#tb_selected_alarmGroupList tbody tr").remove();
	$("#tb_selected_alarmGroup_detailList tbody tr").remove();
	var groupIdList = [];
	$.each(alarmGroupList,function(i,row){
		if(groupIdList.indexOf(row['ALARM_GROUP_ID']) > -1){
			return true;
		}
		groupIdList.push(row['ALARM_GROUP_ID']);
		var tbLen = $("#tb_alarmGroupList tbody tr").length;
		var groupRow = "";
		groupRow += "<tr style='cursor:pointer;'>";
		groupRow += "	<td align='center'>";
		groupRow += "		<div class='mu-checkbox'>";
		groupRow += "			<input type='checkbox' id='chk_alarmGroup" + tbLen + "'>";
		groupRow += "			<label for='chk_alarmGroup" + tbLen + "'></label>";
		groupRow += "		</div>";
		groupRow += "	</td>";
		groupRow += 	"<td align='center' title='" + row['ALARM_GROUP_NAME'] + "'>" + row['ALARM_GROUP_NAME'] + "</td>";
		groupRow += 	"<input type='hidden' name='alarmGroupId' value='" + row['ALARM_GROUP_ID'] + "' />";
		groupRow += "</tr>";
		
		$("#tb_alarmGroupList tbody").append(groupRow);
		
	});
	
	$("#tb_alarmGroupList tbody tr input:checkbox").bind('click',function(e){
		var tbLen = $("#tb_alarmGroupList tbody tr").length;
		var chkLen = $("#tb_alarmGroupList tbody tr").find('input:checkbox:checked').length;
		if(tbLen != 0 && tbLen == chkLen){
			$("#chk_alarmGroupHead").prop("checked",true);
		} else {
			$("#chk_alarmGroupHead").prop("checked",false);
		}
		gridAlarmGroupDetail();
	});
	
	$("#chk_alarmGroupHead").prop("checked",false);
	$("#chk_alarmGroupHead").on('click',function(e){
		gridAlarmGroupDetail();
	});
}

function addAlarmGroupList(){
	$("#tb_alarmGroupList tbody tr input:checkbox:checked").each(function(i,e) { 
		var td = $(this).parent().parent().parent().find('td');
		var groupName = td.eq(1).text();
		var groupId = $(this).parent().parent().parent().find("input[name='alarmGroupId']").val();
		var flag = false;
		$("#tb_selected_alarmGroupList tbody tr").each(function(){ 
			if(groupName == $(this).find('td').eq(1).text()) {
				flag = true;
				return false; //break;
			}
		});
		
		if(!flag) {
			var tbLen = $("#tb_selected_alarmGroupList tbody tr").length;
			var groupRow = '';
			groupRow += "<tr style='cursor:pointer;'>";
			groupRow += "	<td align='center'>";
			groupRow += "		<div class='mu-checkbox'>";
			groupRow += "			<input type='checkbox' id='chk_selected_alarmGroup" + tbLen + "'>";
			groupRow += "			<label for='chk_selected_alarmGroup" + tbLen + "'></label>";
			groupRow += "		</div>";
			groupRow += "	</td>";
			groupRow += 	"<td align='center' title='" + groupName + "'>" + groupName + "</td>";
			groupRow += 	"<input type='hidden' name='selected_alarmGroupId' value='" + groupId + "' />";
			groupRow += "</tr>";
			
			$("#tb_selected_alarmGroupList").append(groupRow);
		} 
	});
	
	$("#tb_selected_alarmGroupList tbody tr input:checkbox").bind('click',function(e) {
		var tbLen = $("#tb_selected_alarmGroupList tbody tr").length;
		var chkLen = $("#tb_selected_alarmGroupList tbody tr").find('input:checkbox:checked').length;
		if(tbLen != 0 && tbLen == chkLen) {
			$("#chk_selected_alarmGroupHead").prop("checked",true);
		} else {
			$("#chk_selected_alarmGroupHead").prop("checked",false);
		}
	});

	$("#chk_selected_alarmGroupHead").prop("checked",false);
}

function deleteAlarmGroupList(){
	$("#tb_selected_alarmGroupList tbody tr input:checkbox:checked").each(function(i,e) { 
		$(this).parent().parent().parent().remove();
	});
	
	var tbLen = $("#tb_selected_alarmGroupList tbody tr").length;
	var chkLen = $("#tb_selected_alarmGroupList tbody tr").find('input:checkbox:checked').length;
	if(tbLen != 0 && tbLen == chkLen) {
		$("#chk_selected_alarmGroupHead").prop("checked",true);
	} else {
		$("#chk_selected_alarmGroupHead").prop("checked",false);
	}
}

function saveAlarmGroupList(){
	if($("#tb_selected_alarmGroupList tbody tr").length != 0){
		var alarmType = $("#alarmGroupType").val();
		spAlarm[alarmType] = [];
		$("#tb_selected_alarmGroupList tbody tr").each(function(i,e) {
			/* var rowItem = {};
			rowItem['ALARM_GROUP_NAME'] = $(this).find('td').eq(1).text();
			rowItem['ALARM_GROUP_ID'] = $(this).find('input[name="selected_alarmGroupId"]').val(); */
			var alarmGroupId = $(this).find('input[name="selected_alarmGroupId"]').val();
			spAlarm[alarmType].push(alarmGroupId);
		});
		
	} else {
		$("#tb_select_alarmGroup tbody tr").remove();
		return;
	}
	
	//$("#btn_searchSystem_cancel").click();
	
}
</script>