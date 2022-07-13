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
import com.ltem.service.PmThresholdService;


/**
 * 성능감시 > 설정 > 임계치설정(팝업)
 *
 */
@Controller("PmThresholdController")
public class PmThresholdController{
	
	@Autowired
	PmThresholdService pmThresholdService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(PmThresholdController.class);
	
	@RequestMapping("/pm/pm_setting/threshold_setting")
	public String threshold_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "pm/setting/threshold_setting";
	}
	
	@RequestMapping(value="/pm/pm_setting/threshold_setting/thresholdMod", method = RequestMethod.POST, produces = "application/json")
	public void thresholdMod(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String modify_date = dateFormat.format(calendar.getTime());
		
		paramMap.put("modify_date", modify_date);
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		int resultInteger = pmThresholdService.thresholdMod(paramMap);
		
		modelMap.addAttribute("thresholdModFlag",resultInteger);
	}
	
	
	@RequestMapping(value="/pm/pm_setting/threshold_setting/thresholdCheck", method = RequestMethod.POST, produces = "application/json")
	public void thresholdCheck(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		int resultInteger = pmThresholdService.thresholdCheck(paramMap);
		
		modelMap.addAttribute("thresholdCheckFlag",resultInteger);
	}
	
	
	@RequestMapping(value="/pm/pm_setting/threshold_setting/getSearchData", method = RequestMethod.POST, produces = "application/json")
	public void getSearchData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,String>> resultList = pmThresholdService.getSearchData(paramMap);
		
		modelMap.addAttribute("thresholdSearchData",resultList);
	}
	
	@RequestMapping(value="/pm/pm_setting/threshold_setting/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		paramMap.put("user_id", (String)session.getAttribute("user_id"));
		
		List<Map<String,String>> temp = pmThresholdService.getSearchData(paramMap);
		List<Map<String,String>> dataList = new ArrayList<Map<String,String>>();
		
		int index = 0;
		for(Map map : temp){
			String weekday = map.get("WEEKDAY")+"";
			String scope = map.get("HOUR_SCOPE")+"";
			String phoneType = map.get("PHONE_TYPE")+"";
			
			if("0".equals(weekday)){
				weekday = "평일";
			}else{
				weekday = "휴일";
			}
			
			if("0".equals(scope)){
				scope = "00:00 ~ 06:59";
			}else{
				scope = "07:00 ~ 23:59";
			}
			
			if("1".equals(phoneType)) {
				phoneType = "차상단말";
			} else if("2".equals(phoneType)) {
				phoneType = "휴대용단말";
			} else if("3".equals(phoneType)) {
				phoneType = "모터카";
			} else {
				phoneType = "관제";
			}
			
			map.put("WEEKDAY",weekday);
			map.put("HOUR_SCOPE",scope);
			map.put("PHONE_TYPE",phoneType);
			
			dataList.add(index, map);
			index++;
		}
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("Threshold", dataList); //sheet이름
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String now_date = dateFormat.format(calendar.getTime());
		
		String fileName = URLEncoder.encode("임계치설정_", "utf-8")+now_date+".xlsx";
		String headerStr = "임계치 설정";
		
		Workbook xlsxWb = create_Custom_Excel(excelData, paramMap, headerStr);;
		
		response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());
	}
	
	public Workbook create_Custom_Excel(Map<String,List<Map<String,String>>> excelData, HashMap<String,Object> paramMap, String headerStr){
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
		
		String[] rowHeaderList = ((String)paramMap.get("rowHeaders")).split(",");
		String[] colHeaderList = ((String)paramMap.get("colHeaders")).split(",");
		String[] secondHeaderList = ((String)paramMap.get("secondHeaders")).split(",");
		String[] colIdList = ((String)paramMap.get("colIds")).split(",");
		
		Sheet sheet1 = xlsxWb.createSheet(headerStr);
		row = sheet1.createRow(0);
		row.setHeight((short) 650);
		cell = row.createCell(0);
		cell.setCellValue(headerStr);
		cell.setCellStyle(styleHd);
		
		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (colIdList.length)-1));
		
		//두번째줄 생성
		row = sheet1.createRow(1);
		int headerIndex = 0;
		for(String rowHeader : rowHeaderList) {
			sheet1.addMergedRegion(new CellRangeAddress(1, 2, headerIndex, headerIndex));
			
			cell = row.createCell(headerIndex);
        	cell.setCellStyle(styleSub);
        	cell = row.getCell(headerIndex);
        	cell.setCellValue(rowHeader);
        	
        	headerIndex ++;
		}
		
//		headerIndex = rowHeaderList.length;
		int secondIndex = headerIndex;
		
		for(String colHeader : colHeaderList) {
			sheet1.addMergedRegion(new CellRangeAddress(1, 1, headerIndex, headerIndex+2));
			
			cell = row.createCell(headerIndex);
        	cell.setCellStyle(styleSub);
        	cell = row.getCell(headerIndex);
        	cell.setCellValue(colHeader);
        	
        	headerIndex += 3;
		}
		
		row = sheet1.createRow(2);
		for(String secondHeader : secondHeaderList) {
			sheet1.addMergedRegion(new CellRangeAddress(2, 2, secondIndex, secondIndex));
			
			cell = row.createCell(secondIndex);
        	cell.setCellStyle(styleSub);
        	cell = row.getCell(secondIndex);
        	cell.setCellValue(secondHeader);
        	
        	secondIndex ++;
		}
		
		List<Map<String,String>> data = excelData.get("Threshold");
		
		int index = 0;
		for(Map<String,String> mapData : data) {
			row = sheet1.createRow(index + 3);
			int colIndex = 0;
			
			for(String col : colIdList){
        		cell = row.createCell(colIndex);
        		cell.setCellValue(String.valueOf(mapData.get(col)));
        		cell.setCellStyle(styleBody);
        		colIndex++;
        	}
			
			index++;
			
		}
		
		for(int i = 0; i < colIdList.length; i++){
        	sheet1.setColumnWidth(i,3000);
        }
		
		return xlsxWb;
	}
	
}
