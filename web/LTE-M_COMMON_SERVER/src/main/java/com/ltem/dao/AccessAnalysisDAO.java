package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("AccessAnalysisDAO")
public interface AccessAnalysisDAO {
	public List<Map<String,String>> getAccessGridData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getAccessDTPGridData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getAccessHANDGridData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopAccessAnalysisData(HashMap<String,Object> paramMap);
}
