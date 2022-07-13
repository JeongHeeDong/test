package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("AccessStatisticsDAO")
public interface AccessStatisticsDAO {
	public List<Map<String,String>> getStatisticsData(HashMap<String,Object> paramMap);
}