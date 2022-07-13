package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.CnEmsDAO;
import com.ltem.service.CnEmsService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("CnEmsService")
public class CnEmsServiceImpl extends EgovAbstractServiceImpl implements CnEmsService {

	@Autowired
	CnEmsDAO cnEmsDAO;
	
	private static final Logger log = LoggerFactory.getLogger(CnEmsServiceImpl.class);

	@Override
	public List<Map<String, Object>> getCnEmsSearch(HashMap<String,Object> paramMap) {
		return cnEmsDAO.getCnEmsSearch(paramMap);
	}

	@Override
	public Map<String, Object> getCnEmsDetail(String cnEms_id) {
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		returnMap.put("cnEmsDetailData", cnEmsDAO.getCnEmsDetail(cnEms_id));
		returnMap.put("cnEmsDetailGridData", cnEmsDAO.getCnEmsDetailGrid(cnEms_id));
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getCnEmsSearchOption() {
		
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		List<Map<String,String>> vendor = cnEmsDAO.getVendor();
		
		returnMap.put("VENDOR", vendor);
		
		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int cnEmsDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = cnEmsDAO.cnEmsDetailupdate(paramMap);
		
		return returnStr;
	}

	@Override
	public int cnEmsIdCheckResult(String cnEms_id) {
		return cnEmsDAO.cnEmsIdCheckResult(cnEms_id);
	}

	@Override
	public int cnEmsAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			cnEmsDAO.cnEmsAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}

	@Override
	public Map<String, Object> maxID() {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		Map<String,Object> max_id = cnEmsDAO.maxID();
		
		returnMap.put("MAXID", max_id);
		
		return returnMap;
	}


}
