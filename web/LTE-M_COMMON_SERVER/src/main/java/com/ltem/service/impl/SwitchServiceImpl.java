package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.CodeDAO;
import com.ltem.dao.SwitchDAO;
import com.ltem.service.SwitchService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SwitchService")
public class SwitchServiceImpl extends EgovAbstractServiceImpl implements SwitchService {

	@Autowired
	SwitchDAO switchDAO;
	
	@Autowired
	CodeDAO codeDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SwitchServiceImpl.class);

	@Override
	public Map<String, List<Map<String, String>>> getSearchOption() {
		
		Map<String, List<Map<String,String>>> returnMap = new HashMap<String,List<Map<String,String>>>();
		
		List<Map<String, String>> switchList = switchDAO.getSwitchList();
		List<Map<String,String>> lineList = codeDAO.selectStationLine();
		
		returnMap.put("SWITCHLIST", switchList);
		returnMap.put("LINELIST", lineList);
		return returnMap;
	}

	@Override
	public List<Object> getSwitchDetail(HashMap<String,Object> paramMap) {
		List<Map<String, Object>> switchList = switchDAO.getSwitchDetail(paramMap);
		List<Object> resultList = new ArrayList<>();

		for(Map<String, Object> m : switchList) {
			Map<String, Object> tmpMap = new HashMap<>();
			
			int swSize = Integer.parseInt(m.get("SIZE").toString());
			String[] switchArr = new String[swSize];
			String[] switchNameArr = new String[swSize];

			tmpMap.put("LINE_ID", m.get("LINE_ID"));
			tmpMap.put("ID", m.get("SWITCH_ID"));
			tmpMap.put("NAME",m.get("SWITCH_NAME"));
			tmpMap.put("SIZE",swSize);
			tmpMap.put("TYPE",m.get("TYPE"));
			tmpMap.put("CATEGORY",m.get("CATEGORY"));
			tmpMap.put("SLOT",m.get("SLOT"));
			tmpMap.put("SORT_FLAG",m.get("SORT_FLAG"));
			tmpMap.put("SHELF",m.get("SHELF"));

			for (int i = 0; i < swSize; i++) {
				String num = i + 1 < 10 ? "0" + (i + 1) : "" + (i + 1);
				switchArr[i] = Objects.toString(m.get("PORT_" + num), "");
				switchNameArr[i] = Objects.toString(m.get("PORT_" + num + "_NAME"), "");
			}
			tmpMap.put("PORT_LIST", switchArr);
			tmpMap.put("PORT_NAME_LIST", switchNameArr);

			resultList.add(tmpMap);
		}

		return resultList;
	}

	@Override
	public int switchModify(List<HashMap<String, Object>> paramList) {
		HashMap<String, Object> qMap = new HashMap<>();
		int returnStr = 0;

		int size = 0;
		String portNo = "port";
		List portList = new ArrayList<>();

		for(Map m : paramList) {
			size = Integer.parseInt(m.get("size").toString());
			portList = (List)m.get("portArr");
			qMap.put("switchId", m.get("switchId"));
			qMap.put("slot", m.get("slot"));
			qMap.put("size", size);
			int portIdx = 0;
			for(int i = 0; i < size; i += 1) {
				portIdx = i + 1;
				qMap.put(portNo + (portIdx < 10 ? "0" + portIdx : portIdx), portList.get(i));
			}
			returnStr = switchDAO.switchModify(qMap);
		}

		return returnStr;
	}
	
	
	@Override
	public List<Object> getSwitchDescDetail(HashMap<String,Object> paramMap) {
		List<Map<String, Object>> switchList = switchDAO.getSwitchDescDetail(paramMap);
		List<Object> resultList = new ArrayList<>();

		for(Map<String, Object> m : switchList) {
			Map<String, Object> tmpMap = new HashMap<>();
			
			int swSize = Integer.parseInt(m.get("SIZE").toString());
			String[] switchArr = new String[swSize];
			String[] switchNameArr = new String[swSize];

			tmpMap.put("LINE_ID", m.get("LINE_ID"));
			tmpMap.put("ID", m.get("SWITCH_ID"));
			tmpMap.put("NAME",m.get("SWITCH_NAME"));
			tmpMap.put("SIZE",swSize);
			tmpMap.put("TYPE",m.get("TYPE"));
			tmpMap.put("CATEGORY",m.get("CATEGORY"));
			tmpMap.put("SLOT",m.get("SLOT"));
			tmpMap.put("SORT_FLAG",m.get("SORT_FLAG"));
			tmpMap.put("SHELF",m.get("SHELF"));

			for (int i = 0; i < swSize; i++) {
				String num = i + 1 < 10 ? "0" + (i + 1) : "" + (i + 1);
				switchArr[i] = Objects.toString(m.get("PORT_" + num + "_DESC"), "");
				switchNameArr[i] = Objects.toString(m.get("PORT_" + num + "_NAME"), "");
			}
			tmpMap.put("PORT_LIST", switchArr);
			tmpMap.put("PORT_NAME_LIST", switchNameArr);

			resultList.add(tmpMap);
		}

		return resultList;
	}

	@Override
	public int switchDescSave(List<String> paramList) {

		String key = "";
		String[] splitData;
		String swId = "", slot = "", shelf = "", category = "", value = "";
		
		Map<String,ArrayList<String>> kvMap = new HashMap<String,ArrayList<String>>();
		
		for(String items : paramList) {
			splitData = items.split("_", -1);
			swId = splitData[3];
			slot = splitData[2];
			shelf = splitData[1];
			category = splitData[0];
			value = "PORT_"+splitData[4]+"_DESC = "+"'"+splitData[5]+"'";
			
			key = swId+"_"+slot+"_"+shelf+"_"+category;
			
			if(kvMap.containsKey(key)) {
				kvMap.get(key).add(value);
			}else {
				kvMap.put(key, new ArrayList<String>());
				kvMap.get(key).add(value);
			}
			
		}
		
		 Set keyset = kvMap.keySet();
		 Map<String,Object> paramMap = new HashMap<String,Object>();

		for (Iterator iterator = keyset.iterator(); iterator.hasNext();) {
			String keyName = (String) iterator.next();
			ArrayList valueList = kvMap.get(keyName);

			splitData = keyName.split("_");
			swId = splitData[0];
			slot = splitData[1];
			shelf = splitData[2];
			category = splitData[3];

			paramMap.put("SWID", swId);
			paramMap.put("SLOT", slot);
			paramMap.put("SHELF", shelf);
			paramMap.put("CATEGORY", category);
			paramMap.put("SETVALUE", valueList);

			try {
				switchDAO.switchDescSave(paramMap);
			} catch (Exception e) {
				log.error("switchDescSave Error : "+e.getMessage(), e);
				return 0;
			}
		}
		
		return 1;
	}

	@Override
	public List<String> getCategoryList() {
		return switchDAO.getCategoryList();
	}
}
