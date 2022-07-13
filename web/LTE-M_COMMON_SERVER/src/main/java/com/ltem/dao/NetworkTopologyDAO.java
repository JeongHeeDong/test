package com.ltem.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("NetworkTopologyDAO")
public interface NetworkTopologyDAO {
	
	public Map<String,Object> getMonitorTime();
	
	/**
	 * 서비스장비, 주제어장치, 스위치, 응용시스템 목록 조회
	 * 
	 * @return
	 */
	public List<Map<String, Object>> getEquipList();
	
	/**
	 * 주제어장치 - MME 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getMmeAttach(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - MME 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getMmeSr(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - MME 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getMmeSrmt(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - HSS 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getHssData(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - PCRF 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getPcrfData(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - SGW 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getSgwAttach(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - SGW 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getSgwModify(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - SGW 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getSgwDelete(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - PGW 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getPgwCreate(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - PGW 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getPgwDelete(Map<String, Object> paramMap);
	
	/**
	 * 주제어장치 - PGW 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getPgwModify(Map<String, Object> paramMap);
	
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
	 * 트렌드 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String,Object>> getQualityTrend(Map<String, Object> paramMap);

	/**
	 * 성능 상세 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getDetailPerformance(Map<String, Object> paramMap);

	/**
	 * 고장 상세 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getDetailFailure(Map<String, Object> paramMap);

	/**
	 * system list 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getSystemList(Map<String, Object> paramMap);

	/**
	 * 스위치 포트 상태 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getSwitchPortState(Map<String, Object> paramMap);

	/**
	 * 스위치 사용 포트 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getSwitchUsePort(Map<String, Object> paramMap);

	/**
	 * REC 성능 알람 조회
	 * 
	 * @param paramMap
	 * @return
	 */
	public Map<String, Object> getRecData(Map<String, Object> paramMap);

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

	public List<Map<String, Object>> getDetailRecover(Map<String, Object> paramMap);

	public List<Map<String, Object>> getRecoverEquipSwitch();
	
	public List<Map<String, Object>> getRecoverEquipJrg();

	public int updateDetailRecover(Map<String, Object> paramMap);
	

}
