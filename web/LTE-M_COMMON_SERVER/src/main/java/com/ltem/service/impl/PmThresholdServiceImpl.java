package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.PmThresholdDAO;
import com.ltem.service.PmThresholdService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PmThresholdService")
public class PmThresholdServiceImpl extends EgovAbstractServiceImpl implements PmThresholdService {

	@Autowired
	PmThresholdDAO pmThresholdDao;
	
	private static final Logger log = LoggerFactory.getLogger(PmThresholdServiceImpl.class);

	@Override
	public int thresholdMod(HashMap<String, Object> paramMap) {
		int returnData = 0;
		String sql = getSql("modSql",paramMap);
		
		paramMap.put("sql", sql);
		
		returnData = pmThresholdDao.thresholdMod(paramMap);
		
		return returnData;
	}

	@Override
	public int thresholdCheck(HashMap<String, Object> paramMap) {
		int returnData = 0;
		String sql =  getSql("checkSql",paramMap);
		
		paramMap.put("sql", sql);
		
		returnData = pmThresholdDao.thresholdCheck(paramMap);
		
		return returnData;
	}

	@Override
	public List<Map<String, String>> getSearchData(HashMap<String, Object> paramMap) {
		
		String sql =  getSql("searchSql",paramMap);
		paramMap.put("sql", sql);
		
		List<Map<String,String>> returnMap = pmThresholdDao.getSearchData(paramMap);
		
		return returnMap;
	}

