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
import com.ltem.service.RuSearchService;


/**
 * 구성관리 > 기지국 중계기 관리 > 중계기 관리
 *
 */
@Controller("RuSearchController")
public class RuSearchController {
	
	@Autowired
	RuSearchService ruSearchService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(RuSearchController.class);
	
	@RequestMapping("/pss/du_ru/ru")
	public String ruSearch_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/du_ru/ruSearch";
	}
	
	
	@RequestMapping(value="/pss/du_ru/ru/getRuSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getSearchOption(HttpServletRequest request,HttpSession session,  ModelMap modelMap) throws Exception 
	{
		Map<String,List<Map<String,String>>> resultMap = ruSearchService.getRuSearchOption();
		
		modelMap.addAttribute("ruSearchOption",resultMap);
	}

	@RequestMapping(value="/pss/du_ru/ru/getRuLocation", method = RequestMethod.POST, produces = "application/json")
	public void getRuLocation(HttpServletRequest request,HttpSession session,  ModelMap modelMap) throws Exception
	{
		List<Map<String,String>> resultList = ruSearchService.getRuLocation();

		modelMap.addAttribute("ruLocation",resultList);
	}
	
	@RequestMapping(value="/pss/du_ru/ru/getRuSearch", method = RequestMethod.POST, produces = "application/json")
	public void getRuSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		
		List<Map<String,Object>> resultMap = ruSearchService.getRuSearch(paramMap);
		
		modelMap.addAttribute("ruSearchData",resultMap);
	}
	
	@RequestMapping(value="/pss/du_ru/ru/getRuDetail", method = RequestMethod.POST, produces = "application/json")
	public void getRuDetail(HttpServletRequest request,HttpSession session,  String cUid,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = ruSearchService.getRuDetail(cUid);
		
		modelMap.addAttribute("ruDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/du_ru/ru/ruDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void ruDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = ruSearchService.ruDetailupdate(paramMap);
		
		modelMap.addAttribute("ruDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/du_ru/ru/ruAdd", method = RequestMethod.POST, produces = "application/json")
	public void ruAdd(HttpServletRequest request, ModelMap modelMap,@RequestBody HashMap<String,Object> paramMap,HttpSession session) throws Exception
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = ruSearchService.ruAdd(paramMap);
		
		modelMap.addAttribute("ruAddResult",resultStr);
	}
}
