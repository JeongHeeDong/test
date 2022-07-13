<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<div>
	<!-- for modal dialog -->
	<div class="mu-dialog-background dlg_alarmCode hidden" id="spAlarmBg"></div>

	<div class="mu-dialog hidden" id="dlg_alarmCode" style="width:600px;">
		<div class="mu-dialog-head">
			<span class="title" style="line-height: 200%;">알람코드 선택</span> 
			<a href="javascript:" class="mu-btn mu-btn-icon mu-btn-icon-only btnClose btn-close" id="spAlarmClose">
			<i class="mu-icon-img close"></i></a>
		</div>
		
		<div class="mu-dialog-body">
			<div class="mu-boxWrap">
					<div class="mu-boxRow" style="overflow-y:scroll">
						<!-- <div class="mu-boxCell" style="width:75%; overflow-x:scroll"> -->
						<div style="height: 250px; overflow-y:auto">
							<table id="tb_alarmCode" class="mu-grid mu-grid-border">
								<thead>
									<tr>
										<th>
											<div class="mu-checkbox">
								   				<input type="checkbox" id="chk_alarmCodeHead">
								   				<label for="chk_alarmCodeHead"></label>
								   			</div>
										</th>
										<th>장비종류</th>
										<th>장비명</th>
										<th>알람코드</th>
										<th>CAUSE</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
						<!-- </div>
						<div class="mu-boxCell">
							<div class="mu-search-group">
								<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes">확인</button>
								<button class="mu-btn mu-btn-icon btn-close mu-btn-cancel" id="spAlarmCancel">취소</button>
							</div>
						</div> -->
					</div>
			</div>
		</div>
		<div class="mu-dialog-foot" style="text-align: center;">
			<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes">확인</button>
			<button id="spAlarmCancel" class="mu-btn mu-btn-icon btn-close mu-btn-cancel">취소</button>
		</div>
	</div>
</div>

<script>
$("#chk_alarmCodeHead").on('click', function(e){
	if($("#chk_alarmCodeHead").prop("checked")){
		chk='checked';
	} else {
		chk='';
	}
	$("#tb_alarmCode tbody tr td").each(function(){
		if($(this).find('input:checkbox').length > 0){
			$(this).find('input:checkbox').prop('checked',chk);
		}
	});
});

//searchAlarmCode();

function searchAlarmCode(alarmCodeCondition){
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/main/failureSearch/alarmCodeSelect',
		contentType : 'application/json; charset=UTF-8',
		dataType :'json',
		data : JSON.stringify({			
			alarmDesc : alarmCodeCondition['alarmDesc'],
			systemIds : alarmCodeCondition['systemIds']
		}),
		success: function(data) {
			if(data != null && data['alarmCodeList'].length > 0){
				gridAlarmCodeList(data['alarmCodeList']);
			}
		}
	});
}

function gridAlarmCodeList(alarmcodeList){
	
	$("#tb_alarmCode tbody tr").remove();
	$.each(alarmcodeList,function(i,row){
		var tbLen = $("#tb_alarmCode tbody tr").length;
		var codeRow = "";
		codeRow += "<tr style='cursor:pointer;'>";
		codeRow += "	<td align='center'>";
		codeRow += "		<div class='mu-checkbox'>";
		codeRow += "			<input type='checkbox' id='chk_alarmCode" + tbLen + "'>";
		codeRow += "			<label for='chk_alarmCode" + tbLen + "'></label>";
		codeRow += "		</div>";
		codeRow += "	</td>";
		codeRow += "	<td align='center' title='" + row['EQUIP_NAME'] + "'>" + row['EQUIP_NAME'] + "</td>";
		codeRow += "	<td align='center' title='" + row['SYSTEM_ID'] + "'>" + row['SYSTEM_ID'] + "</td>";
		codeRow += "	<td align='center' title='" + row['ALARM_CODE'] + "'>" + row['ALARM_CODE'] + "</td>";
		codeRow += "	<td align='center' title='" + row['PROBABLE_CAUSE'] + "'>" + row['PROBABLE_CAUSE'] + "</td>";
		codeRow += "	<input type='hidden' name='alarmCode' value='" + row['ALARM_CODE'] + "' />";
		codeRow += "</tr>";
		
		$("#tb_alarmCode tbody").append(codeRow);
	});
	
	$("#tb_alarmCode tbody tr input:checkbox").bind('click',function(e) {
		var tbLen = $("#tb_alarmCode tbody tr").length;
		var chkLen = $("#tb_alarmCode tbody tr").find('input:checkbox:checked').length;
		if(tbLen != 0 && tbLen == chkLen) {
			$("#chk_alarmCodeHead").prop("checked",true);
		} else {
			$("#chk_alarmCodeHead").prop("checked",false);
		}
	});
	$("#chk_alarmCodeHead").prop("checked",false);

}
</script>
	