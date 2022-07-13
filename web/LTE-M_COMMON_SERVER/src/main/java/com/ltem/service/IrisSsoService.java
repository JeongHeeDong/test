package com.ltem.service;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

public interface IrisSsoService {
	
	public String getAccessToken(String id, String pw);

	public boolean createCookie(HttpServletResponse response, String id);
	public void removeCookie(HttpServletResponse response, String name);
	
	public boolean createIrisAccount(final String id);
	
	public boolean deleteIrisAccount(final String id);
	public int deleteIrisAccounts(List<Object> ids);
}
