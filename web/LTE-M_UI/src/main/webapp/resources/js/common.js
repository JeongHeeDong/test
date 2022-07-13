
var cLineInfoList = [];
var cLineInfoDict = {};
var lineAjax;
$(document).ready(function(){
	$( document ).ajaxError(function(event, request, settings) {
		if(request.status == 401) {
			alert('세션이 만료되었습니다.');
			location.href = '/';
		}else if(request.status == 99999){
			location.href = '/popException';
		}
	});
	
	$( document ).ajaxStart(function(event, request, settings) {
		$('#ajax_indicator').show();
	});
	
	$( document ).ajaxStop(function(event, request, settings) {
		$('#ajax_indicator').hide();
	});
	
//	메뉴 이동 해당 메뉴 활성 기능
	var keyUrl = location.href.split('/');
	
	for(var keyindex in keyUrl){
		$('li').each(function(key,value){
			var li_id = $(value).attr('id');
			
			if(li_id == keyUrl[keyindex]){
				$('#'+li_id).addClass('active');
			}
		});
	}
	
	
	/*datepicker 한글화*/
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		changeMonth: true,
		showButtonPanel: true,
		stepMonths: 1,
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        prevText: '이전 달',
        nextText: '다음 달',
		currentText: '오늘',
		closeText: '취소'
	});
	
	/*datepicker 제어 (예시)*/
//	$('#startDateTxt').datepicker({
//		dateFormat: 'yy-mm-dd',
//		onClose: function( selectedDate ) {
//            $( "#endDateTxt" ).datepicker( "option", "minDate", selectedDate );
//        }
//		,changeYear: true
//		,changeMonth: true
//		,stepMonths: 1
//		,showButtonPanel: true
//		,dateFormat: 'yy-mm-dd'
//		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
//		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
//		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
//	});
//	
//	$('#endDateTxt').datepicker({
//		minDate: "+1D",
//		dateFormat: 'yy-mm-dd'
//		,changeYear: true
//		,changeMonth: true
//		,stepMonths: 1
//		,showButtonPanel: true
//		,dateFormat: 'yy-mm-dd'
//		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
//		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
//		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
//	});
//	
//	$('#startDateBtn').on('click',function(e){
//		$('#startDateTxt').datepicker("show");
//	});
//	
//	
//	$('#endDateBtn').on('click',function(e){
//		$('#endDateTxt').datepicker("show");
//	});
	
	$('button.btnLogout').on('click', function(e){
		
		location.href = "/logout";
		
	});
	
	//복사 방지 스크립트
//	var ctrlDown = false;
//    var ctrlKey = 17, vKey = 86, cKey = 67;
//
//    $(document).keydown(function(e){
//    	
//        if (e.keyCode == ctrlKey) ctrlDown = true;
//        
//        if (ctrlDown && e.keyCode == cKey){
//        	return false;
//        }
//    }).keyup(function(e){
//    	
//        if (e.keyCode == ctrlKey) ctrlDown = false;
//    });
	
	$('#Detail_Btn').on('click',function(e){
		var obj = $('#Detail_Btn').find('i').hasClass('up');
		
		if(obj){
			$('#Detail_Btn').find('i').removeClass('up');
			$('#Detail_Btn').find('i').addClass('down');
			
			$('#Detail_Con').css('display','');
		}else{
			$('#Detail_Btn').find('i').removeClass('down');
			$('#Detail_Btn').find('i').addClass('up');
			
			$('#Detail_Con').css('display','none');
		}
	});
	
	// 호선데이터 
	$.ajax({
		cache : false,
		type : 'get',
		url : '/pss/code/station/getStationLine',
		dataType : 'json',
		success	: function(data) {
			cLineInfoList = data
			// lineInfoDict값입력
			$.each(cLineInfoList ,function(idx, lineinfo){
				cLineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
				srcIdx = idx
				for(var idx;idx<cLineInfoList.length;idx++) {
					if (cLineInfoList[idx+1] != undefined){
						var lines = cLineInfoList[srcIdx].LINE_ID +','+ cLineInfoList[idx+1].LINE_ID
						var lensNm = cLineInfoList[srcIdx].LINE_NAME +','+ cLineInfoList[idx+1].LINE_NAME
						cLineInfoDict[lines] = lensNm;
					}
				}
			})
		},
		error: function () { 
		   }
	})
});


//Date format 지정
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};



//특수문자 변환
var entityMap = {
    "&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
    });
}

//페이징 처리 로직

