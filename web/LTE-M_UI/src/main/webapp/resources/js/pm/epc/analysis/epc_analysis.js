var classNames = {};
var equipDetailFlag ="";
$(document).ready(function(){
	$('#headerTr').on('click', '.sort', function(e){
		columnSorting.dataSort(this, e.ctrlKey, '#headerTr');
		getEpcTrendData(true);
	});
	
	$('#equipSelect').change(function(){
		$('#equipListText').val('');
		$('#equipListVal').val('');
		equipDetailFlag=('#equipSelect')
		changeEquip();
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
});

function changeEquip(){
	
	$('#equipSelectSpan').css('display','');
	
	var equiptext = $('#equipSelect option:selected').text();
	$('#kpiSelect').prop('disabled',false);
	if($('#kpiDiv').hasClass("disabled")){
		$('#kpiDiv').removeClass("disabled");
	}
	if(equiptext =='MME'){
		$('#kpiSelect').empty();
//		$('#kpiSelect').append(
//			'<option value=1>Attach</option>'+
//			'<option value=2>SGs</option>'+
//			'<option value=3>SR</option>'
//		);
		$('#kpiSelect').append( 
				'<option value=1>Attach</option>'+
				'<option value=2>SRMO</option>'   +
				'<option value=3>SRMT</option>'
			);
		$('#kpiSelect').change();
		
	}else if(equiptext == 'PGW'){
		$('#kpiSelect').empty();
		$('#kpiSelect').append(
			'<option value=1>Create</option>'+
			'<option value=2>Delete</option>'+
			'<option value=3>Modify</option>'
		);
		$('#kpiSelect').change();
		
	}else if(equiptext == 'SGW'){
		$('#kpiSelect').empty();
		$('#kpiSelect').append(
			'<option value=1>Create</option>'+
			'<option value=2>Delete</option>'+
			'<option value=3>Modify</option>'
		);
		$('#kpiSelect').change();
		
	}else if(equiptext == 'HSS'){
		$('#kpiSelect').empty();
		$('#kpiSelect').append(
			'<option value=1>S6A Interface</option>'+
			'<option value=2>Cx Interface</option>'
		);
		
		/*$('#equipSelectSpan').css('display','none');*/
		
		$('#kpiSelect').change();
		
	}else if(equiptext == 'PCRF'){
		$('#kpiSelect').empty();
		$('#kpiSelect').append(
			'<option value="3">GX</option>'+
			'<option value="4">RX</option>'
		);
		$('#kpiSelect').change();
		
	}
}

function changekpi(flag){
	var kpitext = $('#kpiSelect option:selected').text();
	var equiptext = $('#equipSelect option:selected').text();

	if(flag) {
		$.each($('#headerTr').find('.sort'),function(i,val){
			classNames[val.id] = $(val).attr('class');
		});
	}

	$('#headerGroup').empty();
	$('#bodyGroup').empty();
	
	var colgroup = '';
	
	$('#headerTr').empty();
	if(kpitext == 'SGs'){
		$('#headerTr').append(
				"<th>No</th>" +
				"<th class='updown sort' id='sgs-eventtime'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				"<th class='updown sort' id='sgs-attempt'><input type='hidden' value='ALL_DATA.ATTEMPT' />시도호</th>" +
				"<th class='updown sort' id='sgs-stdatt'><input type='hidden' value='ALL_DATA.STD_ATT' />기준 시도호</th>" +
				"<th class='updown sort' id='sgs-attrate'><input type='hidden' value='ALL_DATA.ATT_RATE' />시도호 증감율(%)</th>" +
				"<th class='updown sort' id='sgs-success'><input type='hidden' value='ALL_DATA.SUCCESS' />접속호</th>" +
				"<th class='updown sort' id='sgs-succrate'><input type='hidden' value='ALL_DATA.SUCC_RATE' />접속율(%)</th>"
		);
		colgroup = '<col width="7%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%">'
	}else if(equiptext == 'HSS'){
		$('#headerTr').append(
				"<th>No</th>" +
				"<th class='updown sort' id='hss-eventtime'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				"<th class='updown sort' id='hss-attempt'><input type='hidden' value='ALL_DATA.ATTEMPT' />시도호</th>" +
				"<th class='updown sort' id='hss-stdatt'><input type='hidden' value='ALL_DATA.STD_ATT' />기준 시도호</th>" +
				"<th class='updown sort' id='hss-attrate'><input type='hidden' value='ALL_DATA.ATT_RATE' />시도호 증감율(%)</th>" +
				"<th class='updown sort' id='hss-success'><input type='hidden' value='ALL_DATA.SUCCESS' />성공호</th>" +
				"<th class='updown sort' id='hss-succrate'><input type='hidden' value='ALL_DATA.SUCC_RATE' />성공율(%)</th>" 
		);
		colgroup = '<col width="7%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%">'
	}else if(equiptext == 'PCRF'){
		$('#headerTr').append(
				"<th>No</th>" +
				"<th class='updown sort' id='pcrf-eventtime'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				"<th class='updown sort' id='pcrf-attempt'><input type='hidden' value='ALL_DATA.ATTEMPT' />시도호</th>" +
				"<th class='updown sort' id='pcrf-stdatt'><input type='hidden' value='ALL_DATA.STD_ATT' />기준 시도호</th>" +
				"<th class='updown sort' id='pcrf-attrate'><input type='hidden' value='ALL_DATA.ATT_RATE' />시도호 증감율(%)</th>" +
				"<th class='updown sort' id='pcrf-success'><input type='hidden' value='ALL_DATA.SUCCESS' />성공호</th>" +
				"<th class='updown sort' id='pcrf-succrate'><input type='hidden' value='ALL_DATA.SUCC_RATE' />성공율(%)</th>"
		);
		colgroup = '<col width="7%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%">'
	}else if(equiptext == 'PGW' || equiptext == 'SGW'){
		$('#headerTr').append(
				"<th>No</th>" +
				"<th class='updown sort' id='gw-eventtime'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				"<th class='updown sort' id='gw-attempt'><input type='hidden' value='ALL_DATA.ATTEMPT' />시도호</th>" +
				"<th class='updown sort' id='gw-stdatt'><input type='hidden' value='ALL_DATA.STD_ATT' />기준 시도호</th>" +
				"<th class='updown sort' id='gw-attrate'><input type='hidden' value='ALL_DATA.ATT_RATE' />시도호 증감율(%)</th>" +
				"<th class='updown sort' id='gw-success'><input type='hidden' value='ALL_DATA.SUCCESS' />성공호</th>" +
				"<th class='updown sort' id='gw-succrate'><input type='hidden' value='ALL_DATA.SUCC_RATE' />성공율(%)</th>"
		);
		colgroup = '<col width="7%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%">'
	}else{
		$('#headerTr').append(
				"<th>No</th>" +
				"<th class='updown sort' id='etc-eventtime'><input type='hidden' value='ALL_DATA.EVENT_TIME' />시간</th>" +
				"<th class='updown sort' id='etc-attempt'><input type='hidden' value='ALL_DATA.ATTEMPT' />시도호</th>" +
				"<th class='updown sort' id='etc-stdatt'><input type='hidden' value='ALL_DATA.STD_ATT' />기준 시도호</th>" +
				"<th class='updown sort' id='etc-attrate'><input type='hidden' value='ALL_DATA.ATT_RATE' />시도호 증감율(%)</th>" +
				"<th class='updown sort' id='etc-success'><input type='hidden' value='ALL_DATA.SUCCESS' />성공호</th>" +
				"<th class='updown sort' id='etc-succrate'><input type='hidden' value='ALL_DATA.SUCC_RATE' />성공율(%)</th>" /*+
				"<th class='updown sort' id='etc-answer'><input type='hidden' value='ALL_DATA.ANSWER' />성공호</th>" +
				"<th class='updown sort' id='etc-ansrate'><input type='hidden' value='ALL_DATA.ANS_RATE' />성공율(%)</th>"*/
		);
		colgroup = '<col width="7%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%"><col width="15.5%">'
	}
	
	$('#headerGroup').append(colgroup);
	$('#bodyGroup').append(colgroup);
}

function getEpcTrendData(flag){
	var kpitext = $('#kpiSelect option:selected').text();
	var equiptext = $('#equipSelect option:selected').text();
	
	var startDateTimeText = $('#start-date').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#startMinSelect option:selected').val();
	var endDateTimeText = $('#end-date').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#endMinSelect option:selected').val();
	var detailKpiSelect = '';
	
	var equipval = $('#equipSelect option:selected').val();
	var kpival = $('#kpiSelect option:selected').val();
	var equipList = $('#equipListVal').val();
	
	if(equipList == ''){
		alert('장비 선택 후 조회가 가능합니다.');
		return false;
	}
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 < 0){
		alert('조회 범위가 잘못되었습니다.');
		return false;
	}else if((new Date(endDateTimeText).getTime() - new Date(startDateTimeText).getTime())/1000/3600 > 12){
		alert('최대 12시간 조회만 가능합니다.');
		return false;
	}

	if(!flag) {
		classNames = {};
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
	}
	
	var requestData = {
			equiptext : equiptext,
			equipval : equipval,
			kpival : kpival,
			equipList : equipList,
			startDateTime : startDateTime,
			endDateTime : endDateTime,
			sortOption : columnSorting.sortInfo
	};
	
	requestData = JSON.stringify(requestData);
	
	$.ajax({
		type:'post',
		url:'/pm/epc/analysis/epc_analysis/getEpcTrendData',
		contentType: 'application/json',
		dataTpye:'json',
		data: requestData,
		success:function(data){
			
			changekpi(flag);

			var sort = document.querySelectorAll('#headerTr .sort');
			if(flag) {
				var keys = Object.keys(classNames);
				keys.map(function (v, i) {
					document.querySelector('#' + v).className = classNames[v];
				});
			} else {
				for(var i = 0; i < sort.length; i += 1) {
					sort[i].className = 'overTxt updown sort';
				}
			}

			createChart(data.getTrendData);
			
			if(kpitext == 'SGs' || equiptext == 'HSS' || equiptext == 'PCRF' || equiptext ==  'PGW' || equiptext == 'SGW'){
				etcTd(data.getTrendData.gridData,kpitext,equiptext);
			}else{
				mme_attsrTd(data.getTrendData.gridData);
			}
			
		},
		error:function(data){
			
		}
	});
}

function mme_attsrTd(data){
	
	var type = $('#equipSelect option:selected').val();
	
	$('#dataGrid').empty();
	var number = 0;
	$(data).each(function(key,value){
		number++;
		$('#dataGrid').append(
			'<tr onmousedown="javascript:rightMenu.rightClick(event,this,'+type+')">'+
			'<td>'+number+'</td>'+
			'<td>'+value.EVENT_TIME+'</td>'+
			'<td>'+value.ATTEMPT+'</td>'+
			'<td>'+value.STD_ATT+'</td>'+
			'<td>'+value.ATT_RATE+'</td>'+
			'<td>'+value.SUCCESS+'</td>'+
			'<td>'+value.SUCC_RATE+'</td>'+
			/*'<td>'+value.ANSWER+'</td>'+
			'<td>'+value.ANS_RATE+'</td>'+*/
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
    				/*'<td></td>'+
    				'<td></td>'+*/
    				'</tr>'
    		);
    	}
    }
}

function etcTd(data,kpitext,equiptext){
	
	var type = $('#equipSelect option:selected').val();
	var td = '';
	
	$('#dataGrid').empty();
	var number = 0;
	$(data).each(function(key,value){
		number++;
		
		if(equiptext == 'HSS'){
			td = '<td>'+value.FAIL+'</td>';
		}
		
		$('#dataGrid').append(
			'<tr onmousedown="javascript:rightMenu.rightClick(event,this,'+type+')">'+
			'<td>'+number+'</td>'+
			'<td>'+value.EVENT_TIME+'</td>'+
			'<td>'+value.ATTEMPT+'</td>'+
			'<td>'+value.STD_ATT+'</td>'+
			'<td>'+value.ATT_RATE+'</td>'+
			'<td>'+value.SUCCESS+'</td>'+
			'<td>'+value.SUCC_RATE+'</td>'+
			td+
			'</tr>'
		);
	})
	
	
	if(equiptext == 'HSS'){
		td = '<td></td>';
	}
	
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
    				td+
    				'</tr>'
    		);
    	}
    }
}

