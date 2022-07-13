package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.FailureSearchDAO;
import com.ltem.service.FailureSearchService;
import com.ltem.utils.CreateExcel;

@Service("failureSearchService")
public class FailureSearchServiceImpl implements FailureSearchService {

	@Autowired
	FailureSearchDAO failureSearchDAO;
	
	@Autowired
	CodeDAO codeDAO;
	
	private static final Logger log = LoggerFactory.getLogger(FailureSearchServiceImpl.class);
	
	@Override
	public List<Map<String, String>> getSearchSystemList(HashMap<String, String> paramMap) {
		
		List<Map<String,String>> searchSystemList = failureSearchDAO.selectSearchSystemList(paramMap);

		return searchSystemList;
	}
	
	@Override
	public List<Map<String, String>> searchFailureAlarm(HashMap<String, Object> paramMap) {
		
		List<Map<String, String>> searchFailureAlarmList = failureSearchDAO.selectFailureAlarmSearch(paramMap);
		
		return searchFailureAlarmList;
	}
	
	@Override
	public Map<String,Object> getAlarmAnalysisByEquip(HashMap<String, Object> paramMap) {
		
		List<Map<String, String>> alarmCodeList = failureSearchDAO.selectAlarmCodeList(paramMap);
		paramMap.put("alarmCodeList", alarmCodeList);
		List<Map<String, String>> alarmAnalysisTableList = failureSearchDAO.selectAlarmAnalysisTableList(paramMap);

		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("alarmCodeList", alarmCodeList);
		resultMap.put("alarmAnalysisTableList", alarmAnalysisTableList);
		
		if(paramMap.get("graphType").equals("equip")){
			List<String> alarmTypeList = failureSearchDAO.selectAlarmTypeList(paramMap);
			paramMap.put("alarmTypeList", alarmTypeList);
			List<Map<String, String>> alarmAnalysisGraphList = failureSearchDAO.selectAlarmAnalysisGraphList(paramMap);			

			resultMap.put("alarmTypeList", alarmTypeList);
			resultMap.put("alarmAnalysisGraphList", alarmAnalysisGraphList);
		}
		
		return resultMap;
	}

	@Override
	public List<Map<String, String>> getEquipAnalysisDetailData(HashMap<String, Object> paramMap) {
		
		List<Map<String, String>> alarmCodeList = failureSearchDAO.selectAlarmCodeList(paramMap);
		paramMap.put("alarmCodeList", alarmCodeList);
		List<Map<String, String>> equipAnalysisDetailData = failureSearchDAO.getEquipAnalysisDetailData(paramMap);
		
		return equipAnalysisDetailData;
	}

	@Override
	public List<Map<String, String>> getTimeAnalysisDetailData(HashMap<String, Object> paramMap) {
		
		List<Map<String, String>> alarmCodeList = failureSearchDAO.selectAlarmCodeList(paramMap);
		paramMap.put("alarmCodeList", alarmCodeList);
		List<Map<String, String>> timeAnalysisDetailData = failureSearchDAO.getTimeAnalysisDetailData(paramMap);
		
		return timeAnalysisDetailData;
	}
	
	@Override
	public List<Map<String, String>> searchAlarmGroupSelect() {
		
		List<Map<String, String>> alarmGroupList = failureSearchDAO.selectAlarmGroupList();
		
		return alarmGroupList;
	}
	
	@Override
	public List<Map<String, String>> alarmCodeSelect(HashMap<String, String> paramMap) {

		List<Map<String, String>> alarmCodeList = failureSearchDAO.selectPopupAlarmCodeList(paramMap);
		
		return alarmCodeList;
	}

	@Override
	public Map<String, List<Map<String, String>>> getEquipType(HashMap<String, String> paramMap) {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String,String>> equipTypeList = failureSearchDAO.selectEquipType(paramMap);
		List<Map<String,String>> lineList = codeDAO.selectStationLine();
		
		returnMap.put("EQUIPTYPELIST", equipTypeList);
		returnMap.put("LINELIST", lineList);
		
		return returnMap;
	}
	
	@Override
	public Map<String, Object> selectAlarmByTime(HashMap<String, Object> paramMap) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		List<String> alarmTypeList = failureSearchDAO.selectAlarmTypeList(paramMap);
		
		paramMap.put("alarmTypeList", alarmTypeList);
		List<Map<String, String>> alarmCntList =  failureSearchDAO.selectAlarmByTime(paramMap);

		Map<String, Integer> timeList = new HashMap<String, Integer>();
		if("date".equals(paramMap.get("graphType"))) {
			timeList = failureSearchDAO.getTimeListAlarmByTime(paramMap);
			resultMap.put("timeList", timeList.get("TIME_LIST"));
		}

		resultMap.put("alarmCntList", alarmCntList);
		resultMap.put("alarmTypeList", alarmTypeList);
		return resultMap;
	}

	@Override
	public Workbook getExcelWorkbook(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> getExcelDownData = new HashMap<String, List<Map<String, String>>>();

		ArrayList<Object> tmpList = new ArrayList<>();
		paramMap.put("sortOption", new ArrayList<>());

		try {
			getExcelDownData.put("전체", searchFailureAlarm(paramMap));
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		ArrayList<String> headerList = new ArrayList<String>();
		ArrayList<String> columnList = new ArrayList<String>();

		columnList.add("SYSTEM_NAME");
		columnList.add("ALARM_CODE");
		columnList.add("PROBABLE_CAUSE");
		columnList.add("EQUIP_NAME");
		columnList.add("GRADE_TXT");
		columnList.add("ALARM_STATE_TXT");
		columnList.add("EVENT_TIME");
		columnList.add("RECOVER_TIME");
		columnList.add("TIME_TO_REPAIR");
		columnList.add("ALARM_TYPE_TXT");
		columnList.add("VENDOR_NAME");
		columnList.add("TEAM_NAME");
		columnList.add("FDN");

		headerList.add("장비명");
		headerList.add("알람코드");
		headerList.add("알람명");
		headerList.add("장비종류");
		headerList.add("알람등급");
		headerList.add("알람상태");
		headerList.add("발생시간");
		headerList.add("복구시간");
		headerList.add("고장시간(시)");
		headerList.add("고장분류");
		headerList.add("제조사");
		headerList.add("팀");
		headerList.add("발생위치");

		String headerStr = "고장상세조회";

		CreateExcel excel = new CreateExcel();
		Workbook xlsxWb = excel.create_Excel(getExcelDownData, headerList, headerStr, columnList);

		return xlsxWb;
	}
}
