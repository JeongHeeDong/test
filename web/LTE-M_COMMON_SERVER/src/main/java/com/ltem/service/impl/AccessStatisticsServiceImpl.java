package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.AccessStatisticsDAO;
import com.ltem.service.AccessStatisticsService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("AccessStatisticsService")
public class AccessStatisticsServiceImpl extends EgovAbstractServiceImpl implements AccessStatisticsService {

	@Autowired
	AccessStatisticsDAO accessStatisticsDAO;
	
	private static final Logger log = LoggerFactory.getLogger(AccessStatisticsServiceImpl.class);

	@Override
	public List<Map<String, String>> getStatisticsData(HashMap<String, Object> paramMap) {
		List<Map<String, String>> resultList = new ArrayList<Map<String, String>>();
		
		try {
			resultList = accessStatisticsDAO.getStatisticsData(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		
		return resultList;
	}

	
}
