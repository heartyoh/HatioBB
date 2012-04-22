Ext.define('HatioBB.view.monitor.Info', {
	extend : 'Ext.Panel',
	
	xtype : 'monitor_info',
	
	id : 'monitor_info',
	
	layout : 'fit',
	
	constructor : function(config) {
		config.items = [
			this.buildInfo()
		];

		this.callParent(arguments);
	},
	
	config : {
		scrollable : true
	},
	
	buildInfo : function() {
		return {
			xtype : 'panel',
			html : 'Hello, BB'
		}
	},
	
	setVehicle : function(vehicle) {
		if(!vehicle)
			return;
			
		this.down('panel').setHtml('Hello, ' + vehicle.get('id'));
	}
});