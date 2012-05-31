Ext.define('HatioBB.store.DashboardConsumableStore', {
	extend : 'Ext.data.Store',

	config : {
		storeId : 'dashboard_consumable_store',

		fields : [ 
			{
				name : 'consumable',
				type : 'string'
			}, {
				name : 'summary',
				type : 'auto'
			}	
		],

		pageSize : 1000,

		proxy : {
			type : 'ajax',
			// url : 'dashboard/health/consumable',
			url : 'data/dashboard/health/consumable.json',
			extraParams : {
			},
			reader : {
				type : 'json',
				rootProperty : 'items'
			}
		}
	}
});