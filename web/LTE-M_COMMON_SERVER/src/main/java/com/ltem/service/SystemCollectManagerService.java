package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 시스템 > 수집 관리
 *
 */
public interface SystemCollectManagerService {
	public Map<String, List<Map<String,Object>>> getColData(String flag);
	public int updateTHD(HashMap<String, Object> paramMap);
}
