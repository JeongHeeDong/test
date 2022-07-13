<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html lang="ko">
<head>
<title><c:out value="${menuName}" /></title>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- meta tags -->
<meta name="description" content="LTEM">
<meta name="keywords" content="">
<meta name="robots" content="noindex,nofollow">

<!-- favicon -->
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />

<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/font-awesome.min.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/common.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/layout_top.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/style.css"><c:param name="version" value="${nowDate}"/></c:url>">
<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/dev.css"><c:param name="version" value="${nowDate}"/></c:url>">

<!--[if lt IE 9]>
    <script src="js/html5.js"></script>
    <script src="js/respond.min.js"></script>
<![endif]-->
<script src="/resources/lib/jquery-3.1.1.min.js"></script>
<script src="/resources/lib/jquery-ui.min.js"></script>
<script src="/resources/lib/jquery.form.js"></script>

<script type="text/javascript" src="/resources/lib/lodash.min.js"></script>
<script type="text/javascript" src="/resources/js/ps/common/components/util.js"></script>

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
<%--
<script>
$( "#demo-1" ).click(function() {
  $.iaoAlert()
});
$( "#demo-2" ).click(function() {
  $.iaoAlert({msg: "Dark Theme",
            type: "notification",
            mode: "dark",})
});
$( "#demo-3" ).click(function() {
  $.iaoAlert({msg: "Success + Light Theme",
            type: "success",
            mode: "light",})
});
$( "#demo-4" ).click(function() {
  $.iaoAlert({msg: "Error + Dark Theme",
            type: "error",
            mode: "dark",})
});
$( "#demo-5" ).click(function() {
  $.iaoAlert({msg: "Warning + Dark Theme",
            type: "warning",
            mode: "dark",})
});
</script>
 --%>

</head>
<body>
