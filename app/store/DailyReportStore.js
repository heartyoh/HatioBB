Ext.define('HatioBB.store.DailyReportStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'driving',
			type : 'auto'
		}, {
			name : 'maint',
			type : 'auto'
		}, {
			name : 'consumable',
			type : 'auto'
		} ],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/daily_report.json',
			extraParams : {
				id : 'daily_driving_log'
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total'
			}
		}
	}

});