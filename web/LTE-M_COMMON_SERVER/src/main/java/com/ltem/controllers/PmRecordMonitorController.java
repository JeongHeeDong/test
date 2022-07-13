package com.ltem.controllers;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import com.ltem.service.PmRecordMonitorService;


/**
 * 성능감시 > 성능감시 > 녹취저장 감시
 *
 */
@Controller
public class PmRecordMonitorController {
	
	@Autowired
	PmRecordMonitorService pmRecordMonitorService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(PmRecordMonitorController.class);
	
	@RequestMapping("/pm/pm_monitor/record_monitor")
	public String record_monitor_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		return "pm/record/monitor/record_monitor";
	}
	
	@RequestMapping(value="/pm/pm_monitor/record_monitor/getMaxDateTime", method = RequestMethod.POST, produces = "application/json")
	public void getMaxDateTime(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		String maxDateTime = pmRecordMonitorService.getMaxDateTime();
		
		modelMap.addAttribute("getMaxDateTime",maxDateTime);
	}
	
	@RequestMapping(value="/pm/pm_monitor/record_monitor/getRecordSearchData", method = RequestMethod.POST, produces = "application/json")
	public void getRecordSearchData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		Map<String,List<Map<String,String>>> returnMap = pmRecordMonitorService.getRecordSearchData(paramMap);
		
		modelMap.addAttribute("getSearchData",returnMap);
	}
	
	@RequestMapping(value="/pm/pm_monitor/record_monitor/recordExcel", method=RequestMethod.GET)
	@ResponseBody
	public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		String timeArray = (String)paramMap.get("callArrayTime_join");
		paramMap.put("callArrayTime", timeArray.split(","));
		
		timeArray = (String)paramMap.get("pttArrayTime_join");
		paramMap.put("pttArrayTime", timeArray.split(","));
		
		Map<String,List<Map<String,String>>> excelData = pmRecordMonitorService.getRecordSearchData(paramMap);
		
		String fileName = URLEncoder.encode("녹취저장감시", "utf-8")+".xlsx";
		String headerStr = "녹취저장 감시";
		
		Workbook xlsxWb = create_Record_Excel(excelData,headerStr,paramMap);
		
		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");
		
		xlsxWb.write(response.getOutputStream());
	}
	
	public Workbook create_Record_Excel(Map<String,List<Map<String,String>>> excelData,String headerStr, HashMap<String,Object> paramMap){
		
		String equipType = paramMap.get("equipType") + "";
		
		Workbook xlsxWb = new XSSFWorkbook();
		
		//스타일 객체 생성
		CellStyle styleHd = xlsxWb.createCellStyle();    //제목 스타일
		CellStyle styleSub = xlsxWb.createCellStyle();   //부제목 스타일
		CellStyle styleBody = xlsxWb.createCellStyle();   //내용 스타일
		
		//제목 폰트
		Font font = xlsxWb.createFont();
		font.setFontHeightInPoints((short)20);
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		
		//제목 스타일에 폰트 적용, 정렬
		styleHd.setFont(font);
		styleHd.setAlignment(CellStyle.ALIGN_CENTER);
		styleHd.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
		
		//부제목 스타일 설정
		styleSub.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		styleSub.setFillPattern(CellStyle.SOLID_FOREGROUND);
		styleSub.setBorderBottom(CellStyle.BORDER_THIN);
		styleSub.setBottomBorderColor(HSSFColor.BLACK.index);
		styleSub.setBorderLeft(CellStyle.BORDER_THIN);
		styleSub.setLeftBorderColor(HSSFColor.BLACK.index);
		styleSub.setBorderRight(CellStyle.BORDER_THIN);
		styleSub.setRightBorderColor(HSSFColor.BLACK.index);
		styleSub.setBorderTop(CellStyle.BORDER_THIN);
		styleSub.setAlignment (CellStyle.ALIGN_CENTER);
		styleSub.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
		styleSub.setWrapText(true); // 줄 바꿈
		
		
		//내용 스타일 설정. Cell 색깔, 무늬 채우기
		styleBody.setBorderBottom(CellStyle.BORDER_THIN);
		styleBody.setBottomBorderColor(HSSFColor.BLACK.index);
		styleBody.setBorderLeft(CellStyle.BORDER_THIN);
		styleBody.setLeftBorderColor(HSSFColor.BLACK.index);
		styleBody.setBorderRight(CellStyle.BORDER_THIN);
		styleBody.setRightBorderColor(HSSFColor.BLACK.index);
		styleBody.setBorderTop(CellStyle.BORDER_THIN);
		styleBody.setAlignment (CellStyle.ALIGN_CENTER);
		styleBody.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
		styleBody.setWrapText(true); // 줄 바꿈
		
		Row row = null;
		Cell cell = null;
		
		Iterator iterator = excelData.keySet().iterator();
		
		
		while(iterator.hasNext()){
			
			String sheet_key = (String)iterator.next();
			Sheet sheet1 = null;
			List<Map<String, String>> data = null;
		// Sheet 생성
			if ("CALL".equals(sheet_key) && ("8".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				callSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			} else if ("PTT".equals(sheet_key) && ("9".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				pttSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			}
		}
		
		return xlsxWb;
		
	}
	
	public void callSeet(Sheet sheet1, HashMap<String,Object> paramMap, CellStyle styleHd, CellStyle styleSub, CellStyle styleBody, List<Map<String, String>> data){
		
		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();
		
		for(String time : (String [])paramMap.get("callArrayTime")){
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}
		
		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 4)));
		
		// 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, 1*timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1*timeList.size())+1,2*timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (2*timeList.size())+1,3*timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (3*timeList.size())+1,4*timeList.size()));
		
		row = sheet1.createRow(1);
		for(int cellIndex = 0; cellIndex < (timeList.size()*4)+1 ; cellIndex++){
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}
		
		cell = row.getCell(0);
		cell.setCellValue("장비");
		
		cell = row.getCell(1);
		cell.setCellValue("시도호");
		
		cell = row.getCell((1*timeList.size())+1);
		cell.setCellValue("성공호");
		
		cell = row.getCell((2*timeList.size())+1);
		cell.setCellValue("시도호증감율");
		
		cell = row.getCell((3*timeList.size())+1);
		cell.setCellValue("성공율");
		
		// 세번째 줄
		row = sheet1.createRow(2);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);
		
		int headerIndex = 1;
		
		for(int i = 0; i < 4; i++) {
			for(String time : timeList){
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}
		
		for(int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 3);
			
			if(colIndex == 1){
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("SYSTEM_NAME"));
				cell.setCellStyle(styleBody);
			}
			
			for(String time : (String [])paramMap.get("callArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CA_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			for(String time : (String [])paramMap.get("callArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CS_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			for(String time : (String [])paramMap.get("callArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CAR_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			for(String time : (String [])paramMap.get("callArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CSR_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
		}
		
		//컬럼 너비 설정
		for(int j = 0; j < timeList.size() * 4; j++){
			sheet1.setColumnWidth(j, 3000);
		}
	}
	
	public void pttSeet(Sheet sheet1, HashMap<String,Object> paramMap, CellStyle styleHd, CellStyle styleSub, CellStyle styleBody, List<Map<String, String>> data){
		
		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();
		
		for(String time : (String [])paramMap.get("pttArrayTime")){
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}
		
		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 4)));
		
		// 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, 1*timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1*timeList.size())+1,2*timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (2*timeList.size())+1,3*timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (3*timeList.size())+1,4*timeList.size()));
		
		row = sheet1.createRow(1);
		for(int cellIndex = 0; cellIndex < (timeList.size()*4)+1 ; cellIndex++){
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}
		
		cell = row.getCell(0);
		cell.setCellValue("장비");
		
		cell = row.getCell(1);
		cell.setCellValue("시도호");
		
		cell = row.getCell((1*timeList.size())+1);
		cell.setCellValue("성공호");
		
		cell = row.getCell((2*timeList.size())+1);
		cell.setCellValue("시도호증감율");
		
		cell = row.getCell((3*timeList.size())+1);
		cell.setCellValue("성공율");
		
		// 세번째 줄
		row = sheet1.createRow(2);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);
		
		int headerIndex = 1;
		
		for(int i = 0; i < 4; i++) {
			for(String time : timeList){
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}
		
		for(int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 3);
			
			if(colIndex == 1){
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("SYSTEM_NAME"));
				cell.setCellStyle(styleBody);
			}
			
			for(String time : (String [])paramMap.get("pttArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PA_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			for(String time : (String [])paramMap.get("pttArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PS_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			for(String time : (String [])paramMap.get("pttArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PAR_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			for(String time : (String [])paramMap.get("pttArrayTime")){
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PSR_"+time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
		}
		
		//컬럼 너비 설정
		for(int j = 0; j < timeList.size() * 4; j++){
			sheet1.setColumnWidth(j, 3000);
		}
	}
	
	@RequestMapping(value="/pm/monitor/getPopRecordTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getPopRecordTrendData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		Map<String,Object> resultList = pmRecordMonitorService.getPopRecordTrendData(paramMap);
		
		modelMap.addAttribute("getTrendData",resultList);
	}
	
	@RequestMapping(value="/pm/monitor/getPopRecordDetailData", method = RequestMethod.POST, produces = "application/json")
	public void getPopRecordDetailData(HttpServletRequest request,HttpSession session,@RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		List<Map<String,Object>> resultList = pmRecordMonitorService.getPopRecordDetailData(paramMap);
		
		modelMap.addAttribute("getDetailData",resultList);
	}
}

