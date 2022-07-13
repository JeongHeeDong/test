package com.ltem.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import com.ltem.common.CommonFunction;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;

/**
 * 고장감시 - 고장알람 인지, 해제 처리
 *
 */
@Controller("FailureClearController")
public class FailureClearController {
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(FailureClearController.class);
	
	@RequestMapping(value = "/failureClear/history/put", method = RequestMethod.POST, produces = "application/json")
	public void failureClearPut(HttpServletRequest request, HttpSession session,
								@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {

		commonFunction.putFailureInfoClear(request, session, paramMap);
	}
}
