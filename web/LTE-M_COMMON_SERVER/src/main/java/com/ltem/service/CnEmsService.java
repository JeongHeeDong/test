package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 현재 사용안함
 *
 */
public interface CnEmsService {
	
	public List<Map<String,Object>> getCnEmsSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getCnEmsDetail(String cnEms_id);
	public Map<String, Object> getCnEmsSearchOption();
	public Map<String,Object> maxID();
	public int cnEmsDetailupdate(HashMap<String,Object> paramMap);
	public int cnEmsIdCheckResult(String cnEms_id);
	public int cnEmsAdd(HashMap<String,Object> paramMap);
}
