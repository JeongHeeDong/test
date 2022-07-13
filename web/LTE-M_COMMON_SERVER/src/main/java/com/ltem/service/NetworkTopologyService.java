package com.ltem.service;

import java.util.List;
import java.util.Map;

/**
 * 
 * 통합감시 > 네트워크 토폴로지
 *
 */
public interface NetworkTopologyService {
	
	public Map<String,Object> getMonitorTime();

	/**
	 * 서비스장비, 주제어장치, 스위치, 응용시스템 목록 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getEquipList(Map<String, Object> paramMap);
	
	/**
	 * DU 목록 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getDuList(Map<String, Object> paramMap);
	
	/**
	 * RU 목록 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getRuList(Map<String, Object> paramMap);

	/**
	 * 성능 트렌드 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getQualityTrend(Map<String, Object> paramMap);

	/**
	 * 성능 상세 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getDetailPerformance(Map<String, Object> paramMap);

	/**
	 * 고장 상세 조회
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getDetailFailure(Map<String, Object> paramMap);

	/**
	 * system list 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getSystemList(Map<String, Object> paramMap);

	/**
	 * 스위치 정보 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getSwitchPortState(Map<String, Object> paramMap);

	/**
	 * 서버상태 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getServerStatData(Map<String, Object> paramMap);

	public List<Map<String, Object>> getSwitchCategory();

	public List<Map<String, Object>> getRecoverInfo(Map<String, Object> paramMap);

	public List<Map<String, Object>> getRecoverEquipDefault();

	public List<Map<String, Object>> getRecoverEquipDuRu();

	public Map<String, Object> getDetailRecover(Map<String, Object> paramMap);

	public List<Map<String, Object>> getRecoverEquipSwitch();
	
	public List<Map<String, Object>> getRecoverEquipJrg();

	public int updateDetailRecover(Map<String, Object> paramMap);


}
