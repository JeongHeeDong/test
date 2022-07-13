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
import com.ltem.service.SystemSmsLogManagerService;
import com.ltem.utils.CreateExcel;

/**
 * 고장감시 > 고장분석 > 장애정보 알림문자 발행 이력 조회
 *
 */
@Controller("SystemSmsLogManagerController")
public class SystemSmsLogManagerController {
	private static final Logger log = LoggerFactory.getLogger(SystemSmsLogManagerController.class);

	@Autowired
	SystemSmsLogManagerService systemSmsLogManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/system/sysSmsLogManager")
	public String sysDBManager(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request, session, modelMap);
		return "system/sysSmsLogManager";
	}
	
	@RequestMapping(value="/system/sysSmsLogManager/getSmsLogData", method = RequestMethod.POST, produces = "application/json")
	public void getSmsLogData(@RequestBody HashMap<String,String> paramMap, ModelMap modelMap) throws Exception 
	{
		Map<String,List<Map<String, String>>> resultMap = systemSmsLogManagerService.getSmsLogData(paramMap);	
		int totalCnt = systemSmsLogManagerService.getTotalCnt(paramMap);
		
		modelMap.addAttribute("getSmsLogData",resultMap);
		modelMap.addAttribute("getTotalCnt", totalCnt);
	}
	
	
	@RequestMapping(value="/system/sysSmsLogManager/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,String> paramMap, ModelMap modelMap, HttpServletResponse response,HttpServletRequest request) throws Exception {
        CreateExcel excel = new CreateExcel();    
        String fileName  = "";
        String headerStr = "";
        String headers = paramMap.get("HEADERS");
        String columns = paramMap.get("COLUMNS");
        String[] headerArray = headers.split(",");
        String[] columnArray = columns.split(",");
        
        ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        Map<String, List<Map<String, String>>> excelData = new HashMap<String, List<Map<String, String>>>();
        
        for(int i=0;i<headerArray.length;i++){
                headerList.add(headerArray[i]);
        }
        for(int i=0;i<columnArray.length;i++){
                columnList.add(columnArray[i]);
        }
        
        String fromDate = paramMap.get("fromDate");
        String toDate   = paramMap.get("toDate");
        toDate = toDate.substring(0, 10);
        
        fileName = URLEncoder.encode(paramMap.get("TITLE"), "utf-8") + "(" + fromDate + "~" + toDate + ")" + ".xlsx";
        headerStr = paramMap.get("TITLE") + "(" + fromDate + "~" + toDate + ")";
        excelData = systemSmsLogManagerService.getSmsLogData(paramMap);
            	
    	Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr,columnList);
       
    	response.setContentType("application/vnd.ms-excel");
    	response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
    	response.addHeader("Set-Cookie", "fileDownload=true; path=/");
       
    	xlsxWb.write(response.getOutputStream());
    }
}