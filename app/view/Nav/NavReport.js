Ext.define('HatioBB.view.nav.NavReport', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_report',

    requires: ['Ext.dataview.List'],

    config: {
        title: T('title.report_list'),

        disclosure: true,

        store: Ext.create('Ext.data.Store', {
			fields : ['reportId', 'desc'],
			data : [{
				reportId : 'rpt_daily_driving',
				name : T('report.daily_driving_report'),
				desc : T('report.daily_driving_report')
			}, {
				reportId : 'rpt_daily_driving2',
				name : T('report.daily_driving_report') + '-2',
				desc : T('report.daily_driving_report') + '-2'
			}, {
				reportId : 'rpt_daily_habit',
				name : T('report.daily_driving_habit'),
				desc : T('report.daily_driving_habit')
			}, {
				reportId : 'rpt_monthly_driving',
				name : T('report.monthly_driving'),
				desc : T('report.monthly_driving')
			}, {
				reportId : 'rpt_vehicle_health',
				name : T('menu.vehicle_health'),
				desc : T('menu.vehicle_health')
			}, {
				reportId : 'rpt_eco_driving_trend',
				name : T('report.eco_driving_trend'),
				desc : T('report.eco_driving_trend')
			}, {
				reportId : 'rpt_driving_trend',
				name : T('report.driving_trend'),
				desc : T('report.driving_trend')
			}, {
				reportId : 'rpt_effcc_trend',
				name : T('report.effcc_trend'),
				desc : T('report.effcc_trend')
			}, {
				reportId : 'rpt_maint_trend',
				name : T('report.maint_trend'),
				desc : T('report.maint_trend')
			}, {
				reportId : 'rpt_effcc_consmpt',
				name : T('report.effcc_consmpt'),
				desc : T('report.effcc_consmpt')
			}, {
				reportId : 'rpt_habit_ecoindex',
				name : T('report.habit_ecoindex'),
				desc : T('report.habit_ecoindex')
			}]
		}),

        itemTpl: '<div class="iconChart"><strong>{desc}</strong></div>'
    }
});
