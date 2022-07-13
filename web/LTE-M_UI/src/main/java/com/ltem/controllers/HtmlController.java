package com.ltem.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HtmlController {
	@RequestMapping("/html/{page}")
	public String htmlPage(@PathVariable("page") String page, ModelMap modelMap) {
		modelMap.put("title", "html - " + page);
		return "html/" + page;
	}
}
