package com.ltem.controllers;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
import com.ltem.service.RecordAnalysisService;
import com.ltem.utils.CreateExcel;


/**
 * 성능감시 > 성능분석 > 녹취저장 KPI 분석
 *
 */
@Controller
public class RecordAnalysisController {
	
	@Autowired
	RecordAnalysisService recordAnalysisService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(RecordAnalysisController.class);
	
	@RequestMapping("/pm/record/analysis/record_analysis")
	public String recordAnalysis_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pm/record/analysis/record_analysis";
	}
	@RequestMapping(value="/pm/record/analysis/record_analysis/getRecordTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getRecordTrendData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultList = recordAnalysisService.getRecordTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",resultList);
	}
	
	@RequestMapping(value="/pm/record/analysis/record_analysis/getPopRecordAnalysisData", method = RequestMethod.POST, produces = "application/json")
	public void getPopRecordAnalysisData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		List<Map<String,Object>> resultList = recordAnalysisService.getPopRecordAnalysisData(paramMap);
		
		modelMap.addAttribute("getDetailData",resultList);
	}
	
	
	@RequestMapping(value="/pm/record/analysis/record_analysis/excelDownRecord", method=RequestMethod.GET)
	@ResponseBody
	public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		paramMap.put("sortOption", new ArrayList<Object>());
		String kpitext = (String)paramMap.get("kpitext");
		String equiptext = (String)paramMap.get("equiptext");
		
		List<Map<String,String>> dataList = recordAnalysisService.getRecordExcelData(paramMap);
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put(equiptext+"_"+kpitext+"_Trend분석", dataList);
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String now_date = dateFormat.format(calendar.getTime());
		
		String fileName = URLEncoder.encode(equiptext+"_"+kpitext+"_Trend분석"+"_", "utf-8")+now_date+".xlsx";
		String headerStr = equiptext+"_"+kpitext+"_Trend분석";
		
		ArrayList<String> headerList = new ArrayList<String>();
		ArrayList<String> columnList = new ArrayList<String>();
		
		createCol_HeadList(columnList, headerList, paramMap);
		
		CreateExcel excel = new CreateExcel();
		
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr, columnList);
		
		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");
		
		xlsxWb.write(response.getOutputStream());
	}
	
	public void createCol_HeadList(ArrayList<String> columnList, ArrayList<String> headerList, HashMap<String,Object> paramMap){
		headerList.add("시간");
		headerList.add("시도호");
		headerList.add("이전 시도호");
		headerList.add("시도호 증감율");
		headerList.add("성공호");
		headerList.add("성공율");
		
		columnList.add("EVENT_TIME");
		columnList.add("ATTEMPT");
		columnList.add("STD_ATT");
		columnList.add("ATT_RATE");
		columnList.add("SUCCESS");
		columnList.add("SUCC_RATE");
	}
}
