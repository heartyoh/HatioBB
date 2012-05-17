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

		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
		});
	},

	getChart : function() {
		/* chart 가 문제가 없을 때까지는 아래처럼 해야한다. */
		if(!this.chart)
			this.chart = this.getAt(0);
		return this.chart;
	},
	
	refresh : function(store, records) {
		console.log('refresh called');
		var self = this;
		var store = Ext.getStore('VehicleConsumableStore');
		
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
			
		this.vehicle = HatioBB.setting.get('vehicle');
		
		store.filter('vehicle_id', this.vehicle);
		store.load(function(records) {
			self.getChart().getStore().setData(records);
		});
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
						0.9: {
							color: 'rgb(180, 216, 42)'
						},
                        1: {
                            color: 'rgb(117, 14, 14)'
                        }
                    }
                }
            ],
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['health_rate'],
                    minimum: 0,
                    maximum: 1,
                    label: {
                        renderer: function (v) {
                            return v.toFixed(0);
                        }
                    },
                    title: 'Health Rate'
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['consumable_item'],
                    title: 'Consumable Item'
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
                        field: 'status'
                    },
                    xField: 'consumable_item',
                    yField: 'health_rate'
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
