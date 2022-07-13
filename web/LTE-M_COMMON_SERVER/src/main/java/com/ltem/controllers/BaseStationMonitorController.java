package com.ltem.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ltem.common.CommonFunction;
import com.ltem.v2.common.V2Constants;
import com.ltem.v2.utils.ProjectUtils;

@Controller("MapMonitorController")
@RequestMapping("/integration/monitor")
public class BaseStationMonitorController {   
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(BaseStationMonitorController.class);
	
	@RequestMapping("/basestation")
	public String mainMonitor_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{

		if (V2Constants.P168.equals(ProjectUtils.getProjectProfile())) {
			throw new Exception("You do not have permission.");			
		}
		
		modelMap.addAttribute("ip", request.getServerName());
		modelMap.addAttribute("websocketPort", request.getServerPort());
		
		commonFunction.setModel(request,session,modelMap);
		
		return "integrationMonitor/baseStation";   
	}
}
