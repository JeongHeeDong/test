package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("CnEmsDAO")
public interface CnEmsDAO {
	public List<Map<String,Object>> getCnEmsSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getCnEmsDetail(String cnEms_id);
	public List<Map<String,Object>> getCnEmsDetailGrid(String cnEms_id);
	public List<Map<String,String>> getVendor();
	public Map<String,Object> maxID();
	public int cnEmsDetailupdate(HashMap<String,Object> paramMap);
	public int cnEmsIdCheckResult(String cnEms_id);
	public void cnEmsAdd(HashMap<String,Object> paramMap);
	
}
