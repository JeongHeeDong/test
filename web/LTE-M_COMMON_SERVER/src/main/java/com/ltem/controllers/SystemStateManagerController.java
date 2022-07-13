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
import com.ltem.service.SystemStateManagerService;


/**
 * 시스템 > 서버 상태 관리
 *
 */
@Controller("SystemStateManagerController")
public class SystemStateManagerController {
	
	@Autowired
	SystemStateManagerService systemStateManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(SystemStateManagerController.class);
	
	//서버 상태 관리
	@RequestMapping("/system/sysStateManager")
	public String sysState_page(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		
		modelMap.addAttribute("pageFlag","2");
		commonFunction.setModel(request,session,modelMap);
		
//		List<Map<String, Object>> _sessionMap = systemStateManagerService.getSessionipList("2");
//		session.setAttribute("HOST_INFO", _sessionMap);

		return "system/sysStateManager";
	}
	
	@RequestMapping(value="/system/sysStateManager/getStateData", method = RequestMethod.POST, produces = "application/json")
	public void getStateData(HttpServletRequest request,
							 HttpSession session,
							 String filterLevel,
							 String pageFlag,
							 ModelMap modelMap) throws Exception {
		HashMap<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("filterLevel", filterLevel);
		paramMap.put("pageFlag", pageFlag);
		
		Map<String,Object> resultList = systemStateManagerService.getStateData(paramMap);
		
		modelMap.addAttribute("getStateData",resultList);
	}
	
	@RequestMapping(value="/system/sysStateManager/getTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getTrendData(HttpServletRequest request,
							 HttpSession session,
							 @RequestBody HashMap<String,Object> paramMap,
							 ModelMap modelMap) throws Exception {
		Map<String,Object> returnMap = systemStateManagerService.getTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",returnMap);
	}
	
	@RequestMapping(value="/system/sysStateManager/getSysThOption", method = RequestMethod.POST, produces = "application/json")
	public void getSysThOption(HttpServletRequest request,HttpSession session,String pageFlag,ModelMap modelMap) throws Exception {
		
		List<Map<String, Object>> returnMap = systemStateManagerService.getSysThOption(pageFlag);
		
		modelMap.addAttribute("getSysThOption",returnMap);
	}
	
	
	@RequestMapping(value="/system/sysStateManager/getEquipTypeData", method = RequestMethod.POST, produces = "application/json")
	public void getEquipTypeData(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception {
		
		Map<String,Object> returnMap = systemStateManagerService.getEquipTypeData(paramMap);
		
		modelMap.addAttribute("getEquipTypeData",returnMap);
	}
	
	@RequestMapping(value="/system/sysStateManager/thresholdEdit", method = RequestMethod.POST, produces = "application/json")
	public void thresholdEdit(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception {
		int returnFlag = systemStateManagerService.thresholdEdit(paramMap);
		
		modelMap.addAttribute("FLAG",returnFlag);
	}
	
	/*
	 * 서비스 장비 통합 감시
	 */
	@RequestMapping("/integration/monitor/sysstate")
	public String integrationState_page(HttpServletRequest request,
										HttpSession session,
										ModelMap modelMap) throws Exception {

		modelMap.addAttribute("pageFlag","1");
		commonFunction.setModel(request,session,modelMap);
		
//		List<Map<String, Object>> _sessionMap = systemStateManagerService.getSessionipList("1");
//		session.setAttribute("HOST_INFO", _sessionMap);
		
		return "integrationMonitor/sysIntegrationManager";
	}
	
	@RequestMapping(value="/integration/monitor/sysstate/getStateData", method = RequestMethod.POST, produces = "application/json")
	public void getIntegrationStateData(HttpServletRequest request,
							 HttpSession session,
							 String filterLevel,
							 String pageFlag,
							 String lineId,
							 ModelMap modelMap) throws Exception {
		HashMap<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("filterLevel", filterLevel);
		paramMap.put("pageFlag", pageFlag);
		paramMap.put("lineId", lineId);
		
		Map<String,Object> resultMap = systemStateManagerService.getStateData(paramMap);
		
		Map<String,Object> vmResultMap = systemStateManagerService.getVmStateData(paramMap);
		modelMap.addAttribute("filterLevel",filterLevel);
		modelMap.addAttribute("getStateData",resultMap);
		modelMap.addAttribute("getVmStateData",vmResultMap);
	}
	
	@RequestMapping(value="/integration/monitor/sysstate/getTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getIntegrationTrendData(HttpServletRequest request,
							 HttpSession session,
							 @RequestBody HashMap<String,Object> paramMap,
							 ModelMap modelMap) throws Exception {
		Map<String,Object> returnMap = systemStateManagerService.getTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",returnMap);
	}
	
	@RequestMapping(value="/integration/monitor/sysstate/getVmTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getIntegrationVmTrendData(HttpServletRequest request,
			HttpSession session,
			@RequestBody HashMap<String,Object> paramMap,
			ModelMap modelMap) throws Exception {
		Map<String,Object> returnMap = systemStateManagerService.getVmTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",returnMap);
	}
	
	@RequestMapping(value="/integration/monitor/sysstate/getSysThOption", method = RequestMethod.POST, produces = "application/json")
	public void getIntegrationSysThOption(HttpServletRequest request,HttpSession session,String pageFlag,ModelMap modelMap) throws Exception {
		
		List<Map<String, Object>> returnMap = systemStateManagerService.getSysThOption(pageFlag);
		
		modelMap.addAttribute("getSysThOption",returnMap);
	}
	
	
	@RequestMapping(value="/integration/monitor/sysstate/getEquipTypeData", method = RequestMethod.POST, produces = "application/json")
	public void getIntegrationEquipTypeData(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception {
		
		Map<String,Object> returnMap = systemStateManagerService.getEquipTypeData(paramMap);
		
		modelMap.addAttribute("getEquipTypeData",returnMap);
	}
	
	@RequestMapping(value="/integration/monitor/sysstate/thresholdEdit", method = RequestMethod.POST, produces = "application/json")
	public void integrationthresholdEdit(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception {
		int returnFlag = systemStateManagerService.thresholdEdit(paramMap);
		
		modelMap.addAttribute("FLAG",returnFlag);
	}
	
}
