Ext.define('HatioBB.store.VehicleStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,
		
		remoteFilter : true,

		pageSize : 1,

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'id',
			type : 'string'
		}, {
			name : 'registration_number',
			type : 'string'
		}, {
			name : 'manufacturer',
			type : 'string'
		}, {
			name : 'fuel_type',
			type : 'string'
		}, {
			name : 'vehicle_type',
			type : 'string'
		}, {
			name : 'birth_year',
			type : 'int'
		}, {
			name : 'ownership_type',
			type : 'string'
		}, {
			name : 'status',
			type : 'string'
		}, {
			name : 'health_status',
			type : 'string'
		}, {
			name : 'image_clip',
			type : 'string'
		}, {
			name : 'total_distance',
			type : 'float'
		}, {
			name : 'remaining_fuel',
			type : 'float'
		}, {
			name : 'lattitude',
			type : 'float'
		}, {
			name : 'driver_id',
			type : 'string'
		}, {
			name : 'terminal_id',
			type : 'string'
		}, {
			name : 'longitude',
			type : 'float'
		}, {
			name : 'location',
			type : 'string'
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
			url : window.location.pathname.indexOf('/m/') === 0 ? '/vehicle' : 'data/vehicle.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total',
				successProperty : 'success'
			}
		}
	}

});