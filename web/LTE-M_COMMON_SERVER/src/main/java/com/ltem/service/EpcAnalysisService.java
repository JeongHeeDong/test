package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 성능감시 > 주제어장치 KPI 분석
 *
 */
public interface EpcAnalysisService {
	
	public Map<String,Object> getEpcTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getEpcExcelData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopEpcAnalysisData(HashMap<String,Object> paramMap);
}
