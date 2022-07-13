/**
 * 이벤트 플로우 프로세스 관리 js
 * 2016-04-27 ES1 Kim sung hun 
 */

$(document).ready(function(){
	getHostSelectList(); //호스트 select box 셋팅
	intervalSet();
	setStatusSelBox();	//process status select box 셋팅
	setGroupSelBox();	//group select box 셋팅
	setSearchTypeSelBox() //process 검색조건 select box 셋팅
	initDlg();
});

//5분 주기로 폴링
function intervalSet(){
	var intervalId = setInterval("getProtList()", (1000*60)*5);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	if ( $('#repeatBtn').find('i').hasClass('play') ) {
		$('#repeatBtn').find('i').removeClass('play')
		$('#repeatBtn').find('i').addClass('pause');
	}
	
	getProtList();

}

//폴링 정지
function intervalDelete(){
	clearInterval($('#repeatBtn').val());
	$('#repeatBtn').attr('onclick','javascript:intervalSet()');
	
	if ( $('#repeatBtn').find('i').hasClass('pause') ) {
		$('#repeatBtn').find('i').removeClass('pause');
		$('#repeatBtn').find('i').addClass('play');
	}
}

//수동 refresh
function refreshData() {
	getProtList('relad');
}

//server 목록 가져오기
function getHostSelectList(){
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefHostList',
		   dataType: "json",
		   success: function (data) {
			   $('#host_name_ul').empty();
			   $('#host_name_ul').append('<li onclick="searchHostSet()">' + '전체' +'</li>');
		
			   _.each(data.serverList, function (value,key){
				   $('#host_name_ul').append('<li onclick="searchHostSet(' + '\'' + value['HOST_IP'] + '\'' +')">' + value['HOST_NAME'] +'</li>');
			   });
			   
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

//검색조건 셋팅
function searchHostSet(hostIp){
	$('#searchHostIp').val(hostIp);
	oncePageLoad = true;
	getProtList();
}

//port List
function getProtList(value){
	var optionData  = { searchHostIp : $('#searchHostIp').val()};
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefPortList',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {
			   setProtGrid(data, value);
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});
}


var oncePageLoad = true;

//port List Grid
function setProtGrid(data, value) {
	var portCommnet = {
		'30000' : '고장관리',
		'30001' : '성능관리',
		'30002' : '구성관리',
		'30003' : '시스템관리',
		'30004' : '단말위치수집',
		'30005' : '열차운행정보 수집',
		'30006' : '장애정보문자알림 발송'
	};
	
	$('#portTable > tr').remove();
	_.each(data.protList,function (value,key){
//		'<tr onclick="trSelect(\'' ,value.SIOEF_PORT,'\',','\'' ,value.HOST_IP,'\')">'
		eml = ['<tr>',
		       '<td><input type="checkbox" name="portChk" onchange="portCheck();"><span class="hidden">',[value.HOST_IP,':',value.SIOEF_PORT].join(''),'</span></td>',
		       '<td>',value.HOST_NAME,'</td>',
		       '<td>',value.HOST_IP,'</td>',
		       '<td>',value.SIOEF_PORT,'</td>',
		       '<td>',portCommnet[value.SIOEF_PORT],'</td>',
		       '</tr>'].join('');

		$('#portTable').append(eml);
	});
	
	if(oncePageLoad){
		$('#portCnt').val(data.protList.length);
		$('#portChkAll').prop('checked',true);
		allPortCheck();
		// getChkNodeList();		//동기화또는  refresh시 데이토를 유지하기 위하여 chk데이터 저장
		oncePageLoad = false;
	}else{
		getCheckStatus();
		getChkNodeList();		//동기화또는  refresh시 데이토를 유지하기 위하여 chk데이터 저장
	}
	
}

