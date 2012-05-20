Ext.define('HatioBB.view.Setting', {
    extend: 'Ext.form.Panel',

    xtype: 'setting',

	constructor : function(config) {
		config.items = this.buildItems();
		
		this.callParent(arguments);
	},
	
	destroy : function() {
		// TODO 자동으로 사라지게 하는 방법?
		console.log('destroied');
		this.callParent(arguments);
	},
	
	buildItems : function() {
		return [{
			xtype : 'fieldset',
			title : 'System Setting',
			items : [{
	            xtype: 'toolbar',
	            title: T('label.setting'),
	            docked: 'top'
	        },
	        {
	            xtype: 'togglefield',
	            label: T('label.autofit'),
	            name: 'autofit',
	            value: HatioBB.setting.get('autofit'),
				listeners : {
					change : function(field, thumb, newVal) {
						HatioBB.setting.set(field.getName(), !!newVal);
					}
				}
	        },
	        {
	            xtype: 'selectfield',
	            label: T('label.refreshterm'),
	            name: 'refreshTerm',
	            valueField: 'value',
	            displayField: 'display',
				value : HatioBB.setting.get('refreshTerm'),
				listeners : {
					change : function(field, newVal) {
						HatioBB.setting.set(field.getName(), newVal);
					}
				},
	            store: {
	                data: [{
	                    value: -1,
	                    display: T('label.refresh_none')
	                },
	                {
	                    value: 3,
	                    display: '3' + T('label.second_s')
	                },
	                {
	                    value: 5,
	                    display: '5' + T('label.second_s')
	                },
	                {
	                    value: 10,
	                    display: '10' + T('label.second_s')
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
	        },
	        {
	            xtype: 'selectfield',
	            label: T('label.dockPosition'),
	            name: 'dockPosition',
	            valueField: 'value',
	            displayField: 'display',
				value : HatioBB.setting.get('dockPosition'),
				listeners : {
					change : function(field, newVal) {
						HatioBB.setting.set(field.getName(), newVal);
					}
				},
	            store: {
	                data: [{
	                    value: 'left',
	                    display: T('label.left')
	                },
	                {
	                    value: 'right',
	                    display: T('label.right')
	                }]
	            }
	        }]
		}, 
		this.buildByScreen()
		]
	},
	
	buildByScreen : function() {
		var cont = Ext.getCmp('content');
		var comp;
		
		while(cont && typeof(cont.getActiveItem) === 'function') {
			var idx = cont.getActiveItem();
			if(idx < 0)
				break;
			console.log(idx);
			comp = cont.getAt(idx);
			console.log(comp);
			cont = comp;
		}

		return {
			xtype : 'fieldset',
			title : 'By Screen'
		}
	},
	
    config: {
        left: 0,
        top: 0,

        modal: true,

		showAnimation : 'fadeIn',
        hideOnMaskTap: true,
		hideAnimation : 'fadeOut',
        // hidden: true,

        width: 400,
        height: 400,
        scrollable: true
    }
});