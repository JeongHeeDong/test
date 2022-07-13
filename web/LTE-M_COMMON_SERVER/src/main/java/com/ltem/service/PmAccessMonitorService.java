package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 성능감시 > 성능감시 > 기지국 감시
 *
 */
public interface PmAccessMonitorService {
	
	public int equipSave(HashMap<String,Object> paramMap);
	public Map<String,Object> getEquipList(HashMap<String,Object> paramMap);
	public Map<String,Object> getBasicSetting(HashMap<String,Object> paramMap);
	public int basicSettingSave(HashMap<String,Object> paramMap);
	public Map<String,Object> getSearchData(HashMap<String,Object> paramMap);
	public Map<String,String> getAlarmInfo(Map<String,String> paramMap);
	public Map<String,Object> getPopTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopDetailData(HashMap<String,Object> paramMap);
	public Map<String,Object> getAlarmVolume();
}