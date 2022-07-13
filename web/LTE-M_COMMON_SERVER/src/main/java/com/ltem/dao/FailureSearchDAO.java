package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestBody;

public interface FailureSearchDAO {

	List<Map<String, String>> selectSearchSystemList(HashMap<String, String> paramMap);

	List<Map<String, String>> selectEquipType(HashMap<String, String> paramMap);
	
	List<Map<String, String>> selectSelectedSystemList(HashMap<String, String> paramMap);

	List<Map<String, String>> selectFailureAlarmSearch(HashMap<String, Object> paramMap);

	List<Map<String, String>> selectAlarmCodeList(HashMap<String, Object> paramMap);

	List<Map<String, String>> selectAlarmAnalysisTableList(HashMap<String, Object> paramMap);

	List<String> selectAlarmTypeList(HashMap<String, Object> paramMap);

	List<Map<String, String>> selectAlarmAnalysisGraphList(HashMap<String, Object> paramMap);

	List<Map<String, String>> selectAlarmGroupList();

	List<Map<String, String>> selectPopupAlarmCodeList(HashMap<String,String> paramMap);

	List<Map<String, String>> getEquipAnalysisDetailData(HashMap<String, Object> paramMap);
	
	List<Map<String, String>> selectAlarmByTime(HashMap<String, Object> paramMap);

	Map<String, Integer> getTimeListAlarmByTime(HashMap<String, Object> paramMap);

	List<Map<String, String>> getTimeAnalysisDetailData(HashMap<String, Object> paramMap);
}
