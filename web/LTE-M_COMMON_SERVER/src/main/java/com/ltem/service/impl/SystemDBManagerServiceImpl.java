package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemDBManagerDAO;
import com.ltem.service.SystemDBManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemDBManagerService")
public class SystemDBManagerServiceImpl extends EgovAbstractServiceImpl implements SystemDBManagerService {
	
	@Autowired
	SystemDBManagerDAO systemDBManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemDBManagerServiceImpl.class);
	
	@Override
	public List<String> getHostName() {
		List<String> list = systemDBManagerDAO.getHostName();

		return list;
	}
	
	@Override
	public List<Map<String, String>> getTableInfo(HashMap<String, String> paramMap) {
		return systemDBManagerDAO.getTableInfo(paramMap);
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getBakData(HashMap<String, String> paramMap) {
	
		List<Map<String, String>> temp = systemDBManagerDAO.getBakData(paramMap);
		
		Map<String, List<Map<String, String>>> map = new HashMap<String, List<Map<String, String>>>();
		map.put("bakData" ,temp);
		
		return map;
	}
	
	@Override
	public Map<String, String> getOneBakData(HashMap<String, String> paramMap) {
		return systemDBManagerDAO.getOneBakData(paramMap);
	}
	
	@Override
	public int getTotalCnt(HashMap<String, String> paramMap) {
		return systemDBManagerDAO.getTotalCnt(paramMap);
	}
	
	@Override
	public int insertBakData(HashMap<String, Object> requestMap) throws Exception {
		return systemDBManagerDAO.insertBakData(requestMap);
	}
	
	@Override
	public int updateBakData(HashMap<String, Object> requestMap) {
		return systemDBManagerDAO.updateBakData(requestMap);
	}
	
	@Override
	public int delBakData(HashMap<String, String> requestMap) {
		return systemDBManagerDAO.delBakData(requestMap);
	}
	
}
