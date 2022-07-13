package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("PmAccessMonitorDAO")
public interface PmAccessMonitorDAO {
	
	public int equipSave(Map<String,Object> paramMap);
	public int equipDelete(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> equipSelectList(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> equipDeSelectList(HashMap<String,Object> paramMap);
	public Map<String,Object> getStdAlarm(HashMap<String,Object> paramMap);
	public Map<String,Object> getaAlarm(HashMap<String,Object> paramMap);
	public int getDeSelectCnt(HashMap<String,Object> paramMap);
	public int alarmUpdate(Map<String,Object> paramMap);
	public int stdalarmUpdate(Map<String,Object> paramMap);
	public String getUpdateDate(HashMap<String,Object> paramMap);
	public Map<String,Object> getEtcFilter(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getRuKpiData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getDuKpiData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getAccessDTPData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getAccessHANDData(HashMap<String,Object> paramMap);
	public Map<String,String> getAlarmInfo(Map<String,String> paramMap);
	public List<Map<String,Object>> getPopTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopDetailData(HashMap<String,Object> paramMap);
	public Map<String,Object> getAlarmVolume();
	
}
