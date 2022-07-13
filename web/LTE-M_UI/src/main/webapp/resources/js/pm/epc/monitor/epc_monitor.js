var win;
var mainFilter = "";

$(document).ready(function(){
	
	win = window.top || window;
	
	if(win.name != "") {
		mainFilter = JSON.parse(win.name);
		win.name = "";
	}
	
	var alarmVolumes = getAlarmVolume();
	//가청 오디오 세팅
	audioFile.criticalaudio.src='/criticalAlarm';
	audioFile.criticalaudio.load();
	audioFile.criticalaudio.volume = alarmVolumes.P_CRITICAL_VOLUME/100;

	audioFile.majoraudio.src='/majorAlarm';
	audioFile.majoraudio.load();
	audioFile.majoraudio.volume = alarmVolumes.P_MAJOR_VOLUME/100;

	audioFile.minoraudio.src='/minorAlarm';
	audioFile.minoraudio.load();
	audioFile.minoraudio.volume = alarmVolumes.P_MINOR_VOLUME/100;
	
	getbasicSetting(1);
	
	$('#observeSetClose, #observeSetCancle,#observeSetBg').on('click',function(e){
		$('#observeSetBg').fadeOut();
		$('#observeSetUp').fadeOut();
	});
	//observeSet Drag 지정 정의
	$( "#observeSetUp" ).draggable({'handle' : '#observeSetTitleBox'});
	$( "#observeSetUp" ).resizable({
		animate: true
	});
	
	setTimeout("intervalSet()",500);
	
	$(window).click(function(e) {
		if($('#popMenu').css('display') == 'block'){
			$('#popMenu').css('display','none');
		}
	});
	
//	epcMmeDiv
//	equipSelect
//	table-cell
	
	var equipType;
	
	if (mainFilter != "") {
		equipType = getEquipType(mainFilter.equipType);
		if(equipType == 1) $('#equipSelect option:eq(1)').attr("selected","selected");
		else if(equipType == 4) $('#equipSelect option:eq(2)').attr("selected","selected");
		else if(equipType == 6) $('#equipSelect option:eq(3)').attr("selected","selected");
		else if(equipType == 7) $('#equipSelect option:eq(4)').attr("selected","selected");
		
		changeEquipType(equipType);
	}
	
	$('#equipSelect').change(function(){
		equipType = $('#equipSelect option:selected').val();
		changeEquipType(equipType);
	});
	
});

function intervalSet(){
	var intervalId = setInterval("getMaxDateTime()", 1000*30);
	$('#repeatBtn').val(intervalId);
	$('#repeatBtn').attr('onclick','javascript:intervalDelete()');
	
	if($('#repeatIcon').hasClass('play')){
		$('#repeatIcon').removeClass('play');
		$('#repeatIcon').addClass('pause');
	}else{
		$('#repeatIcon').addClass('pause');
	}
	
	getMaxDateTime();
}

