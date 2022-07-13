package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemNoticeManagerDAO")
public interface SystemNoticeManagerDAO {
	public List<Map<String,String>> getNoticeData(HashMap<String, String> paramMap);
	public Map<String, String> getOneNoticeData(HashMap<String, String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
	public String getFilePath(String fileName);
	public int insertNoti(HashMap<String, String> paramMap);
	public int deleteNoti(HashMap<String, String> paramMap);	
	public int updateNoti(HashMap<String, String> paramMap);
}
