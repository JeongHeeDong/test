package com.ltem.v2.dto;

import java.util.Date;

public class TbSeWebLogDTO  {
	
	private int id;
	private Date eventTime;
	private String userId;
	private int temaId;
	private String menuId;
	private String menuName;
	private String ip;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Date getEventTime() {
		return eventTime;
	}
	public void setEventTime(Date eventTime) {
		this.eventTime = eventTime;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public int getTemaId() {
		return temaId;
	}
	public void setTemaId(int temaId) {
		this.temaId = temaId;
	}
	public String getMenuId() {
		return menuId;
	}
	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}

	
}
