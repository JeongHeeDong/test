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
import com.ltem.service.AccessAnalysisService;
import com.ltem.utils.CreateExcel;


/**
 * 성능감시 > 성능분석 > 기지국 KPI 분석
 *
 */
@Controller("AccessAnalysisController")
public class AccessAnalysisController {
	
	@Autowired
	AccessAnalysisService accessAnalysisService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(AccessAnalysisController.class);
	
	@RequestMapping("/pm/access/analysis/access_analysis")
	public String accessAnalysis_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pm/access/analysis/access_analysis";
	}
	@RequestMapping(value="/pm/access/analysis/access_analysis/getAccessTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getAccessTrendData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		Map<String,Object> resultList = accessAnalysisService.getAccessTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",resultList);
	}
	
	@RequestMapping(value="/pm/access/analysis/access_analysis/getPopAccessAnalysisData", method = RequestMethod.POST, produces = "application/json")
	public void getPopAccessAnalysisData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		List<Map<String,Object>> resultList = accessAnalysisService.getPopAccessAnalysisData(paramMap);
		
		modelMap.addAttribute("getDetailData",resultList);
	}
	
	@RequestMapping(value="/pm/access/analysis/access_analysis/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		String kpiflag = (String)paramMap.get("kpival");
		if("1".equals(kpiflag)) kpiflag = "KPI";
		else if("2".equals(kpiflag)) kpiflag = "Throughput";
		else kpiflag = "Hand Over";
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		paramMap.put("sortOption", new ArrayList<Object>());
		
		List<Map<String,String>> dataList = accessAnalysisService.getAccessExcelData(paramMap);
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put(kpiflag+"_Trend분석", dataList);
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String now_date = dateFormat.format(calendar.getTime());
		
		String fileName = URLEncoder.encode(kpiflag+"_Trend분석_", "utf-8")+now_date+".xlsx";
		String headerStr = kpiflag+"_Trend분석";
		
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
	
//	kpiflag : 1 -> KPI , kpiflag : 2 -> Data Throughput
	public void createCol_HeadList(ArrayList<String> columnList, ArrayList<String> headerList, HashMap<String,Object> paramMap){
		String kpiflag = (String)paramMap.get("kpival");
		String detailKpiflag = (String)paramMap.get("detailKpi");
		
		if("1".equals(kpiflag)){
		 	columnList.add("EVENT_TIME");	// 시간
		 	columnList.add("ATTEMPT");		// RRC 시도호
		 	columnList.add("STD_ATT");		// RRC 기준 시도호
		 	columnList.add("ATT_RATE");		// RRC 시도호 증감율(%)
		 	columnList.add("ERAB_ATTEMPT");		// ERAB Setup 시도호
		 	columnList.add("STD_ERAB");			// ERAB Setup 기준 시도호
		 	columnList.add("ERAB_ATT_RATE");	// ERAB Setup 시도호 증감율(%)
		 	columnList.add("RRC");			//소통호(RRC 성공호)
	        columnList.add("RRC_RATE");		//소통율(RRC 성공율)(%)
	        columnList.add("ANSWER");       //완료호(ERAB Setup 성공호)
	        columnList.add("ANSWER_RATE");  //완료율(ERAB Setup 성공율)(%)
	        columnList.add("ERAB_ADD_SUCCESS");		// ERAB Setup Add 성공호
	        columnList.add("CD");           //절단호
	        columnList.add("CD_RATE");      //절단율(%)
	        
	        headerList.add("시간");
	        headerList.add("RRC 시도호");
	        headerList.add("RRC 기준 시도호");
	        headerList.add("RRC 시도호 증감율(%)");
	        headerList.add("ERAB Setup 시도호");
	        headerList.add("ERAB Setup 기준 시도호");
	        headerList.add("ERAB Setup 시도호 증감율(%)");
	        headerList.add("소통호(RRC 성공호)");
	        headerList.add("소통율(RRC 성공율)(%)");
	        headerList.add("완료호(ERAB Setup 성공호)");
	        headerList.add("완료율(ERAB Setup 성공율)(%)");
	        headerList.add("ERAB Setup Add 성공호");
	        headerList.add("절단호");
	        headerList.add("절단율(%)");
	        
		}else if("2".equals(kpiflag)) {
			
			headerList.add("시간");
	        headerList.add("Volume(KByte)");
	        headerList.add("기준 Volume(KByte)");
	        headerList.add("Volume 증감율(%)");
	        
	        headerList.add("Throughput(KBps)");
	        headerList.add("기준 Throughput(KBps)");
	        headerList.add("Throughput 증감율(%)");
			
			if("1".equals(detailKpiflag)){
				columnList.add("EVENT_TIME");
				columnList.add("UP_VOLUMN");
				columnList.add("UP_VOLUMN_STD");
				columnList.add("UP_VOLUMN_RATE");
				
				columnList.add("UP_DTP");
				columnList.add("UP_DTP_STD");
				columnList.add("UP_DTP_RATE");
			}else{
				columnList.add("EVENT_TIME");
				columnList.add("DW_VOLUMN");
				columnList.add("DW_VOLUMN_STD");
				columnList.add("DW_VOLUMN_RATE");
				
				columnList.add("DW_DTP");
				columnList.add("DW_DTP_STD");
				columnList.add("DW_DTP_RATE");
			}
		} else {
			columnList.add("EVENT_TIME");
		 	columnList.add("ATTEMPT");
		 	columnList.add("STD_ATT");
		 	columnList.add("ATT_RATE");
		 	columnList.add("SUCCESS");
	        columnList.add("SUCC_RATE");
	        
	        headerList.add("시간");
	        headerList.add("시도호");
	        headerList.add("기준 시도호");
	        headerList.add("시도호 증감율(%)");
	        headerList.add("성공호");
	        headerList.add("성공율(%)");
		}
	}
}
