package com.ltem.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
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
import com.ltem.service.PhoneService;
import com.ltem.utils.CreateExcel;
import com.opencsv.CSVReader;

/**
 * 구성관리 > 단말 관리
 *
 */
@Controller
public class PhoneController {
	private static final Logger log = LoggerFactory.getLogger(PhoneController.class);

	@Autowired
	PhoneService phoneService;

	@Autowired
	private CommonFunction commonFunction;
	
	@RequestMapping("/pss/phone")
	public String phonePage(HttpServletRequest request,
								HttpSession session,
								ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		return "pss/phone/phone";
	}
	
	@RequestMapping(value="/pss/phone/phoneList", method = RequestMethod.POST, produces = "application/json")
	public void phoneList(@RequestBody HashMap<String, String> paramMap,
							ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = phoneService.getPhoneList(paramMap);	
		int totalCount = phoneService.getPhoneTotalCount(paramMap);
		
		modelMap.addAttribute("list",list);
		modelMap.addAttribute("totalCount", totalCount);
	}
	@RequestMapping(value="/pss/phone/insertPhone",method=RequestMethod.POST, produces = "application/json")
	public void insertPhone(@RequestBody HashMap<String, String> paramMap,
							HttpSession session, ModelMap model) throws Exception {
		
		try {
			phoneService.insertPhone(paramMap);
			model.addAttribute("result", "OK");
		} catch(DuplicateKeyException e) {
			model.addAttribute("result", "이미 등록된 단말 번호입니다.");
		}
	}
	
	@RequestMapping(value="/pss/phone/modifyPhone", method=RequestMethod.POST, produces = "application/json")
	public void modifyPhone(@RequestBody HashMap<String, String> paramMap, ModelMap model) throws Exception {

		phoneService.updatePhone(paramMap);
		model.addAttribute("result", "OK");
	}
	@RequestMapping(value="/pss/phone/deletePhone", method=RequestMethod.POST, produces = "application/json")
	public void deletePhone(@RequestBody List<String> phoneNoList,
						   ModelMap model) throws Exception {
		phoneService.deletePhone(phoneNoList);	
		model.addAttribute("result", "OK");		
	}
	
	@RequestMapping(value="/pss/phone/phoneUseCodeList", method = RequestMethod.POST, produces = "application/json")
	public void phoneUseCodeList(ModelMap modelMap) throws Exception {
		List<Map<String, String>> list = phoneService.getPhoneUseCodeList(new HashMap<String, String>());
		
		modelMap.addAttribute("list", list);
	}
	

	@RequestMapping(value="/pss/phone/csvSampleDownload", method=RequestMethod.GET)
	@ResponseBody
	public void csvSampleDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.setContentType("application/octet-stream;");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader( "Content-Disposition", "attachment; fileName=\"phone.csv\";") ;
	
		String csvFilePath = request.getServletContext().getRealPath("/WEB-INF/views/pss/phone/phone.csv");
		File file = new File(csvFilePath);
		FileInputStream fs = new FileInputStream(file);
		IOUtils.copy(fs, response.getOutputStream());
		
		if ( fs != null ) {
			fs.close();
		}
	}

	@RequestMapping(value="/pss/phone/csvUpload",method=RequestMethod.POST, produces = "application/json")
	public void insertNoti(MultipartHttpServletRequest request,
							HttpSession session, ModelMap model) throws Exception {
		String phoneType = request.getParameter("PHONE_TYPE");
		String phoneUseCode = request.getParameter("PHONE_USE_CODE");
		
		MultipartFile csvFile = request.getFile("csvFile");
		CSVReader csvReader = new CSVReader(new InputStreamReader(csvFile.getInputStream(), Charset.forName("euc-kr")));
		List<String[]> phoneList = csvReader.readAll();
		csvReader.close();
		
		List<String> errorList = new ArrayList<String>();
		int idx = 0;
		int successCount = 0;
		for(String[] phone : phoneList) {
			if(idx++ == 0) {
				continue;
			}
			try {
				HashMap<String, String> paramMap = new HashMap<String, String>();
				paramMap.put("PHONE_TYPE", phoneType);
				paramMap.put("PHONE_USE_CODE", phoneUseCode);
				
				paramMap.put("PHONE_NO", phone[0]);
				paramMap.put("PHONE_USE_NAME", phone[1]);
				paramMap.put("MSISDN", phone[2]);
				
				phoneService.insertPhone(paramMap);
				successCount++;
			} catch(DuplicateKeyException e) {
				errorList.add(phone[0] + ": 이미 등록된 단말 번호입니다.");
			} catch(Exception e) {
				errorList.add(phone[0] + ": 오류가 발생했습니다.");
			}
		}
		
		if(errorList.isEmpty()) {
			model.addAttribute("result", successCount + "건이 등록 되었습니다.");
		} else {
			model.addAttribute("result", successCount + "건이 등록 되었습니다.\n\n" + StringUtils.join(errorList, "\n"));
		}
	}
	
	@RequestMapping(value="/pss/phone/excelDown", method=RequestMethod.GET)
	@ResponseBody
	public void excelDown(@RequestParam HashMap<String, String> paramMap,
						  ModelMap modelMap,
						  HttpServletResponse response,
						  HttpServletRequest request) throws Exception {
		CreateExcel excel = new CreateExcel();
		String fileName  = "";
		String headerStr = paramMap.get("TITLE");
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
		
		fileName = URLEncoder.encode(headerStr, "utf-8") + ".xlsx";
		
		excelData.put("단말", phoneService.getPhoneList(paramMap));
				
		Workbook xlsxWb = excel.create_Excel(excelData, headerList, headerStr.replaceAll("_", " "), columnList);

		response.setContentType("application/vnd.ms-excel");
		response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
		response.addHeader("Set-Cookie", "fileDownload=true; path=/");

		xlsxWb.write(response.getOutputStream());
	}
}