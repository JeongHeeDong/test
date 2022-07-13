package com.ltem.controllers;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections.map.HashedMap;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ltem.common.CommonFunction;
import com.ltem.service.CodeService;
import com.ltem.service.SystemSmsConfigManagerService;
import com.ltem.utils.CreateExcel;

/**
 * 구성관리 > 코드 관리
 *
 */
@Controller
public class CodeController {
	private static final Logger log = LoggerFactory.getLogger(CodeController.class);

	@Autowired
	CodeService codeService;

	@Autowired
	SystemSmsConfigManagerService systemSmsConfigManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	/* 제조사 정보 */
	@RequestMapping("/pss/code/vendor")
	public String vendorPage(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pss/code/vendor";
	}
	
	@RequestMapping(value="/pss/code/vendor/list", method = RequestMethod.POST, produces = "application/json")
	public void vendorList(@RequestBody HashMap<String, String> paramMap,
							ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = codeService.getVendorList(paramMap);	
		int totalCount = codeService.getVendorTotalCount(paramMap);
		
		modelMap.addAttribute("list",list);
		modelMap.addAttribute("totalCount", totalCount);
	}
	@RequestMapping(value="/pss/code/vendor/insert",method=RequestMethod.POST, produces = "application/json")
	public void insertVendor(@RequestBody HashMap<String, String> paramMap,
							HttpSession session, ModelMap model) throws Exception {
		
		try {
			codeService.insertVendor(paramMap);
			model.addAttribute("result", "OK");
		} catch(DuplicateKeyException e) {
			model.addAttribute("result", "이미 등록된 제조사ID 입니다.");
		}
	}
	
	@RequestMapping(value="/pss/code/vendor/modify", method=RequestMethod.POST, produces = "application/json")
	public void modifyVendor(@RequestBody HashMap<String, String> paramMap, ModelMap model) throws Exception {

		codeService.updateVendor(paramMap);
		model.addAttribute("result", "OK");
	}
	@RequestMapping(value="/pss/code/vendor/delete", method=RequestMethod.POST, produces = "application/json")
	public void deleteVendor(@RequestBody List<Integer> vendorIdList,
						   ModelMap model) throws Exception {
		codeService.deleteVendor(vendorIdList);	
		model.addAttribute("result", "OK");		
	}
	
	
	/* 팀 정보 */
	@RequestMapping("/pss/code/team")
	public String teamPage(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pss/code/team";
	}
	
	@RequestMapping(value="/pss/code/team/list", method = RequestMethod.POST, produces = "application/json")
	public void teamList(@RequestBody HashMap<String, String> paramMap,
							ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = codeService.getTeamList(paramMap);	
		int totalCount = codeService.getTeamTotalCount(paramMap);
		
		modelMap.addAttribute("list",list);
		modelMap.addAttribute("totalCount", totalCount);
	}
	@RequestMapping(value="/pss/code/team/insert",method=RequestMethod.POST, produces = "application/json")
	public void insertTeam(@RequestBody HashMap<String, String> paramMap,
							HttpSession session, ModelMap model) throws Exception {
		
		try {
			codeService.insertTeam(paramMap);
			model.addAttribute("result", "OK");
		} catch(DuplicateKeyException e) {
			model.addAttribute("result", "이미 등록된 운용팀ID 입니다.");
		}
	}
	
	@RequestMapping(value="/pss/code/team/modify", method=RequestMethod.POST, produces = "application/json")
	public void modifyTeam(@RequestBody HashMap<String, String> paramMap, ModelMap model) throws Exception {

		codeService.updateTeam(paramMap);
		model.addAttribute("result", "OK");
	}
	@RequestMapping(value="/pss/code/team/delete", method=RequestMethod.POST, produces = "application/json")
	public void deleteTeam(@RequestBody List<Integer> teamIdList,
						   ModelMap model) throws Exception {
		codeService.deleteTeam(teamIdList);	
		model.addAttribute("result", "OK");		
	}
	
	/* 역 정보 */
	@RequestMapping("/pss/code/station")
	public String stationPage(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pss/code/station";
	}
	
	@RequestMapping(value="/pss/code/station/list", method = RequestMethod.POST, produces = "application/json")
	public void stationList(@RequestBody HashMap<String, String> paramMap,
							ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = codeService.getStationList(paramMap);	
		int totalCount = codeService.getStationTotalCount(paramMap);
		
		modelMap.addAttribute("list",list);
		modelMap.addAttribute("totalCount", totalCount);
	}
	@RequestMapping(value="/pss/code/station/insert",method=RequestMethod.POST, produces = "application/json")
	public void insertStation(@RequestBody HashMap<String, String> paramMap,
							HttpSession session, ModelMap model) throws Exception {
		
		try {
			int numCount = codeService.getStationNumCount(paramMap);
			if ( numCount > 0) {
				model.addAttribute("result", "이미 등록된 역사정렬코드 입니다");
			}else {
				codeService.insertStation(paramMap);
				model.addAttribute("result", "OK");
			}
		} catch(DuplicateKeyException e) {
			model.addAttribute("result", "이미 해당호선에 역사ID가 등록돼어 있습니다.");
		}
	}
	