function intervalDelete(){
	clearInterval($('#repeatBtn').val());
	$('#repeatBtn').attr('onclick','javascript:intervalSet()');
	
	if($('#repeatIcon').hasClass('pause')){
		$('#repeatIcon').removeClass('pause');
		$('#repeatIcon').addClass('play');
	}else{
		$('#repeatIcon').addClass('play');
	}
	
	deleteAlarmInterval();
}
//최근 수집시간 get
function getMaxDateTime(){
	
	$.ajax({
		type:'post',
		url:'/pm/pm_monitor/epc_monitor/getMaxDateTime',
		dataTpye:'json',
		success:function(data){
			
			$('#update_time').text("기준시간 : "+data.getMaxDateTime);
			
			var mmeRange = Number($('#mme_monitor_range').val());
			var pgwRange = Number($('#pgw_monitor_range').val());
			var sgwRange = Number($('#sgw_monitor_range').val());
			var hssRange = Number($('#hss_monitor_range').val());
			var pcrfRange = Number($('#pcrf_monitor_range').val());
			
			var mmedateArray = headerTimeArray(data.getMaxDateTime,mmeRange);
			var pgwdateArray = headerTimeArray(data.getMaxDateTime,pgwRange);
			var sgwdateArray = headerTimeArray(data.getMaxDateTime,sgwRange);
			var hssdateArray = headerTimeArrayHssPcrf(data.getMaxDateTime,hssRange);
			var pcrfdateArray = headerTimeArray(data.getMaxDateTime,pcrfRange);
			
			//==================== mme 헤더 설정 
			var mmeTimeTag = '';
			for(var i = 0; i<15 ; i++){
				for(var tag in mmedateArray){
					mmeTimeTag += mmedateArray[tag];
				}
			}
			
			$('#epcMmeHead').empty();
			$('#epcMmeHead').append(
					'<tr>'+
						'<th rowspan="3" style="width:91px">장비명</th>'+
						 '<th colspan='+(5*mmeRange)+'>Attach</th>'+
						 '<th colspan='+(5*mmeRange)+'>SRMO</th>'+
						 '<th colspan='+(5*mmeRange)+'>SRMT</th>'+
					'</tr>'+
					'<tr>'+
						'<th colspan='+mmeRange+'>시도호</th>'+
						'<th colspan='+mmeRange+'>기준시도호</th>'+
						'<th colspan='+mmeRange+'>시도호 증감율(%)</th>'+
						/*'<th colspan='+mmeRange+'>접속호</th>'+
						'<th colspan='+mmeRange+'>접속율(%)</th>'+*/
						'<th colspan='+mmeRange+'>성공호</th>'+
						'<th colspan='+mmeRange+'>성공율(%)</th>'+
						
						'<th colspan='+mmeRange+'>시도호</th>'+
						'<th colspan='+mmeRange+'>기준시도호</th>'+
						'<th colspan='+mmeRange+'>시도호 증감율(%)</th>'+
						/*'<th colspan='+mmeRange+'>접속호</th>'+
						'<th colspan='+mmeRange+'>접속율(%)</th>'+*/
						'<th colspan='+mmeRange+'>성공호</th>'+
						'<th colspan='+mmeRange+'>성공율(%)</th>'+
						 
						'<th colspan='+mmeRange+'>시도호</th>'+
						'<th colspan='+mmeRange+'>기준시도호</th>'+
						'<th colspan='+mmeRange+'>시도호 증감율(%)</th>'+
						/*'<th colspan='+mmeRange+'>접속호</th>'+
						'<th colspan='+mmeRange+'>접속율(%)</th>'+*/
						'<th colspan='+mmeRange+'>성공호</th>'+
						'<th colspan='+mmeRange+'>성공율(%)</th>'+
					'</tr>'+
					'<tr>'+
						mmeTimeTag+
					'</tr>'
				);
			//==================== pgw 헤더 설정
			var pgwTimeTag = '';
			for(var i = 0; i<15 ; i++){
				for(var tag in pgwdateArray){
					pgwTimeTag += pgwdateArray[tag];
				}
			}
			
			$('#epcPgwHead').empty();
			$('#epcPgwHead').append(
				'<tr>'+
					'<th rowspan="3" style="width:91px">장비명</th>'+
					'<th colspan='+(5*pgwRange)+'>Create</th>'+
					'<th colspan='+(5*pgwRange)+'>Delete</th>'+
					'<th colspan='+(5*pgwRange)+'>Modify</th>'+
				'</tr>'+
				'<tr>'+
					'<th colspan='+pgwRange+'>시도호</th>'+	
					'<th colspan='+pgwRange+'>기준시도호</th>'+	
					'<th colspan='+pgwRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+pgwRange+'>성공호</th>'+	
					'<th colspan='+pgwRange+'>성공율(%)</th>'+
					
					'<th colspan='+pgwRange+'>시도호</th>'+	
					'<th colspan='+pgwRange+'>기준시도호</th>'+	
					'<th colspan='+pgwRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+pgwRange+'>성공호</th>'+	
					'<th colspan='+pgwRange+'>성공율(%)</th>'+
					
					'<th colspan='+pgwRange+'>시도호</th>'+	
					'<th colspan='+pgwRange+'>기준시도호</th>'+	
					'<th colspan='+pgwRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+pgwRange+'>성공호</th>'+	
					'<th colspan='+pgwRange+'>성공율(%)</th>'+
				'</tr>'+
				'<tr>'+
					pgwTimeTag+
				'</tr>'
			);
			//==================== sgw 헤더 설정
			var sgwTimeTag = '';
			for(var i = 0; i<15 ; i++){
				for(var tag in sgwdateArray){
					sgwTimeTag += sgwdateArray[tag];
				}
			}
			
			$('#epcSgwHead').empty();
			$('#epcSgwHead').append(
				'<tr>'+
					'<th rowspan="3" style="width:91px">장비명</th>'+
					'<th colspan='+(5*sgwRange)+'>Create</th>'+
					'<th colspan='+(5*sgwRange)+'>Delete</th>'+
					'<th colspan='+(5*sgwRange)+'>Modify</th>'+
				'</tr>'+
				'<tr>'+
					'<th colspan='+sgwRange+'>시도호</th>'+	
					'<th colspan='+sgwRange+'>기준시도호</th>'+	
					'<th colspan='+sgwRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+sgwRange+'>성공호</th>'+	
					'<th colspan='+sgwRange+'>성공율(%)</th>'+
					
					'<th colspan='+sgwRange+'>시도호</th>'+	
					'<th colspan='+sgwRange+'>기준시도호</th>'+	
					'<th colspan='+sgwRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+sgwRange+'>성공호</th>'+	
					'<th colspan='+sgwRange+'>성공율(%)</th>'+
					
					'<th colspan='+sgwRange+'>시도호</th>'+	
					'<th colspan='+sgwRange+'>기준시도호</th>'+	
					'<th colspan='+sgwRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+sgwRange+'>성공호</th>'+	
					'<th colspan='+sgwRange+'>성공율(%)</th>'+
				'</tr>'+
				'<tr>'+
					sgwTimeTag+
				'</tr>'
			);
			//==================== hss 헤더 설정
			var hssTimeTag = '';
			for(var i = 0; i<10 ; i++){
				for(var tag in hssdateArray){
					hssTimeTag += hssdateArray[tag];
				}
			}
			
			$('#epcHssHead').empty();
			$('#epcHssHead').append(
					
				'<tr>'+
					'<th rowspan="3" style="width:91px">장비명</th>'+
					'<th colspan='+(5*hssRange)+'>S6A Interface</th>'+
					'<th colspan='+(5*hssRange)+'>Cx Interface</th>'+
				'</tr>'+
				'<tr>'+
					'<th colspan='+hssRange+'>시도호</th>'+
					'<th colspan='+hssRange+'>기준시도호</th>'+
					'<th colspan='+hssRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+hssRange+'>성공호</th>'+
					'<th colspan='+hssRange+'>성공율(%)</th>'+
					
					'<th colspan='+hssRange+'>시도호</th>'+
					'<th colspan='+hssRange+'>기준시도호</th>'+
					'<th colspan='+hssRange+'>시도호 증감율(%)</th>'+
					'<th colspan='+hssRange+'>성공호</th>'+
					'<th colspan='+hssRange+'>성공율(%)</th>'+
				'</tr>'+
				'<tr>'+
					hssTimeTag+
				'</tr>'
			);
			//==================== pcrf 헤더 설정
			var pcrfTimeTag = '';
			for(var i = 0; i<10; i++){
				for(var tag in pcrfdateArray){
					pcrfTimeTag += pcrfdateArray[tag];
				}
			}
			
			$('#epcPcrfHead').empty();
			$('#epcPcrfHead').append(
					'<tr>'+
						'<th rowspan="3" style="width:91px">장비명</th>'+
						'<th colspan='+(5*pcrfRange)+'>GX</th>'+
						'<th colspan='+(5*pcrfRange)+'>RX</th>'+
					'</tr>'+
					'<tr>'+
						'<th colspan='+pcrfRange+'>시도호</th>'+
						'<th colspan='+pcrfRange+'>기준시도호</th>'+
						'<th colspan='+pcrfRange+'>시도호 증감율(%)</th>'+
						'<th colspan='+pcrfRange+'>성공호</th>'+
						'<th colspan='+pcrfRange+'>성공율(%)</th>'+
						
						'<th colspan='+pcrfRange+'>시도호</th>'+
						'<th colspan='+pcrfRange+'>기준시도호</th>'+
						'<th colspan='+pcrfRange+'>시도호 증감율(%)</th>'+
						'<th colspan='+pcrfRange+'>성공호</th>'+
						'<th colspan='+pcrfRange+'>성공율(%)</th>'+
					'</tr>'+
					'<tr>'+
						pcrfTimeTag+
					'</tr>'
				);
			$('#maxDateTime').val(data.getMaxDateTime);
			getSearchData(data.getMaxDateTime);
		},
		error:function(data){
			
		}
	});
}

