package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ltem.dao.ConfigInfoManagerDAO;
import com.ltem.dao.DuSearchDAO;
import com.ltem.service.ConfigInfoManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("ConfigInfoManagerService")
public class ConfigInfoManagerServiceImpl extends EgovAbstractServiceImpl implements ConfigInfoManagerService {

	@Autowired
	ConfigInfoManagerDAO configInfoManagerDAO;
	@Autowired
	DuSearchDAO duSearchDAO;
	
	
	private static final Logger log = LoggerFactory.getLogger(ConfigInfoManagerServiceImpl.class);
	
	@Value("#{locationconfig['column.du']}")
	String du_selectcol;
	@Value("#{locationconfig['column.ru']}")
	String ru_selectcol;
	@Value("#{locationconfig['column.cell']}")
	String cell_selectcol;
	@Value("#{locationconfig['column.channel_card']}")
	String channel_selectcol;
	@Value("#{locationconfig['column.mme']}")
	String mme_selectcol;
	@Value("#{locationconfig['column.mme_node']}")
	String mmeNode_selectcol;
	@Value("#{locationconfig['column.mme_ntp']}")
	String mmeNtp_selectcol;
	@Value("#{locationconfig['column.mme_port']}")
	String mmePort_selectcol;
//	@Value("#{locationconfig['column.mme_svc']}")
//	String mme_svc_selectcol;
	@Value("#{locationconfig['column.gw']}")
	String gw_selectcol;
	@Value("#{locationconfig['column.gw_node']}")
	String gwNode_selectcol;
	@Value("#{locationconfig['column.gw_ntp']}")
	String gwNtp_selectcol;
	@Value("#{locationconfig['column.gw_port']}")
	String gwPort_selectcol;
//	@Value("#{locationconfig['column.gw_svc']}")
//	String gw_svc_selectcol;
//	@Value("#{locationconfig['column.gw_gtp']}")
//	String gw_gtp_selectcol;
//	@Value("#{locationconfig['column.ems']}")
//	String ems_selectcol;
	@Value("#{locationconfig['column.pcrf']}")
	String pcrf_selectcol;
	@Value("#{locationconfig['column.pcrf_node']}")
	String pcrfNode_selectcol;
	@Value("#{locationconfig['column.pcrf_ntp']}")
	String pcrfNtp_selectcol;
	@Value("#{locationconfig['column.pcrf_port']}")
	String pcrfPort_selectcol;
	
	
	@Value("#{locationconfig['key.du']}")
	String du_key;
	@Value("#{locationconfig['key.ru']}")
	String ru_key;
	@Value("#{locationconfig['key.cell']}")
	String cell_key;
	@Value("#{locationconfig['key.channel_card']}")
	String channel_key;
	@Value("#{locationconfig['key.mme']}")
	String mme_key;
	@Value("#{locationconfig['key.mme_node']}")
	String mmeNode_key;
	@Value("#{locationconfig['key.mme_ntp']}")
	String mmeNtp_key;
	@Value("#{locationconfig['key.mme_port']}")
	String mmePort_key;
//	@Value("#{locationconfig['key.mme_svc']}")
//	String mme_svc_key;
	@Value("#{locationconfig['key.gw']}")
	String gw_key;
	@Value("#{locationconfig['key.gw_node']}")
	String gwNode_key;
	@Value("#{locationconfig['key.gw_ntp']}")
	String gwNtp_key;
	@Value("#{locationconfig['key.gw_port']}")
	String gwPort_key;
//	@Value("#{locationconfig['key.gw_svc']}")
//	String gw_svc_key;
//	@Value("#{locationconfig['key.gw_gtp']}")
//	String gw_gtp_key;
//	@Value("#{locationconfig['key.ems']}")
//	String ems_key;
	@Value("#{locationconfig['key.pcrf']}")
	String pcrf_key;
	@Value("#{locationconfig['key.pcrf_node']}")
	String pcrfNode_key;
	@Value("#{locationconfig['key.pcrf_ntp']}")
	String pcrfNtp_key;
	@Value("#{locationconfig['key.pcrf_port']}")
	String pcrfPort_key;

