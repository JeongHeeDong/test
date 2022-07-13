package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("FailurePerformanceReportDAO")
public interface FailurePerformanceReportDAO {
	public List<Map<String,String>> getFailurePerformData_failure (HashMap<String,Object> paramMap);
	public List<Map<String,String>> getFailurePerformData_access (HashMap<String,Object> paramMap);
	public List<Map<String,String>> getFailurePerformData_epc (HashMap<String,Object> paramMap);
	public List<Map<String, String>> getFailurePerformData_rec(HashMap<String, Object> paramMap);
}
