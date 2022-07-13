var changeFlag = false;

$(document).ready(function(){
	$("#popDetailWindow").draggable({'handle' : '#popDetailTitle'});
	$("#popDetailWindow").resizable();
	
	$('#popDetailClose').on('click',function(e){
		$('#popFirstView').val(1);
		$('#popDetailWindow').fadeOut();
	});
	
	$("#popDetailWindow").resize(function(){
		height = 395+($("#popDetailWindow").height()-536);
		$('#_tableDiv').css('max-height',height+'px');
	})
	
	$('#startDetailDate').datepicker({
		dateFormat: 'yy-mm-dd',
		onClose: function( selectedDate ) {
	        $( "#endDetailDate" ).datepicker( "option", "minDate", selectedDate );
	    }
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dateFormat: 'yy-mm-dd'
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});
	
	$('#endDetailDate').datepicker({
		minDate: "+1D",
		dateFormat: 'yy-mm-dd'
		,changeYear: true
		,changeMonth: true
		,stepMonths: 1
		,showButtonPanel: true
		,dateFormat: 'yy-mm-dd'
		,dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] 
		,monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'] 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
	});
	
	$('#startDetailDateBtn').on('click',function(e){
		$('#startDetailDate').datepicker("show");
	});
	
	
	$('#endDetailDateBtn').on('click',function(e){
		$('#endDetailDate').datepicker("show");
	});
	
	$('#_detailKpiSelect').on('change', function(e){
		changeFlag = true;
	});
});

