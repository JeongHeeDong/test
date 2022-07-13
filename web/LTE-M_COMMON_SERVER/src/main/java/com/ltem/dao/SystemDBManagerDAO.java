package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemDBManagerDAO")
public interface SystemDBManagerDAO {
	public List<String> getHostName();
	public List<Map<String,String>> getTableInfo(HashMap<String, String> paramMap);
	public int insertBakData(HashMap<String, Object> requestMap) throws Exception;
	public int updateBakData(HashMap<String, Object> requestMap);
	public List<Map<String,String>> getBakData(HashMap<String, String> paramMap);
	public Map<String,String> getOneBakData(HashMap<String, String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
	public int delBakData(HashMap<String, String> requestMap);
}
