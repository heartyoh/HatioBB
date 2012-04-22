Ext.define('HatioBB.store.VehicleBriefStore', {
	extend : 'Ext.data.Store',
	
	config : {
		autoLoad : true,

		pageSize : 1000,

		fields : [ {
			name : 'id',
			type : 'string'
		}, {
			name : 'registration_number',
			type : 'string'
		}, {
			name : 'image_clip',
			type : 'string'
		} ],

		proxy : {
			type : 'ajax',
			// url : 'vehicle',
			url : 'data/vehicle.json',
			extraParams : {
				select : [ 'id', 'registration_number', 'image_clip' ]
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}
});