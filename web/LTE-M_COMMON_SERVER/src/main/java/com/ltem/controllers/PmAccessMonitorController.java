package com.ltem.controllers;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
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
import com.ltem.service.PmAccessMonitorService;
import com.ltem.utils.CreateExcel;


/**
 * 성능감시 > 성능감시 > 기지국 감시
 * 
 */
@Controller("PmAccessMonitorController")

public class PmAccessMonitorController {
	
	@Autowired
	PmAccessMonitorService pmAccessMonitorService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(PmAccessMonitorController.class);
	
	@RequestMapping("/pm/pm_monitor/access_monitor")
	public String access_monitor_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pm/access/monitor/access_monitor";
	}
	
	@RequestMapping(value="/pm/monitor/getEquipList", method = RequestMethod.POST, produces = "application/json")
	public void getEquipList(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		Map<String,Object> returnMap = pmAccessMonitorService.getEquipList(paramMap);
		
		modelMap.addAttribute("getEquipList",returnMap);
	}
	
	@RequestMapping(value="/pm/monitor/getBasicSetting", method = RequestMethod.POST, produces = "application/json")
	public void getBasicSetting(HttpServletRequest request,HttpSession session,  String equip_type,ModelMap modelMap) throws Exception 
	{
		HashMap<String,Object> paramMap = new HashMap<String,Object>();
		
		paramMap.put("equip_type", equip_type);
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		Map<String,Object> resultMap = pmAccessMonitorService.getBasicSetting(paramMap);
		
		modelMap.addAttribute("getBasicSetting",resultMap);
	}
	
	
	@RequestMapping(value="/pm/monitor/basicSettingSave", method = RequestMethod.POST, produces = "application/json")
	public void basicSettingSave(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String modify_date = dateFormat.format(calendar.getTime());
		
		paramMap.put("modify_date", modify_date);
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		int resultInteger = 0;
		if("2".equals(paramMap.get("equip_type"))){
			resultInteger = pmAccessMonitorService.equipSave(paramMap);
		}else{
			resultInteger = 1;
		}
		
		if(resultInteger == 1){
			resultInteger = pmAccessMonitorService.basicSettingSave(paramMap);
		}
		
		modelMap.addAttribute("basicSetSaveFlag",resultInteger);
	}
	
	@RequestMapping(value="/pm/pm_monitor/access_monitor/getSearchData", method = RequestMethod.POST, produces = "application/json")
	public void getSearchData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		Map<String,Object> resultMap = pmAccessMonitorService.getSearchData(paramMap);
		
		modelMap.addAttribute("getSearchData",resultMap);
	}
	
	@RequestMapping(value="/pm/pm_monitor/access_monitor/kpiExcel", method=RequestMethod.GET)
    @ResponseBody
    public void kpiExcel(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		Map<String,Object> resultMap = pmAccessMonitorService.getSearchData(paramMap);
		List<Map<String,String>> dataList = (List<Map<String, String>>) resultMap.get("getAccessKpiData");
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("KPI", dataList);
		
		String equipType = paramMap.get("equipType")+"";
		
		String fileName = URLEncoder.encode("Access망감시_KPI_", "utf-8")+paramMap.get("updateTime")+".xlsx";
		String headerStr = "Access망 감시 KPI";
		
		ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        
    	columnList.add("LINE_NAME");
        columnList.add("DU_ID");
        columnList.add("DU_NAME");
        if("3".equals(equipType)) {
        	columnList.add("RU_NAME");
        	columnList.add("RU_CUID");
        }
        columnList.add("ATTEMPT");
        columnList.add("STD_ATT_5M");
        columnList.add("ATT_RATE");
        columnList.add("ERAB_ATTEMPT");
        columnList.add("STD_ERAB_5M");
        columnList.add("ERAB_ATT_RATE");
        columnList.add("RRC");
        columnList.add("RRC_RATE");
        columnList.add("ANSWER");
        columnList.add("ANSWER_RATE");
        columnList.add("ERAB_ADD_SUCCESS");
        columnList.add("CD");
        columnList.add("CD_RATE");
        
    	headerList.add("호선");
        headerList.add("장비ID");
        headerList.add("기지국");
        if("3".equals(equipType)) {
        	headerList.add("중계기");
        	headerList.add("Cell");
        }
        headerList.add("RRC 시도호");
        headerList.add("RRC 기준 시도호");
        headerList.add("RRC 시도호 증감율(%)");
        headerList.add("ERAB Setup 시도호");
        headerList.add("ERAB Setup 기준 시도호");
        headerList.add("ERAB SEtup 시도호 증감율(%)");
        headerList.add("소통호 (RRC 성공호)");
        headerList.add("소통율(RRC 성공율)(%)");
        headerList.add("완료호(ERAB Setup 성공호)");
        headerList.add("완료율(ERAB Setup 성공율)(%)");
        headerList.add("ERAB Setup Add 성공호");
        headerList.add("절단호");
        headerList.add("절단율 (%)");
        CreateExcel excel = new CreateExcel();
        
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr, columnList);
		
		response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	@RequestMapping(value="/pm/pm_monitor/access_monitor/dtpExcel", method=RequestMethod.GET)
    @ResponseBody
    public void dtpExcel(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		Map<String,Object> resultMap = pmAccessMonitorService.getSearchData(paramMap);
		List<Map<String,String>> dataList = (List<Map<String, String>>) resultMap.get("getAccessDTPData");
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("DataThroughput", dataList);
		
		String equipType = paramMap.get("equipType")+"";
		
		String fileName = URLEncoder.encode("Access망감시_DataThroughput_", "utf-8")+paramMap.get("updateTime")+".xlsx";
		String headerStr = "Access망 감시 DataThroughput";
		
		ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        
    	columnList.add("LINE_NAME");
        columnList.add("DU_ID");
        columnList.add("DU_NAME");
        
        columnList.add("UP_VOLUMN");
        columnList.add("UP_VOLUMN_STD");
        columnList.add("UP_VOLUMN_RATE");

        columnList.add("UP_DTP");
        columnList.add("UP_DTP_STD");
        columnList.add("UP_DTP_RATE");
        
        columnList.add("DW_VOLUMN");
        columnList.add("DW_VOLUMN_STD");
        columnList.add("DW_VOLUMN_RATE");
        
        columnList.add("DW_DTP");
        columnList.add("DW_DTP_STD");
        columnList.add("DW_DTP_RATE");
        
    	headerList.add("호선");
        headerList.add("장비ID");
        headerList.add("기지국");
        
        headerList.add("UP Volume(KByte)");
        headerList.add("기준 UP Volume(KByte)");
        headerList.add("UP Volume 증감율(%)");

        headerList.add("UP Throughput(KBps)");
        headerList.add("기준 UP Throughput(KBps)");
        headerList.add("UP Throughput 증감율(%)");
        
        headerList.add("Download Volume(KByte)");
        headerList.add("기준 Download Volume(KByte)");
        headerList.add("Download Volume 증감율(%)");
        
        headerList.add("Download Throughput(KBps)");
        headerList.add("기준 Download Throughput(KBps)");
        headerList.add("Download Throughput 증감율(%)");
        
        CreateExcel excel = new CreateExcel();
        
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr, columnList);
		
		response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	@RequestMapping(value="/pm/pm_monitor/access_monitor/handExcel", method=RequestMethod.GET)
    @ResponseBody
    public void handExcel(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		Map<String,Object> resultMap = pmAccessMonitorService.getSearchData(paramMap);
		List<Map<String,String>> dataList = (List<Map<String, String>>) resultMap.get("getAccessHANDData");
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("HandOver", dataList);
		
		String equipType = paramMap.get("equipType")+"";
		
		String fileName = URLEncoder.encode("Access망감시_HandOver_", "utf-8")+paramMap.get("updateTime")+".xlsx";
		String headerStr = "Access망 감시 HandOver";
		
		ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        
    	columnList.add("LINE_NAME");
        columnList.add("DU_ID");
        columnList.add("DU_NAME");
        columnList.add("STATISTICS_TYPE");
        columnList.add("ATTEMPT");
        columnList.add("STD_ATT_5M");
        columnList.add("ATT_RATE");
        columnList.add("SUCCESS");
        columnList.add("SUCC_RATE");
        
    	headerList.add("호선");
        headerList.add("장비ID");
        headerList.add("기지국");
        headerList.add("타입");
        headerList.add("시도호");
        headerList.add("기준 시도호");
        headerList.add("시도호증감율(%)");
        headerList.add("성공호");
        headerList.add("성공율(%)");
        CreateExcel excel = new CreateExcel();
        
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr, columnList);
		
		response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	@RequestMapping("/criticalAlarm")
	public void criticalAlarm(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("SEVERITY", "1");
		paramMap.put("MONITOR_TYPE", "1");
		paramMap.put("HOST", request.getServerName());
		paramMap.put("FILE_PATH", request.getSession().getServletContext().getRealPath("/WEB-INF/sound"));
		
		Map<String,String> audioInfo = pmAccessMonitorService.getAlarmInfo(paramMap);
		
		File f = new File(audioInfo.get("FILE_PATH"));
		byte[] bytes = FileUtils.readFileToByteArray(f);

		String mimeType = Files.probeContentType(Paths.get(audioInfo.get("FILE_PATH")));
		response.setHeader("Content-Type", mimeType);
		response.getOutputStream().write(bytes);
	}
	
	@RequestMapping("/majorAlarm")
	public void majorAlarm(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("SEVERITY", "2");
		paramMap.put("MONITOR_TYPE", "1");
		paramMap.put("HOST", request.getServerName());
		paramMap.put("FILE_PATH", request.getSession().getServletContext().getRealPath("/WEB-INF/sound"));
		
		Map<String,String> audioInfo = pmAccessMonitorService.getAlarmInfo(paramMap);
		
		File f = new File(audioInfo.get("FILE_PATH"));
		byte[] bytes = FileUtils.readFileToByteArray(f);

		String mimeType = Files.probeContentType(Paths.get(audioInfo.get("FILE_PATH")));
		response.setHeader("Content-Type", mimeType);
		response.getOutputStream().write(bytes);
	}
	
	@RequestMapping("/minorAlarm")
	public void minorAlarm(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("SEVERITY", "3");
		paramMap.put("MONITOR_TYPE", "1");
		paramMap.put("HOST", request.getServerName());
		paramMap.put("FILE_PATH", request.getSession().getServletContext().getRealPath("/WEB-INF/sound"));
		
		Map<String,String> audioInfo = pmAccessMonitorService.getAlarmInfo(paramMap);
		
		File f = new File(audioInfo.get("FILE_PATH"));
		byte[] bytes = FileUtils.readFileToByteArray(f);

		String mimeType = Files.probeContentType(Paths.get(audioInfo.get("FILE_PATH")));
		response.setHeader("Content-Type", mimeType);
		response.getOutputStream().write(bytes);
	}
	
	@RequestMapping("/criticalFailureAlarm")
	public void criticalFailureAlarm(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("SEVERITY", "1");
		paramMap.put("MONITOR_TYPE", "2");
		paramMap.put("HOST", request.getServerName());
		paramMap.put("FILE_PATH", request.getSession().getServletContext().getRealPath("/WEB-INF/sound"));
		
		Map<String,String> audioInfo = pmAccessMonitorService.getAlarmInfo(paramMap);
		
		File f = new File(audioInfo.get("FILE_PATH"));
		byte[] bytes = FileUtils.readFileToByteArray(f);
		
		String mimeType = Files.probeContentType(Paths.get(audioInfo.get("FILE_PATH")));
		response.setHeader("Content-Type", mimeType);
		response.getOutputStream().write(bytes);
	}
	
	@RequestMapping("/majorFailureAlarm")
	public void majorFailureAlarm(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("SEVERITY", "2");
		paramMap.put("MONITOR_TYPE", "2");
		paramMap.put("HOST", request.getServerName());
		paramMap.put("FILE_PATH", request.getSession().getServletContext().getRealPath("/WEB-INF/sound"));
		
		Map<String,String> audioInfo = pmAccessMonitorService.getAlarmInfo(paramMap);
		
		File f = new File(audioInfo.get("FILE_PATH"));
		byte[] bytes = FileUtils.readFileToByteArray(f);

		String mimeType = Files.probeContentType(Paths.get(audioInfo.get("FILE_PATH")));
		response.setHeader("Content-Type", mimeType);
		response.getOutputStream().write(bytes);
	}
	
	@RequestMapping("/minorFailureAlarm")
	public void minorFailureAlarm(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("SEVERITY", "3");
		paramMap.put("MONITOR_TYPE", "2");
		paramMap.put("HOST", request.getServerName());
		paramMap.put("FILE_PATH", request.getSession().getServletContext().getRealPath("/WEB-INF/sound"));
		
		Map<String,String> audioInfo = pmAccessMonitorService.getAlarmInfo(paramMap);
		
		File f = new File(audioInfo.get("FILE_PATH"));
		byte[] bytes = FileUtils.readFileToByteArray(f);

		String mimeType = Files.probeContentType(Paths.get(audioInfo.get("FILE_PATH")));
		response.setHeader("Content-Type", mimeType);
		response.getOutputStream().write(bytes);
	}
	
	@RequestMapping(value="/setting/getAlarmVolume")
	public void getAlarmVolume(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> returnMap = pmAccessMonitorService.getAlarmVolume();
		modelMap.addAttribute("getAlarmVolume",returnMap);
	}
	
	@RequestMapping(value="/pm/monitor/getPopTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getPopTrendData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		Map<String,Object> resultList = pmAccessMonitorService.getPopTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",resultList);
	}
	
	@RequestMapping(value="/pm/monitor/getPopDetailData", method = RequestMethod.POST, produces = "application/json")
	public void getPopDetailData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		List<Map<String,Object>> resultList = pmAccessMonitorService.getPopDetailData(paramMap);
		
		modelMap.addAttribute("getDetailData",resultList);
	}
}
