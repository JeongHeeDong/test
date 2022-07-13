package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemNoticeManagerDAO;
import com.ltem.service.SystemNoticeManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemNoticeManagerService")
public class SystemNoticeManagerServiceImpl extends EgovAbstractServiceImpl implements SystemNoticeManagerService {
	
	@Autowired
	SystemNoticeManagerDAO systemNoticeManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemNoticeManagerServiceImpl.class);
	
	@Override
	public int updateNoti(HashMap<String, String> paramMap) {
		return systemNoticeManagerDAO.updateNoti(paramMap);
	}
	
	@Override
	public int deleteNoti(HashMap<String, String> paramMap) {
		return systemNoticeManagerDAO.deleteNoti(paramMap);
	}
	
	@Override
	public int insertNoti(HashMap<String, String> paramMap) {
		return systemNoticeManagerDAO.insertNoti(paramMap);
	}
	
	@Override
	public String getFilePath(String fileName) {
		return systemNoticeManagerDAO.getFilePath(fileName);
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getNoticeData(HashMap<String, String> paramMap) {
		List<Map<String, String>> temp = systemNoticeManagerDAO.getNoticeData(paramMap);

		Map<String, List<Map<String, String>>> map = new HashMap<String, List<Map<String, String>>>();
		map.put("notiData" ,temp);
		return map;
	}
	
	@Override
	public Map<String, String> getOneNoticeData(HashMap<String, String> paramMap) {
		return 	systemNoticeManagerDAO.getOneNoticeData(paramMap);
	}
	
	@Override
	public int getTotalCnt(HashMap<String, String> paramMap) {
		return systemNoticeManagerDAO.getTotalCnt(paramMap);
	}
}
