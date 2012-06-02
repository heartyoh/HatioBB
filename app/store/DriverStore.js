Ext.define('HatioBB.store.DriverStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		remoteFilter : true,

		pageSize : 1,

		fields : [ {
			name : 'key',
			type : 'string'
		}, {
			name : 'name',
			type : 'string'
		}, {
			name : 'id',
			type : 'string'
		}, {
			name : 'division',
			type : 'string'
		}, {
			name : 'title',
			type : 'string'
		}, {
			name : 'social_id',
			type : 'string'
		}, {
			name : 'phone_no_1',
			type : 'string'
		}, {
			name : 'phone_no_2',
			type : 'string'
		}, {
			name : 'image_clip',
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
			url : window.location.pathname.indexOf('/m/') === 0 ? '/driver' : 'data/driver.json',
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}		
	}

});