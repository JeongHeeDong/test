<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    
<div id="ipAddBg" class="mu-dialog-background" style="display:none;z-index: 10"></div>
<div id="ipAddUp" class="mu-dialog" style="display:none;width: 420px; left: 42%; top: 25%;z-index: 11"><!-- resize 부분 -->
    <div id="ipAddTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span id='pop_title' class="title" style="line-height: 200%;">허용 아이피 추가</span></h2>
        <button id="ipAddClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body threshold">
    	<h3 class="mu-title">아이피 지정 방식</h3>
		<div class="mu-search-group">
			<div class="mu-search-item">
				<div class="mu-radio">
					<input type="radio" name="pop_radio" id="pop_S" value= "S" checked="checked">
					<label for="pop_S">단일 지정</label>
				</div>
				<div class="mu-radio">
					<input type="radio" name="pop_radio" id="pop_R" value= "R">
					<label for="pop_R">범위 지정</label>
				</div>
			</div>
		</div>
		
		<h3 class="mu-title">아이피 입력</h3>
		<div class="mu-search-group">
			<table>
				<tbody>
					<tr>
						<td style="vertical-align: middle;">
							<input id="sFirst_n" type="text" style="width: 50px" class="mu-input" onkeypress="return fn_press(event,'numbers')"/>
						</td>
						<td>
							<font size="5">.</font>
						</td>
						<td style="vertical-align: middle;">
							<input id="sSecond_n" type="text" style="width: 50px" class="mu-input" onkeypress="return fn_press(event,'numbers')"/>
						</td>
						<td>
							<font size="5">.</font>
						</td>
						<td style="vertical-align: middle;">
							<input id="sThird_n" type="text" style="width: 50px" class="mu-input" onkeypress="return fn_press(event,'numbersAndstar')"/>
						</td>
						<td>
							<font size="5">.</font>
						</td>
						<td style="vertical-align: middle;">
							<input id="sFourth_n" type="text" style="width: 50px" class="mu-input" onkeypress="return fn_press(event,'numbersAndstar')"/>
						</td>
						<td id="tilde_td" style="vertical-align: middle;">
							<font size="4">&nbsp;~&nbsp;</font>
						</td>
						<td id="first_td" style="vertical-align: middle;">
							<input id="rFirst_n" type="text" style="width: 50px" class="mu-input" onkeypress="return fn_press(event,'numbers')"/>
						</td>
						<td id="dot_td">
							<font size="5">.</font>
						</td>
						<td id="second_td" style="vertical-align: middle;">
							<input id="rSecond_n" type="text" style="width: 50px" class="mu-input" onkeypress="return fn_press(event,'numbers')"/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="ipAddModify" type="button" class="mu-btn mu-pop-btn" onclick="javascript:getIpRange()"><i id="mod_btn" class="mu-icon save">저장</i></button>
	    <button id="ipAddCancle" type="button" class="mu-btn mu-pop-btn gray">취소</button>
    </div>
</div>
