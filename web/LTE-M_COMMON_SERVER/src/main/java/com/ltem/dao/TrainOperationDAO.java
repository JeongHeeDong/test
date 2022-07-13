package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("TrainOperationDAO")
public interface TrainOperationDAO {
	public Map<String,String> getPerformanceTimeInfo();
	public List<Map<String,Object>> getStationInfo();
	public List<Map<String,Object>> getStationLocationInfo();
	public List<Map<String,Object>> getTrainTrackingInfo(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getTrainQualityInfo(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getTrainPhoneInfo(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getTrainQualityTrendAll(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getTrainQualityTrend(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getLastTrainQualityTrendAll(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getLastTrainQualityTrendPhone(HashMap<String,Object> paramMap);
}
