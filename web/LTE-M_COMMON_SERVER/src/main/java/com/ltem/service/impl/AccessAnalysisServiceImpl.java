package com.ltem.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.AccessAnalysisDAO;
import com.ltem.service.AccessAnalysisService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("AccessAnalysisService")
public class AccessAnalysisServiceImpl extends EgovAbstractServiceImpl implements AccessAnalysisService {

	@Autowired
	AccessAnalysisDAO accessAnalysisDAO;

	private static final Logger log = LoggerFactory.getLogger(AccessAnalysisServiceImpl.class);

	@Override
	public Map<String, Object> getAccessTrendData(HashMap<String, Object> paramMap) {

		Map<String, Object> returnMap = new HashMap<String, Object>();
		List<Map<String, Object>> returnList = new ArrayList<Map<String, Object>>();

		String equipList = (String) paramMap.get("equipList");
		if (!"".equals(equipList)) {
			paramMap.put("equipList", equipList.split(","));
		}

		// kpiflag => 1 : KPI | 2 : Data Throughput | 3: Hand Over
		String kpiflag = (String) paramMap.get("kpival");
		if ("1".equals(kpiflag)) {
			returnMap.put("gridData", accessAnalysisDAO.getAccessGridData(paramMap));
		} else if ("2".equals(kpiflag)) {
			returnMap.put("gridData", accessAnalysisDAO.getAccessDTPGridData(paramMap));
		} else {
			returnMap.put("gridData", accessAnalysisDAO.getAccessHANDGridData(paramMap));
		}

		String startTime = (String) paramMap.get("startDateTime");
		String endTime = (String) paramMap.get("endDateTime");
		ArrayList<String> timeList = new ArrayList<String>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(sdf.parse(startTime));
		} catch (ParseException e) {

		}

		String stdDate = startTime;
		while (stdDate.compareTo(endTime) <= 0) {
			timeList.add(sdf.format(cal.getTime()));
			cal.add(Calendar.MINUTE, 60);
			stdDate = sdf.format(cal.getTime());
		}

		List<Map<String, Object>> tempdataList = (List<Map<String, Object>>) returnMap.get("gridData");
		List<Map<String, Object>> tempList = new ArrayList<Map<String, Object>>();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		ArrayList<String> colList = new ArrayList<String>();