function popDetailView(){
	
	popSortFunction.sortInfo = [];
	popSortFunction.beforeColNms = [];
	
	$('#detailHeaderTr').empty();
	
	if(rightMenu.pageType == 1 && rightMenu.type == 1){
		
		var ruheader = rightMenu.equipType==3?'<th class="updown" id="RU_NAME">Cell</th>':'';
		
		$('#detailKpiDiv').css('display','none');
		$('#detailHeaderTr').append(
			'<th class="updown" title="시간" id="EVENT_TIME">시간</th>'+
			'<th class="updown" title="장비 ID" id="DU_ID">장비 ID</th>'+
			'<th class="updown" title="기지국" id="DU_NAME">기지국</th>'+
			ruheader+
			'<th class="updown" title="RRC 시도호" id="ATTEMPT">RRC 시도호</th>'+
			'<th class="updown" title="RRC 기준 시도호" id="STD_ATT">RRC 기준 시도호</th>'+
			'<th class="updown" title="RRC 시도호 증감율(%)" id="ATT_RATE">RRC 시도호 증감율(%)</th>'+
			// 추가 
			'<th class="updown" title="ERAB Setup 시도호" id="ERAB_ATTEMPT">ERAB Setup 시도호</th>'+
			'<th class="updown" title="ERAB Setup 기준 시도호" id="STD_ERAB">ERAB Setup 기준 시도호</th>'+
			'<th class="updown" title="ERAB Setup 시도호 증감율(%)" id="ERAB_RATE">ERAB Setup 시도호 증감율(%)</th>'+
			// ===
			'<th class="updown" title="소통호(RRC 성공호)" id="RRC">소통호(RRC 성공호)</th>'+
			'<th class="updown" title="소통율(RRC 성공율)(%)" id="RRC_RATE">소통율(RRC 성공율)(%)</th>'+
			'<th class="updown" title="완료호(ERAB SETUP 성공호)" id="ANSWER">완료호(ERAB SETUP 성공호)</th>'+
			'<th class="updown" title="완료율" id="ANSWER_RATE">완료율</th>'+
			'<th class="updown" title="ERAB SETUP ADD 성공호" id="ERAB_ADD_SUCCESS">ERAB SETUP ADD 성공호</th>'+
			'<th class="updown" title="절단호" id="CD">절단호</th>'+
			'<th class="updown" title="절단율" id="CD_RATE">절단율</th>'
		);
	}else if(rightMenu.pageType == 1 && rightMenu.type == 2){	
		$('#detailHeaderTr').append(
			'<th class="updown" id="EVENT_TIME">시간</th>'+
			'<th class="updown" id="DU_ID">장비 ID</th>'+
			'<th class="updown" id="DU_NAME">기지국</th>'+
			'<th class="updown" id="TOTAL_VOLUMN">Total Volume(KByte)</th>'+
			'<th class="updown" id="TOTAL_DTP">Total Throughput(KBps)</th>'+
			'<th class="updown" id="UP_VOLUMN">Upload Volume(KByte)</th>'+
			'<th class="updown" id="DW_VOLUMN">Download Volume(KByte)</th>'+
			'<th class="updown" id="UP_DTP">Upload Throughput(KBps)</th>'+
			'<th class="updown" id="DW_DTP">Download Throughput(KBps)</th>'
		);
			
			
	}else if(rightMenu.pageType == 1 && rightMenu.type == 3){
		$('#detailHeaderTr').append(
			'<th class="updown" id="EVENT_TIME">시간</th>'+
			'<th class="updown" id="DU_ID">장비 ID</th>'+
			'<th class="updown" id="DU_NAME">기지국</th>'+
			'<th class="updown" id="STATISTICS_TYPE">타입</th>'+
			'<th class="updown" id="ATTEMPT">시도호</th>'+
			'<th class="updown" id="STD_ATT_5M">기준 시도호</th>'+
			'<th class="updown" id="ATT_RATE">시도호 증감율(%)</th>'+
			'<th class="updown" id="SUCCESS">성공호</th>'+
			'<th class="updown" id="SUCC_RATE">성공율(%)</th>'
		);
			
			
	}else if(rightMenu.pageType == 3 && rightMenu.type == 1){
		// 기지국 KPI 분석 (kpi 그리드 KPI > 우클릭 > 상세보기
		$('#popDetailWindow').css('max-width', '1470px');
		$('#detailKpiDiv').css('display','none');
		$('#detailHeaderTr').append(
			'<th class="updown" id="EVENT_TIME">시간</th>'+
			'<th class="updown" id="DU_ID">장비 ID</th>'+
			'<th class="updown" id="DU_NAME">기지국</th>'+
			'<th class="updown" id="ATTEMPT">RRC 시도호</th>'+
			'<th class="updown" id="STD_ATT">RRC 기준 시도호</th>'+
			'<th class="updown" id="ATT_RATE">RRC 시도호 증감율(%)</th>'+
			'<th class="updown" id="ERAB_ATTEMPT">ERAB Setup 시도호</th>'+
			'<th class="updown" id="STD_ERAB">ERAB Setup 기준 시도호</th>'+
			'<th class="updown" id="ERAB_ATT_RATE">ERAB Setup 시도호 증감율(%)</th>'+
			'<th class="updown" id="RRC">소통호(RRC 성공호)</th>'+
			'<th class="updown" id="RRC_RATE">소통율(RRC 성공율)(%)</th>'+
			'<th class="updown" id="ANSWER">완료호(ERAB SETUP 성공호)</th>'+
			'<th class="updown" id="ANSWER_RATE">완료율(ERAB Setup 성공율)(%)</th>'+
			'<th class="updown" id="ERAB_ADD_SUCCESS">ERAB Setup Add 성공호</th>'+
			'<th class="updown" id="CD">절단호</th>'+
			'<th class="updown" id="CD_RATE">절단율(%)</th>'
		);
	}else if(rightMenu.pageType == 3 && rightMenu.type == 2){	// 기지국 KPI 분석  (Data Throughput) 그리드 > 우클릭 > 상세보기
		
		var detailKpi = $('#detailKpiSelect option:selected').val();
		$('#detailKpiDiv').css('display','');
		$('#_detailKpiSelect').empty();
		$('#_detailKpiSelect').append(
			'<option value="1">UP</option>'+
			'<option value="2">DOWN</option>'
		);
		$('#_detailKpiSelect').val(detailKpi).attr("selected","selected");
		
		if(detailKpi == 1){
			td = '<th class="updown" id="UP_VOLUMN">Volume(KByte)</th>'+
				'<th class="updown" id="UP_VOLUMN_STD">기준 Volume(KByte)</th>'+
				'<th class="updown" id="UP_VOLUMN_RATE">Volume 증감율(%)</th>'+
				'<th class="updown" id="UP_DTP">Throughput(KBps)</th>'+
				'<th class="updown" id="UP_DTP_STD">기준 Throughput(KBps)</th>'+
				'<th class="updown" id="UP_DTP_RATE">Throughput 증감율(%)</th>';
		}else{
			td = '<th class="updown" id="DW_VOLUMN">Volume(KByte)</th>'+
				'<th class="updown" id="DW_VOLUMN_STD">기준 Volume(KByte)</th>'+
				'<th class="updown" id="DW_VOLUMN_RATE">Volume 증감율(%)</th>'+
				'<th class="updown" id="DW_DTP">Throughput(KBps)</th>'+
				'<th class="updown" id="DW_DTP_STD">기준 Throughput(KBps)</th>'+
				'<th class="updown" id="DW_DTP_RATE">Throughput 증감율(%)</th>';
		}
		
		$('#detailHeaderTr').append(
			'<th class="updown" id="EVENT_TIME">시간</th>'+
			'<th class="updown" id="DU_ID">장비 ID</th>'+
			'<th class="updown" id="DU_NAME">기지국</th>'+
			td
//			'<th class="updown" id="TIME">TIME(분)</th>'
		);
		
	}else if(rightMenu.pageType == 3 && rightMenu.type == 3){
		
		var detailKpi = $('#detailKpiSelect option:selected').val();
		$('#detailKpiDiv').css('display','');
		setKpiSelect(99,'_detailKpiSelect','detailKpiDiv',1, '');
		$('#_detailKpiSelect').val(detailKpi).attr("selected","selected");
		
		$('#detailHeaderTr').append(
			'<th class="updown" id="EVENT_TIME">시간</th>'+
			'<th class="updown" id="DU_ID">장비 ID</th>'+
			'<th class="updown" id="DU_NAME">기지국</th>'+
			'<th class="updown" id="STATISTICS_TYPE">타입</th>'+
			'<th class="updown" id="ATTEMPT">시도호</th>'+
			'<th class="updown" id="STD_ATT_5M">기준 시도호</th>'+
			'<th class="updown" id="ATT_RATE">시도호 증감율(%)</th>'+
			'<th class="updown" id="SUCCESS">성공호</th>'+
			'<th class="updown" id="SUCC_RATE">성공율(%)</th>'
		);
	}else if(rightMenu.pageType == 5){
		$('#detailKpiDiv').css('display','none');
		$('#detailHeaderTr').append(
				'<th class="updown" id="EVENT_TIME">시간</th>'+
				'<th class="updown" id="SYSTEM_ID">장비 ID</th>'+
				'<th class="updown" id="SYSTEM_NAME">장비 명</th>'+
				'<th class="updown" id="ATTEMPT">시도호</th>'+
				'<th class="updown" id="SUCCESS">성공호</th>'+
				'<th class="updown" id="ATT_RATE">시도호 증감율(%)</th>'+
				'<th class="updown" id="SUCC_RATE">성공율(%)</th>'
		);
	}else if(rightMenu.pageType == 6){
		setKpiSelect(10,'_detailKpiSelect','detailKpiDiv',rightMenu.pageType, '');
		detailKpi = $('#kpiSelect option:selected').val();
		$('#_detailKpiSelect').val(detailKpi);
		$('#detailKpiDiv').css('display','');
		$('#detailHeaderTr').append(
				'<th class="updown" id="EVENT_TIME">시간</th>'+
				'<th class="updown" id="SYSTEM_ID">장비 ID</th>'+
				'<th class="updown" id="SYSTEM_NAME">장비 명</th>'+
				'<th class="updown" id="ATTEMPT">시도호</th>'+
				'<th class="updown" id="SUCCESS">성공호</th>'+
				'<th class="updown" id="ATT_RATE">시도호 증감율(%)</th>'+
				'<th class="updown" id="SUCC_RATE">성공율(%)</th>'
		);
		
	} else{
		$('#detailKpiDiv').css('display','');
		setKpiSelect(rightMenu.type,'_detailKpiSelect','detailKpiDiv',rightMenu.pageType, rightMenu.typetext);
		var detailKpi = 0;
		if(rightMenu.pageType == 4){
			detailKpi = $('#kpiSelect option:selected').val();
			$('#_detailKpiSelect').val(detailKpi).attr("selected","selected");
		}
		
		if(rightMenu.type == 1 && detailKpi == 2){
			
			if(rightMenu.pageType == 2){
				$('#detailHeaderTr').append(
					'<th class="updown" id="EVENT_TIME">시간</th>' +
					'<th class="updown" id="NE_ID">장비 ID</th>' +
					'<th class="updown" id="NE_NAME">장비 명</th>' +
					'<th class="updown" id="KPI">지표</th>' +
					'<th class="updown" id="ATTEMPT">시도호</th>' +
					'<th class="updown" id="STD_ATT">기준 시도호</th>' +
					'<th class="updown" id="ATT_RATE">시도호 증감율</th>' 
				);
			}else if(rightMenu.pageType == 4){
				$('#detailHeaderTr').append(
					'<th class="updown" id="EVENT_TIME">시간</th>' +
					'<th class="updown" id="NE_ID">장비 ID</th>' +
					'<th class="updown" id="NE_NAME">장비 명</th>' +
					'<th class="updown" id="ATTEMPT">시도호</th>' +
					'<th class="updown" id="STD_ATT">기준 시도호</th>' +
					'<th class="updown" id="ATT_RATE">시도호 증감율</th>'
				);
			}
		}else if(rightMenu.type == 4 || rightMenu.type == 5){
			
			if(rightMenu.pageType == 2){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="KPI">지표</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}else if(rightMenu.pageType == 4){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}
		}else if(rightMenu.type == 6){
			
			if(rightMenu.pageType == 2){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="KPI">지표</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}else if(rightMenu.pageType == 4){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}
		}else if(rightMenu.type == 7){
			
			if(rightMenu.pageType == 2){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="KPI">지표</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}else if(rightMenu.pageType == 4){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}
		}else{
			
			if(rightMenu.pageType == 2){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="KPI">지표</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}else if(rightMenu.pageType == 4){
				$('#detailHeaderTr').append(
						'<th class="updown" id="EVENT_TIME">시간</th>' +
						'<th class="updown" id="NE_ID">장비 ID</th>' +
						'<th class="updown" id="NE_NAME">장비 명</th>' +
						'<th class="updown" id="ATTEMPT">시도호</th>' +
						'<th class="updown" id="STD_ATT">기준 시도호</th>' +
						'<th class="updown" id="ATT_RATE">시도호 증감율</th>' +
						'<th class="updown" id="SUCCESS">성공호</th>' +
						'<th class="updown" id="SUCC_RATE">성공율</th>'
				);
			}
		}
	}
	
	$('#detailTable thead tr th').on('click',function(e){
		if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
			popSortFunction.dataSort(this,e.ctrlKey);
	});
	
	var height = (screen.height - $('#popDetailWindow').height()-100)/2
	var width = (screen.width - $('#popDetailWindow').width())/2
	
	$('#popDetailWindow').css('left',width+'px');
	$('#popDetailWindow').css('top',height+'px');
	
	$('#popDetailWindow').show().fadeIn('fast');
	
	var endYear = rightMenu.stdTime.format("yyyy");
	var endMonth = rightMenu.stdTime.format("MM");
	var endDate = rightMenu.stdTime.format("dd");
	var endHour = rightMenu.stdTime.format("HH");
	var endMin = rightMenu.stdTime.format("mm");
	
	var date = new Date();
	
	if(rightMenu.pageType == 1 || rightMenu.pageType == 2){
		date = new Date(rightMenu.stdTime.getTime() - 1000*60*60*3);
	}else{
		date = rightMenu.stdTime;
	}
	
	var startYear = date.format("yyyy");
	var startMonth = date.format("MM");
	var startDate = date.format("dd");
	var startHour = date.format("HH");
	var startMin = date.format("mm");
	
	$('#endDetailDate').val(endYear+"-"+endMonth+"-"+endDate);
	$('#startDetailDate').val(startYear+"-"+startMonth+"-"+startDate);
	
	$('#startDetailHourSelect').val(startHour).attr("selected","selected");
	$('#startDetailMinSelect').val(startMin).attr("selected","selected");
	
	$('#endDetailHourSelect').val(endHour).attr("selected","selected");
	$('#endDetailMinSelect').val(endMin).attr("selected","selected");
	
	if(rightMenu.pageType == 1 && rightMenu.type == 1){
		if(rightMenu.equipType == 3) $('#popDetailTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(1)").text()+"("+$(rightMenu.obj).children(":eq(2)").text()+")");
		else $('#popDetailTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(1)").text());
		$('#detailKpiDiv').css('display','none');
		getPopDetailData();
	}else if(rightMenu.pageType == 1 && rightMenu.type == 2){
		$('#popDetailTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(1)").text());
		$('#detailKpiDiv').css('display','none');
		getPopDetailData();
	}else if(rightMenu.pageType == 1 && rightMenu.type == 3){
		$('#popDetailTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(1)").text());
		setKpiSelect(99,'_detailKpiSelect','detailKpiDiv',1,'');
		$('#detailKpiDiv').css('display','');
		getPopDetailData();
	}else if(rightMenu.pageType == 2){
		$('#popDetailTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(0)").text());
		$('#detailKpiDiv').css('display','');
		setKpiSelect(rightMenu.type,'_detailKpiSelect','detailKpiDiv',rightMenu.pageType, rightMenu.typetext);
		getPopDetailData();
	}else if(rightMenu.pageType == 5){
		$('#popDetailTitleText').text("상세보기 : "+$(rightMenu.obj).children(":eq(0)").text());
		$('#detailKpiDiv').css('display','none');
		getPopDetailData();
	}else{
		$('#popDetailTitleText').text("상세보기");
		$('#searchBtn').attr('onclick','javascript:getPopAnalysisData()');
		getPopAnalysisData();
	}
}

function getPopDetailData(){
	
	var obj = rightMenu.obj;
	var equip_name = '';
	var equip_cuid = '';
	var getDataUrl = '';
	var ru_cuid = '';
	var equipType='';
	
	if(rightMenu.pageType == 1){
		equip_name = $(obj).children(":eq(0)").text();
		equip_id = $(obj).children(":eq(1)").text();
		ru_cuid = rightMenu.type == 1?$(obj).children(":eq(3)").text():'';
		equipType = rightMenu.equipType;
		getDataUrl = '/pm/monitor/getPopDetailData';
	}else if(rightMenu.pageType == 5){
		equip_name = $(obj).children(":eq(0)").text();
		equip_id = $(obj).children(":eq(1)").text();
		getDataUrl = '/pm/monitor/getPopRecordDetailData';
	}else{
		equip_name = $(obj).children(":eq(0)").text();
		equip_id = $(obj).children(":eq(1)").text();
		getDataUrl = '/pm/monitor/getPopEpcDetailData';
	}
	
	var startDateTimeText = $('#startDetailDate').val()+" "+$('#startDetailHourSelect option:selected').val()+":"+$('#startDetailMinSelect option:selected').val();
	var endDateTimeText = $('#endDetailDate').val()+" "+$('#endDetailHourSelect option:selected').val()+":"+$('#endDetailMinSelect option:selected').val();
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 12){
		alert('최대 12시간 조회만 가능합니다.');
		return false;
	}
	
	//지표선택이 변경이 되었는지 확인
	if(changeFlag){
		$.each($('#detailTable thead tr th'),function(i,val){
			$(val).attr('class','updown');
			popSortFunction.sortInfo = [];
			popSortFunction.beforeColNms = [];
		});
		
		changeFlag = false;
	}
	
	var requestData = {
			name : equip_name,
			equip_id : equip_id,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			equipType : equipType,
			ru_cuid : ru_cuid,
			flag : rightMenu.type,
			kpi : $('#_detailKpiSelect option:selected').val(),
			sortOption : popSortFunction.sortInfo
	}
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url: getDataUrl,
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			$('#detailGrid').empty();
			
			if(rightMenu.pageType == 1){
				accessCreateTR(data);
			}else if(rightMenu.pageType == 5){
				recordCreateTR(data);
			}else{
				if(rightMenu.type == 1 && $('#_detailKpiSelect option:selected').val() == 2){
					
					var classNames = {};
					$.each($('#detailTable thead tr th'),function(i,val){
						classNames[val.id] = $(val).attr('class');
					});
					
					$('#detailHeaderTr').empty();
					$('#detailHeaderTr').append(
							'<th class="'+classNames.EVENT_TIME+'" id="EVENT_TIME">시간</th>' +
							'<th class="'+classNames.NE_ID+'" id="NE_ID">장비 ID</th>' +
							'<th class="'+classNames.NE_NAME+'" id="NE_NAME">장비 명</th>' +
							'<th class="'+classNames.KPI+'" id="KPI">지표</th>' +
							'<th class="'+classNames.ATTEMPT+'" id="ATTEMPT">시도호</th>' +
							'<th class="'+classNames.STD_ATT+'" id="STD_ATT">기준 시도호</th>' +
							'<th class="'+classNames.ATT_RATE+'" id="ATT_RATE">시도호 증감율</th>'
					);
					
					$('#detailTable thead tr th').on('click',function(e){
						if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
							popSortFunction.dataSort(this,e.ctrlKey);
					});
					
				}else if(rightMenu.type == 1 && $('#_detailKpiSelect option:selected').val() != 2){
					
					var classNames = {};
					$.each($('#detailTable thead tr th'),function(i,val){
						classNames[val.id] = $(val).attr('class');
					});
					
					$('#detailHeaderTr').empty();
					$('#detailHeaderTr').append(
							'<th class="'+classNames.EVENT_TIME+'" id="EVENT_TIME">시간</th>' +
							'<th class="'+classNames.NE_ID+'" id="NE_ID">장비 ID</th>' +
							'<th class="'+classNames.NE_NAME+'" id="NE_NAME">장비 명</th>' +
							'<th class="'+classNames.KPI+'" id="KPI">지표</th>' +
							'<th class="'+classNames.ATTEMPT+'" id="ATTEMPT">시도호</th>' +
							'<th class="'+classNames.STD_ATT+'" id="STD_ATT">기준 시도호</th>' +
							'<th class="'+classNames.ATT_RATE+'" id="ATT_RATE">시도호 증감율</th>' +
							'<th class="'+classNames.SUCCESS+'" id="SUCCESS">성공호</th>' +
							'<th class="'+classNames.SUCC_RATE+'" id="SUCC_RATE">성공율</th>'
					);
					
					$('#detailTable thead tr th').on('click',function(e){
						if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
							popSortFunction.dataSort(this,e.ctrlKey);
					});
				}
				
				epcCreateTR(data);
			}
			
			if($('#popDetailFirstView').val() == 1){
				var height = (screen.height - $('#popDetailWindow').height()-100)/2
				var width = (screen.width - $('#popDetailWindow').width())/2
				$('#popDetailWindow').css('left',width+'px');
				$('#popDetailWindow').css('top',height+'px');
				
				$('#popDetailFirstView').val(0);
			}
		},
		error:function(data){
			
		}
	});
}

function accessCreateTR(data){

	var num = 0;
	
	if(rightMenu.type == 1){
		
		var equipType = rightMenu.equipType;
		var ruData='';
		
		$(data.getDetailData).each(function(index,value){
			num++;
			
			ruData = equipType=='3'?'<td>'+value.RU_CUID+'</td>':'';
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.DU_ID+'</td>'+
					'<td>'+value.DU_NAME+'</td>'+
					ruData+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					
					'<td>'+value.ERAB_ATTEMPT+'</td>'+
					'<td>'+value.STD_ERAB+'</td>'+
					'<td>'+value.ERAB_RATE+'</td>'+
					
					'<td>'+value.RRC+'</td>'+
					'<td>'+value.RRC_RATE+'</td>'+
					'<td>'+value.ANSWER+'</td>'+
					'<td>'+value.ANSWER_RATE+'</td>'+
					'<td>'+value.ERAB_ADD_SUCCESS+'</td>'+
					'<td>'+value.CD+'</td>'+
					'<td>'+value.CD_RATE+'</td>'+
				'</tr>'
			);
		});
	}else if(rightMenu.type == 2) {
		$(data.getDetailData).each(function(index,value){
			num++;
			
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.DU_ID+'</td>'+
					'<td>'+value.DU_NAME+'</td>'+
					'<td>'+value.TOTAL_VOLUMN+'</td>'+
					'<td>'+value.TOTAL_DTP+'</td>'+
					'<td>'+value.UP_VOLUMN+'</td>'+
					'<td>'+value.DW_VOLUMN+'</td>'+
					'<td>'+value.UP_DTP+'</td>'+
					'<td>'+value.DW_DTP+'</td>'+
				'</tr>'
			);
		});
	} else {
		$(data.getDetailData).each(function(index,value){
			num++;
			
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.DU_ID+'</td>'+
					'<td>'+value.DU_NAME+'</td>'+
					'<td>'+value.STATISTICS_TYPE+'</td>'+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT_5M+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					'<td>'+value.SUCCESS+'</td>'+
					'<td>'+value.SUCC_RATE+'</td>'+
				'</tr>'
			);
		});
	}
	
	if(num < 11){
		var tdTag = '';
		if(rightMenu.type == 1){
			if(rightMenu.equipType=='3'){
				tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td>';
			}
			else if(rightMenu.equipType=='2'){ 
				tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
			}
			else{
				tdTag = '<td></td><td></td><td></td><td></td><td></td>';
			}
		}
		for(var index = 0; index < 11-num; index++){
			$('#detailGrid').append(
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					tdTag+
				'</tr>'
			);
		}
	}
}

