package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface FailureDAO {

	public List<Map<String, String>> selectFailureData(HashMap<String,String> paramMap);

	public List<Map<String,String>> selectMajorFailureData(String al_code);

	public List<Map<String, String>> selectActionCaseData(HashMap<String,String> paramMap);

	public List<Map<String, String>> selectUnrecoveredData(Map<String,String> paramMap);

	public List<Map<String, String>> selectRopMsgData(HashMap<String, String> paramMap);

	
	public void deleteAlarmGradeFilter(@Param("userId") String userId); 

	public void insertAlarmGradeFilter(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectAlarmGradeFilter(@Param("userId") String userId);


	public List<Map<String, String>> selectAlarmCodeTree();

	public void deleteAlarmCodeFilter(@Param("userId") String userId);

	public void insertAlarmCodeFilter(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectAlarmCodeFilter(@Param("userId") String userId);

	
	public List<Map<String, String>> selectSystemTree();

	public void deleteSystemFilter(@Param("userId") String userId);

	public void insertSystemFilter(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectSystemFilter(@Param("userId") String userId);

	
	public List<Map<String, String>> selectMajorAlarmTree();

	public void deleteMajorAlarmFilter(@Param("userId") String userId);

	public void insertMajorAlarmFilter(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectMajorAlarmFilter(@Param("userId") String userId);
	

	public List<Map<String, String>> selectStationTree();
	
	public void deleteStationFilter(@Param("userId") String userId);

	public void insertStationFilter(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectStationFilter(@Param("userId") String userId);
	
	

	public List<Map<String, String>> selectFailureSpecAlarm(HashMap<String, Object> paramMap);

	public List<Map<String, String>> selectFailureSpecGraphByDatetime(HashMap<String, Object> paramMap);
	
	public List<Map<String, String>> selectFailureSpecGraphByAlarmcode(HashMap<String, Object> paramMap);
	
	public List<Map<String, String>> selectSearchBunchAlarms(HashMap<String, String> paramMap);
	
	public List<Map<String, String>> selectFailureBunchSpecAlarm(HashMap<String, Object> paramMap);
	
	public List<Map<String, String>> selectFailureBunchSpecGraphByDatetime(HashMap<String, Object> paramMap);
	
	public List<Map<String, String>> selectFailureBunchSpecGraphByAlarmcode(HashMap<String, Object> paramMap);

	public List<Map<String, String>> selectBunchFailureSettingData();

	public Map<String,String> selectBunchCodeMax();

	public List<Map<String, String>> selectVendorData();

	public List<Map<String, String>> selectEquipData();

	public List<Map<String, String>> selectEquipVendorData();

	public List<Map<String, String>> selectAlarmCodeData();
	
	public List<Map<String, String>> selectSystemData(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectAlarmCodeTableData(HashMap<String, String> paramMap);

	public void deleteBunchFailure(HashMap<String, String> paramMap);

	public void insertBunchFailure(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectActionCaseSettingData(HashMap<String, Object> paramMap);

	public void insertFailureActionCase(HashMap<String, Object> paramMap);

	public int modifyFailureActionCase(HashMap<String, Object> paramMap);

	public int deleteFailureActionCase(HashMap<String, Object> paramMap);

	public void updateAudioSettingData(HashMap<String, String> paramMap);

	public List<Map<String, String>> selectAudioSettingData(HashMap<String,String> paramMap);

	public void deleteAudioSettingData(HashMap<String, String> paramMap);

	public void insertAudioSettingData(HashMap<String, String> paramMap);

	public void deleteUnrecoveredAlarmTime();

	public void insertUnrecoveredAlarmTime(HashMap<String, String> map);

	public List<Map<String, String>> selectUnrecoveredAlarmCode(HashMap<String, String> paramMap);

	public void deleteUnrecoveredAlarmCode(HashMap<String, String> map);

	public void insertUnrecoveredAlarmCode(HashMap<String, String> map);

	public List<Map<String, String>> selectUnrecoveredAlarmSettingData();
	
	public List<Map<String,String>> getDuStationInfo();
	public List<Map<String,String>> getRuStationInfo();
	public List<Map<String,String>> getSwitchStationInfo();
	public List<Map<String,String>> getJrgStationInfo();
	public List<Map<String,String>> getEquipStationInfo();
	public List<Map<String,String>> getEpcStationInfo();
	
	public List<Map<String,String>> getEquipInfo();
	
	public int insertDelMsg(HashMap<String,String> paramMap);

	public List<Map<String, String>> selectEquipAct();
}
