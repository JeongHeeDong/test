package com.ltem.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.ltem.v2.dto.TbSeUserDTO;

@Repository("AccountMgmtDAO")
public interface AccountMgmtDAO {
    public List<Map<String, String>> getAccountList(HashMap<String, Object> paramMap);
    public int accountRegister(HashMap<String, Object> paramMap);
    public int accountModify(HashMap<String, Object> paramMap);
    public int accountRemove(HashMap<String, Object> paramMap);
    public int initPassword(TbSeUserDTO tbSeUser);
    public int accountDuplicationCheck(HashMap<String, Object> paramMap);
    public int accountPwdDuplicationCheck(HashMap<String, Object> paramMap);
    public List<Map<String, String>> getUserRoll();
    public Map<String, Object> selectAccountInfo(HashMap<String, Object> paramMap);
}
