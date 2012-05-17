Ext.define('HatioBB.view.vehicle.Consumable', {
	extend : 'Ext.Panel',
	
	requires : ['HatioBB.view.chart.vehicle.Consumable'],
	
	xtype : 'vehicle_consumable',
	
	// constructor : function(config) {
	// 	this.callParent(arguments);
	// },
	
	config : {
		layout : 'fit',
		
		items : [{
			xtype : 'chart_v_consumable'
		}]
	}
});