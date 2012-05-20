Ext.define('HatioBB.view.vehicle.Summary', {
	extend : 'Ext.Panel',
	
	// requires : ['HatioBB.view.chart.vehicle.EchoRadar'],

	xtype : 'vehicle_summary',
	
	constructor : function(config) {
		this.callParent(arguments);
		
		this.down('[name=fromYear]').setValue(HatioBB.setting.get('fromYear'));
	},
	
	config : {
		layout : 'fit',
		
		items : [{
            xtype: 'selectfield',
            label: T('label.fromYear'),
            name: 'fromYear',
            valueField: 'year',
            displayField: 'year',
			listeners : {
				change : function(field, newVal) {
					HatioBB.setting.set('fromYear', newVal);
				}
			},
            store: 'YearStore'
		}]
	}
});