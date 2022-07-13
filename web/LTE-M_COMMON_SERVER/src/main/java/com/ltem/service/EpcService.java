package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 구성관리 > 주제어장치 관리
 *
 */
public interface EpcService {
	
	public List<Map<String,Object>> getEpcSearch(HashMap<String,Object> paramMap);
	public Map<String, List<Map<String, String>>> getEpcSearchOption();
}
