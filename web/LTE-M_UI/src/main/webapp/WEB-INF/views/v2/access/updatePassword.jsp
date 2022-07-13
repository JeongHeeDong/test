<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 

<c:import url="/WEB-INF/views/v2/common/headerV2.jsp" />

<%-- SHA-256 --%>
<script src="/resources/js/login/aes.js"></script>
<script src="/resources/js/login/sha256.js"></script>

<div id="equipPasswordBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="equipPasswordUp" class="mu-dialog accountRegist" style="width:460px;display: none;z-index: 11"><!-- resize 부분 -->
    <div class="mu-dialog-head dragHandle">
        <h2><span class="title" id="equipPasswordTitle">비밀번호 변경</span></h2>
        <button type="button" class="mu-btn mu-btn-icon" id="equipPasswordUpdateClose"><i class="mu-icon-img cancel"></i></button>
    </div>

        <div class="mu-dialog-body">
        <h3 class="mu-title" style="margin-top:0px;" id="equipPasswordMessage"></h3>
            <fieldset>
                <table class="mu-formbox">
                    <colgroup>
                        <col width="160px"></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>아이디</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <span id="equipUpdateLoginIdText"/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>변경 비밀번호</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="password" value="" id="equipUpdateUserPwd" name="equipUpdateUserPwd" class="mu-input" maxlength="30"/>
                                </div>
                                <div class="messages" id="equipUpdatePwd1Msg" style="display:none"></div>
                            </td>
                        </tr>                        
                        <tr>
                            <th>
                                <span class="essential">*</span>
                                <label>변경 비밀번호 확인</label>
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="password" value="" id="equipUpdateUserPwdConfirm" name="equipUpdateUserPwdConfirm" class="mu-input" maxlength="16"/>
                                </div>
                                <div class="messages" id="equipUpdatePwd2Msg" style="display:none"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>

        <div class="mu-dialog-foot" style="text-align: center;">
            <button id="equipPasswordUpdate" type="button" class="mu-btn">수정</button>
            <button id="equipPpasswordUpdateCancel" type="button" class="mu-btn">취소</button>
        </div>
        
        <input type="hidden" id="equipUpdateId" name="equipUpdateId" value="" />
        <input type="hidden" id="equipUpdateName" name="equipUpdateName" value="" />
        <input type="hidden" id="equipUpdateType" name="equipUpdateType" value="" />
        <input type="hidden" id="equipUpdateLoginId" name="equipUpdateLoginId" value="" />
</div>

<script type="text/javascript">
var passwordPageDiv = '';
console.log('>>> passwordPageDiv : ' + passwordPageDiv);

$(document).ready(function () {
	$('#equipPasswordUpdateClose, #equipPpasswordUpdateCancel').on("click",function(e) {
        $("#equipPasswordBg").hide();
        $("#equipPasswordUp").hide();
    }); 
	$('#equipPasswordUp').draggable({'handle' : '.dragHandle'});
	   
    $('#equipPasswordUpdate').click(function(e) {
        updateEquipPassword();
    });
	
});

var CryptoJSAesJson = {
	    stringify: function (cipherParams) {
	        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
	        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
	        if (cipherParams.salt) j.s = cipherParams.salt.toString();
	        return JSON.stringify(j);
	    }
	}
	
function updateEquipPassword() {
	
    if(_.isEmpty($('#equipUpdateUserPwd').val())) {
        $('#equipUpdatePwd1Msg').css('color', 'red');
        $('#equipUpdatePwd1Msg').show();
        $('#equipUpdatePwd1Msg').text('필수 정보입니다.');
        return;
    } else {
    	$('#equipUpdatePwd1Msg').hide();
    }
    
    if(_.isEmpty($('#equipUpdateUserPwdConfirm').val())) {
        $('#equipUpdatePwd2Msg').css('color', 'red');
        $('#equipUpdatePwd2Msg').show();
        $('#equipUpdatePwd2Msg').text('필수 정보입니다.');
        return;
    } else {
    	if ($('#equipUpdateUserPwdConfirm').val() != $('#equipUpdateUserPwd').val()) {
            $('#equipUpdatePwd2Msg').css('color', 'red');
            $('#equipUpdatePwd2Msg').show();
            $('#equipUpdatePwd2Msg').text('비밀번호가 일치하지 않습니다.');
            return;         
        }
        $('#equipUpdatePwd2Msg').hide();
    }
    
    var strInfoI = CryptoJS.AES.encrypt( $('#equipUpdateLoginId').val(), $("#equipUpdateId").val(), {format: CryptoJSAesJson}).toString();
    var strInfoP = CryptoJS.AES.encrypt( $('#equipUpdateUserPwd').val(), $("#equipUpdateId").val(), {format: CryptoJSAesJson}).toString();
    
    var updateInfo = {
        'equipType' : $('#equipUpdateType').val(),
        'equipId' : $("#equipUpdateId").val(),
        'equipName' : $("#equipUpdateName").val(),
        'loginId' : strInfoI,
        'loginPassword' : strInfoP
    };

    
    $.ajax({
        type:'post',
        url:'/v2/updateAccessInfo',
        data : JSON.stringify(updateInfo),
        contentType: 'application/json',
        dataType : 'json',
        success : function(data) {
            $('#equipUpdateUserPwd').val('');
            $('#equipUpdateUserPwdConfirm').val('');
            
            alert(data.resultMsg);
            $('#equipPpasswordUpdateCancel').trigger('click');
            
            pageSearch();
        },
        error : function(request,status,error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
    
}
</script>

<c:import url="/WEB-INF/views/v2/common/footerV2.jsp" />

