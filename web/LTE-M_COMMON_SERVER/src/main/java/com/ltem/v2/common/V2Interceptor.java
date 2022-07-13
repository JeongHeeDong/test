package com.ltem.v2.common;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ltem.v2.dto.TbSeMenuDTO;
import com.ltem.v2.service.V2Service;
import com.ltem.v2.utils.ProjectUtils;

public class V2Interceptor extends HandlerInterceptorAdapter {
	
	private static final Logger log = LoggerFactory.getLogger(V2Interceptor.class);
	
	@Autowired
	private V2Service v2Service;
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
		
		try{
			
			log.debug(">>> V2Interceptor : " + ProjectUtils.isNew() + " && " + ProjectUtils.isAjax(request) + " : " + request.getRequestURI());
			if (ProjectUtils.isNew() && !ProjectUtils.isAjax(request)) {
				
				TbSeMenuDTO dto = v2Service.getMenuV2(request.getRequestURI());
				if (dto != null && StringUtils.isNotBlank(dto.getMenuName())) {
					request.setAttribute("menuName", dto.getMenuName());
				}
			}
			
			request.setAttribute("projectProfile", ProjectUtils.getProjectProfile());

		}catch(Exception e){
			log.error(">>> V2Interceptor exception : " + e.getMessage());
		}

		return true;
	}
}
