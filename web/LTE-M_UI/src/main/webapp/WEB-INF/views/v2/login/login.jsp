<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 

<c:import url="/WEB-INF/views/v2/common/headerV2.jsp" />

<%-- SHA-256 --%>
<script src="/resources/js/login/sha256.js"></script>

<div id="loginWrap">
    <div id="loginContainer">
        <h1 class="loginLogo">
        
	        <c:choose>
	            <c:when test="${'P168' == projectProfile}">
	                <span>스마트쉽<br>무선네트워크 통합관제시스템</span>
	            </c:when>
	            <c:when test="${'RV2' == projectProfile}">
                    <span>리펙토링<br>무선네트워크 통합관제시스템</span>
                </c:when>
	            <c:otherwise>
	                <span>스마트항공기지<br>무선네트워크 통합관제시스템</span>
	            </c:otherwise>
	        </c:choose>

        </h1><!-- 22-02-09 MOD : logo -->
        
        <div class="loginArea">
            <div class="loginBox">
                <h3>User Login</h3>
	                <fieldset>
	                    <legend>로그인입력폼</legend>
	                    <div class="loginInput mu-input-id">
	                        <input id ="loginUserId" name="loginUserId" type="text" title="ID" class="mu-input id" placeholder="ID"  minlength="2" type="text" required />
	                    </div>
	                    <div class="loginInput mu-input-pw">
	                        <input id ="userPassword" name="userPassword" type="password" title="Password" class="mu-input pw" placeholder="Password" />
	                    </div>
	                    <div class="joinGroup">
	                        <div class="mu-checkbox">
	                            <input type="checkbox" id="saveChk">
	                            <label for="saveChk">아이디 저장</label>
	                        </div>
	                        <div class="join" id="joinLtem"><a style="cursor: pointer">계정신청</a></div>
	                    </div>
	                    <button type="button" id="doLogin" class="btnLogin" >로그인</button>
	                </fieldset>
                    
            </div>
            
        </div>
    </div>
    <div id="loginFooter">
        <%--<address>Copyright (C) 2018 <span>서울교통공사.</span> All Rights Reserved.</address> --%>
    </div>
    
    <c:import url="/WEB-INF/views/v2/account/accountReg.jsp">
        <c:param name="pageDiv" value="login" />
    </c:import>
    
    <c:import url="/WEB-INF/views/v2/account/updatePassword.jsp">
        <c:param name="pageDiv" value="login" />
    </c:import>
    
</div>

<script type="text/javascript">
$(document).ready(function () {
	console.log('>>> project profile is [%s]', '${projectProfile}');
	bindEvent();  // event binding
	init();
});

function init() {
   // 아이디저장 설정
   if(!_.isEmpty(getCookie("userid"))) {
        $('#loginUserId').val(getCookie("userid"));
        $("#saveChk").attr("checked", true);
    } else {
        $('#loginUserId').val('');
        $("#saveChk").attr("checked", false);
    }
}

var initPageDiv = '';
var initDupleLogin = '';

