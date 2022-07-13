$(document).ready(function(){
	
	// 호선 셀렉트박스
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	$('#equipSelectClose, #equipSelectCancle,#equipSelectBg').on('click',function(e){
		$('#selectedLinePop').val('');
		$('#equipSelectBg').fadeOut();
		$('#equipSelectUp').fadeOut();
	});
	//equipSelect Drag 지정 정의
	$( "#equipSelectUp" ).draggable({'handle' : '#equipSelectTitleBox'});
	$( "#equipSelectUp" ).resizable({
		animate: true
	});
	
	$("input:radio[name=equip_radio]").change(function() {
		radioValue = $(this).val();
		setEquipRadioChange(radioValue);
	});
	
//	document.getElementById('alarm_player').load();
//	document.getElementById('alarm_player').play();
	
	$('#equip_search').keyup(function(){
		
		$(":checkbox", $('#deSelectEquipTB')).prop("checked", false);
		$(":checkbox", $('#selectEquipTB')).prop("checked", false);
		var search_text = $('#equip_search').val();
		
		$('#deSelectEquipGrid tr').each(function(){
			
			
			var tr_length = $(this).children().length;
			
			for(var index = 1; index<tr_length ; index++){
				var td_element = $(this).children()[index];
				
				//match로 바꿀 필요성 고려
//				if($(td_element).text() != search_text){
				if(!$(td_element).text().match(search_text)){
					$(this).css('display','none');
				}else{
					$(this).css('display','');
					break;
				}
				
			}
			
			if('' == search_text){
				$(this).css('display','');
			}
		})
	});
	
});

function setEquipRadioChange(radioValue){
	$('#set_equipSelect').empty();
	
	if(radioValue == 0) {
		$('#set_equipSelect').append(
			'<option value=2>DU</option>'
		);
	} else if(radioValue == 1) {
		$('#set_equipSelect').append(
			'<option value=1>MME</option>'+
			'<option value=4>PGW</option>'+
			'<option value=5>SGW</option>'+
			'<option value=6>HSS</option>'+
			'<option value=7>PCRF</option>'
		);
	}
}
//flag : 감시 장비 대상, 제외 구분, equipFlag : Access,Epc 구분
function equipSelectView(flag,equipFlag,equipType){
	$('#equip_search').val('');
	if(equipType) {
		$('#equipSelectDiv > div.mu-search-group').hide();
		$('#equipSelectEquipType').val(equipType);
	} else {
		$('#equipSelectDiv > div.mu-search-group').show();
		$('#equipSelectEquipType').val('');
		$("input:radio[name=equip_radio][value="+equipFlag+"]").prop("checked", true).trigger('change');
		$('#set_equip_access').prop("disabled",true);
		$('#set_equip_epc').prop("disabled",true);
		$('#flag').val(flag);
	}
	
	if(flag == 1){
		$('#equipSetTitle').text('감시 장비 설정');
		
	}else if(flag == 0){
		$('#equipSetTitle').text('감시 제외 장비 설정');
	}else if(flag == 2){
		$('#equipSetTitle').text('조회 장비 설정');
		$('#equipSelectModify').attr('onclick','javascript:equipSelect_add()');
		var equipval = $('#equipSelect option:selected').val();
		$('#set_equipSelect').attr("disabled","disabled");
		
		if(equipval && equipval != $('#set_equipSelect').val()){
			$('#set_equipSelect').val(equipval).attr("selected","selected");
			$('#selectEquipGrid').empty();
		}
	}
	
	$('#deselectHead').prop('checked',false);
	$('#selectHead').prop('checked',false);
	
	$('#equipSelectBg').show().fadeIn('fast');
	$('#equipSelectUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#equipSelectUp').height()-100)/2
	var width = (screen.width - $('#equipSelectUp').width())/2
	
	$('#equipSelectUp').css('left',width+'px');
	$('#equipSelectUp').css('top',height+'px');
	
	getEquipList(equipFlag);
	
}

