networkTopologySetHtml = {
	getToolTipHTML: function(title, attempt, rate_1_name, rate_1, rate_2_name, rate_2, rate_3_name, rate_3, rate_4_name, rate_4, level) {
		var tooltip = "";
		tooltip =	"<div class='mu-tooltip-inner'>";

		if ( title != null && title != "") {
			tooltip += "<div class='tit'>"+title+"</div>";
		}

		tooltip +=	"<table class='mu-formbox'>";
		tooltip += 		"<colgroup>" ;
		tooltip += 			"<col width='50%'>";
		tooltip += 			"<col width='50%'>";
		tooltip += 		"</colgroup>";
		tooltip += 		"<tbody>";

		if(level === undefined) {
			tooltip += 			"<tr>";
			tooltip += 				"<th>시도호</th>";
			tooltip += 				"<td>"+attempt+"</td>";
			tooltip += 			"</tr>";
			tooltip += 			"<tr>";
			//tooltip += 				"<th>"+rate_1_name+"</th>";
			//tooltip += 				"<td>"+rate_1+(("없음" == rate_1)?"":"%") + "</td>";
			tooltip += 				rate_1;
			tooltip += 			"</tr>";
		}

		if ( typeof rate_2_name != "undefined" && typeof rate_2 != "undefined" && level === undefined) {
			tooltip +=		"<tr>";
			//tooltip +=			"<th>"+rate_2_name+"</th>";
			//tooltip +=			"<td>"+rate_2+(("없음" == rate_2)?"":"%") + "</td>";
			tooltip +=			rate_2;
			tooltip +=		"</tr>";
		}
		if ( typeof rate_3_name != "undefined" && typeof rate_3 != "undefined" && level === undefined) {
			tooltip +=		"<tr>";
			//tooltip +=			"<th>"+rate_3_name+"</th>";
			//tooltip +=			"<td>"+rate_3+(("없음" == rate_3)?"":"%") + "</td>";
			tooltip +=			rate_3;
			tooltip +=		"</tr>";
		}
		if ( typeof rate_4_name != "undefined" && typeof rate_4 != "undefined" && level === undefined) {
			tooltip +=		"<tr>";
			//tooltip +=			"<th>"+rate_3_name+"</th>";
			//tooltip +=			"<td>"+rate_3+(("없음" == rate_3)?"":"%") + "</td>";
			tooltip +=			rate_4;
			tooltip +=		"</tr>";
		}

		tooltip +=		"</tbody>";
		tooltip +=	"</table>";
		tooltip += "</div>";

		return tooltip;
	},

	getToolTipAlarmHTML: function(title, level) {
		var tooltip = "";
		tooltip = "<div class='mu-tooltip-inner'>";
		tooltip += "<div class='tit'>"+title+"</div>";
		tooltip += "<table class='mu-formbox mobileLoca'>";
		tooltip += "<tr class='rating'>";

		tooltip += networkTopologySetHtml.setAlarmGradeHtml(level);
		tooltip += "</tr>";

		tooltip += "</table>";
		tooltip += "</div>";

		return tooltip;
	},

	setAlarmGradeHtml: function (level) {
		return {
			1 : "<td><span class='critical'>Critical</td>",
			2 : "<td><span class='major'>Major</td>",
			3 : "<td><span class='minor'>Minor</td>",
			4 : "<td><span class='normal'>Normal</td>",
			5 : "<td><span class='normal'>Normal</td>"
		}[level];
	},

	getToolTip: function(m) {
		var systemName = "",
			equipType = m.EQUIP_TYPE;

		if(equipType === 2) {
			systemName = m.DU_NAME;
		} else if(equipType === 3) {
			systemName = m.RU_NAME;
		} else {
			systemName = m.SYSTEM_NAME;
		}

		var tooltip = "";
		// epc
		if ( equipType === 1 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Attach", m.ATTACH_ATTEMPT, "시도호 증감율", m.ATTACH_ATT_RATE, "성공율", m.ATTACH_SUCC_RATE, "완료율", m.ATTACH_ANS_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("SR", m.SR_ATTEMPT,"시도호 증감율", m.SR_ATT_RATE, "성공율", m.SR_SUCC_RATE, "완료율", m.SR_ANS_RATE);
			// tooltip += 	networkTopologySetHtml.getToolTipHTML("SGS", m.SGS_ATTEMPT, "성공율", m.SGS_SUCC_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";
		} else if ( equipType == 4 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Create", m.CREATE_ATTEMPT, "시도호 증감율", m.CREATE_ATT_RATE, "성공율", m.CREATE_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Delete", m.DELETE_ATTEMPT, "시도호 증감율", m.DELETE_ATT_RATE, "성공율", m.DELETE_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Modify", m.MODIFY_ATTEMPT, "시도호 증감율", m.MODIFY_ATT_RATE, "성공율", m.MODIFY_SUCC_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";
		} else if ( equipType == 5 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Attach", m.ATTACH_ATTEMPT, "시도호 증감율", m.ATTACH_ATT_RATE, "성공율", m.ATTACH_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Modify", m.MODIFY_ATTEMPT, "시도호 증감율", m.MODIFY_ATT_RATE, "성공율", m.MODIFY_SUCC_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";
		} else if ( equipType == 6 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("Diameter Stack", m.DIAMETER_ATTEMPT, "시도호 증감율", m.DIAMETER_ATT_RATE, "성공율", m.DIAMETER_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("S6A Interface", m.S6A_ATTEMPT, "시도호 증감율", m.S6A_ATT_RATE, "성공율", m.S6A_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("S13 Interface", m.S13_ATTEMPT, "시도호 증감율", m.S13_ATT_RATE, "성공율", m.S13_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("SP Interface", m.SP_ATTEMPT, "시도호 증감율", m.SP_ATT_RATE, "성공율", m.SP_SUCC_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";
		} else if ( equipType == 7 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += "<div class='mu-tooltip-header'>" + systemName + "</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("PCEF", m.PCEF_ATTEMPT, "시도호 증감율", m.PCEF_ATT_RATE, "성공율", m.PCEF_SUCC_RATE);
			tooltip += 	networkTopologySetHtml.getToolTipHTML("SPR", m.SPR_ATTEMPT, "시도호 증감율", m.SPR_ATT_RATE, "성공율", m.SPR_SUCC_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";

		//} else if ( equipName == "call" ) {
		//	tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
		//	tooltip += "<div class='mu-tooltip-header'>"+systemName+"</div>";
		//	tooltip += networkTopologySetHtml.getToolTipHTML("", m.ETC, "시도호", m.RATE, "성공율");
		//	tooltip +=  networkTopologySetHtml.getToolTipHTML("", "", "", "", "", "","", "", m.LEVEL);
		//	tooltip += "</div>";

		// access - du
		} else if ( equipType == 2 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("", m.ATTEMPT, "시도호 증감율", m.ATT_RATE, "소통율", m.RRC_RATE, "완료율", m.ANSWER_RATE, "절단율", m.CD_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";

		// access -ru
		} else if ( equipType == 3 ) {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += 	networkTopologySetHtml.getToolTipHTML("", m.ATTEMPT, "시도호 증감율", m.ATT_RATE, "소통율", m.RRC_RATE, "완료율", m.ANSWER_RATE, "절단율", m.CD_RATE);
			tooltip +=  networkTopologySetHtml.getToolTipAlarmHTML("알람등급(성능)", m.LEVEL);
			tooltip += "</div>";

		} else {
			tooltip = "<div class='mu-tooltip' style='min-width:180px;'>";
			tooltip += 	"<div class='mu-tooltip-header'>"+systemName+"</div>";
			tooltip += "</div>";
		}

		 return tooltip;
	}
};
