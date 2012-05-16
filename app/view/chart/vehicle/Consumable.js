Ext.define('HatioBB.view.chart.vehicle.Consumable', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_v_consumable',
	
	requires: [
	'Ext.chart.Chart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category',
	'Ext.chart.series.Column',
	],
		
	config : {
		title : T('title.chart_v_consumable'),
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		this.callParent(arguments);	
		
		var chart = this.add(this.buildChart());

		Ext.getStore('IncidentLogStore').on('load', this.refresh, this);
	},

	destroy : function() {
		Ext.getStore('IncidentLogStore').un('load', this.refresh, this);
		
		this.callParent(arguments);
	},
	
	refresh : function(store, records) {
		chart.getStore().setData(records);
	},
	
	buildChart : function(store) {
		var store = new Ext.create('Ext.data.JsonStore', {
		    fields: ['consumable_item', 'health_rate', 'repl_unit', 'status', 'next_repl_mileage', 'miles_since_last_repl', 'repl_mileage', 'accrued_cost', 'repl_time', 'miles_last_repl'],
		    data: []
		});
		
		return {
			xtype : 'chart',
			store : store,
            themeCls: 'column1',
            animate: {
                easing: 'bounceOut',
                duration: 750
            },
            shadow: false,
			toolbar : null,
            gradients: [
                {
                    'id': 'v',
                    'angle': 0,
                    stops: {
                        0: {
                            color: 'rgb(212, 40, 40)'
                        },
						90: {
							color: 'rgb(180, 216, 42)'
						},
                        100: {
                            color: 'rgb(117, 14, 14)'
                        }
                    }
                }
            ],
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['2009'],
                    minimum: 0,
                    maximum: 100,
                    label: {
                        renderer: function (v) {
                            return v.toFixed(0);
                        }
                    },
                    title: 'Number of Hits'
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Month of the Year'
                }
            ],
            series: [
                {
                    type: 'column',
                    axis: 'left',
                    highlight: true,
                    renderer: function (sprite, storeItem, barAttr, i, store) {
                        barAttr.fill = "url(#v)";
                        return barAttr;
                    },
                    label: {
                        field: '2009'
                    },
                    xField: 'name',
                    yField: '2009'
                }
            // ],
            // interactions: [
            //     {
            //         type: 'panzoom',
            //         axes: ['bottom']
            //     }
            ]
		};	
	}
});
