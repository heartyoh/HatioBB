Ext.define('HatioBB.view.vehicle.Repair', {
	extend : 'Ext.tab.Panel',
	
	requires : [
		'HatioBB.view.vehicle.RepairOverview',
		'HatioBB.view.vehicle.RepairHistory',
		'HatioBB.view.chart.vehicle.Mttr',
		'HatioBB.view.chart.vehicle.Mtbf'
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
		}, {
			xtype : 'vehicle_chart_mttr',
			iconCls : 'iconsTab tabTrack',
			title : T('report.mttr')
		}, {
			xtype : 'vehicle_chart_mtbf',
			iconCls : 'iconsTab tabTrack',
			title : T('report.mtbf')
		}]
	},
		
	refresh: function() {
		var active = this.getActiveItem();
		if(active && typeof(active.refresh) === 'function') {
			active.refresh.call(active);
		}
	}
});