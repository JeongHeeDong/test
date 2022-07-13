package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 사용안함
 *
 */
public interface HssEmsService {
	
	public List<Map<String,Object>> getHssEmsSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getHssEmsDetail(String hssEms_id);
	public Map<String, Object> getHssEmsSearchOption();
	public Map<String,Object> maxID();
	public int hssEmsDetailupdate(HashMap<String,Object> paramMap);
	public int hssEmsIdCheckResult(String hssEms_id);
	public int hssEmsAdd(HashMap<String,Object> paramMap);
}
