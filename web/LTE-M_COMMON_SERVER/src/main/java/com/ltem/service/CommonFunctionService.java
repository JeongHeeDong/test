package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 
 * 몇몇 공통기능(접속이력, 메뉴권한정보, 알람해지 및 인지 이력)
 *
 */
public interface CommonFunctionService {
	
	
	public void insertWebLog(Map<String,Object> param)throws Exception;
	public List<HashMap<String,String>> getMenuAuthList()throws Exception;
	public void f_detectionLog_insert(HashMap<String,String> paramMap)throws Exception;
	public void putFailureInfoClear(HashMap<String,Object> paramMap)throws Exception;
	public String getEventTime(String... tableNames);
}
