package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 시스템 > 공지사항 관리
 *
 */
public interface SystemNoticeManagerService {
	public int updateNoti(HashMap<String, String> paramMap);
	public int deleteNoti(HashMap<String, String> paramMap);
	public int insertNoti(HashMap<String, String> paramMap);
	public Map<String, List<Map<String, String>>> getNoticeData(HashMap<String, String> paramMap);
	public Map<String, String> getOneNoticeData(HashMap<String, String> paramMap);
	public String getFilePath(String fileName);
	public int getTotalCnt(HashMap<String, String> paramMap);
}
