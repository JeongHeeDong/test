package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.CommonFunctionDAO;
import com.ltem.service.CommonFunctionService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("CommonFunctionService")
public class CommonFunctionServiceImpl extends EgovAbstractServiceImpl implements CommonFunctionService {
	
	@Autowired
	CommonFunctionDAO commonFunctionDao;
	
	
	private static final Logger log = LoggerFactory.getLogger(CommonFunctionServiceImpl.class);


	@Override
	public void insertWebLog(Map<String, Object> param) throws Exception {
		
		commonFunctionDao.insertWebLog(param);
		
	}


	@Override
	public List<HashMap<String, String>> getMenuAuthList() throws Exception {
		return commonFunctionDao.getMenuAuthList();
	}


	@Override
	public void f_detectionLog_insert(HashMap<String, String> paramMap) throws Exception {
		commonFunctionDao.f_detectionLog_insert(paramMap);
	}

	@Override
	public void putFailureInfoClear(HashMap<String, Object> paramMap) throws Exception {
		commonFunctionDao.putFailureInfoClear(paramMap);
	}


	@Override
	public String getEventTime(String... tableNames) {
		return commonFunctionDao.getEventTime(tableNames);
	}
}
