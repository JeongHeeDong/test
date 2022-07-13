package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 보안 > 접속관리 > 접속 이력 통계
 *
 */
public interface AccessStatisticsService {
	
	public List<Map<String,String>> getStatisticsData(HashMap<String,Object> paramMap);
}
