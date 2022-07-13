package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;
/**
 * 
 * 기지국 중계기 관리 > 기지국 Channel Card 현황 조회
 *
 */
public interface DuChcSearchService {
	
	public Map<String, List<Map<String, String>>> getSearchOption();
	public List<Map<String,Object>> getduChcSearch(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getChcSearch(HashMap<String,Object> paramMap);
}
