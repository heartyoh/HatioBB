Ext.define('HatioBB.controller.monitor.Info', {
	extend : 'Ext.app.Controller',
	
	config : {
		refs : {
			info : 'monitor_info'
		},
		
		control : {
			info : {
				initialize : 'onInit'
			}
		}
	},
	
	onInit : function() {
		var self = this;
		
		this.getInfo().on('painted', function() {
			HatioBB.setting.on('vehicle', self.onSelectVehicle, self);
			HatioBB.setting.on('driver', self.onSelectDriver, self);
			
			self.getInfo().refresh();
		});
		
		this.getInfo().on('erased', function() {
			HatioBB.setting.un('vehicle', self.onSelectVehicle, self);
			HatioBB.setting.un('driver', self.onSelectDriver, self);
		});
		
	},
	
	onSelectVehicle : function() {
		if(this.getInfo().onProcessing)
			return;
		
		var store = Ext.getStore('VehicleMapStore');
		var vehicle = store.findRecord('id', HatioBB.setting.get('vehicle'));

		this.getInfo().setVehicle(vehicle);
	},
	
	onSelectDriver : function() {
		if(this.getInfo().onProcessing)
			return;
		
		var store = Ext.getStore('VehicleMapStore');
		var vehicle = store.findRecord('driver_id', HatioBB.setting.get('driver'));

		this.getInfo().setVehicle(vehicle);
	}

});