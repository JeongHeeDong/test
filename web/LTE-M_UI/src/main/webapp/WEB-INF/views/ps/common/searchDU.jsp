<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
	
<div>
	<!-- for modal dialog -->
	<div class="mu-dialog-background dlg_du hidden"></div>
		
	<div class="mu-dialog hidden" id="dlg_du" style="width:1100px;height:;">
		<div class="mu-dialog-head">
			<span class="title">시스템 지정</span>
			<a href="javascript:" class="mu-btn mu-btn-icon mu-btn-icon-only btnClose btn-close"><i class="mu-icon-img close"></i></a>
		</div>
		<div class="mu-dialog-body-top">
			<div class="mu-search-group">
				<div class="mu-hgroup" id="du_search">
<!-- 					<div id="divLine" style="display:none">
						<label>호선</label>
						<div class="mu-selectbox">
							<select id="selectedLine" class="mu-value"></select>
						</div>
					</div> -->
					<div class="mu-radio">
						<input type="radio" name="search_chk" id="search_name" checked="checked" value="NAME">
						<label for="search_name">이름검색</label>
					</div>
					<div class="mu-radio">
						<input type="radio" name="search_chk" id="search_du_id" value="ID">
						<label for="search_du_id">ID 검색</label>
					</div>
					<div class="mu-item-group">
						<input class="mu-input" type="text"  id="search_text">
						<button type="button" class="mu-btn mu-btn-icon mu-btn-search" onclick="javascript:equipFlag=false;getEquip()"><i class="mu-icon search"></i>조회</button>
					</div>
				</div>
			</div>
		</div>
		<div class="mu-dialog-body">
			<!--<div class="gridListWrap infoBox2">
				<div class="mu-search-item">
					<table class="mu-formbox mu-formbox-white mu-formbox-borderN" id="du_search">
						<tbody>
							<tr>
								<td>
									<div class="mu-radio"><input type="radio" name="search_chk" value="NAME" id="search_name" checked="checked"><label for="search_name">이름검색</label></div>
									<div class="mu-radio"><input type="radio" name="search_chk" value="ADDR" id="search_addr"><label for="search_addr">주소검색</label></div>
									<div class="mu-radio"><input type="radio" name="search_chk" value="IP" id="search_ip"><label for="search_ip">IP검색</label></div>
									<div class="mu-radio"><input type="radio" name="search_chk" value="DU_ID" id="search_du_id"><label for="search_du_id">DU ID검색</label></div>
									<input type="text" class="mu-input" style="width:150px" id="search_text"/>
									<button type="button" class="mu-btn mu-btn-icon" onclick="javascript:duFlag=false;getDU()"><i class="mu-icon search"></i></button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>-->
			<div class="listBox">
				<div class="inBox fl" style="width:500px;">
					<table id="grid_equip_hidden" class="mu-grid mu-grid-border mu-grid-strip" style="text-align: center;">
						<colgroup>
							<col width="35px">
							<col width="">
							<col width="">
							<col width="">
						</colgroup>
					</table>
				</div>
				<button class="mu-btn btnAdd" type="button"  id ="equip_right" style="left:515px;"><span>></span></button>
				<div class="inBox fr" style="width:500px;">
					<table  id="grid_equip_show" class="mu-grid mu-grid-border mu-grid-strip" style="text-align: center;">
						<colgroup>
							<col width="35px">
							<col width="">
							<col width="">
							<col width="">
						</colgroup>
					</table>
				</div>
				<button class="mu-btn btnDel" type="button"  id ="equip_left" style="left:515px;"><span><</span></button>
			</div>
		</div>
		<div class="mu-dialog-foot">
			<button class="mu-btn mu-pop-btn mu-btn-icon btn-yes"><i class="mu-icon check"></i>확인</button>
			<button class="mu-btn mu-pop-btn mu-btn-icon gray btn-close"><i class="mu-icon cancel"></i>취소</button>
		</div>
	</div>
