package com.ltem.v2.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.V2DAO;
import com.ltem.v2.dto.TbCoAccessInfoDTO;
import com.ltem.v2.dto.TbSeMenuDTO;
import com.ltem.v2.dto.TbSeUserDTO;
import com.ltem.v2.dto.TbSeWebLogDTO;
import com.ltem.v2.dto.TbSmNoticeBoardDTO;
import com.ltem.v2.service.V2Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("V2Service")
public class V2ServiceImpl extends EgovAbstractServiceImpl implements V2Service {

	@Autowired
	V2DAO v2Dao;

	private static final Logger log = LoggerFactory.getLogger(V2ServiceImpl.class);

	@Override
	public TbSeMenuDTO getMenuV2(String menuUri) throws Exception {
		return v2Dao.getMenuV2(menuUri);
	}
	
	@Override
	public TbSeUserDTO getUserByLoginV2(TbSeUserDTO tbSeUser) throws Exception {

		/*
		 * v2/login javascript 에서 sha256 처리
		 * HashingUtil hu = new HashingUtil();
		 * tbSeUser.setUserPassword(hu.encrypt(tbSeUser.getUserPassword()));
		 */
		return v2Dao.getUserByLoginV2(tbSeUser);
	}
	
	
	@Override
	public TbSeUserDTO getUserByIdV2(TbSeUserDTO tbSeUser) throws Exception {
		return v2Dao.getUserByIdV2(tbSeUser);
	}	

	
	@Override
	public int getUserPasswordUpdateHistoryCount(TbSeUserDTO tbSeUser) throws Exception {
		return v2Dao.getUserPasswordUpdateHistoryCount(tbSeUser);
	}	
	
	@Override
	public void updateUserPassword(TbSeUserDTO tbSeUser, String updatePassword) throws Exception {
		
		try {
			// 기존 비밀번호 기준
			if (tbSeUser.getPasswordUpdateTIme() == null) {
				tbSeUser.setPasswordUpdateTIme(new java.util.Date());
			}
			v2Dao.insertUserPasswordHistory(tbSeUser);
			
		} catch (Exception e) {
			// Transaction 이 안됨 ....
			log.error(">>> updateUserPassword exception : " + e.getMessage());
		}
		
		// 신규 비밀번호 기준
		tbSeUser.setUserPassword(updatePassword);
		v2Dao.updateUserPassword(tbSeUser);
	}	
	
	@Override
	public void updatePasswordErrCnt(TbSeUserDTO tbSeUser) throws Exception {
		v2Dao.updatePasswordErrCnt(tbSeUser);
	}
	
	@Override
	public void updateInitPasswordErrCnt(TbSeUserDTO tbSeUser) throws Exception {
		v2Dao.updateInitPasswordErrCnt(tbSeUser);
	}
	
	@Override
	public TbSeWebLogDTO getLastLoginInfo(TbSeWebLogDTO tbSeWebLog) throws Exception {
		return v2Dao.getLastLoginInfo(tbSeWebLog);
	}
	
	@Override
	public TbSmNoticeBoardDTO getMainNotice() throws Exception {
		return v2Dao.getMainNotice();
	}
	
	@Override
	public List<TbCoAccessInfoDTO> getAccessInfo() throws Exception {
		return v2Dao.getAccessInfo();
	}
	
	@Override
	public void updateAccessInfo(TbCoAccessInfoDTO accessInfo) throws Exception {
		v2Dao.updateAccessInfo(accessInfo);
	}
	
}
