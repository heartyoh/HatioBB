Ext.define('HatioBB.view.chart.driver.Running', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_d_running',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category'
	],
		
	config : {
		title : T('title.chart_d_running'),
		cls : 'grayBg',
		layout : {
			type : 'vbox',
			align : 'stretch'
		}
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
		this.chartStore = Ext.create('Ext.data.JsonStore', {
			fields : ['year', 'month', 'consmpt', 'oos_cnt', 'co2_emss', 'mnt_time', 'mnt_cnt', 'run_dist', 'run_time', 'effcc'],
			data : []
		});

		this.add(this.buildRunChart(this.chartStore));
		this.add(this.buildFuelChart(this.chartStore));
		
		this.on('painted', function() {
			HatioBB.setting.on('driver', this.refresh, this);
			HatioBB.setting.on('fromYear', this.refresh, this);
			
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('driver', this.refresh, this);
			HatioBB.setting.un('fromYear', this.refresh, this);
		});
	},

	getChart : function() {
		/* chart 가 문제가 없을 때까지는 아래처럼 해야한다. */
		if(!this.chart)
			this.chart = this.getAt(0);
		return this.chart;
	},
	
	refresh : function(store, records) {
		if(HatioBB.setting.get('driver') === this.driver
		&& HatioBB.setting.get('fromYear') === this.fromYear) 
			return;
			
		var self = this;
		var store = Ext.getStore('DriverRunStore');
		
		var thisYear = new Date().getFullYear();
		var thisMonth = new Date().getMonth() + 1;
		this.driver = HatioBB.setting.get('driver');
		this.fromYear = HatioBB.setting.get('fromYear') || (thisYear - 1);
		
		/* filter로 하지 않고, 파라미터로 해야 함 */
		var proxy = store.getProxy();
		proxy.config.extraParams.driver = this.driver;
		proxy.config.extraParams.from_year = this.fromYear;
		proxy.config.extraParams.to_year = thisYear;
		proxy.config.extraParams.from_month = 1;
		proxy.config.extraParams.to_month = thisMonth;
		
		store.load(function(records) {
			self.chartStore.setData(records);
		});
	},
	
	buildRunChart : function(store) {
		return {
			xtype : 'chart',
			store : store,
            animate: true,
            shadow: false,
			toolbar : null,
			flex : 1,
            legend: {
                position: {
                    portrait: 'bottom',
                    landscape: 'bottom'
                },
                labelFont: '17px Arial'
            },
            axes: [
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['month_str'],
                    title: 'Month of the Year'
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['run_time'],
                    title: 'Run Minutes',
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['run_dist'],
                    title: 'Run Distance',
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'column',
                highlight: {
                    size: 7,
                    radius: 7
                },
                fill: true,
                smooth: true,
                axis: 'left',
                xField: 'month_str',
                yField: 'run_time',
                title: 'Run Minutes'
            },
            {
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                fill: true,
                smooth: true,
                axis: 'right',
                xField: 'month_str',
                yField: 'run_dist',
                title: 'Run Distance'
            }
            ]
		};
	},
	
	buildFuelChart : function(store) {
		return {
			xtype : 'chart',
			store : store,
            animate: true,
            shadow: false,
			toolbar : null,
			flex : 1,
            legend: {
                position: {
                    portrait: 'bottom',
                    landscape: 'bottom'
                },
                labelFont: '17px Arial'
            },
            axes: [
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['month_str'],
                    title: 'Month of the Year'
                },
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['consmpt'],
                    title: 'Fuel Consumption',
                    minimum: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['effcc'],
                    title: 'Fuel Efficiency',
                    minimum: 0
                }
            ],
            series: [
            {
                type: 'column',
                highlight: {
                    size: 7,
                    radius: 7
                },
                // fill: true,
                smooth: true,
                axis: 'left',
                xField: 'month_str',
                yField: ['consmpt'],
                title: 'Fuel Consumption'
            }, {
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                fill: true,
                smooth: true,
                axis: 'right',
                xField: 'month_str',
                yField: 'effcc',
                title: 'Fuel Efficiency'
            }
            ]
		};
	}	
});