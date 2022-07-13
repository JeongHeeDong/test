package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("CommonFunctionDAO")
public interface CommonFunctionDAO {
	
	public void insertWebLog(Map<String,Object> param)throws Exception;
	public List<HashMap<String,String>> getMenuAuthList()throws Exception;
	public void f_detectionLog_insert(HashMap<String,String> paramMap)throws Exception;
	public void putFailureInfoClear(HashMap<String,Object> paramMap)throws Exception;
	public String getEventTime(String... tableNames);
}
