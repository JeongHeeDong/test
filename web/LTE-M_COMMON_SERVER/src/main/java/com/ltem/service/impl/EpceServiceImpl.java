package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.EpcDAO;
import com.ltem.service.EpcService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("EpcService")
public class EpceServiceImpl extends EgovAbstractServiceImpl implements EpcService {

	@Autowired
	EpcDAO epcDAO;
	
	private static final Logger log = LoggerFactory.getLogger(EpceServiceImpl.class);

	@Override
	public List<Map<String, Object>> getEpcSearch(HashMap<String,Object> paramMap) {
		return epcDAO.getEpcSearch(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getEpcSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String,String>> emsName = epcDAO.getEmsName();
		List<Map<String,String>> vendor = epcDAO.getVendor();
		
		returnMap.put("EMSNAME", emsName);
		returnMap.put("VENDOR", vendor);
		
		return returnMap;
	}
}
