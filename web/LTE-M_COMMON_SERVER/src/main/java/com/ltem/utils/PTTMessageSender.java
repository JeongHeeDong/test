package com.ltem.utils;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PTTMessageSender {
	
	private static final Logger log = LoggerFactory.getLogger(PTTMessageSender.class);
	
    private Socket socket;
    
    @Value("#{locationconfig['ptt.serverIp']}")
	String serverIp;
    
    private int port = 9100;  

    public int messageSend(String msg) {
        int result = -1;
        OutputStream out;
        DataOutputStream output = null;
        System.out.println(serverIp + " : " +port);
        try {
            socket = new Socket(serverIp, port);
            out = socket.getOutputStream();
            output = new DataOutputStream(out);
            output.writeUTF(msg);

            result = 1;
        } catch (IOException e) {
            result = -1;
            log.error(e.getMessage());
        } finally {
        	try {
				socket.close();
				output.close();
			} catch (IOException e) {
				log.error(e.getMessage());
			}
		}

        return result;
    }
}