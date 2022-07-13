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

import com.ltem.dao.PmRecordMonitorDAO;
import com.ltem.service.PmRecordMonitorService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class PmRecordMonitorServiceImpl extends EgovAbstractServiceImpl implements PmRecordMonitorService {

	@Autowired
	PmRecordMonitorDAO pmRecordMonitorDAO;
	
	private static final Logger log = LoggerFactory.getLogger(PmRecordMonitorServiceImpl.class);

	@Override
	public String getMaxDateTime() {
		String maxDateTime = pmRecordMonitorDAO.getMaxDateTime();
		
		return maxDateTime;
	}

	@Override
	public Map<String, List<Map<String,String>>> getRecordSearchData(Map<String, Object> paramMap) {
		Map<String,List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>(); 
		
		returnMap.put("CALL",pmRecordMonitorDAO.getCallSearchData(paramMap));
		returnMap.put("PTT",pmRecordMonitorDAO.getPttSearchData(paramMap));
		
		return returnMap;
	}

	@Override
	public Map<String,Object> getPopRecordTrendData(HashMap<String,Object> paramMap){
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		
		String startTime = (String)paramMap.get("startDateTime");
		String endTime = (String)paramMap.get("endDateTime");
		
		List<Map<String, Object>> tempdataList = pmRecordMonitorDAO.getPopRecordTrendData(paramMap);
		
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

		if("ATT_RATE".equals(col)){
			returnStr = "시도호증감율,spline,%,1,84";
		}else if("SUCC_RATE".equals(col)){
			returnStr = "성공율,spline,%,1,83";
		}else if("SUCCESS".equals(col)){
			returnStr = "성공호,column,호(건),0,81";
		}else if("ATTEMPT".equals(col)){
			returnStr = "시도호,column,호(건),0,80";
		}
		return returnStr;
	}

	@Override
	public List<Map<String, Object>> getPopRecordDetailData(HashMap<String, Object> paramMap) {
		
		List<Map<String, Object>> returnList = pmRecordMonitorDAO.getPopRecordDetailData(paramMap);
		
		
		return returnList;
	}
}