function getSearchData(stdDate){

	var date = new Date(stdDate);
	
	var mmeStartTime = getStartTime(stdDate,$('#mme_monitor_range').val()).format("yyyyMMddHHmm");
	var mmeEndTime = date.format("yyyyMMddHHmm");
	var mmeArrayTime = paramTimeArray(stdDate,$('#mme_monitor_range').val());
	
	var pgwStartTime = getStartTime(stdDate,$('#pgw_monitor_range').val()).format("yyyyMMddHHmm");
	var pgwEndTime = date.format("yyyyMMddHHmm");
	var pgwArrayTime = paramTimeArray(stdDate,$('#pgw_monitor_range').val());
	
	var sgwStartTime = getStartTime(stdDate,$('#sgw_monitor_range').val()).format("yyyyMMddHHmm");
	var sgwEndTime = date.format("yyyyMMddHHmm");
	var sgwArrayTime = paramTimeArray(stdDate,$('#sgw_monitor_range').val());
	
	var hssStartTime = getStartTime(stdDate,$('#hss_monitor_range').val()).format("yyyyMMddHHmm");
	var hssEndTime = date.format("yyyyMMddHHmm");
	var hssArrayTime = paramTimeArray(stdDate,$('#hss_monitor_range').val());
	
	var pcrfStartTime = getStartTime(stdDate,$('#pcrf_monitor_range').val()).format("yyyyMMddHHmm");
	var pcrfEndTime = date.format("yyyyMMddHHmm");
	var pcrfArrayTime = paramTimeArray(stdDate,$('#pcrf_monitor_range').val());
	
	var requestData = {
			mmeStartTime : mmeStartTime,
			mmeEndTime : mmeEndTime,
			mmeArrayTime : mmeArrayTime,
			pgwStartTime : pgwStartTime,
			pgwEndTime : pgwEndTime,
			pgwArrayTime : pgwArrayTime,
			sgwStartTime : sgwStartTime,
			sgwEndTime : sgwEndTime,
			sgwArrayTime : sgwArrayTime,
			hssStartTime : hssStartTime,
			hssEndTime : hssEndTime,
			hssArrayTime : hssArrayTime,
			pcrfStartTime : pcrfStartTime,
			pcrfEndTime : pcrfEndTime,
			pcrfArrayTime : pcrfArrayTime
	};
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/pm_monitor/epc_monitor/getEpcSearchData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			var epcMmeData = data.getEpcSearchData.MME;
			var epcPgwData = data.getEpcSearchData.PGW;
			var epcSgwData = data.getEpcSearchData.SGW;
			var epcHssData = data.getEpcSearchData.HSS;
			var epcPcrfData = data.getEpcSearchData.PCRF;
			
			$('#epcMmeGrid').empty();
			$('#epcPgwGrid').empty();
			$('#epcSgwGrid').empty();
			$('#epcHssGrid').empty();
			$('#epcPcrfGrid').empty();
			
			var audioLevel = 4;
			var compLevel;
			
			$(epcMmeData).each(function(i,value){
				
				compLevel = compKeyLevel(value,mmeArrayTime,'MAR');
		
				if(compKeyLevel(value,mmeArrayTime,'MASR') < compLevel) compLevel = compKeyLevel(value,mmeArrayTime,'MASR');
				if(compKeyLevel(value,mmeArrayTime,'MSAR') < compLevel) compLevel = compKeyLevel(value,mmeArrayTime,'MSAR');
				if(compKeyLevel(value,mmeArrayTime,'MSSR') < compLevel) compLevel = compKeyLevel(value,mmeArrayTime,'MSSR');
				if(compKeyLevel(value,mmeArrayTime,'MTAR') < compLevel) compLevel = compKeyLevel(value,mmeArrayTime,'MTAR');
				if(compKeyLevel(value,mmeArrayTime,'MTSR') < compLevel) compLevel = compKeyLevel(value,mmeArrayTime,'MTSR');
				
				if(compLevel < audioLevel) audioLevel = compLevel; 
				
				$('#epcMmeGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event,this,1)">'+
							'<td>'+value.MME_NAME+'</td>'+
							'<td style="display:none;">'+value.MME_ID+'</td>'+
							
							getTD(value,mmeArrayTime,'MAA')+	// ATTACH 시도호
							getTD(value,mmeArrayTime,'MAAS')+	// ATTACH 기준 시도호
							getTD(value,mmeArrayTime,'MAR')+	// ATTACH 시도호 증감율
							getTD(value,mmeArrayTime,'MAS')+	// ATTACH 성공호
							getTD(value,mmeArrayTime,'MASR')+	// ATTATCH 성공율
							/*getTD(value,mmeArrayTime,'MAAN')+	// ATTATCH 완료호
							getTD(value,mmeArrayTime,'MAAR')+	// ATTATCH 완료율*/
							
							getTD(value,mmeArrayTime,'MSA')+	// SR 시도호
							getTD(value,mmeArrayTime,'MSAS')+	// SR 기준 시도호
							getTD(value,mmeArrayTime,'MSAR')+	// SR 시도호 증감율
							getTD(value,mmeArrayTime,'MSS')+	// SR 성공호
							getTD(value,mmeArrayTime,'MSSR')+	// SR 성공율
							/*getTD(value,mmeArrayTime,'MSAN')+	// SR 완료호
							getTD(value,mmeArrayTime,'MSAR')+	// SR 완료율*/
							
							getTD(value,mmeArrayTime,'MTA')+	// SRMT 시도호
							getTD(value,mmeArrayTime,'MTSA')+	// SRMT 기준 시도호
							getTD(value,mmeArrayTime,'MTAR')+	// SRMT 시도호 증감율
							getTD(value,mmeArrayTime,'MTS')+	// SRMT 성공호
							getTD(value,mmeArrayTime,'MTSR')+	// SRMT 성공율
							/*getTD(value,mmeArrayTime,'MTAN')+	// SRMT 완료호
							getTD(value,mmeArrayTime,'MTAR')+	// SRMT 완료율*/
						'</tr>'
				);
			});
			$(epcPgwData).each(function(i,value){
				
				compLevel = compKeyLevel(value,pgwArrayTime,'PCAR');
				
				if(compKeyLevel(value,pgwArrayTime,'PCSR') < compLevel) compLevel = compKeyLevel(value,pgwArrayTime,'PCSR');
				if(compKeyLevel(value,pgwArrayTime,'PDAR') < compLevel) compLevel = compKeyLevel(value,pgwArrayTime,'PDAR');
				if(compKeyLevel(value,pgwArrayTime,'PDSR') < compLevel) compLevel = compKeyLevel(value,pgwArrayTime,'PDSR');
				if(compKeyLevel(value,pgwArrayTime,'PMAR') < compLevel) compLevel = compKeyLevel(value,pgwArrayTime,'PMAR');
				if(compKeyLevel(value,pgwArrayTime,'PMSR') < compLevel) compLevel = compKeyLevel(value,pgwArrayTime,'PMSR');
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				$('#epcPgwGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event,this,4)">'+
							'<td>'+value.PGW_NAME+'</td>'+
							'<td style="display:none;">'+value.PGW_ID+'</td>'+
							getTD(value,pgwArrayTime,'PCA')+
							getTD(value,pgwArrayTime,'PCAS')+
							getTD(value,pgwArrayTime,'PCAR')+
							getTD(value,pgwArrayTime,'PCS')+
							getTD(value,pgwArrayTime,'PCSR')+
							
							getTD(value,pgwArrayTime,'PDA')+
							getTD(value,pgwArrayTime,'PDAS')+
							getTD(value,pgwArrayTime,'PDAR')+
							getTD(value,pgwArrayTime,'PDS')+
							getTD(value,pgwArrayTime,'PDSR')+
							
							getTD(value,pgwArrayTime,'PMA')+
							getTD(value,pgwArrayTime,'PMAS')+
							getTD(value,pgwArrayTime,'PMAR')+
							getTD(value,pgwArrayTime,'PMS')+
							getTD(value,pgwArrayTime,'PMSR')+
						'</tr>'
				);
			});
			$(epcSgwData).each(function(i,value){
				
				compLevel = compKeyLevel(value,sgwArrayTime,'SAAR');
				
				if(compKeyLevel(value,sgwArrayTime,'SASR') < compLevel) compLevel = compKeyLevel(value,sgwArrayTime,'SASR');
				if(compKeyLevel(value,sgwArrayTime,'SDAR') < compLevel) compLevel = compKeyLevel(value,sgwArrayTime,'SDAR');
				if(compKeyLevel(value,sgwArrayTime,'SDSR') < compLevel) compLevel = compKeyLevel(value,sgwArrayTime,'SDSR');
				if(compKeyLevel(value,sgwArrayTime,'SMAR') < compLevel) compLevel = compKeyLevel(value,sgwArrayTime,'SMAR');
				if(compKeyLevel(value,sgwArrayTime,'SMSR') < compLevel) compLevel = compKeyLevel(value,sgwArrayTime,'SMSR');
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				$('#epcSgwGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event,this,5)">'+
							'<td>'+value.SGW_NAME+'</td>'+
							'<td style="display:none;">'+value.SGW_ID+'</td>'+
							getTD(value,sgwArrayTime,'SAA')+
							getTD(value,sgwArrayTime,'SAAS')+
							getTD(value,sgwArrayTime,'SAAR')+
							getTD(value,sgwArrayTime,'SAS')+
							getTD(value,sgwArrayTime,'SASR')+
							
							getTD(value,sgwArrayTime,'SDA')+
							getTD(value,sgwArrayTime,'SDAS')+
							getTD(value,sgwArrayTime,'SDAR')+
							getTD(value,sgwArrayTime,'SDS')+
							getTD(value,sgwArrayTime,'SDSR')+
							
							getTD(value,sgwArrayTime,'SMA')+
							getTD(value,sgwArrayTime,'SMAS')+
							getTD(value,sgwArrayTime,'SMAR')+
							getTD(value,sgwArrayTime,'SMS')+
							getTD(value,sgwArrayTime,'SMSR')+
						'</tr>'
				);
			});
			$(epcHssData).each(function(i,value){
				
				compLevel = compKeyLevel(value,hssArrayTime,'H6AR');
				
				if(compKeyLevel(value,hssArrayTime,'H6SR') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'H6SR');
				if(compKeyLevel(value,hssArrayTime,'CAR') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'CAR');
				if(compKeyLevel(value,hssArrayTime,'CSR') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'CSR');
/*				if(compKeyLevel(value,hssArrayTime,'H13AR') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'H13AR');
				if(compKeyLevel(value,hssArrayTime,'H13R') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'H13R');
				if(compKeyLevel(value,hssArrayTime,'HSAR') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'HSAR');
				if(compKeyLevel(value,hssArrayTime,'HSR') < compLevel) compLevel = compKeyLevel(value,hssArrayTime,'HSR');*/
				
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				$('#epcHssGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event,this,6)">'+
							'<td>'+value.HSS_NAME+'</td>'+
							'<td style="display:none;">'+value.HSS_ID+'</td>'+
							getTD(value,hssArrayTime,'H6A')+
							getTD(value,hssArrayTime,'H6SA')+
							getTD(value,hssArrayTime,'H6AR')+
							getTD(value,hssArrayTime,'H6S')+
							getTD(value,hssArrayTime,'H6SR')+
							
							getTD(value,hssArrayTime,'CA')+
							getTD(value,hssArrayTime,'CSA')+
							getTD(value,hssArrayTime,'CAR')+
							getTD(value,hssArrayTime,'CS')+
							getTD(value,hssArrayTime,'CSR')+
							
							
							/*getTD(value,hssArrayTime,'H13A')+
							getTD(value,hssArrayTime,'H13AS')+
							getTD(value,hssArrayTime,'H13AR')+
							getTD(value,hssArrayTime,'H13S')+
							getTD(value,hssArrayTime,'H13R')+
							
							getTD(value,hssArrayTime,'HSA')+
							getTD(value,hssArrayTime,'HSAS')+
							getTD(value,hssArrayTime,'HSAR')+
							getTD(value,hssArrayTime,'HSS')+
							getTD(value,hssArrayTime,'HSR')+*/
						'</tr>'
				);
			});
			$(epcPcrfData).each(function(i,value){
				
				compLevel = compKeyLevel(value,pcrfArrayTime,'GAR');
				
				if(compKeyLevel(value,pcrfArrayTime,'GSR') < compLevel) compLevel = compKeyLevel(value,pcrfArrayTime,'GR');
				if(compKeyLevel(value,pcrfArrayTime,'RAR') < compLevel) compLevel = compKeyLevel(value,pcrfArrayTime,'RXR');
				if(compKeyLevel(value,pcrfArrayTime,'RSR') < compLevel) compLevel = compKeyLevel(value,pcrfArrayTime,'RR');
				if(compLevel < audioLevel) audioLevel = compLevel;
				
				$('#epcPcrfGrid').append(
						'<tr onmousedown="javascript:rightMenu.rightClick(event,this,7)">'+
							'<td>'+value.PCRF_NAME+'</td>'+
							'<td style="display:none;">'+value.PCRF_ID+'</td>'+ 
							getTD(value,pcrfArrayTime,'GA')+
							getTD(value,pcrfArrayTime,'GSA')+
							getTD(value,pcrfArrayTime,'GAR')+
							getTD(value,pcrfArrayTime,'GS')+
							getTD(value,pcrfArrayTime,'GSR')+
							
							getTD(value,pcrfArrayTime,'RA')+
							getTD(value,pcrfArrayTime,'RSA')+
							getTD(value,pcrfArrayTime,'RAR')+
							getTD(value,pcrfArrayTime,'RS')+
							getTD(value,pcrfArrayTime,'RSR')+ 
							
							/*getTD(value,pcrfArrayTime,'AFA')+
							getTD(value,pcrfArrayTime,'AFAS')+
							getTD(value,pcrfArrayTime,'AFAR')+
							getTD(value,pcrfArrayTime,'AFS')+
							getTD(value,pcrfArrayTime,'AFR')+*/
						'</tr>'
				);
				
				
			});
			//alarm 가청 지정
			var playLevel = $('#alarm_level').val();
			var timeFlag = alarmTimeFlag();
			if(!$('#repeatIcon').hasClass('play')){
				if($('#alarm_check').is(':checked') && timeFlag){
					if(audioLevel == 1 && audioLevel <= playLevel){
						audioFile.criticalaudio.play();
						deleteAlarmInterval();
						setAlarmInterval(audioLevel);
					}else if(audioLevel == 2 && audioLevel <= playLevel){
						audioFile.majoraudio.play();
						deleteAlarmInterval();
						setAlarmInterval(audioLevel);
					}else if(audioLevel == 3 && audioLevel <= playLevel){
						audioFile.minoraudio.play();
						deleteAlarmInterval();
						setAlarmInterval(audioLevel);
					}else{
						audioFile.criticalaudio.pause();
						audioFile.criticalaudio.currentTime = 0;
						
						audioFile.majoraudio.pause();
						audioFile.majoraudio.currentTime = 0;
						
						audioFile.minoraudio.pause();
						audioFile.minoraudio.currentTime = 0;
						
						deleteAlarmInterval();
					}
				}else{
					audioFile.criticalaudio.pause();
					audioFile.criticalaudio.currentTime = 0;
					
					audioFile.majoraudio.pause();
					audioFile.majoraudio.currentTime = 0;
					
					audioFile.minoraudio.pause();
					audioFile.minoraudio.currentTime = 0;
					
					deleteAlarmInterval();
				}
			}else{
				if(audioLevel == 1 && audioLevel <= playLevel){
					audioFile.criticalaudio.play();
				}else if(audioLevel == 2 && audioLevel <= playLevel){
					audioFile.majoraudio.play();
				}else if(audioLevel == 3 && audioLevel <= playLevel){
					audioFile.minoraudio.play();
				}else{
					audioFile.criticalaudio.pause();
					audioFile.criticalaudio.currentTime = 0;
					
					audioFile.majoraudio.pause();
					audioFile.majoraudio.currentTime = 0;
					
					audioFile.minoraudio.pause();
					audioFile.minoraudio.currentTime = 0;
				}
			}
		},
		error:function(data){
			
		}
	});
}



