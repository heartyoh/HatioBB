Ext.define('HatioBB.store.VehicleGroupStore', {
	extend : 'Ext.data.Store',

	config : {
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
			name : 'vehicles',
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
			// url : 'vehicle_group',
			url : 'data/vehicle_group.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}
});