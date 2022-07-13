package com.ltem.controllers;

import java.net.URLEncoder;
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
import com.ltem.service.SystemDBManagerService;
import com.ltem.utils.CreateExcel;

/**
 * 시스템 > 데이터 관리 > 백업 관리
 *
 */
@Controller("SystemDBManagerController")
public class SystemDBManagerController {
	private static final Logger log = LoggerFactory.getLogger(SystemDBManagerController.class);

	@Autowired
	SystemDBManagerService systemDBManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/system/sysDBManager")
	public String sysDBManager(HttpServletRequest request,
							   HttpSession session,
							   ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "system/sysDBManager";
	}
	
	@RequestMapping(value="/system/sysDBManager/getHostName", method = RequestMethod.POST, produces = "application/json")
	public void getHostName(HttpServletRequest request,
							HttpSession session,
							ModelMap modelMap) throws Exception {
		List<String> resultList = systemDBManagerService.getHostName();
		
		modelMap.addAttribute("getHostName",resultList);
	}
	
	@RequestMapping(value="/system/sysDBManager/getTableInfo", method = RequestMethod.POST, produces = "application/json")
	public void getTableInfo(@RequestBody HashMap<String,String> paramMap,
							 ModelMap modelMap) throws Exception {
		List<Map<String,String>> resultList = systemDBManagerService.getTableInfo(paramMap);
		
		modelMap.addAttribute("tableInfo",resultList);
	}
	
	@RequestMapping(value="/system/sysDBManager/getBakData", method = RequestMethod.POST, produces = "application/json")
	public void getBakData(@RequestBody HashMap<String,String> paramMap,
						   ModelMap modelMap) throws Exception {
		Map<String,List<Map<String, String>>> resultMap = systemDBManagerService.getBakData(paramMap);	
		int totalCnt = systemDBManagerService.getTotalCnt(paramMap);
		
		modelMap.addAttribute("getBakData",resultMap);
		modelMap.addAttribute("getTotalCnt", totalCnt);
	}
	
	@RequestMapping(value="/system/sysDBManager/getOneBakData", method = RequestMethod.POST, produces = "application/json")
	public void getOneBakData(@RequestBody HashMap<String,String> paramMap,
							  ModelMap modelMap) throws Exception {
		Map<String, String> resultMap = systemDBManagerService.getOneBakData(paramMap);	
		modelMap.addAttribute("getOneBakData",resultMap);
	}
	
	@RequestMapping(value="/system/sysDBManager/insertBakData", method = RequestMethod.POST, produces = "application/json")
	public void insertBakData(@RequestBody HashMap<String,String> paramMap,
							  ModelMap modelMap) throws Exception {
		String name = paramMap.get("NAME");
		int type    = Integer.parseInt(paramMap.get("TYPE"));
		int bakDay  = Integer.parseInt(paramMap.get("DAY"));
		int expire  = Integer.parseInt(paramMap.get("EXPIRE"));
		String desc =  paramMap.get("DESC");
		
		HashMap<String, Object> requestMap = new HashMap<String, Object>();
		requestMap.put("NAME", name);
		requestMap.put("TYPE", type);
		requestMap.put("DAY", bakDay);
		requestMap.put("EXPIRE", expire);
		requestMap.put("DESC", desc);
		
		String result = "OK";
		try {
			systemDBManagerService.insertBakData(requestMap);			
		} catch ( Exception e ) {
			String msg = e.getMessage();
			
			if ( msg.contains("PRIMARY") ) {
				result = "DUP";	
				result += (type == 1)? "_HOST" : "_TABLE";
			} else {
				result = "ERR";
			}
		}
		modelMap.addAttribute("result", result);	
	}
	
	@RequestMapping(value="/system/sysDBManager/updateBakData", method = RequestMethod.POST, produces = "application/json")
	public void updateBakData(@RequestBody HashMap<String,Object> paramMap,
							  ModelMap modelMap) throws Exception {
		int result = systemDBManagerService.updateBakData(paramMap);
		modelMap.addAttribute("result", result);		
	}
	
	@RequestMapping(value="/system/sysDBManager/delBakData", method = RequestMethod.POST, produces = "application/json")
	public void delBakData(@RequestBody HashMap<String,String> paramMap,
						   ModelMap modelMap) throws Exception {
		int result = systemDBManagerService.delBakData(paramMap);
		modelMap.addAttribute("result", result);		
	}
	
	@RequestMapping(value="/system/sysDBManager/excelDown", method=RequestMethod.GET)
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
        String[] headerArray = headers.split(",");
        String[] columnArray = columns.split(",");
        
        ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        Map<String, List<Map<String, String>>> excelData = systemDBManagerService.getBakData(paramMap);
                
        List<Map<String, String>> oneList = excelData.get("bakData");        
        for ( int i = 0; i < oneList.size(); i++ ) {
        	Map<String, String> oneMap = oneList.get(i);
        	
        	String temp = String.valueOf(excelData.get("bakData").get(i).get("BACKUP_TYPE"));
        	if ( temp.equals("1") ) {
        		excelData.get("bakData").get(i).remove("BACKUP_TYPE");
        		excelData.get("bakData").get(i).put("BACKUP_TYPE","Host");
        	} else if ( temp.equals("2") ) {
        		excelData.get("bakData").get(i).remove("BACKUP_TYPE");
        		excelData.get("bakData").get(i).put("BACKUP_TYPE","Table");
        	}
        }
        
        for(int i=0;i<headerArray.length;i++){
                headerList.add(headerArray[i]);
        }
        for(int i=0;i<columnArray.length;i++){
                columnList.add(columnArray[i]);
        }
        
        fileName = URLEncoder.encode(paramMap.get("TITLE"), "utf-8") + ".xlsx";
        headerStr = paramMap.get("TITLE");
            	
    	Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr,columnList);
       
    	response.setContentType("application/vnd.ms-excel");
    	response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
    	response.addHeader("Set-Cookie", "fileDownload=true; path=/");
       
    	xlsxWb.write(response.getOutputStream());
    }
}