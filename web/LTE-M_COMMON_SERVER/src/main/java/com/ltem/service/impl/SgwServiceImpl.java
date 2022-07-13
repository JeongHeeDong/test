package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SgwDAO;
import com.ltem.service.SgwService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SgwService")
public class SgwServiceImpl extends EgovAbstractServiceImpl implements SgwService {

	@Autowired
	SgwDAO sgwDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SgwServiceImpl.class);

	@Override
	public List<Map<String, Object>> getSgwSearch(HashMap<String,Object> paramMap) {
		return sgwDAO.getSgwSearch(paramMap);
	}

	@Override
	public Map<String, Object> getSgwDetail(String sgw_id) {
		return sgwDAO.getSgwDetail(sgw_id);
	}

	@Override
	public Map<String, List<Map<String, String>>> getSgwSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String,String>> emsName = sgwDAO.getEmsName();
		List<Map<String,String>> vendor = sgwDAO.getVendor();
		
		returnMap.put("EMSNAME", emsName);
		returnMap.put("VENDOR", vendor);
		
		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int sgwDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = sgwDAO.sgwDetailupdate(paramMap);
		
		return returnStr;
	}

	@Override
	public int sgwIdCheckResult(String sgw_id) {
		return sgwDAO.sgwIdCheckResult(sgw_id);
	}

	@Override
	public int sgwAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			sgwDAO.sgwAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}


}
