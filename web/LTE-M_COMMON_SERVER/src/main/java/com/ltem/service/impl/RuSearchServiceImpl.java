package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.RuSearchDAO;
import com.ltem.service.RuSearchService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("RuSearchService")
public class RuSearchServiceImpl extends EgovAbstractServiceImpl implements RuSearchService {

	@Autowired
	RuSearchDAO ruSearchDAO;
	
	@Autowired
	CodeDAO codeDAO;
	
	
	private static final Logger log = LoggerFactory.getLogger(RuSearchServiceImpl.class);

	@Override
	public Map<String, List<Map<String, String>>> getRuSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String,String>> emsName = ruSearchDAO.getEmsName();
		List<Map<String,String>> du = ruSearchDAO.getDu();
		List<Map<String,String>> ru_type = ruSearchDAO.getRuType();
		List<Map<String,String>> team = ruSearchDAO.getTeam();
		List<Map<String,String>> vendor = ruSearchDAO.getVendor();
		List<Map<String,String>> stationInfo = ruSearchDAO.getStationInfo();
		List<Map<String,String>> station = ruSearchDAO.getStation();
		List<Map<String,String>> stationLine = codeDAO.selectStationLine();

		returnMap.put("EMSNAME", emsName);
		returnMap.put("DU", du);
		returnMap.put("RU_TYPE", ru_type);
		returnMap.put("TEAM", team);
		returnMap.put("VENDOR", vendor);
		returnMap.put("STATION_INFO", stationInfo);
		returnMap.put("STATION", station);
		returnMap.put("LOCATION", getRuLocation());
		returnMap.put("STATIONLINE", stationLine);

		return returnMap;
	}