function getEquipList(equipFlag){
	
	//$('#lineSelectDiv').show(); 
	var equipType = $('#equipSelectEquipType').val();
	var flag = $('#flag').val()+"";
	var select_equip_type = equipType || $('#set_equipSelect option:selected').val();
	var radioFlag = $("input:radio[name=equip_radio]:checked").val();
	var lineId = $("#selectedLinePop").val();
	
	var requestData = {flag:flag, equip_type:select_equip_type, radio_flag : radioFlag, lineId : lineId };
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/pm/monitor/getEquipList',
		   contentType: 'application/json',
		   dataTpye:'json',
		   data : requestData,
		   success: function (data) {
			   
			   var deSelectList = data.getEquipList.equipDeSelectList;
			   var selectList = data.getEquipList.equipSelectList;
			   
			   $('#deSelectEquipGrid').empty();
//			   $('#deSelectEquipTB').empty();
//			   $('#selectEquipTB').empty();
			   
			   var index = 0;
			   
//			   if ( flag == 2 && equipFlag == 1 || flag == 2 && equipFlag == null && equipType == '10' ){
//				   $('#deSelectEquipTB, #selectEquipTB').append(
//					   '<thead>'+
//					   '<tr>'+
//							'<th>'+
//								'<div class="mu-checkbox">'+
//					   				'<input type="checkbox"  id="deselectHead">'+
//					   				'<label for="deselectHead"></label>'+
//					   			'</div>'+
//							'</th>'+
////							'<th style="display:none">호선</th>'+
//							'<th>호선</th>'+
//							'<th>장비 ID</th>'+
//							'<th>장비 명</th>'+
//						'</tr>'+
//						'</thead>');
//				   $(deSelectList).each(function(key,value){
//					   $('#deSelectEquipGrid').append(
//						   '<tr>'+
//						   		'<td>'+
//							   		'<div class="mu-checkbox">'+
//						   				'<input type="checkbox" id="deSelect'+index+'">'+
//						   				'<label for="deSelect'+index+'"></label>' +
//						   			'</div>'+
//						   		'</td>'+
////						   		'<td style="display:none">'+value.SYSTEM_NAME+'</td>'+
//						   		'<td>'+value.SYSTEM_NAME+'</td>'+
//						   		'<td>'+value.SYSTEM_ID+'</td>'+
//						   		'<td>'+value.SYSTEM_NAME+'</td>'+
//						   '</tr>'
//					   );
//					   
//					   index++;
//				   });
//				   index = 0;
//				   if(flag != 2){
//					   $('#selectEquipGrid').empty();
//					   $(selectList).each(function(key,value){
//						   $('#selectEquipGrid').append(
//							   '<tr>'+
//							   		'<td>'+
//								   		'<div class="mu-checkbox">'+
//							   				'<input type="checkbox" id="select'+index+'">'+
//							   				'<label for="select'+index+'"></label>' +
//							   			'</div>'+
//							   		'</td>'+
//							   		'<td style="display:none">'+value.LINE_NAME+'</td>'+
//							   		'<td>'+value.SYSTEM_ID+'</td>'+
//							   		'<td>'+value.SYSTEM_NAME+'</td>'+
//							   '</tr>'
//						   );
//						   index++;
//					   });
//				   }
//			   }else{
//				   $('#deSelectEquipTB').append(
//						   '<thead>'+
//						   '<tr>'+
//								'<th>'+
//									'<div class="mu-checkbox">'+
//						   				'<input type="checkbox"  id="deselectHead">'+
//						   				'<label for="deselectHead"></label>'+
//						   			'</div>'+
//								'</th>'+
//								'<th>호선</th>'+
//								'<th>장비 ID</th>'+
//								'<th>장비 명</th>'+
//							'</tr>'+
//							'</thead>');
//				   $(deSelectList).each(function(key,value){
//					   $('#deSelectEquipGrid').append(
//						   '<tr>'+
//						   		'<td>'+
//							   		'<div class="mu-checkbox">'+
//						   				'<input type="checkbox" id="deSelect'+index+'">'+
//						   				'<label for="deSelect'+index+'"></label>' +
//						   			'</div>'+
//						   		'</td>'+
//						   		'<td>'+value.LINE_NAME+'</td>'+
//						   		'<td>'+value.SYSTEM_ID+'</td>'+
//						   		'<td>'+value.SYSTEM_NAME+'</td>'+
//						   '</tr>'
//					   );
//					   
//					   index++;
//				   });
//				   index = 0;
//				   if(flag != 2){
//					   $('#selectEquipGrid').empty();
//					   $(selectList).each(function(key,value){
//						   $('#selectEquipGrid').append(
//							   '<tr>'+
//							   		'<td>'+
//								   		'<div class="mu-checkbox">'+
//							   				'<input type="checkbox" id="select'+index+'">'+
//							   				'<label for="select'+index+'"></label>' +
//							   			'</div>'+
//							   		'</td>'+
//							   		'<td>'+value.LINE_NAME+'</td>'+
//							   		'<td>'+value.SYSTEM_ID+'</td>'+
//							   		'<td>'+value.SYSTEM_NAME+'</td>'+
//							   '</tr>'
//						   );
//						   index++;
//					   });
//				   }
//			   }
			   
			   $('#lineSelectDiv').hide();
			   $(deSelectList).each(function(key,value){
				   $('#deSelectEquipGrid').append(
					   '<tr>'+
					   		'<td>'+
						   		'<div class="mu-checkbox">'+
					   				'<input type="checkbox" id="deSelect'+index+'">'+
					   				'<label for="deSelect'+index+'"></label>' +
					   			'</div>'+
					   		'</td>'+
					   		'<td>'+value.LINE_NAME+'</td>'+
					   		'<td>'+value.SYSTEM_ID+'</td>'+
					   		'<td>'+value.SYSTEM_NAME+'</td>'+
					   '</tr>'
				   );
				   
				   index++;
			   });
			   $("#deSelectEquipTB th:nth-child(2)").hide();
			   $("#deSelectEquipTB td:nth-child(2)").hide();
			   $("#selectEquipTB th:nth-child(2)").hide();
			   $("#selectEquipTB td:nth-child(2)").hide();
			   
			   index = 0;
			   if((flag == 2 && equipFlag == '0' )|| ( flag == 0 && equipFlag == '0') || ( flag == 1 && equipFlag == '0') ){
				   $('#selectEquipGrid').empty();
				   //$('#lineSelectDiv').show();
				   $(selectList).each(function(key,value){
					   $('#selectEquipGrid').append(
						   '<tr>'+
						   		'<td>'+
							   		'<div class="mu-checkbox">'+
						   				'<input type="checkbox" id="select'+index+'">'+
						   				'<label for="select'+index+'"></label>' +
						   			'</div>'+
						   		'</td>'+
						   		'<td>'+value.LINE_NAME+'</td>'+
						   		'<td>'+value.SYSTEM_ID+'</td>'+
						   		'<td>'+value.SYSTEM_NAME+'</td>'+
						   '</tr>'
					   );
					   index++;
				   });
				   $("#deSelectEquipTB th:nth-child(2)").show();
				   $("#deSelectEquipTB td:nth-child(2)").show();
				   $("#selectEquipTB th:nth-child(2)").show();
				   $("#selectEquipTB td:nth-child(2)").show();
			   }
			   
			   checkBoxSet($('#deSelectEquipTB'));
			   checkBoxSet($('#selectEquipTB'));
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	}); 
}


