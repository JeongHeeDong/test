package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.MainMonitorDAO;
import com.ltem.dao.PmAccessMonitorDAO;
import com.ltem.service.MainMonitorService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("MainMonitorService")
public class MainMonitorServiceImpl extends EgovAbstractServiceImpl implements MainMonitorService {

	@Autowired
	MainMonitorDAO mainMonitorDAO;
	@Autowired
	PmAccessMonitorDAO pmAccessMonitorDAO;
	
	private static final Logger log = LoggerFactory.getLogger(MainMonitorServiceImpl.class);

	@Override
	public Map<String, Object> getPerformData(HashMap<String,Object> paramMap) {
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		Map<String,Object> etcFilterMap = new HashMap<String,Object>();
		etcFilterMap = pmAccessMonitorDAO.getEtcFilter(paramMap);
		
		String access_event_time = mainMonitorDAO.getAccessEventTime();
		
		paramMap.put("equip_type", 2);
		paramMap.put("flag",1);
		List<Map<String,Object>> selectEquip = pmAccessMonitorDAO.equipSelectList(paramMap);
		paramMap.put("flag", 0);
		List<Map<String,Object>> exceptSelectEquip = pmAccessMonitorDAO.equipSelectList(paramMap);
		
		String select_equip = "0";
		String exceptSelect_equip = "0";
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
				select_equip = "";
				isfirst = false;
			}
			select_equip += map.get("SYSTEM_ID")+",";
		}
		
		if(!"0".equals(select_equip)){
			select_equip = select_equip.substring(0, select_equip.length()-1);
		}
		
		isfirst = true;
		for(Map<String,Object> map : exceptSelectEquip){
			if(isfirst){
				exceptSelect_equip = "";
				isfirst = false;
			}
			exceptSelect_equip += map.get("SYSTEM_ID")+",";
		}
		if(!"0".equals(exceptSelect_equip)){
			exceptSelect_equip = exceptSelect_equip.substring(0, exceptSelect_equip.length()-1);
		}
		
		if("1".equals(std_att)){
			String std_date = etcFilterMap.get("STD_DATE")+"";
			std_date = std_date.substring(0,8);
			std_date += access_event_time.substring(8, access_event_time.length());
			paramMap.put("STD_DATE",std_date);
		}
		
		paramMap.put("select_equip", select_equip);
		paramMap.put("exceptSelect_equip", exceptSelect_equip);
		paramMap.put("event_time", access_event_time);
		
		
		Map<String,String> map = new HashMap<String,String>();
		map = mainMonitorDAO.getDuLevel(paramMap);
		returnMap.put("DU", map == null? 4 : map.get("LEVEL"));
		returnMap.put("DU_CRITICAL", map.get("LEVEL_CRITICAL"));
		returnMap.put("DU_MAJOR", map.get("LEVEL_MAJOR"));
		returnMap.put("DU_MINOR", map.get("LEVEL_MINOR"));
		
		returnMap.put("DU_SERVER_STAT", map.get("SERVER_STAT"));
		returnMap.put("DU_MAX_ACT_SBY", map.get("MAX_ACT_SBY"));

		//LTE-M RU 사용 안함 
//		map = mainMonitorDAO.getRuLevel(paramMap);
//		returnMap.put("RU", map == null ? 4 : map.get("LEVEL"));
//		returnMap.put("RU_CRITICAL", map.get("LEVEL_CRITICAL"));
//		returnMap.put("RU_MAJOR", map.get("LEVEL_MAJOR"));
//		returnMap.put("RU_MINOR", map.get("LEVEL_MINOR"));
		
		return returnMap;
	}

	@Override
	public int getDuActiveCount() {
		return mainMonitorDAO.getDuActiveCount();
	}

	@Override
	public List<Map<String, String>> getUserMenuAuth() {
		return mainMonitorDAO.getUserMenuAuth();
	}

}
