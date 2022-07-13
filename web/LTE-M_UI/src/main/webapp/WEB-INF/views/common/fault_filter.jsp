<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<script src="<c:url value="/resources/js/fault_filter.js"><c:param name="version" value="${nowDate}"/></c:url>"></script>
<div id="faultFilterBg" class="mu-dialog-background" style="z-index: 10; display: none;"></div>
<div id="faultFilterUp" class="mu-dialog mu-fix-foot" style="width: 50px; height: 290px;z-index: 11; display: none;"><!-- resize 부분 -->
    <div id="faultFilterTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
		<h2><span class="title" style="line-height: 200%;">알람 필터 설정</span></h2>
        <button id="faultFilterClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body" id="faultFilterDiv" style="height: 250px">
	<!-- 가청 설정 -->
		<div class="mu-search-group" >
		    <div class="mu-search-item" style="white-space: nowrap;width: 100%;">
		        <table>
		            <tbody>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="stateRadio" id = "r0" value= 0 checked="checked" >
							        <label for="r0">Fault 알람 제외</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="stateRadio" id = "r1" value= 1>
							        <label for="r1">Fault 알람만</label>
							    </div>
		                    </td>
			            </tr>
			            <tr>
			            	<td>
				                <div class="mu-radio">
							        <input type="radio" name="stateRadio"  id = "r2" value= 2>
							        <label for="r2">Fault 알람 포함</label>
							    </div>
		                    </td>
			            </tr>
		        	</tbody>
		        </table>
		    </div>
		</div>
    </div>
    <div class="mu-dialog-foot" style="text-align: center;">
        <button id="faultFilterModify" type="button" onclick="javascript:faultfilterSave()" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon save"></i>저 장</button>
        <button id="faultFilterCancle" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon cancel"></i>취 소</button>
    </div>
</div>

<input type="hidden" id = "faultState" value = 0 >