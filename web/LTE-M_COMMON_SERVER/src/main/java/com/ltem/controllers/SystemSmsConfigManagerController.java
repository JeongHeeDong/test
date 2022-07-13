package com.ltem.controllers;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.ltem.common.CommonFunction;
import com.ltem.service.SystemSmsConfigManagerService;
import com.ltem.utils.CreateExcel;

/**
 * 고장감시 > 고장분석 > 장애정보 알림문자 발행 설정
 *
 */
@Controller("SystemSmsConfigManagerController")
public class SystemSmsConfigManagerController {
	private static final Logger log = LoggerFactory.getLogger(SystemSmsConfigManagerController.class);

	@Autowired
	SystemSmsConfigManagerService systemSmsConfigManagerService;
	
	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/system/sysSmsConfManager")
	public String sysDBManager(HttpServletRequest request,
							   HttpSession session,
							   ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "system/sysSmsConfManager";
	}
	
	@RequestMapping(value="/system/sysSmsConfManager/getCodeForView", method = RequestMethod.POST, produces = "application/json")
	public void getCodeForView(@RequestBody HashMap<String,String> paramMap,
							   ModelMap modelMap) throws Exception {
		List<String> resultList = systemSmsConfigManagerService.getCodeForView(paramMap);			
		modelMap.addAttribute("codeForView", resultList);
	}

	@RequestMapping(value="/system/sysSmsConfManager/getConfInfo", method = RequestMethod.POST, produces = "application/json")
	public void getSmsLogData(@RequestBody HashMap<String,String> paramMap,
							  ModelMap modelMap) throws Exception {
		Map<String,List<Map<String, String>>> resultMap = systemSmsConfigManagerService.getConfInfo(paramMap);	
		int totalCnt = systemSmsConfigManagerService.getTotalCnt(paramMap);
		
		modelMap.addAttribute("getConfInfo",resultMap);
		modelMap.addAttribute("getTotalCnt", totalCnt);
	}
	
	
	@RequestMapping(value="/system/sysSmsConfManager/getPhoneInfo", method = RequestMethod.POST, produces = "application/json")
	public void getUserInfo(ModelMap modelMap, HttpSession session) throws Exception {

		HashMap<String, Object> requestMap = new HashMap<String, Object>();
		String userId     = (String)session.getAttribute("user_id");
		
		requestMap.put("userId", userId);
		List<Map<String,String>> resultList = systemSmsConfigManagerService.getPhoneInfo(requestMap);
		modelMap.addAttribute("phoneInfo",resultList);
	}
	
	@RequestMapping(value="/system/sysSmsConfManager/getSystemInfo", method = RequestMethod.POST, produces = "application/json")
	public void getSystemInfo(ModelMap modelMap) throws Exception {
		List<Map<String,String>> resultList = systemSmsConfigManagerService.getSystemInfo();
		modelMap.addAttribute("systemInfo",resultList);
	}
	
	@RequestMapping(value="/system/sysSmsConfManager/getAlarmCode", method = RequestMethod.POST, produces = "application/json")
	public void getAlarmCode(@RequestBody HashMap<String, String> paramMap,
							 ModelMap modelMap) throws Exception {
		List<Map<String,String>> resultList = systemSmsConfigManagerService.getAlarmCode(paramMap);
		modelMap.addAttribute("alarmCode",resultList);
	}
		