function createChart(data){
	var tempTimelist = data.timeList;
	var dataList = [];
	var yAxis = [];
	var timelist = [];
	
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
			if(typeof value != 'number') value = value.replace(/,/gi,'');
			datalist.push(Number(value));
		});
		
		dataList.push(
				{
					name:value.name,
					type:value.type,
					data:datalist,
					yAxis : Number(value.yAxis),
					zIndex : Number(value.zIndex),
					tooltip:{
						valueSuffix:value.suffix
					}
				}
		);
	});
	
	dataList.sort(function(a,b){
		return  b.zIndex - a.zIndex;
	});
	
	yAxis = [{
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
			    },
			    {
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
			    }
			];
	
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
            x: -20 //center
        },
        xAxis: {
	        type: 'datetime',
	        categories: timelist,
	        tickInterval : ticInterval,
	        labels: {
	        	formatter: function() {
	        		return Highcharts.dateFormat('%m-%d %H:%M',this.value);
				},
	            y : 35
	        }
        },
        yAxis: yAxis,
        tooltip: {
        	shared: true,
        	xDateFormat: '%m-%d %H:%M'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions:{
            spline: {
                 marker: {
                     enabled: false
                 }
            }
         },
        series: dataList
    });
}


function excel_download(){
	
	var kpitext = $('#kpiSelect option:selected').text();
	var equiptext = $('#equipSelect option:selected').text();
	
	var startDateTimeText = $('#start-date').val()+" "+$('#startHourSelect option:selected').val()+":"+$('#startMinSelect option:selected').val();
	var endDateTimeText = $('#end-date').val()+" "+$('#endHourSelect option:selected').val()+":"+$('#endMinSelect option:selected').val();
	var detailKpiSelect = '';
	
	var equipval = $('#equipSelect option:selected').val();
	var kpival = $('#kpiSelect option:selected').val();
	var equipList = $('#equipListVal').val();
	
	if(equipList == '' && equipval != '6'){
		alert('장비 선택 후 엑셀 다운로드가 가능합니다..');
		return false;
	}
	
	var startDateTime = new Date(startDateTimeText).format("yyyyMMddHHmm");
	var endDateTime = new Date(endDateTimeText).format("yyyyMMddHHmm");
	
	var url =  "/pm/epc/analysis/epc_analysis/excelDownEpc?kpival="+kpival+"&equipList="+equipList+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+
				"&equipval="+equipval+"&equiptext="+equiptext+"&kpitext="+kpitext;
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
				rightMenu.typetext = $('#equipSelect option:selected').text();
				var pos = abspos(event);
				$('#popMenu').css('left',(pos.x+10)+'px');
				$('#popMenu').css('top',(pos.y-90)+'px');
			}
		},
		type : '',
		obj : {},
		stdTime : '',
		pageType : '4'
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}