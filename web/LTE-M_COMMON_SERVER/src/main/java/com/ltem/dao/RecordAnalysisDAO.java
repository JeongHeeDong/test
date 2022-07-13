package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public interface RecordAnalysisDAO {
	public List<Map<String,String>> getGridData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopDetailData(HashMap<String,Object> paramMap);
}
