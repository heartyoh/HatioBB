Ext.define('HatioBB.store.VehicleMapStore', {
	extend : 'Ext.data.Store',

	config : {
		pageSize : 1000,

		autoLoad : false,

		fields : [ {
			name : 'id',
			type : 'string'
		}, {
			name : 'registration_number',
			type : 'string'
		}, {
			name : 'status',
			type : 'string'
		}, {
			name : 'driver_id',
			type : 'string'
		}, {
			name : 'lattitude',
			type : 'float'
		}, {
			name : 'longitude',
			type : 'float'
		}, {
			name : 'location',
			type : 'string'
		}, {
			name : 'image_clip',
			type : 'string'
		} ],

		proxy : {
			type : 'ajax',
			// url : 'vehicle',
			url : 'data/vehicle_brief',
			extraParams : {
				select : [ 'id', 'registration_number', 'status', 'driver_id', 'lattitude', 'longitude', 'image_clip' ]
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		},

		listeners : {
			load : function(store, data, success) {
				if(success)
					Ext.getStore('VehicleFilteredStore').setData(data);
			}
		}
	}
});