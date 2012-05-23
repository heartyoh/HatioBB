Ext.define('HatioBB.view.driver.Driver', {
	extend : 'Ext.tab.Panel',
	
	requires : [
	'HatioBB.view.driver.Info',
	'HatioBB.view.chart.driver.EchoRadar'
	],
	
	xtype : 'driver',
	
	id : 'driver',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'driver_info',
			iconCls : 'iconsTab tabSummary',
			title : 'Info'
		}, {
			xtype : 'chart_d_echo_radar',
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