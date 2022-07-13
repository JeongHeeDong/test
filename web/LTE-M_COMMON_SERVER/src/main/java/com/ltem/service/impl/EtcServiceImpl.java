package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.EtcDAO;
import com.ltem.service.EtcService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("EtcService")
public class EtcServiceImpl extends EgovAbstractServiceImpl implements EtcService {

	@Autowired
	EtcDAO etcDAO;
	
	private static final Logger log = LoggerFactory.getLogger(EtcServiceImpl.class);

	@Override
	public List<Map<String, Object>> getEtcSearch(HashMap<String,Object> paramMap) {
		return etcDAO.getEtcSearch(paramMap);
	}

	@Override
	public Map<String, Object> getEtcDetail(String etc_id) {
		return etcDAO.getEtcDetail(etc_id);
	}
	
	@Override
	public Map<String, Object> getEtcEmsDetail(String etc_id, String etc_type) {
		HashMap<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("etc_id", etc_id);
		paramMap.put("etc_type", etc_type);
		
		return etcDAO.getEtcEmsDetail(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getEtcSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String,String>> equipName = etcDAO.getEquipName();
		List<Map<String,String>> vendor = etcDAO.getVendor();
		
		returnMap.put("EQUIP", equipName);
		returnMap.put("VENDOR", vendor);
		
		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int etcDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = etcDAO.etcDetailupdate(paramMap);
		
		try{
			if(paramMap.containsKey("rtf_ips")) {
				returnStr = etcDAO.rtfIpUpdate(paramMap);
			}
			if(paramMap.containsKey("rtf_station")) {
				returnStr = etcDAO.rtfStationUpdate(paramMap);
			}
		} catch(Exception e){
			returnStr = 1;
			log.error(e.getMessage());
		}
		
		return returnStr;
	}
	
	@Override
	public int etcEmsDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = etcDAO.etcEmsDetailupdate(paramMap);
		
		return returnStr;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int etcDetaildelete(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = etcDAO.etcDetaildelete(paramMap);
		
		try{
			if(paramMap.containsKey("rtf_ips")) {
				returnStr = etcDAO.rtfIpDelete(paramMap);
			}
			if(paramMap.containsKey("rtf_station")) {
				returnStr = etcDAO.rtfStationDelete(paramMap);
			}
		} catch(Exception e){
			returnStr = 1;
			log.error(e.getMessage());
		}
		
		return returnStr;
	}
	
	@Override
	public int etcEmsDetaildelete(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = etcDAO.etcEmsDetaildelete(paramMap);
		
		return returnStr;
	}

	@Override
	public int etcIdCheckResult(String etc_id) {
		return etcDAO.etcIdCheckResult(etc_id);
	}
	
	@Override
	public int etcEmsIdCheckResult(String etc_id, String equip_type) {
		HashMap<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("etc_id", etc_id);
		paramMap.put("equip_type", equip_type);
		
		return etcDAO.etcEmsIdCheckResult(paramMap);
	}

	@Override
	public int etcAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			etcDAO.etcAdd(paramMap);
			
			if(paramMap.containsKey("rtf_data")) {
				etcDAO.rtfInsert(paramMap);
			}
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}
	
	@Override
	public int etcEmsAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		try {
			etcDAO.etcEmsAdd(paramMap);
		} catch(Exception e) {
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}
	
	@Override
	public List<Map<String, Object>> getRtfDetailData(HashMap<String, Object> paramMap) {
		
		return etcDAO.getRtfDetailData(paramMap);
	}


}
