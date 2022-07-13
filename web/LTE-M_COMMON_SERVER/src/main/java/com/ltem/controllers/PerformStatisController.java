package com.ltem.controllers;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import org.springframework.web.servlet.ModelAndView;

import com.ltem.common.CommonFunction;
import com.ltem.service.PerformStatisService;
import com.ltem.utils.CreateExcel;


/**
 * 성능통계 > * > *
 *
 */
@Controller("PerformStatisController")
public class PerformStatisController {
	
	@Autowired
	PerformStatisService performStatisServiceService;
	
//	private static final Logger logger = LoggerFactory.getLogger(AnalysisController.class);

	
	@Autowired
	private CommonFunction commonFunction;
	
	private static final Logger log = LoggerFactory.getLogger(PerformStatisController.class);
	
	@RequestMapping("/ps/ps_ran/ps_ho/ps_rrc/estab")
	public ModelAndView psRanHo(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/ran/callproc/rrc/estab");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_RRC_CONNECTION_ESTABLISHMENT"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_ran/ps_ho/ps_erab/setup")
	public ModelAndView psRanErqbSetup(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/ran/callproc/erab/setup");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_E_RAB_SETUP"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_ran/ps_ho/ps_erab/setup_add")
	public ModelAndView psRanErqbSetupAdd(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/ran/callproc/erab/setup_add");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_E_RAB_SETUP_ADD"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_ran/ps_ho/ps_calldrop")
	public ModelAndView psRanCallDrop(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/ran/callproc/call_drop");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_CALL_DROP"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_ran/ps_packet")
	public ModelAndView psRanPdcpPacket(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/ran/pdcp_packet");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_PDCP_PACKET"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		
		return mav;
	}

	@RequestMapping("/ps/ps_ran/hand_over/intra_enb")
	public ModelAndView psIntraEnbHandOver(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("/ps/ran/handover/intra_enb");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_INTRA_ENB_HANDOVER"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_ran/hand_over/x2_in")
	public ModelAndView psX2InHandOver(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("/ps/ran/handover/x2_in");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_X2_IN_HANDOVER"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_ran/hand_over/x2_out")
	public ModelAndView psX2OutHandOver(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("/ps/ran/handover/x2_out");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("2");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_RAN_X2_OUT_HANDOVER"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_mme/ps_mme_ho/attach")
		public ModelAndView psEpcAttach(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			commonFunction.setModel(request,session,modelMap);
		
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/mme/callproc/attach");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("1");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_MME_ATCH_ENB"+package_ver);
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
		}
	
	@RequestMapping("/ps/ps_epc/ps_mme/ps_mme_ho/sr")
	public ModelAndView psEpcSr(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/mme/callproc/servicerequest");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("1");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_MME_SR_ENB"+package_ver);
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_mme/ps_mme_ho/sgsap")
	public ModelAndView psEpcSgsap(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/mme/callproc/sgsap");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("1");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_MME_SGS_MSG"+package_ver);
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_pgw/ps_pgw_ho/pgw_ba")
		public ModelAndView psEpcPgwBa(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				commonFunction.setModel(request,session,modelMap);
		
				ModelAndView mav = new ModelAndView();
				mav.setViewName("ps/epc/pgw/callproc/pgw_ba");
				
				List<String> package_ver_list = performStatisServiceService.getPackageVer("4");
				String package_ver = "";
				
				if(package_ver_list.size() != 0){
					package_ver = package_ver_list.get(0);
				}
				
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BA"+package_ver);
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				paramMap.put("cnt", pegCnt+"");
				HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
				
				Set	key = pegComments.keySet();
				for (Iterator iterator = key.iterator(); iterator.hasNext();) {
					String keyname = (String) iterator.next();
					pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
					
				}
				
				mav.addObject("pegCnt",pegCnt);
				mav.addObject("pagingNum",20);
				mav.addObject("pegList", pegComments);
				mav.addObject("package_List", package_ver_list);
				
				return mav;
		}
	
	@RequestMapping("/ps/ps_epc/ps_pgw/ps_pgw_ho/pgw_bm")
	public ModelAndView psEpcPgwBm(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			commonFunction.setModel(request,session,modelMap);
			
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/pgw/callproc/pgw_bm");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("4");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BM"+package_ver);
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_pgw/ps_pgw_ho/pgw_bd")
	public ModelAndView psEpcPgwBd(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			commonFunction.setModel(request,session,modelMap);
		
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/pgw/callproc/pgw_bd");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("4");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BD"+package_ver);
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_sgw/ps_sgw_ho/sgw_ba")
	public ModelAndView psEpcSgwBa(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			commonFunction.setModel(request,session,modelMap);
			
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/sgw/callproc/sgw_ba");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("5");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BA"+package_ver);
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_sgw/ps_sgw_ho/sgw_bm")
	public ModelAndView psEpcSgwBm(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			commonFunction.setModel(request,session,modelMap);
		
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/sgw/callproc/sgw_bm");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("5");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BM"+package_ver);
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_sgw/ps_sgw_ho/sgw_bd")
	public ModelAndView psEpcSgwBd(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/sgw/callproc/sgw_bd");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("5");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BD"+package_ver);
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		paramMap.put("cnt", pegCnt+"");
		HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
		
		Set	key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
			
		}
		
		mav.addObject("pegCnt",pegCnt);
		mav.addObject("pagingNum",20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);
		
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_pcrf/ps_pcrf_pcef")
	public ModelAndView psEpcPcrfPcef(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			commonFunction.setModel(request,session,modelMap);
		
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/pcrf/callproc/pcrf_pcef");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("7");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PCRF_DIAM_PCEF"+package_ver);
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_pcrf/ps_pcrf_spr")
	public ModelAndView psEpcPcrfSpr(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			commonFunction.setModel(request,session,modelMap);
		
			ModelAndView mav = new ModelAndView();
			mav.setViewName("ps/epc/pcrf/callproc/pcrf_spr");
			
			List<String> package_ver_list = performStatisServiceService.getPackageVer("7");
			String package_ver = "";
			
			if(package_ver_list.size() != 0){
				package_ver = package_ver_list.get(0);
			}
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PCRF_DIAM_SPR"+package_ver);
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			paramMap.put("cnt", pegCnt+"");
			HashMap<String,String> pegComments = performStatisServiceService.getPegComments(paramMap);
			
			Set	key = pegComments.keySet();
			for (Iterator iterator = key.iterator(); iterator.hasNext();) {
				String keyname = (String) iterator.next();
				pegComments.put(keyname,pegComments.get(keyname).replace("(count)", ""));
				
			}
			
			mav.addObject("pegCnt",pegCnt);
			mav.addObject("pagingNum",20);
			mav.addObject("pegList", pegComments);
			mav.addObject("package_List", package_ver_list);
			
			return mav;
	}

	@RequestMapping("/ps/ps_epc/ps_pcrf/ps_pcrf_af")
	public ModelAndView psEpcPcrfAf(@RequestParam HashMap<String, Object> paramMap, HttpServletRequest request,
			HttpSession session, ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/pcrf/callproc/pcrf_af");

		List<String> package_ver_list = performStatisServiceService.getPackageVer("7");
		String package_ver = "";

		if (package_ver_list.size() != 0) {
			package_ver = package_ver_list.get(0);
		}

		package_ver = "".equals(package_ver) ? "" : "_" + package_ver;

		paramMap.put("table_nm", "TB_PS_PCRF_DIAM_AF" + package_ver);

		int pegCnt = performStatisServiceService.getPegCount(paramMap);

		paramMap.put("cnt", pegCnt + "");
		HashMap<String, String> pegComments = performStatisServiceService.getPegComments(paramMap);

		Set key = pegComments.keySet();
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyname = (String) iterator.next();
			pegComments.put(keyname, pegComments.get(keyname).replace("(count)", ""));

		}

		mav.addObject("pegCnt", pegCnt);
		mav.addObject("pagingNum", 20);
		mav.addObject("pegList", pegComments);
		mav.addObject("package_List", package_ver_list);

		return mav;
	}
	
	@RequestMapping("/ps/ps_record")
	public ModelAndView psRecord(@RequestParam HashMap<String, Object> paramMap, HttpServletRequest request,
			HttpSession session, ModelMap modelMap) throws Exception {
		commonFunction.setModel(request, session, modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/record/ps_record");
		
		mav.addObject("pagingNum", 20);
		
		return mav;
	}
	
	
	
	@RequestMapping(value="/getDU", method = RequestMethod.POST, produces = "application/json")
		public void getDU(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			List<HashMap<String,String>> equipList = new ArrayList<HashMap<String,String>>();
			try{
					equipList  = performStatisServiceService.getDuList(paramMap);
			} catch(Exception e){
					log.error("에러", e);
			}
			modelMap.put("equipList", equipList);
		}
	
	@RequestMapping(value="/getMME", method = RequestMethod.POST, produces = "application/json")
		public void getMME(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> equipList = new ArrayList<HashMap<String,String>>();
				try{
						equipList  = performStatisServiceService.getMmeList(paramMap);
				} catch(Exception e){
						log.error("에러", e);
				}
				modelMap.put("equipList", equipList);
		}
	
	@RequestMapping(value="/getSGW", method = RequestMethod.POST, produces = "application/json")
		public void getSGW(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> equipList = new ArrayList<HashMap<String,String>>();
				try{
						equipList  = performStatisServiceService.getSgwList(paramMap);
				} catch(Exception e){
						log.error("에러", e);
				}
				modelMap.put("equipList", equipList);
		}
	
	@RequestMapping(value="/getPGW", method = RequestMethod.POST, produces = "application/json")
		public void getPGW(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> equipList = new ArrayList<HashMap<String,String>>();
				try{
						equipList  = performStatisServiceService.getPgwList(paramMap);
				} catch(Exception e){
						log.error("에러", e);
				}
				modelMap.put("equipList", equipList);
		}
	
	@RequestMapping(value="/getPCRF", method = RequestMethod.POST, produces = "application/json")
	public void getPCRF(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
			List<HashMap<String,String>> equipList = new ArrayList<HashMap<String,String>>();
			try{
					equipList  = performStatisServiceService.getPcrfList(paramMap);
			} catch(Exception e){
					log.error("에러", e);
			}
			modelMap.put("equipList", equipList);
	}
	
	@RequestMapping(value="/getSystem", method = RequestMethod.POST, produces = "application/json")
	public void getSystem(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		List<HashMap<String,String>> equipList = new ArrayList<HashMap<String,String>>();
		try{
			equipList  = performStatisServiceService.getSystemList(paramMap);
		} catch(Exception e){
			log.error("에러", e);
		}
		modelMap.put("equipList", equipList);
	}
	
	@RequestMapping(value="/ps/ps_ran/ps_ho/ps_rrc/estab/search")
		public String estabSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> estabInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> estabInfoLength = new ArrayList<HashMap<String,String>>();
				String package_ver = (String)paramMap.get("PACKAGE_VER");
			   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_RRC_CONNECTION_ESTABLISHMENT"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
								estabInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
								estabInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("estabInfoList", estabInfoList);
				modelMap.addAttribute("estabInfoLength", estabInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/callproc/rrc/estab";
		}
		@RequestMapping(value="/ps/ps_ran/ps_ho/ps_erab/setup/search")
		public String erabSetupSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> erabSetupInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> erabSetupInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_E_RAB_SETUP"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							erabSetupInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							erabSetupInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("erabSetupInfoList", erabSetupInfoList);
				modelMap.addAttribute("erabSetupInfoLength", erabSetupInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/callproc/erab/setup";
		}
		@RequestMapping(value="/ps/ps_ran/ps_ho/ps_erab/setup_add/search")
		public String erabSetupAddSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> erabSetupAddInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> erabSetupAddInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_E_RAB_SETUP_ADD"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							erabSetupAddInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							erabSetupAddInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("erabSetupAddInfoList", erabSetupAddInfoList);
				modelMap.addAttribute("erabSetupAddInfoLength", erabSetupAddInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				
				return "/ps/ran/callproc/erab/setup_add";
		}
		@RequestMapping(value="/ps/ps_ran/ps_ho/ps_calldrop/search")
		public String callDropSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> callDropInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> callDropInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_CALL_DROP"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							callDropInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							callDropInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("callDropInfoList", callDropInfoList);
				modelMap.addAttribute("callDropInfoLength", callDropInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/callproc/call_drop";
		}
		@RequestMapping(value="/ps/ps_ran/ps_packet/search")
		public String pdcpPacketSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> pdcpPacketInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> pdcpPacketInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_PDCP_PACKET"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							pdcpPacketInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							pdcpPacketInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("pdcpPacketInfoList", pdcpPacketInfoList);
				modelMap.addAttribute("pdcpPacketInfoLength", pdcpPacketInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/pdcp_packet";
		}

		@RequestMapping(value="/ps/ps_ran/hand_over/intra_enb/search")
		public String intraEnbHandOverSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> handOverInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> handOverInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_INTRA_ENB_HANDOVER"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							handOverInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							handOverInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("handOverInfoList", handOverInfoList);
				modelMap.addAttribute("handOverInfoLength", handOverInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/handover/intra_enb";
		}

		@RequestMapping(value="/ps/ps_ran/hand_over/x2_in/search")
		public String x2InHandOverSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> handOverInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> handOverInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_X2_IN_HANDOVER"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							handOverInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							handOverInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("handOverInfoList", handOverInfoList);
				modelMap.addAttribute("handOverInfoLength", handOverInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/handover/x2_in";
		}

		@RequestMapping(value="/ps/ps_ran/hand_over/x2_out/search")
		public String x2OutHandOverSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> handOverInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> handOverInfoLength = new ArrayList<HashMap<String,String>>();
				
				String package_ver = (String)paramMap.get("PACKAGE_VER");
				   
				package_ver = "".equals(package_ver)?"":"_"+package_ver;
				
				paramMap.put("table_nm", "TB_PS_RAN_X2_OUT_HANDOVER"+package_ver);
				
				try{
						if("length".equals(paramMap.get("GET"))){
							handOverInfoLength = performStatisServiceService.getDataInfoListLength(paramMap);
						}else{
							handOverInfoList  = performStatisServiceService.getDataInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				int pegCnt = performStatisServiceService.getPegCount(paramMap);
				
				modelMap.addAttribute("pegCnt", pegCnt);
				modelMap.addAttribute("handOverInfoList", handOverInfoList);
				modelMap.addAttribute("handOverInfoLength", handOverInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/ran/handover/x2_out";
		}
	
		@RequestMapping(value="/ps/ps_epc/ps_hss/diameter_stack/search")
		public String diameterSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> diameterInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> diameterInfoLength = new ArrayList<HashMap<String,String>>();
				
				paramMap.put("table_nm", "TB_PS_HSS_DIAMETER_STACK"+paramMap.get("PACKAGE_VER"));
				
				try{
						if("length".equals(paramMap.get("GET"))){
								diameterInfoLength = performStatisServiceService.getDiameterInfoListLength(paramMap);
						}else{
								diameterInfoList  = performStatisServiceService.getDiameterInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				modelMap.addAttribute("diameterInfoList", diameterInfoList);
				modelMap.addAttribute("diameterInfoLength", diameterInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/epc/hss/diameter_stack";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_hss/s6a_intf/search")
		public String s6aSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> s6aInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> s6aInfoLength = new ArrayList<HashMap<String,String>>();
				
				paramMap.put("table_nm", "TB_PS_HSS_S6A_INTERFACE"+paramMap.get("PACKAGE_VER"));
				
				try{
						if("length".equals(paramMap.get("GET"))){
								s6aInfoLength = performStatisServiceService.getS6AInfoListLength(paramMap);
						}else{
								s6aInfoList  = performStatisServiceService.getS6AInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				modelMap.addAttribute("s6aInfoList", s6aInfoList);
				modelMap.addAttribute("s6aInfoLength", s6aInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/epc/hss/s6a_intf";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_hss/s13_intf/search")
		public String s13Search(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> s13InfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> s13InfoLength = new ArrayList<HashMap<String,String>>();
				
				paramMap.put("table_nm", "TB_PS_HSS_S13_INTERFACE"+paramMap.get("PACKAGE_VER"));
				
				try{
						if("length".equals(paramMap.get("GET"))){
								s13InfoLength = performStatisServiceService.getS13InfoListLength(paramMap);
						}else{
								s13InfoList  = performStatisServiceService.getS13InfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				modelMap.addAttribute("s13InfoList", s13InfoList);
				modelMap.addAttribute("s13InfoLength", s13InfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/epc/hss/s13_intf";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_hss/sp_intf/search")
		public String spSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
				List<HashMap<String,String>> spInfoList = new ArrayList<HashMap<String,String>>();
				List<HashMap<String,String>> spInfoLength = new ArrayList<HashMap<String,String>>();
				
				paramMap.put("table_nm", "TB_PS_HSS_SP_INTERFACE"+paramMap.get("PACKAGE_VER"));
				
				try{
						if("length".equals(paramMap.get("GET"))){
								spInfoLength = performStatisServiceService.getSPInfoListLength(paramMap);
						}else{
								spInfoList  = performStatisServiceService.getSPInfoList(paramMap);
						}
				} catch(Exception e){
						log.error("에러", e);
				}
				
				modelMap.addAttribute("spInfoList", spInfoList);
				modelMap.addAttribute("spInfoLength", spInfoLength);
				modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
				return "/ps/epc/hss/sp_intf";
		}
		
		
	
		@RequestMapping(value="/ps/ps_epc/ps_mme/ps_mme_ho/attach/search")
		public String attachSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> attachInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> attachInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_MME_ATCH_ENB"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
							attachInfoLength = performStatisServiceService.getAttachInfoListLength(paramMap);
					}else{
							attachInfoList  = performStatisServiceService.getAttachInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("attachInfoList", attachInfoList);
			modelMap.addAttribute("attachInfoLength", attachInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/mme/callproc/attach";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_mme/ps_mme_ho/sr/search")
		public String srSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> srInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> srInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_MME_SR_ENB"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						srInfoLength = performStatisServiceService.getSrInfoListLength(paramMap);
					}else{
						srInfoList  = performStatisServiceService.getSrInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("srInfoList", srInfoList);
			modelMap.addAttribute("srInfoLength", srInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/mme/callproc/servicerequest";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_mme/ps_mme_ho/sgsap/search")
		public String sgsapSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> sgsapInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> sgsapInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_MME_SGS_MSG"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						sgsapInfoLength = performStatisServiceService.getSgsapInfoListLength(paramMap);
					}else{
						sgsapInfoList  = performStatisServiceService.getSgsapInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("sgsapInfoList", sgsapInfoList);
			modelMap.addAttribute("sgsapInfoLength", sgsapInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/mme/callproc/sgsap";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_pgw/ps_pgw_ho/pgw_ba/search")
		public String pgwBaSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> pgwBaInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> pgwBaInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BA"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						pgwBaInfoLength = performStatisServiceService.getPgwInfoListLength(paramMap);
					}else{
						pgwBaInfoList  = performStatisServiceService.getPgwInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("pgwBaInfoList", pgwBaInfoList);
			modelMap.addAttribute("pgwBaInfoLength", pgwBaInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/pgw/callproc/pgw_ba";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_pgw/ps_pgw_ho/pgw_bm/search")
		public String pgwBmSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> pgwBmInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> pgwBmInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BM"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						pgwBmInfoLength = performStatisServiceService.getPgwInfoListLength(paramMap);
					}else{
						pgwBmInfoList  = performStatisServiceService.getPgwInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("pgwBmInfoList", pgwBmInfoList);
			modelMap.addAttribute("pgwBmInfoLength", pgwBmInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/pgw/callproc/pgw_bm";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_pgw/ps_pgw_ho/pgw_bd/search")
		public String pgwBdSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> pgwBdInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> pgwBdInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BD"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						pgwBdInfoLength = performStatisServiceService.getPgwInfoListLength(paramMap);
					}else{
						pgwBdInfoList  = performStatisServiceService.getPgwInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("pgwBdInfoList", pgwBdInfoList);
			modelMap.addAttribute("pgwBdInfoLength", pgwBdInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/pgw/callproc/pgw_bd";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_sgw/ps_sgw_ho/sgw_ba/search")
		public String sgwBaSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> sgwBaInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> sgwBaInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BA"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						sgwBaInfoLength = performStatisServiceService.getSgwInfoListLength(paramMap);
					}else{
						sgwBaInfoList  = performStatisServiceService.getSgwInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("sgwBaInfoList", sgwBaInfoList);
			modelMap.addAttribute("sgwBaInfoLength", sgwBaInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/sgw/callproc/sgw_ba";
		}
		
		@RequestMapping(value="/ps/ps_epc/ps_sgw/ps_sgw_ho/sgw_bm/search")
		public String sgwBmSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
		{
			
			List<HashMap<String,String>> sgwBmInfoList = new ArrayList<HashMap<String,String>>();
			List<HashMap<String,String>> sgwBmInfoLength = new ArrayList<HashMap<String,String>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BM"+package_ver);
			
			try{
					if("length".equals(paramMap.get("GET"))){
						sgwBmInfoLength = performStatisServiceService.getSgwInfoListLength(paramMap);
					}else{
						sgwBmInfoList  = performStatisServiceService.getSgwInfoList(paramMap);
					}
			} catch(Exception e){
					log.error("에러", e);
			}
			
			int pegCnt = performStatisServiceService.getPegCount(paramMap);
			
			modelMap.addAttribute("pegCnt", pegCnt);
			modelMap.addAttribute("sgwBmInfoList", sgwBmInfoList);
			modelMap.addAttribute("sgwBmInfoLength", sgwBmInfoLength);
			modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
			return "ps/epc/sgw/callproc/sgw_bm";
		}
	
	
	@RequestMapping(value="/ps/ps_epc/ps_sgw/ps_sgw_ho/sgw_bd/search")
	public String sgwBdSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		
		List<HashMap<String,String>> sgwBdInfoList = new ArrayList<HashMap<String,String>>();
		List<HashMap<String,String>> sgwBdInfoLength = new ArrayList<HashMap<String,String>>();
		
		String package_ver = (String)paramMap.get("PACKAGE_VER");
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BD"+package_ver);
		
		try{
				if("length".equals(paramMap.get("GET"))){
					sgwBdInfoLength = performStatisServiceService.getSgwInfoListLength(paramMap);
				}else{
					sgwBdInfoList  = performStatisServiceService.getSgwInfoList(paramMap);
				}
		} catch(Exception e){
				log.error("에러", e);
		}
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		modelMap.addAttribute("pegCnt", pegCnt);
		modelMap.addAttribute("sgwBdInfoList", sgwBdInfoList);
		modelMap.addAttribute("sgwBdInfoLength", sgwBdInfoLength);
		modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
		return "ps/epc/sgw/callproc/sgw_bd";
	}

	@RequestMapping("/ps/ps_epc/ps_hss/diameter_stack")
	public ModelAndView psHssDiameterStack(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/hss/diameter_stack");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("6");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		if ( package_ver.equals("") ) {
			paramMap.put("table_nm", "TB_PS_HSS_DIAMETER_STACK"+package_ver);        	
		} else {
			paramMap.put("table_nm", "TB_PS_HSS_DIAMETER_STACK_"+package_ver);
		}
						
		mav.addObject("pagingNum",20);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_hss/s6a_intf")
	public ModelAndView psHssS6A(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/hss/s6a_intf");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("6");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		if ( package_ver.equals("") ) {
			paramMap.put("table_nm", "TB_PS_HSS_S6A_INTERFACE"+package_ver);        	
		} else {
			paramMap.put("table_nm", "TB_PS_HSS_S6A_INTERFACE_"+package_ver);        	
		}
						
		mav.addObject("pagingNum",20);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_hss/s13_intf")
	public ModelAndView psHssS13(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/hss/s13_intf");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("6");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		if ( package_ver.equals("") ) {
			paramMap.put("table_nm", "TB_PS_HSS_S13_INTERFACE"+package_ver);        	
		} else {
			paramMap.put("table_nm", "TB_PS_HSS_S13_INTERFACE_"+package_ver);        	
		}
						
		mav.addObject("pagingNum",20);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping("/ps/ps_epc/ps_hss/sp_intf")
	public ModelAndView psHssSP(@RequestParam HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		commonFunction.setModel(request,session,modelMap);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("ps/epc/hss/sp_intf");
		
		List<String> package_ver_list = performStatisServiceService.getPackageVer("6");
		String package_ver = "";
		
		if(package_ver_list.size() != 0){
			package_ver = package_ver_list.get(0);
		}
		
		if ( package_ver.equals("") ) {
			paramMap.put("table_nm", "TB_PS_HSS_SP_INTERFACE"+package_ver);        	
		} else {
			paramMap.put("table_nm", "TB_PS_HSS_SP_INTERFACE_"+package_ver);        	
		}
		
		mav.addObject("pagingNum",20);
		mav.addObject("package_List", package_ver_list);
		return mav;
	}
	
	@RequestMapping(value="/ps/ps_epc/ps_pcrf/ps_pcrf_pcef/search")
	public String pcefSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		
		List<HashMap<String,String>> pcefInfoList = new ArrayList<HashMap<String,String>>();
		List<HashMap<String,String>> pcefInfoLength = new ArrayList<HashMap<String,String>>();
		
		String package_ver = (String)paramMap.get("PACKAGE_VER");
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_PCRF_DIAM_PCEF"+package_ver);
		
		try{
				if("length".equals(paramMap.get("GET"))){
					pcefInfoLength = performStatisServiceService.getPcefInfoListLength(paramMap);
				}else{
					pcefInfoList  = performStatisServiceService.getPcefInfoList(paramMap);
				}
		} catch(Exception e){
				log.error("에러", e);
		}
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		modelMap.addAttribute("pegCnt", pegCnt);
		modelMap.addAttribute("pcefInfoList", pcefInfoList);
		modelMap.addAttribute("pcefInfoLength", pcefInfoLength);
		modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
		return "ps/epc/pcrf/callproc/pcrf_pcef";
	}
	
	
	@RequestMapping(value="/ps/ps_epc/ps_pcrf/ps_pcrf_spr/search")
	public String sprSearch(@RequestBody HashMap<String,Object> paramMap, HttpServletRequest request,HttpSession session,ModelMap modelMap) throws Exception 
	{
		
		List<HashMap<String,String>> sprInfoList = new ArrayList<HashMap<String,String>>();
		List<HashMap<String,String>> sprInfoLength = new ArrayList<HashMap<String,String>>();
		
		String package_ver = (String)paramMap.get("PACKAGE_VER");
		
		package_ver = "".equals(package_ver)?"":"_"+package_ver;
		
		paramMap.put("table_nm", "TB_PS_PCRF_DIAM_SPR"+package_ver);
		
		try{
				if("length".equals(paramMap.get("GET"))){
					sprInfoLength = performStatisServiceService.getSprInfoListLength(paramMap);
				}else{
					sprInfoList  = performStatisServiceService.getSprInfoList(paramMap);
				}
		} catch(Exception e){
				log.error("에러", e);
		}
		
		int pegCnt = performStatisServiceService.getPegCount(paramMap);
		
		modelMap.addAttribute("pegCnt", pegCnt);
		modelMap.addAttribute("sprInfoList", sprInfoList);
		modelMap.addAttribute("sprInfoLength", sprInfoLength);
		modelMap.addAttribute("pagingNum",paramMap.get("PAGINGNUM"));
		return "ps/epc/pcrf/callproc/pcrf_spr";
	}

	@RequestMapping(value = "/ps/ps_epc/ps_pcrf/ps_pcrf_af/search")
	public String afSearch(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request,
			HttpSession session, ModelMap modelMap) throws Exception {

		List<HashMap<String, String>> afInfoList = new ArrayList<HashMap<String, String>>();
		List<HashMap<String, String>> afInfoLength = new ArrayList<HashMap<String, String>>();

		String package_ver = (String) paramMap.get("PACKAGE_VER");

		package_ver = "".equals(package_ver) ? "" : "_" + package_ver;

		paramMap.put("table_nm", "TB_PS_PCRF_DIAM_AF" + package_ver);

		try {
			if ("length".equals(paramMap.get("GET"))) {
				afInfoLength = performStatisServiceService.getAfInfoListLength(paramMap);
			} else {
				afInfoList = performStatisServiceService.getAfInfoList(paramMap);
			}
		} catch (Exception e) {
			log.error("에러", e);
		}

		int pegCnt = performStatisServiceService.getPegCount(paramMap);

		modelMap.addAttribute("pegCnt", pegCnt);
		modelMap.addAttribute("afInfoList", afInfoList);
		modelMap.addAttribute("afInfoLength", afInfoLength);
		modelMap.addAttribute("pagingNum", paramMap.get("PAGINGNUM"));
		return "ps/epc/pcrf/callproc/pcrf_af";
	}

	@RequestMapping(value = "/ps/ps_record/search")
	public String recordSearch(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request,
			HttpSession session, ModelMap modelMap) throws Exception {

		List<HashMap<String, String>> infoList = new ArrayList<HashMap<String, String>>();
		List<HashMap<String, String>> infoLength = new ArrayList<HashMap<String, String>>();

		try {
			if ("length".equals(paramMap.get("GET"))) {
				infoLength = performStatisServiceService.getRecordInfoListLength(paramMap);
			} else {
				infoList = performStatisServiceService.getRecordInfoList(paramMap);
			}
		} catch (Exception e) {
			log.error("에러", e);
		}

		modelMap.addAttribute("infoList", infoList);
		modelMap.addAttribute("infoLength", infoLength);
		modelMap.addAttribute("pagingNum", paramMap.get("PAGINGNUM"));
		return "ps/record/ps_record";
	}
	
	
	@RequestMapping(value="/ps/excelDown", method=RequestMethod.GET)
		@ResponseBody
		public void excelDown(@RequestParam HashMap<String,Object> paramMap, ModelMap modelMap, HttpServletResponse response,HttpServletRequest request) throws Exception {
			log.info("get ExcelDown");
			CreateExcel excel = new CreateExcel();
			Map<String,List<Map<String,String>>> getExcelDownData = new HashMap<String,List<Map<String,String>>>();
			
			String package_ver = (String)paramMap.get("PACKAGE_VER");
			package_ver = "".equals(package_ver)?"":"_"+package_ver;
			
			if("ESTAB".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_RRC_CONNECTION_ESTABLISHMENT"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("ERABSETUP".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_E_RAB_SETUP"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("ERABSETUPADD".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_E_RAB_SETUP_ADD"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("CALLDROP".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_CALL_DROP"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("PDCPPACKET".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_PDCP_PACKET"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("INTRAENB".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_INTRA_ENB_HANDOVER"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("X2IN".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_X2_IN_HANDOVER"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("X2OUT".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_RAN_X2_OUT_HANDOVER"+package_ver);
				getExcelDownData = performStatisServiceService.getDataExcel(paramMap);
			}else if("ATTACH".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_MME_ATCH_ENB"+package_ver);
				getExcelDownData = performStatisServiceService.getAttachExcel(paramMap);
			}else if("SR".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_MME_SR_ENB"+package_ver);
				getExcelDownData = performStatisServiceService.getSrExcel(paramMap);
			}else if("SGSAP".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_MME_SGS_MSG"+package_ver);
				getExcelDownData = performStatisServiceService.getSgsapExcel(paramMap);
			}else if("PGWBA".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BA"+package_ver);
				getExcelDownData = performStatisServiceService.getPgwExcel(paramMap);
			}else if("PGWBM".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BM"+package_ver);
				getExcelDownData = performStatisServiceService.getPgwExcel(paramMap);
			}else if("PGWBD".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_PGW_SMPGW_BD"+package_ver);
				getExcelDownData = performStatisServiceService.getPgwExcel(paramMap);
			}else if("SGWBA".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BA"+package_ver);
				getExcelDownData = performStatisServiceService.getSgwExcel(paramMap);
			}else if("SGWBM".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BM"+package_ver);
				getExcelDownData = performStatisServiceService.getSgwExcel(paramMap);
			}else if("SGWBD".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_SGW_SMSGW_BD"+package_ver);
				getExcelDownData = performStatisServiceService.getSgwExcel(paramMap);
			}else if("DIAMETER".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_HSS_DIAMETER_STACK"+package_ver);
				getExcelDownData = performStatisServiceService.getDiameterExcel(paramMap);
			}else if("S6A".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_HSS_S6A_INTERFACE"+package_ver);
				getExcelDownData = performStatisServiceService.getS6AExcel(paramMap);
			}else if("S13".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_HSS_S13_INTERFACE"+package_ver);
				getExcelDownData = performStatisServiceService.getS13Excel(paramMap);
			}else if("SP".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_HSS_SP_INTERFACE"+package_ver);
				getExcelDownData = performStatisServiceService.getSPExcel(paramMap);
			}else if("PCEF".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_PCRF_DIAM_PCEF"+package_ver);
				getExcelDownData = performStatisServiceService.getPcefExcel(paramMap);
			}else if("SPR".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_PCRF_DIAM_SPR"+package_ver);
				getExcelDownData = performStatisServiceService.getSprExcel(paramMap);
			}else if("AF".equals(paramMap.get("PAGE"))){
				paramMap.put("table_nm", "TB_PS_PCRF_DIAM_AF"+package_ver);
				getExcelDownData = performStatisServiceService.getAfExcel(paramMap);
			}else if("RECORD".equals(paramMap.get("PAGE"))){
				getExcelDownData = performStatisServiceService.getRecordExcel(paramMap);
			}
			String headerStr = "";
			String headers = (String)paramMap.get("HEADERS");
			String columns = (String)paramMap.get("COLUMNS");
			String[] headerArray = headers.split(",");
			String[] columnArray = columns.split(",");
			
			ArrayList<String> headerList = new ArrayList<String>();
			ArrayList<String> columnList = new ArrayList<String>();
			for(int i=0;i<headerArray.length;i++){
					headerList.add(headerArray[i]);
			}
			for(int i=0;i<columnArray.length;i++){
					columnList.add(columnArray[i]);
				}
			
			String fileName = URLEncoder.encode((String)paramMap.get("TITLE"), "utf-8")+"_"+(String)paramMap.get("SUB_TITLE")+".xlsx";
			headerStr = (String)paramMap.get("TITLE")+ "_"+(String)paramMap.get("SUB_TITLE");
		  
			Workbook xlsxWb = excel.create_Excel(getExcelDownData, headerList, headerStr,columnList);
			
			response.setContentType("application/vnd.ms-excel");
			response.addHeader("Content-Disposition", "attachment; filename=" + fileName);
			response.addHeader("Set-Cookie", "fileDownload=true; path=/");
			
			xlsxWb.write(response.getOutputStream());  
		}
	
	
}
