package com.ltem.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ltem.dao.SystemStateManagerDAO;
import com.ltem.service.SystemStateManagerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("SystemStateManagerService")
public class SystemStateManagerServiceImpl extends EgovAbstractServiceImpl implements SystemStateManagerService {

	@Autowired
	SystemStateManagerDAO systemStateManagerDAO;
	
	private static final Logger log = LoggerFactory.getLogger(SystemStateManagerServiceImpl.class);

	@Override
	public Map<String, Object> getStateData(HashMap<String,Object> paramMap) {
		String filterLevel = (String)paramMap.get("filterLevel");
		
		SimpleDateFormat formatter = new SimpleDateFormat ( "yyyyMMddHHmmss"); 
		Date currentTime = new Date ( ); 
		Calendar cal = Calendar.getInstance(); 
		cal.setTime(currentTime); 
		cal.add(Calendar.MONTH, -1);
		
		String nowDateStr = formatter.format ( currentTime ); 
		String compDate = formatter.format(cal.getTime());
		
		paramMap.put("startDateTime", compDate);
		paramMap.put("endDateTime", nowDateStr);
		
		List<Map<String,Object>> tempList = systemStateManagerDAO.getStateData(paramMap);
		List<Map<String,Object>> newList = new ArrayList<Map<String,Object>>();
		Map<String,Object> returnMap = new HashMap<String,Object>();
		long paramLevel = Long.parseLong(filterLevel);
		int maxDiskCount = 0;
		long nowDateTime = new Date().getTime();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		long maxeventTime = 0;
		
		for(Map<String,Object> map : tempList){
			long maxLevel = 4;
			String disk_used = (String)map.get("DISK_USED");
			String[] stdList = disk_used.split("\\^");
			double critical = NumberUtils.toDouble(Objects.toString(map.get("DISK_CRITICAL")), 0);
			double major = NumberUtils.toDouble(Objects.toString(map.get("DISK_MAJOR")), 0);
			double minor = NumberUtils.toDouble(Objects.toString(map.get("DISK_MINOR")), 0);
			long cpu_level = NumberUtils.toLong(Objects.toString(map.get("CPU_LEVEL")), 0);
			long memory_level = NumberUtils.toLong(Objects.toString(map.get("MEMORY_LEVEL")), 0);
			
			if(cpu_level < memory_level){
				maxLevel = cpu_level;
			}else{
				maxLevel = memory_level;
			}
			
			String disk_level = "";
			
			if(!"".equals(stdList[0])){
				for(String std : stdList){
					double disk_usage = Double.parseDouble(std.split("\\|")[1]);
					if(critical <= disk_usage){
						disk_level += "1^";
						if(1 < maxLevel){
							maxLevel = 1;
						}
					}else if(major <= disk_usage){
						disk_level += "2^";
						if(2 < maxLevel){
							maxLevel = 2;
						}
					}else if(minor <= disk_usage){
						disk_level += "3^";
						if(3 < maxLevel){
							maxLevel = 3;
						}
					}else{
						disk_level += "4^";
					}
				}
			}
			
			if(!"".equals(disk_level)){
				disk_level = disk_level.substring(0,disk_level.length()-1);
			}else{
				disk_level = "4";
			}
			
			map.put("MAX_LEVEL", maxLevel);
			// 현재시간과 수집시간이 30분 이상 차이가 나는 경우 알람등급 1로 변경
			try {
				
				Date eventDateTime = format.parse((String) map.get("EVENT_TIME"));
				
				if((nowDateTime - eventDateTime.getTime())/1000/60 > 1440){
					map.put("MAX_LEVEL", 1L);
					map.put("EVENT_TIME_LEVEL", "1");
					maxLevel = 1;
				}
				
				if(eventDateTime.getTime() > maxeventTime) {
					maxeventTime = eventDateTime.getTime();
				}
				
			} catch (ParseException e) {
				log.error(e.getMessage());
			}
			
			
			map.put("DISK_LEVEL", disk_level);
			map.put("DISK_COUNT","".equals(stdList[0])?0:stdList.length);
			
			int diskcount = "".equals(stdList[0])?0:stdList.length;
			
			if(maxDiskCount < diskcount)
				maxDiskCount = diskcount;
			
			if("4".equals(filterLevel)){
				newList.add(map);
			}else if(maxLevel <= paramLevel){
				newList.add(map);
			}
//			newList.add(map);
		}
		
//		String maxdate = systemStateManagerDAO.getMaxDateTime(paramMap);
		String maxdate = format.format(new Date(maxeventTime));
		
//		Collections.sort(newList,new Comparator<Map<String,Object>>() {
//
//			@Override
//			public int compare(Map<String, Object> first, Map<String, Object> second) {
//				Long firstInt = (Long)(first.get("MAX_LEVEL"));
//				Long secondInt = (Long)(second.get("MAX_LEVEL"));
//				String firstHostType = Objects.toString(first.get("HOST_TYPE"), "");
//				String secondHostType = Objects.toString(second.get("HOST_TYPE"), "");
//				String firstHostName = Objects.toString(first.get("HOST_NAME"), "");
//				String secondHostName = Objects.toString(second.get("HOST_NAME"), "");
//				
//				int i = firstInt.compareTo(secondInt);
//				if (i != 0) return i;
//				
//				i = firstHostType.compareTo(secondHostType);
//				if (i != 0) return i;
//				
//				return firstHostName.compareTo(secondHostName);
//			}
//			
//		});
		
		Collections.sort(newList,new Comparator<Map<String,Object>>() {

			@Override
			public int compare(Map<String, Object> first, Map<String, Object> second) {
				Long firstInt = (Long)(first.get("MAX_LEVEL"));
				Long secondInt = (Long)(second.get("MAX_LEVEL"));
				
				int i = firstInt.compareTo(secondInt);
				if (i != 0) return i;
				
				return firstInt.compareTo(secondInt);
			}
			
		});
		
		returnMap.put("maxDateTime", maxdate);
		returnMap.put("stateData", newList);
		returnMap.put("maxDiskCnt",maxDiskCount);
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getVmStateData(HashMap<String,Object> paramMap) {
		String filterLevel = (String)paramMap.get("filterLevel");
		
		SimpleDateFormat formatter = new SimpleDateFormat ( "yyyyMMddHHmmss"); 
		Date currentTime = new Date ( ); 
		Calendar cal = Calendar.getInstance(); 
		cal.setTime(currentTime); 
		cal.add(Calendar.MONTH, -1);
		
		String nowDateStr = formatter.format ( currentTime ); 
		String compDate = formatter.format(cal.getTime());
		
		paramMap.put("startDateTime", compDate);
		paramMap.put("endDateTime", nowDateStr); 
		
		List<Map<String,Object>> vmTempList = systemStateManagerDAO.getVmStateData(paramMap);
		List<Map<String,Object>> vmNewList = new ArrayList<Map<String,Object>>();
		Map<String,Object> returnMap = new HashMap<String,Object>();
		long paramLevel = Long.parseLong(filterLevel);
		long nowDateTime = new Date().getTime();
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int vmMaxDiskCount = 0;
		long vmMaxeventTime = 0;
		
		for(Map<String,Object> map : vmTempList){
			long maxLevel = 4;
			String disk_used = (String)map.get("DISK_USED");
			String[] stdList = disk_used.split("\\^");
			double critical = NumberUtils.toDouble(Objects.toString(map.get("DISK_CRITICAL")), 0);
			double major = NumberUtils.toDouble(Objects.toString(map.get("DISK_MAJOR")), 0);
			double minor = NumberUtils.toDouble(Objects.toString(map.get("DISK_MINOR")), 0);
			long cpu_level = NumberUtils.toLong(Objects.toString(map.get("CPU_LEVEL")), 0);
			long memory_level = NumberUtils.toLong(Objects.toString(map.get("MEMORY_LEVEL")), 0);
			
			if(cpu_level < memory_level){
				maxLevel = cpu_level;
			}else{
				maxLevel = memory_level;
			}
			
			String disk_level = "";
			
			if(!"".equals(stdList[0])){
				for(String std : stdList){
					double disk_usage = Double.parseDouble(std.split("\\|")[1]);
					if(critical <= disk_usage){
						disk_level += "1^";
						if(1 < maxLevel){
							maxLevel = 1;
						}
					}else if(major <= disk_usage){
						disk_level += "2^";
						if(2 < maxLevel){
							maxLevel = 2;
						}
					}else if(minor <= disk_usage){
						disk_level += "3^";
						if(3 < maxLevel){
							maxLevel = 3;
						}
					}else{
						disk_level += "4^";
					}
				}
			}
			
			if(!"".equals(disk_level)){
				disk_level = disk_level.substring(0,disk_level.length()-1);
			}else{
				disk_level = "4";
			}
			
			map.put("MAX_LEVEL", maxLevel);
			// 현재시간과 수집시간이 30분 이상 차이가 나는 경우 알람등급 1로 변경
			try {
				
				Date eventDateTime = format.parse((String) map.get("EVENT_TIME"));
				
				if((nowDateTime - eventDateTime.getTime())/1000/60 > 1440){
					map.put("MAX_LEVEL", 1L);
					map.put("EVENT_TIME_LEVEL", "1");
					maxLevel = 1;
				}
				
				if(eventDateTime.getTime() > vmMaxeventTime) {
					vmMaxeventTime = eventDateTime.getTime();
				}
				
			} catch (ParseException e) {
				log.error(e.getMessage());
			}
			
			
			map.put("DISK_LEVEL", disk_level);
			map.put("DISK_COUNT","".equals(stdList[0])?0:stdList.length);
			
			int diskcount = "".equals(stdList[0])?0:stdList.length;
			
			if(vmMaxDiskCount < diskcount)
				vmMaxDiskCount = diskcount;
			
			if("4".equals(filterLevel)){
				vmNewList.add(map);
			}else if(maxLevel <= paramLevel){
				vmNewList.add(map);
			}
//			vmNewList.add(map);
		}
		
		String vmMaxdate = format.format(new Date(vmMaxeventTime));
		
//		Collections.sort(vmNewList, new Comparator<Map<String,Object>>() {
//			@Override
//			public int compare(Map<String, Object> first, Map<String, Object> second) {
//				Long firstInt = (Long)(first.get("MAX_LEVEL"));
//				Long secondInt = (Long)(second.get("MAX_LEVEL"));
//				String firstHostType = Objects.toString(first.get("HOST_TYPE"), "");
//				String secondHostType = Objects.toString(second.get("HOST_TYPE"), "");
//				String firstHostName = Objects.toString(first.get("HOST_NAME"), "");
//				String secondHostName = Objects.toString(second.get("HOST_NAME"), "");
//				String firstNode = Objects.toString(first.get("NODE"), "");
//				String secondNode = Objects.toString(second.get("NODE"), "");
//				String firstActSby = Objects.toString(first.get("ACT_SBY"), "");
//				String secondActSby = Objects.toString(second.get("ACT_SBY"), "");
//				
//				int i = firstInt.compareTo(secondInt);
//				if (i != 0) return i;
//				
//				i = firstHostType.compareTo(secondHostType);
//				if (i != 0) return i;
//				
//				i = firstHostName.compareTo(secondHostName);
//				if (i != 0) return i;
//				
//				i = firstNode.compareTo(secondNode);
//				if (i != 0) return i;
//
//				return firstActSby.compareTo(secondActSby);
//			}
//			
//		});
		
		Collections.sort(vmNewList, new Comparator<Map<String,Object>>() {
			@Override
			public int compare(Map<String, Object> first, Map<String, Object> second) {
				Long firstInt = (Long)(first.get("MAX_LEVEL"));
				Long secondInt = (Long)(second.get("MAX_LEVEL"));
				
				int i = firstInt.compareTo(secondInt);
				if (i != 0) return i;

				return firstInt.compareTo(secondInt);
			}
			
		});
		
		returnMap.put("vmMaxDateTime", vmMaxdate);
		returnMap.put("vmStateData", vmNewList);
		returnMap.put("vmMaxDiskCnt",vmMaxDiskCount);
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getTrendData(HashMap<String, Object> paramMap) {
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		List<Map<String,Object>> getDataList = systemStateManagerDAO.getTrendData(paramMap);
		
		ArrayList<String> disk_name_list = new ArrayList<String>();
		Map<String,ArrayList<Double>> disk_data_map = new HashMap<String,ArrayList<Double>>();
		ArrayList<String> host_name_list = new ArrayList<String>();
		Map<String,ArrayList<Double>> cpu_data_map = new HashMap<String,ArrayList<Double>>();
		Map<String,ArrayList<Double>> memory_data_map = new HashMap<String,ArrayList<Double>>();

		ArrayList<String> timeList = new ArrayList<String>();
		for(Map<String,Object> map : getDataList){
			timeList.add(Objects.toString(map.get("EVENT_TIME"), ""));
			String disk_used = (String)map.get("DISK_USED");
			String host_name = (String)map.get("HOST_NAME");
			
			for(String disk : disk_used.split("\\^")){
				String diskName = disk.split("\\|")[0];
				if("".equals(diskName)) {
					continue;
				}
				if (!disk_data_map.containsKey(diskName)) {
					disk_data_map.put(diskName, new ArrayList<Double>());
					disk_name_list.add(diskName);
				}
			}
			
			if(!cpu_data_map.containsKey(host_name) && !memory_data_map.containsKey(host_name)){
				cpu_data_map.put("".equals(host_name)?" ":host_name, new ArrayList<Double>());
				memory_data_map.put("".equals(host_name)?" ":host_name, new ArrayList<Double>());
				host_name_list.add("".equals(host_name)?" ":host_name);
			}
		}
		
		boolean isfirst = true;
		for(String time : timeList){
			for(String host_str : host_name_list){
				isfirst = true;
				
				ArrayList<String> _diskNameList = new ArrayList<String>();
				
				for(String disk_name : disk_name_list){
					if(disk_name.contains(host_str+"(")){
						_diskNameList.add(disk_name);
					}
				}
				
				
				for(Map<String,Object> map : getDataList){
					if(time.equals(map.get("EVENT_TIME")) && host_str.equals((String)map.get("HOST_NAME"))){
	//					cpu_data_list.add(map.get("CPU_RATE"));
	//					mem_data_list.add(map.get("MEMORY_USED"));
						cpu_data_map.get(host_str).add(Double.parseDouble(map.get("CPU_RATE")+""));
						memory_data_map.get(host_str).add(Double.parseDouble(map.get("MEMORY_USED")+""));
						
						String disk_used = (String)map.get("DISK_USED");
						
						if(!"".equals(disk_used)){
						
							for(String disk : disk_used.split("\\^")){

								String key = disk.split("\\|")[0];
								_diskNameList.remove(key);
								
								double value = Double.parseDouble(disk.split("\\|")[1]);
								disk_data_map.get(key).add(value);
							}
							
							for(String _diskName : _diskNameList){
								disk_data_map.get(_diskName).add(0.0);
							}
							
						}
						
						isfirst = false;
						break;
					}
				}
				
				if(isfirst){
					cpu_data_map.get(host_str).add(0.0);
					memory_data_map.get(host_str).add(0.0);
					
					for(String disk_name : disk_name_list){
						if(disk_name.contains(host_str+"(")){
							disk_data_map.get(disk_name).add(0.0);
						}
					}
				}
			}
		}
		
//		Set	key = disk_data_map.keySet();
//		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
//			String keyname = (String) iterator.next();
//			
//			System.out.println(disk_data_map.get(keyname));
//			System.out.println(disk_data_map.get(keyname).size());
//			
//		}
		
		returnMap.put("timeList", timeList);
		returnMap.put("cpu_data_map", cpu_data_map);
		returnMap.put("memory_data_map", memory_data_map);
		returnMap.put("host_name_list", host_name_list);
		returnMap.put("disk_name_list", disk_name_list);
		returnMap.put("disk_data_map", disk_data_map);
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getVmTrendData(HashMap<String, Object> paramMap) {
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		List<Map<String,Object>> getDataList = systemStateManagerDAO.getVmTrendData(paramMap);
		
		ArrayList<String> disk_name_list = new ArrayList<String>();
		Map<String,ArrayList<Double>> disk_data_map = new HashMap<String,ArrayList<Double>>();
		ArrayList<String> host_name_list = new ArrayList<String>();
		Map<String,ArrayList<Double>> cpu_data_map = new HashMap<String,ArrayList<Double>>();
		Map<String,ArrayList<Double>> memory_data_map = new HashMap<String,ArrayList<Double>>();

		ArrayList<String> timeList = new ArrayList<String>();
		for(Map<String,Object> map : getDataList){
			timeList.add(Objects.toString(map.get("EVENT_TIME"), ""));
			String disk_used = (String)map.get("DISK_USED");
			String host_name = (String)map.get("HOST_NAME");
			
			for(String disk : disk_used.split("\\^")){
				String diskName = disk.split("\\|")[0];
				if("".equals(diskName)) {
					continue;
				}
				if (!disk_data_map.containsKey(diskName)) {
					disk_data_map.put(diskName, new ArrayList<Double>());
					disk_name_list.add(diskName);
				}
			}
			
			if(!cpu_data_map.containsKey(host_name) && !memory_data_map.containsKey(host_name)){
				cpu_data_map.put("".equals(host_name)?" ":host_name, new ArrayList<Double>());
				memory_data_map.put("".equals(host_name)?" ":host_name, new ArrayList<Double>());
				host_name_list.add("".equals(host_name)?" ":host_name);
			}
		}
		
		boolean isfirst = true;
		for(String time : timeList){
			for(String host_str : host_name_list){
				isfirst = true;
				
				ArrayList<String> _diskNameList = new ArrayList<String>();
				
				for(Map<String,Object> map : getDataList){
					if(time.equals(map.get("EVENT_TIME")) && host_str.equals((String)map.get("HOST_NAME"))){
	//					cpu_data_list.add(map.get("CPU_RATE"));
	//					mem_data_list.add(map.get("MEMORY_USED"));
						cpu_data_map.get(host_str).add(Double.parseDouble(map.get("CPU_RATE")+""));
						memory_data_map.get(host_str).add(Double.parseDouble(map.get("MEMORY_USED")+""));
						
						String disk_used = (String)map.get("DISK_USED");
						
						if(!"".equals(disk_used)){
						
							for(String disk : disk_used.split("\\^")){

								String key = disk.split("\\|")[0];
								_diskNameList.remove(key);
								
								double value = Double.parseDouble(disk.split("\\|")[1]);
								disk_data_map.get(key).add(value);
							}
							
							for(String _diskName : _diskNameList){
								disk_data_map.get(_diskName).add(0.0);
							}
							
						}
						
						isfirst = false;
						break;
					}
				}
				
				if(isfirst){
					cpu_data_map.get(host_str).add(0.0);
					memory_data_map.get(host_str).add(0.0);
					
					for(String disk_name : disk_name_list){
						if(disk_name.contains(host_str+"(")){
							disk_data_map.get(disk_name).add(0.0);
						}
					}
				}
			}
		}
		
//		Set	key = disk_data_map.keySet();
//		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
//			String keyname = (String) iterator.next();
//			
//			System.out.println(disk_data_map.get(keyname));
//			System.out.println(disk_data_map.get(keyname).size());
//			
//		}
		
		returnMap.put("timeList", timeList);
		returnMap.put("cpu_data_map", cpu_data_map);
		returnMap.put("memory_data_map", memory_data_map);
		returnMap.put("host_name_list", host_name_list);
		returnMap.put("disk_name_list", disk_name_list);
		returnMap.put("disk_data_map", disk_data_map);
		
		return returnMap;
	}

	@Override
	public List<Map<String, Object>> getSysThOption(String pageFlag) {
		
		HashMap<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("pageFlag", pageFlag);
		
		List<Map<String, Object>> returnMap = systemStateManagerDAO.getSysThOption(paramMap);
		
		return returnMap;
	}

	@Override
	public Map<String, Object> getEquipTypeData(HashMap<String, Object> paramMap) {
		Map<String, Object> returnMap = systemStateManagerDAO.getEquipTypeData(paramMap);
		
		return returnMap;
	}

	@Override
	public int thresholdEdit(HashMap<String, Object> paramMap) {
		int returnFlag = 0;
		
		returnFlag = systemStateManagerDAO.thresholdEdit(paramMap);
		
		return returnFlag;
	}

	@Override
	public List<Map<String, Object>> getSessionipList(String pageFlag) {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.put("pageFlag", pageFlag);
		List<Map<String, Object>> returnMap = systemStateManagerDAO.getSessionipList(paramMap);
		
		return returnMap;
	}

}