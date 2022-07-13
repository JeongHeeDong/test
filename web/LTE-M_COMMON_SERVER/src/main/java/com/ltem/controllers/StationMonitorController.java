package com.ltem.controllers;

import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import com.ltem.common.CommonFunction;
import com.ltem.service.StationMonitorService;
import com.ltem.utils.CreateExcel;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.util.*;


/**
 * 통합감시 > 역사별 성감시
 *
 */
@Controller("StationMonitorController")
@RequestMapping("/integration/monitor")
public class StationMonitorController {
	
	private static final Logger log = LoggerFactory.getLogger(StationMonitorController.class);
	
	@Autowired
	StationMonitorService integrationMonitorStationService;

	@Autowired
	private CommonFunction commonFunction;

	@RequestMapping("/station")
	public String station(HttpServletRequest request, HttpSession session,
						  ModelMap modelMap) throws Exception {

		commonFunction.setModel(request, session, modelMap);
		log.info(request.getHeader("Cache-Control"));

		return "integrationMonitor/station";
	}

	@RequestMapping("/station/monitorTime")
	public Map<String,Object> stationTime(HttpServletRequest request, HttpSession session) throws Exception {

		Map<String,Object> resultMap = integrationMonitorStationService.getStationMonitorTime();

		return resultMap;
	}
	
	/**
	 * 통합품질 데이터
	 * @return Map<String,Object>
	 * */
	@RequestMapping("/station/getTotData")
	public Map<String,Object> getTotData(HttpServletRequest request, HttpSession session, @RequestParam HashMap<String,Object> paramMap) throws Exception {

		Map<String,Object> resultMap = integrationMonitorStationService.getTotData(paramMap);

		return resultMap;
	}
	/**
	 * 화면 역사 이미지에 들어갈 station id정보
	 * @return List
	 * */
	@RequestMapping("/station/getStationInfoData")
	public Map<String,Object> getStationInfoData(HttpServletRequest request, HttpSession session) throws Exception {

		List<Map<String,Object>> resultList = integrationMonitorStationService.getStationInfoData();
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("stationInfoData", resultList);

		return resultMap;
	}
	
	@RequestMapping(value="/station/getStationTotData", method = RequestMethod.POST, produces = "application/json")
	public Map<String,Object> getStationTotData(HttpServletRequest request, HttpSession session, @RequestBody HashMap<String,Object> paramMap) throws Exception {

		List<Map<String,Object>> resultList = integrationMonitorStationService.getStationTotData(paramMap);
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("stationTotData", resultList);

		return resultMap;
	}
	
	@RequestMapping(value="/station/getStationData", method = RequestMethod.POST, produces = "application/json")
	public Map<String,Object> getStationData(HttpServletRequest request, HttpSession session, @RequestBody HashMap<String,Object> paramMap) throws Exception {

		List<Map<String,String>> resultList = integrationMonitorStationService.getStationData(paramMap);
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		if(paramMap.get("lineId") != null) {
			resultMap.put("lineId", Integer.parseInt(paramMap.get("lineId").toString()));
		}
		resultMap.put("stationData", resultList);

		return resultMap;
	}
	
	@RequestMapping(value = "/station/trend", method = RequestMethod.POST, produces = "application/json")
	public @ResponseBody ModelMap stationGridTrend(HttpServletRequest request, HttpSession session, @RequestBody HashMap<String,Object> paramMap, ModelMap modelMap) throws Exception {

		Map<String, Object> resultMap = integrationMonitorStationService.getStationQualityTrend(paramMap);
		modelMap.addAttribute("stationQualityTrend", resultMap);

		return modelMap;

	}
	
	@RequestMapping(value="/station/excelExport", method=RequestMethod.GET)
    @ResponseBody
    public void excelExport(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpServletResponse response,HttpServletRequest request) throws Exception {
        
		CreateExcel excel = new CreateExcel();
        Map<String,List<Map<String,String>>> getExcelDownData = new HashMap<String,List<Map<String,String>>>();
        
        getExcelDownData = integrationMonitorStationService.excelExport(paramMap);
        
        String headerStr = "";
        String headers = (String)paramMap.get("headers");
        String columns = (String)paramMap.get("columns");
        
        String[] headerArray = headers.split(",");
        String[] columnArray = columns.split(",");
        
        ArrayList<String> headerList = new ArrayList<String>();
        ArrayList<String> columnList = new ArrayList<String>();
        for(int i=0;i<headerArray.length;i++){
                headerList.add(headerArray[i]);
        }
        for(int i=0;i<columnArray.length;i++){
                columnList.add(columnArray[i]);
            }
        
        String fileName = URLEncoder.encode((String)paramMap.get("title"), "utf-8")+".xlsx";
        headerStr = (String)paramMap.get("title");
      
        Workbook xlsxWb = excel.create_Excel(getExcelDownData, headerList, headerStr,columnList);
        
        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
        response.addHeader("Set-Cookie", "fileDownload=true; path=/");
        
        xlsxWb.write(response.getOutputStream());  
    }
}
