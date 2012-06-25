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
		}];
		
		this.callParent(arguments);		
		this.refresh();
	},
	
	refresh : function() {
		var self = this;
		var data = {};
		var run_store = Ext.getStore('DailyReportStore');
		
		run_store.load(function(records) {
			var record = records[0].data;
			/* 주행 데이타를 설정한다 */
			data.driving = record.driving;
			/* 정비정보를 설정한다 */
			data.maint = record.maint;
			/* 소모품 교체 정보를 설정한다 */
			data.consummable = record.consumable;

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
				'<div class="reportTitle">' + T('report.daily_driving_report') + ' <span>{date}</span></div>',
				'<table frame="void" rules="all">',
				'<tr>',
			   	 '<th>' + T('label.driver_id') + '</th>',
			   	 '<th>' + T('label.vehicle_id') + '</th>',
			   	 
			   	 '<th rowspan="2">' + T('label.run_dist') + '</th>',
			   	 '<th rowspan="2">' + T('label.run_time') + '</th>',
			   	 '<th rowspan="2">' + T('label.fuel_consumption') + '</th>',
			   	 '<th rowspan="2">' + T('label.fuel_efficiency') + '</th>',
				'</tr>',
				'<tr>',
					'<th>' + T('label.name') + '</th>',
					'<th>' + T('label.reg_no') + '</th>',
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
				'<div class="reportTitle">' + T('title.maintenance') + T('report.report') + '</div>',
				'<table frame="hsides" rules="rows">',
				'<tr>',
				'<th>' + T('label.vehicle_id') + '</th>',
				'<th>' + T('label.reg_no') + '</th>',
				'<th>' + T('label.comment') + '</th>',
				'</tr>',
				'<tpl for="maint">',
				'<tr>',
				'<td>{vehicle_id}</td>',
				'<td>{reg_no}</td>',
				'<td>{comment}</td>',
				'</tr>',
				'</tpl>',
				'</table>',
				'<div class="reportTitle">' + T('label.consumable_repl') + T('report.report') + '</div>',
				'<table frame="hsides" rules="rows">',
				'<tr>',
				'<th>' + T('label.vehicle_id') + '</th>',
				'<th>' + T('label.reg_no') + '</th>',
				'<th>' + T('label.consumable_item') + '</th>',
				'</tr>',
				'<tpl for="consummable">',
				'<tr>',
				'<td>{vehicle_id}</td>',
				'<td>{reg_no}</td>',
				'<td>{item}</td>',
				'</tr>',
				'</tpl>',
				'</table>',
			'</div>',	
			'</div>',	
			]
			
		};
	}
});