	@RequestMapping(value="/pss/code/station/modify", method=RequestMethod.POST, produces = "application/json")
	public void modifyStation(@RequestBody HashMap<String, String> paramMap, ModelMap model) throws Exception {

		codeService.updateStation(paramMap);
		model.addAttribute("result", "OK");
	}
	@RequestMapping(value="/pss/code/station/delete", method=RequestMethod.POST, produces = "application/json")
	public void deleteStation(@RequestBody List<Integer> stationIdList,
						   ModelMap model) throws Exception {
		codeService.deleteStation(stationIdList);	
		model.addAttribute("result", "OK");		
	}
	
	/* 역라인 정보 */
	@RequestMapping(value="/pss/code/station/getStationLine", method=RequestMethod.GET)
	@ResponseBody
	public List<Map<String, String>> getStationLine(HttpServletRequest request) throws Exception {
		List<Map<String, String>> stationLine = codeService.getStationLine();
		return stationLine;
	}
	
	/* 단말 정보 */
	@RequestMapping("/pss/code/phone")
	public String phonePage(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pss/code/phone";
	}
	
	@RequestMapping(value="/pss/code/phone/list", method = RequestMethod.POST, produces = "application/json")
	public void phoneList(@RequestBody HashMap<String, String> paramMap,
							ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = codeService.getPhoneList(paramMap);	
		int totalCount = codeService.getPhoneTotalCount(paramMap);
		
		modelMap.addAttribute("list",list);
		modelMap.addAttribute("totalCount", totalCount);
	}
	@RequestMapping(value="/pss/code/phone/insert",method=RequestMethod.POST, produces = "application/json")
	public void insertPhone(@RequestBody HashMap<String, String> paramMap,
							HttpSession session, ModelMap model) throws Exception {
		
		try {
			codeService.insertPhone(paramMap);
			model.addAttribute("result", "OK");
		} catch(DuplicateKeyException e) {
			model.addAttribute("result", "이미 등록된 단말코드 입니다.");
		}
	}
	
	@RequestMapping(value="/pss/code/phone/modify", method=RequestMethod.POST, produces = "application/json")
	public void modifyPhone(@RequestBody HashMap<String, String> paramMap, ModelMap model) throws Exception {

		codeService.updatePhone(paramMap);
		model.addAttribute("result", "OK");
	}
	@RequestMapping(value="/pss/code/phone/delete", method=RequestMethod.POST, produces = "application/json")
	public void deletePhone(@RequestBody List<Integer> phoneIdList,
						   ModelMap model) throws Exception {
		codeService.deletePhone(phoneIdList);	
		model.addAttribute("result", "OK");		
	}
	
	
	
	/* 알람코드 정보 */
	@RequestMapping("/pss/code/alarm")
	public String alarmPage(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pss/code/alarm";
	}
	
	@RequestMapping(value="/pss/code/alarm/list", method = RequestMethod.POST, produces = "application/json")
	public void alarmList(@RequestBody HashMap<String, String> paramMap,
							ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = codeService.getAlarmList(paramMap);	
		int totalCount = codeService.getAlarmTotalCount(paramMap);
		
		modelMap.addAttribute("list",list);
		modelMap.addAttribute("totalCount", totalCount);
	}
	@RequestMapping(value="/pss/code/alarm/insert",method=RequestMethod.POST, produces = "application/json")
	public void insertAlarm(@RequestBody HashMap<String, String> paramMap,
							HttpSession session, ModelMap model) throws Exception {
		
		try {
			codeService.insertAlarm(paramMap);
			model.addAttribute("result", "OK");
		} catch(DuplicateKeyException e) {
			model.addAttribute("result", "이미 등록된 알람정보 입니다.");
		}
	}
	
