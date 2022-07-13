package com.ltem.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.MobileLocationMonitorDAO;
import com.ltem.dao.RuSearchDAO;
import com.ltem.service.MobileLocationMonitorService;
import com.ltem.utils.PTTMessageSender;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("MobileLocationMonitorService")
public class MobileLocationMonitorServiceImpl implements MobileLocationMonitorService {

	private static final Logger log = LoggerFactory.getLogger(TrainOperationServiceImpl.class);
	
	@Autowired
	PTTMessageSender pttMessageSender;
	@Autowired
	MobileLocationMonitorDAO mobileLocationMonitorDAO;
	@Autowired
	RuSearchDAO ruSearchDAO;
	
	@Override
	public Map<String, Object> getStationInfoAndMonitorTime() {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		List<Map<String,String>> originStationInfo = ruSearchDAO.getStation();
		List<Map<String,String>> location = new ArrayList<Map<String,String>>();
		HashMap<String,String> tempMap = new HashMap<String,String>();
		int intFlag = 0;
		String locationName = "";
		int locationNumber = 0;

		for(int i = 0; i<originStationInfo.size(); i++){
			if(!"0".equals(originStationInfo.get(i).get("STATION_ID"))){
				locationNumber = Integer.parseInt(originStationInfo.get(i).get("STATION_ID"));
				locationName = originStationInfo.get(i).get("STATION_NAME");
				if(i != originStationInfo.size()-1){
					locationNumber += Integer.parseInt(originStationInfo.get(i+1).get("STATION_ID"));
					locationName += "-"+originStationInfo.get(i+1).get("STATION_NAME")+" 본선";
					tempMap.put("STATION_NAME", locationName.toString());
					tempMap.put("STATION_ID", ((float)locationNumber/2)+"");
					locationNumber = 0;
					locationName = "";

					location.add((Map<String, String>) tempMap.clone());
				}
				location.add(originStationInfo.get(i));
			}
			//추후 본사라는 항목이 따로 생길경우 else문 삭제 필요(2017.04.13)
			else {
				location.add(originStationInfo.get(i));
				locationNumber = Integer.parseInt(originStationInfo.get(i).get("STATION_ID"));
				locationName = originStationInfo.get(i).get("STATION_NAME");
				if(i != originStationInfo.size()-1){
					locationNumber += Integer.parseInt(originStationInfo.get(i+1).get("STATION_ID"));
					locationName += "-"+originStationInfo.get(i+1).get("STATION_NAME")+" 본선";
					tempMap.put("STATION_NAME", locationName.toString());
					tempMap.put("STATION_ID", ((float)locationNumber-0.5f)+"");
					locationNumber = 0;
					locationName = "";
					location.add((Map<String, String>) tempMap.clone());
				}
			}
		}

		Collections.sort(location, new Comparator<Map<String, String >>() {
			@Override
			public int compare(Map<String, String> first,
							   Map<String, String> second) {
				Float first_float = Float.parseFloat(first.get("STATION_ID"));
				Float second_float = Float.parseFloat(second.get("STATION_ID"));

				return first_float.compareTo(second_float);
			}
		});
		
		returnMap.put("OriginStationInfo", originStationInfo);
		returnMap.put("ModifyStationInfo", location);
		returnMap.put("MonitorTime", mobileLocationMonitorDAO.getPerformanceTime());
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getMobileLocationAndAlarm(HashMap<String, Object> paramMap) {
		
		Map<String, Object> returnMap = new HashMap<String,Object>();
		
		List<Map<String,Object>> locationInfo = mobileLocationMonitorDAO.getMobileLocationAndAlarm(paramMap);
		List<Map<String,Object>> mobileInfo = mobileLocationMonitorDAO.getmobileInfo();
		
		returnMap.put("locationInfo", locationInfo);
		returnMap.put("mobileInfo", mobileInfo);
		
		return returnMap;
	}
	
	@Override
	public Map<String, Object> getMobileLocationAndAlarmEms(HashMap<String, Object> paramMap) {
		
		Map<String, Object> returnMap = new HashMap<String,Object>();
		
		List<Map<String,Object>> locationInfo = mobileLocationMonitorDAO.getMobileLocationAndAlarmEms(paramMap);
		List<Map<String,Object>> mobileInfo = mobileLocationMonitorDAO.getmobileInfoEms();
		
		returnMap.put("locationInfo", locationInfo);
		returnMap.put("mobileInfo", mobileInfo);
		
		return returnMap;
	}

	@Override
	public List<Map<String, Object>> getPopPerformData(HashMap<String, Object> paramMap) {
		
		String phoneStr =(String)paramMap.get("phones") ;
		String[] phonesList = phoneStr.split(",");
		String phoneSql = "";
		boolean isFirst = true;
		
		for(String phone : phonesList) {
			if(isFirst) {
				phoneSql = "SELECT "+phone+" AS PHONE_NO\n";
				isFirst = false;
			}else {
				phoneSql += "UNION ALL\nSELECT "+phone+" AS PHONE_NO\n";
			}
		}
		paramMap.put("phoneSql", phoneSql);
		
		List<Map<String,Object>> returnList = mobileLocationMonitorDAO.getPopPerformData(paramMap);
		return returnList;
	}
	
	@Override
	public Map<String, Object> searchTrend(HashMap<String, Object> paramMap) {
		Map<String,Object> resultMap = new HashMap<>();
		HashMap<String, Object> tempMap = new HashMap<>();
		List<Map<String,Object>> trendList = new ArrayList<>();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date startTimeToDate;
		Date endTimeToDate;
		String startTime = paramMap.get("startEventTime") == null ? "" :(String) paramMap.get("startEventTime");
		String endTime = paramMap.get("eventTime") == null ? "" :(String) paramMap.get("eventTime");
		String phoneNo = paramMap.get("phoneNo").toString();

		try {
			endTimeToDate = sdf.parse(endTime);
			if("".equals(startTime)) {
				startTime = sdf.format(endTimeToDate.getTime() - (1000 * 60 * 60));
			}
			startTimeToDate = sdf.parse(startTime);
			paramMap.put("startEventTime", startTime);

		} catch (Exception e) {
			log.error(e.getMessage());
		}

		//chart x축 데이터
		ArrayList<String> timeList = new ArrayList<String>();
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

		resultMap.put("PHONE_NO",			phoneNo);
		resultMap.put("START_EVENT_TIME",	startTime);
		resultMap.put("END_EVENT_TIME",		endTime);

		int callDir = 1;
		while (callDir <= 2) {
			paramMap.put("callDir", callDir);
			try {
				trendList = mobileLocationMonitorDAO.getPhonePerformanceTrend(paramMap);
			} catch(Exception e) {
				log.error(e.getMessage());
			}
			trendData(callDir, resultMap, timeList, trendList);
			callDir += 1;
		}
		return resultMap;
	}
	
	private void trendData(int callDir, Map<String, Object> tempMap, ArrayList<String> timeList, List<Map<String,Object>> trendList) {
		List<String> category = new ArrayList<>();
		List<Integer> attempts = new ArrayList<>();
		List<Integer> successes = new ArrayList<>();
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
						if (time.equals((String) map.get("EVENT_TIME"))) {
							isFirst = false;
							category.add((String) map.get("EVENT_TIME"));
							int attempt = (Integer) map.get("ATTEMPT");
							int success = (Integer) map.get("SUCCESS");
							Float successRate = Float.parseFloat(map.get("SUCC_RATE").toString());

							attempts.add(attempt);
							successes.add(success);
							succRates.add(successRate);

							break;
						}
					}
				}
				if (isFirst) {
					category.add(time);
					attempts.add(0);
					successes.add(0);
					succRates.add(0.0f);
				}
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		tempMap.put("CATEGORY",			category);
		if(callDir == 1) {
			//발신
			tempMap.put("SEND_ATTEMPTS",	attempts);
			tempMap.put("SEND_SUCCESS",	successes);
			tempMap.put("SEND_SUCC_RATES",succRates);
		} else {
			//착신
			tempMap.put("RECV_ATTEMPTS",	attempts);
			tempMap.put("RECV_SUCCESS",	successes);
			tempMap.put("RECV_SUCC_RATES",succRates);
		}
	}
	
	@Override
	public Map<String, Object> sendMessage(HashMap<String, Object> paramMap) {
		/**------------------------------------------------
		user_id : web에서 발송한 사용자 아이디
		team_id : web에서 발송한 사용자의 팀
		system_id : ptt syste_id 로 모비젠은 pd1001 로 정해짐.
		alarm_code : 알람코드
		alarm_name : 알람명
		severity : 등급(1~9)
		location : 알람 발생 위치
		event_type : 장비명
		event_time : 발생시간
		sn : 0: 정상, 1:장애, 2: Etc
		pg : 전화번호 그룹
		tn : 전화번호 , 구분 리스트
		ct : SMS 내용
		------------------------------------------------**/
		String msg = "";
		String SEP = "|";

		//user id
		msg += (String)paramMap.get("userId") + SEP;

		//team id
		msg += "" + SEP;

		//system id
		msg += "" + SEP;

		//alarm code
		msg += "" + SEP;

		//alarm name
		msg += "" + SEP;

		//alarm 등급
		msg += "" + SEP;

		//location
		msg += "" + SEP;

		//equip type
		msg += "" + SEP;

		//event time
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowdate = dateFormat.format(calendar.getTime());
		msg += nowdate + SEP;

		//sn 0:정상 1:장애 2:TC
		msg += "" + SEP;

		//단말번호 그룹
		msg += "" + SEP;

		//단말번호 ,구분
		msg += (String)paramMap.get("phone") + SEP;

		//message
		msg += (String)paramMap.get("message") + "\n";

		int test = pttMessageSender.messageSend(msg);

		return null;
	}
}
