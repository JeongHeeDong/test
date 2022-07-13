package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemStateManagerDAO")
public interface SystemStateManagerDAO {
	public List<Map<String,Object>> getStateData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getVmStateData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getVmTrendData(HashMap<String,Object> paramMap);
	public String getMaxDateTime(HashMap<String,Object> paramMap);
	public List<Map<String, Object>> getSysThOption(HashMap<String,String> paramMap);
	public Map<String,Object> getEquipTypeData(HashMap<String,Object> paramMap);
	public int thresholdEdit(HashMap<String,Object> paramMap);
	public List<Map<String, Object>> getSessionipList(Map<String,String> paramMap);
}
