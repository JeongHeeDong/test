package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.UnauthSearchDAO;
import com.ltem.service.UnauthSearchService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("UnauthSearchService")
public class UnauthSearchServiceImpl extends EgovAbstractServiceImpl implements UnauthSearchService {

	@Autowired
	UnauthSearchDAO unauthSearchDAO;
	
	private static final Logger log = LoggerFactory.getLogger(UnauthSearchServiceImpl.class);

	@Override
	public List<Map<String,String>> getUnauthData(HashMap<String, Object> paramMap) {
		List<Map<String,String>> resultList = new ArrayList<Map<String,String>>();
		
		try{
			resultList = unauthSearchDAO.getUnauthData(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
		}
		
		return resultList;
	}

}
