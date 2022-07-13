package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.EmsDAO;
import com.ltem.service.EmsService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("EmsService")
public class EmsServiceImpl extends EgovAbstractServiceImpl implements EmsService {

	@Autowired
	EmsDAO emsDAO;
	
	private static final Logger log = LoggerFactory.getLogger(EmsServiceImpl.class);

	@Override
	public List<Map<String, Object>> getEmsSearch(HashMap<String,Object> paramMap) {
		return emsDAO.getEmsSearch(paramMap);
	}

	@Override
	public Map<String, Object> getEmsDetail(HashMap<String,Object> paramMap) {
		return emsDAO.getEmsDetail(paramMap);
	}

	@Override
	public Map<String, Object> getEmsSearchOption() {
		
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		List<Map<String,String>> vendor = emsDAO.getVendor();
		Map<String,Object> max_id = emsDAO.maxID();
		
		returnMap.put("VENDOR", vendor);
		returnMap.put("MAXID", max_id);
		
		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int emsDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = emsDAO.emsDetailupdate(paramMap);
		
		return returnStr;
	}

	@Override
	public int emsIdCheckResult(String ems_id) {
		return emsDAO.emsIdCheckResult(ems_id);
	}

	@Override
	public int emsAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			emsDAO.emsAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}
	
	
	@Override
	public Map<String, Object> maxID() {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		Map<String,Object> max_id = emsDAO.maxID();
		
		returnMap.put("MAXID", max_id);
		
		return returnMap;
	}


}
