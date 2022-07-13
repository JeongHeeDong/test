package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 
 * 성능감시 > 성능감시 > 녹취저장 감시
 *
 */
public interface PmRecordMonitorService {
	
	public String getMaxDateTime();
	public Map<String,List<Map<String,String>>> getRecordSearchData(Map<String,Object> paramMap);
	public Map<String,Object> getPopRecordTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopRecordDetailData(HashMap<String,Object> paramMap);
}