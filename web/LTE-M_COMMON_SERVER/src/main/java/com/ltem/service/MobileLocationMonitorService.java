package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 통합감시 > 단말 위치 확인
 *
 */
public interface MobileLocationMonitorService {
	
	public Map<String,Object> getStationInfoAndMonitorTime();
	public Map<String, Object> getMobileLocationAndAlarm(HashMap<String,Object> paramMap);
	public Map<String, Object> getMobileLocationAndAlarmEms(HashMap<String,Object> paramMap);
	public List<Map<String, Object>> getPopPerformData(HashMap<String,Object> paramMap);
	public Map<String, Object> sendMessage(HashMap<String, Object> paramMap);
	public Map<String, Object> searchTrend(HashMap<String, Object> paramMap);
	
}
