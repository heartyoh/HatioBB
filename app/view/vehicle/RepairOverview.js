Ext.define('HatioBB.view.vehicle.RepairOverview', {
	extend : 'Ext.Panel',
	
	xtype : 'vehicle_repair_overview',
	
	config : {
		cls : 'grayBg',
		layout : {
			type : 'vbox',
			align : 'stretch'
		}
	},
	
	constructor : function(config) {		
		config.items = [
			this.buildOverview(),
			this.buildButton()
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
	
	buildButton : function() {
		var self = this;
		
		return {
			xtype : 'panel',
			
			layout : {
				type: 'vbox',				
				align: 'center'
			},
			
			items : [{
				xtype : 'button',

				itemId : 'repair_button',

				ui : 'action',

				maxWidth : 150,
				
				listeners: {
					tap: function(btn) {
						var btnText = btn.getText();
						var msg = T('msg.confirm_run');
						Ext.Msg.confirm(btnText, msg, function(confirm) {
							if (confirm !== 'yes') {
								return;
							}
							
							var actionUrl = '/repair/' + ((btnText == self.getRepairStartText()) ? 'end' : 'start');
							Ext.Ajax.request({
								url : actionUrl,
								method : 'POST',
								params : {
									vehicle_id : self.vehicle
								},
								success : function(response) {
									var resultObj = Ext.JSON.decode(response.responseText);
									if (resultObj.success) {
										self.refreshPage();
									} else {
										Ext.Msg.alert(T('label.failure'), resultObj.msg);
									}
								},
								failure : function(response) {
									Ext.Msg.alert(T('label.failure'), response.responseText);
								}
							});
						});
					}
				}							
			}]	
		}
	},
	
	buildOverview : function() {
		return {
			xtype : 'panel',
			
			itemId : 'repair_overview',
						
			data : {},
						
			cls : 'bgHGradient',
			
			tpl : [
				'<div class="reportWrap type2">',
					'<div class="reportTitle">'+ T('title.maintenance') + '</div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
							'<tpl for=".">',
							'<tr>',
								'<td class="alignCenter">' + T('title.vehicle_status') + '</td>',
								'<td class="alignCenter">{vehicle_status}</td>',
							'</tr>',
							'<tr>',
								'<td class="alignCenter">' + T('label.repair_date') + '</td>',
								'<td class="alignCenter">{last_repair_date}</td>',
							'</tr>',
							'<tr>',
								'<td class="alignCenter">' + T('label.next_repair_date') + '</td>',
								'<td class="alignCenter">{next_repair_date}</td>',
							'</tr>',
							'<tr>',
								'<td class="alignCenter">' + T('label.repair_mileage') + '</td>',
								'<td class="alignCenter">{repair_mileage} (km)</td>',
							'</tr>',							
							'</tpl>',
						'</table>',
					'</div>',
				'</div>'
			]
		};		
	},
	
	getRepairStartText : function() {
		return T('label.maintenance') + ' ' + T('label.start');
	},
	
	getRepairEndText : function() {
		return T('label.maintenance') + ' ' + T('label.end')
	},
	
	refresh : function() {
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
		
		this.refreshPage();	
	},
	
	refreshPage : function() {
		var self = this;
		this.vehicle = HatioBB.setting.get('vehicle');
		var data = {};
		var store = Ext.getStore('VehicleStore');
		store.clearFilter(true);
		store.filter('id', this.vehicle);
		
		store.load(function(records) {
			var record = records[0].getData();
			data['vehicle_status'] = record.status;
			
			// Vehicle Status 에 따 라 button text 변 경 
			if('Incident' == record.status || 'Idle' == record.status || 'Running' == record.status) {
				self.down('[itemId=repair_button]').setText(self.getRepairStartText());
			} else if('Maint' == record.status) {
				self.down('[itemId=repair_button]').setText(self.getRepairEndText());
			}
			
			Ext.Ajax.request({
				url : window.location.pathname.indexOf('/m/') === 0 ? '/repair' : 'data/vehicle_repair.json',
				method : 'GET',
				params : {
					limit : 1,
					start : 0,
					vehicle_id : this.vehicle
				},
				success : function(response) {
					var resultObj = Ext.JSON.decode(response.responseText);
					if (resultObj.success) {
						if(resultObj.items.length > 0) {
							var records = resultObj.items;
							if(records[0].repair_date) {
								var repairDate = new Date(records[0].repair_date)
								data['last_repair_date'] = Ext.Date.format(repairDate, 'Y-m-d');
							}
							
							if(records[0].next_repair_date) {
								var nextRepairDate = new Date(records[0].next_repair_date)
								data['next_repair_date'] = Ext.Date.format(nextRepairDate, 'Y-m-d');
							}							
							
							data['repair_mileage'] = records[0].repair_mileage;
							self.down('[itemId=repair_overview]').setData(data);							
						}
					} else {
						Ext.Msg.alert(T('label.failure'), resultObj.msg);
					}
				},
				failure : function(response) {
					Ext.Msg.alert(T('label.failure'), response.responseText);
				}
			});			
		});
	}
});