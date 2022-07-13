<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<script>
	var menuList = ${sessionScope.menu_list};
	var userAuth = ${sessionScope.user_auth};
	
	$(document).ready(function () {
	    $("#updateUserPassword").on("click", function(e){
	    	passwordPageDiv = "update";
	    	$("#initPasswordTitle").text('비밀번호 변경');
            $("#initPasswordMessage").text('비밀번호를 변경하세요.');
            
	        $("#updatePasswordBg").show();
	        $("#updatePasswordUp").show();
	
	        $("#updatePasswordUp").css({
	            "top": (($(window).height()-$("#updatePasswordUp").outerHeight())/2+$(window).scrollTop())+"px",
	            "left": (($(window).width()-$("#updatePasswordUp").outerWidth())/2+$(window).scrollLeft())+"px"
	        }); 
	    });	
	    
	    // 최종 로그인 메세지 노출 (로그인 후 최초 1회 오픈)
 	    if (document.location.href.indexOf('LTE-M') < 0) {
	    	
	        if(!_.isEmpty(getCookie("loginMessage")) && 'Y' == getCookie("loginMessage")) {
	        	
	        	setCookie("loginMessage", "", 0); 

	            $.ajax({
	                type:'post',
	                url:'/v2/getLastLoginInfo',
	                contentType: 'application/json',
	                dataType : 'json',
	                success : function(data) {
	                    //console.log('>>> data : ' + JSON.stringify(data));
	                    var loginMsg = "최근 로그인 접속 정보<br />"
		                     //+ "<br />아이디 : " + data.resultMsg.userId
		                     + "<br />일자 : " + moment(new Date(data.resultMsg.eventTime)).format('YYYY년 MM월 DD일  HH:mm')
		                     + "<br />IP : " + data.resultMsg.ip;
	                    
	                    $.iaoAlert({msg: loginMsg,
	                        type: "notification",
	                        position: 'top-right',
	                        alertTime: '5000',
	                        mode: "light",})
	                },
	                error : function(request,status,error){
	                    console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	                }
	            });
 	        }	    	
	    } 
	    
	    
        //일정시간 움직임이 있으면 초기화
        $(this).mousemove(function (e) { idleTime = 0; }); 
        $(this).keypress(function (e) { idleTime = 0; }); 
	    
	});

    // 자동 로그아웃 처리
	var idleTime = 0;
    var idleInterval = setInterval(autoLogout, 1000 * 60); // 1 minute
	function autoLogout() {
		idleTime++;
		
        //console.log('>>> idleTime : ' + idleTime);
        
		// 30분 미 사용 시
		if (idleTime > 29) {
			clearInterval(idleInterval)
            $.alert.open('일정시간 미 사용으로<br/>자동 로그아웃 되었습니다.', {A: '확인'}, function(button) {
                
                if (!button) {
                	location.href ='/logout';
                } else {
                	location.href ='/logout';
                }
            });
		}
	}
</script>

<script type="text/javascript" src="/resources/lib/lodash.min.js"></script>
<!-- for modal dialog -->
<script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/map.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/paging.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/selectbox.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/grid.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/dialog.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/grid_extend.js"></script>
    
    
<script src="/resources/js/menu/menu.js"></script>
    
<!-- GNB -->
<header>
	<div class="headWrap">
		<h1>
        <c:choose>
            <c:when test="${'P168' == projectProfile}">
                <span>무선네트워크 통합관제시스템</span>
            </c:when>
            <c:otherwise>
                <span>무선네트워크 통합관제시스템</span>
            </c:otherwise>
        </c:choose>		
		</h1><!-- 22-02-09 MOD : logo -->
		<nav class="mu-gnb">
			<ul class="mu-hMenu fl"></ul>
			<div class="mu-topMenu fr">
				<div class="userInfo">
					<i class="iconUser mu-icon user"></i>
					<b class="userName" style="cursor: pointer;" id="updateUserPassword"><c:out value="${user_id}" /></b>
					<button class="btnSetting mu-btn mu-btn-icon mu-btn-bg-non"></button>
				</div>
				<button type="button" onclick="javascript:location.href = '/logout'" class="btnLogout mu-btn mu-btn-icon mu-btn-bg-non" ><i class="mu-icon logout"></i></button>
			</div>
		</nav>
	
		<form name="menuForm" action="" method="post">
			<input type="hidden" name="menu-path" id="menu-path" value=""/>
			<input type="hidden" name="menu-title" id="menu-title" value=""/>
			<input type="hidden" name="page-title" id="page-title" value=""/>
			<input type="hidden" name="menu-id" id="menu-id" value=""/>
		</form>
	</div>
	
<%--     
    <c:import url="/WEB-INF/views/v2/account/updatePassword.jsp">
        <c:param name="pageDiv" value="account" />
    </c:import> 
--%>
	
</header>
<!--// GNB -->

<div id="ajax_indicator" style="display: none">
	<i class="fa fa-spinner fa-5x fa-pulse" style="text-align: center;  left: 48%; top: 40%; position: absolute; z-index: 9999"></i>
