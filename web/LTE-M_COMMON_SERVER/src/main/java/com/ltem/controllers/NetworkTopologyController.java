package com.ltem.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ltem.common.CommonFunction;
import com.ltem.service.NetworkTopologyService;


/**
 * 통합감시 > 네트워크 토폴로지
 *
 */
@Controller("NetworkTopologyController")
@RequestMapping("/integration/monitor")
public class NetworkTopologyController {
	
	private static final Logger log = LoggerFactory.getLogger(NetworkTopologyController.class);
	
	@Autowired
	NetworkTopologyService networkTopologyService;

	@Autowired
	private CommonFunction commonFunction;
	
	/**
	 * 네트워크 토폴로지 화면
	 * 
	 * @param request
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/network")
	public String network(HttpServletRequest request, HttpServletResponse response, HttpSession session,
			ModelMap modelMap) throws Exception {

		modelMap.addAttribute("ip", request.getServerName());
		modelMap.addAttribute("websocketPort", request.getServerPort());

		commonFunction.setModel(request, session, modelMap);

		return "integrationMonitor/network";
	}
	
	/**
	 * 서비스장비, 주제어장치, 스위치, 응용시스템 목록 조회
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/network/getEquipList")
	@ResponseBody
	public List<Map<String, Object>> getEquipList(HttpServletRequest request, @RequestParam Map<String, Object> paramMap)
			throws Exception {
		
		if(paramMap.get("alarmFilter") == null) {
			paramMap.put("alarmFilter", 4);
		}
		
		List<Map<String, Object>> resultList = networkTopologyService.getEquipList(paramMap);

		return resultList;
	}
	
	/**
	 * DU 목록 조회
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/network/getDuList")
	@ResponseBody
	public List<Map<String, Object>> getDuList(HttpServletRequest request, @RequestParam Map<String, Object> paramMap)
			throws Exception {
		
		if(paramMap.get("alarmFilter") == null) {
			paramMap.put("alarmFilter", 4);
		}
		
		List<Map<String, Object>> resultList = networkTopologyService.getDuList(paramMap);

		return resultList;
	}
	
	/**
	 * RU 목록 조회
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/network/getRuList")
	@ResponseBody
	public List<Map<String, Object>> getRUList(HttpServletRequest request, @RequestParam Map<String, Object> paramMap)
			throws Exception {
		
		if(paramMap.get("alarmFilter") == null) {
			paramMap.put("alarmFilter", 4);
		}

		List<Map<String, Object>> resultList = networkTopologyService.getRuList(paramMap);

		return resultList;
	}
	
	/**
	 * 성능 트렌드 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/network/grid/trend", method = RequestMethod.POST, produces = "application/json")
	public ModelMap networkGridTrend(HttpServletRequest request, HttpSession session,
									 @RequestBody Map<String, Object> paramMap,
									 ModelMap modelMap) throws Exception {
		
		Map<String, Object> resultMap = networkTopologyService.getQualityTrend(paramMap);

		modelMap.addAttribute("resultMap", resultMap);

		return modelMap;
	}
	
	/**
	 * 성능 상세 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/network/grid/performanceDetail", method = RequestMethod.POST, produces = "application/json")
	public ModelMap networkTopologyGridPerformanceDetail(HttpServletRequest request, HttpSession session,
														 @RequestBody Map<String, Object> paramMap,
														 ModelMap modelMap) throws Exception {

		String systemName = (String) paramMap.get("systemName");
		String searchType = (String) paramMap.get("searchType");

		List<Map<String, Object>> performanceList = new ArrayList<>();

		try {
			performanceList = networkTopologyService.getDetailPerformance(paramMap);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		modelMap.put("TITLE", systemName);
		modelMap.addAttribute("EQUIP_TYPE", paramMap.get("equipType"));
		modelMap.addAttribute("SEARCH_TYPE", searchType);
		modelMap.addAttribute("PERFORMANCE_DETAIL", performanceList);

		return modelMap;
	}
	
	/**
	 * 고장 상세 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/network/grid/failuredetail", method = RequestMethod.POST, produces = "application/json")
	public ModelMap networkGridDetail(HttpServletRequest request, HttpSession session,
									  @RequestBody Map<String, Object> paramMap,
									  ModelMap modelMap) throws Exception {
		
		// request 에서 Model을 가져온다.
		Map<String,Object> failureMap = new HashMap<String, Object>();
		try {
			failureMap = networkTopologyService.getDetailFailure(paramMap);
		} catch(Exception e) {
			log.error(e.getMessage(), e);
		}

		modelMap.addAttribute("FAILURE_MAP", failureMap);

		return modelMap;
	}


	/**
	 * switch category 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/network/grid/getSwitchCategory", method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public ModelMap getSwitchCategory(HttpServletRequest request, HttpSession session,
										  @RequestBody Map<String, Object> paramMap,
										  ModelMap modelMap) throws Exception {

		List<Map<String, Object>> resultList = networkTopologyService.getSwitchCategory();

		modelMap.addAttribute("switchCategory", resultList);

		return modelMap;
	}
	
	/**
	 * systemList 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/network/grid/systemList", method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public ModelMap networkGridSystemList(HttpServletRequest request, HttpSession session,
										  @RequestBody Map<String, Object> paramMap,
										  ModelMap modelMap) throws Exception {

		// request 에서 Model을 가져온다.

		List<Map<String, Object>> resultList = networkTopologyService.getSystemList(paramMap);

		modelMap.addAttribute("systemList", resultList);

		return modelMap;
	}

	/**
	 * 스위치 정보 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/network/switch/portInformation", method = RequestMethod.POST, produces = "application/json")
	public ModelMap switchPortDetail(HttpServletRequest request, HttpSession session,
									 @RequestBody Map<String, Object> paramMap,
									 ModelMap modelMap) throws Exception {

		// request 에서 Model을 가져온다.
		Map<String,Object> failurePortMap = new HashMap<String, Object>();

		try {
			failurePortMap = networkTopologyService.getSwitchPortState(paramMap);
		} catch(Exception e) {
			log.error(e.getMessage());
		}

		modelMap.addAllAttributes(failurePortMap);

		return modelMap;
	}
	
	/**
	 * 서버상태 조회
	 * 
	 * @param request
	 * @param session
	 * @param paramMap
	 * @param modelMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "network/serverStatData", method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public ModelMap serverStatData(HttpServletRequest request, HttpSession session,
									 @RequestBody Map<String, Object> paramMap,
									 ModelMap modelMap) throws Exception {

		// request 에서 Model을 가져온다.
		List<Map<String, Object>> serverStatMap = new ArrayList<>();

		try {
			serverStatMap = networkTopologyService.getServerStatData(paramMap);
		} catch(Exception e) {
			log.error(e.getMessage());
		}

		modelMap.addAttribute("serverStatList",serverStatMap);

		return modelMap;
	}
	
	@RequestMapping(value = "network/getRecoverInfo", method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public ModelMap getRecoverInfo(HttpServletRequest request, HttpSession session,
									 @RequestBody Map<String, Object> paramMap,
									 ModelMap modelMap) throws Exception {

		// request 에서 Model을 가져온다.
		List<Map<String, Object>> recoverInfoMap = new ArrayList<>();

		try {
			recoverInfoMap = networkTopologyService.getRecoverInfo(paramMap);
		} catch(Exception e) {
			log.error(e.getMessage());
		}

		modelMap.addAttribute("recoverInfoList",recoverInfoMap);

		return modelMap;
	}
	
	@RequestMapping(value = "network/getRecoverEquipType", method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public ModelMap getRecoverEquipType(HttpServletRequest request, HttpSession session,
									 @RequestBody Map<String, Object> paramMap,
									 ModelMap modelMap) throws Exception {

		// request 에서 Model을 가져온다.
		List<Map<String, Object>> recoverEquipDefault = new ArrayList<>();
		List<Map<String, Object>> recoverEquipSwitch = new ArrayList<>();
		List<Map<String, Object>> recoverEquipDuRu = new ArrayList<>();
		List<Map<String, Object>> recoverEquipJrg = new ArrayList<>();

		try {
			recoverEquipDefault = networkTopologyService.getRecoverEquipDefault();
			recoverEquipSwitch = networkTopologyService.getRecoverEquipSwitch();
			recoverEquipDuRu = networkTopologyService.getRecoverEquipDuRu();
			recoverEquipJrg = networkTopologyService.getRecoverEquipJrg();
		} catch(Exception e) {
			log.error(e.getMessage());
		}

		modelMap.addAttribute("recoverEquipDefault",recoverEquipDefault);
		modelMap.addAttribute("recoverEquipSwitch",recoverEquipSwitch);
		modelMap.addAttribute("recoverEquipDuRu",recoverEquipDuRu);
		modelMap.addAttribute("recoverEquipJrg",recoverEquipJrg);

		return modelMap;
	}
	
	@Transactional(isolation = Isolation.READ_COMMITTED, timeout=3)
	@RequestMapping(value = "/network/grid/recoverdetail", method = RequestMethod.POST, produces = "application/json")
	public ModelMap recoverdetail(HttpServletRequest request, HttpSession session,
									  @RequestBody Map<String, Object> paramMap,
									  ModelMap modelMap) throws Exception {
		
		// request 에서 Model을 가져온다.
		Map<String,Object> recoverDetailMap = new HashMap<String, Object>();
		try {
			recoverDetailMap = networkTopologyService.getDetailRecover(paramMap);
			int resultStr = networkTopologyService.updateDetailRecover(paramMap);
		} catch(Exception e) {
			log.error(e.getMessage(), e);
		}

		modelMap.addAttribute("RECOVER_DETAIL_MAP", recoverDetailMap);

		return modelMap;
	}
	
}
