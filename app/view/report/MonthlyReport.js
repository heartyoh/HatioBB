Ext.define('HatioBB.view.report.MonthlyReport', {
	extend : 'Ext.Panel',
	
	xtype : 'monthlyreport',
	
	config : {
		layout : 'fit',
	},
	
	constructor : function(config) {
		config.items = [{
			html : '월간 리포트',
			docked : 'top'
		}, this.buildReport(), {
			html : '월간 리포트',
			docked : 'bottom'
		}
		];
		
		this.callParent(arguments);
	},
	
	buildReport : function() {
		var data = {};
		
		/* 전월을 구힌다 */
		var lastmonth = new Date();
		lastmonth.setMonth(lastmonth.getMonth() - 1);
		data.year = lastmonth.getFullYear();
		data.month = lastmonth.getMonth() + 1;

		/* 3개월간의 주행 추이 데이타를 설정한다 */
		data.driving = [];
		for(var i = 0;i < 3;i++) {
			var month = new Date();
			month.setMonth(month.getMonth() - (i + 1))
			data.driving.push({
				year : month.getFullYear(),
				month : month.getMonth() + 1,
				run_dist : 340,
				run_time : 247,
				consmpt : 46,
				effcc : 7.8
			});
		}
		
		/* 3개월 간의 정비 횟수 추이를 설정한다 */
		data.maint = [];
		for(var i = 0;i < 3;i++) {
			var month = new Date();
			month.setMonth(month.getMonth() - (i + 1))
			data.maint.push({
				year : month.getFullYear(),
				month : month.getMonth() + 1,
				count : Math.floor(Math.random() * 10)
			});
		}

		/* 월간 소모품 교체 정보를 설정한다 */
		var parts = ['엔진오일', '에어컨필터', '브레이크오일', '냉각수', '타이밍벨트'];
		data.consummable = Ext.Array.map(parts, function(part) {
			return {
				part : part,
				count : Math.floor(Math.random() * 10)
			}
		});

		return {
			xtype : 'panel',
			
			data : data,
			
			cls : 'grayBg',
			
			scrollable : 'vertical',

			tpl : [
			'<div>{year}-{month}월</div>',
			'<div>주행 추이 리포트</div>',
			'<table>',
			'<tr>',
			'<th>년도</th>',
			'<th>월</th>',
			'<th>주행거리</th>',
			'<th>주행시간</th>',
			'<th>연료소모량</th>',
			'<th>연비</th>',
			'</tr>',
			'<tpl for="driving">',
			'<tr>',
			'<td>{year}</td>',
			'<td>{month}</td>',
			'<td>{run_dist}</td>',
			'<td>{run_time}</td>',
			'<td>{consmpt}</td>',
			'<td>{effcc}</td>',
			'</tr>',
			'</tpl>',
			'</table>',
			'<div></div>',
			'<div>정비 추이 리포트</div>',
			'<table>',
			'<tr>',
			'<th>년도</th>',
			'<th>월</th>',
			'<th>횟수</th>',
			'</tr>',
			'<tpl for="maint">',
			'<tr>',
			'<td>{year}</td>',
			'<td>{month}</td>',
			'<td>{count}</td>',
			'</tr>',
			'</tpl>',
			'</table>',
			'<div></div>',
			'<div>소모품 교체 리포트</div>',
			'<table>',
			'<tr>',
			'<th>소모품 파트</th>',
			'<th>횟수</th>',
			'</tr>',
			'<tpl for="consummable">',
			'<tr>',
			'<td>{part}</td>',
			'<td>{count}</td>',
			'</tr>',
			'</tpl>',
			'</table>',
			]
			
		};
	}
});