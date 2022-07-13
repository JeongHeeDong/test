package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 성능통계 전체 메뉴에대한 기능
 * 성능통계 > 기지국 통계 > 호처리 통계 > RRC-ESTABLISH 통계
 * 성능통계 > 기지국 통계 > 호처리 통계 > ERAB-SETUP 통계
 * 성능통계 > 기지국 통계 > 호처리 통계 > ERAB-SETUP ADD 통계
 * 성능통계 > 기지국 통계 > 호처리 통계 > CALL DROP 통계
 * 성능통계 > 기지국 통계 > PACKET 통계
 * 성능통계 > 기지국 통계 > Hand Over 통계 > INTRA ENB 통계
 * 성능통계 > 기지국 통계 > Hand Over 통계 > X2 IN 통계
 * 성능통계 > 기지국 통계 > Hand Over 통계 > X2 OUT 통계
 * 성능통계 > 주제어장치 통계 > MME 통계 > ATTACH 통계
 * 성능통계 > 주제어장치 통계 > MME 통계 > SERVICE REQUEST 통계
 * 성능통계 > 주제어장치 통계 > PGW 통계 > Bearer Activate 통계
 * 성능통계 > 주제어장치 통계 > PGW 통계 > Bearer Modify 통계
 * 성능통계 > 주제어장치 통계 > PGW 통계 > Bearer Delete 통계
 * 성능통계 > 주제어장치 통계 > SGW 통계 > Bearer Activate 통계
 * 성능통계 > 주제어장치 통계 > SGW 통계 > Bearer Modify 통계
 * 성능통계 > 주제어장치 통계 > SGW 통계 > Bearer Delete 통계
 * 성능통계 > 주제어장치 통계 > HSS 통계 > DIAMETER STACK 통계
 * 성능통계 > 주제어장치 통계 > HSS 통계 > S6A 인터페이스 통계
 * 성능통계 > 주제어장치 통계 > HSS 통계 > S13 인터페이스 통계
 * 성능통계 > 주제어장치 통계 > HSS 통계 > SP 인터페이스 통계
 * 성능통계 > 주제어장치 통계 > PCRF 통계 > PCEF 통계
 * 성능통계 > 주제어장치 통계 > PCRF 통계 > SPR 통계
 *
 */
public interface PerformStatisService {
	
	public HashMap<String,String> getPegComments(HashMap<String,Object> paramMap);
	public List<String> getPackageVer(String equip_type);
	public int getPegCount(HashMap<String,Object> paramMap);
	
	public List<HashMap<String,String>> getDuList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getMmeList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getPgwList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getSgwList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getPcrfList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getSystemList(HashMap<String,Object> paramMap);

    public List<HashMap<String,String>> getDataInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getDataInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getDataExcel(HashMap<String,Object> paramMap);

	public List<HashMap<String,String>> getAttachInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getAttachInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getAttachExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getSrInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getSrInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getSrExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getSgsapInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getSgsapInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getSgsapExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getPgwInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getPgwInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getPgwExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getSgwInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getSgwInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getSgwExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getDiameterInfoList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getDiameterInfoListLength(HashMap<String,Object> paramMap);
	public Map<String,List<Map<String,String>>> getDiameterExcel(HashMap<String,Object> paramMap);
	
	public List<HashMap<String,String>> getS6AInfoList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getS6AInfoListLength(HashMap<String,Object> paramMap);
	public Map<String,List<Map<String,String>>> getS6AExcel(HashMap<String,Object> paramMap);
	
	public List<HashMap<String,String>> getS13InfoList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getS13InfoListLength(HashMap<String,Object> paramMap);
	public Map<String,List<Map<String,String>>> getS13Excel(HashMap<String,Object> paramMap);
	
	public List<HashMap<String,String>> getSPInfoList(HashMap<String,Object> paramMap);
	public List<HashMap<String,String>> getSPInfoListLength(HashMap<String,Object> paramMap);
	public Map<String,List<Map<String,String>>> getSPExcel(HashMap<String,Object> paramMap);
	
	public List<HashMap<String,String>> getPcefInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getPcefInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getPcefExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getSprInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getSprInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getSprExcel(HashMap<String,Object> paramMap);
	
	public List<HashMap<String,String>> getAfInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getAfInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getAfExcel(HashMap<String,Object> paramMap);
    
    public List<HashMap<String,String>> getRecordInfoList(HashMap<String,Object> paramMap);
    public List<HashMap<String,String>> getRecordInfoListLength(HashMap<String,Object> paramMap);
    public Map<String,List<Map<String,String>>> getRecordExcel(HashMap<String,Object> paramMap);
}
