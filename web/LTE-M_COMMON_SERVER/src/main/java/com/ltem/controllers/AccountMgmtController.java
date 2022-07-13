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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * 보안 > 계정 관리
 *
 */
@Controller("AccountMgmtController")
public class AccountMgmtController {

	@Autowired
	AccountMgmtService accountMgmtService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(AccountMgmtController.class);
	
	@RequestMapping("/security/account/accountMgmt")
	public String accountMgmtPage(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "security/account/accountMgmt";
	}

	@RequestMapping(value = "/security/account/accountMgmt/list", method = RequestMethod.POST, produces = "application/json")
	public ModelMap accountMgmtList(HttpServletRequest request,HttpSession session,
									@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		List<Map<String, String>> resultList = accountMgmtService.getAccountList(paramMap);
		modelMap.addAttribute("accountList", resultList);

		return modelMap;

	}

	@RequestMapping(value = "/security/account/accountMgmt/register", method = RequestMethod.POST, produces = "application/json")
	public ModelMap accountRegister(HttpServletRequest request,HttpSession session,
								   @RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap = accountMgmtService.accountRegister(paramMap);

		modelMap.addAttribute("registerResult", resultMap);

		return modelMap;

	}

	@RequestMapping(value = "/security/account/accountMgmt/modifyCheck", method = RequestMethod.POST, produces = "application/json")
	public ModelMap accountModifyCheck(HttpServletRequest request,HttpSession session,
								  @RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap = accountMgmtService.accountModifyCheck(paramMap);

		modelMap.addAttribute("checkResult", resultMap.get("IDX"));

		return modelMap;

	}

	@RequestMapping(value = "/security/account/accountMgmt/modify", method = RequestMethod.POST, produces = "application/json")
	public ModelMap accountModify(HttpServletRequest request,HttpSession session,
								   @RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap = accountMgmtService.accountModify(paramMap);

		modelMap.addAttribute("modifyResult", resultMap);

		return modelMap;

	}

	@RequestMapping(value = "/security/account/accountMgmt/remove", method = RequestMethod.POST, produces = "application/json")
	public ModelMap accountRemove(HttpServletRequest request,HttpSession session,
								   @RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		String userId = session.getAttribute("user_id").toString();
		List<Object> ids = (ArrayList<Object>)paramMap.get("userIds");
		Boolean idCheck = true;

		for (Object id : ids) {
			id = id.toString();
			if (id.equals(userId)) {
				idCheck = false;
				break;
			}
		}

		if(idCheck) {
			Map<String, Object> resultMap = accountMgmtService.accountRemove(paramMap);
			modelMap.addAttribute("removeResult", resultMap);
		} else {
			modelMap.addAttribute("removeResult", false);
		}

		return modelMap;

	}
	
	
	@RequestMapping(value = "/security/account/accountMgmt/initPassword", method = RequestMethod.POST, produces = "application/json")
	public ModelMap initPassword(HttpServletRequest request,HttpSession session,
								   @RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {
		paramMap.put("passwordInitId", session.getAttribute("user_id").toString());
		modelMap.addAttribute("initResult", accountMgmtService.initPassword(paramMap));
		return modelMap;

	}
	
	
	@RequestMapping(value = "/security/account/accountMgmt/duplicationCheck", method = RequestMethod.POST, produces = "application/json")
	public ModelMap accountDuplicationCheck(HttpServletRequest request,HttpSession session,
								  @RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		Map<String, Object> resultMap = accountMgmtService.accountDuplicationCheck(paramMap);
		modelMap.addAttribute("duplicationResult", resultMap.get("IDX"));

		return modelMap;

	}


	//User Roll 호출 - Login 화면의 계정 신청에서도 필요하므로
	// URI를 /security가 아닌 다른 이름으로 지정
	@RequestMapping(value = "/user/roll", method = RequestMethod.POST, produces = "application/json")
	public ModelMap getUserRoll(HttpServletRequest request,HttpSession session,
								ModelMap modelMap) throws Exception {

		List<Map<String, String>> resultList = accountMgmtService.getUserRoll();
		modelMap.addAttribute("userRoll", resultList);

		return modelMap;
	}
}
