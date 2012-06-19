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
			title : 'Summary'
		}, {
			xtype : 'chart_v_running',
			iconCls : 'iconsTab tabDrive',
			title : 'Running'
		}, {
			xtype : 'chart_v_consumable',
			iconCls : 'iconsTab tabConsumable',
			title : 'Consumable'
		}, {
			xtype : 'vehicle_repair',
			iconCls : 'iconsTab tabRepair',
			title : 'Repair'
		}, {
			xtype : 'chart_v_eco_radar',
			iconCls : 'iconsTab tabEco',
			title : 'Eco-Driving'
		}, {
			xtype : 'track',
			iconCls : 'iconsTab tabTrack',
			queryOn : 'vehicle',
			title : 'Track'
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
	}	
});