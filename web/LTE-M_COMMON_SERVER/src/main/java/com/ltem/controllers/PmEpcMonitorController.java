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
import com.ltem.service.PmEpcMonitorService;

/**
 * 성능감시 > 성능감시 > 주제어장치 감시
 *
 */
@Controller("PmEpcMonitorController")
public class PmEpcMonitorController {

	@Autowired
	PmEpcMonitorService pmEpcMonitorService;

	@Autowired
	private CommonFunction commonFunction;

	private static final Logger log = LoggerFactory.getLogger(PmEpcMonitorController.class);

	@RequestMapping("/pm/pm_monitor/epc_monitor")
	public String epc_monitor_page(HttpServletRequest request, HttpSession session, ModelMap modelMap)
			throws Exception {
		commonFunction.setModel(request, session, modelMap);

		return "pm/epc/monitor/epc_monitor";
	}

	@RequestMapping(value = "/pm/pm_monitor/epc_monitor/getMaxDateTime", method = RequestMethod.POST, produces = "application/json")
	public void getMaxDateTime(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		String maxDateTime = pmEpcMonitorService.getMaxDateTime();

		modelMap.addAttribute("getMaxDateTime", maxDateTime);
	}

	@RequestMapping(value = "/pm/pm_monitor/epc_monitor/getEpcSearchData", method = RequestMethod.POST, produces = "application/json")
	public void getEpcSearchData(HttpServletRequest request, HttpSession session,
			@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {
		Map<String, List<Map<String, String>>> returnMap = pmEpcMonitorService.getEpcSearchData(paramMap);

		modelMap.addAttribute("getEpcSearchData", returnMap);
	}

	@RequestMapping(value = "/pm/pm_monitor/epc_monitor/epcExcel", method = RequestMethod.GET)
	@ResponseBody
	public void excelDown(@RequestParam HashMap<String, Object> paramMap, ModelMap modelMap, HttpSession session,
			HttpServletResponse response) throws Exception {
		String timeArray = (String) paramMap.get("mmeArrayTime_join");
		paramMap.put("mmeArrayTime", timeArray.split(","));

		timeArray = (String) paramMap.get("pgwArrayTime_join");
		paramMap.put("pgwArrayTime", timeArray.split(","));

		timeArray = (String) paramMap.get("sgwArrayTime_join");
		paramMap.put("sgwArrayTime", timeArray.split(","));

		timeArray = (String) paramMap.get("hssArrayTime_join");
		paramMap.put("hssArrayTime", timeArray.split(","));

		timeArray = (String) paramMap.get("pcrfArrayTime_join");
		paramMap.put("pcrfArrayTime", timeArray.split(","));

		Map<String, List<Map<String, String>>> excelData = pmEpcMonitorService.getEpcSearchData(paramMap);

		String fileName = URLEncoder.encode("EPC망감시", "utf-8") + ".xlsx";
		String headerStr = "EPC망 감시";

		Workbook xlsxWb = create_Epc_Excel(excelData, headerStr, paramMap);

		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");

		xlsxWb.write(response.getOutputStream());
	}

	public Workbook create_Epc_Excel(Map<String, List<Map<String, String>>> excelData, String headerStr,
			HashMap<String, Object> paramMap) {

		String equipType = paramMap.get("equipType") + "";

		Workbook xlsxWb = new XSSFWorkbook();

		// 스타일 객체 생성
		CellStyle styleHd = xlsxWb.createCellStyle(); // 제목 스타일
		CellStyle styleSub = xlsxWb.createCellStyle(); // 부제목 스타일
		CellStyle styleBody = xlsxWb.createCellStyle(); // 내용 스타일

		// 제목 폰트
		Font font = xlsxWb.createFont();
		font.setFontHeightInPoints((short) 20);
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);

		// 제목 스타일에 폰트 적용, 정렬
		styleHd.setFont(font);
		styleHd.setAlignment(CellStyle.ALIGN_CENTER);
		styleHd.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		// 부제목 스타일 설정
		styleSub.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		styleSub.setFillPattern(CellStyle.SOLID_FOREGROUND);
		styleSub.setBorderBottom(CellStyle.BORDER_THIN);
		styleSub.setBottomBorderColor(HSSFColor.BLACK.index);
		styleSub.setBorderLeft(CellStyle.BORDER_THIN);
		styleSub.setLeftBorderColor(HSSFColor.BLACK.index);
		styleSub.setBorderRight(CellStyle.BORDER_THIN);
		styleSub.setRightBorderColor(HSSFColor.BLACK.index);
		styleSub.setBorderTop(CellStyle.BORDER_THIN);
		styleSub.setAlignment(CellStyle.ALIGN_CENTER);
		styleSub.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		styleSub.setWrapText(true); // 줄 바꿈

		// 내용 스타일 설정. Cell 색깔, 무늬 채우기
		styleBody.setBorderBottom(CellStyle.BORDER_THIN);
		styleBody.setBottomBorderColor(HSSFColor.BLACK.index);
		styleBody.setBorderLeft(CellStyle.BORDER_THIN);
		styleBody.setLeftBorderColor(HSSFColor.BLACK.index);
		styleBody.setBorderRight(CellStyle.BORDER_THIN);
		styleBody.setRightBorderColor(HSSFColor.BLACK.index);
		styleBody.setBorderTop(CellStyle.BORDER_THIN);
		styleBody.setAlignment(CellStyle.ALIGN_CENTER);
		styleBody.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		styleBody.setWrapText(true); // 줄 바꿈

		Row row = null;
		Cell cell = null;

		Iterator iterator = excelData.keySet().iterator();

		while (iterator.hasNext()) {

			String sheet_key = (String) iterator.next();
			Sheet sheet1 = null;
			List<Map<String, String>> data = null;
			// Sheet 생성
			if ("MME".equals(sheet_key) && ("1".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				mmeSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			} else if ("PGW".equals(sheet_key) && ("4".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				pgwSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			} else if ("SGW".equals(sheet_key) && ("5".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				sgwSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			} else if ("HSS".equals(sheet_key) && ("6".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				hssSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			} else if ("PCRF".equals(sheet_key) && ("7".equals(equipType) || "0".equals(equipType))) {
				sheet1 = xlsxWb.createSheet(sheet_key);
				data = excelData.get(sheet_key);
				row = sheet1.createRow(0);
				row.setHeight((short) 650);
				cell = row.createCell(0);
				cell.setCellValue(headerStr + "(" + sheet_key + ")");
				cell.setCellStyle(styleHd);
				pcrfSeet(sheet1, paramMap, styleHd, styleSub, styleBody, data);
			}
		}

		return xlsxWb;

	}

	public void mmeSeet(Sheet sheet1, HashMap<String, Object> paramMap, CellStyle styleHd, CellStyle styleSub,
			CellStyle styleBody, List<Map<String, String>> data) {

		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();

		for (String time : (String[]) paramMap.get("mmeArrayTime")) {
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}

		// MME 첫 줄
		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 15)));

		// MME 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 3, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, 1 * timeList.size() * 5));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1 * timeList.size() * 5) + 1, 2 * timeList.size() * 5));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (2 * timeList.size() * 5) + 1, 3 * timeList.size() * 5));

		row = sheet1.createRow(1);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 15) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);
		cell.setCellValue("장비");

