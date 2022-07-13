package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemSmsConfigManagerDAO")
public interface SystemSmsConfigManagerDAO {
	public int getTotalCnt(HashMap<String, String> requestMap);
	public List<Map<String,String>> getExcelData(HashMap<String, String> requestMap);
	public List<Map<String,String>> getConfInfo(HashMap<String, String> requestMap);
	public List<Map<String,String>> getPhoneInfo(HashMap<String, Object> requestMap);
	public List<Map<String,String>> getSystemInfo();
	public List<Map<String,String>> getAlarmCode(HashMap<String, String> requestMap);
	public List<String> getCodeForView(HashMap<String, String> requestMap);
	public int insertConfData(HashMap<String, Object> requestMap) throws Exception;
	public int delConfData(HashMap<String, Object> requestMap);
	public int updateTimes(HashMap<String, Object> requestMap);
	public int updateConfDataSingle(HashMap<String, String> alarmMap);
	public int insertConfDataSingle(HashMap<String, String> alarmMap);
	public String getCodePhone(HashMap<String, String> requestMap);
}
