<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true" %>
<%@ page import="org.slf4j.Logger" %>
<%@ page import="org.slf4j.LoggerFactory" %>
<% Logger logger = LoggerFactory.getLogger("errorPage"); %>
<% logger.error("Request: " + request.getAttribute("javax.servlet.error.request_uri")+", status Code : " + request.getAttribute("javax.servlet.error.status_code") + " ,Error Massage: " + exception , exception); %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>LTE-M > error page</title>
</head>
<body>
<div style="height:100px; line-height:100px; vertical-align:middle;text-align: center;margin-top:150px">
	<img src="/resources/images/error/error.png" />
</div>
<input type="hidden" value="<%="Request: " + request.getAttribute("javax.servlet.error.request_uri")+", status Code : " + request.getAttribute("javax.servlet.error.status_code") + " ,Error Massage: " + exception %>"/>

</body>
</html>