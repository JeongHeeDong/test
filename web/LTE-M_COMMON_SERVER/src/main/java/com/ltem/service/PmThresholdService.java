package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 성능감시 > 설정 > 임계치 설정
 *
 */
public interface PmThresholdService {
	
	public int thresholdMod(HashMap<String,Object> paramMap);
	public int thresholdCheck(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getSearchData(HashMap<String,Object> paramMap);
}
