<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/import/import_page.jsp"%>
</head>
<body>
	<%@ include file="/WEB-INF/views/menu/menu.jsp"%>
	<div class="mu-container dashboard main">
		<iframe id="report-frame" style="width: 100%; height: 100%;"></iframe>
	</div>
	<script>
		$(document).ready(
			function() {
				var url = 'http://' + window.location.hostname + ':18080';
//  				var url = 'http://iris.test.com:18080';	
				$('#report-frame').attr('src', url+'/iris-studio-service');
			}
		);
	</script>
</body>
</html>