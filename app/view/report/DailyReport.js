Ext.define('HatioBB.view.report.DailyReport', {
	extend : 'Ext.Panel',
	
	xtype : 'dailyreport',
	
	config : {
		layout : 'fit',
	},
	
	constructor : function(config) {
		config.items = [{
			//html : '일일 리포트',
			docked : 'top'
		}, this.buildReport(), {
			//html : '일일 리포트',
			docked : 'bottom'
		}
		];
		
		this.callParent(arguments);
		
		this.refresh();
	},
	
	refresh : function() {
		var self = this;
		
		var data = {};
		var run_store = Ext.getStore('DailyReportStore');
		
		run_store.load(function(records) {
			/* 주행 데이타를 설정한다 */
			data.driving = [];
			for(var i = 0;i < records.length;i++) {
				var run_data = records[i].getData();
				data.driving.push(run_data);
			}

			/* 정비정보를 설정한다 */
			data.maint = [];
			for(var i = 0;i < 3;i++) {
				data.maint.push({
					vehicle_id : 'V00' + (i + 1),
					reg_no : '가 1234',
					desc : '정기 점검'
				});
			}

			/* 소모품 교체 정보를 설정한다 */
			data.consummable = [];
			for(var i = 0;i < 3;i++) {
				data.consummable.push({
					vehicle_id : 'V00' + (i + 1),
					reg_no : '가 1234',
					part : '엔진 오일'
				});
			}

			self.down('[itemId=report]').setData(data);
		});


	},
	
	buildReport : function() {
		return {
			xtype : 'panel',
			
			itemId : 'report',
			
			data : {},
			
			cls : 'bgHGradient',
			
			scrollable : 'vertical',

			tpl : [
			
			'<div class="reportWrap">',
			'<div class="reportMain">',
				'<div class="reportTitle">운전자 주행 리포트 <span>{date}</span></div>',
				'<table frame="void" rules="all">',
				'<tr>',
			   	 '<th>운전자 ID</th>',
			   	 '<th>차량 ID</th>',
			   	 
			   	 '<th rowspan="2">주행거리</th>',
			   	 '<th rowspan="2">주행시간</th>',
			   	 '<th rowspan="2">연료소모량</th>',
			   	 '<th rowspan="2">연비</th>',
				'</tr>',
				'<tr>',
					'<th>운전자 이름</th>',
					'<th>등록번호</th>',
				'</tr>',
				'<tpl for="driving">',
				'<tr>',
					'<td>{driver_id}</td>',
					'<td>{vehicle_id}</td>',
					'<td rowspan="2">{run_dist}</td>',
					'<td rowspan="2">{run_time}</td>',
					'<td rowspan="2">{consmpt}</td>',
					'<td rowspan="2">{effcc}</td>',
				'</tr>',
				'<tr>',
					'<td>{driver_name}</td>',
					'<td>{reg_no}</td>',
				'</tr>',
				'</tpl>',
				'</table>',
			'</div>',
			
			'<div class="reportSub">',
				'<div class="reportTitle">정비 리포트</div>',
				'<table frame="hsides" rules="rows">',
				'<tr>',
				'<th>차량 ID</th>',
				'<th>등록번호</th>',
				'<th>정비내역</th>',
				'</tr>',
				'<tpl for="maint">',
				'<tr>',
				'<td>{vehicle_id}</td>',
				'<td>{reg_no}</td>',
				'<td>{desc}</td>',
				'</tr>',
				'</tpl>',
				'</table>',
				'<div class="reportTitle">소모품 교체 리포트</div>',
				'<table frame="hsides" rules="rows">',
				'<tr>',
				'<th>차량 ID</th>',
				'<th>등록번호</th>',
				'<th>소모품</th>',
				'</tr>',
				'<tpl for="consummable">',
				'<tr>',
				'<td>{vehicle_id}</td>',
				'<td>{reg_no}</td>',
				'<td>{part}</td>',
				'</tr>',
				'</tpl>',
				'</table>',
			'</div>',	
			'</div>',	
			]
			
		};
	}
});