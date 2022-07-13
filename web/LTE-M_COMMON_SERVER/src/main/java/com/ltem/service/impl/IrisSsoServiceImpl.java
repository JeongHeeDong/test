package com.ltem.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ltem.service.IrisSsoService;
import com.ltem.utils.HashingUtil;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/* 
 * == LOCAL TEST 
 * 	1. local test시 hosts 파일 변경, 같은 도메인 사용한 주소 접근 필요
 * 		ex. 127.0.0.1			loc.test.com
			(iris web 주소) 		iris.test.com
 *  2. cookie 생성, 삭제 시 setDomain 설정 추가
 *  	ex. cookie.setDomain("test.com")
 *  3. irisReport.jsp iframe src 변경 
 *  	ex. 'http://iris.test.com:18080';
 *	4. loc 서버 구동 후, 웹 페이지 접근 시 loc.test.com:8080으로 접근
 * 
 * == IRIS WEB 설정
 * 	1. iris web page 접속, root계정 로그인
 * 	2. 메뉴 > 환결설정 > 시스템 설정 > Iframe Option : disable (domain 일치 없이 iframe 연동을 위해, same-origin 설정 시 포트가 다르기 때문에 iframe 연동 안됨)
 * 	3. 메뉴 > 환결설정 > 시스템 설정 > Brick 주소와 config.properties iris.url의 주소 확인 (도커 환경 변경 후 추가 됨)
 * 
 * == IRIS WEB 연동 참고 DOC
 * 	ACCOUNT : https://github.com/mobigen/IRIS-BigData-Platform/wiki
 * 	meta CRUD v3.1.1 : https://mobigen.atlassian.net/wiki/spaces/IRIS/pages/266666113/IRIS+CRUD+API
 * ==
 */

/**
 * IRIS SSO Service 구현체
 * @author mobigen
 */
@Service("IrisSsoService")
public class IrisSsoServiceImpl extends EgovAbstractServiceImpl implements IrisSsoService {
	private static final Logger log = LoggerFactory.getLogger(IrisSsoServiceImpl.class);

	@Value("#{locationconfig['iris.url']}")
	public String irisUrl;

	@Value("#{locationconfig['iris.role.prefix']}")
	private String pwPrefix;

	@Value("#{locationconfig['iris.root.id']}")
	private String rootId;

	@Value("#{locationconfig['iris.root.pw']}")
	private String rootPw;
	
	/**
	 * 토큰값 가져오기
	 * 
	 * @return
	 */
	public String getAccessToken(String id, String pw) {
		
//		log.info("### ID :: [{}]", id);
//		log.info("### PW :: [{}]", pw);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		final String url = this.irisUrl+ "/authenticate";
		
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		hashMap.put("userId", id);
		hashMap.put("userPass", pw);
		
		JSONObject jsonObj = new JSONObject(hashMap);
		
		HttpEntity<String> request = new HttpEntity<String>(jsonObj.toString(), headers);
		String resultAsJsonString = this.getRestTemplate().postForObject(url, request, String.class);

		JSONParser parser = new JSONParser();
		JSONObject rstJsonObj = new JSONObject();

		try {
			rstJsonObj = (JSONObject) parser.parse(resultAsJsonString);
		} catch (ParseException e) {
			log.error(e.getMessage());
			return null;
		}

		String userId = String.valueOf(rstJsonObj.get("userId"));
		String token = String.valueOf(rstJsonObj.get("token"));
		String status = String.valueOf(rstJsonObj.get("status"));

		log.info("### USER ID :: [{}]", userId);
		log.info("### TOKEN :: [{}]", token);
		log.info("### IRIS SSO STATUS :: [{}] -> [{}]", id, status);

		return token;
	}
	
