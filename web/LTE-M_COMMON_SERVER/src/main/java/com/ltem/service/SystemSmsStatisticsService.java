package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 고장통계 > 장애정보 알림문자 발행 통계
 * 김포 lter에서 시스템에 있던 메뉴를 고장통계로 이동
 *
 */
public interface SystemSmsStatisticsService {
	
	public List<Map<String,String>> getStatisticsData(HashMap<String,Object> paramMap);
}
