package com.ltem.dao;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("StationMonitorDAO")
public interface StationMonitorDAO {
	public Map<String,Object> getStationMonitorTime();
	public Map<String,Object> getTotData(HashMap<String, Object> paramMap);
	public List<Map<String,Object>> getStationInfoData();
	public List<Map<String,Object>> getStationTotData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getStationData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getStationQualityTrend(HashMap<String,Object> paramMap);
}
