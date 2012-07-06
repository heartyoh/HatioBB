Ext.define('HatioBB.view.report.MonthlyReport', {
	extend : 'Ext.Panel',
	
	xtype : 'monthlyreport',
	
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
/*		var run_store = Ext.getStore('MonthlyReportStore');
		
		run_store.load(function(records) {
			var record = records[0].data;
			// 주행 데이타를 설정한다
			data.driving = record.driving;
			// 정비정보를 설정한다 
			data.maint = record.maint;
			// 소모품 교체 정보를 설정한다 
			data.consummable = record.consumable;

			self.down('[itemId=report]').setData(data);
		});*/
		
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
					
				//	alert(Ext.JSON.encode(records[0].driving));
					
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
					'<div class="reportTitle"> 주행 리포트 ('+ Ext.Date.format(new Date(new Date().getFullYear(), new Date().getMonth()-1), 'Y년-n월') +')</div>',
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
					'<div class="reportTitle">정비 리포트 ('+ Ext.Date.format(new Date(new Date().getFullYear(), new Date().getMonth()-1), 'Y년-n월') +')</div>',
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
					'<div class="reportTitle">소모품 교체 리포트 ('+ Ext.Date.format(new Date(new Date().getFullYear(), new Date().getMonth()-1), 'Y년-n월') +')</div>',
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