package com.ltem.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.PerformStatisDAO;
import com.ltem.service.PerformStatisService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("PerformStatisService")
public class PerformStatisServiceImpl extends EgovAbstractServiceImpl implements
		PerformStatisService {

	@Autowired
	PerformStatisDAO performStatisDAO;

	private static final Logger log = LoggerFactory
			.getLogger(CnEmsServiceImpl.class);

	@Override
	public List<String> getPackageVer(String equip_type) {
		return performStatisDAO.getPackageVer(equip_type);
	}

	@Override
	public int getPegCount(HashMap<String,Object> paramMap) {
		return performStatisDAO.getPegCount(paramMap);
	}

	@Override
	public HashMap<String, String> getPegComments(HashMap<String,Object> paramMap) {
		String Query = "SELECT ";
		int cnt = Integer.parseInt((String)paramMap.get("cnt"));
		for (int i = 0; i < cnt; i++) {
			Query += "(SELECT COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'NMS' AND TABLE_NAME = '";
			Query += paramMap.get("table_nm") + "' AND COLUMN_NAME = 'PEG"
					+ (i + 1) + "') PEG" + (i + 1) + ", ";
		}
		Query = Query.substring(0, Query.length() - 2);
		Query += " FROM DUAL";
		paramMap.put("Query", Query);
		return performStatisDAO.getPegComments(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getDuList(HashMap<String,Object> paramMap) {
		return performStatisDAO.getDuList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getMmeList(HashMap<String,Object> paramMap) {
		return performStatisDAO.getMmeList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getPgwList(HashMap<String,Object> paramMap) {
		return performStatisDAO.getPgwList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getSgwList(HashMap<String,Object> paramMap) {
		return performStatisDAO.getSgwList(paramMap);
	}
	
	@Override
	public List<HashMap<String, String>> getPcrfList(HashMap<String,Object> paramMap) {
		return performStatisDAO.getPcrfList(paramMap);
	}
	
	@Override
	public List<HashMap<String, String>> getSystemList(HashMap<String,Object> paramMap) {
		return performStatisDAO.getSystemList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getDataInfoList(HashMap<String,Object> paramMap) {
		
		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) {
			sortOption= (ArrayList)paramMap.get("SORTOPTION");
		}
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getDataInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getDataInfoListLength(HashMap<String,Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getDataInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getDataExcel(HashMap<String,Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		returnMap.put("excelData", performStatisDAO.getDataExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getAttachInfoList(HashMap<String,Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getAttachInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getAttachInfoListLength(HashMap<String,Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getAttachInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getAttachExcel(HashMap<String,Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getAttachExcel(paramMap));
		
		return returnMap;
	}
	

	@Override
	public List<HashMap<String, String>> getSrInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getSrInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getSrInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getSrInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getSrExcel(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getSrExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getSgsapInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getSgsapInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getSgsapInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getSgsapInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getSgsapExcel(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getSgsapExcel(paramMap));
		
		return returnMap;
	}

	@Override
	public List<HashMap<String, String>> getPgwInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getPgwInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getPgwInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getPgwInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getPgwExcel(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getPgwExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getSgwInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getSgwInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getSgwInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getSgwInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getSgwExcel(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getSgwExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getDiameterInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getDiameterInfoList(paramMap);
	}
	
	@Override
	public List<HashMap<String, String>> getDiameterInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		return performStatisDAO.getDiameterInfoListLength(paramMap);
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getDiameterExcel(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		returnMap.put("excelData", performStatisDAO.getDiameterExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getS6AInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getS6AInfoList(paramMap);
	}
	
	@Override
	public List<HashMap<String, String>> getS6AInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		return performStatisDAO.getS6AInfoListLength(paramMap);
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getS6AExcel(HashMap<String, Object> paramMap) {
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		returnMap.put("excelData", performStatisDAO.getS6AExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getS13InfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getS6AInfoList(paramMap);
	}
	
	@Override
	public List<HashMap<String, String>> getS13InfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		return performStatisDAO.getS6AInfoListLength(paramMap);
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getS13Excel(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();
		returnMap.put("excelData", performStatisDAO.getS6AExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getSPInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getS6AInfoList(paramMap);
	}
	
	@Override
	public List<HashMap<String, String>> getSPInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		return performStatisDAO.getS6AInfoListLength(paramMap);
	}
	
	@Override
	public Map<String, List<Map<String, String>>> getSPExcel(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();
		returnMap.put("excelData", performStatisDAO.getS6AExcel(paramMap));
		
		return returnMap;
	}

	@Override
	public List<HashMap<String, String>> getPcefInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getPcefInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getPcefInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getPcefInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getPcefExcel(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getPcefExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getSprInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getSprInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getSprInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getSprInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getSprExcel(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getSprExcel(paramMap));
		
		return returnMap;
	}
	
	@Override
	public List<HashMap<String, String>> getAfInfoList(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getAfInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getAfInfoListLength(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		
		return performStatisDAO.getAfInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getAfExcel(HashMap<String, Object> paramMap) {

		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();

		List<String> pegList = performStatisDAO.getPegList(paramMap);
		paramMap.put("PEGLIST", pegList);
		returnMap.put("excelData", performStatisDAO.getAfExcel(paramMap));
		
		return returnMap;
	}
	
	
	@Override
	public List<HashMap<String, String>> getRecordInfoList(HashMap<String, Object> paramMap) {
	
		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		List sortOption = new ArrayList();
		if(paramMap.containsKey("SORTOPTION")) sortOption= (ArrayList)paramMap.get("SORTOPTION");
		else paramMap.put("SORTOPTION",sortOption);
		
		return performStatisDAO.getRecordInfoList(paramMap);
	}

	@Override
	public List<HashMap<String, String>> getRecordInfoListLength(HashMap<String, Object> paramMap) {
	
		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		return performStatisDAO.getRecordInfoListLength(paramMap);
	}

	@Override
	public Map<String, List<Map<String, String>>> getRecordExcel(HashMap<String, Object> paramMap) {
	
		paramMap.put("TO", addOneDay((String)paramMap.get("TO")));
		
		Map<String, List<Map<String, String>>> returnMap = new HashMap<String, List<Map<String, String>>>();
	
		returnMap.put("excelData", performStatisDAO.getRecordExcel(paramMap));
		
		return returnMap;
	}

	private String addOneDay(String to) {
		String convertDate = "";
		
		try{
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			Calendar c = Calendar.getInstance();
			c.setTime(sdf.parse(to));
			c.add(Calendar.DATE, 1);  // number of days to add
			convertDate = sdf.format(c.getTime()); 
			
		} catch(Exception e) {
			log.error(e.getMessage());
		}
		
		
		return convertDate;
	}
}
