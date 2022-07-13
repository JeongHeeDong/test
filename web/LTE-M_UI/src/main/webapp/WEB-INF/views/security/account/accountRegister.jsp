<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<%-- SHA-256 --%>
<script src="/resources/js/login/sha256.js"></script>        
<script src="/resources/js/security/account/accountRegister.js"></script>

<!-- 계정 등록/수정 Form -->
<div id="accountRegisterBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="accountRegisterUp" class="mu-dialog accountRegist" style="width:460px;display: none;z-index: 11"><!-- resize 부분 -->
	<div class="mu-dialog-head dragHandle">
		<h2><span class="title">계정 등록</span></h2>
		<button type="button" class="mu-btn mu-btn-icon" id="accountRegisterClose"><i class="mu-icon-img cancel"></i></button>
	</div>

	<%--<form id="accountForm" method="post" action="/security/account/add">--%>
	<form id="accountForm">
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
									<input type="text" value id="userId" class="mu-input" maxlength="20"/>
									<button id="idDuplicationCheck" type="button" class="mu-btn">중복확인</button>
								</div>
								<div class="messages" id="idMsg" style="display:none"></div>
							</td>
						</tr>
						<tr>
							<th>
								<span class="essential">*</span>
								<label>이름</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="userName" class="mu-input"/>
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
									<input type="password" value id="userPwd" class="mu-input" maxlength="16"/>
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
									<input type="password" value id="userPwdConfirm" class="mu-input" maxlength="16"/>
								</div>
								<div class="messages" id="pwd2Msg" style="display:none"></div>
							</td>
						</tr>
						<!-- <tr>
							<th>
								<label>핸드폰번호</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="userMobile" class="mu-input"/>
								</div>
							</td>
						</tr> -->
						<tr>
							<th>
								<label>단말번호</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="userPhone" class="mu-input"/>
								</div>
							</td>
						</tr>
						<!-- <tr>
							<th>
								<label>E-Mail</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="userEmail" class="mu-input"/>
								</div>
								<div class="messages" id="emailMsg" style="display:none"></div>
							</td>
						</tr> -->
                        <tr class="js-account-mgmt">
                            <th>
                                <label>사용기간</label>
                            </th>
                            <td>
                                <div class="mu-selectbox">
                                    <select name="usePeriod" id="usePeriod" class="mu-value userRoll">
                                        <option value='0'>제약 없음</option>
                                        <option value='1'>1개월</option>
                                        <option value='3'>3개월</option>
                                        <option value='6'>6개월</option>
                                        <option value='9'>9개월</option>
                                        <option value='12'>12개월</option>
                                    </select>
                                </div>
                            </td>
                        </tr>						
						<tr class="js-account-mgmt">
							<th>
								<label>사용자등급</label>
							</th>
							<td>
								<div class="mu-selectbox">
									<select name="userAuth" class="mu-value userRoll">
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
					</tbody>
				</table>
				<!-- <legend style="display:none">계정신청</legend>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>ID</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userId" class="mu-input" maxlength="20"/>
					</div>
					<div class="mu-hgroup">
						<button id="idDuplicationCheck" type="button" class="mu-btn">중복확인</button>
					</div>
				</div>
				<div class="messages" id="idMsg" style="display:none"></div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>이름</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userName" class="mu-input"/>
					</div>
				</div>
				<div class="messages" id="nameMsg" style="display:none"></div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>비밀번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="password" value id="userPwd" class="mu-input" maxlength="16"/>
					</div>
				</div>
				<div class="messages" id="pwd1Msg" style="display:none"></div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>비밀번호 확인</label>
					</div>
					<div class="mu-hgroup">
						<input type="password" value id="userPwdConfirm" class="mu-input" maxlength="16"/>
					</div>
				</div>
				<div class="messages" id="pwd2Msg" style="display:none"></div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>핸드폰번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userMobile" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>단말번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userPhone" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>E-Mail</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="userEmail" class="mu-input"/>
					</div>
				</div>
				<div class="messages" id="emailMsg" style="display:none"></div>
				<div class="mu-row js-account-mgmt">
					<div class="mu-hgroup">
						<label>사용자등급</label>
					</div>
					<div class="mu-hgroup mu-selectbox">
						<select name="userAuth" class="mu-value userRoll">
						</select>
					</div>
				</div>
				<div class="mu-row mu-hgroup js-account-mgmt">
					<div class="mu-radio">
						<input type="radio" name="userFlag" id="userReject" value="99" checked="checked">
						<label for="userReject">승인대기</label>
					</div>
					<div class="mu-radio">
						<input type="radio" name="userFlag" id="userConfirm" value="1">
						<label for="userConfirm">승인</label>
					</div>
				</div> -->
			</fieldset>
		</div>

		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="accountRegister" type="button" class="mu-btn">등록</button>
			<button id="accountRegisterCancel" type="button" class="mu-btn">취소</button>
		</div>
	</form>
</div>