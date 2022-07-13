$(document).ready(function(){
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		getAccessTrendData(true);
	});
	
	$('#kpiSelect').change(function(){
		var kpival = $('#kpiSelect option:selected').val();
		if(kpival == 1){
			$('#detailSpan').css('display','none');
		}else if(kpival == 2){
			setKpiSelect(98,'detailKpiSelect','detailKpiDiv',1, '');
			$('#detailSpan').css('display','');
		} else {
			setKpiSelect(99,'detailKpiSelect','detailKpiDiv',1, '');
			$('#detailSpan').css('display','');
		}
	});
	
	$('#start-date').datepicker({
		dateFormat: 'yy-mm-dd',
		onClose: function( selectedDate ) {
	        $( "#end-date" ).datepicker( "option", "minDate", selectedDate );
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
	
	$('#end-date').datepicker({
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
	
	$('#start-date-btn').on('click',function(e){
		$('#start-date').datepicker("show");
	});
	
	
	$('#end-date-btn').on('click',function(e){
		$('#end-date').datepicker("show");
	});
	
	$(window).click(function(e) {
		if($('#popMenu').css('display') == 'block'){
			$('#popMenu').css('display','none');
		}
	});
	$('#equipSelectClose, #equipSelectCancle,#equipSelectBg').on('click',function(e){
		$('#equipSelectBg').fadeOut();
		$('#equipSelectUp').fadeOut();
	});
	//equipSelect Drag 지정 정의
	$( "#equipSelectUp" ).draggable({'handle' : '#equipSelectTitleBox'});
	$( "#equipSelectUp" ).resizable({
		animate: true
	});
	
	stationAjax();
	$.when(lineAjax).done(function(lineData) {
		setLineSelectBox()
	})
	
	//엔터키 검색 허용
	$('#equip_search').keyup(function(e){
		if ( e.keyCode == 13 ) {
			getEquipList();
		}
	});
	
});

//kpiVal : 1 - KPI , kpiVal : 2 - Data Throughput, kpiVal : 3 - Hand Over
function changekpi(){
	var
		kpival = $('#kpiSelect').find('option:selected').val(),
		$headerTr = $('#headerTr'),
		$headerColgroup = $('#headerGroup');

	$headerTr.empty();
	$headerColgroup.empty();

	if(kpival == 1){

		$headerTr.append(
			"<th title='NO'>No</th>" +
			"<th class='updown sort' id='EVENT_TIME' title='시간'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
			"<th class='updown sort' id='ATTEMPT' title='RRC 시도호'><input type='hidden' value='ALL_DATA.ATTEMPT' />RRC 시도호</th>" +
			"<th class='updown sort' id='STD_ATT' title='RRC 기준 시도호'><input type='hidden' value='ALL_DATA.STD_ATT' />RRC 기준 시도호</th>" +
			"<th class='updown sort' id='ATT_RATE' title='RRC 시도호 증감율(%)'><input type='hidden' value='ALL_DATA.ATT_RATE' />RRC 시도호 증감율(%)</th>" +
			"<th class='updown sort' id='ERAB_ATTEMPT' title='ERAB Setup 시도호'><input type='hidden' value='ALL_DATA.ERAB_ATTEMPT' />ERAB Setup 시도호</th>" +
			"<th class='updown sort' id='STD_ERAB' title='ERAB Setup 기준 시도호'><input type='hidden' value='ALL_DATA.STD_ATT' />ERAB Setup 기준 시도호</th>" +
			"<th class='updown sort' id='ERAB_ATT_RATE' title='ERAB Setup 시도호 증감율(%)'><input type='hidden' value='ALL_DATA.ATT_RATE' />ERAB Setup 시도호 증감율(%)</th>" +
			"<th class='updown sort' id='RRC' title='소통호(RRC 성공호)'><input type='hidden' value='ALL_DATA.RRC' />소통호(RRC 성공호)</th>" +
			"<th class='updown sort' id='RRC_RATE' title='소통율(RRC 성공율)(%)'><input type='hidden' value='ALL_DATA.RRC_RATE' />소통율(RRC 성공율)(%)</th>" +
			"<th class='updown sort' id='ANSWER' title='완료호(ERAB Setup 성공호)'><input type='hidden' value='ALL_DATA.ANSWER' />완료호(ERAB Setup 성공호)</th>" +
			"<th class='updown sort' id='ANSWER_RATE' title='완료율(ERAB Setup 성공율)(%)'><input type='hidden' value='ALL_DATA.ANSWER_RATE' />완료율(ERAB Setup 성공율)(%)</th>" +
			"<th class='updown sort' id='ERAB_ADD_SUCCESS' title='ERAB Setup Add 성공호'><input type='hidden' value='ALL_DATA.ERAB_ADD_SUCCESS' />ERAB Setup Add 성공호</th>" +
			"<th class='updown sort' id='CD' title='절단호'><input type='hidden' value='ALL_DATA.CD' />절단호</th>" +
			"<th class='updown sort' id='CD_RATE' title='절단율(%)'><input type='hidden' value='ALL_DATA.CD_RATE' />절단율(%)</th>"
		);
		$headerColgroup.append(
			'<col width="4%">'+
			'<col width="10%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'+
			'<col width="8%">'
		);
		
	} else if(kpival == 2){
		var
			detailKpiVal = $('#detailKpiSelect option:selected').val();
			volumn = '';
			volumnStd = '';
			volumnRate = '';
			dtp = '';
			dtpStd = '';
			dtpRate = '';
			
		if(detailKpiVal === '1') {
			volumn = 'ALL_DATA.UP_VOLUMN';
			volumnStd = 'ALL_DATA.UP_VOLUMN_STD';
			volumnRate = 'ALL_DATA.UP_VOLUMN_RATE';
			dtp = 'ALL_DATA.UP_DTP';
			dtpStd = 'ALL_DATA.UP_DTP_STD';
			dtpRate = 'ALL_DATA.UP_DTP_RATE';
		} else if(detailKpiVal === '2') {
			volumn = 'ALL_DATA.DW_VOLUMN';
			volumnStd = 'ALL_DATA.DW_VOLUMN_STD';
			volumnRate = 'ALL_DATA.DW_VOLUMN_RATE';
			dtp = 'ALL_DATA.DW_DTP';
			dtpStd = 'ALL_DATA.DW_DTP_STD';
			dtpRate = 'ALL_DATA.DW_DTP_RATE';
		}

		$headerTr.append(
				"<th title='NO'>No</th>" +
				"<th class='updown sort' id='EVENT_TIME'  title='시간'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				
				"<th class='updown sort' id='VOLUMN'  title='Volume(KByte)'><input type='hidden' value='" + volumn + "' />Volume(KByte)</th>" +
				"<th class='updown sort' id='VOLUMN_STD' title='기준 Volume(KByte)'><input type='hidden' value='" + volumnStd + "'/>기준 Volume(KByte)</th>" +
				"<th class='updown sort' id='VOLUMN_RATE' title='Volume 증감율(%)'><input type='hidden' value='" + volumnRate + "'/>Volume 증감율(%)</th>" +
				
				"<th class='updown sort' id='DTP'  title='Throughput(KBps)'><input type='hidden' value='" + dtp + "' />Throughput(KBps)</th>" +
				"<th class='updown sort' id='DTP_STD'  title='기준 Throughput(KBps)'><input type='hidden' value='" + dtpStd + "' />기준 Throughput(KBps)</th>" +
				"<th class='updown sort' id='DTP_RATE'  title='Throughput 증감율(%)'><input type='hidden' value='" + dtpRate + "' />Throughput 증감율(%)</th>" 
		);

		$headerColgroup.append(
				"<col width='10%'>"+
				"<col width='13%'>"+
				
				"<col width='13%'>"+
				"<col width='13%'>"+
				"<col width='13%'>"+
				
				"<col width='13%'>"+
				"<col width='13%'>"+
				"<col width='13%'>"
		);
		
	} else {
		$headerTr.append(
				"<th title='NO'>No</th>" +
				"<th class='updown sort' id='EVENT_TIME' title='시간'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				"<th class='updown sort' id='ATTEMPT' title='시도호'><input type='hidden' value='ALL_DATA.ATTEMPT' />시도호</th>" +
				"<th class='updown sort' id='STD_ATT' title='기준 시도호'><input type='hidden' value='ALL_DATA.STD_ATT' />기준 시도호</th>" +
				"<th class='updown sort' id='ATT_RATE' title='시도호 증감율(%)'><input type='hidden' value='ALL_DATA.ATT_RATE' />시도호 증감율(%)</th>" +
				"<th class='updown sort' id='SUCCESS' title='성공호'><input type='hidden' value='ALL_DATA.SUCCESS' />성공호</th>" +
				"<th class='updown sort' id='SUCC_RATE' title='성공율(%)'><input type='hidden' value='ALL_DATA.SUCC_RATE' />성공율(%)</th>" 
		);

		$headerColgroup.append(
				"<col width='9%'>"+
				"<col width='auto'>"+
				"<col width='14.3%'>"+
				"<col width='14.3%'>"+
				"<col width='14.3%'>"+
				"<col width='14.3%'>"+
				"<col width='14.3%'>"
		);
	}
}

function getAccessTrendData(flag){
	
	var startDateTimeText = $('#start-date').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#start-min').val();
	var endDateTimeText = $('#end-date').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#end-min').val();
	var detailKpiSelect = '';
	
	var kpival = $('#kpiSelect option:selected').val();
	if(kpival == 2 || kpival == 3){
		detailKpiSelect = $('#detailKpiSelect option:selected').val();
	}
	var equipList = $('#equipListVal').val();
	
	if(equipList == ''){
		alert('장비 선택 후 조회가 가능합니다.');
		return false;
	}
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	var dateDiff = Math.ceil((new Date(endDateTimeText).getTime()-new Date(startDateTimeText).getTime())/(1000*3600*24));

	if(dateDiff < 1){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if(dateDiff > 6){
		alert('최대 7일 조회만 가능합니다.');
		return false;
	}

	//새로이 검색할 경우 소팅 옵션을 초기화
	if(!flag) {
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
	}
	
	var requestData = {
			kpival : kpival,
			equipList : equipList,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			detailKpi : detailKpiSelect,
			sortOption : columnSorting.sortInfo
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/access/analysis/access_analysis/getAccessTrendData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			var
				$headerTr = $('#headerTr'),
				$bodyGroup = $('#bodyGroup');


			if(flag) {
				var classNames = {};
				$.each($headerTr.find('.sort'), function (i, val) {
					classNames[val.id] = $(val).attr('class');
				});
			}

			$bodyGroup.empty();
			if(kpival == 1) {
				$bodyGroup.append(
						'<col width="4%">'+
						'<col width="10%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'+
						'<col width="8%">'
				);
				changekpi();
				createKpiTd(data.getTrendData.gridData);
				if(!flag){
					createChart(data.getTrendData);
				}
			} else if(kpival == 2) {
				$bodyGroup.append(
						"<col width='10%'>"+
						"<col width='13%'>"+
						
						"<col width='13%'>"+
						"<col width='13%'>"+
						"<col width='13%'>"+
						
						"<col width='13%'>"+
						"<col width='13%'>"+
						"<col width='13%'>"
				);
				changekpi();
				createDtpTd(data.getTrendData.gridData);
				if(!flag){
					createChart(data.getTrendData);
				}
			} else {
				$bodyGroup.append(
						"<col width='9%'>"+
						"<col width='auto'>"+
						"<col width='14.3%'>"+
						"<col width='14.3%'>"+
						"<col width='14.3%'>"+
						"<col width='14.3%'>"+
						"<col width='14.3%'>"
				);
				changekpi();
				createHandTd(data.getTrendData.gridData);
				if(!flag){
					createChart(data.getTrendData);
				}
			}

			if(flag) {
				var keys = Object.keys(classNames);
				keys.map(function (v, i) {
					document.querySelector('#' + v).className = classNames[v];
				});
			}
		},
		error:function(data){
			
		}
	});
}

function createKpiTd(data){
	$('#dataGrid').empty();
	var number = 0;
	$(data).each(function(key,value){
		number++;
		$('#dataGrid').append(
			'<tr onmousedown="javascript:rightMenu.rightClick(event,this,1)">'+
			'<td>'+number+'</td>'+
			'<td>'+value.EVENT_TIME+'</td>'+
			'<td>'+value.ATTEMPT+'</td>'+
			'<td>'+value.STD_ATT+'</td>'+
			'<td>'+value.ATT_RATE+'</td>'+
			'<td>'+value.ERAB_ATTEMPT+'</td>'+
			'<td>'+value.STD_ERAB+'</td>'+
			'<td>'+value.ERAB_ATT_RATE+'</td>'+
			'<td>'+value.RRC+'</td>'+
			'<td>'+value.RRC_RATE+'</td>'+
			'<td>'+value.ANSWER+'</td>'+
			'<td>'+value.ANSWER_RATE+'</td>'+
			'<td>'+value.ERAB_ADD_SUCCESS+'</td>'+
			'<td>'+value.CD+'</td>'+
			'<td>'+value.CD_RATE+'</td>'+
			'</tr>'
		);
	})
	
	if(number < 9){
    	var loopCnt = 9 - number;
    	for(var i=0; i<loopCnt; i++){
    		$('#dataGrid').append(
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

function createDtpTd(data){
	$('#dataGrid').empty();
	var number = 0;
	var up_down = $('#detailKpiSelect option:selected').val()=='1'?'UP':'DW';
	$(data).each(function(key,value){
		number++;
		$('#dataGrid').append(
			'<tr onmousedown="javascript:rightMenu.rightClick(event,this,2)">'+
			'<td>'+number+'</td>'+
			'<td>'+value.EVENT_TIME+'</td>'+
			'<td>'+value[up_down+'_VOLUMN']+'</td>'+
			'<td>'+value[up_down+'_VOLUMN_STD']+'</td>'+
			'<td>'+value[up_down+'_VOLUMN_RATE']+'</td>'+
			'<td>'+value[up_down+'_DTP']+'</td>'+
			'<td>'+value[up_down+'_DTP_STD']+'</td>'+
			'<td>'+value[up_down+'_DTP_RATE']+'</td>'+
			'</tr>'
		);
	})
	
	if(number < 9){
    	var loopCnt = 9 - number;
    	for(var i=0; i<loopCnt; i++){
    		$('#dataGrid').append(
    				'<tr>'+
    				'<td></td>'+
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

function createHandTd(data) {
	$('#dataGrid').empty();
	var number = 0;
	$(data).each(function(key,value){
		number++;
		$('#dataGrid').append(
			'<tr onmousedown="javascript:rightMenu.rightClick(event,this,3)">'+
			'<td>'+number+'</td>'+
			'<td>'+value.EVENT_TIME+'</td>'+
			'<td>'+value.ATTEMPT+'</td>'+
			'<td>'+value.STD_ATT+'</td>'+
			'<td>'+value.ATT_RATE+'</td>'+
			'<td>'+value.SUCCESS+'</td>'+
			'<td>'+value.SUCC_RATE+'</td>'+
			'</tr>'
		);
	})
	
	if(number < 9){
    	var loopCnt = 9 - number;
    	for(var i=0; i<loopCnt; i++){
    		$('#dataGrid').append(
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

function createChart(data){
	var tempTimelist = data.timeList
	var dataList = [];
	var dataList2 = [];		// Data Threoughput일때 두번째 차트용 데이터를 넣기 위함
	var yAxis = [];
	var yAxis2 = [];		// Data Threoughput일때 두번째 차트용
	var timelist = [];
	var legend = {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        };
	// Data Threoughput일때
	var $chartWrap = $('#chartDivWrap')
	var $chart2Wrap = $('#chartDiv2Wrap');
	if($('#kpiSelect option:selected').val() == 2){
		$chart2Wrap.show();
		$chart2Wrap.css({"display": "inline-block", "width":"922.5px", "margin-left": "10px"});
		$chartWrap.css({"display": "inline-block", "width":"922.5px"});
	}else{
		$chart2Wrap.hide();
		$chartWrap.css({"display": "", "width":"100%"});
	}
	
	$.each(tempTimelist, function(i, v) {
		timelist.push(stringToTimestamp(v));
	});

	var ticInterval = 1;
    var maxCnt = 20;
	var timeCount = timelist.length;
    if(timeCount > maxCnt) {
    	ticInterval = Math.ceil(timeCount / maxCnt);
    }
    
	$(data.trendData).each(function(key,value){
		var datalist = [];
		$(value.data).each(function(key,value){
			if(typeof value != 'number'){
				value = value.replace(/,/gi,'');
			}
			datalist.push(Number(value));
		});
		
		var tData = {
			name:value.name,
			type:value.type,
			data:datalist,
			yAxis : Number(value.yAxis),
			zIndex : Number(value.zIndex),
			tooltip:{
				valueSuffix:value.suffix
			}
		};
		if(value.stack != null){
			tData.stack = value.stack;
		}
		
		if($('#kpiSelect option:selected').val() == 2){	// Data Threoughput일때
			if(value.Column.match('VOLUMN')){	// VOLUMN 관련이면  dataList
    			dataList.push(tData);
    		}else{	// DTP관련이면 dataList2
    			dataList2.push(tData);
    		}
		}else{
			dataList.push(tData);
		}
	});
    
	dataList.sort(function(a,b){
		return  b.zIndex - a.zIndex;
	});
	
	dataList2.sort(function(a,b){
		return  b.zIndex - a.zIndex;
	});
	
	// 1 : KPI | 2 : Data Throughput | 3 : Hand Over
	if($('#kpiSelect option:selected').val() == 1 || $('#kpiSelect option:selected').val() == 3){
		yAxis = [{
			    	labels:{
			    		format : '{value}%'
			    	},
			        title: {
			            text: '%'
			        },
			        plotLines: [{
			            value: 0,
			            width: 1,
			            color: '#808080'
			        }],
			        opposite: true
			    },
			    {
			    	labels:{
			    		format : '{value}호(건)'
			    	},
			        title: {
			            text: '호(건)'
			        },
			        plotLines: [{
			            value: 0,
			            width: 1,
			            color: '#808080'
			        }],
			        min : 0
			    }
			];
	}else {
		yAxis = [{
	    	labels:{
	    		format : '{value}'
	    	},
	        title: {
	            text: '%'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },{
		    	labels:{
		    		format : '{value}'
		    	},
		        title: {
		            text: 'KByte'
		        },
		        plotLines: [{
		            value: 0,
		            width: 1,
		            color: '#808080'
		        }],
		        opposite: true,
		        min : 0
		    }
		];
		
		yAxis2 = [{
	    	labels:{
	    		format : '{value}'
	    	},
	        title: {
	            text: '%'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },{
		    	labels:{
		    		format : '{value}'
		    	},
		        title: {
		            text: 'KBps'
		        },
		        plotLines: [{
		            value: 0,
		            width: 1,
		            color: '#808080'
		        }],
		        opposite: true,
		        min : 0
		    }
		];
		
		legend = {
			align: 'center',
			verticalAlign: 'top',
			x: 0,
			y: 0
        };
	}
	
	$('#chartDiv').highcharts({
		chart:{
			marginBottom : 60,
			zoomType: 'x',
			events : {
				selection : function(event) {
					if (event.resetSelection) {
						try {
							setTimeout(function() {
								$('#chartDiv').highcharts().xAxis[0].update({
									tickInterval : ticInterval
								});
							}, 0);
						} catch (e) {
						}
					} else {
						var _ticInterval = 1;
						var _xCnt = event.xAxis[0].max - event.xAxis[0].min;
						if (_xCnt > maxCnt) {
							_ticInterval = Math.ceil(_xCnt / maxCnt);
						}
						try {
							setTimeout(function() {
								$('#chartDiv').highcharts().xAxis[0].update({
									tickInterval : _ticInterval
								});
							}, 0);
						} catch (e) {
						}
					}
				}
			}
		},
		credits: {
            enabled: false
        },
        title: {
            text: '',
            x: -20 // center
        },
        xAxis: {
        	type: 'datetime',
            categories: timelist,
            tickInterval : ticInterval,
            labels: {
            	formatter: function() {
					return Highcharts.dateFormat('%m-%d %H:%M',this.value);
				},
                y : ($('#kpiSelect option:selected').val() == 2) ? undefined : 35
            }
        },
        yAxis: yAxis,
        tooltip: {
        	shared: true,
        	xDateFormat: '%m-%d %H:%M'
        },
        legend: legend,
        plotOptions:{
            spline: {
                 marker: {
                     enabled: false
                 }
            },
            column: {
                stacking: ($('#kpiSelect option:selected').val() == 1) ? 'normal' : undefined
            }
         },
        series: dataList
    });
	
	if($('#kpiSelect option:selected').val() == 2){	// Data Threoughput일때
		$('#chartDiv2').highcharts({
			chart:{
				marginBottom : 60,
				zoomType: 'x',
				events : {
					selection : function(event) {
						if (event.resetSelection) {
							try {
								setTimeout(function() {
									$('#chartDiv2').highcharts().xAxis[0].update({
										tickInterval : ticInterval
									});
								}, 0);
							} catch (e) {
							}
						} else {
							var _ticInterval = 1;
							var _xCnt = event.xAxis[0].max - event.xAxis[0].min;
							if (_xCnt > maxCnt) {
								_ticInterval = Math.ceil(_xCnt / maxCnt);
							}
							try {
								setTimeout(function() {
									$('#chartDiv2').highcharts().xAxis[0].update({
										tickInterval : _ticInterval
									});
								}, 0);
							} catch (e) {
							}
						}
					}
				}
			},
			credits: {
	            enabled: false
	        },
	        title: {
	            text: '',
	            x: -20 // center
	        },
	        xAxis: {
	        	type: 'datetime',
	            categories: timelist,
	            tickInterval : ticInterval,
	            labels: {
	            	formatter: function() {
						return Highcharts.dateFormat('%m-%d %H:%M',this.value);
					},
	                y : undefined
	            }
	        },
	        yAxis: yAxis2,
	        tooltip: {
	        	shared: true,
	        	xDateFormat: '%m-%d %H:%M'
	        },
	        legend: legend,
	        plotOptions:{
	            spline: {
	                 marker: {
	                     enabled: false
	                 }
	            }
	         },
	        series: dataList2
	    });
	}
}


function equipSelectView(flag,equipFlag,equipType){
	$('#equipSelectBg').show().fadeIn('fast');
	$('#equipSelectUp').show().fadeIn('fast'); 
	
	var height = (screen.height - $('#equipSelectUp').height()-100)/2
	var width = (screen.width - $('#equipSelectUp').width())/2
	
	$('#equipSelectUp').css('left',width+'px');
	$('#equipSelectUp').css('top',height+'px');
	getEquipList()
	
}

function getEquipList(){
	var lineId = $('#selectedLine').val(); 
	var equip_search = $('#equip_search').val();
	var requestData = {flag:"2", equip_type:"2", radio_flag : "0", lineId: lineId, equip_search: equip_search};
	
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
			   
			   var index = 0;
			   $(deSelectList).each(function(key,value){
				   LINE_NAME = getClineName(value.LINE_ID);
				   $('#deSelectEquipGrid').append(
					   '<tr>'+
					   		'<td>'+
						   		'<div class="mu-checkbox">'+
					   				'<input type="checkbox" id="deSelect'+index+'">'+
					   				'<label for="deSelect'+index+'"></label>' +
					   			'</div>'+
					   		'</td>'+
					   		'<td>'+LINE_NAME+'</td>'+
					   		'<td>'+value.SYSTEM_ID+'</td>'+
					   		'<td>'+value.SYSTEM_NAME+'</td>'+
					   '</tr>'
				   );
				   
				   index++;
			   });
			   index = 0;
			   
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
	    $(":checkbox:first", tbl).click(function(){
	        // 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
	        if( $(this).is(":checked") ){
	            $(":checkbox", tbl).prop("checked", true);
	        }
	        else{
	            $(":checkbox", tbl).prop("checked", false);
	        }
	        // 모든 체크박스에 change 이벤트 발생시키기                
	        $(":checkbox", tbl).trigger("change");
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
							,equip_name:$(trElement).children(":eq(3)").text()});
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

function excel_download(){
	
	var startDateTimeText = $('#start-date').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#start-min').val();
	var endDateTimeText = $('#end-date').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#end-min').val();
	var detailKpiSelect = '';
	
	var kpival = $('#kpiSelect option:selected').val();
	if(kpival == 2 || kpival == 3){
		detailKpiSelect = $('#detailKpiSelect option:selected').val();
	}
	var equipList = $('#equipListVal').val();
	
	if(equipList == ''){
		alert('장비 선택 후 엑셀 다운로드가 가능합니다..');
		return false;
	}
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	var url =  "/pm/access/analysis/access_analysis/excelDown?kpival="+kpival+"&equipList="+equipList+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+
				"&detailKpi="+detailKpiSelect;
    $(location).attr('href', url);
}


function stringToTimestamp(yyyyMMddHHmm) {
	var year = parseInt(yyyyMMddHHmm.substring(0,4), 10);
	var month = parseInt(yyyyMMddHHmm.substring(4,6), 10) - 1;
	var day = parseInt(yyyyMMddHHmm.substring(6,8), 10);
	var hour = parseInt(yyyyMMddHHmm.substring(8,10), 10);
	var min = parseInt(yyyyMMddHHmm.substring(10,12), 10);
	return Date.UTC(year, month, day, hour, min, 0);
}

var rightMenu = {
		rightClick : function(event,obj,type){
			
			if(event.button == 2){
				$('#popMenu').css('display','block');
				var updateTime = $(obj).children(":eq(1)").text();
				updateTime = new Date(updateTime);
				rightMenu.stdTime = updateTime;
				rightMenu.obj = obj;
				rightMenu.type = type;
				
				var pos = abspos(event);
				$('#popMenu').css('left',(pos.x+10)+'px');
				$('#popMenu').css('top',(pos.y-90)+'px');
			}
		},
		type : '',
		obj : {},
		stdTime : '',
		pageType : '3'
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}