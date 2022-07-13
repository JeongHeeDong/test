package com.ltem.v2.service;

import java.util.List;

import com.ltem.v2.dto.TbCoAccessInfoDTO;
import com.ltem.v2.dto.TbSeMenuDTO;
import com.ltem.v2.dto.TbSeUserDTO;
import com.ltem.v2.dto.TbSeWebLogDTO;
import com.ltem.v2.dto.TbSmNoticeBoardDTO;

public interface V2Service {
	/**
	 * 메뉴 정보 조회 by URI
	 * @param menuUri
	 * @return
	 * @throws Exception
	 */
	public TbSeMenuDTO getMenuV2(String menuUri) throws Exception;
	/**
	 * 사용자 정보 조회 (로그인)
	 * @param tbSeUser
	 * @return
	 * @throws Exception
	 */
	public TbSeUserDTO getUserByLoginV2(TbSeUserDTO tbSeUser) throws Exception;
	/**
	 * 사용자 정보 조회 (아이디)
	 * @param tbSeUser
	 * @return
	 * @throws Exception
	 */
	public TbSeUserDTO getUserByIdV2(TbSeUserDTO tbSeUser) throws Exception;
	
	/**
	 * 1년 이내 비밀번호 사용 이력 조회
	 * @param tbSeUser
	 * @return
	 * @throws Exception
	 */
	public int getUserPasswordUpdateHistoryCount(TbSeUserDTO tbSeUser) throws Exception;
	
	/**
	 * 비밀번호 변경
	 * 
	 * @param tbSeUser
	 * @param updatePassword
	 * @throws Exception
	 */
	public void updateUserPassword(TbSeUserDTO tbSeUser, String updatePassword) throws Exception;

	/**
	 * 비밀번호 오류횟수 증가
	 * @param tbSeUser
	 * @throws Exception
	 */
	public void updatePasswordErrCnt(TbSeUserDTO tbSeUser) throws Exception;
	/**
	 * 비밀번호 오류횟수 초기화
	 * @param tbSeUser
	 * @throws Exception
	 */
	public void updateInitPasswordErrCnt(TbSeUserDTO tbSeUser) throws Exception; 

	public TbSeWebLogDTO getLastLoginInfo(TbSeWebLogDTO tbSeWebLog) throws Exception;
	
	public TbSmNoticeBoardDTO getMainNotice() throws Exception;
	
	public List<TbCoAccessInfoDTO> getAccessInfo() throws Exception;
	
	public void updateAccessInfo(TbCoAccessInfoDTO accessInfo) throws Exception;
	
}
