package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.EtcDAO;
import com.ltem.service.CodeService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class CodeServiceImpl extends EgovAbstractServiceImpl implements CodeService {
	
	@Autowired
	CodeDAO codeDAO;
	
	@Autowired
	EtcDAO etcDAO;
	
	private static final Logger log = LoggerFactory.getLogger(CodeServiceImpl.class);
	
	@Override
	public int getVendorTotalCount(HashMap<String, String> paramMap) {
		return codeDAO.selectVendorTotalCount(paramMap);
	}
	
	@Override
	public List<Map<String, String>> getVendorList(HashMap<String, String> paramMap) {
		return codeDAO.selectVendorList(paramMap);
	}
	
	@Override
	@Transactional
	public int insertVendor(HashMap<String, String> paramMap) {
		return codeDAO.insertVendor(paramMap);
	}
	
	@Override
	@Transactional
	public int updateVendor(HashMap<String, String> paramMap) {
		return codeDAO.updateVendor(paramMap);
	}
	
	@Override
	@Transactional
	public int deleteVendor(List<Integer> vendorIdList) {
		for(Integer vendorId : vendorIdList) {
			HashMap<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("VENDOR_ID", Integer.toString(vendorId));
			codeDAO.deleteVendor(paramMap);
		}
		return 1; 
	}
	
	
	@Override
	public int getTeamTotalCount(HashMap<String, String> paramMap) {
		return codeDAO.selectTeamTotalCount(paramMap);
	}
	
	@Override
	public List<Map<String, String>> getTeamList(HashMap<String, String> paramMap) {
		return codeDAO.selectTeamList(paramMap);
	}
	
	@Override
	@Transactional
	public int insertTeam(HashMap<String, String> paramMap) {
		return codeDAO.insertTeam(paramMap);
	}
	
	@Override
	@Transactional
	public int updateTeam(HashMap<String, String> paramMap) {
		return codeDAO.updateTeam(paramMap);
	}
	
	@Override
	@Transactional
	public int deleteTeam(List<Integer> teamIdList) {
		for(Integer teamId : teamIdList) {
			HashMap<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("TEAM_ID", Integer.toString(teamId));
			codeDAO.deleteTeam(paramMap);
		}
		return 1; 
	}
	
	
	@Override
	public int getStationTotalCount(HashMap<String, String> paramMap) {
		return codeDAO.selectStationTotalCount(paramMap);
	}
	
	@Override
	public List<Map<String, String>> getStationList(HashMap<String, String> paramMap) {
		return codeDAO.selectStationList(paramMap);
	}
	
	@Override
	@Transactional
	public int insertStation(HashMap<String, String> paramMap) {
		return codeDAO.insertStation(paramMap);
	}
	
	@Override
	@Transactional
	public int updateStation(HashMap<String, String> paramMap) {
		return codeDAO.updateStation(paramMap);
	}
	
	@Override
	@Transactional
	public int deleteStation(List<Integer> stationIdList) {
		for(Integer stationId : stationIdList) {
			HashMap<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("STATION_ID", Integer.toString(stationId));
			codeDAO.deleteStation(paramMap);
		}
		return 1; 
	}
	
	@Override
	public int getStationNumCount(HashMap<String, String> paramMap) {
		return codeDAO.selectStationNumCount(paramMap);
	}
	
	@Override
	public int getPhoneTotalCount(HashMap<String, String> paramMap) {
		return codeDAO.selectPhoneTotalCount(paramMap);
	}
	
	@Override
	public List<Map<String, String>> getPhoneList(HashMap<String, String> paramMap) {
		return codeDAO.selectPhoneList(paramMap);
	}
	
	@Override
	@Transactional
	public int insertPhone(HashMap<String, String> paramMap) {
		return codeDAO.insertPhone(paramMap);
	}
	
	@Override
	@Transactional
	public int updatePhone(HashMap<String, String> paramMap) {
		return codeDAO.updatePhone(paramMap);
	}
	
	@Override
	@Transactional
	public int deletePhone(List<Integer> phoneIdList) {
		for(Integer phoneId : phoneIdList) {
			HashMap<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("USE_CODE", Integer.toString(phoneId));
			codeDAO.deletePhone(paramMap);
		}
		return 1; 
	}
	
	
	
	@Override
	public int getAlarmTotalCount(HashMap<String, String> paramMap) {
		return codeDAO.selectAlarmTotalCount(paramMap);
	}
	
	@Override
	public List<Map<String, String>> getAlarmList(HashMap<String, String> paramMap) {
		return codeDAO.selectAlarmList(paramMap);
	}
	
	@Override
	@Transactional
	public int insertAlarm(HashMap<String, String> paramMap) {
		return codeDAO.insertAlarm(paramMap);
	}
	
	@Override
	@Transactional
	public int updateAlarm(HashMap<String, String> paramMap) {
		return codeDAO.updateAlarm(paramMap);
	}
	
	@Override
	@Transactional
	public int deleteAlarm(List<Map<String, String>> alarmInfoList) {
		for(Map<String, String> alarmInfo : alarmInfoList) {
			codeDAO.deleteAlarm(alarmInfo);
		}
		return 1; 
	}
	
	@Override
	public List<Map<String, String>> getSystemInfo() {
		return codeDAO.selectSystemInfo();
	}
	
	
	@Override
	@Transactional
	public List<Map<String, String>> getVendorInfo() {
		List<Map<String,String>> vendorInfo = etcDAO.getVendor();
		return vendorInfo;
	}
	
	
	
	@Override
	public List<Map<String, String>> getStationLine() {
		return codeDAO.selectStationLine();
	}
}