	@Override
	public List<Map<String, Object>> getconfiginfoData() {
		
		HashMap<String,String> maxUpDateTime = configInfoManagerDAO.getMaxUpDateTime();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		
		returnList.add(returnCompCountData(maxUpDateTime,"du"));
		returnList.add(returnCompCountData(maxUpDateTime,"ru"));
		returnList.add(returnCompCountData(maxUpDateTime,"cell"));
		returnList.add(returnCompCountData(maxUpDateTime,"channel"));
		returnList.add(returnCompCountData(maxUpDateTime,"mme"));
		returnList.add(returnCompCountData(maxUpDateTime,"mme_node"));
		returnList.add(returnCompCountData(maxUpDateTime,"mme_ntp"));
		returnList.add(returnCompCountData(maxUpDateTime,"mme_port"));
//		returnList.add(returnCompCountData(maxUpDateTime,"mme_svc"));
		returnList.add(returnCompCountData(maxUpDateTime,"gw"));
		returnList.add(returnCompCountData(maxUpDateTime,"gw_node"));
		returnList.add(returnCompCountData(maxUpDateTime,"gw_ntp"));
		returnList.add(returnCompCountData(maxUpDateTime,"gw_port"));
//		returnList.add(returnCompCountData(maxUpDateTime,"gw_svc"));
//		returnList.add(returnCompCountData(maxUpDateTime,"gw_gtp"));
//		returnList.add(returnCompCountData(maxUpDateTime,"ems"));
		returnList.add(returnCompCountData(maxUpDateTime,"pcrf"));
		returnList.add(returnCompCountData(maxUpDateTime,"pcrf_node"));
		returnList.add(returnCompCountData(maxUpDateTime,"pcrf_ntp"));
		returnList.add(returnCompCountData(maxUpDateTime,"pcrf_port"));
		
		return returnList;
	}
	
	
	@Override
	public Map<String, Object> getGridData(HashMap<String,String> paramMap) {
		
		Map<String,Object> returnMap = returnCompListData(paramMap);
		
		return returnMap;
	}
	
	
	
	private Map<String,Object> returnCompCountData(HashMap<String,String> maxUpDateTime,String type){
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		HashMap<String,Object> paramMap = new HashMap<String,Object>();
		List<Map<String,Object>> standardList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> compareList = new ArrayList<Map<String,Object>>();
		
		paramMap = getTableName(type);
		paramMap.put("COL", getColString(type));
		
		if("du".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("DU_UPDATETIME"));
			paramMap.put("EQUIP", "기지국(DU)");
		}else if("ru".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("RU_UPDATETIME"));
			paramMap.put("EQUIP", "중계기(RU)");
		}else if("cell".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("CELL_UPDATETIME"));
			paramMap.put("EQUIP", "CELL");
		}else if("channel".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("CHANNEL_UPDATETIME"));
			paramMap.put("EQUIP", "CHANNEL CARD");
		}else if("mme".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("MME_UPDATETIME"));
			paramMap.put("EQUIP", "MME");
		}else if("mme_node".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("MME_NODE_UPDATETIME"));
			paramMap.put("EQUIP", "MME NODE");
		}else if("mme_ntp".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("MME_NTP_UPDATETIME"));
			paramMap.put("EQUIP", "MME NTP");
		}else if("mme_port".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("MME_PORT_UPDATETIME"));
			paramMap.put("EQUIP", "MME PORT");
		}
//		else if("mme_svc".equals(type)){
//			paramMap.put("UPDATETIME", maxUpDateTime.get("MME_SVC_UPDATETIME"));
//			paramMap.put("EQUIP", "MME SVC MYIP");
//		}
		else if("gw".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("GW_UPDATETIME"));
			paramMap.put("EQUIP", "GW");
		}else if("gw_node".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("GW_NODE_UPDATETIME"));
			paramMap.put("EQUIP", "GW NODE");
		}else if("gw_ntp".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("GW_NTP_UPDATETIME"));
			paramMap.put("EQUIP", "GW NTP");
		}else if("gw_port".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("GW_PORT_UPDATETIME"));
			paramMap.put("EQUIP", "GW PORT");
		}
