var user_id;

function initPopup(){
	//mmeDetail 숨기기 기능    
    $('#confAddClose, #confAddCancel,#confAddBg').on('click',function(e){
		$('#confAddBg').fadeOut();
		$('#confAddUp').fadeOut();
	});
	
    //mmeAdd Drag 지정 정의
	$( "#confAddUp" ).draggable({'handle' : '#confAddTitleBox'});
//	$( "#confAddUp" ).resizable({
//		//minWidth: 800,
//		//minHeight: 400,
//		animate: true
//	});
//	
	$('#all_select_btn').click(function () {
        $("#table_hour li button").removeClass();
        $("#table_hour li button").addClass('mu-btn mu-btn-icon active');
	});

	$('#all_cancel_btn').click(function () {
        $("#table_hour li button").removeClass();
        $("#table_hour li button").addClass('mu-btn mu-btn-icon');
	});

	$('#table_hour li button').click(function () {
        if(!$(this).hasClass('active')){
            $(this).removeClass();
            $(this).addClass('mu-btn mu-btn-icon active');
        }else{
            $(this).removeClass();
            $(this).addClass('mu-btn mu-btn-icon');
        }
	});		
}

function confAddView(obj){
	
	$('#confAddBg').show().fadeIn('fast');
	$('#confAddUp').show().fadeIn('fast'); 
	
	//창 크기 조절
	$('#confAddUp').css('width','860px');
	$('#confAddUp').css('height','680px');
	
	var height = (screen.height - $('#confAddUp').height()-100)/2
	var width = (screen.width - $('#confAddUp').width())/2
	
	$('#confAddUp').css('left',width+'px');
	$('#confAddUp').css('top',height+'px');
	
	$("#confAddDiv").scrollTop(0); 
	
	//타이틀 변경
	$('#confAddTitleBox').find('.title').html('장애정보알림문자 권한 추가');
	
	//콤포넌트 숨김해제 및 버튼 변경
	$('.mu-dialog-body').children().removeClass('hidden');
	$('#search_bar').removeClass('hidden');
	$('#user_word').removeClass('hidden');
	$('#user_searchBtn').removeClass('hidden');
	$('#confUpdSave').addClass('hidden');
	$('#confAddSave').removeClass('hidden');
	$('#confAddCancel').addClass('gray')
	$('#confAddCancel').html('<i class="mu-icon cancel"></i>취소');
	$('#table_hour').find('button').removeClass('active');
	
	//전체선택 체크박스 초기화
	$('#codeTable > thead').find('input').prop('checked', false);
	$('#codeGrid').empty();
		
	//코드 표시용 테이블 숨기기
	$('#codeView').addClass('hidden');
	
	getPhoneInfo();
	getSystemInfo(true);
}

function confUpdView(obj){
	
	$('#confAddBg').show().fadeIn('fast');
	$('#confAddUp').show().fadeIn('fast'); 
	
	//창 크기 조절
	$('#confAddUp').css('width','860px');
	$('#confAddUp').css('height','680px');
	
	var height = (screen.height - $('#confAddUp').height()-100)/2
	var width = (screen.width - $('#confAddUp').width())/2
	
	$('#confAddUp').css('left',width+'px');
	$('#confAddUp').css('top',height+'px');
	
	$("#confAddDiv").scrollTop(0); 
	
	//타이틀 변경
	$('#confAddTitleBox').find('.title').html('장애정보알림문자 권한 수정');
	
	//콤포넌트 숨기기 및 버튼 변경
	$('.mu-dialog-body').children().removeClass('hidden');
	$('#search_bar').removeClass('hidden');
	$('#user_word').addClass('hidden');
	$('#user_searchBtn').addClass('hidden');
	$('#confAddSave').addClass('hidden');
	$('#confUpdSave').removeClass('hidden');
	$('#confAddCancel').addClass('gray')
	$('#confAddCancel').html('<i class="mu-icon cancel"></i>취소');
	
	//코드 표시용 테이블 숨기기
	$('#codeView').addClass('hidden');
	
	//전체선택 체크박스 초기화
	$('#codeTable > thead').find('input').prop('checked', false);
}


