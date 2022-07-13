package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public interface PmRecordMonitorDAO {
	
	public String getMaxDateTime();
	public List<Map<String,String>> getCallSearchData(Map<String,Object> paramMap);
	public List<Map<String,String>> getPttSearchData(Map<String,Object> paramMap);
	public List<Map<String,Object>> getPopRecordTrendData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopRecordDetailData(HashMap<String,Object> paramMap);
}
