$(document).ready(function(){
	TRAIN_MONITOR.quneeInit();
	$("body").append("<div class='Q-Tooltip'></div>");
	// TRAIN_MONITOR.setContextMenu();
	TRAIN_MONITOR.tabs();
	// resize 이벤트 등록
	window.onresize = function () {
		TRAIN_MONITOR.browserSize = {
			width: document.body.clientWidth,
			height: document.body.clientHeight
		};
		TRAIN_MONITOR.graph.zoomToOverview();	// Qunee 영역 해상도에 맞게 줌처리
	};
	// $(window).resize(function(){
	// 	TRAIN_MONITOR.graph.zoomToOverview();	// Qunee 영역 해상도에 맞게 줌처리
	// }).resize();

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

	//가청, 감시 ON
	$(".top-buttons").addClass("mu-toggle-on");
	//가청, 감시 버튼 활성화
	TRAIN_MONITOR.topButtons();

	// //역사 정보
	// getStationInfo();
	//
	// var stationLocationData = $.ajax({
	// 	type: 'post',
	// 	url: '/integration/monitor/train/stationlocationinfo',
	// 	contentType: 'application/json',
	// 	dataType: 'json'
	// });
	//
	// stationLocationData.then(function (data) {
	// 	$(data.stationLocationInfo).each(function (idx, value) {
	// 		createStationNode(value);
	// 	});
	// 	setRefresh();
	// },
	// function (error) {
	// 	console.error(error);
	// });
	
	setInterval(function() {
		var now = new Date();
		var hour = now.getHours();
		var min = now.getMinutes();
		
		if((hour+"").length < 2){
			hour="0"+hour;      
		}
		if((min+"").length < 2){
			min="0"+min;      
		}

		if(hour+":"+min == "00:00") {
			location.reload(true);
		}
		
	}, 60000);

});

