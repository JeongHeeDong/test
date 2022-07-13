package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("PcrfDAO")
public interface PcrfDAO {
	public Map<String,Object> getPcrfDetail(String pcrf_id);
	public List<Map<String,Object>> getPcrfDetail_Node(String pcrf_id);
	public List<Map<String,Object>> getPcrfDetail_Ntp(String pcrf_id);
	public List<Map<String,Object>> getPcrfDetail_Port(String pcrf_id);
	public int pcrfDetailupdate(HashMap<String,Object> paramMap);
	public int pcrfDetaildelete(HashMap<String,Object> paramMap);
	public int pcrfIdCheckResult(String pcrf_id);
	public void pcrfAdd(HashMap<String,Object> paramMap);
	
}
