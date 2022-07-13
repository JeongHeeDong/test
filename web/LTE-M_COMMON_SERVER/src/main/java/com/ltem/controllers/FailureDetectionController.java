package com.ltem.controllers;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ltem.common.CommonFunction;
import com.ltem.service.FailureService;
import com.ltem.utils.CreateExcel;

/**
 * 고장감시 > 고장감시
 * 고장감시 > 고장분석 > *
 *
 */
@Controller
public class FailureDetectionController {
	
	@Autowired
	FailureService failureService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(FailureDetectionController.class);
	
	@Value("#{locationconfig['alarm.audiofilepath']}")
	String audioFilePath;
	
	@RequestMapping("/failure/main/failureMain")
	public String failureDetection(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		modelMap.addAttribute("ip", request.getServerName());
		modelMap.addAttribute("websocketPort", request.getServerPort());

		commonFunction.setModel(request, session, modelMap);		
		return "/failure/main/failureMain";
	}
	
	@RequestMapping("/failure/spec/failureSpec")
	public String failureSpec(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/failureSpec";
	}
	
	@RequestMapping("/failure/spec/failureBunchSpec")
	public String failureBunchSpec(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/failureBunchSpec";
	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting")
	public String bunchFailureSetting(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/settingBunchFailure";
	}
	
	@RequestMapping("/failure/setting/unrecoveredAlarmSetting")
	public String unrecoveredAlarmSetting(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/settingUnrecoveredAlarm";
	}
	
	@RequestMapping("/failure/setting/audioSetting")
	public String audioSetting(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/settingAudio";
	}
	
	@RequestMapping("/failure/setting/failureActionCaseSetting")
	public String failureActionCaseSetting(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/settingFailureActionCase";
	}
	
	@RequestMapping(value="/failure/popup/failureDetail/getFailureData", produces = "application/json", method = RequestMethod.POST)
	public void getFailureData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String, List<Map<String,String>>> resultMap = failureService.getFailureData(paramMap);
		model.addAttribute("failureData",resultMap);
		
	}
	
	@RequestMapping(value="/failure/main/failureMain/getMajorFailureData", produces = "application/json", method = RequestMethod.POST)
	public void getMajorFailureData(@RequestBody List<HashMap<String,String>> paramList,HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String, List<Map<String,String>>> resultMap = failureService.getMajorFailureData(paramList);
		model.addAttribute("majorFailureData",resultMap);
	
	}
	
