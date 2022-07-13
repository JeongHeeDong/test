<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 

<c:import url="/WEB-INF/views/v2/common/headerV2.jsp" />

<div id="accountRegisterBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="accountRegisterUp" class="mu-dialog accountRegist" style="width:460px;display: none;z-index: 11"><!-- resize 부분 -->
    <div class="mu-dialog-head dragHandle">
        <h2><span class="title">계정 신청</span></h2>
        <button type="button" class="mu-btn mu-btn-icon" id="accountRegisterClose"><i class="mu-icon-img cancel"></i></button>
    </div>

    <%--<form id="accountRegForm" name="accountRegForm">--%>
        <div class="mu-dialog-body">
            <fieldset>
                <table class="mu-formbox">
                    <colgroup>
                        <col width="140px"></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>ID</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" value="" id="userId" name="userId" class="mu-input" maxlength="20"/>
                                    <button id="idDuplicationCheck" type="button" class="mu-btn">중복확인</button>
                                </div>
                                <div class="messages" id="idDupMsg" style="display:none"></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>이름</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" value="" id="userName" name="userName" class="mu-input"/>
                                </div>
                                <div class="messages" id="nameMsg" style="display:none"></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>비밀번호</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="password" value="" id="userPwd" name="userPwd" class="mu-input" maxlength="16"/>
                                </div>
                                <div class="messages" id="pwd1Msg" style="display:none"></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>비밀번호 확인</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="password" value="" id="userPwdConfirm" name="userPwdConfirm" class="mu-input" maxlength="16"/>
                                </div>
                                <div class="messages" id="pwd2Msg" style="display:none"></div>
                            </td>
                        </tr>
                        <%--<tr>
                            <th>
                                <label>핸드폰번호</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" value="" id="userMobile" name="userMobile" class="mu-input" maxlength="16"/>
                                </div>
                            </td>
                        </tr> --%>
                        <tr>
                            <th>
                                <label>단말번호</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" value="" id="userPhone" name="userPhone" class="mu-input" maxlength="16"/>
                                </div>
                            </td>
                        </tr>
                        <%--<tr>
                            <th>
                                <label>E-Mail</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" value="" id="userEmail" name="userEmail" class="mu-input" maxlength="40"/>
                                </div>
                                <div class="messages" id="emailMsg" style="display:none"></div>
                            </td>
                        </tr> --%>

<%-- from login.jsp --%>                        
<c:choose>
    <c:when test="${'login' eq param.pageDiv}">
                        <input type="hidden" id="userAuth" name="userAuth" value="3" />
                        <input type="hidden" id="userFlag" name="userFlag" value="99" />
    </c:when>
    <c:otherwise>
                        <tr class="js-account-mgmt">
                            <th>
                                <label>사용자등급</label>
                            </th>
                            <td>
                                <div class="mu-selectbox">
                                    <select name="userAuth" id="userAuth" name="userAuth" class="mu-value userRoll">
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr class="js-account-mgmt">
                            <th></th>
                            <td>
                                <div class="mu-item-group">
                                    <div class="mu-radio">
                                        <input type="radio" name="userFlag" id="userReject" value="99" checked="checked">
                                        <label for="userReject">승인대기</label>
                                    </div>
                                    <div class="mu-radio">
                                        <input type="radio" name="userFlag" id="userConfirm" value="1">
                                        <label for="userConfirm">승인</label>
                                    </div>
                                </div>
                            </td>
                        </tr>
    </c:otherwise>
</c:choose>

                    </tbody>
                </table>
            </fieldset>
        </div>

        <div class="mu-dialog-foot" style="text-align: center;">
            <button id="accountRegister" type="button" class="mu-btn">등록</button>
            <button id="accountRegisterCancel" type="button" class="mu-btn">취소</button>
        </div>
    <%--</form>--%>
</div>

