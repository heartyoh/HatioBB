Ext.define('HatioBB.store.RecentIncidentStore', {
	extend : 'Ext.data.Store',
	
	config : {
		autoLoad : false,

		pageSize : 5,

        fields: [{
            name: 'key',
            type: 'string'
        },
        {
            name: 'datetime',
            type: 'date',
            dateFormat: 'time'
        },
        {
            name: 'terminal_id',
            type: 'string'
        },
        {
            name: 'vehicle_id',
            type: 'string'
        },
        {
            name: 'driver_id',
            type: 'string'
        },
        {
            name: 'lattitude',
            type: 'float'
        },
        {
            name: 'longitude',
            type: 'float'
        },
        {
            name: 'velocity',
            type: 'float'
        },
        {
            name: 'impulse_abs',
            type: 'float'
        },
        {
            name: 'impulse_x',
            type: 'float'
        },
        {
            name: 'impulse_y',
            type: 'float'
        },
        {
            name: 'impulse_z',
            type: 'float'
        },
        {
            name: 'impulse_threshold',
            type: 'float'
        },
        {
            name: 'obd_connected',
            type: 'boolean'
        },
        {
            name: 'confirm',
            type: 'boolean'
        },
        {
            name: 'engine_temp',
            type: 'float'
        },
        {
            name: 'engine_temp_threshold',
            type: 'float'
        },
        {
            name: 'video_clip',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date',
            dateFormat: 'time'
        },
        {
            name: 'updated_at',
            type: 'date',
            dateFormat: 'time'
        }],

		sorters : [ {
			property : 'datetime',
			direction : 'DESC'
		} ],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/incident' : 'data/incident.json',
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