	@RequestMapping(value="/failure/popup/majorFailureDetail/getActionCaseData", produces = "application/json", method = RequestMethod.POST)
	public void getActionCaseData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String, List<Map<String,String>>> resultMap = failureService.getActionCaseData(paramMap);
		model.addAttribute("actionCaseData",resultMap);
	
	}
	
	@RequestMapping("/failure/main/failureMain/getUnrecoveredData")
	public void getUnrecoveredData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String, List<Map<String,String>>> resultMap = failureService.getUnrecoveredData();
		model.addAttribute("unrecoveredData",resultMap);
	
	}
	
	@RequestMapping("/failure/popup/failureDetail/getRopMsgData")
	public void getRopMsgData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String, List<Map<String,String>>> resultMap = failureService.getRopMsgData(paramMap);
		model.addAttribute("getRopMsgData",resultMap);
	
	}
	
	@RequestMapping("/failure/spec/failureSpec/getFailureSpecAlarm")
	public void getFailureSpecAlarm(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String, String>> resultMap = failureService.getFailureSpecAlarm(paramMap);
		Map<String,Map<String,Object>> _resultMap = failureService.getFailureSpecGraph(paramMap);
		
		model.addAttribute("failureSpecAlarm",resultMap);
		model.addAttribute("failureSpecGraph",_resultMap);
		
	
	}
	
	@RequestMapping(value="/failure/spec/failureSpec/excelDown", method=RequestMethod.GET)
    @ResponseBody
    public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpServletResponse response, HttpServletRequest request) throws Exception {
        
		CreateExcel excel = new CreateExcel();    
        String fileName  = "";
        String headerStr = "";
        String headers = paramMap.get("HEADERS").toString();
        String columns = paramMap.get("COLUMNS").toString();
        
        String faultAlarmFilter = Objects.toString(paramMap.get("faultAlarmFilter"), "");
        paramMap.put("faultAlarmFilter", Arrays.asList(faultAlarmFilter.split(",")));
        
        String[] headerArray = headers.split(",");
        String[] columnArray = columns.split(",");
        
        ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
		ArrayList<Object> tmlList = new ArrayList<>();
		paramMap.put("sortOption", tmlList);
                
        for(int i=0;i<headerArray.length;i++){
            headerList.add(headerArray[i]);
	    }
	    for(int i=0;i<columnArray.length;i++){
	            columnList.add(columnArray[i]);
	    }
	    List<Map<String, String>> oneList = new ArrayList<Map<String,String>>();
	    
	    if("spec".equals(paramMap.get("pageNm").toString())) {
	    	oneList = failureService.getFailureSpecAlarm(paramMap);
		} else if("bunch".equals(paramMap.get("pageNm").toString())) {
			oneList = failureService.getFailureBunchSpecAlarm(paramMap);
		}

        Map<String,List<Map<String,String>>> excelData = new HashMap<String,List<Map<String,String>>>();
        
        if("spec".equals(paramMap.get("pageNm"))) excelData.put("고장이력 조회", oneList);
        else excelData.put("다발고장이력 조회", oneList);
        
        fileName = URLEncoder.encode(paramMap.get("TITLE").toString(), "utf-8") + ".xlsx";
        headerStr = paramMap.get("TITLE").toString();
            	
    	Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr,columnList);
       
    	response.setContentType("application/vnd.ms-excel");
    	response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
    	response.addHeader("Set-Cookie", "fileDownload=true; path=/");
       
    	xlsxWb.write(response.getOutputStream());
    }
	
	@RequestMapping("/failure/spec/failureBunchSpec/getSearchBunchAlarms")
	public void getSearchBunchAlarms(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getSearchBunchAlarms(paramMap);
		model.addAttribute("searchBunchAlarms",resultList);
	
	}
	
	@RequestMapping(value = "/failure/spec/failureBunchSpec/getFailureBunchSpecAlarm", method = RequestMethod.POST, produces = "application/json")
	public void getFailureBunchSpecAlarm(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		
		
		List<Map<String, String>> resultList = failureService.getFailureBunchSpecAlarm(paramMap);
		Map<String,Map<String,Object>> _resultMap = failureService.getBunchGraphData(paramMap);
		
		model.addAttribute("failureBunchSpecAlarm",resultList);
		model.addAttribute("failureBunchSpecGraph",_resultMap);
	
	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting/getBunchFailureSettingData")
	public void getBunchFailureSettingData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getBunchFailureSettingData();
		model.addAttribute("bunchFailureSettingData",resultList);
	
	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting/getBunchCodeMax")
	public void getBunchCodeMax(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String,String> resultMap = failureService.getBunchCodeMax();
		
		if(!resultMap.isEmpty()){
			model.addAttribute("bunchCodeMax",resultMap.get("bunchCodeMax"));
		} else {
			model.addAttribute("bunchCodeMax",null);
		}
	
	}
	
	@RequestMapping("/failure/setting/getVendorData")
	public void getVendorData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getVendorData();
		model.addAttribute("vendorData",resultList);
	
	}
	
	@RequestMapping("/failure/setting/getEquipData")
	public void getEquipData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getEquipData();
		model.addAttribute("equipData",resultList);
	
	}

	@RequestMapping("/failure/setting/getEquipVendorData")
	public void getEquipVendorData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getEquipVendorData();
		model.addAttribute("equipVendorData",resultList);

	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting/getAlarmCodeData")
	public void getAlarmCodeData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getAlarmCodeData();
		model.addAttribute("alarmCodeData",resultList);
	
	}

	@RequestMapping("/failure/setting/failureActionCaseSetting/getSystemData")
	public void getSystemData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getSystemData(paramMap);
		model.addAttribute("systemData",resultList);
		
	}
	
	@RequestMapping("/failure/setting/failureActionCaseSetting/getAlarmCodeTableData")
	public void getAlarmCodeTableData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getAlarmCodeTableData(paramMap);
		model.addAttribute("alarmCodeTableData",resultList);
		
	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting/addBunchFailure")
	public void addBunchFailure(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String result = failureService.addBunchFailure(paramMap);
		model.addAttribute("addBunchFailureResult",result);
	
	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting/editBunchFailure")
	public void editBunchFailure(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String result = failureService.editBunchFailure(paramMap);
		model.addAttribute("editBunchFailureResult",result);
	
	}
	
	@RequestMapping("/failure/setting/bunchFailureSetting/delBunchFailure")
	public void delBunchFailure(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String result = failureService.delBunchFailure(paramList);
		model.addAttribute("delBunchFailureResult",result);
	
	}
	
	@RequestMapping("/failure/setting/failureActionCaseSetting/getActionCaseSettingData")
	public void getActionCaseSettingData(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {

		List<Map<String, String>> resultList = failureService.getActionCaseSettingData(paramMap);
		model.addAttribute("actionCaseSettingData",resultList);
	
	}
	
	@RequestMapping("/failure/setting/failureActionCaseSetting/addFailureActionCase")
	public void addFailureActionCase(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		paramMap.put("INSERT_USER", (String)session.getAttribute("user_id"));
		String result = failureService.addFailureActionCase(paramMap);
		model.addAttribute("addFailureActionCaseResult",result);
	
	}
	
	@RequestMapping("/failure/setting/failureActionCaseSetting/modifyFailureActionCase")
	public Model modifyFailureActionCase(HttpServletRequest request, HttpSession session,
									  @RequestBody HashMap<String,Object> paramMap, Model model) throws Exception {
//		paramMap.put("INSERT_USER", (String)session.getAttribute("user_id"));
		String result = failureService.modifyFailureActionCase(paramMap);
		model.addAttribute("modifyFailureActionCaseResult",result);

		return model;
	}
	
	@RequestMapping(value = "/failure/setting/failureActionCaseSetting/deleteFailureActionCase", method = RequestMethod.POST, produces = "application/json")
	public Model deleteFailureActionCase(HttpServletRequest request, HttpServletResponse response, HttpSession session,
									 @RequestBody List<HashMap<String,Object>> paramList, Model model) throws Exception {
		String result = failureService.delFailureActionCase(paramList);
		model.addAttribute("deleteFailureActionCaseResult",result);

		return model;
	}
	
	@RequestMapping("/failure/setting/audioSetting/getAudioSettingData")
	public void getAudioSettingData(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getAudioSettingData(paramMap);
		model.addAttribute("audioSettingData",resultList);
	}
	
	@RequestMapping(value="/failure/setting/audioSetting/ajaxUploadFile", method = RequestMethod.POST, produces = "application/json", consumes="multipart/form-data", headers = "content-type=application/x-www-form-urlencoded")
	public void ajaxUploadFile(
//			@RequestPart("audioFileInputCritical") MultipartFile criticalFile, 
//			@RequestPart("audioFileInputMajor") MultipartFile majorFile, 
//			@RequestPart("audioFileInputMinor") MultipartFile minorFile, 
//			@RequestPart("audioFileInputWarning") MultipartFile warningFile,
//			@RequestBody HashMap<String,String> paramMap, 
			HttpServletRequest request, HttpSession session, Model model
			) throws Exception {
		String result = failureService.addAudioFile(request);
		model.addAttribute("addAudioFileResult",result);

	}
	
	@RequestMapping("/failure/setting/unrecoveredAlarmSetting/getUnrecoveredAlarmSettingData")
	public void getUnrecoveredAlarmSettingData(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getUnrecoveredAlarmSettingData();
		model.addAttribute("unrecoveredAlarmSettingData",resultList);
	
	}
	
	@RequestMapping("/failure/setting/unrecoveredAlarmSetting/addUnrecoveredAlarmTime")
	public void addUnrecoveredAlarmTime(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String result = failureService.addUnrecoveredAlarmTime(paramList);
		model.addAttribute("addUnrecoveredAlarmTimeResult",result);
	
	}
	
	//현재 사용안함(2016.02.19)
	@RequestMapping("/failure/setting/settingUnrecoveredAlarm/addUnrecoveredAlarmCode")
	public void addUnrecoveredAlarmCode(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String result = failureService.addUnrecoveredAlarmCode(paramList);
		model.addAttribute("addUnrecoveredAlarmResult",result);
	
	}
	
	//현재 사용안함(2016.02.19)
	@RequestMapping("/failure/setting/getUnrecoveredAlarmCode")
	public void getUnrecoveredAlarmCode(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getUnrecoveredAlarmCode(paramMap);
		model.addAttribute("unrecoveredAlarmCodeResult",resultList);
	
	}
	
	
	/* -------------------------------------------------- 알람등급 필터 -------------------------------------------------- */
	@RequestMapping("/failure/main/failureMain/getAlarmGradeFilter")
	public void getAlarmGradeFilter(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		Map<String,List<Map<String,String>>> resultMap = failureService.getAlarmGradeFilter(userId);
		model.addAttribute("alarmGradeFilterList",resultMap.get("alarmGradeFilterList"));
		model.addAttribute("equipActList",resultMap.get("equipActList"));
	
	}
	
	@RequestMapping("/failure/main/failureMain/setAlarmGradeFilter")
	public void setAlarmGradeFilter(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		String result = failureService.setAlarmGradeFilter(userId, paramList);
		model.addAttribute("gradeFilterResult",result);
	
	}
	
	/* -------------------------------------------------- 알람코드 필터 -------------------------------------------------- */
	@RequestMapping("/failure/main/failureMain/gridAlarmCodeTree")
	public void gridAlarmCodeTree(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String, String>> resultList = failureService.gridAlarmCodeTree();
		model.addAttribute("alarmCodeTree",resultList);
	}
	
	@RequestMapping("/failure/main/failureMain/setAlarmCodeFilter")
	public void setAlarmCodefilter(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		String result = failureService.setAlarmCodeFilter(userId, paramList);
		model.addAttribute("codeFilterResult",result);
	}
	
	@RequestMapping("/failure/main/failureMain/getAlarmCodeFilter")
	public void getAlarmCodeFilter(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		Map<String,List<Map<String,String>>> resultMap = failureService.getAlarmCodeFilter(userId);
		model.addAttribute("codeFilterData",resultMap);
	}
	
	/* -------------------------------------------------- 장비(시스템) 필터 -------------------------------------------------- */
	@RequestMapping("/failure/main/failureMain/gridSystemTree")
	public void gridSystemTree(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String, String>> resultList = failureService.gridSystemTree();
		model.addAttribute("systemTree",resultList);
	}
	
	@RequestMapping("/failure/main/failureMain/setSystemFilter")
	public void setSystemFilter(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		String result = failureService.setSystemFilter(userId, paramList);
		model.addAttribute("systemResult",result);
	}
	
	@RequestMapping("/failure/main/failureMain/getSystemFilter")
	public void getSystemFilter(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		Map<String,List<Map<String,String>>> resultMap = failureService.getSystemFilter(userId);
		model.addAttribute("systemFilterData",resultMap);
	
	}
	
	/* -------------------------------------------------- 중요알람 필터 -------------------------------------------------- */
	@RequestMapping("/failure/main/failureMain/gridMajorAlarmTree")
	public void gridMajorAlarmTree(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String, String>> resultList = failureService.gridMajorAlarmTree();
		model.addAttribute("majorAlarmTree",resultList);
	}
	
	@RequestMapping("/failure/main/failureMain/setMajorAlarmFilter")
	public void setMajorAlarmFilter(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		String result = failureService.setMajorAlarmFilter(userId, paramList);
		model.addAttribute("majorAlarmFilterResult",result);
	}
	
	@RequestMapping("/failure/main/failureMain/getMajorAlarmFilter")
	public void getMajorAlarmFilter(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		Map<String,List<Map<String,String>>> resultMap = failureService.getMajorAlarmFilter(userId);
		model.addAttribute("majorAlarmFilterData",resultMap);
	}
	
	/* -------------------------------------------------- 역사별 필터 -------------------------------------------------- */
	@RequestMapping("/failure/main/failureMain/gridStationTree")
	public void gridStationTree(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String, String>> resultList = failureService.gridStationTree();
		model.addAttribute("stationTree",resultList);
	}
	
	@RequestMapping("/failure/main/failureMain/setStationFilter")
	public void setStationFilter(@RequestBody List<HashMap<String,String>> paramList, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
//		String userId = "TEST";
		String result = failureService.setStationFilter(userId, paramList);
		model.addAttribute("stationResult",result);
	}
	
	@RequestMapping("/failure/main/failureMain/getStationFilter")
	public void getStationFilter(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		String userId = (String) session.getAttribute("user_id");
		Map<String,List<Map<String,String>>> resultMap = failureService.getStationFilter(userId);
		model.addAttribute("stationFilterData",resultMap);
	
	}
	
	@RequestMapping("/failure/mapping/getDuStationInfo")
	public void getDuStationInfo(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureService.getDuStationInfo();
		model.addAttribute("getDuStationInfo",resultList);
	
	}

	@RequestMapping("/failure/mapping/getStationInfo")
	public void getStationInfo(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String,Object> resultMap = failureService.getStationInfo();

		model.addAttribute("getDuStationInfo", resultMap.get("duStationInfo"));
		model.addAttribute("getRuStationInfo",resultMap.get("ruStationInfo"));
		model.addAttribute("getSwitchStationInfo",resultMap.get("swStationInfo"));
		model.addAttribute("getJrgStationInfo",resultMap.get("jrgStationInfo"));
		model.addAttribute("getEquipStationInfo",resultMap.get("eqStationInfo"));
		model.addAttribute("getEpcStationInfo",resultMap.get("epcStationInfo"));
		model.addAttribute("getLineInfo",resultMap.get("lineInfo"));
	}
	
	@RequestMapping("/failure/mapping/getEquipInfo")
	public void getEquipInfo(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultMap = failureService.getEquipInfo();
		model.addAttribute("getEquipInfo", resultMap);
	}

	@RequestMapping(value="/failure/setting/failureActionCaseSetting/excelExport", method=RequestMethod.GET)
	public @ResponseBody void excelExport(HttpServletRequest request, HttpSession session,
											  @RequestBody HashMap<String,Object> paramMap,
											  ModelMap modelMap, HttpServletResponse response) throws Exception {
		log.info("get station monitoring excel export");

		Workbook xlsxWb = failureService.getExcelWorkbook(paramMap);

		String fileName = "";

		try {
//			fileName = URLEncoder.encode("조치사례관리", "utf-8") + "_" + (String) paramMap.get("eventTime") + ".xlsx";
			fileName = URLEncoder.encode("조치사례관리", "utf-8") + ".xlsx";
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");

		xlsxWb.write(response.getOutputStream());
	}

	@RequestMapping(value="/failure/popup/getActionCase/excelExport", method=RequestMethod.GET)
	public @ResponseBody void failureActionCaseExcelExport(HttpServletRequest request, HttpSession session,
											  @RequestParam HashMap<String, Object> paramMap,
											  ModelMap modelMap, HttpServletResponse response) throws Exception {
		log.info("get station monitoring excel export");
		ArrayList<Object> list = new ArrayList<>();

		Workbook xlsxWb = failureService.failureActionCaseExcelExport(paramMap);

		String fileName = "";

		try {
//			fileName = URLEncoder.encode((String) paramMap.get("title"), "utf-8") + "_" + (String) paramMap.get("eventTime") + ".xlsx";
			fileName = URLEncoder.encode("조치사례_및_고장상세_정보", "utf-8") + "_" + (String) paramMap.get("eventTime") + ".xlsx";
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");

		xlsxWb.write(response.getOutputStream());
	}
	
	@RequestMapping("/failure/main/failureMain/timeOutGuard")
	public void timeOutGuard(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		model.addAttribute("getMessage","TimeOutGuard");
	}
	
	@RequestMapping(value="/failure/main/failureMain/insertDelMsg", produces = "application/json", method = RequestMethod.POST)
	public void insertDelMsg(@RequestBody HashMap<String,String> paramMap,HttpServletRequest request, HttpSession session, Model model) throws Exception {
		int returnFlag = 0;
		returnFlag = failureService.insertDelMsg(paramMap);
		model.addAttribute("returnFlag",returnFlag);
	
	}
}
