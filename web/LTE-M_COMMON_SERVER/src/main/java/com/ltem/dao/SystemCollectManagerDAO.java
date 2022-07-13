package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemCollectManagerDAO")
public interface SystemCollectManagerDAO {
	public List<Map<String, Object>> getColData(String word);
	public List<Map<String,Object>> getColFailureData();
	public List<Map<String, Object>> getTHD();
	public int updateTHD(HashMap<String, Object> paramMap);
}
