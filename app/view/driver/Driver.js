Ext.define('HatioBB.view.driver.Driver', {
	extend : 'Ext.tab.Panel',
	
	requires : [
	'HatioBB.view.driver.Summary',
	'HatioBB.view.chart.driver.Running',
	'HatioBB.view.chart.driver.EcoRadar',
	'HatioBB.view.monitor.Track'
	],
	
	xtype : 'driver',
	
	id : 'driver',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'driver_summary',
			iconCls : 'iconsTab tabSummary',
			title : 'Summary'
		}, {
			xtype : 'chart_d_running',
			iconCls : 'iconsTab tabDrive',
			title : 'Running'
		}, {
			xtype : 'chart_d_eco_radar',
			iconCls : 'iconsTab tabEco',
			title : 'Eco-Driving'
		}, {
			xtype : 'track',
			iconCls : 'iconsTab tabEco',
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