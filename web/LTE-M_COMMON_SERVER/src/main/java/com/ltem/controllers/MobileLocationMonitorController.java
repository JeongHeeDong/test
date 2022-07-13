
package com.ltem.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ltem.common.CommonFunction;
import com.ltem.service.MobileLocationMonitorService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 통합감시 > 단말 위치 확인
 *
 */
@Controller("MobileLocationMonitorController")
@RequestMapping("/integration/monitor")
public class MobileLocationMonitorController {
	private static final Logger log = LoggerFactory.getLogger(MobileLocationMonitorController.class);

	@Autowired
	private CommonFunction commonFunction;
	
	@Autowired
	private MobileLocationMonitorService mobileLocationMonitorService;
	
	@RequestMapping("/mobile")
	public String mobileLocation(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "integrationMonitor/mobileLocation";
	}
	
	@RequestMapping(value="/mobile/getStationInfoAndMonitorTime", method = RequestMethod.POST, produces = "application/json")
	public void getStationInfoAndMonitorTime(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception{
		Map<String,Object> resultMap = mobileLocationMonitorService.getStationInfoAndMonitorTime();
		
		modelMap.addAttribute("stationInfoAndMonitorTime",resultMap);
	}
	
	@RequestMapping(value="/mobile/getMobileLocationAndAlarm", method = RequestMethod.POST, produces = "application/json")
	public void getMobileLocationAndAlarm(HttpServletRequest request, HttpSession session, ModelMap modelMap, @RequestBody HashMap<String,Object> paramMap) throws Exception{
		
		Map<String, Object> resultMap = null;
		// 기존 ptt 연동 일 경우
		//resultMap = mobileLocationMonitorService.getMobileLocationAndAlarm(paramMap);
		
		// 김포 LTE-M 은 EMS 를 통해서 수집(?)
		resultMap = mobileLocationMonitorService.getMobileLocationAndAlarmEms(paramMap);
		
		modelMap.addAttribute("mobileLocationAndAlarm",resultMap);
	}
	
	@RequestMapping(value="/mobile/getPopPerformData", method = RequestMethod.POST, produces = "application/json")
	public void getPopPerformData(HttpServletRequest request, HttpSession session, ModelMap modelMap, @RequestBody HashMap<String,Object> paramMap) throws Exception{
		List<Map<String, Object>> resultList = mobileLocationMonitorService.getPopPerformData(paramMap);
		
		modelMap.addAttribute("popPerformData",resultList);
	}
	
	@RequestMapping(value="/mobile/searchTrend", method = RequestMethod.POST)
	public void searchTrend(HttpServletRequest request,HttpSession session,
									  @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception {
		Map<String,Object> resultMap = mobileLocationMonitorService.searchTrend(paramMap);
		modelMap.addAttribute("trendInfo", resultMap);
	}
	
	@RequestMapping(value="/mobile/sendMessage", method = RequestMethod.POST)
		public void sendMessage(HttpServletRequest request, HttpSession session,
								@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {
			paramMap.put("userId", session.getAttribute("user_id"));
			Map<String,Object> resultMap = mobileLocationMonitorService.sendMessage(paramMap);
			modelMap.addAttribute("mobileLocationInfo",resultMap);
	}
}
