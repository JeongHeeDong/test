package com.ltem.service.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemProcessManagerDAO;
import com.ltem.service.SystemProcessManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemProcessManagerService")
public class SystemProcessManagerServiceImpl extends EgovAbstractServiceImpl implements SystemProcessManagerService {
	
	@Autowired
	SystemProcessManagerDAO systemProcessManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemProcessManagerServiceImpl.class);
	
	@Override
	public Map<String, Object> getProcData(String word) {
		List<Map<String, Object>> temp = systemProcessManagerDAO.getProcData(word);

		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowdate = dateFormat.format(calendar.getTime());
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("procData" ,temp);
		map.put("nowDateTime", nowdate);
		
		return map;
	}
	
	@Override
	public List<String> getProcSearchOption() {
		List<String> list = systemProcessManagerDAO.getProcSearchOption();
		
		return list;
	}

	@Override
	public List<Map<String, Object>> getServerList() {
		List<Map<String, Object>> resutlList = systemProcessManagerDAO.getServerList();
		
		return resutlList;
	}

	@Override
	public List<String> getGroupList() {
		List<String> groupList = systemProcessManagerDAO.getGroupList();
		return groupList;
	}

	@Override
	public List<Map<String, Object>> getPortList(HashMap<String, String> paramMap) {
		List<Map<String, Object>> portList = systemProcessManagerDAO.getPortList(paramMap);
		return portList;
	}

	@Override
	public List<Map<String, Object>> getNodeList(HashMap<String, String> paramMap) {
		List<Map<String, Object>> nodeList = systemProcessManagerDAO.getNodeList(paramMap);
		return nodeList;
	}

	@Override
	public int getSioefHistoryCnt(HashMap<String, String> paramMap) {
		int totalCnt = systemProcessManagerDAO.getSioefHistoryCnt(paramMap);
		return totalCnt;
	}

	@Override
	public List<Map<String, Object>> getSioefHistoryList(HashMap<String, String> paramMap) {
		List<Map<String, Object>> historyList =systemProcessManagerDAO.getSioefHistoryList(paramMap);
		return historyList;
	}

	@Override
	public void sioefNodeStatusUpdate(HashMap<String, String> paramMap) {
		systemProcessManagerDAO.sioefNodeStatusUpdate(paramMap);
	}
	
	
	@Override
	public List<Map<String, Object>> getSioefStateData(HashMap<String, String> paramMap) {
		List<Map<String, Object>> nodeList =systemProcessManagerDAO.getSioefStateData(paramMap);
		return nodeList;
	}
}