function pagingBtn(btn_type){
	var pageSize = $('#pageSize').val();
	var totalcount = $('#totalCount').val();
	var MaxpageBtn_No = 0;
	
	if(totalcount % pageSize == 0){
	   
		MaxpageBtn_No = totalcount / pageSize;
	}else{
	   
		MaxpageBtn_No = parseInt((totalcount / pageSize)+1);
	}
	
	var pageNo = parseInt($('#pageNo').val());
   
	if('first' == btn_type){
		if(pageNo != 1){
			$('#pageNo').val(1);
			pageSearch();
		}
		
	}else if('last' == btn_type){
		if(pageNo != MaxpageBtn_No){
			$('#pageNo').val(parseInt(MaxpageBtn_No));
			pageSearch();
		}
		
	}else if('prev' == btn_type){
		
		if(pageNo > 1){
			$('#pageNo').val(pageNo-1)
			pageSearch();
		}
	}else if('next' == btn_type){
		
		if(pageNo < MaxpageBtn_No){
			$('#pageNo').val(pageNo+1)
			pageSearch();
		}
	}else{
		var currentPageNo = parseInt($(btn_type).text());
		
		if(currentPageNo != pageNo){
			$('#pageNo').val($(btn_type).text());
			pageSearch();
		}
	
	}
}

//검색버튼 클릭(페이징 처리)
function btnSearchClick(){
	$('#pageNo').val("1");
	$('#totalCount').val("0");
	pageSearch();
}

function analSearchClick(){
	$('#pageNo').val("1");
	$('#totalCount').val("0");
	
	columnSorting.sortInfo = [];
	columnSorting.beforeColNms = [];
	
	$('#grid_estab').find('.sort').removeClass('updown');
	$('#grid_estab').find('.sort').removeClass('up');
	$('#grid_estab').find('.sort').removeClass('down');
	$('#grid_estab').find('.sort').addClass('updown');
	
	pageSearch();
}

//페이징 기능 Setting - 리스트 사이즈 가변
function pagingSetting(totalcount, pageNo, pageSize){

	var pageSize = pageSize || 20;

	$('#totalCount').val(totalcount);

	var MaxpageBtn_No

	if(totalcount % pageSize == 0){
		MaxpageBtn_No = totalcount / pageSize;
	}else{
		MaxpageBtn_No = (totalcount / pageSize)+1;
	}

	var baseNo = 1;
	for(baseNo; pageNo > baseNo*9 ; baseNo++){

	}

	baseNo = baseNo == 0?1:baseNo;

	$('#page_Btn_No').empty();

	for(var count= (baseNo*9)-8 ; count <= baseNo*9; count ++){

		var classActive='';
		if(count == pageNo){
			classActive = ' class = "active"'
		}

		if(count <= MaxpageBtn_No){
			$('#page_Btn_No').append(
					'<li'+classActive+' style="cursor:pointer;"><a onclick="javascript:pagingBtn(this)">'+count+'</a></li>'
			);
		}
	}
}

//ComboBox 항목이 변경된 경우 이벤트 재등록을 할때 호출(모든 combobox는 페이지 로딩시 Setting 해야한다)
function drop_down_set(flag){
	
	//Drop down 버튼 기능
	var select_root = $('div.mu-selectbox');
	var select_value = $('.mu-value');
	var select_li = $('div.mu-selectbox>ul>li');

	// Show
	function show_option(){
		$(this).parents('div.mu-selectbox:first').toggleClass('on');
	}
	
	// Hover
	function i_hover(){
		$(this).parents('ul:first').children('li').removeClass('hover');
		$(this).parents('li:first').toggleClass('hover');
	}
	
	// Hide
	function hide_option(){
		var t = $(this);
		setTimeout(function(){
			t.parents('div.mu-selectbox:first').removeClass('on');
		}, 1);
	}
	
	// Set Anchor
	function set_anchor(){
		var v = $(this).text();
		var value = $(this).data('id');
		$(this).parents('ul:first').prev('.mu-value').text('').append(v);
		$(this).parents('ul:first').prev('.mu-value').val(value);
		$(this).parents('ul:first').prev('.mu-value').addClass('select');
		$(this).parents('ul:first').find('li').removeClass('active');
		$(this).addClass('active');
		
		// DB 백업 관리화면에서 사용되는 기능
		if(value == 'DB_BackType'){
			dbChangeOption(true);
		}else if(value == 'DB_BackOption'){
			dbChangeOption(false);
		}
	}

	// Anchor Focus Out
	$('*:not("div.mu-selectbox li")').focus(function(){
		$('.mu-list').parent('.select').removeClass('on');
	});
			
	select_value.click(show_option);
	select_root.removeClass('on');
	select_root.mouseleave(function(){$(this).removeClass('on')});
	select_li.click(set_anchor).click(hide_option).focus(i_hover).hover(i_hover);
	
	if(flag == 'undefined' || flag == null) pageSearch();
}

