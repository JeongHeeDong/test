<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<title><c:out value="${pageTitle}" /></title>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<jsp:useBean id="today" class="java.util.Date" />
<%-- <fmt:formatDate value="${today}" pattern="yyyyMMddHHmm" var="nowDate"/> --%>
<fmt:formatDate value="${today}" pattern="yyyyMMddHHmmsss" var="nowDate"/>
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/font-awesome.min.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/common.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/layout_top.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/style.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/dev.css"><c:param name="version" value="${nowDate}"/></c:url>">

<!--[if lt IE 9]>
	<script src="js/html5.js"></script>
	<script src="js/respond.min.js"></script>
<![endif]-->
<script src="/resources/lib/jquery-1.11.2.min.js"></script>
<script src="/resources/lib/jquery-ui.min.js"></script>
<script src="/resources/lib/jquery.form.js"></script>
<script src="/resources/lib/colResizable-1.5.min.js"></script>
<script src="/resources/lib/lodash.min.js"></script>
<script src="/resources/js/moment.js"></script>
<script src="<c:url value="/resources/js/common.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
<!-- <script src="/resources/js/common.js"></script> -->
<style type="text/css">
		a:link{color:black;}
		a:visited{color:purple;}
		a:hover{color:blue;}
		a:active{color:red;}
</style>

<script>
   var projectProfile = '${projectProfile}';
</script>

<%-- alert plugin --%>
<%-- https://www.jqueryscript.net/demo/Stylish-jQuery-Notification-Alert-Plugin-Smart-Alert/quick-start/ --%>
<link href="/resources/plugins/alert/css/alert.css" rel="stylesheet" />
<link href="/resources/plugins/alert/themes/default/theme.css" rel="stylesheet" />
<script src="/resources/plugins/alert/js/alert.js"></script>
<script>
// alert override
window.alert = function(message){
    $.alert.open(message);
};
</script>

<%-- show message plugin --%>
<link href="/resources/plugins/iao_alert/iao-alert.css" rel="stylesheet" type="text/css">
<script src="/resources/plugins/iao_alert/iao-alert.jquery.js"></script>

