package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 고장감시 > 고장분석 > 장애정보 알림문자 발행 이력 조회
 * 김포 lter에서 시스템에 있던 메뉴를 고장감시로 이동
 *
 */
public interface SystemSmsLogManagerService {
	public Map<String,List<Map<String,String>>> getSmsLogData(HashMap<String, String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
}
