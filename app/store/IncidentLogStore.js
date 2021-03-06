Ext.define('HatioBB.store.IncidentLogStore', {
	extend : 'Ext.data.Store',
	
	config : {
		autoLoad : false,

		pageSize : 1000,
		
		remoteFilter : true,

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'incident',
			type : 'string'
		}, {
			name : 'datetime',
			type : 'date',
			dateFormat:'time'
		}, {
			name : 'terminal_id',
			type : 'string'
		}, {
			name : 'vehicle_id',
			type : 'string'
		}, {
			name : 'driver_id',
			type : 'string'
		}, {
			name : 'lat',
			type : 'float'
		}, {
			name : 'lng',
			type : 'float'
		}, {
			name : 'velocity',
			type : 'float'
		}, {
			name : 'accelate_x',
			type : 'float'
		}, {
			name : 'accelate_y',
			type : 'float'
		}, {
			name : 'accelate_z',
			type : 'float'
		}, {
			name : 'created_at',
			type : 'date',
			dateFormat:'time'
		}, {
			name : 'updated_at',
			type : 'date',
			dateFormat:'time'
		} ],

		sorters : [ {
			property : 'datetime',
			direction : 'ASC'
		} ],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/incident_log' : 'data/incident_log.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}
});