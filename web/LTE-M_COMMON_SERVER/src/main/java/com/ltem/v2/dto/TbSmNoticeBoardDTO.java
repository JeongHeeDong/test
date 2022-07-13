package com.ltem.v2.dto;

import java.util.Date;

public class TbSmNoticeBoardDTO  {
	
	private Date eventTime;
	private String userId;
	private String noticeTitle;
	private String noticeDesc;
	private String fileName;
	private String filePath;
	private Date fromDate;
	private Date toDate;
	private String mainNotiYn;

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
	public String getNoticeTitle() {
		return noticeTitle;
	}
	public void setNoticeTitle(String noticeTitle) {
		this.noticeTitle = noticeTitle;
	}
	public String getNoticeDesc() {
		return noticeDesc;
	}
	public void setNoticeDesc(String noticeDesc) {
		this.noticeDesc = noticeDesc;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public Date getFromDate() {
		return fromDate;
	}
	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}
	public Date getToDate() {
		return toDate;
	}
	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}
	public String getMainNotiYn() {
		return mainNotiYn;
	}
	public void setMainNotiYn(String mainNotiYn) {
		this.mainNotiYn = mainNotiYn;
	}
	
	
	
}