function setAlarmInterval(level){
	var value;
	
	if(level == 1){
		value = setInterval("audioFile.criticalaudio.play()", 1000*60);
	}else if(level == 2){
		value = setInterval("audioFile.majoraudio.play()", 1000*60);
	}else if(level == 3){
		value = setInterval("audioFile.minoraudio.play()", 1000*60);
	}
	
	$('#alarmInterval').val(value);
}

function deleteAlarmInterval(){
	clearInterval($('#alarmInterval').val());
}

function color_level(level){
	
	if(level == 1){
		return 'class="critical"';
	}else if(level == 2){
		return 'class="major"';
	}else if(level == 3){
		return 'class="minor"';
	}else{
		return "";
	}
}

function alarmTimeFlag(){
	
	var returnFlag = true;
	
	var now = new Date().format("yyyyMMddHHmm");
	var next = new Date();
	next.setDate(next.getDate()+1);
	next = next.format("yyyyMMddHHmm");
	var yester = new Date();
	yester.setDate(yester.getDate()-1);
	yester = yester.format("yyyyMMddHHmm");
	
	var nowTime = now.substring(8,10);
	var nowDay = now.substring(0,8);
	var nextDay = next.substring(0,8);
	var yesterDay = yester.substring(0,8);
	
	
	var selectTimeVal = $('#alarm_time option:selected').val();
	var selectTime = $('#alarm_time option:selected').text();
	
	if(selectTimeVal == 2){
		var startTime = selectTime.split(" ~ ")[0].split(":");
		var endTime = selectTime.split(" ~ ")[1].split(":");
		
		startTime = nowDay+startTime[0]+startTime[1];
		endTime = nowDay+endTime[0]+endTime[1];
		
		if(Number(startTime) <= Number(now) && Number(now) <= Number(endTime)){
			returnFlag = true;
		}else{
			returnFlag = false;
		}
	}else if(selectTimeVal == 3){
		var startTime = selectTime.split(" ~ ")[0].split(":");
		var endTime = selectTime.split(" ~ ")[1].split(":");
		
		if(Number(startTime) < Number(nowTime)){
			startTime = nowDay+startTime[0]+startTime[1];
			endTime = nextDay+endTime[0]+endTime[1];
		}else{
			startTime = yesterDay+startTime[0]+startTime[1];
			endTime = nowDay+endTime[0]+endTime[1];
		}
		
		
		
		if(Number(startTime) <= Number(now) && Number(now) <= Number(endTime)){
			returnFlag = true;
		}else{
			returnFlag = false;
		}
	}else{
		returnFlag = true;
	}
	
	return returnFlag;
}

