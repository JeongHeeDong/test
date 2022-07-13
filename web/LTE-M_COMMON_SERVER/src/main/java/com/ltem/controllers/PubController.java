package com.ltem.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/integration") 
public class PubController {
	@RequestMapping("/pub_1")
		public String pub_1Page (HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception{
		return "pub/pub_1";  
	}
	
	@RequestMapping("/pub_2")
		public String pub_2Page (HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception{
		return "pub/pub_2";
	}
}
