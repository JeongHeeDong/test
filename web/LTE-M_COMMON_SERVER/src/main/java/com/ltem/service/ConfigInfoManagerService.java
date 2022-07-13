package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 구성관리 > 구성변경 관리
 *
 */
public interface ConfigInfoManagerService {
	
	public List<Map<String, Object>> getconfiginfoData();
	public Map<String,Object> getGridData(HashMap<String,String> paramMap);
	public int checkAdd(HashMap<String,Object> paramMap);
	public int checkMod(HashMap<String,Object> paramMap);
	public int checkDel(HashMap<String,Object> paramMap);
	
}
