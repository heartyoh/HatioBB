Ext.define('HatioBB.store.DriverGroupStore', {
	extend : 'Ext.data.Store',
	
	config : {
		autoLoad : true,

		pageSize : 1000,

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'id',
			type : 'string'
		}, {
			name : 'desc',
			type : 'string'
		}, {
			name : 'drivers',
			type : 'auto'
		}, {
			name : 'created_at',
			type : 'date',
			dateFormat:'time'
		}, {
			name : 'updated_at',
			type : 'date',
			dateFormat:'time'
		} ],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/driver_group' : 'data/driver_group.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}
});