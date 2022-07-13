package com.ltem.dao;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("SwitchDAO")
public interface SwitchDAO {
	public List<Map<String, String>> getSwitchList();
	public List<Map<String,Object>> getSwitchDetail(HashMap<String, Object> paramMap);
	public int switchModify(HashMap<String, Object> paramMap);
	public List<Map<String,Object>> getSwitchDescDetail(HashMap<String, Object> paramMap);
	public int switchDescSave(Map<String, Object> paramMap);
	public List<String> getCategoryList();
}