//숫자만 입력하능하게 하는 함수(input 박스에 onkeypress 속성 이용)
function fn_press(event, type) {
	
    if(type == "numbers") {
        if(event.keyCode < 48 || event.keyCode > 57) return false;
        //onKeyDown일 경우 좌, 우, tab, backspace, delete키 허용 정의 필요
    }
    
    if(type == "negativeNumbers") {
        if( (event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 45 ) return false;
        //onKeyDown일 경우 좌, 우, tab, backspace, delete키 허용 정의 필요
    }
    
    if(type == "float"){
    	if(event.keyCode != 46)
    		if(event.keyCode < 48 || event.keyCode > 57)
    				return false;
    }
    
    if(type == "numbersAndstar"){
    	if(event.keyCode != 42)
    		if(event.keyCode < 48 || event.keyCode > 57) return false;
    }
}

//ipv4, ipv6 check
function ip_Check(ip){
	
	var reg = /(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]? \d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))))$|(^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(\*)))$/;
	
	if(reg.test(ip)){
		return true;
	}
	
	return false;
}


/* 토폴로지 팝업 Tab */
var $topologyBody = null;

$(function() {

	$topologyBody = $(".topologyBody>div");
	
	$(".topologyTab li").click(function(e) {
	
		e.preventDefault();
		
		//on클래스 제거
		$(".active").removeClass("active");
		
		var $this = $(this).addClass("active");
		
		var index = $this.index();
		
		var txt = $this.text();
		
		
		//현재 보여지는 show제거
		$(".show").removeClass("show").hide();
		
		//아래쪽 div
		$topologyBody.eq(index).addClass("show").show();
		
	
	});//click end
	
});//function end

