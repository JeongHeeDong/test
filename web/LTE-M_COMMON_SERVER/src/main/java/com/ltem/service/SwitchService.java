package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 구성관리 > 스위치 관리 > 스위치 상태 확인
 * 구성관리 > 스위치 관리 > 스위치 연결 관리
 *
 */
public interface SwitchService {
	public List<Object> getSwitchDetail(HashMap<String, Object> paramMap);
	public int switchModify(List<HashMap<String, Object>> paramList);
	public List<Object> getSwitchDescDetail(HashMap<String, Object> paramMap);
	public int switchDescSave(List<String> paramList);
	public List<String> getCategoryList();
	public Map<String, List<Map<String, String>>> getSearchOption();
}
