$(document).ready(function(){   
    confCal();
});


function confCal(){   
    $('#notice_dt_from').datepicker({
        dateFormat: 'yy-mm-dd',
        changeYear: true,
        changeMonth: true,
        showButtonPanel: true,
        //"setDate": new Date(),
        stepMonths: 1,
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        onClose: function(selectedDate) {
            $('#notice_dt_to').datepicker('option', 'minDate', selectedDate);
        }
    });
        
    $('#notice_dt_to').datepicker({
        dateFormat: 'yy-mm-dd',
        changeYear: true,
        changeMonth: true,
        showButtonPanel: true,
        stepMonths: 1,
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
    });

    var to_dt = new Date();
    to_dt.setMonth(to_dt.getMonth() + 1);

    $("#notice_dt_from").datepicker("setDate", new Date());
    $("#notice_dt_to").datepicker("setDate", to_dt);
    $('#notice_dt_from').datepicker("option","maxDate", to_dt);
    
    $('#notice_dt_from_btn').on('click',function(e){
        $('#notice_dt_from').datepicker("show");
    });
    $('#notice_dt_to_btn').on('click',function(e){
        $('#notice_dt_to').datepicker("show");
    });

}


var extList = ['jpg','png',
               'txt', 'hwp', 'pdf',
               'doc','xls', 'xlsx', 'ppt', 'pptx',
               'zip','alz','rar','tar'];

function initPopup(){
	//mmeDetail 숨기기 기능    
    $('#notiAddClose, #notiAddCancel,#notiAddBg').on('click',function(e){
		$('#notiAddBg').fadeOut();
		$('#notiAddUp').fadeOut();
	});
	
//    //mmeAdd Drag 지정 정의
//	$( "#notiAddUp" ).draggable({'handle' : '#notiAddTitleBox'});
//	$( "#notiAddUp" ).resizable({
//		minWidth: 800,
//		minHeight: 400,
//		animate: true
//	});	 
}

