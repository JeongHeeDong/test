package com.ltem.v2.dto;

import java.util.Date;

public class TbSeUserDTO  {
	
	private String userId;
	private String userPassword;
	private Date loginTime;
	private Date logoutTime;
	private int teamId;
	private String userName;
	private String userMobile;
	private String userPhone;
	private String email;
	private int auth;
	private int useFlag;
	private String passwordInitYn;		// 비밀번호 초기화 여부
	private Date passwordUpdateTIme;	// 비밀번호 최종 변경일
	private int passwordErrCnt;			// 비밀번호 오류 횟수
	private String passwordInitId;		// 비밀번호 초기화 아이디
	
	private Date registDate;	// 등록일
	private String usePeriod;	// 사용 기간 (0(무제한), 1, 3, 6, 9, 12 개월

	// 비밀번호 변경 용
	private String userPasswordConfirm;
	private String passwordPageDiv;		// 비밀번호 변경 구분 / init : 비밀번호 초기화, expire : 비밀번호 만기, update : 비밀번호 변경
	
	// 사용기간 만료 여부 : Y - 만료, N - 사용가능
	private String usePeriodYn;
	
	private String accessDupleLogin;	// Y : 중복 로그인 수행 (기존 로그인 사용자는 자동 로그아웃), N : 중복 로그인 안함 (최초 로그인 사용자만 사용)
	
	
	public String getAccessDupleLogin() {
		return accessDupleLogin;
	}
	public void setAccessDupleLogin(String accessDupleLogin) {
		this.accessDupleLogin = accessDupleLogin;
	}
	public String getUsePeriodYn() {
		return usePeriodYn;
	}
	public void setUsePeriodYn(String usePeriodYn) {
		this.usePeriodYn = usePeriodYn;
	}
	public Date getRegistDate() {
		return registDate;
	}
	public void setRegistDate(Date registDate) {
		this.registDate = registDate;
	}
	public String getUsePeriod() {
		return usePeriod;
	}
	public void setUsePeriod(String usePeriod) {
		this.usePeriod = usePeriod;
	}
	public String getPasswordInitId() {
		return passwordInitId;
	}
	public void setPasswordInitId(String passwordInitId) {
		this.passwordInitId = passwordInitId;
	}
	public String getPasswordPageDiv() {
		return passwordPageDiv;
	}
	public void setPasswordPageDiv(String passwordPageDiv) {
		this.passwordPageDiv = passwordPageDiv;
	}
	public int getPasswordErrCnt() {
		return passwordErrCnt;
	}
	public void setPasswordErrCnt(int passwordErrCnt) {
		this.passwordErrCnt = passwordErrCnt;
	}
	public Date getPasswordUpdateTIme() {
		return passwordUpdateTIme;
	}
	public void setPasswordUpdateTIme(Date passwordUpdateTIme) {
		this.passwordUpdateTIme = passwordUpdateTIme;
	}
	public String getPasswordInitYn() {
		return passwordInitYn;
	}
	public void setPasswordInitYn(String passwordInitYn) {
		this.passwordInitYn = passwordInitYn;
	}
	public String getUserPasswordConfirm() {
		return userPasswordConfirm;
	}
	public void setUserPasswordConfirm(String userPasswordConfirm) {
		this.userPasswordConfirm = userPasswordConfirm;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserPassword() {
		return userPassword;
	}
	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
	public Date getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}
	public Date getLogoutTime() {
		return logoutTime;
	}
	public void setLogoutTime(Date logoutTime) {
		this.logoutTime = logoutTime;
	}
	public int getTeamId() {
		return teamId;
	}
	public void setTeamId(int teamId) {
		this.teamId = teamId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserMobile() {
		return userMobile;
	}
	public void setUserMobile(String userMobile) {
		this.userMobile = userMobile;
	}
	public String getUserPhone() {
		return userPhone;
	}
	public void setUserPhone(String userPhone) {
		this.userPhone = userPhone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getAuth() {
		return auth;
	}
	public void setAuth(int auth) {
		this.auth = auth;
	}
	public int getUseFlag() {
		return useFlag;
	}
	public void setUseFlag(int useFlag) {
		this.useFlag = useFlag;
	}
	
}
