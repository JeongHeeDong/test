package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 시스템 > 서버 프로세스 관리 > 프로세스 관리
 * 시스템 > 서버 프로세스 관리 > 프로세스 이력
 *
 */
public interface SystemProcessManagerService {
	public Map<String,Object> getProcData(String word);
	public List<String> getProcSearchOption();
	
	//이벤트 플로우 관리
	public List<Map<String, Object>> getServerList();
	public List<String> getGroupList();
	public List<Map<String, Object>> getPortList(HashMap<String, String> paramMap);
	public List<Map<String, Object>> getNodeList(HashMap<String, String> paramMap);
	
	//이벤트 픞로우 이력
	public int getSioefHistoryCnt(HashMap<String, String> paramMap);
	public List<Map<String, Object>> getSioefHistoryList(HashMap<String, String> paramMap);
	
	public void sioefNodeStatusUpdate(HashMap<String, String> paramMap);
	
	public List<Map<String, Object>> getSioefStateData(HashMap<String, String> paramMap);
}
