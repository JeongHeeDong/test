package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

@Repository("DuChcSearchDAO")
public interface DuChcSearchDAO {
	public List<Map<String, String>> getEmsName();
	public List<Map<String,Object>> getduChcSearch(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getChcSearch(HashMap<String,Object> paramMap);
	
}
