package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 구성관리 > 단말 관리
 *
 */
public interface CodeService {
	public int getVendorTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> getVendorList(HashMap<String, String> paramMap);
	public int insertVendor(HashMap<String, String> paramMap);
	public int updateVendor(HashMap<String, String> paramMap);
	public int deleteVendor(List<Integer> vendorIdList);

	public int getTeamTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> getTeamList(HashMap<String, String> paramMap);
	public int insertTeam(HashMap<String, String> paramMap);
	public int updateTeam(HashMap<String, String> paramMap);
	public int deleteTeam(List<Integer> vendorIdList);
	
	public int getStationTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> getStationList(HashMap<String, String> paramMap);
	public int getStationNumCount(HashMap<String, String> paramMap);
	public int insertStation(HashMap<String, String> paramMap);
	public int updateStation(HashMap<String, String> paramMap);
	public int deleteStation(List<Integer> vendorIdList);
	
	public int getPhoneTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> getPhoneList(HashMap<String, String> paramMap);
	public int insertPhone(HashMap<String, String> paramMap);
	public int updatePhone(HashMap<String, String> paramMap);
	public int deletePhone(List<Integer> phoneIdList);
	
	public int getAlarmTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> getAlarmList(HashMap<String, String> paramMap);
	public int insertAlarm(HashMap<String, String> paramMap);
	public int updateAlarm(HashMap<String, String> paramMap);
	public int deleteAlarm(List<Map<String, String>> alarmIdList);
	public List<Map<String, String>> getSystemInfo();
	public List<Map<String, String>> getVendorInfo();
	public List<Map<String, String>> getStationLine();
}