function headerTimeArray(stdDate,range){
	var date = new Date(stdDate);
	var dateArray = [];
	var newDateArray = [];
	
	for(var i = range-1; 0 <= i; i--){
		dateArray.push('<th>'+new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*i)).format("HH:mm")+'</th>');
	}
	
	for(var index = dateArray.length-1 ; 0 <= index; index--){
		newDateArray.push(dateArray[index]);
	}
	
	return newDateArray;
}

//2개의 내용을 보여주는 HSS, PCRF header 설정
function headerTimeArrayHssPcrf(stdDate,range){
	var date = new Date(stdDate);
	var dateArray = [];
	var newDateArray = [];
	
	for(var i = range-1; 0 <= i; i--){
		dateArray.push('<th >'+new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*i)).format("HH:mm")+'</th>');
	}
	
	for(var index = dateArray.length-1 ; 0 <= index; index--){
		newDateArray.push(dateArray[index]);
	}
	
	return newDateArray;
} 

function paramTimeArray(stdDate,range){
	var date = new Date(stdDate);
	var dateArray = [];
	var newDateArray = [];
	
	for(var i = range-1; 0 <= i; i--){
		dateArray.push(new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*i)).format("yyyyMMddHHmm"));
	}
	
	for(var index = dateArray.length-1 ; 0 <= index; index--){
		newDateArray.push(dateArray[index]);
	}
	
	return newDateArray;
}

