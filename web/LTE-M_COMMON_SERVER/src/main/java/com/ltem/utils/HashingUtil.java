package com.ltem.utils;

import java.nio.charset.Charset;
import java.security.MessageDigest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ltem.service.impl.TrainOperationServiceImpl;

/**
 * Created by sungnam on 2015-12-29.
 */
public class HashingUtil {
	
	private static final Logger log = LoggerFactory.getLogger(HashingUtil.class);
	
    public String encrypt(String plainText) {
        String afterHashing = "";
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(plainText.getBytes(Charset.forName("UTF-8")));
            byte byteData[] = md.digest();

            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < byteData.length; i++) {
                sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
            }
            afterHashing = sb.toString();

//            StringBuffer hexString = new StringBuffer();
//            for (int i=0;i<byteData.length;i++) {
//                String hex=Integer.toHexString(0xff & byteData[i]);
//                if(hex.length()==1){
//                    hexString.append('0');
//                }
//                hexString.append(hex);
//            }
//            return hexString.toString();

            return afterHashing;

        }catch(Exception e){
        	log.error(e.getMessage());
            throw new RuntimeException();
        }
    }
}
