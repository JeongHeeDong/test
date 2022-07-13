package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 구성관리 > 기타 장치 관리
 *
 */
public interface EtcService {
	
	public List<Map<String,Object>> getEtcSearch(HashMap<String,Object> paramMap);
	public Map<String,Object> getEtcDetail(String etc_id);
	public Map<String,Object> getEtcEmsDetail(String etc_id, String etc_type);
	public Map<String, List<Map<String, String>>> getEtcSearchOption();
	public int etcDetailupdate(HashMap<String,Object> paramMap);
	public int etcDetaildelete(HashMap<String,Object> paramMap);
	public int etcEmsDetailupdate(HashMap<String,Object> paramMap);
	public int etcEmsDetaildelete(HashMap<String,Object> paramMap);
	public int etcIdCheckResult(String etc_id);
	public int etcEmsIdCheckResult(String etc_id, String equip_type);
	public int etcAdd(HashMap<String,Object> paramMap);
	public int etcEmsAdd(HashMap<String,Object> paramMap);
	public List<Map<String,Object>> getRtfDetailData(HashMap<String,Object> paramMap);
}
