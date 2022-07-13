package com.ltem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ltem.common.CommonFunction;
import com.ltem.service.DuSearchService;


/**
 * 구성관리 > 기지국 중계기 관리 > 기지국 관리
 *
 */
@Controller("DuSearchController")
public class DuSearchController {
	
	@Autowired
	DuSearchService duSearchService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@Value("#{locationconfig['du.template']}")
	String du_TemplatePath;
	@Value("#{locationconfig['ru.template']}")
	String ru_TemplatePath;
	
	private static final Logger log = LoggerFactory.getLogger(DuSearchController.class);
	
	@RequestMapping("/pss/du_ru/du")
	public String duSearch_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/du_ru/duSearch";
	}
	
	
	@RequestMapping("/pss/du_ru/du/getDuSearchOption")
	public void getSearchOption(HttpServletRequest request,HttpSession session, ModelMap modelMap) throws Exception 
	{
		//EMS Name, DU, Board Type option
		
		Map<String,List<Map<String,String>>> resultMap = duSearchService.getDuSearchOption();
		
		modelMap.addAttribute("duSearchOption",resultMap);
	}
	
	
	@RequestMapping(value="/pss/du_ru/du/getDuSearch", method = RequestMethod.POST, produces = "application/json")
	public void getDuSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		
		List<Map<String,Object>> resultMap = duSearchService.getDuSearch(paramMap);
		
		modelMap.addAttribute("duSearchData",resultMap);
	}
	
	@RequestMapping(value="/pss/du_ru/du/getDuDetail", method = RequestMethod.POST, produces = "application/json")
	public void getDuDetail(HttpServletRequest request,HttpSession session,  String cUid,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = duSearchService.getDuDetail(cUid);
		
		modelMap.addAttribute("duDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/du_ru/du/duDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void duDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = duSearchService.duDetailupdate(paramMap);
		
		modelMap.addAttribute("duDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/du_ru/du/duDetaildelete", method = RequestMethod.POST, produces = "application/json")
	public void duDetaildelete(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = duSearchService.duDetaildelete(paramMap);
		
		modelMap.addAttribute("duDetailResult",resultStr);
	}	
	
	@RequestMapping(value="/pss/du_ru/du/duIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void mmeIdCheckResult(HttpServletRequest request,HttpSession session,  String du_id,ModelMap modelMap) throws Exception 
	{
		
		int resultlength = duSearchService.duIdCheckResult(du_id);
		
		modelMap.addAttribute("duIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/du_ru/du/duAdd", method = RequestMethod.POST, produces = "application/json")
	public void duAdd(HttpServletRequest request, ModelMap modelMap, @RequestBody HashMap<String,Object> paramMap,HttpSession session) throws Exception
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = duSearchService.duAdd(paramMap);
		
		modelMap.addAttribute("duAddResult",resultStr);
	}
}