<script type="text/javascript">
$(document).ready(function () {
	
	// 사용자 등급
	initUserAuth();
	
	$('#accountRegisterClose, #accountRegisterCancel').on("click",function(e) {
        $("#accountRegisterBg").hide();
        $("#accountRegisterUp").hide();
    }); 
	$('#accountRegisterUp').draggable({'handle' : '.dragHandle'});
	
    $('#userId').change(function(e) {
    	idDupCheckFlag = false;
    	$('#idDupMsg').css('color', 'red');
        $('#idDupMsg').show();
        $('#idDupMsg').text('아이디 중복체크를 하여야합니다.');
    });
    
    //ID 중복 확인
    $('#idDuplicationCheck').click(function(e) {
    	idDupCheck();
    });

    //등록 Form 확인
    /* $('.mu-input').blur(function(e) {
        var $this = $(this);
        var id = $this.attr('id');
        var value = $this.val();
    }); */
    
    //계정 등록
    $('#accountRegister').click(function(e) {
    	accountReg();
    });
    
    
});

// ID중복체크
var idDupCheckFlag = false;
function idDupCheck() {

	idDupCheckFlag = false;
	if(_.isEmpty($('#userId').val())) {
        alert('ID를 입력하세요.');
        $('#idDupMsg').hide();
        $('#userId').focus();
        return;
    }
    
    $.ajax({
        type : "post",
        url: "/security/account/accountMgmt/duplicationCheck",
        contentType: "application/json",
        dataType:"json",
        data: JSON.stringify({userId : $("#userId").val()}),
        success: function (data) {

        	var dupMsgColor = 'red';
            var dupMsg = '';
            
            switch(data.duplicationResult) {
	            case 0:
	            	dupMsg = '사용 가능한 아이디입니다.';
	            	dupMsgColor = 'green';
	            	idDupCheckFlag = true;
	            	break;
	            case 1:
	            	dupMsg = '사용 불가능한 아이디입니다.';
	            	break;
	            case 2:
	            	dupMsg = '필수 정보입니다.';
	            	break
	            case 3:
	            	dupMsg = '아이디는 3 ~ 20자 이내에서 영문 소문자와 숫자만 사용해야 합니다.';
	            	break;
	            case 4:
	            	dupMsg = '아이디는 영문 소문자로 시작하여야 합니다.';
	                break;
	            default:
	            	dupMsg = data.duplicationResult;
	               	break;
            }
            
            $('#idDupMsg').css('color', dupMsgColor);
            $('#idDupMsg').show();
            $('#idDupMsg').text(dupMsg);
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

function formToJson (selector) {
	  var ary = $(selector).serializeArray();
	  var obj = {};
	  for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
	  return obj;
	}
	
var regPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{9,}$/;
var regPassword2 = /(\w)\1\1/;    // 연속문자 (3자 이상)

var regEmail = /^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}/;
function accountReg() {
	
    if (!idDupCheckFlag) {
        $('#idDupMsg').css('color', 'red');
        $('#idDupMsg').show();
        $('#idDupMsg').text('아이디 중복체크를 하여야합니다.');
        return;
    }

    if(_.isEmpty($('#userName').val())) {
    	$('#nameMsg').css('color', 'red');
        $('#nameMsg').show();
        $('#nameMsg').text('필수 정보입니다.');
        return;
    } else {
    	$('#nameMsg').hide();
    }
    
    if(_.isEmpty($('#userPwd').val())) {
        $('#pwd1Msg').css('color', 'red');
        $('#pwd1Msg').show();
        $('#pwd1Msg').text('필수 정보입니다.');
        return;
    } else {
    	if (!regPassword.test($('#userPwd').val())) {
            $('#pwd1Msg').css('color', 'red');
            $('#pwd1Msg').show();
            $('#pwd1Msg').text('9자 이상, 문자/숫자/특수문자를 포함하여 등록하세요.');
            return;    		
    	}
    	
    	if (regPassword2.test($('#userPwd').val())) {
            $('#pwd1Msg').css('color', 'red');
            $('#pwd1Msg').show();
            $('#pwd1Msg').text('동일 문자를 사용할 수 없습니다.');
            return;         
        }
    	
    	if (!checkPwdChar($('#userPwd').val())) {
            $('#pwd1Msg').css('color', 'red');
            $('#pwd1Msg').show();
            $('#pwd1Msg').text('연속 문자를 사용할 수 없습니다.');
            return;             		
    	}
    	
    	if ($('#userPwd').val() == $('#userId').val()) {
    		$('#pwd1Msg').css('color', 'red');
            $('#pwd1Msg').show();
            $('#pwd1Msg').text('ID와 동일한 비밀번호는 사용할 수 없습니다.');
            return;         
    	}
        $('#pwd1Msg').hide();
    }
    
    
    if(_.isEmpty($('#userPwdConfirm').val())) {
        $('#pwd2Msg').css('color', 'red');
        $('#pwd2Msg').show();
        $('#pwd2Msg').text('필수 정보입니다.');
        return;
    } else {
    	if ($('#userPwdConfirm').val() != $('#userPwd').val()) {
            $('#pwd2Msg').css('color', 'red');
            $('#pwd2Msg').show();
            $('#pwd2Msg').text('비밀번호가 일치하지 않습니다.');
            return;         
        }
        $('#pwd2Msg').hide();
    }
    
    if(!_.isEmpty($('#userEmail').val())) {
        if (!regEmail.test($('#userEmail').val())) {
            $('#emailMsg').css('color', 'red');
            $('#emailMsg').show();
            $('#emailMsg').text('이메일 양식에 맞지 않습니다.');
            return;         
        }
    }
    $('#emailMsg').hide();
 
    var seUser = {
            'userId' : $('#userId').val()
            , 'userName' : $('#userName').val()
            , 'userPwd' : sha256($('#userPwd').val())
            , 'userPwdConfirm' : sha256($('#userPwdConfirm').val())
            , 'userPhone' : $('#userPhone').val()
            , 'usePeriod' : '0'
            , 'userFlag' : '99'
            , 'userAuth' : '3'
        };
    
    <%--
    //var params = $('#accountRegForm').serialize();
    //var params = formToJson($('#accountRegForm'));
    --%>
    
    $.ajax({
        type : "post",
        url: "/security/account/accountMgmt/register",
        contentType: "application/json",
        data: JSON.stringify(seUser),
        dataType:"json",
        success: function (data) {
        	if ("SUCCESS" == data.registerResult.resultCode) {
                if ("${'login' eq param.pageDiv}") {
                } else {
                }
                alert('신청되었습니다.');
        	} else {
        		alert('신청 중 오류가 발생하였습니다.');
        	}
        	
            $('#userId').val('');
            $('#userName').val('');
            $('#userPwd').val('');
            $('#userPwdConfirm').val('');
            $('#userPhone').val('');
            $('#idDupMsg').hide();
            
            <%--$('#accountRegForm')[0].reset();--%>
            $("#accountRegisterBg").hide();
            $("#accountRegisterUp").hide();
            idDupCheckFlag = false;
        	return;        	
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

//사용자 등급
function initUserAuth() {
	$.ajax({
        type : "post",
        url: "/user/roll",
        contentType: "application/json",
        dataType:"json",
        success: function (data) {
            var selectOption = '';
            $(data.userRoll).each(function (idx, value) {
            	$('#userAuth').append($('<option>', {
            		value: value.ROLL_ID,
            		text : value.ROLL_NAME
           		}));            			
            });
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

// 연속 문자 체크
function checkPwdChar(passwordString) {
	var ascSeqCharCnt = 0; // 오름차순 연속 문자 카운트
	var descSeqCharCnt = 0; // 내림차순 연속 문자 카운트

	var char_0;
	var char_1;
	var char_2;

	var diff_0_1;
	var diff_1_2;

	for(var i = 0; i < passwordString.length; i++){
	    // charAt(): 문자값 반환
	    char_0 = passwordString.charAt(i);
	    char_1 = passwordString.charAt(i+1);
	    char_2 = passwordString.charAt(i+2);
	    
	    // charCodeAt(): 유니코드값 반환
	    diff_0_1 = char_0.charCodeAt(0) - char_1.charCodeAt(0);
	    diff_1_2 = char_1.charCodeAt(0) - char_2.charCodeAt(0);
	    
	    if(diff_0_1 === 1 && diff_1_2 === 1){
	        ascSeqCharCnt += 1;
	    }
	    
	    if(diff_0_1 === -1 && diff_1_2 === -1){
	        descSeqCharCnt += 1;
	    }
	}
	console.log('>>> descSeqCharCnt : ' + descSeqCharCnt);
	console.log('>>> ascSeqCharCnt : ' + ascSeqCharCnt);
	if (descSeqCharCnt > 0 || ascSeqCharCnt > 0) {
	    return false;
	} else {
		return true;
	}
}

</script>

<c:import url="/WEB-INF/views/v2/common/footerV2.jsp" />

