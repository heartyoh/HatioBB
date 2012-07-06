Ext.define('HatioBB.store.DrivingReportStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'year',
			type : 'int'
		}, {
			name : 'month',
			type : 'int'
		}, {
			name : 'run_dist',
			type : 'float'
		}, {
			name : 'run_time',
			type : 'float'
		}, {
			name : 'yearmonth',
			type : 'string'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/driving_report.json',
			extraParams : {
				id : 'driving',
				duration : '12'
			},
			reader : {
				type : 'json',
				rootProperty : 'items',
				totalProperty : 'total',
				successProperty : 'success'
			}
		}
	}

});