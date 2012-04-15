Ext.define('HatioBB.store.DriverBriefStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : true,

		pageSize : 1000,

		fields : [ {
			name : 'name',
			type : 'string'
		}, {
			name : 'id',
			type : 'string'
		}, {
			name : 'image_clip',
			type : 'string'
		} ],

		proxy : {
			type : 'ajax',
			// url : 'driver',
			url : 'data/driver_brief.json',
			extraParams : {
				select : [ 'id', 'name', 'image_clip' ]
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}		
	}

});