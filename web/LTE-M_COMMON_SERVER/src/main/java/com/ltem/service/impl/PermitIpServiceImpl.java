package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.ltem.dao.PermitIpDAO;
import com.ltem.service.PermitIpService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PermitIpService")
public class PermitIpServiceImpl extends EgovAbstractServiceImpl implements PermitIpService {
	
	private static final Logger log = LoggerFactory.getLogger(PermitIpServiceImpl.class);
	
	@Autowired
	PermitIpDAO permitIpDAO;

	@Override
	public List<Map<String, Object>> getParmitIpList() {
		
		return permitIpDAO.getParmitIpList();
	}

	@Override
	public int saveIp(HashMap<String, String> paramMap) {
		
		int result = 0;
		
		try{
			permitIpDAO.saveIp(paramMap);
			result = 0;
			return result;
		}catch(DuplicateKeyException e){
			result = 1;
			return result;
		}catch(Exception e){
			result = 2;
			return result;
		}
	}

	@Override
	public int ipDel(List<HashMap<String, String>> paramList) {
		int index = 0;
		
		for(HashMap<String,String> map : paramList){
			index += ipDelete(map);
		}
		
		return index;
	}

	public int ipDelete(HashMap<String,String> paramMap){
		
		try{
			permitIpDAO.ipDel(paramMap);
		}catch(Exception e){
			log.error("삭제 주기 대상 삭제  실패: \n"+e.getMessage());
			return 0;
		}
		
		return 1;
	}
}
