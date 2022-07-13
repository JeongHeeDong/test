package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("LoginDAO")
public interface LoginDAO {
	public List<Map<String,Object>> getloginCheck(HashMap<String,Object> paramMap) throws Exception;
	public int getloginIDCheck(HashMap<String,Object> paramMap) throws Exception;
	public Map<String,String> chechMenuAuth(Map<String,String> paramMap) throws Exception;
	public List<Map<String,Object>> getNotice() throws Exception;
	public Map<String,Object> getNoticeContents(HashMap<String, String> paramMap) throws Exception;
	public void upDateLoginTime(HashMap<String,Object> param) throws Exception;
	public List<Map<String, Object>> getMenuList(String userId) throws Exception;
	public int permitIpCnt(String user_ip) throws Exception;
}
