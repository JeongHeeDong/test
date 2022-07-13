package com.ltem.service.impl;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.FailureDAO;
import com.ltem.service.FailureService;
import com.ltem.utils.CreateExcel;

@Service("failureService")
public class FailureServiceImpl implements FailureService {

	@Autowired
	FailureDAO failureDAO;
	
	@Autowired
	CodeDAO codeDAO;
	
	@Value("#{locationconfig['alarm.audiofilepath']}")
	String audioFilePath;
	
	@Value("#{locationconfig['failure.alarm.audiofilepath']}")
	String failureAudioFilePath;
	
	private static final Logger log = LoggerFactory.getLogger(FailureServiceImpl.class);
		
	@Override
	public Map<String, List<Map<String, String>>> getFailureData(HashMap<String,String> paramMap) {
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String,String>> failureList = failureDAO.selectFailureData(paramMap);
		
//		List<Map<String,String>> resultList = new ArrayList<Map<String,String>>();
//		for(Map<String,String> mfData : majorFailureData){
//			Map<String,String> tmpMap = new HashMap<String,String>();
//			tmpMap.put("EVENT_TIME", mfData.get("EVENT_TIME")); 
//		}
		returnMap.put("failureList", failureList);
		return returnMap;
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getMajorFailureData(List<HashMap<String,String>> paramList) {
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		String al_code="";
		log.info(paramList.toString());
		
		for(HashMap<String,String> map : paramList){
			//log.info(map.get("ALARM_CODE"));
			//log.info(al_code);
			al_code = al_code+"'"+map.get("ALARM_CODE")+"',";
		}
		
		if(!"".equals(al_code)) al_code = al_code.substring(0,al_code.length()-1);
		log.info(al_code);
		
		List<Map<String,String>> majorFailureList = failureDAO.selectMajorFailureData(al_code);
		
//		List<Map<String,String>> resultList = new ArrayList<Map<String,String>>();
//		for(Map<String,String> mfData : majorFailureData){
//			Map<String,String> tmpMap = new HashMap<String,String>();
//			tmpMap.put("EVENT_TIME", mfData.get("EVENT_TIME")); 
//		}
		returnMap.put("majorFailureList", majorFailureList);
		return returnMap;
	}

	@Override
	public Map<String, List<Map<String, String>>> getActionCaseData(HashMap<String,String> paramMap) {
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String,String>> actionCaseList = failureDAO.selectActionCaseData(paramMap);
		
		returnMap.put("actionCaseList", actionCaseList);
		return returnMap;
	}

	@Override
	public Map<String, List<Map<String, String>>> getUnrecoveredData() {
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String, String>> setDataList = failureDAO.selectUnrecoveredAlarmSettingData();
		Map<String,String> paramMap = new HashMap<String,String>();
		
		if(setDataList.size() != 0){
			paramMap = setDataList.get(0);
			if (paramMap.get("USE_FLAG_CRITICAL").equals("Y") || paramMap.get("USE_FLAG_MAJOR").equals("Y")
					|| paramMap.get("USE_FLAG_MINOR").equals("Y"))
				paramMap.put("SETFLAG", "Y");
		}else{
			paramMap.put("SETFLAG", "N");
		}
		
		List<Map<String,String>> unrecoveredList = failureDAO.selectUnrecoveredData(paramMap);
		
		returnMap.put("unrecoveredList", unrecoveredList);
		return returnMap;
	}

	@Override
	public Map<String, List<Map<String, String>>> getRopMsgData(HashMap<String, String> paramMap) {
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String,String>> ropMsgList = failureDAO.selectRopMsgData(paramMap);
		
		returnMap.put("ropMsgList", ropMsgList);
		return returnMap;
	}

	@Override
	public String setAlarmGradeFilter(String userId, List<HashMap<String,String>> paramList) {
		failureDAO.deleteAlarmGradeFilter(userId);
		for(HashMap<String, String> map : paramList) {
			if("9".equals(map.get("SEVERITY"))){
				continue;
			}
			map.put("USER_ID", userId);
			failureDAO.insertAlarmGradeFilter(map);
		}
		return "Success!";
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getAlarmGradeFilter(String userId) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String, String>> alarmGradeFilterList = failureDAO.selectAlarmGradeFilter(userId);
		List<Map<String, String>> equipActList = failureDAO.selectEquipAct();
		
		returnMap.put("alarmGradeFilterList", alarmGradeFilterList);
		returnMap.put("equipActList", equipActList);
		return returnMap;
	}

	@Override
	public List<Map<String, String>> gridAlarmCodeTree() {
		List<Map<String, String>> returnList = failureDAO.selectAlarmCodeTree();
		return returnList;
	}
	
	@Override
	public String setAlarmCodeFilter(String userId, List<HashMap<String, String>> paramList) {
		failureDAO.deleteAlarmCodeFilter(userId);
		for(HashMap<String, String> map : paramList) {
			map.put("USER_ID", userId);
			failureDAO.insertAlarmCodeFilter(map);
		}
		return "Success!";
	}

	@Override
	public Map<String, List<Map<String, String>>> getAlarmCodeFilter(String userId) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String, String>> alarmCodeFilterList = failureDAO.selectAlarmCodeFilter(userId);
		
		returnMap.put("alarmCodeFilterList", alarmCodeFilterList);
		return returnMap;
	}
	
	
	@Override
	public List<Map<String, String>> getFailureSpecAlarm(HashMap<String, Object> paramMap) {
		List<Map<String, String>> returnList = failureDAO.selectFailureSpecAlarm(paramMap);
		
		return returnList;
	}
	
