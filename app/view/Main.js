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

    config: {
        fullscreen: true,

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 250
            }
        },

        items: [
        {
            id: 'nav',
			cls : 'nav',
            xtype: 'nav',
            docked: 'left',
            width: 255
        },
        {
            id: 'content',
            xtype: 'content'
        }
        ]
    }
});