package com.ltem.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ltem.common.CommonFunction;
import com.ltem.service.SwitchService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 구성관리 > 스위치 관리
 * 구성관리 > 스위치 관리 > 스위치 상태 확인
 * 구성관리 > 스위치 관리 > 스위치 연결 관리
 *
 */
@Controller("SwitchController")
public class SwitchController {
	
	@Autowired
	SwitchService switchService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(SwitchController.class);
	
	@RequestMapping("/pss/management/switch")
	public String switch_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		commonFunction.setModel(request,session,modelMap);
		modelMap.addAttribute("categoryList", switchService.getCategoryList());
		return "pss/switch/switchSearch";
	}

	@RequestMapping(value="/pss/management/switch/getSearchOption", method = RequestMethod.POST, produces = "application/json")
	public void getSwitchList(HttpServletRequest request,HttpSession session ,ModelMap modelMap) throws Exception {
		Map<String, List<Map<String, String>>> resultMap = switchService.getSearchOption();
//		List<Map<String, Object>> switchList = switchService.getSwitchList();
		modelMap.addAttribute("searchOption",resultMap);
	}

	@RequestMapping(value="/pss/management/switch/getSwitchDetail", method = RequestMethod.POST, produces = "application/json")
	public void getSwitchDetail(HttpServletRequest request,HttpSession session,
								@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception {
		List<Object> resultList = switchService.getSwitchDetail(paramMap);
		modelMap.addAttribute("switchData",resultList);
	}
	
	@RequestMapping(value="/pss/management/switch/switchModify", method = RequestMethod.POST, produces = "application/json")
	public void switchUpdate(HttpServletRequest request,HttpSession session,
							 @RequestBody List<HashMap<String,Object>> paramList,ModelMap modelMap) throws Exception {
		int resultStr = switchService.switchModify(paramList);
		modelMap.addAttribute("switchModifyResult",resultStr);
	}
	
	/*
	 *스위치 연결 관리
	*/
	@RequestMapping("/pss/management/switchDesc")
	public String switchDesc_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		commonFunction.setModel(request,session,modelMap);
		modelMap.addAttribute("categoryList", switchService.getCategoryList());
		return "pss/switch/switchDesc";
	}
	
	@RequestMapping(value="/pss/management/switch/getSwitchDescDetail", method = RequestMethod.POST, produces = "application/json")
	public void getSwitchDescDetail(HttpServletRequest request,HttpSession session,
								@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception {
		List<Object> resultList = switchService.getSwitchDescDetail(paramMap);
		modelMap.addAttribute("switchData",resultList);
	}
	
	@RequestMapping(value="/pss/management/switch/switchDescSave", method = RequestMethod.POST, produces = "application/json")
	public void switchDescSave(HttpServletRequest request,HttpSession session,
							 @RequestBody List<String> paramList,ModelMap modelMap) throws Exception {
		int result = switchService.switchDescSave(paramList);
		modelMap.addAttribute("switchDescSaveResult",result);
	}
}
