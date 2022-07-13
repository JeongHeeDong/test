package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("EpcDAO")
public interface EpcDAO {
	public List<Map<String,Object>> getEpcSearch(HashMap<String,Object> paramMap);
	public List<Map<String,String>> getEmsName();
	public List<Map<String,String>> getVendor();
	
}
