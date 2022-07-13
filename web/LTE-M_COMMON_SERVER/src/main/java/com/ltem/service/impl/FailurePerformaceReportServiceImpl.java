package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.FailurePerformanceReportDAO;
import com.ltem.service.FailurePerformanceReportService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("FailurePerformanceReportService")
public class FailurePerformaceReportServiceImpl extends EgovAbstractServiceImpl implements FailurePerformanceReportService {

	@Autowired
	FailurePerformanceReportDAO failurePerformanceReportDAO;
	
	private static final Logger log = LoggerFactory.getLogger(FailurePerformaceReportServiceImpl.class);

	@Override
	public List<Map<String, String>> getFailurePerformData(HashMap<String, Object> paramMap) {
		List<Map<String,String>> resultList = new ArrayList<Map<String,String>>();
		
		String searchObject = (String)paramMap.get("searchObject");	// 1 : 고장, 2: 성능
		String accessORepc = (String)paramMap.get("accessORepc");	// 1: 기지국 , 2: 주제어장치, 3: 저장장치
		
		try{
			if("1".equals(searchObject)) {	// 고장
				resultList = failurePerformanceReportDAO.getFailurePerformData_failure(paramMap);
			} else if ("2".equals(searchObject) && "1".equals(accessORepc)) {	// 성능, 기지국
				resultList = failurePerformanceReportDAO.getFailurePerformData_access(paramMap);
			} else if ("2".equals(searchObject) && "3".equals(accessORepc)) {	// 성능, 저장장치
				resultList = failurePerformanceReportDAO.getFailurePerformData_rec(paramMap);
			} else {	// 성능, 주제어장치
				resultList = failurePerformanceReportDAO.getFailurePerformData_epc(paramMap);
			}
		} catch(Exception e) {
			log.error("!!!Exception!!!\n고장/성능통계 리포트 조회 에러 : "+e.getMessage());
		}
		
		return resultList;
	}

}
