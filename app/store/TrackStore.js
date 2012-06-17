Ext.define('HatioBB.store.TrackStore', {
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
			name : 'lat',
			type : 'number'
		}, {
			name : 'lng',
			type : 'number'
		}, {
			name : 'datetime',
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
			url : window.location.pathname.indexOf('/m/') === 0 ? '/track' : 'data/track.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}
});