package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 구성관리 > 기지국 중계기 관리 > 중계기 관리
 *
 */
public interface RuSearchService {
	public Map<String,List<Map<String,String>>>getRuSearchOption();
	public List<Map<String,String>> getRuLocation();
	public List<Map<String,Object>> getRuSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getRuDetail(String cUid);
	public int ruDetailupdate(HashMap<String,Object> paramMap);
	public int ruAdd(Map<String,Object> paramMap);
}
