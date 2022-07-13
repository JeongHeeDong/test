package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("PmThresholdDAO")
public interface PmThresholdDAO {
	
	public int thresholdMod(HashMap<String,Object> paramMap);
	public int thresholdCheck(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getSearchData(HashMap<String,Object> paramMap);
}
