package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 고장감시 > 설정 > 장애정보 알림문자 발행 설정
 * 김포 lter에서 시스템에 있던 메뉴를 고장감시로 이동
 *
 */
public interface SystemSmsConfigManagerService {
	public Map<String, List<Map<String,String>>> getExcelData(HashMap<String, String> requestMap);
	public Map<String, List<Map<String,String>>> getConfInfo(HashMap<String, String> requestMap);
	public int getTotalCnt(HashMap<String, String> requestMap);
	public List<Map<String,String>> getPhoneInfo(HashMap<String, Object> requestMap);
	public List<Map<String,String>> getSystemInfo();
	public List<Map<String,String>> getAlarmCode(HashMap<String, String> requestMap);
	public List<String> getCodeForView(HashMap<String, String> requestMap);
	public int insertConfData(HashMap<String, Object> requestInsert) throws Exception;
	public int delConfData(HashMap<String, Object> requestMap);
	public int updateTimes(HashMap<String, Object> requestMap);
	public int insertConfDataSingle(HashMap<String, String> requestMap);
	public int updateConfDataSingle(HashMap<String, String> requestMap);
	public String getCodePhone(HashMap<String, String> requestMap);
}
