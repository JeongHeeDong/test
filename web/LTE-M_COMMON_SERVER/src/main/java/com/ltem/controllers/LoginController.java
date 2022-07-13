package com.ltem.controllers;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.ltem.common.CommonFunction;
import com.ltem.service.IrisSsoService;
import com.ltem.service.LoginService;
import com.ltem.v2.dto.TbSeUserDTO;
import com.ltem.v2.service.V2Service;
import com.ltem.v2.utils.ProjectUtils;

/**
 * 로그인
 *
 */
@Controller("LoginController")
public class LoginController {
	private static final Logger log = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	V2Service v2Service;
	
	@Autowired
	LoginService loginService;
	
	@Autowired
	IrisSsoService irisSsoService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	/**
	 * 보고서 오류 발생 시 LTEM 페이지 강제 이동 경로 설정
	 * http://192.168.102.195:18080/iris-studio-service -> 302
	 * http://192.168.102.195:8080/pageError
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/pageError")
	public String irisPageError(HttpServletRequest request, HttpServletResponse response) {
		log.error(">>> IRIS Studio PageError");
		return "redirect:/logout";
	}
	
	@RequestMapping("/")
	public String main(HttpServletRequest request, HttpSession session) {
		String key_id = session.getId();
		String userId = (String) session.getAttribute("user_id");
		
		if(StringUtils.isNotBlank(key_id) && StringUtils.isNotBlank(userId)){
			String id = (String)session.getAttribute(key_id);
			if(id != null){
//				return "redirect:/integration/monitor/network";
				return "redirect:/LTE-M";
			}
		}
		return "redirect:/login";
	}
	
	@RequestMapping("/login")
	public String login(HttpServletRequest request,HttpSession session) throws Exception {
		String key_id = session.getId();
		String userId = (String) session.getAttribute("user_id");
		
		if(StringUtils.isNotBlank(key_id) && StringUtils.isNotBlank(userId)){
			String id = (String)session.getAttribute(key_id);
			if(id != null){
//				return "redirect:/integration/monitor/network";
				return "redirect:/LTE-M";
			}
		}
		
		// 로그인 페이지 신규로 전환 : 2022.06.28
		return  ProjectUtils.v2Prefix()+ "/login/login";
	}

	@RequestMapping("/login/getnotice")
	public void getNotice(HttpServletRequest request,HttpSession session, ModelMap modelMap) throws Exception {
		List<Map<String, Object>> resultList = loginService.getNotice();
		modelMap.addAttribute("noticeList",resultList);
	}

	@RequestMapping(value = "/login/getnoticecontents", method = RequestMethod.POST)
	public void getNoticeContents(HttpServletRequest request,HttpSession session,
								  @RequestBody HashMap<String, String> paramMap, ModelMap modelMap) throws Exception {
		Map<String, Object> resultMap = loginService.getNoticeContents(paramMap);
		modelMap.addAttribute("noticeContent",resultMap);
	}
	
	@RequestMapping(value = "/login/process", method = RequestMethod.POST )
	public String loginProcess(HttpServletRequest request,
							   HttpServletResponse response,
							   HttpSession session,
							   RedirectAttributes redirectAttributes)throws Exception {
		
		String id = URLDecoder.decode(request.getParameter("encodedUserID"), "UTF-8");
		String pw = URLDecoder.decode(request.getParameter("encodedUserPW"), "UTF-8");

		HashMap<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("ID", id);
		paramMap.put("PW", pw);
		
		String clientIp = request .getHeader ("Proxy-Client-IP" );

		if (clientIp == null) {
			clientIp = request. getHeader( "WL-Proxy-Client-IP");
			if (clientIp == null) {
				clientIp = request. getHeader( "X-Forwarded-For");
				if (clientIp == null) {
					clientIp = request. getRemoteAddr();
				}
			}
		}
		
		//허용아이피 비교 체크
		if(!permitIpCheck(clientIp)){
			redirectAttributes.addFlashAttribute("message", "접근이 불가능한 IP입니다.");
			
			//부정사용 검출 log insert필요
			HashMap<String,String> insertMap = new HashMap<String,String>();
			
			insertMap.put("at_id", id);
			insertMap.put("access_ip", clientIp);
			insertMap.put("type", "3");
			commonFunction.f_detectionLog_insert(insertMap);
			
			return "redirect:/login";
		}
		
		//로그인 테이블 비교 체크
		List<Map<String,Object>> resultData = new ArrayList<Map<String,Object>>();
		resultData = loginService.getloginCheck(paramMap);
		
		if(resultData.size() > 0){

			if( "1".equals(resultData.get(0).get("USE_FLAG").toString()) ) {
				String userId = (String)resultData.get(0).get("USER_ID");
				String menuList = loginService.getMenuList(userId);
				String key_id = session.getId();
				session.setAttribute(key_id, userId);

				Calendar calendar = Calendar.getInstance();
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
				String nowdate = dateFormat.format(calendar.getTime());

				paramMap = new HashMap<String,Object>();

				paramMap.put("USER_ID", (String)resultData.get(0).get("USER_ID"));
//				paramMap.put("LOGIN_ID", resultData.get(0).get("USER_ID"));
				paramMap.put("MENU_NM", "로그인");
				paramMap.put("MENU_ID", "LOGIN");
//				paramMap.put("TEAM_NM", resultData.get(0).get("TEAM_NAME"));
				paramMap.put("TEAM_ID", (Integer)resultData.get(0).get("TEAM_ID"));
				paramMap.put("USER_IP", clientIp);
				paramMap.put("DATE", nowdate);
				paramMap.put("LOGIN_FLAG", "Y");
				paramMap.put("LOGOUT_FLAG", "N");

				loginService.upDateLoginTime(paramMap);
				try {
					commonFunction.insertWebLog(paramMap);
				} catch (Exception e) {
					log.error(e.getMessage());
				}

				System.out.println(session.getMaxInactiveInterval());
				System.out.println(request.getSession());
				session.setAttribute("user_id", resultData.get(0).get("USER_ID"));
				session.setAttribute("team_id", resultData.get(0).get("TEAM_ID"));
				session.setAttribute("team_nm", resultData.get(0).get("TEAM_NAME"));
				session.setAttribute("user_ip", clientIp);
				session.setAttribute("menu_list", menuList);
				
				//관리자에게만 보여줄 콤포넌트를 위해 AUTH 를 세션에 올림
				session.setAttribute("user_auth", (Integer)resultData.get(0).get("AUTH"));
				
				//Controller 타기전 메뉴 권한을 이용한 부정사용자 접근 처리를 위한 정보
				session.setAttribute("MENU_AUTH_LIST", commonFunction.getMenuAuthList());
				
				//irisSso.createCookie(response);
				
//				return "redirect:/integration/monitor/network";
				return "redirect:/LTE-M";

			} else {
				redirectAttributes.addFlashAttribute("message", "승인 대기 중인 계정입니다.");
				return "redirect:/login";
			}

		} else {
			
			redirectAttributes.addFlashAttribute("message", "아이디 또는 비밀번호를 잘못 입력하셨습니다.");
			HashMap<String,String> insertMap = new HashMap<String,String>();
			
			if(loginService.getloginIDCheck(paramMap) <= 0){
				insertMap.put("at_id", id);
				insertMap.put("access_ip", clientIp);
				insertMap.put("type", "2");
			}else{
				insertMap.put("at_id", id);
				insertMap.put("access_ip", clientIp);
				insertMap.put("type", "1");
			}
			
			//부정사용 검출 log insert
			commonFunction.f_detectionLog_insert(insertMap);
			
			return "redirect:/login";
		}
	}

	@RequestMapping("/logout")
	public String logout(HttpSession session, HttpServletResponse response) {
		irisSsoService.removeCookie(response, "x-access-token");
		irisSsoService.removeCookie(response, "iris-session-id");
		
		session.invalidate();
		return "redirect:/login";
	}

	@RequestMapping("/LTE-M")
	public String initPage(HttpServletRequest request,HttpSession session, ModelMap modelMap) throws Exception {
		return "LTE-M";
	}
	
	@RequestMapping("/popException")
	public String popException(HttpServletRequest request,HttpSession session) throws Exception {
		return "common/popException";
	}
	
	private boolean permitIpCheck(String user_ip){
		boolean returnFlag = false;
		returnFlag = loginService.permitIpCheck(user_ip);
		
		return returnFlag;
	}
	
}
