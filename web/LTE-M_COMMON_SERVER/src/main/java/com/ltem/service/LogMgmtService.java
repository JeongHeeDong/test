package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 보안 > 접속 이력 > 접속 이력 조회
 *
 */
public interface LogMgmtService {
    public List<Map<String,String>> getLogMgmtList(HashMap<String, Object> paramMap);
}
