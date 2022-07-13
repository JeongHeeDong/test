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
import com.ltem.service.AccessStatisticsService;
import com.ltem.utils.CreateExcel;


/**
 * 보안 > 접속 관리 > 접속 이력 통계
 *
 */
@Controller("AccessStatisticsController")
public class AccessStatisticsController {
	
	@Autowired
	AccessStatisticsService accessStatisticsService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(AccessStatisticsController.class);
	
	@RequestMapping("/security/accessStatistics")
	public String accessAnalysis_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "security/accessStatistics/accessStatistics";
	}
	
	@RequestMapping(value="/security/accessStatistics/getStatisticsData", method = RequestMethod.POST, produces = "application/json")
	public void getStatisticsData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,String>> resultList = accessStatisticsService.getStatisticsData(paramMap);
		
		modelMap.addAttribute("getStatisticsData",resultList);
	}
	
	
	@RequestMapping(value="/security/accessStatistics/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		log.info(paramMap.toString());
		
		List<Map<String,String>> dataList =  accessStatisticsService.getStatisticsData(paramMap);
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("접속 이력 통계", dataList);
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String now_date = dateFormat.format(calendar.getTime());
		
		String fileName = URLEncoder.encode("접속_이력_통계", "utf-8")+now_date+".xlsx";
		String headerStr = "접속 이력 통계 리스트";
		
		ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        
        createCol_HeadList(columnList, headerList);
        
        CreateExcel excel = new CreateExcel();
        
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr, columnList);
		
		response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	private void createCol_HeadList(ArrayList<String> columnList, ArrayList<String> headerList){
		columnList.add("EVENT_TIME");
		columnList.add("USER_IDNAME");
		columnList.add("MENU_NAME");
		columnList.add("IP");
		columnList.add("CNT");
		
		headerList.add("시간");
		headerList.add("사용자 ID(이름)");
		headerList.add("메뉴명");
		headerList.add("IP");
		headerList.add("건수");
	}
}
