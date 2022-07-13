package com.ltem.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.EpcAnalysisDAO;
import com.ltem.service.EpcAnalysisService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("EpcAnalysisService")
public class EpcAnalysisServiceImpl extends EgovAbstractServiceImpl implements EpcAnalysisService {

	@Autowired
	EpcAnalysisDAO epcAnalysisDAO;
	
	private static final Logger log = LoggerFactory.getLogger(EpcAnalysisServiceImpl.class);

	@Override
	public Map<String,Object> getEpcTrendData(HashMap<String, Object> paramMap) {
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		
		String equipflag = (String)paramMap.get("equipval");
		//PGW, SGW 구별을 위한 값
		String equiptext = (String)paramMap.get("equiptext");
		String kpiflag = (String)paramMap.get("kpival");
		
		String equipList = (String)paramMap.get("equipList");
		if(!"".equals(equipList)){
			paramMap.put("equipList", equipList.split(","));
		}
		
		if("1".equals(equipflag)){
			returnMap.put("gridData",epcAnalysisDAO.getMmeGridData(paramMap));
		}else if("4".equals(equipflag)){
			if("PGW".equals(equiptext)) {
				returnMap.put("gridData",epcAnalysisDAO.getPgwGridData(paramMap));
			}
			else if("SGW".equals(equiptext)) {
				returnMap.put("gridData",epcAnalysisDAO.getSgwGridData(paramMap));
			}
		}else if("5".equals(equipflag)){
			returnMap.put("gridData",epcAnalysisDAO.getSgwGridData(paramMap));
		}else if("6".equals(equipflag)){
			returnMap.put("gridData",epcAnalysisDAO.getHpsGridData(paramMap));
		}
		
		String startTime = (String)paramMap.get("startDateTime");
		String endTime = (String)paramMap.get("endDateTime");
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
		
		List<Map<String,Object>> tempdataList = (List<Map<String, Object>>)returnMap.get("gridData");
		List<Map<String,Object>> tempList = new ArrayList<Map<String,Object>>();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		ArrayList<String> colList = new ArrayList<String>();
		
		if(tempdataList.size() != 0){
			Set	key = tempdataList.get(0).keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				if(!keyname.equals("EVENT_TIME") && !keyname.equals("COMP_TIME") && !keyname.equals("SUCCESS") && !keyname.equals("ANSWER")
						&& !keyname.equals("FAIL")){
					dataMap.put("Column", keyname);
					dataMap.put("name", getName(keyname,equipflag,kpiflag).split(",")[0]);
					dataMap.put("type", getName(keyname,equipflag,kpiflag).split(",")[1]);
					dataMap.put("suffix",getName(keyname,equipflag,kpiflag).split(",")[2]);
					dataMap.put("yAxis", getName(keyname,equipflag,kpiflag).split(",")[3]);
					dataMap.put("zIndex", getName(keyname,equipflag,kpiflag).split(",")[4]);
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
	
	public String getName(String col,String equipflag, String kpiflag){
		
		String returnStr = "";
		
		if("SUCC_RATE".equals(col)){
			returnStr = "성공율,spline,%,1,83";
		}else if("ANS_RATE".equals(col)){ 
			returnStr = "성공율,spline,%,1,82";
		}else if("STD_ATT".equals(col)){
			returnStr = "기준 시도호,column,호(건),0,81";
		}else if("ATTEMPT".equals(col)){
			returnStr = "시도호,column,호(건),0,80";
		}else if("ATT_RATE".equals(col)){
			returnStr = "시도호증감율,spline,%,1,84";
		}
		return returnStr;
	}

	@Override
	public List<Map<String, String>> getEpcExcelData(HashMap<String, Object> paramMap) {
		
		String equipflag = (String)paramMap.get("equipval");
		String equipList = (String)paramMap.get("equipList");
		//PGW, SGW 구별을 위한 값
			String equiptext = (String)paramMap.get("equiptext");
		if(!"".equals(equipList)){
			paramMap.put("equipList", equipList.split(","));
		}
		
		if("1".equals(equipflag)){
			return epcAnalysisDAO.getMmeGridData(paramMap);
		}else if("4".equals(equipflag)){
			if("PGW".equals(equiptext)) {
				return epcAnalysisDAO.getPgwGridData(paramMap);
			}
			else {
				return epcAnalysisDAO.getSgwGridData(paramMap);
			}
		}else if("5".equals(equipflag)){
			return epcAnalysisDAO.getSgwGridData(paramMap);
		}else {
			return epcAnalysisDAO.getHpsGridData(paramMap);
		}
	}

	@Override
	public List<Map<String, Object>> getPopEpcAnalysisData(HashMap<String, Object> paramMap) {
		
		String equipflag = paramMap.get("flag")+"";
		String equipList = (String)paramMap.get("equipList");
		//PGW, SGW, HSS, PCRF 구별을 위한 값
		String equiptext = (String)paramMap.get("equiptext");
		if(!"".equals(equipList)){
			paramMap.put("equipList", equipList.split(","));
		}
		
		if("1".equals(equipflag)){
			return epcAnalysisDAO.getPopMmeDetailData(paramMap);
		}else if("4".equals(equipflag)){
			if("PGW".equals(equiptext)) {
				return epcAnalysisDAO.getPopPgwDetailData(paramMap);
			}
			else {
				return epcAnalysisDAO.getPopSgwDetailData(paramMap);
			}
		}else if("5".equals(equipflag)){
			return epcAnalysisDAO.getPopSgwDetailData(paramMap);
		}else if("6".equals(equipflag)){
			if("HSS".equals(equiptext)) {
				return epcAnalysisDAO.getPopHssDetailData(paramMap);
			}
			else {
				return epcAnalysisDAO.getPopPcrfDetailData(paramMap);
			}
		}else{
			return epcAnalysisDAO.getPopPcrfDetailData(paramMap);
		}
	}
}
