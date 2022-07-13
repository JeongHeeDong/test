package com.ltem.dao;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("MobileLocationMonitorDAO")
public interface MobileLocationMonitorDAO {
	public Map<String,Object> getPerformanceTime();
	public List<Map<String,Object>> getMobileLocationAndAlarm(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getmobileInfo();
	public List<Map<String,Object>> getMobileLocationAndAlarmEms(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getmobileInfoEms();
	public List<Map<String,Object>> getPopPerformData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPhonePerformanceTrend(HashMap<String, Object> paramMap);
}
