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
import com.ltem.service.AccountMgmtService;
import com.ltem.service.MenuAuthMgmtService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * 보안 > 권한 관리 > 메뉴 권한 관리
 *
 */
@Controller("MenuAuthMgmtController")
public class MenuAuthMgmtController {
	
	@Autowired
	MenuAuthMgmtService menuAuthMgmtService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(MenuAuthMgmtController.class);
	
	@RequestMapping(value = "/security/menu/authMgmt")
	public String accountMgmtPage(HttpServletRequest request,HttpSession session,
								  ModelMap modelMap) throws Exception {

		commonFunction.setModel(request, session, modelMap);

		return "security/menuAuthMgmt/menuAuthMgmt";
	}

	@RequestMapping(value = "/security/menu/authMgmt/list", method = RequestMethod.POST, produces = "application/json")
	public ModelMap menuAuthMgmtList(HttpServletRequest request,HttpSession session,
									@RequestBody HashMap<String, Object> paramMap,
									 ModelMap modelMap) throws Exception {

		List<Map<String, String>> resultList = menuAuthMgmtService.getMenuList(paramMap);
		modelMap.addAttribute("menuList", resultList);

		return modelMap;

	}

	@RequestMapping(value = "/security/menu/authMgmt/modify", method = RequestMethod.POST, produces = "application/json")
	public ModelMap modifyMenuAuth(HttpServletRequest request,HttpSession session,
								   @RequestBody HashMap<String, Object> paramMap,
								   ModelMap modelMap) throws Exception {

		Map<String, String> resultMap = menuAuthMgmtService.modifyMenuAuth(paramMap);
		modelMap.addAttribute("result", resultMap.get("RESULT"));

		return modelMap;

	}

}
