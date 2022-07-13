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
import com.ltem.service.LogMgmtService;


/**
 * 보안 > 접속 관리 > 접속 이력 조회
 *
 */
@Controller("LogMgmtController")
public class LogMgmtController {
	
	@Autowired
	LogMgmtService logMgmtService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(LogMgmtController.class);
	
	@RequestMapping("/security/log/logMgmt")
	public String logMgmtPage(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "security/logMgmt/logMgmt";
	}

	@RequestMapping(value = "/security/log/logMgmt/list", method = RequestMethod.POST, produces = "application/json")
	public ModelMap logMgmtList(HttpServletRequest request,HttpSession session,
									@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		List<Map<String, String>> resultList = logMgmtService.getLogMgmtList(paramMap);
		modelMap.addAttribute("logList", resultList);

		return modelMap;

	}

}
