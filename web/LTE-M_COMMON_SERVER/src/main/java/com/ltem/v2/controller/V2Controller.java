package com.ltem.v2.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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

import com.ltem.common.CommonFunction;
import com.ltem.service.LoginService;
import com.ltem.v2.common.V2Constants;
import com.ltem.v2.dto.TbCoAccessInfoDTO;
import com.ltem.v2.dto.TbSeUserDTO;
import com.ltem.v2.dto.TbSeWebLogDTO;
import com.ltem.v2.service.V2Service;
import com.ltem.v2.utils.LoginSessionManager;
import com.ltem.v2.utils.ProjectUtils;


@Controller("V2Controller")
public class V2Controller {
	private static final Logger log = LoggerFactory.getLogger(V2Controller.class);
	
	@Autowired
	V2Service v2Service;
	
	@Autowired
	LoginService loginService;
	
	@Autowired
	CommonFunction commonFunction;
	
	/**
	 * V2Login 
	 * @param req
	 * @param model
	 * @param tbSeUser
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "v2/login/doLogin", method = { RequestMethod.GET, RequestMethod.POST })
	public @ResponseBody Map<String, Object> doLogin(HttpServletRequest request, HttpServletResponse response,
													HttpSession session,
			   										Model model, @RequestBody TbSeUserDTO tbSeUser) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		try {
			
			String accessIp = StringUtils.isNotBlank(request.getHeader ("Proxy-Client-IP"))?request.getHeader ("Proxy-Client-IP"):
								StringUtils.isNotBlank(request.getHeader("WL-Proxy-Client-IP"))?request.getHeader("WL-Proxy-Client-IP"):
								StringUtils.isNotBlank(request. getHeader("X-Forwarded-For"))?request. getHeader("X-Forwarded-For"):
								request.getRemoteAddr();

			// 접근허용 IP검증
			if (!loginService.permitIpCheck(accessIp)) {
				
				wrongUseLog(tbSeUser.getUserId(), accessIp, "3");
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "접근이 불가능한 IP입니다.");
				return resultMap;
			}
			
			DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			Date today = new Date();
			
			TbSeUserDTO userById = v2Service.getUserByIdV2(tbSeUser);	// ID 존재유무 검증
			if (userById != null) {
				
				// 사용기간 검증 (USE_PERIOD)
				log.debug(">>> user period yn : " + userById.getUsePeriodYn());
				if ("N".equalsIgnoreCase(userById.getUsePeriodYn())) {
					resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
					resultMap.put(V2Constants.RESULT_MSG, "사용기간이 만료되었습니다.");
					return resultMap;					
				}
				
				
				// 비밀번호 오류횟수 검증
				log.debug(">>> password error cnt : " + userById.getPasswordErrCnt());
				if (5 <= userById.getPasswordErrCnt()) {
					resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
					resultMap.put(V2Constants.RESULT_MSG, "비밀번호 오류횟수를 초과하였습니다.<br />비밀번호 초기화 신청 후 재 접속하세요.");
					return resultMap;
				}				
				
				// 미 로그인 일자 검증 (3개월 경과 여부) ------------[s]
				Calendar accessCal = Calendar.getInstance();
				accessCal.setTime(today);
				accessCal.add(Calendar.MONTH, -3);
				log.debug(">>> check date : " + dateFormat.format(today));
				log.debug(">>> last login date : " + dateFormat.format(userById.getLoginTime()));
				
				if (accessCal.getTime().after(userById.getLoginTime())) {
					session.setAttribute(session.getId(), userById.getUserId());
					session.setAttribute("passwordProcess", true);
					session.setAttribute("temp_user_id", userById.getUserId());
					
					resultMap.put(V2Constants.RESULT_CODE, V2Constants.NOT_ACCESS);
					resultMap.put(V2Constants.RESULT_MSG, "장기 미접속으로 인하여 사용 만료 되었습니다.");
					return resultMap;
				} 						
				// 미 로그인 일자 검증 (3개월 경과 여부) ------------[e]
				
				TbSeUserDTO user = v2Service.getUserByLoginV2(tbSeUser);	// 비밀번호 검증
				if (user != null) {
					
					if (user.getUseFlag() == 1) {
						
						// 비밀번호 초기화 여부 검증 ------------[s]
						log.debug(">>> password init : " + user.getPasswordInitYn());
						if ("Y".equalsIgnoreCase(user.getPasswordInitYn())) {
							
							session.setAttribute(session.getId(), user.getUserId());
							session.setAttribute("passwordProcess", true);
							session.setAttribute("temp_user_id", user.getUserId());
							
							resultMap.put(V2Constants.RESULT_CODE, V2Constants.INIT);
							resultMap.put(V2Constants.RESULT_MSG, "비밀번호가 초기화 되었습니다. <br />비밀번호 설정 후 재 접속하세요");
							return resultMap;
						} 
						// 비밀번호 초기화 여부 검증 ------------[e]
						
						// 비밀번호 변경일자 검증 (3개월 경과 여부) ------------[s]
						Calendar cal = Calendar.getInstance();
						cal.setTime(today);
						cal.add(Calendar.MONTH, -3);
						log.debug(">>> check date : " + dateFormat.format(today));
						log.debug(">>> password update date : " + dateFormat.format(user.getPasswordUpdateTIme()));
						
						if (cal.getTime().after(user.getPasswordUpdateTIme())) {
							session.setAttribute(session.getId(), user.getUserId());
							session.setAttribute("passwordProcess", true);
							session.setAttribute("temp_user_id", user.getUserId());
							
							resultMap.put(V2Constants.RESULT_CODE, V2Constants.EXPIRE);
							resultMap.put(V2Constants.RESULT_MSG, "비밀번호가 만료 되었습니다. <br />비밀번호 설정 후 재 접속하세요");
							return resultMap;
						} 						
						// 비밀번호 변경일자 검증 ------------[e]
						
						if (user.getAuth() == 0) {
							resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
							resultMap.put(V2Constants.RESULT_MSG, "등급 할당이 되지 않았습니다.");
							return resultMap;
						}
						
						//-------- 중복 로그인 체크
						LoginSessionManager sessionManager = LoginSessionManager.getInstances();
						sessionManager.printSessions();
						if (sessionManager.isUsing(user.getUserId())) {
							
							if ("Y".equalsIgnoreCase(tbSeUser.getAccessDupleLogin())) {
								sessionManager.removeSession(user.getUserId());	// loginId의 기존 세션을 삭제한다.
								sessionManager.setSession(session, user.getUserId());	
							} else {
								resultMap.put(V2Constants.RESULT_CODE, V2Constants.DUP_ACCESS);
								resultMap.put(V2Constants.RESULT_MSG, "중복 로그인 입니다.");	
								return resultMap;
							}
							
						} else {
							sessionManager.setSession(session, user.getUserId());
						}
						sessionManager.printSessions();
						
						//----------- LOGIN SUCCESS PROCESS ---------------//
						session.setAttribute("passwordProcess", false);
						session.setAttribute("temp_user_id", StringUtils.EMPTY);
						
						session.setAttribute(session.getId(), user.getUserId());
						session.setAttribute("user_id", user.getUserId());
						session.setAttribute("team_id", user.getTeamId());
						session.setAttribute("user_ip", accessIp);
						session.setAttribute("user_auth", user.getAuth());
						session.setAttribute("menu_list", loginService.getMenuList(user.getUserId()));
						session.setAttribute("MENU_AUTH_LIST", commonFunction.getMenuAuthList());
						
						// session timeout 설정 : 30분
						session.setMaxInactiveInterval(30 * 60);	// 초

						// 로그인 성공 시 비밀번호 오류횟수 초기화
						v2Service.updateInitPasswordErrCnt(tbSeUser);
						this.insertWebLog(tbSeUser.getUserId(), tbSeUser.getTeamId(), accessIp);
						
						resultMap.put(V2Constants.RESULT_CODE, V2Constants.SUCCESS);
						resultMap.put(V2Constants.RESULT_MSG, user.getUserId());					
						
						// 공지사항 POPUP 여부
						resultMap.put("notice",  v2Service.getMainNotice());
						
						
					} else {
						resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
						resultMap.put(V2Constants.RESULT_MSG, "승인 대기 중인 계정입니다.");
					}
					
				} else {
					
					// 비밀번호 오류횟수 증가
					v2Service.updatePasswordErrCnt(tbSeUser);
					wrongUseLog(tbSeUser.getUserId(), accessIp, "1");
					
					resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
					resultMap.put(V2Constants.RESULT_MSG, "아이디 또는 비밀번호를 잘못 입력하셨습니다.");
				}
				
			} else {
				
				wrongUseLog(tbSeUser.getUserId(), accessIp, "2");
				
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "아이디 또는 비밀번호를 잘못 입력하셨습니다.");
			}
			
			
		} catch (Exception e) {
			log.error(">>> doLogin Exception : " + e.getMessage());
			resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
			//resultMap.put(V2Constants.RESULT_MSG, e.getMessage());
			resultMap.put(V2Constants.RESULT_MSG, "로그인 중 오류가 발생하였습니다.");
		}
		
		return resultMap;
	}
	
	/**
	 * 부정사용 이력 저장
	 * @param id
	 * @param ip
	 * @param type
	 */
	private void wrongUseLog(String id, String ip, String type) {
		try {
			HashMap<String,String> insertMap = new HashMap<String,String>();
			insertMap.put("at_id", id);
			insertMap.put("access_ip", ip);
			insertMap.put("type", type);
			commonFunction.f_detectionLog_insert(insertMap);			
		} catch (Exception e) {
			log.error(">>> wrongUseLog exception : " + e.getMessage());
		}

	}
	
