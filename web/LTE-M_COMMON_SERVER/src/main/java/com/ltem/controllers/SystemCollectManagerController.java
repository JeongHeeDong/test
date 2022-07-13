package com.ltem.controllers;

import java.net.URLEncoder;
import java.sql.Timestamp;
import java.util.ArrayList;
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
import com.ltem.service.SystemCollectManagerService;
import com.ltem.utils.CreateExcel;

/**
 * 시스템 > 수집 관리
 *
 */
@Controller("SystemCollectManagerController")
public class SystemCollectManagerController {
	private static final Logger log = LoggerFactory.getLogger(SystemCollectManagerController.class);

	@Autowired
	SystemCollectManagerService systemCollectManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/system/sysColManager")
	public String sysColManager(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "system/sysColManager";
	}
	
	@RequestMapping("/system/sysColManagerConfig")
	public String sysColManagerConfig(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "system/sysColManagerConfig";
	}
	
	@RequestMapping("/system/sysColManagerPerform")
	public String sysColManagerPerformGo(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "system/sysColManagerPerform";
	}

	@RequestMapping(value="/system/sysColManager/getColData", method = RequestMethod.POST, produces = "application/json")
	public void getProcData(HttpServletRequest request,
							HttpSession session,
							ModelMap modelMap) throws Exception {
		Map<String,List<Map<String, Object>>> resultMap = systemCollectManagerService.getColData(null);

		modelMap.addAttribute("getColData",resultMap);
	}


	@RequestMapping(value="/system/sysColManager/radioSearch", method = RequestMethod.POST, produces = "application/json")
	public void getRadioSearch(HttpServletRequest request,
							   HttpSession session,
							   @RequestBody HashMap<String,Object> paramMap,
							   ModelMap modelMap) throws Exception {
		String flag = (String) paramMap.get("data");
		Map<String,List<Map<String, Object>>> resultMap = systemCollectManagerService.getColData(flag);
		
		modelMap.addAttribute("getColData", resultMap);
	}
	
	@RequestMapping(value="/system/sysColManager/updateTHD", method = RequestMethod.POST, produces = "application/json")
	public void updateTHD(@RequestBody HashMap<String, Object> paramMap,
						  ModelMap modelMap) throws Exception {
		String userId = (String) paramMap.get("userId");
		String min = (String)paramMap.get("min");
		String hour = (String)paramMap.get("hour");
		String day = (String)paramMap.get("day");
		
		List<String> thdList = new ArrayList<String>();
		thdList.add(min);
		thdList.add(hour);
		thdList.add(day);
		
		int result = 0;
		for ( int i = 0; i < thdList.size(); i++) {
			HashMap<String, Object> requestMap = new HashMap<String, Object>();
			requestMap.put("colType", i+2);
			requestMap.put("colThd", thdList.get(i));
			requestMap.put("userId", userId);
			result += systemCollectManagerService.updateTHD(requestMap);
		}
		
		String msg = "SUCCESS";
		if ( result != 3 ) {
			msg = "FAIL";
		} 
		modelMap.addAttribute("result", msg);
	}
	
