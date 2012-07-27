Ext.define('HatioBB.view.vehicle.Repair', {
	extend : 'Ext.tab.Panel',
	
	requires : [
		'HatioBB.view.vehicle.RepairOverview',
		'HatioBB.view.vehicle.RepairHistory'
	],
	
	xtype : 'vehicle_repair',
		
	id : 'vehicle_repair',
		
	config : {
		tabBarPosition: 'top',
	    
		items : [{
			xtype : 'vehicle_repair_overview',
			iconCls : 'iconsTab tabConsumable',
			title : T('title.maintenance')
		}, {
			xtype : 'vehicle_repair_history',
			iconCls : 'iconsTab tabTrack',
			title : T('title.maintenance_history')
		}]
	},
		
	refresh: function() {
		var active = this.getActiveItem();
		if(active && typeof(active.refresh) === 'function') {
			active.refresh.call(active);
		}
	}
});