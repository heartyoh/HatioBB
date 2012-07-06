Ext.define('HatioBB.view.nav.NavReport', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_report',

    requires: [
    'Ext.dataview.List',
	'HatioBB.view.chart.vehicle.VehicleHealth'
    ],

    config: {
        title: T('title.report_list'),

        disclosure: true,

        store: Ext.create('Ext.data.Store', {
			fields : ['reportId', 'desc'],
			data : [{
				reportId : 'dailyreport',
				name : 'Daily Report',
				desc : 'Daily Report'
			}, {
				reportId : 'dailyreport2',
				name : 'Daily Report2',
				desc : 'Daily Report2'
			}, {
				reportId : 'dailyreport3',
				name : 'Daily Report3',
				desc : 'Daily Report3'
			}, {
				reportId : 'monthlyreport',
				name : 'Monthly Report',
				desc : 'Monthly Report'
			}, {
				reportId : 'chart_v_health',
				name : 'Vehicle Health Report',
				desc : 'Vehicle Health Report'
			}, {
				reportId : 'ecodrivingreport',
				name : '에코 드라이빙',
				desc : '에코 드라이빙'
			}, {
				reportId : 'effccconsumptionreport',
				name : '연비-소모량 관계',
				desc : '연비-소모량 관계'
			}, {
				reportId : 'ecodrivinghabitreport',
				name : '운전습관-Eco지수관계',
				desc : '운전습관-Eco지수관계'
			}, {
				reportId : 'drivingreport',
				name : 'Driving Report',
				desc : 'Driving Report'
			}, {
				reportId : 'efficiencyreport',
				name : '연비추이',
				desc : '연비추이'
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
