package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * 구성관리 > 단말 관리
 *
 */
public interface PhoneService {
	public int getPhoneTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> getPhoneList(HashMap<String, String> paramMap);
	public int insertPhone(HashMap<String, String> paramMap);
	public int updatePhone(HashMap<String, String> paramMap);
	public int deletePhone(List<String> phoneNoList);
	public List<Map<String, String>> getPhoneUseCodeList(HashMap<String, String> paramMap);
}
