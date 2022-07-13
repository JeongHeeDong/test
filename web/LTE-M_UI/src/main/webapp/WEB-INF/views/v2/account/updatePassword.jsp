<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 

<c:import url="/WEB-INF/views/v2/common/headerV2.jsp" />

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

<c:import url="/WEB-INF/views/v2/common/footerV2.jsp" />

