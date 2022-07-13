<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<div id="thresholdBg" class="mu-dialog-background" style="z-index: 12; display: none;"></div>
<div id="thresholdUp" class="mu-dialog mu-fix-foot" style="width: 570px; height: 338px;z-index: 13; display: none;"><!-- resize 부분 -->
    <div id="thresholdTitleBox" class="mu-dialog-head" ><!-- 창 이동 부분 -->
        <h2><span class="title">임계치 설정</span></h2>
        <button id="thresholdClose" type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
    </div>
    <div class="mu-dialog-body threshold" style="overflow-y:auto;" id="thresholdDiv">
    <!-- 장비 설정 -->
		<div class="mu-search-group">
		    <div class="mu-search-item">
		        <div class="mu-item-group">
		        	<label for="equipSelect">장비 </label>
		 			<div id = "set_equipDiv" class="mu-selectbox">
                        <select id="equipSelect" class="mu-value">
							<option></option>
                        </select>
                    </div>
                    
                    <div class="mu-radio">
				        <input type="radio" name="type_radio" id="th_cpu" value= 1 checked="checked" >
				        <label for="th_cpu">CPU</label>
				    </div>
		 			<div class="mu-radio">
				        <input type="radio" name="type_radio" id="th_memory" value= 2>
				        <label for="th_memory">MEMORY</label>
				    </div>
				    <div class="mu-radio" id="disk_radio">
				        <input type="radio" name="type_radio" id="th_disk" value= 3>
				        <label for="th_disk">DISK</label>
				    </div>
		        </div>
		    </div>
		</div>
		
		<h3 class="mu-title">장비별 임계치</h3>
		<table class="mu-formbox">
			<colgroup>
				<col width="150px">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<th class="minor"><i class="mu-icon mu-circle"></i><span id='minor_text'>Minor(이상)</span></th>
					<td><input type="text" id = 'mod_minor' value = '' class="mu-input" onkeypress="return fn_press(event,'numbers')"/></td>
				</tr>
				<tr>
					<th class="major"><i class="mu-icon mu-circle"></i><span id='major_text'>Major(이상)</span></th>
					<td><input type="text" id = 'mod_major' value = '' class="mu-input" onkeypress="return fn_press(event,'numbers')"/></td>
				</tr>
				<tr>
					<th class="critical"><i class="mu-icon mu-circle"></i><span id='critical_text'>Critical(이상)</span></th>
					<td><input type="text" id = 'mod_critical' value = '' class="mu-input" onkeypress="return fn_press(event,'numbers')"/></td>
				</tr>
			</tbody>
		</table>
    </div>
    
    <div class="mu-dialog-foot" style="text-align: center;">
    	<button id="thresholdModify" type="button" class="mu-btn mu-pop-btn mu-btn-icon" onclick="javascript:threshold_save()"><i class="mu-icon edit"></i>수정</button>
	    <button id="thresholdCancle" type="button" class="mu-btn mu-pop-btn mu-btn-icon gray"><i class="mu-icon cancel"></i>취소</button>
    </div>
</div>
