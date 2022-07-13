package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SgwDAO")
public interface SgwDAO {
	public List<Map<String,Object>> getSgwSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getSgwDetail(String sgw_id);
	public List<Map<String,String>> getEmsName();
	public List<Map<String,String>> getVendor();
	public int sgwDetailupdate(HashMap<String,Object> paramMap);
	public int sgwIdCheckResult(String sgw_id);
	public void sgwAdd(HashMap<String,Object> paramMap);
	
}
