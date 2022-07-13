package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public interface CodeDAO {
	public int selectVendorTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectVendorList(HashMap<String, String> paramMap);
	public int insertVendor(HashMap<String, String> paramMap);
	public int deleteVendor(HashMap<String, String> paramMap);	
	public int updateVendor(HashMap<String, String> paramMap);

	public int selectTeamTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectTeamList(HashMap<String, String> paramMap);
	public int insertTeam(HashMap<String, String> paramMap);
	public int deleteTeam(HashMap<String, String> paramMap);	
	public int updateTeam(HashMap<String, String> paramMap);
	
	public int selectStationTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectStationList(HashMap<String, String> paramMap);
	public int selectStationNumCount(HashMap<String, String> paramMap);
	public int insertStation(HashMap<String, String> paramMap);
	public int deleteStation(HashMap<String, String> paramMap);
	public int updateStation(HashMap<String, String> paramMap);
	
	public int selectPhoneTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectPhoneList(HashMap<String, String> paramMap);
	public int insertPhone(HashMap<String, String> paramMap);
	public int updatePhone(HashMap<String, String> paramMap);
	public int deletePhone(HashMap<String, String> paramMap);
	
	public int selectAlarmTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectAlarmList(HashMap<String, String> paramMap);
	public int insertAlarm(HashMap<String, String> paramMap);
	public int updateAlarm(HashMap<String, String> paramMap);
	public int deleteAlarm(Map<String, String> alarmInfo);
	public List<Map<String, String>> selectSystemInfo();
	public List<Map<String, String>> selectStationLine();
}
