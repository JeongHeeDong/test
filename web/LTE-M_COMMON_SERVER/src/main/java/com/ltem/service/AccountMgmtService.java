package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

/**
 * 
 * 보안 > 계정 관리
 *
 */
public interface AccountMgmtService {
    public List<Map<String,String>> getAccountList(HashMap<String, Object> paramMap);
    public Map<String, Object> accountRegister(HashMap<String, Object> paramMap);
    public Map<String, Object> accountModify(HashMap<String, Object> paramMap);
    public Map<String, Object> accountRemove(HashMap<String, Object> paramMap);
    public Map<String, Object> initPassword(HashMap<String, Object> paramMap) throws Exception;
    public Map<String, Object> accountDuplicationCheck(HashMap<String, Object> paramMap);
    public Map<String, Object> accountModifyCheck(HashMap<String, Object> paramMap);
    public List<Map<String, String>> getUserRoll();
}
