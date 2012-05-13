Ext.define('HatioBB.view.report.PieChart', {
	extend : 'Ext.Carousel',
	
	xtype : 'rpt_pie',
	
	requires: ['Ext.Carousel',
		'Ext.chart.Chart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Pie',
		'Ext.chart.series.Line',
		'Ext.data.JsonStore'],
		
	config : {
	    direction : 'vertical',
		cls : 'grayBg'
	},
	
	constructor : function(config) {
		var store = new Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'data1', 'data2', 'data3', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', 'iphone', 'android', 'ipad'],
		    data: this.generateData(5, 20)
		});
		
		config.items = [
			this.buildChart(store),
			this.buildTable(store)
		];
		
		this.callParent(arguments);
	},

	generateData : function(n, floor) {
	    var data = [],
	        i;

	    floor = (!floor && floor !== 0) ? 20 : floor;

	    for (i = 0; i < (n || 12); i++) {
	        data.push({
	            name: Ext.Date.monthNames[i % 12],
	            data1: Math.floor(Math.max((Math.random() * 100), floor)),
	            data2: Math.floor(Math.max((Math.random() * 100), floor)),
	            data3: Math.floor(Math.max((Math.random() * 100), floor)),
	            2003: Math.floor(Math.max((Math.random() * 100), floor)),
	            2004: Math.floor(Math.max((Math.random() * 100), floor)),
	            2005: Math.floor(Math.max((Math.random() * 100), floor)),
	            2006: Math.floor(Math.max((Math.random() * 100), floor)),
	            2007: Math.floor(Math.max((Math.random() * 100), floor)),
	            2008: Math.floor(Math.max((Math.random() * 100), floor)),
	            2009: Math.floor(Math.max((Math.random() * 100), floor)),
	            2010: Math.floor(Math.max((Math.random() * 100), floor)),
	            iphone: Math.floor(Math.max((Math.random() * 100), floor)),
	            android: Math.floor(Math.max((Math.random() * 100), floor)),
	            ipad: Math.floor(Math.max((Math.random() * 100), floor))
	        });
	    }
	    return data;
	},

	buildChart : function(store) {
		return {
			xtype : 'chart',
            store: store,
            themeCls: 'pie1',
            theme: 'Demo',
            shadow: false,
            animate: true,
			toolbar : null,
            insetPadding: 20,
            legend: {
                position: 'left'
            },
            interactions: [
                {
                    type: 'reset',
                    confirm: true
                },
                {
                    type: 'rotate'
                },
                'itemhighlight',
                {
                    type: 'iteminfo',
                    gesture: 'longpress',
                    listeners: {
                        show: function (interaction, item, panel) {
                            var storeItem = item.storeItem;
                            panel.setHtml(['<ul><li><b>Month: </b>' + storeItem.get('name') + '</li>', '<li><b>Value: </b> ' + storeItem.get('2007') + '</li></ul>'].join(''));
                        }
                    }
                }
            ],
            series: [
                {
                    type: 'pie',
                    field: '2007',
                    showInLegend: true,
                    highlight: false,
                    listeners: {
                        'labelOverflow': function (label, item) {
                            item.useCallout = true;
                        }
                    },
                    // Example to return as soon as styling arrives for callouts
                    callouts: {
                        renderer: function (callout, storeItem) {
                            callout.label.setAttributes({
                                text: storeItem.get('name')
                            }, true);
                        },
                        filter: function () {
                            return false;
                        },
                        box: {
                            //no config here.
                        },
                        lines: {
                            'stroke-width': 2,
                            offsetFromViz: 20
                        },
                        label: {
                            font: 'italic 14px Arial'
                        },
                        styles: {
                            font: '14px Arial'
                        }
                    },
                    label: {
                        field: 'name'
                    }
                }
            ]		};
	},

	buildTable : function(store){
		return {
            xtype : 'panel',
			cls : 'paddingAll15',
			data : store.config.data,
			tpl: [
				'<table class=dataGrid>',
					'<tr>',
						'<th>Name</th>',
						'<th>Data1</th>',
						'<th>Data2</th>',
						'<th>Data3</th>',
						'<th>2003</th>',
						'<th>2004</th>',
						'<th>2005</th>',
						'<th>2006</th>',
						'<th>2007</th>',
						'<th>2008</th>',
						'<th>2009</th>',
						'<th>2010</th>',
						'<th>iPhone</th>',
						'<th>Android</th>',
						'<th>iPad</th>',
					'</tr>',
					'<tpl for=".">',
					'<tr>',
						'<td>{name}</td>',
						'<td>{data1}</td>',
						'<td>{data2}</td>',
						'<td>{data3}</td>',
						'<td>{2003}</td>',
						'<td>{2004}</td>',
						'<td>{2005}</td>',
						'<td>{2006}</td>',
						'<td>{2007}</td>',
						'<td>{2008}</td>',
						'<td>{2009}</td>',
						'<td>{2010}</td>',
						'<td>{iphone}</td>',
						'<td>{android}</td>',
						'<td>{ipad}</td>',
					'</tr>',
					'</tpl>',
				'</table>'
			]	
        };
	}
});
