package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ltem.dao.PhoneDAO;
import com.ltem.service.PhoneService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class PhoneServiceImpl extends EgovAbstractServiceImpl implements PhoneService {
	
	@Autowired
	PhoneDAO phoneDAO;
	
	private static final Logger log = LoggerFactory.getLogger(PhoneServiceImpl.class);
	
	@Override
	public int getPhoneTotalCount(HashMap<String, String> paramMap) {
		return phoneDAO.selectPhoneTotalCount(paramMap);
	}
	
	@Override
	public List<Map<String, String>> getPhoneList(HashMap<String, String> paramMap) {
		return phoneDAO.selectPhoneList(paramMap);
	}
	
	@Override
	@Transactional
	public int insertPhone(HashMap<String, String> paramMap) {
		return phoneDAO.insertPhone(paramMap);
	}
	
	@Override
	@Transactional
	public int updatePhone(HashMap<String, String> paramMap) {
		return phoneDAO.updatePhone(paramMap);
	}
	
	@Override
	@Transactional
	public int deletePhone(List<String> phoneNoList) {
		for(String phoneNo : phoneNoList) {
			HashMap<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("PHONE_NO", phoneNo);
			phoneDAO.deletePhone(paramMap);
		}
		return 1; 
	}
	
	@Override
	public List<Map<String, String>> getPhoneUseCodeList(HashMap<String, String> paramMap) {
		return phoneDAO.selectPhoneUseCodeList(paramMap);
	}
}
