package com.ltem.service.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.TrainOperationDAO;
import com.ltem.service.TrainOperationService;

@Service("TrainOperationService")
public class TrainOperationServiceImpl implements TrainOperationService {
	
	private static final Logger log = LoggerFactory.getLogger(TrainOperationServiceImpl.class);

	@Autowired
	TrainOperationDAO trainOperationDAO;

	@Override
	public Map<String,String> getPerformanceTimeInfo() {
		Map<String,String> monitorTimeInfo = trainOperationDAO.getPerformanceTimeInfo();
		return monitorTimeInfo;
	}

	@Override
	public Map<String,Object> getStationInfo() {
		List<Map<String,Object>> resultList = new ArrayList<>();
		Map<String,Object> resultMap = new HashMap<>();
		List<Map<String,Object>> stationInfoList = trainOperationDAO.getStationInfo();

		for(Map map : stationInfoList) {
			resultMap.put((String)map.get("STATION_ID"), map.get("STATION_NAME"));
		}
		return resultMap;
	}

	@Override
	public List<Map<String,Object>> getStationLocationInfo() {
		//역사 데이터
		List<Map<String,Object>> stationLocationInfo = trainOperationDAO.getStationLocationInfo();
		return stationLocationInfo;
	}

//	@Override
//	public Map<String,Object> getTrainInfo(HashMap<String, Object> paramMap) {
//		Map<String, Object> resultMap = new HashMap<String, Object>();
//		//열차 위치 데이터
//		List<Map<String,Object>> trainTrackingInfo = trainOperationDAO.getTrainTrackingInfo(paramMap);
//		//열차 품질 데이터
//		List<Map<String,Object>> trainQualityInfo = trainOperationDAO.getTrainQualityInfo(paramMap);
//
//		List<Map<String, Object>> tmpList = new ArrayList<>();
//		HashMap<String, Object> tmpMap = new HashMap<>();
//
//		Map m = new HashMap();
//		Map m2 = new HashMap();
//		String trainNo = "";
//		String phoneNo = "";
//		String callDir = "";
//		String trainNo2 = "";
//		String phoneNo2 = "";
//		String callDir2 = "";
//		int idx = 0;
//		for(int i = 0, len = trainQualityInfo.size(); i < len; i += 1) {
//			m = trainQualityInfo.get(i);
//			trainNo = m.get("TRAIN_NO").toString();
//			phoneNo = m.get("PHONE_NO").toString();
//			callDir = m.get("CALL_DIR") != null ? m.get("CALL_DIR").toString() : "";
//
//			if(i != 0) {
//				m2 = trainQualityInfo.get(i - 1);
//				trainNo2 = m2.get("TRAIN_NO").toString();
//				phoneNo2 = m2.get("PHONE_NO").toString();
//				callDir2 = m2.get("CALL_DIR") != null ? m2.get("CALL_DIR").toString() : "";
//
//				if(phoneNo.equals(phoneNo2)) {
//					//이전의 폰번호와 같다면 이경우는 CALL_DIR = 2인 상태이다
//					//같은 번호의 ROW가 2행이 있다는 의미는 CALL_DIR에 대한 값이 전부 있다는 소리 > 이전 폰번호의 CALL_DIR = 1이고 현재가 2
//					tmpList.add(m);
//				} else {
//					//단말번호가 다를 경우 이전의 단말번호의 CALL_DIR = 1일 때 해당 단말번호의 CALL_DIR = 2의 값이 없으므로 해당 값을 리스트에 추가해줘야한다
//					if("1".equals(callDir2)) {
//						tmpMap.put("PHONE_NO", phoneNo2);
//						tmpMap.put("PHONE_USE_NAME", m2.get("PHONE_USE_NAME"));
//						tmpMap.put("TRAIN_NO", trainNo2);
//						tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//						tmpMap.put("CALL_DIR", "2");
//						tmpMap.put("RESULT1", 0);
//						tmpMap.put("RESULT2", 0);
//						tmpMap.put("RESULT3", 0);
//						tmpMap.put("RESULT4", 100);
//						tmpMap.put("RESULT5", 4);
//						tmpMap.put("RESULT6", 4);
//
//						tmpList.add((Map<String, Object>)tmpMap.clone());
////						tmpMap = new HashMap<>();
//					}
//					//폰 번호가 다름 > 현재의 폰번호의 CALL_DIR을 판단
//					if("".equals(callDir)) {
//						//번호 하나당 2개의 데이터(CALL_DIR 1/2)가 필요하므로 CALL_DIR = 1의 값을 LIST에 추가
//						tmpMap.put("PHONE_NO", phoneNo);
//						tmpMap.put("PHONE_USE_NAME", m.get("PHONE_USE_NAME"));
//						tmpMap.put("TRAIN_NO", trainNo);
//						tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//						tmpMap.put("CALL_DIR", "1");
//						tmpMap.put("RESULT1", 0);
//						tmpMap.put("RESULT2", 0);
//						tmpMap.put("RESULT3", 0);
//						tmpMap.put("RESULT4", 100);
//						tmpMap.put("RESULT5", 4);
//						tmpMap.put("RESULT6", 4);
//
//						tmpList.add((Map<String, Object>)tmpMap.clone());
////						tmpMap = new HashMap<>();
//
//						//번호 하나당 2개의 데이터(CALL_DIR 1/2)가 필요하므로 CALL_DIR = 2의 값을 LIST에 추가
//						tmpMap.put("PHONE_NO", phoneNo);
//						tmpMap.put("PHONE_USE_NAME", m.get("PHONE_USE_NAME"));
//						tmpMap.put("TRAIN_NO", trainNo);
//						tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//						tmpMap.put("CALL_DIR", "2");
//						tmpMap.put("RESULT1", 0);
//						tmpMap.put("RESULT2", 0);
//						tmpMap.put("RESULT3", 0);
//						tmpMap.put("RESULT4", 100);
//						tmpMap.put("RESULT5", 4);
//						tmpMap.put("RESULT6", 4);
//
//						tmpList.add((Map<String, Object>)tmpMap.clone());
////						tmpMap = new HashMap<>();
//
//					} else if("1".equals(callDir)) {
//						//CALL_DIR = 1인 경우는 다음 루프일때 같은 번호의 CALL_DIR = 2가 있을 수도 있으므로 여기서 판단은 안함
//						//CALL_DIR = 1의 값만 tmpList에 추가
//						tmpList.add(m);
//
//					} else if("2".equals(callDir)) {
//						//CALL_DIR = 2인 경우는 CALL_DIR = 1인 값이 없다는 의미이므로 CALL_DIR = 1의 값을 LIST에 추가
//						tmpMap.put("PHONE_NO", phoneNo);
//						tmpMap.put("PHONE_USE_NAME", m.get("PHONE_USE_NAME"));
//						tmpMap.put("TRAIN_NO", trainNo);
//						tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//						tmpMap.put("CALL_DIR", "1");
//						tmpMap.put("RESULT1", 0);
//						tmpMap.put("RESULT2", 0);
//						tmpMap.put("RESULT3", 0);
//						tmpMap.put("RESULT4", 100);
//						tmpMap.put("RESULT5", 4);
//						tmpMap.put("RESULT6", 4);
//
//						tmpList.add((Map<String, Object>)tmpMap.clone());
////						tmpMap = new HashMap<>();
//
//						tmpList.add(m);
//					}
//				}
//
//			} else {
//				//쿼리 결과 첫번째 열차의 첫번째 단말 번호
//				//해당 열차의 단말번호의 성능 데이터가 아무것도 없는 경우
//				//해당 데이터의 CALL_DIR, RESULT1~6까지 변경
//				if("".equals(callDir)) {
//					//번호 하나당 2개의 데이터(CALL_DIR 1/2)가 필요하므로 CALL_DIR = 1의 값을 LIST에 추가
//					tmpMap.put("PHONE_NO", phoneNo);
//					tmpMap.put("PHONE_USE_NAME", m.get("PHONE_USE_NAME"));
//					tmpMap.put("TRAIN_NO", trainNo);
//					tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//					tmpMap.put("CALL_DIR", "1");
//					tmpMap.put("RESULT1", 0);
//					tmpMap.put("RESULT2", 0);
//					tmpMap.put("RESULT3", 0);
//					tmpMap.put("RESULT4", 100);
//					tmpMap.put("RESULT5", 4);
//					tmpMap.put("RESULT6", 4);
//
//					tmpList.add((Map<String, Object>)tmpMap.clone());
////					tmpMap = new HashMap<>();
//
//					//번호 하나당 2개의 데이터(CALL_DIR 1/2)가 필요하므로 CALL_DIR = 2의 값을 LIST에 추가
//					tmpMap.put("PHONE_NO", phoneNo);
//					tmpMap.put("PHONE_USE_NAME", m.get("PHONE_USE_NAME"));
//					tmpMap.put("TRAIN_NO", trainNo);
//					tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//					tmpMap.put("CALL_DIR", "2");
//					tmpMap.put("RESULT1", 0);
//					tmpMap.put("RESULT2", 0);
//					tmpMap.put("RESULT3", 0);
//					tmpMap.put("RESULT4", 100);
//					tmpMap.put("RESULT5", 4);
//					tmpMap.put("RESULT6", 4);
//
//					tmpList.add((Map<String, Object>)tmpMap.clone());
////					tmpMap = new HashMap<>();
//
//				} else if("1".equals(callDir)) {
//					//CALL_DIR = 1인 경우는 다음 루프일때 같은 번호의 CALL_DIR = 2가 있을 수도 있으므로 여기서 판단은 안함
//					//CALL_DIR = 1의 값만 tmpList에 추가
//					tmpList.add(m);
//
//				} else if("2".equals(callDir)) {
//					//CALL_DIR = 2인 경우는 CALL_DIR = 1인 값이 없다는 의미이므로 CALL_DIR = 1의 값을 LIST에 추가
//					tmpMap.put("PHONE_NO", phoneNo);
//					tmpMap.put("PHONE_USE_NAME", m.get("PHONE_USE_NAME"));
//					tmpMap.put("TRAIN_NO", trainNo);
//					tmpMap.put("MONITOR_TIME", paramMap.get("eventTime"));
//					tmpMap.put("CALL_DIR", "1");
//					tmpMap.put("RESULT1", 0);
//					tmpMap.put("RESULT2", 0);
//					tmpMap.put("RESULT3", 0);
//					tmpMap.put("RESULT4", 100);
//					tmpMap.put("RESULT5", 4);
//					tmpMap.put("RESULT6", 4);
//
//					tmpList.add((Map<String, Object>)tmpMap.clone());
////					tmpMap = new HashMap<>();
//
//					tmpList.add(m);
//				}
//			}
//		}
//
//		resultMap.put("trackingInfo", trainTrackingInfo);
//		resultMap.put("qualityInfo", tmpList);
//		return resultMap;
//	}

