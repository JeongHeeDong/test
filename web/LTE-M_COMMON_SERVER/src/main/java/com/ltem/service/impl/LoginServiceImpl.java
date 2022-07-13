package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ltem.dao.LoginDAO;
import com.ltem.service.IrisSsoService;
import com.ltem.service.LoginService;
import com.ltem.utils.HashingUtil;
import com.ltem.v2.common.V2Constants;
import com.ltem.v2.utils.ProjectUtils;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("LoginService")
public class LoginServiceImpl extends EgovAbstractServiceImpl implements LoginService {

	@Autowired
	LoginDAO loginDao;

	@Autowired
	IrisSsoService irisSsoService;
	
	private static final Logger log = LoggerFactory.getLogger(LoginServiceImpl.class);

	@Override
	public List<Map<String,Object>> getloginCheck(HashMap<String, Object> paramMap) throws Exception {
		HashingUtil hu = new HashingUtil();

		paramMap.put("PW", hu.encrypt(paramMap.get("PW").toString()));

		return loginDao.getloginCheck(paramMap);
	}

	@Override
	public Map<String,String> checkMenuAuth(Map<String,String> paramMap) throws Exception {
		Map<String, String> resultMap = loginDao.chechMenuAuth(paramMap);

		return resultMap;
	}

	@Override
	public void upDateLoginTime(HashMap<String, Object> param) throws Exception {
		loginDao.upDateLoginTime(param);
	}

	@Override
	public List<Map<String, Object>> getNotice() throws Exception {
		List<Map<String, Object>> resultList = loginDao.getNotice();
		return resultList;
	}

	@Override
	public Map<String, Object> getNoticeContents(HashMap<String, String> paramMap) throws Exception {
		Map<String, Object> resultMap = loginDao.getNoticeContents(paramMap);
		return resultMap;
	}

	@Override
	public String getMenuList(String userId) throws Exception {
		List<Map<String, Object>> resultList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		String menuList = "";

		try {
			resultList = loginDao.getMenuList(userId);
			
			try {
				// P168 함 [기지국통합감시] 제외
				if (V2Constants.P168.equals(ProjectUtils.getProjectProfile())) {
					for (Map<String, Object> menu : resultList) {
						if ("2010050".equals(menu.get("MENU_ID"))) {
							resultList.remove(menu);
							break;
						}
					}
				}
			} catch (Exception e) {
				log.debug(">>> P168 메뉴 조정 오류 : " + e.getMessage());
			}
			
			menuList = mapper.writeValueAsString(resultList);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return menuList;
	}
	
	@Override
	public boolean permitIpCheck(String user_ip) {
		boolean returnFlag = false;
		
		if ("0:0:0:0:0:0:0:1".equals(user_ip)) {
			user_ip = "127.0.0.1";
		}
		
		try {
			int permitIpCnt = loginDao.permitIpCnt(user_ip);
			
			if(permitIpCnt > 0){
				returnFlag = true;
				log.info("로그인 IP : "+user_ip);
			}
			
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		
		return returnFlag;
	}

	@Override
	public int getloginIDCheck(HashMap<String, Object> paramMap) throws Exception {
		return loginDao.getloginIDCheck(paramMap);
	}
}
