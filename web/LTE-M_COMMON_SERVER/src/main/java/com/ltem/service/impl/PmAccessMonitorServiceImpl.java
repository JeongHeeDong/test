package com.ltem.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.PmAccessMonitorDAO;
import com.ltem.service.PmAccessMonitorService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PmAccessMonitorService")
public class PmAccessMonitorServiceImpl extends EgovAbstractServiceImpl implements PmAccessMonitorService {

	@Autowired
	PmAccessMonitorDAO pmAccessMonitorDAO;
	
	private static final Logger log = LoggerFactory.getLogger(PmAccessMonitorServiceImpl.class);

	@Override
	public int equipSave(HashMap<String, Object> paramMap) {

		int returnFlag = 0;
		
		try{
			String user_id = (String)paramMap.get("user_id");
			String modify_date = (String)paramMap.get("modify_date");
			String flag = "1";
			String equip_type = paramMap.get("equip_type")+"";
			List<Map<String,Object>> equip_List = (List<Map<String,Object>>)paramMap.get("equipList");
			paramMap.put("flag", flag);
			
			pmAccessMonitorDAO.equipDelete(paramMap);
			
			for(Map<String,Object> map : equip_List){
				map.put("user_id", user_id);
				map.put("modify_date", modify_date);
				map.put("equip_type", equip_type);
				map.put("flag", flag);
				
				pmAccessMonitorDAO.equipSave(map);
			}
			
			flag = "0";
			paramMap.put("flag", flag);
			List<Map<String,Object>> deEquip_List = (List<Map<String,Object>>)paramMap.get("deEquipList");
			
			pmAccessMonitorDAO.equipDelete(paramMap);
			
			for(Map<String,Object> map : deEquip_List){
				map.put("user_id", user_id);
				map.put("modify_date", modify_date);
				map.put("equip_type", equip_type);
				map.put("flag", flag);
				
				pmAccessMonitorDAO.equipSave(map);
			}
			
			
			returnFlag = 1;
		}catch(Exception e){
			log.error(e.getMessage());
		}
		
		return returnFlag;
	}

