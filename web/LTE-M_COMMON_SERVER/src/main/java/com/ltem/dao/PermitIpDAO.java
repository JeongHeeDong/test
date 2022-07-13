package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("PermitIpDAO")
public interface PermitIpDAO {
	public List<Map<String,Object>> getParmitIpList();
	public int saveIp(HashMap<String,String> paramMap);
	public void ipDel(HashMap<String,String> paramMap);
}
