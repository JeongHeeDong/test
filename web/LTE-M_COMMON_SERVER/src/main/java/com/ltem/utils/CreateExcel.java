package com.ltem.utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.Region;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class CreateExcel {
    Workbook workbook;
    CellStyle styleHead;
    CellStyle styleSubtitle;
    CellStyle styleCelltitle;
    CellStyle styleBody;
    Font font;

    public CreateExcel() {
        this.workbook = new XSSFWorkbook();

        //스타일 객체 생성
        this.styleHead = workbook.createCellStyle();//제목 스타일
        this.styleSubtitle = workbook.createCellStyle();//부제목 스타일
        this.styleCelltitle = workbook.createCellStyle();//부제목 스타일
        this.styleBody = workbook.createCellStyle(); //내용 스타일

        //제목 폰트
        this.font = workbook.createFont();
        this.font.setFontHeightInPoints((short)20);
        this.font.setBoldweight(Font.BOLDWEIGHT_BOLD);

        //제목 스타일에 폰트 적용, 정렬
        this.styleHead.setFont(font);
        this.styleHead.setAlignment(CellStyle.ALIGN_CENTER);
        this.styleHead.setVerticalAlignment (CellStyle.VERTICAL_CENTER);

        //부제목 스타일 설정
        this.styleSubtitle.setAlignment(CellStyle.ALIGN_LEFT);
        this.styleSubtitle.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
        this.styleSubtitle.setWrapText(true); // 줄 바꿈

        //부제목 스타일 설정
        this.styleCelltitle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
        this.styleCelltitle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        this.styleCelltitle.setBorderBottom(CellStyle.BORDER_THIN);
        this.styleCelltitle.setBottomBorderColor(HSSFColor.BLACK.index);
        this.styleCelltitle.setBorderLeft(CellStyle.BORDER_THIN);
        this.styleCelltitle.setLeftBorderColor(HSSFColor.BLACK.index);
        this.styleCelltitle.setBorderRight(CellStyle.BORDER_THIN);
        this.styleCelltitle.setRightBorderColor(HSSFColor.BLACK.index);
        this.styleCelltitle.setBorderTop(CellStyle.BORDER_THIN);
        this.styleCelltitle.setAlignment (CellStyle.ALIGN_CENTER);
        this.styleCelltitle.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
        this.styleCelltitle.setWrapText(true); // 줄 바꿈


        //내용 스타일 설정. Cell 색깔, 무늬 채우기
        this.styleBody.setBorderBottom(CellStyle.BORDER_THIN);
        this.styleBody.setBottomBorderColor(HSSFColor.BLACK.index);
        this.styleBody.setBorderLeft(CellStyle.BORDER_THIN);
        this.styleBody.setLeftBorderColor(HSSFColor.BLACK.index);
        this.styleBody.setBorderRight(CellStyle.BORDER_THIN);
        this.styleBody.setRightBorderColor(HSSFColor.BLACK.index);
        this.styleBody.setBorderTop(CellStyle.BORDER_THIN);
        this.styleBody.setAlignment (CellStyle.ALIGN_CENTER);
        this.styleBody.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
        this.styleBody.setWrapText(true); // 줄 바꿈
    }

	public Workbook create_Excel(Map<String,List<Map<String,String>>> excelData, List<String> headerList, String headerStr, List<String> columnList){
		
        Row row = null;
        Cell cell = null;
		
        Iterator iterator = excelData.keySet().iterator();
        
        
        while(iterator.hasNext()){
        	
        	String sheet_key = (String)iterator.next();
        	// Sheet 생성
			Sheet sheet1 = workbook.createSheet(sheet_key);
			
			List<Map<String, String>> data = excelData.get(sheet_key);
			
	        //첫 번째 줄에 title
	        row = sheet1.createRow(0);
	        row.setHeight((short)650);
	        cell = row.createCell(0);
	        cell.setCellValue(headerStr);
	        cell.setCellStyle(styleHead);
	        
	        
	        sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, headerList.size()-1));
	        
	        row = sheet1.createRow(1);
	        
	        boolean e_name_flag = false;
	        
	        // 두 번째 줄에 Cell 설정하기(컬럼명)
	        for(int i = 0; i < headerList.size(); i++) {
	        	cell = row.createCell(i);
	        	cell.setCellValue(headerList.get(i));
	        	cell.setCellStyle(styleCelltitle);
	        	
	        }
	        
	        
	     // 세 번째 줄에 Cell 설정하기(내용)
	        for(int i = 0; i < data.size(); i++) {
	                row = sheet1.createRow(i + 2);
                        for(int u= 0; u < columnList.size();u++) {
                                cell = row.createCell(u);
                                cell.setCellValue(String.valueOf(data.get(i).get(columnList.get(u))));
                                cell.setCellStyle(styleBody);
                        }
	        }
	        
	        //컬럼 너비 설정
	        for(int j = 0; j < headerList.size(); j++){
	        	sheet1.setColumnWidth(j,4000);
	        }
        }
        
        return workbook;
        
	}


    public Workbook createFailureActionCaseReport(Map<String,List<Map<String,String>>> excelData, String headerStr,
                                                  ArrayList<String> headerList, ArrayList<String> columnList,
                                                  ArrayList<String> failureList, ArrayList<String> failureColumnList, String majorFailure){

        List<Map<String, String>> actionCase = excelData.get("actionCase");
        List<Map<String, String>> failureInfo = excelData.get("failureInfo");
        Row row = null;
        Cell cell = null;

        String sheet_key = "엑셀";

        // Sheet 생성
        Sheet sheet1 = workbook.createSheet(sheet_key);
        //첫 번째 줄에 title
        row = sheet1.createRow(0);
        row.setHeight((short)650);
        cell = row.createCell(0);
        cell.setCellValue(headerStr);
        cell.setCellStyle(styleHead);

        sheet1.addMergedRegion(new CellRangeAddress(0, 0, 0, headerList.size() + 2));

        // 조치 사례가 있을 경우에만 출력.
        int rowNumAfterActionCase = -3;
        if(actionCase.size() != 0) {
	        // 두번째 줄에 조치사례 Subtitle 설정
	        row = sheet1.createRow(1);
	        sheet1.addMergedRegion(new CellRangeAddress(1, 1, 0, headerList.size() + 2));
	        for (int j = 0; j <= headerList.size() + 2; j++) {
	            cell = row.createCell(j);
	            cell.setCellStyle(styleSubtitle);
	            if(j == 0) {
	                cell.setCellValue("조치사례");
	            }
	        }
	
	        // 세번째 줄에 조치사례 컬럼명 설정
	        row = sheet1.createRow(2);
	        for(int i = 0; i < headerList.size(); i++) {
	            if(i == headerList.size() - 1) {
	                sheet1.addMergedRegion(new CellRangeAddress(2, 2, i, headerList.size() + 2));
	                for (int j = i; j <= headerList.size() + 2; j++) {
	                    cell = row.createCell(j);
	                    cell.setCellStyle(styleCelltitle);
	                    if(j == i) {
	                        cell.setCellValue(headerList.get(i));
	                    }
	                }
	            } else {
	                cell = row.createCell(i);
	                cell.setCellValue(headerList.get(i));
	                cell.setCellStyle(styleCelltitle);
	            }
	        }
	
	        // 네번째 줄에 조치사례 내용 설정
	        String test = "";
	        Cell mcell;
	        if(actionCase.size() != 0) {
	            for(int i = 0; i < actionCase.size(); i++) {
	                row = sheet1.createRow(i + 3);
	                for(int u = 0; u < columnList.size(); u++) {
	                    if(u == columnList.size() - 1) {
	                        sheet1.addMergedRegion(new CellRangeAddress(i + 3, i + 3, u, columnList.size() + 2));
	                        for (int j = u; j <= columnList.size() + 2; j++) {
	                            cell = row.createCell(j);
	                            if(j == u) {
	                                test = String.valueOf(actionCase.get(i).get(columnList.get(u)));
	                                cell.setCellValue(test);
	                            }
	                            cell.setCellStyle(styleBody);
	                        }
	                    } else {
	                        cell = row.createCell(u);
	                        cell.setCellValue(String.valueOf(actionCase.get(i).get(columnList.get(u))));
	                        cell.setCellStyle(styleBody);
	                    }
	                }
	            }
	        } else {
	            row = sheet1.createRow(3);
	            sheet1.addMergedRegion(new CellRangeAddress(3, 3, 0, columnList.size() + 2));
	            for (int j = 0; j <= columnList.size() + 2; j++) {
	                cell = row.createCell(j);
	                if(j == 0) {
	                    cell.setCellValue("해당 내용이 없습니다");
	                }
	                cell.setCellStyle(styleBody);
	            }
	        }
	
	        if(actionCase.size() != 0) {
	            rowNumAfterActionCase = actionCase.size();
	        } else {
	            rowNumAfterActionCase = 1;
	        }
        }

        //조치사례의 내용이 끝난 뒤에 고장정보 타이틀 설정
        row = sheet1.createRow(rowNumAfterActionCase + 4);
        sheet1.addMergedRegion(new CellRangeAddress(rowNumAfterActionCase + 4, rowNumAfterActionCase + 4, 0, failureColumnList.size() - 4));
        for (int j = 0; j <= failureColumnList.size() - 4; j++) {
            cell = row.createCell(j);
            cell.setCellStyle(styleSubtitle);
            if(j == 0) {
                cell.setCellValue("고장\n정보");
            }
        }

        //조치사례의 내용이 끝난 뒤에 고장정보 Header 설정
        row = sheet1.createRow(rowNumAfterActionCase + 5);
        for(int i = 0; i < failureList.size() - 3; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(styleCelltitle);
            cell.setCellValue(failureList.get(i));
        }

        //조치사례의 내용이 끝난 뒤에 고장정보 내용 설정
        if(failureInfo.size() != 0) {
            // 세 번째 줄에 Cell 설정하기(내용)
            for(int i = 0; i < failureInfo.size(); i++) {
                row = sheet1.createRow(6 + rowNumAfterActionCase);
                for(int u = 0; u < failureColumnList.size() - 3; u++) {
                    cell = row.createCell(u);
                    cell.setCellValue(String.valueOf(failureInfo.get(i).get(failureColumnList.get(u))));
                    cell.setCellStyle(styleBody);
                }
            }
        }

        //컬럼 너비 설정
        for(int i = 0; i < 5; i++){
            sheet1.setColumnWidth(i, 3000);
        }

        sheet1.setColumnWidth(5, 12000);
        sheet1.setColumnWidth(6, 10000);
        sheet1.setColumnWidth(7, 6000);
        sheet1.setColumnWidth(8, 6000);
        sheet1.setColumnWidth(9, 12000);

        //구성정보 Subtitle 설정
        row = sheet1.createRow(rowNumAfterActionCase + 8);
        sheet1.addMergedRegion(new CellRangeAddress(rowNumAfterActionCase + 8, rowNumAfterActionCase + 8, 0, 2));
        for (int j = 0; j <= 2; j++) {
            cell = row.createCell(j);
            cell.setCellStyle(styleSubtitle);
            if(j == 0) {
                cell.setCellValue("구성정보");
            }
        }

        // 구성정보 타이틀 설정
        row = sheet1.createRow(rowNumAfterActionCase + 9);
        for(int i = 0; i < 3; i++) {
            cell = row.createCell(i);
            cell.setCellValue(failureList.get(failureList.size() - 3 + i));
            cell.setCellStyle(styleCelltitle);
        }

        // 구성정보 내용 설정
        if(failureInfo.size() != 0) {
            for(int i = 0; i < failureInfo.size(); i++) {
                row = sheet1.createRow(10 + rowNumAfterActionCase);
                for(int u = 0; u < 3; u++) {
                    cell = row.createCell(u);
                    cell.setCellValue(String.valueOf(failureInfo.get(i).get(failureColumnList.get(failureColumnList.size() - 3 + u))));
                    cell.setCellStyle(styleBody);
                }
            }
        }
        return workbook;
    }
}
