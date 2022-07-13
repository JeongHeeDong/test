package com.ltem.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ltem.common.CommonFunction;
import com.ltem.service.SystemNoticeManagerService;
import com.ltem.utils.CreateExcel;

/**
 * 시스템 > 공지사항 관리
 *
 */
@Controller("SystemNoticeManagerController")
public class SystemNoticeManagerController {
	private static final Logger log = LoggerFactory.getLogger(SystemNoticeManagerController.class);

	@Autowired
	SystemNoticeManagerService systemNoticeManagerService;

	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/system/sysNotiManager")
	public String sysDBManager(HttpServletRequest request,
							   HttpSession session,
							   ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "system/sysNotiManager";
	}
	
	@RequestMapping(value="/system/sysNotiManager/updateNoti", method=RequestMethod.POST, produces = "application/json")
	public void updateNoti(MultipartHttpServletRequest req, ModelMap model) throws Exception {
		String id   = req.getParameter("selectedId");
		String time = req.getParameter("selectedTime");
		
		String title      = req.getParameter("subject");
		String desc       = req.getParameter("content");
		String noticeFrom = req.getParameter("noticeFrom");
		String noticeTo = req.getParameter("noticeTo");
		String mainNotice = req.getParameter("mainNotice");
		/*
		String originFile = req.getParameter("originFile");
		
		MultipartFile newFile    = req.getFile("file_obj");
				
		String separator = System.getProperty("file.separator");
		String path;
		String fullPath;
		*/
		HashMap<String, String> paramMap = new HashMap<String, String>();
		//기본 데이터 세팅
		paramMap.put("TITLE", title);
		paramMap.put("DESC", desc);
		paramMap.put("ID", id);
		paramMap.put("TIME", time);
		paramMap.put("FROM_DATE", noticeFrom);
		paramMap.put("TO_DATE", noticeTo + " 23:59:59");
		paramMap.put("MAIN_NOTI_YN", StringUtils.isBlank(mainNotice)?"N":"Y");
		
		String msg = "수정되었습니다.";
		/*
		//파일 변동이 있는 경우
		if ( originFile.contains(":DEL") ) {
			//기존 파일 삭제, 새 파일 업로드시 삭제 FLAG 생성됨
			String[] temp = originFile.split(":");
			originFile = temp[0];
			
			path      = systemNoticeManagerService.getFilePath(originFile);
			fullPath  = path + separator + originFile;
			File file = new File(fullPath);
			
			if ( file.exists() ) {
				file.delete();

				paramMap.put("FILE_NAME", "첨부파일 없음");
				paramMap.put("FILE_PATH", "");
			}
		} 
		
		//새 파일이 있을 경우 업로드
		if ( !newFile.isEmpty() ) {
			String fileNm = newFile.getOriginalFilename();

			path      = "/DATA/tomcat/NOTI_UPLOAD";
			fullPath  = path + separator + fileNm;
			
			File nFile = new File(fullPath);
			if ( nFile.exists() ) {
				//같은 파일이 존재할 경우, 밀리타임을 붙여서 저장
				String[] ntemp = fileNm.split("\\.");
				String name = ntemp[0];
				String ext  = ntemp[1];
				
				String now = Long.toString(System.currentTimeMillis());
				fileNm = name + "_" + now + "." + ext;
				fullPath = path + separator + fileNm;
				nFile = new File(fullPath);
			}
			
			try {
				newFile.transferTo(nFile);

				paramMap.put("FILE_NAME", fileNm);
				paramMap.put("FILE_PATH", path);					
			} catch(Exception e) {
				log.error(e.getMessage());
				msg = "파일 등록 중 에러 발생";
			}
		}
		*/
		
		int result = systemNoticeManagerService.updateNoti(paramMap);
		if ( result == 1 ) {
			msg = "수정되었습니다.";
		}
		model.addAttribute("result", msg);
	}
	@RequestMapping(value="/system/sysNotiManager/deleteNoti", method=RequestMethod.POST, produces = "application/json")
	public void deleteNoti(@RequestBody HashMap<String, String> paramMap,
						   ModelMap model) throws Exception {
		Map<String, String> oneData = systemNoticeManagerService.getOneNoticeData(paramMap);
		String filePath = oneData.get("FILE_PATH");
		String fileName = oneData.get("FILE_NAME");
		String separator = System.getProperty("file.separator");
		String fullPath = filePath + separator + fileName;
		File file = new File(fullPath);
		
		if ( file.exists() ) {
			file.delete();
		} 
		int result = systemNoticeManagerService.deleteNoti(paramMap);			
		
		String msg = "";
		if ( result == 1 ) {
			msg = "OK";
		}
		else {
			msg = "NOK";
		}
		model.addAttribute("result", msg);
	}
	