	@Override
	public Map<String, Map<String, Object>> getFailureSpecGraph(HashMap<String, Object> paramMap) {
		Map<String, Map<String,Object>> returnMap = new HashMap<String,Map<String,Object>>();
		
		// 시간별 추이 차트 데이터 조회시 조회범위가 24시간 이상일 경우 시간단위, 미만일 경우 분단위로 데이터 조회.
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String fromTime = Objects.toString(paramMap.get("fromTime"), "");
		String toTime = Objects.toString(paramMap.get("toTime"), "");

		long days = 0;
		try {
			long diff = sdf.parse(toTime).getTime() - sdf.parse(fromTime).getTime();
			days = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
		} catch (ParseException e) {
			log.error(e.getMessage());
		}
		if(days >= 1) {
			paramMap.put("isDay", true);
		} else {
			paramMap.put("isDay", false);
		}
		
		List<Map<String, String>> tempdataList = failureDAO.selectFailureSpecGraphByDatetime(paramMap);
		List<Map<String, String>> _tempdataList = failureDAO.selectFailureSpecGraphByAlarmcode(paramMap);
		
		returnMap.put("failureSpecGraphByDatetime", createGraphData(tempdataList, "date"));
		returnMap.put("failureSpecGraphByAlarmcode", createGraphData(_tempdataList, "alarm"));
		
		return returnMap;
	}
	
	public Map<String,Object> createGraphData(List<Map<String, String>> tempdataList, String type){
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		ArrayList<String> timeList = new ArrayList<String>();
		List<Map<String,Object>> tempList = new ArrayList<Map<String,Object>>();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		
		if(tempdataList.size() != 0){
			Set	key = tempdataList.get(0).keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				if(!keyname.equals("EVENT_TIME") && !keyname.equals("ALARM_CODE") && !keyname.equals("BUNCH_CODE")){
					dataMap.put("Column", keyname);
					dataMap.put("name", getName(keyname).split(",")[0]);
					dataMap.put("type", getName(keyname).split(",")[1]);
					dataMap.put("suffix",getName(keyname).split(",")[2]);
					dataMap.put("yAxis", getName(keyname).split(",")[3]);
					dataMap.put("zIndex", getName(keyname).split(",")[4]);
					tempList.add(dataMap);
					dataMap = new HashMap<String,Object>();
				}
			}
		}
		
