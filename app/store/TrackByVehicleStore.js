Ext.define('HatioBB.store.TrackByVehicleStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'vehicle_id',
			type : 'string'
		}, {
			name : 'driver_id',
			type : 'string'
		}, {
			name : 'lattitude',
			type : 'number'
		}, {
			name : 'longitude',
			type : 'number'
		}, {
			name : 'created_at',
			type : 'date',
			dateFormat : 'time'
		} ],

		sorters : [ {
			property : 'datetime',
			direction : 'DESC'
		} ],

		proxy : {
			type : 'ajax',
			// url : 'track',
			url : 'data/track.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}
});