function epcCreateTR(data){
	var num = 0;
	var kpi = $('#_detailKpiSelect option:selected').val();
	var td_second = '';
	var td_first = '';
	
	$(data.getDetailData).each(function(index,value){
		num++;
		if(kpi!=2) td='';
		$('#detailGrid').append(
			'<tr>'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.NE_ID+'</td>'+
				'<td>'+value.NE_NAME+'</td>'+
				'<td>'+value.KPI+'</td>'+
				'<td>'+value.ATTEMPT+'</td>'+
				'<td>'+value.STD_ATT+'</td>'+
				'<td>'+value.ATT_RATE+'</td>'+
				'<td>'+value.SUCCESS+'</td>'+
				'<td>'+value.SUCC_RATE+'</td>'+
				td+
			'</tr>'
		);
	});
	
		//하나로 통일
	/*if(rightMenu.type == 1){
		$(data.getDetailData).each(function(index,value){
			num++;
			if(kpi!=2) td='';
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.NE_ID+'</td>'+
					'<td>'+value.NE_NAME+'</td>'+
					'<td>'+value.KPI+'</td>'+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					'<td>'+value.SUCCESS+'</td>'+
					'<td>'+value.SUCC_RATE+'</td>'+
					td+
				'</tr>'
			);
		});
	}else{
		$(data.getDetailData).each(function(index,value){
			num++;
			td_second='<td>'+value.SUCCESS+'</td>'+'<td>'+value.SUCC_RATE+'</td>';
			if(rightMenu.type == 6) td_second+='<td>'+value.FAIL+'</td>';
			else td_first ='<td>'+value.NE_ID+'</td>'+'<td>'+value.NE_NAME+'</td>';
			
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					td_first+
					'<td>'+value.KPI+'</td>'+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					td_second+
				'</tr>'
			);
		});
	}*/
	
	if(num < 11){
		var tdTag = '';
		tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		//하나로 통일
		/*if(rightMenu.type == 1 && kpi == 2){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else if(rightMenu.type == 4 || rightMenu.type == 5){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else if(rightMenu.type == 6){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else if(rightMenu.type == 7){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else{
			
			tdTag = '<td></td><td></td><td><td></td><td></td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}*/
		
		for(var index = 0; index < 11-num; index++){
			$('#detailGrid').append(
				'<tr>'+
					tdTag+
				'</tr>'
			);
		}
	}
}

