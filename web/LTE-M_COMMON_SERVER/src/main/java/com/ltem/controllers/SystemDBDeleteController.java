package com.ltem.controllers;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ltem.common.CommonFunction;
import com.ltem.service.SystemDBDeleteService;
import com.ltem.utils.CreateExcel;

/**
 * 시스템 > 데이터 관리 > 삭제 주기 관리
 *
 */
@Controller("SystemDBDeleteController")
public class SystemDBDeleteController {
	private static final Logger log = LoggerFactory.getLogger(SystemDBDeleteController.class);

	@Autowired
	SystemDBDeleteService systemDBDeleteService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	
	@RequestMapping("/system/sysDBdeleteCycle")
	public String sysDBdeleteCycle_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "system/sysDBdeleteCycle";
	}
	
	@RequestMapping(value="/system/sysDBdeleteCycle/getDelData", method = RequestMethod.POST, produces = "application/json")
	public void getDelData(@RequestBody HashMap<String,String> paramMap, ModelMap modelMap) throws Exception {
		
		List<Map<String, String>> resultList = systemDBDeleteService.getDelData(paramMap);	
		int totalCnt = systemDBDeleteService.getTotalCnt(paramMap);
		
		modelMap.addAttribute("getDelData",resultList);
		modelMap.addAttribute("getTotalCnt", totalCnt);
	}
	
	@RequestMapping(value="/system/sysDBdeleteCycle/cyclePopMod", method = RequestMethod.POST, produces = "application/json")
	public void cyclePopMod(@RequestBody HashMap<String,String> paramMap, ModelMap modelMap) throws Exception {
			
		int flag = systemDBDeleteService.cyclePopMod(paramMap);	
		
		modelMap.addAttribute("flag", flag);
	}
	
	@RequestMapping(value="/system/sysDBdeleteCycle/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,String> paramMap, ModelMap modelMap, HttpServletResponse response, HttpServletRequest request) throws Exception {
        
		CreateExcel excel = new CreateExcel();    
        String fileName  = "";
        String headerStr = "";
        String headers = paramMap.get("HEADERS");
        String columns = paramMap.get("COLUMNS");
        
        String[] headerArray = headers.split(",");
        String[] columnArray = columns.split(",");
        
        ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
                
        for(int i=0;i<headerArray.length;i++){
            headerList.add(headerArray[i]);
	    }
	    for(int i=0;i<columnArray.length;i++){
	            columnList.add(columnArray[i]);
	    }
        
        List<Map<String, String>> oneList = systemDBDeleteService.getDelData(paramMap);
        
        Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
        excelData.put("삭제주기 리스트", oneList);
        
        fileName = URLEncoder.encode(paramMap.get("TITLE"), "utf-8") + ".xlsx";
        headerStr = paramMap.get("TITLE");
            	
    	Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr,columnList);
       
    	response.setContentType("application/vnd.ms-excel");
    	response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
    	response.addHeader("Set-Cookie", "fileDownload=true; path=/");
       
    	xlsxWb.write(response.getOutputStream());
    }
	
	@RequestMapping(value="/system/sysDBdeleteCycle/getPopTableInfo", method = RequestMethod.POST, produces = "application/json")
	public void getPopTableInfo(ModelMap modelMap, String tableNm) throws Exception {
		List<Map<String, String>> resultList = systemDBDeleteService.getPopTableInfo(tableNm);	
		
		modelMap.addAttribute("getPopTableInfo",resultList);
	}
}