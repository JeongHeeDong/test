/**
*
*/
var GridEx = (function ($, Grid, addThousandSeparatorCommas) {
	/**
	*   @class
	*   Grid 클래스를 구성관리 페이지에 맞게 확장
	*/
	function GridEx (selector, pagingSelector, selectboxSelector) {
		Grid.call(this, selector, pagingSelector, selectboxSelector); // inherit constructor
	}
	GridEx.prototype = Object.create(Grid.prototype); // inherit method

	//========================= getter/setter =========================//

	GridEx.prototype.totalCount = function (_totalCount) {
		// this.el.prev().children('.total_cnt')
		//     .text('Total Line: ' + addThousandSeparatorCommas(_totalCount) + '건');
		this.el.parent().prev().find('.total_cnt')
			.html('Total Line: <strong>' + addThousandSeparatorCommas(_totalCount) + '</strong>건');

		if ($.type(_totalCount) === 'number') {
			this.totalcnt = _totalCount;
		}

		return Grid.prototype.totalCount.apply(this, arguments);
	};
	GridEx.prototype.getTotalCnt = function() {
		return this.totalcnt;
	};
	GridEx.prototype.getSelectRow = function(id) {
		var mapId = this._mapId;
		var rows = this._viewRows;
		var rst = null;

		for (var j = rows.length - 1; j >= 0; j--) {
			var row = rows[j];
			if (id === (row[mapId] + '')) {
				rst = row;
				break;
			}
		}
		return rst;
	};

	//========================= etc =========================//

	return GridEx;
})($, Grid, addThousandSeparatorCommas);
