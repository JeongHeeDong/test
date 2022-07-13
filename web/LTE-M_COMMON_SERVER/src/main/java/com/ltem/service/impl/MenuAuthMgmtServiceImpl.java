package com.ltem.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.MenuAuthMgmtDAO;
import com.ltem.service.MenuAuthMgmtService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("MenuAuthMgmtService")
public class MenuAuthMgmtServiceImpl extends EgovAbstractServiceImpl implements MenuAuthMgmtService {

	@Autowired
	MenuAuthMgmtDAO menuAuthMgmtDAO;
	
	private static final Logger log = LoggerFactory.getLogger(MenuAuthMgmtServiceImpl.class);

	@Override
	public List<Map<String, String>> getMenuList(HashMap<String, Object> paramMap) {

		List<Map<String, String>> resultList = new ArrayList<>();

		if(paramMap.get("pageSize") != null && !"Integer".equals(paramMap.get("pageSize").getClass().getSimpleName())) {
			paramMap.put("pageSize", Integer.parseInt((String) paramMap.get("pageSize")));
		}

		try {
			resultList = menuAuthMgmtDAO.getMenuList(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return resultList;
	}

	@Override
	public Map<String, String> modifyMenuAuth(HashMap<String, Object> paramMap) {

		int result = 0;
		Map<String, String> resultMap = new HashMap<String, String>();
		List<Map<String, Object>> tmpList = new ArrayList<>();

		try {
			tmpList = (List)paramMap.get("data");
			for(Map map : tmpList) {
				result = menuAuthMgmtDAO.modifyMenuAuth(map);
			}

			if(result > 0) {
				resultMap.put("RESULT", "SUCCESS");
			} else {
				resultMap.put("RESULT", "FAIL");
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			resultMap.put("RESULT", "FAIL");
		}

		return resultMap;
	}

}
