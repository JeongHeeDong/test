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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ltem.common.CommonFunction;
import com.ltem.service.MainMonitorService;
import com.ltem.service.SystemCollectManagerService;
import com.ltem.service.SystemProcessManagerService;
import com.ltem.service.SystemStateManagerService;


/**
 * 통합감시 > 메인감시
 *
 */
@Controller("MainMonitorController")
public class MainMonitorController {
	
	@Autowired
	MainMonitorService mainMonitorService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@Autowired
	SystemStateManagerService systemStateManagerService;
	
	@Autowired
	SystemCollectManagerService systemCollectManagerService;
	
	@Autowired
	SystemProcessManagerService systemProcessManagerService;
	
	private static final Logger log = LoggerFactory.getLogger(MainMonitorController.class);
	
	@RequestMapping("/integration/mainMonitor")
	public String mainMonitor_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		modelMap.addAttribute("ip", request.getServerName());
		modelMap.addAttribute("websocketPort", request.getServerPort());
		
		commonFunction.setModel(request,session,modelMap);
		
		return "integrationMonitor/mainMonitor";
	}
	
	@RequestMapping("/integration/mainMonitor/getPerformData")
	@ResponseBody
	public Map<String, Object> getPerformData(HttpServletRequest request,HttpSession session,ModelMap modelMap, @RequestParam HashMap<String,Object> paramMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("getPerformData", mainMonitorService.getPerformData(paramMap));
		resultMap.put("duActCount", mainMonitorService.getDuActiveCount());
		return resultMap;
		//modelMap.addAttribute("getPerformData", mainMonitorService.getPerformData(paramMap));
	}
	
	@RequestMapping(value="/integration/mainMonitor/getStateData", method = RequestMethod.POST, produces = "application/json")
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
	
	@RequestMapping(value="/integration/mainMonitor/radioSearch", method = RequestMethod.POST, produces = "application/json")
	public void getRadioSearch(HttpServletRequest request,
							   HttpSession session,
							   @RequestBody HashMap<String,Object> paramMap,
							   ModelMap modelMap) throws Exception {
		String flag = (String) paramMap.get("data");
		Map<String,List<Map<String, Object>>> resultMap = systemCollectManagerService.getColData(flag);
		
		modelMap.addAttribute("getColData", resultMap);
	}
	
	@RequestMapping(value="/integration/mainMonitor/getSioefStateData", method = RequestMethod.POST, produces = "application/json")
	public void sioefStateList(HttpServletRequest request,
			HttpSession session,
			@RequestBody HashMap<String,String> paramMap,
			ModelMap modelMap) throws Exception {
					
		List<Map<String, Object>> nodeList = systemProcessManagerService.getSioefStateData(paramMap);
		
		modelMap.addAttribute("nodeList", nodeList);
	}
	
	@RequestMapping(value="/integration/mainMonitor/getUserMenuAuth")
	@ResponseBody
	public Map<String, Object> getUserMenuAuth(HttpServletRequest request,HttpSession session,ModelMap modelMap, @RequestParam HashMap<String,Object> paramMap) throws Exception {
					
		Map<String, Object> resultMap = new HashMap<>();
		List<Map<String, String>> userAuthList = mainMonitorService.getUserMenuAuth();
		resultMap.put("userAuthList",userAuthList);
		return resultMap;
	}
}
