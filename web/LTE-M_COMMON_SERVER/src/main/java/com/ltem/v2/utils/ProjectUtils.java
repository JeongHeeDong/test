package com.ltem.v2.utils;

import java.security.MessageDigest;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.ltem.v2.common.V2Constants;

@Component
public class ProjectUtils {

	/*********************************************************************
	 * String projectProfile = StringUtils.defaultString(System.getProperty("lter.project.profile"));
	 * request.setAttribute("isNew", projectUtils.isNew());
	 * request.setAttribute("projectProfile", projectProfile);
	 *-------------------------------------------------------------------- 
	 * <jsp:useBean id="ProjectUtil" class="com.ltem.utils.ProjectUtils" />
	 * <%= ProjectUtils.P168 %>
	 * <%= ProjectUtils.isNew() %>
	 * <%= ProjectUtils.getProjectProfile() %>
	 *-------------------------------------------------------------------- 
	 * @Value("#{systemProperties['lter.project.profile']}") 
	 * private String projectProfile;
	 *-------------------------------------------------------------------- 
	 * @Autowired
	 * ProjectUtil projectUtil;
	*********************************************************************/ 
	
	private static final Logger log = LoggerFactory.getLogger(ProjectUtils.class);
	
	/**
	 * Tomcat Argument
	 * @return
	 */
	public static String getProjectProfile() {
		return StringUtils.defaultString(System.getProperty("lter.project.profile"));
	}
	
	/**
	 * 신규 작업페이지 여부
	 * 프로젝트 추가 시 분기조건 추가
	 * @return
	 */
	public static boolean isNew() {
		String projectProfile = StringUtils.defaultString(System.getProperty("lter.project.profile"));
		
		if (V2Constants.REFACTORY.equalsIgnoreCase(projectProfile)) {
			return true;	// V2분기작업
		} else {	
			return false;	// P168, 스마트항공기지
		}
	}
	
	/**
	 * V2 jsp directory 구분자
	 * @return
	 */
	public static String v2Prefix() {
//		return isNew()?"v2/":"";
		return "v2/";
	}
	
	
	
	/**
	 * Ajax 호출 여부
	 * @param request
	 * @return
	 */
	public static boolean isAjax(HttpServletRequest request) {
		return "XMLHttpRequest".equalsIgnoreCase(request.getHeader("x-requested-with"));	
	}
	
	/**
	 * AES Javascript 암호화 To Java 복호화
	 * encString format JSON
	 * 사용파일 : duDetail.js
	 * 
	 * --------------------------------------------------------------------
	 * <script src="/resources/js/login/aes.js"></script>
	 * <script src="/resources/js/login/sha256.js"></script>
	 * var CryptoJSAesJson = {
		    stringify: function (cipherParams) {
		        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
		        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
		        if (cipherParams.salt) j.s = cipherParams.salt.toString();
		        return JSON.stringify(j);
		    }
		}
		
 	 *
 	 *  ----------------------------------------------------------------------
 	 *  /home/ltenms/usr/local/jdk1.7.0_04/jre/lib/security
 	 *  local_policy.jar, US_export_policy.jar을 1.7 기준으로 교체 (com.ltem.v2.utils 하위에 임시 보관)
	 */
	public static String javascriptToJavaDecrypt(String encString, String encKey) {
	
		String strPassWord = encKey; //"FEMTO102";
		String strJson = encString; //"{\"ct\":\"itf1aGnJqPkTkiNBv0L6+g==\",\"iv\":\"84ed897f72b8cb9d2e08eb29578c0daa\",\"s\":\"c24ed087f2e78f28\"}";

		log.info(">>> strPassWord : " + strPassWord);
		log.info(">>> strJson : " + strJson);
		
		try {
			
		    // json 파싱한 후, salt, iv, ciphertext 를 저장한다.
			JSONParser clsParser = new JSONParser( );
			JSONObject clsJson = (JSONObject)clsParser.parse( strJson );
	
			String strSalt = (String)clsJson.get( "s" );
			String strIv = (String)clsJson.get( "iv" );
			String strCt = (String)clsJson.get( "ct" );
			
			log.info(">>> strSalt : " + strSalt);
			log.info(">>> strIv : " + strIv);
			log.info(">>> strCt : " + strCt);
	
			byte[] arrSalt = DatatypeConverter.parseHexBinary( strSalt );
			byte[] arrIv = DatatypeConverter.parseHexBinary( strIv );
			byte[] arrCt = Base64.decodeBase64( strCt.getBytes( "UTF-8" ) );
	
		    // 암호화/복호화 키를 생성한다.
			final byte[] arrKey = GetKey( 32, arrSalt, strPassWord.getBytes( "UTF-8" ) );
			SecretKeySpec key = new SecretKeySpec( arrKey, "AES" );
	
		    // IV
			IvParameterSpec iv = new IvParameterSpec( arrIv );
	
		    // 복호화한다.
			Cipher aesCBC = Cipher.getInstance( "AES/CBC/PKCS5Padding" );
			aesCBC.init( Cipher.DECRYPT_MODE, key, iv );
			byte[] arrOutput = aesCBC.doFinal( arrCt );
	
			return( new String( arrOutput, "UTF-8" ) );
			
		} catch (Exception e) {
			log.error(">>> javascriptToJavaDecrypt exception : " + e.getMessage());
			return StringUtils.EMPTY;
		}
	}
	
	public static byte[] GetKey( int iKeyLen, byte[] arrSalt, byte[] arrPassWord ) throws Exception
	{
		MessageDigest clsMd5 = MessageDigest.getInstance( "MD5" );

		int iDigestLen = clsMd5.getDigestLength( );
		int iDataSize = (iKeyLen + iDigestLen - 1) / iDigestLen * iDigestLen;
		byte[] arrData = new byte[iDataSize];
		int iDataLen = 0;

		clsMd5.reset( );

		while( iDataLen < iKeyLen ) {
			if( iDataLen > 0 ) {
				clsMd5.update( arrData, iDataLen - iDigestLen, iDigestLen );
			}
			
			clsMd5.update( arrPassWord );
			
			if( arrSalt != null ) {
				clsMd5.update( arrSalt, 0, 8 );
			}
			
			clsMd5.digest( arrData, iDataLen, iDigestLen );

			iDataLen += iDigestLen;
		}
		return Arrays.copyOfRange( arrData, 0, iKeyLen );
	}

    
}