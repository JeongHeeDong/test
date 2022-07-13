package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public interface PhoneDAO {
	public int selectPhoneTotalCount(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectPhoneList(HashMap<String, String> paramMap);
	public int insertPhone(HashMap<String, String> paramMap);
	public int deletePhone(HashMap<String, String> paramMap);	
	public int updatePhone(HashMap<String, String> paramMap);
	public List<Map<String, String>> selectPhoneUseCodeList(HashMap<String, String> paramMap);
}