	@Override
	public Map<String,Object> getEquipList(HashMap<String, Object> paramMap) {
		
		List<Map<String,Object>> equipDeSelectList = pmAccessMonitorDAO.equipDeSelectList(paramMap);
		List<Map<String,Object>> equipSelectList = pmAccessMonitorDAO.equipSelectList(paramMap);
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		returnMap.put("equipSelectList", equipSelectList);
		returnMap.put("equipDeSelectList", equipDeSelectList);
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getBasicSetting(HashMap<String,Object> paramMap) {
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		Map<String,Object> getaAlarm = pmAccessMonitorDAO.getaAlarm(paramMap);
		if("2".equals(paramMap.get("equip_type"))){
			Map<String,Object> getStdAlarm = pmAccessMonitorDAO.getStdAlarm(paramMap);
			int deSelect_cnt = pmAccessMonitorDAO.getDeSelectCnt(paramMap);
			
			returnMap.put("getStdAlarm", getStdAlarm);
			returnMap.put("deSelectCnt", deSelect_cnt);
		}
		returnMap.put("getaAlarm", getaAlarm);
		
		paramMap.put("flag", "1");
		List<Map<String,Object>> equipSelectList = pmAccessMonitorDAO.equipSelectList(paramMap);
		paramMap.put("flag", "0");
		List<Map<String,Object>> excuteEquipSelectList = pmAccessMonitorDAO.equipSelectList(paramMap);
		
		returnMap.put("equipSelectList", equipSelectList);
		returnMap.put("excuteEquipSelectList", excuteEquipSelectList);
		
		return returnMap;
	}

	@Override
	public int basicSettingSave(HashMap<String, Object> paramMap) {
		
		int returnFlag = 0;
		
		try{
			returnFlag = pmAccessMonitorDAO.alarmUpdate(paramMap);
			if("2".equals(paramMap.get("equip_type"))){
				returnFlag = pmAccessMonitorDAO.stdalarmUpdate(paramMap);
			}
		}catch(Exception e){
			returnFlag = 0;
			log.error(e.getMessage());
		}
		
		return returnFlag;
	}

	@Override
	public Map<String, Object> getSearchData(HashMap<String, Object> paramMap) {
		Map<String,Object> returnMap = new HashMap<String,Object>();
		//al_lv, event_time
		String updateTime = pmAccessMonitorDAO.getUpdateDate(paramMap);
		Map<String,Object> etcFilterMap = new HashMap<String,Object>();
		List<Map<String,Object>> kpiData;
		List<Map<String,Object>> dtpData;
		List<Map<String,Object>> handData;
		etcFilterMap = pmAccessMonitorDAO.getEtcFilter(paramMap);
		paramMap.put("flag", 1);
		List<Map<String,Object>> selectEquip = pmAccessMonitorDAO.equipSelectList(paramMap);
		paramMap.put("flag", 0);
		List<Map<String,Object>> exceptSelectEquip = pmAccessMonitorDAO.equipSelectList(paramMap);
		
		//query 에러로 인한 select_equip, exceptSelect_equip 자료형 변경(String -> List<String>)
		//String select_equip = "0";
		//String exceptSelect_equip = "0";
		List<String> select_equip = new ArrayList<String>();
		List<String> exceptSelect_equip = new ArrayList<String>();
		
		String std_att = "";
		String equipType = paramMap.get("equipType")+"";
		
		if(null == etcFilterMap){
			std_att = "0";
			paramMap.put("STD_ATT", "0");
			paramMap.put("al_lv", 5);
		}else{
			std_att = etcFilterMap.get("STD_ATT")+"";
			paramMap.put("al_lv", etcFilterMap.get("SEVERITY"));
			paramMap.put("STD_ATT", etcFilterMap.get("STD_ATT")+"");
		}
		
		boolean isfirst= true;
		for(Map<String,Object> map : selectEquip){
			if(isfirst){
				//select_equip = "";
				//select_equip = null; 
				isfirst = false;
			}
			//select_equip += map.get("SYSTEM_ID")+",";
			select_equip.add((String) map.get("SYSTEM_ID"));
		}
		
		if(!"0".equals(select_equip)){
			//select_equip = select_equip.substring(0, select_equip.length()-1);
		}
		
		isfirst = true;
		for(Map<String,Object> map : exceptSelectEquip){
			if(isfirst){
				//exceptSelect_equip = "";
				//exceptSelect_equip = null;
				isfirst = false;
			}
			exceptSelect_equip.add((String) map.get("SYSTEM_ID"));
			//exceptSelect_equip += map.get("SYSTEM_ID")+",";
		}
		if(!"0".equals(exceptSelect_equip)){
			//exceptSelect_equip = exceptSelect_equip.substring(0, exceptSelect_equip.length()-1);
		}
		
		if("1".equals(std_att)){
			String std_date = etcFilterMap.get("STD_DATE")+"";
			std_date = std_date.substring(0,8);
			std_date += updateTime.substring(8, updateTime.length());
			paramMap.put("STD_DATE",std_date);
		}
		
		paramMap.put("select_equip", select_equip);
		paramMap.put("exceptSelect_equip", exceptSelect_equip);
		
		List sortOption = new ArrayList();
		if(paramMap.containsKey("sortOption")) sortOption= (ArrayList)paramMap.get("sortOption");
		else paramMap.put("sortOption",sortOption);
		
		List dtpSortOption = new ArrayList();
		if(paramMap.containsKey("dtpSortOption")) dtpSortOption= (ArrayList)paramMap.get("dtpSortOption");
		else paramMap.put("dtpSortOption",dtpSortOption);
		
		List handSortOption = new ArrayList();
		if(paramMap.containsKey("handSortOption")) handSortOption= (ArrayList)paramMap.get("handSortOption");
		else paramMap.put("handSortOption",handSortOption);
		
		if(!paramMap.containsKey("updateTime")){
			paramMap.put("updateTime", updateTime);
		}
		
		try {
			ArrayList<Integer> monitorFlag = (ArrayList<Integer>)paramMap.get("monitorFlag");
			
			for(Integer i : monitorFlag) {
				String IntegerToStr = i.toString();
				
				if("0".equals(IntegerToStr)){
					if("3".equals(equipType)) kpiData = pmAccessMonitorDAO.getRuKpiData(paramMap);
					else kpiData = pmAccessMonitorDAO.getDuKpiData(paramMap);
					
					returnMap.put("getAccessKpiData", kpiData);
					dtpData = pmAccessMonitorDAO.getAccessDTPData(paramMap);
					handData = pmAccessMonitorDAO.getAccessHANDData(paramMap);
					
					if(sortOption.size() == 0) kpiData = levelSort(kpiData,1);
					if(dtpSortOption.size() == 0) dtpData = levelSort(dtpData,2);
					if(handSortOption.size() == 0) handData = levelSort(handData,3);
					
					
					returnMap.put("getAccessDTPData", dtpData);
					returnMap.put("getAccessHANDData", handData);
					
				}else if("1".equals(IntegerToStr)){
					if("3".equals(equipType)) kpiData = pmAccessMonitorDAO.getRuKpiData(paramMap);
					else kpiData = pmAccessMonitorDAO.getDuKpiData(paramMap);
					
					if(sortOption.size() == 0)
						kpiData = levelSort(kpiData,1);
					
					returnMap.put("getAccessKpiData", kpiData);
				}else if("2".equals(IntegerToStr)){
					dtpData = pmAccessMonitorDAO.getAccessDTPData(paramMap);
					
					if(dtpSortOption.size() == 0)
						dtpData = levelSort(dtpData,2);
					
					returnMap.put("getAccessDTPData", dtpData);
				} else if("3".equals(IntegerToStr)) {
					handData = pmAccessMonitorDAO.getAccessHANDData(paramMap);

					if(handSortOption.size() == 0) handData = levelSort(handData,3);

					returnMap.put("getAccessHANDData", handData);
				}
			}
		} catch(ClassCastException e) {
			String monitorFlag = paramMap.get("monitorFlag")+"";
			
			if("0".equals(monitorFlag)){
				if("3".equals(equipType)) kpiData = pmAccessMonitorDAO.getRuKpiData(paramMap);
				else kpiData = pmAccessMonitorDAO.getDuKpiData(paramMap);
				
				returnMap.put("getAccessKpiData", kpiData);
				dtpData = pmAccessMonitorDAO.getAccessDTPData(paramMap);
				handData = pmAccessMonitorDAO.getAccessHANDData(paramMap);
				
				if(sortOption.size() == 0) kpiData = levelSort(kpiData,1);
				if(dtpSortOption.size() == 0) dtpData = levelSort(dtpData,2);
				if(handSortOption.size() == 0) handData = levelSort(handData,3);
				
				
				returnMap.put("getAccessDTPData", dtpData);
				returnMap.put("getAccessHANDData", handData);
				
			}else if("1".equals(monitorFlag)){
				if("3".equals(equipType)) kpiData = pmAccessMonitorDAO.getRuKpiData(paramMap);
				else kpiData = pmAccessMonitorDAO.getDuKpiData(paramMap);
				
				if(sortOption.size() == 0)
					kpiData = levelSort(kpiData,1);
				
				returnMap.put("getAccessKpiData", kpiData);
			}else if("2".equals(monitorFlag)){
				dtpData = pmAccessMonitorDAO.getAccessDTPData(paramMap);
				
				if(dtpSortOption.size() == 0)
					dtpData = levelSort(dtpData,2);
				
				returnMap.put("getAccessDTPData", dtpData);
			} else if("3".equals(monitorFlag)) {
				handData = pmAccessMonitorDAO.getAccessHANDData(paramMap);

				if(handSortOption.size() == 0) handData = levelSort(handData,3);

				returnMap.put("getAccessHANDData", handData);
			}
		}
		
		SimpleDateFormat stringFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date tempDate = new Date();;
		try {
			tempDate = stringFormat.parse(updateTime);
		} catch (ParseException e) {
			log.error(e.getMessage());
		}
		updateTime = dateFormat.format(tempDate);
		
		returnMap.put("updateTime", updateTime);
		
		return returnMap;
	}

	@Override
	public Map<String,String> getAlarmInfo(Map<String, String> paramMap) {
		Map<String,String> result = pmAccessMonitorDAO.getAlarmInfo(paramMap);
		
		if("localhost".equals(paramMap.get("HOST"))) {
			// 로컬 개발시 사운드 파일 처리
			Map<String, String> fileMap = new HashMap<String, String>();
			fileMap.put("11", "/CriticalAlarm.mp3");
			fileMap.put("12", "/MajorAlarm.mp3");
			fileMap.put("13", "/MinorAlarm.mp3");
			fileMap.put("21", "/failure/CriticalAlarm.mp3");
			fileMap.put("22", "/failure/MajorAlarm.mp3");
			fileMap.put("23", "/failure/MinorAlarm.mp3");
			result.put("FILE_PATH", paramMap.get("FILE_PATH") + fileMap.get(paramMap.get("MONITOR_TYPE") + paramMap.get("SEVERITY")));
		}
		return result;
	}
	
	@Override
	public Map<String,Object> getPopTrendData(HashMap<String,Object> paramMap){
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		
		Map<String,Object> etcFilterMap = pmAccessMonitorDAO.getEtcFilter(paramMap);
		
		String startTime = (String)paramMap.get("startDateTime");
		String endTime = (String)paramMap.get("endDateTime");
		
		String std_att = "";
		
		if(null == etcFilterMap){
			std_att = "0";
			paramMap.put("STD_ATT", "0");
			paramMap.put("al_lv", 5);
		}else{
			std_att = etcFilterMap.get("STD_ATT")+"";
			paramMap.put("al_lv", etcFilterMap.get("SEVERITY"));
			paramMap.put("STD_ATT", etcFilterMap.get("STD_ATT")+"");
		}
		
		if("1".equals(std_att)){
			String std_date = etcFilterMap.get("STD_DATE")+"";
			String start_std_date = "";
			String end_std_date = "";
			
			std_date = std_date.substring(0,8);
			start_std_date = std_date+startTime.substring(8, startTime.length());
			end_std_date = std_date+endTime.substring(8, endTime.length());
			paramMap.put("START_STD_DATE",start_std_date);
			paramMap.put("END_STD_DATE",end_std_date);
		}
		paramMap.put("STD_ATT", std_att);
		
		List<Map<String, Object>> tempdataList = pmAccessMonitorDAO.getPopTrendData(paramMap);
		
		ArrayList<String> timeList = new ArrayList<String>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(sdf.parse(startTime));
		} catch (ParseException e) {
			
		}
		
		String stdDate = startTime;
		while(stdDate.compareTo(endTime) <= 0){
			timeList.add(sdf.format(cal.getTime()));
			cal.add(Calendar.MINUTE, 5);
			stdDate = sdf.format(cal.getTime());
		}
		
		List<Map<String,Object>> tempList = new ArrayList<Map<String,Object>>();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		ArrayList<String> colList = new ArrayList<String>();
		if(tempdataList.size() != 0){
			Set	key = tempdataList.get(0).keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				if(!keyname.equals("EVENT_TIME") && !keyname.equals("COMP_TIME") 
						&& !keyname.equals("UP_TIME") && !keyname.equals("DW_TIME")
						&& !keyname.equals("STD_ATT") && !keyname.equals("STD_ERAB") ){
					dataMap.put("Column", keyname);
					dataMap.put("name", getName(keyname).split(",")[0]);
					dataMap.put("type", getName(keyname).split(",")[1]);
					dataMap.put("suffix",getName(keyname).split(",")[2]);
					dataMap.put("yAxis", getName(keyname).split(",")[3]);
					dataMap.put("zIndex", getName(keyname).split(",")[4]);
					colList.add(keyname);
					tempList.add(dataMap);
					dataMap = new HashMap<String,Object>();
				}
			}
		}
		
