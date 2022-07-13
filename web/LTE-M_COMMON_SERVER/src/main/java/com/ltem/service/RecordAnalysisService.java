package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 성능감시 > 주제어장치 KPI 분석
 *
 */
public interface RecordAnalysisService {
	
	public Map<String,Object> getRecordTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getRecordExcelData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopRecordAnalysisData(HashMap<String,Object> paramMap);
}
