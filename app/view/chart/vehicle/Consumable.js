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
	
	refresh : function() {
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
			
		var self = this;		
		this.vehicle = HatioBB.setting.get('vehicle');
		
		var store = Ext.getStore('VehicleConsumableStore');
		
		this.vehicle = HatioBB.setting.get('vehicle');
		
		store.load({
			params : {
				vehicle_id : this.vehicle
			},
			callback : function(records) {
				self.getChart().getStore().setData(records);
			}
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
            gradients: [ {
				'id': 'overdue',
				'angle': 0,
				stops: {
					0: {
						color: 'rgb(212, 40, 40)'
					},
					70: {
						color: 'rgb(212, 216, 42)'
					},
					100: {
						color: 'rgb(14, 117, 14)'
					}
				}
			}, {
				'id': 'impending',
				'angle': 0,
				stops: {
					0: {
						color: 'rgb(242, 176, 40)'
					},
					20: {
						color: 'rgb(212, 216, 42)'
					},
					100: {
						color: 'rgb(14, 117, 14)'
					}
				}
			}, {
				'id': 'healthy',
				'angle': 0,
				stops: {
					100: {
						color: 'rgb(14, 117, 14)'
					}
				}
			} ],
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['health_rate'],
					grid : {
						stroke : '#ccc'
					},
                    // minimum: 0,
                    // maximum: 1,
                    label: {
                        renderer: function (v) {
                            return Math.floor(v * 100);
                        }
                    },
                    title: 'Health Rate',
					majorTickSteps : 10
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['consumable_item'],
                    title: 'Consumable Item',
					label: {
				        rotate: {
				            degrees: 315
				        }
				    }
                }
            ],
            series: [
                {
                    type: 'column',
                    axis: 'left',
                    highlight: true,
                    renderer: function (sprite, storeItem, barAttr, i, store) {
						var health_rate = storeItem.get('health_rate');
						if(health_rate > 1) {
	                        barAttr.fill = "url(#overdue)";
						} else if(health_rate > 0.9) {
	                        barAttr.fill = "url(#impending)";
						} else {
	                        barAttr.fill = "url(#healthy)";
						}

                        return barAttr;
                    },
					listeners : {
						itemtap : function(series, item) {
							;
						}
					},
                    label: {
						display: 'outside',
						'text-anchor': 'middle',
                        // field: 'health_rate',
                        field: 'status',
						orientation: 'horizontal',
						color: '#333',
						// renderer: function (v) {
						//                             return Math.floor(v.toFixed(1) * 100);
						//                         }
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
