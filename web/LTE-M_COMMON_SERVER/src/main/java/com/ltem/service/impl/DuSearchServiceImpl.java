package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.DuSearchDAO;
import com.ltem.service.DuSearchService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("DuSearchService")
public class DuSearchServiceImpl extends EgovAbstractServiceImpl implements DuSearchService {

	@Autowired
	DuSearchDAO duSearchDAO;
	
	@Autowired
	CodeDAO codeDAO;
	
	private static final Logger log = LoggerFactory.getLogger(DuSearchServiceImpl.class);

	@Override
	public Map<String, List<Map<String,String>>> getDuSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String,String>> emsName = duSearchDAO.getEmsName();
		List<Map<String,String>> du = duSearchDAO.getDu();
		List<Map<String,String>> team = duSearchDAO.getTeam();
		List<Map<String,String>> vendor = duSearchDAO.getVendor();
		List<Map<String,String>> station = duSearchDAO.getStationr();
		List<Map<String,String>> stationLine = codeDAO.selectStationLine();
//		List<Map<String,String>> boardType = duSearchDAO.getBoardType();
		
		returnMap.put("EMSNAME", emsName);
		returnMap.put("DU", du);
		returnMap.put("TEAM", team);
		returnMap.put("VENDOR", vendor);
		returnMap.put("STATION", station);
		returnMap.put("STATIONLINE", stationLine);
//		returnMap.put("BOARDTYPE", boardType);
		
		return returnMap;
	}

	@Override
	public List<Map<String, Object>> getDuSearch(HashMap<String,Object> paramMap) {

		List<Map<String,Object>> resultList = duSearchDAO.getDuSearch(paramMap);
		
		return resultList;
	}

	@Override
	public Map<String, Object> getDuDetail(String cUid) {
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		Map<String,Object> returnBasicInfo = duSearchDAO.getBasicInfo(cUid);
		Map<String,Object> returnPropertyInfo = duSearchDAO.getPropertyInfo(cUid);
		//Map<String,Object> returnManagerInfo = duSearchDAO.getManagerInfo(cUid);
		Map<String,Object> returnAddrInfo = duSearchDAO.getAddrInfo(cUid);
		//Map<String,Object> returnOperatorInfo = duSearchDAO.getOperationsInfo(cUid);
		//List<Map<String,Object>> returnRuInfo = duSearchDAO.getRuInfo(cUid);
		//List<Map<String,Object>> returnChCardInfo = duSearchDAO.getChCardInfo(cUid);
		//List<Map<String,Object>> returnCellInfo = duSearchDAO.getCellInfo(cUid);
		
		
		returnMap.put("returnBasicInfo", returnBasicInfo);
		returnMap.put("returnPropertyInfo", returnPropertyInfo);
		//returnMap.put("returnOperationsInfo", returnOperatorInfo);
		//returnMap.put("returnManagerInfo", returnManagerInfo);
		returnMap.put("returnAddrInfo", returnAddrInfo);
		//returnMap.put("returnRuInfo", returnRuInfo);
		//returnMap.put("returnChCardInfo", returnChCardInfo);
		//returnMap.put("returnCellInfo", returnCellInfo);
		
		
		return returnMap;
	}

	@SuppressWarnings("unchecked")
	@Transactional
	@Override
	public int duDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = duSearchDAO.duDetail_update(paramMap);
//		if (paramMap.get("station_id") != null && !paramMap.get("station_id").equals("") ) {
//			returnStr = duSearchDAO.ruStation_update(paramMap); 
//		}
		paramMap.put("system_id",paramMap.get("du_id"));
		paramMap.put("equip_name",paramMap.get("du_name"));
		paramMap.put("equip_type","2");
		returnStr = duSearchDAO.duEquipAct_update(paramMap);
		
		return returnStr;
	}
	
	
	@SuppressWarnings("unchecked")
	@Transactional
	@Override
	public int duDetaildelete(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = duSearchDAO.duDetail_delete(paramMap);
//		if (paramMap.get("station_id") != null && !paramMap.get("station_id").equals("") ) {
//			returnStr = duSearchDAO.ruStation_update(paramMap); 
//		}
		paramMap.put("system_id",paramMap.get("du_id"));
		paramMap.put("equip_type","2");
		returnStr = duSearchDAO.duEquipAct_delete(paramMap);
		
		return returnStr;
	}

	@Transactional
	@Override
	public int duAdd(Map<String, Object> requestParam){
		int result = 0;
		
		try{
			duSearchDAO.duAdd(requestParam);
			requestParam.put("system_id",requestParam.get("du_id"));
			requestParam.put("equip_name",requestParam.get("du_name"));
			requestParam.put("equip_type", "2");
			requestParam.put("node", "A_SIDE");
			requestParam.put("defaultActSby", "A");
			requestParam.put("currentActSby", "A");
			duSearchDAO.duAddEquipAct(requestParam);
			requestParam.put("node", "B_SIDE");
			requestParam.put("defaultActSby", "S");
			requestParam.put("currentActSby", "S");
			duSearchDAO.duAddEquipAct(requestParam);
			return result;
		}catch(DuplicateKeyException e){
			result = 1;
			return result;
		}catch(Exception e){
			result = 2;
			log.error(e.getMessage());
			return result;
		}
	}

	@Override
	public int duIdCheckResult(String du_id) {
		
		return duSearchDAO.duIdCheckResult(du_id);
	}
	
//	@Transactional
//	@Override
//	public int duAddEquipAct(Map<String, Object> requestParam) {
//		int result = 0;
//		
//		try{
//			duSearchDAO.duAddEquipAct(requestParam);
//			result = 0;
//			requestParam.put("node", "A_SIDE");
//			requestParam.put("defaultActSby", "A");
//			requestParam.put("currentActSby", "A");
//			result = duSearchDAO.duAddEquipAct(requestParam);
//			requestParam.put("node", "B_SIDE");
//			requestParam.put("defaultActSby", "S");
//			requestParam.put("currentActSby", "S");
//			result = duSearchDAO.duAddEquipAct(requestParam);
//			return result;
//		}catch(DuplicateKeyException e){
//			result = 1;
//			return result;
//		}catch(Exception e){
//			result = 2;
//			log.error(e.getMessage());
//			return result;
//		}
//	}
}
