var alarmGradeFilterMap = null;
var alarmCodeFilterList = null;
var alarmSystemFilterList = null;
var majorAlarmCodeFilterList = null;
var alarmStationFilterList = null;
var majorAlarmCodeFilterDict = {};

$(document).ready(function(){
	
	/*--------------- 등급필터 ------------------*/
	
	$("#btn_gradeFt_critical").on('click', function(e){
		$("#gradeFilterArea select").each(function(i,e) { 
			$(e).val("1");
		});
	});
	$("#btn_gradeFt_major").on('click', function(e){
		$("#gradeFilterArea select").each(function(i,e) { 
			$(e).val("2");
		});
	});
	$("#btn_gradeFt_minor").on('click', function(e){
		$("#gradeFilterArea select").each(function(i,e) { 
			$(e).val("3");
		});
	});
	$("#btn_gradeFt_all").on('click', function(e){
		$("#gradeFilterArea select").each(function(i,e) { 
			$(e).val("0");
		});
	});
	
	$("#btn_gradeFt_default").on('click', function(e){
		gridAlarmGradeFilter();
	});
	$("#btn_gradeFt_save").on('click', function(e){
		if (confirm("저장하시겠습니까?") == true){    //확인
			setAlarmGradeFilter();
		}else{   //취소
		    return;
		}
	});
	$("#btn_gradeFt_cancel").on('click', function(e){
		$('#gradeFilterBg').fadeOut();
		$('#gradeFilterUp').fadeOut();
	});
	
	/*--------------- 코드필터 ------------------*/
	
	$("#btn_codeFt_allRemove").on('click', function(e){
		$("#tb_alarmCodeFilter tbody tr").each( function(i,e) {
			$(this).remove();
		}); 
	});
	
	$("#btn_codeFt_remove").on('click', function(e){
		$("#tb_alarmCodeFilter tbody tr").each( function(i,e) {
			if($(e).hasClass("selected")) {
				$(this).remove();
			}
		}); 
	});
	
	$("#btn_codeFt_save").on('click', function(e){
		if (confirm("저장하시겠습니까?") == true){    //확인
			setAlarmCodeFilter();
		}else{   //취소
		    return;
		}
	});
	
	$("#btn_codeFt_cancel").on('click', function(e){
		$('#codeFilterBg').fadeOut();
		$('#codeFilterUp').fadeOut();
	});
	
	/*--------------- 장비필터 ------------------*/
	
	$("#btn_systemFt_allRemove").on('click', function(e){
		$("#tb_systemFilter tbody tr").each( function(i,e) {
			$(this).remove();
		}); 
	});
	
	$("#btn_systemFt_remove").on('click', function(e){
		$("#tb_systemFilter tbody tr").each( function(i,e) {
			if($(e).hasClass("selected")) {
				$(this).remove();
			}
		}); 
	});
	
	$("#btn_systemFt_save").on('click', function(e){
		if (confirm("저장하시겠습니까?") == true){    //확인
			setSystemFilter();
		}else{   //취소
		    return;
		}
	});
	
	$("#btn_systemFt_cancel").on('click', function(e){
		$('#systemFilterBg').fadeOut();
		$('#systemFilterUp').fadeOut();
	});
	
	/*--------------- 중요알람필터 ------------------*/
	
	$("#btn_mjAlarmFt_allRemove").on('click', function(e){
		$("#tb_majorAlarmFilter tbody tr").each( function(i,e) {
			$(this).remove();
		}); 
	});
	
	$("#btn_mjAlarmFt_remove").on('click', function(e){
		$("#tb_majorAlarmFilter tbody tr").each( function(i,e) {
			if($(e).hasClass("selected")) {
				$(this).remove();
			}
		}); 
	});
	
	$("#btn_mjAlarmFt_save").on('click', function(e){
		if (confirm("저장하시겠습니까?") == true){    //확인
			setMajorAlarmFilter();
		}else{   //취소
		    return;
		}
	});
	
	$("#btn_mjAlarmFt_cancel").on('click', function(e){
		$('#majorAlarmFilterBg').fadeOut();
		$('#majorAlarmFilterUp').fadeOut();
	});
	
	/*--------------- 역사필터 ------------------*/
	
	$("#btn_stationFt_allRemove").on('click', function(e){
		$("#tb_stationFilter tbody tr").each( function(i,e) {
			$(this).remove();
		}); 
	});
	
	$("#btn_stationFt_remove").on('click', function(e){
		$("#tb_stationFilter tbody tr").each( function(i,e) {
			if($(e).hasClass("selected")) {
				$(this).remove();
			}
		}); 
	});
	
	$("#btn_stationFt_save").on('click', function(e){
		if (confirm("저장하시겠습니까?") == true){    //확인
			setStationFilter();
		}else{   //취소
		    return;
		}
	});
	
	$("#btn_stationFt_cancel").on('click', function(e){
		$('#stationFilterBg').fadeOut();
		$('#stationFilterUp').fadeOut();
	});
	
});


/* -------------------------------------------------- 중요알람 필터(아래) -------------------------------------------------- */

/**
 * 중요알람필터 화면의 왼쪽에 알람코드를 트리로 뿌려주기 위한 함수
 */