function getStartTime(stdDate,range){
	var date = new Date(stdDate);
	var returnDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-(5*Number(range)));
	
	return returnDate;
}

function getTD(object, timeArray, key){
	var returnStr = '';
	var colorStr = '';
	
	for(index in timeArray){
		colorStr = '';
		colorStr = color_level(object[key+'L_'+timeArray[index]]);
		returnStr += '<td><span '+colorStr+'>'+object[key+'_'+timeArray[index]]+'</span></td>';
	}
	
	return returnStr;
}

function compKeyLevel(object, timeArray, key){
	var level = 4;
	
	for(index in timeArray){
		if(level > Number(object[key+'L_'+timeArray[index]])){
			level = Number(object[key+'L_'+timeArray[index]]);
		}
	}
	
	return level;
}


function excel_download(){
	
	var stdDate = $('#maxDateTime').val();
	var date = new Date(stdDate);
	
	var mmeStartTime = getStartTime(stdDate,$('#mme_monitor_range').val()).format("yyyyMMddHHmm");
	var mmeEndTime = date.format("yyyyMMddHHmm");
	var mmeArrayTime = paramTimeArray(stdDate,$('#mme_monitor_range').val()).join(",");
	
	var pgwStartTime = getStartTime(stdDate,$('#pgw_monitor_range').val()).format("yyyyMMddHHmm");
	var pgwEndTime = date.format("yyyyMMddHHmm");
	var pgwArrayTime = paramTimeArray(stdDate,$('#pgw_monitor_range').val()).join(",");
	
	var sgwStartTime = getStartTime(stdDate,$('#sgw_monitor_range').val()).format("yyyyMMddHHmm");
	var sgwEndTime = date.format("yyyyMMddHHmm");
	var sgwArrayTime = paramTimeArray(stdDate,$('#sgw_monitor_range').val()).join(",");
	
	var hssStartTime = getStartTime(stdDate,$('#hss_monitor_range').val()).format("yyyyMMddHHmm");
	var hssEndTime = date.format("yyyyMMddHHmm");
	var hssArrayTime = paramTimeArray(stdDate,$('#hss_monitor_range').val()).join(",");
	
	var pcrfStartTime = getStartTime(stdDate,$('#pcrf_monitor_range').val()).format("yyyyMMddHHmm");
	var pcrfEndTime = date.format("yyyyMMddHHmm");
	var pcrfArrayTime = paramTimeArray(stdDate,$('#pcrf_monitor_range').val()).join(",");
	
	var equipType = $('#equipSelect option:selected').val();
	
	var url =  "/pm/pm_monitor/epc_monitor/epcExcel?mmeStartTime="+mmeStartTime+"&mmeEndTime="+mmeEndTime+"&mmeArrayTime_join="+mmeArrayTime+
					"&pgwStartTime="+pgwStartTime+"&pgwEndTime="+pgwEndTime+"&pgwArrayTime_join="+pgwArrayTime+"&sgwStartTime="+sgwStartTime+
					"&sgwEndTime="+sgwEndTime+"&sgwArrayTime_join="+sgwArrayTime+"&hssStartTime="+hssStartTime+"&hssEndTime="+hssEndTime+
					"&hssArrayTime_join="+hssArrayTime+"&pcrfStartTime="+pcrfStartTime+"&pcrfEndTime="+pcrfEndTime+"&pcrfArrayTime_join="+pcrfArrayTime+
					"&equipType="+equipType;
	
    $(location).attr('href', url);
}

