package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemSmsLogManagerDAO;
import com.ltem.service.SystemSmsLogManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemSmsLogManagerService")
public class SystemSmsLogManagerServiceImpl extends EgovAbstractServiceImpl implements SystemSmsLogManagerService {
	
	@Autowired
	SystemSmsLogManagerDAO systemSmsLogManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemSmsLogManagerServiceImpl.class);
	
	@Override
	public Map<String, List<Map<String, String>>> getSmsLogData(HashMap<String, String> paramMap) {
		
		List<Map<String, String>> temp = systemSmsLogManagerDAO.getSmsLogData(paramMap);

		Map<String, List<Map<String, String>>> map = new HashMap<String, List<Map<String, String>>>();
		map.put("logData" ,temp);
		
		return map;
	}
	
	@Override
	public int getTotalCnt(HashMap<String, String> paramMap) {
		return systemSmsLogManagerDAO.getTotalCnt(paramMap);
	}
}
