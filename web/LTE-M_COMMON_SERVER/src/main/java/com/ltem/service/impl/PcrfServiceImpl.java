package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.PcrfDAO;
import com.ltem.service.PcrfService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PcrfService")
public class PcrfServiceImpl extends EgovAbstractServiceImpl implements PcrfService {

	@Autowired
	PcrfDAO pcrfDAO;
	
	private static final Logger log = LoggerFactory.getLogger(PcrfServiceImpl.class);

	@Override
	public Map<String, Object> getPcrfDetail(String pcrf_id) {
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		returnMap.put("pcrfDetail", pcrfDAO.getPcrfDetail(pcrf_id));
//		returnMap.put("pcrfDetail_Node",pcrfDAO.getPcrfDetail_Node(pcrf_id));
//		returnMap.put("pcrfDetail_Ntp",pcrfDAO.getPcrfDetail_Ntp(pcrf_id));
//		returnMap.put("pcrfDetail_Port",pcrfDAO.getPcrfDetail_Port(pcrf_id));

		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int pcrfDetailupdate(HashMap<String, Object> paramMap) {
		// TODO Auto-generated method stub
		int returnStr = 0;
		
		returnStr = pcrfDAO.pcrfDetailupdate(paramMap);
		
		return returnStr;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int pcrfDetaildelete(HashMap<String, Object> paramMap) {
		// TODO Auto-generated method stub
		int returnStr = 0;
		
		returnStr = pcrfDAO.pcrfDetaildelete(paramMap);
		
		return returnStr;
	}
	
	@Override
	public int pcrfIdCheckResult(String pcrf_id) {
		// TODO Auto-generated method stub
		
		return pcrfDAO.pcrfIdCheckResult(pcrf_id);
	}

	@Override
	public int pcrfAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			pcrfDAO.pcrfAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}


}
