package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("HssDAO")
public interface HssDAO {
	public Map<String,Object> getHssDetail(String hss_id);
	public int hssDetailupdate(HashMap<String,Object> paramMap);
	public int hssIdCheckResult(String hss_id);
	public void hssAdd(HashMap<String,Object> paramMap);
	
}
