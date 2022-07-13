package com.ltem.utils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import com.ltem.common.CommonFunction;
import com.ltem.service.LoginService;

public class SessionListener implements HttpSessionListener, HttpSessionAttributeListener, ServletContextListener {
	private static final Logger logger = LoggerFactory.getLogger(SessionListener.class);
	
	private static List<String> connSessionList = new ArrayList<String>();
	
	@Autowired
	private LoginService loginService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	/**
	 * 현재 접속자수
	 * @return
	 */
	public static int getUserCount() {
		if(logger.isDebugEnabled()) {
			for(String sessinId : connSessionList) {
				logger.debug("sessinId : " + sessinId);
			}
		}
		return connSessionList.size();
	}

	@Override
	public void sessionCreated(HttpSessionEvent se) {
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		// 세션 삭제 될때 이벤트
		
		se.getSession().getId();
		
		
		String uid = (String) se.getSession().getAttribute("user_id");

		if(StringUtils.isNotBlank(uid)) {
			
			HashMap<String,Object> paramMap = new HashMap<String,Object>();
			
			Calendar calendar = Calendar.getInstance();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
			String nowdate = dateFormat.format(calendar.getTime());
			
			String teamNM = (String)se.getSession().getAttribute("team_nm");
			int teamid = (Integer)se.getSession().getAttribute("team_id");
			String user_ip = (String)se.getSession().getAttribute("user_ip");
			
			paramMap.put("USER_ID", uid);
			paramMap.put("MENU_NM", "로그아웃");
			paramMap.put("MENU_ID", "LOGOUT");
//			paramMap.put("TEAM_NM", teamNM);
			paramMap.put("TEAM_ID", teamid);
			paramMap.put("USER_IP", user_ip);
			paramMap.put("DATE", nowdate);
			paramMap.put("LOGIN_FLAG", "N");
			paramMap.put("LOGOUT_FLAG", "Y");
			
			try {
				loginService.upDateLoginTime(paramMap);
				commonFunction.insertWebLog(paramMap);
				
				logger.info("session Destroyed!");
				
			} catch (Exception e) {
				logger.error("", e);
			}
		}
		
		connSessionList.remove(se.getSession().getId());

	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		 SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}

	@Override
	public void attributeAdded(HttpSessionBindingEvent se) {
		// session에 속성 추가 될 때 세션 생성 처리
		String attributeName = se.getName();
		Object attributeValue = se.getValue();
		
		if(attributeName.equals(se.getSession().getId())) {
			connSessionList.add(se.getSession().getId());
		}
		
		
	}

	@Override
	public void attributeRemoved(HttpSessionBindingEvent se) {
	}

	@Override
	public void attributeReplaced(HttpSessionBindingEvent se) {
	}

}
