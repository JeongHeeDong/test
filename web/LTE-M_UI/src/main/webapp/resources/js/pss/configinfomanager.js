var configinfoData

$(document).ready(function(){
	
	getDefaultData();
	
});

function getDefaultData(type){
	
	$.ajax({
		type : 'post',
		url: '/pss/management/configinfo/getconfiginfoData',
		dataType: "json",
		success: function (data) {
			configinfoData = data.getconfiginfoData;
			if(configinfoData.length != 0) {
				$('#equipTypeTr, #updateTimeTr, #addCountTr, #modCountTr, #delCountTr').find('.js-data-cell').remove();
			} else {
				$('#equipTypeTr, #updateTimeTr, #addCountTr, #modCountTr, #delCountTr').find('.js-data-cell').text(' ');
				return
			}
			
			
			var $equipTypeTr	= $('#equipTypeTr');
			var $updateTimeTr	= $('#updateTimeTr');
			var $addCountTr		= $('#addCountTr');
			var $modCountTr		= $('#modCountTr');
			var $delCountTr		= $('#delCountTr');
			var duDateTime = '';
			
			$(configinfoData).each(function(i, obj){
				if(obj.TYPE === 'du') {
					duDateTime = obj.UPDATETIME;
				}
//				$equipTypeTr.append('<th class="js-data-cell" data-id="'+obj.EQUIP+'">' + obj.EQUIP + '</th>');
				$equipTypeTr.append('<th class="js-data-cell" style="cursor:pointer" data-id="'+obj.TYPE+'" onclick="javascript:changeHeadTab(this)" >' + obj.EQUIP + '</th>');
				$updateTimeTr.append('<td class="js-data-cell">' + obj.UPDATETIME + '</td>');
				$addCountTr.append(obj.ADDCNT != 0 ? '<td class="js-data-cell" style="font-weight:bold;cursor:pointer" onclick="javascript:changeBodyTab(this)" data-id="'+obj.TYPE+'" data-chk="Mod|^|Del">' + obj.ADDCNT + '</td>' : '<td class="js-data-cell">' + obj.ADDCNT + '</td>');
				$modCountTr.append(obj.MODCNT != 0 ? '<td class="js-data-cell" style="font-weight:bold;cursor:pointer" onclick="javascript:changeBodyTab(this)" data-id="'+obj.TYPE+'" data-chk="Add|^|Del">' + obj.MODCNT + '</td>' : '<td class="js-data-cell">' + obj.MODCNT + '</td>');
				$delCountTr.append(obj.DELCNT != 0 ? '<td class="js-data-cell" style="font-weight:bold;cursor:pointer" onclick="javascript:changeBodyTab(this)" data-id="'+obj.TYPE+'" data-chk="Mod|^|Add">' + obj.DELCNT + '</td>' : '<td class="js-data-cell">' + obj.DELCNT + '</td>');
				
			});
			
			if(type) {
				changeTab(type,type + 'Tab');
			}else{
				getGridData('du',duDateTime);
			}
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function changeHeadTab($this){
	$('#tabCont').find('.hidden').removeClass('hidden')
	changeTab($this.dataset.id,$this.dataset.id+'Tab')
}

function changeBodyTab($this){
	
	$('#tabCont').find('.hidden').removeClass('hidden')
	changeTab($this.dataset.id,$this.dataset.id+'Tab','bodyAct')
	var id= $this.dataset.chk;
	$('#subtitleWrap'+id.split('|^|')[0]).addClass('hidden')
	$('#gridScrollT'+id.split('|^|')[0]).addClass('hidden')
	$('#scroll'+id.split('|^|')[0]).addClass('hidden')
	$('#subtitleWrap'+id.split('|^|')[1]).addClass('hidden')
	$('#gridScrollT'+id.split('|^|')[1]).addClass('hidden')
	$('#scroll'+id.split('|^|')[1]).addClass('hidden')
}

function getGridData(type,dateTime){
	
	var paramData = {
		type : type,
		dateTime : dateTime
	};
	
	var requestData = JSON.stringify(paramData);
	
	$.ajax({
		type : 'post',
		url: '/pss/management/configinfo/getGridData',
		contentType: 'application/json',
		dataType: "json",
		data : requestData,
		success: function (data) {
			var columnList = data.getGridData.COLUMN;
			var headerList = data.getGridData.HEADER;
			var addList = data.getGridData.ADDLIST;
			var modList = data.getGridData.MODLIST;
			var modCompList = data.getGridData.MODCOMPLIST;
			var delList = data.getGridData.DELLIST;
			
			var colgroupP = 7.14;
			var colgroupCnt = 14;
			var modgroup = 7.14;
			var modgroupCnt = 14;
			
			if(columnList.length != 0){
				colgroupP = 100.00/(columnList.length+1);
				colgroupCnt = columnList.length+1;
				
				modgroup = 100.00/(columnList.length+2);
				modgroupCnt = columnList.length+2;
				
				$('#addHeaderTbl').empty();
				$('#modHeaderTbl').empty();
				$('#delHeaderTbl').empty();
			}
			
			var colgroupTag = '<colgroup><col style="width:'+colgroupP+'%" span="'+colgroupCnt+'"></colgroup>';
			var modgroupTag = '<colgroup><col style="width:'+modgroup+'%" span="'+modgroupCnt+'"></colgroup>';
			
			headerAppend(columnList,headerList,colgroupTag,modgroupTag);
			bodyAppend(addList,modList,modCompList,delList,columnList,colgroupTag,modgroupTag);
			
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function headerAppend(columnList,headerList,groupTag,modgroupTag){
	
	var headerTh = '';
	
	$.each(headerList,function(index){
		headerTh += '<th title="'+headerList[index]+'">'+headerList[index]+'</th>';
	});
	
	$('#addHeaderTbl').append(
		groupTag+'<thead><tr><th><div class="mu-checkbox"><input id="addchHead" type="checkbox"><label for="addchHead"></label></div></th>'+
		headerTh+'</tr></thead>'
	);
	$('#modHeaderTbl').append(
		modgroupTag+'<thead><tr><th><div class="mu-checkbox"><input id="modchHead" type="checkbox"><label for="modchHead"></label></div></th>'+
		'<th>기준</th>'+headerTh+'</tr></thead>'
	);
	$('#delHeaderTbl').append(
		groupTag+'<thead><tr><th><div class="mu-checkbox"><input id="delchHead" type="checkbox"><label for="delchHead"></label></div></th>'+
		headerTh+'</tr></thead>'
	);
}

function bodyAppend(addList,modList,modCompList,delList,columnList,colgroupTag,modgroupTag){
	
	var addTbody='',modTbody='',delTbody='';
	var addCnt=0,modCnt=0,delTd=0;
	//추가 항목
	$.each(addList,function(index,value){
		var colData = '';
		$.each(columnList,function(count,col){
			var colText = value[col]==null?'':value[col];
			colData +='<td title="'+colText+'" data-id="'+col+'">'+colText+'</td>';
		})
		addTbody += '<tr>'+
				'<td class="tc"><div class="mu-checkbox"><input id="addch'+index+'" type="checkbox">'+
				'<label for="addch'+index+'" type="checkbox"></label></div></td>'+
				colData+
				'</tr>';
		addCnt = index;
	});
	$('#addBodyTbl').empty();
	$('#addBodyTbl').append(
			colgroupTag+'<tbody>'+ addTbody+'</tbody>'
	);
	//수정 항목
	$.each(modList,function(index,value){
		var colData = '<td>현재</td>';
		var colCompData = '<td>신규</td>';
		$.each(columnList,function(count,col){
			var colText = value[col]==null?'':value[col];
			colData +='<td title="'+colText+'" data-id="'+col+'">'+colText+'</td>';
		})
		$.each(columnList,function(count,col){
			var colCompText = modCompList[index][col]==null?'':modCompList[index][col];
			colCompData +='<td title="'+colCompText+'">'+colCompText+'</td>';
		})
		modTbody += '<tr>'+
				'<td class="tc" rowspan="2"><div class="mu-checkbox"><input id="modch'+index+'" type="checkbox">'+
				'<label for="modch'+index+'" type="checkbox"></label></div></td>'+
				colData+
				'</tr>';
		
		modTbody += '<tr>'+colCompData+'</tr>';
		
		modCnt = index;
	});
	$('#modBodyTbl').empty();
	$('#modBodyTbl').append(
			modgroupTag+'<tbody>'+ modTbody+'</tbody>'
	);
	//삭제 항목
	$.each(delList,function(index,value){
		var colData = '';
		$.each(columnList,function(count,col){
			var colText = value[col]==null?'':value[col];
			colData +='<td title="'+colText+'" data-id="'+col+'">'+colText+'</td>';
		})
		delTbody += '<tr>'+
				'<td class="tc"><div class="mu-checkbox"><input id="delch'+index+'" type="checkbox">'+
				'<label for="delch'+index+'" type="checkbox"></label></div></td>'+
				colData+
				'</tr>';
		delCnt = index;
	});
	$('#delBodyTbl').empty();
	$('#delBodyTbl').append(
			colgroupTag+'<tbody>'+ delTbody+'</tbody>'
	);
	
	checkBoxSet($('#addHeaderTbl'),$('#addBodyTbl'));
	checkBoxSet($('#modHeaderTbl'),$('#modBodyTbl'));
	checkBoxSet($('#delHeaderTbl'),$('#delBodyTbl'));
	
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

function changeTab(paramtext,id,bodyFlag){
	
	if (bodyFlag === 'bodyAct'){
		$('#scrollAdd, #scrollDel, #scrollMod').css('height','500px');
	}else{
		$('#scrollAdd, #scrollDel').css('height','99px');
		$('#scrollMod').css('height','132px');
	}
	$('#tabCont').find('.hidden').removeClass('hidden');
	if ( id == 'mme_portTab'){
		id = 'mmePortTab';
	}else if( id == 'mme_nodeTab'){
		id = 'mmeNodeTab';
	}else if( id == 'mme_ntpTab'){
		id = 'mmeNtpTab';
	}else if( id == 'gw_nodeTab'){
		id = 'gwNodeTab';
	}else if( id == 'gw_ntpTab'){
		id = 'gwNtpTab';
	}else if( id == 'gw_portTab'){
		id = 'gwPortTab';
	}else if( id == 'pcrf_nodeTab'){
		id = 'pcrfNodeTab';
	}else if( id == 'pcrf_ntpTab'){
		id = 'pcrfNtpTab';
	}else if( id == 'pcrf_portTab'){
		id = 'pcrfPortTab';
	}
	var maxDateTime = '';
	$('#'+id).parent().parent().children().each(function(index){
		if($('#'+id).parent().parent().children().eq(index).hasClass('active')){
			$('#'+id).parent().parent().children().eq(index).removeClass('active');
			$('#'+id).parent().addClass('active');
		}
		
		$('#addBtn').attr("onclick","javascript:addcheckFunction('"+paramtext+"',$('#addBodyTbl'))");
		$('#modBtn').attr("onclick","javascript:modcheckFunction('"+paramtext+"',$('#modBodyTbl'))");
		$('#delBtn').attr("onclick","javascript:delcheckFunction('"+paramtext+"',$('#delBodyTbl'))");
	});
	
	$(configinfoData).each(function(i, obj){
		if(obj.TYPE === paramtext) {
			maxDateTime = obj.UPDATETIME;
		}
	});
	
	getGridData(paramtext,maxDateTime);
}

function addcheckFunction(type,tbl){
	
	var checkCount = $(":checkbox", tbl).filter(":checked").length;
	
	if(checkCount <= 0){
		alert('추가할 항목을 선택해주세요');
		return false;
	}
	
	var paramRows = getEditData(tbl,type);
	
	$.ajax({
		type : 'post',
		url: '/pss/management/configinfo/checkAdd',
		contentType: 'application/json',
		dataType: "json",
		data : paramRows,
		success: function (data) {
			if(data.returnFlag == 0){
				alert('선택장비 추가 성공');
			}else{
				alert('선택장비 추가 실패');
			}
			getDefaultData(type);
		},
		error: function () { 
			//alert('에러발생');
		}
	});
	
}

function modcheckFunction(type,tbl){
	
	var checkCount = $(":checkbox", tbl).filter(":checked").length;
	
	if(checkCount <= 0){
		alert('수정할 항목을 선택해주세요');
		return false;
	}
	
	var paramRows = getEditData(tbl,type);

	$.ajax({
		type : 'post',
		url: '/pss/management/configinfo/checkMod',
		contentType: 'application/json',
		dataType: "json",
		data : paramRows,
		success: function (data) {
			if(data.returnFlag == 0){
				alert('선택장비 변경 성공');
			}else{
				alert('선택장비 변경 실패');
			}
			getDefaultData(type);
		},
		error: function () { 
			//alert('에러발생');
		}
	});
}

function delcheckFunction(type,tbl){
	
	var checkCount = $(":checkbox", tbl).filter(":checked").length;
	
	if(checkCount <= 0){
		alert('삭제할 항목을 선택해주세요');
		return false;
	}
	
	var paramRows = getEditData(tbl,type);
	
	$.ajax({
			type : 'post',
			url: '/pss/management/configinfo/checkDel',
			contentType: 'application/json',
			dataType: "json",
			data : paramRows,
			success: function (data) {
				if(data.returnFlag == 0){
					alert('선택장비 삭제 성공');
				}else{
					alert('선택장비 삭제 실패');
				}
				getDefaultData(type);
			},
			error: function () { 
				//alert('에러발생');
			}
	});
}


function getEditData(tbl,type){
	
	var paramRows = [];
	var key = '';
	var _data = '';
	var paramMap = {};
	var maxDateTime;
	
	$(configinfoData).each(function(i, obj){
		if(obj.TYPE === type) {
			maxDateTime = obj.UPDATETIME;
		}
	});
	
	$(":checkbox", tbl).filter(":checked").each(function(key,value){
		tdElement = $(value).parent().parent().parent().children();
		paramMap={};
		
		$(tdElement).each(function(index,value){
			
			if(index != 0){
				key = $(value).data('id');
				_data = $(value).text();
				paramMap[key] = _data;
			}
		});
		
		paramRows.push(paramMap)
	 });
	var requestData = {type : type,rows : paramRows, dateTime : maxDateTime};
	requestData = JSON.stringify(requestData);
	
	return requestData;
}