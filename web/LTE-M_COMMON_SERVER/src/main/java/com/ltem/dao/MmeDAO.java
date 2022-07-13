package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("MmeDAO")
public interface MmeDAO {
	public Map<String,Object> getMmeDetail(String mme_id);
	public List<Map<String,Object>> getMmeDetail_Node(String mme_id);
	public List<Map<String,Object>> getMmeDetail_Ntp(String mme_id);
	public List<Map<String,Object>> getMmeDetail_Port(String mme_id);
	public int mmeDetailupdate(HashMap<String,Object> paramMap);
	public int mmeDetaildelete(HashMap<String,Object> paramMap);
	public int mmeIdCheckResult(String mme_id);
	public void mmeAdd(HashMap<String,Object> paramMap);
	
}