	@RequestMapping(value="/system/sysSmsConfManager/insertConfData", method = RequestMethod.POST, produces = "application/json")
	public void insertConfData(@RequestBody HashMap<String,Object> paramMap,
							   ModelMap modelMap, HttpSession session) throws Exception {
		String system    = (String)paramMap.get("SYSTEM");
		String num       = (String)paramMap.get("TT_NUMBER");
		String time      = (String)paramMap.get("TT_TIME");
		
		List<String> alarmList     = (List<String>) paramMap.get("ALARM");
		List<Integer> severityList = (List<Integer>)paramMap.get("SEVERITY");

		List<Map<String, Object>> alarmSet = new ArrayList<Map<String, Object>>();  
		for ( int i = 0; i < alarmList.size(); i ++ ) {
			Map<String, Object> alarmMap = new HashMap<String, Object>();
			alarmMap.put("alarm", alarmList.get(i));
			alarmMap.put("severity", severityList.get(i));
			
			alarmSet.add(alarmMap);
		}
		
		HashMap<String, Object> requestMap = new HashMap<String, Object>();
		requestMap.put("ID", session.getAttribute("user_id"));
		requestMap.put("SYSTEM", system);
		requestMap.put("ALARMSET", alarmSet);
		requestMap.put("TT_TIME", time);
		requestMap.put("TT_NUMBER", num);
		
		int result = 0;
		String msg = "";
		boolean duplicate = false;
		try {
			result = systemSmsConfigManagerService.insertConfData(requestMap);
		} catch ( Exception e ) {
			String errMsg = e.getMessage();
			if ( errMsg.contains("PRIMARY") ) {
				duplicate = true;				
			}
		} finally {
			if ( alarmList.size() == result ) {
				msg = "SUCCESS";
			}
			else {
				if ( duplicate ) {
					msg = "DUP";						
				} else {
					msg = "FAIL";					
				}
			}		
			modelMap.addAttribute("result", msg);			
		}
	}
	
//	@RequestMapping(value="/system/sysSmsConfManager/insertConfData", method = RequestMethod.POST, produces = "application/json")
//	public void insertConfData(@RequestBody HashMap<String,Object> paramMap,
//							   ModelMap modelMap, HttpSession session) throws Exception {
//		String system    = (String)paramMap.get("SYSTEM");
//		String phoenNum       = (String)paramMap.get("TT_NUMBER");
//		String time      = (String)paramMap.get("TT_TIME");
//		String id		 = (String)session.getAttribute("user_id");
//		
//		List<String> alarmList     = (List<String>) paramMap.get("ALARM");
//		List<String> severityList = (List<String>)paramMap.get("SEVERITY");
//		
//		int result = 0;
//		String msg = "";
//		boolean duplicate = false;
//		try {
//			for ( int i = 0; i < alarmList.size(); i ++ ) {
//				HashMap<String, String> alarmMap = new HashMap<String, String>();
//				String severity = severityList.get(i);
//				alarmMap.put("ALARM_CODE", alarmList.get(i));
//				alarmMap.put("SEVERITY", severity);
//				alarmMap.put("TT_TIME", time);
//				alarmMap.put("TIME", time);
//				alarmMap.put("ID", id);
//				alarmMap.put("TT_NUMBER", phoenNum);
//				alarmMap.put("PHONE", phoenNum);
//				alarmMap.put("SYSTEM", system);
//				
//				String orgPhone = systemSmsConfigManagerService.getCodePhone(alarmMap);
//				if (orgPhone.length() > 0 ) {
//					List<String> orgPhoneList = Arrays.asList(orgPhone.split(","));
//					List<String> newPhoneList = Arrays.asList(phoenNum.split(","));
//					ArrayList<String> sumPhoneList = new ArrayList<String>();
//					ArrayList<String> resultPhoneList = new ArrayList<String>();    
//					sumPhoneList.addAll(orgPhoneList);
//					sumPhoneList.addAll(newPhoneList);
//					
//					HashSet<String> distinctData = new HashSet<String>(sumPhoneList);
//					resultPhoneList = new ArrayList<String>(distinctData);
//					resultPhoneList.sort(null);
//					
//					phoenNum = resultPhoneList.toString().replace(" ", "").replace("[", "").replace("]", "");
//					alarmMap.put("TT_NUMBER", phoenNum);
//					systemSmsConfigManagerService.updateConfDataSingle(alarmMap);
//					result += 1;
//				}else {
//					systemSmsConfigManagerService.insertConfDataSingle(alarmMap);
//					result += 1;
//				}
//			}
//			
//		} catch ( Exception e ) {
//			String errMsg = e.getMessage();
//			if ( errMsg.contains("PRIMARY") ) {
//				duplicate = true;				
//			}
//		} finally {
//			if ( alarmList.size() == result ) {
//				msg = "SUCCESS";
//			}
//			else {
//				if ( duplicate ) {
//					msg = "DUP";						
//				} else {
//					msg = "FAIL";					
//				}
//			}		
//			modelMap.addAttribute("result", msg);			
//		}
//	}
	
	
	@RequestMapping(value="/system/sysSmsConfManager/updateConfData", method = RequestMethod.POST, produces = "application/json")
	public void updateConfData(@RequestBody HashMap<String,Object> paramMap,
							   ModelMap modelMap, HttpSession session) throws Exception {
		String result = ""; //사용자에게 전달할 결과
		String msg = "";  //사용자에게 전달할 메세지
				
//		String id     = (String)session.getAttribute("user_id");
		String id = (String) paramMap.get("USER_ID");
		String times  = (String)paramMap.get("TIMES");
		String oldtimes  = (String)paramMap.get("OLDTIMES");
		ArrayList<String> alarmList     = (ArrayList<String>)((ArrayList<String>)paramMap.get("alarmList")).clone();
		ArrayList<String> alarmListOld  = (ArrayList<String>) paramMap.get("alarmListOld");
		ArrayList<String> _tmpalarmList = (ArrayList<String>) alarmList.clone();
		ArrayList<Integer> severityList = (ArrayList<Integer>)paramMap.get("severityList");
		ArrayList<Integer> severityListOld = (ArrayList<Integer>) severityList.clone();
		
		//기존 알람 리스트와 비교하여 존재하는 값은 새로운 알람 리스트에서 제외
		for ( int newIdx = 0; newIdx < alarmList.size(); newIdx++ ) {
			for ( int oldIdx = 0; oldIdx < alarmListOld.size(); oldIdx++ ) {
				if ( alarmListOld.get(oldIdx).equals(alarmList.get(newIdx)) ) {
					alarmList.remove(newIdx);
					severityList.remove(newIdx);
					if ( alarmList.size() <= newIdx) {
						break;
					}
				}
			}			
		}
		for ( int oldIdx = 0; oldIdx < alarmListOld.size(); oldIdx++ ) {
			for ( int newIdx = 0; newIdx < _tmpalarmList.size(); newIdx++ ) {
				if ( alarmListOld.get(oldIdx).equals(_tmpalarmList.get(newIdx)) ) {
					alarmListOld.remove(oldIdx);
					if ( alarmListOld.size() <= oldIdx) {
						break;
					}
				}
			}			
		}
		//system이 바뀐 경우, 기존 알람 데이터 모두 삭제
		Map<String, String> system = (Map<String, String>)paramMap.get("SYSTEM");

		String originSys = system.get("originSys");
		String newSys    = system.get("newSys");
		
		String old_numbers = (String)paramMap.get("OLD_NUMBERS");
		String new_numbers = (String)paramMap.get("NEW_NUMBERS");
		
		if ( !originSys.equals(newSys)) {
			//시스템이 바뀌었을 때,
			//user_id, originSys 조건으로 모든 로우 삭제
			HashMap<String, Object> requestDel = new HashMap<String, Object>();
			requestDel.put("USER", id);
			requestDel.put("SYSTEM", originSys);
			requestDel.put("TIMES", oldtimes);
			int del_result = systemSmsConfigManagerService.delConfData(requestDel);
			
			if ( del_result > 0 ) { //기존 데이터 삭제 성공시 진행
				//flag 비교 없이 모두 추가
				List<Map<String, Object>> alarmSet = new ArrayList<Map<String, Object>>();  
				for ( int i = 0; i < alarmList.size(); i ++ ) {
					Map<String, Object> alarmMap = new HashMap<String, Object>();
					alarmMap.put("alarm", alarmList.get(i));
					alarmMap.put("severity", severityList.get(i));
					
					alarmSet.add(alarmMap);
				}
				
				HashMap<String, Object> requestInsert = new HashMap<String, Object>();
				requestInsert.put("ID", id);
				requestInsert.put("SYSTEM", newSys);
				requestInsert.put("ALARMSET", alarmSet);
				requestInsert.put("TT_TIME", times);
				requestInsert.put("TT_NUMBER", new_numbers);
				
				int ins_result = systemSmsConfigManagerService.insertConfData(requestInsert);	
				 if ( alarmList.size() == ins_result ) {
						result = "SUCCESS";
					 }
					 else {
						result = "FAIL";
					 }		
					 modelMap.addAttribute("result", result);	
			} else { 
				//기존 데이터 삭제 실패시 에러 메세지 전달
				result = "FAIL";
				modelMap.addAttribute("result", result);
				modelMap.addAttribute("msg", msg);
			}
		}else if(!old_numbers.equals(new_numbers)){
			HashMap<String, Object> requestDel = new HashMap<String, Object>();
			requestDel.put("USER", id);
			requestDel.put("SYSTEM", originSys);
			requestDel.put("TIMES", oldtimes);
			int del_result = systemSmsConfigManagerService.delConfData(requestDel);
			
			if ( del_result > 0 ) { //기존 데이터 삭제 성공시 진행
				//flag 비교 없이 모두 추가
				List<Map<String, Object>> alarmSet = new ArrayList<Map<String, Object>>();  
				ArrayList<String> _alarmList = (ArrayList<String>) paramMap.get("alarmList");
				
				for ( int i = 0; i < _alarmList.size(); i ++ ) {
					Map<String, Object> alarmMap = new HashMap<String, Object>();
					alarmMap.put("alarm", _alarmList.get(i));
					alarmMap.put("severity", severityListOld.get(i));
					
					alarmSet.add(alarmMap);
				}
				
				HashMap<String, Object> requestInsert = new HashMap<String, Object>();
				requestInsert.put("ID", id);
				requestInsert.put("SYSTEM", newSys);
				requestInsert.put("ALARMSET", alarmSet);
				requestInsert.put("TT_TIME", times);
				requestInsert.put("TT_NUMBER", new_numbers);
				
				int ins_result = systemSmsConfigManagerService.insertConfData(requestInsert);	
				 if ( _alarmList.size() == ins_result ) {
						result = "SUCCESS";
					 }
					 else {
						result = "FAIL";
					 }		
					 modelMap.addAttribute("result", result);	
			} else { 
				//기존 데이터 삭제 실패시 에러 메세지 전달
				result = "FAIL";
				modelMap.addAttribute("result", result);
				modelMap.addAttribute("msg", msg);
			}
		}else {
			//시스템이 바뀌지 않았을 때,
			List<String> oldList = (List<String>)paramMap.get("oldList");
			List<String> newList = (List<String>)paramMap.get("newList");
			//flagList 를 참조하여 insert 할지 delete 할지 결정한다.
			// old == new 이면, 무시
			// old : false, new : true, 추가
			// old : true,  new : false 삭제
			
			List<String> newAlarm     = new ArrayList<String>();
			List<Integer> newSeverity = new ArrayList<Integer>();
			
			List<String> oldAlarm = new ArrayList<String>();
			int newidx = 0;
			int oldidx = 0;
			for (int i = 0; i < oldList.size(); i++ ) {
				if ( !oldList.get(i).equals(newList.get(i)) ) {
					if ( newList.get(i).equals("true") ) {
						//새 데이터 중에 true인 것들만 모아서 리스트로 저장
						newAlarm.add( alarmList.get(newidx) );
						newSeverity.add( severityList.get(newidx) );
						
						newidx++;
					} else if ( newList.get(i).equals("false") ) {
						//예전 데이터 중 false인 것들만 모아서 리스트로 저장
						oldAlarm.add( alarmListOld.get(oldidx) );
						oldidx++;
					}
				}
			}
			if ( newAlarm.size() > 0 ) {
				//갱신할 데이터가 있다.
				
				List<Map<String, Object>> alarmSet = new ArrayList<Map<String, Object>>();
				
				for ( int i = 0; i < newAlarm.size(); i ++ ) {
					Map<String, Object> alarmMap = new HashMap<String, Object>();
					alarmMap.put("alarm", newAlarm.get(i));
					alarmMap.put("severity", newSeverity.get(i));
					
					alarmSet.add(alarmMap);
				}
				
				HashMap<String, Object> insRequest = new HashMap<String, Object>();
				
				insRequest.put("ID", id);
				insRequest.put("SYSTEM", originSys);
				insRequest.put("ALARMSET", alarmSet);
				insRequest.put("TT_TIME", times);
				insRequest.put("TT_NUMBER", new_numbers);
				
				int ins_result = systemSmsConfigManagerService.insertConfData(insRequest);		
				
				if ( newAlarm.size() == ins_result ) {
					result = "SUCCESS";
				} else {
					result = "FAIL";
					msg = "데이터 갱신 등록 실패";
				}
				
				modelMap.addAttribute("result", result);
				modelMap.addAttribute("msg", msg);						
			} 
			if ( oldAlarm.size() > 0 ) {
				//삭제할 데이터가 있다.
				HashMap<String, Object> delRequest = new HashMap<String, Object>();
				
				delRequest.put("USER", id);
				delRequest.put("SYSTEM", originSys);	
				delRequest.put("codeList", oldAlarm);
				delRequest.put("TIMES", times);
				
				int del_result  = systemSmsConfigManagerService.delConfData(delRequest);
				 if ( oldAlarm.size() == del_result ) {
						result = "SUCCESS";
				 } else {
						result = "FAIL";
						msg = "수정전 데이터 삭제 실패";
				 }		
				 modelMap.addAttribute("result", result);
				 modelMap.addAttribute("msg", msg);
			}
			
			//수정할 데이터가 없다.
			if ( newAlarm.size() == 0 && oldAlarm.size() == 0 ) {
				result = "SUCCESS";
				modelMap.addAttribute("result", result);
			}
		}	
		
		if(!oldtimes.equals(times)) {
			HashMap<String, Object> requestUpdate = new HashMap<String, Object>();
			requestUpdate.put("USER", id);
			requestUpdate.put("SYSTEM", newSys);
			requestUpdate.put("TIMES", times);
			int up_result = systemSmsConfigManagerService.updateTimes(requestUpdate);
			
			if(up_result > 0) {
				result = "SUCCESS";
			} else {
				result = "FAIL";
				msg = "수신시간 수정 실패";
			}
			modelMap.addAttribute("result", result);
			modelMap.addAttribute("msg", msg);
		}
	}
	
	@RequestMapping(value="/system/sysSmsConfManager/delConfData", method = RequestMethod.POST, produces = "application/json")
	public void delBakData(@RequestBody HashMap<String,Object> paramMap,
						   ModelMap modelMap) throws Exception {
		int result = systemSmsConfigManagerService.delConfData(paramMap);
		modelMap.addAttribute("result", result);		
	}
	
	@RequestMapping(value="/system/sysSmsConfManager/excelDown", method=RequestMethod.GET)
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
        Map<String, List<Map<String, String>>> excelData = systemSmsConfigManagerService.getExcelData(paramMap);
                
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