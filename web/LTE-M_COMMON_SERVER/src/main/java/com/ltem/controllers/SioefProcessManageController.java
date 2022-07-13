package com.ltem.controllers;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ltem.common.CommonFunction;
import com.ltem.service.SystemProcessManagerService;

/**
 * 시스템 > 서버 프로세스 관리 > 프로세스 관리
 *
 */
@Controller("SioefProcessManageController")
public class SioefProcessManageController {
	private static final Logger log = LoggerFactory.getLogger(SioefProcessManageController.class);
	
	@Autowired
	private CommonFunction commonFunction;
	
	@Autowired
	SystemProcessManagerService systemProcessManagerService;
	
	final String[] KEYS = {"ABN","NODE","GROUP","STATUS","PID","ACTIVATE TIME","Q SIZE","PROGRAM_NAME"};
	
	@RequestMapping("/system/sioefProcessManage")
	public String sioefManage(HttpServletRequest request,
						   HttpSession session,
						   ModelMap modelMap) throws Exception {
		
		commonFunction.setModel(request, session, modelMap);
	
		return "system/sioefProcessManage";
	}
	
	
	//hostList
	@RequestMapping(value="/system/sioefProcessManage/sioefHostList", method = RequestMethod.POST, produces = "application/json")
	public void getHostList(HttpServletRequest request,
							HttpSession session,
							ModelMap modelMap) throws Exception {
		List<Map<String,Object>> resultMap = systemProcessManagerService.getServerList();
		
		modelMap.addAttribute("serverList",resultMap);
	}
	
	@RequestMapping(value="/system/sioefProcessManage/sioefPortList", method = RequestMethod.POST, produces = "application/json")
	public void sioefCmdPortList(HttpServletRequest request,
					HttpSession session,
					@RequestBody HashMap<String,String> paramMap,
					ModelMap modelMap) throws Exception {	
		
		List<Map<String, Object>> protList =  systemProcessManagerService.getPortList(paramMap);
		
		modelMap.addAttribute("protList", protList);
	}
	
	//groupList
	@RequestMapping(value="/system/sioefProcessManage/sioefGroupList", method = RequestMethod.POST, produces = "application/json")
	public void sioefGroupList(HttpServletRequest request,
							HttpSession session,
							ModelMap modelMap) throws Exception {
		List<String> groupList = systemProcessManagerService.getGroupList();
		
		modelMap.addAttribute("groupList",groupList);
	}
	
	@RequestMapping(value="/system/sioefProcessManage/sioefNodeList", method = RequestMethod.POST, produces = "application/json")
	public void sioefCmdNodeList(HttpServletRequest request,
			HttpSession session,
			@RequestBody HashMap<String,String> paramMap,
			ModelMap modelMap) throws Exception {
					
		List<Map<String, Object>> nodeList = systemProcessManagerService.getNodeList(paramMap);
		
		modelMap.addAttribute("nodeList", nodeList);
	}
	
	@RequestMapping(value="/system/sioefProcessManage/getSioefStateData", method = RequestMethod.POST, produces = "application/json")
	public void sioefStateList(HttpServletRequest request,
			HttpSession session,
			@RequestBody HashMap<String,String> paramMap,
			ModelMap modelMap) throws Exception {
					
		List<Map<String, Object>> nodeList = systemProcessManagerService.getSioefStateData(paramMap);
		
		modelMap.addAttribute("nodeList", nodeList);
	}
	
	@RequestMapping(value="/system/sioefProcessManage/sioefNodeStatusUpdate", method = RequestMethod.POST, produces = "application/json")
	public void sioefNodeStatusUpdate(HttpServletRequest request,
			HttpSession session,
			@RequestBody HashMap<String,String> paramMap,
			ModelMap modelMap) throws Exception {
		
		systemProcessManagerService.sioefNodeStatusUpdate(paramMap);
		
	}
	
