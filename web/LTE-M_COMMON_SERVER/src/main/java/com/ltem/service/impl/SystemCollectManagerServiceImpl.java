package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemCollectManagerDAO;
import com.ltem.service.SystemCollectManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemCollectManagerService")
public class SystemCollectManagerServiceImpl extends EgovAbstractServiceImpl implements SystemCollectManagerService {
	
	@Autowired
	SystemCollectManagerDAO systemCollectManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemCollectManagerServiceImpl.class);
	
	@Override
	public Map<String, List<Map<String, Object>>> getColData(String flag) {
		
		List<Map<String, Object>> temp = systemCollectManagerDAO.getColData(flag);
		List<Map<String,Object>> failureData = systemCollectManagerDAO.getColFailureData();
		List<Map<String, Object>> thd  = systemCollectManagerDAO.getTHD();
		
		Map<String, List<Map<String,Object>>> map = new HashMap<String, List<Map<String,Object>>>();
		
		map.put("colData",temp);
		map.put("failureData",failureData);
		map.put("getTHD", thd);
		
		return map;
	}
	
	@Override
	public int updateTHD(HashMap<String, Object> paramMap) {
		return systemCollectManagerDAO.updateTHD(paramMap);
	}
}
