package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemSmsConfigManagerDAO;
import com.ltem.service.SystemSmsConfigManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemSmsConfigManagerService")
public class SystemSmsConfigManagerServiceImpl extends EgovAbstractServiceImpl implements SystemSmsConfigManagerService {
	
	@Autowired
	SystemSmsConfigManagerDAO systemSmsConfigManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemSmsConfigManagerServiceImpl.class);
	
	@Override
	public List<Map<String, String>> getPhoneInfo(HashMap<String, Object> requestMap) {
		return systemSmsConfigManagerDAO.getPhoneInfo(requestMap);
	}
	
	@Override
	public List<Map<String, String>> getSystemInfo() {
		return systemSmsConfigManagerDAO.getSystemInfo();
	}
	
	@Override
	public List<Map<String, String>> getAlarmCode(HashMap<String, String> requestMap) {
		return systemSmsConfigManagerDAO.getAlarmCode(requestMap);
	}
	
	@Override
	public int insertConfData(HashMap<String, Object> paramMap) throws Exception{	
		return systemSmsConfigManagerDAO.insertConfData(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getExcelData(HashMap<String, String> requestMap) {
		Map<String, List<Map<String,String>>> resultMap = new HashMap<String, List<Map<String,String>>>();
		resultMap.put("confInfo", systemSmsConfigManagerDAO.getExcelData(requestMap));
		return resultMap;
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getConfInfo(HashMap<String, String> requestMap) {
		Map<String, List<Map<String,String>>> resultMap = new HashMap<String, List<Map<String,String>>>();
		resultMap.put("confInfo", systemSmsConfigManagerDAO.getConfInfo(requestMap));
		return resultMap;
	}
	
	@Override
	public int getTotalCnt(HashMap<String, String> requestMap) {
		return systemSmsConfigManagerDAO.getTotalCnt(requestMap);
	}
	
	@Override
	public List<String> getCodeForView(HashMap<String, String> requestMap) {
		return systemSmsConfigManagerDAO.getCodeForView(requestMap);
	}
	
	@Override
	public int delConfData(HashMap<String, Object> requestMap) {
		return systemSmsConfigManagerDAO.delConfData(requestMap);
	}

	@Override
	public int updateTimes(HashMap<String, Object> requestMap) {
		return systemSmsConfigManagerDAO.updateTimes(requestMap);
	}
	
	@Override
	public int insertConfDataSingle(HashMap<String, String> requestMap) {
		return systemSmsConfigManagerDAO.insertConfDataSingle(requestMap);
	}
	
	@Override
	public int updateConfDataSingle(HashMap<String, String> requestMap) {
		return systemSmsConfigManagerDAO.updateConfDataSingle(requestMap);
	}
	
	@Override
	public String getCodePhone(HashMap<String, String> requestMap) {
		return systemSmsConfigManagerDAO.getCodePhone(requestMap);
	}
	
}
