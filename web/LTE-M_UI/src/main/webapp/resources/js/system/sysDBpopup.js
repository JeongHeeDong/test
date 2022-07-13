function initPopup(){
	//mmeDetail 숨기기 기능	 
	$('#dbAddClose, #dbAddCancle,#dbAddBg').on('click',function(e){
		$('#dbAddBg').fadeOut();
		$('#dbAddUp').fadeOut();
	});
	
	//mmeAdd Drag 지정 정의
	$( "#dbAddUp" ).draggable({'handle' : '#dbAddTitleBox'});
	$( "#dbAddUp" ).resizable({
		minWidth: 800,
		minHeight: 400,
		animate: true
	});
	 
	getHostName();	
}

function dbAddView(obj){
	
	$('#dbAddBg').show().fadeIn('fast');
	$('#dbAddUp').show().fadeIn('fast'); 
	
	$('#tableGrid').empty();
	$('#bak_desc').text('');
	$('#bak_day').text('');
	$('#bak_expire').text('');
	
	var height = (screen.height - $('#dbAddUp').height()-100)/2
	var width = (screen.width - $('#dbAddUp').width())/2
	
	$('#dbAddUp').css('left',width+'px');
	$('#dbAddUp').css('top',height+'px');
	
	$("#dbAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	if ( $('#originHost').length  == 1 ) {
		$('#originHost').remove();
	} 		
	
	if ( $('#originTime').length  == 1 ) {
		$('#originTime').remove();
	} 		

	$('.mu-radio > input').attr('disabled',false);
	
	$('#dbAddTitleBox').find('.title').html('DB 백업 관리 추가');
	$('#host_btn').removeClass('hidden');
	$('#dbAddSave').attr('onclick', 'insertData()');

	$('#bak_desc').val('');
	$('#bak_day').val('');
	$('#bak_expire').val('');
	
	addComponent($('#r1'));
		
}

function addComponent(radioBtn, modTable){
	
	$('#tableGrid').empty();
	$('#bak_desc').text('');
	$('#bak_day').text('');
	$('#bak_expire').text('');
	
	if ( $(radioBtn).val() == 'host') {
		$('#hostComp').removeClass('hidden');
		$('#tableComp').addClass('hidden');
		$('#r2').prop('checked', false);
		$('#r1').prop('checked', true);
	} else if ( $(radioBtn).val() == 'table') {
		$('#tableComp').removeClass('hidden');
		$('#hostComp').addClass('hidden');
		$('#r1').prop('checked', false);
		$('#r2').prop('checked', true);
		getTableInfo(modTable);
	}
}

