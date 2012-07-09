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
			title : T('label.summary')
		}, {
			xtype : 'chart_d_running',
			iconCls : 'iconsTab tabDrive',
			title : T('label.running')
		}, {
			xtype : 'chart_d_eco_radar',
			iconCls : 'iconsTab tabEco',
			title : T('label.eco_driving')
		}, {
			xtype : 'track',
			iconCls : 'iconsTab tabTrack',
			queryOn : 'driver',
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