	private String executeCommand(String command) {

		StringBuffer output = new StringBuffer();

		Process process;
		try {
			process = Runtime.getRuntime().exec(command);

			InputStream is = process.getInputStream();

			InputStreamReader isr = new InputStreamReader(is);

			BufferedReader br = new BufferedReader(isr);

            String line = "";			
			while ((line = br.readLine())!= null) {
				output.append(line + "\n");
			}

			process.getInputStream().close();
			process.waitFor();

		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return output.toString();

	}
	
	private List<Map<String, String>> portStrParse(String sbProt){
		
		String[] values = sbProt.split("\n");
		
		int len = values.length;
		
		List<Map<String, String>> list = new ArrayList<Map<String,String>>();
		
		for(int i=0; i<len; i++){
			Map<String, String> portMap = new HashMap<String, String>();
			String[] temp = values[i].split(" +");
			if(values[i].indexOf("grep") == -1){
				String port = temp[10];
				String procName = temp[8] + " " +temp[9] + " " + temp[10] + " " + temp[11];
				portMap.put("port", port);
				portMap.put("procName", procName);
				list.add(portMap);
			}
		}	
		
		return list;
	}
		
	private List<Map<String, String>> nodesStrParse(String sbStr){
		//----으로 분할
		String[] strData = sbStr.split("\n");
		//value
		List<String> values = new ArrayList<String>();
		int len = 0;
		//node list
		List<Map<String, String>> list = new ArrayList<Map<String,String>>();
		
		//key추출, value 1차 추출
		for(int idx=0, lenght=strData.length; idx < lenght; idx++){	
			if((strData[idx].indexOf("ACT") != -1 || strData[idx].indexOf("TRM") != -1) && strData[idx].indexOf("DB") == -1){
				values.add(strData[idx]);
			}
		}

		len = values.size();
		//list에 데이터 셋팅
		for(int i=1; i<len; i++){
			Map<String, String> map = new HashMap<String, String>();
			String[] value =  values.get(i).split("[|]");
			for(int k =0,l=KEYS.length; k<l; k++){
				map.put(KEYS[k], value[k].trim());
			}
			list.add(map);
		}
		return list;
	}
	
	

	
	@RequestMapping(value="/system/sioefProcessManage/sioefCmd", method = RequestMethod.POST, produces = "application/json")
	public void sioefCmdRun(@RequestBody HashMap<String,String> paramMap,
							HttpSession session, 
							ModelMap modelMap) throws Exception {
		
		//[00] sioef_ip [05] host_ip
		String ipAddress = (String)paramMap.get("ipAddress");
		//[01] sioef_port [07] sioef_port
		String port = (String)paramMap.get("port");
		//[03] user_id
		String user_id = (String)session.getAttribute("user_id");
		//[04] host_name
		String hostName = (String)paramMap.get("hostName");
		//[06] sioef_name
		String sioefName = (String)paramMap.get("sioefName");
		//[08] group_name
		String groupName = (String)paramMap.get("groupName");
		//[09] node_name
		String nodeName = (String)paramMap.get("nodeName");
		//[10] ctrl_type
		String ctrlType = (String)paramMap.get("ctrlType");
		//[02] sioef_cmd [11] ctrl_cmd
//		String cmd ="/home/lter/mlib/Mobigen/Platform/SIOEventFlow/mfLteR "+ipAddress+" "+port+" "+ctrlType.toLowerCase()+","+nodeName;
		String cmd ="mfLteR "+ipAddress+" "+port+" "+ctrlType.toLowerCase()+","+nodeName;
		
		StringBuilder sbCmd = new StringBuilder();
		sbCmd.append(cmd+" ");
		sbCmd.append(user_id+" ");
		sbCmd.append(hostName+" ");
		sbCmd.append(ipAddress+" ");
		sbCmd.append(sioefName+" ");
		sbCmd.append(port+" ");
		sbCmd.append(groupName+" ");
		sbCmd.append(nodeName+" ");
		sbCmd.append(ctrlType+" ");
		sbCmd.append(cmd.replaceAll(" ","_#_"));
		
		log.info("mfLteR :: "+sbCmd.toString());
		
		String cmdResult = executeCommand(sbCmd.toString());
		modelMap.addAttribute("cmdResult", cmdResult);
		
	}
}