var TRAIN_MONITOR = {
	graph: '',
	line1: '',
	initPage: undefined,

	browserSize: {width: 0, height: 0},

	params: {},
	isFirst: true,
	soundFlag: true,
	watchFlag: true,
	refresh: '',
	tabFlag: '',
	trainNo: '',
	phone1: '',
	phone2: '',
	monitorTime: '',
	trainId: new Map(),
	train_map: new Map(),
	station_map: new Map(),

	performanceTime: '',
	chartFlag: {
		'#tab1': '',
		'#phone1': '',
		'#phone2': ''
	},

	stationData: undefined,
	trackingData: undefined,

	alarmLvlGlobal: 0,
	maxAlarm: 0,

	//0: Critical
	//1: Major
	//2: Minor
	alarmCntTop: [0, 0, 0, 0],

	//성능 알람 카운트 초기화
	initLevelCount: function () {
		TRAIN_MONITOR.alarmCntTop = [0, 0, 0, 0];
	},

	// 성능 알람 카운트 계산
	setLevelCount: function (level) {
		TRAIN_MONITOR.alarmCntTop[Number(level) - 1]++;
	},

	// 화면을 재구성 (Qunee)
	displayUI: function (params) {
		params.filterLevel = params.filterLevel || 0;
		TRAIN_MONITOR.initLevelCount();
		TRAIN_MONITOR.getTrainInfo(params);

		Promise.all([TRAIN_MONITOR.trackingData]).then(function() {
			TRAIN_MONITOR.displayLevelCount();
			TRAIN_MONITOR.alarmSound();
			if (TRAIN_MONITOR.maxAlarm == 0) {
				if (TRAIN_MONITOR.soundFlag) {
					audioFunction.audioPuse();
					audioFunction.audioPlay();
				}
			} else if (TRAIN_MONITOR.alarmLvlGlobal < TRAIN_MONITOR.maxAlarm) {
				if (TRAIN_MONITOR.soundFlag) {
					audioFunction.audioPuse();
					audioFunction.audioPlay();
				}
			}
			TRAIN_MONITOR.maxAlarm = TRAIN_MONITOR.alarmLvlGlobal;
			TRAIN_MONITOR.setRefresh();
		});
	},

	// 성능 알람 카운트 표시
	displayLevelCount: function () {
		$("#cntAllLevel1").html(TRAIN_MONITOR.alarmCntTop[0]);
		$("#cntAllLevel2").html(TRAIN_MONITOR.alarmCntTop[1]);
		$("#cntAllLevel3").html(TRAIN_MONITOR.alarmCntTop[2]);
	},

	quneeInit: function () {
		Q.registerImage("bg", "/resources/images/map/bg.png");
		Q.registerImage("transfer_station", "/resources/images/map/transfer_station.png");
		Q.registerImage("train" , "/resources/images/map/train.png");
		Q.registerImage("train_reverse" , "/resources/images/map/train_reverse.png");

		TRAIN_MONITOR.graph = new Q.Graph('topology');
		TRAIN_MONITOR.graph.isEditable = false;
		TRAIN_MONITOR.graph.isMovable = false;
		TRAIN_MONITOR.graph.isResizable = false;
		TRAIN_MONITOR.graph.isRotatable = false;
		TRAIN_MONITOR.graph.isSelectable = false;
		TRAIN_MONITOR.graph.enableWheelZoom = false;
		TRAIN_MONITOR.graph.enableTooltip = true;
		TRAIN_MONITOR.graph.tooltipDelay = 0;
		TRAIN_MONITOR.graph.tooltipDuration = 10000000;

		TRAIN_MONITOR.graph.interactionMode = Q.MoveInteraction();

		var group = TRAIN_MONITOR.createBackgroundNode("", 0, 0, "/resources/images/map/mobileLocationBackground.png");

		TRAIN_MONITOR.line1 = TRAIN_MONITOR.graph.createShapeNode("");
		TRAIN_MONITOR.line1.moveTo(900, -220);
		TRAIN_MONITOR.line1.lineTo(322, -220);
		TRAIN_MONITOR.line1.curveTo(282, -220, 282, -185, 282, -185);
		TRAIN_MONITOR.line1.lineTo(282, 206);
		TRAIN_MONITOR.line1.curveTo(282, 246, 242, 246, 242, 246);
		TRAIN_MONITOR.line1.lineTo(-764, 246);
		TRAIN_MONITOR.line1.curveTo(-804, 246, -804, 206, -804, 206);
		TRAIN_MONITOR.line1.lineTo(-804, -220);
		//line.closePath();
		TRAIN_MONITOR.line1.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#F46A23");
		//line.setStyle(Q.Styles.SHAPE_LINE_DASH, [8, 5, 0.1, 6]);
		TRAIN_MONITOR.line1.setStyle(Q.Styles.SHAPE_STROKE, 12);
		//line.setStyle(Q.Styles.LINE_CAP, "round");
		//line.setStyle(Q.Styles.SHAPE_OUTLINE_STYLE, "#fcfb9b");
		TRAIN_MONITOR.line1.setStyle(Q.Styles.LAYOUT_BY_PATH, false);
		TRAIN_MONITOR.line1.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);

		group.addChild(TRAIN_MONITOR.line1);

		TRAIN_MONITOR.graph.html.style.visibility = 'hidden';
		TRAIN_MONITOR.graph.navigationType = "navigation.none";

		var ui = "";
		TRAIN_MONITOR.graph.addCustomInteraction({
			onclick: function (evt, graph) {
				// Q.log("click");
				ui = graph.getUIByMouseEvent(evt);
				if (ui && ui.data.clickable) {
					TRAIN_MONITOR.phone1 = ui.data.phone1;
					TRAIN_MONITOR.phone2 = ui.data.phone2;
					TRAIN_MONITOR.trainNo = ui.data.name;
					TRAIN_MONITOR.tabFlag = true;
					TRAIN_MONITOR.tabs();
					TRAIN_MONITOR.qualityTrend('T');
				}
				// graph.popupmenu.hide();	// 우클릭 메뉴 숨기기
			},
			// ondblclick: function(evt, graph){
			// 	Q.log("dblclick");
			// 	var ui = graph.getUIByMouseEvent(evt);
			// 	if(ui && ui.data.dblclickable){
			// 		alert("Double Clicked at - '" + ui.data.name + "'");
			// 	}
			// },
			onmousemove: function(evt, graph){
				ui = graph.getUIByMouseEvent(evt);
				if(!ui || !ui.data.clickable) {
					$(".Q-Tooltip").empty();
				}
				if(ui && ui.data.clickable){
					var qTooltip = $(".Q-Tooltip");

					qTooltip.empty();
					qTooltip.append(ui.data.tooltip);

					var tooltipWidth = evt.clientX + qTooltip.width();

					if(tooltipWidth > TRAIN_MONITOR.browserSize.width) {
						qTooltip.css("left", TRAIN_MONITOR.browserSize.width - 20 - qTooltip.width());
						qTooltip.css("top", evt.clientY);
					} else {
						qTooltip.css("left", evt.clientX);
						qTooltip.css("top", evt.clientY);
					}

					graph.cursor = "pointer";
				} else {
					graph.cursor = "default";
					return;
				}
			}
		});

		var mapData = $.getJSON("/resources/json/map1.json");
		mapData.then(function (data) {
			data.stations.forEach(function(s){
				var point = TRAIN_MONITOR.graph.createNode(s.name, s.x, s.y);
				if(s.transfer == 'true') {
					point.setStyle(Q.Styles.SHAPE_STROKE, 0);
					point.image = "transfer_station";
				} else {
					point.setStyle(Q.Styles.SHAPE_STROKE, 4);
					point.setStyle(Q.Styles.SHAPE_STROKE_STYLE, '#F46A23');
					point.image = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 18, 18);
				}

				if(s.id >= 101 && s.id <= 117) {
					point.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(80, 60, -80, 110));
					point.setStyle(Q.Styles.LABEL_ROTATE, Math.PI / 4);
					point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
					point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_BOTTOM);
				} else if(s.id >= 126 && s.id <= 134) {
					point.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(0,40, 40, 30));
					point.setStyle(Q.Styles.LABEL_ROTATE, -Math.PI / 4);
					point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
					point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_BOTTOM);
				} else if(s.id >= 118 && s.id <= 125) {
					// point.setStyle(Q.Styles.LABEL_PADDING, 60);
					point.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(60, 60, 60, 0));
					point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_MIDDLE);
					point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_MIDDLE);
				}
				// else if(s.id <= 100) {
				else {
					//동매 100, 장림 199, 신장림 198, 낫개 197, 다대포항 196, 다대포해수욕장 195
					// point.setStyle(Q.Styles.LABEL_PADDING, 60);
					point.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(60, 0, 60, 60));
					point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_MIDDLE);
					point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.RIGHT_MIDDLE);
				}
				// else {
				// 	point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
				// 	point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
				// }

				point.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
				point.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
				point.setStyle(Q.Styles.SHAPE_FILL_COLOR, '#FFF');

				point.zIndex = 10;

				TRAIN_MONITOR.line1.addChild(point);

				TRAIN_MONITOR.station_map.put(s.id, {x:s.x, y:s.y});
			});
		});
		Promise.all([mapData]).then(function() {
			// 역 정보를 가져온다.
			TRAIN_MONITOR.getStationInfo();

			// 감시시간 호출
			TRAIN_MONITOR.getMonitorTime();

			Promise.all([TRAIN_MONITOR.initPage]).then(function() {
				// 차상단말 성능 트렌드 호출
				TRAIN_MONITOR.qualityTrend('A');
			});
		});

		TRAIN_MONITOR.preLoadImages(TRAIN_MONITOR.graph, function(){
			// 이미지 전부 로드 후 토폴로지 표시 및 사이즈 조정
			TRAIN_MONITOR.graph.html.style.visibility = 'visible';
			// TRAIN_MONITOR.graph.zoomToOverview();
		});
	},

	//Qunee - Node 생성 (백그라운드용)
	createBackgroundNode: function (title, x, y, imageName) {
		var bgNode = TRAIN_MONITOR.graph.createNode(title, x, y);
		bgNode.image = imageName;
		bgNode.tooltip = title;

		return bgNode;
	},

	createStationNode: function (data) {
		var x = Number(data.POSITION_X);
		var y = Number(data.POSITION_Y);
		var point = TRAIN_MONITOR.graph.createNode(data.STATION_NAME, x, y);
		if (data.TRANSFER_FLAG === 1) {
			point.setStyle(Q.Styles.SHAPE_STROKE, 0);
			point.image = "transfer_station";
		} else {
			point.setStyle(Q.Styles.SHAPE_STROKE, 4);
			point.setStyle(Q.Styles.SHAPE_STROKE_STYLE, '#F46A23');
			point.image = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 18, 18);
		}

		point.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(0, 40, 40, 0));

		if ((data.LOCATION >= 126 && data.LOCATION <= 134) || (data.LOCATION >= 101 && data.LOCATION <= 117)) {
			point.setStyle(Q.Styles.LABEL_ROTATE, -Math.PI / 4);
			point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
			point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_BOTTOM);
		} else if (data.LOCATION >= 118 && data.LOCATION <= 125) {
			point.setStyle(Q.Styles.LABEL_PADDING, 60);
			point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_MIDDLE);
			point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_MIDDLE);
		} else {
			point.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
			point.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
        }

		point.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
		point.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
		point.setStyle(Q.Styles.SHAPE_FILL_COLOR, '#FFF');
		// point.zIndex = 10;

		TRAIN_MONITOR.line1.addChild(point);

		TRAIN_MONITOR.station_map.put(data.LOCATION, {x: data.POSITION_X, y: data.POSITION_Y});
	},

	findAllImagesInGraph: function (graph) {
		var REG_IMAGES = /.(jpg|png|gif)$/gi;
		var images = {};
		graph.forEach(function (element) {
			if (Q.isString(element.image) && REG_IMAGES.test(element.image)) {
				images[element.image] = true;
			}
		});
		var result = [];
		for (var image in images) {
			result.push(image);
		}
		return result;
	},

	preLoadImages: function (images, callback) {
		if (images instanceof Q.Graph) {
			images = TRAIN_MONITOR.findAllImagesInGraph(images);
		}
		var imageCount = images.length;
		var index = 0;
		images.forEach(function (url) {
			TRAIN_MONITOR.preLoadImage(url, function () {
				index++;
				if (index == imageCount) {
					//all images pre loaded
					callback();
				}
			});
		});
	},

	preLoadImage: function (url, callback) {
		var image = new Image();
		image.onload = function () {
			callback();
		};
		image.src = url;
	},

	createTrain: function (data) {
		// console.log(typeof data.DIRECTION, typeof data.OP_CODE);
		var train = TRAIN_MONITOR.graph.createNode("" + data.TRAIN_NO);
	//				train.setStyle(Q.Styles.SHAPE_FILL_COLOR, '#ff0000');
	// 	console.log(data);
		if((data.STATION_ID >= 100 && data.STATION_ID <= 134) || (data.STATION_ID >= 195 && data.STATION_ID <= 199)) {
		}

		train.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
		train.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_BOTTOM);
		train.setStyle(Q.Styles.LABEL_PADDING, -10);
		// train.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
		train.setStyle(Q.Styles.LABEL_COLOR, "#ffffff");
		train.zIndex = 20;
		train.clickable = true;
		// train.dblclickable = true;
		train.trainNo = "" + data.TRAIN_NO;
		train.lastStatoin = data.LAST_STATION_NAME;
		train.phone1 = data.PHONE_1;
		train.phone2 = data.PHONE_2;
		train.monitor_time = data.MONITOR_TIME;
		TRAIN_MONITOR.trainId.put(data.TRAIN_NO, train.id);
		TRAIN_MONITOR.train_map.put(data.TRAIN_NO, train);

		return train;
	},


	trainLocation: function (train, data) {
		var
			direction = data.DIRECTION,
			opCode = data.OP_CODE,
			station = data.STATION_ID,
			lastStation = data.LAST_STATION_ID;

		train.lastStation = lastStation;
		train.direction = direction;
		train.opCode = opCode;
		train.station = station;
		train.name = train.trainNo;
		train.size = {height: 20};
		if (TRAIN_MONITOR.station_map.get(station) !== null) {
			switch (direction) {
				case 2 :	// 상행(신평(다대포해수욕장 -> 노포)
					train.setStyle(Q.Styles.LABEL_COLOR, "#00FF0D");
					train.image = "train_reverse";
					switch (opCode) {
						case 177 :	// 출발
							if (station === 100) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 7;
							} else if (station === 117) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 4;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station === 125) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 101 && station <= 116) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 15;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 126 && station <= 133) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 10;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 118 && station <= 124) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 25;
							} else if (station >= 195 && station <= 199) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 25;
							}
							break;
						case 178 :	// 도착
							if (station >= 101 && station <= 117) {
								train.x = TRAIN_MONITOR.station_map.get(station).x;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 126 && station <= 134) {
								train.x = TRAIN_MONITOR.station_map.get(station).x;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 118 && station <= 125) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y;
							} else if ((station >= 195 && station <= 199) || station === 100) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y;
							}
							break;
						case 179 :	// 접근
							if (station === 101) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 15;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45
							} else if (station === 118) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 35;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 5
							} else if (station === 126) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 55;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 15
							} else if (station >= 102 && station <= 117) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 15;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 127 && station <= 134) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 8;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 45;
							} else if (station >= 119 && station <= 125) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 20;
							} else if ((station >= 196 && station <= 199) || station === 100) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 25;
							} else if (station === 195) {
								// 다대포해수욕장으로 접근하는 차량을 화면에 보이지 않도록
								train.image = "";
								train.name = "";
							}
							break;
					}
					break;
				case 1 :	// 하행(노포 -> 신평(다대포해수욕장)
					train.image = "train";
					switch (opCode) {
						case 177 :	// 출발
							if (station === 101) {
								//신평역을 출발하여 동매역으로 가는 지하철
								train.x = TRAIN_MONITOR.station_map.get(station).x - 45;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 25;
							} else if (station === 118) {
								// 범내골역을 출발하여 범일골로 가는 지하철
								train.x = TRAIN_MONITOR.station_map.get(station).x + 35;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 25;
							} else if (station === 126) {
								// 명륜역을 출발하여 동래골로 가는 지하철
								train.x = TRAIN_MONITOR.station_map.get(station).x + 5;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 45;
							} else if (station >= 102 && station <= 117) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 25;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 35;
							} else if (station >= 127 && station <= 134) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 25;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 35;
							} else if (station >= 119 && station <= 125) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 25;
							} else if ((station >= 196 && station <= 199) || station === 100) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 25;
							}
							break;
						case 178 :	// 도착
							if (station >= 101 && station <= 117) {
								train.x = TRAIN_MONITOR.station_map.get(station).x;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 35;
							} else if (station >= 126 && station <= 134) {
								train.x = TRAIN_MONITOR.station_map.get(station).x;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 35
							} else if (station >= 118 && station <= 125) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y;
							} else if ((station >= 195 && station <= 199) || station === 100) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y;
							}
							break;
						case 179 :	// 접근
							if (station === 100) {
								//동매역으로 접근
								train.x = TRAIN_MONITOR.station_map.get(station).x - 25;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 45;
							} else if (station === 117) {
								//범일로 접근
								train.x = TRAIN_MONITOR.station_map.get(station).x + 40;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 25;
							} else if (station === 125) {
								//동래역으로 접근
								train.x = TRAIN_MONITOR.station_map.get(station).x + 40;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 25;
							} else if (station >= 101 && station <= 116) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 25;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 35;
							} else if (station >= 126 && station <= 133) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 25;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 35;
							} else if (station >= 118 && station <= 124) {
								train.x = TRAIN_MONITOR.station_map.get(station).x + 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y - 25;
							} else if (station >= 195 && station <= 199) {
								train.x = TRAIN_MONITOR.station_map.get(station).x - 38;
								train.y = TRAIN_MONITOR.station_map.get(station).y + 25;
							} else if (station === 134) {
								//노포역으로 접근하는 차량을 화면에 보이지 않도록
								train.image = "";
								train.name = "";
							}
							break;
					}
					break;
			}

			TRAIN_MONITOR.train_map.put(train.trainNo, train);

		} else {
			console.log("Not station info");
		}
	},

	levelText: function (level) {
		return {
			1 : "Critical",
			2 : "Major",
			3 : "Minor",
			4 : "Normal",
			5 : ""
		}[level];
	},

	levelColor: function (level) {
		return {
			1: "red",
			2: "#eb8206",
			3: "yellow",
			4: "green",
			5: ""
		}[level];
	},

	containsTrainNo: function (old_train_no, new_train_no_arr) {
		return new_train_no_arr.some(function(new_train_no) {
			return old_train_no === new_train_no;
		});
	},

	// 열차 정보 가져와서 위치 이동
	getTrainInfo: function (params) {
		var train;
		TRAIN_MONITOR.trackingData = $.ajax({
			type: 'post',
			url: '/integration/monitor/train/traininfo',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params)
		});

		TRAIN_MONITOR.trackingData.then(function (data) {
			// console.log(data.trainInfo.trackingInfo);
			// console.log(data.trainInfo.trainNoArr);
			var train_map_keys = TRAIN_MONITOR.train_map.keys();
			if(train_map_keys.length !== 0) {
				train_map_keys.forEach(function (old_train_no) {
					// 이전 열차 번호가 새로 갱신된 열차 번호 배열에 있다면 해당 열차 객체는 유지
					// 배열에 없다면 해당 객체는 삭제
					if(!TRAIN_MONITOR.containsTrainNo(old_train_no, data.trainInfo.trainNoArr)) {
						TRAIN_MONITOR.graph.removeElement(TRAIN_MONITOR.trainId.get(old_train_no));
						TRAIN_MONITOR.trainId.remove(old_train_no);
						TRAIN_MONITOR.train_map.remove(old_train_no);
						// console.log('delete: ', old_train_no);
						// console.log(TRAIN_MONITOR.trainId.get(old_train_no));
						// console.log(data.trainInfo.trackingInfo);
						// console.log(TRAIN_MONITOR.graph);
						// console.log('------------------');
					}
				});
			}

			$(data.trainInfo.trackingInfo).each(function(i, row){
				if(TRAIN_MONITOR.train_map.get(row.TRAIN_NO) === undefined) {
					train = TRAIN_MONITOR.createTrain(row);
					// console.log('create: ', row.TRAIN_NO);
					// console.log(data.trainInfo.trackingInfo);
					// console.log(TRAIN_MONITOR.graph);
					// console.log('------------------');
				} else {
					train = TRAIN_MONITOR.train_map.get(row.TRAIN_NO);
				}
				TRAIN_MONITOR.trainLocation(train, row);
			});
			var qualityInfo = data.trainInfo.qualityInfo;

			//툴팁 알람등급을 위한 변수
			var tooltipLevel = 4,
				sndAttRateLvl = 4,
				sndSuccRateLvl = 4,
				recvAttRateLvl = 4,
				recvSuccRateLvl = 4;

			var phoneNo = '';
			var name = '';
			var opCode = '';

			var $tooltip = $('#tooltipTable');
			var tooltipContent = '';
			for(var i = 0, q = qualityInfo.length; i < q; i += 1) {
				if (i % 2 === 0) {
					// console.log(qualityInfo[i].TRAIN_NO);
					train = TRAIN_MONITOR.train_map.get(qualityInfo[i].TRAIN_NO);
					// console.log(train);
					opCode = train.opCode;
					// console.log(train, opCode);
				}

				if((train.lastStation !== train.station || train.opCode !== 177) && train.name !== '') {
					if (i % 2 === 0) {
						$tooltip.empty();
						tooltipContent = '';
						name = train.name;

						// document.querySelector('.mu-tooltip-header.main').textContent
						// 	= train.lastStatoin + "행 " + name + "호(" + TRAIN_MONITOR.monitorTime.substr(11, 5) + ")";

						document.querySelector('.mu-tooltip-header.main').textContent
							= train.lastStatoin + "행 " + name + "호(" + train.monitor_time.substr(11, 5) + ")";

						document.querySelector('.mu-tooltip-header.sub').textContent
							= TRAIN_MONITOR.stationData[train.station] + " " + TRAIN_MONITOR.opCodeText(opCode);

						tooltipLevel = qualityInfo[i]["LEVEL"];
					} else {
						tooltipLevel = tooltipLevel <= qualityInfo[i].LEVEL ? tooltipLevel : qualityInfo[i].LEVEL;
					}

					phoneNo = qualityInfo[i]["PHONE_NO"];

					sndAttRateLvl = qualityInfo[i]["SND_ATT_RATE_LEVEL"] === 4 ? 5 : qualityInfo[i]["SND_ATT_RATE_LEVEL"];		//발신시도호 증감율 레벨
					sndSuccRateLvl = qualityInfo[i]["SND_SUCC_RATE_LEVEL"] === 4 ? 5 : qualityInfo[i]["SND_SUCC_RATE_LEVEL"];	//발신성공율 레벨
					recvAttRateLvl = qualityInfo[i]["RECV_ATT_RATE_LEVEL"] === 4 ? 5 : qualityInfo[i]["RECV_ATT_RATE_LEVEL"];	//착신시도호 증감율 레벨
					recvSuccRateLvl = qualityInfo[i]["RECV_SUCC_RATE_LEVEL"] === 4 ? 5 : qualityInfo[i]["RECV_SUCC_RATE_LEVEL"];//착신성공율 레벨

					tooltipContent += '<tr>';
					tooltipContent += '<td rowspan="3" class="phoneNo">' + phoneNo + '</td>';
					tooltipContent += '<td>개별통화시도호</td>';
					tooltipContent += '<td>' + qualityInfo[i]["SND_ATTEMPT"] + '</td>';
					tooltipContent += '<td>' + qualityInfo[i]["RECV_ATTEMPT"] + '</td>';
					tooltipContent += '</tr>';
					// tooltipContent += '<tr>';
					// tooltipContent += '<td>시도호 증감율(%)</td>';
					// tooltipContent += '<td style="color: ' + TRAIN_MONITOR.levelColor(sndAttRateLvl) + ';">' + qualityInfo[i]["SND_ATT_RATE"] + '</td>';
					// tooltipContent += '<td style="color: ' + TRAIN_MONITOR.levelColor(recvAttRateLvl) + ';">' + qualityInfo[i]["RECV_ATT_RATE"] + '</td>';
					// tooltipContent += '</tr>';
					// tooltipContent += '<tr>';
					tooltipContent += '<td>성공호</td>';
					tooltipContent += '<td>' + qualityInfo[i]["SND_SUCCESS"] + '</td>';
					tooltipContent += '<td>' + qualityInfo[i]["RECV_SUCCESS"] + '</td>';
					tooltipContent += '</tr>';
					tooltipContent += '<tr>';
					tooltipContent += '<td>성공율(%)</td>';
					tooltipContent += '<td style="color: ' + TRAIN_MONITOR.levelColor(sndSuccRateLvl) + ';">' + qualityInfo[i]["SND_SUCC_RATE"] + '</td>';
					tooltipContent += '<td style="color: ' + TRAIN_MONITOR.levelColor(recvSuccRateLvl) + ';">' + qualityInfo[i]["RECV_SUCC_RATE"] + '</td>';
					tooltipContent += '</tr>';

					if (i % 2 === 1) {
						tooltipContent += '<tr class="rating">';
						tooltipContent += '<td>알람등급</td>';
						tooltipContent += '<td colspan="3"><span class="' + TRAIN_MONITOR.levelText(tooltipLevel).toLowerCase() + '">' + TRAIN_MONITOR.levelText(tooltipLevel) + '</span></td>';
						tooltipContent += '</tr>';

						$tooltip.append(tooltipContent);

						TRAIN_MONITOR.setLevelCount(tooltipLevel);

						var tooltip = document.getElementById('tooltip');
						var tooltipText = tooltip.outerHTML;

						tooltipText = tooltipText.replace('display:none;', '');

						train.tooltip = tooltipText;
						train.setStyle(Q.Styles.BACKGROUND_COLOR, TRAIN_MONITOR.levelColor(tooltipLevel === 4 ? "" : tooltipLevel));
					}
				}
			}
			TRAIN_MONITOR.browserSize = {
				width: document.body.clientWidth,
				height: document.body.clientHeight
			};
			TRAIN_MONITOR.graph.zoomToOverview();
		},
		function (error) {
			console.error(error);
		});
	},

	opCodeText: function (code) {
		return {
			"177" : "출발",
			"178" : "도착",
			"179" : "접근 중"
		}[code];
	},

	getMonitorTime: function () {
		TRAIN_MONITOR.initPage = $.ajax({
			type:'post',
			url:'/integration/monitor/train/monitortime',
			contentType: 'application/json',
			dataType : 'json',
			success : function(data) {
				$('.timeWrap').text(setDate());
				if(TRAIN_MONITOR.performanceTime === '') {
					isFirst = true;
					TRAIN_MONITOR.params.eventTime = TRAIN_MONITOR.performanceTime = data.PERFORMANCE_TIME;
				} else if(TRAIN_MONITOR.performanceTime !== data.PERFORMANCE_TIME) {
					if(isFirst === true) {
						isFirst = false;
					}
					TRAIN_MONITOR.params.eventTime = TRAIN_MONITOR.performanceTime = data.PERFORMANCE_TIME;
				}
				TRAIN_MONITOR.displayUI(TRAIN_MONITOR.params);
			},
			error : function(xhr, stat, err) {
				console.log(stat);
			}
		});
	},

	qualityTrend: function (flag) {
		var params = {};
		var trainTab = $("#trainNo").find('a');

		if(flag === 'T') {
			trainTab.empty();
			trainTab.text(TRAIN_MONITOR.trainNo);
			params.trainNo = TRAIN_MONITOR.trainNo;

			var
				$phone1 = $('#phone1'),
				$phone2 = $('#phone2');

			// if($phone1.highcharts() !== undefined) {
			// 	$phone1.highcharts().destroy();
			// 	$phone1.empty();
			// }
			// if($phone2.highcharts() !== undefined) {
			// 	$phone2.highcharts().destroy();
			// 	$phone2.empty();
			// }
			//
			// console.log($phone1.highcharts());
			// console.log($phone2.highcharts());
		}

		params.startEventTime = '';
		params.endEventTime = TRAIN_MONITOR.performanceTime;

		$.ajax({
			type: 'post',
			url: '/integration/monitor/train/trend',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params),
			success: function (data) {
				data = data.trainQualityInfo;
				if(flag === 'T') {
					var
						phoneNo = data.PHONE_NO,
						sendAtmp,
						sendSuccRate,
						recvAtmp,
						recvSuccRate,
						category;

					// console.log($phone1.highcharts(), $phone2.highcharts());

					if($phone1.highcharts() !== undefined) {
						sendAtmp = $phone1.highcharts().series[0];
						sendSuccRate = $phone1.highcharts().series[1];
						recvAtmp = $phone1.highcharts().series[2];
						recvSuccRate = $phone1.highcharts().series[3];
						category = $phone1.highcharts().xAxis[0];

						setTimeout(function () {
							category.update({categories: data[phoneNo[0].PHONE_NO].CATEGORY});
						}, 0);
						sendAtmp.setData(data[phoneNo[0].PHONE_NO].SEND_ATTEMPTS, true);
						sendSuccRate.setData(data[phoneNo[0].PHONE_NO].SEND_SUCC_RATES, true);
						recvAtmp.setData(data[phoneNo[0].PHONE_NO].RECV_ATTEMPTS, true);
						recvSuccRate.setData(data[phoneNo[0].PHONE_NO].RECV_SUCC_RATES, true);

						$phone1.highcharts().setTitle({text: phoneNo[0].PHONE_NO});
					} else {
						TRAIN_MONITOR.drawChart("#phone1", data[phoneNo[0].PHONE_NO], 930, 200, flag);
					}

					if($phone2.highcharts() !== undefined) {
						sendAtmp = $phone2.highcharts().series[0];
						sendSuccRate = $phone2.highcharts().series[1];
						recvAtmp = $phone2.highcharts().series[2];
						recvSuccRate = $phone2.highcharts().series[3];
						category = $phone2.highcharts().xAxis[0];

						setTimeout(function () {
							category.update({categories: data[phoneNo[1].PHONE_NO].CATEGORY});
						}, 0);
						sendAtmp.setData(data[phoneNo[1].PHONE_NO].SEND_ATTEMPTS, true);
						sendSuccRate.setData(data[phoneNo[1].PHONE_NO].SEND_SUCC_RATES, true);
						recvAtmp.setData(data[phoneNo[1].PHONE_NO].RECV_ATTEMPTS, true);
						recvSuccRate.setData(data[phoneNo[1].PHONE_NO].RECV_SUCC_RATES, true);

						$phone2.highcharts().setTitle({text: phoneNo[1].PHONE_NO});
					} else {
						TRAIN_MONITOR.drawChart("#phone2", data[phoneNo[1].PHONE_NO], 930, 200, flag);
					}
				} else if(flag === 'A') {
					TRAIN_MONITOR.drawChart('#tab1', data, 1850, 200, flag);
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});

	},

	qualityTrendRealtime: function (flag) {
		var params = {};

		if(flag === 'T') {
			params.trainNo = $("#trainNo").find('a').text();
		}

		params.eventTime = TRAIN_MONITOR.performanceTime;

		$.ajax({
			type: 'post',
			url: '/integration/monitor/train/lastTrend',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params),
			success: function (data) {
				data = data.trainQualityInfo;
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	drawChart: function (chartId, data, w, h, flag) {
		var ticInterval = 1;
		var maxCnt = 8;
		var timeCount = data.CATEGORY ? data.CATEGORY.length : 0;
		if(timeCount > maxCnt) {
			ticInterval = Math.ceil(timeCount / maxCnt);
		}

		var legendX = 0;
		if(flag === 'A') {
			legendX = 0;
		} else {
			legendX = -250;
		}

		$(chartId).highcharts({
			chart: {
				height: h,
				width: w,
				zoomType: 'x',
				events: {
					load: function () {

						// set up the updating of the chart each second
						var
							sendAtmp = this.series[0],
							sendSuccRate = this.series[1],
							recvAtmp = this.series[2],
							recvSuccRate = this.series[3],
							category = this.xAxis[0];

						var test = data.CATEGORY;

						var
							params = {
								'trainNo': '',
								'phoneNo': '',
								'startEventTime': '',
								'endEventTime': ''
								// 'eventTime': ''
							};

						(function poll(){
							setTimeout(function(){
								if(!isFirst && TRAIN_MONITOR.performanceTime !== TRAIN_MONITOR.chartFlag[chartId]) {
									TRAIN_MONITOR.chartFlag[chartId] = TRAIN_MONITOR.performanceTime;
									// params.eventTime = TRAIN_MONITOR.performanceTime;


									if($(chartId).highcharts().title === undefined) {
										params.trainNo = '';
									} else {
										params.trainNo = $('#trainNo').find('a').text();
										params.phoneNo = $(chartId).highcharts().title.textStr;
									}

									params.endEventTime = TRAIN_MONITOR.performanceTime;

									$.ajax({
										type: 'post',
										url: '/integration/monitor/train/trend',
										contentType: 'application/json',
										dataType: 'json',
										data: JSON.stringify(params),
										success: function (data) {
											data = data.trainQualityInfo;
											setTimeout(function () {
												category.update({categories: data.CATEGORY});
											}, 0);
											sendAtmp.setData(data.SEND_ATTEMPTS, true);
											sendSuccRate.setData(data.SEND_SUCC_RATES, true);
											recvAtmp.setData(data.RECV_ATTEMPTS, true);
											recvSuccRate.setData(data.RECV_SUCC_RATES, true);
										},
										error: function () {
											//alert('에러발생');
										}
									});


									// $.ajax({
									// 	type: 'post',
									// 	url: '/integration/monitor/train/lastTrend',
									// 	contentType: 'application/json',
									// 	dataType: 'json',
									// 	data: JSON.stringify(params),
									// 	success: function (data) {
									// 		data = data.lastTrainQualityInfo;
									// 		console.log(data);
									//
									// 		test.splice(0, 1);
									// 		console.log(test);
									// 		test.push(TRAIN_MONITOR.performanceTime);
									//
									// 		console.log(test);
									//
									// 		sendAtmp.addPoint(data.SEND_ATTEMPTS, true, true);
									// 		sendSuccRate.addPoint(data.SEND_SUCC_RATES, true, true);
									// 		recvAtmp.addPoint(data.RECV_ATTEMPTS, true, true);
									// 		recvSuccRate.addPoint(data.RECV_SUCC_RATES, true, true);
									//
									// 		setTimeout(function () {
									// 			category.update({categories: test});
									// 		}, 0);
									// 	},
									// 	error: function () {
									// 		//alert('에러발생');
									// 	}
									// });
								}

								poll();
							}, 1000 * 10);
						})();


					},
					selection: function(event) {
						if (event.resetSelection) {
							try {
								setTimeout(function () {
									$(chartId).highcharts().xAxis[0].update({
										tickInterval: ticInterval
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
								setTimeout(function () {
									$(chartId).highcharts().xAxis[0].update({
										tickInterval: _ticInterval
									});
								}, 0);
							} catch (event) {
								// console.log(e);
							}
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			title:{
				text:data.PHONE_NO
			},
			xAxis: [{
				categories: data.CATEGORY,
				tickInterval: ticInterval
			}],
			yAxis: [{
				min: 0,
				title: {
					text: '호',
					// align: "high",
					rotation: 0,
					// offset: 0,
					// x: -7,
					// y: -15,
					style: {
						color: "#4572A6"
					}
				},
				labels: {
					//formatter: function () {
					//	return this.value;
					//},
					format: '{value}',
					style: {
						color: "#4572A6"
					}
				},
				showEmpty: false
			}, {
				min: 0,
				max: 100,
				//gridLineWidth: 0,
				title: {
					text: '율',
					// align: "high",
					rotation: 0,
					// offset: 0,
					// x: -15,
					// y: -15,
					style: {
						color: "#E07400"
					}
				},
				labels: {
					//formatter: function () {
					//	return this.value;
					//},
					x: -10,
					format: '{value}',
					style: {
						color: "#E07400"
					}
				},
				opposite: true,
				showEmpty: false
			}],
			tooltip: {
				shared: true
			},
			legend: {
				// layout: 'vertical',
				// align: 'right',
				// verticalAlign: 'middle',
				align: 'center',
				verticalAlign: 'top',
				x: legendX,
				y: 0,
				backgroundColor: '#FFFFFF',
				borderWidth: 0
			},
			//legendItemClick: function(event) {
			//	if (!this.visible)
			//		return false;
			//
			//	var seriesIndex = this.index;
			//	var series = this.chart.series;
			//
			//	for (var i = 0; i < series.length; i++) {
			//		if (series[i].index != seriesIndex) {
			//			series[i].visible ?
			//					series[i].hide();
			//					series[i].show();
			//		}
			//	}
			//	return false;
			//},
			plotOptions:{
				spline: {
					marker: {
						enabled: false
					}
				}
			},
			series: [{
				name: '발신 시도호',
				type: 'column',
				yAxis: 0,
				data: data.SEND_ATTEMPTS,
				color: "#4572A6",
				tooltip: {
					valueSuffix: ''
				},
				zIndex: 10
			},{
				name: '발신 성공율',
				type: 'spline',
				yAxis: 1,
				data: data.SEND_SUCC_RATES,
				color: "#E07400",
				tooltip: {
					valueSuffix: ''
				},
				zIndex: 20
			},{
				name: '착신 시도호',
				type: 'column',
				yAxis: 0,
				data: data.RECV_ATTEMPTS,
				color: "#8BC34A",
				tooltip: {
					valueSuffix: ''
				},
				zIndex: 11
			},{
				name: '착신 성공율',
				type: 'spline',
				yAxis: 1,
				data: data.RECV_SUCC_RATES,
				color: "#E040FB",
				tooltip: {
					valueSuffix: ''
				},
				zIndex: 21
			}]
		});
	},

	tabs: function () {
		if(!TRAIN_MONITOR.tabFlag) {
			$('#trainNo').css('display', 'none');
		} else {
			$('#trainNo').css('display', 'inline-block');
		}

		$(".tab_content").hide();

		$("ul.mu-tab li").removeClass("active");
		if(TRAIN_MONITOR.trainNo === "") {
			$(".tab_content:first").show();
			$("li[rel~='tab1']").addClass("active");
		} else {
			$(".tab_content:nth-child(2)").show();
			$("li[rel~='tab2']").addClass("active");
		}

		$("ul.mu-tab li").click(function () {
			$("ul.mu-tab li").removeClass("active");
			$(this).addClass("active");
			$(".tab_content").hide();
			var activeTab = $(this).attr("rel");
			$("#" + activeTab).show();
		});
	},

	setContextMenu: function () {
		TRAIN_MONITOR.graph.popupmenu = new Q.PopupMenu();
		return false;
	},

	getStationInfo: function () {
		$.ajax({
			type: 'post',
			url: '/integration/monitor/train/stationinfo',
			contentType: 'application/json',
			dataType: 'json',
			success: function (data) {
				TRAIN_MONITOR.stationData = data.stationInfo;
			},
			error : function (xhr, stat, err) {
				// console.log(stat);
			}
		});
	},

	topButtons: function () {
		$(".top-buttons").click(function() {
			var watch_test = $(this).children().hasClass("watch");
			var sound_test = $(this).children().hasClass("sound");

			if(watch_test && TRAIN_MONITOR.watchFlag) {
				//감시 onoff 버튼 && 감시 on 상태일 때 클릭
				$(this).removeClass("mu-toggle-on");
				$(".sound").parent().removeClass("mu-toggle-on");
				TRAIN_MONITOR.soundFlag = false;
				TRAIN_MONITOR.watchFlag = false;
				TRAIN_MONITOR.setRefresh();
			} else if(watch_test) {
				// 감시 onoff 버튼 && 감시 off 상태일 때 클릭
				$(this).addClass("mu-toggle-on");
				$(".sound").parent().addClass("mu-toggle-on");
				TRAIN_MONITOR.soundFlag = true;
				TRAIN_MONITOR.watchFlag = true;
				audioFunction.audioPuse();
				audioFunction.audioPlay();
				TRAIN_MONITOR.setRefresh();
			}

			if(sound_test && TRAIN_MONITOR.soundFlag) {
				$(this).removeClass("mu-toggle-on");
				TRAIN_MONITOR.soundFlag = false;

				audioFunction.audioPuse();
			} else if(sound_test) {
				if(TRAIN_MONITOR.watchFlag) {
					$(this).addClass("mu-toggle-on");
					TRAIN_MONITOR.soundFlag = true;

					audioFunction.audioPuse();
					audioFunction.audioPlay();
				} else {
					alert("감시 중이 아닐 경우 가청을 활성화 할 수 없습니다.");
					return false;
				}
			}
		});
	},

	setRefresh: function () {
		//감시 중 ON인 경우 Interval 등록
		if(TRAIN_MONITOR.watchFlag) {
			TRAIN_MONITOR.refresh = setTimeout(TRAIN_MONITOR.getMonitorTime, 1000 * 10);		// 정해진 시간 주기로 refresh
		} else {
			//감시중 Off인 경우 Timeout 삭제
			clearTimeout(TRAIN_MONITOR.refresh);

			//감시중 Off인 경우 가청 삭제
			audioFunction.audioPuse();
		}
	},

	//알람 가청
	alarmSound: function () {
		var resultCnt1 = TRAIN_MONITOR.alarmCntTop.map(function(el) {
			return parseInt(el, 10);
		});

		var alarmLvl = 4;

		if(resultCnt1[2] > 0) alarmLvl = 3;
		if(resultCnt1[1] > 0) alarmLvl = 2;
		if(resultCnt1[0] > 0) alarmLvl = 1;

		$("#audioAlarmLevel").val(alarmLvl);
		TRAIN_MONITOR.alarmLvlGlobal = alarmLvl;
	}
};


function filterSaveSearch(flag, filterLevel) {
	TRAIN_MONITOR.params.eventTime = TRAIN_MONITOR.performanceTime;
	TRAIN_MONITOR.params.filterLevel = filterLevel;
	TRAIN_MONITOR.displayUI(TRAIN_MONITOR.params);
}
