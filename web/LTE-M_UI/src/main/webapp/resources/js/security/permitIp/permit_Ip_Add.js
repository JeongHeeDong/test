function ipAddView(){
	
	$('#ipAddBg').show().fadeIn('fast');
	$('#ipAddUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#ipAddUp').height()-50)/2
	var width = ($(window).width() - $('#ipAddUp').width())/2
	
	$('#ipAddUp').css('left',width+'px');
	$('#ipAddUp').css('top',height+'px');
	
	$("input:radio[name=pop_radio][value=S]").prop("checked", true).trigger('change');
	$('#sFirst_n,#sSecond_n,#sThird_n,#sFourth_n,#rFirst_n,#rSecond_n').val("");
}

function changeInputBx(val){
	if(val == 'S'){
		$('#tilde_td,#first_td,#second_td,#dot_td').css('display','none');
//		$('#first_td').css('display','none');
//		$('#second_td').css('display','none');
//		$('#dot_td').css('display','none');
		
		$('#sThird_n,#sFourth_n').attr("onkeypress","return fn_press(event,'numbersAndstar')");
//		$('#sFourth_n').attr("onkeypress","return fn_press(event,'numbersAndstar')");
	}else{
		$('#tilde_td,#first_td,#second_td,#dot_td').css('display','');
//		$('#first_td').css('display','');
//		$('#second_td').css('display','');
//		$('#dot_td').css('display','');
		
		$('#sThird_n,#sFourth_n').attr("onkeypress","return fn_press(event,'numbers')");
//		$('#sFourth_n').attr("onkeypress","return fn_press(event,'numbers')");
	}
}

function getIpRange(){
	
	var pattern = /[*]/g
	
	var radioType = $(':radio[name="pop_radio"]:checked').val();
	var sFirstNb,sSecondNb,sThirdNb,sFourthNb,rFirstNb,rSecondNb;
	var from_ip,to_ip
	
	sFirstNb = $('#sFirst_n').val();
	sSecondNb = $('#sSecond_n').val();
	sThirdNb = $('#sThird_n').val();
	sFourthNb = $('#sFourth_n').val();
	
	rFirstNb = $('#rFirst_n').val();
	rSecondNb = $('#rSecond_n').val();
	
	if(radioType == "S"){
		if(sFirstNb != '' && sSecondNb != '' && sThirdNb != '' && sFourthNb != ''){
			var sThirdNb_from = sThirdNb=='*'?'1':sThirdNb;
			var sFourthNb_from = sFourthNb=='*'?'1':sFourthNb;
			var sThirdNb_to = sThirdNb=='*'?'254':sThirdNb;
			var sFourthNb_to = sFourthNb=='*'?'254':sFourthNb;
			
			from_ip = sFirstNb+'.'+sSecondNb+'.'+sThirdNb_from+'.'+sFourthNb_from;
			to_ip = sFirstNb+'.'+sSecondNb+'.'+sThirdNb_to+'.'+sFourthNb_to;
			
		}else{
			alert('모든 항목을 채워주세요');
			return false;
		}
	}else{
		if(sFirstNb != '' && sSecondNb != '' && sThirdNb != '' 
			&& sFourthNb != '' && rFirstNb != '' && rSecondNb != ''){
			
			if(sThirdNb.match(pattern) || sFourthNb.match(pattern)){
				alert("범위 지정에는 '*'문자를 사용할 수 없습니다.");
				return false;
			}
			
			from_ip = sFirstNb+'.'+sSecondNb+'.'+sThirdNb+'.'+sFourthNb;
			to_ip = sFirstNb+'.'+sSecondNb+'.'+rFirstNb+'.'+rSecondNb;
			
		}else{
			alert('모든 항목을 채워주세요');
			return false;
		}
	}
	
	saveIp(from_ip,to_ip);
}

function saveIp(from_ip,to_ip){
	
	var requestData = {from_ip:from_ip, to_ip:to_ip};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		   type : 'post',
		   url: '/security/permit/Ip/saveIp',
		   contentType: 'application/json',
		   data: requestData,
		   dataType: "json",
		   success: function (data) {
			   var flag = data.flag;
			   
			   if(flag == 0){
				   alert('저장 성공');
				   getPermitIpListData();
				   $('#ipAddBg').fadeOut();
				   $('#ipAddUp').fadeOut();
			   }else if(flag == 1){
				   alert('저장 실패(중복 아이피)');
			   }else{
				   alert('저장 실패');
			   }
		   },
		   error: function () { 
			   //alert('에러 발생');
		   }
	});
}