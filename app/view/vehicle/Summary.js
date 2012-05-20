Ext.define('HatioBB.view.vehicle.Summary', {
	extend : 'Ext.Panel',
	
	// requires : ['HatioBB.view.chart.vehicle.EchoRadar'],

	xtype : 'vehicle_summary',
	
	constructor : function(config) {
		this.callParent(arguments);
	},
	
	config : {
		layout : 'fit',
		
		items : [{
		}]
	},
	
	buildSettings : function() {
		return [{
            xtype: 'selectfield',
            label: T('label.fromYear'),
            name: 'fromYear',
            valueField: 'year',
            displayField: 'year',
			value : HatioBB.setting.get('fromYear'),
			listeners : {
				change : function(field, newVal) {
					HatioBB.setting.set('fromYear', newVal);
				}
			},
            store: 'YearStore'
		}, {
			xtype : 'selectfield',
			label : T('label.summaryType'),
			name : 'summaryType',
			valueField : 'type',
			displayField : 'display',
			value : HatioBB.setting.get('summaryType'),
			listeners : {
				change : function(field, newVal) {
					HatioBB.setting.set('summaryType', newVal);
				}
			},
			store : {
                data: [{
                    type: 'BarChart',
                    display: T('label.barchart')
                },
                {
                    type: 'ColumnChart',
                    display: T('label.columnchart')
                },
                {
                    type: 'RadarChart',
                    display: T('label.radarchart')
                },
                {
                    type: 'LineChart',
                    display: T('label.linechart')
                },
                {
                    value: 30,
                    display: '30' + T('label.second_s')
                },
                {
                    value: 60,
                    display: '1' + T('label.minute_s')
                },
                {
                    value: 300,
                    display: '5' + T('label.minute_s')
                }]
            }
		}]
	}
});