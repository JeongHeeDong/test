package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 현재 사용안함
 *
 */
public interface EmsService {
	
	public List<Map<String,Object>> getEmsSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getEmsDetail(HashMap<String,Object> paramMap);
	public Map<String, Object> getEmsSearchOption();
	public Map<String,Object> maxID();
	public int emsDetailupdate(HashMap<String,Object> paramMap);
	public int emsIdCheckResult(String ems_id);
	public int emsAdd(HashMap<String,Object> paramMap);
}
