package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.controllers.SystemDBDeleteController;
import com.ltem.dao.SystemDBDeleteDAO;
import com.ltem.service.SystemDBDeleteService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemDBDeleteService")
public class SystemDBDeleteServiceImpl extends EgovAbstractServiceImpl implements SystemDBDeleteService {
	
	private static final Logger log = LoggerFactory.getLogger(SystemDBDeleteServiceImpl.class);
	
	@Autowired
	SystemDBDeleteDAO systemDBDeleteDAO;

	@Override
	public List<Map<String, String>> getDelData(HashMap<String, String> paramMap) {
		List<Map<String,String>> returnList = systemDBDeleteDAO.getDelData(paramMap);
		
		return returnList;
	}

	@Override
	public int getTotalCnt(HashMap<String, String> paramMap) {
		
		int returnVal = systemDBDeleteDAO.getTotalCnt(paramMap);
		
		return returnVal;
	}

	@Override
	public List<Map<String, String>> getPopTableInfo(String tableNm) {
		
		List<Map<String,String>> returnList = systemDBDeleteDAO.getPopTableInfo(tableNm);
		
		return returnList;
	}

	@Override
	public int cyclePopMod(HashMap<String, String> paramMap) {
		try{
			// 삭제주기를 일자로 치환해서 저장함.
			if("M".equals(paramMap.get("del_type"))) {
				int delCycle = Integer.parseInt(paramMap.get("del_cycle").toString());
				paramMap.put("del_type", "D");
				paramMap.put("del_cycle", Integer.toString(delCycle * 30));
			}
			systemDBDeleteDAO.cyclePopMod(paramMap);
		}catch(Exception e){
			log.error("삭제 주기 대상 수정  실패: \n"+e.getMessage());
			return 0;
		}
		
		return 1;
	}
}
