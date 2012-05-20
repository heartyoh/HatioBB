Ext.define('HatioBB.view.vehicle.Summary', {
	extend : 'Ext.Panel',
	
	// requires : ['HatioBB.view.chart.vehicle.EchoRadar'],

	xtype : 'vehicle_summary',
	
	constructor : function(config) {
		this.callParent(arguments);
	},
	
	config : {
		layout : 'fit',
		
		items : [{
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