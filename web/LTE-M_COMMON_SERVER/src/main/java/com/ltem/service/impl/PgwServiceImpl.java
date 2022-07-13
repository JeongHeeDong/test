package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.PgwDAO;
import com.ltem.service.PgwService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PgwService")
public class PgwServiceImpl extends EgovAbstractServiceImpl implements PgwService {

	@Autowired
	PgwDAO pgwDAO;
	
	private static final Logger log = LoggerFactory.getLogger(PgwServiceImpl.class);

	@Override
	public Map<String, Object> getPgwDetail(String pgw_id) {
		 pgwDAO.getPgwDetail(pgw_id);
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		returnMap.put("pgwDetail", pgwDAO.getPgwDetail(pgw_id));
//		returnMap.put("pgwDetail_Node",pgwDAO.getPgwDetail_Node(pgw_id));
//		returnMap.put("pgwDetail_Ntp",pgwDAO.getPgwDetail_Ntp(pgw_id));
//		returnMap.put("pgwDetail_Port",pgwDAO.getPgwDetail_Port(pgw_id));
		
		return returnMap;
	}

	@SuppressWarnings("unchecked")
	@Override
	public int pgwDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = pgwDAO.pgwDetailupdate(paramMap);
		
		return returnStr;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int pgwDetaildelete(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = pgwDAO.pgwDetaildelete(paramMap);
		
		return returnStr;
	}

	@Override
	public int pgwIdCheckResult(String pgw_id) {
		return pgwDAO.pgwIdCheckResult(pgw_id);
	}

	@Override
	public int pgwAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			pgwDAO.pgwAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}


}