	/**
	 * 쿠키 생성
	 * 
	 * @param response
	 * @return
	 */
	public boolean createCookie(HttpServletResponse response, String id) {
		
		// 토큰값 획득, 쿠키 추가
		String token = this.getAccessToken(id, this.inputToSecret(id));
		if (StringUtils.isNotBlank(token)) {
			Cookie cookie = new Cookie("x-access-token", token);
//			cookie.setDomain("test.com");	// loc 테스트용 (배포시 주석)
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			response.addCookie(cookie);

			return true;
		}
		return false;
	}

	/**
	 * 쿠키 삭제
	 * 
	 * @param response
	 * @return
	 */
	public void removeCookie(HttpServletResponse response, String name) {
		Cookie cookie = new Cookie(name, null);
//		cookie.setDomain("test.com");	// loc 테스트용 (배포시 주석)
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}

	/**
	 * IRIS 계정 생성
	 * 
	 * @param id
	 * @param pw
	 * @return
	 */
	public boolean createIrisAccount(final String id) {
		
		final String url = this.irisUrl + "/meta/account";
		final String token = this.getAccessToken(this.rootId, this.rootPw);
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("x-access-token", token);
		headers.setContentType(MediaType.APPLICATION_JSON);

		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		hashMap.put("userId", id);
		hashMap.put("userPass", this.inputToSecret(id));
		hashMap.put("roleCode", "USER");
		
		JSONObject jsonObj = new JSONObject(hashMap);

		HttpEntity<String> request = new HttpEntity<String>(jsonObj.toString(), headers);
		String resultAsJsonString = this.getRestTemplate().postForObject(url, request, String.class);

		if (StringUtils.indexOf(resultAsJsonString, id) > -1) {
			log.info("### IRIS ACCOUNT CREATE SUCCESS :: [{}]", id);
			return true;
		} else {
			log.info("### IRIS ACCOUNT CREATE FAIL :: [{}]", id);
		}

		return false;
	}
	
	/**
	 * IRIS 계정 삭제 
	 * 
	 * @param id
	 * @return
	 */
	public boolean deleteIrisAccount(final String id) {
		final String url = this.irisUrl+ "/meta/account/delete/"+id;
		final String token = this.getAccessToken(this.rootId, this.rootPw);
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("x-access-token", token);
		headers.setContentType(MediaType.APPLICATION_JSON);

		JSONObject jsonObj = new JSONObject();

		HttpEntity<String> request = new HttpEntity<String>(jsonObj.toString(), headers);
		String resultAsJsonString = this.getRestTemplate().postForObject(url, request, String.class);

		if (StringUtils.indexOf(resultAsJsonString, id) > -1) {
			log.info("### IRIS ACCOUNT DELETE SUCCESS :: [{}]", id);
			return true;
		} else {
			log.info("### IRIS ACCOUNT DELETE FAIL :: [{}]", id);
		}
		return false;
	}

	/**
	 * IRIS 계정 삭제 (복수)
	 * 
	 * @param ids
	 * @return
	 */
	public int deleteIrisAccounts(List<Object> ids) {
		
		int result = 0;
		for (Object id : ids) {
			String idStr = String.valueOf(id.toString());
			if(this.deleteIrisAccount(idStr)) {
				result++;
			}
		}
		return result;
	}
	
	// ==================================================================================================
	// PRIVATE
	// ==================================================================================================
	
	/**
	 * RestTemplate 가져오기
	 * 
	 * @return
	 */
	private RestTemplate getRestTemplate() {

		HttpComponentsClientHttpRequestFactory httpClientFactory = new HttpComponentsClientHttpRequestFactory();

		RestTemplate restTemplate = new RestTemplate(httpClientFactory);
		restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
		restTemplate.getMessageConverters().add(new StringHttpMessageConverter());

		return restTemplate;
	}
	
	/**
	 * IRIS 비밀번호 만들기
	 * 
	 * @param input
	 * @return
	 */
	private String inputToSecret(final String input) {
		HashingUtil hu = new HashingUtil();
		return this.pwPrefix + hu.encrypt(input).substring(0, 8);
	}
}