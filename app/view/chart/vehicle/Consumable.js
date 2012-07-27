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
		
		this.refreshPage();
	},
	
	refreshPage : function() {
		var self = this;		
		this.vehicle = HatioBB.setting.get('vehicle');
		var store = Ext.getStore('VehicleConsumableStore');
		this.vehicle = HatioBB.setting.get('vehicle');
		
		store.load({
			params : {
				vehicle_id : this.vehicle
			},
			callback : function(records) {
				Ext.each(records, function(record) {
					record.data.status = T('label.'+ record.data.status);
					record.data.health_rate = record.data.health_rate.toFixed(2);
				});
				
				self.getChart().getStore().setData(records);
			}
		});		
	},
	
	buildChart : function(store) {
		var self = this;
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
                    label: {
                        renderer: function (v) {
                            return Math.floor(v * 100);
                        }
                    },
                    title: T('label.health_rate'),
					majorTickSteps : 10
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['consumable_item'],
                    title: T('label.consumable_item'),
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
                    label: {
						display: 'outside',
						'text-anchor': 'middle',
                        field: 'status',
						orientation: 'horizontal',
						color: '#333'
                    },
                    xField: 'consumable_item',
                    yField: 'health_rate'
                }
            ],
			interactions: [{
			    type: 'iteminfo',
			    gesture: 'tap',
			    listeners: {
			        show: function(interaction, item, panel) {
			            var record = item.storeItem;
						var title = record.data.consumable_item + ' : ' + (record.data.health_rate * 100) + '% (' + record.data.status + ')';
						var msg = record.data.consumable_item + ' ' + T('button.reset') + ' ' + T('msg.confirm_run');
						Ext.Msg.show({
							title : title,
							message : msg,
							buttons: Ext.MessageBox.OKCANCEL,
							animEl: 'elId',
							icon: Ext.MessageBox.QUESTION,
							fn : function(btn) {
								if(btn == "ok") {
									Ext.Msg.confirm(
										T('label.confirm'),
										msg,
										function(answer) {
											if(answer == "yes") {
												self.resetConsumable(record.data.consumable_item);
											}
										});
								}								
							}
						});
			        }
			    }
			}]
		};	
	},
	
	resetConsumable : function(consumableItem) {
		var self = this;
		Ext.Ajax.request({
			url : '/vehicle_consumable/reset',
			method : 'POST',
			params : {
				vehicle_id : this.vehicle,
				consumable_item : consumableItem
			},
			success : function(response) {
				var resultObj = Ext.JSON.decode(response.responseText);
				if (resultObj.success) {
					self.refreshPage();
				} else {
					Ext.Msg.alert(T('label.failure'), resultObj.msg);
				}
			},
			failure : function(response) {
				Ext.Msg.alert(T('label.failure'), response.responseText);
			}
		});
	}
});
