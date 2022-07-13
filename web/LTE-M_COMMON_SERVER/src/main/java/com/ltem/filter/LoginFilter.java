package com.ltem.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

/**
 * Servlet Filter implementation class LoginFilter
 */
public class LoginFilter implements Filter {
	
	private static final Logger log = LoggerFactory.getLogger(LoginFilter.class);
	
	private String key_id = null;
	
	public LoginFilter() {

	}

	protected FilterConfig filterConfig = null;

	public void init(FilterConfig filterconfig) throws ServletException {
		filterConfig = filterconfig;
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

		String path = ((HttpServletRequest) request).getServletPath();
		
		if(excludeFromFilter(path)) {
			chain.doFilter(request, response);
		} else {
			HttpServletResponse httpResponse = (HttpServletResponse) response;
			HttpServletRequest httpRequest = (HttpServletRequest) request;
			HttpSession session = httpRequest.getSession();
			
			String id = null;
			id = (String) session.getAttribute("user_id");

			key_id = session.getId();

			boolean isLogin = false;
			//session이  NULL일 경우 ctx객체 생성 라인에 오류 -> session검사와 id 검사를 분기
			if (key_id != null) { // 세션 O
				if (id != null && id != "") { // 아이디값 O
					isLogin = true;
					chain.doFilter(request, response);
				}
			}
			// 로그인 안되어있을 경우
			if (!isLogin) {
				if (StringUtils.isNotBlank(httpRequest.getHeader("X-Requested-With"))
						&& "XMLHttpRequest".equalsIgnoreCase(httpRequest.getHeader("X-Requested-With"))) {
					// ajax 호출일 경우 리다이렉트 할 수 없으므로 리다이렉트할 페이지를 응답으로 전달해 주며, common js의 sendRequest 함수내부에서 페이지 이동 함
					
					if(popException(path)){
						httpResponse.setStatus(99999); 
					}else{
						httpResponse.setStatus(HttpStatus.SC_UNAUTHORIZED); //401
					}
				} else {
					if(popException(path)){
						httpResponse.sendRedirect("/popException");
					}else{
						httpResponse.sendRedirect("/login");
					}
				}
			}
		}
					
	}//doFilter 함수

	private boolean excludeFromFilter(String path) {
		if (path.startsWith("/login") ||
				path.startsWith("/v2/login/doLogin") ||
				path.startsWith("/v2/login/updateUserPassword") ||
				path.startsWith("/resources") ||
				path.startsWith("/error") ||
				path.startsWith("/security/account/accountMgmt/register") ||
				path.startsWith("/security/account/accountMgmt/duplicationCheck") ||
				path.startsWith("/user/roll") ||
				path.startsWith("/popException")) {

			return true; // add more page to exclude here

		}

		else return false;
	}

	public void destroy() {
		filterConfig = null;
	}
	
	private boolean popException(String path){
		if (path.startsWith("/pm/pm_setting")
				|| path.startsWith("/failure/setting")
				|| path.startsWith("/pm/setting")
				|| path.startsWith("/security/permit/Ip")) 
		{
			return true;
		}
		else return false;
	}
}
