package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

@Repository("ConfigInfoManagerDAO")
public interface ConfigInfoManagerDAO {
	
	public HashMap<String,String> getMaxUpDateTime();
	public List<Map<String,Object>> getStandardList(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getCompareList(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getconfiginfoData();
	public List<Map<String,String>> getHeaderList(String comptable);
	public int valueMap(Map<String,Object> paramMap);
	public void checkAdd(Map<String, Object> valueMap);
	public void checkMod(Map<String,Object> valueMap);
	public void checkDel(Map<String,Object> valueMap);
	public HashMap<String,Object> getModSelectMap(Map<String, Object> valueMap);
	
}