		boolean isFirst = true;
		for (Map tempMap : tempList) {
			ArrayList dataArray = new ArrayList();
			for (Map map : tempdataList) {
				dataArray.add(map.get(tempMap.get("Column")));
				
				if(isFirst){
					if("date".equals(type)) timeList.add((String) map.get("EVENT_TIME"));
					else if("alarm".equals(type)) timeList.add((String) map.get("ALARM_CODE"));
					else timeList.add((String) map.get("BUNCH_CODE"));
				}
			}
			isFirst = false;
			tempMap.put("data", dataArray);
			returnList.add(tempMap);
			
		}
		
		returnMap.put("timeList", timeList);
		returnMap.put("graphData", returnList);
		
		return returnMap;
	}
	
	public String getName(String col){
		
		String returnStr = "";
		
		if("CRITICAL".equals(col)){
			returnStr = "CRITICAL,spline,건,0,84";
		}else if("MAJOR".equals(col)){
			returnStr = "MAJOR,spline,건,0,83";
		}else if("MINOR".equals(col)){
			returnStr = "MINOR,spline,건,0,82";
		}else if("NORMAL".equals(col)){
			returnStr = "NORMAL,spline,건,0,81";
		}else if("CNT".equals(col)){
			returnStr = "건수,column,건,0,80";
		}
		
		return returnStr;
	}

	@Override
	public List<Map<String, String>> getSearchBunchAlarms(HashMap<String, String> paramMap) {
		
		List<Map<String, String>> searchBunchAlarms = failureDAO.selectSearchBunchAlarms(paramMap);
		return searchBunchAlarms;
	}

	@Override
	public List<Map<String, String>> getFailureBunchSpecAlarm(HashMap<String, Object> paramMap) {
		
		List<Map<String, String>> returnList = failureDAO.selectFailureBunchSpecAlarm(paramMap);
		
		return returnList;
	}
	
	@Override
	public Map<String,Map<String,Object>> getBunchGraphData(HashMap<String, Object> paramMap) {
		
		
		Map<String, Map<String,Object>> returnMap = new HashMap<String,Map<String,Object>>();
		
		List<Map<String, String>> tempdataList = failureDAO.selectFailureBunchSpecGraphByDatetime(paramMap);
		List<Map<String, String>> _tempdataList = failureDAO.selectFailureBunchSpecGraphByAlarmcode(paramMap);
		
		returnMap.put("failureBunchSpecGraphByDatetime", createGraphData(tempdataList, "date"));
		returnMap.put("failureBunchSpecGraphByAlarmcode", createGraphData(_tempdataList, "bunch"));
		
		return returnMap;
		
	}

	@Override
	public List<Map<String, String>> getBunchFailureSettingData() {
		List<Map<String, String>> resultList = failureDAO.selectBunchFailureSettingData();
		return resultList;
	}

	@Override
	public Map<String,String> getBunchCodeMax() {
		Map<String,String> resultMap = failureDAO.selectBunchCodeMax();
		return resultMap;
	}

	@Override
	public List<Map<String, String>> getVendorData() {
		List<Map<String, String>> resultList = failureDAO.selectVendorData();
		return resultList;
	}

	@Override
	public List<Map<String, String>> getEquipData() {
		List<Map<String, String>> resultList = failureDAO.selectEquipData();
		return resultList;
	}

	@Override
	public List<Map<String, String>> getEquipVendorData() {
		List<Map<String, String>> resultList = failureDAO.selectEquipVendorData();
		return resultList;
	}

	@Override
	public List<Map<String, String>> getAlarmCodeData() {
		List<Map<String, String>> resultList = failureDAO.selectAlarmCodeData();
		return resultList;
	}
	
	@Override
	public List<Map<String, String>> getSystemData(HashMap<String,String> paramMap) {
		List<Map<String, String>> resultList = failureDAO.selectSystemData(paramMap);
		return resultList;
	}

	@Override
	public List<Map<String, String>> getAlarmCodeTableData(HashMap<String, String> paramMap) {
		List<Map<String, String>> resultList = failureDAO.selectAlarmCodeTableData(paramMap);
		return resultList;
	}

	@Override
	public String addBunchFailure(HashMap<String, String> paramMap) {
		failureDAO.insertBunchFailure(paramMap);
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public String editBunchFailure(HashMap<String, String> paramMap) {
		failureDAO.deleteBunchFailure(paramMap);
		failureDAO.insertBunchFailure(paramMap);
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public String delBunchFailure(List<HashMap<String,String>> paramList) {
		for(HashMap<String, String> map : paramList) {
			failureDAO.deleteBunchFailure(map);			
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public List<Map<String, String>> getActionCaseSettingData(HashMap<String, Object> paramMap) {
		List<Map<String, String>> returnList = failureDAO.selectActionCaseSettingData(paramMap);
		return returnList;
	}

	@Override
	public String addFailureActionCase(HashMap<String,Object> paramMap) {
		failureDAO.insertFailureActionCase(paramMap);
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public String modifyFailureActionCase(HashMap<String, Object> paramMap) {
//		failureDAO.deleteFailureActionCase(paramMap);
//		failureDAO.insertFailureActionCase(paramMap);
		String retStr = "";
		int returnFlag = 0;
		returnFlag = failureDAO.modifyFailureActionCase(paramMap);
		if(returnFlag < 1) {
			retStr = "실패하였습니다.";
		} else {
			retStr = "정상적으로 처리 되었습니다.";
		}
		return retStr;
	}

	@Override
	public String delFailureActionCase(List<HashMap<String, Object>> paramList) {
		String retStr = "";
		int returnFlag = 0;
		for(HashMap m : paramList) {
			try {
				returnFlag = failureDAO.deleteFailureActionCase(m);
				retStr = "정상적으로 처리 되었습니다.";
			} catch(Exception e) {
				e.printStackTrace();

				retStr = "에러발생";
			}
		}
		return retStr;
	}

	@Override
	public List<Map<String, String>> getAudioSettingData(HashMap<String,String> paramMap) {
		List<Map<String, String>> returnList = failureDAO.selectAudioSettingData(paramMap);
		return returnList;
	}

	@Override
	public String addAudioFile(HttpServletRequest request) {

		MultipartRequest mpRequest = (MultipartRequest)request;
		
		String monitorType = request.getParameter("monitorType_settingAudio");
		String severity = "";
		String filePath = "";
		String volumeLevel = "";
		String configPath = "";
		
		if("1".equals(monitorType)){
			configPath = audioFilePath;				
		} else if("2".equals(monitorType)){
			configPath = failureAudioFilePath;
		}
		
		
		if(request.getParameter("chk_critical") != null && !request.getParameter("chk_critical").isEmpty()){
			
			/*if(mpRequest.getFile("audioFileInput_critical") == null || request.getParameter("fileName_critical") == null || request.getParameter("volumeLevel_critical") == null
					|| "".equals(request.getParameter("fileName_critical")) || "".equals(request.getParameter("volumeLevel_critical"))){
				return "적용할 등급의 입력 값을 모두 채워주세요.";
			}*/
			
			if(request.getParameter("fileName_critical") == null || request.getParameter("volumeLevel_critical") == null
					|| "".equals(request.getParameter("fileName_critical")) || "".equals(request.getParameter("volumeLevel_critical"))){
				return "적용할 등급의 입력 값을 모두 채워주세요.";
			}
			
			severity = "1";
			volumeLevel = request.getParameter("volumeLevel_critical");
			HashMap<String,String> paramMap = new HashMap<String,String>();
			if(mpRequest.getFile("audioFileInput_critical") == null){ //파일이 바뀌지 않은경우
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("VOLUME", volumeLevel);
				failureDAO.updateAudioSettingData(paramMap);
			} else { //파일이 바뀐경우
				/*가청파일 이외 저장할 데이터 세팅*/
				filePath = configPath + request.getParameter("fileName_critical");
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("FILE_PATH", filePath);
				paramMap.put("VOLUME", volumeLevel);
				
				/*가청파일 세팅*/
				MultipartFile mFile = mpRequest.getFile("audioFileInput_critical");
				File file = new File(configPath,  mFile.getOriginalFilename());
				
				/*데이는 DB에 저장. 가청파일은 실체 서버 경로에 저장*/
				try {
//					failureDAO.deleteAudioSettingData(paramMap);
//					failureDAO.insertAudioSettingData(paramMap);
					failureDAO.updateAudioSettingData(paramMap);
					mFile.transferTo(file);
				} catch (IOException e) {
					log.error(e.getMessage());
				}
			}
		} 
		if(request.getParameter("chk_major") != null && !request.getParameter("chk_major").isEmpty()){
			
			if(request.getParameter("fileName_major") == null || request.getParameter("volumeLevel_major") == null
					|| "".equals(request.getParameter("fileName_major")) || "".equals(request.getParameter("volumeLevel_major"))){
				return "적용할 등급의 입력 값을 모두 채워주세요.";
			}
			
			severity = "2";
			volumeLevel = request.getParameter("volumeLevel_major");
			HashMap<String,String> paramMap = new HashMap<String,String>();
			if(mpRequest.getFile("audioFileInput_major") == null){ //파일이 바뀌지 않은경우
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("VOLUME", volumeLevel);
				failureDAO.updateAudioSettingData(paramMap);
			} else { //파일이 바뀐경우
				/*가청파일 이외 저장할 데이터 세팅*/
				filePath = configPath + request.getParameter("fileName_major");
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("FILE_PATH", filePath);
				paramMap.put("VOLUME", volumeLevel);
				
				/*가청파일 세팅*/
				MultipartFile mFile = mpRequest.getFile("audioFileInput_major");
				File file = new File(configPath,  mFile.getOriginalFilename());
				
				/*데이는 DB에 저장. 가청파일은 실체 서버 경로에 저장*/
				try {
//					failureDAO.deleteAudioSettingData(paramMap);
//					failureDAO.insertAudioSettingData(paramMap);
					failureDAO.updateAudioSettingData(paramMap);
					mFile.transferTo(file);
				} catch (IOException e) {
					log.error(e.getMessage());
				}
			}
		} 
		if(request.getParameter("chk_minor") != null && !request.getParameter("chk_minor").isEmpty()){
			
			if(request.getParameter("fileName_minor") == null || request.getParameter("volumeLevel_minor") == null
					|| "".equals(request.getParameter("fileName_minor")) || "".equals(request.getParameter("volumeLevel_minor"))){
				return "적용할 등급의 입력 값을 모두 채워주세요.";
			}
			
			severity = "3";
			volumeLevel = request.getParameter("volumeLevel_minor");
			HashMap<String,String> paramMap = new HashMap<String,String>();
			if(mpRequest.getFile("audioFileInput_minor") == null){ //파일이 바뀌지 않은경우
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("VOLUME", volumeLevel);
				failureDAO.updateAudioSettingData(paramMap);
			} else { //파일이 바뀐경우
				/*가청파일 이외 저장할 데이터 세팅*/
				filePath = configPath + request.getParameter("fileName_minor");
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("FILE_PATH", filePath);
				paramMap.put("VOLUME", volumeLevel);
				
				/*가청파일 세팅*/
				MultipartFile mFile = mpRequest.getFile("audioFileInput_minor");
				File file = new File(configPath,  mFile.getOriginalFilename());
				
				/*데이는 DB에 저장. 가청파일은 실체 서버 경로에 저장*/
				try {
	//				failureDAO.deleteAudioSettingData(paramMap);
	//				failureDAO.insertAudioSettingData(paramMap);
					failureDAO.updateAudioSettingData(paramMap);
					mFile.transferTo(file);
				} catch (IOException e) {
					log.error(e.getMessage());
				}	
			}
		} 
		if(request.getParameter("chk_warning") != null && !request.getParameter("chk_warning").isEmpty()){

			if(request.getParameter("fileName_warning") == null || request.getParameter("volumeLevel_warning") == null
					|| "".equals(request.getParameter("fileName_warning")) || "".equals(request.getParameter("volumeLevel_warning"))){
				return "적용할 등급의 입력 값을 모두 채워주세요.";
			}			
			
			severity = "4";
			volumeLevel = request.getParameter("volumeLevel_warning");
			HashMap<String,String> paramMap = new HashMap<String,String>();
			if(mpRequest.getFile("audioFileInput_warning") == null){ //파일이 바뀌지 않은경우
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("VOLUME", volumeLevel);
				failureDAO.updateAudioSettingData(paramMap);
			} else { //파일이 바뀐경우
				/*가청파일 이외 저장할 데이터 세팅*/
				filePath = configPath + request.getParameter("fileName_warning");
				paramMap.put("MONITOR_TYPE", monitorType);
				paramMap.put("SEVERITY", severity);
				paramMap.put("FILE_PATH", filePath);
				paramMap.put("VOLUME", volumeLevel);
				
				/*가청파일 세팅*/
				MultipartFile mFile = mpRequest.getFile("audioFileInput_warning");
				File file = new File(configPath,  mFile.getOriginalFilename());
				
				/*데이는 DB에 저장. 가청파일은 실체 서버 경로에 저장*/
				try {
//					failureDAO.deleteAudioSettingData(paramMap);
//					failureDAO.insertAudioSettingData(paramMap);
					failureDAO.updateAudioSettingData(paramMap);
					mFile.transferTo(file);
				} catch (IOException e) {
					log.error(e.getMessage());
				}
			}
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public List<Map<String, String>> getUnrecoveredAlarmSettingData() {
		List<Map<String, String>> returnList = failureDAO.selectUnrecoveredAlarmSettingData();
		return returnList;
	}

	@Override
	public String addUnrecoveredAlarmTime(List<HashMap<String, String>> paramList) {
		for(HashMap<String, String> map : paramList) {
			failureDAO.insertUnrecoveredAlarmTime(map);
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override //현재 사용안함(2016.02.19)
	public String addUnrecoveredAlarmCode(List<HashMap<String, String>> paramList) {
		for(HashMap<String, String> map : paramList) {
			failureDAO.deleteUnrecoveredAlarmCode(map);
			failureDAO.insertUnrecoveredAlarmCode(map);
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override //현재 사용안함(2016.02.19)
	public List<Map<String,String>> getUnrecoveredAlarmCode(HashMap<String, String> paramMap) {
		List<Map<String, String>> returnList = failureDAO.selectUnrecoveredAlarmCode(paramMap);
		return returnList;
	}
	
	
	@Override
	public List<Map<String, String>> gridSystemTree() {
		List<Map<String, String>> returnList = failureDAO.selectSystemTree();
		return returnList;
	}

	@Override
	public String setSystemFilter(String userId,List<HashMap<String, String>> paramList) {
		failureDAO.deleteSystemFilter(userId);
		for(HashMap<String, String> map : paramList) {
			map.put("USER_ID", userId);
			failureDAO.insertSystemFilter(map);
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public Map<String, List<Map<String, String>>> getSystemFilter(String userId) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String, String>> systemFilterList = failureDAO.selectSystemFilter(userId);
		
		returnMap.put("systemFilterList", systemFilterList);
		return returnMap;
	}

	@Override
	public List<Map<String, String>> gridMajorAlarmTree() {
		List<Map<String, String>> returnList = failureDAO.selectMajorAlarmTree();
		return returnList;
	}

	@Override
	public String setMajorAlarmFilter(String userId,List<HashMap<String, String>> paramList) {
		failureDAO.deleteMajorAlarmFilter(userId);
		for(HashMap<String, String> map : paramList) {
			map.put("USER_ID", userId);
			failureDAO.insertMajorAlarmFilter(map);
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public Map<String, List<Map<String, String>>> getMajorAlarmFilter(String userId) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String, String>> alarmCodeFilterList = failureDAO.selectMajorAlarmFilter(userId);
		
		returnMap.put("majorAlarmFilterList", alarmCodeFilterList);
		return returnMap;
	}

	@Override
	public List<Map<String, String>> gridStationTree() {
		List<Map<String, String>> returnList = failureDAO.selectStationTree();
		return returnList;
	}

	@Override
	public String setStationFilter(String userId,List<HashMap<String, String>> paramList) {
		failureDAO.deleteStationFilter(userId);
		
		for(HashMap<String, String> map : paramList) {
			map.put("USER_ID", userId);
			failureDAO.insertStationFilter(map);
		}
		return "정상적으로 처리 되었습니다.";
	}

	@Override
	public Map<String, List<Map<String, String>>> getStationFilter(String userId) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		List<Map<String, String>> stationFilterList = failureDAO.selectStationFilter(userId);
		
		returnMap.put("stationFilterList", stationFilterList);
		return returnMap;
	}

	@Override
	public List<Map<String, String>> getDuStationInfo() {
		
		List<Map<String, String>> returnList = failureDAO.getDuStationInfo();

		return returnList;
	}

	@Override
	public Map<String, Object> getStationInfo() {
		Map<String, Object> resultMap = new HashMap<>();
		List<Map<String, String>> duStationInfo = failureDAO.getDuStationInfo();
		List<Map<String, String>> ruStationInfo = failureDAO.getRuStationInfo();
		List<Map<String, String>> swStationInfo = failureDAO.getSwitchStationInfo();
		List<Map<String, String>> jrgStationInfo = failureDAO.getJrgStationInfo();
		List<Map<String, String>> eqStationInfo = failureDAO.getEquipStationInfo();
		List<Map<String,String>> epcStationInfo = failureDAO.getEpcStationInfo();
		List<Map<String,String>> lineInfo = codeDAO.selectStationLine();
		
		resultMap.put("duStationInfo", duStationInfo);
		resultMap.put("ruStationInfo", ruStationInfo);
		resultMap.put("swStationInfo", swStationInfo);
		resultMap.put("jrgStationInfo", jrgStationInfo);
		resultMap.put("eqStationInfo", eqStationInfo);
		resultMap.put("epcStationInfo", epcStationInfo);
		resultMap.put("lineInfo", lineInfo);

		return resultMap;
	}

	@Override
	public List<Map<String,String>> getEquipInfo() {
		
		List<Map<String,String>> equipInfo = failureDAO.getEquipInfo();
		
		return equipInfo;
	}

	@Override
	public Workbook getExcelWorkbook(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> getExcelDownData = new HashMap<String, List<Map<String, String>>>();

		ArrayList<Object> tmpList = new ArrayList<>();
		paramMap.put("sortOption", tmpList);

		try {
			getExcelDownData.put("전체", getActionCaseSettingData(paramMap));
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		ArrayList<String> headerList = new ArrayList<String>();
		ArrayList<String> columnList = new ArrayList<String>();

		columnList.add("GRADE_TXT");
		columnList.add("EQUIP_NAME");
		columnList.add("SYSTEM_ID");
		columnList.add("ALARM_CODE");
		columnList.add("ACTION_CASE");
		columnList.add("INSERT_DATE");
		columnList.add("INSERT_USER");

		headerList.add("등급");
		headerList.add("장비타입");
		headerList.add("장비ID");
		headerList.add("알람코드");
		headerList.add("조치내용");
		headerList.add("등록일");
		headerList.add("등록자");

		String headerStr = "조치사례관리 - 고장 조치사례";

		CreateExcel excel = new CreateExcel();
		Workbook xlsxWb = excel.create_Excel(getExcelDownData, headerList, headerStr, columnList);

		return xlsxWb;
	}

	@Override
	public Workbook failureActionCaseExcelExport(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> getExcelDownData = new HashMap<String, List<Map<String, String>>>();
		List<Map<String, String>> getActionCase = new ArrayList<Map<String, String>>();
		List<Map<String, String>> getFailureInfo = new ArrayList<Map<String, String>>();

		ArrayList<Object> tmpList = new ArrayList<>();
		HashMap<String, String> tmpMap = new HashMap<String, String>();

		tmpMap.put("alarmId", paramMap.get("alarmId").toString());
		tmpMap.put("majorFailure", paramMap.get("majorFailure").toString());
		tmpMap.put("SYSTEM_ID", paramMap.get("systemId").toString());
		tmpMap.put("ALARM_CODE", paramMap.get("alarmCode").toString());
		tmpMap.put("EQUIP_TYPE", paramMap.get("equipType").toString());

		try {
			getActionCase = getActionCaseData(tmpMap).get("actionCaseList");
			getFailureInfo = getFailureData(tmpMap).get("failureList");
			getExcelDownData.put("actionCase", getActionCase);
			getExcelDownData.put("failureInfo", getFailureInfo);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		ArrayList<String> subtitleList = new ArrayList<String>();

		ArrayList<String> headerList = new ArrayList<String>();
		ArrayList<String> columnList = new ArrayList<String>();

		ArrayList<String> failureInfo = new ArrayList<String>();
		ArrayList<String> failureInfoColumnList = new ArrayList<String>();

//		subtitleList.add("조치사례");
//		subtitleList.add("ALARM Message");
//		subtitleList.add("고장정보");
//		subtitleList.add("구성정보");

		//조치사례
		headerList.add("알람코드");
		headerList.add("알람종류");
		headerList.add("장비종류");
		headerList.add("장비ID");
		headerList.add("작성자");
		headerList.add("작성시간");
		headerList.add("조치내용");
		columnList.add("ALARM_CODE");
		columnList.add("ALARM_TYPE");
		columnList.add("EQUIP_NAME");
		columnList.add("SYSTEM_ID");
		columnList.add("INSERT_USER");
		columnList.add("INSERT_DATE");
		columnList.add("ACTION_CASE");

		// 고장정보
		failureInfo.add("알람코드");
		failureInfo.add("발생장비");
		failureInfo.add("고장등급");
		failureInfo.add("중요고장");
		failureInfo.add("발생건수");
		failureInfo.add("발생원인");
		failureInfo.add("발생위치");
		failureInfo.add("발생시간");
		failureInfo.add("갱신시간");
		failureInfo.add("ALARM Message");
		failureInfo.add("시스템");
		failureInfo.add("장비명");
		failureInfo.add("운영파트");
		failureInfoColumnList.add("ALARM_CODE");
		failureInfoColumnList.add("EQUIP_NAME");
		failureInfoColumnList.add("SEVERITY_TXT");
		failureInfoColumnList.add("MAJOR_FAILURE");
		failureInfoColumnList.add("UPDATE_COUNT");
		failureInfoColumnList.add("PROBABLE_CAUSE");
		failureInfoColumnList.add("FDN");
		failureInfoColumnList.add("EVENT_TIME");
		failureInfoColumnList.add("UPDATE_TIME");
		failureInfoColumnList.add("ROP_MESSAGE");
		failureInfoColumnList.add("SYSTEM_ID");
		failureInfoColumnList.add("SYSTEM_NAME");
		failureInfoColumnList.add("TEAM_NAME");

		String headerStr = "조치사례관리 및 고장상세정보";
		String majorFailure = paramMap.get("majorFailure").toString();

		CreateExcel excel = new CreateExcel();
		Workbook xlsxWb = excel.createFailureActionCaseReport(getExcelDownData, headerStr, headerList, columnList, failureInfo, failureInfoColumnList, majorFailure);

		return xlsxWb;
	}

	@Override
	public int insertDelMsg(HashMap<String, String> paramMap) {
		int result = 0;
		result = failureDAO.insertDelMsg(paramMap);
		return result;
	}
}
