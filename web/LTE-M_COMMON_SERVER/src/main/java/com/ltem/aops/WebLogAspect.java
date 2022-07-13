package com.ltem.aops;

import org.aspectj.lang.JoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Created by sungnam on 2016-01-05.
 */
//@Aspect	
public class WebLogAspect {

    private static final Logger log = LoggerFactory.getLogger(WebLogAspect.class);
    public static final String RESPONSE_NAME_AT_ATTRIBUTES = ServletRequestAttributes.class.getName() + ".ATTRIBUTE_NAME";


    /**
     * Control에 있는 메소드를 AOP한다.
     *
     * @param joinPoint Proxy Method Info
     * @return
     * @throws Throwable
     */
    // * 만약 com.yk안에 여러개의 패키지가 있을 경우 || 으로 처리한다. (com.yk.*.*.*.*)
//    @Before("execution(* com.ltem.controllers.*Controller.*(..))")
    public void uriCheck(JoinPoint joinPoint) {
    	
//        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
//        
//        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
//        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) requestAttributes;
//        HttpServletResponse response =  (HttpServletResponse) servletRequestAttributes.getAttribute(RESPONSE_NAME_AT_ATTRIBUTES, RequestAttributes.SCOPE_REQUEST);
//        
//        try {
//			response.sendRedirect("/popException");
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//        
//        HttpSession session = request.getSession();
//        String requestMappingURI = request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE).toString();
//        List<HashMap<String,String>> _menu_auth_list;
//        String clientIp = request .getHeader ("Proxy-Client-IP" );
//
//		if (clientIp == null) {
//			clientIp = request. getHeader( "WL-Proxy-Client-IP");
//			if (clientIp == null) {
//				clientIp = request. getHeader( "X-Forwarded-For");
//				if (clientIp == null) {
//					clientIp = request. getRemoteAddr();
//				}
//			}
//		}
//        
//        if(session.getAttribute("MENU_AUTH_LIST") != null){
//        	_menu_auth_list = (List<HashMap<String,String>>)session.getAttribute("MENU_AUTH_LIST");
//        }
//        
//		if (requestMappingURI.equals("/user/roll")
//				|| requestMappingURI.equals("/duTemplate")
//				|| requestMappingURI.equals("/ruTemplate")
//				|| requestMappingURI.equals("/login")
//				|| requestMappingURI.equals("/logout")
//				|| requestMappingURI.equals("/login/getnotice")
//				|| requestMappingURI.equals("/login/getnoticecontents")
//				|| requestMappingURI.equals("/login/process")
//				|| requestMappingURI.equals("/logout")
//				|| requestMappingURI.equals("/LTE-M")
//				|| requestMappingURI.equals("/popException")
//				|| requestMappingURI.equals("/getDU")
//				|| requestMappingURI.equals("/getMME")
//				|| requestMappingURI.equals("/getSGW")
//				|| requestMappingURI.equals("/getPGW")
//				|| requestMappingURI.equals("/getPCRF")
//				|| requestMappingURI.equals("/criticalAlarm")
//				|| requestMappingURI.equals("/majorAlarm")
//				|| requestMappingURI.equals("/minorAlarm")
//				|| requestMappingURI.equals("/criticalFailureAlarm")
//				|| requestMappingURI.equals("/majorFailureAlarm")
//				|| requestMappingURI.equals("/minorFailureAlarm")
//				|| requestMappingURI.equals("/setting/getAlarmVolume")
//				|| requestMappingURI.equals("/pm/monitor/getEquipList")
//				|| requestMappingURI.equals("/pm/monitor/getBasicSetting")
//				|| requestMappingURI.equals("/pm/monitor/basicSettingSave")
//				|| requestMappingURI.equals("/pm/monitor/getPopTrendData")
//				|| requestMappingURI.equals("/pm/monitor/getPopEpcTrendData")
//				|| requestMappingURI.equals("/pm/monitor/getPopEpcDetailData"))
//		{
//			log.info("예외된 URI : " + requestMappingURI);
//		}else{
//			log.info("URI : " + requestMappingURI);
//		}

    }
}