function recordCreateTR(data){
	var num = 0;
	var equipType = rightMenu.equipType;
	var ruData='';
	
	$(data.getDetailData).each(function(index,value){
		num++;
		
		$('#detailGrid').append(
			'<tr>'+
				'<td>'+value.EVENT_TIME+'</td>'+
				'<td>'+value.SYSTEM_ID+'</td>'+
				'<td>'+value.SYSTEM_NAME+'</td>'+
				'<td>'+value.ATTEMPT+'</td>'+
				'<td>'+value.SUCCESS+'</td>'+
				'<td>'+value.ATT_RATE+'</td>'+
				'<td>'+value.SUCC_RATE+'</td>'+
			'</tr>'
		);
	});
	
	if(num < 11){
		for(var index = 0; index < 11-num; index++){
			$('#detailGrid').append(
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'
			);
		}
	}
}

function getPopAnalysisData(){
	
	var getDataUrl = '';
	var equipList = $('#equipListVal').val();
	var equiptext = $('#equipSelect option:selected').text();
	 
	if(rightMenu.pageType == 3){
		getDataUrl = '/pm/access/analysis/access_analysis/getPopAccessAnalysisData';
	}else if(rightMenu.pageType == 6){
		getDataUrl = '/pm/record/analysis/record_analysis/getPopRecordAnalysisData';
	}else{
		getDataUrl = '/pm/epc/analysis/epc_analysis/getPopEpcAnalysisData';
	}
	
	var startDateTimeText = $('#startDetailDate').val()+" "+$('#startDetailHourSelect option:selected').val()+":"+$('#startDetailMinSelect option:selected').val();
	var endDateTimeText = $('#endDetailDate').val()+" "+$('#endDetailHourSelect option:selected').val()+":"+$('#endDetailMinSelect option:selected').val();
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 12){
		alert('최대 12시간 조회만 가능합니다.');
		return false;
	}
	
	if(changeFlag){
		$.each($('#detailTable thead tr th'),function(i,val){
			$(val).attr('class','updown');
			popSortFunction.sortInfo = [];
			popSortFunction.beforeColNms = [];
		});
		
		changeFlag = false;
	}
	
	var requestData = {
			equiptext : equiptext,
			equipList : equipList,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			flag : rightMenu.type,
			kpi : $('#_detailKpiSelect option:selected').val(),
			sortOption : popSortFunction.sortInfo
	}
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url : getDataUrl,
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			$('#detailGrid').empty();
			
			var classNames = {};
			$.each($('#detailTable thead tr th'),function(i,val){
				classNames[val.id] = $(val).attr('class');
			});
			
			if(rightMenu.pageType == 3){
				
				if(rightMenu.type == 2){
					$('#detailHeaderTr').empty();
					
					var td = '';
					
					if($('#_detailKpiSelect option:selected').val() == 1){
						if(classNames.UP_VOLUMN == 'undefined' || classNames.UP_VOLUMN == '' || classNames.UP_VOLUMN == null){
							td = '<th class="updown" id="UP_VOLUMN">Volume(KByte)</th>'+
							'<th class="updown" id="UP_VOLUMN_STD">기준 Volume(KByte)</th>'+
							'<th class="updown" id="UP_VOLUMN_RATE">Volume 증감율(%)</th>'+
							'<th class="updown" id="UP_DTP">Throughput(KBps)</th>'+
							'<th class="updown" id="UP_DTP_STD">기준 Throughput(KBps)</th>'+
							'<th class="updown" id="UP_DTP_RATE">Throughput 증감율(%)</th>';
						}else{
							td = '<th class="'+classNames.UP_VOLUMN+'" id="UP_VOLUMN">Volume(KByte)</th>'+
							'<th class="'+classNames.UP_VOLUMN_STD+'" id="UP_VOLUMN_STD">기준 Volume(KByte)</th>'+
							'<th class="'+classNames.UP_VOLUMN_RATE+'" id="UP_VOLUMN_RATE">Volume 증감율(%)</th>'+
							'<th class="'+classNames.UP_DTP+'" id="UP_DTP">Throughput(KBps)</th>'+
							'<th class="'+classNames.UP_DTP_STD+'" id="UP_DTP_STD">기준 Throughput(KBps)</th>'+
							'<th class="'+classNames.UP_DTP_RATE+'" id="UP_DTP_RATE">Throughput 증감율(%)</th>';
						}
					}else{
						if(classNames.DW_VOLUMN == 'undefined' || classNames.DW_VOLUMN == '' || classNames.DW_VOLUMN == null){
							td = '<th class="updown" id="DW_VOLUMN">Volume(KByte)</th>'+
								'<th class="updown" id="DW_VOLUMN_STD">기준 Volume(KByte)</th>'+
								'<th class="updown" id="DW_VOLUMN_RATE">Volume 증감율(%)</th>'+
								'<th class="updown" id="DW_DTP">Throughput(KBps)</th>'+
								'<th class="updown" id="DW_DTP_STD">기준 Throughput(KBps)</th>'+
								'<th class="updown" id="DW_DTP_RATE">Throughput 증감율(%)</th>';
						}else{
							td = '<th class="'+classNames.DW_VOLUMN+'" id="DW_VOLUMN">Volume(KByte)</th>'+
								'<th class="'+classNames.DW_VOLUMN_STD+'" id="DW_VOLUMN_STD">기준 Volume(KByte)</th>'+
								'<th class="'+classNames.DW_VOLUMN_RATE+'" id="DW_VOLUMN_RATE">Volume 증감율(%)</th>'+
								'<th class="'+classNames.DW_DTP+'" id="DW_DTP">Throughput(KBps)</th>'+
								'<th class="'+classNames.DW_DTP_STD+'" id="DW_DTP_STD">기준 Throughput(KBps)</th>'+
								'<th class="'+classNames.DW_DTP_RATE+'" id="DW_DTP_RATE">Throughput 증감율(%)</th>';
						}
					}
					
					$('#detailHeaderTr').append(
						'<th class="'+classNames.EVENT_TIME+'" id="EVENT_TIME">시간</th>'+
						'<th class="'+classNames.DU_ID+'" id="DU_ID">장비 ID</th>'+
						'<th class="'+classNames.DU_NAME+'" id="DU_NAME">기지국</th>'+
						td
//						'<th class="'+classNames.TIME+'" id="TIME">TIME(분)</th>'
					);
					$('#detailTable thead tr th').on('click',function(e){
						if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
							popSortFunction.dataSort(this,e.ctrlKey);
					});
				}
				
				analAccessCreateTR(data);
			}else if(rightMenu.pageType == 6){
				recordCreateTR(data);
			}else{
				if(rightMenu.type == 1 && $('#_detailKpiSelect option:selected').val() == 2){
					$('#detailHeaderTr').empty();
					$('#detailHeaderTr').append(
							'<th class="'+classNames.EVENT_TIME+'" id="EVENT_TIME">시간</th>' +
							'<th class="'+classNames.NE_ID+'" id="NE_ID">장비 ID</th>' +
							'<th class="'+classNames.NE_NAME+'" id="NE_NAME">장비 명</th>' +
							'<th class="'+classNames.ATTEMPT+'" id="ATTEMPT">시도호</th>' +
							'<th class="'+classNames.STD_ATT+'" id="STD_ATT">기준 시도호</th>' +
							'<th class="'+classNames.ATT_RATE+'" id="ATT_RATE">시도호 증감율</th>'
					);
					$('#detailTable thead tr th').on('click',function(e){
						if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
							popSortFunction.dataSort(this,e.ctrlKey);
					});
					
				}else if(rightMenu.type == 1 && $('#_detailKpiSelect option:selected').val() != 2){
					$('#detailHeaderTr').empty();
					var td = '';
					
					/*if(classNames.ANSWER == 'undefined' || classNames.ANSWER == '' || classNames.ANSWER == null){
						td = '<th class="updown" id="ANSWER">접속호</th>' +
						'<th class="updown" id="ANS_RATE">접속율</th>';
					}else{
						td = '<th class="'+classNames.ANSWER+'" id="ANSWER">접속호</th>' +
						'<th class="'+classNames.ANS_RATE+'" id="ANS_RATE">접속율</th>';
					}*/
					
					$('#detailHeaderTr').append(
							'<th class="'+classNames.EVENT_TIME+'" id="EVENT_TIME">시간</th>' +
							'<th class="'+classNames.NE_ID+'" id="NE_ID">장비 ID</th>' +
							'<th class="'+classNames.NE_NAME+'" id="NE_NAME">장비 명</th>' +
							'<th class="'+classNames.ATTEMPT+'" id="ATTEMPT">시도호</th>' +
							'<th class="'+classNames.STD_ATT+'" id="STD_ATT">기준 시도호</th>' +
							'<th class="'+classNames.ATT_RATE+'" id="ATT_RATE">시도호 증감율</th>' +
							td+
							'<th class="'+classNames.SUCCESS+'" id="SUCCESS">성공호</th>' +
							'<th class="'+classNames.SUCC_RATE+'" id="SUCC_RATE">성공율</th>'
					);
					$('#detailTable thead tr th').on('click',function(e){
						if($(this).hasClass("updown") || $(this).hasClass("up") || $(this).hasClass("down"))
							popSortFunction.dataSort(this,e.ctrlKey);
					});
				}
				analEpcCreateTR(data);
			}
			
			if($('#popDetailFirstView').val() == 1){
				var height = (screen.height - $('#popDetailWindow').height()-100)/2
				var width = (screen.width - $('#popDetailWindow').width())/2
				$('#popDetailWindow').css('left',width+'px');
				$('#popDetailWindow').css('top',height+'px');
				
				$('#popDetailFirstView').val(0);
			}
		},
		error:function(data){
			
		}
	});
}