/*	@Override
	public List<Map<String, String>> getRuLocation() {

		List<Map<String,String>> station = ruSearchDAO.getStation();

		List<Map<String,String>> location = new ArrayList<Map<String,String>>();
		HashMap<String,String> tempMap = new HashMap<String,String>();
		int intFlag = 0;
		String locationName = "";
		int locationNumber = 0;

//		for(int i = 0; i<station.size(); i++){
//			if(!"0".equals(station.get(i).get("STATION_ID"))){
//				locationNumber = Integer.parseInt(station.get(i).get("STATION_ID"));
//				locationName = station.get(i).get("STATION_NAME");
//				if(i != station.size()-1){
//					locationNumber += Integer.parseInt(station.get(i+1).get("STATION_ID"));
//					locationName += "-"+station.get(i+1).get("STATION_NAME")+" 본선";
//					tempMap.put("STATION_NAME", locationName.toString());
//					tempMap.put("STATION_ID", ((float)locationNumber/2)+"");
//					locationNumber = 0;
//					locationName = "";
//
//					location.add((Map<String, String>) tempMap.clone());
//				}
//				location.add(station.get(i));
//			}
//			//추후 본사라는 항목이 따로 생길경우 else문 삭제 필요(2017.04.13)
//			else {
//				location.add(station.get(i));
//				locationNumber = Integer.parseInt(station.get(i).get("STATION_ID"));
//				locationName = station.get(i).get("STATION_NAME");
//				if(i != station.size()-1){
//					locationNumber += Integer.parseInt(station.get(i+1).get("STATION_ID"));
//					locationName += "-"+station.get(i+1).get("STATION_NAME")+" 본선";
//					tempMap.put("STATION_NAME", locationName.toString());
//					tempMap.put("STATION_ID", ((float)locationNumber/2)+"");
//					locationNumber = 0;
//					locationName = "";
//					location.add((Map<String, String>) tempMap.clone());
//				}
//			}
//		}
//
//		Collections.sort(location, new Comparator<Map<String, String >>() {
//			@Override
//			public int compare(Map<String, String> first,
//							   Map<String, String> second) {
//				Float first_float = Float.parseFloat(first.get("STATION_ID"));
//				Float second_float = Float.parseFloat(second.get("STATION_ID"));
//
//				return first_float.compareTo(second_float);
//			}
//		});
		
		// 임시 처리
		location = station;

		return location;
	}*/
	@Override
	public List<Map<String, String>> getRuLocation() {

		List<Map<String,String>> station = ruSearchDAO.getStation();

		List<Map<String,String>> location = new ArrayList<Map<String,String>>();
		HashMap<String,String> tempMap = new HashMap<String,String>();
		int intFlag = 0;
		String locationName = "";
		String locationNumber = "0";

		for(int i = 0; i<station.size(); i++){
			if(!"0".equals(station.get(i).get("STATION_ID"))){
				locationNumber = station.get(i).get("STATION_ID");
				locationName = station.get(i).get("STATION_NAME");
				location.add(station.get(i));
				if(i != station.size()-1){
					locationName += "-"+station.get(i+1).get("STATION_NAME")+" 본선";
					tempMap.put("STATION_NAME", locationName.toString());
					tempMap.put("STATION_ID", (locationNumber+".5"));
					System.out.println(locationNumber);
					System.out.println(locationNumber+".5");
					if ("558.5".equals(locationNumber+".5")) {
						System.out.println(locationNumber+".5");
					}
					if (!"558.5".equals(locationNumber+".5")) {
						location.add((Map<String, String>) tempMap.clone());
					}
					if ("548".equals(locationNumber)) {
						tempMap.put("STATION_NAME", "강동-둔촌동 본선");
						tempMap.put("STATION_ID", "p548.5");
						locationNumber = "0";
						locationName = "";
						location.add((Map<String, String>) tempMap.clone());
					}
					locationNumber = "0";
					locationName = "";
				}
				
			}
			//추후 본사라는 항목이 따로 생길경우 else문 삭제 필요(2017.04.13)
			else {
				location.add(station.get(i));
				locationNumber = station.get(i).get("STATION_ID");
				locationName = station.get(i).get("STATION_NAME");
				if(i != station.size()-1){
					locationNumber += Integer.parseInt(station.get(i+1).get("STATION_ID"));
					locationName += "-"+station.get(i+1).get("STATION_NAME")+" 본선";
					tempMap.put("STATION_NAME", locationName.toString());
					tempMap.put("STATION_ID", (locationNumber+".5"));
					locationNumber = "0";
					locationName = "";
//					location.add((Map<String, String>) tempMap.clone());
				}
			}
		}

//		Collections.sort(location, new Comparator<Map<String, String >>() {
//			@Override
//			public int compare(Map<String, String> first,
//							   Map<String, String> second) {
//				Float first_float = Float.parseFloat(first.get("STATION_ID"));
//				Float second_float = Float.parseFloat(second.get("STATION_ID"));
//
//				return first_float.compareTo(second_float);
//			}
//		});

		return location;
	}
	
	@Override
	public List<Map<String, Object>> getRuSearch(HashMap<String, Object> paramMap) {

		List<Map<String,Object>> resultList = ruSearchDAO.getRuSearch(paramMap);
		
		return resultList;
	}
	
	@Override
	public Map<String, Object> getRuDetail(String cUid) {
		Map<String,Object> returnMap = new HashMap<String,Object>();

		Map<String,Object> returnBasicInfo = ruSearchDAO.getBasicInfo(cUid);
		Map<String,Object> returnPropertyInfo = ruSearchDAO.getPropertyInfo(cUid);
//		Map<String,Object> returnLocationInfo = ruSearchDAO.getLocationInfo(cUid);
		Map<String,Object> returnLocationInfo = new HashMap<>();
		try {
			returnLocationInfo = ruSearchDAO.getLocationInfo(cUid);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		Map<String,Object> returnManagerInfo = ruSearchDAO.getManagerInfo(cUid);
		Map<String,Object> returnAddrInfo = ruSearchDAO.getAddrInfo(cUid);
		
		returnMap.put("returnBasicInfo", returnBasicInfo);
		returnMap.put("returnPropertyInfo", returnPropertyInfo);
		returnMap.put("returnLocationInfo", returnLocationInfo);
		returnMap.put("returnManagerInfo", returnManagerInfo);
		returnMap.put("returnAddrInfo", returnAddrInfo);
		
		return returnMap;
	}

	@Override
	public int ruDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		int team_id = 0;
		int vendor_id = 0;

		if(paramMap.get("team_id") != null && !"".equals(paramMap.get("team_id"))) {
			team_id = Integer.parseInt(paramMap.get("team_id").toString());
		} else {
			team_id = -1;
		}
		if(paramMap.get("vendor_id") != null && !"".equals(paramMap.get("vendor_id"))) {
			vendor_id = Integer.parseInt(paramMap.get("vendor_id").toString());
		} else {
			vendor_id = -1;
		}

		paramMap.put("team_id", team_id);
		paramMap.put("vendor_id", vendor_id);

//		int st1 = Integer.parseInt(paramMap.get("station1").toString());
//		int st2 = Integer.parseInt(paramMap.get("station2").toString());
//		int locationI = 0;
//		double locationD = 0.0d;
//		String area = paramMap.get("area_info").toString();
//
//		int m = Math.abs(st1 - st2);
//		if(st1 != -1 && st2 != -1) {
//			if(m == 0) {
//				locationI = st1;
//			} else if(m == 1) {
//				locationD = (st1 + st2) / 2d;
//			}
//		} else if(st1 != -1) {
//			locationI = st1;
//		} else if(st2 != -1) {
//			locationI = st2;
//		}
//
//		paramMap.put("area_info", area);
//		if(locationI != 0) {
//			paramMap.put("location", locationI);
//		} else {
//			paramMap.put("location", locationD);
//		}

		returnStr = ruSearchDAO.ruDetail_update(paramMap);
//		if (paramMap.get("station_id") != null && !paramMap.get("station_id").equals("") ) {
//			returnStr = ruSearchDAO.ruStation_update(paramMap);
//			returnStr = ruSearchDAO.duStation_update(paramMap);
//		}
		
		return returnStr;
	}

	@Override
	public int ruAdd(Map<String, Object> paramMap) {
		
		int result = 0;
		
		try{
			ruSearchDAO.ruAdd(paramMap);
			result = 0;
			return result;
		}catch(DuplicateKeyException e){
			result = 1;
			return result;
		}catch(Exception e){
			result = 2;
			return result;
		}
	}
}