//포트리스 전체 체크
function allPortCheck(){
	$.each( $('[name="portChk"]'), function(i, chk){
		if ( $('#portChkAll').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});
	
	getChkNodeList();
}

function portCheck(){
	var len = 0;
	_.each( $('[name="portChk"]'), function(eml, idx){
		if ($(eml).is(':checked')) {
			len++;
		}
	});
	
	if(len == $('#portCnt').val()){
		$('#portChkAll').prop('checked',true);
	}else{
		$('#portChkAll').prop('checked',false);
	}
	getChkNodeList();
}

//체크된 목록만 보기
function getChkNodeList(){
	portChkDataSave();
	$('#searchNode').val(''); 
	$('#searchStatus').val(''); 
	$('#searchGroup').val('');
	getNodeList();
}

//폴링또는 refresh시 체크를 유지하기위해 데이터 저장
function portChkDataSave(){	
	var hostInfo = [];
	_.each($('[name="portChk"]'), function (eml, idx){
		if($(eml).is(':checked')){
			hostInfo.push("'"+$(eml).next().text()+"'");
		}
	});
	
	if(hostInfo.length > 0){
		$('#hostInfo').val(hostInfo.join(','));
	}else{
		$('#hostInfo').val("''");
	}
}

//refresh및 폴링시  체크 유지
function getCheckStatus(){
	var portChkData = $('#hostInfo').val().split(',');
	var emls = []
	_.each(portChkData, function(chkData, key){
		_.each($('[name="portChk"]'), function (eml, idx){
			var temp = "'"+$(eml).next().text()+"'";
			if(chkData == temp ){
				$(eml).prop('checked',true);
			}
		});
	});
}


//---------------------------------------------Node List------------------------------------------
function setStatusSelBox(){
	$('#status_name_ul > li').remove();
	$('#status_name_ul').append('<li onclick="setSearchStatus('+'\'' +'\'' +')">' + '전체' +'</li>');
	var procStatus = ['ACT','TRM'];
	_.each(['실행','중지'], function (value,key){
		$('#status_name_ul').append('<li onclick="setSearchStatus(' + '\'' + procStatus[key] + '\'' +')">' + value +'</li>');
	});
	
	$('#status_select').text('전체');
	$('#status_name_ul > li').eq(0).prop('class','ACTIVE');
	
	drop_down_set();
}

function setSearchStatus(value){
	$('#searchStatus').val(value);
	getNodeList()
}

//group select box 셋팅
function setGroupSelBox(){
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefGroupList',
		   dataType: "json",
		   success: function (data) {
			   $('#group_name_ul > li').remove();
			   $('#group_name_ul').append('<li onclick="setSearchGroup('+'\'' +'\'' +')">' + '전체' +'</li>');
			   _.each(data.groupList, function (value,key){
				   if(value.indexOf('*')=== -1){
					   $('#group_name_ul').append('<li onclick="setSearchGroup(' + '\'' + value + '\'' +')">' + value +'</li>');
				   }
			   });
				$('#group_select').text('전체');
				$('#group_name_ul > li').eq(0).prop('class','ACTIVE');
			   drop_down_set();
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setSearchGroup(value){
	$('#searchGroup').val(value);
	getNodeList()
}


function setSearchTypeSelBox(){
	$('#search_type_ul > li').remove();
	var processType = ['procName','procDesc'];
	_.each(['프로세스 명','프로세스 설명'], function (value,key){
		$('#search_type_ul').append('<li onclick="setSearchProcType(' + '\'' + processType[key]+ '\'' +')">' + value +'</li>');
	});
	$('#type_select').text('프로세스 명');
	$('#search_type_ul > li').eq(0).prop('class','ACTIVE');
//	drop_down_set();
}

function setSearchProcType(value){
	$('#searchType').val(value);
	
}


//node list view
function getNodeList(){
	var optionData  = {
		hostInfo : $('#hostInfo').val(),
		searchValue : $('#searchValue').val(), 
		searchType : $('#searchType').val(),
		searchStatus : $('#searchStatus').val(), 
		searchGroup : $('#searchGroup').val()
	};
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefNodeList',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {
			   setNodeGrid(data);
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setNodeGrid(data) {
	$('#nodeTable > tr').remove();
	var actCnt = 0;
	var trmCnt = 0;
	var status;
	_.each(data.nodeList,function (value,key){
		
		 if (value['PROCESS_STATUS'] === 'ACT' ) {
			 status = '<i class="mu-icon alram warning"></i>';
		 } else {
			 status = '<i class="mu-icon alram critical"></i>';
		 }
		 
		 var ori_proNm = value['PROCESS_NAME'];
		 var ori_proDesc = value['PROCESS_DESC'];
		 var simple_proNm = ori_proNm;
		 var simple_proDesc = ori_proDesc;
		 
		 if(ori_proNm != null && ori_proNm.length > 85) simple_proNm = ori_proNm.substring(0,84)+'....';
		 if(ori_proDesc != null && ori_proDesc.length > 75) simple_proDesc = ori_proDesc.substring(0,74)+'....';
		 
		var eml = ['<tr>',
		           '<td><input type="checkbox" name="nodeChk" onchange="nodeCheck()"><span class="hidden">',value['NODE'],'</span></td>',
		           '<td>',status,'</td>',
		           '<td>',value['HOST_NAME'],'</td>',
		           '<td>',value['HOST_IP'],'</td>',
		           '<td>',value['SIOEF_PORT'],'</td>',
		           '<td>',value['GROUP_NAME'].replace('***','-'),'</td>',
		           '<td>',value['NODE_NAME'],'</td>',	           
		           '<td title="'+ori_proNm+'">',simple_proNm,'</td>',
		           '<td title="'+ori_proDesc+'">',simple_proDesc,'</td>',
		           '<td>',value['ACTIVE_TIME'],'</td>',
		           '<td>',value['CPU_RATE'],'</td>',
		           '<td>',value['MEMORY_RATE'],'</td>',
		           '<td>',value['MEMORY_SIZE'],'</td>',
		           '</tr>'].join('');
		
		 $('#nodeTable').append(eml);
		 
		 if(value['PROCESS_STATUS'].indexOf('ACT') !== -1){
			 actCnt++;
		 }else{
			 trmCnt++; 
		 }
	});
	$('#nodeCnt').val(data.nodeList.length);
	
	$('#actCnt').text(actCnt);
	$('#trmCnt').text(trmCnt);

}

function allNodeCheck(){
	$.each( $('[name="nodeChk"]'), function(i, chk){
		if ( $('#nodeChkAll').is(':checked') ) {
			$(chk).prop('checked', true);
		} else {
			$(chk).prop('checked', false);
		}
	});	
}

function nodeCheck(){
	var len = 0;
	_.each( $('[name="nodeChk"]'), function(eml, idx){
		if ($(eml).is(':checked')) {
			len++;
		}
	});
	if(len == $('#nodeCnt').val()){
		$('#nodeChkAll').prop('checked',true);
	}else{
		$('#nodeChkAll').prop('checked',false);
	}
}

function nodeActTrm(cmd){
	var cmdData = [];
	var state = false;
	var chk = false;
	_.each($('#nodeTable > tr'), function(value, key){
		chk = $(value).find('[name="nodeChk"]').is(':checked');
		if(chk){
			cmdData.push({'ipAddress' : $(value).children().eq(3).text(),
						  'port' : $(value).children().eq(4).text(),
						  'hostName': $(value).children().eq(2).text(),
						  'groupName' : $(value).children().eq(5).text().replace('***','-'),
						  'nodeName' : $(value).children().eq(6).text(),
						  'sioefName' : $(value).children().eq(7).text().replace(/ /gi,'_#_'),
						  'ctrlType':cmd
						});
			state = true;
		}
	});
	
	if(!state){
		alert('node를  선택해 주세요.');
		return;
	}
	nodeActTrmDlg(cmd, cmdData);
}

function initDlg(){
	//mmeDetail 숨기기 기능    
	$('#sioefCmdBg').fadeOut();
	$('#sioefCmdUp').fadeOut();
	
    //mmeAdd Drag 지정 정의
	$( "#sioefCmdUp" ).draggable({'handle' : '#sioefTitleBox'});
	$( "#sioefCmdUp" ).resizable({
		minWidth: 800,
		minHeight: 400,
		animate: true
	});
}

function nodeActTrmDlg(cmd, cmdData){
	$('#runComplete').prop('disabled', true);
	$('#sioefCmdBg').show().fadeIn('fast');
	$('#sioefCmdUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#sioefCmdUp').height()-100)/2
	var width = (screen.width - $('#sioefCmdUp').width())/2
	
	$('#sioefCmdUp').css('left',width+'px');
	$('#sioefCmdUp').css('top',height+'px');
	
	$("#cmdDlgBody").scrollTop(0);
	$('#sioefTitleBox').find('.title').html('sioef node ' + cmd);
	
	$('#cmdTable > tr').remove();
	var spinner = '<i class="fa fa-spinner fa-5x fa-pulse" style="font-size:16px"></i>';
	var eml = [];
	_.each(cmdData, function (value, key){
		eml = ['<tr>',
			   '<td>',value['nodeName'],'</td>',
			   '<td id="nodeTd',key, '">',spinner,'</td>',
			   '</tr>'].join('');

		 $('#cmdTable').append(eml);
	});
	
	sioefRun(cmdData);
}


function sioefRun(cmdData){
	_.each(cmdData, function (value,key){
		var requestData = JSON.stringify(value);
		$.ajax({
			   type : 'post',
			   url: '/system/sioefProcessManage/sioefCmd',
			   contentType: 'application/json',
			   dataType: "json",
			   data: requestData,
			   success: function (data) {
				   if(data.cmdResult.indexOf('+OK') !== -1){
					   $('#nodeTd'+key).text('OK');
					   updateNodeStatus(requestData);
				   }else{
					   $('#nodeTd'+key).text('NOK');
				   }
			   },
			   error: function (request, status, error){ 
				   //alert('에러발생');
				   console.log(request)
				   console.log(status)
				   console.log(error)
			   }
		});
	});
	$('#runComplete').prop('disabled', false);
}

function updateNodeStatus(requestData){
	$.ajax({
		   type : 'post',
		   url: '/system/sioefProcessManage/sioefNodeStatusUpdate',
		   contentType: 'application/json',
		   dataType: "json",
		   data: requestData,
		   success: function (data) {

		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function runComplete(){
	$('#sioefCmdBg').fadeOut();
	$('#sioefCmdUp').fadeOut();
	getNodeList();
}

function pageSearch(){
	
}