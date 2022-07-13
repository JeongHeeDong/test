<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %> 
<div>
	<!-- for modal dialog -->
	<div class="mu-dialog-background dlg_hour hidden"></div>
	
	<div class="mu-dialog hidden" id="dlg_hour">
		<div class="mu-dialog-head">
			<span class="title">특정 시간 설정</span>
			<a href="javascript:" class="mu-btn mu-btn-icon mu-btn-icon-only btnClose btn-close"><i class="mu-icon-img close"></i></a>
		</div>
		<div class="mu-dialog-body">
			<div class="mu-hgroup pb20">
				<button id='all_select_btn' type="button" class="mu-btn mu-btn-icon">전체선택</button>
				<button id='all_cancel_btn' type="button" class="mu-btn mu-btn-icon mu-btn-cancel">선택해제</button>
			</div>
			<ol class="table_hour" id="table_hour">
				<c:forEach begin="1" end="4" var="x">
					<c:forEach begin="1" end="6" var="y">
					<li><button id="${(6*(x-1))+(y-1)}" type="button" class="mu-btn mu-btn-icon">${(6*(x-1))+(y-1)}</button></li>
					</c:forEach>
				</c:forEach>
			</ol>
		    <!--<table class="mu-formbox mu-formbox-white mu-formbox-borderN mu-formbox-high formWidth180" id="table_hour">
		    <colgroup>
		        <col width="120px"/>
		    </colgroup>
		    <tbody>
		        <tr>
		            <th colspan="3">
		                <button id='all_select_btn' type="button" class="mu-btn mu-btn-icon">전체선택</button>
		            </th>
		            <th colspan="3">
		                <button id='all_cancel_btn' type="button" class="mu-btn mu-btn-icon">선택해제</button>
		            </th>
		        </tr>
		        <c:forEach begin="1" end="4" var="x">
		                <tr>
		                    <c:forEach begin="1" end="6" var="y">
		                            <td>
		                                <button id="${1+(6*(x-1))+(y-1)}" type="button" class="mu-btn mu-btn-icon">${1+(6*(x-1))+(y-1)}&nbsp;</button>
		                            </td>
		                    </c:forEach>
		                </tr>
		        </c:forEach>
		    </tbody>
		</table>-->
		</div>
		<div class="mu-dialog-foot">
		<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes"><i class="mu-icon check"></i>확인</button>
		<button class="mu-btn mu-pop-btn mu-btn-icon gray btn-close"><i class="mu-icon cancel"></i>취소</button>
		                  <!--<a href="javascript:" class="mu-btn mu-pop-btn btn-yes"><span>확인</span></a>
		<a href="javascript:" class="mu-btn btn-close"><span>취소</span></a>-->
	    </div>
	</div>
</div>
                
<script>
var active=''; //selected value

$('#all_select_btn').click(function () {
        $("#table_hour li button").removeClass();
        $("#table_hour li button").addClass('mu-btn mu-btn-icon active');
});

$('#all_cancel_btn').click(function () {
        $("#table_hour li button").removeClass();
        $("#table_hour li button").addClass('mu-btn mu-btn-icon');
});

$('#table_hour li button').click(function () {
        if(!$(this).hasClass('active')){
            $(this).removeClass();
            $(this).addClass('mu-btn mu-btn-icon active');
        }else{
            $(this).removeClass();
            $(this).addClass('mu-btn mu-btn-icon');
        }
});

/*$('#all_select_btn').click(function () {
        $("#table_hour td button").removeClass();
        $("#table_hour td button").addClass('mu-btn mu-btn-icon active');
});

$('#all_cancel_btn').click(function () {
        $("#table_hour td button").removeClass();
        $("#table_hour td button").addClass('mu-btn mu-btn-icon');
});

$('#table_hour td button').click(function () {
        if(!$(this).hasClass('active')){
            $(this).removeClass();
            $(this).addClass('mu-btn mu-btn-icon active');
        }else{
            $(this).removeClass();
            $(this).addClass('mu-btn mu-btn-icon');
        }
});*/
</script>