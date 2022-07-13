<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="/resources/lib/jquery-1.11.2.min.js"></script>
	<script>
		$(document).ready(function(){
			alert("세션 정보가 없습니다.");
			window.opener.location.href='/login';
			window.open("about:blank","_self").close();
		});
	</script>
</head>
<body>
<div class="mu-container">
	<section>
	</section>
</div>
</body>
</html>