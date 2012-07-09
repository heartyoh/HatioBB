Ext.define('HatioBB.view.vehicle.Vehicle', {
	extend : 'Ext.tab.Panel',
	
	requires : [
	'HatioBB.view.vehicle.Summary',
	'HatioBB.view.chart.vehicle.Running',
	'HatioBB.view.chart.vehicle.Consumable',
	'HatioBB.view.vehicle.Repair',
	'HatioBB.view.chart.vehicle.EcoRadar'
	],
	
	xtype : 'vehicle',
	
	id : 'vehicle',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'vehicle_summary',
			iconCls : 'iconsTab tabSummary',
			title : T('label.summary')
		}, {
			xtype : 'chart_v_running',
			iconCls : 'iconsTab tabDrive',
			title : T('label.running')
		}, {
			xtype : 'chart_v_consumable',
			iconCls : 'iconsTab tabConsumable',
			title : T('menu.consumables')
		}, {
			xtype : 'vehicle_repair',
			iconCls : 'iconsTab tabRepair',
			title : T('label.repair')
		}, {
			xtype : 'chart_v_eco_radar',
			iconCls : 'iconsTab tabEco',
			title : T('label.eco_driving')
		}, {
			xtype : 'track',
			iconCls : 'iconsTab tabTrack',
			queryOn : 'vehicle',
			title : T('menu.track')
		}]
	},
	
	buildSettings : function() {
		return [{
            xtype: 'selectfield',
            label: T('label.fromYear'),
            name: 'fromYear',
            valueField: 'year',
            displayField: 'year',
			value : HatioBB.setting.get('fromYear'),
			listeners : {
				change : function(field, newVal) {
					HatioBB.setting.set('fromYear', newVal);
				}
			},
            store: 'YearStore'
		}]
	},
	
	refresh: function() {
		var active = this.getActiveItem();
		if(active && typeof(active.refresh) === 'function') {
			active.refresh.call(active);
		}
	}
});