function checkBoxSet(tbl){
	
	
	
// 테이블 헤더에 있는 checkbox 클릭시
	var chk = ''
    $(":checkbox:first", tbl).click(function(){
        // 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
        if( $(this).is(":checked") ){
//            $(":checkbox", tbl).prop("checked", true);
            chk = 'checked';
        }
        else{
//            $(":checkbox", tbl).prop("checked", false);
            chk = '';
        }
        // 모든 체크박스에 change 이벤트 발생시키기                
//        $(":checkbox", tbl).trigger("change");
        $($(tbl.find('tr'))).each(function(){
			if($(this).css('display') !== 'none' ){
				$(this).find('input:checkbox').prop('checked',chk);
			}
		});
        
    });
   
   
    $(":checkbox:not(:first)", tbl).click(function(){
        var allCnt = $(":checkbox:not(:first)", tbl).length;
        var checkedCnt = $(":checkbox:not(:first)", tbl).filter(":checked").length;
        
        // 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
        if( allCnt==checkedCnt ){
            $(":checkbox:first", tbl).prop("checked", true);
        }
        else{
            $(":checkbox:first", tbl).prop("checked", false);
        }
    }).change(function(){
        if( $(this).is(":checked") ){
            // 체크박스의 부모 > 부모 니까 tr 이 되고 tr 에 selected 라는 class 를 추가한다.
        }
        else{
        }
    });
    
    if ( $("#selectEquipTB th:nth-child(2)").css('display') == 'none' ){
		$("#selectEquipTB td:nth-child(2)").hide();
	}
}

