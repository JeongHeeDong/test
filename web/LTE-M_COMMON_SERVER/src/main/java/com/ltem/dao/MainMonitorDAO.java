package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("MainMonitorDAO")
public interface MainMonitorDAO {
	
	public Map<String,String> getEpcEventTime();
	public String getAccessEventTime();
	public Map<String,String> getDuLevel(HashMap<String,Object> paramMap);
	public Map<String,String> getRuLevel(HashMap<String,Object> paramMap);
	public int getDuActiveCount();
	public List<Map<String,String>> getUserMenuAuth();
}