function doLogin(e) {
	e.preventDefault();
	
	if (!$('#loginUserId').val()) {
		alert('ID를 입력하세요.');
		return;
	} 
	
	if (!$('#userPassword').val()) {
		alert('Password를 입력하세요.');
        return;
    }
	
    // 아이디저장
	if($("#saveChk").is(":checked")) {
	    setCookie("userid", $('#loginUserId').val(), 7);		
	} else {
		setCookie("userid", "", 0);
	}
	
	var seUser = {
		'userId' : $('#loginUserId').val()
		, 'userPassword' : sha256($('#userPassword').val())
		, 'accessDupleLogin' : initDupleLogin
	};

	$.ajax({
        type:'post',
        url:'/v2/login/doLogin',
        data : JSON.stringify(seUser),
        contentType: 'application/json',
        dataType : 'json',
        success : function(data) {
        	//console.log('>>> data : ' + JSON.stringify(data));
        	// 비밀번호 초기화
        	if ("init" == data.result) {   // 비밀번호 초기화
        		passwordPageDiv = data.result;
        		$("#initPasswordTitle").text('비밀번호 초기화');
        		$("#initPasswordMessage").text('비밀번호가 초기화 되었습니다. 재 설정 후 접속하세요.');
        		
                $("#updatePasswordBg").show();
                $("#updatePasswordUp").show();
        
                $("#updatePasswordUp").css({
                    "top": (($(window).height()-$("#updatePasswordUp").outerHeight())/2+$(window).scrollTop())+"px",
                    "left": (($(window).width()-$("#updatePasswordUp").outerWidth())/2+$(window).scrollLeft())+"px"
                });     
        		return;
        	} else if ('expire' == data.result) {  // 비밀번호 만료 (3개월)
                passwordPageDiv = data.result;
                $("#initPasswordTitle").text('비밀번호 만료');
                $("#initPasswordMessage").text('비밀번호가 만료 되었습니다. 재 설정 후 접속하세요.');
                
                $("#updatePasswordBg").show();
                $("#updatePasswordUp").show();
        
                $("#updatePasswordUp").css({
                    "top": (($(window).height()-$("#updatePasswordUp").outerHeight())/2+$(window).scrollTop())+"px",
                    "left": (($(window).width()-$("#updatePasswordUp").outerWidth())/2+$(window).scrollLeft())+"px"
                });     
                return;
        	} else if ('dupAccess' == data.result) {   // 중복 로그인
                $.alert.open('confirm', '기존 접속을 종료하고 다시 접속하시겠습니까?', function(button) {
                    if (button == 'yes') {
                    	initDupleLogin = 'Y';
                    	$('#doLogin').trigger("click");
                    } else {
                    	initDupleLogin = 'N';
                        console.log('no');
                    }
                });
                return;                
            } else if ('notAccess' == data.result) {    // 장기 미접속 (3개월)
                alert(data.resultMsg);
                return;                
        	} else if ("success" == data.result) {
        		
        		// 공지사항 오픈
        		//console.log('>>> notice : ' + data.notice);
        		if (data.notice) {
        			
        			var re = /\r\n/g;
        			var noticeMessage = data.notice.noticeDesc;
        			noticeMessage = noticeMessage.replace(/\r\n/ig, '<br/>');
        			noticeMessage = noticeMessage.replace(/\\n/ig, '<br/>');
        			noticeMessage = noticeMessage.replace(/\n/ig, '<br/>');
                    
        			$.alert.open({
        				type : 'warning',
        				title : data.notice.noticeTitle,
        			    content: noticeMessage,
        			    width: 500,
        			    maxHeight: 400,
        			    buttons: {
        			        A: '확인'/* ,
        			        B: 'B',
        			        C: 'C' */
        			    },
        			    callback: function(button) {
        			        if (!button) {
        			        	goMain();
        			        } else {
        			        	goMain();
        			        }
        			    }
        			});
        			
        		} else {
        			goMain();
        		}

        	} else {
        	    alert(data.resultMsg);
        	    $('#userPassword').val("");
        	    return;
        	}
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
};
    
function goMain() {
    setCookie("loginMessage", "Y", 1);
    document.location.href = "/LTE-M";	
}    

function bindEvent() {
	// 아이디
    $('#loginUserId').keypress(function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
        	return false;
        }
    });
    
    // 비밀번호
    $('#userPassword').keypress(function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
        	return false;
        }
    });
    
    // 로그인버튼
    $('#doLogin').click(function(e){
    	doLogin(e);
    	return;
    });    
    
    // 아이디 저장
    $("#saveChk").on("click", function(e){
        if($(this).is(":checked")) {
        	$.alert.open('confirm', '이 PC에 로그인 정보를 저장하시겠습니까?<br/>PC방등의 공공장소에서는 개인정보가 유출될 수 있으니 주의해주십시오.', function(button) {
        	    if (button == 'yes') {
        	    } else if (button == 'no') {
        	    	$("#saveChk").attr("checked", false);
        	    } else {
        	    	$("#saveChk").attr("checked", false);
        	    }
        	});
        }
    });    
    
    // 계정신청
    $("#joinLtem").on("click", function(e){
    	$("#accountRegisterBg").show();
    	$("#accountRegisterUp").show();

    	$("#accountRegisterUp").css({
	    	"top": (($(window).height()-$("#accountRegisterUp").outerHeight())/2+$(window).scrollTop())+"px",
	    	"left": (($(window).width()-$("#accountRegisterUp").outerWidth())/2+$(window).scrollLeft())+"px"
    	}); 
    });
    
}
</script>

<c:import url="/WEB-INF/views/v2/common/footerV2.jsp" />

