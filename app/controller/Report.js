Ext.define('HatioBB.controller.Report', {
    extend: 'Ext.app.Controller',

	requires : [ 
		'HatioBB.view.report.AreaChart',
		'HatioBB.view.report.BarChart',
		'HatioBB.view.report.ColumnChart',
		'HatioBB.view.report.LineChart',
		'HatioBB.view.report.PieChart'
	 ],

    config: {
        refs: {
			content : '#content',
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
		if(!view)
			view = this.getContent().add({
				xtype : report
			});
		this.getContent().setActiveItem(view);
		
		return view;
	}
});