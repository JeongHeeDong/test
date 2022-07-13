package com.ltem.dao;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("LogMgmtDAO")
public interface LogMgmtDAO {
    public List<Map<String, String>> getLogMgmtList(HashMap<String, Object> paramMap);
}