	@RequestMapping(value="/system/sysColManager/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,String> paramMap,
						  ModelMap modelMap,
						  HttpServletResponse response,
						  HttpServletRequest request) throws Exception {
        CreateExcel excel = new CreateExcel();    
        String fileName  = "";
        String headerStr = "";
        String headers = paramMap.get("HEADERS");
        String columns = paramMap.get("COLUMNS");
        String status  = paramMap.get("STATUS");
        String[] headerArray = headers.split(",");
        String[] columnArray = columns.split(",");
        String[] statusArray = status.split(",");
        
        ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        ArrayList<String> statusList = new ArrayList<String>();
        Map<String, List<Map<String, Object>>> originData = new HashMap<String, List<Map<String,Object>>>();
        Map<String, List<Map<String, String>>> excelData = new HashMap<String, List<Map<String, String>>>();
        
        for(int i=0;i<headerArray.length;i++){
                headerList.add(headerArray[i]);
        }
        for(int i=0;i<columnArray.length;i++){
                columnList.add(columnArray[i]);
        }
        for(int i=0;i<statusArray.length;i++){
        		statusList.add(statusArray[i]);
        }
        
        if ( paramMap.get("OPTION").equals("undefined") ) {
        	
        	fileName = URLEncoder.encode(paramMap.get("TITLE"), "utf-8")+".xlsx"; 
        	headerStr = paramMap.get("TITLE");
        	originData = systemCollectManagerService.getColData(null);
        }
        else {
        
        	fileName = URLEncoder.encode(paramMap.get("TITLE"), "utf-8")+".xlsx";
        	headerStr = paramMap.get("TITLE");
        	originData = systemCollectManagerService.getColData(paramMap.get("OPTION"));
        }
        
        //엑셀로 출력하기 위해 데이터 가공
        List<Map<String, Object>> originList = originData.get("colData");
        List<Map<String, Object>> failureList = originData.get("failureData");
        List<Map<String, String>> excelList  = new ArrayList<Map<String, String>>();
        List<Map<String, String>> failureExcelList  = new ArrayList<Map<String, String>>();
        
    	for ( int i = 0; i < originList.size(); i ++ ) {
			Map<String, String> excelMap = new HashMap<String, String>();

			String sysId = (String) originList.get(i).get("SYSTEM_ID");
			String datName = (String) originList.get(i).get("DATA_NAME");
			Integer datType = (Integer) originList.get(i).get("DATA_TYPE");
			Timestamp colDate = (Timestamp) originList.get(i).get("COLLECT_DATE");
			Integer colType = (Integer) originList.get(i).get("COLLECT_TYPE");
			Integer colStat = Integer.parseInt(statusList.get(i));

			String datTypeName = "";
			String colTypeName = "";
			String colStatName = "";

			if (datType == 1) {
				datTypeName = "구성";
			} else if (datType == 2) {
				datTypeName = "성능";
			}

			if (colType == 1) {
				colTypeName = "실시간";
			} else if (colType == 2) {
				colTypeName = "5분";
			} else if (colType == 3) {
				colTypeName = "1시간";
			} else if (colType == 4) {
				colTypeName = "1일";
			}

			if (colStat == 1) {
				colStatName = "정상수집";
			} else if (colStat == 2) {
				colStatName = "지연";
			}

			excelMap.put("SYSTEM_ID", sysId);
			excelMap.put("DATA_NAME", datName);
			excelMap.put("DATA_TYPE", datTypeName);
			excelMap.put("COLLECT_DATE", colDate.toString());
			excelMap.put("COLLECT_TYPE", colTypeName);
			excelMap.put("COLLECT_STATUS", colStatName);

			excelList.add(excelMap);
    	}
    	
    	for ( int i = 0; i < failureList.size(); i ++ ) {
			Map<String, String> excelMap = new HashMap<String, String>();

			String sysId = (String) originList.get(i).get("SYSTEM_ID");
			String datName = (String) originList.get(i).get("DATA_NAME");
			Timestamp colDate = (Timestamp) originList.get(i).get("COLLECT_DATE");
			Integer colType = (Integer) originList.get(i).get("COLLECT_TYPE");

			String datTypeName = "";
			String colTypeName = "";
			String colStatName = "";

			datTypeName = "고장";

			if (colType == 1) {
				colTypeName = "실시간";
			} else if (colType == 2) {
				colTypeName = "5분";
			} else if (colType == 3) {
				colTypeName = "1시간";
			} else if (colType == 4) {
				colTypeName = "1일";
			}
			
			colStatName = "정상수집";

			excelMap.put("SYSTEM_ID", sysId);
			excelMap.put("DATA_NAME", datName);
			excelMap.put("DATA_TYPE", datTypeName);
			excelMap.put("COLLECT_DATE", colDate.toString());
			excelMap.put("COLLECT_TYPE", colTypeName);
			excelMap.put("COLLECT_STATUS", colStatName);

			failureExcelList.add(excelMap);
    	}
    	
    	excelData.put("고장", failureExcelList); //엑셀 탭의 이름이 된다.
    	excelData.put("수집데이터(고장제외)", excelList); //엑셀 탭의 이름이 된다.
   
    	Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr,columnList);
       
    	response.setContentType("application/vnd.ms-excel");
    	response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
    	response.addHeader("Set-Cookie", "fileDownload=true; path=/");
       
    	xlsxWb.write(response.getOutputStream());
    }
}