//		else if("gw_svc".equals(type)){
//			paramMap.put("UPDATETIME", maxUpDateTime.get("GW_SVC_UPDATETIME"));
//			paramMap.put("EQUIP", "GW SVC MYIP");
//		}else if("gw_gtp".equals(type)){
//			paramMap.put("UPDATETIME", maxUpDateTime.get("GW_GTP_UPDATETIME"));
//			paramMap.put("EQUIP", "GW GTP INTF");
//		}
//		else{
//			paramMap.put("UPDATETIME", maxUpDateTime.get("EMS_UPDATETIME"));
//			paramMap.put("EQUIP", "관리장치(EMS)");
//		}
		else if("pcrf".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("PCRF_UPDATETIME"));
			paramMap.put("EQUIP", "PCRF");
		}
		else if("pcrf_node".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("PCRF_NODE_UPDATETIME"));
			paramMap.put("EQUIP", "PCRF NODE");
		}else if("pcrf_ntp".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("PCRF_NTP_UPDATETIME"));
			paramMap.put("EQUIP", "PCRF NTP");
		}else if("pcrf_port".equals(type)){
			paramMap.put("UPDATETIME", maxUpDateTime.get("PCRF_PORT_UPDATETIME"));
			paramMap.put("EQUIP", "PCRF PORT");
		}
		
		standardList = configInfoManagerDAO.getStandardList(paramMap);
		compareList = configInfoManagerDAO.getCompareList(paramMap);
		
		returnMap = compCount(standardList,compareList,type);
		returnMap.put("EQUIP", (String)paramMap.get("EQUIP"));
		returnMap.put("UPDATETIME", (String)paramMap.get("UPDATETIME"));
		returnMap.put("TYPE", type);
		
		return returnMap;
	}
	
	private Map<String,Object> returnCompListData(HashMap<String,String> map){
		
		Map<String,Object> returnMap = new HashMap<String,Object>();
		HashMap<String,Object> paramMap = new HashMap<String,Object>();
		List<Map<String,Object>> standardList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> compareList = new ArrayList<Map<String,Object>>();
		
		String type = map.get("type");
		String dateTime = map.get("dateTime");
		
		paramMap = getTableName(type);
		paramMap.put("COL", getColString(type));
		paramMap.put("UPDATETIME", dateTime);
		
		standardList = configInfoManagerDAO.getStandardList(paramMap);
		compareList = configInfoManagerDAO.getCompareList(paramMap);
		
		returnMap = compList(standardList,compareList,type);
		
		List<Map<String,String>> headerMap = configInfoManagerDAO.getHeaderList((String)paramMap.get("COMPTABLE"));
		
		returnMap.put("HEADER", getHeader(headerMap,getColString(type)));
		returnMap.put("COLUMN", getColString(type));
		
		return returnMap;
	}
	
	private HashMap<String,Object> compCount(List<Map<String,Object>> standardList, List<Map<String,Object>> compareList,String type){
		
		String stdStr = "";
		String compStr = "";
		int addCnt = 0;
		int modCnt = 0;
		int delCnt = 0;
		boolean countCheck = false;
		HashMap<String,Object> returnMap = new HashMap<String,Object>();
		
		String[] keyList = getKeyString(type);
		
		try{
		
			for(Map<String,Object> stdMap : standardList){
				
				stdStr = "";
				
				for(String key : keyList){
					stdStr += stdMap.get(key)==null?"":stdMap.get(key).toString()+"|";
				}
				
				countCheck = false;
				
				for(Map<String,Object> compMap : compareList){
					
					compStr = "";
					
					for(String key : keyList){
						compStr += compMap.get(key)==null?"":compMap.get(key).toString()+"|";
					}
					
					if(stdStr.equals(compStr)){
						countCheck = true;
						if(modifyCheck(stdMap,compMap,type))
							modCnt++;
						break;
					}
				}
				
				if(!countCheck)
					delCnt++;
			}
			
			for(Map<String,Object> compMap : compareList){
				
				compStr = "";
				
				for(String key : keyList){
					compStr += compMap.get(key)==null?"":compMap.get(key).toString()+"|";
				}
				
				countCheck = false;
				
				for(Map<String,Object> stdMap : standardList){
					
					stdStr = "";
					
					for(String key : keyList){
						stdStr += stdMap.get(key)==null?"":stdMap.get(key).toString()+"|";
					}
					
					if(compStr.equals(stdStr)){
						countCheck = true;
						break;
					}
				}
				
				if(!countCheck)
					addCnt++;
			}
			
		}catch(Exception e){
			log.error(e.getMessage());
		}
		
		returnMap.put("ADDCNT", addCnt);
		returnMap.put("MODCNT", modCnt);
		returnMap.put("DELCNT", delCnt);
		
		return returnMap;
	}
	
	private HashMap<String,Object> compList(List<Map<String,Object>> standardList, List<Map<String,Object>> compareList,String type){
		String stdStr = "";
		String compStr = "";
		List<Map<String,Object>> addList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> modList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> modCompList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> delList = new ArrayList<Map<String,Object>>();
		boolean countCheck = false;
		HashMap<String,Object> returnMap = new HashMap<String,Object>();
		
		String[] keyList = getKeyString(type);
		
		try{
		
			for(Map<String,Object> stdMap : standardList){
				
				stdStr = "";
				
				for(String key : keyList){
					stdStr += stdMap.get(key)==null?"":stdMap.get(key).toString()+"|";
				}
				
				countCheck = false;
				
				for(Map<String,Object> compMap : compareList){
					
					compStr = "";
					
					for(String key : keyList){
						compStr += compMap.get(key)==null?"":compMap.get(key).toString()+"|";
					}
					
					if(stdStr.equals(compStr)){
						countCheck = true;
						if(modifyCheck(stdMap,compMap,type)){
							modList.add(stdMap);
							modCompList.add(compMap);
						}
						break;
					}
				}
				
				if(!countCheck)
					delList.add(stdMap);
			}
			
			for(Map<String,Object> compMap : compareList){
				
				compStr = "";
				
				for(String key : keyList){
					compStr += compMap.get(key)==null?"":compMap.get(key).toString()+"|";
				}
				
				countCheck = false;
				
				for(Map<String,Object> stdMap : standardList){
					
					stdStr = "";
					
					for(String key : keyList){
						stdStr += stdMap.get(key)==null?"":stdMap.get(key).toString()+"|";
					}
					
					if(compStr.equals(stdStr)){
						countCheck = true;
						break;
					}
				}
				
				if(!countCheck)
					addList.add(compMap);
			}
			
		}catch(Exception e){
			log.error(e.getMessage());
		}
		
		returnMap.put("ADDLIST", addList);
		returnMap.put("MODLIST", modList);
		returnMap.put("MODCOMPLIST", modCompList);
		returnMap.put("DELLIST", delList);
		
		return returnMap;
	}
	
	private boolean modifyCheck(Map<String,Object> stdMap, Map<String,Object> compMap,String type){
		
		boolean check = true;
		String[] col = getColString(type);
		String stdCol = "";
		String compCol = "";
		
		for(String column : col){
			stdCol += stdMap.get(column)==null?"":stdMap.get(column).toString();
			compCol += compMap.get(column)==null?"":compMap.get(column).toString();
		}
		
		if(stdCol.equals(compCol))
			check = false;
		return check;
	}
	
	private ArrayList<String> getHeader(List<Map<String, String>> headerMap, String[] colList){
		ArrayList<String> returnList = new ArrayList<String>();
		String header = "";
		
		for(String col : colList){
			for(Map<String,String> map : headerMap){
				
				if(col.equals(map.get("COLUMN_NAME"))){
					header = map.get("COLUMN_COMMENT").equals("")?col:map.get("COLUMN_COMMENT");
					break;
				}
			}
			returnList.add(header);
		}
		
		return returnList;
	}


	@Override
	public int checkAdd(HashMap<String, Object> paramMap) {
		
		String type = (String)paramMap.get("type");
		ArrayList<HashMap<String,Object>> rows = (ArrayList) paramMap.get("rows");
		
		String[] colList = getColString(type);
		ArrayList<String> colListArray = new ArrayList<String>();
		ArrayList<Object> valueList;
		
		for(String col : colList){
			colListArray.add(col);
		}
		
		if("ru".equals(type)){
			colListArray.add("C_UID");
			colListArray.add("P_CUID");
		}else if("du".equals(type) || "cell".equals(type)){
			colListArray.add("C_UID");
		}
		
		Map<String,Object> valueMap = new HashMap<String,Object>();
		valueMap.put("columns", colListArray);
		HashMap<String,Object> tableMap = getTableName(type);
		valueMap.put("table_nm", (String)tableMap.get("STDTABLE"));
		
		int returnFlag = 0;
		
		for(HashMap<String,Object> map : rows){
			valueList = new ArrayList<Object>();
			
			for(String std : colListArray){
				if("ru".equals(type) && "C_UID".equals(std)){
					valueList.add("(SELECT CONCAT(IFNULL(MAX(CONVERT(RU.C_UID,UNSIGNED))+1,100000001)) FROM TB_CO_RU AS RU)");
				}else if(("ru".equals(type) && "P_CUID".equals(std)) || ("cell".equals(type) && "C_UID".equals(std))){
					valueList.add("(SELECT DU.C_UID FROM TB_CO_DU AS DU WHERE DU.DU_ID = "+map.get("DU_ID")+")");
				}else if("du".equals(type) && "C_UID".equals(std)){
					valueList.add("(SELECT CONCAT(MAX(CONVERT(DU.C_UID,UNSIGNED))+1) FROM TB_CO_DU AS DU)");
				}else{
					std = std.contains("'")?std.replaceAll("'", "\'"):std;
					valueList.add("'"+map.get(std)+"'");
				}
			}
			
			valueMap.put("values", valueList);
			try{
				configInfoManagerDAO.checkAdd(valueMap);
				HashMap<String,Object> requestParam = new HashMap<String,Object>();
				
				if("du".equals(type)){
					requestParam.put("system_id", map.get("DU_ID"));
					requestParam.put("equip_name", map.get("DU_NAME"));
					requestParam.put("equip_type", "2");
					int chkRst = duSearchDAO.equipActCheckResult(requestParam);
					if (chkRst > 0 ) {
						duSearchDAO.duEquipAct_update(requestParam);
					}else {
						requestParam.put("node", "A_SIDE");
						requestParam.put("defaultActSby", "A");
						requestParam.put("currentActSby", "A");
						duSearchDAO.duAddEquipAct(requestParam);
						requestParam.put("node", "B_SIDE");
						requestParam.put("defaultActSby", "S");
						requestParam.put("currentActSby", "S");
						duSearchDAO.duAddEquipAct(requestParam);
					}
				}
				
				
			}catch(Exception e){
				log.error(e.getMessage());
				returnFlag = 1;
				return returnFlag;
			}
		}
		
		return 0;
	}
	
	@Override
	public int checkMod(HashMap<String, Object> paramMap) {
		
		String type = (String)paramMap.get("type");
		ArrayList<HashMap<String,Object>> rows = (ArrayList) paramMap.get("rows");
		HashMap<String,Object> selectMap = new HashMap<String,Object>();
		String[] colList = getColString(type);
		String[] keyColList = getKeyString(type);
		String valueWhere;
		String keyWhere = "";
		
		HashMap<String,Object> valueMap = new HashMap<String,Object>();
		valueMap.put("COL", colList);
		HashMap<String,Object> tableMap = getTableName(type);
		valueMap.put("STDTABLE", (String)tableMap.get("STDTABLE"));
		valueMap.put("COMPTABLE", (String)tableMap.get("COMPTABLE"));
		valueMap.put("UPDATETIME", (String)paramMap.get("dateTime"));
		
		int returnFlag = 0;
		
		for(HashMap<String,Object> map : rows){
			valueWhere = "";
			keyWhere = " 1=1 ";
			
			for(String key : keyColList){
				keyWhere += " AND "+key+"= '"+map.get(key)+"' ";
			}
			valueMap.put("KEYS", keyWhere);
			
			selectMap = configInfoManagerDAO.getModSelectMap(valueMap);
			
			for(String std : colList){
				
				if(null != selectMap.get(std)){
					String value = selectMap.get(std).toString();
					
					value = value.contains("'")?value.replaceAll("[']", "\\\\'"):value;
					valueWhere += std+"= '"+value+"',";
				}else {
					valueWhere += std+"= null,";
				}
				
			}
			
			valueWhere = valueWhere.substring(0,valueWhere.length()-1);
			valueMap.put("VALUES", valueWhere);
			
			try{
				configInfoManagerDAO.checkMod(valueMap);
				if ("du".equals(type) ){
					for(HashMap<String,Object> duinfo : rows){
						valueMap.put("system_id",duinfo.get("DU_ID"));
						valueMap.put("system_name",selectMap.get("DU_NAME"));
						valueMap.put("system_type","2");
						int returnStr = duSearchDAO.duEquipAct_update(valueMap);
					}
				}
			}catch(Exception e){
				log.error(e.getMessage());
				returnFlag = 1;
				return returnFlag;
			}
		}
		
		
		return 0;
	}
	
	@Override
	public int checkDel(HashMap<String, Object> paramMap) {
		
		String type = (String)paramMap.get("type");
		ArrayList<HashMap<String,Object>> rows = (ArrayList) paramMap.get("rows");
		
		String[] keyList = getKeyString(type);
		String keyWhere = "";
		
		Map<String,Object> valueMap = new HashMap<String,Object>();
		HashMap<String,Object> tableMap = getTableName(type);
		valueMap.put("table_nm", (String)tableMap.get("STDTABLE"));
		
		int returnFlag = 0;
		
		for(HashMap<String,Object> map : rows){
			keyWhere = "";
			
			for(String key : keyList){
				keyWhere+=key+"='"+map.get(key)+"' AND ";
			}
			
			valueMap.put("KEYS", keyWhere.substring(0,keyWhere.length()-5));
			try{
				configInfoManagerDAO.checkDel(valueMap);
				if ("du".equals(type) ){
					for(HashMap<String,Object> duinfo : rows){
						valueMap.put("system_id",duinfo.get("DU_ID"));
						valueMap.put("equip_name",map.get("DU_NAME"));
						valueMap.put("equip_type","2");
						duSearchDAO.duEquipAct_delete(valueMap);
					}
				}
			}catch(Exception e){
				log.error(e.getMessage());
				returnFlag = 1;
				return returnFlag;
			}
		}
		
		
		return 0;
	}
	
	private String[] getKeyString(String type){
		if("du".equals(type)){
			return du_key.split(",");
		}else if("ru".equals(type)){
			return ru_key.split(",");
		}else if("cell".equals(type)){
			return cell_key.split(",");
		}else if("channel".equals(type)){
			return channel_key.split(",");
		}else if("mme".equals(type)){
			return mme_key.split(",");
		}else if("mme_node".equals(type)){
			return mmeNode_key.split(",");
		}else if("mme_ntp".equals(type)){
			return mmeNtp_key.split(",");
		}else if("mme_port".equals(type)){
			return mmePort_key.split(",");
		}
//		else if("mme_svc".equals(type)){
//			return mme_svc_key.split(",");
//		}
		else if("gw".equals(type)){
			return gw_key.split(",");
		}else if("gw_node".equals(type)){
			return gwNode_key.split(",");
		}else if("gw_ntp".equals(type)){
			return gwNtp_key.split(",");
		}else if("gw_port".equals(type)){
			return gwPort_key.split(",");
		}else if("pcrf".equals(type)){
			return pcrf_key.split(",");
		}else if("pcrf_node".equals(type)){
			return pcrfNode_key.split(",");
		}else if("pcrf_ntp".equals(type)){
			return pcrfNtp_key.split(",");
		}else{
			return pcrfPort_key.split(",");
		}
//		else if("gw_svc".equals(type)){
//			return gw_svc_key.split(",");
//		}else{
//			return gw_gtp_key.split(",");
//		}
//		else{
//			return ems_key.split(",");
//		}
	}
	
	private String[] getColString(String type){
		if("du".equals(type)){
			return du_selectcol.split(",");
		}else if("ru".equals(type)){
			return ru_selectcol.split(",");
		}else if("cell".equals(type)){
			return cell_selectcol.split(",");
		}else if("channel".equals(type)){
			return channel_selectcol.split(",");
		}else if("mme".equals(type)){
			return mme_selectcol.split(",");
		}else if("mme_node".equals(type)){
			return mmeNode_selectcol.split(",");
		}else if("mme_ntp".equals(type)){
			return mmeNtp_selectcol.split(",");
		}else if("mme_port".equals(type)){
			return mmePort_selectcol.split(",");
		}
//		else if("mme_svc".equals(type)){
//			return mme_svc_selectcol.split(",");
//		}
		else if("gw".equals(type)){
			return gw_selectcol.split(",");
		}else if("gw_node".equals(type)){
			return gwNode_selectcol.split(",");
		}else if("gw_ntp".equals(type)){
			return gwNtp_selectcol.split(",");
		}else if("gw_port".equals(type)){
			return gwPort_selectcol.split(",");
		}else if("pcrf".equals(type)){
			return pcrf_selectcol.split(",");
		}else if("pcrf_node".equals(type)){
			return pcrfNode_selectcol.split(",");
		}else if("pcrf_ntp".equals(type)){
			return pcrfNtp_selectcol.split(",");
		}else{
			return pcrfPort_selectcol.split(",");
		}
//		else if("gw_svc".equals(type)){
//			return gw_svc_selectcol.split(",");
//		}else{
//			return gw_gtp_selectcol.split(",");
//		}
//		else{
//			return ems_selectcol.split(",");
//		}
	}
	
	private HashMap<String,Object> getTableName(String type){
		
		HashMap<String,Object> returnMap = new HashMap<String,Object>();
		
		if("du".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_DU");
			returnMap.put("COMPTABLE", "TB_CO_DU_RAW");
		}else if("ru".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_RU");
			returnMap.put("COMPTABLE", "TB_CO_RU_RAW");
		}else if("cell".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_CELL_MAP");
			returnMap.put("COMPTABLE", "TB_CO_CELL_MAP_RAW");
		}else if("channel".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_CHANNEL_CARD");
			returnMap.put("COMPTABLE", "TB_CO_CHANNEL_CARD_RAW");
		}else if("mme".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_MME");
			returnMap.put("COMPTABLE", "TB_CO_MME_RAW");
		}else if("mme_node".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_MME_NODE");
			returnMap.put("COMPTABLE", "TB_CO_MME_NODE_RAW");
		}else if("mme_ntp".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_MME_NTP");
			returnMap.put("COMPTABLE", "TB_CO_MME_NTP_RAW");
		}else if("mme_port".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_MME_PORT");
			returnMap.put("COMPTABLE", "TB_CO_MME_PORT_RAW");
		}
//		else if("mme_svc".equals(type)){
//			returnMap.put("STDTABLE", "TB_CO_MME_SVC_MYIP");
//			returnMap.put("COMPTABLE", "TB_CO_MME_SVC_MYIP_RAW");
//		}
		else if("gw".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_PGW");
			returnMap.put("COMPTABLE", "TB_CO_PGW_RAW");
		}else if("gw_node".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_GW_NODE");
			returnMap.put("COMPTABLE", "TB_CO_GW_NODE_RAW");
		}else if("gw_ntp".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_GW_NTP");
			returnMap.put("COMPTABLE", "TB_CO_GW_NTP_RAW");
		}else if("gw_port".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_GW_PORT");
			returnMap.put("COMPTABLE", "TB_CO_GW_PORT_RAW");
		}else if("pcrf".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_PCRF");
			returnMap.put("COMPTABLE", "TB_CO_PCRF_RAW");
		}else if("pcrf_node".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_PCRF_NODE");
			returnMap.put("COMPTABLE", "TB_CO_PCRF_NODE_RAW");
		}else if("pcrf_ntp".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_PCRF_NTP");
			returnMap.put("COMPTABLE", "TB_CO_PCRF_NTP_RAW");
		}else if("pcrf_port".equals(type)){
			returnMap.put("STDTABLE", "TB_CO_PCRF_PORT");
			returnMap.put("COMPTABLE", "TB_CO_PCRF_PORT_RAW");
		}
//		else if("gw_svc".equals(type)){
//			returnMap.put("STDTABLE", "TB_CO_PGW_SVC_MYIP");
//			returnMap.put("COMPTABLE", "TB_CO_PGW_SVC_MYIP_RAW");
//		}else if("gw_gtp".equals(type)){
//			returnMap.put("STDTABLE", "TB_CO_PGW_GTP_INTF");
//			returnMap.put("COMPTABLE", "TB_CO_PGW_GTP_INTF_RAW");
//		}
//		else{
//			returnMap.put("STDTABLE", "TB_CO_EMS");
//			returnMap.put("COMPTABLE", "TB_CO_EMS_RAW");
//		}
		return returnMap;
	}
}
