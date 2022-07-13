package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("PgwDAO")
public interface PgwDAO {
	public Map<String,Object> getPgwDetail(String pgw_id);
	public List<Map<String,Object>> getPgwDetail_Node(String pgw_id);
	public List<Map<String,Object>> getPgwDetail_Ntp(String pgw_id);
	public List<Map<String,Object>> getPgwDetail_Port(String pgw_id);
	public int pgwDetailupdate(HashMap<String,Object> paramMap);
	public int pgwDetaildelete(HashMap<String,Object> paramMap);
	public int pgwIdCheckResult(String pgw_id);
	public void pgwAdd(HashMap<String,Object> paramMap);
	
}
