package com.ltem.v2.utils;

import java.util.Collection;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

/**
 * 세션 관리자
 * -------------------------------------------
 * 1. 로그인 사용자 수 추출 가능
 * 2. 중복 로그인 여부 판단 가능
 * -------------------------------------------
 * 중복 로그인 방지
 * -------------------------------------------
 * 1. 해당 Manager는 싱글톤으로 수행된다.
 * 		: 서버 세션은 id를 Unique하게 가진다.
 * 2. session을 loginId 이름으로 setAttribute한다.
 * 3. loginId의 존재 여부로 중복 로그인을 판단한다.
 * 	3-1. 미 존재 시
 * 		: 로그인 수행
 * 	3-2. 중복 존재 시
 * 		: 기존 loginId기준의 session을 삭제 한 후 
 * 		: 신규 loginId의 세션을 생성한다.
 * 4. 삭제된 기존 session을 사용하는 브라우저는 세션 만료된다. (자동 로그아웃)
 */
public class LoginSessionManager implements HttpSessionBindingListener {
	
	public static LoginSessionManager manager = null;
	
	// 로그인 사용자 정보를 담기 위한 해시테이블
	private static Hashtable<HttpSession, String> loginUsers = new Hashtable<HttpSession, String>();
	
	// 싱글톤
	public static synchronized LoginSessionManager getInstances() {
		if (manager == null) {
			manager = new LoginSessionManager();
		}
		return manager;
	}

	/**
	 * 세션 생성 시 호출된다.
	 */
	@Override
	public void valueBound(HttpSessionBindingEvent event) {
		loginUsers.put(event.getSession(),  event.getName());
		/*
		System.out.println(">>>>>>>>>>>> 로그인 세션 설정 >>>>>>>>>>>>");
		System.out.println((">>> session : " + event.getSession()));
		System.out.println(">>> name : " + event.getName());
		System.out.println(">>> 현재 접속자 수 : " + getUserCount());
		
		>>> session : org.apache.catalina.session.StandardSessionFacade@7b091f6c
		>>> name : test08
		>>> 현재 접속자 수 : 1
		*/
	}

	/**
	 * 세션 삭제 시 호출된다.
	 */
	@Override
	public void valueUnbound(HttpSessionBindingEvent event) {
		loginUsers.remove(event.getSession());
		/*
		System.out.println(">>>>>>>>>>>> 로그아웃 >>>>>>>>>>>>");
		System.out.println((">>> session : " + event.getSession()));
		System.out.println(">>> name : " + event.getName());
		System.out.println(">>> 현재 접속자 수 : " + getUserCount());
		
		>>>>>>>>>>>> 로그아웃 >>>>>>>>>>>>
		>>> session : org.apache.catalina.session.StandardSessionFacade@7b091f6c
		>>> name : test08
		>>> 현재 접속자 수 : 1
		*/
		
	}
	
	public void removeSession(String key) {
		Enumeration<HttpSession> e = loginUsers.keys();
		HttpSession session = null;
		System.out.println(">>> removeSession");
		while (e.hasMoreElements()) {
			session = (HttpSession)e.nextElement();
//			System.out.println(">>> loginUser : " + loginUsers.get(session));
//			System.out.println(">>> userId : " + userId);
			
			if (loginUsers.get(session).equals(key)) {
				session.invalidate();
			}
		}
		
		/*
			>>> removeSession
			>>> loginUser : admin
			>>> userId : test08
			>>> loginUser : test08
			>>> userId : test08 --> 해당 session invalidate()
		 */
	}
	
	public boolean isUsing(String userId) {
		return loginUsers.containsValue(userId);
	}
	
	public void setSession(HttpSession session, String userId) {
		/*
		System.out.println(">>> setSession userId : " + userId);
		System.out.println(">>> setSession this : " + this);
		>>> setSession userId : test08
		>>> setSession this : com.ltem.v2.utils.LoginManager@664aa81e
		*/
		session.setAttribute(userId,  this);
	}
	
	public String getKey(HttpSession session) {
//		System.out.println(">>> getUserId : " + session);
		return (String)loginUsers.get(session);
	}
	
	public void printSessions() {
		Enumeration<HttpSession> e = loginUsers.keys();
		HttpSession session = null;
		
		System.out.println("\n\n===================================");
		int i = 1;
		while(e.hasMoreElements()) {
			session = (HttpSession)e.nextElement();
			System.out.println(">>> " + (i++) + " : " + loginUsers.get(session));
		}
		System.out.println("===================================\n\n");
			
	}
	
	public Collection<String> getUsers() {
		Collection<String> collection = loginUsers.values();
		return collection;
	}
	
	public int getUserCount() {
		return loginUsers.size();
	}
}