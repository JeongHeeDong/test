package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("PmEpcMonitorDAO")
public interface PmEpcMonitorDAO {
	
	public String getMaxDateTime();
	public List<Map<String,String>> getMmeSearchData(Map<String,Object> paramMap);
	public List<Map<String,String>> getPgwSearchData(Map<String,Object> paramMap);
	public List<Map<String,String>> getSgwSearchData(Map<String,Object> paramMap);
	public List<Map<String,String>> getHssSearchData(Map<String,Object> paramMap);
	public List<Map<String,String>> getPcrfSearchData(Map<String,Object> paramMap);
	public List<Map<String,Object>> getPopEpcTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopEpcDetailData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopEpcDetailDataAll(HashMap<String,Object> paramMap);
}
