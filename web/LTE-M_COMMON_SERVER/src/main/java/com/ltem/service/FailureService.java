package com.ltem.service;

import org.apache.poi.ss.usermodel.Workbook;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface FailureService {
	
	/**
	 * 메인화면의 실시간알람 로우 클릭시 뜨는 고장상세정보화면에서 해당 알람에 관한 데이터를 DB에서 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getFailureData(HashMap<String,String> paramMap);
	
	/**
	 * 중요고장상세 버튼 클릭시 뜨는 중요고장알림화면에서 뿌려주는 중요고장 데이터를 DB에서 조회하는 함수 
	 * @param paramMap
	 * @return
	 */
	public Map<String, List<Map<String,String>>> getMajorFailureData(List<HashMap<String,String>> paramMap);
	
	/**
	 * 메인화면의 실시간알람 로우클릭시 뜨는 고장상세정보화면과 중요고장상세버튼 클릭시 뜨는 중요고장알림화면에서 뿌려주는 조치사례 및 해당 내용을 DB에서 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public Map<String, List<Map<String,String>>> getActionCaseData(HashMap<String,String> paramMap);
	
	/**
	 * 미복구버튼 클릭시 미복구 상세화면에 뿌려주는 데이터를 DB에서 조회하는 함수
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getUnrecoveredData();
	
	/**
	 * 메인화면의 실시간 알람으로 들어오는 로우 클릭시 뜨는 고장상세정보 화면에 뿌려주는 ROP 메세지를 DB에서 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getRopMsgData(HashMap<String, String> paramMap);
	
	/**
	 * 고장이력조회 화면에서 고장알람 이력을 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, String>> getFailureSpecAlarm(HashMap<String, Object> paramMap);
	
	/**
	 * 고장이력조회 화면에서 고장알람 그래프 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public Map<String, Map<String, Object>> getFailureSpecGraph(HashMap<String, Object> paramMap);
	
	/**
	 * 다발고장이력조회 화면의 다발알람 팝업화면에서 다발고장알람들을 리스트업하는 함수
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, String>> getSearchBunchAlarms(HashMap<String, String> paramMap);

	/**
	 * 다발고장이력조회 화면에서 다발알람 이력을 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, String>> getFailureBunchSpecAlarm(HashMap<String, Object> paramMap);

	/**
	 * 다발고장이력조회 화면에서 아래 그래프를 그려주기위한 데이터를 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public Map<String,Map<String,Object>> getBunchGraphData(HashMap<String, Object> paramMap);
	
	/**
	 * 다발고장 설정화면에서 사용자가 저장한 다발고장 설정 데이터를 조회하는 함수
	 * @return
	 */
	public List<Map<String, String>> getBunchFailureSettingData();

	/**
	 * 다발고장 입력화면에서 번치
	 * @return
	 */
	public Map<String,String> getBunchCodeMax();

	/**
	 * 다발고장 입력화면에서 제조사 리스트를 조회하는 함수
	 * @return
	 */
	public List<Map<String, String>> getVendorData();
	
	/**
	 * 다발고장 입력화면에서 장비타입 리스트를 조회하는 함수
	 * @return
	 */
	public List<Map<String, String>> getEquipData();

	/**
	 * 다발고장 입력화면에서 장비타입, 제조사 리스트를 조회하는 함수
	 * @return
	 */
	public List<Map<String, String>> getEquipVendorData();
	
	/**
	 * 다발고장 입력화면에서 알람코드 리스트를 조회하는 함수
	 * @return
	 */
	public List<Map<String, String>> getAlarmCodeData();
	
	/**
	 * 장애조치방법 등록화면에서 장비선택시 시스템 리스트를 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, String>> getSystemData(HashMap<String,String> paramMap);

	/**
	 * 장애조치방법의 알람코드선택 화면에서 알람코드 리스트를 조회하는 함수
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, String>> getAlarmCodeTableData(HashMap<String, String> paramMap);
	
	/**
	 * 다발고장 입력화면에서 사용자가 입력한 정보를 DB에 저장하는 함수
	 * @param paramMap
	 * @return
	 */
	public String addBunchFailure(HashMap<String, String> paramMap);

	/**
	 * 다발고장 수정화면에서 사용자가 수정한 정보를 DB에 저장하는 함수
	 * @param paramMap
	 * @return
	 */
	public String editBunchFailure(HashMap<String, String> paramMap);

	/**
	 * 다발고장 수정화면에서 사용자가 체크한 모든 로우를 DB에서 삭제하는 함수
	 * @param paramMap
	 * @return
	 */
	public String delBunchFailure(List<HashMap<String,String>> paramMap);

	/**
	 * 장애조치방법관리 화면 - 고장조치사례 조회
	 * @return
	 */
	public List<Map<String, String>> getActionCaseSettingData(HashMap<String, Object> paramMap);

	/** 
	 * 장애조치방법관리 화면 - 장애조치방법 등록(저장)
	 * @param paramMap
	 * @return
	 */
	public String addFailureActionCase(HashMap<String,Object> paramMap);

	/**
	 * 장애조치방법관리 화면 - 장애조치방법 수정
	 * @param paramMap
	 * @return
	 */
	public String modifyFailureActionCase(HashMap<String, Object> paramMap);

	/**
	 * 장애조치방법관리 화면 - 장애조치방법 삭제
	 * @param paramList
	 * @return
	 */
	public String delFailureActionCase(List<HashMap<String, Object>> paramList);

	/**
	 * 가청설정 화면 - 초기화(폼세팅을 위해 저장된 데이터 조회)
	 * @return
	 */
	public List<Map<String, String>> getAudioSettingData(HashMap<String,String> paramMap);

	/**
	 * 가청설정 화면 - 오디오 파일 등록(저장)
	 * @param request
	 * @return
	 */
	public String addAudioFile(HttpServletRequest request);

	/**
	 * 
	 * @return
	 */
	public List<Map<String, String>> getUnrecoveredAlarmSettingData();

	/**
	 * 미복구 알람설정 화면 - 등급별 설정 등록(저장)
	 * @param paramList
	 * @return
	 */
	public String addUnrecoveredAlarmTime(List<HashMap<String, String>> paramList);

	/**
	 * 현재 사용안함(2016.02.19)
	 * 미복구 알람설정화면 - 알람코드별 설정 등록(저장)
	 * @param paramList
	 * @return
	 */
	public String addUnrecoveredAlarmCode(List<HashMap<String, String>> paramList);
	
	/**
	 * 현재 사용안함(2016.02.19)
	 * 미복구 알람설정화면 - 알람코드별 설정부분의 왼쪽 알람코드 조회
	 * @param paramMap
	 * @return
	 */
	public List<Map<String,String>> getUnrecoveredAlarmCode(HashMap<String, String> paramMap);
	
	
	
	/**
	 * 사용자가 입력한 알람등급필터를 DB에 저장하는 함수
	 * @param userId
	 * @param paramList
	 * @return 
	 */
	public String setAlarmGradeFilter(String userId, List<HashMap<String, String>> paramList);
	
	/**
	 * 해당 아이디의 사용자가 저장했던 알람등급필터를 DB로부터 가져오는 함수
	 * @param userId
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getAlarmGradeFilter(String userId);
	
	/**
	 * 알람코드필터 클릭시 DB로부터 알람코드의 트리정보를 불러오기 위한 함수
	 * @return
	 */
	public List<Map<String, String>> gridAlarmCodeTree();

	/**
	 * 사용자가 입력한 알람코드필터를 DB에 저장하는 함수
	 * @param userId
	 * @param paramList
	 * @return
	 */
	public String setAlarmCodeFilter(String userId, List<HashMap<String, String>> paramList);
	
	/**
	 * 해당 아이디의 사용자가 저장했던 알람코드필터를 DB로부터 가져오는 함수
	 * @param userId
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getAlarmCodeFilter(String userId);

	/**
	 * 장비필터 클릭시 DB로부터 장비필터의 트리정보를 불러오기 위한 함수
	 * @return
	 */
	public List<Map<String, String>> gridSystemTree();

	/**
	 * 사용자가 입력한 장비필터를 DB에 저장하는 함수
	 * @param userId
	 * @param paramList
	 * @return
	 */
	public String setSystemFilter(String userId,List<HashMap<String, String>> paramList);

	/**
	 * 해당 아이디의 사용자가 저장했던 장비필터를 DB로부터 가져오는 함수
	 * @param userId
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getSystemFilter(String userId);

	/**
	 * 중요알람필터 클릭시 DB로부터 중요알람의 트리정보를 불러오기 위한 함수
	 * @return
	 */
	public List<Map<String, String>> gridMajorAlarmTree();

	/**
	 * 사용자가 입력한 중요알람필터를 DB에 저장하는 함수
	 * @param userId
	 * @param paramList
	 * @return
	 */
	public String setMajorAlarmFilter(String userId,List<HashMap<String, String>> paramList);
	
	/**
	 * 해당 아이디의 사용자가 저장했던 중요알람필터를 DB로부터 가져오는 함수
	 * @param userId
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getMajorAlarmFilter(String userId);

	/**
	 * 역사별 필터 클릭시 DB로부터 역사의 트리정보를 불러오기 위한 함수
	 * @return
	 */
	public List<Map<String, String>> gridStationTree();
	
	/**
	 * 역사별 필터 정보 DB Insert
	 * @param userId
	 * @param paramList
	 * @return
	 */
	public String setStationFilter(String userId, List<HashMap<String,String>> paramList);
	
	/**
	 * 해당 아이디의 사용자가 저장했던 중요알람필터를 DB로부터 가져오는 함수
	 * @param userId
	 * @return
	 */
	public Map<String, List<Map<String, String>>> getStationFilter(String userId);
	
	/**
	 * DU_ID와 STATION_ID 맵핑 정보
	 * @return
	 */
	public List<Map<String,String>> getDuStationInfo();

	/**
	 * DU_ID와 STATION_ID 맵핑 정보
	 * SWITCH_ID와 STATION_ID 맵핑 정보
	 * @return
	 */
	public Map<String, Object> getStationInfo();
	
	/**
	 * Equip Type 맵핑 정보
	 * @return
	 */
	public List<Map<String,String>> getEquipInfo();

	/**
	 * 조치사례관리 Excel 출력
	 * @return
	 */
	public Workbook getExcelWorkbook(HashMap<String, Object> paramMap);

	/**
	 * 조치사례 및 고장상세정보 Excel 출력
	 * @return
	 */
	public Workbook failureActionCaseExcelExport(HashMap<String, Object> paramMap);
	
	/**
	 * 고장알람 강제해지시 데이터 insert
	 * @param paramMap
	 * @return
	 */
	public int insertDelMsg(HashMap<String,String> paramMap);
}
