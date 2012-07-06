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
				name : T('report.daily_driving_report'),
				desc : T('report.daily_driving_report')
			}, {
				reportId : 'dailyreport2',
				name : T('report.daily_driving_report'),
				desc : T('report.daily_driving_report')
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
				name : T('menu.vehicle_health'),
				desc : T('menu.vehicle_health')
			}, {
				reportId : 'ecodrivingreport',
				name : 'Ecodriving Report',
				desc : 'Ecodriving Report'
			}, {
				reportId : 'effccconsumptionreport',
				name : T('report.effcc_consmpt'),
				desc : T('report.effcc_consmpt')
			}, {
				reportId : 'ecodrivinghabitreport',
				name : T('report.habit_ecoindex'),
				desc : T('report.habit_ecoindex')
			}, {
				reportId : 'drivingreport',
				name : 'Driving Report',
				desc : 'Driving Report'
			}, {
				reportId : 'efficiencyreport',
				name : T('report.effcc_trend'),
				desc : T('report.effcc_trend')
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
