package com.ltem.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.LogMgmtDAO;
import com.ltem.service.LogMgmtService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("LogMgmtService")
public class LogMgmtServiceImpl extends EgovAbstractServiceImpl implements LogMgmtService {

	@Autowired
	LogMgmtDAO logMgmtDAO;
	
	private static final Logger log = LoggerFactory.getLogger(LogMgmtServiceImpl.class);

	@Override
	public List<Map<String, String>> getLogMgmtList(HashMap<String, Object> paramMap) {

		List<Map<String, String>> resultList = new ArrayList<>();

		String startDate = (String)paramMap.get("startEventTime") + " 00:00:00";
		String endDate = (String)paramMap.get("endEventTime") + " 23:59:59";


		paramMap.put("startEventTime", startDate);
		paramMap.put("endEventTime", endDate);

		if(paramMap.get("pageSize") != null && !"Integer".equals(paramMap.get("pageSize").getClass().getSimpleName())) {
			paramMap.put("pageSize", Integer.parseInt((String) paramMap.get("pageSize")));
		}

		try {
			resultList = logMgmtDAO.getLogMgmtList(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return resultList;
	}

}