var rightMenu = {
		rightClick : function(event,obj,type){
			if(event.button == 2){
				$('#popMenu').css('display','block');
				var updateTime = $('#update_time').text();
				updateTime = updateTime.replace(" ","T");
				updateTime = new Date(updateTime);
				rightMenu.stdTime = updateTime;
				rightMenu.obj = obj;
				rightMenu.type = type;
				
				var pos = abspos(event);
				$('#popMenu').css('left',(pos.x+10)+'px');
				$('#popMenu').css('top',(pos.y-135)+'px');
			}
		},
		type : '',
		obj : {},
		stdTime : '',
		pageType : '2'
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}

function getEquipType(equipName){
	var equipType = 1;
	if(equipName == 'MME') equipType = 1;
	else if(equipName == 'PGW') equipType = 4;
	else if(equipName == 'SGW') equipType = 5;
	else if(equipName == 'HSS') equipType = 6;
	else if(equipName == 'PCRF') equipType = 7;
	else equipType = equipName;
	
	return equipType;
}

function changeEquipType(equipType){
	if(equipType == 1){
		if($('#epcMmeDiv').css('display') == 'none'){
			$('#epcMmeDiv').css('display','block');
			$('#epcMmeTitle').css('display','block');
		}
		
		$('#epcPgwDiv').css('display','none');
		$('#epcPgwTitle').css('display','none');
		$('#epcSgwDiv').css('display','none');
		$('#epcSgwTitle').css('display','none');
		$('#epcHssDiv').css('display','none');
		$('#epcHssTitle').css('display','none');
		$('#epcPcrfDiv').css('display','none');
		$('#epcPcrfTitle').css('display','none');
		
	}else if(equipType == 4){
		if($('#epcPgwDiv').css('display') == 'none'){
			$('#epcPgwDiv').css('display','block');
			$('#epcPgwTitle').css('display','block');
		}
		if($('#epcSgwDiv').css('display') == 'none'){
			$('#epcSgwDiv').css('display','block');
			$('#epcSgwTitle').css('display','block');
		}
		
		$('#epcMmeDiv').css('display','none');
		$('#epcMmeTitle').css('display','none');
		$('#epcHssDiv').css('display','none');
		$('#epcHssTitle').css('display','none');
		$('#epcPcrfDiv').css('display','none');
		$('#epcPcrfTitle').css('display','none');
		
	}else if(equipType == 6){
		if($('#epcHssDiv').css('display') == 'none'){
			$('#epcHssDiv').css('display','block');
			$('#epcHssTitle').css('display','block');
		}
		
		$('#epcMmeDiv').css('display','none');
		$('#epcMmeTitle').css('display','none');
		$('#epcSgwDiv').css('display','none');
		$('#epcSgwTitle').css('display','none');
		$('#epcPgwDiv').css('display','none');
		$('#epcPgwTitle').css('display','none');
		$('#epcPcrfDiv').css('display','none');
		$('#epcPcrfTitle').css('display','none');
	}else if(equipType == 7){
		if($('#epcPcrfDiv').css('display') == 'none'){
			$('#epcPcrfDiv').css('display','block');
			$('#epcPcrfTitle').css('display','block');
		}
		
		$('#epcMmeDiv').css('display','none');
		$('#epcMmeTitle').css('display','none');
		$('#epcSgwDiv').css('display','none');
		$('#epcSgwTitle').css('display','none');
		$('#epcPgwDiv').css('display','none');
		$('#epcPgwTitle').css('display','none');
		$('#epcHssDiv').css('display','none');
		$('#epcHssTitle').css('display','none');
	}else{
		$('#epcMmeDiv').css('display','block');
		$('#epcMmeTitle').css('display','block');
		$('#epcSgwDiv').css('display','block');
		$('#epcSgwTitle').css('display','block');
		$('#epcPgwDiv').css('display','block');
		$('#epcPgwTitle').css('display','block');
		$('#epcHssDiv').css('display','block');
		$('#epcHssTitle').css('display','block');
		$('#epcPcrfDiv').css('display','block');
		$('#epcPcrfTitle').css('display','block');
	}
}

function observeSetView() {
	$('#observeSetBg').show().fadeIn('fast');
	$('#observeSetUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#observeSetUp').height()-100)/2
	var width = (screen.width - $('#observeSetUp').width())/2
	
	$('#observeSetUp').css('left',width+'px');
	$('#observeSetUp').css('top',height+'px');
}

function observeSettingSave() {

   $('#observeSetBg').fadeOut();
   $('#observeSetUp').fadeOut();
   getMaxDateTime();
}