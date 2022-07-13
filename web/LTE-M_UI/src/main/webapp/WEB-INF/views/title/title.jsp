<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 


<div class="titleWrap">
	<h3 class="mu-title"><c:out value="${title}" /></h3>
	<!-- 디자인변경 추가됨 title.jsp수정 -->
	<ol class="mu-path">
		<li><c:out value="${subtitle}" /></li>
	</ol>
	<!-- //디자인변경 추가됨 title.jsp수정 -->
</div>