		boolean isfirst = true;
		for(Map tempMap : tempList){
			ArrayList dataArray = new ArrayList();
			for(String time : timeList){
				isfirst = true;
				for(Map map : tempdataList){
					if(time.equals((String)map.get("COMP_TIME"))){
						dataArray.add(map.get(tempMap.get("Column")));
						isfirst = false;
						break;
					}
				}
				if(isfirst){
					dataArray.add(0);
				}
			}
			tempMap.put("data", dataArray);
			returnList.add(tempMap);
		}
		
		
		returnMap.put("trendData", returnList);
		returnMap.put("timeList", timeList);
		
		return returnMap;
	}
	
	public String getName(String col){
		
		String returnStr = "";
		
		if("RRC_RATE".equals(col)){
			returnStr = "소통율,spline,%,1,84";
		}else if("ANSWER_RATE".equals(col)){
			returnStr = "완료율,spline,%,1,83";
		}else if("CD_RATE".equals(col)){
			returnStr = "절단율,spline,%,1,82";
		}else if("STD_ATT".equals(col)){
			returnStr = "기준 시도호,column,호(건),0,81";
		}else if("ATTEMPT".equals(col)){
			returnStr = "RRC 시도호,column,호(건),0,80";
		}else if("UP_VOLUMN".equals(col)){
			returnStr = "UP Volume,spline,KByte,0,82";
		}else if("DW_VOLUMN".equals(col)){
			returnStr = "DOWN Volume,spline,KByte,0,83";
		}else if("UP_DTP".equals(col)){
			returnStr = "UP Throughput,column,KBps,1,80";
		}else if("DW_DTP".equals(col)){
			returnStr = "DOWN Throughput,column,KBps,1,81";
		}else if("ATT_RATE".equals(col)){
			returnStr = "RRC 시도호증감율,spline,%,1,86";
		}else if("SUCC_RATE".equals(col)){
			returnStr = "성공율,spline,%,1,86";
		}else if("ERAB_ATTEMPT".equals(col)) {
			returnStr = "ERAB Setup 시도호,column,호(건),0,79";
		}else if("ERAB_RATE".equals(col)) {
			returnStr = "ERAB Setup 시도호증감율,spline,%,1,85";
		}
		return returnStr;
	}

	@Override
	public List<Map<String, Object>> getPopDetailData(HashMap<String, Object> paramMap) {
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		Map<String,Object> etcFilterMap = pmAccessMonitorDAO.getEtcFilter(paramMap);
		
		String startTime = (String)paramMap.get("startDateTime");
		String endTime = (String)paramMap.get("endDateTime");
		
		String std_att = "";
		
		if(null == etcFilterMap){
			std_att = "0";
			paramMap.put("STD_ATT", "0");
			paramMap.put("al_lv", 5);
		}else{
			std_att = etcFilterMap.get("STD_ATT")+"";
			paramMap.put("al_lv", etcFilterMap.get("SEVERITY"));
			paramMap.put("STD_ATT", etcFilterMap.get("STD_ATT")+"");
		}
		
		if("1".equals(std_att)){
			String std_date = etcFilterMap.get("STD_DATE")+"";
			String start_std_date = "";
			String end_std_date = "";
			
			std_date = std_date.substring(0,8);
			start_std_date = std_date+startTime.substring(8, startTime.length());
			end_std_date = std_date+endTime.substring(8, endTime.length());
			
			paramMap.put("START_STD_DATE",start_std_date);
			paramMap.put("END_STD_DATE",end_std_date);
		}
		paramMap.put("STD_ATT", std_att);
		
		List<Map<String, Object>> returnList = pmAccessMonitorDAO.getPopDetailData(paramMap);
		
		return returnList;
	}

	@Override
	public Map<String, Object> getAlarmVolume() {
		
		return pmAccessMonitorDAO.getAlarmVolume();
	}
	
	private List<Map<String,Object>> levelSort(List<Map<String,Object>> listData, int flag){
		
		List<Map<String,Object>> criList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> majList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> mirList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> nomalList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		
		if(flag == 1){
			for(Map<String,Object> map : listData){
				if ("1".equals(map.get("ATT_RATE_5M_LEVEL")+"") || "1".equals(map.get("RRC_RATE_LEVEL")+"")
						|| "1".equals(map.get("CD_RATE_LEVEL")+"") || "1".equals(map.get("ANSWER_RATE_LEVEL")+"")) {
					
					criList.add(map);
				}else if ("2".equals(map.get("ATT_RATE_5M_LEVEL")+"") || "2".equals(map.get("RRC_RATE_LEVEL")+"")
						|| "2".equals(map.get("CD_RATE_LEVEL")+"") || "2".equals(map.get("ANSWER_RATE_LEVEL")+"")) {
					
					majList.add(map);
				}else if ("3".equals(map.get("ATT_RATE_5M_LEVEL")+"") || "3".equals(map.get("RRC_RATE_LEVEL")+"")
						|| "3".equals(map.get("CD_RATE_LEVEL")+"") || "3".equals(map.get("ANSWER_RATE_LEVEL")+"")) {
					
					mirList.add(map);
				}else{
					nomalList.add(map);
				}
			}
		}else if(flag == 2){
			for(Map<String,Object> map : listData){
				if ("1".equals(map.get("UP_DTP_LEVEL")+"") || "1".equals(map.get("DW_DTP_LEVEL")+"")) {
					
					criList.add(map);
				}else if ("2".equals(map.get("UP_DTP_LEVEL")+"") || "2".equals(map.get("DW_DTP_LEVEL")+"")) {
					
					majList.add(map);
				}else if ("3".equals(map.get("UP_DTP_LEVEL")+"") || "3".equals(map.get("DW_DTP_LEVEL")+"")) {
					
					mirList.add(map);
				}else{
					nomalList.add(map);
				}
			}
		}else {
			for(Map<String,Object> map : listData){
				if ("1".equals(map.get("ATT_RATE_LEVEL")+"") || "1".equals(map.get("SUCC_RATE_LEVEL")+"")) {
					
					criList.add(map);
				}else if ("2".equals(map.get("ATT_RATE_LEVEL")+"") || "2".equals(map.get("SUCC_RATE_LEVEL")+"")) {
					
					majList.add(map);
				}else if ("3".equals(map.get("ATT_RATE_LEVEL")+"") || "3".equals(map.get("SUCC_RATE_LEVEL")+"")) {
					
					mirList.add(map);
				}else{
					nomalList.add(map);
				}
			}
		}

		/*Comparator<Map<String, Object>> comp = new Comparator<Map<String, Object>>() {
			private final String key = "DU_NAME";
			
			@Override
			public int compare(Map<String, Object> first, Map<String, Object> second) {
				int result = first.get(key).toString().compareTo(second.get(key).toString());
				return result;
			}
		};
		
		Collections.sort(criList, comp);
		Collections.sort(majList, comp);
		Collections.sort(mirList, comp);
		Collections.sort(nomalList, comp);*/
		
		returnList.addAll(criList);
		returnList.addAll(majList);
		returnList.addAll(mirList);
		returnList.addAll(nomalList);
		
		return returnList;
	}
}