	@RequestMapping(value="/system/sysNotiManager/insertNoti",method=RequestMethod.POST, produces = "application/json")
	public void insertNoti(MultipartHttpServletRequest request,
						   HttpSession session, ModelMap model) throws Exception {
		String userId  = (String) session.getAttribute("user_id");
		String subject = request.getParameter("subject");
		String content = request.getParameter("content");
		String noticeFrom = request.getParameter("noticeFrom");
		String noticeTo = request.getParameter("noticeTo");
		String mainNotice = request.getParameter("mainNotice");
/*		
		MultipartFile file = request.getFile("file_obj");
		
		String separator = System.getProperty("file.separator");
		String filePath  = "";
		String fileNm    = "첨부파일 없음";
		String uploadPath;
		String name;
		String ext; 
		String now;
		
		if ( !file.isEmpty() ) {
			fileNm = file.getOriginalFilename();			
			filePath = "/DATA/tomcat/NOTI_UPLOAD";	
			uploadPath = filePath + separator + fileNm;
			
			File uploadDir =  new File(filePath);
			File nFile = new File(uploadPath);
		
			if ( !uploadDir.exists() ) {
				uploadDir.mkdirs();
			}
			
			if ( nFile.exists() ) {
				//같은 파일이 존재할 경우, 밀리타임을 붙여서 저장
				String[] temp = fileNm.split("\\.");
				name = temp[0];
				ext  = temp[1];
				
				now = Long.toString(System.currentTimeMillis());
				fileNm = name + "_" + now + "." + ext;
				
				filePath = "/DATA/tomcat/NOTI_UPLOAD";
				uploadPath = filePath + separator +fileNm;
				nFile = new File(uploadPath);
			}
			
			try {
				file.transferTo(nFile);
			} catch(Exception e) {
				log.error(e.getMessage());
				
				String msg = "파일 등록시 에러 발생";
				model.addAttribute("result", msg);
			}
		
		}
*/		
		//DB 저장
		HashMap<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("ID", userId);
		paramMap.put("TITLE", subject);
		paramMap.put("DESC", content);
		paramMap.put("FROM_DATE", noticeFrom);
		paramMap.put("TO_DATE", noticeTo + " 23:59:59");
		paramMap.put("MAIN_NOTI_YN", StringUtils.isBlank(mainNotice)?"N":"Y");
		
//		paramMap.put("FILE_PATH", filePath);
//		paramMap.put("FILE_NAME", fileNm);				
		
		int result = systemNoticeManagerService.insertNoti(paramMap);
		String msg = "등록이 완료되었습니다.";
		if ( result == 1 ) {
			model.addAttribute("result", msg);
		} else {
			msg = "DB 등록시 에러 발생";
			model.addAttribute("result", msg);
		}
	}
	
	@RequestMapping(value="/system/sysNotiManager/getNotiData", method = RequestMethod.POST, produces = "application/json")
	public void getNotiData(@RequestBody HashMap<String,String> paramMap,
							ModelMap modelMap) throws Exception {
		Map<String,List<Map<String, String>>> resultMap = systemNoticeManagerService.getNoticeData(paramMap);	
		int totalCnt = systemNoticeManagerService.getTotalCnt(paramMap);
		
		modelMap.addAttribute("getNotiData",resultMap);
		modelMap.addAttribute("getTotalCnt", totalCnt);
	}
	
	@RequestMapping(value="/system/sysNotiManager/getOneNotiData", method = RequestMethod.POST, produces = "application/json")
	public void getOneData(@RequestBody HashMap<String,String> paramMap,
						   ModelMap modelMap) throws Exception {
		Map<String, String> resultMap = systemNoticeManagerService.getOneNoticeData(paramMap);	
		modelMap.addAttribute("getOneNotiData",resultMap);
	}
	
	@RequestMapping(value="/system/sysNotiManager/fileDown", method = RequestMethod.GET)
	public void fileDown(@RequestParam String fileName,
						 ModelMap modelMap,
						 HttpServletResponse resp) throws Exception {
		String filePath = systemNoticeManagerService.getFilePath(fileName);
		String separator = System.getProperty("file.separator");
		filePath += separator + fileName; 
		
		resp.setContentType("application/octet-stream;");
		resp.setHeader("Content-Transfer-Encoding", "binary");
		resp.setHeader( "Content-Disposition", "attachment; "+
		"fileName=\"" + URLEncoder.encode(fileName, "UTF-8") + "\";") ;
	
		File file = new File(filePath);
		FileInputStream fs = new FileInputStream(file);
		IOUtils.copy(fs, resp.getOutputStream());
		
		if ( fs != null ) {
			fs.close();
		}
	}
	
	@RequestMapping(value="/system/sysNotiManager/excelDown", method=RequestMethod.GET)
    @ResponseBody
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
        Map<String, List<Map<String, String>>> excelData = new HashMap<String, List<Map<String, String>>>();
        
        for(int i=0;i<headerArray.length;i++){
                headerList.add(headerArray[i]);
        }
        for(int i=0;i<columnArray.length;i++){
                columnList.add(columnArray[i]);
        }
        String fromDate = paramMap.get("fromDate");
        String toDate   = paramMap.get("toDate");
        toDate = toDate.substring(0, 10);
        
        fileName = URLEncoder.encode(paramMap.get("TITLE"), "utf-8") + "(" + fromDate + "~" + toDate + ")" + ".xlsx";
        headerStr = paramMap.get("TITLE") + "(" + fromDate + "~" + toDate + ")";
        excelData = systemNoticeManagerService.getNoticeData(paramMap);
            	
    	Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr,columnList);
       
    	response.setContentType("application/vnd.ms-excel");
    	response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
    	response.addHeader("Set-Cookie", "fileDownload=true; path=/");
       
    	xlsxWb.write(response.getOutputStream());
    }
}