package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("HssEmsDAO")
public interface HssEmsDAO {
	public List<Map<String,Object>> getHssEmsSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getHssEmsDetail(String hssEms_id);
	public List<Map<String,String>> getVendor();
	public Map<String,Object> maxID();
	public int hssEmsDetailupdate(HashMap<String,Object> paramMap);
	public int hssEmsIdCheckResult(String hssEms_id);
	public void hssEmsAdd(HashMap<String,Object> paramMap);
	
}
