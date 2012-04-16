Ext.define('HatioBB.view.monitor.Incident', {
	extend : 'Ext.Panel',
	
	xtype : 'monitor_incident',
	
	id : 'monitor_incident',
	
	config : {
		scrollable : true,

		html : 'Incident Detail Viewer'
	},
	
	constructor : function(config) {
		alert(config);

		this.callParent(arguments);
	}
});