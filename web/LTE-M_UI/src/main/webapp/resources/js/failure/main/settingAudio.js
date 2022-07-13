/* 적용(체크) 된 등급만 저장 (Y/N으로 구분하는 컬럼을 사용안함) */
$(document).ready(function(){
	$("#btn_settingAudio_close").on('click',function(e){
		window.open("about:blank","_self").close();
	});	
	
	$("#btn_settingAudio_save").on('click',function(e){
		saveAudioInfo();
	});
	
	var alarmVolumes = getAlarmVolume();
	
	audioFile.criticalaudio.src='/criticalAlarm';
	audioFile.criticalaudio.load();
	audioFile.criticalaudio.volume = alarmVolumes.P_CRITICAL_VOLUME/100;
	
	audioFile.majoraudio.src='/majorAlarm';
	audioFile.majoraudio.load();
	audioFile.majoraudio.volume = alarmVolumes.P_MAJOR_VOLUME/100;
	
	audioFile.minoraudio.src='/minorAlarm';
	audioFile.minoraudio.load();
	audioFile.minoraudio.volume = alarmVolumes.P_MINOR_VOLUME/100;
	
	$("#monitorType_settingAudio").on('change',function(e){
		alarmVolumes = getAlarmVolume();
		
		if($("monitorType_settingAudio").val() == "1"){
			audioFile.criticalaudio.src='/criticalAlarm';
			audioFile.criticalaudio.load();
			audioFile.criticalaudio.volume = alarmVolumes.P_CRITICAL_VOLUME/100;
			
			audioFile.majoraudio.src='/majorAlarm';
			audioFile.majoraudio.load();
			audioFile.majoraudio.volume = alarmVolumes.P_MAJOR_VOLUME/100;
			
			audioFile.minoraudio.src='/minorAlarm';
			audioFile.minoraudio.load();
			audioFile.minoraudio.volume = alarmVolumes.P_MINOR_VOLUME/100;
		} else if($("monitorType_settingAudio").val() == "2"){
			audioFile.criticalaudio.src='/criticalFailureAlarm';
			audioFile.criticalaudio.load();
			audioFile.criticalaudio.volume = alarmVolumes.F_CRITICAL_VOLUME/100;
			
			audioFile.majoraudio.src='/majorFailureAlarm';
			audioFile.majoraudio.load();
			audioFile.majoraudio.volume = alarmVolumes.F_MAJOR_VOLUME/100;
			
			audioFile.majoraudio.src='/minorFailureAlarm';
			audioFile.majoraudio.load();
			audioFile.minoraudio.volume = alarmVolumes.F_MINOR_VOLUME/100;
		}
	});
	
	initialAudioForm();
	
});