function showAlarmCode(btnObj) {	
	$('#confAddBg').show().fadeIn('fast');
	$('#confAddUp').show().fadeIn('fast'); 
	
	//창 크기 조절
	$('#confAddUp').css('width','300px');
	$('#confAddUp').css('height','350px');
	
	var height = (screen.height - $('#confAddUp').height()-100)/2
	var width = (screen.width - $('#confAddUp').width())/2
	
	$('#confAddUp').css('left',width+'px');
	$('#confAddUp').css('top',height+'px');
	
	$("#confAddDiv").scrollTop(0); 
	
	//타이틀 변경
	$('#confAddTitleBox').find('.title').html('알람Code');
	
	//콤포넌트 숨기기 및 버튼 변경
	$('.mu-dialog-body').children().addClass('hidden');
	$('#search_bar').addClass('hidden');
	
	$('#confUpdSave').addClass('hidden');
	$('#confAddSave').addClass('hidden');
	$('#confAddCancel').removeClass('gray')
	$('#confAddCancel').html('<i class="mu-icon check"></i>확인');
	
	//코드 표시용 테이블 보이기
	$('#codeView').removeClass('hidden');
	
	getCodeForView(btnObj);
}

function insertData(){
	if ( $('[name="systemChk"]:checked').length == 0 ) {
		alert('수신시스템을 선택해주세요.');
		return;
	}
	
	if ( $('[name="codeChk"]:checked').length == 0 ) {
		alert('알람코드를 선택해주세요.');
		return;
	}
	
	if ( $('[name="phoneCheck"]:checked').length == 0 ) {
		alert('수신번호를 선택해주세요.');
		return;
	}
	
	var system;	
	var times;
	var number = '';
	var alarmList = [];  
	var severityList= [];
	
	var phoneChecked = $('[name="phoneCheck"]:checked');
	$.each(phoneChecked, function(i,chk){
		number = number+$(chk).parent().parent().find('[name="userPhone"]').html()+',';
	});
	number = number.slice(0,-1);
	
	system = $('[name="systemChk"]:checked').parent().next().find('span');
	
	var checked = $('[name="codeChk"]:checked');
	$.each(checked, function(i,chk){
		severityList[i] = $(chk).siblings().html();
		alarmList[i] = $(chk).parent().parent().find('[name="codeName"]').html();
	});	
	
	var actived = $('#table_hour').find('.active');
	if ( actived.length == 0 ) {
		alert('수신 시간을 설정해주세요.');
		return;
	} 
	$.each(actived, function(i, time){
		if ( i == 0 ) {
			times = $(time).html();
		} else {
			times += ','+$(time).html();
		}
	});
		
	var msg = '';		
	var optionData  = {
			SYSTEM: system.html(),
			ALARM: alarmList,
			SEVERITY: severityList,
			TT_TIME: times,
			TT_NUMBER: number
	};
	var requestData = JSON.stringify(optionData);
		
	$.ajax({
		type : 'post',
		url: '/system/sysSmsConfManager/insertConfData',
		contentType: 'application/json',
		data: requestData,
		dataType: 'json',
		async: false,
		success: function (data) {
			if ( data.result == 'SUCCESS' ) {
				msg = '정상적으로 처리되었습니다.';				
				location.reload();
			} else {
				if ( data.result == 'DUP') {
					msg = '중복된 설정이 존재합니다.\n시스템, 알람코드를 확인하세요.';
				} else {
					msg = '서버에 전달되었으나 정상처리되지 않았습니다.\n관리자에게 문의해주세요.';	
				}
			}
			alert(msg);
		},
		error: function () {
			//서버 에러
		}
	});
}

