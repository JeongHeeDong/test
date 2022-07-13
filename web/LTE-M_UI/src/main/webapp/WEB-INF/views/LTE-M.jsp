<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>LTE-M > 보안 > 접속 이력 관리</title>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link href="/resources/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
	<link href="/resources/css/common.css" rel="stylesheet" type="text/css" />
	<link href="/resources/css/layout_top.css" rel="stylesheet" type="text/css" />
	<link href="/resources/css/style.css" rel="stylesheet" type="text/css" />
	<!--[if lt IE 9]>
	<script src="js/html5.js"></script>
	<script src="js/respond.min.js"></script>
	<![endif]-->
	<script src="/resources/lib/jquery-1.11.2.min.js"></script>
	<script src="/resources/lib/jquery-ui.min.js"></script>
	<script src="/resources/lib/jquery.form.js"></script>
	<script src="/resources/js/common.js"></script>
	<script src="/resources/js/menu/menu.js"></script>
	<script>
		$(document).ready(function(){
			$('li:first-child')[0].click();
		});
	</script>
</head>
<body>
<div style="display:none;">
<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
</div>
<div class="mu-container">
	<section>
	</section>
</div>
<footer>Copyright <i class="mu-icon copyright"></i> 2015 Mobigen. All rights reserved.</footer>
</body>
</html>