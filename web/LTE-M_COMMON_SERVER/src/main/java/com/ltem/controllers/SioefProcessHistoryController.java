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
import com.ltem.service.SystemProcessManagerService;

/**
 * 시스템 > 서버 프로세스 관리 > 프로세스 이력
 *
 */
@Controller("SioefProcessHistoryController")
public class SioefProcessHistoryController {
	
	private static final Logger log = LoggerFactory.getLogger(SioefProcessHistoryController.class);
	
	@Autowired
	private CommonFunction commonFunction;
	
	@Autowired
	SystemProcessManagerService systemProcessManagerService;
	
	@RequestMapping("/system/sioefProcessHistory")
	public String sioefHis(HttpServletRequest request,
						   HttpSession session,
						   ModelMap modelMap) throws Exception {

		commonFunction.setModel(request, session, modelMap);
	
		return "system/sioefProcessHistory";
	}
	
	@RequestMapping(value="/system/sioefProcessHistory/sioefProcHisotryList", method = RequestMethod.POST, produces = "application/json")
	public void sioefProcHisotryList(HttpServletRequest request,
			HttpSession session,
			@RequestBody HashMap<String,String> paramMap,
			ModelMap modelMap) throws Exception {	
			
		List<Map<String, Object>> historyList = systemProcessManagerService.getSioefHistoryList(paramMap);
		int totalCnt =  systemProcessManagerService.getSioefHistoryCnt(paramMap);
	
		modelMap.addAttribute("historyList",historyList);
		modelMap.addAttribute("totalCnt", totalCnt);
	}
}