function updateData() {			
	if ( $('[name="codeChk"]:checked').length == 0 ) {
		alert('수정시 alarm 코드는 최소 1개는 있어야 합니다.\n설정 삭제를 원하시면 조회화면의 삭제 버튼을 클릭해주세요.');
		return;
	}
	
	var old_numberList = [];
	var new_numberList = [];
	var allNumberboxes = $('[name="phoneCheck"]');
	var idx = 0;
	var idx_old = 0;
	$.each(allNumberboxes, function(i,chk){	
		if ( $(chk).parent().parent().find('[name="originUserPhone"]').html() != undefined ) {
			old_numberList[idx_old] = $(chk).parent().parent().find('[name="originUserPhone"]').html();
			idx_old++;				
		}
		if ( $(chk).is(':checked') ) {
			new_numberList[idx] = $(chk).parent().parent().find('[name="userPhone"]').html();			
			idx++;
		}
	});	
	
	var old_numbers = old_numberList.join(',');
	var new_numbers = new_numberList.join(',');
	
	var system = {
			originSys : $('#originSys').val(), 
			newSys    : $('#systemGrid').find('[name="systemChk"]:checked').parent().parent().find('[name="sysName"]').html()
	}; 
	
	var times;
	
	//삭제할 데이터는 알람코드만 필요
	var old_alarmList    = []; 
	
	var new_alarmList    = [];
	var new_severityList = [];
	
	var old_flagList      = [];
	var new_flagList      = [];
	
	var allboxes = $('[name="codeChk"]');
	idx = 0;
	idx_old = 0;
	$.each(allboxes, function(i,chk){	
		if ( $(chk).parent().parent().find('[name="originCode"]').html() != undefined ) {
			old_alarmList[idx_old] = $(chk).parent().parent().find('[name="originCode"]').html();
			idx_old++;				
		}
		if ( $(chk).is(':checked') ) {
			new_severityList[idx] =  Number( $(chk).siblings().html() );
			new_alarmList[idx] = $(chk).parent().parent().find('[name="codeName"]').html();			
			idx++;
		}
		old_flagList[i] = $(chk).parent().parent().find('[name="originflag"]').html();
		new_flagList[i] = $(chk).parent().parent().find('[name="newflag"]').html();
	});	
	
	var actived = $('#table_hour').find('.active');
	if ( actived.length == 0 ) {
		alert('수신 시간을 설정해주세요.');
		return;
	} 
	$.each(actived, function(i, time){
		if ( i == 0 ) {
			times = $(time).html();
		} else {
			times += ','+$(time).html();
		}
	});
		
	var optionData = {
		SYSTEM : system,
		TIMES  : times,
		OLDTIMES : $('[name="confChk"]:checked').parent().parent().children(':eq(3)').html(),
		OLD_NUMBERS : old_numbers,
		NEW_NUMBERS : new_numbers,
		alarmList : new_alarmList,
		alarmListOld : old_alarmList,
		severityList : new_severityList,
		oldList : old_flagList,
		newList : new_flagList,
		USER_ID : user_id
	};
		
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/system/sysSmsConfManager/updateConfData',
		contentType: 'application/json',
		data: requestData,
		dataType: 'json',
		success: function (data) {
			if ( data.result == 'SUCCESS' ) {
				alert('수정 처리가 완료되었습니다.');
				location.reload();
			} else {
				alert('에러 발생 : ' + data.msg);				
			}
		},
		error: function () { 
		   //alert('에러 발생');
		}
	});
}

