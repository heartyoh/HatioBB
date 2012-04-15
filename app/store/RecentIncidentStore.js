Ext.define('HatioBB.store.RecentIncidentStore', {
	extend : 'Ext.data.Store',
	
	config : {
		autoLoad : false,

		pageSize : 5,

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'datetime',
			type : 'date',
			dateFormat : 'time'
		}, {
			name : 'driver_id',
			type : 'string'
		}, {
			name : 'vehicle_id',
			type : 'string'
		}, {
			name : 'lattitude',
			type : 'float'
		}, {
			name : 'longitude',
			type : 'float'
		}, {
			name : 'impulse_abs',
			type : 'float'
		}, {
			name : 'engine_temp',
			type : 'float'
		}, {
			name : 'video_clip',
			type : 'string'
		}, {
			name : 'created_at',
			type : 'date',
			dateFormat : 'time'
		}, {
			name : 'updated_at',
			type : 'date',
			dateFormat : 'time'
		} ],

		sorters : [ {
			property : 'datetime',
			direction : 'DESC'
		} ],

		proxy : {
			type : 'ajax',
			// url : 'incident',
			url : 'data/incident.json',
			extraParams : {
				confirm : false
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
		
	}

});