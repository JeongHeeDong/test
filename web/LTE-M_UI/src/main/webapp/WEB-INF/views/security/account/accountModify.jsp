<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<%-- SHA-256 --%>
<script src="/resources/js/login/sha256.js"></script>    
<script src="/resources/js/security/account/accountModify.js"></script>

<!-- 계정 등록/수정 Form -->
<div id="accountModifyBg" class="mu-dialog-background" style="display: none;z-index: 10"></div>
<div id="accountModifyUp" class="mu-dialog accountRegist" style="width:460px;display: none;z-index: 11"><!-- resize 부분 -->
	<div class="mu-dialog-head dragHandle">
		<h2><span class="title">계정 수정</span></h2>
		<button type="button" class="mu-btn mu-btn-icon" id="accountModifyClose"><i class="mu-icon-img cancel"></i></button>
	</div>

	<%--<form id="accountForm" method="post" action="/security/account/add">--%>
	<form id="modifyForm">
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
									<input type="text" value id="modifyUserId" class="mu-input" readonly/>
								</div>
							</td>
						</tr>
						<tr>
							<th>
								<span class="essential">*</span>
								<label>이름</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="modifyUserName" class="mu-input"/>
								</div>
								<div class="modifyMessages" id="modifyNameMsg" style="display:none"></div>
							</td>
						</tr>
						<%--<tr>
							<th>
								<span class="essential">*</span>
								<label>현재 비밀번호</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="password" value id="currentPwd" class="mu-input"/>
								</div>
								<div class="modifyMessages" id="currentPwdMsg" style="display:none"></div>
							</td>
						</tr>--%>
						<tr>
							<th>
								<span class="essential">*</span>
								<label>변경할 비밀번호</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="password" value id="changePwd" class="mu-input"/>
								</div>
								<div class="modifyMessages" id="changePwdMsg" style="display:none"></div>
							</td>
						</tr>
						<%--<tr>
							<th>
								<label>핸드폰번호</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="modifyUserMobile" class="mu-input"/>
								</div>
							</td>
						</tr> --%>
						<tr>
							<th>
								<label>단말번호</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="modifyUserPhone" class="mu-input"/>
								</div>
							</td>
						</tr>
						<%--<tr>
							<th>
								<label>E-Mail</label>
							</th>
							<td>
								<div class="mu-item-group">
									<input type="text" value id="modifyUserEmail" class="mu-input"/>
								</div>
								<div class="modifyMessages" id="modifyEmailMsg" style="display:none"></div>
							</td>
						</tr> --%>
                        <tr class="js-account-mgmt">
                            <th>
                                <label>사용기간</label>
                            </th>
                            <td>
                                <div class="mu-selectbox">
                                    <select name="usePeriod" id="updateUsePeriod" class="mu-value userRoll">
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
						<tr>
							<th>
								<label>사용자등급</label>
							</th>
							<td>
								<div class="mu-selectbox">
									<select name="modifyUserAuth" class="mu-value userRoll">
									</select>
								</div>
							</td>
						</tr>
						<tr>
							<th></th>
							<td>
								<div class="mu-item-group">
									<div class="mu-radio">
										<input type="radio" name="modifyUserFlag" id="modifyUserReject" value="99">
										<label for="modifyUserReject">승인대기</label>
									</div>
									<div class="mu-radio">
										<input type="radio" name="modifyUserFlag" id="modifyUserConfirm" value="1">
										<label for="modifyUserConfirm">승인</label>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- <legend style="display:none">계정수정</legend>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>ID</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="modifyUserId" class="mu-input" readonly/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>이름</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="modifyUserName" class="mu-input"/>
					</div>
				</div>
				<div class="modifyMessages" id="modifyNameMsg" style="display:none"></div>
				<%--<div class="mu-row">--%>
					<%--<div class="mu-hgroup">--%>
						<%--<span class="essential">*</span>--%>
						<%--<label>현재 비밀번호</label>--%>
					<%--</div>--%>
					<%--<div class="mu-hgroup">--%>
						<%--<input type="password" value id="currentPwd" class="mu-input"/>--%>
					<%--</div>--%>
				<%--</div>--%>
				<%--<div class="modifyMessages" id="currentPwdMsg" style="display:none"></div>--%>
				<div class="mu-row">
					<div class="mu-hgroup">
						<span class="essential">*</span>
						<label>변경할 비밀번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="password" value id="changePwd" class="mu-input"/>
					</div>
				</div>
				<div class="modifyMessages" id="changePwdMsg" style="display:none"></div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>핸드폰번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="modifyUserMobile" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>단말번호</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="modifyUserPhone" class="mu-input"/>
					</div>
				</div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>E-Mail</label>
					</div>
					<div class="mu-hgroup">
						<input type="text" value id="modifyUserEmail" class="mu-input"/>
					</div>
				</div>
				<div class="modifyMessages" id="modifyEmailMsg" style="display:none"></div>
				<div class="mu-row">
					<div class="mu-hgroup">
						<label>사용자등급</label>
					</div>
					<div class="mu-hgroup mu-selectbox">
						<select name="modifyUserAuth" class="mu-value userRoll">
						</select>
					</div>
				</div>
				<div class="mu-row mu-hgroup">
					<div class="mu-radio">
						<input type="radio" name="modifyUserFlag" id="modifyUserReject" value="99">
						<label for="modifyUserReject">승인대기</label>
					</div>
					<div class="mu-radio">
						<input type="radio" name="modifyUserFlag" id="modifyUserConfirm" value="1">
						<label for="modifyUserConfirm">승인</label>
					</div>
				</div> -->
			</fieldset>
		</div>

		<div class="mu-dialog-foot" style="text-align: center;">
			<button id="accountModify" type="button" class="mu-btn">확인</button>
			<button id="accountModifyCancel" type="button" class="mu-btn">취소</button>
		</div>
	</form>
</div>