	/**
	 * 웹로그 : 로그인
	 * @param id
	 * @param teamId
	 * @param accessIp
	 */
	private void insertWebLog(String id, int teamId, String accessIp) {
		
		try {
			HashMap<String,Object> paramMap = new HashMap<String,Object>();
			
			Calendar calendar = Calendar.getInstance();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
			String nowdate = dateFormat.format(calendar.getTime());
	
			paramMap.put("USER_ID", id);
	//		paramMap.put("LOGIN_ID", resultData.get(0).get("USER_ID"));
			paramMap.put("MENU_NM", "로그인");
			paramMap.put("MENU_ID", "LOGIN");
			paramMap.put("TEAM_ID", teamId);
			paramMap.put("USER_IP", accessIp);
			paramMap.put("DATE", nowdate);
			paramMap.put("LOGIN_FLAG", "Y");
			paramMap.put("LOGOUT_FLAG", "N");
		
			loginService.upDateLoginTime(paramMap);
			commonFunction.insertWebLog(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	
	/**
	 * V2 사용자 비밀번호 변경 
	 * @param req
	 * @param model
	 * @param tbSeUser
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "v2/login/updateUserPassword", method = { RequestMethod.GET, RequestMethod.POST })
	public @ResponseBody Map<String, Object> updateUserPassword
													(HttpServletRequest request, HttpServletResponse response,
													HttpSession session,
			   										Model model, @RequestBody TbSeUserDTO tbSeUser) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		try {
			
			/*
			 * String regPassword =
			 * "/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{9,}$/";
			 * Pattern pattern1 = Pattern.compile(regPassword);
			 */
			tbSeUser.setUserId((String) session.getAttribute("temp_user_id"));
			if (StringUtils.isBlank(tbSeUser.getUserId())) {
				tbSeUser.setUserId((String) session.getAttribute("user_id"));	
			}
			
			TbSeUserDTO user = v2Service.getUserByIdV2(tbSeUser); 
			if (user == null) {
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "사용자 정보 조회 오류.");
				
			} else if (StringUtils.isBlank(tbSeUser.getUserPassword()) || StringUtils.isBlank(tbSeUser.getUserPasswordConfirm())) {
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "비밀번호가 일치하지 않습니다.");
				
			} else if (!tbSeUser.getUserPassword().equals(tbSeUser.getUserPasswordConfirm())) {
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "비밀번호가 일치하지 않습니다.");
				
				/*
				 * 클라이언트에서 암호화 문자열을 전달하므로 복호화 및 규칙 검증 불가함.
				 * 평문이 입력되어도, 로그인 시 비밀번호 매칭이 되지 않으므로 SKIP한다.
				 * 
				 * } else if (!pattern1.matcher(tbSeUser.getUserPassword()).find()) {
				 * resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				 * resultMap.put(V2Constants.RESULT_MSG, "9자 이상, 문자/숫자/특수문자를 포함하여 등록하세요.");
				 */

			} else if (v2Service.getUserPasswordUpdateHistoryCount(tbSeUser) > 0) {
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "이전 사용한 비밀번호는 사용할 수 없습니다.");

			} else if (user.getUserPassword().equals(tbSeUser.getUserPassword()) ) {
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "동일한 비밀번호는 사용할 수 없습니다.");
				
			} else {

				/**
				 * passwordPageDiv
				 * update : 비밀번호 변경
				 * init : 비밀번호 초기화 > 비밀번호 변경
				 * expire : 비밀번호 만기 > 비밀번호 변경
				 **/
				user.setPasswordPageDiv(tbSeUser.getPasswordPageDiv());	
				v2Service.updateUserPassword(user, tbSeUser.getUserPassword()); 
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.SUCCESS);
				resultMap.put(V2Constants.RESULT_MSG, "비밀번호가 변경되었습니다.");					
			}
			
			
		} catch (Exception e) {
			log.error(">>> updateUserPassword exception : " + e.getMessage());
			resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
			resultMap.put(V2Constants.RESULT_MSG, "오류가 발생하였습니다.");
//			resultMap.put(V2Constants.RESULT_MSG, e.getMessage());
			
			
		}
		
		return resultMap;
	}
	
	
	@RequestMapping(value = "v2/getLastLoginInfo", method = { RequestMethod.GET, RequestMethod.POST })
	public @ResponseBody Map<String, Object> getLastLoginInfo(
													HttpServletRequest request, HttpServletResponse response,
													HttpSession session,
			   										Model model) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			TbSeWebLogDTO seWebLog = new TbSeWebLogDTO();
			seWebLog.setUserId((String) session.getAttribute("user_id"));
			seWebLog.setMenuId(V2Constants.WEBLOG_LOGIN);
			
			resultMap.put(V2Constants.RESULT_CODE, V2Constants.SUCCESS);
			resultMap.put(V2Constants.RESULT_MSG, v2Service.getLastLoginInfo(seWebLog));
			
		} catch (Exception e) {
			log.error(">>> exception : " + e.getMessage());
			resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
			resultMap.put(V2Constants.RESULT_MSG, "로그인 중 오류가 발생하였습니다.");
//			resultMap.put(V2Constants.RESULT_MSG, e.getMessage());
		} 
		return resultMap;
	}


	@RequestMapping("/v2/accessInfoMgnt")
	public String accessInfoMgnt(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return  ProjectUtils.v2Prefix()+ "/access/accessMgmt";
	}
	
	@RequestMapping("/v2/getAccessInfo")
	public @ResponseBody Map<String, Object> getAccessInfo(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(V2Constants.RESULT_CODE, V2Constants.SUCCESS);
		resultMap.put(V2Constants.RESULT_MSG, v2Service.getAccessInfo());
		return  resultMap;
	}
	
	/**
	 * javascript AES encrypt To JAVA decrypt
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @param model
	 * @param accessInfo
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "v2/updateAccessInfo", method = { RequestMethod.GET, RequestMethod.POST })
	public @ResponseBody Map<String, Object> updateAccessInfo(
													HttpServletRequest request, HttpServletResponse response,
													HttpSession session,
			   										Model model, @RequestBody TbCoAccessInfoDTO accessInfo) throws Exception {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		Process process = null;
		try {

			/**
			 * 서버 복호화 오류 처리
			 * 서버 패치 작업 시 (포항) jar 교체 필요
			 * 1. Illegal key size
			 *    > solution : /home/ltenms/usr/local/jdk1.7.0_04/jre/lib/security
			 *    > 하위의 local_policy.jar, US_export_policy.jar을 1.7 기준으로 교체
			 *    > com.ltem.v2.utils 하위에 원본 보관
			 */
			log.debug("\n\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			log.debug(">>> id : " + accessInfo.getAccessId());
			log.debug(">>> password : " + accessInfo.getAccessPwd());
			log.debug(">>> equipType : " + accessInfo.getEquipType());
			log.debug(">>> equipId : " + accessInfo.getEquipId());
			
			String id = ProjectUtils.javascriptToJavaDecrypt(accessInfo.getAccessId(), accessInfo.getEquipId());
			String password = ProjectUtils.javascriptToJavaDecrypt(accessInfo.getAccessPwd(), accessInfo.getEquipId());
			log.debug(">>> set id : " + id);
			log.debug(">>> set password : " + password);
			
			if (StringUtils.isBlank(id) || StringUtils.isBlank(password)) {
				resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
				resultMap.put(V2Constants.RESULT_MSG, "복호화 오류 발생");
			} else {
				
				String[] command = {
						"/bin/sh",
						"-c",
						"accessInfoChange.sh " + accessInfo.getEquipType() + " " + accessInfo.getEquipId() + " " + id + " " + password
						};
							
				String homeDirectory = System.getProperty("user.home");
				log.debug(">>> HOME DIRECTORY : " + homeDirectory);
				log.debug(">>> COMMAND : " + Arrays.toString(command));
				
				ProcessBuilder builder = new ProcessBuilder(command);
				builder.directory(new File(homeDirectory));
				
				process = builder.start();
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
				
				String line;
	            while ((line = reader.readLine()) != null) {
	            	log.debug(line);
	            }

	            int exitCode = process.waitFor();
	            log.debug("\nExited code : " + exitCode);
	            log.debug(">>> line : " + line);
	            
	            if (exitCode != 0) {
	            	resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
					resultMap.put(V2Constants.RESULT_MSG, "Process exit code : " + exitCode);
	            } else {
	            	v2Service.updateAccessInfo(accessInfo);
	            	
	            	resultMap.put(V2Constants.RESULT_CODE, V2Constants.SUCCESS);
					resultMap.put(V2Constants.RESULT_MSG, "수정되었습니다.");
	            }
			}
			
		} catch (Exception e) {
			log.error(">>> exception : " + e.getMessage());
			resultMap.put(V2Constants.RESULT_CODE, V2Constants.FAIL);
			resultMap.put(V2Constants.RESULT_MSG, "정보 변경 중 오류가 발생하였습니다.");
//			resultMap.put(V2Constants.RESULT_MSG, e.getMessage());
		} finally {
			if(process != null) {
				try { 
					process.destroy();
				} catch(Exception e2) {
				}
			}
		}
		return resultMap;
	}

}
