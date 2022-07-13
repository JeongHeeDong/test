package com.ltem.dao;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("MenuAuthMgmtDAO")
public interface MenuAuthMgmtDAO {
    public List<Map<String, String>> getMenuList(HashMap<String, Object> paramMap);
    public int modifyMenuAuth(Map paramMap);
}
