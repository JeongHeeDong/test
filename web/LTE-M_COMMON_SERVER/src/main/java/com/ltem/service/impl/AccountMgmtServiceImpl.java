package com.ltem.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.transaction.Transactional;

import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.AccountMgmtDAO;
import com.ltem.enums.UserIDCheck;
import com.ltem.enums.UserPwdCheck;
import com.ltem.service.AccountMgmtService;
import com.ltem.service.IrisSsoService;
import com.ltem.utils.HashingUtil;
import com.ltem.v2.dto.TbSeUserDTO;
import com.ltem.v2.service.V2Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("AccountMgmtService")
public class AccountMgmtServiceImpl extends EgovAbstractServiceImpl implements AccountMgmtService {

	@Autowired
	AccountMgmtDAO accountMgmtDAO;
	
	@Autowired
	IrisSsoService irisSsoService;
	
	@Autowired
	V2Service v2Service;
	
	private static final Logger log = LoggerFactory.getLogger(AccountMgmtServiceImpl.class);
	
	@Override
	public List<Map<String, String>> getAccountList(HashMap<String, Object> paramMap) {

		List<Map<String, String>> resultList = new ArrayList<>();

		if("0".equals((String)paramMap.get("auth"))) {
			paramMap.remove("auth");
		}

		if("0".equals((String)paramMap.get("useFlag"))) {
			paramMap.remove("useFlag");
		}

		if(paramMap.get("pageSize") != null && !"Integer".equals(paramMap.get("pageSize").getClass().getSimpleName())) {
			paramMap.put("pageSize", Integer.parseInt((String) paramMap.get("pageSize")));
		}

		try {
			resultList = accountMgmtDAO.getAccountList(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return resultList;
	}

	@Override
	public Map<String, Object> accountRegister(HashMap<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		HashingUtil hu = new HashingUtil();

		int result = 0;
		String userPwd1 = "";
		String userPwd2 = "";

		int duplicationCheck = (int)accountDuplicationCheck(paramMap).get("IDX");

		if(duplicationCheck == 0) {
			try {

				userPwd1 = (String)paramMap.get("userPwd");
				userPwd2 = (String)paramMap.get("userPwdConfirm");

				int teamId = paramMap.get("teamId") == null ? 0 : (int)paramMap.get("teamId");

				if(userPwd1.equals(userPwd2)) {
					//userPwd1 = hu.encrypt(userPwd1); // javascript sha256 처리
					paramMap.put("userPwd", userPwd1);
					paramMap.put("teamId", teamId);

					// 승인일때 아이리스 계정 생성 
					int useFlag = NumberUtils.toInt((String)paramMap.get("userFlag"));
					Boolean irisResult = false;
					// 승인
					if(useFlag == 1) {
						irisResult = irisSsoService.createIrisAccount(String.valueOf(paramMap.get("userId")));
					}else {
						irisResult = true;
					}
					
					if(irisResult) {	// 아이리스 결과가 있으면
						result = accountMgmtDAO.accountRegister(paramMap);
					}
				}

			} catch(Exception e) {
				log.error(e.getMessage());
			}

			if(result > 0) {
				resultMap.put("resultCode", "SUCCESS");
				resultMap.put("IDX", duplicationCheck);
			} else {
				resultMap.put("resultCode", "FAIL");
				resultMap.put("IDX", duplicationCheck);
			}
		} else {
			resultMap.put("resultCode", "FAIL");
			resultMap.put("IDX", duplicationCheck);
		}

		return resultMap;
	}

	@Override
	@Transactional
	public Map<String, Object> accountModify(HashMap<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		HashingUtil hu = new HashingUtil();
		int result = 0;
		int pwdCheck = 0;

//		String currentPwd = paramMap.get("currentPwd") == null ? "" : (String)paramMap.get("currentPwd");
		String changePwd = paramMap.get("changePwd") == null ? "" : (String)paramMap.get("changePwd");

		//현재 비밀번호를 확인하는 로직을 사용할때 활성
//		if(!"".equals(currentPwd) && !"".equals(changePwd)) {
//			pwdCheck = (int)accountModifyCheck(paramMap).get("IDX");
//			if(pwdCheck == 0) {
//				paramMap.put("changePwd", hu.encrypt(changePwd));
//			}
//		}

		if(!"".equals(changePwd)) {
//			paramMap.put("changePwd", hu.encrypt(changePwd));
			paramMap.put("changePwd", changePwd);
		}
		
		// 이전과 승인상태 변경여부 확인
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("userId", (String)paramMap.get("userId"));
		
		Map<String, Object> userInfo = accountMgmtDAO.selectAccountInfo(param);
		Boolean irisResult = true;
		if(userInfo != null) {
			int useFlagBf = NumberUtils.toInt(String.valueOf(userInfo.get("USE_FLAG")));
			int useFlagTobe = NumberUtils.toInt(String.valueOf(paramMap.get("userFlag")));
			if(useFlagBf != useFlagTobe) {
				// 승인대기 > 승인 
				if(useFlagTobe == 1) {
					// 아이리스 계정 생성
					irisResult = irisSsoService.createIrisAccount(String.valueOf(userInfo.get("USER_ID")));
				}else {	// 승인  > 승인대기
					// 아이리스 계정 삭제
					irisResult = irisSsoService.deleteIrisAccount(String.valueOf(userInfo.get("USER_ID")));
				}
			}
		}

		try {
			if(irisResult) {
				result = accountMgmtDAO.accountModify(paramMap);
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		if (result > 0) {
			resultMap.put("SUCCESS", "SUCCESS");
		} else {
			resultMap.put("FAIL", "FAIL");
		}

		return resultMap;
	}

	@Override
	public Map<String, Object> accountRemove(HashMap<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<String, Object>();

		List<Object> ids = (ArrayList<Object>)paramMap.get("userIds");
		int irisResult = irisSsoService.deleteIrisAccounts(ids);
		
		int result = 0;
		if(irisResult > 0) {
			result = accountMgmtDAO.accountRemove(paramMap);
		}

		if(result > 0) {
			resultMap.put("SUCCESS", "SUCCESS");
		} else {
			resultMap.put("FAIL", "FAIL");
		}

		return resultMap;
	}
	
	@Override
	public Map<String, Object> initPassword(HashMap<String, Object> paramMap) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		HashingUtil hu = new HashingUtil();
		
		// 비밀번호 초기화 시 이전 비밀번호는 user_id + user_name 으로 설정한다.
		ArrayList<String> list = (ArrayList<String>) paramMap.get("userIds");
		for (String userId : list) {
			
			TbSeUserDTO tbSeUser = new TbSeUserDTO();
			tbSeUser.setUserId(userId);
			
			TbSeUserDTO userById = v2Service.getUserByIdV2(tbSeUser);	// ID 존재유무 검증
			if (userById != null) {
				log.debug(">>> 초기화 : " + userById.getUserId() + "!" + new SimpleDateFormat("yyyyMMdd").format(new Date()));
				userById.setUserPassword(hu.encrypt(userById.getUserId() + "!" + new SimpleDateFormat("yyyyMMdd").format(new Date())));
				userById.setPasswordInitId((String) paramMap.get("passwordInitId"));
				accountMgmtDAO.initPassword(userById);
			}
		}
		
//		if(accountMgmtDAO.initPassword(paramMap) > 0) {
			resultMap.put("result", "SUCCESS");
//		} else {
//			resultMap.put("result", "FAIL");
//		}

		return resultMap;
	}
	
	

	//사용자 등록시 ID 체크
	@Override
	public Map<String, Object> accountDuplicationCheck(HashMap<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<String, Object>();

		String userId = paramMap.get("userId") == null ? "" : (String)paramMap.get("userId");

		paramMap.put("userId", userId);

		
		// 아이리스 계정 연동을 위한 아이리스 아이디 규칙 정규식으로 변경 (22.02.10)
		// - 아이디는 3 ~ 63글자 이내에서 영문 소문자와 숫자만 사용해야 합니다. (영문자로 시작)
		String regExp1 = "^[a-z]{1}"; 					//"^[a-zA-Z0-9가-힣]{1}";
		String regExp2 = "^[a-z]{1}[a-z0-9]{2,62}$";	//"^[a-zA-Z0-9가-힣]{1}[\\w.\\-가-힣]{1,19}$";
		Pattern pattern1 = Pattern.compile(regExp1);
		Pattern pattern2 = Pattern.compile(regExp2);
		Matcher match1 = pattern1.matcher(userId);
		Matcher match2 = pattern2.matcher(userId);

		Boolean matchFlag1 = match1.find();
		Boolean matchFlag2 = match2.find();

		int result = accountMgmtDAO.accountDuplicationCheck(paramMap);

		if( result > 0 ) {
			//쿼리 결과가 있으면 이미 있는 ID이므로 FAIL
			resultMap.put("IDX", UserIDCheck.DUPLICATION.getIdCheck());
		} else if(userId == null || "".equals(userId)) {
			//ID가 없을 때
			resultMap.put("IDX", UserIDCheck.EMPTY.getIdCheck());
		} else if(!matchFlag1) {
			//ID의 첫글자 양식이 잘못됐을 때(허용하지 않는 특문 등) 
			resultMap.put("IDX", UserIDCheck.INVALID_FIRST_STRING.getIdCheck());
		} else if(!matchFlag2) {
			//ID의 양식이 잘못됐을 때(허용하지 않는 특문 등)
			resultMap.put("IDX", UserIDCheck.INVALID_STRING.getIdCheck());
		} else {
			//쿼리 결과가 없을 때 OK
			resultMap.put("IDX", UserIDCheck.OK.getIdCheck());
		}

		return resultMap;
	}

	//사용자 계정 수정 시 비밀번호 확인
	//현재 비밀번호에 대한 체크는 사용 안함
	//관리자는 사용자의 현재 비밀번호에 관계없이 수정이 가능해야함
	@Override
	public Map<String, Object> accountModifyCheck(HashMap<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		HashingUtil hu = new HashingUtil();

		String currentPwd = paramMap.get("currentPwd") == null ? "" : (String)paramMap.get("currentPwd");

		String regExp = "^[\\w\\W]{5,16}$";
		Pattern pattern = Pattern.compile(regExp);
		Matcher match = pattern.matcher(currentPwd);

		Boolean matchFlag = match.find();

		int result = 0;

		// 매칭에 맞을 경우 true
		if(matchFlag) {
//			paramMap.put("currentPwd", hu.encrypt(currentPwd));
			paramMap.put("currentPwd", currentPwd);
			result = accountMgmtDAO.accountPwdDuplicationCheck(paramMap);
		}

		if( result > 0 ) {
			//쿼리 결과가 있으면 비밀번호가 일치
			resultMap.put("IDX", UserPwdCheck.OK.getPwdCheck());
		} else if(currentPwd == null || "".equals(currentPwd)) {
			//비밀번호가 없을 때
			resultMap.put("IDX", UserPwdCheck.EMPTY.getPwdCheck());
		} else if(!matchFlag) {
			//비밀번호의 양식이 잘못됐을 때
			resultMap.put("IDX", UserPwdCheck.NOT_OK.getPwdCheck());
		} else {
			//쿼리 결과가 없을 때
			resultMap.put("IDX", UserPwdCheck.NOT_OK.getPwdCheck());
		}

		return resultMap;
	}

	//로그인 화면에서 회원 등록시 User Roll 확인
	@Override
	public List<Map<String, String>> getUserRoll() {

		List<Map<String, String>> resultList = new ArrayList<>();
		resultList = accountMgmtDAO.getUserRoll();

		return resultList;
	}
}
