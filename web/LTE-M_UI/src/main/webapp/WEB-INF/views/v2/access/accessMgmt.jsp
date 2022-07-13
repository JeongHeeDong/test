<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.util.Date, java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/views/import/import_page.jsp" %>
	<script>
	$(document).ready(function(){
	    pageSearch();
	});
	
	function pageSearch() {
		
		$("#accessList").empty();
		
		var data = {
		    };

		    $.ajax({
		        type:'post',
		        url:'/v2/getAccessInfo',
		        data : JSON.stringify(data),
		        contentType: 'application/json',
		        dataType : 'json',
		        success : function(data) {
		            //console.log('>>> data : ' + JSON.stringify(data));
		            
		            if (data.resultMsg.length > 0) {
		                $(data.resultMsg).each(function(index,value){
		                	//console.log('>>> index : ' + index);
		                	var accessList = ''
		                	+ '<tr>'
		                	+ '<td>' + value.equipTypeName + '</td>'
		                	+ '<td>' + value.equipId + '</td>'
		                	+ '<td>' + value.equipName + '</td>'
		                	+ '<td>'
		                	+ '<button type="button" id="equipUpdate_' + index + '" equipType="' + value.equipType + '" equipId="' + value.equipId + '" equipName="' + value.equipName + '" loginId="' + value.loginId + '" onClick="updateAccessInfo(' + index + ');" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon edit">' + value.loginId + '</i></button>'
		                	+ '</td>'
		                	+ '<td>' + (value.updateUserId == null?'-':value.updateUserId) + '</td>'
		                	+ '<td>' + (value.updateDate == null?'-':moment(new Date(value.updateDate)).format('YYYY/MM/DD HH:mm')) + '</td>'
		                	+ '</tr>';
		                	$("#accessList").append(accessList);        
                        });
		            	
		            
		            } else {
		                var emptyList = '<tr><td colspan="7">등록된 접속 정보가 없습니다.</td></tr>';
                        $("#accessList").append(emptyList);  
		            }
		        },
		        error : function(request,status,error){
		            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		        }
		    });
		    
	}
	
	function updateAccessInfo(index) {
		var equipType = $('#equipUpdate_' + index).attr('equipType');
		var equipName = $('#equipUpdate_' + index).attr('equipName');
		var equipId = $('#equipUpdate_' + index).attr('equipId');
		var loginId = $('#equipUpdate_' + index).attr('loginId');
		
		if (!(equipType && equipName && equipId && loginId)) {
			alert("장비 접속 정보를 확인하세요.");
			return;
		}
		
		$("#equipUpdateId").val(equipId);
		$("#equipUpdateName").val(equipName);
		$("#equipUpdateType").val(equipType);
		$("#equipUpdateLoginId").val(loginId);
		
		$("#equipUpdateLoginIdText").text(loginId);
        $("#equipPasswordMessage").text(equipName);
        
        $("#equipPasswordBg").show();
        $("#equipPasswordUp").show();

        $("#equipPasswordUp").css({
            "top": (($(window).height()-$("#equipPasswordUp").outerHeight())/2+$(window).scrollTop())+"px",
            "left": (($(window).width()-$("#equipPasswordUp").outerWidth())/2+$(window).scrollLeft())+"px"
        });		
	}
	</script>
</head>
<body>

	<%@ include file="/WEB-INF/views/menu/menu.jsp" %>
	<div class="mu-container">
		<section>
			<%@ include file="/WEB-INF/views/title/title.jsp" %>

			<div class="mu-row">
				<div class="mu-col mu-col-12">
					<div class="gridWrap gridScrollT mt10">
						<table id="accountTable" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
								<col>
								<col>
								<col>
								<col>
								<col>
								<col>
							</colgroup>
							<thead>
								<tr>
									<th>장비타입</th>
									<th>장비ID</th>
									<th>장비명</th>
									<th>접속계정</th>
									<th>수정자 아이디</th>
									<th>수정 일시</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="gridWrap mu-scroll-v" style="min-height:225px; max-height: 642px; overflow-y:scroll;">
						<table id="accountBodyTable" class="mu-grid mu-grid-scroll mu-grid-border mu-grid-strip mu-grid-number mu-grid-hover">
							<colgroup>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
							</colgroup>
							<tbody id="accessList">
							</tbody>
						</table>
					</div>
				</div>
			</div>

		</section>
	</div>

    <c:import url="/WEB-INF/views/v2/access/updatePassword.jsp">
        <c:param name="pageDiv" value="account" />
    </c:import>
    
</body>
</html>