Ext.define('HatioBB.view.vehicle.Vehicle', {
	extend : 'Ext.Panel',
	
	requires : [
	'HatioBB.view.vehicle.Info',
	'HatioBB.view.vehicle.Consumable',
	'HatioBB.view.vehicle.Repair',
	'HatioBB.view.vehicle.EchoDriving'
	],
	
	xtype : 'vehicle',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'vehicle_info'
		}, {
			xtype : 'vehicle_consumable'
		}, {
			xtype : 'vehicle_repair'
		}, {
			xtype : 'vehicle_echo_driving'
		}]
	}
});