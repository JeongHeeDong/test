package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;
/**
 * 
 * 구성관리 > 기지국 관리
 *
 */
public interface DuSearchService {
	
	public Map<String, List<Map<String,String>>> getDuSearchOption();
	public List<Map<String,Object>> getDuSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getDuDetail(String cUid);
	public int duIdCheckResult(String du_id);
	public int duDetailupdate(HashMap<String,Object> paramMap);
	public int duDetaildelete(HashMap<String,Object> paramMap);
	public int duAdd(Map<String, Object> requestParam);
//	public int duAddEquipAct(Map<String, Object> paramMap);
}
