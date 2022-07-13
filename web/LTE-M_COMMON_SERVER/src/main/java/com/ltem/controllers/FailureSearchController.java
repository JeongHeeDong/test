package com.ltem.controllers;

import java.net.URLEncoder;
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
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.ltem.common.CommonFunction;
import com.ltem.service.FailureSearchService;

/**
 * 고장통계 > 고장조회 > 고장상세조회(미사용)
 * 고장통계 > 고장통계 > 시간별 알람통계
 *
 */
@Controller
public class FailureSearchController {

	@Autowired
	FailureSearchService failureSearchService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(FailureSearchController.class);
	
	@RequestMapping("/failureStatistic/search/failureSearch")
	public String failureSearch(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);		
		return "/failure/main/failureSearch";
	}
	
	@RequestMapping("/failureStatistic/analysis/failureAnalysisByTime")
	public String failureAnalysisByTime(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/failureAnalysisByTime";
	}
	
	@RequestMapping("/failureStatistic/analysis/failureAnalysisByEquip")
	public String failureAnalysisByEquip(HttpServletRequest request, HttpSession session, ModelMap modelMap) throws Exception {

		commonFunction.setModel(request, session, modelMap);
		return "/failure/main/failureAnalysisByEquip";
	}
	
	@RequestMapping(value="/failure/popup/searchSystemSelect/getEquipType", produces = "application/json", method = RequestMethod.POST)
	public void getEquipType(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String, List<Map<String, String>>> resultMap = failureSearchService.getEquipType(paramMap);
		model.addAttribute("getEquipTypeList",resultMap);
	
	}
	
	@RequestMapping(value="/failure/popup/searchSystemSelect/getSearchSystemList", produces = "application/json", method = RequestMethod.POST)
	public void getSearchSystemList(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultMap = failureSearchService.getSearchSystemList(paramMap);
		model.addAttribute("getSearchSystemList",resultMap);
	
	}
	
	@RequestMapping(value="/failureStatistic/search/failureSearch/searchFailureAlarm", produces = "application/json", method = RequestMethod.POST)
	public void searchFailureAlarm(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureSearchService.searchFailureAlarm(paramMap);
		model.addAttribute("searchFailureAlarmList",resultList);
		
	}
	
	@RequestMapping("/failure/main/failureSearch/searchAlarmGroupSelect")
	public void searchAlarmGroupSelect(HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureSearchService.searchAlarmGroupSelect();
		model.addAttribute("searchAlarmGroupList",resultList);
		
	}
	
	@RequestMapping(value="/failureStatistic/analysis/failureAnalysisByEquip/getAlarmAnalysisByEquip", produces = "application/json", method = RequestMethod.POST)
	public void getAlarmAnalysisByEquip(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String,Object> resultMap = failureSearchService.getAlarmAnalysisByEquip(paramMap);
		model.addAttribute("alarmCodeList",resultMap.get("alarmCodeList"));
		model.addAttribute("alarmAnalysisTableList",resultMap.get("alarmAnalysisTableList"));
		if(paramMap.get("graphType").equals("equip")){
			model.addAttribute("alarmTypeList",resultMap.get("alarmTypeList"));
			model.addAttribute("alarmAnalysisGraphList",resultMap.get("alarmAnalysisGraphList"));			
		}
	}
	
	@RequestMapping(value="/failureStatistic/analysis/failureAnalysisByEquip/getEquipAnalysisDetailData", produces = "application/json", method = RequestMethod.POST)
	public void getEquipAnalysisDetailData(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureSearchService.getEquipAnalysisDetailData(paramMap);
		model.addAttribute("equipAnalysisDetailData",resultList);
	}
	
	@RequestMapping(value="/failureStatistic/analysis/failureAnalysisByTime/getTimeAnalysisDetailData", produces = "application/json", method = RequestMethod.POST)
	public void getTimeAnalysisDetailData(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureSearchService.getTimeAnalysisDetailData(paramMap);
		model.addAttribute("timeAnalysisDetailData",resultList);
	}
	
	@RequestMapping(value="/failureStatistic/analysis/failureAnalysisByTime/getAlarmByTime", produces = "application/json", method = RequestMethod.POST)
	public void getAlarmByTime(@RequestBody HashMap<String, Object> paramMap ,HttpServletRequest request, HttpSession session, Model model) throws Exception {
		Map<String,Object> result = failureSearchService.selectAlarmByTime(paramMap);
		model.addAttribute("alarmTypeList", result.get("alarmTypeList"));
		model.addAttribute("alarmCntList", result.get("alarmCntList"));
	}
	
	@RequestMapping(value="/failure/main/failureSearch/alarmCodeSelect", produces = "application/json", method = RequestMethod.POST)
	public void alarmCodeSelect(@RequestBody HashMap<String,String> paramMap, HttpServletRequest request, HttpSession session, Model model) throws Exception {
		List<Map<String,String>> resultList = failureSearchService.alarmCodeSelect(paramMap);
		model.addAttribute("alarmCodeList",resultList);
		
	}

	@RequestMapping(value="/failureStatistic/search/failureSearch/excelExport", method=RequestMethod.GET)
	public void excelExport(HttpServletRequest request, HttpSession session,
					 @RequestParam HashMap<String,Object> paramMap,
					 ModelMap modelMap, HttpServletResponse response) throws Exception {
		log.info("get station monitoring excel export");

		Workbook xlsxWb = failureSearchService.getExcelWorkbook(paramMap);

		String fileName = "";

		try {
//			fileName = URLEncoder.encode("조치사례관리", "utf-8") + "_" + (String) paramMap.get("eventTime") + ".xlsx";
			fileName = URLEncoder.encode("고장상세조회", "utf-8") + ".xlsx";
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");

		xlsxWb.write(response.getOutputStream());
	}
}