		if (tempdataList.size() != 0) {
			Set key = tempdataList.get(0).keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();

				if (!keyname.equals("EVENT_TIME") && !keyname.equals("COMP_TIME") && !keyname.equals("UP_TIME")
						&& !keyname.equals("DW_TIME") && !keyname.equals("RRC") && !keyname.equals("ANSWER")
						&& !keyname.equals("CD") && !keyname.equals("ERAB_ADD_SUCCESS") && !keyname.equals("SUCCESS")) {
					dataMap.put("Column", keyname);
					dataMap.put("name", getName(keyname, kpiflag).split(",")[0]);
					dataMap.put("type", getName(keyname, kpiflag).split(",")[1]);
					dataMap.put("suffix", getName(keyname, kpiflag).split(",")[2]);
					dataMap.put("yAxis", getName(keyname, kpiflag).split(",")[3]);
					dataMap.put("zIndex", getName(keyname, kpiflag).split(",")[4]);
					if (getName(keyname, kpiflag).split(",").length > 5) {
						dataMap.put("stack", getName(keyname, kpiflag).split(",")[5]);
					}
					colList.add(keyname);
					tempList.add(dataMap);
					dataMap = new HashMap<String, Object>();

				}
			}
		}

		boolean isfirst = true;
		for (Map tempMap : tempList) {
			ArrayList dataArray = new ArrayList();
			for (String time : timeList) {
				isfirst = true;
				for (Map map : tempdataList) {
					if (time.equals((String) map.get("COMP_TIME"))) {
						dataArray.add(map.get(tempMap.get("Column")));
						isfirst = false;
						break;
					}
				}
				if (isfirst) {
					dataArray.add(0);
				}
			}
			tempMap.put("data", dataArray);
			returnList.add(tempMap);
		}

		returnMap.put("trendData", returnList);
		returnMap.put("timeList", timeList);

		return returnMap;
	}

	public String getName(String col, final String kpiflag) {

		String returnStr = "";

		if ("ATTEMPT".equals(col)) {
			if ("1".equals(kpiflag)) {
				returnStr = "RRC 시도호,column,호(건),1,70,ATT";
			} else {
				returnStr = "시도호,column,호(건),1,70,ATT";
			}
		} else if ("STD_ATT".equals(col)) {
			if ("1".equals(kpiflag)) {
				returnStr = "RRC 기준 시도호,column,호(건),1,71,STD_ATT";
			} else {
				returnStr = "기준 시도호,column,호(건),1,71,STD_ATT";
			}
		} else if ("ERAB_ATTEMPT".equals(col)) {
			returnStr = "ERAB Setup 시도호,column,호(건),1,72,ERAB";
		} else if ("STD_ERAB".equals(col)) {
			returnStr = "ERAB Setup 기준 시도호,column,호(건),1,73,STD_ERAB";
		} else if ("ATT_RATE".equals(col)) {
			if ("1".equals(kpiflag)) {
				returnStr = "RRC 시도호 증감율,spline,%,0,80";
			} else {
				returnStr = "시도호 증감율,spline,%,0,80";
			}
		} else if ("ERAB_ATT_RATE".equals(col)) {
			returnStr = "ERAB Setup 증감율,spline,%,0,81";
		} else if ("RRC_RATE".equals(col)) {
			returnStr = "소통율(RRC 성공율),spline,%,0,82";
		} else if ("ANSWER_RATE".equals(col)) {
			returnStr = "완료율(ERAB Setup 성공율),spline,%,0,83";
		} else if ("CD_RATE".equals(col)) {
			returnStr = "절단율,spline,%,0,88";
		} else if ("UP_VOLUMN".equals(col) || "DW_VOLUMN".equals(col)) {
			returnStr = "Volume,column,KByte,1,74";
		} else if ("UP_VOLUMN_STD".equals(col) || "DW_VOLUMN_STD".equals(col)) {
			returnStr = "기준 Volume,column,KByte,1,75";
		} else if ("UP_DTP".equals(col) || "DW_DTP".equals(col)) {
			returnStr = "Throughput,column,KBps,1,76";
		} else if ("UP_DTP_STD".equals(col) || "DW_DTP_STD".equals(col)) {
			returnStr = "기준 Throughput,column,KBps,1,77";
		} else if ("UP_VOLUMN_RATE".equals(col) || "DW_VOLUMN_RATE".equals(col)) {
			returnStr = "Volumn 증감율,spline,%,0,85";
		} else if ("UP_DTP_RATE".equals(col) || "DW_DTP_RATE".equals(col)) {
			returnStr = "Throughput 증감율,spline,%,0,86";
		} else if ("SUCC_RATE".equals(col)) {
			returnStr = "성공율,spline,%,0,87";
		}
		return returnStr;
	}

	@Override
	public List<Map<String, String>> getAccessExcelData(HashMap<String, Object> paramMap) {

		String equipList = (String) paramMap.get("equipList");
		if (!"".equals(equipList)) {
			paramMap.put("equipList", equipList.split(","));
		}

		// kpiflag => 1 : KPI | 2 : Data Throughput | 3: Hand Over
		String kpiflag = (String) paramMap.get("kpival");
		if ("1".equals(kpiflag)) {
			return accessAnalysisDAO.getAccessGridData(paramMap);
		} else if ("2".equals(kpiflag)) {
			return accessAnalysisDAO.getAccessDTPGridData(paramMap);
		} else {
			return accessAnalysisDAO.getAccessHANDGridData(paramMap);
		}
	}

	@Override
	public List<Map<String, Object>> getPopAccessAnalysisData(HashMap<String, Object> paramMap) {

		String equipList = (String) paramMap.get("equipList");
		if (!"".equals(equipList)) {
			paramMap.put("equipList", equipList.split(","));
		}

		List<Map<String, Object>> returnList = accessAnalysisDAO.getPopAccessAnalysisData(paramMap);

		return returnList;
	}
}
