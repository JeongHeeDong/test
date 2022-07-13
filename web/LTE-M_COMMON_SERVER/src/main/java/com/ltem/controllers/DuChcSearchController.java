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
import com.ltem.service.DuChcSearchService;


/**
 * 구성관리 > 기지국 중계기 관리 관리 > 기지국 Channel Card 현황 조회
 *
 */
@Controller("DuChcSearchController")
public class DuChcSearchController {
	
	@Autowired
	DuChcSearchService duChcSearchService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(DuChcSearchController.class);
	
	@RequestMapping("/pss/du_ru/chc")
	public String duSearch_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/du_ru/duChcSearch";
	}
	
	
	@RequestMapping(value="/pss/du_ru/chc/getSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getEmsName(HttpServletRequest request,HttpSession session, ModelMap modelMap) throws Exception 
	{
		
		Map<String, List<Map<String, String>>> resultMap = duChcSearchService.getSearchOption();
		
		modelMap.addAttribute("searchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/du_ru/chc/getduChcSearch", method = RequestMethod.POST, produces = "application/json")
	public void getduChcSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		
		List<Map<String,Object>> resultMap = duChcSearchService.getduChcSearch(paramMap);
		
		modelMap.addAttribute("duChcSearchData",resultMap);
	}
	
	@RequestMapping(value="/pss/du_ru/chc/getChcSearch", method = RequestMethod.POST, produces = "application/json")
	public void getChcSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		
		List<Map<String,Object>> resultMap = duChcSearchService.getChcSearch(paramMap);
		
		modelMap.addAttribute("chcSearchData",resultMap);
	}
}