//주제어장치 KPI 분석
function analEpcCreateTR(data){
	var num = 0;
	var kpi = $('#_detailKpiSelect option:selected').val();
	var td_second = '';
	var td_first = '';
	
	if(rightMenu.type == 1){
		$(data.getDetailData).each(function(index,value){
			num++;
			if(kpi!=2) td='';
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.NE_ID+'</td>'+
					'<td>'+value.NE_NAME+'</td>'+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					'<td>'+value.SUCCESS+'</td>'+
					'<td>'+value.SUCC_RATE+'</td>'+
					td+
				'</tr>'
			);
		});
	}else{
		$(data.getDetailData).each(function(index,value){
			num++;
			td_second='<td>'+value.SUCCESS+'</td>'+'<td>'+value.SUCC_RATE+'</td>';
			td_first ='<td>'+value.NE_ID+'</td>'+'<td>'+value.NE_NAME+'</td>';
			
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					td_first+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					td_second+
				'</tr>'
			);
		});
	}
	
	if(num < 11){
		var tdTag = '';

		if(rightMenu.type == 1 && kpi == 2){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else if(rightMenu.type == 4 || rightMenu.type == 5){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else if(rightMenu.type == 6){
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
		}else if(rightMenu.type == 7){
			
			tdTag = '<td></td><td></td><td><td></td><td></td></td><td></td><td></td><td></td>';
		}else{
			
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>>';
		}
		
		for(var index = 0; index < 11-num; index++){
			$('#detailGrid').append(
				'<tr>'+
					tdTag+
				'</tr>'
			);
		}
	}
}


// 기지국 KPI 분석
function analAccessCreateTR(data){

	var num = 0;
	
	if(rightMenu.type == 1){
		
		$(data.getDetailData).each(function(index,value){
			num++;
			
			if(rightMenu.pageType == 3){
				$('#detailGrid').append(
						'<tr>'+
							'<td>'+value.EVENT_TIME+'</td>'+
							'<td>'+value.DU_ID+'</td>'+
							'<td>'+value.DU_NAME+'</td>'+
							'<td>'+value.ATTEMPT+'</td>'+
							'<td>'+value.STD_ATT+'</td>'+
							'<td>'+value.ATT_RATE+'</td>'+
							'<td>'+value.STD_ERAB+'</td>'+
							'<td>'+value.ERAB_ATT_RATE+'</td>'+
							'<td>'+value.RRC+'</td>'+
							'<td>'+value.RRC_RATE+'</td>'+
							'<td>'+value.ERAB_ATTEMPT+'</td>'+
							'<td>'+value.ANSWER+'</td>'+
							'<td>'+value.ANSWER_RATE+'</td>'+
							'<td>'+value.ERAB_ADD_SUCCESS+'</td>'+
							'<td>'+value.CD+'</td>'+
							'<td>'+value.CD_RATE+'</td>'+
						'</tr>'
				);
			}else{
				$('#detailGrid').append(
						'<tr>'+
						'<td>'+value.EVENT_TIME+'</td>'+
						'<td>'+value.DU_ID+'</td>'+
						'<td>'+value.DU_NAME+'</td>'+
						'<td>'+value.ATTEMPT+'</td>'+
						'<td>'+value.STD_ATT+'</td>'+
						'<td>'+value.ATT_RATE+'</td>'+
						'<td>'+value.RRC+'</td>'+
						'<td>'+value.RRC_RATE+'</td>'+
						'<td>'+value.ANSWER+'</td>'+
						'<td>'+value.ANSWER_RATE+'</td>'+
						'<td>'+value.CD+'</td>'+
						'<td>'+value.CD_RATE+'</td>'+
						'</tr>'
				);
			}
			
		});
	}else if(rightMenu.type == 2) {
		$(data.getDetailData).each(function(index,value){
			num++;
			
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.DU_ID+'</td>'+
					'<td>'+value.DU_NAME+'</td>'+
					'<td>'+value.VOLUMN+'</td>'+
					'<td>'+value.VOLUMN_STD+'</td>'+
					'<td>'+value.VOLUMN_RATE+'</td>'+
					'<td>'+value.DTP+'</td>'+
					'<td>'+value.DTP_STD+'</td>'+
					'<td>'+value.DTP_RATE+'</td>'+
//					'<td>'+(Number(value.TIME)/60)+'</td>'+
				'</tr>'
			);
		});
	} else {
		$(data.getDetailData).each(function(index,value){
			num++;
			
			$('#detailGrid').append(
				'<tr>'+
					'<td>'+value.EVENT_TIME+'</td>'+
					'<td>'+value.DU_ID+'</td>'+
					'<td>'+value.DU_NAME+'</td>'+
					'<td>'+value.STATISTICS_TYPE+'</td>'+
					'<td>'+value.ATTEMPT+'</td>'+
					'<td>'+value.STD_ATT+'</td>'+
					'<td>'+value.ATT_RATE+'</td>'+
					'<td>'+value.SUCCESS+'</td>'+
					'<td>'+value.SUCC_RATE+'</td>'+
				'</tr>'
			);
		});
	}
	
	if(num < 11){
		var tdTag = '';
		if(rightMenu.type == 1){			// KPI
			tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td>';
			if(rightMenu.pageType == 3){
				tdTag = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
			}
		}else if(rightMenu.type == 2){		// DTP
			tdTag = '<td></td><td></td><td></td>';
		}else if(rightMenu.type == 3){		// HandOver
			tdTag = '<td></td><td></td><td></td>';
		}
		
		for(var index = 0; index < 11-num; index++){
			$('#detailGrid').append(
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					tdTag+
				'</tr>'
			);
		}
	}
}


