package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 현재 사용안함
 *
 */
public interface SgwService {
	
	public List<Map<String,Object>> getSgwSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getSgwDetail(String sgw_id);
	public Map<String, List<Map<String, String>>> getSgwSearchOption();
	public int sgwDetailupdate(HashMap<String,Object> paramMap);
	public int sgwIdCheckResult(String sgw_id);
	public int sgwAdd(HashMap<String,Object> paramMap);
}
