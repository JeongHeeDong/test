package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("SystemDBDeleteDAO")
public interface SystemDBDeleteDAO {
	public List<Map<String,String>> getDelData(HashMap<String,String> paramMap);
	public int getTotalCnt(HashMap<String, String> paramMap);
	public List<Map<String,String>> getPopTableInfo(String tableNm);
	public void cyclePopSave(HashMap<String,String> paramMap);
	public void cyclePopMod(HashMap<String,String> paramMap);
	public void cyclePopDel(HashMap<String,String> paramMap);
}
