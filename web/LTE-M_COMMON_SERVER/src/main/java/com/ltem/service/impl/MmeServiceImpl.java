package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.MmeDAO;
import com.ltem.service.MmeService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("MmeService")
public class MmeServiceImpl extends EgovAbstractServiceImpl implements MmeService {

	@Autowired
	MmeDAO mmeDAO;
	
	private static final Logger log = LoggerFactory.getLogger(MmeServiceImpl.class);

	@Override
	public Map<String, Object> getMmeDetail(String mme_id) {
		// TODO Auto-generated method stub
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		returnMap.put("mmeDetail", mmeDAO.getMmeDetail(mme_id));
		/*
		 * LTEM 사용 안함
		 * returnMap.put("mmeDetail_Node",mmeDAO.getMmeDetail_Node(mme_id));
		 * returnMap.put("mmeDetail_Ntp",mmeDAO.getMmeDetail_Ntp(mme_id));
		 * returnMap.put("mmeDetail_Port",mmeDAO.getMmeDetail_Port(mme_id));
		 */
		
		return returnMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int mmeDetailupdate(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = mmeDAO.mmeDetailupdate(paramMap);
		
		return returnStr;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int mmeDetaildelete(HashMap<String, Object> paramMap) {
		int returnStr = 0;
		
		returnStr = mmeDAO.mmeDetaildelete(paramMap);
		
		return returnStr;
	}

	@Override
	public int mmeIdCheckResult(String mme_id) {
		return mmeDAO.mmeIdCheckResult(mme_id);
	}

	@Override
	public int mmeAdd(HashMap<String, Object> paramMap) {
		int returnFlag = 1;
		
		try{
			mmeDAO.mmeAdd(paramMap);
		}catch(Exception e){
			log.error(e.getMessage());
			returnFlag = 0;
		}
		
		return returnFlag;
	}


}
