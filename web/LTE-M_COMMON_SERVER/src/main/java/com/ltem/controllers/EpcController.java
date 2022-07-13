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
import com.ltem.service.EpcService;
import com.ltem.service.HssService;
import com.ltem.service.MmeService;
import com.ltem.service.PcrfService;
import com.ltem.service.PgwService;


/**
 * 구성관리 > 주제어장치 관리
 *
 */
@Controller("EpcController")
public class EpcController {
	
	@Autowired
	EpcService epcService;
	@Autowired
	MmeService mmeService;
	@Autowired
	PgwService pgwService;
	@Autowired
	HssService hssService;
	@Autowired
	PcrfService pcrfService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(EpcController.class);
	
	@RequestMapping("/pss/epc")
	public String epc_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pss/epc/epcSearch";
	}
	
	@RequestMapping(value="/pss/epc/getEpcSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getEpcSearchOption(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String, List<Map<String, String>>> resultMap = epcService.getEpcSearchOption();
		
		modelMap.addAttribute("epcSearchOption",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/getEpcSearch", method = RequestMethod.POST, produces = "application/json")
	public void getMmeSearch(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,Object>> resultList = epcService.getEpcSearch(paramMap);
		
		modelMap.addAttribute("epcSearchData",resultList);
	}
	
	@RequestMapping(value="/pss/epc/getMmeDetail", method = RequestMethod.POST, produces = "application/json")
	public void getMmeDetail(HttpServletRequest request,HttpSession session,  String mme_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = mmeService.getMmeDetail(mme_id);
		
		modelMap.addAttribute("mmeDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/mmeDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = mmeService.mmeDetailupdate(paramMap);
		
		modelMap.addAttribute("mmeDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/mmeDetaildelete", method = RequestMethod.POST, produces = "application/json")
	public void mmeDetaildelete(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = mmeService.mmeDetaildelete(paramMap);
		
		modelMap.addAttribute("mmeDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/epcIdCheck", method = RequestMethod.POST, produces = "application/json")
	public void epcIdCheckResult(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception 
	{
		String epc_id = (String)paramMap.get("epc_id");
		String type = (String)paramMap.get("type");
		int resultlength = 0;
		
		if("MME".equals(type)) resultlength = mmeService.mmeIdCheckResult(epc_id);
		else if("GW".equals(type)) resultlength = pgwService.pgwIdCheckResult(epc_id);
		else if("HSS".equals(type)) resultlength = hssService.hssIdCheckResult(epc_id);
		else resultlength = pcrfService.pcrfIdCheckResult(epc_id);
		
		modelMap.addAttribute("epcIdCheckResult",resultlength);
	}
	
	@RequestMapping(value="/pss/epc/epcAdd", method = RequestMethod.POST, produces = "application/json")
	public void mmeAdd(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		int resultStr = 0;
		String type = (String)paramMap.get("type");
		
		if("MME".equals(type)) resultStr = mmeService.mmeAdd(paramMap);
		else if("GW".equals(type)) resultStr = pgwService.pgwAdd(paramMap);
		else if("HSS".equals(type)) resultStr = hssService.hssAdd(paramMap);
		else resultStr = pcrfService.pcrfAdd(paramMap);
		
		modelMap.addAttribute("epcAddResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/getPgwDetail", method = RequestMethod.POST, produces = "application/json")
	public void getPgwDetail(HttpServletRequest request,HttpSession session,  String pgw_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = pgwService.getPgwDetail(pgw_id);
		
		modelMap.addAttribute("pgwDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/pgwDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void pgwDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = pgwService.pgwDetailupdate(paramMap);
		
		modelMap.addAttribute("pgwDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/pgwDetaildelete", method = RequestMethod.POST, produces = "application/json")
	public void pgwDetaildelete(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = pgwService.pgwDetaildelete(paramMap);
		
		modelMap.addAttribute("pgwDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/getHssDetail", method = RequestMethod.POST, produces = "application/json")
	public void getHssDetail(HttpServletRequest request,HttpSession session,  String hss_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = hssService.getHssDetail(hss_id);
		
		modelMap.addAttribute("hssDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/hssDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void hssDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = hssService.hssDetailupdate(paramMap);
		
		modelMap.addAttribute("hssDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/getPcrfDetail", method = RequestMethod.POST, produces = "application/json")
	public void getPcrfDetail(HttpServletRequest request,HttpSession session,  String pcrf_id,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultMap = pcrfService.getPcrfDetail(pcrf_id);
		
		modelMap.addAttribute("pcrfDetailData",resultMap);
	}
	
	@RequestMapping(value="/pss/epc/pcrfDetailupdate", method = RequestMethod.POST, produces = "application/json")
	public void pcrfDetailupdate(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = pcrfService.pcrfDetailupdate(paramMap);
		
		modelMap.addAttribute("pcrfDetailResult",resultStr);
	}
	
	@RequestMapping(value="/pss/epc/pcrfDetaildelete", method = RequestMethod.POST, produces = "application/json")
	public void pcrfDetaildelete(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("update_user_id", (String)session.getAttribute("user_id"));
		
		int resultStr = pcrfService.pcrfDetaildelete(paramMap);
		
		modelMap.addAttribute("pcrfDetailResult",resultStr);
	}
}