</div>

 
 <script>
var gridEquipHidden;
var gridEquipShow;
var gridEquipDuHidden;
var gridEquipDuShow;
var equipFlag=false;


 function moveCheckedRows (gridFrom, gridTo) {
	var fromRows = gridFrom.getUncheckedRows();
	
   if(fromRows !== '' && fromRows !== null){
		var toRows = gridTo.rows();
		 if(toRows != '' && toRows != null){
			 toRows = toRows.concat(gridFrom.getCheckedRows());
		 } else {
			 toRows = gridFrom.getCheckedRows();
		 }
		 
		 

		// set & redraw
		gridFrom
			.totalCount(fromRows.length)
			.rows(fromRows)
			.make();
		gridTo
			.totalCount(toRows.length)
			.rows(toRows)
			.make();
	}
}
 
 function getEquip(){
	switch(global_equip){
	case    'DU':
		getDU();
		break;
	case    'MME':
		getMME();
		break;
	case    'PGW':
		getPGW();
		break;
	case    'SGW':
		getSGW();
		break;
	case	'PCRF':
		getPCRF();
		break;
	case	'SYSTEM':
		getSystem();
		break;
	}
 }
 
 function getDU(){
	$('#divLine').css("display","");
	if(!equipFlag){
		equipFlag = true;
		$.ajax({
				type: 'POST',
				url: '/getDU',
				data: {
					type : $('#du_search :radio[name="search_chk"]:checked').val(),
					search_text : $('#search_text').val(),
					lineId : $('#selectedLine').val()
				},
				beforeSend: function () {
					$('#ajax_indicator').show().fadeIn('fast');
				},
				complete: function () {
					$('#ajax_indicator').fadeOut();
				},
				success: function (data) {
					 gridEquipDuHidden
						 .totalCount(data.equipList.length)
						 .rows(data.equipList)
						 .make();
					 gridEquipDuShow
						 .totalCount(0)
						 .rows(null)
						 .make();
				},
				error: function (xhr, status, message) {
					console.log(message);
				}
			});
		}
}
function getMME(){
	$('#divLine').css("display","none");
	if(!equipFlag){
		equipFlag = true;
		$.ajax({
				type: 'POST',
				url: '/getMME',
				data: {
					type : $('#du_search :radio[name="search_chk"]:checked').val(),
					search_text : $('#search_text').val(),
				},
				beforeSend: function () {
					$('#ajax_indicator').show().fadeIn('fast');
				},
				complete: function () {
					$('#ajax_indicator').fadeOut();
				},
				success: function (data) {
					 gridEquipHidden
						 .totalCount(data.equipList.length)
						 .rows(data.equipList)
						 .make();
					 gridEquipShow
						 .totalCount(0)
						 .rows(null)
						 .make();
				},
				error: function (xhr, status, message) {
					console.log(message);
				}
			});
		}
}

function getSGW(){
	$('#divLine').css("display","none");
	if(!equipFlag){
		equipFlag = true;
		$.ajax({
				type: 'POST',
				url: '/getSGW',
				data: {
					type : $('#du_search :radio[name="search_chk"]:checked').val(),
					search_text : $('#search_text').val(),
				},
				beforeSend: function () {
					$('#ajax_indicator').show().fadeIn('fast');
				},
				complete: function () {
					$('#ajax_indicator').fadeOut();
				},
				success: function (data) {
					 gridEquipHidden
						 .totalCount(data.equipList.length)
						 .rows(data.equipList)
						 .make();
					 gridEquipShow
						 .totalCount(0)
						 .rows(null)
						 .make();
				},
				error: function (xhr, status, message) {
					console.log(message);
				}
			});
		}
}

