package com.ltem.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemSmsStatisticsDAO;
import com.ltem.service.SystemSmsStatisticsService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemSmsStatisticsService")
public class SystemSmsStatisticsServiceImpl extends EgovAbstractServiceImpl implements SystemSmsStatisticsService {

	@Autowired
	SystemSmsStatisticsDAO systemSmsStatisticsDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemSmsStatisticsServiceImpl.class);

	@Override
	public List<Map<String, String>> getStatisticsData(HashMap<String, Object> paramMap) {
		List<Map<String, String>> totalList = new ArrayList<Map<String, String>>();
		List<Map<String, String>> tempList = new ArrayList<Map<String, String>>();
		List<Map<String, String>> resultList = new ArrayList<Map<String, String>>();
		
		try {
			tempList = systemSmsStatisticsDAO.getStatisticsData(paramMap);
			
			String chk_number = (String)paramMap.get("chk_number");
			if("true".equals(chk_number)){
				for(Map<String,String> map : tempList){
					String[] numbers = map.get("TT_NUMBER").split(",");
					
					if(numbers.length > 1){
						HashMap<String,String> tempMap = (HashMap<String,String>)map;
						for(String str : numbers){
							tempMap.put("TT_NUMBER", str);
							totalList.add((HashMap<String,String>)tempMap.clone());
						}
					}else{
						totalList.add(map);
					}
				}
			}else{
				totalList = tempList;
			}
			
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		
		if(totalList.size() != 0){
			
			if(paramMap.containsKey("sortOption") && ((List<Map<String, String>>) paramMap.get("sortOption")).size() > 0){
				ListMapComparator comp = new ListMapComparator((List<Map<String, String>>) paramMap.get("sortOption"));
				Collections.sort(totalList, comp);
			}
			
			if(paramMap.containsKey("pageNo")){
				int pageNo = (Integer)paramMap.get("pageNo");
				int pagingNum = (Integer)paramMap.get("pagingNum");
				
				try{
					for( ; pageNo < pagingNum; pageNo++){
						resultList.add(totalList.get(pageNo));
					}
				}catch(IndexOutOfBoundsException e){}
				
				resultList.get(0).put("TOTAL_COUNT", totalList.size()+"");
				
			}else{
				resultList = totalList;
			}
		}
		
		return resultList;
	}
}


class ListMapComparator implements Comparator<Map<String, String>> {
	 
    private final List<Map<String,String>> keyList;
     
    public ListMapComparator(List<Map<String,String>> key) {
        this.keyList = key;
    }
     
    @Override
    public int compare(Map<String, String> first, Map<String, String> second) {
    	int result = 0;
    	for(Map<String,String> keyMap : keyList) {
			if("CNT".equals(keyMap.get("colName"))) {
				// 건수 숫자 정렬
				Integer _firstNum = Integer.parseInt(first.get(keyMap.get("colName")));
				Integer _secondNum = Integer.parseInt(second.get(keyMap.get("colName")));
				
				if(keyMap.get("order").equals("ASC")) {
					result = _firstNum.compareTo(_secondNum);
				}  else {
					result = _secondNum.compareTo(_firstNum);
				}
			} else {
				String _firstStr = first.get(keyMap.get("colName"));
				String _secondStr = second.get(keyMap.get("colName"));
				
				if(keyMap.get("order").equals("ASC")) {
					result = _firstStr.compareTo(_secondStr);
				}  else {
					result = _secondStr.compareTo(_firstStr);
				}
			}
			if(result != 0) {
				break;
			}
    	}
    	return result;
    }
}

