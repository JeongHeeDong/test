package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 시스템 > 데이터 관리 > 삭제 주기 관리
 *
 */
public interface SystemDBDeleteService {
	public List<Map<String,String>> getDelData(HashMap<String, String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
	public List<Map<String,String>> getPopTableInfo(String tableNm);
	public int cyclePopMod(HashMap<String,String> paramMap);
}
