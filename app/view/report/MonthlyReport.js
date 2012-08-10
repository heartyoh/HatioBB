Ext.define('HatioBB.view.report.MonthlyReport', {
	extend : 'Ext.Panel',
	
	xtype : 'rpt_monthly_driving',
	
	config : {
		cls : 'grayBg',
		
		layout : 'fit'
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
		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/monthly_report.json',
			method : 'GET',
			params : { 
				id : 'monthly_driving_log'
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
					'<div class="reportTitle">'+ T('report.driving_trend') +' '+ T('report.report') +' ('+ Ext.Date.format(new Date(new Date().getFullYear(), new Date().getMonth()-1), 'Y년-n월') +')</div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
			   			 '<th>'+ T('label.vehicle') +'</th>',
			   			 '<th>'+ T('label.run_dist') +'</th>',					
						 '<th>'+ T('label.run_time') +'</th>',			
			   			 '<th>'+ T('label.fuel_consumption') +'</th>',
			   			 '<th>'+ T('label.fuel_efficiency') +'</th>',
						'</tr>',
						'<tpl for="driving">',
						'<tr>',
							'<td class="alignCenter">{vehicle}</td>',						
							'<td class="alignCenter">{run_dist}</td>',
							'<td class="alignCenter">{run_time}</td>',							
							'<td class="alignCenter">{consmpt}</td>',
							'<td class="alignCenter">{effcc}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',
				'<div class="reportLayoutHalf">',
					'<div class="reportTitle">'+ T('label.maintenance') +' '+ T('report.report') +' ('+ Ext.Date.format(new Date(new Date().getFullYear(), new Date().getMonth()-1), 'Y년-n월') +')</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>'+ T('label.vehicle') +'</th>',
						'<th>'+ T('label.month') +'</th>',
						'<th>'+ T('label.times') +'</th>',
						'</tr>',
						'<tpl for="maint">',
						'<tr>',
						'<td class="alignCenter">{vehicle}</td>',
						'<td class="alignCenter">{month}</td>',
						'<td class="alignCenter">{mnt_cnt}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',
				'<div class="reportLayoutHalf">',	
					'<div class="reportTitle">'+ T('label.consumable_repl') +' '+ T('report.report') +' ('+ Ext.Date.format(new Date(new Date().getFullYear(), new Date().getMonth()-1), 'Y년-n월') +')</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>'+ T('label.consumable_item') +'</th>',
						'<th>'+ T('label.times') +'</th>',
						'</tr>',
						'<tpl for="consummable">',
						'<tr>',
						'<td class="alignCenter">{part}</td>',
						'<td class="alignCenter">{count}</td>',
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