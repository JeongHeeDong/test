$(document).ready(function(){
	accountMgmt.listSize = 20;
	accountMgmt.listSizeSetting();
	pageSearch();
});

var accountMgmt = {
	//검색 조건
	searchParams: {},

	//한 페이지에 보여줄 리스트 개수
	listSize: 0,

	//리스트 사이즈
	listSizeSetting: function () {
		$("#pageSize").change(function() {
			accountMgmt.listSize = $(this).val();
			accountMgmt.accountList();
		});
	},

	//사용자 리스트
	accountList: function () {

		var pageNo = $('#pageNo').val(), totalcount = 0, params = {};

		params = accountMgmt.searchParams;
		params.pageNo = (pageNo-1)*accountMgmt.listSize;
		params.pageSize = accountMgmt.listSize;

		//검색 조건 변수 초기화
		accountMgmt.searchParams = {};

		$.ajax({
			type : "post",
			url: "/security/account/accountMgmt/list",
			contentType: "application/json",
			dataType:"json",
			data: JSON.stringify(params),
			success: function (data) {

				data = data.accountList;

				var num = (pageNo-1)*accountMgmt.listSize;
				$('#accountGrid').empty();

				$(data).each(function(key,value){
					num++;
					$('#accountGrid').append(
							"<tr>" +
							"<td>" +
							"<div class='mu-checkbox'>"+
							"<input name='accountCheck' type='checkbox' id='body"+num+"' data-id='" + value.USER_ID + "'>"+
							"<label for='body"+num+"'></label>" +
							"</div>"+
							"</td>" +
							"<td>"+value.AUTH_NM+"</td>"+
							"<td>"+value.USER_NAME+"</td>"+
							"<td>"+value.USER_ID+"</td>"+
							"<td>"+value.USE_FLAG_NM+"</td>"+
							/*"<td>"+value.USER_MOBILE+"</td>"+*/
							"<td>"+value.USER_PHONE+"</td>"+
							/*"<td>"+value.EMAIL+"</td>"+*/
							"<td>"+value.LOGIN_STATUS+"</td>"+
							"<td>"+(value.PASSWORD_ERR_CNT == 0?"-":value.PASSWORD_ERR_CNT)+"</td>"+
							"<td>"+('Y' == value.PASSWORD_INIT_YN?"초기화":"-")+"</td>"+
							"<td>"+(value.PASSWORD_UPDATE_TIME == null?"-":moment(new Date(value.PASSWORD_UPDATE_TIME)).format('YYYY/MM/DD'))+"</td>"+
							"<td>"+(value.USE_PERIOD == 0?"-":value.USE_PERIOD + "개월")+
							         ('N' == value.USE_PERIOD_YN?" (만료)":"") +
							"</td>"+
							"<td>"+(value.REGIST_DATE == null?"-":moment(new Date(value.REGIST_DATE)).format('YYYY/MM/DD'))+"</td>"+
							"</tr>"
					);
				});

				totalcount = data.length <= 0?0:data[0].TOTAL_COUNT;

				if(pageNo*accountMgmt.listSize > num){
					for(var index = 0;index<(pageNo*accountMgmt.listSize)-num; index++){
						$('#accountGrid').append("" +
								"<tr style='height:31px;'>" +
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								/*"<td></td>"+*/
								"<td></td>"+
								/*"<td></td>"+*/
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
								"<td></td>"+
                                "<td></td>"+
								"</tr>"
						);
					}
				}

				var headertbl = $("#accountTable");
				var bodytbl = $("#accountBodyTable");
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

				pagingSetting(totalcount,pageNo,accountMgmt.listSize);

				if(accountMgmt.listSize != 50) {
					$(".gridWrap > div:first-child").removeClass("gridScrollT");
				} else {
					if(!$(".gridWrap > div:first-child").hasClass("gridScrollT")) {
						$(".gridWrap > div:first-child").addClass("gridScrollT");
					}
				}
			},
			error: function () {
				//alert('에러발생');
			}
		});
	},

	//계정 삭제
	accountRemove: function () {
		var params = {
			userIds : []
		};
		
		$("input[name=accountCheck]").each(function(idx, value) {
			if($(this).is(":checked")) {
				params.userIds.push($(this).data("id"));
			}
		});

        if (params.userIds.length < 1) {
            alert("삭제할 계정을 선택해야합니다.");
            return false;
        }
        
        $.alert.open('confirm', '삭제하시겠습니까?', function(button) {
            if (button == 'yes') {
                $.ajax({
                    type : "post",
                    url: "/security/account/accountMgmt/remove",
                    contentType: "application/json",
                    dataType:"json",
                    data: JSON.stringify(params),
                    success: function (data) {
                        if(data.removeResult === false) {
                            alert("로그인 되어있는 계정은 삭제하실 수 없습니다.");
                        } else {
                            alert("계정 삭세 성공하였습니다.");
                            pageSearch();
                        }
                    },
                    error: function () {
                        //alert('에러발생');
                    }
                });                
            } else if (button == 'no') {
                return;
            } else {
                return;
            }
        });             
        
	},
	
	// 비밀번호 초기화
	accountPasswordInit: function () {
        var params = {
            userIds : []
        };
        
        $("input[name=accountCheck]").each(function(idx, value) {
            if($(this).is(":checked")) {
                params.userIds.push($(this).data("id"));
            }
        });

        if (params.userIds.length < 1) {
            alert("접속정보를 초기화 할 계정을 선택해야합니다.");
            return false;
        }
        
        $.alert.open('confirm', '접속정보를 초기화 하시겠습니까?', function(button) {
            if (button == 'yes') {
                $.ajax({
                    type : "post",
                    url: "/security/account/accountMgmt/initPassword",
                    contentType: "application/json",
                    dataType:"json",
                    data: JSON.stringify(params),
                    success: function (data) {
                        console.log('>>> initResult : ' + data.initResult.result);
                        if('SUCCESS' == data.initResult.result) {
                            alert("접속정보 초기화에 성공하였습니다.");
                            pageSearch();                            
                        } else {
                            alert("접속정보 초기화에 실패하였습니다.");
                        }
                    },
                    error: function () {
                        //alert('에러발생');
                    }
                });                
            } else if (button == 'no') {
                return;
            } else {
                return;
            }
        });             
        
    },

	search: function () {

		accountMgmt.searchParams.auth = $("select[name=userLevelSelect]").val();
		accountMgmt.searchParams.useFlag = $("select[name=userStateSelect]").val();
		accountMgmt.searchParams.option = $("select[name=searchOptSelect]").val();
		accountMgmt.searchParams.optionWord = $("#searchInput").val();

		btnSearchClick();
	}
};

function pageSearch(){
	accountMgmt.accountList();
}
