package com.ltem.websocket;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.VertxFactory;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.net.NetClient;
import org.vertx.java.core.net.NetSocket;

public class SocketPutHandler extends TextWebSocketHandler implements InitializingBean {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	private final Vertx vertx = VertxFactory.newVertx();
	private final EventBus eventBus = vertx.eventBus();
	
	private Set<WebSocketSession> sessionSet = new HashSet<WebSocketSession>();

	@Value("#{locationconfig['websocket.inputaddr']}")
	String ES_INPUT_ADDR; // event서버 입력 서버
	
	public SocketPutHandler() {
		super();
		logger.info("create SocketHandler instance!");
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		super.afterConnectionClosed(session, status);
		sessionSet.remove(session);
		
		try {
			((NetClient) session.getAttributes().get("client")).close();
		} catch(Exception e) {
		}
		
		logger.info("remove session!");
	}
	
	@Override
	public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
		super.afterConnectionEstablished(session);
		sessionSet.add(session);
		
		String addr = ES_INPUT_ADDR;
		String host = addr.split(":")[0];
		int port = Integer.parseInt(addr.split(":")[1]);
		
		final NetClient client = vertx.createNetClient()
				.setReceiveBufferSize(1024 * 2)
				.setReconnectInterval(5000)
				.setReconnectAttempts(1000)
				;

		client.connect(port, host, new Handler<AsyncResult<NetSocket>>() {
			
			public void handle(AsyncResult<NetSocket> asyncResult){
				final String sockHandlerID = asyncResult.result().writeHandlerID();
				if(asyncResult.succeeded()){
					logger.info(String.format("[%s] socket connected", sockHandlerID));

					// 접속이 끊기면 
					asyncResult.result().closeHandler(new Handler<Void>() {
						public void handle(Void event) {
							logger.info(String.format("[%s] socket closed", sockHandlerID));
							try {
								session.close();
							} catch (IOException e) {
							}
						}
					});
					
					// 이벤트서버로 부터 받은 메시지
					asyncResult.result().dataHandler(new Handler<Buffer>() {
						public void handle(Buffer data) {
							// 클라이언트로 메시지를 보냄.
							try {
								if(logger.isDebugEnabled()) {
									logger.debug(String.format("[%s]socket recv[%s]", sockHandlerID, data.toString()));
								}
								
								session.sendMessage(new TextMessage(data.toString()));
								
							} catch(Exception e){
								logger.error(e.getMessage());
							}
						}
					});
				} else {
					logger.info(String.format("[%s] socket disconnected", sockHandlerID));
					asyncResult.cause().printStackTrace();
					// 초기 접속이 안되면 websocket 도 닫음.
					try {
						session.close();
					} catch (IOException e) {
					}
				}
				session.getAttributes().put("sockHandlerID", sockHandlerID);
			}
		}); // end Socket Client
        session.getAttributes().put("client", client);
		
		logger.info("add session!");
	}

	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		super.handleMessage(session, message);
		logger.debug("receive message:" + message.getPayload().toString());
		
		String handlerID = (String) session.getAttributes().get("sockHandlerID");
		eventBus.send(handlerID, new Buffer(message.getPayload().toString()));
		
	}
	
	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		//logger.error("web socket error!", exception);
	}
	
	@Override
	public boolean supportsPartialMessages() {
		logger.info("call method!");
		return super.supportsPartialMessages();
	}
	
	public void sendMessage(String message) {
		for (WebSocketSession session : this.sessionSet) {
			if (session.isOpen()) {
				try {
					session.sendMessage(new TextMessage(message));
				} catch (Exception ignored) {
					logger.error("fail to send message!", ignored);
				}
			}
		}
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
	}
}
