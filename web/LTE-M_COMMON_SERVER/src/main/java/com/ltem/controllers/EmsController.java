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
import com.ltem.service.EmsService;


/**
 * 현재 사용 안함
 *
 */
@Controller("EmsController")
public class EmsController {
	
	@Autowired
	EmsService emsService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(EmsController.class);
	
	@RequestMapping("/pss/ems/info")
	public String ems_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/ems/emsSearch";
	}
	
	@RequestMapping(value="/pss/ems/info/getEmsSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getEmsSearchOption(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String, Object> resultMap = emsService.getEmsSearchOption();
		
		modelMap.addAttribute("emsSearchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/ems/info/getEmsSearch", method = RequestMethod.POST, produces = "application/json")
	public void getEmsSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,Object>> resultList = emsService.getEmsSearch(paramMap);
		
		modelMap.addAttribute("emsSearchData",resultList);
	}
	
	@RequestMapping(value="/pss/ems/info/getEmsDetail", method = RequestMethod.POST, produces = "application/json")
	public void getEmsDetail(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = emsService.getEmsDetail(paramMap);
		
		modelMap.addAttribute("emsDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/ems/info/emsDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = emsService.emsDetailupdate(paramMap);
		
		modelMap.addAttribute("emsDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/ems/info/emsIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void emsIdCheckResult(HttpServletRequest request,HttpSession session,  String ems_id,ModelMap modelMap) throws Exception 
	{
		
		int resultlength = emsService.emsIdCheckResult(ems_id);
		
		modelMap.addAttribute("emsIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/ems/info/emsAdd", method = RequestMethod.POST, produces = "application/json")
	public void emsAdd(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = emsService.emsAdd(paramMap);
		
		modelMap.addAttribute("emsAddResult",resultStr);
	}
	
	@RequestMapping(value="/pss/ems/info/maxID", method = RequestMethod.POST, produces = "application/json")
	public void maxID(HttpServletRequest request,HttpSession session,  String cnEms_id,ModelMap modelMap) throws Exception 
	{
		
		Map<String,Object> resultMap = emsService.maxID();
		
		modelMap.addAttribute("getMaxId",resultMap);
	}
}