//감시화면에서 쓰이는 audio파일
var audioFile = {
	criticalaudio : new Audio(),
	majoraudio : new Audio(),
	minoraudio : new Audio(),
	f_criticalaudio: new Audio(),
	f_majoraudio: new Audio(),
	f_minoraudio: new Audio()
};
//audio 관련 기능
var audioFunction ={
	audioPlay : function (){
		var audioIntervalId;
		var alarmLevel = $('#audioAlarmLevel').val();

		if(alarmLevel == 1) {
			audioIntervalId = setInterval("audioFile.criticalaudio.play()", 1000*30);
			audioFile.criticalaudio.play();
		} else if(alarmLevel == 2) {
			audioIntervalId = setInterval("audioFile.majoraudio.play()", 1000*30);
			audioFile.majoraudio.play();
		} else if(alarmLevel == 3) {
			audioIntervalId = setInterval("audioFile.minoraudio.play()", 1000*30);
			audioFile.minoraudio.play();
		}

		$('#audioIntervalId').val(audioIntervalId);
	},
	audioPuse : function (){
		clearInterval($('#audioIntervalId').val());
	},
	failureAudioOnePlay : function(alarmLevel, page){
		
		if(!audioFile.criticalaudio.paused){
			audioFile.criticalaudio.pause();
			if (!isNaN(audioFile.criticalaudio.duration)) {
				audioFile.criticalaudio.currentTime = 0;
		    }
		}else if(!audioFile.majoraudio.paused){
			audioFile.majoraudio.pause();
			if (!isNaN(audioFile.majoraudio.duration)) {
				audioFile.majoraudio.currentTime = 0;
		    }
			audioFile.majoraudio.currentTime = 0;
		}else if(!audioFile.minoraudio.paused){
			audioFile.minoraudio.pause();
			if (!isNaN(audioFile.minoraudio.duration)) {
				audioFile.minoraudio.currentTime = 0;
		    }
		}
		
		if(alarmLevel == 1) {
			if(!audioFile.f_majoraudio.paused || !audioFile.f_minoraudio.paused){
				audioFile.f_majoraudio.pause();
				if (!isNaN(audioFile.f_majoraudio.duration)) {
					audioFile.f_majoraudio.currentTime = 0;
			    }
				audioFile.f_minoraudio.pause();
				if (!isNaN(audioFile.f_minoraudio.duration)) {
					audioFile.f_minoraudio.currentTime = 0;
			    }
			}
			audioFile.f_criticalaudio.play();

		} else if(alarmLevel == 2) {
			if(!audioFile.f_minoraudio.paused){
				audioFile.f_minoraudio.pause();
				if (!isNaN(audioFile.f_minoraudio.duration)) {
					audioFile.f_minoraudio.currentTime = 0;
			    }
				audioFile.f_majoraudio.play();
			}else if(audioFile.f_criticalaudio.paused){
				audioFile.f_majoraudio.play();
			}
			

		} else if(alarmLevel == 3) {
			if(audioFile.f_criticalaudio.paused && audioFile.f_majoraudio.paused){
				audioFile.f_minoraudio.play();
			}
		}
	},
	failureAudioSetInterval : function(){
		var audioIntervalId;
		var alarmLevel = $('#failureAudioAlarmLevel').val();

		if(alarmLevel == 1) {
			audioIntervalId = setInterval("audioFile.f_criticalaudio.play()", 1000*30);
		} else if(alarmLevel == 2) {
			audioIntervalId = setInterval("audioFile.f_majoraudio.play()", 1000*30);
		} else if(alarmLevel == 3) {
			audioIntervalId = setInterval("audioFile.f_minoraudio.play()", 1000*30);
		}

		$('#failureAudioIntervalId').val(audioIntervalId);
	},
	failureAudioPause: function () {
		// audioFile.f_criticalaudio.pause();
		// audioFile.f_majoraudio.pause();
		// audioFile.f_minoraudio.pause();
		clearInterval($('#failureAudioIntervalId').val());
	},
	networkAudioPlay : function(alarmLevel, type){
		var audioIntervalId;
		//type => 1 : 고장, 0 : 성능
		if(type == 1){
			// 성능 audio pause
			if(!audioFile.criticalaudio.paused){
				audioFile.criticalaudio.pause();
				audioFile.criticalaudio.currentTime = 0;
			}else if(!audioFile.majoraudio.paused){
				audioFile.majoraudio.pause();
				audioFile.majoraudio.currentTime = 0;
			}else if(!audioFile.minoraudio.paused){
				audioFile.minoraudio.pause();
				audioFile.minoraudio.currentTime = 0;
			}
			
			//고장 audio play
			if(alarmLevel == 1) {
				if(!audioFile.f_majoraudio.paused || !audioFile.f_minoraudio.paused){
					audioFile.f_majoraudio.pause();
					audioFile.f_majoraudio.currentTime = 0;
					audioFile.f_minoraudio.pause();
					audioFile.f_minoraudio.currentTime = 0;
				}
				audioFile.f_criticalaudio.play();
	
			} else if(alarmLevel == 2) {
				if(!audioFile.f_minoraudio.paused){
					audioFile.f_minoraudio.pause();
					audioFile.f_minoraudio.currentTime = 0;
					audioFile.f_majoraudio.play();
				}else if(audioFile.f_criticalaudio.paused){
					audioFile.f_majoraudio.play();
				}
				
	
			} else if(alarmLevel == 3) {
				if(audioFile.f_criticalaudio.paused && audioFile.f_majoraudio.paused){
					audioFile.f_minoraudio.play();
				}
			}
		} else if(type == 0) {
			if(audioFile.f_criticalaudio.paused && audioFile.f_minoraudio.paused && audioFile.f_majoraudio.paused){
				if(alarmLevel == 1) {
					audioIntervalId = setInterval("audioFunction.networkIntervalPlay(1,0)", 1000*30);
					audioFile.criticalaudio.play();
				} else if(alarmLevel == 2) {
					audioIntervalId = setInterval("audioFunction.networkIntervalPlay(2,0)", 1000*30);
					audioFile.majoraudio.play();
				} else if(alarmLevel == 3) {
					audioIntervalId = setInterval("audioFunction.networkIntervalPlay(3,0)", 1000*30);
					audioFile.minoraudio.play();
				}
				$('#audioIntervalId').val(audioIntervalId);
			}
			
		} else if(type == 3) {
			//네트워크 토폴로지의 토폴로지의 가청버튼을 클릭한 경우
			//가청버튼은 바로 play를 하지 않고 이벤트만 등록
			var alarmLev = Number(alarmLevel) || 0;
			if(0 < alarmLev && alarmLev < 4) {
				audioIntervalId = setInterval("audioFunction.networkIntervalPlay(" + alarmLev + ",0)", 1000*30);
			}
			$('#audioIntervalId').val(audioIntervalId);
		}
	},
	networkfailureAudioSetInterval : function(){
		var audioIntervalId;
		var alarmLevel = $('#failureAudioAlarmLevel').val();

		var alarmLev = Number(alarmLevel) || 0;
		if(0 < alarmLev && alarmLev < 4) {
			audioIntervalId = setInterval("audioFunction.networkIntervalPlay(" + alarmLev + ",1)", 1000*30);
			$('#failureAudioIntervalId').val(audioIntervalId);
		}
	},
	networkIntervalPlay : function(alarmLevel, type){
		if(type == 1){
			// 성능 audio pause
			if(!audioFile.criticalaudio.paused){
				audioFile.criticalaudio.pause();
				audioFile.criticalaudio.currentTime = 0;
			}else if(!audioFile.majoraudio.paused){
				audioFile.majoraudio.pause();
				audioFile.majoraudio.currentTime = 0;
			}else if(!audioFile.minoraudio.paused){
				audioFile.minoraudio.pause();
				audioFile.minoraudio.currentTime = 0;
			}
			
			//고장 audio play
			if(alarmLevel == 1) {
				if(!audioFile.f_majoraudio.paused || !audioFile.f_minoraudio.paused){
					audioFile.f_majoraudio.pause();
					audioFile.f_majoraudio.currentTime = 0;
					audioFile.f_minoraudio.pause();
					audioFile.f_minoraudio.currentTime = 0;
				}
				audioFile.f_criticalaudio.play();
	
			} else if(alarmLevel == 2) {
				if(!audioFile.f_minoraudio.paused){
					audioFile.f_minoraudio.pause();
					audioFile.f_minoraudio.currentTime = 0;
					audioFile.f_majoraudio.play();
				}else if(audioFile.f_criticalaudio.paused){
					audioFile.f_majoraudio.play();
				}
				
	
			} else if(alarmLevel == 3) {
				if(audioFile.f_criticalaudio.paused && audioFile.f_majoraudio.paused){
					audioFile.f_minoraudio.play();
				}
			}
		}else if(type == 0) {
			if(audioFile.f_criticalaudio.paused && audioFile.f_minoraudio.paused && audioFile.f_majoraudio.paused){
				if(alarmLevel == 1) {
					audioFile.criticalaudio.play();
				} else if(alarmLevel == 2) {
					audioFile.majoraudio.play();
				} else if(alarmLevel == 3) {
					audioFile.minoraudio.play();
				}
			}
		}
	}
};

