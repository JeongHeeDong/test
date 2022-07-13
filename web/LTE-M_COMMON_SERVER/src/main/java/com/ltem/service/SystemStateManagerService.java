package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 시스템 > 서버 상탱 관리
 * 통합감시 > 서비스 장비 상태감시
 *
 */
public interface SystemStateManagerService {
	
	public Map<String,Object> getStateData(HashMap<String,Object> paramMap);
	public Map<String,Object> getTrendData(HashMap<String,Object> paramMap);
	public Map<String,Object> getVmStateData(HashMap<String,Object> paramMap);
	public Map<String,Object> getVmTrendData(HashMap<String,Object> paramMap);
	public List<Map<String, Object>> getSysThOption(String pageFlag);
	public Map<String,Object> getEquipTypeData(HashMap<String,Object> paramMap);
	public int thresholdEdit(HashMap<String,Object> paramMap);
	public List<Map<String, Object>> getSessionipList(String pageFlag);
}
