package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemSmsLogManagerDAO")
public interface SystemSmsLogManagerDAO {
	public List<Map<String,String>> getSmsLogData(HashMap<String, String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
}
