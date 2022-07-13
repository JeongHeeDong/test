package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 보안 > 접속 관리 > 부정사용 조회
 *
 */
public interface UnauthSearchService {
	
	public List<Map<String,String>> getUnauthData(HashMap<String,Object> paramMap);
}
