$(document).ready(function(){
	$('#faultFilterClose, #faultFilterCancle,#faultFilterBg').on('click',function(e){
		$('#faultFilterBg').fadeOut();
		$('#faultFilterUp').fadeOut();

		if($('#faultState').val() == 0) $('#chk_fault').prop('checked',false);
		else $('#chk_fault').prop('checked',true);
	});
	//faultFilter Drag 지정 정의
	$( "#faultFilterUp" ).draggable({'handle' : '#faultFilterTitleBox'});
	$( "#faultFilterUp" ).resizable({
		animate: true
	});
});

function faultFilterView(){
	
	$("input:radio[name=stateRadio][value="+$('#faultState').val()+"]").prop("checked", true);

	$('#faultFilterBg').show().fadeIn('fast');
	$('#faultFilterUp').show().fadeIn('fast'); 
	
	var height = ($(window).height() - $('#faultFilterUp').height()-50)/2
	var width = ($(window).width() - $('#faultFilterUp').width())/2
	
	$('#faultFilterUp').css('left',width+'px');
	$('#faultFilterUp').css('top',height+'px');
	
}

//function abspos(e){
//    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
//    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
//    return this;
//}

function faultfilterSave(){

	var faultState = $(':radio[name="stateRadio"]:checked').val();
	$('#faultState').val(faultState);
	if(faultState != 0) $('#chk_fault').prop('checked',true);
	else $('#chk_fault').prop('checked',false);
	
	$('#faultFilterBg').fadeOut();
	$('#faultFilterUp').fadeOut();

}