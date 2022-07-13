package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("EmsDAO")
public interface EmsDAO {
	public List<Map<String,Object>> getEmsSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getEmsDetail(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getVendor();
	public Map<String,Object> maxID();
	public int emsDetailupdate(HashMap<String,Object> paramMap);
	public int emsIdCheckResult(String ems_id);
	public void emsAdd(HashMap<String,Object> paramMap);
	
}
