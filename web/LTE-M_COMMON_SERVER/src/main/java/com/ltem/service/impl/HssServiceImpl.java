package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.HssDAO;
import com.ltem.service.HssService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("HssService")
public class HssServiceImpl extends EgovAbstractServiceImpl implements HssService {

	@Autowired
	HssDAO hssDAO;
	
	private static final Logger log = LoggerFactory.getLogger(HssServiceImpl.class);
	@Override
	public Map<String, Object> getHssDetail(String hss_id) {
		return hssDAO.getHssDetail(hss_id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public int hssDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = hssDAO.hssDetailupdate(paramMap);
		
		return returnStr;
	}

	@Override
	public int hssIdCheckResult(String hss_id) {
		return hssDAO.hssIdCheckResult(hss_id);
	}

	@Override
	public int hssAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			hssDAO.hssAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}


}
