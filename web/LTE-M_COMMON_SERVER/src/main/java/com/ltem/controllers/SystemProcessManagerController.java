package com.ltem.controllers;

import java.text.SimpleDateFormat;
import java.util.Calendar;
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
import com.ltem.service.SystemProcessManagerService;


/**
 * 현재 사용 안함
 *
 */
@Controller("SystemProcessManagerController")
public class SystemProcessManagerController {
	private static final Logger log = LoggerFactory.getLogger(SystemProcessManagerController.class);

	@Autowired
	SystemProcessManagerService systemProcessManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/system/sysProcManager")
	public String pgw_page(HttpServletRequest request,
						   HttpSession session,
						   ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);

		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowdate = dateFormat.format(calendar.getTime());
		modelMap.addAttribute("nowDateTime",nowdate);

		return "system/sysProcManager";
	}
	
	@RequestMapping(value="/system/sysProcManager/getProcessData", method = RequestMethod.POST, produces = "application/json")
	public void getProcData(HttpServletRequest request,
							HttpSession session,
							ModelMap modelMap) throws Exception {
		Map<String,Object> resultMap = systemProcessManagerService.getProcData(null);
		
		modelMap.addAttribute("getProcData",resultMap);
	}
	
	@RequestMapping(value="/system/sysProcManager/getProcSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getProcSearchOption(HttpServletRequest request,
									HttpSession session,
									ModelMap modelMap) throws Exception {
		List<String> resultList = systemProcessManagerService.getProcSearchOption();
		
		modelMap.addAttribute("getProcSearchOption",resultList);
	}	
	
	@RequestMapping(value="/system/sysProcManager/optionSearch", method = RequestMethod.POST, produces = "application/json")
	public void getOptionSearch(HttpServletRequest request,
								HttpSession session,
								@RequestBody HashMap<String,Object> paramMap,
								ModelMap modelMap) throws Exception {
		String word = (String) paramMap.get("data");
		Map<String,Object> resultMap = systemProcessManagerService.getProcData(word);
		
		modelMap.addAttribute("getProcData", resultMap);
	}
}