	@Override
	public Map<String,Object> getTrainInfo(HashMap<String, Object> paramMap) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> trainNoList = new ArrayList<String>();
		//열차 위치 데이터
		List<Map<String,Object>> trainTrackingInfo = trainOperationDAO.getTrainTrackingInfo(paramMap);
		//차상단말 품질데이터를 가져오기 위해
		//현재 운행하는 열차의 것만 가져오게 한다
		for(Map m : trainTrackingInfo) {
			trainNoList.add(m.get("TRAIN_NO").toString());
		}
		paramMap.put("trainNo", trainNoList);
		//열차 품질 데이터
		List<Map<String,Object>> trainQualityInfo = trainOperationDAO.getTrainQualityInfo(paramMap);

		resultMap.put("trainNoArr", trainNoList);
		resultMap.put("trackingInfo", trainTrackingInfo);
		resultMap.put("qualityInfo", trainQualityInfo);
		return resultMap;
	}

	@Override
	public Map<String, Object> getTrainQualityTrend(HashMap<String, Object> paramMap) {
		Map<String,Object> resultMap = new HashMap<>();
		HashMap<String, Object> tempMap = new HashMap<>();
		List<Map<String,Object>> trainPhoneList = new ArrayList<>();
		List<Map<String,Object>> trendList = new ArrayList<>();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date startTimeToDate;
		Date endTimeToDate;
		String startTime = paramMap.get("startEventTime") == null ? "" :(String) paramMap.get("startEventTime");
		String endTime = paramMap.get("endEventTime") == null ? "" :(String) paramMap.get("endEventTime");
		String trainNo = paramMap.get("trainNo") == null ? "" : paramMap.get("trainNo").toString();
		String phoneNo = "";

		long startTimeLong = 0L;
		long endTimeLong = 0L;

		try {
			endTimeToDate = sdf.parse(endTime);
			endTimeLong = endTimeToDate.getTime();
			if("".equals(startTime)) {
				startTime = sdf.format(endTimeToDate.getTime() - (1000 * 60 * 60 * 3));
			}
			startTimeToDate = sdf.parse(startTime);
			startTimeLong = startTimeToDate.getTime();

			if(startTimeLong > endTimeLong) {
				// Todo: 로직 추가 필요(검색 시작 시간이 끝 시간보다 클 수는 없다.)
				// Todo: 현재는 클라이언트에서 처리를 해놓은 상태
				//return false
			}

			paramMap.put("startEventTime", startTime);

		} catch (Exception e) {
			log.error(e.getMessage());
		}

		//chart x축 데이터
		ArrayList<String> timeList = new ArrayList<String>();
//		Calendar cal = Calendar.getInstance();
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(sdf.parse(startTime));
		} catch (ParseException e) {
			log.error(e.getMessage());
		}

		String stdDate = startTime;
		while(stdDate.compareTo(endTime) <= 0){
			timeList.add(sdf.format(cal.getTime()));
			cal.add(Calendar.MINUTE, 5);
			stdDate = sdf.format(cal.getTime());
		}

		resultMap.put("TRAIN_NO",			trainNo);
		resultMap.put("PHONE_NO",			phoneNo);
		resultMap.put("START_EVENT_TIME",	startTime);
		resultMap.put("END_EVENT_TIME",		endTime);

		int callDir = 1;
		if("".equals(trainNo)) {
			try {
				while (callDir <= 2) {
					paramMap.put("callDir", callDir);
					trendList = trainOperationDAO.getTrainQualityTrendAll(paramMap);
					trendData(callDir, resultMap, timeList, trendList);
//					trendData(callDir, tempMap, timeList, trendList);
//					if(callDir == 1) {
//						resultMap.put("SEND_ATTEMPTS", tempMap.get("ATTEMPTS"));
//						resultMap.put("SEND_SUCC_RATES", tempMap.get("SUCC_RATES"));
//					} else {
//						resultMap.put("RECV_ATTEMPTS", tempMap.get("ATTEMPTS"));
//						resultMap.put("RECV_SUCC_RATES", tempMap.get("SUCC_RATES"));
//					}
					callDir += 1;
				}
			} catch(Exception e) {
				log.error(e.getMessage());
			}
		} else {
			try {
				trainPhoneList = trainOperationDAO.getTrainPhoneInfo(paramMap);
			} catch(Exception e) {
				log.error(e.getMessage());
			}
			int idx = 0;
			while(idx < 2) {
				callDir = 1;
				phoneNo = trainPhoneList.get(idx).get("PHONE_NO").toString();
				paramMap.put("phoneNo", phoneNo);

				while(callDir <= 2) {
					paramMap.put("callDir", callDir);
					trendList = trainOperationDAO.getTrainQualityTrend(paramMap);
					trendData(callDir, tempMap, timeList, trendList);
					tempMap.put("PHONE_NO", phoneNo);
					callDir += 1;
				}
//				resultMap.put(trainPhoneList.get(idx).get("PHONE_NO").toString(), tempMap.clone());
				resultMap.put(trainPhoneList.get(idx).get("PHONE_NO").toString(), tempMap);
				tempMap = new HashMap<>();
				idx += 1;
			}
			resultMap.put("PHONE_NO", trainPhoneList);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getTrainQualityTrendTest(HashMap<String, Object> paramMap) {
		Map<String,Object> resultMap = new HashMap<>();
		HashMap<String, Object> tempMap = new HashMap<>();
		List<Map<String,Object>> trendList = new ArrayList<>();

		List<Map<String,Object>> trainPhoneList = new ArrayList<>();
		Map<String, Object> phoneEmptyMap = new HashMap<>();
		int phoneListSize = 0;


		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date startTimeToDate;
		Date endTimeToDate;
		String startTime = paramMap.get("startEventTime") == null ? "" :(String) paramMap.get("startEventTime");
		String endTime = paramMap.get("endEventTime") == null ? "" :(String) paramMap.get("endEventTime");
		String trainNo = paramMap.get("trainNo") == null ? "" : paramMap.get("trainNo").toString();
		String phoneNo = paramMap.get("phoneNo") == null ? "" : paramMap.get("phoneNo").toString();
		String phoneNo1 = "";
		String phoneNo2 = "";

		long startTimeLong = 0L;
		long endTimeLong = 0L;

		try {
			endTimeToDate = sdf.parse(endTime);
			endTimeLong = endTimeToDate.getTime();
			if("".equals(startTime)) {
				startTime = sdf.format(endTimeToDate.getTime() - (1000 * 60 * 60 * 3));
			}
			startTimeToDate = sdf.parse(startTime);
			startTimeLong = startTimeToDate.getTime();

			if(startTimeLong > endTimeLong) {
				// Todo: 로직 추가 필요(검색 시작 시간이 끝 시간보다 클 수는 없다.)
				// Todo: 현재는 클라이언트에서 처리를 해놓은 상태
				//return false
			}

			paramMap.put("startEventTime", startTime);

		} catch (Exception e) {
			log.error(e.getMessage());
		}

		//chart x축 데이터
		ArrayList<String> timeList = new ArrayList<String>();
//		Calendar cal = Calendar.getInstance();
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(sdf.parse(startTime));
		} catch (ParseException e) {
			log.error(e.getMessage());
		}

		String stdDate = startTime;
		while(stdDate.compareTo(endTime) <= 0){
			timeList.add(sdf.format(cal.getTime()));
			cal.add(Calendar.MINUTE, 5);
			stdDate = sdf.format(cal.getTime());
		}

		resultMap.put("TRAIN_NO",			trainNo);
		resultMap.put("PHONE_NO",			phoneNo);
		resultMap.put("START_EVENT_TIME",	startTime);
		resultMap.put("END_EVENT_TIME",		endTime);

		int callDir = 1;
		if("".equals(trainNo)) {
			List<Map<String,Object>> trainTrackingInfo = trainOperationDAO.getTrainTrackingInfo(paramMap);
			List<String> phoneLists = new ArrayList<String>();

			for(Map m : trainTrackingInfo) {
				phoneLists.add(m.get("PHONE_1").toString());
				phoneLists.add(m.get("PHONE_2").toString());
			}

			paramMap.put("phoneLists", phoneLists);

			while (callDir <= 2) {
				paramMap.put("callDir", callDir);
				try {
					trendList = trainOperationDAO.getTrainQualityTrendAll(paramMap);
				} catch(Exception e) {
					log.error(e.getMessage());
				}
				trendData(callDir, resultMap, timeList, trendList);
				callDir += 1;
			}
		} else {
			if("".equals(phoneNo)) {
				try {
					trainPhoneList = trainOperationDAO.getTrainPhoneInfo(paramMap);
				} catch(Exception e) {
					log.error(e.getMessage());
				}
				int idx = 0;
				phoneListSize = trainPhoneList.size();
				while (idx < 2) {
					callDir = 1;
					if(phoneListSize > 0) {
						phoneNo = trainPhoneList.get(idx).get("PHONE_NO").toString();
						paramMap.put("phoneNo", phoneNo);
					} else {
						phoneEmptyMap.put("PHONE_NO", "없음");
						trainPhoneList.add(phoneEmptyMap);
						phoneEmptyMap = new HashMap<>();
					}

					while (callDir <= 2) {
						paramMap.put("callDir", callDir);
						if(phoneListSize > 0) {
							trendList = trainOperationDAO.getTrainQualityTrend(paramMap);
						}
						trendData(callDir, tempMap, timeList, trendList);
						tempMap.put("PHONE_NO", phoneNo);
						callDir += 1;
					}
//					resultMap.put(trainPhoneList.get(idx).get("PHONE_NO").toString(), tempMap.clone());
					resultMap.put(trainPhoneList.get(idx).get("PHONE_NO").toString(), tempMap);
					tempMap = new HashMap<>();
					idx += 1;
				}
				resultMap.put("PHONE_NO", trainPhoneList);
			} else {
				if(!"없음".equals(phoneNo)) {
					paramMap.put("phoneNo", phoneNo);
				}

				while(callDir <= 2) {
					paramMap.put("callDir", callDir);
					try {
						if(!"없음".equals(phoneNo)) {
							trendList = trainOperationDAO.getTrainQualityTrend(paramMap);
						}
					} catch (Exception e) {
						log.error(e.getMessage());
					}
					trendData(callDir, resultMap, timeList, trendList);
					callDir += 1;
				}
			}
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getLastTrainQualityTrend(HashMap<String, Object> paramMap) {
		Map<String,Object> resultMap = new HashMap<>();
		HashMap<String, Object> tempMap = new HashMap<>();
		List<Map<String,Object>> trainPhoneList = new ArrayList<>();
		List<Map<String,Object>> trendList = new ArrayList<>();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date startTimeToDate;
		Date endTimeToDate;
		String eventTime = (String) paramMap.get("eventTime");
		String trainNo = paramMap.get("trainNo") == null ? "" : paramMap.get("trainNo").toString();
		String phoneNo = "";

		resultMap.put("TRAIN_NO", trainNo);
		resultMap.put("PHONE_NO", phoneNo);

		if("".equals(trainNo)) {
			try {
				trendList = trainOperationDAO.getLastTrainQualityTrendAll(paramMap);
				lastTrendData(resultMap, trendList);
				resultMap.put("CATEGORY", eventTime);
			} catch(Exception e) {
				log.error(e.getMessage());
			}
		} else {
			phoneNo = paramMap.get("phoneNo").toString();
			paramMap.put("phoneNo", phoneNo);
			trendList = trainOperationDAO.getTrainQualityTrend(paramMap);
			lastTrendData(resultMap, trendList);
			resultMap.put("PHONE_NO", phoneNo);
			resultMap.put("CATEGORY", eventTime);
		}

		return resultMap;
	}

	private void trendData(int callDir, Map<String, Object> tempMap, ArrayList<String> timeList, List<Map<String,Object>> trendList) {
		List<String> category = new ArrayList<>();
		List<Integer> attempts = new ArrayList<>();
		List<Integer> success = new ArrayList<>();
		List<Float> succRates = new ArrayList<>();

		List<Object> atmpList = new ArrayList<>();
		List<Object> succRateList = new ArrayList<>();

		HashMap<String, Object> atmp = new HashMap<String, Object>();
		HashMap<String, Object> succRate = new HashMap<String, Object>();

		boolean isFirst = true;
		try {
			for (String time : timeList) {
				isFirst = true;
				if(trendList.size() != 0) {
					for (Map map : trendList) {
						if (time.equals((String) map.get("MONITOR_TIME"))) {
							isFirst = false;
							category.add((String) map.get("MONITOR_TIME"));
							BigDecimal bdAttemp = (BigDecimal) map.get("ATTEMPT");
							BigDecimal bdSuccess = (BigDecimal) map.get("SUCCESS");
							Float bdSuccessRate = Float.parseFloat(map.get("SUCC_RATE").toString());

							attempts.add(bdAttemp.intValue());
							success.add(bdSuccess.intValue());
							succRates.add(bdSuccessRate);

//							BigDecimal bdAttempt = (BigDecimal) map.get("ATTEMPT");
//							BigDecimal bdSuccess = (BigDecimal) map.get("SUCCESS");
//							Float bdSuccessRate = Float.parseFloat(map.get("SUCC_RATE").toString());
//
//							atmp.put("x", map.get("MONITOR_TIME").toString());
//							atmp.put("y", bdAttempt.intValue());
//							succRate.put("x", map.get("MONITOR_TIME").toString());
//							succRate.put("y", bdSuccessRate);
//
//							atmpList.add(atmp.clone());
//							succRateList.add(succRate.clone());

							break;
						}
					}
				}
				if (isFirst) {
					category.add(time);
					attempts.add(0);
					success.add(0);
					succRates.add(0.0f);

//					atmp.put("x", time);
//					atmp.put("y", 0);
//					succRate.put("x", time);
//					succRate.put("y", 100.00f);
//
//					atmpList.add(atmp.clone());
//					succRateList.add(succRate.clone());
				}
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}

//		tempMap.put("ATTEMPTS",	atmpList);
//		tempMap.put("SUCC_RATES", succRateList);

		tempMap.put("CATEGORY",			category);
		if(callDir == 1) {
			//발신
			tempMap.put("SEND_ATTEMPTS",	attempts);
			tempMap.put("SEND_SUCCESS",	success);
			tempMap.put("SEND_SUCC_RATES",succRates);
		} else {
			//착신
			tempMap.put("RECV_ATTEMPTS",	attempts);
			tempMap.put("RECV_SUCCESS",	success);
			tempMap.put("RECV_SUCC_RATES",succRates);
		}
	}

	private void lastTrendData(Map<String, Object> tempMap, List<Map<String,Object>> trendList) {
		if(trendList.size() > 0) {
			tempMap.put("SEND_ATTEMPTS",	trendList.get(0).get("SEND_ATTEMPTS"));
			tempMap.put("SEND_SUCCESS",		trendList.get(0).get("SEND_SUCCESS"));
			tempMap.put("SEND_SUCC_RATES",	Float.parseFloat(trendList.get(0).get("SEND_SUCC_RATES").toString()));
			tempMap.put("RECV_ATTEMPTS",	trendList.get(0).get("RECV_ATTEMPTS"));
			tempMap.put("RECV_SUCCESS",		trendList.get(0).get("RECV_SUCCESS"));
			tempMap.put("RECV_SUCC_RATES",	Float.parseFloat(trendList.get(0).get("RECV_SUCC_RATES").toString()));
		} else {
			tempMap.put("SEND_ATTEMPTS",	0);
			tempMap.put("SEND_SUCCESS",		0);
			tempMap.put("SEND_SUCC_RATES",	100.00f);
			tempMap.put("RECV_ATTEMPTS",	0);
			tempMap.put("RECV_SUCCESS",		0);
			tempMap.put("RECV_SUCC_RATES",	100.00f);
		}
	}
}
