package com.ltem.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class Interceptor extends HandlerInterceptorAdapter {
	
	private static final Logger log = LoggerFactory.getLogger(Interceptor.class);
	
	@Autowired
	private CommonFunction commonFunction;
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
		
		try{
			HttpSession session = request.getSession();
			
			boolean resultCheck = uriAuthCheck(request,response,session);
			if(resultCheck){
				return true;
			}else{
				response.sendRedirect(request.getHeader("referer"));
				return false;
			}
			
		}catch(Exception e){
			log.error(e.getMessage());
		}
		
		return true;
	}
	
	
	private boolean uriAuthCheck(HttpServletRequest httpRequest,HttpServletResponse httpResponse,HttpSession session){
		
		boolean returnFlag = false;
		
		List<HashMap<String,String>> _menu_auth_list = new ArrayList<HashMap<String,String>>();
		int user_auth = 9;
		
		String requestMappingURI = httpRequest.getRequestURI().toString();
		
		String clientIp = httpRequest.getHeader ("Proxy-Client-IP" );
		if (clientIp == null) {
			clientIp = httpRequest. getHeader( "WL-Proxy-Client-IP");
			if (clientIp == null) {
				clientIp = httpRequest. getHeader( "X-Forwarded-For");
				if (clientIp == null) {
					clientIp = httpRequest. getRemoteAddr();
				}
			}
		}
		
		String user_id = (String)session.getAttribute("user_id");
		
		
		if(session.getAttribute("MENU_AUTH_LIST") != null){
        	_menu_auth_list = (List<HashMap<String,String>>)session.getAttribute("MENU_AUTH_LIST");
        	user_auth = (Integer)session.getAttribute("user_auth");
        }
		
		if (requestMappingURI.equals("/user/roll")
				|| requestMappingURI.equals("/")
				|| requestMappingURI.equals("/duTemplate")
				|| requestMappingURI.equals("/ruTemplate")
				|| requestMappingURI.equals("/login")
				|| requestMappingURI.equals("/logout")
				|| requestMappingURI.equals("/login/getnotice")
				|| requestMappingURI.equals("/login/getnoticecontents")
				|| requestMappingURI.equals("/login/process")
				|| requestMappingURI.equals("/logout")
				|| requestMappingURI.equals("/v2/login/doLogin")	// V2				
				|| requestMappingURI.equals("/v2/login/doLogout")	// V2
				|| requestMappingURI.equals("/pageError")		// IRIS Studio Error 302 URL
				|| requestMappingURI.equals("/v2/getAccessInfo")		// V2/서버 접속정보 조회
				|| requestMappingURI.equals("/v2/updateAccessInfo")		// V2/서버 접속정보 수정
				|| requestMappingURI.equals("/v2/login/updateUserPassword")	// V2/사용자 비밀번호 수정
				|| requestMappingURI.equals("/v2/getLastLoginInfo")	// V2/로그인정보 조회
				|| requestMappingURI.equals("/security/account/accountMgmt/duplicationCheck")
				|| requestMappingURI.equals("/security/account/accountMgmt/register")
				|| requestMappingURI.equals("/LTE-M")
				|| requestMappingURI.equals("/popException")
				|| requestMappingURI.equals("/getDU")
				|| requestMappingURI.equals("/getMME")
				|| requestMappingURI.equals("/getSGW")
				|| requestMappingURI.equals("/getPGW")
				|| requestMappingURI.equals("/getPCRF")
				|| requestMappingURI.equals("/getSystem")
				|| requestMappingURI.equals("/criticalAlarm")
				|| requestMappingURI.equals("/majorAlarm")
				|| requestMappingURI.equals("/minorAlarm")
				|| requestMappingURI.equals("/criticalFailureAlarm")
				|| requestMappingURI.equals("/majorFailureAlarm")
				|| requestMappingURI.equals("/minorFailureAlarm")
				|| requestMappingURI.equals("/setting/getAlarmVolume")
				|| requestMappingURI.equals("/pm/monitor/getEquipList")
				|| requestMappingURI.equals("/pm/monitor/getBasicSetting")
				|| requestMappingURI.equals("/pm/monitor/basicSettingSave")
				|| requestMappingURI.equals("/pm/monitor/getPopTrendData")
				|| requestMappingURI.equals("/pm/monitor/getPopDetailData")
				|| requestMappingURI.equals("/pm/monitor/getPopEpcTrendData")
				|| requestMappingURI.equals("/pm/monitor/getPopEpcDetailData")
				|| requestMappingURI.equals("/pm/monitor/getPopRecordTrendData")
				|| requestMappingURI.equals("/pm/monitor/getPopRecordDetailData")
				|| requestMappingURI.equals("/failureClear/history/put")
				|| requestMappingURI.equals("/failure/mapping/getStationInfo")
				|| requestMappingURI.equals("/failure/mapping/getEquipInfo")
				|| requestMappingURI.equals("/failure/popup/failureDetail/getRopMsgData")
				|| requestMappingURI.equals("/failure/popup/majorFailureDetail/getActionCaseData")
				|| requestMappingURI.equals("/failure/popup/failureDetail/getFailureData")
				|| requestMappingURI.equals("/failure/popup/getActionCase/excelExport")
				|| requestMappingURI.equals("/failure/main/failureSearch/alarmCodeSelect")
				|| requestMappingURI.equals("/failure/popup/searchSystemSelect/getEquipType")
				|| requestMappingURI.equals("/failure/popup/searchSystemSelect/getSearchSystemList")
				|| requestMappingURI.equals("/failure/setting/getEquipVendorData")
				|| requestMappingURI.equals("/failure/setting/getEquipData")
				|| requestMappingURI.equals("/failure/setting/getVendorData")
				|| requestMappingURI.equals("/ps/excelDown")
				|| requestMappingURI.equals("/pss/code/excelDown")
				|| requestMappingURI.startsWith("/websocket")
				|| requestMappingURI.startsWith("/resources/")
				|| requestMappingURI.startsWith("/html/")
				|| requestMappingURI.startsWith("/error/")
				|| requestMappingURI.equals("/system/sioefProcessManage/sioefPortList")
				|| requestMappingURI.equals("/pss/code/station/getStationLine")
				)
		{
//			log.info("예외된 URI : " + requestMappingURI);
			returnFlag = true;
		}else{
//			log.info("URI : " + requestMappingURI);
			String menu_uri;
			int menu_auth;
			
			for(HashMap<String,String> map : _menu_auth_list){
				menu_uri = map.get("MENU_URI");
				menu_auth = Integer.parseInt(map.get("MENU_AUTH"));
				
				if(requestMappingURI.startsWith(menu_uri)){
					if(user_auth <= menu_auth){
						returnFlag = true;
					}else{
						
						//부정사용 검출 log insert필요
						HashMap<String,String> paramMap = new HashMap<String,String>();
						
						paramMap.put("user_id", user_id);
						paramMap.put("access_ip", clientIp);
						paramMap.put("type", "4");
						paramMap.put("at_uri", requestMappingURI);
						paramMap.put("menu_info", map.get("MENU_NAME"));
						commonFunction.f_detectionLog_insert(paramMap);
						
						log.info("FALSE URI("+user_auth+","+menu_auth+") : " + requestMappingURI+", USER ID : "+user_id);
						returnFlag = false;
					}
					
					break;
				}
			}
		}
		return returnFlag;
	}
}
