package com.ltem.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.CommonFunctionDAO;
import com.ltem.dao.NetworkTopologyDAO;
import com.ltem.service.NetworkTopologyService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("NetworkTopologyService")
public class NetworkTopologyServiceImpl extends EgovAbstractServiceImpl implements NetworkTopologyService {

	@Autowired
	NetworkTopologyDAO networkTopologyDAO;

	@Autowired
	CommonFunctionDAO commonFunctionDAO;

	private static final Logger log = LoggerFactory.getLogger(NetworkTopologyServiceImpl.class);

	@Override
	public Map<String, Object> getMonitorTime() {

		Map<String, Object> resultMap = networkTopologyDAO.getMonitorTime();

		// 현재 시스템 시간 조회 - 레이어 팝업 검색날짜에 default 셋팅을 위해
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm");
		String etime = "";
		String stime = "";

		Date endTime = new Date();
		Date startTime = new Date();

		try {
			etime = (String) resultMap.get("MONITOR_TIME");
			endTime = sdf.parse(etime);

			long startDate = endTime.getTime() - ((long) 1000 * 60 * 60 * 3);

			startTime.setTime(startDate);
			stime = sdf.format(startDate);

		} catch (Exception e) {
			log.error(e.getMessage());
		}

		resultMap.put("startDate", stime.substring(0, 10));
		resultMap.put("startHour", stime.substring(11, 13));
		resultMap.put("startMin", stime.substring(14, 16));

		resultMap.put("endDate", etime.substring(0, 10));
		resultMap.put("endHour", etime.substring(11, 13));
		resultMap.put("endMin", etime.substring(14, 16));

		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getEquipList(Map<String, Object> paramMap) {
		// 각 장비들 데이터 최종 수집 데이터 조회
		String mmeEventTime = commonFunctionDAO.getEventTime("TB_PM_MME_ATTACH", "TB_PM_MME_SR", "TB_PM_MME_SRMT");
		String hssEventTime = commonFunctionDAO.getEventTime("TB_PM_HSS_CX", "TB_PM_HSS_S6A");
		String pcrfEventTime = commonFunctionDAO.getEventTime("TB_PM_PCRF_GX", "TB_PM_PCRF_RX");
		String sgwPgwEventTime = commonFunctionDAO.getEventTime("TB_PM_PGW_CREATE", "TB_PM_PGW_DELETE",
				"TB_PM_PGW_MODIFY", "TB_PM_SGW_ATTACH", "TB_PM_SGW_MODIFY", "TB_PM_SGW_DELETE");
		String recEventTime = commonFunctionDAO.getEventTime("TB_PM_REC", "TB_PM_REC_CALLPTT");

		paramMap.put("mmeEventTime", mmeEventTime);
		paramMap.put("hssEventTime", hssEventTime);
		paramMap.put("pcrfEventTime", pcrfEventTime);
		paramMap.put("sgwPgwEventTime", sgwPgwEventTime);
		paramMap.put("recEventTime", recEventTime);

		// MME
		Map<String, Object> mmeAttachData = networkTopologyDAO.getMmeAttach(paramMap);
		Map<String, Object> mmeSrData = networkTopologyDAO.getMmeSr(paramMap);
		Map<String, Object> mmeSrmtData = networkTopologyDAO.getMmeSrmt(paramMap);
		// HSS
		paramMap.put("statisticsType", "S6A Interface");
		Map<String, Object> hssS6aInterfaceData = networkTopologyDAO.getHssData(paramMap);
		paramMap.put("statisticsType", "Cx Interface");
		Map<String, Object> hssCxInterfaceData = networkTopologyDAO.getHssData(paramMap);
//		paramMap.put("groupId", "300");
//		Map<String, Object> hssS13InterfaceData = networkTopologyDAO.getHssData(paramMap);
//		paramMap.put("groupId", "500");
//		Map<String, Object> hssSpInterfaceData = networkTopologyDAO.getHssData(paramMap);
		// PCRF
		paramMap.put("kpiType", "Gx");
		Map<String, Object> pcrfGxData = networkTopologyDAO.getPcrfData(paramMap);
		paramMap.put("kpiType", "Rx");
		Map<String, Object> pcrfRxData = networkTopologyDAO.getPcrfData(paramMap);
		// SGW/PGW
		Map<String, Object> sgwAttachData = networkTopologyDAO.getSgwAttach(paramMap);
		Map<String, Object> sgwModifyData = networkTopologyDAO.getSgwModify(paramMap);
		Map<String, Object> sgwDeleteData = networkTopologyDAO.getSgwDelete(paramMap);
		Map<String, Object> pgwCreateData = networkTopologyDAO.getPgwCreate(paramMap);
		Map<String, Object> pgwDeleteData = networkTopologyDAO.getPgwDelete(paramMap);
		Map<String, Object> pgwModifyData = networkTopologyDAO.getPgwModify(paramMap);
		// REC
		Map<String, Object> recData = networkTopologyDAO.getRecData(paramMap);

		List<Map<String, Object>> resultList = networkTopologyDAO.getEquipList();
		for (Map<String, Object> equip : resultList) {
			if ("1".equals(String.valueOf(equip.get("EQUIP_TYPE")))) {
				// MME
				equip.put("DATA_ATTACH", mmeAttachData);
				equip.put("DATA_SR", mmeSrData);
				equip.put("DATA_SRMT", mmeSrmtData);
				equip.put("EVENT_TIME", mmeEventTime);
			} else if ("6".equals(String.valueOf(equip.get("EQUIP_TYPE")))) {
				// PCRF
				equip.put("DATA_GX", pcrfGxData);
				equip.put("DATA_RX", pcrfRxData);
				// HSS
				equip.put("DATA_S6A_INTERFACE", hssS6aInterfaceData);
				equip.put("DATA_CX_INTERFACE", hssCxInterfaceData);
				equip.put("EVENT_TIME", hssEventTime);
			} else if ("7".equals(String.valueOf(equip.get("EQUIP_TYPE")))) {
				
				equip.put("EVENT_TIME", pcrfEventTime);
			} else if ("4".equals(String.valueOf(equip.get("EQUIP_TYPE")))) {
				// PGW/SGW
				equip.put("DATA_SGW_ATTACH", sgwAttachData);
				equip.put("DATA_SGW_MODIFY", sgwModifyData);
				equip.put("DATA_SGW_DELETE", sgwDeleteData);
				equip.put("DATA_PGW_CREATE", pgwCreateData);
				equip.put("DATA_PGW_DELETE", pgwDeleteData);
				equip.put("DATA_PGW_MODIFY", pgwModifyData);
				equip.put("EVENT_TIME", sgwPgwEventTime);
			} else if ("10".equals(String.valueOf(equip.get("EQUIP_TYPE")))) {
				// REC
				equip.put("DATA_REC", recData);
				equip.put("EVENT_TIME", recEventTime);
			}
		}
		return resultList;
	}

	@Override
	public List<Map<String, Object>> getDuList(Map<String, Object> paramMap) {
		// 각 장비들 데이터 최종 수집 데이터 조회
		String eventTime = commonFunctionDAO.getEventTime("TB_PM_ACCESS_KPI");
		paramMap.put("eventTime", eventTime);

		List<Map<String, Object>> resultList = networkTopologyDAO.getDuList(paramMap);
		
		return resultList;
	}

	@Override
	public List<Map<String, Object>> getRuList(Map<String, Object> paramMap) {
		// 각 장비들 데이터 최종 수집 데이터 조회
		String eventTime = commonFunctionDAO.getEventTime("TB_PM_ACCESS_KPI");
		paramMap.put("eventTime", eventTime);

		List<Map<String, Object>> resultList = networkTopologyDAO.getRuList(paramMap);

//		return resultList;

		List<Map<String, Object>> resultSortList = new ArrayList<Map<String, Object>>();

		List<Map<String, Object>> criticalList = new ArrayList<>();
		List<Map<String, Object>> majorList = new ArrayList<>();
		List<Map<String, Object>> minorList = new ArrayList<>();
		List<Map<String, Object>> normalList = new ArrayList<>();

		for (Map<String, Object> ruData : resultList) {
			List<Integer> emptyCompare = new ArrayList<>();
			int ATT_RATE_LEVEL = NumberUtils.toInt(String.valueOf(ruData.get("ATT_RATE_LEVEL")));
			int RRC_RATE_LEVEL = NumberUtils.toInt(String.valueOf(ruData.get("RRC_RATE_LEVEL")));
			int ANS_RATE_LEVEL = NumberUtils.toInt(String.valueOf(ruData.get("ANS_RATE_LEVEL")));
			int CD_RATE_LEVEL = NumberUtils.toInt(String.valueOf(ruData.get("CD_RATE_LEVEL")));

			emptyCompare.add(ATT_RATE_LEVEL);
			emptyCompare.add(RRC_RATE_LEVEL);
			emptyCompare.add(ANS_RATE_LEVEL);
			emptyCompare.add(CD_RATE_LEVEL);
			int minLevel = Collections.min(emptyCompare);

			ruData.put("MIN_PER_LEVEL", minLevel);
			if (1 == minLevel) {
				criticalList.add(ruData);
			} else if (2 == minLevel) {
				majorList.add(ruData);
			} else if (3 == minLevel) {
				minorList.add(ruData);
			} else {
				normalList.add(ruData);
			}
		}

		if (criticalList.size() > 0)
			resultSortList.addAll(criticalList);
		if (majorList.size() > 0)
			resultSortList.addAll(majorList);
		if (minorList.size() > 0)
			resultSortList.addAll(minorList);
		if (normalList.size() > 0)
			resultSortList.addAll(normalList);

		return resultSortList;

	}

	@Override
	public Map<String, Object> getQualityTrend(Map<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<>();

		if (paramMap != null) {
			String equipType = paramMap.get("equipType").toString();
			String systemName = paramMap.get("systemName").toString();
			String searchType = paramMap.get("searchType").toString();

			if (StringUtils.isNotEmpty(equipType) && StringUtils.isNotEmpty(searchType)) {

				// 1분 단위 : 61개
				// 5분 단위 : 13개
				List<Map<String, Object>> trendList = networkTopologyDAO.getQualityTrend(paramMap);

				List<String> category = new ArrayList<>();
				List<Integer> attempts = new ArrayList<>();
				List<Float> rates_1 = new ArrayList<>();
				List<Float> rates_2 = new ArrayList<>();
				List<Float> rates_3 = new ArrayList<>();
				
				// ru, du ---------------------------------
				List<Integer> stdAtt5m = new ArrayList<>();
				List<Integer> erabAttempt = new ArrayList<>();
				List<Integer> stdErab5m = new ArrayList<>();
				List<Float> attRate = new ArrayList<>();
				List<Float> erabAttRate = new ArrayList<>();
				List<Float> rrcRate = new ArrayList<>();
				List<Float> answerRate = new ArrayList<>();
				List<Float> cdRate = new ArrayList<>();
				// -----------------------------------------

				String startTime = (String) paramMap.get("startTime");
				String endTime = (String) paramMap.get("eventTime");

				// chart x축 데이터
				ArrayList<String> timeList = new ArrayList<String>();
				// 비교를 위한 시간 list
				SimpleDateFormat compSdf = new SimpleDateFormat("yyyyMMddHHmm");
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
				Calendar cal = Calendar.getInstance();
				try {
					cal.setTime(compSdf.parse(startTime));
				} catch (ParseException e) {
					log.error(e.getMessage());
				}

				String stdDate = startTime;
				while (stdDate.compareTo(endTime) <= 0) {
					timeList.add(sdf.format(cal.getTime()));
					cal.add(Calendar.MINUTE, 5);
					stdDate = compSdf.format(cal.getTime());
				}

				boolean isfirst = true;
				for (String time : timeList) {
					if (("1".equals(equipType) && "rrc".equals(searchType))) {
						isfirst = true;
						for (Map<String, Object> map : trendList) {
							if (time.equals((String) map.get("EVENT_TIME"))) {
								isfirst = false;
								category.add((String) map.get("EVENT_TIME"));
								attempts.add(Integer.parseInt(map.get("ATTEMPT").toString()));
								rates_1.add(Float.parseFloat(map.get("RATE_1").toString()));
								rates_2.add(Float.parseFloat(map.get("RATE_2").toString()));
								rates_3.add(Float.parseFloat(map.get("RATE_3").toString()));	// 시도호증감율
								break;
							}
						}
						if (isfirst) {
							category.add(time);
							attempts.add(0);
							rates_1.add(0.0f);
							rates_2.add(0.0f);
							rates_3.add(0.0f);
						}
					} else if("1".equals(equipType)) {	// MME
						isfirst = true;
						for (Map<String, Object> map : trendList) {
							if (time.equals((String) map.get("EVENT_TIME"))) {
								isfirst = false;
								category.add((String) map.get("EVENT_TIME"));
								attempts.add(Integer.parseInt(map.get("ATTEMPT").toString()));
								rates_1.add(Float.parseFloat(map.get("RATE_1").toString()));
								//rates_2.add(Float.parseFloat(map.get("RATE_2").toString()));
								rates_3.add(Float.parseFloat(map.get("RATE_3").toString()));	// 시도호증감율
								break;
							}
						}
						if (isfirst) {
							category.add(time);
							attempts.add(0);
							rates_1.add(0.0f);
							//rates_2.add(0.0f);
							rates_3.add(0.0f);
						}
					} else if ("2".equals(equipType) || "3".equals(equipType)) {
						isfirst = true;
						for (Map<String, Object> map : trendList) {
							if (time.equals((String) map.get("EVENT_TIME"))) {
								isfirst = false;
								category.add((String) map.get("EVENT_TIME"));

								attempts.add(Integer.parseInt(map.get("ATTEMPT").toString()));
								stdAtt5m.add(Integer.parseInt(map.get("STD_ATT_5M").toString()));
								erabAttempt.add(Integer.parseInt(map.get("ERAB_ATTEMPT").toString()));
								stdErab5m.add(Integer.parseInt(map.get("STD_ERAB_5M").toString()));

								attRate.add(Float.parseFloat(map.get("ATT_RATE").toString()));
								erabAttRate.add(Float.parseFloat(map.get("ERAB_ATT_RATE").toString()));
								rrcRate.add(Float.parseFloat(map.get("RRC_RATE").toString()));
								answerRate.add(Float.parseFloat(map.get("ANSWER_RATE").toString()));
								cdRate.add(Float.parseFloat(map.get("CD_RATE").toString()));

								break;
							}
						}
						if (isfirst) {
							category.add(time);
							attempts.add(0);
							stdAtt5m.add(0);
							erabAttempt.add(0);
							stdErab5m.add(0);
							
							attRate.add(0.0f);
							erabAttRate.add(0.0f);
							rrcRate.add(0.0f);
							answerRate.add(0.0f);
							cdRate.add(0.0f);
						}
					} else {
						isfirst = true;
						for (Map<String, Object> map : trendList) {
							if (time.equals((String) map.get("EVENT_TIME"))) {
								isfirst = false;
								category.add((String) map.get("EVENT_TIME"));
								attempts.add(Integer.parseInt(map.get("ATTEMPT").toString()));
								rates_1.add(Float.parseFloat(map.get("RATE_1").toString()));
								rates_3.add(Float.parseFloat(map.get("RATE_3").toString()));	// 시도호증감율
								break;
							}
						}
						if (isfirst) {
							category.add(time);
							attempts.add(0);
							rates_1.add(0.0f);
							rates_3.add(0.0f);
						}
					}
				}

				if ("2".equals(equipType) || "3".equals(equipType)) {

					resultMap.put("SYSTEM_NAME", systemName);
					resultMap.put("CATEGORIES", category);
					resultMap.put("ATTEMPTS", attempts);
					resultMap.put("STD_ATT_5M", stdAtt5m);
					resultMap.put("ERAB_ATTEMPT", erabAttempt);
					resultMap.put("STD_ERAB_5M", stdErab5m);
					resultMap.put("ATT_RATE", attRate);
					resultMap.put("ERAB_ATT_RATE", erabAttRate);
					resultMap.put("RRC_RATE", rrcRate);
					resultMap.put("ANSWER_RATE", answerRate);
					resultMap.put("CD_RATE", cdRate);

				} else {
					resultMap.put("TITLE_1", "성공율");
					resultMap.put("TITLE_2", ("1".equals(equipType) ? "접속율" : "완료율"));	// MME일때 접속율
					resultMap.put("TITLE_3", "시도호증감율");

					resultMap.put("SYSTEM_NAME", systemName);
					resultMap.put("CATEGORIES", category);
					resultMap.put("ATTEMPTS", attempts);
					resultMap.put("RATES_1", rates_1);
					resultMap.put("RATES_2", rates_2);
					resultMap.put("RATES_3", rates_3);	// 시도호증감율
				}
			}
		}

		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getDetailPerformance(Map<String, Object> paramMap) {

		List<Map<String, Object>> resultList = networkTopologyDAO.getDetailPerformance(paramMap);

		return resultList;
	}

	@Override
	public Map<String, Object> getDetailFailure(Map<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<>();
		List<Map<String, Object>> failureList = new ArrayList<>();

		String systemName = new String();
		if ("36".equals(paramMap.get("equipType").toString())) { 
			// 정류기일 경우
			String jrgLineId = paramMap.get("jrgLineId").toString();
			systemName = paramMap.get("systemName").toString() + " "
					+ ("0".equals(jrgLineId) ? "관제" : (jrgLineId + "호선"));
		} else {
			systemName = paramMap.get("systemName").toString();
		}

		failureList = networkTopologyDAO.getDetailFailure(paramMap);
		resultMap.put("FAILURE_DATA", failureList);
		resultMap.put("TITLE", systemName);
		resultMap.put("EQUIP_TYPE", paramMap.get("equipType"));

		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getSystemList(Map<String, Object> paramMap) {
		List<Map<String, Object>> systemList = new ArrayList<>();
		systemList = networkTopologyDAO.getSystemList(paramMap);

		return systemList;
	}

	@Override
	public List<Map<String, Object>> getSwitchCategory() {
		List<Map<String, Object>> switchCategory = new ArrayList<>();
		switchCategory = networkTopologyDAO.getSwitchCategory();

		return switchCategory;
	}

	@Override
	public Map<String, Object> getSwitchPortState(Map<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<String, Object>();

		List<Map<String, Object>> portStateList = new ArrayList<>();
		List<Map<String, Object>> portUseList = new ArrayList<>();
		List<Map<String, Object>> useList = new ArrayList<>();

		try {
			portStateList = networkTopologyDAO.getSwitchPortState(paramMap);
			portUseList = networkTopologyDAO.getSwitchUsePort(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}

		try {
			for (Map<String, Object> m : portUseList) {
				Map<String, Object> tempMap = new HashMap<String, Object>();

				int arrSize = Integer.parseInt(m.get("SIZE").toString());
				String[] usePort = new String[arrSize];
				String[] useDesc = new String[arrSize];
				String[] useName = new String[arrSize];

				for (int i = 0; i < arrSize; i += 1) {
					String num = i + 1 < 10 ? "0" + (i + 1) : "" + (i + 1);
					String desc = StringUtils.defaultIfBlank(Objects.toString(m.get("PORT_" + num + "_DESC"), ""),
							"연결없음");

					usePort[i] = Objects.toString(m.get("PORT_" + num), "");
					useDesc[i] = desc;
					useName[i] = Objects.toString(m.get("PORT_" + num + "_NAME"), "");
				}

				tempMap.put("SIZE", m.get("SIZE"));
				tempMap.put("SWITCH_NAME", m.get("SWITCH_NAME"));
				tempMap.put("SWITCH_ID", m.get("SWITCH_ID"));
				tempMap.put("SLOT", m.get("SLOT"));
				tempMap.put("SORT_FLAG", m.get("SORT_FLAG"));
				tempMap.put("SHELF", m.get("SHELF"));
				tempMap.put("SERVER_STAT", m.get("SERVER_STAT"));

				tempMap.put("portUse", usePort);
				tempMap.put("portDesc", useDesc);
				tempMap.put("portName", useName);

				useList.add(tempMap);
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}

		resultMap.put("state", portStateList);
		resultMap.put("use", useList);

		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getServerStatData(Map<String, Object> paramMap) {
		List<Map<String, Object>> resultMap = new ArrayList<>();
		resultMap = networkTopologyDAO.getServerStatData(paramMap);
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getRecoverInfo(Map<String, Object> paramMap) {
		List<Map<String, Object>> resultMap = new ArrayList<>();
		resultMap = networkTopologyDAO.getRecoverInfo(paramMap);
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getRecoverEquipDefault() {
		List<Map<String, Object>> resultMap = new ArrayList<>();
		resultMap = networkTopologyDAO.getRecoverEquipDefault();
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getRecoverEquipDuRu() {
		List<Map<String, Object>> resultMap = new ArrayList<>();
		resultMap = networkTopologyDAO.getRecoverEquipDuRu();
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getRecoverEquipSwitch() {
		List<Map<String, Object>> resultMap = new ArrayList<>();
		resultMap = networkTopologyDAO.getRecoverEquipSwitch();
		return resultMap;
	}

	/**
	 * 정류기 관제, 5호선, 7호선 최근해제된 고장알람 select
	 */
	@Override
	public List<Map<String, Object>> getRecoverEquipJrg() {
		List<Map<String, Object>> resultMap = new ArrayList<>();
		resultMap = networkTopologyDAO.getRecoverEquipJrg();
		return resultMap;
	}

	@Override
	public Map<String, Object> getDetailRecover(Map<String, Object> paramMap) {

		Map<String, Object> resultMap = new HashMap<>();
		List<Map<String, Object>> recoverList = new ArrayList<>();

//		String systemName = "4".equals(paramMap.get("equipType").toString()) ? "GW" : paramMap.get("systemName").toString();
		recoverList = networkTopologyDAO.getDetailRecover(paramMap);
		resultMap.put("RECOVER_DATA", recoverList);
//		resultMap.put("TITLE", systemName);
		resultMap.put("EQUIP_TYPE", paramMap.get("equipType"));

		return resultMap;
	}

	@Override
	public int updateDetailRecover(Map<String, Object> paramMap) {
		int result = networkTopologyDAO.updateDetailRecover(paramMap);
		return result;
	}
}
