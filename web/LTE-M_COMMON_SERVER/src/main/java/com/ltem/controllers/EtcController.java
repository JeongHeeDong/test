package com.ltem.controllers;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.ltem.service.EtcService;


/**
 * 구성관리 > 기타 장치 관리
 *
 */
@Controller("EtcController")
public class EtcController {
	
	@Autowired
	EtcService etcService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(EtcController.class);
	
	@RequestMapping("/pss/etc")
	public String etc_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/etc/etcSearch";
	}
	
	@RequestMapping(value="/pss/etc/getEtcSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getEtcSearchOption(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String, List<Map<String, String>>> resultMap = etcService.getEtcSearchOption();
		
		modelMap.addAttribute("etcSearchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/etc/getEtcSearch", method = RequestMethod.POST, produces = "application/json")
	public void getEtcSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,Object>> resultList = etcService.getEtcSearch(paramMap);
		
		modelMap.addAttribute("etcSearchData",resultList);
	}
	
	@RequestMapping(value="/pss/etc/getEtcDetail", method = RequestMethod.POST, produces = "application/json")
	public void getEtcDetail(HttpServletRequest request,HttpSession session,  String etc_id, String etc_type, String etc_name, ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap;
		
//		if("14".equals(etc_type) || "15".equals(etc_type) || "16".equals(etc_type) || "29".equals(etc_type)
//				|| "30".equals(etc_type) || "39".equals(etc_type) || "42".equals(etc_type) || "47".equals(etc_type) || "48".equals(etc_type)) {
//			resultMap = etcService.getEtcEmsDetail(etc_id, etc_type);
//		} else {
//			resultMap = etcService.getEtcDetail(etc_id);
//		}
		//
		if("EMS".equals(etc_name)) {
			resultMap = etcService.getEtcEmsDetail(etc_id, etc_type);
		} else {
			resultMap = etcService.getEtcDetail(etc_id);
		}
		
		modelMap.addAttribute("etcDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/etc/etcDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = 0;
		String equip_type = (String) paramMap.get("equip_type");
		
		if("14".equals(equip_type) || "15".equals(equip_type) || "16".equals(equip_type) || "29".equals(equip_type) || "30".equals(equip_type) || "39".equals(equip_type) || "42".equals(equip_type) || "47".equals(equip_type) || "48".equals(equip_type)) resultStr = etcService.etcEmsDetailupdate(paramMap);
		else resultStr = etcService.etcDetailupdate(paramMap);
		
		modelMap.addAttribute("etcDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/etc/etcDetaildelete", method = RequestMethod.POST, produces = "application/json")
	public void etcDetaildelete(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = 0;
		String equip_type = (String) paramMap.get("equip_type");
		
		if("14".equals(equip_type) || "15".equals(equip_type) || "16".equals(equip_type) || "29".equals(equip_type) || "30".equals(equip_type) || "39".equals(equip_type) || "42".equals(equip_type) || "47".equals(equip_type) || "48".equals(equip_type)) resultStr = etcService.etcEmsDetaildelete(paramMap);
		else resultStr = etcService.etcDetaildelete(paramMap);
		
		modelMap.addAttribute("etcDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/etc/etcIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void etcIdCheckResult(HttpServletRequest request,HttpSession session,  String etc_id, String equip_type, ModelMap modelMap) throws Exception 
	{
		
		int resultlength = 1;
		
		if("14".equals(equip_type) || "15".equals(equip_type) || "16".equals(equip_type) || "29".equals(equip_type) || "30".equals(equip_type) || "39".equals(equip_type) || "42".equals(equip_type) || "47".equals(equip_type) || "48".equals(equip_type)) resultlength = etcService.etcEmsIdCheckResult(etc_id, equip_type);
		else resultlength = etcService.etcIdCheckResult(etc_id);
		
		modelMap.addAttribute("etcIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/etc/etcAdd", method = RequestMethod.POST, produces = "application/json")
	public void etcAdd(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = 1;
		String equip_type = (String) paramMap.get("equip_type");
		
//		ArrayList<String> etcEmsTypeList = new ArrayList<String>();
//		if("14".equals(equip_type) || "15".equals(equip_type) || "16".equals(equip_type)) resultStr = etcService.etcEmsAdd(paramMap);
		List<String> etcEmsTypeList = Arrays.asList("14", "15", "16", "29", "30", "39", "42", "47", "48");
		if(etcEmsTypeList.contains(equip_type)) resultStr = etcService.etcEmsAdd(paramMap);
		else resultStr = etcService.etcAdd(paramMap);;
		
		modelMap.addAttribute("etcAddResult",resultStr);
	}
	
	@RequestMapping(value="/pss/etc/getRtfDetailData", method = RequestMethod.POST, produces = "application/json")
	public void getRtfDetailData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		
		List<Map<String,Object>> resultList = etcService.getRtfDetailData(paramMap);
		
		modelMap.addAttribute("rtfDetailData",resultList);
	}
}
