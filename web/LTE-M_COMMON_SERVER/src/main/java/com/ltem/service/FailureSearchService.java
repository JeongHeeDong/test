package com.ltem.service;

import org.apache.poi.ss.usermodel.Workbook;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface FailureSearchService {

	
	/**
	 * 선택된 장비의 시스템 조회(장비리스트)시 EquipType 리스트 조회
	 * @param paramMap
	 * @return
	 */
	Map<String, List<Map<String, String>>> getEquipType(HashMap<String, String> paramMap);
	
	/**
	 * 고장통계화면의 조회대상 팝업화면 -> 선택된 장비의 시스템 조회(장비리스트)
	 * @return
	 */
	List<Map<String, String>> getSearchSystemList(HashMap<String, String> paramMap);
	
	/**
	 * 고장통계화면에서 사용자가 선택한 조건을 가지고 조회
	 * @param paramMap
	 * @return
	 */
	List<Map<String, String>> searchFailureAlarm(HashMap<String, Object> paramMap);
	
	/**
	 * 고장통계화면의 특정알람 설정 팝업화면 -> 알람그룹 조회
	 * @return
	 */
	List<Map<String, String>> searchAlarmGroupSelect();

	/**
	 * 장비별 알람분석에서 사용자가 선택한 조건을 가지고 조회
	 * @param paramMap
	 * @return
	 */
	Map<String,Object> getAlarmAnalysisByEquip(HashMap<String, Object> paramMap);

	/**
	 * 장비별 알람분석에서 알람코드별 라디오버튼 팝업화면 -> 알람코드 조회                                                                                                                                                                                                                                                                                     
	 * @return
	 */
	List<Map<String, String>> alarmCodeSelect(HashMap<String, String> paramMap);

	/**
	 * 장비별 알람붙석에서 데이터 개수 클릭 시 해당 데이터 리스트 조회하여 팝업
	 * @param paramMap
	 * @return
	 */
	List<Map<String, String>> getEquipAnalysisDetailData(HashMap<String, Object> paramMap);
	
	/**
	 * 시간별 알람 카운트 조회
	 * @param paramMap
	 * @return
	 */
	Map<String, Object> selectAlarmByTime(HashMap<String, Object> paramMap);

	/**
	 * 고장상세조회 Excel 출력
	 * @param paramMap
	 * @return
	 */
	public Workbook getExcelWorkbook(HashMap<String, Object> paramMap);

	/**
	 * 시간별 알람붙석에서 데이터 개수 클릭 시 해당 데이터 리스트 조회하여 팝업
	 * @param paramMap
	 * @return
	 */
	List<Map<String, String>> getTimeAnalysisDetailData(HashMap<String, Object> paramMap);
}