</div>





<%-- 
    WEB-INF/views/v2/account/updatePassword.jsp 상의 headerV2.jsp의 jquery와 highchart가 충돌이 발생한다.
    hichart가 jquery3 버전 지원 안되는 듯
    그런 관계로 update.jsp를 import하지 않고 해당 소스 내용을 menu.jsp 에 삽입한다.
--%>
<%-- SHA-256 --%>
<script src="/resources/js/login/sha256.js"></script>

<div id="updatePasswordBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="updatePasswordUp" class="mu-dialog accountRegist" style="width:460px;display: none;z-index: 11"><!-- resize 부분 -->
    <div class="mu-dialog-head dragHandle">
        <h2><span class="title" id="initPasswordTitle">비밀번호 변경</span></h2>
        <button type="button" class="mu-btn mu-btn-icon" id="passwordUpdateClose"><i class="mu-icon-img cancel"></i></button>
    </div>

    <%--<form id="accountRegForm" name="accountRegForm">--%>
        <div class="mu-dialog-body">
        <h3 class="mu-title" style="margin-top:0px;" id="initPasswordMessage">비밀번호 변경</h3>
            <fieldset>
                <table class="mu-formbox">
                    <colgroup>
                        <col width="160px"></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>변경 비밀번호</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="password" value="" id="updateUserPwd" name="updateUserPwd" class="mu-input" maxlength="16"/>
                                </div>
                                <div class="messages" id="updatePwd1Msg" style="display:none"></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>변경 비밀번호 확인</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="password" value="" id="updateUserPwdConfirm" name="updateUserPwdConfirm" class="mu-input" maxlength="16"/>
                                </div>
                                <div class="messages" id="updatePwd2Msg" style="display:none"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>

        <div class="mu-dialog-foot" style="text-align: center;">
            <button id="passwordUpdate" type="button" class="mu-btn">수정</button>
            <button id="passwordUpdateCancel" type="button" class="mu-btn">취소</button>
        </div>
    <%--</form>--%>
</div>

<script type="text/javascript">
var passwordPageDiv = '';
console.log('>>> passwordPageDiv : ' + passwordPageDiv);

$(document).ready(function () {
    $('#passwordUpdateClose, #passwordUpdateCancel').on("click",function(e) {
        $("#updatePasswordBg").hide();
        $("#updatePasswordUp").hide();
    }); 
    $('#updatePasswordUp').draggable({'handle' : '.dragHandle'});
       
    $('#passwordUpdate').click(function(e) {
        updateUserPassword();
    });
    
});

function formToJson (selector) {
      var ary = $(selector).serializeArray();
      var obj = {};
      for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
      return obj;
    }
    
var regPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{9,}$/;
function updateUserPassword() {
    
    if(_.isEmpty($('#updateUserPwd').val())) {
        $('#updatePwd1Msg').css('color', 'red');
        $('#updatePwd1Msg').show();
        $('#updatePwd1Msg').text('필수 정보입니다.');
        return;
    } else {
        if (!regPassword.test($('#updateUserPwd').val())) {
            $('#updatePwd1Msg').css('color', 'red');
            $('#updatePwd1Msg').show();
            $('#updatePwd1Msg').text('9자 이상, 문자/숫자/특수문자를 포함하여 등록하세요.');
            return;         
        }
        $('#updatePwd1Msg').hide();
    }
    
    if(_.isEmpty($('#updateUserPwdConfirm').val())) {
        $('#updatePwd2Msg').css('color', 'red');
        $('#updatePwd2Msg').show();
        $('#updatePwd2Msg').text('필수 정보입니다.');
        return;
    } else {
        if ($('#updateUserPwdConfirm').val() != $('#updateUserPwd').val()) {
            $('#updatePwd2Msg').css('color', 'red');
            $('#updatePwd2Msg').show();
            $('#updatePwd2Msg').text('비밀번호가 일치하지 않습니다.');
            return;         
        }
        $('#updatePwd2Msg').hide();
    }
    
    <%--
        passwordPageDiv
            update : 비밀번호 변경
            init : 비밀번호 초기화 > 비밀번호 변경
            expire : 비밀번호 만기 > 비밀번호 변경
    --%>
    console.log('>>> passwordPageDiv : ' + passwordPageDiv);
    var seUser = {
            'userPassword' : sha256($('#updateUserPwd').val())
            , 'userPasswordConfirm' : sha256($('#updateUserPwdConfirm').val())
            , 'passwordPageDiv' : passwordPageDiv
        };
    
    $.ajax({
        type:'post',
        url: "/v2/login/updateUserPassword",
        data : JSON.stringify(seUser),
        contentType: 'application/json',
        dataType : 'json',
        success : function(data) {
            if ("success" == data.result) {
                alert(data.resultMsg);
                $("#updatePasswordBg").hide();
                $("#updatePasswordUp").hide();
            } else {
                alert(data.resultMsg);
            }
            $('#updateUserPwd').val("");
            $('#updateUserPwdConfirm').val("");
            return;
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}
</script>
