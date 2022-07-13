var nwtDetail = {
	params: {},
	systemIdForFailureDetail: '',
	searchTypeFlag: false,
	searchTypeCompare: {before:'', present: ''},
	popFlag: true,
	switchPortInfoAjax: {},
	systemListAjax: {},
	//품질 Trend 레이어 호출
	goTrend: function (data) {
		var eventDate = moment(data.eventTime, 'YYYYMMDDHHmmss');
		
		var eventTime = eventDate.format('YYYY/MM/DD HH:mm:ss');
		var equipType = data.equipType;
		// 3시간 이전
		var startTime = eventDate.add(-3, 'hours').format('YYYY/MM/DD HH:mm:ss');

		nwtDetail.showLayer("divDialogTrend");
	
		// 레이어 띄울때 시간은 기존 검색된 시간말고 default 시간으로 설정
		$('#start-date-trend').val(startTime.substr(0,10));
		$('#start-hour-trend').val(startTime.substr(11,2));
		$('#start-min-trend').val(startTime.substr(14,2));
		$('#end-date-trend').val(eventTime.substr(0,10));
		$('#end-hour-trend').val(eventTime.substr(11,2));
		$('#end-min-trend').val(eventTime.substr(14,2));
	
		var $searchType = $('#search-type-select-trend');
		$searchType.empty();
		$searchType.show();

		if (equipType === 1) {
			// MME
			var types =
				"<option value='attach'>Attach</option>" +
				"<option value='srmo'>SRMO</option>" +
				"<option value='srmt'>SRMT</option>";
			$searchType.append(types);

		} else if (equipType == 4) {
			// PGW / SGW
			var types =
				"<option value='pgw_create'>PGW Create</option>" +
				"<option value='pgw_delete'>PGW Delete</option>" +
				"<option value='pgw_modify'>PGW Modify</option>" +
				"<option value='sgw_attach'>SGW Create</option>" +
				"<option value='sgw_delete'>SGW Delete</option>" +
				"<option value='sgw_modify'>SGW Modify</option>";
			$searchType.append(types);
		} else if (equipType === 6) {
			// HSS + PCRF
			var types =
				"<option value='s6a'>S6A</option>" +
				"<option value='cx'>CX</option>" + 
				"<option value='gx'>GX</option>"+
				"<option value='rx'>RX</option>";
			$searchType.append(types);
		} else if (equipType === 7) {
			// PCRF
			var types =
				"<option value='pcef'>PCEF</option>" +
				"<option value='spr'>SPR</option>"+
				"<option value='af'>AF</option>";
			$searchType.append(types);

		} else if (equipType == 2 || equipType == 3) {
			$searchType.hide();
//			var types =
//				"<option value='rrc'>소통율/완료율</option>" +
//				"<option value='cd'>절단율</option>";
//			$searchType.append(types);

		} else if (equipType == 10 ) {
			var types =
				"<option value='call'>CALL</option>" +
				"<option value='ptt'>PTT</option>";
			$searchType.append(types);

		}else {
			$searchType.hide();
		}

		nwtDetail.params = {
			equipType: data.equipType,
			systemId: data.systemId,
			systemName: data.systemName,
			searchType: $searchType.find('option:selected').val()
		};
	
		nwtDetail.getTrend();
	},
	
	// 품질 Trend 레이어 검색
	getTrend: function  () {
		nwtDetail.params.searchType = $('#search-type-select-trend').find('option:selected').val();
		
		nwtDetail.params.searchType = ((nwtDetail.params.equipType != '2' && nwtDetail.params.equipType != '3') 
				? $('#search-type-select-trend').find('option:selected').val() : 'all');
		nwtDetail.params.alarmFilter = NETWORK_TOPOLOGY.params.alarmFilter;
		var dateFlag = nwtDetail.validationAndSetDate(document.searchForm, "trend");

		if(dateFlag) {
			$.ajax({
				type : 'post',
				url: '/integration/monitor/network/grid/trend',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(nwtDetail.params),
				success: function (data) {
					data = data.resultMap;
					$("#divDialogTrend").find(".title").text("품질 Trend : " + data.SYSTEM_NAME);
	
					var ticInterval = 1;
					var maxCnt = 8;
					var timeCount = data.CATEGORIES.length;
					if(timeCount > maxCnt) {
						ticInterval = Math.ceil(timeCount / maxCnt);
					}
	
					// DU, RU가 아닐 때
					if(nwtDetail.params.equipType != '2' && nwtDetail.params.equipType != '3'){
						// high chart 옵션 정의
						var chart_options = {
							chart: {
								width : 950,
								zoomType: 'x',
								events : {
									selection : function(event) {
										if (event.resetSelection) {
											try {
												setTimeout(function() {
													$('.chartWrap').highcharts().xAxis[0].update({
														tickInterval : ticInterval
													});
												}, 0);
											} catch (event) {
												// console.log(e);
											}
										} else {
											var _ticInterval = 1;
											var _xCnt = event.xAxis[0].max - event.xAxis[0].min;
											if (_xCnt > maxCnt) {
												_ticInterval = Math.ceil(_xCnt / maxCnt);
											}
											try {
												setTimeout(function() {
													$('.chartWrap').highcharts().xAxis[0].update({
														tickInterval : _ticInterval
													});
												}, 0);
											} catch (event) {
												// console.log(e);
											}
										}
									}
								}
							},
							title:{
								text:''
							},
							credits: {
								enabled: false
							},
							xAxis: [{
								categories: data.CATEGORIES,
								tickInterval : ticInterval
							}],
							yAxis: [{ // Primary yAxis
								gridLineWidth: 0,
								title: {
									text: '시도호',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								showEmpty: false
		
							}, { // Secondary yAxis
								title: {
									text: data.TITLE_1,
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								opposite: true,
								showEmpty: false
							}],
							tooltip: {
								shared: true
							},
							legend: {
								layout: 'vertical',
								align: 'left',
								x: 60,
								verticalAlign: 'top',
								y: -10,
								floating: true,
								backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
							},
							plotOptions:{
								spline: {
									marker: {
										enabled: false
									}
								}
							},
							series: [{
								name: '시도호',
								type: 'column',
								data: data.ATTEMPTS,
								tooltip: {
									valueSuffix: ''
								}
							}]
						};
		
						chart_options.series.push({			// series 추가
							name: data.TITLE_1,
							type: 'spline',
							yAxis: 1,
							data: data.RATES_1,
							marker: {
								enabled: false
							},
							dashStyle: 'shortdot',
							tooltip: {
								valueSuffix: ''
							}
						});
		
						if (data.RATES_2[0] != null) {
							chart_options.yAxis[1].title.text += "/" + data.TITLE_2;	// 타이틀 변경
							chart_options.series.push({		// series 추가
								name: data.TITLE_2,
								type: 'spline',
								yAxis: 1,
								data: data.RATES_2,
								tooltip: {
									valueSuffix: ''
								}
							});
						}
						
						// 시도호 증감율
						if (data.RATES_3[0] != null) {
							chart_options.yAxis[1].title.text += "/" + data.TITLE_3;	// 타이틀 변경
							chart_options.series.push({		// series 추가
								name: data.TITLE_3,
								type: 'spline',
								yAxis: 1,
								data: data.RATES_3,
								tooltip: {
									valueSuffix: ''
								}
							});
						}
					}else{	// DU, RU 일때
						// high chart 옵션 정의
						var chart_options = {
							chart: {
								width : 950,
								zoomType: 'x',
								events : {
									selection : function(event) {
										if (event.resetSelection) {
											try {
												setTimeout(function() {
													$('.chartWrap').highcharts().xAxis[0].update({
														tickInterval : ticInterval
													});
												}, 0);
											} catch (event) {
												// console.log(e);
											}
										} else {
											var _ticInterval = 1;
											var _xCnt = event.xAxis[0].max - event.xAxis[0].min;
											if (_xCnt > maxCnt) {
												_ticInterval = Math.ceil(_xCnt / maxCnt);
											}
											try {
												setTimeout(function() {
													$('.chartWrap').highcharts().xAxis[0].update({
														tickInterval : _ticInterval
													});
												}, 0);
											} catch (event) {
												// console.log(e);
											}
										}
									}
								}
							},
							title:{
								text:''
							},
							credits: {
								enabled: false
							},
							xAxis: [{
								categories: data.CATEGORIES,
								tickInterval : ticInterval
							}],
							yAxis: [{ // Primary yAxis
								gridLineWidth: 0,
								title: {
									text: '시도호'
								},
								labels: {
									format: '{value}'
								},
								showEmpty: false
		
							}, { // Secondary yAxis
								title: {
									text: data.TITLE_1,
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								opposite: true,
								showEmpty: false
							}],
							tooltip: {
								shared: true
							},
							legend: {
								layout: 'vertical',
								align: 'left',
								x: 60,
								verticalAlign: 'top',
								y: -10,
								floating: true,
								backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
							},
							plotOptions:{
								spline: {
									marker: {
										enabled: false
									}
								},
								column: {
						            stacking: 'normal'
						        }
							},
							series: [{
								name: 'RRC 시도호',
								type: 'column',
								data: data.ATTEMPTS,
								stack: 'RRC'
							},{
								name: 'ERAB Setup 시도호',
								type: 'column',
								data: data.ERAB_ATTEMPT,
								statck: 'ERAB'
							}]
						};
		
						// series 추가
						chart_options.series.push({			
							name: 'RRC 시도호 증감율(%)',
							type: 'spline',
							yAxis: 1,
							data: data.ATT_RATE,
							marker: {
								enabled: false
							},
							dashStyle: 'solid'
						});
						
						chart_options.series.push({			
							name: 'ERAB Setup 시도호 증감율(%)',
							type: 'spline',
							yAxis: 1,
							data: data.ERAB_ATT_RATE,
							marker: {
								enabled: false
							},
							dashStyle: 'solid'
						});
		
						chart_options.series.push({			
							name: '소통율(RRC 성공율)(%)',
							type: 'spline',
							yAxis: 1,
							data: data.RRC_RATE,
							marker: {
								enabled: false
							},
							dashStyle: 'shortdot'
						});
						
						chart_options.series.push({			
							name: '완료율(ERAB Setup 성공율 성공율)(%)',
							type: 'spline',
							yAxis: 1,
							data: data.ANSWER_RATE,
							marker: {
								enabled: false
							},
							dashStyle: 'dash'
						});
						
						chart_options.series.push({			
							name: '절단율 (%)',
							type: 'spline',
							yAxis: 1,
							data: data.CD_RATE,
							marker: {
								enabled: false
							},
							dashStyle: 'dashdot'
						});
					}
	
					// high chart 생성
					$('.chartWrap').highcharts(chart_options);
				},
				error: function () {
					//alert('에러발생');
				}
			});
		}
	},

	// 성능 상세조회 Layer 호출
	goPerformanceDetail: function (data) {
		nwtDetail.searchTypeFlag = false;
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];

		var eventDate = moment(data.eventTime, 'YYYYMMDDHHmmss');
		
		var eventTime = eventDate.format('YYYY/MM/DD HH:mm:ss');
		var equipType = data.equipType;
		// 3시간 이전
		var startTime = eventDate.add(-3, 'hours').format('YYYY/MM/DD HH:mm:ss');
		
		// 레이어 띄울때 시간은 기존 검색된 시간말고 default 시간으로 설정
		$('#start-date-performance').val(startTime.substr(0,10));
		$('#start-hour-performance').val(startTime.substr(11,2));
		$('#start-min-performance').val(startTime.substr(14,2));
		$('#end-date-performance').val(eventTime.substr(0,10));
		$('#end-hour-performance').val(eventTime.substr(11,2));
		$('#end-min-performance').val(eventTime.substr(14,2));
	
		var $searchType = $('#search-type-select-performance');
		$searchType.empty();
		$searchType.show();

		if (equipType === 1) {
			// MME
			var types =
				"<option value='all'>전체</option>" +
				"<option value='attach'>Attach</option>" +
				"<option value='srmo'>SRMO</option>" +
				"<option value='srmt'>SRMT</option>";
				// "<option value='sgs'>SGS</option>";
			$searchType.append(types);

		} else if (equipType == 4) {
			// PGW / SGW
			var types =
				"<option value='all'>전체</option>" +
				"<option value='pgw_create'>PGW Create</option>" +
				"<option value='pgw_delete'>PGW Delete</option>" +
				"<option value='pgw_modify'>PGW Modify</option>" +
				"<option value='sgw_attach'>SGW Create</option>" +
				"<option value='sgw_delete'>SGW Delete</option>" +
				"<option value='sgw_modify'>SGW Modify</option>";
			$searchType.append(types);
		} else if (equipType === 6) {
			// HSS + PCRF
			var types =
				"<option value='all'>전체</option>" +
				"<option value='s6a'>S6A</option>" +
				"<option value='cx'>CX</option>" + 
				"<option value='gx'>GX</option>"+
				"<option value='rx'>RX</option>";
			$searchType.append(types);
			
			//아래 사용 안함
		} else if (equipType === 7) {
			// PCRF
			var types =
				"<option value='all'>전체</option>" +
				"<option value='pcef'>PCEF</option>" +
				"<option value='spr'>SPR</option>"+
				"<option value='af'>AF</option>";
			$searchType.append(types);
		} else if (equipType === 10) {
			// PCRF
			var types =
				"<option value='all'>전체</option>" +
				"<option value='call'>CALL</option>" +
				"<option value='ptt'>PTT</option>";
			$searchType.append(types);
		} else {
			$searchType.hide();
		}

		nwtDetail.params = {
			equipType: data.equipType,
			systemId: data.systemId,
			systemName: data.systemName,
			searchType: $searchType.find('option:selected').val()
		};
		
		nwtDetail.getPerformanceDetail();
		nwtDetail.showLayer("divPerformanceDetail", data.equipName);
	},
	
	// 성능 상세조회 레이어 검색
	getPerformanceDetail: function () {
		nwtDetail.params.searchType = $('#search-type-select-performance').find('option:selected').val();
		nwtDetail.params.alarmFilter = NETWORK_TOPOLOGY.params.alarmFilter;

		if(nwtDetail.searchTypeFlag) {
			columnSorting.sortInfo = [];
			columnSorting.beforeColNms = [];
			nwtDetail.popFlag = true;
		}
		nwtDetail.searchTypeFlag = false;

		nwtDetail.params.sortOption = columnSorting.sortInfo;

		var dateFlag = nwtDetail.validationAndSetDate(document.searchForm, "performance");

		if(dateFlag) {
			$.ajax({
				type: 'post',
				url: '/integration/monitor/network/grid/performanceDetail',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(nwtDetail.params),
				// data: $("#searchForm").serializeObject(),
				success: function (data) {
					var peformDetail = $('#divPerformanceDetail');
	
					var thcolgroup = peformDetail.find('div.mu-dialog-body table:first colgroup');
					var thtr = peformDetail.find('thead>tr');
					var tbcolgroup = peformDetail.find('div.mu-dialog-body table:last colgroup');
					var tbtr = peformDetail.find('tbody');

					var classNames = {};
					// 컨텍스트 메뉴 또는 검색 버튼을 눌렀을 때
					if(nwtDetail.popFlag) {
						classNames = {
							'EVENT_TIME': 'updown sort',
							'ATTEMPT': 'updown sort',
							'ATT_RATE': 'updown sort',
							'SUCC_RATE': 'updown sort',
							'ANS_RATE': 'updown sort',
							'ANSWER_RATE': 'updown sort',
							'RRC_RATE': 'updown sort',
							'CD_RATE': 'updown sort'
						};
						nwtDetail.popFlag = false;
					} else {
						$.each(peformDetail.find('.sort'),function(i,val){
							classNames[val.id] = $(val).attr('class');
						});
					}

					thcolgroup.empty();
					thtr.empty();
	
					tbcolgroup.empty();
					tbtr.empty();
	
					peformDetail.find('.title').text('성능 상세조회 : ' + data.TITLE);
	
					var detail = data.PERFORMANCE_DETAIL;
	
					if(detail.length !== 0) {
						if (data.EQUIP_TYPE === 1) { 
							// MME
							thcolgroup.append("<col width=''><col width='18%'><col width='18%'><col width='18%'><col width='18%'>");
							tbcolgroup.append("<col width=''><col width='18%'><col width='18%'><col width='18%'><col width='18%'>");

							
							thtr.append(
								'<th class="' + classNames.EVENT_TIME + '" id="EVENT_TIME"><input type="hidden" value="EVENT_TIME" />시간</th>' +
								'<th>지표</th>' +
								'<th class="' + classNames.ATTEMPT + '" id="ATTEMPT"><input type="hidden" value="ATTEMPT" />시도호</th>' +
								'<th class="' + classNames.ATT_RATE + '" id="ATT_RATE"><input type="hidden" value="ATT_RATE" />시도호 증감율(%)</th>' +
								'<th class="' + classNames.SUCC_RATE + '" id="SUCC_RATE"><input type="hidden" value="SUCC_RATE" />성공율(%)</th>');
								/*'<th class="' + classNames.ANS_RATE + '" id="ANS_RATE"><input type="hidden" value="ANS_RATE" />접속율(%)</th>');*/
							$(detail).each(function (idx, value) {
								tbtr.append(
									"<tr>"
									+ "<td align='center'>" + value.EVENT_TIME + "</td>"
									+ "<td align='center'>" + value.TYPE + "</td>"
									+ "<td align='right'>" + value.ATTEMPT + "</td>"
									+ "<td align='center'>" + value.ATT_RATE + "</td>"
									+ "<td align='center'>" + value.RATE_1 + "</td>" 
									/*+ "<td align='center'>" + value.RATE_2 + "</td>"*/
									+"</tr>");
							});
						} else if (data.EQUIP_TYPE === 2 || data.EQUIP_TYPE === 3) {
							// DU, RU
						
							var colgroup = "<col width=''>"
										+"<col width='12%'>"
										+"<col width='12%'>"
										+"<col width='12%'>"
										+"<col width='12%'>"
										+"<col width='12%'>"
										+"<col width='12%'>"
										+"<col width='12%'>";
							thcolgroup.append(colgroup);
							tbcolgroup.append(colgroup);

							thtr.append(
								'<th class="' + classNames.EVENT_TIME + '" id="EVENT_TIME" title="시간"><input type="hidden" value="EVENT_TIME" />시간</th>' +
								'<th class="' + classNames.ATTEMPT + '" id="ATTEMPT" title="RRC 시도호"><input type="hidden" value="ATTEMPT" />RRC 시도호</th>' +									//RRC 시도호
								'<th class="' + classNames.ATT_RATE + '" id="ATT_RATE" title="RRC 시도호 증감율(%)"><input type="hidden" value="ATT_RATE" />RRC 시도호 증감율(%)</th>' +							//RRC 시도호 증감율(%)
								'<th class="' + classNames.ERAB_ATTEMPT + '" id="ERAB_ATTEMPT" title="ERAB Setup 시도호"><input type="hidden" value="ERAB_ATTEMPT" />ERAB Setup 시도호</th>' +				//ERAB Setup 시도호
								'<th class="' + classNames.ERAB_ATT_RATE + '" id="ERAB_ATT_RATE" title=">ERAB Setup 시도호 증감율(%)"><input type="hidden" value="ERAB_ATT_RATE" />ERAB Setup 시도호 증감율(%)</th>' +	//ERAB Setup 시도호 증감율(%)
								'<th class="' + classNames.RRC_RATE + '" id="RRC_RATE" title="소통율(RRC 성공율)(%)"><input type="hidden" value="RRC_RATE"/>소통율(RRC 성공율)(%)</th>' +						//소통율(RRC 성공율)(%)
								'<th class="' + classNames.ANSWER_RATE + '" id="ANSWER_RATE" title="완료율(ERAB Setup 성공율)(%)"><input type="hidden" value="ANSWER_RATE" />완료율(ERAB Setup 성공율)(%)</th>' +		//완료율(ERAB Setup 성공율)(%)
								'<th class="' + classNames.CD_RATE + '" id="CD_RATE" title="절단율(%)"><input type="hidden" value="CD_RATE" />절단율(%)</th>'										//절단율(%)
								);
							
							$(detail).each(function (idx, value) {
								tbtr.append(
									"<tr>"
									+ "<td align='center'>" + value.EVENT_TIME + "</td>"
									+ "<td align='right'>" + value.ATTEMPT + "</td>"		//RRC 시도호 
									+ "<td align='center'>" + value.ATT_RATE + "</td>"		//RRC 시도호 증감율(%)
									+ "<td align='right'>" + value.ERAB_ATTEMPT + "</td>"	//ERAB Setup 시도호
									+ "<td align='center'>" + value.ERAB_ATT_RATE + "</td>"	//ERAB Setup 시도호 증감율(%)
									+ "<td align='center'>" + value.RRC_RATE + "</td>"		//소통율(RRC 성공율)(%)
									+ "<td align='center'>" + value.ANSWER_RATE + "</td>"	//완료율(ERAB Setup 성공율)(%)
									+ "<td align='center'>" + value.CD_RATE + "</td>"		//절단율(%)
									+ "</tr>");
							});

						} else {
							var type = "";

							thcolgroup.append("<col width=''><col width='18%'><col width='18%'><col width='18%'><col width='18%'>");
							tbcolgroup.append("<col width=''><col width='18%'><col width='18%'><col width='18%'><col width='18%'>");
	
							thtr.append(
								'<th class="' + classNames.EVENT_TIME + '" id="EVENT_TIME"><input type="hidden" value="EVENT_TIME" />시간</th>' +
								'<th>지표</th>' +
								'<th class="' + classNames.ATTEMPT + '" id="ATTEMPT"><input type="hidden" value="ATTEMPT" />시도호</th>' +
								'<th class="' + classNames.ATT_RATE + '" id="ATT_RATE"><input type="hidden" value="ATT_RATE" />시도호 증감율(%)</th>' +
								'<th class="' + classNames.SUCC_RATE + '" id="SUCC_RATE"><input type="hidden" value="SUCC_RATE" />성공율(%)</th>');

							$(detail).each(function (idx, value) {
								if(data.EQUIP_TYPE === 6) {
									// HSS
									type = value.TYPE.split(" ")[0];
								} else {
									type = value.TYPE;
								}

								tbtr.append(
									"<tr>"
									+ "<td align='center'>" + value.EVENT_TIME + "</td>"
									+ "<td align='center'>" + type + "</td>"
									+ "<td align='right'>" + value.ATTEMPT + "</td>"
									+ "<td align='center'>" + value.ATT_RATE + "</td>"
									+ "<td align='center'>" + value.RATE_1 + "</td>"
									+"</tr>");
							});
						}
					} else {
						if (nwtDetail.params.equipType === 1) {
							// MME
							thcolgroup.append('<col width=""><col width="18%"><col width="18%"><col width="18%"><col width="18%">');
							tbcolgroup.append('<col width=""><col width="18%"><col width="18%"><col width="18%"><col width="18%">');

							thtr.append('<th>시간</th><th>지표</th><th>시도호</th><th>시도호 증감율(%)</th><th>성공율(%)</th>');
							tbtr.append(
								"<tr>"
								+ "<td colspan='5' align='center'>해당 데이터가 없습니다.</td>"
								+ "</tr>"
							);			
						} else {
							thcolgroup.append('<col width=""><col width="18%"><col width="18%"><col width="18%"><col width="18%">');
							tbcolgroup.append('<col width=""><col width="18%"><col width="18%"><col width="18%"><col width="18%">');

							thtr.append('<th>시간</th><th>지표</th><th>시도호</th><th>시도호 증감율(%)</th><th>성공율(%)</th>');
							tbtr.append(
								"<tr>"
								+ "<td colspan='5' align='center'>해당 데이터가 없습니다.</td>"
								+ "</tr>"
							);
						}
					}
				},
				error: function () {
					//alert('에러발생');
				}
			});
		}
	},

	// 고장 상세조회 Layer 호출
	goFailureDetail: function (data) {
		columnSorting.beforeColNms = [];
		columnSorting.sortInfo = [];
		nwtDetail.systemIdForFailureDetail = '';
		var equipType = data.equipType === 5 ? 4 : data.equipType;
		var systemName = data.systemName
		nwtDetail.params = {
			equipType: equipType,
			equipName: data.equipName,
			systemId: 0,
			systemName: data.systemName,
			startTime: '',
			eventTime: '',
			searchType: '',
			alarmFilter: '',
			category: data.category
		};

		if(equipType === 2 || equipType === 11 || equipType === 44 || equipType === 57 || equipType === 36 || systemName ==='정류기장비' 
			|| equipType === 18 || equipType === 27 ) {
			nwtDetail.params.systemId = data.systemId;
			
		} else if(equipType === 3) {
			nwtDetail.params.systemId = data.duId;
			nwtDetail.params.rrh = data.rrh;
		}

		var selectSystem = $('#selectSystem');
		selectSystem.empty();

		// HSS, CALL, PTT, REC, SWITCH
		// IM, meadiaGW, Message
		
		// 장비들 셀렉트박스
		if(equipType === 6 || equipType === 8 || equipType === 9 || equipType === 10 
				|| equipType === 13 || equipType === 21 || equipType === 25 || equipType === 45 || equipType === 46 || equipType === 51) {
			selectSystem.append('<span>SYSTEM NAME : </span><select name="systemListSelect" class="mu-value"></select>');
			Promise.all([nwtDetail.systemListAjax]).then(function() {
				nwtDetail.getSystemList();
			});
		}
		
		
		// 주니퍼스위치 셀렉트박스
		else if(systemName === '하남선 스위치' || systemName === '관제 스위치' || systemName === '석남선 스위치') {
			switchCategoryAjax = $.ajax({
				type: 'post',
				url: '/integration/monitor/network/grid/getSwitchCategory',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(nwtDetail.params),
				success:function (data) {
					selectSystem.empty();
					var selectSystemHtml = []
					selectSystemHtml.push('<span>SWITCH NAME : </span><select name="swithListSelect" class="mu-value">');
					selectSystemHtml.push('<option value="">전체</option>');
					data.switchCategory.map(function (v, i) {
						selectSystemHtml.push('<option value="' + v.CATEGORY + '">' + v.CATEGORY + ' 스위치</option>');
					});
					selectSystemHtml.push('</select>');
					selectSystem.append(selectSystemHtml.join(''));
					selectSystem.append('&nbsp;&nbsp;<span>SYSTEM NAME : </span><select name="systemListSelect" class="mu-value"></select>');
					nwtDetail.swithIdForFailureDetail = '';
					Promise.all([nwtDetail.systemListAjax]).then(function() {
						nwtDetail.getSystemList();
					});
				}
			});
			
//			switchCategoryAjax.then(function (data) {
//				selectSystem.append('<option value="">전체</option>');
//				data.switchCategory.map(function (v, i) {
//					selectSystem.append('<option value="' + v.CATEGORY + '">' + v.CATEGORY + ' 스위치</option>');
//				});
//			});
//			selectSystem.append('<span>SWITCH NAME : </span><select name="swithListSelect" class="mu-value">');
//			var swithListSelect = $('select[name=swithListSelect]');
//			swithListSelect.empty();
//			swithListSelect.append('<option value="">전체</option>');
//			swithListSelect.append('<option value="거점BB">거점BB 스위치</option>');
//			swithListSelect.append('<option value="관제소">관제소 스위치</option>');
//			swithListSelect.append('<option value="역사BB">역사BB 스위치</option>');
//			swithListSelect.append('<option value="DU">DU 스위치</option>');
			
		}
		
		/*// 노키아스위치 셀렉트박스
		else if(equipType === 11 && data.systemId === '1187') {
			nwtDetail.params.systemId = '1187'
			selectSystem.append('<span>SYSTEM NAME : </span><select name="systemListSelect" class="mu-value"></select>');
			Promise.all([nwtDetail.systemListAjax]).then(function() {
				nwtDetail.getSystemList();
			});
		}*/

//		if ( data.equipType === 36 || data.equipType === 44 ){
//			nwtDetail.showLayer("divFailureDetail", data.viewName);
//		}else{
//			nwtDetail.showLayer("divFailureDetail", equip_name);
//		}
		nwtDetail.showLayer("divFailureDetail", equip_name);
		nwtDetail.getFailureDetail();
	},
	
	// 고장 상세조회 레이어 검색
	getFailureDetail: function () {
		//DU의 고장상세 조회시 DU_ID(systemId)를 사용한다.
		//RU의 고장상세 조회시 systemId를 사용한다
		//스위치의 고장상세 조회시 systemId를 사용한다
		//그 외의 장비 중에 셀렉트 박스에서 선택하는 경우에 systemId를 입력받도록 한다
		
		/*상세팝업 이전
		if(nwtDetail.params.equipType !== 2 && nwtDetail.params.equipType !== 3 ) {
		*/
		/*if(nwtDetail.params.equipType !== 2 && nwtDetail.params.equipType !== 3 && nwtDetail.params.equipType !== 11 && nwtDetail.params.equipType !== 36 && nwtDetail.params.equipType !== 44) {
//		if(nwtDetail.params.equipType !== 2 && nwtDetail.params.equipType !== 3 ) {
			// 노키아스위치 시스템아이디 설정
			nwtDetail.params.systemId = nwtDetail.systemIdForFailureDetail;
		}*/
		

		/*if(nwtDetail.params.equipType === 11 ) {
			nwtDetail.params.category = nwtDetail.swithIdForFailureDetail;
			if (nwtDetail.params.category == ''){
				nwtDetail.params.systemId = '';
			}
		}*/
		
		if(nwtDetail.params.equipType === 11 
				&& (nwtDetail.params.systemName !== '하남선 스위치' || nwtDetail.params.systemName == '석남선 스위치' || nwtDetail.params.systemName == '관제 스위치')) {
			nwtDetail.params.category = ''
		}
		
		nwtDetail.params['sortOption'] = columnSorting.sortInfo;

		nwtDetail.params['alarmFilter'] = NETWORK_TOPOLOGY.params['alarmFilter'];
		
		nwtDetail.params['switchLineId'] = switchLineId;
		
		// 정류기 라인 ID 
		nwtDetail.params['jrgLineId'] = jrgLineId;	

		var failureTbody = $('#failureDetailTbody').find('tbody');
		failureTbody.empty();

		$.ajax({
			type: 'post',
			url: '/integration/monitor/network/grid/failuredetail',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(nwtDetail.params),
			// data: $("#searchForm").serializeObject(),
			success: function (data) {
				
				//노키아 스위치 제외
				if( nwtDetail.params.equipType === 11 && nwtDetail.params.systemId != '1187'){
					data.FAILURE_MAP.FAILURE_DATA = $.grep(data.FAILURE_MAP.FAILURE_DATA, function(m, i){
						return m.SYSTEM_ID != '1187'
					})
				}
				var title = "";
				var failureDetail = $("#divFailureDetail");
				$('#swithListSelect').hide();
				/*if(data.FAILURE_MAP.EQUIP_TYPE === 11 && nwtDetail.params.systemId != '1187'){
					if(data.FAILURE_MAP.TITLE == '노키아 스위치' ){
						$('#swithListSelect').hide();
					}else{
						$('#swithListSelect').show();
					}
				}*/
				failureDetail.find(".title").text("고장 상세 조회 : " + data.FAILURE_MAP.TITLE);

				var failureData = data.FAILURE_MAP.FAILURE_DATA;
				var failureHtml = '';

				var classNames = {};
				// 컨텍스트 메뉴 또는 검색 버튼을 눌렀을 때
				if(nwtDetail.popFlag) {
					classNames = {
						'LEVEL': 'updown sort',
						'EVENT_TIME': 'updown sort'
					};
					nwtDetail.popFlag = false;
				} else {
					$.each(failureDetail.find('.sort'),function(i,val){
						classNames[val.id] = $(val).attr('class');
					});
				}

				var fId = '';
				$.each(failureDetail.find('.sort'), function(i,val){
					fId = '#'+val.id;
					failureDetail.find(fId).removeClass('sort');
					failureDetail.find(fId).removeClass('updown');
					failureDetail.find(fId).removeClass('up');
					failureDetail.find(fId).removeClass('down');
					failureDetail.find(fId).addClass(classNames[val.id]);
				});

				if(failureData.length !== 0) {
					// 고장
					if (data.FAILURE_MAP.EQUIP_TYPE === 6) {
						// HSS
						$(failureData).each(function (idx, value) {
							$(value).each(function (i, val) {
								failureHtml += "<tr>"
									+ "<td class='stat'><i class='mu-icon alram " + val.LEVEL.toLowerCase() + "'></i></td>"
									+ "<td align='center'>" + val.LEVEL + "</td>"
									+ "<td class='overTxt' title='" + val.SYSTEM_NAME + "' align='center'>" + val.SYSTEM_NAME + "</td>"
									+ "<td class='overTxt' title='" + val.ALARM_CODE + "' align='center'>" + val.ALARM_CODE + "</td>"
									+ "<td class='overTxt' title='" + val.PROBABLE_CAUSE+ "' align='center'>" + val.PROBABLE_CAUSE + "</td>"
									+ "<td class='overTxt' title='" + val.LOCATION + "' align='center'>" + val.LOCATION + "</td>"
									+ "<td align='center'>" + val.EVENT_TIME + "</td>"
									+ "</tr>"
							});
						});
						failureTbody.append(failureHtml);

					} else {
						$(failureData).each(function (idx, value) {
							failureHtml += "<tr>"
								+ "<td class='stat'><i class='mu-icon alram " + value.LEVEL.toLowerCase() + "'></i></td>"
								+ "<td class='overTxt' align='center'>" + value.LEVEL + "</td>"
								+ "<td class='overTxt' title='" + value.SYSTEM_NAME + "' align='center'>" + value.SYSTEM_NAME + "</td>"
								+ "<td class='overTxt' title='" + value.ALARM_CODE + "' align='center'>" + value.ALARM_CODE + "</td>"
								+ "<td class='overTxt' title='" + value.PROBABLE_CAUSE+ "' align='center'>" + value.PROBABLE_CAUSE + "</td>"
								+ "<td class='overTxt' title='" + value.LOCATION + "' align='center'>" + value.LOCATION + "</td>"
								+ "<td class='overTxt' align='center'>" + value.EVENT_TIME + "</td>"
								+ "</tr>"
						});
						failureTbody.append(failureHtml);
					}
				} else {
					failureHtml += "<tr>"
						+ "<td colspan='7' align='center'>해당 데이터가 없습니다.</td>"
						+ "</tr>";
					failureTbody.append(failureHtml);
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	// 스위치 Layer 호출
	goSwitch: function (data) {
		nwtDetail.params = {
			equipType: data.equipType,
			equipName: data.equip_name,
			systemId: data.systemId,
			systemName: '',
			startTime: '',
			eventTime: '',
			searchType: '',
			alarmFilter: '',
			category: data.category
		};
	
		nwtDetail.getSwitchDetail(data.category);

		Promise.all([nwtDetail.switchPortInfoAjax]).then(function() {
			nwtDetail.showLayer("divSwitchView", system_name);
		});
	},
	
	// 스위치 실장도
	getSwitchDetail: function (category) {
		nwtDetail.params.alarmFilter = NETWORK_TOPOLOGY.params.alarmFilter;
		var $divSwitchView = $('#divSwitchView');
		var $switchBody = $divSwitchView.find('#switchOuter');
		
//		$divSwitchView.find('.title').text('스위치: ' + category);
	
		nwtDetail.switchPortInfoAjax = $.ajax({
			type: 'post',
			url: '/integration/monitor/network/switch/portInformation',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(nwtDetail.params)
		});
	
		nwtDetail.switchPortInfoAjax.then(function (data) {
			$switchBody.empty();
			$switchBody.append('<div class="switches">');
			var $switches = $('.switches');

			var switchPortsDiv = '';
			var useDescs = data.use.useDesc;
	
			$.each(data.use, function(i, o) {
				var switchSize = o.SIZE;
				var switchName = o.SWITCH_NAME;
				var switchSlot = o.SLOT;
				var switchShelf = o.SHELF;
				
				var switchClass = 'id-' + o.SWITCH_ID;
				var slotClass = 'slot-' + switchSlot;
				var shelfClass = 'shelf-' + switchShelf;
				
				var serverStatStyle = '';
				/*(serverStat)
				if(o.SERVER_STAT !== 'Y') {
					serverStatStyle = ' style="background: rgb(255, 0, 0);"';
				}
				*/
				
				var swName = switchName + '(SLOT : ' + switchSlot + ', SHELF : ' + switchShelf + ')';
				
				var switchHtml = [];
				switchHtml.push('<div class="switchPorts ' + switchClass + ' ' + slotClass + ' ' + shelfClass + '">');
				switchHtml.push('	<div class="switchWrap">');
				switchHtml.push('		<div class="switchBg">' + swName + '</div>');
				switchHtml.push('		<ul class="switch">');

				// 포트 정렬 (0:virtical, 1:horizon) li css가 기본적으로 지그재그로 되어 있음
				if(o.SORT_FLAG === 0) {
					$.each(o.portUse, function(switchIdx, v) {
						var useDesc = _.isEmpty(_.trim(o.portDesc[switchIdx])) ? '연결없음' : o.portDesc[switchIdx];
						var switchClass = ' normal';
						var portClass = '';
						if(v === '1') {
							portClass = ' normal';
						} else if(Number(v) > 3) {
							switchClass = ' error"';
						}
						switchHtml.push('		<li data-title="' + useDesc + '" onmouseover="nwtDetail._mouseOver(event,this)" onmouseout="nwtDetail._mouseOut(event,this)" >');
						switchHtml.push('			<dl>');
						switchHtml.push('				<dt' + serverStatStyle + '>' + o.portName[switchIdx] + '</dt>');
						switchHtml.push('				<dd class="switchState' + switchClass + '">');
						switchHtml.push('					<div class="port' + portClass + '"></div>');
						switchHtml.push('				</dd>');
						switchHtml.push('			</dl>');
						switchHtml.push('		</li>');
					});
				} else {
					var halfSize = o.SIZE / 2;
					for(var j = 0; j < halfSize; j++) {
						var useDesc = _.isEmpty(_.trim(o.portDesc[j])) ? '연결없음' : o.portDesc[j];
						var switchClass = ' normal';
						var portClass = '';
						if(o.portUse[j] === '1') {
							portClass = ' normal';
						} else if(Number(o.portUse[j]) > 3) {
							switchClass = ' error"';
						}
						switchHtml.push('		<li data-title="' + useDesc + '" onmouseover="nwtDetail._mouseOver(event,this)" onmouseout="nwtDetail._mouseOut(event,this)" >');
						switchHtml.push('			<dl>');
						switchHtml.push('				<dt' + serverStatStyle + '>' + o.portName[j] + '</dt>');
						switchHtml.push('				<dd class="switchState' + switchClass + '">');
						switchHtml.push('					<div class="port' + portClass + '"></div>');
						switchHtml.push('				</dd>');
						switchHtml.push('			</dl>');
						switchHtml.push('		</li>');

						useDesc = _.isEmpty(_.trim(o.portDesc[j + halfSize])) ? '연결없음' : o.portDesc[j + halfSize];
						switchClass = ' normal';
						portClass = '';
						if(o.portUse[j + halfSize] === '1') {
							portClass = ' normal';
						} else if(Number(o.portUse[j + halfSize]) > 3) {
							switchClass = ' error"';
						}
						switchHtml.push('		<li data-title="' + useDesc + '" onmouseover="nwtDetail._mouseOver(event,this)" onmouseout="nwtDetail._mouseOut(event,this)" >');
						switchHtml.push('			<dl>');
						switchHtml.push('				<dt' + serverStatStyle + '>' + o.portName[j + halfSize] + '</dt>');
						switchHtml.push('				<dd class="switchState' + switchClass + '">');
						switchHtml.push('					<div class="port' + portClass + '"></div>');
						switchHtml.push('				</dd>');
						switchHtml.push('			</dl>');
						switchHtml.push('		</li>');
					}
				}
				
				switchHtml.push('		</ul>');
				switchHtml.push('	</div>');
				switchHtml.push('</div>');
				
				$switches.append(switchHtml.join(''));
			});
			
			// 고장 알람 처리

			if(data.state.length !== 0) {
				var gigabitP = /^GigabitEthernet((\d+)(\/\d+){1,2})/;
				var tengigaP = /^TenGigabitEthernet(\d+\/\d+)/;
				var portP = /^Port-channel[\d]+/;
				var vlanP = /^Vlan([\d]+)/;

				var prevLevel = 0;
				
				$.each(data.state, function(idx, value) {
					if(value.ALARM_TYPE === 3) {
						return true;
					}
					var stateSwClass = 'id-' + value.SWITCH_ID;
					var locationArr = [];
					var portNo = 0;
					var portsNo = [];
					var slotsNo = [];
					var level = value.LEVEL_TXT;

					
					presentPortLevel = Number(value.SEVERITY);

					if(portP.test(value.LOCATION)) {
						portsNo = [value.PORT1, value.PORT2];
						slotsNo = ['slot-' + value.SLOT1, 'slot-' + value.SLOT2];
						slotsNo.map(function (v, i) {
							portState = document.querySelectorAll('.' + stateSwClass + '.' + v + ' .port');
							nwtDetail.setPortLevel(portState[portsNo[i] - 1], presentPortLevel, prevLevel);
						});
					} else if(vlanP.test(value.LOCATION)) {
						if(value.RANGE_FLAG === 'N') {
							if(value.SLOT1 === '' && value.SLOT2 === '') {
								portsNo = [value.PORT1, value.PORT2];
								slotsNo = ['slot-' + value.SLOT1, 'slot-' + value.SLOT2];
							} else if(value.SLOT1 === '') {
								portsNo.push(value.PORT2);
								slotsNo.push('slot-' + value.SLOT2);
							} else if(value.SLOT2 === '') {
								portsNo.push(value.PORT1);
								slotsNo.push('slot-' + value.SLOT1);
							}

							slotsNo.map(function (v, i) {
								portState = document.querySelectorAll('.' + stateSwClass + '.' + v + ' .port');
								nwtDetail.setPortLevel(portState[portsNo[i] - 1], presentPortLevel, prevLevel);
							});

						} else if(value.RANGE_FLAG === 'Y') {
							for(var portIdx = Number(value.PORT1); portIdx <= Number(value.PORT2); portIdx += 1) {
								portsNo.push(portIdx);
							}
							portsNo.map(function (v, i) {
								portState = document.querySelectorAll('.' + stateSwClass + ' .port');
								nwtDetail.setPortLevel(portState[v - 1], presentPortLevel, prevLevel);
							});
						}
					} else {
						var slotNo = '';
						var shelfNo = '';
						var portNo = '';
						
						if(gigabitP.test(value.LOCATION) || tengigaP.test(value.LOCATION)) {
							var slotNo = '';
							locationArr = RegExp.$1.split('/');
							//split의 결과의 length가 2이면 Backbone 스위치, 3이면 DU/내부 스위치
							if(locationArr.length == 2) {
								slotNo = locationArr[0];
								portNo = locationArr[1];
							} else if(locationArr.length === 3) {
								slotNo = locationArr[0];
								shelfNo = locationArr[1];
								portNo = locationArr[2];
							}
						} else if(value.LOCATION.indexOf('-') != -1) {
							// ge-1/0/0, xe-1/0/0
							var slotPortInfos = value.LOCATION.split('-')[1].split('/');
							slotNo = slotPortInfos[0];
							shelfNo = slotPortInfos[1];
							portNo = slotPortInfos[2];
						}
						
						var slotClass = 'slot-' + slotNo;
						var shelfClass = 'shelf-' + shelfNo;
						var portStateElm = null;
						var portStateElmList = [];
						
						if(value.PORT_TYPE === 1) {
							portStateElmList = $('.' + stateSwClass + '.' + slotClass + '.' + shelfClass + ' .port');
						} else {
							portStateElmList = $('.' + stateSwClass + '.' + slotClass + ' .port');
						}
						
						portStateElmList.each(function(i, el) {
							var portName = $(this).closest('dl').find('dt').text();
							if(value.PORT_TYPE === 1) {
								if(portNo === portName) {
									portStateElm = this;
								}
							} else if(value.PORT_TYPE === 2) {
								var portInfo = portName.split('/');
								if(shelfNo === portInfo[0] && portNo === portInfo[1]) {
									portStateElm = this;
								}
							} else if(value.PORT_TYPE === 3) {
								var portInfo = portName.replace('[', '').replace(']', '').split('/');
								if((shelfNo === portInfo[0] || shelfNo === portInfo[1]) && portNo === portInfo[2]) {
									portStateElm = this;
								}
							}
						});
						if(portStateElm) {
							nwtDetail.setPortLevel(portStateElm, presentPortLevel, prevLevel);
						}
					}

					// 다음 비교를 위해 현재 포트의 레벨을 이전 포트 레벨 변수에 할당
					prevLevel = presentPortLevel;
				});
			}

			$switches.css("height", "550px");
			$switches.css("overflow-y", "scroll");
			//$switchBody.css("height", "570px");
			$switchBody.css("overflow-y", "hidden");
			$divSwitchView.css("width", "1220px");
			$divSwitchView.css("height", "610px");
	
		});
	},

	//Todo: DU 고장 정보에서 PSU로 나오는 경우 RRH와 같이 RU로 판단하여야하나?
	goFailureLocation: function (nodeData) {
		var params = {'systemId': '', 'equipType': '' };
		if(nodeData.equip_type === 2) {
			params.systemId = nodeData.DU_ID;
			params.equipType = nodeData.equip_type;
			params.topologyFlag = true;
		} else {
			params.systemId = '';
			params.equipType = nodeData.equip_type;
			params.topologyFlag = true;
		}

		$.ajax({
			type: 'post',
			url: '/integration/monitor/network/failureLocation',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params),
			success: function (data) {
				fm.rightMenu.title = nodeData.name;
				// data.failureLocation.slotNum: slot 위치 ( 3- 요소)
				// data.failureLocation.slotAlarm: 해당 위치에서 발생한 알람
				if(nodeData.equip_type === 2) {

					fm.duFailureLocationSetHtml(data);

					if(data.failureLocation.length >= 2) {
						fm.setDUFailureLocation(data.failureLocation[2], 'networkTopology');
					} else {
						fm.popDUFailureLocation('networkTopology');
					}

				} else if(nodeData.equip_type === 1 || nodeData.equip_type === 7 ||
					nodeData.equip_type === 4 || nodeData.equip_type === 5) {

					fm.setNodeInfoData(data, nodeData.equip_type);

					if(data.failureLocation.length === 5) {
						fm.setEPCFailureLocation(data.failureLocation[3], data.failureLocation[4], 'networkTopology');
					} else {
						fm.popEPCFailureLocation('networkTopology');
					}
				}
			},
			error: function (data) {
			}
		});
	},
	
	// 레이어팝업 show
	showLayer: function (showLayerName) {
		var
			bodySelector = $("body"),
			selected = $("#" + showLayerName);

		var
			centerX = bodySelector.outerWidth()/2,
			centerY = bodySelector.outerHeight()/2,
			layerCenterX = selected.outerWidth()/2,
			layerCenterY = selected.outerHeight()/2;

		selected.css({'top':centerY-layerCenterY+25, 'left':centerX-layerCenterX});

		$("#divDialogTrend").hide();
		$("#divPerformanceDetail").hide();
		$("#divFailureDetail").hide();

		$("#divDialogBackground").show();
		selected.show();
	},
	
	// 검색날짜를 search form 에 셋팅
	validationAndSetDate: function (searchForm, type) {
		var $sDate = $("#start-date-" + type).val();
		var $eDate = $("#end-date-" + type).val();
		var returnBool = true;
	
		var startDate = $sDate.substr(0,4) + $sDate.substr(5,2) + $sDate.substr(8,2);
		var startHour = $("#start-hour-" + type).val();
		var startMin = $("#start-min-" + type).val();
	
		var endDate = $eDate.substr(0,4) + $eDate.substr(5,2) + $eDate.substr(8,2);
		var endHour = $("#end-hour-" + type).val();
		var endMin = $("#end-min-" + type).val();
	
		var startTime = $sDate + " " + startHour + ":" + startMin;
		var endTime = $eDate + " " + endHour + ":" + endMin;
	
		var startDateTime = new Date(startTime).format("yyyy/MM/dd HH:mm");
		var endDateTime = new Date(endTime).format("yyyy/MM/dd HH:mm");
	
		if((new Date(endDateTime).getTime() - new Date(startDateTime).getTime())/1000/3600 < 0){
			alert('조회 범위가 잘못되었습니다.');
			returnBool = false;
		}else if((new Date(endDateTime).getTime() - new Date(startDateTime).getTime())/1000/3600 > 12){
			alert('최대 12시간 조회만 가능합니다.');
			returnBool = false;
		}
		else {
			nwtDetail.params.startTime = startDate + startHour + startMin;
			nwtDetail.params.eventTime = endDate + endHour + endMin;
			// searchForm.search_date_start_hour.value = startHour;
			// searchForm.search_date_start_min.value = startMin;
			// searchForm.search_date_end.value = endDate;
			// searchForm.search_date_end_hour.value = endHour;
			// searchForm.search_date_end_min.value = endMin;
			returnBool = true;
		}
	
		return returnBool;
	},
	
	performData: {},

	getSystemList: function () {
		systemListAjax = $.ajax({
			type: 'post',
			url: '/integration/monitor/network/grid/systemList',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(nwtDetail.params)
		});

		systemListAjax.then(function (data) {
			
			// 고장알람팝업 셀렉트박스
			var systemListSelect = $('select[name=systemListSelect]');
			systemListSelect.empty();
			systemListSelect.append('<option value="">전체</option>');
			data.systemList.map(function (v, i) {
				systemListSelect.append('<option value="' + v.SYSTEM_ID + '">' + v.SYSTEM_NAME + '</option>');
			});
			
			// 해제알람팝업 셀렉트박스
			var systemRcListSelect = $('select[name=systemRcListSelect]');
			systemRcListSelect.empty();
			systemRcListSelect.append('<option value="">전체</option>');
			data.systemList.map(function (v, i) {
				systemRcListSelect.append('<option value="' + v.SYSTEM_ID + '">' + v.SYSTEM_NAME + '</option>');
			});
		});
	},
	

	getMinSeverity: function (level, prevLevel) {
		var lvl = 0;
		if(prevLevel !== 0) {
			lvl = (level >= prevLevel) ? prevLevel : level;
		} else {
			lvl = level;
		}

		return lvl;
	},

	convertLevelToClassName: function (level) {
		return {
			1 : "critical",
			2 : "major"
		}[level];
	},

	setPortLevel: function (portStateElm, level, prevLevel) {
//		console.log(portStateElm.className);

		if(portStateElm.className === 'port'
			|| portStateElm.className === 'port normal') {
			portStateElm.className = 'port ' + nwtDetail.convertLevelToClassName(level);
		} else {
			portStateElm.className = 'port ' + nwtDetail.convertLevelToClassName(nwtDetail.getMinSeverity(level, prevLevel));
		}
	},
	_mouseOver : function(event,obj){
		$('#poptooltip').css('display','block');
		var pos = nwtDetail.abspos(event);
		var tooltipText = $(obj).data('title');
		$('#poptooltip').css('left',(pos.x+10)+'px');
		$('#poptooltip').css('top',(pos.y-45)+'px');
		$('#poptooltip li.mu-popup-li').text(tooltipText);
	},
	abspos : function (e){
		this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
		this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
		return this;
	},
	_mouseOut : function(event) {
		$('#poptooltip').css('display','none');
		$('#poptooltip li.mu-popup-li').text("");
	}
};