function select_equip(){
	var tbl = $('#deSelectEquipTB');
	var checkCount = $(":checkbox:not(:first)", tbl).filter(":checked").length;
	
	if(checkCount == 0){
		alert("장비를 선택해주세요");
		return false;
	}
	var addEquipList = [];
	
	$(":checkbox:not(:first)", tbl).filter(":checked").each(function(key,value){
		trElement = $(value).parent().parent().parent();
		
		addEquipList.push({line_name:$(trElement).children(":eq(1)").text()
			,equip_id:$(trElement).children(":eq(2)").text()
			,equip_name:$(trElement).children(":eq(3)").text()
		});
    });
	
	if($('#selectEquipGrid tr').length > 0){
		
		var strow = $('#selectEquipGrid').children('tr');
		//deep copy
		for (var i = 0; i < strow.length; i++ ) {
			var row = strow[i];
			$(addEquipList).each(function(key,value){
				if(value.equip_id == $(row).find("td").eq(2).text()){
					addEquipList.splice(key,1);
				}
			});
		}
		
		var index = $('#selectEquipGrid tr').length+1;
		$(addEquipList).each(function(key,value){
			$('#selectEquipGrid').prepend(
					'<tr>'+
						'<td>' +
		   					'<div class="mu-checkbox">'+
				   				'<input type="checkbox" id="'+index+'">'+
				   				'<label for="'+index+'"></label>' +
				   			'</div>'+
		   				'</td>' +
		   				'<td>'+value.line_name+'</td>'+
						'<td>'+value.equip_id+'</td>'+
						'<td>'+value.equip_name+'</td>'+
					'</tr>'
			);
			
			index++;
		});
	}else{
		var index = $('#selectEquipGrid tr').length+1;
		
		$(addEquipList).each(function(key,value){
			$('#selectEquipGrid').prepend(
					'<tr>'+
						'<td>' +
		   					'<div class="mu-checkbox">'+
				   				'<input type="checkbox" id="'+index+'">'+
				   				'<label for="'+index+'"></label>' +
				   			'</div>'+
		   				'</td>' +
		   				'<td>'+value.line_name+'</td>'+
						'<td>'+value.equip_id+'</td>'+
						'<td>'+value.equip_name+'</td>'+
					'</tr>'
			);
			
			index++;
		});
	}
	
	checkBoxSet($('#selectEquipTB'));
	
}


function delete_equip(){
	var tbl = $('#selectEquipTB');
	$(":checkbox:not(:first)", tbl).filter(":checked").each(function(key,value){
		trElement = $(value).parent().parent().parent();
		trElement.remove();
    });
}

function equipSelect_save(){
	
	var rows = $('#selectEquipGrid').children('tr');
	//감시 대상인지 감시 제외 대상인지 판단 flag
	var flag = $('#flag').val();
	var equip_text = '';
	var equip_val = '';
	
	for (var i = 0; i < rows.length; i++ ) {
		var row = rows[i];
		equip_text += $(row).find("td").eq(3).text()+",";
		equip_val += $(row).find("td").eq(2).text()+",";
	}
	
	if(equip_val != ''){
		equip_val = equip_val.slice(0,-1);
		equip_text = equip_text.slice(0,-1);
	}
	
	//감시 장비
	if(flag == 1){
		
		var simpletext = equip_text;
		if(40 < simpletext.length){
			simpletext = simpletext.substring(0,35)+'.....';
		}
		
		$('#selectEquipVal').val(equip_val);
		$('#selectEquipText').val(simpletext);
		$('#selectEquipText').attr('title',equip_text);
	}else{
		
		var simpletext = equip_text;
		if(23 < simpletext.length){
			simpletext = simpletext.substring(0,18)+'.....';
		}
		
		$('#deSelectEquipVal').val(equip_val);
		$('#deSelectEquipText').val(simpletext);
		$('#deSelectEquipText').attr('title',equip_text);
	}
	
	$('#equipSelectBg').fadeOut();
	$('#equipSelectUp').fadeOut();
	
}

function equipSelect_add(){
	
	var equipSelectVal = '';
	var equipSelectText = '';
	var rows = $('#selectEquipGrid').children('tr');
	for (var i = 0; i < rows.length; i++ ) {
		var row = rows[i];
		equipSelectVal += $(row).find("td").eq(2).text()+',';
		equipSelectText += $(row).find("td").eq(3).text()+',';
	}
	
	if(equipSelectVal != ''){
		equipSelectVal = equipSelectVal.slice(0,-1);
		equipSelectText = equipSelectText.slice(0,-1);
	}
	$('#equipListVal').val(equipSelectVal);
	$('#equipListText').val(equipSelectText);
	
	$('#equipSelectBg').fadeOut();
	$('#equipSelectUp').fadeOut();
}