package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("UnauthSearchDAO")
public interface UnauthSearchDAO {
	public List<Map<String,String>> getUnauthData(HashMap<String,Object> paramMap);
}
