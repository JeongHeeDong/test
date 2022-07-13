<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%--<style type="text/css">
	.REBA {
		position: relative;
		left: 100px;
		top: -700px;
	}

	.RUBA {
		position: relative;
		left: 200px;
		top: -300px;
	}

	.ROBA {
		position: relative;
		left: 300px;
		top: -400px;
	}

	.BLANK {
		position: relative;
		left: 400px;
		top: -500px;
	}
</style>--%>
<script src="/resources/js/failure/popup/failureLocationWithPicture.js"></script>
<div style="display: none;position: absolute;" id="contextMenu-DU">
	<ul class="mu-popup-menu">
		<li><a href="javascript:fm.setDUFailureLocation(fm.rightMenu.alarm)">고장위치(실장도)</a></li>
	</ul>
</div>
<div id="divDUBackground" class="mu-dialog-background" style="display:none;"></div>
<!-- DU 장비 -->
<div id="divDUView" class="mu-dialog layer-detail drag" style="top:100px;left:200px;display:none;">
	<div class="mu-dialog-head dragHandle">
		<span class="title">DU 장비</span>
		<button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
	</div>
	<div class="mu-dialog-body">
		<div class="switchWrap">
			<ul class="duSwitch">
				<li class="blank">
					<div class="port port1"></div>
				</li>
				<li class="blank">
					<div class="port port1"></div>
				</li>
				<li class="blank">
					<div class="port port1"></div>
				</li>
				<li class="normal">
					<div class="port port2"></div>
				</li>
			</ul>
		</div>
	</div>
</div>

<div style="display: none;position: absolute;" id="contextMenu-EPC">
	<ul class="mu-popup-menu">
		<li><a href="javascript:fm.epcFailureLocation()">고장위치(실장도)</a></li>
	</ul>
</div>
<div id="divEPCBackground" class="mu-dialog-background" style="display:none;"></div>
<!-- EPC 장비 -->
<div id="divEPCView" class="mu-dialog layer-detail drag" style="top:100px;left:200px;display:none;">
	<div class="mu-dialog-head dragHandle">
		<span class="title">EPC 장비</span>
		<button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon-img cancel"></i></button>
	</div>
	<div class="mu-dialog-body">
		<div class="serverBg">
			<div class="failArea">
				<div class="serverFan"><span>FAN</span></div>
				<ul>
					<li class="reba reba0">
						<ul class="reba slot_4">
							<li class="critical"><span>VOMA</span></li>
							<li class="major"><span>VIPA</span></li>
							<li class="minor"><span>VECA</span></li>
							<li class="critical"><span>VIDA</span></li>
						</ul>
						<ul class="reba slot_3">
							<li class="critical"><span>VOMA</span></li>
							<li class="major"><span>VISA</span></li>
							<li class="critical"><span>VIDA</span></li>
						</ul>
					</li>
					<li class="reba reba1">
						<ul class="reba slot_4">
							<li class="critical"><span>VOMA</span></li>
							<li class="major"><span>VIPA</span></li>
							<li class="minor"><span>VECA</span></li>
							<li class="critical"><span>VIDA</span></li>
						</ul>
						<ul class="reba slot_3">
							<li><span>VOMA</span></li>
							<li><span>VISA</span></li>
							<li class="critical"><span>VIDA</span></li>
						</ul>
					</li>
					<li class="ruba ruba0"></li>
					<li class="ruba ruba1"></li>
					<li class="blank"><span>BLANK</span></li>
					<li class="blank"><span>BLANK</span></li>
					<li><span>ROBA</span></li>
					<li><span>ROBA</span></li>
					<li class="blank"><span>BLANK</span></li>
					<li class="blank"><span>BLANK</span></li>
					<li class="blank"><span>BLANK</span></li>
					<li class="blank"><span>BLANK</span></li>
				</ul>
				<div class="serverFan"><span>FAN</span></div>
			</div>
		</div>
	</div>
</div>