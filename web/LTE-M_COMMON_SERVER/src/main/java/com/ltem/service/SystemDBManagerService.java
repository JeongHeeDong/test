package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 시스템 > 데이터 관리 > 백업 관리
 *
 */
public interface SystemDBManagerService {
	public List<String> getHostName();
	public List<Map<String,String>> getTableInfo(HashMap<String, String> paramMap);
	public int insertBakData(HashMap<String, Object> paramMap) throws Exception;
	public int updateBakData(HashMap<String, Object> requestMap);
	public Map<String,List<Map<String,String>>> getBakData(HashMap<String, String> paramMap);
	public Map<String,String> getOneBakData(HashMap<String, String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
	public int delBakData(HashMap<String, String> requestMap);
}
