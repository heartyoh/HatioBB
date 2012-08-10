Ext.define('HatioBB.view.report.DailyReport2', {
	extend : 'Ext.Panel',
	
	xtype : 'rpt_daily_driving2',
	
	config : {
		layout : 'fit',
	},
	
	constructor : function(config) {
		config.items = [{
			docked : 'top'
		}, this.buildReport(), {
			docked : 'bottom'
		}];
		
		this.callParent(arguments);
		this.refresh();
	},
	
	refresh : function() {
		var self = this;		
		var data = {};
		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/daily_report.json',
			method : 'GET',
			params : { 
				id : 'daily_driving_log'
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);

			    if(resultObj.success) {
					var records = resultObj.items;
					data.driving = records[0].driving;
					data.maint = records[0].maint;
					data.consummable = records[0].consumable;
					self.down('[itemId=report]').setData(data);
				} else {
				   	Ext.MessageBox.alert(T('label.failure'), resultObj.msg);
				}
			},
			failure: function(response) {
				Ext.MessageBox.alert(T('label.failure'), response.responseText);
			}
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
			'<div class="reportWrap type2">',
				'<div class="reportLayoutFull">',
					'<div class="reportTitle">' + T('report.daily_driving_report') + ' <span>{date}</span></div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
			   			 '<th>' + T('label.driver_id') + '</th>',
					     '<th>' + T('label.name') + '</th>',
			   			 '<th>' + T('label.vehicle_id') + '</th>',					
						 '<th>' + T('label.reg_no') + '</th>',			
			   			 '<th>' + T('label.run_dist') + '</th>',
			   			 '<th>' + T('label.run_time') + '</th>',
			   			 '<th>' + T('label.fuel_consumption') + '</th>',
			   			 '<th>' + T('label.fuel_efficiency') + '</th>',
						'</tr>',
						'<tpl for="driving">',
						'<tr>',
							'<td>{driver_id}</td>',
							'<td class="alignCenter">{driver_name}</td>',							
							'<td class="alignCenter">{vehicle_id}</td>',
							'<td class="alignCenter">{reg_no}</td>',							
							'<td class="alignRight">{run_dist}</td>',
							'<td class="alignRight">{run_time}</td>',
							'<td class="alignRight">{consmpt}</td>',
							'<td class="alignCenter">{effcc}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',				
				'<div class="reportLayoutHalf">',
					'<div class="reportTitle">' + T('title.maintenance') + T('report.report') + '</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>' + T('label.vehicle_id') + '</th>',
						'<th>' + T('label.reg_no') + '</th>',
						'<th>' + T('label.comment') + '</th>',
						'</tr>',
						'<tpl for="maint">',
						'<tr>',
						'<td class="alignCenter">{vehicle_id}</td>',
						'<td class="alignCenter">{reg_no}</td>',
						'<td class="alignCenter">{comment}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',				
				'<div class="reportLayoutHalf">',	
					'<div class="reportTitle">' + T('label.consumable_repl') + T('report.report') + '</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>' + T('label.vehicle_id') + '</th>',
						'<th>' + T('label.reg_no') + '</th>',
						'<th>' + T('label.consumable_item') + '</th>',
						'</tr>',
						'<tpl for="consummable">',
						'<tr>',
						'<td class="alignCenter">{vehicle_id}</td>',
						'<td class="alignCenter">{reg_no}</td>',
						'<td class="alignCenter">{item}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',	
			'</div>',	
			]			
		};
	}
});