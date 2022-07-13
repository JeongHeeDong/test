package com.ltem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ltem.common.CommonFunction;
import com.ltem.service.TrainOperationService;

/**
 * 통합감시 > 열차 운행 감시
 *
 */
@Controller("TrainOperationController")
@RequestMapping("/integration/monitor")
public class TrainOperationController {
	private static final Logger log = LoggerFactory.getLogger(TrainOperationController.class);

	@Autowired
	private CommonFunction commonFunction;
	
	@Autowired
	private TrainOperationService trainOperationService;
	
	@RequestMapping("/train")
	public String train_oper(HttpServletRequest request, HttpSession session,
						  ModelMap modelMap) throws Exception {

		commonFunction.setModel(request, session, modelMap);

		return "integrationMonitor/trainOperation";
	}

	@RequestMapping(value="/train/monitortime", method = RequestMethod.POST, produces = "application/json")
	public void monitorTimeInfo(HttpServletRequest request,HttpSession session,ModelMap modelMap)
			throws Exception {
		Map<String,String> result = trainOperationService.getPerformanceTimeInfo();

		modelMap.addAttribute("PERFORMANCE_TIME",result.get("PERFORMANCE_TIME"));
	}

	@RequestMapping(value="/train/stationinfo", method = RequestMethod.POST, produces = "application/json")
	public void stationInfo(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		Map<String,Object> resultMap = trainOperationService.getStationInfo();

		modelMap.addAttribute("stationInfo",resultMap);
	}

	@RequestMapping(value="/train/stationlocationinfo", method = RequestMethod.POST, produces = "application/json")
	public void stationLocationInfo(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		List<Map<String,Object>> resultMap = trainOperationService.getStationLocationInfo();

		modelMap.addAttribute("stationLocationInfo",resultMap);
	}

	@RequestMapping(value="/train/traininfo", method = RequestMethod.POST, produces = "application/json")
	public void trainInfo(HttpServletRequest request,HttpSession session,
						  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap)
			throws Exception {
		Map<String,Object> resultMap = trainOperationService.getTrainInfo(paramMap);

		modelMap.addAttribute("trainInfo",resultMap);
	}

	@RequestMapping(value="/train/trend", method = RequestMethod.POST, produces = "application/json")
	public void qualityInfo(HttpServletRequest request,HttpSession session,
							 @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap)
			throws Exception {
//		Map<String,Object> resultMap = trainOperationService.getTrainQualityTrend(paramMap);
		Map<String,Object> resultMap = trainOperationService.getTrainQualityTrendTest(paramMap);
		modelMap.addAttribute("trainQualityInfo",resultMap);
	}

	@RequestMapping(value="/train/lastTrend", method = RequestMethod.POST, produces = "application/json")
	public void lastQualityInfo(HttpServletRequest request,HttpSession session,
							@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap)
			throws Exception {
		Map<String,Object> resultMap = trainOperationService.getLastTrainQualityTrend(paramMap);
		modelMap.addAttribute("lastTrainQualityInfo",resultMap);
	}
}
