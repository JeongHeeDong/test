package com.ltem.controllers;

import java.text.SimpleDateFormat;
import java.util.Calendar;
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
import com.ltem.service.PermitIpService;

/**
 * 보안 > 권한 관리 > 허용 아이피 관리(팝업)
 *
 */
@Controller("PermitIpController")
public class PermitIpController {
	private static final Logger log = LoggerFactory.getLogger(PermitIpController.class);

	@Autowired
	PermitIpService permitIpService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/security/permit/Ip")
	public String sysDBManager(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
	
		return "security/permitIp/permit_Ip";
	}
	
	@RequestMapping(value="/security/permit/Ip/getParmitIpList", method = RequestMethod.POST, produces = "application/json")
	public void getParmitIpList(HttpServletRequest request,HttpSession session, ModelMap modelMap) throws Exception 
	{
		
		List<Map<String,Object>> resultList = permitIpService.getParmitIpList();
		
		modelMap.addAttribute("getParmitIpList",resultList);
	}
	
	@RequestMapping(value="/security/permit/Ip/saveIp", method = RequestMethod.POST, produces = "application/json")
	public void saveIp(HttpSession session,@RequestBody HashMap<String,String> paramMap, ModelMap modelMap) throws Exception {
			
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String modify_date = dateFormat.format(calendar.getTime());
		
		paramMap.put("event_time", modify_date);
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		int flag = permitIpService.saveIp(paramMap);	
		
		modelMap.addAttribute("flag", flag);
	}
	
	@RequestMapping(value="/security/permit/Ip/ipDel", method = RequestMethod.POST, produces = "application/json")
	public void ipDel(HttpSession session,@RequestBody List<HashMap<String,String>> paramList, ModelMap modelMap) throws Exception {
			
		int flag = permitIpService.ipDel(paramList);	
		
		modelMap.addAttribute("flag", flag);
	}
	
}