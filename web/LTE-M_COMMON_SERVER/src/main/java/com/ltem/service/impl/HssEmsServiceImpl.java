package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.HssEmsDAO;
import com.ltem.service.HssEmsService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("HssEmsService")
public class HssEmsServiceImpl extends EgovAbstractServiceImpl implements HssEmsService {

	@Autowired
	HssEmsDAO hssEmsDAO;
	
	private static final Logger log = LoggerFactory.getLogger(HssEmsServiceImpl.class);

	@Override
	public List<Map<String, Object>> getHssEmsSearch(HashMap<String,Object> paramMap) {
		return hssEmsDAO.getHssEmsSearch(paramMap);
	}

	@Override
	public Map<String, Object> getHssEmsDetail(String hssEms_id) {
		return hssEmsDAO.getHssEmsDetail(hssEms_id);
	}

	@Override
	public Map<String, Object> getHssEmsSearchOption() {
		
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		List<Map<String,String>> vendor = hssEmsDAO.getVendor();
		
		returnMap.put("VENDOR", vendor);
		
		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int hssEmsDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = hssEmsDAO.hssEmsDetailupdate(paramMap);
		
		return returnStr;
	}

	@Override
	public int hssEmsIdCheckResult(String hssEms_id) {
		return hssEmsDAO.hssEmsIdCheckResult(hssEms_id);
	}

	@Override
	public int hssEmsAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			hssEmsDAO.hssEmsAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}
	
	@Override
	public Map<String, Object> maxID() {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		Map<String,Object> max_id = hssEmsDAO.maxID();
		
		returnMap.put("MAXID", max_id);
		
		return returnMap;
	}


}