	@RequestMapping(value="/pss/code/alarm/modify", method=RequestMethod.POST, produces = "application/json")
	public void modifyAlarm(@RequestBody HashMap<String, String> paramMap, ModelMap model) throws Exception {

		codeService.updateAlarm(paramMap);
		model.addAttribute("result", "OK");
	}
	@RequestMapping(value="/pss/code/alarm/delete", method=RequestMethod.POST, produces = "application/json")
	public void deleteAlarm(@RequestBody List<Map<String, String>> alarmIdList,
						   ModelMap model) throws Exception {
		codeService.deleteAlarm(alarmIdList);	
		model.addAttribute("result", "OK");		
	}
	@RequestMapping(value="/pss/code/alarm/getConfigInfo", method=RequestMethod.POST, produces = "application/json")
	public void getConfigInfo(ModelMap model) throws Exception {
		List<Map<String,String>> equipInfo = codeService.getSystemInfo();
		List<Map<String, String>> vendorInfo = codeService.getVendorInfo();
		model.addAttribute("equipInfo", equipInfo);
		model.addAttribute("vendorInfo", vendorInfo);
	}
	
	
	@RequestMapping(value="/pss/code/excelDown", method=RequestMethod.GET)
	@ResponseBody
	public void excelDown(@RequestParam HashMap<String, String> paramMap,
						  ModelMap modelMap,
						  HttpServletResponse response,
						  HttpServletRequest request) throws Exception {
		String page = paramMap.get("PAGE");
		CreateExcel excel = new CreateExcel();
		String fileName  = "";
		String headerStr = paramMap.get("TITLE");
		String headers = paramMap.get("HEADERS");
		String columns = paramMap.get("COLUMNS");
		String[] headerArray = headers.split(",");
		String[] columnArray = columns.split(",");
		
		ArrayList<String> headerList = new ArrayList<String>();
		ArrayList<String> columnList = new ArrayList<String>();
		Map<String, List<Map<String, String>>> excelData = new HashMap<String, List<Map<String, String>>>();
		
		for(int i=0;i<headerArray.length;i++){
			headerList.add(headerArray[i]);
		}
		for(int i=0;i<columnArray.length;i++){
			columnList.add(columnArray[i]);
		}
		
		fileName = URLEncoder.encode(headerStr, "utf-8") + ".xlsx";
		
		if("vendor".equals(page)) {
			excelData.put("제조사", codeService.getVendorList(paramMap));
		} else if("team".equals(page)) {
			excelData.put("팀", codeService.getTeamList(paramMap));
		} else if("station".equals(page)) {
			List<Map<String, String>> stationList = codeService.getStationList(paramMap);
			
			// 역사종류
//			for( Map<String, String> stationInfo: stationList) {
//				if ( "1".equals(stationInfo.get("STATION_TYPE")) ) {
//					stationInfo.put("STATION_TYPE", "환승역");
//				}else {
//					stationInfo.put("STATION_TYPE", "일반역");
//				}
//			}
			
			// 호선명 처리
//			List<Map<String, String>> stationLineList = codeService.getStationLine();
//			Map<String, String> stationLineMap = new HashedMap();
//			stationLineMap.put("0","관제센터");
//			for( Map<String, String> stationLine: stationLineList) {
//				stationLineMap.put(stationLine.get("LINE_ID"), stationLine.get("LINE_NAME"));
//			}
//			String STATION_NAME = "";
//			for( Map<String, String> stationInfo: stationList) {
//				if(stationInfo.get("STATION_LINE").indexOf(",") > 0 ){
//					String[] lineList = stationInfo.get("STATION_LINE").split(",");
//					ArrayList<String> lineNameList = new ArrayList<String>();
//					for( String line: lineList) {
//						if(stationLineMap.containsKey(line)) {
//							lineNameList.add(stationLineMap.get(line));
//						}else {
//							lineNameList.add(line);
//						}
//					}
//					StringBuilder sb = new StringBuilder();
//					for (String s : lineNameList)
//					{
//					    sb.append(s);
//					    sb.append(" ");
//					}
//					STATION_NAME = sb.toString();
//				}else if("0".equals(stationInfo.get("STATION_LINE"))) {
//					STATION_NAME = "관제센터";
//				}else {
//					if(stationLineMap.containsKey(stationInfo.get("STATION_LINE"))) {
//						STATION_NAME = stationLineMap.get(stationInfo.get("STATION_LINE"));
//					}else {
//						STATION_NAME = stationInfo.get("STATION_LINE");
//					}
//				}
//				stationInfo.put("STATION_LINE", STATION_NAME);
//			}
			//
			
			excelData.put("역사", stationList);
		} else if("phone".equals(page)) {
			excelData.put("단말", codeService.getPhoneList(paramMap));
		} else if("alarm".equals(page)) {
			excelData.put("알람코드", codeService.getAlarmList(paramMap));
		}
		
				
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr.replaceAll("_", " "), columnList);

		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");

		xlsxWb.write(response.getOutputStream());
	}
}