function getAlarmVolume(){
	var volumes;
	
	$.ajax({
		   type : 'post',
		   url: '/setting/getAlarmVolume',
		   dataType: "json",
		   async: false,
		   success: function (data) {
			   volumes = data.getAlarmVolume;
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
	return volumes;
}

function getDatetime(timestamp){
	var dateTime = '';
	if(timestamp != ''){
		var date = new Date(timestamp);
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();		
		dateTime = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " "
		+ (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
	}
	return dateTime;
}

function getDataConvert(returnType, col, data){
	var result = '';
	if(data == null){
		return result;
	}
	if(returnType.toUpperCase() == "NUM"){ //원하는 리턴값이 숫자, 즉 넘어온 값이 스트링인경우에는 대문자로 변환
		data = data.toUpperCase();
	}
	if(col.toUpperCase() == 'SEVERITY'){
		var severityNum = '';
		var severityName = '';
		if(data == 1 || data == 'CRITICAL'){
			severityNum = 1;
			severityName = 'CRITICAL';
		} else if(data == 2 || data == 'MAJOR'){
			severityNum = 2;
			severityName = 'MAJOR';
		} else if(data == 3 || data == 'MINOR'){
			severityNum = 3;
			severityName = 'MINOR';
		} else {
			severityNum = 4;
			severityName = 'NORMAL';
		}

		// else if(data == 4 || data == 'WARN'){
		// 	severityNum = 4;
		// 	severityName = 'NORMAL';
		// }
		if(returnType.toUpperCase() == 'NUM'){
			result = severityNum;
		} else if(returnType.toUpperCase() == 'NAME'){
			result = severityName;
		}
	}
	
	else if(col.toUpperCase() == 'ALARM_STATE'){
		var alarmStatNum = '';
		var alarmStatName = '';
		if(data == 0 || data == 'Clear'){
			alarmStatNum = 0;
			alarmStatName = 'Clear';
		} else if(data == 1 || data == 'Open'){
			alarmStatNum = 1;
			alarmStatName = 'Open';
		} else if(data == 2 || data == 'Ack'){
			alarmStatNum = 2;
			alarmStatName = 'Ack';
		} else if(data == 3 || data == 'Delete'){
			alarmStatNum = 3;
			alarmStatName = 'Delete';
		}
		if(returnType.toUpperCase() == 'NUM'){
			result = alarmStatNum;
		} else if(returnType.toUpperCase() == 'NAME'){
			result = alarmStatName;
		}
	}
	
	else if(col.toUpperCase() == 'ALARM_TYPE'){
		var alarmTypeNum = '';
		var alarmTypeName = '';
		if(data == 1 || data == 'ALARM'){
			alarmTypeNum = 1;
			alarmTypeName = 'ALARM';
		} else if(data == 2 || data == 'FAULT'){
			alarmTypeNum = 2;
			alarmTypeName = 'FAULT';
		} else if(data == 3 || data == 'STATUS'){
			alarmTypeNum = 3;
			alarmTypeName = 'STATUS';
		} else if(data == 4 || data == 'ETC'){
			alarmTypeNum = 4;
			alarmTypeName = 'ETC';
		}
		if(returnType.toUpperCase() == 'NUM'){
			result = alarmTypeNum;
		} else if(returnType.toUpperCase() == 'NAME'){
			result = alarmTypeName;
		}
	}
	
	return result;
}

// 다발고장 설정팝업
function bunchFailureSettingPopup() { 
	var url = '/failure/setting/bunchFailureSetting';
	window.open(
			''
			, '_bunchFailureSetting'
			, 'scrollbars=yes,resizable=yes,toolbar=yes,status=1,width=560,height=580,top=20,left=20'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_bunchFailureSetting';
	document.menuForm.submit();
} 

// 미복구알람 설정팝업
function unrecoveredAlarmSettingPopup(){
	var url = '/failure/setting/unrecoveredAlarmSetting';
	window.open(
			''
			, '_unrecoveredAlarmSetting'
			, 'scrollbars=yes,resizable=yes,toolbar=yes,status=1,width=630,height=320,top=20,left=20'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_unrecoveredAlarmSetting';
	document.menuForm.submit();
}

// 고장 가청 설정팝업
function audioSettingPopup(){
	var url = '/failure/setting/audioSetting';
	window.open(
			''
			, '_audioSetting'
			, 'scrollbars=yes,resizable=yes,toolbar=yes,status=1,width=635,height=430,top=20,left=20'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_audioSetting';
	document.menuForm.submit();
}

// 조치사례관리
function failureActionCaseSettingPopup(){
	var url = '/failure/setting/failureActionCaseSetting';
	window.open(
			''
			, '_failureActionCaseSetting'
			, 'scrollbars=0,resizable=no,toolbar=yes,status=1,width=1200,height=600,top=10,left=10'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_failureActionCaseSetting';
	document.menuForm.submit();
}

function thresholdWindowPop(){
	var url = '/pm/pm_setting/threshold_setting';
	window.open(
			''
			, '_threshold_setting'
			, 'scrollbars=yes,resizable=yes,toolbar=yes,status=1,width=1300,height=700,top=20,left=20'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_threshold_setting';
	document.menuForm.submit();
}

//성능 가청 설정
function perfromAudioSettingPopup(){
	var url = '/pm/setting/perFormSettingAudio';
	window.open(
			''
			, '_performAudioSetting'
			, 'scrollbars=yes,resizable=yes,toolbar=yes,status=1,width=630,height=350,top=20,left=20'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_performAudioSetting';
	document.menuForm.submit();
}

function permitIpWindowPop() { 
	var url = '/security/permit/Ip';
	window.open(
			''
			, '_permit_Ip'
			, 'scrollbars=yes,resizable=yes,toolbar=yes,status=1,width=700,height=610,top=20,left=20'
			);
	document.menuForm.action = url;
	document.menuForm.target = '_permit_Ip';
	document.menuForm.submit();
} 


//성능감시 Epc 관련 팝업 Select Box Setting
//HSS, PCRF구븐을 위한 kpiText 추가 2022.03.30
function setKpiSelect(kpiType,id,div,pageType, kpiText){
	$('#'+id).empty();
	
	var _all = '';
	if(id != 'kpiSelect' && pageType != 4 && pageType != 6) _all = '<option value="0">전체</option>';
	
	if(kpiType == 1){
//		$('#'+id).append(
//			_all+
//			'<option value="1">Attach</option>'+
//			'<option value="2">SGs</option>'+
//			'<option value="3">SR</option>'
//		);
		$('#'+id).append(
				_all+
				'<option value="1">Attach</option>'+
				'<option value="2">SRMO</option>' +
				'<option value="3">SRMT</option>'
			);
	}else if(kpiType == 4){
		$('#'+id).append(
			_all+
			'<option value="1">Create</option>'+
			'<option value="2">Delete</option>'+
			'<option value="3">Modify</option>'
		);
	}else if(kpiType == 5){
		$('#'+id).append(
			_all+
			'<option value="1">Attach</option>'+
			'<option value="2">Delete</option>'+
			'<option value="3">Modify</option>'
		);
		//kpiText로 HSS PCRF 구분
	}else if(kpiType == 6){
		if(kpiText=='HSS')
		$('#'+id).append(
			_all+
			'<option value="1">S6A</option>'+
			'<option value="2">CX</option>'
		);
		else if(kpiText=='PCRF'){
			$('#'+id).append(
			_all+
			'<option value="3">GX</option>'+ 
			'<option value="4">RX</option>'
		);
		}
	}/*else if(kpiType == 7){
		$('#'+id).append(
			_all+
			'<option value="1">GX</option>'+ 
			'<option value="2">RX</option>'
		);
	}*/else if(kpiType == 10){
		$('#'+id).append(
			_all+
			'<option value="8">CALL</option>'+
			'<option value="9">PTT</option>'
		);
	}
	
	if(kpiType == 99 && pageType == 1) {
		$('#'+id).append(
			'<option value="INTRA_ENB_HANDOVER">INTRA_ENB_HANDOVER</option>'+
			'<option value="X2 IN HANDOVER">X2 IN HANDOVER</option>'+
			'<option value="X2 OUT HANDOVER">X2 OUT HANDOVER</option>'
		);
	} else if (kpiType == 98 && pageType == 1) {
		$('#'+id).append(
			'<option value=1>UP</option>'+
			'<option value=2>DOWN</option>'
		);
	}
}

function setDate() {
	var d = new Date();
	var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
	var date = (d.getDate()) < 10 ? '0' + (d.getDate()) : d.getDate();
	var hours = (d.getHours()) < 10 ? '0' + (d.getHours()) : d.getHours();
	var minute = (d.getMinutes()) < 10 ? '0' + (d.getMinutes()) : d.getMinutes();
	var second = (d.getSeconds()) < 10 ? '0' + (d.getSeconds()) : d.getSeconds();

	var fullDate = d.getFullYear() + '/' + month + '/' + date + ' ' + hours + ':' + minute + ':' + second;

	return fullDate;
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



Number.prototype.format = function(){
    if(this==0) return 0;
 
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
 
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
 
    return n;
};
 
// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
String.prototype.format = function(){
    var num = parseFloat(this);
    if( isNaN(num) ) return "0";
 
    return num.format();
};

//Array.prototype.contains = function(obj) {
//    var i = this.length;
//    while (i--) {
//        if (this[i] === obj) {
//            return true;
//        }
//    }
//    return false;
//}

columnSorting = {
	sortInfo : [],
	beforeColNms : [],
	dataSort : function(obj, ctrlKey, tableId) {
		var sortOption = {};
		var key = $(obj).find('input').val() || obj.id;
		if (ctrlKey) {
			var index = 9999;
			sortOption = {};
			if ((jQuery.inArray(key,columnSorting.beforeColNms) != -1))
				index = columnSorting.beforeColNms.indexOf(key);

			if ($(obj).hasClass('updown')) {
				$(obj).removeClass('updown');
				$(obj).addClass('up');

				if (index == 9999) {
					sortOption['colName'] = key;
					sortOption['order'] = 'ASC';
				} else {
					sortOption = columnSorting.sortInfo[index];
					sortOption['order'] = 'ASC';
				}

			} else if ($(obj).hasClass('up')) {
				$(obj).removeClass('up');
				$(obj).addClass('down');

				if (index == 9999) {
					sortOption['colName'] = key;
					sortOption['order'] = 'DESC';
				} else {
					sortOption = columnSorting.sortInfo[index];
					sortOption['order'] = 'DESC';
				}

			} else {
				$(obj).removeClass('down');
				$(obj).addClass('up');

				if (index == 9999) {
					sortOption['colName'] = key;
					sortOption['order'] = 'ASC';
				} else {
					sortOption = columnSorting.sortInfo[index];
					sortOption['order'] = 'ASC';
				}

			}

			if (index == 9999)
				columnSorting.sortInfo.push(sortOption);

		} else {
			columnSorting.sortInfo = [];
			columnSorting.beforeColNms = [];

			var classNm = '';
			sortOption = {};

			if ($(obj).hasClass('updown')) {
				$(obj).removeClass('updown');

				classNm = 'up';
				sortOption['colName'] = key;
				sortOption['order'] = 'ASC';

			} else if ($(obj).hasClass('up')) {
				$(obj).removeClass('up');

				classNm = 'down';
				sortOption['colName'] = key;
				sortOption['order'] = 'DESC';

			} else if ($(obj).hasClass('down')) {
				$(obj).removeClass('down');

				classNm = 'up';
				sortOption['colName'] = key;
				sortOption['order'] = 'ASC';

			}

			$(tableId).find('.sort').removeClass('updown');
			$(tableId).find('.sort').removeClass('up');
			$(tableId).find('.sort').removeClass('down');
			$(tableId).find('.sort').addClass('updown');

			$(obj).removeClass('updown');
			$(obj).addClass(classNm);

			columnSorting.sortInfo.push(sortOption);
		}

		if ((jQuery.inArray(key,columnSorting.beforeColNms) == -1))
			columnSorting.beforeColNms.push(key);
	}
};

function tableToJson(headerTableId, bodyTableId){
	var tblhdr = $('table#'+headerTableId+' th').map(function () {
	    return $(this).text();
	}).get();

	var tbl = $('table#'+bodyTableId+' tbody tr').map(function(idx, el) {
	    var td = $(el).find('td');
	    var obj = {id: idx+1};

	    //Can work on number of columns
	    for (var i = 0; i < tblhdr.length; i++) {
	        obj[tblhdr[i]] = td.eq(i).text();
	    }

	    return obj;
	}).get();
	
	return tbl;
}

function sortComparator(a, b, compKey, compOption) {
	// Compare the values of the first attribute
	if (a[compKey[0]] === b[compKey[0]]) {
		// if EQ proceed with the next attributes
		if (compKey.length > 1) {
			return sortComparator(a, b, compKey.slice(1), compOption.slice(1));
		} else {
			// if no more attributes then return EQ
			return 0;
		}
	} else {
		// return less or great
		if(isNaN(a[compKey[0]])){
			if(compOption[0] == 'ASC') return (a[compKey[0]] > b[compKey[0]]) ? 1 : ((a[compKey[0]] < b[compKey[0]]) ? -1 : 0);
			else return (b[compKey[0]] > a[compKey[0]]) ? 1 : ((b[compKey[0]] < a[compKey[0]]) ? -1 : 0);
		}else{
			if(compOption[0] == 'ASC') return (Number(a[compKey[0]]) > Number(b[compKey[0]])) ? 1 : ((Number(a[compKey[0]]) < Number(b[compKey[0]])) ? -1 : 0);
			else return (Number(b[compKey[0]]) > Number(a[compKey[0]])) ? 1 : ((Number(b[compKey[0]]) < Number(a[compKey[0]])) ? -1 : 0);
		}
	}
}

// For todays date
Date.prototype.today = function() {
	return this.getFullYear() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "")
			+ (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "")
			+ this.getDate();
};

// For the time now
Date.prototype.timeNow = function() {
	return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":"
			+ ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":"
			+ ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
};

function encodeHTML(s) {
    return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;').split("'").join('&#39;');
}


function getClineName(value){
	var LINE_NAME =  '';
	if(value != undefined){
		if(value.includes(',')){
			lineList = value.split(',');
			lineNameList = []
			$.each(lineList, function(i, line) {
				if(line in cLineInfoDict){
					lineNameList.push(cLineInfoDict[line]);
				}else{
					lineNameList.push(line);
				}
			})
			LINE_NAME = lineNameList.splice(',');
		}else{
			if(value in cLineInfoDict){
				LINE_NAME = cLineInfoDict[value];
			}else{
				LINE_NAME = value;
			}
		}
	}
	return LINE_NAME;
}


function setLineSelectBox(){
	lineOptions = [];
	lineOptions.push('<option value="">전체</option>');
	$.each(cLineInfoList, function (i,row){
		// 관제센터제외
//		if(row.LINE_ID != '0'){
//			lineOptions.push('<option value=' + row['LINE_ID'] + '>' + row['LINE_NAME'] + '</option>');
//		}
		lineOptions.push('<option value=' + row['LINE_ID'] + '>' + row['LINE_NAME'] + '</option>');
	});
	$("#selectedLine").html(lineOptions.join(''));
	$("#selectedLinePop").html(lineOptions.join(''));
}

function getLineName(value){
	var LINE_NAME =  '';
	if(value != undefined){
		if(value.includes(',')){
			lineList = value.split(',');
			lineNameList = []
			$.each(lineList, function(i, line) {
				if(line in lineInfoDict){
					lineNameList.push(lineInfoDict[line]);
				}else{
					lineNameList.push(line);
				}
			})
			LINE_NAME = lineNameList.splice(',');
		}else{
			if(value in lineInfoDict){
				LINE_NAME = lineInfoDict[value];
			}else{
				LINE_NAME = value;
			}
		}
	}
	return LINE_NAME;
}



function stationAjax(){
	
	lineAjax = $.ajax({
		cache : false,
		type : 'get',
		url : '/pss/code/station/getStationLine',
		dataType : 'json',
//		data: requestData,
		success	: function(data) {
			cLineInfoList = data
			// lineInfoDict값입력
			$.each(cLineInfoList ,function(idx, lineinfo){
				cLineInfoDict[lineinfo.LINE_ID] = lineinfo.LINE_NAME;
				srcIdx = idx
				for(var idx;idx<cLineInfoList.length;idx++) {
					if (cLineInfoList[idx+1] != undefined){
						var lines = cLineInfoList[srcIdx].LINE_ID +','+ cLineInfoList[idx+1].LINE_ID
						var lensNm = cLineInfoList[srcIdx].LINE_NAME +','+ cLineInfoList[idx+1].LINE_NAME
						cLineInfoDict[lines] = lensNm;
					}
				}
			})
		},
		error : function() {
			}
		});
}

//숫자만 입력 가능
function checkInputNum(){ 
	if ((event.keyCode < 48) || (event.keyCode > 57)){
		alert("숫자만 입력 가능합니다.");	
    	event.returnValue = false;
	}
}
