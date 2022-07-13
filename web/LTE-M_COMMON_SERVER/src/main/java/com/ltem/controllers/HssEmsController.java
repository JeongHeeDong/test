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
import com.ltem.service.HssEmsService;


/**
 * 현재 사용 안함
 *
 */
@Controller("HssEmsController")
public class HssEmsController {
	
	@Autowired
	HssEmsService hssEmsService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(HssEmsController.class);
	
	@RequestMapping("/pss/epc/hssEms")
	public String hssEms_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/epc/hssEms/hssEmsSearch";
	}
	
	@RequestMapping(value="/pss/epc/hssEms/getHssEmsSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getHssEmsSearchOption(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String, Object> resultMap = hssEmsService.getHssEmsSearchOption();
		
		modelMap.addAttribute("hssEmsSearchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/hssEms/getHssEmsSearch", method = RequestMethod.POST, produces = "application/json")
	public void getHssEmsSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,Object>> resultList = hssEmsService.getHssEmsSearch(paramMap);
		
		modelMap.addAttribute("hssEmsSearchData",resultList);
	}
	
	@RequestMapping(value="/pss/epc/hssEms/getHssEmsDetail", method = RequestMethod.POST, produces = "application/json")
	public void getHssEmsDetail(HttpServletRequest request,HttpSession session,  String hssEms_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = hssEmsService.getHssEmsDetail(hssEms_id);
		
		modelMap.addAttribute("hssEmsDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/hssEms/hssEmsDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = hssEmsService.hssEmsDetailupdate(paramMap);
		
		modelMap.addAttribute("hssEmsDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/hssEms/hssEmsIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void hssEmsIdCheckResult(HttpServletRequest request,HttpSession session,  String hssEms_id,ModelMap modelMap) throws Exception 
	{
		
		int resultlength = hssEmsService.hssEmsIdCheckResult(hssEms_id);
		
		modelMap.addAttribute("hssEmsIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/epc/hssEms/hssEmsAdd", method = RequestMethod.POST, produces = "application/json")
	public void hssEmsAdd(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = hssEmsService.hssEmsAdd(paramMap);
		
		modelMap.addAttribute("hssEmsAddResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/hssEms/maxID", method = RequestMethod.POST, produces = "application/json")
	public void maxID(HttpServletRequest request,HttpSession session,  String cnEms_id,ModelMap modelMap) throws Exception 
	{
		
		Map<String,Object> resultMap = hssEmsService.maxID();
		
		modelMap.addAttribute("getMaxId",resultMap);
	}
}
