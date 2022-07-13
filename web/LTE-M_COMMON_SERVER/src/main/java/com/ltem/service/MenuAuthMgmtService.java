package com.ltem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * 보안 > 권한 관리 > 메뉴 권한 관리
 *
 */
public interface MenuAuthMgmtService {
    public List<Map<String,String>> getMenuList(HashMap<String, Object> paramMap);
    public Map<String, String> modifyMenuAuth(HashMap<String, Object> paramMap);
}
