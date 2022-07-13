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
import com.ltem.service.SystemSmsStatisticsService;
import com.ltem.utils.CreateExcel;


/**
 * 고장통계 > 장애정보 알림문자 발생 통계
 *
 */
@Controller("SystemSmsStatisticsController")
public class SystemSmsStatisticsController {
	
	@Autowired
	SystemSmsStatisticsService systemSmsStatisticsService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(SystemSmsStatisticsController.class);
	
	@RequestMapping("/system/sysSmsStatistics")
	public String sysSmsStatisticsPage(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "system/sysSmsStatistics";
	}
	
	@RequestMapping(value="/system/sysSmsStatistics/getStatisticsData", method = RequestMethod.POST, produces = "application/json")
	public void getStatisticsData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,String>> resultList = systemSmsStatisticsService.getStatisticsData(paramMap);
		
		modelMap.addAttribute("getStatisticsData",resultList);
	}
	
	
	@RequestMapping(value="/system/sysSmsStatistics/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		log.info(paramMap.toString());
		
		List<Map<String,String>> dataList =  systemSmsStatisticsService.getStatisticsData(paramMap);
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("장애정보 알림문자 발생 이력 통계", dataList);
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String now_date = dateFormat.format(calendar.getTime());
		
		String fileName = URLEncoder.encode("장애정보_알림문자_발생_이력_통계", "utf-8")+now_date+".xlsx";
		String headerStr = "장애정보 알림문자 발생 이력 통계 리스트";
		
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
		columnList.add("TT_NUMBER");
		columnList.add("ALARM_CODE");
		columnList.add("SEVERITY");
		columnList.add("EQUIP_TYPE");
		columnList.add("CNT");
		
		headerList.add("시간");
		headerList.add("수신번호");
		headerList.add("알람코드");
		headerList.add("알람등급");
		headerList.add("장비타입");
		headerList.add("건수");
	}
}
