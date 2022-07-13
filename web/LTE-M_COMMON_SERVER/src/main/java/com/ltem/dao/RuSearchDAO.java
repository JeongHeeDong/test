package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

@Repository("RuSearchDAO")
public interface RuSearchDAO {
	
	public List<Map<String,String>> getEmsName();
	public List<Map<String,String>> getDu();
	public List<Map<String,String>> getRuType();
	public List<Map<String,String>> getTeam();
	public List<Map<String,String>> getVendor();
	public List<Map<String,String>> getStationInfo();
	public List<Map<String,String>> getStation();

	public List<Map<String,Object>> getRuSearch(HashMap<String,Object> paramMap);
	
	public Map<String,Object> getBasicInfo(String cUid);
	public Map<String,Object> getPropertyInfo(String cUid);
	public Map<String,Object> getLocationInfo(String cUid);
	public Map<String,Object> getManagerInfo (String cUid);
	public Map<String,Object> getAddrInfo(String cUid);
	
	public int ruDetail_update(HashMap<String,Object> paramMap);
	public int ruAdd(Map<String, Object> requestParam)throws DuplicateKeyException;
	public int duStation_update(HashMap<String, Object> paramMap);
	public int ruStation_update(HashMap<String, Object> paramMap);
}
