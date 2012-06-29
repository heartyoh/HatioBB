Ext.define('HatioBB.view.vehicle.Repair', {
	extend : 'Ext.Panel',
	
	xtype : 'vehicle_repair',
	
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
		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
		});
	},
	
	refresh : function() {
		var self = this;
		
		var run_store = Ext.getStore('VehicleRepairStore');
		
		this.vehicle = HatioBB.setting.get('vehicle');
		run_store.clearFilter(true);
		run_store.filter('vehicle_id', this.vehicle);
		
		run_store.load(function(records) {
			var data = [];
			for(var i = 0 ; i < records.length ; i++) {
				var item = records[i].data;
				item.repair_date = Ext.util.Format.date(item.repair_date, 'Y-m-d');
				data.push(item);
			}
			
			self.down('[itemId=report]').setData(data);
		});
	},
	
	buildReport : function() {
		return {
			xtype : 'panel',
			
			itemId : 'report',
						
			data : {},
			
			//store : 'VehicleRepairStore',
			
			cls : 'bgHGradient',
			
			scrollable : 'vertical',

			tpl : [

			'<div class="reportWrap type2">',
				'<div class="reportLayoutFull">',
					'<div class="reportTitle">'+ T('title.maintenance_history') +'<span></span></div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
			   			 '<th>'+ T('label.repair_date') +'</th>',
					   	 '<th>'+ T('label.repair_time') + T('label.parentheses_min') +'</th>',
					   	 '<th>'+ T('label.repair_mileage')+' km</th>',
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
				'</div>',
			]
			
		};
	}
});