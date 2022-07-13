$(document).ready(function(){
	
	$("#confirmBtn,#cancelBtn").on('click',function(e){
		window.open("about:blank","_self").close();
	});
	
	getPermitIpListData();
	var pattern = /[*]/g
	
	//input box 입력시 행동
	$('#sFirst_n,#sSecond_n,#sThird_n,#sFourth_n,#rFirst_n,#rSecond_n').keyup(function(){
		var value = $(this).val();
		if(value.match('[0-9]')){
			
			if(value.match(pattern)){
				alert("'*' 사용시 숫자가 아닌 '*'문자 하나만 입력해 주세요");
				$(this).val("");
				return false;
			}
		}else{
			if(value.match(pattern).length > 1){
				alert("'*' 문자는 하나만 입력해주세요");
				$(this).val("");
				return false;
			}
		}
	});
	
	$('#ipAddClose, #ipAddCancle,#ipAddBg').on('click',function(e){
		$('#ipAddBg').fadeOut();
		$('#ipAddUp').fadeOut();
	});
	//sysDelPop Drag 지정 정의
	$( "#ipAddUp" ).draggable({'handle' : '#ipAddTitleBox'});
	$( "#ipAddUp" ).resizable({
		animate: true
	});
	
	
	$("input:radio[name=pop_radio]").change(function() {
		changeInputBx($(this).val());
	});
	
});

function getPermitIpListData(){
	
	$.ajax({
		   type : 'post',
		   url: '/security/permit/Ip/getParmitIpList',
		   dataType: "json",
		   success: function (data) {
			   $('#ipListGrid').empty();
			   
			   $.each(data.getParmitIpList,function(index,value){
				   $('#ipListGrid').append(
						'<tr>'+
							'<td>'+
						   		'<div class="mu-checkbox">'+
					   				'<input type="checkbox" id="bodyCheckBx'+index+'">'+
					   				'<label for="bodyCheckBx'+index+'"></label>' +
					   			'</div>'+
					   		'</td>'+
							'<td>'+value.FROM_IP+'</td>'+
							'<td>'+value.TO_IP+'</td>'+
							'<td>'+value.USER_NAME+'</td>'+
							'<td>'+value.EVENT_TIME+'</td>'+
						'</tr>'
				   );
			   });
			   
			   checkBoxSet($('#headerTable'),$('#tbodyTable'))
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	});
}

function checkBoxSet(headertbl,bodytbl){
	// 테이블 헤더에 있는 checkbox 클릭시
    $(":checkbox:first", headertbl).click(function(){
        // 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
        if( $(this).is(":checked") ){
            $(":checkbox", bodytbl).prop("checked", true);
        }
        else{
            $(":checkbox", bodytbl).prop("checked", false);
        }
        // 모든 체크박스에 change 이벤트 발생시키기                
        $(":checkbox", bodytbl).trigger("change");
    });
   
   
    $(":checkbox", bodytbl).click(function(){
        var allCnt = $(":checkbox", bodytbl).length;
        var checkedCnt = $(":checkbox", bodytbl).filter(":checked").length;
        
        // 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
        if( allCnt==checkedCnt ){
            $(":checkbox:first", headertbl).prop("checked", true);
        }
        else{
            $(":checkbox:first", headertbl).prop("checked", false);
        }
    }).change(function(){
        if( $(this).is(":checked") ){
            // 체크박스의 부모 > 부모 니까 tr 이 되고 tr 에 selected 라는 class 를 추가한다.
        }
        else{
        }
    });
}

function ipDel(){
	
	if (confirm("삭제하시겠습니까?") == false){
		return false;
	}
	
	var tbl = $("#tbodyTable");
	var checkList = $(":checkbox", tbl).filter(":checked").parent().parent().parent();
	var paramData = [];
	
	if(checkList.length <= 0){
		alert('테이블을 선택해주세요');
		return false;
	}
	
	$.each(checkList,function(index,value){
		paramData.push(
				{
					from_ip : $(value).find('td:eq(1)').text(),
					to_ip : $(value).find('td:eq(2)').text(),
				}
			);
	});
	
	var requestData = JSON.stringify(paramData);
	
	$.ajax({
		   type : 'post',
		   url: '/security/permit/Ip/ipDel',
		   contentType: 'application/json',
		   dataTpye:'json',
		   data : requestData,
		   success: function (data) {
			   if(data.flag > 0){
				   alert(data.flag+'개 아이피 삭제 성공');
				   getPermitIpListData();
			   }else{
				   alert('아이피 삭제 실패');
			   }
		   },
		   error: function () { 
			   //alert('에러발생');
		   }
	}); 
}