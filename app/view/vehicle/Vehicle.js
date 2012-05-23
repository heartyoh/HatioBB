Ext.define('HatioBB.view.vehicle.Vehicle', {
	extend : 'Ext.tab.Panel',
	
	requires : [
	'HatioBB.view.vehicle.Info',
	'HatioBB.view.chart.vehicle.Summary',
	'HatioBB.view.chart.vehicle.Consumable',
	'HatioBB.view.vehicle.Repair',
	'HatioBB.view.chart.vehicle.EchoRadar'
	],
	
	xtype : 'vehicle',
	
	id : 'vehicle',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'vehicle_info',
			iconCls : 'iconsTab tabSummary',
			title : 'Info'
		}, {
			xtype : 'chart_v_summary',
			iconCls : 'iconsTab tabDrive',
			title : 'Summary'
		}, {
			xtype : 'chart_v_consumable',
			iconCls : 'iconsTab tabConsumable',
			title : 'Consumable'
		}, {
			xtype : 'vehicle_repair',
			iconCls : 'iconsTab tabRepair',
			title : 'Repair'
		}, {
			xtype : 'chart_v_echo_radar',
			iconCls : 'iconsTab tabEcho',
			title : 'Echo Driving'
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