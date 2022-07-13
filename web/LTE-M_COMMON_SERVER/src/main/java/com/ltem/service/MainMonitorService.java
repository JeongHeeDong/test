package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 통합감시 > 메인감시
 *
 */
public interface MainMonitorService {
   
    public Map<String, Object> getPerformData(HashMap<String,Object> paramMap);

	public int getDuActiveCount();
	
	public List<Map<String, String>> getUserMenuAuth();
}
