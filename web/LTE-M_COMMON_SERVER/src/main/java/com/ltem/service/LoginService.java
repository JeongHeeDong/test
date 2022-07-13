package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 로그인페이지 및 관련 기능(id, pw 검사 및 메뉴 권한 확인, 공지사항 표기, 로그인 로그 추가, ip 체크 등)
 *
 */
public interface LoginService {
	public List<Map<String,Object>> getloginCheck(HashMap<String,Object> paramMap) throws Exception;
	public int getloginIDCheck(HashMap<String,Object> paramMap)throws Exception;
	public Map<String,String> checkMenuAuth(Map<String,String> paramMap) throws Exception;
	public List<Map<String,Object>> getNotice() throws Exception;
	public Map<String,Object> getNoticeContents(HashMap<String, String> paramMap) throws Exception;
	public void upDateLoginTime(HashMap<String,Object> param)throws Exception;
	public String getMenuList(String param)throws Exception;
	public boolean permitIpCheck(String user_ip);
}
