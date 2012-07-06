Ext.define('HatioBB.store.EcoDrivingHabitReportStore', {
	extend : 'Ext.data.Store',

	config : {
		autoLoad : false,

		fields : [ {
			name : 'eco_index',
			type : 'int'
		}, {
			name : 'sud_cnt',
			type : 'int'
		}],

		proxy : {
			type : 'ajax',
			url : window.location.pathname.indexOf('/m/') === 0 ? '/report/service' : 'data/eco_driving_habit_report.json',
			extraParams : {
				id : 'eco',
				type : 'habit_ecoindex',
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