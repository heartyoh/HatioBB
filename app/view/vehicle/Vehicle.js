Ext.define('HatioBB.view.vehicle.Vehicle', {
	extend : 'Ext.tab.Panel',
	
	requires : [
	'HatioBB.view.vehicle.Info',
	'HatioBB.view.vehicle.Consumable',
	'HatioBB.view.vehicle.Repair',
	'HatioBB.view.vehicle.EchoDriving'
	],
	
	xtype : 'vehicle',
	
	id : 'vehicle',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'vehicle_info',
			title : 'Info'
		}, {
			xtype : 'vehicle_consumable',
			title : 'Consumable'
		}, {
			xtype : 'vehicle_repair',
			title : 'Repair'
		}, {
			xtype : 'vehicle_echo_driving',
			title : 'Echo Driving'
		}]
	}
});