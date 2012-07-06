Ext.define('HatioBB.view.report.DailyReport3', {
	extend : 'Ext.Panel',
	
	xtype : 'dailyreport3',
	
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
/*		var run_store = Ext.getStore('DailyReportStore3');
		
		run_store.load(function(records) {
			var data = [];
			for(var i = 0 ; i < records.length ; i++) {
				var item = records[i].data;
				data.push(item);
			}

			self.down('[itemId=report]').setData(data);
		});*/
		
		Ext.Ajax.request({
			url: window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/daily_report3.json',
			method : 'GET',
			params : { 
				id : 'daily_driving_habit'
			},
			success: function(response) {		    	
			    var resultObj = Ext.JSON.decode(response.responseText);

			    if(resultObj.success) {
					var records = resultObj.items;
					self.down('[itemId=report]').setData(records);

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
					'<div class="reportTitle"> 일일 운전습관 리포트<span>{driver_id}</span></div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
			   			 '<th>'+ T('label.driver_id') +'</th>',
					     '<th>'+ T('label.driver') + T('label.name') +'</th>',
			   			 '<th>'+ T('label.average_speed') +'</th>',					
						 '<th>'+ T('label.highest_speed') +'</th>',			
			   			 '<th>'+ T('label.fuel_efficiency') +'</th>',
			   			 '<th>'+ T('label.co2_emissions') +'</th>',
						 '<th>'+ T('label.total_run_time') +'</th>',
			   			 '<th>'+ T('label.eco_drv_time') +'</th>',
						 '<th>'+ T('label.idle_time') +'</th>',			
			   			 '<th>'+ T('label.ovr_spd_time') +'</th>',
			   			 '<th>'+ T('label.sud_accel_cnt') +'</th>',
			   			 '<th>'+ T('label.sud_brake_cnt') +'</th>',
						'</tr>',
						'<tpl for=".">',
						'<tr>',
							'<td class="alignCenter">{driver_id}</td>',
							'<td class="alignCenter">{driver_name}</td>',							
							'<td class="alignCenter">{average_speed}</td>',
							'<td class="alignCenter">{max_speed}</td>',							
							'<td class="alignCenter">{fuel_efficiency}</td>',
							'<td class="alignCenter">{co2_emissions}</td>',
							'<td class="alignCenter">{running_time}</td>',
							'<td class="alignCenter">{eco_driving_time}</td>',							
							'<td class="alignCenter">{idle_time}</td>',
							'<td class="alignCenter">{over_speed_time}</td>',							
							'<td class="alignCenter">{sudden_accel_count}</td>',
							'<td class="alignCenter">{sudden_brake_count}</td>',
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