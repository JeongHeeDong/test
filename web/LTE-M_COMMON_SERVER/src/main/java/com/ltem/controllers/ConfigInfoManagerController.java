package com.ltem.controllers;

import java.util.ArrayList;
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
import com.ltem.service.ConfigInfoManagerService;


/**
 * 구성관리 > 구성변경 관리
 *
 */
@Controller("ConfigInfoManagerController")
public class ConfigInfoManagerController {
	
	@Autowired
	ConfigInfoManagerService configInfoManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(ConfigInfoManagerController.class);
	
	@RequestMapping("/pss/management/configinfo")
	public String duSearch_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/configinfomanager";
	}
	
	@RequestMapping(value="/pss/management/configinfo/getconfiginfoData", method = RequestMethod.POST, produces = "application/json")
	public void getconfiginfoData(HttpServletRequest request,HttpSession session, ModelMap modelMap) throws Exception 
	{
		List<Map<String, Object>> resultList = configInfoManagerService.getconfiginfoData();
		
		modelMap.addAttribute("getconfiginfoData",resultList);
	}
	
	@RequestMapping(value="/pss/management/configinfo/getGridData", method = RequestMethod.POST, produces = "application/json")
	public void getGridData(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,String> paramMap ,ModelMap modelMap) throws Exception 
	{
		Map<String, Object> resultList = configInfoManagerService.getGridData(paramMap);
		
		modelMap.addAttribute("getGridData",resultList);
	}
	
	@RequestMapping(value="/pss/management/configinfo/checkAdd", method = RequestMethod.POST, produces = "application/json")
	public void checkAdd(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap ,ModelMap modelMap) throws Exception 
	{
		int returnFlag = configInfoManagerService.checkAdd(paramMap);
		
		modelMap.addAttribute("returnFlag",returnFlag);
	}
	
	@RequestMapping(value="/pss/management/configinfo/checkMod", method = RequestMethod.POST, produces = "application/json")
	public void checkMod(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap ,ModelMap modelMap) throws Exception 
	{
		int returnFlag = configInfoManagerService.checkMod(paramMap);
		
		modelMap.addAttribute("returnFlag",returnFlag);
	}
	
	@RequestMapping(value="/pss/management/configinfo/checkDel", method = RequestMethod.POST, produces = "application/json")
	public void checkDel(HttpServletRequest request,HttpSession session, @RequestBody HashMap<String,Object> paramMap ,ModelMap modelMap) throws Exception 
	{
		int returnFlag = configInfoManagerService.checkDel(paramMap);
		
		modelMap.addAttribute("returnFlag",returnFlag);
	}
}