function getPGW(){
	$('#divLine').css("display","none");
	if(!equipFlag){
		equipFlag = true;
		$.ajax({
				type: 'POST',
				url: '/getPGW',
				data: {
					type : $('#du_search :radio[name="search_chk"]:checked').val(),
					search_text : $('#search_text').val(),
				},
				beforeSend: function () {
					$('#ajax_indicator').show().fadeIn('fast');
				},
				complete: function () {
					$('#ajax_indicator').fadeOut();
				},
				success: function (data) {
					 gridEquipHidden
						 .totalCount(data.equipList.length)
						 .rows(data.equipList)
						 .make();
					 gridEquipShow
						 .totalCount(0)
						 .rows(null)
						 .make();
				},
				error: function (xhr, status, message) {
					console.log(message);
				}
			});
		}
}

function getPCRF(){
	$('#divLine').css("display","none");
	if(!equipFlag){
		equipFlag = true;
		$.ajax({
			type: 'POST',
			url: '/getPCRF',
			data: {
				type : $('#du_search :radio[name="search_chk"]:checked').val(),
				search_text : $('#search_text').val(),
			},
			beforeSend: function () {
				$('#ajax_indicator').show().fadeIn('fast');
			},
			complete: function () {
				$('#ajax_indicator').fadeOut();
			},
			success: function (data) {
				 gridEquipHidden
					 .totalCount(data.equipList.length)
					 .rows(data.equipList)
					 .make();
				 gridEquipShow
					 .totalCount(0)
					 .rows(null)
					 .make();
			},
			error: function (xhr, status, message) {
				console.log(message);
			}
		});
	}
}

function getSystem(){
	$('#divLine').css("display","none");
	if(!equipFlag){
		equipFlag = true;
		$.ajax({
			type: 'POST',
			url: '/getSystem',
			data: {
				type : $('#du_search :radio[name="search_chk"]:checked').val(),
				search_text : $('#search_text').val(),
			},
			beforeSend: function () {
				$('#ajax_indicator').show().fadeIn('fast');
			},
			complete: function () {
				$('#ajax_indicator').fadeOut();
			},
			success: function (data) {
				 gridEquipHidden
					 .totalCount(data.equipList.length)
					 .rows(data.equipList)
					 .make();
				 gridEquipShow
					 .totalCount(0)
					 .rows(null)
					 .make();
			},
			error: function (xhr, status, message) {
				console.log(message);
			}
		});
	}
}

var global_equip;
function setting_searchEquip(equip){
	 global_equip= equip;
	 var col_id = equip+' ID';
	 var col_name = equip+' 명';
	 var col_line = '구분';
	 var id = equip+'_ID';
	 var name = equip+'_NAME';
	 var line = 'LINE_NAME';
		gridEquipHidden = new GridEx('#grid_equip_hidden');
		gridEquipShow = new GridEx('#grid_equip_show');
		gridEquipDuHidden = new GridEx('#grid_equip_hidden');
		gridEquipDuShow = new GridEx('#grid_equip_show');
		gridEquipHidden
			.cols([col_id, col_name])
			.maps([id, name])
			.mapId(id)
			.sorting(true)
			;
		gridEquipShow
			.cols([col_id, col_name])
			.maps([id, name])
			.mapId(id)
			.sorting(true)
			;
		gridEquipDuHidden
			.cols([col_line, col_id, col_name])
			.maps([line, id, name])
			.mapId(id)
			.sorting(true)
			;
		gridEquipDuShow
			.cols([col_line, col_id, col_name])
			.maps([line, id, name])
			.mapId(id)
			.sorting(true)
			;
 }
 
 $(document).ready(function(){
		
	
	$('#equip_right').click(function () {
		if( global_equip != 'DU'){
			moveCheckedRows(gridEquipHidden,gridEquipShow);
		}else{
			moveCheckedRows(gridEquipDuHidden,gridEquipDuShow);
		}
	 });
	
	  $('#equip_left').click(function () {
		 if( global_equip != 'DU'){
			moveCheckedRows(gridEquipShow,gridEquipHidden);
		 }else{
			moveCheckedRows(gridEquipDuShow,gridEquipDuHidden);
		 }
	 });
	  
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	  
});
 
 </script>
