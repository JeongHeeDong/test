package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 통합감시 > 열차 운행 감시
 * 김포 lter에서 사용안함
 *
 */
public interface TrainOperationService {
	public Map<String,String> getPerformanceTimeInfo();
	public List<Map<String,Object>> getStationLocationInfo();
	public Map<String,Object> getStationInfo();
	public Map<String,Object> getTrainInfo(HashMap<String,Object> paramMap);
	public Map<String,Object> getTrainQualityTrend(HashMap<String,Object> paramMap);
	public Map<String,Object> getLastTrainQualityTrend(HashMap<String,Object> paramMap);
	public Map<String, Object> getTrainQualityTrendTest(HashMap<String, Object> paramMap);
}
