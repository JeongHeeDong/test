package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

@Repository("DuSearchDAO")
public interface DuSearchDAO {
	
	public List<Map<String,String>> getEmsName();
	public List<Map<String,String>> getDu();
	public List<Map<String,String>> getTeam();
	public List<Map<String,String>> getVendor();
	public List<Map<String,String>> getStationr();
	public List<Map<String,Object>> getDuSearch(HashMap<String,Object> paramMap);
	
	public Map<String,Object> getBasicInfo(String cUid);
	public Map<String,Object> getPropertyInfo(String cUid);
	public Map<String,Object> getOperationsInfo(String cUid);
	public Map<String,Object> getManagerInfo (String cUid);
	public Map<String,Object> getAddrInfo(String cUid);
	public List<Map<String,Object>> getRuInfo(String cUid);
	public List<Map<String,Object>> getChCardInfo(String cUid);
	public List<Map<String,Object>> getCellInfo(String cUid);
	
	public int duIdCheckResult(String du_id);
	public int duDetail_update(HashMap<String,Object> paramMap);
	public int duDetail_delete(HashMap<String,Object> paramMap);
	public int duAdd(Map<String, Object> requestParam)throws DuplicateKeyException;
	public void duAddEquipAct(Map<String, Object> requestParam);
	public int duEquipAct_update(HashMap<String, Object> paramMap);
	public int duEquipAct_delete(Map<String, Object> paramMap);
	public int equipActCheckResult(Map<String, Object> paramMap);
	public int ruStation_update(HashMap<String, Object> paramMap);
	
}
