package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 역사별 성능 감시
 *
 */
public interface StationMonitorService {
	public Map<String,Object> getStationMonitorTime();
	public Map<String,Object> getTotData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getStationInfoData();
	public List<Map<String,Object>> getStationTotData (HashMap<String,Object> paramMap);
	public List<Map<String,String>> getStationData (HashMap<String,Object> paramMap);
	public Map<String,Object> getStationQualityTrend(HashMap<String,Object> paramMap);
	public Map<String,List<Map<String,String>>> excelExport(HashMap<String,Object> paramMap);
}