		cell = row.getCell(1);
		cell.setCellValue("Attach");

		cell = row.getCell((1 * timeList.size() * 5) + 1);
		cell.setCellValue("SRMO");

		cell = row.getCell((2 * timeList.size() * 5) + 1);
		cell.setCellValue("SRMT");

		// MME 세번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, 1, 1 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (1 * timeList.size()) + 1, 2 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (2 * timeList.size()) + 1, 3 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (3 * timeList.size()) + 1, 4 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (4 * timeList.size()) + 1, 5 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (5 * timeList.size()) + 1, 6 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (6 * timeList.size()) + 1, 7 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (7 * timeList.size()) + 1, 8 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (8 * timeList.size()) + 1, 9 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (9 * timeList.size()) + 1, 10 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (10 * timeList.size()) + 1, 11 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (11 * timeList.size()) + 1, 12 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (12 * timeList.size()) + 1, 13 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (13 * timeList.size()) + 1, 14 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (14 * timeList.size()) + 1, 15 * timeList.size()));
//        sheet1.addMergedRegion(new CellRangeAddress(2, 2, (6*timeList.size())+1,7*timeList.size()));
//        sheet1.addMergedRegion(new CellRangeAddress(2, 2, (7*timeList.size())+1,8*timeList.size()));

		row = sheet1.createRow(2);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 15) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);

		cell = row.getCell(1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((1 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((2 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((3 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((4 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((5 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((6 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((7 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);


		cell = row.getCell((8 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((9 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);
		
		cell = row.getCell((10 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((11 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((12 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);


		cell = row.getCell((13 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((14 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);
//        cell = row.getCell((6*timeList.size())+1);
//    	cell.setCellValue("시도호증감율");
//        
//        cell = row.getCell((7*timeList.size())+1);
//    	cell.setCellValue("접속율");

		// MME 네번째 줄
		row = sheet1.createRow(3);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);

		int headerIndex = 1;

		for (int i = 0; i < 15; i++) {
			for (String time : timeList) {
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}

		for (int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 4);

			if (colIndex == 1) {
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("MME_NAME"));
				cell.setCellStyle(styleBody);
			}

			// ATTACH 시도호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MAA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// ATTACH 기준 시도호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MAAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// ATTACH 시도호 증감율
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// ATTACH 성공호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// ATTATCH 성공율
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MASR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// SRMO 시도호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MSA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// SRMO 기준 시도호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MSAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// SRMO 시도호 증감율
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MSAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// SRMO 성공호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MSS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// SRMO 성공율
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MSSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// SRMT 시도호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MTA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// SRMT 기준 시도호 
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MTSA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// SRMT 시도호 증감율
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MTAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// SRMT 성공호
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MTS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// SRMT 성공율
			for (String time : (String[]) paramMap.get("mmeArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("MTSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}			

//            for(String time : (String [])paramMap.get("mmeArrayTime")){
//        		cell = row.createCell(colIndex);
//        		cell.setCellValue(data.get(i).get("MSGAR_"+time));
//        		cell.setCellStyle(styleBody);
//        		colIndex++;
//        	}
//            
//            for(String time : (String [])paramMap.get("mmeArrayTime")){
//        		cell = row.createCell(colIndex);
//        		cell.setCellValue(data.get(i).get("MSGSR_"+time));
//        		cell.setCellStyle(styleBody);
//        		colIndex++;
//        	}
		}

		// 컬럼 너비 설정
		for (int j = 0; j < timeList.size() * 15; j++) {
			sheet1.setColumnWidth(j, 3000);
		}
	}

	public void pgwSeet(Sheet sheet1, HashMap<String, Object> paramMap, CellStyle styleHd, CellStyle styleSub,
			CellStyle styleBody, List<Map<String, String>> data) {

		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();

		for (String time : (String[]) paramMap.get("pgwArrayTime")) {
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}

		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 15)));

		// PGW 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 3, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, (1 * timeList.size() * 5)));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1 * timeList.size() * 5) + 1, (2 * timeList.size() * 5)));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (2 * timeList.size() * 5) + 1, (3 * timeList.size() * 5)));

		row = sheet1.createRow(1);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 15) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);
		cell.setCellValue("장비");

		cell = row.getCell(1);
		cell.setCellValue("Create");

		cell = row.getCell((1 * timeList.size() * 5) + 1);
		cell.setCellValue("Delete");

		cell = row.getCell((2 * timeList.size() * 5) + 1);
		cell.setCellValue("Modify");

		// PGW 세번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, 1, 1 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (1 * timeList.size()) + 1, 2 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (2 * timeList.size()) + 1, 3 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (3 * timeList.size()) + 1, 4 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (4 * timeList.size()) + 1, 5 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (5 * timeList.size()) + 1, 6 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (6 * timeList.size()) + 1, 7 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (7 * timeList.size()) + 1, 8 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (8 * timeList.size()) + 1, 9 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (9 * timeList.size()) + 1, 10 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (10 * timeList.size()) + 1, 11 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (11 * timeList.size()) + 1, 12 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (12 * timeList.size()) + 1, 13 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (13 * timeList.size()) + 1, 14 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (14 * timeList.size()) + 1, 15 * timeList.size()));

		row = sheet1.createRow(2);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 15) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);

		cell = row.getCell(1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((1 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((2 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((3 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((4 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((5 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((6 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((7 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((8 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((9 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((10 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((11 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((12 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((13 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((14 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		// PGW 네번째 줄
		row = sheet1.createRow(3);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);

		int headerIndex = 1;

		for (int i = 0; i < 15; i++) {
			for (String time : timeList) {
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}

		for (int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 4);

			if (colIndex == 1) {
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("PGW_NAME"));
				cell.setCellStyle(styleBody);
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PCA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PCAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PCAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PCS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PCSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PDA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PDAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PDAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PDS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PDSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PMA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PMAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PMAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PMS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("PMSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
		}

		// 컬럼 너비 설정
		for (int j = 0; j < timeList.size() * 15; j++) {
			sheet1.setColumnWidth(j, 3000);
		}
	}

	public void sgwSeet(Sheet sheet1, HashMap<String, Object> paramMap, CellStyle styleHd, CellStyle styleSub,
			CellStyle styleBody, List<Map<String, String>> data) {

		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();

		for (String time : (String[]) paramMap.get("sgwArrayTime")) {
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}

		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 15)));

		// SGW 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 3, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, (1 * timeList.size() * 5)));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1 * timeList.size() * 5) + 1, (2 * timeList.size() * 5)));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (2 * timeList.size() * 5) + 1, (3 * timeList.size() * 5)));

		row = sheet1.createRow(1);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 15) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);
		cell.setCellValue("장비");

		cell = row.getCell(1);
		cell.setCellValue("Create");

		cell = row.getCell((1 * timeList.size() * 5) + 1);
		cell.setCellValue("Delete");

		cell = row.getCell((2 * timeList.size() * 5) + 1);
		cell.setCellValue("Modify");

		// SGW 세번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, 1, 1 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (1 * timeList.size()) + 1, 2 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (2 * timeList.size()) + 1, 3 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (3 * timeList.size()) + 1, 4 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (4 * timeList.size()) + 1, 5 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (5 * timeList.size()) + 1, 6 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (6 * timeList.size()) + 1, 7 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (7 * timeList.size()) + 1, 8 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (8 * timeList.size()) + 1, 9 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (9 * timeList.size()) + 1, 10 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (10 * timeList.size()) + 1, 11 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (11 * timeList.size()) + 1, 12 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (12 * timeList.size()) + 1, 13 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (13 * timeList.size()) + 1, 14 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (14 * timeList.size()) + 1, 15 * timeList.size()));

		row = sheet1.createRow(2);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 15) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);

		cell = row.getCell(1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((1 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((2 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((3 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((4 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((5 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((6 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((7 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((8 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((9 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((10 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((11 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((12 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((13 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((14 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		// SGW 네번째 줄
		row = sheet1.createRow(3);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);

		int headerIndex = 1;

		for (int i = 0; i < 15; i++) {
			for (String time : timeList) {
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}

		for (int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 4);

			if (colIndex == 1) {
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("SGW_NAME"));
				cell.setCellStyle(styleBody);
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SAA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SAAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SAAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SASR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SDA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SDAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SDAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SDS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SDSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SMA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SMAS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SMAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SMS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("sgwArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("SMSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
		}

		// 컬럼 너비 설정
		for (int j = 0; j < timeList.size() * 15; j++) {
			sheet1.setColumnWidth(j, 3000);
		}
	}

	public void hssSeet(Sheet sheet1, HashMap<String, Object> paramMap, CellStyle styleHd, CellStyle styleSub,
			CellStyle styleBody, List<Map<String, String>> data) {

		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();

		for (String time : (String[]) paramMap.get("hssArrayTime")) {
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}

		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 10)));

		// HSS 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 3, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, (1 * timeList.size() * 5)));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1 * timeList.size() * 5) + 1, (2 * timeList.size() * 5)));

		row = sheet1.createRow(1);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 10) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);
		cell.setCellValue("장비");

		cell = row.getCell(1);
		cell.setCellValue("S6A Interface");

		cell = row.getCell((1 * timeList.size() * 5) + 1);
		cell.setCellValue("Cx Interface");

		// HSS 세번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, 1, 1 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (1 * timeList.size()) + 1, 2 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (2 * timeList.size()) + 1, 3 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (3 * timeList.size()) + 1, 4 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (4 * timeList.size()) + 1, 5 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (5 * timeList.size()) + 1, 6 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (6 * timeList.size()) + 1, 7 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (7 * timeList.size()) + 1, 8 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (8 * timeList.size()) + 1, 9 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (9 * timeList.size()) + 1, 10 * timeList.size()));

		row = sheet1.createRow(2);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 10) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);

		cell = row.getCell(1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((1 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((2 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((3 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((4 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((5 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((6 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((7 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((8 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((9 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		// HSS 네번째 줄
		row = sheet1.createRow(3);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);

		int headerIndex = 1;

		for (int i = 0; i < 10; i++) {
			for (String time : timeList) {
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}

		for (int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 4);

			if (colIndex == 1) {
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("HSS_NAME"));
				cell.setCellStyle(styleBody);
			}

			// S6A 시도호
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("H6A_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// S6A 기준 시도호
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("H6SA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// S6A 시도호 증감율
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("H6AR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// S6A 성공호
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("H6S_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// S6A 성공율
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("H6SR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			
			// Cx 시도호
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// Cx 기준 시도호
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CSA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// Cx 시도호 증감율
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			// Cx 성공호
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
			// Cx 성공율
			for (String time : (String[]) paramMap.get("hssArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("CSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}
		}

		// 컬럼 너비 설정
		for (int j = 0; j < timeList.size() * 10; j++) {
			sheet1.setColumnWidth(j, 3000);
		}
	}

	public void pcrfSeet(Sheet sheet1, HashMap<String, Object> paramMap, CellStyle styleHd, CellStyle styleSub,
			CellStyle styleBody, List<Map<String, String>> data) {

		Row row = null;
		Cell cell = null;
		ArrayList<String> timeList = new ArrayList<String>();

		for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
			StringBuffer timebuffer = new StringBuffer(time.substring(8, time.length()));
			timebuffer.insert(2, ":");
			timeList.add(timebuffer.toString());
		}

		sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, (timeList.size() * 10)));

		// PCRF 두번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(1, 3, 0, 0));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, 1, (1 * timeList.size() * 5)));
		sheet1.addMergedRegion(new CellRangeAddress(1, 1, (1 * timeList.size() * 5) + 1, (2 * timeList.size() * 5)));

		row = sheet1.createRow(1);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 10) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);
		cell.setCellValue("장비");

		cell = row.getCell(1);
		cell.setCellValue("GX");
		
		cell = row.getCell((1 * timeList.size() * 5) + 1);
		cell.setCellValue("RX");



		// PCRF 세번째 줄
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, 1, 1 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (1 * timeList.size()) + 1, 2 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (2 * timeList.size()) + 1, 3 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (3 * timeList.size()) + 1, 4 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (4 * timeList.size()) + 1, 5 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (5 * timeList.size()) + 1, 6 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (6 * timeList.size()) + 1, 7 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (7 * timeList.size()) + 1, 8 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (8 * timeList.size()) + 1, 9 * timeList.size()));
		sheet1.addMergedRegion(new CellRangeAddress(2, 2, (9 * timeList.size()) + 1, 10 * timeList.size()));

		row = sheet1.createRow(2);

		for (int cellIndex = 0; cellIndex < (timeList.size() * 10) + 1; cellIndex++) {
			cell = row.createCell(cellIndex);
			cell.setCellStyle(styleSub);
		}

		cell = row.getCell(0);

		cell = row.getCell(1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((1 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((2 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((3 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((4 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((5 * timeList.size()) + 1);
		cell.setCellValue("시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((6 * timeList.size()) + 1);
		cell.setCellValue("기준시도호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((7 * timeList.size()) + 1);
		cell.setCellValue("시도호 증감율(%)");
		cell.setCellStyle(styleSub);

		cell = row.getCell((8 * timeList.size()) + 1);
		cell.setCellValue("성공호");
		cell.setCellStyle(styleSub);

		cell = row.getCell((9 * timeList.size()) + 1);
		cell.setCellValue("성공율(%)");
		cell.setCellStyle(styleSub);

		// PCRF 네번째 줄
		row = sheet1.createRow(3);
		cell = row.createCell(0);
		cell.setCellStyle(styleSub);

		int headerIndex = 1;

		for (int i = 0; i < 10; i++) {
			for (String time : timeList) {
				cell = row.createCell(headerIndex);
				cell.setCellValue(time);
				cell.setCellStyle(styleSub);
				headerIndex++;
			}
		}

		for (int i = 0; i < data.size(); i++) {
			int colIndex = 1;
			row = sheet1.createRow(i + 4);

			if (colIndex == 1) {
				cell = row.createCell(0);
				cell.setCellValue(data.get(i).get("PCRF_NAME"));
				cell.setCellStyle(styleBody);
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("GA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("GSA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("GAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("GS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("GSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("RA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("RSA_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("RAR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("RS_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

			for (String time : (String[]) paramMap.get("pcrfArrayTime")) {
				cell = row.createCell(colIndex);
				cell.setCellValue(data.get(i).get("RSR_" + time));
				cell.setCellStyle(styleBody);
				colIndex++;
			}

		}

		// 컬럼 너비 설정
		for (int j = 0; j < timeList.size() * 10; j++) {
			sheet1.setColumnWidth(j, 3000);
		}
	}

	@RequestMapping(value = "/pm/monitor/getPopEpcTrendData", method = RequestMethod.POST, produces = "application/json")
	public void getPopEpcTrendData(HttpServletRequest request, HttpSession session,
			@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {
		paramMap.put("user_id", (String) session.getAttribute("user_id"));
		Map<String, Object> resultList = pmEpcMonitorService.getPopEpcTrendData(paramMap);

		modelMap.addAttribute("getTrendData", resultList);
	}

	@RequestMapping(value = "/pm/monitor/getPopEpcDetailData", method = RequestMethod.POST, produces = "application/json")
	public void getPopEpcDetailData(HttpServletRequest request, HttpSession session,
			@RequestBody HashMap<String, Object> paramMap, ModelMap modelMap) throws Exception {
		paramMap.put("user_id", (String) session.getAttribute("user_id"));
		List<Map<String, Object>> resultList = pmEpcMonitorService.getPopEpcDetailData(paramMap);

		modelMap.addAttribute("getDetailData", resultList);
	}
}
