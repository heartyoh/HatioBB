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
				name : T('report.daily_driving_report') + '-2',
				desc : T('report.daily_driving_report') + '-2'
			}, {
				reportId : 'dailyreport3',
				name : T('report.daily_driving_habit'),
				desc : T('report.daily_driving_habit')
			}, {
				reportId : 'monthlyreport',
				name : T('report.monthly_driving'),
				desc : T('report.monthly_driving')
			}, {
				reportId : 'chart_v_health',
				name : T('menu.vehicle_health'),
				desc : T('menu.vehicle_health')
			}, {
				reportId : 'ecodrivingreport',
				name : T('report.eco_driving_trend'),
				desc : T('report.eco_driving_trend')
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
				name : T('report.driving_trend'),
				desc : T('report.driving_trend')
			}, {
				reportId : 'efficiencyreport',
				name : T('report.effcc_trend'),
				desc : T('report.effcc_trend')
			}, {
				reportId : 'mainttrendreport',
				name : T('report.maint_trend'),
				desc : T('report.maint_trend')
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