var popSortFunction = {
	sortInfo : [],
	beforeColNms : [],
	dataSort : function(obj, ctrlKey) {
		if (ctrlKey) {
			var index = 9999;
			var sortOption = {};

			if ((jQuery.inArray(obj.id,popSortFunction.beforeColNms) != -1))
				index = popSortFunction.beforeColNms.indexOf(obj.id);

			if ($(obj).hasClass('updown')) {
				$(obj).removeClass('updown');
				$(obj).addClass('up');

				if (index == 9999) {
					sortOption['colName'] = obj.id;
					sortOption['order'] = 'ASC';
				} else {
					sortOption = popSortFunction.sortInfo[index];
					sortOption['order'] = 'ASC';
				}

			} else if ($(obj).hasClass('up')) {
				$(obj).removeClass('up');
				$(obj).addClass('down');

				if (index == 9999) {
					sortOption['colName'] = obj.id;
					sortOption['order'] = 'DESC';
				} else {
					sortOption = popSortFunction.sortInfo[index];
					sortOption['order'] = 'DESC';
				}

			} else {
				$(obj).removeClass('down');
				$(obj).addClass('up');

				if (index == 9999) {
					sortOption['colName'] = obj.id;
					sortOption['order'] = 'ASC';
				} else {
					sortOption = popSortFunction.sortInfo[index];
					sortOption['order'] = 'ASC';
				}

			}

			if (index == 9999)
				popSortFunction.sortInfo.push(sortOption);
			
		} else {

			popSortFunction.sortInfo = [];
			popSortFunction.beforeColNms = [];

			var classNm = '';
			var sortOption = {};

			if ($(obj).hasClass('updown')) {
				$(obj).removeClass('updown');

				classNm = 'up';
				sortOption['colName'] = obj.id;
				sortOption['order'] = 'ASC';

			} else if ($(obj).hasClass('up')) {
				$(obj).removeClass('up');

				classNm = 'down';
				sortOption['colName'] = obj.id;
				sortOption['order'] = 'DESC';

			} else {
				$(obj).removeClass('down');

				classNm = 'up';
				sortOption['colName'] = obj.id;
				sortOption['order'] = 'ASC';

			}

			$('#detailTable thead tr th').removeClass('updown');
			$('#detailTable thead tr th').removeClass('up');
			$('#detailTable thead tr th').removeClass('down');
			$('#detailTable thead tr th').addClass('updown');

			$(obj).removeClass('updown');
			$(obj).addClass(classNm);

			popSortFunction.sortInfo.push(sortOption);
		}

		if ((jQuery.inArray(obj.id,popSortFunction.beforeColNms) == -1))
			popSortFunction.beforeColNms.push(obj.id);
		
		if(rightMenu.pageType == 1 || rightMenu.pageType == 2 || rightMenu.pageType == 5){
			getPopDetailData();
		}else if(rightMenu.pageType == 3 || rightMenu.pageType == 4){
			getPopAnalysisData();
		}
	}
};