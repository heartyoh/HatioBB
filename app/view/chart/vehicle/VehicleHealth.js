Ext.define('HatioBB.view.chart.vehicle.VehicleHealth', {
	extend : 'Ext.Panel',
	
	xtype : 'chart_v_health',
	
	requires: [
		'Ext.chart.Chart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Pie'
	],
		
	config : {
		title : T('title.vehicle_health'),
		cls : 'grayBg',
		layout : 'fit'
	},

	constructor : function(config) {
		var self = this;
		
		config.items = [
			this.buildChart()
		];
		
		this.callParent(arguments);

		var dashboardStore = Ext.getStore('DashboardVehicleStore');

		dashboardStore.load({
			scope : this,
			callback: function(records, operation, success) {
				var data = [];
				for(var i = 0 ; i < records.length ; i++) {
					if(records[i].data.name === 'health') {
						data = records[i].get('summary');
						break;
					}
				}

				self.down('chart').getStore().setData(data);
			}
		});		
	},

	buildChart : function() {
		return {
			xtype : 'chart',
		    themeCls: 'pie1',
		    theme: 'Demo',
		    // theme: 'Base:gradients',
		    shadow: true,
		    animate: true,
			toolbar : null,
		    insetPadding: 20,
		    legend: {
		        position: 'left',
		        labelFont : '10px',
		        boxStroke : '#cfcfcf'
		    },

		    store: Ext.create('Ext.data.JsonStore', {
			    fields: ['name', 'value'],
				data : []
			}),

		    series: [{
		        type: 'pie',
		        field: 'value',
		        showInLegend: true,
		        donut: false,
		        tips: {
		          trackMouse: true,
		          width: 140,
		          height: 25,
		          renderer: function(storeItem, item) {
		        	  // calculate percentage.
		        	  var total = 0;
		        	  store.each(function(rec) {
		        		  total += rec.get(idx);
		        	  });
		        	  var name = storeItem.get('name');
		        	  var count = storeItem.get('value');
		        	  var percent = Math.round(count / total * 100);
		        	  this.setTitle(name + ' : ' + count + '(' + percent + '%)');
		          }
		        },
		        highlight: {
		          segment: {
		            margin: 20
		          }
		        },
		        label: {
		            field: 'name',
		            display: 'rotate',
		            contrast: true,
		            font: '14px Arial'
		        }
		    }]
		}
	}

});
