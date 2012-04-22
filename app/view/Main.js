Ext.define('HatioBB.view.Main', {
    extend: 'Ext.Container',

    xtype: 'main',

    requires: [
    'Ext.navigation.View',
    'Ext.navigation.Bar',
    'HatioBB.view.Nav',
    'HatioBB.view.Content',
	'HatioBB.view.Header',
	'HatioBB.view.monitor.Map',
	'HatioBB.view.monitor.Info',
	'HatioBB.view.monitor.Incident'
    ],

	constructor : function(config) {
		config = config || {};
		config.items = this.buildItems();
		
		this.callParent([config]);
		
		var self = this;
		
		HatioBB.setting.on('dockPosition', function(value) {
			Ext.getCmp('nav').setDocked(HatioBB.setting.get('dockPosition')).show();
		});
	},

	buildItems : function() {
        return [
        {
            id: 'nav',
			cls : 'nav',
            xtype: 'nav',
            docked: HatioBB.setting.get('dockPosition'),
            width: 255
        },
        {
            id: 'content',
            xtype: 'content'
        }
        ]
	},
	
    config: {
        fullscreen: true,

        layout: {
            type: 'card'
        }
    }
});