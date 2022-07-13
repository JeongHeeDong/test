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
import org.apache.xmlbeans.impl.xb.xsdschema.Public;
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
import com.ltem.service.FailurePerformanceReportService;
import com.ltem.utils.CreateExcel;


/**
 * 성능감시 > 성능분석 > 성능 분석 리포트
 * 고장감시 > 고장분석 > 고장 분석 리포트
 *
 */
@Controller("FailurePerformanceReportController")
public class FailurePerformanceReportController {
	
	@Autowired
	FailurePerformanceReportService failurePerformanceReportService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(FailurePerformanceReportController.class);
	
	@RequestMapping("/pm/analysis/performanceReport")
	public String performanceReportPage(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pm/analysis/performanceReport";
	}
	
	@RequestMapping("/failure/analysis/failureReport")
	public String failureReportPage(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "failure/analysis/failureReport";
	}
	
	@RequestMapping(value="/pm/analysis/performanceReport/getPerformData", method = RequestMethod.POST, produces = "application/json")
	public void getperformData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,String>> resultList = getData(paramMap);;
		modelMap.addAttribute("gridData",resultList);
	}
	
	
	@RequestMapping(value="/pm/analysis/performanceReport/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void performExcelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpServletResponse response,HttpServletRequest request) throws Exception {
      
        Workbook xlsxWb = excelDown(paramMap);
        
        String start = (String)paramMap.get("startDateTime");
        String end = (String)paramMap.get("endDateTime");
        
        String fileName = URLEncoder.encode((String)paramMap.get("TITLE"), "utf-8")+"_"+URLEncoder.encode((String)paramMap.get("SUB_TITLE"), "utf-8")+"_"+start+"~"+end+".xlsx";
        
        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	@RequestMapping(value="/failure/analysis/failureReport/getFailureData", method = RequestMethod.POST, produces = "application/json")
	public void getFailureData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,String>> resultList = getData(paramMap);;
		modelMap.addAttribute("gridData",resultList);
	}
	
	@RequestMapping(value="/failure/analysis/failureReport/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void failureExcelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpServletResponse response,HttpServletRequest request) throws Exception {
		Workbook xlsxWb = excelDown(paramMap);
        
        String start = (String)paramMap.get("startDateTime");
        String end = (String)paramMap.get("endDateTime");
        
        String fileName = URLEncoder.encode((String)paramMap.get("TITLE"), "utf-8")+"_"+URLEncoder.encode((String)paramMap.get("SUB_TITLE"), "utf-8")+"_"+start+"~"+end+".xlsx";
        
        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	
	private List<Map<String,String>> getData(HashMap<String,Object> paramMap) throws Exception {
		paramMap.put("excelFlag", "N");
		List<Map<String,String>> resultList = failurePerformanceReportService.getFailurePerformData(paramMap);
		return resultList;
	}
	
	private Workbook excelDown(HashMap<String,Object> paramMap) throws Exception  {
		
		log.info("get ExcelDown");
        CreateExcel excel = new CreateExcel();
        Map<String,List<Map<String,String>>> getExcelDownData = new HashMap<String,List<Map<String,String>>>();
        
        paramMap.put("excelFlag", "Y");
        paramMap.put("sortOption", new ArrayList<Object>());
        
		List<Map<String,String>> resultList = failurePerformanceReportService.getFailurePerformData(paramMap);
		getExcelDownData.put("excelData", resultList);
		
        String headerStr = "";
        String headers = (String)paramMap.get("HEADERS");
        String columns = (String)paramMap.get("COLUMNS");
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
        
        headerStr = (String)paramMap.get("TITLE")+ "_"+(String)paramMap.get("SUB_TITLE");
		
		Workbook xlsxWb = excel.create_Excel(getExcelDownData, headerList, headerStr,columnList);
		
		return xlsxWb;
	}
}
