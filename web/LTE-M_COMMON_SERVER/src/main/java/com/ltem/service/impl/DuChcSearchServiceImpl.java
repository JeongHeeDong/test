package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.DuChcSearchDAO;
import com.ltem.service.DuChcSearchService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("DuChcSearchService")
public class DuChcSearchServiceImpl extends EgovAbstractServiceImpl implements DuChcSearchService {

	@Autowired
	DuChcSearchDAO duChcSearchDAO;
	
	@Autowired
	CodeDAO codeDAO;
	
	private static final Logger log = LoggerFactory.getLogger(DuChcSearchServiceImpl.class);


	@Override
	public List<Map<String, Object>> getduChcSearch(HashMap<String,Object> paramMap) {

		List<Map<String,Object>> resultList = duChcSearchDAO.getduChcSearch(paramMap);
		
		return resultList;
	}


	@Override
	public List<Map<String, Object>> getChcSearch(HashMap<String, Object> paramMap) {
		
		List<Map<String,Object>> resultList = duChcSearchDAO.getChcSearch(paramMap);
		
		return resultList;
	}


	@Override
	public Map<String, List<Map<String, String>>> getSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String,String>> emsNameList = duChcSearchDAO.getEmsName();
		List<Map<String,String>> stationLine = codeDAO.selectStationLine();
		
		returnMap.put("EMSNAME", emsNameList);
		returnMap.put("STATIONLINE", stationLine);
		
		return returnMap;
	}
}
