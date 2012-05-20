Ext.define('HatioBB.store.YearStore', {
	extend : 'Ext.data.Store',
	
	config : {
		fields : [ 'year' ],
		data : []
	},
	
	constructor : function(config) {
		var thisYear = new Date().getFullYear();
		config.data = config.data || [];

		for(var i = 0;i < 10;i++) {
			config.data.push({ year : thisYear - i });
		}

		this.callParent(arguments);
	}
});