	public String getSql(String sqltype, HashMap<String,Object> paramMap){
		
		String equip = (String)paramMap.get("equip");
		String kpi = (String)paramMap.get("kpi");
		String type = (String)paramMap.get("type");
		String weekday = (String)paramMap.get("weekday");
		String hourscope = (String)paramMap.get("hourscope");
		String flag = (String)paramMap.get("flag");
		String mobileType = (String)paramMap.get("mobileType");
		String storageType = (String)paramMap.get("storageType");
		String sql = "";
		String tableNm = "";
		String where = "1=1 ";
		where += "99".equals(weekday)?"":" AND WEEKDAY = #{weekday} ";
		
		if("searchSql".equals(sqltype)) {
			if(flag.equals("0")) {
				if(kpi.equals("1")) {
					tableNm = "TB_PM_THD_DU";
					where += "99".equals(hourscope)?"":" AND HOUR_SCOPE = #{hourscope} ";
					
					sql = "SELECT WEEKDAY, HOUR_SCOPE, ATT_RATE_MIN_INCR, ATT_RATE_MAJ_INCR, ATT_RATE_CRI_INCR, SEIZER_RATE_MIN, SEIZER_RATE_MAJ, SEIZER_RATE_CRI"
							+ ", ANSWER_RATE_MIN AS ANS_RATE_MIN, ANSWER_RATE_MAJ AS ANS_RATE_MAJ, ANSWER_RATE_CRI AS ANS_RATE_CRI, CD_RATE_MIN, CD_RATE_MAJ, CD_RATE_CRI, ATTEMPT"
							+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
							+ ", ERAB_ATT_RATE_MIN_INCR, ERAB_ATT_RATE_MAJ_INCR, ERAB_ATT_RATE_CRI_INCR, ERAB_ATT_RATE_MIN_DECR, ERAB_ATT_RATE_MAJ_DECR, ERAB_ATT_RATE_CRI_DECR"
							+ " FROM " + tableNm
							+ " WHERE " + where
							+ " LIMIT 1";
					
				} else if(kpi.equals("2")) {
					tableNm = "TB_PM_THD_DTP_DU";
					where += "99".equals(hourscope)?"":" AND HOUR_SCOPE = #{hourscope} ";
					
					sql = "SELECT WEEKDAY, HOUR_SCOPE"
							+ ", UP_VOL_RATE_MIN_INCR, UP_VOL_RATE_MAJ_INCR, UP_VOL_RATE_CRI_INCR"	// Upload Volume 증가율
							+ ", UP_VOL_RATE_MIN_DECR, UP_VOL_RATE_MAJ_DECR, UP_VOL_RATE_CRI_DECR"	// Upload Volume 감소율
							+ ", UP_DTP_RATE_MIN_INCR, UP_DTP_RATE_MAJ_INCR, UP_DTP_RATE_CRI_INCR"	// Upload Throughput 증가율
							+ ", UP_DTP_RATE_MIN_DECR, UP_DTP_RATE_MAJ_DECR, UP_DTP_RATE_CRI_DECR"	// Upload Throughput 감소율
							+ ", DW_VOL_RATE_MIN_INCR, DW_VOL_RATE_MAJ_INCR, DW_VOL_RATE_CRI_INCR"	// Download Volume 증가율    
							+ ", DW_VOL_RATE_MIN_DECR, DW_VOL_RATE_MAJ_DECR, DW_VOL_RATE_CRI_DECR"  // Download Volume 감소율    
							+ ", DW_DTP_RATE_MIN_INCR, DW_DTP_RATE_MAJ_INCR, DW_DTP_RATE_CRI_INCR"  // Download Throughput 증가율
							+ ", DW_DTP_RATE_MIN_DECR, DW_DTP_RATE_MAJ_DECR, DW_DTP_RATE_CRI_DECR"  // Download Throughput 감소율
							+ ", UP_DTP_MIN, UP_DTP_MAJ, UP_DTP_CRI"	// Upload Throughput 임계값
							+ ", DW_DTP_MIN, DW_DTP_MAJ, DW_DTP_CRI"	// Download Throughput 임계값
							+ ", UP_ATTEMPT, DW_ATTEMPT"				// 시도호 제외
							+ " FROM " + tableNm
							+ " WHERE " + where
							+ " LIMIT 1";
					
				} else {
					tableNm = "TB_PM_THD_HANDOVER_DU";
					where += " AND DATA_TYPE = #{type} ";
					
					sql = "SELECT WEEKDAY, ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
							+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
							+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI, ATTEMPT"
							+ " FROM " + tableNm
							+ " WHERE " + where
							+ " LIMIT 1";
				}
				
			} else if(flag.equals("1")) {
				String col = " WEEKDAY, DATA_TYPE, ATTEMPT, ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI, ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR, SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI";
				where += " AND DATA_TYPE = #{kpi} ";
				
				switch (Integer.parseInt(equip)) {
					case 1:
						col = " WEEKDAY, DATA_TYPE, ATTEMPT"
								+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
								+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
								+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI"
								+ ", ANS_RATE_MIN, ANS_RATE_MAJ, ANS_RATE_CRI ";
						
						tableNm = "TB_PM_THD_MME";
						break;
					case 2:
						tableNm = "TB_PM_THD_PGW";
						break;
					case 3:
						tableNm = "TB_PM_THD_SGW";
						break;
					case 4:
						tableNm = "TB_PM_THD_HSS";
						break;
					case 5:
						tableNm = "TB_PM_THD_PCRF";
						break;
				}
				
				sql = "SELECT " + col + " FROM " + tableNm + " WHERE " + where + " LIMIT 1";
				
			} else if(flag.equals("3")) {
				String col = " WEEKDAY, DATA_TYPE, ATTEMPT"
						+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
						+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
						+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI";
				where += "99".equals(storageType) ? "" : " AND DATA_TYPE = #{storageType} ";
				tableNm = " TB_PM_THD_REC ";
				
				sql = "SELECT " + col + " FROM " + tableNm + " WHERE " + where + " LIMIT 1";
				
			} else {
				String col = " WEEKDAY, DATA_TYPE AS PHONE_TYPE, ATTEMPT"
						+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
						+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
						+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI";
				where += "99".equals(mobileType)?"":" AND DATA_TYPE = #{mobileType} ";
				tableNm = " TB_PM_THD_PHONE ";
				
				sql = "SELECT " + col + " FROM " + tableNm + " WHERE " + where + " LIMIT 1";
				
			}
		} else if("checkSql".equals(sqltype)) {
			if(flag.equals("0")) {
				if(kpi.equals("1")) {
					tableNm = "TB_PM_THD_DU";
					where += "99".equals(hourscope)?"":" AND HOUR_SCOPE = #{hourscope} ";
					
					sql = "SELECT COUNT(1) AS COUNT "
							+ " FROM " + tableNm
							+ " WHERE " + where;
					
				} else if(kpi.equals("2")) {
					tableNm = "TB_PM_THD_DTP_DU";
					where += "99".equals(hourscope)?"":" AND HOUR_SCOPE = #{hourscope} ";
					
					sql = "SELECT COUNT(1) AS COUNT "
							+ " FROM " + tableNm
							+ " WHERE " + where;
					
				} else {
					tableNm = "TB_PM_THD_HANDOVER_DU";
					where += " AND DATA_TYPE = #{type} ";
					
					sql = "SELECT COUNT(1) AS COUNT "
							+ " FROM " + tableNm
							+ " WHERE " + where;
				}
				
			} else if(flag.equals("1")) {
				String col = " COUNT(1) AS COUNT ";
				where += " AND DATA_TYPE = #{kpi} ";
				
				switch (Integer.parseInt(equip)) {
					case 1:
						col = " COUNT(1) AS COUNT ";
						tableNm = "TB_PM_THD_MME";
						break;
					case 2:
						tableNm = "TB_PM_THD_PGW";
						break;
					case 3:
						tableNm = "TB_PM_THD_SGW";
						break;
					case 4:
						tableNm = "TB_PM_THD_HSS";
						break;
					case 5:
						tableNm = "TB_PM_THD_PCRF";
						break;
				}
				
				sql = "SELECT " + col + " FROM " + tableNm + " WHERE " + where;
				
			} else if(flag.equals("3")) {
				String col = " COUNT(1) AS COUNT ";
				where += "99".equals(storageType)?"":" AND DATA_TYPE = #{storageType} ";
				tableNm = " TB_PM_THD_REC ";
				
				sql = "SELECT " + col + " FROM " + tableNm + " WHERE " + where;
				
			} else {
				String col = " COUNT(1) AS COUNT ";
				where += "99".equals(mobileType)?"":" AND DATA_TYPE = #{mobileType} ";
				tableNm = " TB_PM_THD_PHONE ";
				
				sql = "SELECT " + col + " FROM " + tableNm + " WHERE " + where;
				
			}
		} else if("modSql".equals(sqltype)) {
			if(flag.equals("0")) {
				if(kpi.equals("1")) {
					tableNm = "TB_PM_THD_DU";
					
					sql = "INSERT INTO "+tableNm +
							"(WEEKDAY, HOUR_SCOPE, ATT_RATE_MIN_INCR, ATT_RATE_MAJ_INCR, ATT_RATE_CRI_INCR, SEIZER_RATE_MIN"
							+ ", SEIZER_RATE_MAJ, SEIZER_RATE_CRI, ANSWER_RATE_MIN, ANSWER_RATE_MAJ, ANSWER_RATE_CRI"
							+ ", CD_RATE_MIN, CD_RATE_MAJ, CD_RATE_CRI, ATTEMPT"
							+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
							+ ", ERAB_ATT_RATE_MIN_INCR, ERAB_ATT_RATE_MAJ_INCR, ERAB_ATT_RATE_CRI_INCR, ERAB_ATT_RATE_MIN_DECR, ERAB_ATT_RATE_MAJ_DECR, ERAB_ATT_RATE_CRI_DECR)"
							+ " VALUES "
							+ "('0', '0', #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}, #{SEIZER_RATE_MIN}, #{SEIZER_RATE_MAJ}, #{SEIZER_RATE_CRI}"
							+ ", #{ANS_RATE_MIN}, #{ANS_RATE_MAJ}, #{ANS_RATE_CRI}, #{CD_RATE_MIN}, #{CD_RATE_MAJ}, #{CD_RATE_CRI}, #{ATTEMPT}"
							+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
							+" , #{ERAB_ATT_RATE_MIN_INCR}, #{ERAB_ATT_RATE_MAJ_INCR}, #{ERAB_ATT_RATE_CRI_INCR}, #{ERAB_ATT_RATE_MIN_DECR}, #{ERAB_ATT_RATE_MAJ_DECR}, #{ERAB_ATT_RATE_CRI_DECR})"
							+ ",('0', '1', #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}, #{SEIZER_RATE_MIN}, #{SEIZER_RATE_MAJ}, #{SEIZER_RATE_CRI}"
							+ ", #{ANS_RATE_MIN}, #{ANS_RATE_MAJ}, #{ANS_RATE_CRI}, #{CD_RATE_MIN}, #{CD_RATE_MAJ}, #{CD_RATE_CRI}, #{ATTEMPT}"
							+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
							+" , #{ERAB_ATT_RATE_MIN_INCR}, #{ERAB_ATT_RATE_MAJ_INCR}, #{ERAB_ATT_RATE_CRI_INCR}, #{ERAB_ATT_RATE_MIN_DECR}, #{ERAB_ATT_RATE_MAJ_DECR}, #{ERAB_ATT_RATE_CRI_DECR})"
							+ ",('1', '0', #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}, #{SEIZER_RATE_MIN}, #{SEIZER_RATE_MAJ}, #{SEIZER_RATE_CRI}"
							+ ", #{ANS_RATE_MIN}, #{ANS_RATE_MAJ}, #{ANS_RATE_CRI}, #{CD_RATE_MIN}, #{CD_RATE_MAJ}, #{CD_RATE_CRI}, #{ATTEMPT}"
							+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
							+" , #{ERAB_ATT_RATE_MIN_INCR}, #{ERAB_ATT_RATE_MAJ_INCR}, #{ERAB_ATT_RATE_CRI_INCR}, #{ERAB_ATT_RATE_MIN_DECR}, #{ERAB_ATT_RATE_MAJ_DECR}, #{ERAB_ATT_RATE_CRI_DECR})"
							+ ",('1', '1', #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}, #{SEIZER_RATE_MIN}, #{SEIZER_RATE_MAJ}, #{SEIZER_RATE_CRI}"
							+ ", #{ANS_RATE_MIN}, #{ANS_RATE_MAJ}, #{ANS_RATE_CRI}, #{CD_RATE_MIN}, #{CD_RATE_MAJ}, #{CD_RATE_CRI}, #{ATTEMPT}"
							+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
							+" , #{ERAB_ATT_RATE_MIN_INCR}, #{ERAB_ATT_RATE_MAJ_INCR}, #{ERAB_ATT_RATE_CRI_INCR}, #{ERAB_ATT_RATE_MIN_DECR}, #{ERAB_ATT_RATE_MAJ_DECR}, #{ERAB_ATT_RATE_CRI_DECR})"
							+ " ON DUPLICATE KEY UPDATE "
							+ " ATT_RATE_MIN_INCR = #{ATT_RATE_MIN}, ATT_RATE_MAJ_INCR = #{ATT_RATE_MAJ}, ATT_RATE_CRI_INCR = #{ATT_RATE_CRI}"
							+ ", SEIZER_RATE_MIN = #{SEIZER_RATE_MIN}, SEIZER_RATE_MAJ = #{SEIZER_RATE_MAJ}, SEIZER_RATE_CRI = #{SEIZER_RATE_CRI}"
							+ ", ANSWER_RATE_MIN = #{ANS_RATE_MIN}, ANSWER_RATE_MAJ = #{ANS_RATE_MAJ}, ANSWER_RATE_CRI = #{ANS_RATE_CRI}"
							+ ", CD_RATE_MIN = #{CD_RATE_MIN}, CD_RATE_MAJ = #{CD_RATE_MAJ}, CD_RATE_CRI = #{CD_RATE_CRI}, ATTEMPT = #{ATTEMPT}" 
							+ ", ATT_RATE_MIN_DECR = #{ATT_RATE_MIN_DECR}, ATT_RATE_MAJ_DECR = #{ATT_RATE_MAJ_DECR}, ATT_RATE_CRI_DECR = #{ATT_RATE_CRI_DECR}"
							+ ", ERAB_ATT_RATE_MIN_INCR =  #{ERAB_ATT_RATE_MIN_INCR}, ERAB_ATT_RATE_MAJ_INCR = #{ERAB_ATT_RATE_MAJ_INCR}, ERAB_ATT_RATE_CRI_INCR = #{ERAB_ATT_RATE_CRI_INCR}"
							+ ", ERAB_ATT_RATE_MIN_DECR = #{ERAB_ATT_RATE_MIN_DECR}, ERAB_ATT_RATE_MAJ_DECR = #{ERAB_ATT_RATE_MAJ_DECR}, ERAB_ATT_RATE_CRI_DECR = #{ERAB_ATT_RATE_CRI_DECR}";
					
				} else if(kpi.equals("2")) {
					tableNm = "TB_PM_THD_DTP_DU";
					where += "99".equals(hourscope)?"":" AND HOUR_SCOPE = #{hourscope} ";
					
					String dtpVal = ", #{UP_VOL_RATE_MIN_INCR}, #{UP_VOL_RATE_MAJ_INCR}, #{UP_VOL_RATE_CRI_INCR}"	// Upload Volume 증가율
							+ ", #{UP_VOL_RATE_MIN_DECR}, #{UP_VOL_RATE_MAJ_DECR}, #{UP_VOL_RATE_CRI_DECR}"	// Upload Volume 감소율
							+ ", #{UP_DTP_RATE_MIN_INCR}, #{UP_DTP_RATE_MAJ_INCR}, #{UP_DTP_RATE_CRI_INCR}"	// Upload Throughput 증가율
							+ ", #{UP_DTP_RATE_MIN_DECR}, #{UP_DTP_RATE_MAJ_DECR}, #{UP_DTP_RATE_CRI_DECR}"	// Upload Throughput 감소율
							+ ", #{DW_VOL_RATE_MIN_INCR}, #{DW_VOL_RATE_MAJ_INCR}, #{DW_VOL_RATE_CRI_INCR}"	// Download Volume 증가율    
							+ ", #{DW_VOL_RATE_MIN_DECR}, #{DW_VOL_RATE_MAJ_DECR}, #{DW_VOL_RATE_CRI_DECR}"  // Download Volume 감소율    
							+ ", #{DW_DTP_RATE_MIN_INCR}, #{DW_DTP_RATE_MAJ_INCR}, #{DW_DTP_RATE_CRI_INCR}"  // Download Throughput 증가율
							+ ", #{DW_DTP_RATE_MIN_DECR}, #{DW_DTP_RATE_MAJ_DECR}, #{DW_DTP_RATE_CRI_DECR}"  // Download Throughput 감소율
							+ ", #{UP_DTP_MIN}, #{UP_DTP_MAJ}, #{UP_DTP_CRI}"	// Upload Throughput 임계값
							+ ", #{DW_DTP_MIN}, #{DW_DTP_MAJ}, #{DW_DTP_CRI}"	// Download Throughput 임계값
							+ ", #{UP_ATTEMPT}, #{DW_ATTEMPT}";					// 시도호 제외
					
					sql = "INSERT INTO "+tableNm +
							"(   WEEKDAY, HOUR_SCOPE"
							+ ", UP_VOL_RATE_MIN_INCR, UP_VOL_RATE_MAJ_INCR, UP_VOL_RATE_CRI_INCR"	// Upload Volume 증가율
							+ ", UP_VOL_RATE_MIN_DECR, UP_VOL_RATE_MAJ_DECR, UP_VOL_RATE_CRI_DECR"	// Upload Volume 감소율
							+ ", UP_DTP_RATE_MIN_INCR, UP_DTP_RATE_MAJ_INCR, UP_DTP_RATE_CRI_INCR"	// Upload Throughput 증가율
							+ ", UP_DTP_RATE_MIN_DECR, UP_DTP_RATE_MAJ_DECR, UP_DTP_RATE_CRI_DECR"	// Upload Throughput 감소율
							+ ", DW_VOL_RATE_MIN_INCR, DW_VOL_RATE_MAJ_INCR, DW_VOL_RATE_CRI_INCR"	// Download Volume 증가율    
							+ ", DW_VOL_RATE_MIN_DECR, DW_VOL_RATE_MAJ_DECR, DW_VOL_RATE_CRI_DECR"  // Download Volume 감소율    
							+ ", DW_DTP_RATE_MIN_INCR, DW_DTP_RATE_MAJ_INCR, DW_DTP_RATE_CRI_INCR"  // Download Throughput 증가율
							+ ", DW_DTP_RATE_MIN_DECR, DW_DTP_RATE_MAJ_DECR, DW_DTP_RATE_CRI_DECR"  // Download Throughput 감소율
							+ ", UP_DTP_MIN, UP_DTP_MAJ, UP_DTP_CRI"	// Upload Throughput 임계값
							+ ", DW_DTP_MIN, DW_DTP_MAJ, DW_DTP_CRI"	// Download Throughput 임계값
							+ ", UP_ATTEMPT, DW_ATTEMPT"				// 시도호 제외
							+ ")"
							+ " VALUES "
							+ " ('0', '0'" + dtpVal + ")"
							+ ",('0', '1'" + dtpVal + ")"
							+ ",('1', '0'" + dtpVal + ")"
							+ ",('1', '1'" + dtpVal + ")"
							+ " ON DUPLICATE KEY UPDATE "
							+ "  UP_VOL_RATE_MIN_INCR = #{UP_VOL_RATE_MIN_INCR}, UP_VOL_RATE_MAJ_INCR = #{UP_VOL_RATE_MAJ_INCR}, UP_VOL_RATE_CRI_INCR = #{UP_VOL_RATE_CRI_INCR}"	// Upload Volume 증가율
							+ ", UP_VOL_RATE_MIN_DECR = #{UP_VOL_RATE_MIN_DECR}, UP_VOL_RATE_MAJ_DECR = #{UP_VOL_RATE_MAJ_DECR}, UP_VOL_RATE_CRI_DECR = #{UP_VOL_RATE_CRI_DECR}"	// Upload Volume 감소율
							+ ", UP_DTP_RATE_MIN_INCR = #{UP_DTP_RATE_MIN_INCR}, UP_DTP_RATE_MAJ_INCR = #{UP_DTP_RATE_MAJ_INCR}, UP_DTP_RATE_CRI_INCR = #{UP_DTP_RATE_CRI_INCR}"	// Upload Throughput 증가율
							+ ", UP_DTP_RATE_MIN_DECR = #{UP_DTP_RATE_MIN_DECR}, UP_DTP_RATE_MAJ_DECR = #{UP_DTP_RATE_MAJ_DECR}, UP_DTP_RATE_CRI_DECR = #{UP_DTP_RATE_CRI_DECR}"	// Upload Throughput 감소율
							+ ", DW_VOL_RATE_MIN_INCR = #{DW_VOL_RATE_MIN_INCR}, DW_VOL_RATE_MAJ_INCR = #{DW_VOL_RATE_MAJ_INCR}, DW_VOL_RATE_CRI_INCR = #{DW_VOL_RATE_CRI_INCR}"	// Download Volume 증가율    
							+ ", DW_VOL_RATE_MIN_DECR = #{DW_VOL_RATE_MIN_DECR}, DW_VOL_RATE_MAJ_DECR = #{DW_VOL_RATE_MAJ_DECR}, DW_VOL_RATE_CRI_DECR = #{DW_VOL_RATE_CRI_DECR}"	// Download Volume 감소율    
							+ ", DW_DTP_RATE_MIN_INCR = #{DW_DTP_RATE_MIN_INCR}, DW_DTP_RATE_MAJ_INCR = #{DW_DTP_RATE_MAJ_INCR}, DW_DTP_RATE_CRI_INCR = #{DW_DTP_RATE_CRI_INCR}"	// Download Throughput 증가율
							+ ", DW_DTP_RATE_MIN_DECR = #{DW_DTP_RATE_MIN_DECR}, DW_DTP_RATE_MAJ_DECR = #{DW_DTP_RATE_MAJ_DECR}, DW_DTP_RATE_CRI_DECR = #{DW_DTP_RATE_CRI_DECR}"	// Download Throughput 감소율
							+ ", UP_DTP_MIN = #{UP_DTP_MIN}, UP_DTP_MAJ = #{UP_DTP_MAJ}, UP_DTP_CRI = #{UP_DTP_CRI}"	// Upload Throughput 임계값
							+ ", DW_DTP_MIN = #{DW_DTP_MIN}, DW_DTP_MAJ = #{DW_DTP_MAJ}, DW_DTP_CRI = #{DW_DTP_CRI}"	// Download Throughput 임계값
							+ ", UP_ATTEMPT = #{UP_ATTEMPT}, DW_ATTEMPT = #{DW_ATTEMPT}" ;		// 시도호 제외
					
				} else {
					tableNm = "TB_PM_THD_HANDOVER_DU";
					where += " AND DATA_TYPE = #{type} ";
					
					sql = "INSERT INTO "+tableNm +
							"(WEEKDAY, DATA_TYPE, ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
							+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
							+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI, ATTEMPT)"
							+ " VALUES "
							+ "('0', #{type}, #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
							+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
							+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}, #{ATTEMPT})"
							+ ", ('1', #{type}, #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
							+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
							+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}, #{ATTEMPT})"
							+ " ON DUPLICATE KEY UPDATE "
							+ " ATT_RATE_MIN = #{ATT_RATE_MIN}, ATT_RATE_MAJ = #{ATT_RATE_MAJ}, ATT_RATE_CRI = #{ATT_RATE_CRI}"
							+ ", ATT_RATE_MIN_DECR = #{ATT_RATE_MIN_DECR}, ATT_RATE_MAJ_DECR=#{ATT_RATE_MAJ_DECR}, ATT_RATE_CRI_DECR = #{ATT_RATE_CRI_DECR}"
							+ ", SUCC_RATE_MIN = #{SUCC_RATE_MIN}, SUCC_RATE_MAJ = #{SUCC_RATE_MAJ}, SUCC_RATE_CRI = #{SUCC_RATE_CRI}"
							+ ", ATTEMPT = #{ATTEMPT}" ;
					
				}
				
			} else if(flag.equals("1")) {
				String col = " (WEEKDAY, DATA_TYPE"
						+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
						+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
						+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI"
						+ ", ATTEMPT) ";
				String insertVal = " ('0', #{kpi}"
						+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
						+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
						+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}"
						+ ", #{ATTEMPT}) "
						+ ", ('1', #{kpi}"
						+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}" 
						+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
						+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}"
						+ ", #{ATTEMPT}) ";
				
				String update = " ATT_RATE_MIN = #{ATT_RATE_MIN}, ATT_RATE_MAJ = #{ATT_RATE_MAJ}, ATT_RATE_CRI = #{ATT_RATE_CRI}"
						+ ", ATT_RATE_MIN_DECR = #{ATT_RATE_MIN_DECR}, ATT_RATE_MAJ_DECR = #{ATT_RATE_MAJ_DECR}, ATT_RATE_CRI_DECR = #{ATT_RATE_CRI_DECR}"
						+ ", SUCC_RATE_MIN = #{SUCC_RATE_MIN}, SUCC_RATE_MAJ = #{SUCC_RATE_MAJ}, SUCC_RATE_CRI = #{SUCC_RATE_CRI}"
						+ ", ATTEMPT = #{ATTEMPT}";
				
				switch (Integer.parseInt(equip)) {
					case 1:
						col = " (WEEKDAY, DATA_TYPE"
								+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
								+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
								+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI"
								+ ", ANS_RATE_MIN, ANS_RATE_MAJ, ANS_RATE_CRI, ATTEMPT) ";
						
						insertVal = "('0', #{kpi}"
								+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
								+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
								+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}"
								+ ", #{ANS_RATE_MIN}, #{ANS_RATE_MAJ}, #{ANS_RATE_CRI}, #{ATTEMPT}) "
								+ ",('1', #{kpi}"
								+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
								+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
								+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}"
								+ ", #{ANS_RATE_MIN}, #{ANS_RATE_MAJ}, #{ANS_RATE_CRI}, #{ATTEMPT}) ";
						
						update = " ATT_RATE_MIN = #{ATT_RATE_MIN}, ATT_RATE_MAJ = #{ATT_RATE_MAJ}, ATT_RATE_CRI = #{ATT_RATE_CRI}"
								+ ", ATT_RATE_MIN_DECR = #{ATT_RATE_MIN_DECR}, ATT_RATE_MAJ_DECR = #{ATT_RATE_MAJ_DECR}, ATT_RATE_CRI_DECR = #{ATT_RATE_CRI_DECR}"
								+ ", SUCC_RATE_MIN = #{SUCC_RATE_MIN}, SUCC_RATE_MAJ = #{SUCC_RATE_MAJ}, SUCC_RATE_CRI = #{SUCC_RATE_CRI}"
								+ ", ANS_RATE_MIN = #{ANS_RATE_MIN}, ANS_RATE_MAJ = #{ANS_RATE_MAJ}, ANS_RATE_CRI = #{ANS_RATE_CRI}, ATTEMPT = #{ATTEMPT}";
						
						tableNm = "TB_PM_THD_MME";
						break;
					case 2:
						tableNm = "TB_PM_THD_PGW";
						break;
					case 3:
						tableNm = "TB_PM_THD_SGW";
						break;
					case 4:
						tableNm = "TB_PM_THD_HSS";
						break;
					case 5:
						tableNm = "TB_PM_THD_PCRF";
						break;
				}
				
				sql = "INSERT INTO "+ tableNm + col + " VALUES " + insertVal + " ON DUPLICATE KEY UPDATE " + update;
				
			} else if(flag.equals("3")) {
				String col = " (WEEKDAY, DATA_TYPE"
						+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
						+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
						+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI, ATTEMPT)";
				String insertVal = "('0', #{storageType}"
						+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
						+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
						+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}, #{ATTEMPT})"
						+ ",('1', #{storageType}"
						+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
						+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
						+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}, #{ATTEMPT})";
				String update = " ATT_RATE_MIN = #{ATT_RATE_MIN}, ATT_RATE_MAJ = #{ATT_RATE_MAJ}, ATT_RATE_CRI = #{ATT_RATE_CRI}"
						+ ", ATT_RATE_MIN_DECR = #{ATT_RATE_MIN_DECR}, ATT_RATE_MAJ_DECR = #{ATT_RATE_MAJ_DECR}, ATT_RATE_CRI_DECR = #{ATT_RATE_CRI_DECR}"
						+ ", SUCC_RATE_MIN = #{SUCC_RATE_MIN}, SUCC_RATE_MAJ = #{SUCC_RATE_MAJ}, SUCC_RATE_CRI = #{SUCC_RATE_CRI}, ATTEMPT = #{ATTEMPT}";
				tableNm = " TB_PM_THD_REC ";
				
				sql = "INSERT INTO "+ tableNm + col + " VALUES " + insertVal + " ON DUPLICATE KEY UPDATE " + update;
				
			} else {
				String col = " (WEEKDAY, DATA_TYPE"
						+ ", ATT_RATE_MIN, ATT_RATE_MAJ, ATT_RATE_CRI"
						+ ", ATT_RATE_MIN_DECR, ATT_RATE_MAJ_DECR, ATT_RATE_CRI_DECR"
						+ ", SUCC_RATE_MIN, SUCC_RATE_MAJ, SUCC_RATE_CRI, ATTEMPT)";
				String insertVal = "('0', #{mobileType}"
						+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
						+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
						+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}, #{ATTEMPT})"
						+ ",('1', #{mobileType}"
						+ ", #{ATT_RATE_MIN}, #{ATT_RATE_MAJ}, #{ATT_RATE_CRI}"
						+ ", #{ATT_RATE_MIN_DECR}, #{ATT_RATE_MAJ_DECR}, #{ATT_RATE_CRI_DECR}"
						+ ", #{SUCC_RATE_MIN}, #{SUCC_RATE_MAJ}, #{SUCC_RATE_CRI}, #{ATTEMPT})";
				String update = " ATT_RATE_MIN = #{ATT_RATE_MIN}, ATT_RATE_MAJ = #{ATT_RATE_MAJ}, ATT_RATE_CRI = #{ATT_RATE_CRI}"
						+ ", ATT_RATE_MIN_DECR = #{ATT_RATE_MIN_DECR}, ATT_RATE_MAJ_DECR = #{ATT_RATE_MAJ_DECR}, ATT_RATE_CRI_DECR = #{ATT_RATE_CRI_DECR}"
						+ ", SUCC_RATE_MIN = #{SUCC_RATE_MIN}, SUCC_RATE_MAJ = #{SUCC_RATE_MAJ}, SUCC_RATE_CRI = #{SUCC_RATE_CRI}, ATTEMPT = #{ATTEMPT}";
				tableNm = " TB_PM_THD_PHONE ";
				
				sql = "INSERT INTO "+ tableNm + col + " VALUES " + insertVal + " ON DUPLICATE KEY UPDATE " + update;
				
			}
		}
		
		return sql;
	}
}
