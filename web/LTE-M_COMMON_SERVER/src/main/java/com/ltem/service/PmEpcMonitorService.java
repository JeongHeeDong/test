package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 
 * 성능감시 > 성능감시 > 주제어장치 감시
 *
 */
public interface PmEpcMonitorService {
	
	public String getMaxDateTime();
	public Map<String,List<Map<String,String>>> getEpcSearchData(Map<String,Object> paramMap);
	public Map<String,Object> getPopEpcTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopEpcDetailData(HashMap<String,Object> paramMap);
}