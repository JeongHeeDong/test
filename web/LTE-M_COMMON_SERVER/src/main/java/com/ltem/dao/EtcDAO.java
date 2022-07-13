package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("EtcDAO")
public interface EtcDAO {
	public List<Map<String,Object>> getEtcSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getEtcDetail(String etc_id);
	public Map<String,Object> getEtcEmsDetail(HashMap<String,String> paramMap);
	public List<Map<String,String>> getEquipName();
	public List<Map<String,String>> getVendor();
	public int etcDetailupdate(HashMap<String,Object> paramMap);
	public int etcEmsDetailupdate(HashMap<String,Object> paramMap);
	public int etcDetaildelete(HashMap<String,Object> paramMap);
	public int etcEmsDetaildelete(HashMap<String,Object> paramMap);
	public int rtfIpUpdate(HashMap<String,Object> paramMap);
	public int rtfStationUpdate(HashMap<String,Object> paramMap);
	public int rtfIpDelete(HashMap<String,Object> paramMap);
	public int rtfStationDelete(HashMap<String,Object> paramMap);
	public int etcIdCheckResult(String etc_id);
	public int etcEmsIdCheckResult(HashMap<String,String> paramMap);
	public void etcAdd(HashMap<String,Object> paramMap);
	public void etcEmsAdd(HashMap<String,Object> paramMap);
	public void rtfInsert(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getRtfDetailData(HashMap<String,Object> paramMap);
	
}
