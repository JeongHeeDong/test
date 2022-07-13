package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 주제어장치 관리 에서 hss정보 가지고 오는데 사용됨(기존에는 페이지가 따로 분리 되어 있었음)
 *
 */
public interface HssService {
	
	public Map<String,Object> getHssDetail(String hss_id);
	public int hssDetailupdate(HashMap<String,Object> paramMap);
	public int hssIdCheckResult(String hss_id);
	public int hssAdd(HashMap<String,Object> paramMap);
}
