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
		var run_store = Ext.getStore('VehicleRepairStore');
		this.vehicle = HatioBB.setting.get('vehicle');
		run_store.clearFilter(true);
		run_store.filter('vehicle_id', this.vehicle);
		
		run_store.load(function(records) {
			var items = [];
			for(var i = 0 ; i < records.length ; i++) {
				var item = records[i].data;
				item.repair_date = Ext.util.Format.date(item.repair_date, 'Y-m-d');
				items.push(item);
			}
			self.down('[itemId=report]').setData(items);
		});
	}
});