Ext.define('HatioBB.controller.Report', {
    extend: 'Ext.app.Controller',

	requires : [ 
		'HatioBB.view.report.DailyReport',
		'HatioBB.view.report.DailyReport2',
		'HatioBB.view.report.DailyReport3',
		'HatioBB.view.report.MonthlyReport',
		'HatioBB.view.report.VehicleHealth',
		'HatioBB.view.report.EfficiencyReport',
		'HatioBB.view.report.EcoDrivingReport',
		'HatioBB.view.report.DrivingReport',
		'HatioBB.view.report.EffccConsumptionReport',
		'HatioBB.view.report.EcoDrivingHabitReport',
		'HatioBB.view.report.MaintTrendReport'
	 ],

    config: {
        refs: {
			content : 'content',
			header : 'header',
			navReport :'nav_report'
        },
        control: {
            'nav_report' : {
                itemtap: 'onItemTap'
            }
        }
    },

    onItemTap: function(view, index, target, record) {
        this.showReport(record.get('reportId'));
    },

	showReport : function(report) {
		var view = this.getContent().getComponent(report);
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : report
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().clearActiveStatus();
		
		return view;
	}
});