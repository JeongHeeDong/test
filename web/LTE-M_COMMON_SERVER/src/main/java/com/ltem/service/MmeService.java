package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 주제어장치 관리 에서 mme정보 가지고 오는데 사용됨(기존에는 페이지가 따로 분리 되어 있었음)
 *
 */
public interface MmeService {
	
	public Map<String,Object> getMmeDetail(String mme_id);
	public int mmeDetailupdate(HashMap<String,Object> paramMap);
	public int mmeDetaildelete(HashMap<String,Object> paramMap);
	public int mmeIdCheckResult(String mme_id);
	public int mmeAdd(HashMap<String,Object> paramMap);
}