function getPhoneInfo() {
	$('#phoneGrid').empty();
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsConfManager/getPhoneInfo',
		   contentType: 'application/json',
		   dataType: "json",
		   async: false,
		   success: function (data) {
			   $.each(data.phoneInfo, function(i,map){
				   
				   var phoneRow =  	'<tr>'+
				   					'<td>' +
				   			 			'<input type="checkbox" name="phoneCheck" onclick="setPhoneChkFlag(this)"/>' +
				   			 		'</td>'+
				   			 		'<td><span name="userPhone">'+ map.USER_PHONE +'</span>'+
					   			 	'<span name="phoneOriginflag" class="hidden"></span>'+
					   			 	'<span name="phoneNewflag" class="hidden"></span>'+	
				   			 		'</td>'+
				   			 		'<td>'+map.USE_CODE_NAME+'</td>'+
				   			 		'<td>'+map.PHONE_USE_NAME+'</td>'+
				   				'</tr>';
				   
				   $('#phoneGrid').append(phoneRow);
			   });			
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getSystemInfo(flag) {
	var disable = '';
	
	if(!flag){
		disable = ' disabled = "disabled"'
	}
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsConfManager/getSystemInfo',
		   dataType: "json",
		   async:false,
		   success: function (data) {
			   $('#systemGrid').empty();
			   $.each(data.systemInfo, function(i,map){
				   if (map.EQUIP_TYPE != '0' && map.EQUIP_TYPE != '3' ) { 
					   // 0 : NMS, 3 : RU 제외					   
					   var sysRow = '<tr>'+
					   				'<td><input type="checkbox" name="systemChk" onclick="checkCondition(this)"'+disable+'/></td>'+
					   				'<td>'+
					   					'<span name="sysName">'+map.EQUIP_NAME+'</span>' +
					   					'<input type="hidden" value=' + map.EQUIP_TYPE + '>' +
					   				'</td>'+
					   				
					   			  '</tr>'

					   $('#systemGrid').append(sysRow);	
				   }
			   });			
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getAlarmCode() {
	var word = $('#code_word').val();	
	var type = $('[name="systemChk"]:checked').parent().next().find('input').val();
	var optionData  = {	
			WORD : word,
			TYPE : type
			};
	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsConfManager/getAlarmCode',
		   contentType: 'application/json',
		   data : requestData,
		   dataType: "json",
		   async: false,
		   success: function (data) {
			   $('#codeGrid').empty();
			   
			   $.each(data.alarmCode, function(i, map) {
				   var codeRow = '<tr>' +
					   				'<td>' +
					   			 		'<input type="checkbox" name="codeChk" onclick="setChkFlag(this)" />' +
					   			 		'<span class="hidden">' + map.ORG_SEVERITY + '</span>' +
					   			 	'</td>' +
					   			 	'<td>' +
					   			 	'<span name="codeName">' + map.ALARM_CODE + '</span>' +
					   			 	'<span name="originflag" class="hidden"></span>'+
					   			 	'<span name="newflag" class="hidden"></span>'+	
					   			 	'</td>' +
					   			 '</tr>';	   			 	
				   $('#codeGrid').append(codeRow);
			   });			
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function getCodeForView(btnObj) {
	var time;
	var phone;
	var system;	
	var tds = $(btnObj).parent().parent().children();
	
	$.each(tds, function(i, td){
		if ( i == 2 ) {
			system = $(td).html();
		}
		else if ( i == 3 ) {
			time = $(td).html();
		}
		else if ( i == 5 ) {
			phone = $(td).data('phone');
		}
	});		

	var optionData  = {	
			TIME : time,
			PHONE : phone,
			SYSTEM : system
			};

	var requestData = JSON.stringify(optionData);
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsConfManager/getCodeForView',
		   contentType: 'application/json',
		   data : requestData,
		   dataType: "json",
		   async: false,
		   success: function (data) {
			   $('#codeViewbody').empty();
			   $.each(data.codeForView, function(i,code){
				   
				   var codeViewRow =  	'<tr>'+
				   			 		'<td>'+ code +'</td>' +
				   			 	'</tr>';
				   
				   $('#codeViewbody').append(codeViewRow);
			   });			
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function setUpdateInfo(system, time, phone, _user_id) {
	$('#phoneGrid').empty();
	$('#systemGrid').empty();
	$('#codeGrid').empty();
	$('#table_hour').find('button').removeClass('active');
	user_id = _user_id;
	//시스템 체크 처리
	getSystemInfo(false);
	//수신번호 리스트 get
	getPhoneInfo();
	
	//기존 시스템 값 대입
	$('#originSys').val(system);
	
	var obj;
	$.each($('#systemGrid').find('[name="sysName"]'),function(i, span){
		if ( $(span).html() == system ) {
			//system 이름 일치하는 필드 체크하기
			obj = $(span).parent().prev().find('input');
			obj.prop('checked', true)
			return;
		}
	});

	//시스템 체크시 코드 리스트 가져오는 동작
	checkCondition(obj);
	
	//알람코드 체크 처리
	var optionData  = {	
			TIME : time,
			PHONE : phone,
			SYSTEM : system
			};
	var requestData = JSON.stringify(optionData);
	
	var codeList;
	$.ajax({
		   type : 'post',
		   url: '/system/sysSmsConfManager/getCodeForView',
		   contentType: 'application/json',
		   data : requestData,
		   dataType: "json",
		   async:false,
		   success: function (data) {
			   codeList = data.codeForView;
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
		
	var idx = 0;
	$.each($('#codeGrid').find('[name="codeName"]'), function(i, span){
		   if ( $(span).html() == codeList[idx] ) {
			   $(span).parent().prev().find('input').prop('checked', true);
		
			   var originCode = $(span).html()
			   $(span).parent().append('<span class="hidden" name="originCode">'+originCode+'</span>');	  	   
			   $(span).parent().find('[name="originflag"]').html('true');
			   $(span).parent().find('[name="newflag"]').html('true');
			   idx++;
		   } else {
			   $(span).parent().find('[name="originflag"]').html('false');
			   $(span).parent().find('[name="newflag"]').html('false');
		   }

		   if ( codeList.length == idx ) {
			   return;
		   }
	 });
	
	//수신 시간 체크 처리
	var timeArr = time.split(',');
	$.each(timeArr, function(i, v){
		var id = '#hour'+ v
		$(id).addClass('active');
	});
	
	var phones = phone.split(',');
	phones.sort();
	idx = 0;
	$.each($('#phoneGrid').find('[name="userPhone"]'), function(i, span){
//		   if ( $(span).html() == phones[idx] ) {
			if ( phones.includes($(span).html()) ) {
			   $(span).parent().prev().find('input').prop('checked', true);
		
			   var originNumber = $(span).html()
			   $(span).parent().append('<span class="hidden" name="originUserPhone">'+originNumber+'</span>');	  	   
			   $(span).parent().find('[name="phoneOriginflag"]').html('true');
			   $(span).parent().find('[name="phoneNewflag"]').html('true');
			   idx++;
		   } else {
			   $(span).parent().find('[name="phoneOriginflag"]').html('false');
			   $(span).parent().find('[name="phoneNewflag"]').html('false');
		   }

		   if ( phones.length == idx ) {
			   return;
		   }
	 });
	
}


//라디오 요소처럼 동작시킬 체크박스 그룹 셀렉터
function checkCondition(obj){
    //클릭 이벤트 발생한 요소가 체크 상태인 경우
    if ($(obj).prop('checked')) {
        //체크박스 그룹의 요소 전체를 체크 해제후 클릭한 요소 체크 상태지정
    	if ( $(obj).attr('name') == 'phoneCheck' ) {
    		$('[name="phoneCheck"]').prop('checked', false);    		
    		$(obj).prop('checked', true);
    	}  else if ( $(obj).attr('name') == 'systemChk' ) {
    		$('[name="systemChk"]').prop('checked', false);
    		$(obj).prop('checked', true);
    		getAlarmCode(obj);
    	}        
    } else {
    	$('#codeGrid').empty();
    }
}

function allCodeCheck(obj){
	if ( $(obj).prop('checked') ) {
		$('[name="codeChk"]').prop('checked', true);
		$('[name="newflag"]').html('true');
	} else {
		$('[name="codeChk"]').prop('checked', false);	
		$('[name="newflag"]').html('false');
	}
}

function allPhoneCheck(obj){
	if ( $(obj).prop('checked') ) {
		$('[name="phoneCheck"]').prop('checked', true);
		$('[name="phoneNewflag"]').html('true');
	} else {
		$('[name="phoneCheck"]').prop('checked', false);	
		$('[name="phoneNewflag"]').html('false');
	}
}

function setChkFlag(obj){
	if ( $(obj).is(':checked') ) {
		$(obj).parent().parent().find('[name="newflag"]').html('true');		
	} else {
		$(obj).parent().parent().find('[name="newflag"]').html('false');		
	}
}

function setPhoneChkFlag(obj){
	if ( $(obj).is(':checked') ) {
		$(obj).parent().parent().find('[name="phoneNewflag"]').html('true');		
	} else {
		$(obj).parent().parent().find('[name="phoneNewflag"]').html('false');		
	}
}