function notiReadView(obj){
	
	$('#notiAddBg').show().fadeIn('fast');
	$('#notiAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#notiAddUp').height()-100)/2
	var width = (screen.width - $('#notiAddUp').width())/2
	
	$('#notiAddUp').css('left',width+'px');
	$('#notiAddUp').css('top',height+'px');
	
	$("#notiAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('.title').html('공지사항');
	
	$('.mu-file-attach').addClass('hidden');
	$('#originFile').removeClass('hidden');
	
	$('#notiAddSave').addClass('hidden');
	$('#notiAddCancel').removeClass('gray');
	$('#notiAddCancel').html('<i class="mu-icon check"></i>확인');
	
	var id = $(obj).parent().find('[name="userId"]').html();
	var time = $(obj).parent().find('[name="eventTime"]').html();
	
	time = time.replace(/\//g,'-');
	getOneNotiData(id, time);
	$('#noti_subject').attr('readonly', true);
	$('#noti_content').attr('readonly', true);
	$('#originFile').attr('onclick', 'downloadFile()');

	if ( $('#originFile').html() == '첨부파일 없음' ) {
		$('#originFile').attr('style','color:black');
	} else {
		$('#originFile').attr('style','color:blue;cursor:pointer');
	}
	
	$('#fileDelBtn').addClass('hidden');
}

function notiUpdView(){
	var checked = $('[name=notiChk]:checked'); 
	if ( checked.length == 0 ) {
		alert('먼저 수정할 데이터를 선택해주세요.');
		return;
	} else if ( checked.length > 1  ) {
		alert('수정은 하나씩만 가능합니다.');
		return;
	}
	
	$('#notiAddBg').show().fadeIn('fast');
	$('#notiAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#notiAddUp').height()-100)/2
	var width = (screen.width - $('#notiAddUp').width())/2
	
	$('#notiAddUp').css('left',width+'px');
	$('#notiAddUp').css('top',height+'px');
	
	$("#notiAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('.title').html('공지사항 수정');
	
	var id = $(checked).parent().parent().find('[name="userId"]').html();
	var time = $(checked).parent().parent().find('[name="eventTime"]').html();
	time = time.replace(/\//g,'-');

	$('#selectedId').val(id);
	$('#selectedTime').val(time);
	
	getOneNotiData(id, time);
	
	$('.mu-file-attach').removeClass('hidden');
	
	$('#notiAddSave').removeClass('hidden');
	$('#notiAddSave').attr('onclick','updateData()');
	$('#notiAddCancel').addClass('gray');	
	$('#notiAddCancel').html('<i class="mu-icon cancel"></i>취소');	
	
	$('#noti_subject').attr('readonly', false);
	$('#noti_content').attr('readonly', false);
	
	$('#file').val('');
	$('#fileName').val('');
	$('#fileName').attr('placeholder','새로운 파일 첨부시 기존 파일이 자동으로 삭제됩니다.');
	
	$('#originFile').addClass('hidden');
	if ( $('#originFile').html() != '첨부파일 없음' ) {
		$('#originFile').removeClass('hidden');
		$('#originFile').attr('style','color:black');
		$('#originFile').attr('onclick', false);
		
		$('#fileDelBtn').removeClass('hidden');		
	}
}


function notiAddView(obj){
	
	$('#notiAddBg').show().fadeIn('fast');
	$('#notiAddUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#notiAddUp').height()-100)/2
	var width = (screen.width - $('#notiAddUp').width())/2
	
	$('#notiAddUp').css('left',width+'px');
	$('#notiAddUp').css('top',height+'px');
	
	$("#notiAddDiv").scrollTop(0);
	
	//콤포넌트 초기화
	$('.title').html('공지사항 추가');
	
	$('#noti_subject').val('');
	$('#noti_content').val('');
	
	$('.mu-file-attach').removeClass('hidden');
	$('#originFile').addClass('hidden');
	
	$('#notiAddSave').removeClass('hidden');
	$('#notiAddSave').attr('onclick','insertData()');
	$('#notiAddCancel').addClass('gray');
	$('#notiAddCancel').html('<i class="mu-icon cancel"></i>취소');	
	
	$('#noti_subject').attr('readonly', false);
	$('#noti_content').attr('readonly', false);
	
	$('#file').val('');
	$('#fileName').val('');
	$('#fileName').removeAttr('placeholder');
	$('#fileDelBtn').addClass('hidden');
}

function insertData(){
	var form = new FormData(document.getElementById("fileUploadForm"));
	$.ajax({
		url: "/system/sysNotiManager/insertNoti",
		data: form,
		dataType: 'json',
		processData: false,
		contentType: false,
		type: 'POST',
		success: function (data) {
            $.alert.open(data.result, {A: '확인'}, function(button) {
                
                if (!button) {
                    location.reload();
                } else {
                    location.reload();
                }
            });
		},
		error: function (jqXHR) {
		}
	});		
}


            
function updateData() {	
	var title = $('#noti_subject').val();
	var desc = $('#noti_content').val();	
	
	if ( title == '' ) {
		alert('제목을 입력해주세요.');
		return;
	} 
	
	if ( desc == '' ) {
		alert('내용을 입력해주세요.');
		return;
	}
	
	var form = new FormData(document.getElementById("fileUploadForm"));
		
	$.ajax({
		url: "/system/sysNotiManager/updateNoti",
		data: form,
		dataType: 'json',
		processData: false,
		contentType: false,
		type: 'POST',
		success: function (data) {
            
            
			$.alert.open(data.result, {A: '확인'}, function(button) {
                
                if (!button)
                    location.reload();
                else
                    location.reload();
            });

			//location.reload();
			//pageSearch();
		},
		error: function (jqXHR) {
		}
	});
}

function getOneNotiData(userId, eventTime) {
	var optionData = {
			ID : userId,
			TIME : eventTime,
		};
	var requestData = JSON.stringify(optionData);

	var title;
	var desc;
	var fileName;
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysNotiManager/getOneNotiData',
		   contentType: 'application/json',
		   data: requestData,
		   async: false,
		   dataType: "json",
		   success: function (data) {
			   title = data.getOneNotiData.NOTICE_TITLE;
			   desc  = data.getOneNotiData.NOTICE_DESC;
			   
			   console.log('>>> to : ' + data.getOneNotiData.NOTI_PERIOD);
			   console.log('>>> 1 : ' + moment(data.getOneNotiData.FROM_DATE, 'YYYY-MM-DD'));
			   console.log('>>> 1 : ' + moment(data.getOneNotiData.TO_DATE, 'YYYY-MM-DD'));
			   console.log('>>> 1 : ' + data.getOneNotiData.MAIN_NOTI_YN);
			   
			   if ('Y' == data.getOneNotiData.MAIN_NOTI_YN) {
                    $("#mainNotice").prop('checked', true);
               } else {
                    $("#mainNotice").prop('checked', false);
               }
               
               $("#notice_dt_from").datepicker("setDate", data.getOneNotiData.FROM_DATE_FORMAT);
               $("#notice_dt_to").datepicker("setDate", data.getOneNotiData.TO_DATE_FORMAT);
			   /*
			   $("#search_dt_from").datepicker("setDate", from_dt);
               $("#search_dt_to").datepicker("setDate", new Date());
               */
    
			   //fileName = data.getOneNotiData.FILE_NAME;
			   
			   $('#noti_subject').val(title);
			   $('#noti_content').val(desc);
			   //$('#originFile').html(fileName);
			   //$('[name="originFile"]').val(fileName);
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});  
}

function fileSelected(obj) {
	document.getElementById('fileName').value = obj.value;
	deleteFile();
}

function downloadFile() {
	var originName = $('#originFile').html();
	
	location.href = '/system/sysNotiManager/fileDown?fileName='+originName;
}

function deleteFile() {
	var origin = $('#originFile').html();
	if ( origin != '첨부파일 없음' ) {
		origin+=':DEL';		
	}
	//$('#originFile').html(origin);
	$('[name="originFile"]').val(origin);
	
	$('#originFile').addClass('hidden');
	$('#fileDelBtn').addClass('hidden');
}

function extValidCheck(obj) {
	var valid = false;
	var fileName = $(obj).val();
	var length = fileName.length;
	var dot    = fileName.lastIndexOf('.');
	
	var fileext = fileName.substring(dot+1, length);
	$.each(extList, function(i, ext){
		if ( ext == fileext) {
			valid = true;
		}
	});
	
	if ( valid ) {
		fileSelected(obj);
	} else {
		alert(fileext +' 확장자는 업로드 할 수 없습니다.');
		$('#file').val('');
	}
}