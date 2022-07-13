package com.ltem.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ltem.v2.dto.TbCoAccessInfoDTO;
import com.ltem.v2.dto.TbSeMenuDTO;
import com.ltem.v2.dto.TbSeUserDTO;
import com.ltem.v2.dto.TbSeWebLogDTO;
import com.ltem.v2.dto.TbSmNoticeBoardDTO;

@Repository("V2DAO")
public interface V2DAO {
	
	public TbSeMenuDTO getMenuV2(String menuUri) throws Exception;
	public TbSeUserDTO getUserByLoginV2(TbSeUserDTO tbSeUser) throws Exception;
	public TbSeUserDTO getUserByIdV2(TbSeUserDTO tbSeUser) throws Exception;
	public TbSeUserDTO getUserByLoginIdV2(TbSeUserDTO tbSeUser) throws Exception;
	public int getUserPasswordUpdateHistoryCount(TbSeUserDTO tbSeUser) throws Exception;
	public void insertUserPasswordHistory(TbSeUserDTO tbSeUser) throws Exception;
	public void updateUserPassword(TbSeUserDTO tbSeUser) throws Exception;
	public void updatePasswordErrCnt(TbSeUserDTO tbSeUser) throws Exception;
	public void updateInitPasswordErrCnt(TbSeUserDTO tbSeUser) throws Exception;
	public TbSeWebLogDTO getLastLoginInfo(TbSeWebLogDTO tbSeWebLog) throws Exception;
	public TbSmNoticeBoardDTO getMainNotice() throws Exception;
	public List<TbCoAccessInfoDTO> getAccessInfo() throws Exception;
	public void updateAccessInfo(TbCoAccessInfoDTO accessInfo) throws Exception;
}
