package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 고장감시 > 고장분석 > 고장 분석 리포트
 * 성능감시 > 성능분석 > 성능 분석 리포트
 *
 */
public interface FailurePerformanceReportService {
	
	public List<Map<String, String>> getFailurePerformData(HashMap<String,Object> paramMap);
}
