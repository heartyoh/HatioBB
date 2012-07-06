Ext.define('HatioBB.store.EfficiencyReportStore', {
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
			name : 'effcc',
			type : 'float'
		}, {
			name : 'consmpt',
			type : 'float'
		}, {
			name : 'yearmonth',
			type : 'string'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/efficiency_report.json',
			extraParams : {
				id : 'fuel',
				type : 'effcc_trend',
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