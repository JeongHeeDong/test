package com.ltem.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ltem.dao.StationMonitorDAO;
import com.ltem.service.StationMonitorService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("StationMonitorService")
public class StationMonitorServiceImpl extends EgovAbstractServiceImpl implements StationMonitorService {

	@Autowired
	StationMonitorDAO StationMonitorDAO;

	@Value("#{locationconfig['ru.cell.type']}")
	private String ruCellType;
	
	private static final Logger log = LoggerFactory.getLogger(StationMonitorServiceImpl.class);
	
	@Override
	public Map<String, Object> getStationMonitorTime() {

		Map<String,Object> resultMap = StationMonitorDAO.getStationMonitorTime();

		return resultMap;
	}

	@Override
	public Map<String, Object> getTotData(HashMap<String, Object> paramMap) {

		paramMap.put("ruCellType", ruCellType);
		Map<String,Object> resultMap = StationMonitorDAO.getTotData(paramMap);
		
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getStationInfoData() {

		List<Map<String,Object>> resultList = StationMonitorDAO.getStationInfoData();
		return resultList;
	}

	@Override
	public List<Map<String, Object>> getStationTotData(HashMap<String, Object> paramMap) {
		
		List<Map<String,Object>> resultList = StationMonitorDAO.getStationTotData(paramMap);
		return resultList;
	}

	@Override
	public List<Map<String, String>> getStationData(HashMap<String, Object> paramMap) {
		
		paramMap.put("ruCellType", ruCellType);
		if (paramMap.get("stationId") instanceof Integer ) {
			paramMap.put("stationId", paramMap.get("stationId").toString());
		}
		List<Map<String,String>> resultList = StationMonitorDAO.getStationData(paramMap);
		return resultList;
	}

	@Override
	public Map<String, Object> getStationQualityTrend(HashMap<String, Object> paramMap) {
		
		Map<String,Object> resultMap = new HashMap<>();
		List<String> category = new ArrayList<>();
		List<Integer> attempts = new ArrayList<>();
		List<Float> answerRates = new ArrayList<>();
		List<Float> rrcRates = new ArrayList<>();
		List<Float> cdRates = new ArrayList<>();
		List<Float> attRates = new ArrayList<>();
		List<Float> erabRates = new ArrayList<>();
		List<Integer> erabs = new ArrayList<>();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm");
		Date startTimeToDate;
		Date endTimeToDate;
		String startTime = paramMap.get("startEventTime") == null ? "" :(String) paramMap.get("startEventTime");
		String endTime = paramMap.get("eventTime") == null ? "" :(String) paramMap.get("eventTime");

		try {
			endTimeToDate = sdf.parse(endTime);
			if("".equals(startTime)) {
				startTime = sdf.format(endTimeToDate.getTime() - 10800000);
			}

			startTimeToDate = sdf.parse(startTime);

			if(startTimeToDate.getTime() > endTimeToDate.getTime()) {
				//검색 시작 시간이 끝 시간보다 클 수는 없다.
				//로직 추가 필요
				//return false
			}

			paramMap.put("startEventTime", startTime);

		} catch (Exception e) {
			log.error(e.getMessage());
		}

		paramMap.put("ruCellType", ruCellType);
		List<Map<String,Object>> trendList = StationMonitorDAO.getStationQualityTrend(paramMap);

		//chart x축 데이터
		ArrayList<String> timeList = new ArrayList<String>();
//		Calendar cal = Calendar.getInstance();
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(sdf.parse(startTime));
		} catch (ParseException e) {
			log.error(e.getMessage());
		}

		String stdDate = startTime;
		while(stdDate.compareTo(endTime) <= 0){
			timeList.add(sdf.format(cal.getTime()));
			cal.add(Calendar.MINUTE, 5);
			stdDate = sdf.format(cal.getTime());
		}

		boolean isfirst = true;
		for(String time : timeList){
			isfirst = true;
			for(Map map : trendList){
				if(time.equals((String)map.get("EVENT_TIME"))){
					isfirst = false;
					category.add((String) map.get("EVENT_TIME"));
					attempts.add((Integer)map.get("ATTEMPT"));
					answerRates.add((Float)map.get("ANSWER_RATE"));
					rrcRates.add((Float)map.get("RRC_RATE"));
					cdRates.add((Float)map.get("CD_RATE"));
					
					attRates.add((Float)map.get("ATT_RATE"));
					erabRates.add((Float)map.get("ERAB_ATT_RATE"));
					erabs.add((Integer)map.get("ERAB_ATTEMPT"));
					break;
				}
			}
			if(isfirst){
				category.add(time);
				attempts.add(0);
				answerRates.add(0.0f);
				rrcRates.add(0.0f);
				cdRates.add(0.0f);
				
				attRates.add(0.0f);
				erabRates.add(0.0f);
				erabs.add(0);
			}
		}

		resultMap.put("START_EVENT_TIME",	startTime);
		resultMap.put("END_EVENT_TIME",		endTime);
		resultMap.put("STATION_ID",			paramMap.get("stationId"));
		resultMap.put("STATION_NAME",		paramMap.get("stationName"));
		resultMap.put("DU_ID",				paramMap.get("duId"));
		resultMap.put("DU_NAME",			paramMap.get("duName"));
		resultMap.put("RU_NAME",			paramMap.get("ruName"));
		resultMap.put("RU_CUID",			paramMap.get("ruId"));
		resultMap.put("CATEGORY",			category);
		resultMap.put("ATTEMPTS",			attempts);
		resultMap.put("ANSWER_RATES",		answerRates);
		resultMap.put("RRC_RATES",			rrcRates);
		resultMap.put("CD_RATES",			cdRates);
		
		resultMap.put("ATT_RATE",			attRates);
		resultMap.put("ERAB_ATT_RATE",		erabRates);
		resultMap.put("ERAB_ATTEMPT",		erabs);

		return resultMap;
	}


	@Override
	public Map<String, List<Map<String, String>>> excelExport(HashMap<String, Object> paramMap) {
		
		Map<String, List<Map<String, String>>> getExcelDownData = new HashMap<String, List<Map<String, String>>>();
		paramMap.put("sortOption", new ArrayList());
		paramMap.put("filterLevel", "0");
		List<Map<String, String>> excelData = getStationData(paramMap);
		try {
			
			String stationId = (String)paramMap.get("stationId");
			if ( paramMap.get("stationId") == null || "".equals(stationId)
					|| "9999".equals(stationId) || "9998".equals(stationId) || "9990".equals(stationId)) {
				
				String lineId = (String)paramMap.get("lineId");
				if(paramMap.get("lineId") == null || "".equals(lineId) || !"-1".equals(lineId)) {
					getExcelDownData.put(lineId+"호선", excelData);
				}else {
					getExcelDownData.put("전체", excelData);
				}
				
			}else {
				getExcelDownData.put((String) (paramMap.get("stationName")), excelData);
			}

		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		
		return getExcelDownData;
	}
	
}
