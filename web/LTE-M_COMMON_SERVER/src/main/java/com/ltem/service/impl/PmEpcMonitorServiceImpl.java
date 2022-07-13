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

import com.ltem.dao.PmEpcMonitorDAO;
import com.ltem.service.PmEpcMonitorService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PmEpcMonitorService")
public class PmEpcMonitorServiceImpl extends EgovAbstractServiceImpl implements PmEpcMonitorService {

	@Autowired
	PmEpcMonitorDAO pmEpcMonitorDAO;
	
	private static final Logger log = LoggerFactory.getLogger(PmEpcMonitorServiceImpl.class);

	@Override
	public String getMaxDateTime() {
		String maxDateTime = pmEpcMonitorDAO.getMaxDateTime();
		
		return maxDateTime;
	}

	@Override
	public Map<String, List<Map<String,String>>> getEpcSearchData(Map<String, Object> paramMap) {
		Map<String,List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>(); 
		
		returnMap.put("MME",pmEpcMonitorDAO.getMmeSearchData(paramMap));
		returnMap.put("PGW",pmEpcMonitorDAO.getPgwSearchData(paramMap));
		returnMap.put("SGW",pmEpcMonitorDAO.getSgwSearchData(paramMap));
		returnMap.put("HSS",pmEpcMonitorDAO.getHssSearchData(paramMap));
		returnMap.put("PCRF",pmEpcMonitorDAO.getPcrfSearchData(paramMap));
		
		return returnMap;
	}

	@Override
	public Map<String,Object> getPopEpcTrendData(HashMap<String,Object> paramMap){
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		
		String startTime = (String)paramMap.get("startDateTime");
		String endTime = (String)paramMap.get("endDateTime");
		
		List<Map<String, Object>> tempdataList = pmEpcMonitorDAO.getPopEpcTrendData(paramMap);
		
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
				if(!keyname.equals("EVENT_TIME") && !keyname.equals("COMP_TIME")){
					dataMap.put("Column", keyname);
					dataMap.put("name", getName(keyname,paramMap.get("flag").toString()).split(",")[0]);
					dataMap.put("type", getName(keyname,paramMap.get("flag").toString()).split(",")[1]);
					dataMap.put("suffix",getName(keyname,paramMap.get("flag").toString()).split(",")[2]);
					dataMap.put("yAxis", getName(keyname,paramMap.get("flag").toString()).split(",")[3]);
					dataMap.put("zIndex", getName(keyname,paramMap.get("flag").toString()).split(",")[4]);
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
	
	public String getName(String col,String flag){
		
		String returnStr = "";
		
		if("SUCC_RATE".equals(col)){
			returnStr = "성공율,spline,%,1,84";
		}else if("ANS_RATE".equals(col)){ 
			returnStr = "성공율,spline,%,1,83";
		}else if("STD_ATT".equals(col)){
			returnStr = "기준 시도호,column,호(건),0,81";
		}else if("ATTEMPT".equals(col)){
			returnStr = "시도호,column,호(건),0,80";
		}else if("ATT_RATE".equals(col)){
			returnStr = "시도호 증감율,spline,%,1,85";
		}
		return returnStr;
	}

	@Override
	public List<Map<String, Object>> getPopEpcDetailData(HashMap<String, Object> paramMap) {
		
		List<Map<String, Object>> returnList = new ArrayList<Map<String,Object>>();
		String kpi = (String)paramMap.get("kpi");
		
		if("0".equals(kpi)) returnList = pmEpcMonitorDAO.getPopEpcDetailDataAll(paramMap);
		else returnList = pmEpcMonitorDAO.getPopEpcDetailData(paramMap);
		
		
		return returnList;
	}
}
