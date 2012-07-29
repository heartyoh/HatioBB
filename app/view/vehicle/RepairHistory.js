Ext.define('HatioBB.view.vehicle.RepairHistory', {
	extend : 'Ext.Panel',
	
	xtype : 'vehicle_repair_history',
	
	config : {
		cls : 'grayBg',
		layout : 'fit'
	},
	
	constructor : function(config) {
		config.items = [
			this.buildHistory()
		];
		
		this.callParent(arguments);		
		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			this.refresh();			
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
		});
	},
	
	buildHistory : function() {
		return {
			xtype : 'panel',
			
			itemId : 'report',
						
			data : {},
						
			cls : 'bgHGradient',
			
			scrollable : 'vertical',

			tpl : [
				'<div class="reportWrap type2">',
					'<div class="reportTitle">'+ T('title.maintenance_history') + '</div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
							'<tr>',
			   			 		'<th>'+ T('label.repair_date') +'</th>',
					   	 		'<th>'+ T('label.repair_time') + T('label.parentheses_min') +'</th>',
					   	 		'<th>'+ T('label.repair_mileage') + '(km)</th>',
							'</tr>',
							'<tpl for=".">',
							'<tr>',
								'<td class="alignCenter">{repair_date}</td>',
								'<td class="alignCenter">{repair_time}</td>',
								'<td class="alignCenter">{repair_mileage}</td>',
							'</tr>',
							'</tpl>',
						'</table>',
					'</div>',
				'</div>'
			]
		};		
	},
	
	refresh : function() {
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
			
		this.refreshPage();	
	},
		
	refreshPage : function() {
		var self = this;
		this.vehicle = HatioBB.setting.get('vehicle');		
		Ext.Ajax.request({
			url : window.location.pathname.indexOf('/m/') === 0 ? '/repair' : 'data/vehicle_repair.json',
			method : 'GET',
			params : {
				limit : 1000,
				start : 0,
				vehicle_id : this.vehicle
			},
			success : function(response) {
				var resultObj = Ext.JSON.decode(response.responseText);
				if (resultObj.success) {
					var records = resultObj.items;
					for(var i = 0 ; i < records.length ; i++) {
						var repairDate = new Date(records[0].repair_date)
						records[i].repair_date = Ext.util.Format.date(repairDate, 'Y-m-d');
					}
					self.down('[itemId=report]').setData(records);
				} else {
					Ext.Msg.alert(T('label.failure'), resultObj.msg);
				}
			},
			failure : function(response) {
				Ext.Msg.alert(T('label.failure'), response.responseText);
			}
		});		
	}
});