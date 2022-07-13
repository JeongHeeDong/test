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
import com.ltem.service.CnEmsService;


/**
 * 현재 사용 안함
 *
 */
@Controller("CnEmsController")
public class CnEmsController {
	
	@Autowired
	CnEmsService cnEmsService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(CnEmsController.class);
	
	@RequestMapping("/pss/epc/cnEms")
	public String cnEms_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/epc/cnEms/cnEmsSearch";
	}
	
	@RequestMapping(value="/pss/epc/cnEms/getCnEmsSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getCnEmsSearchOption(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String, Object> resultMap = cnEmsService.getCnEmsSearchOption();
		
		modelMap.addAttribute("cnEmsSearchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/cnEms/getCnEmsSearch", method = RequestMethod.POST, produces = "application/json")
	public void getCnEmsSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,Object>> resultList = cnEmsService.getCnEmsSearch(paramMap);
		
		modelMap.addAttribute("cnEmsSearchData",resultList);
	}
	
	@RequestMapping(value="/pss/epc/cnEms/getCnEmsDetail", method = RequestMethod.POST, produces = "application/json")
	public void getCnEmsDetail(HttpServletRequest request,HttpSession session,  String cnEms_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = cnEmsService.getCnEmsDetail(cnEms_id);
		
		modelMap.addAttribute("cnEmsDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/cnEms/cnEmsDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = cnEmsService.cnEmsDetailupdate(paramMap);
		
		modelMap.addAttribute("cnEmsDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/cnEms/cnEmsIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void cnEmsIdCheckResult(HttpServletRequest request,HttpSession session,  String cnEms_id,ModelMap modelMap) throws Exception 
	{
		
		int resultlength = cnEmsService.cnEmsIdCheckResult(cnEms_id);
		
		modelMap.addAttribute("cnEmsIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/epc/cnEms/cnEmsAdd", method = RequestMethod.POST, produces = "application/json")
	public void cnEmsAdd(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = cnEmsService.cnEmsAdd(paramMap);
		
		modelMap.addAttribute("cnEmsAddResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/cnEms/maxID", method = RequestMethod.POST, produces = "application/json")
	public void maxID(HttpServletRequest request,HttpSession session,  String cnEms_id,ModelMap modelMap) throws Exception 
	{
		
		Map<String,Object> resultMap = cnEmsService.maxID();
		
		modelMap.addAttribute("getMaxId",resultMap);
	}
}
