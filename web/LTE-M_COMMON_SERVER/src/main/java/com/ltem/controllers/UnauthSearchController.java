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
import com.ltem.service.UnauthSearchService;
import com.ltem.utils.CreateExcel;


/**
 * 보안 > 접속 관리 > 부정사용 조회
 *
 */
@Controller("UnauthSearchController")
public class UnauthSearchController {
	
	@Autowired
	UnauthSearchService unauthSearchService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(UnauthSearchController.class);
	
	@RequestMapping("/security/unauthorizedUse/unauthSearch")
	public String cnEms_page(HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		return "security/unauthorizedUse/unauthSearch";
	}
	
	
	@RequestMapping(value="/security/unauthorizedUse/unauthSearch/getUnauthData", method = RequestMethod.POST, produces = "application/json")
	public void getUnauthData(HttpServletRequest request,HttpSession session,  @RequestBody HashMap<String,Object> paramMap,ModelMap modelMap) throws Exception 
	{
		List<Map<String,String>> resultList =  unauthSearchService.getUnauthData(paramMap);
		
		modelMap.addAttribute("getUnauthData",resultList);
	}
	
	
	
	@RequestMapping(value="/security/unauthorizedUse/unauthSearch/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpSession session,HttpServletResponse response) throws Exception {
		
		List<Map<String,String>> dataList =  unauthSearchService.getUnauthData(paramMap);
		
		Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
		excelData.put("부정사용 조회 리스트", dataList);
		
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String now_date = dateFormat.format(calendar.getTime());
		
		String fileName = URLEncoder.encode("부정사용_조회_리스트", "utf-8")+now_date+".xlsx";
		String headerStr = "부정사용 조회 리스트";
		
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
	
	
	public void createCol_HeadList(ArrayList<String> columnList, ArrayList<String> headerList, HashMap<String,Object> paramMap){
		
		String type = (String)paramMap.get("type");
		
		
		columnList.add("EVENT_TIME");
		columnList.add("TYPE");
		columnList.add("ACCESS_IP");
		
		headerList.add("시간");
		headerList.add("부정사용 종류");
		headerList.add("접근 시도 IP");
		
		if ("0".equals(type)) {
			
			columnList.add("AT_ID");
			columnList.add("AT_URI");
			columnList.add("USER_IDNAME");
			columnList.add("MENU_INFO");
			
			headerList.add("접근시도 ID");
			headerList.add("접근 시도 URI");
			headerList.add("사용자 ID(이름)");
			headerList.add("메뉴명");
			
		} else if ("4".equals(type)) {
			columnList.add("AT_URI");
			columnList.add("USER_IDNAME");
			columnList.add("MENU_INFO");
			
			headerList.add("접근 시도 URI");
			headerList.add("사용자 ID(이름)");
			headerList.add("메뉴명");

		} else {
			columnList.add("AT_ID");
			headerList.add("접근시도 ID");
		}
	}
}
