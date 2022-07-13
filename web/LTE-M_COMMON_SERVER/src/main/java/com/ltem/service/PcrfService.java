package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 주제어장치 관리 에서 pcrf정보 가지고 오는데 사용됨(기존에는 페이지가 따로 분리 되어 있었음)
 *
 */
public interface PcrfService {
	
	public Map<String,Object> getPcrfDetail(String pcrf_id);
	public int pcrfDetailupdate(HashMap<String,Object> paramMap);
	public int pcrfDetaildelete(HashMap<String,Object> paramMap);
	public int pcrfIdCheckResult(String pcrf_id);
	public int pcrfAdd(HashMap<String,Object> paramMap);
}
