package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 보안 > 권한 관리 > 허용 아이피 관리
 *
 */
public interface PermitIpService {
	public List<Map<String,Object>> getParmitIpList();
	public int saveIp(HashMap<String,String> paramMap);
	public int ipDel(List<HashMap<String,String>> paramList);
}