function initialAudioForm(){
	
	/* 가청설정 폼 초기화 */	
	$("#tb_audioSetting tbody tr").each(function(i,e){							// -- EXAMPLE '컬럼명'(참조) -- 
		$(this).find('td input[type="checkbox"]').eq(0).prop("checked",false);	//'적용' (체크박스) : <input id="chk_audio1" name="chk_critical" type="checkbox" value="critical">
		$(this).find('td span').eq(1).html("");									//'가청파일' (보여지는 파일명) : <span id="audioFileNameCritical">CriticalAlarm.mp3</span>
		$(this).find('td input[type="hidden"]').eq(0).val("");					//'가청파일' (안보이는 파일명) : <input type="hidden" name="fileName_critical" value="">
		$(this).find('td input[type="number"]').eq(0).val("");					//'반복설정' (숫자 인풋박스) : <input type="number" id="volumeLevelCritical" name="volumeLevel_critical" min="0" class="mu-input" style="padding: 0 0 0 4px;">
		$(this).find('td button').eq(1).unbind();								//'미리듣기' (이벤트된 버튼) : <button id="audioPlayCritical" type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"><i class="mu-icon volume-up"></i></button>
	});
	
	var monitorType = $("#monitorType_settingAudio").val();
	
	/* 가청설정 데이터 조회 */
	$.ajax({
		cache : false,
		type : 'post',
		url : '/failure/setting/audioSetting/getAudioSettingData',
		contentType: 'application/json; charset=UTF-8',
		dataType:'json',
		data : JSON.stringify({
			'monitorType' : monitorType
		}),
		success: function (data) {
			if(data != null && data['audioSettingData'].length > 0){
				$.each(data['audioSettingData'], function (i,row){
					var grade = "";
					var audioSrc = null;
					if(row['SEVERITY'] == "1"){
						grade = "Critical";
						audioSrc = audioFile.criticalaudio.src;
					} else if(row['SEVERITY'] == "2"){
						grade = "Major";
						audioSrc = audioFile.majoraudio.src;
					} else if(row['SEVERITY'] == "3"){
						grade = "Minor";
						audioSrc = audioFile.minoraudio.src;
					} 
					
					var audioElement = $("#audioElement" + grade);
					var playElement = $("#audioPlay" + grade);
					$("#audioFileName"+grade).html(row['FILE_PATH']);
					$("#volumeLevel" + grade).val(row['VOLUME']);

//					var freader = new FileReader();
//					freader.onload = function(e) {
//						audioElement.attr('src', audioSrc);
//					}; //작동안함
					
					
					playElement.unbind();
					playElement.on('click',function(e){
						audioElement.attr('src', audioSrc);
						document.getElementById("audioElement"+grade).play();
//						$("#audioElement"+grade)[0].play(); //jQuery에 play()함수없음
					});
					
				});
				
			}
		}
	});
}

function fileInputClick(grade) {
	$("#audioFileInput"+grade).click();
}

function setAudioFile(grade, obj) {	
	if ( 'audio/mp3' == obj.files[0].type || 'audio/wav' == obj.files[0].type ) {
//		fileLoadPlayer($("#audioElement"+grade), obj.files[0]);	
		var audioElement = $("#audioElement"+grade);
		var playElement = $("#audioPlay"+grade);
		var file = obj.files[0];
		var freader = new FileReader();

		freader.onload = function(e) {
			audioElement.attr('src', e.target.result);
		};
		
		freader.readAsDataURL(file);
		$("#audioFileName"+grade).html(file.name);
		
		playElement.unbind();
		playElement.on('click',function(e){
			document.getElementById("audioElement"+grade).play();
//			$("#audioElement"+grade)[0].play(); //jQuery에 play()함수없음
		});
	}
	else {
		alert('MP3 또는 Wav 형식 파일만 등록이 가능 합니다.');
		//파일 선택 태그 초기화 
		$(obj).replaceWith( $(obj).clone(true) );
		$("#audioFileName"+grade).html("");
		return;
	}
}

function saveAudioInfo(){
	var flag = true;
	var tmpList = [];
	
	if($("#tb_audioSetting tbody tr input[type='checkbox']:checked").length == 0){
		alert("적용시킬 파일을 체크 후 저장버튼을 눌러주세요.");
		return;
	}
	
	/*$("#tb_audioSetting tbody tr input[type='checkbox']:checked").each(function(i,e){
		if($(this).parent().parent().parent().find('input[type="file"]').eq(0).prop('value') == ""){
			flag = false;
			tmpList.push($(this).val());
		}
	});*/
	
	if(flag){
		$("#tb_audioSetting tbody input[type='hidden']").each(function(i,e){
			$(e).val($(this).parent().find('span').html());
		});
		
		$("#uploadAudioForm").ajaxForm({
			beforeSubmit : function(data,frm,opt){
				
			},
			success: function(responseText,statusText){
				alert(responseText['addAudioFileResult']);
			},
			error: function(){
				alert("에러!");
			}
		});
		$("#uploadAudioForm").submit();		
	} else {
//		alert("체크된 등급 (" + tmpList.join(", ") + ") 의 가청파일을 다시 등록 후 체크해주세요.")
	}
	
}
