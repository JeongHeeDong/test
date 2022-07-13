package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 성능감시 > 기지국 KPI 분석
 *
 */
public interface AccessAnalysisService {
	
	public Map<String,Object> getAccessTrendData(HashMap<String,Object> paramMap);
	public List<Map<String, String>> getAccessExcelData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopAccessAnalysisData(HashMap<String,Object> paramMap);
}