function insertData(){
	//host, table 구분
	var name;	 //host, table 이름 
	var bakType; //host : 1, table : 2
	var bakDay;  //백업주기
	var expire;  //보존기간
	var desc;	 //설명
	
	if ( $('#r1').is(':checked') ) {
		name = $('#host_ul').find('.active').html();	
		bakType = 1;
		if ( name == undefined ) {
			alert('호스트를 선택해주세요.');
			return;
		}
	} else if ( $('#r2').is(':checked') ){
		name = $('input[name="tableChk"]:checked').parent().next().html();
		bakType = 2;
		if ( name == undefined ) {
			alert('테이블을 선택해주세요.');
			return;
		}
	}
	
	desc	 = $('#bak_desc').val();
	bakDay = $('#bak_day').val();
	expire  = $('#bak_expire').val();
	
	if ( validCheck(desc, bakDay, expire) ) {
		return;
	}
		
	var optionData  = {
			NAME: name,
			TYPE: bakType,
			DAY: bakDay,
			EXPIRE: expire,
			DESC: desc
			};
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/system/sysDBManager/insertBakData',
		contentType: 'application/json',
		data: requestData,
		dataType: 'json',
		async: false,
		success: function (data) {
			if ( data.result == 'OK' ) {
				alert('등록이 완료되었습니다.');
				location.reload();
			} else if ( data.result == 'DUP_HOST' ) {
				alert('이미 등록된 HOST 입니다.');
			} else if ( data.result == 'DUP_TABLE' ) {
				alert('이미 등록된 TABLE 입니다.');
			} 
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function updateData() {	
	var name = $('#originHost').val();
	var type = $('#bakType').html();
	
	var desc	 = $('#bak_desc').val();
	var bakDay = $('#bak_day').val();
	var expire  = $('#bak_expire').val();
	
	if ( validCheck(desc, bakDay, expire) ) {
		return;
	}
	
	var optionData  = {
			NAME: name,
			TYPE: type,
			DAY: bakDay,
			EXPIRE: expire,
			DESC: desc
			};
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/system/sysDBManager/updateBakData',
		contentType: 'application/json',
		data: requestData,
		dataType: 'json',
		aync: false,
		success: function (data) {
			if ( data.result == 1 ) {
				alert('수정이 완료되었습니다.');
				location.reload();
			} else {
				alert('수정을 실패하였습니다.');				
			}
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
}

function getTableInfo(modTable) {
	var opt;
	var word;
	if ( modTable != null) {
		opt  = 'TABLE_NAME';
		word = modTable;
	} else {		
		var opt  = $('#table_btn').html();
		if ( opt == '조회대상' ) {
			opt = '';
		} else if ( opt == 'Table' ) {
			opt = 'TABLE_NAME';
		} else if ( opt == '설명') {
			opt = 'TABLE_DESC';
		}
		var word = $('#table_word').val();
	}
	
	var optionData  = { searchOpt : opt, searchWord : word };
	var requestData = JSON.stringify(optionData);
	
	$.ajax({
		type : 'post',
		url: '/system/sysDBManager/getTableInfo',
		contentType: 'application/json',
		data : requestData,
		async: false,
		dataType: "json",
		success: function (data) {
			$('#tableGrid').empty();
			$.each(data.tableInfo, function(i,map){
				var bodyhtml = '';
				var checkBoxhtml = '';
				
				if ( modTable != null ) {
					checkBoxhtml = '<td></td>';												
				}
				else {
					checkBoxhtml = '<td style = "text-align: center;"><input type="checkbox" name="tableChk" onclick="checkCondition(this)"/></td>';
				}
				
				bodyhtml += '<tr>'
					+ checkBoxhtml
					+ '<td class = "overTxt">'+ map.TABLE_NAME +'</td>'
					+ '<td class = "overTxt">'+ map.TABLE_COMMENT +'</td>'
					+ '</tr>';
				
				$('#tableGrid').append(bodyhtml);
			});			
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function getHostName() {
	//Host 들을 불러와서 셀렉트박스 세팅
	$.ajax({
		type : 'post',
		url: '/system/sysDBManager/getHostName',
		dataType: "json",
		async: false,
		success: function (data) {
			$('#host_ul').empty();
			$.each(data.getHostName, function(i,v){
				$('#host_ul').append('<li>' + v + '</li>');	
			});			

			//DBTable 조회조건 셀렉트박스 세팅
			$('#table_ul').empty();
			$('#table_ul').append('<li>Table</li>');
			$('#table_ul').append('<li>설명</li>');
			
			drop_down_set(); //안에서 pageSearch() 호출
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function getOneBakData(dataName, bakType) {
	var optionData = {
			NAME : dataName,
			TYPE : bakType,
		};
	var requestData = JSON.stringify(optionData);
	var desc;
	var type;
	var day;
	var expire;
	$.ajax({
		type : 'post',
		url: '/system/sysDBManager/getOneBakData',
		contentType: 'application/json',
		data: requestData,
		async: false,
		dataType: "json",
		success: function (data) {
			desc	= data.getOneBakData.BACKUP_DESC;
			day	 = data.getOneBakData.BACKUP_DAY;
			expire = data.getOneBakData.DATA_EXPIRE;
			
			$('#hostComp').prepend('<input type="text" style="margin-top:10px" class="mu-input" id="originHost" value='+dataName+' readonly>');				
			$('#hostComp').prepend('<span class="hidden" id="bakType">'+bakType+'</span>')					
			
			//수정을 위해 필요한 폼 변경
			$('#dbAddTitleBox').find('.title').html('DB 백업 관리 수정');
			$('.mu-radio > input').attr('disabled',true);


			$('#tableGrid').empty();
			$('#bak_desc').text('');
			$('#bak_day').text('');
			$('#bak_expire').text('');
			var bodyhtml = '<tr>'
				+ '<td></td>'
				+ '<td class = "overTxt">'+ data.getOneBakData.TABLE_NAME +'</td>'
				+ '<td class = "overTxt">'+ data.getOneBakData.BACKUP_DESC +'</td>'
				+ '</tr>';
			
			$('#tableGrid').append(bodyhtml);
			
			if ( bakType == 1 ) { //host
				//addComponent($('#r1'), dataName);
				$('#host_btn').addClass('hidden');
				$('#hostComp').removeClass('hidden');
				$('#tableComp').addClass('hidden');
				$('#r2').prop('checked', false);
				$('#r1').prop('checked', true);
			}
			else if ( bakType == 2 ) { //table
				//addComponent($('#r2'), dataName);
				$('#tableSearchBar').addClass('hidden');
				$('#tableComp').removeClass('hidden');
				$('#hostComp').addClass('hidden');
				$('#r1').prop('checked', false);
				$('#r2').prop('checked', true);
			}
			$('#dbAddSave').attr('onclick', 'updateData()');
		
			$('#bak_desc').val(desc);
			$('#bak_day').val(day);
			$('#bak_expire').val(expire);				
		},
		error: function () { 
			//alert('에러 발생');
		}
	});
	
}

//라디오 요소처럼 동작시킬 체크박스 그룹 셀렉터
function checkCondition(obj){
	//클릭 이벤트 발생한 요소가 체크 상태인 경우
	if ($(obj).prop('checked')) {
		//체크박스 그룹의 요소 전체를 체크 해제후 클릭한 요소 체크 상태지정
		$('[name="tableChk"]').prop('checked', false);
		$(obj).prop('checked', true);
	}
}


function validCheck(desc, bakDay, expire) {
	var flag = false;
	var regex = /^[0-9]+$/;
//	if ( desc.length == 0 ) {
//		alert('설명을 입력해주세요.');
//		flag = true;
//		return flag;
//	} 
	
	if ( bakDay.length == 0 ) {
		alert('백업주기를 입력해주세요.');
		flag = true;
		return flag;
	} else if ( !regex.test(bakDay) ) {
		alert('백업주기는 숫자만 입력 가능합니다. (일 단위로 입력)');
		flag = true;
		return flag;
	}
	
	if ( expire.length == 0 ) {
		alert('보존기간을 입력해주세요.');
		flag = true;
		return flag;
	} else if ( !regex.test(expire) ) {
		alert('보존기간은 숫자만 입력 가능합니다. (일 단위로 입력)');
		flag = true;
		return flag;
	}
}