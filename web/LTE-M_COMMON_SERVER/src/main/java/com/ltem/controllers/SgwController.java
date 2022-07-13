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
import com.ltem.service.SgwService;


/**
 * 현재 사용 안함
 *
 */
@Controller("SgwController")
public class SgwController {
	
	@Autowired
	SgwService sgwService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(SgwController.class);
	
	@RequestMapping("/pss/epc/sgw")
	public String sgw_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/epc/sgw/sgwSearch";
	}
	
	@RequestMapping(value="/pss/epc/sgw/getSgwSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getSgwSearchOption(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String, List<Map<String, String>>> resultMap = sgwService.getSgwSearchOption();
		
		modelMap.addAttribute("sgwSearchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/sgw/getSgwSearch", method = RequestMethod.POST, produces = "application/json")
	public void getSgwSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,Object>> resultList = sgwService.getSgwSearch(paramMap);
		
		modelMap.addAttribute("sgwSearchData",resultList);
	}
	
	@RequestMapping(value="/pss/epc/sgw/getSgwDetail", method = RequestMethod.POST, produces = "application/json")
	public void getSgwDetail(HttpServletRequest request,HttpSession session,  String sgw_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = sgwService.getSgwDetail(sgw_id);
		
		modelMap.addAttribute("sgwDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/sgw/sgwDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = sgwService.sgwDetailupdate(paramMap);
		
		modelMap.addAttribute("sgwDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/sgw/sgwIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void sgwIdCheckResult(HttpServletRequest request,HttpSession session,  String sgw_id,ModelMap modelMap) throws Exception 
	{
		
		int resultlength = sgwService.sgwIdCheckResult(sgw_id);
		
		modelMap.addAttribute("sgwIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/epc/sgw/sgwAdd", method = RequestMethod.POST, produces = "application/json")
	public void sgwAdd(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = sgwService.sgwAdd(paramMap);
		
		modelMap.addAttribute("sgwAddResult",resultStr);
	}
}