function gridMajorAlarmTree(){
	$('#majorAlarmFilterTree').empty().jstree('destroy');
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/gridMajorAlarmTree',
		dataType : 'json',
		success : function(data) {
			var majorAlarmTreeList = data['majorAlarmTree'];
			var treeData = [
			                {'id':'mjAlarmTree.EPC', 'parent':'#', 'text':'EPC'},
			                {'id':'mjAlarmTree.ACCESS', 'parent':'#', 'text':'ACCESS'},
			                {'id':'mjAlarmTree.APP', 'parent':'#', 'text':'APP'}
			                ];
			
			var tmpList = [];
			$.each(majorAlarmTreeList, function(i,e){
				var depth1 = e['EQUIP_DESC'];
				var depth2 = e['EQUIP_NAME'] + "|" + e['EQUIP_TYPE'];
				var depth3 = e['ALARM_CODE'] + "|" + e['PROBABLE_CAUSE'];
				var liData = {};
				if( tmpList.indexOf(e['EQUIP_NAME']) < 0){
					tmpList.push(e['EQUIP_NAME']);
					liData = {};
					liData['id'] = 'mjAlarmTree.' + depth1 + '.' + depth2;
					liData['parent'] = 'mjAlarmTree.' + depth1;
					liData['text'] = e['EQUIP_NAME'];
					treeData.push(liData);					
				}
				liData = {};
				liData['id'] = 'mjAlarmTree.' + depth1 + '.' + depth2 + '.' + depth3;
				liData['parent'] = 'mjAlarmTree.' + depth1 + '.' + depth2;
				liData['text'] = e['ALARM_CODE'] + ' (' + e['PROBABLE_CAUSE'] + ')';
				liData['icon'] = false;
				treeData.push(liData);
			});
			
			$("#majorAlarmFilterTree").jstree({ 'core' : {
					'data' : treeData
				},
			});
			
			/* 왼쪽 트리에서 알람코드를 클릭할 경우 오른쪽 테이블에 추가되도록 하는 이벤트 */
			$("#majorAlarmFilterTree").bind("dblclick.jstree", function(event) {
				var node= $(event.target).closest("li [aria-level='3']"); //레벨 3인 노드(알람코드)만 더블클릭 이벤트를 줌
//				var data = node.data($("#codeFilterTree"));
				
				if(node.length > 0){
					var flag = false;
					$("#tb_majorAlarmFilter tbody input[name='mjAlarmCode']").each(function(i,e){ //오른쪽 테이블의 알람코드 컬럼들을 돌려가며 현재 클릭한 알람코드가 이미 있는지(이미추가되었는지) 확인.
						var alarmCode = $(e).val().trim(); //오른쪽 테이블의 알람코드 input의 value값을 확인
						
						/* 알람코드 글씨를 클릭할 경우 a태그가 선택되고, 그림이나 주변을 클릭할 경우 i태그가 선택됨(li > a > i) */
						var clickCode = '';
						if(event.target.tagName == "A"){ 
							clickCode = event.target.parentElement.id.split("|")[1].trim();
						} else if(event.target.tagName == "I"){ 
							clickCode = event.target.parentElement.parentElement.id.split("|")[1].trim();
						}
						if(alarmCode == clickCode){ //테이블에 존재하는 알람코드 값과 현재 클릭한 알람코드가 일치할경우(즉,이미 추가된경우).
							flag = true;
							return false; //break;
						}
					});
					if(flag){
						alert("이미 추가된 알람코드입니다.");
						flag = false;
					} else {
//						var id = event.target.parentElement.id.trim().split("."); //event.taget은 <a>태그. 그러므로 상위 엘리먼트인 <li>를 찾아 해당 ID값을 가져와 파싱하여 사용.
						var id=[];
						if(event.target.tagName == "A"){
							id = event.target.parentElement.id.trim().split(".");
						} else if(event.target.tagName == "I"){
							id = event.target.parentElement.parentElement.id.trim().split(".");
						}
						var obj = {};
						obj['EQUIP_DESC'] = id[1];
						obj['EQUIP_NAME'] = id[2].split("|")[0];
						obj['EQUIP_TYPE'] = id[2].split("|")[1];
						obj['ALARM_CODE'] = id[3].split("|")[0];
						obj['PROBABLE_CAUSE'] = id[3].split("|")[1];
						gridMajorAlarmTable(obj);			
					}					
				}
				
			});
			
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * 사용자가 세팅한 중요알람필터를 DB에 저장
 */
function setMajorAlarmFilter(){
	var majorAlarmFilterList = [];
	$("#tb_majorAlarmFilter tbody tr").each(function(i,e){ 
		var equipType = $(e).find('input[name="equipType_majorAlarmFt"]').val();
		majorAlarmFilterList.push({
			'EQUIP_TYPE' : equipType,
			'ALARM_CODE' : $(e).find('td').eq(2).prop('id'), //알람코드인 2번 인덱스(3번째 컬럼)을 서버로 넘겨줌 
		});
	});
	
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/setMajorAlarmFilter',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(majorAlarmFilterList),
		success : function(data) {
			$('#majorAlarmFilterBg').fadeOut();
			$('#majorAlarmFilterUp').fadeOut();
			getMajorAlarmFilter();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 *  중요알람필터 DB 조회
 */
function getMajorAlarmFilter(){
	$.ajax({
		cache : false,
		async : false,
		type : 'POST',
		url : '/failure/main/failureMain/getMajorAlarmFilter',
		dataType : 'json',
		success : function(data) {
			if(data['majorAlarmFilterData'] != null && data['majorAlarmFilterData'].length != 0) {
				fillMajorAlarmFilterData(data['majorAlarmFilterData']);
			} 
			gridEmpty();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * DB에서 조회해온 중요알람필터를 전역변수(majorAlarmCodeFilterList)에 저장
 */
function fillMajorAlarmFilterData(obj){
	majorAlarmCodeFilterList = [];
	if(obj['majorAlarmFilterList'] != null && obj['majorAlarmFilterList'].length != 0){
		$.each(obj['majorAlarmFilterList'], function(i,e){
			var tmpMap = {};
			tmpMap['EQUIP_DESC'] = e['EQUIP_DESC'];
			tmpMap['EQUIP_NAME'] = e['EQUIP_NAME'];
			tmpMap['EQUIP_TYPE'] = e['EQUIP_TYPE'];
			tmpMap['ALARM_CODE'] = e['ALARM_CODE'];
			tmpMap['PROBABLE_CAUSE'] = e['PROBABLE_CAUSE'];
			tmpMap['VIEW_FLAG'] = e['VIEW_FLAG'];
			majorAlarmCodeFilterList.push(tmpMap);
			if (!majorAlarmCodeFilterDict.hasOwnProperty(tmpMap['EQUIP_TYPE'])){
				majorAlarmCodeFilterDict[tmpMap['EQUIP_TYPE']] = [];
			}
			majorAlarmCodeFilterDict[tmpMap['EQUIP_TYPE']].push(tmpMap['ALARM_CODE'])
		});		
	}
}


/**
 * 중요알람필터 화면상에서 전역변수인 majorAlarmCodeFilterList에 사용자가 세팅한 설정이 존재한다면 폼에 그대로 세팅(알람코드필터 화면 팝업시, 기본값 클릭시) 
 */
function gridMajorAlarmFilter(){
	
	$("#tb_majorAlarmFilter tbody").empty();
	
	if(majorAlarmCodeFilterList != null && majorAlarmCodeFilterList.length != 0){
		$.each(majorAlarmCodeFilterList, function(i,e){
			gridMajorAlarmTable(e);
		});
	} 
	
}


/**
 * 중요알람필터에서 선택된 코드가 더블클릭 이벤트로 넘어오면 넘어온 데이터를 오른쪽 테이블에 그리는 함수
 */
function gridMajorAlarmTable(obj){
	
	var coderow = "";
	coderow += "<tr class='' style='cursor:pointer;'>";
	coderow += "	<td align='center' title='" + obj['EQUIP_DESC'] + "'>" + obj['EQUIP_DESC'] + "</td>";
	coderow += "	<td align='center' title='" + obj['EQUIP_NAME'] + "'>" + obj['EQUIP_NAME'];
	coderow += "		<input type='hidden' name='equipType_majorAlarmFt' value='" + obj['EQUIP_TYPE'] + "' />";
	coderow += "	</td>";
	coderow += "	<td align='center' id='" + obj['ALARM_CODE'] + "' title='" + obj['ALARM_CODE'] +"'>" + obj['ALARM_CODE'];
	coderow += "		<input type='hidden' name='mjAlarmCode' value='" + obj['EQUIP_TYPE'] + "." + obj['ALARM_CODE'] + "' />";
	coderow += "	</td>";
	coderow += "	<td align='left' title='" + obj['PROBABLE_CAUSE'] + "'>" + obj['PROBABLE_CAUSE'] + "</td>";
	coderow += "</tr>";
	$("#tb_majorAlarmFilter tbody").append(coderow);
	
	
	var lastLine = $("#tb_majorAlarmFilter tbody tr").length;
	$("#tb_majorAlarmFilter tbody tr").eq(lastLine-1).find('td').each(function(){
		$(this).on("click",function(e){
			if($(this).parent().prop("class")==""){
				$(this).parent().prop("class","selected");
			} else if($(this).parent().prop("class")=="selected"){
				$(this).parent().prop("class","");
			}
		});
	
	});	
}

/* -------------------------------------------------- 장비(시스템) 필터(아래) -------------------------------------------------- */

/**
 * 장비필터 화면의 왼쪽에 알람코드를 트리로 뿌려주기 위한 함수
 */
function gridSystemTree(){
	$('#systemFilterTree').empty().jstree('destroy');
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/gridSystemTree',
		dataType : 'json',
		success : function(data) {
			var systemTreeList = data['systemTree'];
			var treeData = [
			                {'id':'systemTree.EPC', 'parent':'#', 'text':'EPC'},
			                {'id':'systemTree.ACCESS', 'parent':'#', 'text':'ACCESS'},
			                {'id':'systemTree.APP', 'parent':'#', 'text':'APP'}
			                ];
			var tmpList = [];
			$.each(systemTreeList, function(i,e){
				if ( e.EQUIP_TYPE !== 2 && e.EQUIP_TYPE !== 11 && e.EQUIP_TYPE !== 36){   // 노선없는 트리구조
					var depth1 = e['EQUIP_DESC'];
					var depth2 = e['EQUIP_NAME'] + "|" + e['EQUIP_TYPE'];
					var depth3 = e['SYSTEM_ID'] + "|" + e['SYSTEM_NAME'];
					var liData = {};
					if( tmpList.indexOf(e['EQUIP_NAME']) < 0){
						tmpList.push(e['EQUIP_NAME']);
						liData = {};
						liData['id'] = 'systemTree.' + depth1 + '.' + depth2;
						liData['parent'] = 'systemTree.' + depth1;
						liData['text'] = e['EQUIP_NAME'];
						treeData.push(liData);
					}
					liData = {};
					liData['id'] = 'systemTree.' + depth1 + '.' + depth2 + '.' + depth3;
					liData['parent'] = 'systemTree.' + depth1 + '.' + depth2;
					liData['text'] = e['SYSTEM_NAME'];
					liData['icon'] = false;
					treeData.push(liData);
				}else{	// 노선있는 트리구조
					var depth1 = e['EQUIP_DESC'];
					var depth2 = e['EQUIP_NAME'] + "|" + e['EQUIP_TYPE'];
					var depth3 = e['EQUIP_TYPE'] + "|" + e['LINE_ID'];
//					var depth4 = e['LINE_ID'] + "|" + e['LINE_NAME'];
					var depth4 = e['SYSTEM_ID'] + "|" + e['SYSTEM_NAME'];
					var liData = {};
					if( tmpList.indexOf(e['EQUIP_NAME']) < 0){
						tmpList.push(e['EQUIP_NAME']);
						liData = {};
						liData['id'] = 'systemTree.' + depth1 + '.' + depth2;
						liData['parent'] = 'systemTree.' + depth1;
						liData['text'] = e['EQUIP_NAME'];
						treeData.push(liData);
					}
					if( tmpList.indexOf(e['EQUIP_NAME']+e['LINE_ID']) < 0){
						tmpList.push(e['EQUIP_NAME']+e['LINE_ID']);
						liData = {};
						liData['id'] = 'systemTree.' + depth1 + '.' + depth2 + '.' + depth3;
						liData['parent'] = 'systemTree.' + depth1 + '.' + depth2;
						liData['text'] = e['LINE_NAME'];
						treeData.push(liData);
					}
					liData = {};
					liData['id'] = 'systemTree.' + depth1 + '.' + depth2 + '.' + depth3 +'.' + depth4;
					liData['parent'] = 'systemTree.' + depth1 + '.' + depth2 + '.' + depth3;
					liData['text'] = e['SYSTEM_NAME'];
					liData['icon'] = false;
					treeData.push(liData);
				}
			});
			
			
			$("#systemFilterTree").jstree({ 'core' : {
					'data' : treeData
				},
			});
			
			/* 왼쪽 트리에서 알람코드를 클릭할 경우 오른쪽 테이블에 추가되도록 하는 이벤트 */
			$("#systemFilterTree").bind("dblclick.jstree", function(event) {
//				var node= $(event.target).closest("li [aria-level='3']"); //레벨 3인 노드(알람코드)만 더블클릭 이벤트를 줌
//				var data = node.data($("#codeFilterTree"));
				
//				if(node.length > 0){
				if($(event.target).closest("li").find("li").length == 0){ // 최하 레벨만 더블클릭 이벤트를 줌
					var flag = false;
					$("#tb_systemFilter tbody input[name='systemId']").each(function(i,e){ //오른쪽 테이블의 알람코드 컬럼들을 돌려가며 현재 클릭한 알람코드가 이미 있는지(이미추가되었는지) 확인.
						var equipType = $(e).val().trim(); //오른쪽 테이블의 알람코드 input의 value값을 확인
						
						/* 장비의 글씨를 클릭할 경우 a태그가 선택되고, 그림이나 주변을 클릭할 경우 i태그가 선택됨(li > a > i) */
						var clickEquip = '';
						if(event.target.tagName == "A"){ 
//							clickEquip = event.target.parentElement.id.split("|")[1].trim();
							clickEquip = event.target.parentElement.id.split("|")[1].split(".")[0].trim() +'.'+ event.target.parentElement.id.split("|")[event.target.parentElement.id.split("|").length-2].split(".")[1].trim();
						} else if(event.target.tagName == "I"){ 
//							clickEquip = event.target.parentElement.parentElement.id.split("|")[1].trim();
							clickEquip = event.target.parentElement.parentElement.id.split("|")[1].split(".")[0].trim() +'.'+ event.target.parentElement.parentElement.id.split("|")[event.target.parentElement.id.split("|").length-2].split(".")[1].trim();
						}
						if(equipType == clickEquip){ //테이블에 존재하는 알람코드 값과 현재 클릭한 알람코드가 일치할경우(즉,이미 추가된경우).
							flag = true;
							return false; //break;
						}
					});
					if(flag){
						alert("이미 추가된 장비코드입니다.");
						flag = false;
					} else {
//						var id = event.target.parentElement.id.trim().split("."); //event.taget은 <a>태그. 그러므로 상위 엘리먼트인 <li>를 찾아 해당 ID값을 가져와 파싱하여 사용.
						var id=[];
						if(event.target.tagName == "A"){
							id = event.target.parentElement.id.trim().split(".");
						} else if(event.target.tagName == "I"){
							id = event.target.parentElement.parentElement.id.trim().split(".");
						}
						var obj = {};
						obj['EQUIP_NAME'] = id[2].split("|")[0];
						obj['EQUIP_TYPE'] = id[2].split("|")[1];
						obj['SYSTEM_ID'] = id[id.length - 1].split("|")[0];
						obj['SYSTEM_NAME'] = id[id.length - 1].split("|")[1];
						gridSystemTable(obj);			
					}					
				}
				
			});
			
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * 사용자가 세팅한 장비필터를 DB에 저장
 */
function setSystemFilter(){
	var systemFilterList = [];
	$("#tb_systemFilter tbody tr").each(function(i,e){ 
		var equipType = $(e).find('input[name="equipType_systemFt"]').val();
		systemFilterList.push({
			'EQUIP_TYPE' : equipType, 
			'SYSTEM_ID' : $(e).find('td').eq(2).prop('id'), //알람코드인 2번 인덱스(3번째 컬럼)을 서버로 넘겨줌 
		});
	});
	
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/setSystemFilter',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(systemFilterList),
		success : function(data) {
			$('#systemFilterBg').fadeOut();
			$('#systemFilterUp').fadeOut();
			getSystemFilter();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 *  장비필터 DB 조회
 */
function getSystemFilter(){
	$.ajax({
		cache : false,
		async : false,
		type : 'POST',
		url : '/failure/main/failureMain/getSystemFilter',
		dataType : 'json',
		success : function(data) {
			if(data['systemFilterData'] != null && data['systemFilterData'].length != 0) {
				fillSystemFilterData(data['systemFilterData']);
			} 
			gridEmpty();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * DB에서 조회해온 장비필터를 전역변수(alarmSystemFilterList)에 저장
 * @param obj
 */
function fillSystemFilterData(obj){
	alarmSystemFilterList = [];
	if(obj['systemFilterList'] != null && obj['systemFilterList'].length != 0){
		$.each(obj['systemFilterList'], function(i,e){
			var tmpMap = {};
			tmpMap['EQUIP_TYPE'] = e['EQUIP_TYPE'];
			tmpMap['EQUIP_NAME'] = e['EQUIP_NAME'];
			tmpMap['SYSTEM_ID'] = e['SYSTEM_ID'];
			tmpMap['SYSTEM_NAME'] = e['SYSTEM_NAME'];
			alarmSystemFilterList.push(tmpMap);
		});		
	}
}

function gridSystemFilter(){
	
	$("#tb_systemFilter tbody").empty();
	
	if(alarmSystemFilterList != null && alarmSystemFilterList.length != 0){
		$.each(alarmSystemFilterList, function(i,e){
			gridSystemTable(e);
		});
	} 
}

/**
 * 장비필터에서 선택된 코드가 더블클릭 이벤트로 넘어오면 넘어온 데이터를 오른쪽 테이블에 그리는 함수
 */
function gridSystemTable(obj){
	
	var coderow = "";
	coderow += "<tr class='' style='cursor:pointer;'>";
	coderow += "	<td align='center' title='" + parseInt($("#tb_systemFilter tbody tr").length+1) + "'>" + parseInt($("#tb_systemFilter tbody tr").length+1) + "</td>";
	coderow += "	<td align='center' title='" + obj['EQUIP_NAME'] + "'>" + obj['EQUIP_NAME'];
	coderow += "		<input type='hidden' name='equipType_systemFt' value='" + obj['EQUIP_TYPE'] + "' />";
	coderow += "	</td>";
	coderow += "	<td align='center' id='" + obj['SYSTEM_ID'] + "' title='" + obj['SYSTEM_NAME'] + "'>" + obj['SYSTEM_NAME'];
	coderow += "		<input type='hidden' name='systemId' value='" + obj['EQUIP_TYPE'] + "." + obj['SYSTEM_ID'] + "' />";
	coderow += "	</td>";
	coderow += "</tr>";
	$("#tb_systemFilter tbody").append(coderow);
	
	
	var lastLine = $("#tb_systemFilter tbody tr").length;
	$("#tb_systemFilter tbody tr").eq(lastLine-1).find('td').each(function(){
		$(this).on("click",function(e){
			if($(this).parent().prop("class")==""){
				$(this).parent().prop("class","selected");
			} else if($(this).parent().prop("class")=="selected"){
				$(this).parent().prop("class","");
			}
		});
	
	});	
}


/* -------------------------------------------------- 알람 코드 필터(아래) -------------------------------------------------- */

/**
 * 알람코드필터 화면의 왼쪽에 알람코드를 트리로 뿌려주기 위한 함수
 */
function gridAlarmCodeTree(){
	$('#codeFilterTree').empty().jstree('destroy');
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/gridAlarmCodeTree',
		dataType : 'json',
		success : function(data) {
			var alarmCodeTreeList = data['alarmCodeTree'];
			var treeData = [
			                {'id':'codeTree.EPC', 'parent':'#', 'text':'EPC'},
			                {'id':'codeTree.ACCESS', 'parent':'#', 'text':'ACCESS'},
			                {'id':'codeTree.APP', 'parent':'#', 'text':'APP'}
			                ];
			
			var tmpList = [];
			$.each(alarmCodeTreeList, function(i,e){
				var depth1 = e['EQUIP_DESC'];
				var depth2 = e['EQUIP_NAME'] + "|" + e['EQUIP_TYPE'];
				var depth3 = e['ALARM_CODE'] + "|" + e['PROBABLE_CAUSE'];
				var liData = {};
				if( tmpList.indexOf(e['EQUIP_NAME']) < 0){
					tmpList.push(e['EQUIP_NAME']);
					liData = {};
					liData['id'] = 'codeTree.' + depth1 + '.' + depth2;
					liData['parent'] = 'codeTree.' + depth1;
					liData['text'] = e['EQUIP_NAME'];
					treeData.push(liData);					
				}
				liData = {};
				liData['id'] = 'codeTree.' + depth1 + '.' + depth2 + '.' + depth3;
				liData['parent'] = 'codeTree.' + depth1 + '.' + depth2;
				liData['text'] = e['ALARM_CODE'] + ' (' + e['PROBABLE_CAUSE'] + ')';
				liData['icon'] = false;
				treeData.push(liData);
			});
			
			$("#codeFilterTree").jstree({ 'core' : {
					'data' : treeData
				},
			});
			
			/* 왼쪽 트리에서 알람코드를 클릭할 경우 오른쪽 테이블에 추가되도록 하는 이벤트 */
			$("#codeFilterTree").bind("dblclick.jstree", function(event) {
				var node= $(event.target).closest("li [aria-level='3']"); //레벨 3인 노드(알람코드)만 더블클릭 이벤트를 줌
//				var data = node.data($("#codeFilterTree"));
				
				if(node.length > 0){
					var flag = false;
					$("#tb_alarmCodeFilter tbody input[name='alarmCode']").each(function(i,e){ //오른쪽 테이블의 알람코드 컬럼들을 돌려가며 현재 클릭한 알람코드가 이미 있는지(이미추가되었는지) 확인.
						var alarmCode = $(e).val().trim(); //오른쪽 테이블의 알람코드 input의 value값을 확인
						
						/* 알람코드 글씨를 클릭할 경우 a태그가 선택되고, 그림이나 주변을 클릭할 경우 i태그가 선택됨(li > a > i) */
						var clickCode = '';
						if(event.target.tagName == "A"){ 
							clickCode = event.target.parentElement.id.split("|")[1].trim();
						} else if(event.target.tagName == "I"){ 
							clickCode = event.target.parentElement.parentElement.id.split("|")[1].trim();
						}
						if(alarmCode == clickCode){ //테이블에 존재하는 알람코드 값과 현재 클릭한 알람코드가 일치할경우(즉,이미 추가된경우).
							flag = true;
							return false; //break;
						}
					});
					if(flag){
						alert("이미 추가된 알람코드입니다.");
						flag = false;
					} else {
//						var id = event.target.parentElement.id.trim().split("."); //event.taget은 <a>태그. 그러므로 상위 엘리먼트인 <li>를 찾아 해당 ID값을 가져와 파싱하여 사용.
						var id=[];
						if(event.target.tagName == "A"){
							id = event.target.parentElement.id.trim().split(".");
						} else if(event.target.tagName == "I"){
							id = event.target.parentElement.parentElement.id.trim().split(".");
						}
						var obj = {};
						obj['EQUIP_DESC'] = id[1];
						obj['EQUIP_NAME'] = id[2].split("|")[0];
						obj['EQUIP_TYPE'] = id[2].split("|")[1];
						obj['ALARM_CODE'] = id[3].split("|")[0];
						obj['PROBABLE_CAUSE'] = id[3].split("|")[1];
						gridAlarmCodeTable(obj);			
					}					
				}
				
			});
			
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * 사용자가 세팅한 알람코드필터를 DB에 저장
 */
function setAlarmCodeFilter(){
	var codeFilterList = [];
	var viewFlag = $('input[name="radioAlarmCode"]:checked').val();
	$("#tb_alarmCodeFilter tbody tr").each(function(i,e){ 
		var equipType = $(e).find('input[name="equipType_codeFt"]').val();
		codeFilterList.push({
			'EQUIP_TYPE' : equipType,
			'ALARM_CODE' : $(e).find('td').eq(2).prop('id'), //알람코드인 2번 인덱스(3번째 컬럼)을 서버로 넘겨줌 
			'VIEW_FLAG' : viewFlag
		});
	});
	
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/setAlarmCodeFilter',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(codeFilterList),
		success : function(data) {
			$('#codeFilterBg').fadeOut();
			$('#codeFilterUp').fadeOut();
			getAlarmCodeFilter();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 *  알람코드필터 DB 조회
 */
function getAlarmCodeFilter(){
	$.ajax({
		cache : false,
		async : false,
		type : 'POST',
		url : '/failure/main/failureMain/getAlarmCodeFilter',
		dataType : 'json',
		success : function(data) {
			if(data['codeFilterData'] != null && data['codeFilterData'].length != 0) {
				fillCodeFilterData(data['codeFilterData']);
			} 
			gridEmpty();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * DB에서 조회해온 알람코드필터를 전역변수(alarmCodeFilterList)에 저장
 */
function fillCodeFilterData(obj){
	alarmCodeFilterList = [];
	if(obj['alarmCodeFilterList'] != null && obj['alarmCodeFilterList'].length != 0){
		$.each(obj['alarmCodeFilterList'], function(i,e){
			var tmpMap = {};
			tmpMap['EQUIP_DESC'] = e['EQUIP_DESC'];
			tmpMap['EQUIP_NAME'] = e['EQUIP_NAME'];
			tmpMap['EQUIP_TYPE'] = e['EQUIP_TYPE'];
			tmpMap['ALARM_CODE'] = e['ALARM_CODE'];
			tmpMap['PROBABLE_CAUSE'] = e['PROBABLE_CAUSE'];
			tmpMap['VIEW_FLAG'] = e['VIEW_FLAG'];
			alarmCodeFilterList.push(tmpMap);
		});		
	}
}


/**
 * 알람코드필터 화면상에서 전역변수인 alarmCodeFilterList에 사용자가 세팅한 설정이 존재한다면 폼에 그대로 세팅(알람코드필터 화면 팝업시, 기본값 클릭시) 
 */
function gridAlarmCodeFilter(){
	
	$("#tb_alarmCodeFilter tbody").empty();
	
	if(alarmCodeFilterList != null && alarmCodeFilterList.length != 0){
		var viewFlag = '';
		$.each(alarmCodeFilterList, function(i,e){
			gridAlarmCodeTable(e);
			viewFlag = e['VIEW_FLAG']; 
		});
		$('input:radio[name="radioAlarmCode"]:input[value="'+ viewFlag +'"]').prop("checked", true);	
	} 
	
}


/**
 * 알람코드필터에서 선택된 코드가 더블클릭 이벤트로 넘어오면 넘어온 데이터를 오른쪽 테이블에 그리는 함수
 */
function gridAlarmCodeTable(obj){
	
	var coderow = "";
	coderow += "<tr class='' style='cursor:pointer;'>";
	coderow += "	<td align='center' title='" + obj['EQUIP_DESC'] + "'>" + obj['EQUIP_DESC'] + "</td>";
	coderow += "	<td align='center' title='" + obj['EQUIP_NAME'] + "'>" + obj['EQUIP_NAME'];
	coderow += "		<input type='hidden' name='equipType_codeFt' value='" + obj['EQUIP_TYPE'] + "' />";
	coderow += "	</td>";
	coderow += "	<td align='center' id='" + obj['ALARM_CODE'] + "' title='" + obj['ALARM_CODE'] +"'>" + obj['ALARM_CODE'];
	coderow += "		<input type='hidden' name='alarmCode' value='" + obj['EQUIP_TYPE'] + "." + obj['ALARM_CODE'] + "' />";
	coderow += "	</td>";
	coderow += "	<td align='center' title='" + obj['PROBABLE_CAUSE'] + "'>" + obj['PROBABLE_CAUSE'] + "</td>";
	coderow += "</tr>";
	$("#tb_alarmCodeFilter tbody").append(coderow);
	
	
	var lastLine = $("#tb_alarmCodeFilter tbody tr").length;
	$("#tb_alarmCodeFilter tbody tr").eq(lastLine-1).find('td').each(function(){
		$(this).on("click",function(e){
			if($(this).parent().prop("class")==""){
				$(this).parent().prop("class","selected");
			} else if($(this).parent().prop("class")=="selected"){
				$(this).parent().prop("class","");
			}
		});
	
	});	
}

/* -------------------------------------------------- 알람 등급 필터(아래) -------------------------------------------------- */

/**
 * 사용자가 세팅한 알람등급필터를 DB 저장
 */
function setAlarmGradeFilter(){
	var gradeFilterList = [];
	$("#gradeFilterArea select").each(function(i,e) {
		gradeFilterList.push({
			'EQUIP_TYPE' : $(e).prop('name'),
			'SEVERITY' : $(e).val()
		});
	});
	
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/setAlarmGradeFilter',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(gradeFilterList),
		success : function(data) {
			$('#gradeFilterBg').fadeOut();
			$('#gradeFilterUp').fadeOut();
			getAlarmGradeFilter();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 *  알람등급필터 DB 조회
 */
function getAlarmGradeFilter(){
	$.ajax({
		cache : false,
		async : false,
		type : 'POST',
		url : '/failure/main/failureMain/getAlarmGradeFilter',
		dataType : 'json',
		success : function(data) {
//			console.log(data['equipActList']);
			
			equipListJob(data['equipActList'])
			if(data['alarmGradeFilterList'] != null && data['alarmGradeFilterList'].length != 0) {
				fillGradeFilterData(data);
			}
			gridEmpty();
		},
		error : function(request, status, err) {
			
		}
	});
}

 
function equipListJob(data){
	var $equpActList = $('#gradefilterbody');
	$equpActList.empty();
	var equipiHtml = [];
	$.each(data, function(i, o) {
		
		if(i % 2 == 0 ){
			equipiHtml.push('<tr>');
		}
		equipiHtml.push('	<th>' + o.EQUIP_NAME + '</th>');
		equipiHtml.push('	<td>');
		equipiHtml.push('		<div class="mu-selectbox">');
		equipiHtml.push('			<select name="'+o.EQUIP_TYPE +'" class="mu-value">');
		equipiHtml.push('				<option value="0" selected="selected">ALL</option>');
		equipiHtml.push('				<option value="1">CRITICAL</option>');
		equipiHtml.push('				<option value="2">MAJOR</option>');
		equipiHtml.push('				<option value="3">MINOR</option>');
		equipiHtml.push('			</select>');
		equipiHtml.push('		</div>');
		equipiHtml.push('	</td>');
	})
	if (data.length % 2  == 1){
		equipiHtml.push('<th></th><td></td></tr>');
	}
	$equpActList.append(equipiHtml.join(''));
	equipiHtml = [];
}

/**
 * DB에서 조회해온 알람등급필터를 전역변수(alarmGradeFilterMap)에 저장
 */
function fillGradeFilterData(obj){
	alarmGradeFilterMap = {};
	if(obj['alarmGradeFilterList'] != null && obj['alarmGradeFilterList'].length != 0){
		$.each(obj['alarmGradeFilterList'], function(i,e){ 
			alarmGradeFilterMap[e['EQUIP_TYPE']] = e['SEVERITY'];
		});		
	}else{
		for(var index = 1; index < 100; index++){
			alarmGradeFilterMap[index+''] = "3";
		}
	}
	console.log(alarmGradeFilterMap)
}

/**
 * 알람등급필터 화면상에서 전역변수인 alarmGradeFilterMap에 사용자가 세팅한 설정이 존재한다면 폼에 그대로 세팅(알람등급필터 화면 팝업시, 기본값 클릭시) 
 */
function gridAlarmGradeFilter(){
	if(alarmGradeFilterMap != null && alarmGradeFilterMap.length != 0){
		$("#gradeFilterArea select").each(function(i,e) { 
			var key = $(e).prop('name');
			if(key in alarmGradeFilterMap){
				$(e).val(alarmGradeFilterMap[key]);
			} else {
				// 기본값 Minor
				$(e).val("3");
			}
		});
	} 
}

 //-------------------------------------------------- 장비(시스템) 필터(아래) -------------------------------------------------- 


 /** 장비필터 화면의 왼쪽에 알람코드를 트리로 뿌려주기 위한 함수
 *
 */
 /*
function gridSystemTree(){
	$('#systemFilterTree').empty().jstree('destroy');
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/gridSystemTree',
		dataType : 'json',
		success : function(data) {
			var systemTreeList = data['systemTree'];
			var treeData = [
			                {'id':'systemTree.EPC', 'parent':'#', 'text':'EPC'},
			                {'id':'systemTree.ACCESS', 'parent':'#', 'text':'ACCESS'},
			                {'id':'systemTree.APP', 'parent':'#', 'text':'APP'}
			                ];
			var tmpList = [];
			$.each(systemTreeList, function(i,e){
				var depth1 = e['EQUIP_DESC'];
				var depth2 = e['EQUIP_NAME'] + "|" + e['EQUIP_TYPE'];
				var depth3 = e['SYSTEM_ID'] + "|" + e['SYSTEM_NAME'];
				var liData = {};
				if( tmpList.indexOf(e['EQUIP_NAME']) < 0){
					tmpList.push(e['EQUIP_NAME']);
					liData = {};
					liData['id'] = 'systemTree.' + depth1 + '.' + depth2;
					liData['parent'] = 'systemTree.' + depth1;
					liData['text'] = e['EQUIP_NAME'];
					treeData.push(liData);
				}
				liData = {};
				liData['id'] = 'systemTree.' + depth1 + '.' + depth2 + '.' + depth3;
				liData['parent'] = 'systemTree.' + depth1 + '.' + depth2;
				liData['text'] = e['SYSTEM_NAME'];
				liData['icon'] = false;
				treeData.push(liData);
				
			});
			
			$("#systemFilterTree").jstree({ 'core' : {
					'data' : treeData
				},
			});
			
			 왼쪽 트리에서 알람코드를 클릭할 경우 오른쪽 테이블에 추가되도록 하는 이벤트 
			$("#systemFilterTree").bind("dblclick.jstree", function(event) {
				var node= $(event.target).closest("li [aria-level='3']"); //레벨 3인 노드(알람코드)만 더블클릭 이벤트를 줌
//				var data = node.data($("#codeFilterTree"));
				
				if(node.length > 0){
					var flag = false;
					$("#tb_systemFilter tbody input[name='systemId']").each(function(i,e){ //오른쪽 테이블의 알람코드 컬럼들을 돌려가며 현재 클릭한 알람코드가 이미 있는지(이미추가되었는지) 확인.
						var equipType = $(e).val().trim(); //오른쪽 테이블의 알람코드 input의 value값을 확인
						
						 장비의 글씨를 클릭할 경우 a태그가 선택되고, 그림이나 주변을 클릭할 경우 i태그가 선택됨(li > a > i) 
						var clickEquip = '';
						if(event.target.tagName == "A"){ 
							clickEquip = event.target.parentElement.id.split("|")[1].trim();
						} else if(event.target.tagName == "I"){ 
							clickEquip = event.target.parentElement.parentElement.id.split("|")[1].trim();
						}
						if(equipType == clickEquip){ //테이블에 존재하는 알람코드 값과 현재 클릭한 알람코드가 일치할경우(즉,이미 추가된경우).
							flag = true;
							return false; //break;
						}
					});
					if(flag){
						alert("이미 추가된 알람코드입니다.");
						flag = false;
					} else {
//						var id = event.target.parentElement.id.trim().split("."); //event.taget은 <a>태그. 그러므로 상위 엘리먼트인 <li>를 찾아 해당 ID값을 가져와 파싱하여 사용.
						var id=[];
						if(event.target.tagName == "A"){
							id = event.target.parentElement.id.trim().split(".");
						} else if(event.target.tagName == "I"){
							id = event.target.parentElement.parentElement.id.trim().split(".");
						}
						var obj = {};
						obj['EQUIP_NAME'] = id[2].split("|")[0];
						obj['EQUIP_TYPE'] = id[2].split("|")[1];
						obj['SYSTEM_ID'] = id[3].split("|")[0];
						obj['SYSTEM_NAME'] = id[3].split("|")[1];
						gridSystemTable(obj);			
					}					
				}
				
			});
			
		},
		error : function(request, status, err) {
			
		}
	});
}


*//**
 * 장비필터에서 선택된 코드가 더블클릭 이벤트로 넘어오면 넘어온 데이터를 오른쪽 테이블에 그리는 함수
 *//*
function gridSystemTable(obj){
	
	var coderow = "";
	coderow += "<tr class='' style='cursor:pointer;'>";
	coderow += "	<td align='center' title='" + parseInt($("#tb_systemFilter tbody tr").length+1) + "'>" + parseInt($("#tb_systemFilter tbody tr").length+1) + "</td>";
	coderow += "	<td align='center' title='" + obj['EQUIP_NAME'] + "'>" + obj['EQUIP_NAME'];
	coderow += "		<input type='hidden' name='equipType_systemFt' value='" + obj['EQUIP_TYPE'] + "' />";
	coderow += "	</td>";
	coderow += "	<td align='center' id='" + obj['SYSTEM_ID'] + "' title='" + obj['SYSTEM_NAME'] + "'>" + obj['SYSTEM_NAME'];
	coderow += "		<input type='hidden' name='systemId' value='" + obj['EQUIP_TYPE'] + "." + obj['SYSTEM_ID'] + "' />";
	coderow += "	</td>";
	coderow += "</tr>";
	$("#tb_systemFilter tbody").append(coderow);
	
	
	var lastLine = $("#tb_systemFilter tbody tr").length;
	$("#tb_systemFilter tbody tr").eq(lastLine-1).find('td').each(function(){
		$(this).on("click",function(e){
			if($(this).parent().prop("class")==""){
				$(this).parent().prop("class","selected");
			} else if($(this).parent().prop("class")=="selected"){
				$(this).parent().prop("class","");
			}
		});
	
	});	
}
*/
/* -------------------------------------------------- 역사별 필터(아래) -------------------------------------------------- */

/**
 * 역사별필터 화면의 왼쪽에 알람코드를 트리로 뿌려주기 위한 함수
 */
function gridStationTree(){
	$('#stationFilterTree').empty().jstree('destroy');
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/gridStationTree',
		dataType : 'json',
		success : function(data) {
			var stationTreeList = data['stationTree'];
			var treeData = [
			                {'id':'stationTree.station', 'parent':'#', 'text':'역사'},
			                ];
//			var tmpMap = {};
//			$.each(stationTreeList, function(i,e){
//				var stationKey = e['STATION_ID'] + "|" + e['STATION_NAME'];
//				var tmpList = [];
//				tmpMap[stationKey] = tmpList;
//			});
//			$.each(tmpMap, function(k,v){
//				var liData = {};
//				liData['id'] = 'stationTree.station' + '.' + k; 
//				liData['parent'] = 'stationTree.station';
//				liData['text'] = k.split("|")[1];
//				liData['icon'] = false;
//				treeData.push(liData);				
//			});
			var tmpList = [];
			$.each(stationTreeList, function(i,e){
				var depth1 = e['LINE_ID'];
				var depth2 = e['STATION_ID'] + "." + e['STATION_NAME'] + "." + e['LINE_ID'];
				var liData = {};
				if( tmpList.indexOf(e['LINE_ID']) < 0){
					tmpList.push(e['LINE_ID']);
					liData = {};
					liData['id'] = 'stationTree.station.' + depth1;
					liData['parent'] = 'stationTree.station'
					liData['text'] = e['LINE_NAME'];
					treeData.push(liData);
				}
				liData = {};
				liData['id'] = 'stationTree.station.' + depth1 + '.' + depth2 ;
				liData['parent'] = 'stationTree.station.' + depth1 ;
				liData['text'] = e['STATION_NAME'];
				liData['icon'] = false;
				treeData.push(liData);
			})
			$("#stationFilterTree").jstree(
				{ 'core' : {
					'data' : treeData
					},
			});
			
			/* 왼쪽 트리에서 알람코드를 클릭할 경우 오른쪽 테이블에 추가되도록 하는 이벤트 */
			$("#stationFilterTree").bind("dblclick.jstree", function(event) {
				var node= $(event.target).closest("li [aria-level='3']"); //레벨 3인 노드(역사명)만 더블클릭 이벤트를 줌
//				var data = node.data($("#codeFilterTree"));
				
				if(node.length > 0){
					var flag = false;
					$("#tb_stationFilter tbody input[name='stationId']").each(function(i,e){ //오른쪽 테이블의 알람코드 컬럼들을 돌려가며 현재 클릭한 알람코드가 이미 있는지(이미추가되었는지) 확인.
						var stationId = $(e).val().trim(); //오른쪽 테이블의 알람코드 input의 value값을 확인
						
						/* 장비의 글씨를 클릭할 경우 a태그가 선택되고, 그림이나 주변을 클릭할 경우 i태그가 선택됨(li > a > i) */
						var clickStation = '';
						if(event.target.tagName == "A"){ 
							clickStation = event.target.parentElement.id.split(".")[3].trim();
						} else if(event.target.tagName == "I"){ 
							clickStation = event.target.parentElement.parentElement.id.split(".")[3].trim();
						}
						if(stationId == clickStation){ //테이블에 존재하는 알람코드 값과 현재 클릭한 알람코드가 일치할경우(즉,이미 추가된경우).
							flag = true;
							return false; //break;
						}
					});
					if(flag){
						alert("이미 추가된 역사코드입니다.");
						flag = false;
					} else {
//						var id = event.target.parentElement.id.trim().split("."); //event.taget은 <a>태그. 그러므로 상위 엘리먼트인 <li>를 찾아 해당 ID값을 가져와 파싱하여 사용.
						var id=[];
						if(event.target.tagName == "A"){
							id = event.target.parentElement.id.trim().split(".");
						} else if(event.target.tagName == "I"){
							id = event.target.parentElement.parentElement.id.trim().split(".");
						}
						var obj = {};
						obj['STATION_ID'] = id[3];
						obj['STATION_NAME'] = id[4];
						obj['LINE_ID'] = id[5];
						gridStationTable(obj);
					}					
				}
				
			});
			
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * 사용자가 세팅한 장비필터를 DB에 저장
 */
function setStationFilter(){
	var stationFilterList = [];
	$("#tb_stationFilter tbody tr").each(function(i,e){ 
		var stationId = $(e).find('input[name="stationId"]').val();
		stationFilterList.push({
			'STATION_ID' : stationId
		});
	});
	
	$.ajax({
		cache : false,
		type : 'POST',
		url : '/failure/main/failureMain/setStationFilter',
		contentType: 'application/json; charset=UTF-8',
		dataType : 'json',
		data : JSON.stringify(stationFilterList),
		success : function(data) {
			$('#stationFilterBg').fadeOut();
			$('#stationFilterUp').fadeOut();
			getStationFilter();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 *  장비필터 DB 조회
 */
function getStationFilter(){
	$.ajax({
		cache : false,
		async : false,
		type : 'POST',
		url : '/failure/main/failureMain/getStationFilter',
		dataType : 'json',
		success : function(data) {
			if(data['stationFilterData'] != null && data['stationFilterData'].length != 0) {
				fillStationFilterData(data['stationFilterData']);
			} 
			gridEmpty();
		},
		error : function(request, status, err) {
			
		}
	});
}

/**
 * DB에서 조회해온 장비필터를 전역변수(alarmSystemFilterList)에 저장
 * @param obj
 */
function fillStationFilterData(obj){
	alarmStationFilterList = [];
	if(obj['stationFilterList'] != null && obj['stationFilterList'].length != 0){
		$.each(obj['stationFilterList'], function(i,e){
			var tmpMap = {};
			tmpMap['STATION_ID'] = e['STATION_ID'];
			tmpMap['STATION_NAME'] = e['STATION_NAME'];
			tmpMap['LINE_ID'] = e['LINE_ID'];
			alarmStationFilterList.push(tmpMap);
		});		
	}
}

function gridStationFilter(){
	
	$("#tb_stationFilter tbody").empty();
	
	if(alarmStationFilterList != null && alarmStationFilterList.length != 0){
		$.each(alarmStationFilterList, function(i,e){
			gridStationTable(e);
		});
	} 
} 

/**
 * 장비필터에서 선택된 코드가 더블클릭 이벤트로 넘어오면 넘어온 데이터를 오른쪽 테이블에 그리는 함수
 */
function gridStationTable(obj){
	
	var lineIdOrg = obj['LINE_ID'];
	LINE_NAME = getLineName(lineIdOrg);
	var coderow = "";
	coderow += "<tr class='' style='cursor:pointer;'>";
	coderow += "	<td align='center' title='" + parseInt($("#tb_stationFilter tbody tr").length+1) + "'>" + parseInt($("#tb_stationFilter tbody tr").length+1) + "</td>";
	coderow += "	<td align='center' title='" + LINE_NAME + "'>" + LINE_NAME;
	coderow += "	<td align='center' title='" + obj['STATION_NAME'] + "'>" + obj['STATION_NAME'];
	coderow += "		<input type='hidden' name='stationId' value='" + obj['STATION_ID'] + "' />";
	coderow += "	</td>";
	coderow += "</tr>";
	$("#tb_stationFilter tbody").append(coderow);
	
	
	var lastLine = $("#tb_stationFilter tbody tr").length;
	$("#tb_stationFilter tbody tr").eq(lastLine-1).find('td').each(function(){
		$(this).on("click",function(e){
			if($(this).parent().prop("class")==""){
				$(this).parent().prop("class","selected");
			} else if($(this).parent().prop("class")=="selected"){
				$(this).parent().prop("class","");
			}
		});
	});
}

function gridEmpty(){
	if(isView) {
		initLevelIndicator();
		$("#tb_failure_alarm tbody").empty();
		$("#excelTable tbody").empty();
		$("#tb_majorFailure_alarm tbody").empty();
		
		if(ws){
			console.log('filter socket close');
			isView = false;
			ws.close();
			if(ws_put)
				ws_put.close();
			setTimeout(function() {startAlarmDetect();},500);
		}
	}
}
