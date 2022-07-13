function modView(){
	
	var tbl = $("#delTableGrid");
	var checkCount = $(":checkbox", tbl).filter(":checked").length;
	
	if(checkCount == 0){
		alert("수정하고자 하는 항목을 선택해주세요");
		return false;
	}else if(checkCount > 1){
		alert("수정은 한 번에 한 개의 항목만 가능합니다.");
		return false;
	}
	
	$('#tableInfoTbody').empty();
	
	$('#sysDelPopBg').show().fadeIn('fast');
	$('#sysDelPopUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#sysDelPopUp').height()-50)/2
	var width = ($(window).width() - $('#sysDelPopUp').width())/2
	
	$('#sysDelPopUp').css('left',width+'px');
	$('#sysDelPopUp').css('top',height+'px');
	
	if($('#mod_btn').hasClass('save')){
		$('#sysDelPopModify').empty();
		$('#sysDelPopModify').append("<i id = 'mod_btn' class='mu-icon edit'> ");
		$('#sysDelPopModify').append("</i>수정");
		$('#pop_title').text("대상 테이블 수정");
		$('#sysDelPopModify').attr("onclick","javascript:cyclePopMod()");
	}
	
	var cycle_type = $(":checkbox", tbl).filter(":checked").parent().parent().parent().find('td:eq(3)').text();
	$('#del_cycle').val($(":checkbox", tbl).filter(":checked").parent().parent().parent().find('td:eq(4)').data("val"));
	
	if(cycle_type =='시간별'){
		cycle_type = 'H';
		$('#cycleText').text('시간');
	}else if(cycle_type =='일별'){
		cycle_type = 'D';
		 $('#cycleText').text('일');
	}else if(cycle_type == '월별'){
		cycle_type = 'M';
		$('#cycleText').text('개월');
	}else{
		cycle_type = 'N';
		$('#del_cycle').val("");
		$('#cycleText').text('');
	}
	
	$("input:radio[name=pop_radio][value="+cycle_type+"]").prop("checked", true).trigger('change');
	$('#popCheckHead').prop('disabled',true);
	
	$("input:radio[name=pop_radio]").change(function() {
		radioval = $("input:radio[name=pop_radio]:checked").val();
		
		if(radioval == 'H') $('#cycleText').text('시간');
		else if(radioval == 'D') $('#cycleText').text('일');
		else if(radioval == 'M') $('#cycleText').text('개월');
		else $('#cycleText').text('');
	});
	
	getPopTableInfo(true);
}


function getPopTableInfo(flag){
	
	var tbl = $("#delTableGrid");
	var tableNm = $(":checkbox", tbl).filter(":checked").parent().parent().parent().find('td:eq(1)').text();
	$.ajax({
		   type : 'post',
		   url: '/system/sysDBdeleteCycle/getPopTableInfo',
		   dataType: "json",
		   data : {tableNm : tableNm},
		   success: function (data) {
			   tableList = data.getPopTableInfo;
			   
			   var index = 0;
			   var checked = '';
			   var checkbox = '';
			   var checkTableNm = $(":checkbox", tbl).filter(":checked").parent().parent().parent().find('td:eq(1)').text();
			   
			   $(tableList).each(function(key,value){
				   var comment = value.TABLE_COMMENT;
				   
				   if(comment.length > 30){
					   comment = comment.substring(0,30)+'...';
				   }
				   
				   if(flag && checkTableNm == value.TABLE_NAME){
					   
					   checked = ' checked="checked" ';
					   
					   $('#tableInfoTbody').prepend(
						   '<tr>'+
//						   		'<td>'+
//							   		'<div class="mu-checkbox">'+
//						   				'<input type="checkbox" id="popCheck'+index+'"'+checked+' disabled>'+
//						   				'<label for="popCheck'+index+'"></label>' +
//						   			'</div>'+
//						   		'</td>'+
						   		'<td>'+value.TABLE_NAME+'</td>'+
						   		'<td title="'+value.TABLE_COMMENT+'">'+comment+'</td>'+
						   '</tr>'
					   );
					   
					   checked = '';
					   index++;
				   }else{
					   checkbox = '';
					   
					   if(!flag){
						   checkbox =  '<div class="mu-checkbox">'+
							   				'<input type="checkbox" id="popCheck'+index+'">'+
							   				'<label for="popCheck'+index+'"></label>' +
							   			'</div>';
					   }else{
						   checkbox = '';
					   }
					   
					   $('#tableInfoTbody').append(
						   '<tr>'+
//						   		'<td>'+
//						   			checkbox+
//						   		'</td>'+
						   		'<td>'+value.TABLE_NAME+'</td>'+
						   		'<td title="'+value.TABLE_COMMENT+'">'+comment+'</td>'+
						   '</tr>'
					   );
					   
					   index++;
				   }
			   });
			   //check박스 설정
			   checkboxSetting("popTable");
				
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});
}

function cyclePopMod(){
	var $tblTbody = $("#tableInfoTbody");
	var requestData = {};
	
	var table_name = $tblTbody.find('tr').find('td:eq(0)').text();
	var table_desc = $tblTbody.find('td:eq(1)').attr('title');
	var del_type = $("input:radio[name=pop_radio]:checked").val();
	var del_cycle = '';
	
	if(del_type == 'N') del_cycle = 99999;
	else del_cycle = $('#del_cycle').val();
	
	if(del_cycle == ''){
		alert('삭제 주기를 입력해주세요');
		return false;
	}
	
	requestData = {
			table_name:table_name,
			table_desc:table_desc,
			del_type:del_type,
			del_cycle:del_cycle
		};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/system/sysDBdeleteCycle/cyclePopMod',
		   contentType: 'application/json',
		   dataTpye:'json',
		   data : requestData,
		   success: function (data) {
			   if(data.flag == 1){
				   alert('테이블 삭제 주기 수정 성공');
				   getDelData(1);
				   $('#sysDelPopBg').fadeOut();
				   $('#sysDelPopUp').fadeOut();
			   }else{
				   alert('테이블 삭제 주기 수정 실패'); 
			   }
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	}); 
}

