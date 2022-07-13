package com.ltem.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ltem.common.CommonFunction;
import com.ltem.service.IrisSsoService;

@Controller("ReportContoller")
public class ReportContoller {
	
	@Autowired
	private CommonFunction commonFunction;
	
	@Autowired
	IrisSsoService irisSsoService;
	
	private static final Logger log = LoggerFactory.getLogger(ReportContoller.class);
	
	/**
	 * iframe 사용 테스트 화면 이동
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @param modelMap
	 * @return
	 */
	@RequestMapping("/irisReportView")
	public String irisResportView(HttpServletRequest request, HttpServletResponse response, HttpSession session, ModelMap modelMap){
		
		try {
			modelMap.addAttribute("menu-path", "보고서");
			modelMap.addAttribute("menu-id", "10000000");
			commonFunction.setModel(request, session, modelMap);	
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		
		String userId = (String) session.getAttribute("user_id");
		irisSsoService.createCookie(response, userId);
		
		return "/irisReport";
	}
}
