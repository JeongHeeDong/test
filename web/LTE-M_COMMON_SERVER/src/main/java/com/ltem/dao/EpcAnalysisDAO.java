package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("EpcAnalysisDAO")
public interface EpcAnalysisDAO {
	public List<Map<String,String>> getMmeGridData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getPgwGridData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getSgwGridData(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getHpsGridData(HashMap<String,Object> paramMap);
	//public List<Map<String,String>> getPcrfGridData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopMmeDetailData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopPgwDetailData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopSgwDetailData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopHssDetailData(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getPopPcrfDetailData(HashMap<String,Object> paramMap);
}
