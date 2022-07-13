package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 주제어장치 관리 에서 GW정보 가지고 오는데 사용됨(기존에는 페이지가 따로 분리 되어 있었음)
 *
 */
public interface PgwService {
	
	public Map<String,Object> getPgwDetail(String pgw_id);
	public int pgwDetailupdate(HashMap<String,Object> paramMap);
	public int pgwDetaildelete(HashMap<String,Object> paramMap);
	public int pgwIdCheckResult(String pgw_id);
	public int pgwAdd(HashMap<String,Object> paramMap);
}
