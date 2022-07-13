package com.ltem.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.HandlerMapping;

import com.ltem.service.CommonFunctionService;

@Component
public class CommonFunction {
	private static final Logger log = LoggerFactory.getLogger(CommonFunction.class);
	@Autowired
	CommonFunctionService commonFunctionService;

    public void insertWebLog(Map<String,Object> param) throws Exception {
        commonFunctionService.insertWebLog(param);
    }

    private HashMap<String, Object> setUserInfo(HttpServletRequest req, HttpSession session) throws Exception {
        HashMap<String, Object> paramMap = new HashMap<String, Object>();
        String clientIp = req.getHeader ("Proxy-Client-IP" );
//        System.out.println(uri);

        if (clientIp == null) {
            clientIp = req.getHeader( "WL-Proxy-Client-IP");
            if (clientIp == null) {
                clientIp = req.getHeader( "X-Forwarded-For");
                if (clientIp == null) {
                    clientIp = req.getRemoteAddr();
                }
            }
        }

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String nowdate = dateFormat.format(calendar.getTime());

        paramMap.put("USER_IP", clientIp);
        paramMap.put("DATE", nowdate);
        paramMap.put("USER_ID", (String)session.getAttribute("user_id"));
        paramMap.put("TEAM_NM", (String)session.getAttribute("team_nm"));
        paramMap.put("TEAM_ID", Integer.parseInt(session.getAttribute("team_id")+""));

        return paramMap;
    }

    public void setModel(HttpServletRequest req, HttpSession session, ModelMap modelMap) throws Exception {
        HashMap<String, Object> paramMap = new HashMap<String, Object>();
        String requestMappingURI = req.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE).toString();
        String[] uri = requestMappingURI.split("/");

        String menuPath = "";
        String menuTitle = "";
        String pageTitle = "";
        String menuId = "";

        try {
            menuPath = req.getParameter("menu-path");
            menuTitle = req.getParameter("menu-title");
            pageTitle = req.getParameter("page-title");
            menuId = req.getParameter("menu-id");
            
            if (StringUtils.isBlank(menuPath)) {
            	menuPath = StringUtils.defaultString(modelMap.get("menu-path").toString());
            	menuTitle = StringUtils.defaultString(modelMap.get("menu-path").toString());
            	pageTitle = StringUtils.defaultString(modelMap.get("menu-path").toString());
            }
            
            if (StringUtils.isBlank(menuId)) {
            	menuId = StringUtils.defaultString(modelMap.get("menu-id").toString());
            }

            if (!"".equals(menuPath)) {
                menuPath = menuPath.replaceAll("\\|", ">");
                menuTitle = menuTitle.replaceAll("\\|", ">");
                pageTitle = pageTitle.replaceAll("\\|", ">");
            }

            modelMap.addAttribute("pageTitle", pageTitle);
            modelMap.addAttribute("title", menuTitle);
            if(!uri[1].equals("integration")) {
                modelMap.addAttribute("subtitle", menuPath);
            }
            modelMap.addAttribute("user_id", (String)session.getAttribute("user_id"));

        } catch(Exception e) {
        	log.info("menu 관련 parameter가 없는 경우");
        }
        paramMap.putAll(setUserInfo(req, session));
        paramMap.put("MENU_NM", menuPath);
        paramMap.put("MENU_ID", menuId);
        paramMap.put("LOGIN_FLAG", "N");
        paramMap.put("LOGOUT_FLAG", "N");

        insertWebLog(paramMap);
    }
	
    public List<HashMap<String,String>> getMenuAuthList(){
    	try {
			return commonFunctionService.getMenuAuthList();
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
    }

    public void f_detectionLog_insert(HashMap<String,String> paramMap){
    	try{
    		commonFunctionService.f_detectionLog_insert(paramMap);
    	}catch(Exception e){
    		log.error("부정사용 검출 로그 insert fail\n"+e.getMessage());
    	}
    }

	public void putFailureInfoClear(HttpServletRequest req, HttpSession session, HashMap<String, Object> paramMap) {
		try {
			paramMap.putAll(setUserInfo(req, session));
			this.commonFunctionService.putFailureInfoClear(paramMap);
			log.info("Failure Compel Log : " + (String) paramMap.get("failureDesc"));
		} catch (Exception e) {
			log.error("고장알람  로그 insert fail\n" + e.getMessage());
		}
	}
	
}
