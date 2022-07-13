package com.ltem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ltem.common.CommonFunction;
import com.ltem.service.FailureService;

/**
 * 성능감시 > 설정 > 성능 가청설정(팝업)
 *
 */
@Controller
public class PerformAudioSettingController {
	
	@Autowired
	FailureService failureService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(PerformAudioSettingController.class);
	
	@Value("#{locationconfig['alarm.audiofilepath']}")
	String audioFilePath;
	
	@RequestMapping("/pm/setting/perFormSettingAudio")
	public String audioSetting(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pm/setting/perFormSettingAudio";
	}
	
	@RequestMapping("/pm/setting/perFormSettingAudio/getAudioSettingData")
	public void getAudioSettingData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getAudioSettingData(paramMap);
		model.addAttribute("audioSettingData",resultList);
	}
	
	@RequestMapping(value="/pm/setting/perFormSettingAudio/ajaxUploadFile", method = RequestMethod.POST, produces = "application/json", consumes="multipart/form-data", headers = "content-type=application/x-www-form-urlencoded")
	public void ajaxUploadFile(
			HttpServletRequest request, HttpSession session, Model model
			) throws Exception {
		String result = failureService.addAudioFile(request);
		model.addAttribute("addAudioFileResult",result);

	}
}
